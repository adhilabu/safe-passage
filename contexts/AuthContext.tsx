import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import { UserProfile } from '../types';
import { DEMO_CREDENTIALS, getDemoUser, findUserByEmail } from '../data/mockUsers';

interface AuthContextType {
    user: User | null;
    profile: UserProfile | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, profileData: Partial<UserProfile>) => Promise<void>;
    signOut: () => Promise<void>;
    updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
    isDemoMode: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [isDemoMode, setIsDemoMode] = useState(!isSupabaseConfigured());

    useEffect(() => {
        // Check if Supabase is configured
        if (!isSupabaseConfigured()) {
            setIsDemoMode(true);
            setLoading(false);
            return;
        }

        // Check active sessions and sets the user
        supabase.auth.getSession()
            .then(({ data: { session } }) => {
                setUser(session?.user ?? null);
                if (session?.user) {
                    loadUserProfile(session.user.id);
                } else {
                    setLoading(false);
                }
            })
            .catch((error) => {
                console.error('Session check failed:', error);
                setLoading(false);
            });

        // Listen for changes on auth state (sign in, sign out, etc.)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                loadUserProfile(session.user.id);
            } else {
                setProfile(null);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const loadUserProfile = async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('user_id', userId)
                .maybeSingle(); // Use maybeSingle() instead of single() to avoid 406 when no rows exist

            if (error) {
                console.error('Profile load error:', error);
                // Create a default profile if none exists
                const defaultProfile: UserProfile = {
                    id: userId,
                    userId: userId,
                    name: 'New User',
                    avatar: '👤',
                    location: '',
                    priorities: [],
                    style: 'Quiet Observer' as any,
                    bio: ''
                };
                setProfile(defaultProfile);
            } else if (data) {
                // Map database columns to UserProfile interface
                const loadedProfile: UserProfile = {
                    ...data,
                    userId: data.user_id, // Map user_id to userId
                    // Ensure other fields are correctly typed if needed
                };
                setProfile(loadedProfile);
            } else {
                // No profile found, create default
                const defaultProfile: UserProfile = {
                    id: userId,
                    userId: userId,
                    name: 'New User',
                    avatar: '👤',
                    location: '',
                    priorities: [],
                    style: 'Quiet Observer' as any,
                    bio: ''
                };
                setProfile(defaultProfile);
            }
        } catch (error) {
            console.error('Unexpected error loading profile:', error);
            // Error loading profile - using default profile
            const defaultProfile: UserProfile = {
                id: userId,
                userId: userId,
                name: 'New User',
                avatar: '👤',
                location: '',
                priorities: [],
                style: 'Quiet Observer' as any,
                bio: ''
            };
            setProfile(defaultProfile);
        } finally {
            setLoading(false);
        }
    };

    const signIn = async (email: string, password: string) => {
        setLoading(true);
        try {
            // Check for demo login in demo mode OR if user enters demo credentials
            if (isDemoMode || (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password)) {
                // Demo mode login
                const demoUser = getDemoUser();
                setProfile(demoUser);
                setUser({ id: demoUser.userId!, email: demoUser.email } as User);
                setIsDemoMode(true);
                return;
            }

            // Real Supabase login - only if configured
            if (!isSupabaseConfigured()) {
                throw new Error('Authentication service not configured. Please use demo account or contact administrator.');
            }

            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            
            if (error) {
                // Provide user-friendly error messages
                if (error.message.includes('Invalid login credentials')) {
                    throw new Error('Invalid email or password. Please check your credentials and try again.');
                } else if (error.message.includes('Email not confirmed')) {
                    throw new Error('Please verify your email address before signing in. Check your inbox for a confirmation link.');
                } else if (error.message.includes('User not found')) {
                    throw new Error('No account found with this email. Please sign up first.');
                } else if (error.message.includes('Too many requests')) {
                    throw new Error('Too many login attempts. Please wait a few minutes and try again.');
                } else {
                    throw new Error(error.message || 'Failed to sign in. Please try again.');
                }
            }

            if (!data.user) {
                throw new Error('Sign in failed. Please try again.');
            }
        } catch (error: any) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const signUp = async (email: string, password: string, profileData: Partial<UserProfile>) => {
        if (isDemoMode) {
            throw new Error('Sign up is not available in demo mode. Please configure Supabase to create an account.');
        }

        if (!isSupabaseConfigured()) {
            throw new Error('Authentication service not configured. Please use demo account or contact administrator.');
        }

        setLoading(true);
        try {
            // Validate password strength
            if (password.length < 6) {
                throw new Error('Password must be at least 6 characters long.');
            }

            const { data, error } = await supabase.auth.signUp({ 
                email, 
                password,
                options: {
                    emailRedirectTo: window.location.origin
                }
            });
            
            if (error) {
                // Provide user-friendly error messages
                if (error.message.includes('User already registered')) {
                    throw new Error('An account with this email already exists. Please sign in instead.');
                } else if (error.message.includes('Password should be')) {
                    throw new Error('Password is too weak. Please use a stronger password with at least 6 characters.');
                } else if (error.message.includes('Invalid email')) {
                    throw new Error('Please enter a valid email address.');
                } else if (error.message.includes('rate limit')) {
                    throw new Error('Too many signup attempts. Please wait a few minutes and try again.');
                } else {
                    throw new Error(error.message || 'Failed to create account. Please try again.');
                }
            }

            if (data.user) {
                // Create profile in database
                const newProfile = {
                    id: data.user.id, // PRIMARY KEY - must match user_id
                    user_id: data.user.id,
                    email: data.user.email,
                    name: profileData.name || 'New User',
                    avatar: profileData.avatar || '👤',
                    location: profileData.location || '',
                    priorities: profileData.priorities || [],
                    style: profileData.style || 'Quiet Observer',
                    bio: profileData.bio || '',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };

                console.log('Creating profile:', newProfile);

                const { data: insertedData, error: profileError } = await supabase
                    .from('profiles')
                    .insert([newProfile])
                    .select();

                if (profileError) {
                    console.error('Profile creation error:', profileError);
                    console.error('Profile error details:', JSON.stringify(profileError, null, 2));
                    
                    if (profileError.code === 'PGRST204') {
                        throw new Error('Database table "profiles" is missing. Please contact administrator.');
                    } else if (profileError.code === '23505') {
                        // Profile already exists - try to fetch it instead
                        console.log('Profile already exists, fetching existing profile...');
                        await loadUserProfile(data.user.id);
                    } else if (profileError.message.includes('schema cache')) {
                        throw new Error('Database schema issue. Please contact administrator to run migrations.');
                    } else {
                        throw new Error(`Failed to create user profile: ${profileError.message}. Please try signing in or contact support.`);
                    }
                } else if (insertedData && insertedData.length > 0) {
                    console.log('Profile created successfully:', insertedData[0]);
                }

                // Explicitly set the profile state to avoid race condition with onAuthStateChange
                setProfile({
                    ...newProfile,
                    id: newProfile.user_id,
                    userId: newProfile.user_id,
                } as UserProfile);

                // Check if email confirmation is required
                if (data.session === null) {
                    throw new Error('Account created! Please check your email to verify your account before signing in.');
                }
            } else {
                throw new Error('Failed to create account. Please try again.');
            }
        } catch (error: any) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const signOut = async () => {
        if (isDemoMode) {
            setUser(null);
            setProfile(null);
            return;
        }

        try {
            const { error } = await supabase.auth.signOut();
            if (error) {
                console.error('Sign out error:', error);
                throw new Error('Failed to sign out. Please try again.');
            }
            setUser(null);
            setProfile(null);
        } catch (error: any) {
            // Even if sign out fails on server, clear local state
            setUser(null);
            setProfile(null);
            throw error;
        }
    };

    const updateProfile = async (updates: Partial<UserProfile>) => {
        if (!profile) {
            throw new Error('No profile found');
        }

        // Only update Supabase if not in demo mode
        if (!isDemoMode && user) {
            try {
                // Filter updates to only match database columns
                const { userId, id, createdAt, updatedAt, ...safeUpdates } = updates as any;

                // Log what we're updating for debugging
                console.log('Updating profile with:', safeUpdates);

                // First, try to update existing profile
                const { data, error } = await supabase
                    .from('profiles')
                    .update({
                        ...safeUpdates,
                        updatedAt: new Date().toISOString()
                    })
                    .eq('user_id', user.id)
                    .select();

                if (error) {
                    console.error('Supabase update error:', error);
                    throw new Error(error.message || 'Failed to update profile in database');
                }

                if (data && data.length > 0) {
                    // Update local state with the data from Supabase
                    const updatedProfile: UserProfile = {
                        ...data[0],
                        userId: data[0].user_id,
                    };
                    setProfile(updatedProfile);
                    console.log('Profile updated successfully:', updatedProfile);
                } else {
                    // No profile found - create one with current data
                    console.log('No profile found, creating new profile...');
                    const newProfile = {
                        id: user.id,
                        user_id: user.id,
                        email: user.email,
                        ...safeUpdates,
                        name: safeUpdates.name || profile.name || 'New User',
                        avatar: safeUpdates.avatar || profile.avatar || '👤',
                        location: safeUpdates.location || profile.location || '',
                        priorities: safeUpdates.priorities || profile.priorities || [],
                        style: safeUpdates.style || profile.style || 'Quiet Observer',
                        bio: safeUpdates.bio || profile.bio || '',
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    };

                    const { data: insertedData, error: insertError } = await supabase
                        .from('profiles')
                        .insert([newProfile])
                        .select();

                    if (insertError) {
                        console.error('Profile creation error:', insertError);
                        throw new Error(`Failed to create profile: ${insertError.message}`);
                    }

                    if (insertedData && insertedData.length > 0) {
                        const createdProfile: UserProfile = {
                            ...insertedData[0],
                            userId: insertedData[0].user_id,
                        };
                        setProfile(createdProfile);
                        console.log('Profile created successfully:', createdProfile);
                    }
                }
            } catch (error: any) {
                console.error('Update profile error:', error);
                // Revert local state on error
                throw error;
            }
        } else {
            // Demo mode - just update local state
            const updatedProfile = {
                ...profile,
                ...updates,
                updatedAt: new Date().toISOString()
            };
            setProfile(updatedProfile);
        }
    };

    const value = {
        user,
        profile,
        loading,
        signIn,
        signUp,
        signOut,
        updateProfile,
        isDemoMode
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
