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
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                loadUserProfile(session.user.id);
            } else {
                setLoading(false);
            }
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
                .single();

            if (error) {
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
            }
        } catch (error) {
            // Error loading profile - using default profile
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

            // Real Supabase login
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
        } catch (error: any) {
            throw new Error(error.message || 'Failed to sign in');
        } finally {
            setLoading(false);
        }
    };

    const signUp = async (email: string, password: string, profileData: Partial<UserProfile>) => {
        if (isDemoMode) {
            throw new Error('Sign up is not available in demo mode. Please configure Supabase.');
        }

        setLoading(true);
        try {
            const { data, error } = await supabase.auth.signUp({ email, password });
            if (error) throw error;

            if (data.user) {
                // Create profile in database
                // Create profile in database
                const newProfile = {
                    user_id: data.user.id,
                    email: data.user.email,
                    name: profileData.name || 'New User',
                    avatar: profileData.avatar || '👤',
                    location: profileData.location || '',
                    priorities: profileData.priorities || [],
                    style: profileData.style || 'Quiet Observer',
                    bio: profileData.bio || '',
                    "createdAt": new Date().toISOString(),
                    "updatedAt": new Date().toISOString()
                };

                const { error: profileError } = await supabase
                    .from('profiles')
                    .insert([newProfile]);

                if (profileError) {
                    if (profileError.code === 'PGRST205') {
                        throw new Error('Database table "profiles" is missing. Please run the schema.sql script in Supabase.');
                    }
                    throw new Error(profileError.message || 'Failed to create user profile');
                }

                // Explicitly set the profile state to avoid race condition with onAuthStateChange
                // which might try to load the profile before it's inserted
                setProfile({
                    ...newProfile,
                    id: newProfile.user_id,
                    userId: newProfile.user_id,
                } as UserProfile);
            }
        } catch (error: any) {
            throw new Error(error.message || 'Failed to sign up');
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
            if (error) throw error;
            setUser(null);
            setProfile(null);
        } catch (error: any) {
            throw new Error(error.message || 'Failed to sign out');
        }
    };

    const updateProfile = async (updates: Partial<UserProfile>) => {
        if (!profile) return;

        const updatedProfile = {
            ...profile,
            ...updates,
            updatedAt: new Date().toISOString()
        };

        setProfile(updatedProfile);

        // Only update Supabase if not in demo mode
        if (!isDemoMode && user) {
            try {
                // Filter updates to only match database columns
                const { userId, id, ...safeUpdates } = updates as any;

                // Ensure createdAt is not updated
                delete safeUpdates.createdAt;

                // Convert preferredItineraryTypes array to database format if present
                const dbUpdates: any = { ...safeUpdates };
                if (dbUpdates.preferredItineraryTypes) {
                    // Already an array, Supabase will handle it
                }

                const { data, error, status, statusText } = await supabase
                    .from('profiles')
                    .update({
                        ...dbUpdates,
                        "updatedAt": new Date().toISOString()
                    })
                    .eq('user_id', user.id)
                    .select();

                if (error) {
                    throw error;
                }
            } catch (error: any) {
                throw error;
            }
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
