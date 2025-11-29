import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Compass, LogIn, UserPlus, Loader2, AlertCircle, Sparkles, Eye, EyeOff } from 'lucide-react';
import { DEMO_CREDENTIALS } from '../data/mockUsers';

import NotificationModal, { NotificationType } from './NotificationModal';

const AuthPage: React.FC = () => {
    const { signIn, signUp, isDemoMode } = useAuth();
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);

    // Notification State
    const [notification, setNotification] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        type: NotificationType;
    }>({
        isOpen: false,
        title: '',
        message: '',
        type: 'info'
    });

    const closeNotification = () => {
        setNotification(prev => ({ ...prev, isOpen: false }));
    };

    const showNotification = (title: string, message: string, type: NotificationType = 'info') => {
        setNotification({
            isOpen: true,
            title,
            message,
            type
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Client-side validation
        if (!email.trim()) {
            showNotification('Validation Error', 'Please enter your email address.', 'error');
            return;
        }

        if (!password.trim()) {
            showNotification('Validation Error', 'Please enter your password.', 'error');
            return;
        }

        if (isSignUp && !name.trim()) {
            showNotification('Validation Error', 'Please enter your name.', 'error');
            return;
        }

        if (isSignUp && password.length < 6) {
            showNotification('Validation Error', 'Password must be at least 6 characters long.', 'error');
            return;
        }

        setLoading(true);

        try {
            if (isSignUp) {
                await signUp(email, password, { name: name.trim() });
                showNotification('Success!', 'Account created successfully. Welcome to SafePassage Network!', 'success');
            } else {
                await signIn(email, password);
                // Don't show success notification for sign in - user will see the app
            }
        } catch (err: any) {
            const errorTitle = isSignUp ? 'Sign Up Failed' : 'Sign In Failed';
            showNotification(errorTitle, err.message || 'An unexpected error occurred. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDemoLogin = async () => {
        setLoading(true);
        try {
            await signIn(DEMO_CREDENTIALS.email, DEMO_CREDENTIALS.password);
        } catch (err: any) {
            showNotification('Demo Login Failed', err.message || 'Could not sign in with demo credentials', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-brand-100 flex items-center justify-center p-4">
            <NotificationModal
                isOpen={notification.isOpen}
                onClose={closeNotification}
                title={notification.title}
                message={notification.message}
                type={notification.type}
            />

            <div className="max-w-md w-full space-y-8">

                {/* Header */}
                <div className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="bg-brand-500 text-white p-4 rounded-2xl shadow-lg">
                            <Compass className="w-12 h-12" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
                        SafePassage<span className="text-brand-500">Network</span>
                    </h1>
                    <p className="mt-2 text-gray-600">
                        Travel safely, connect ethically
                    </p>
                </div>

                {/* Demo Mode Banner */}
                {isDemoMode && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
                        <div className="flex items-start gap-2">
                            <Sparkles className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-semibold">Demo Mode Active</p>
                                <p className="text-blue-700 mt-1">
                                    Supabase is not configured. You can use the demo account or configure Supabase in .env.local
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Auth Form */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Name Field (Sign Up Only) */}
                        {isSignUp && (
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-medium text-gray-700 ml-1">
                                    Full Name
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter your name"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all"
                                    required
                                />
                            </div>
                        )}

                        {/* Email Field */}
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium text-gray-700 ml-1">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all"
                                required
                            />
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium text-gray-700 ml-1">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all pr-10"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    {isSignUp ? 'Creating Account...' : 'Signing In...'}
                                </>
                            ) : (
                                <>
                                    {isSignUp ? (
                                        <>
                                            <UserPlus className="w-5 h-5" />
                                            Sign Up
                                        </>
                                    ) : (
                                        <>
                                            <LogIn className="w-5 h-5" />
                                            Sign In
                                        </>
                                    )}
                                </>
                            )}
                        </button>

                        {/* Toggle Sign Up/Sign In */}
                        <div className="text-center">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsSignUp(!isSignUp);
                                    setNotification(prev => ({ ...prev, isOpen: false }));
                                }}
                                className="text-sm text-brand-600 hover:text-brand-700 font-medium hover:underline"
                            >
                                {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                            </button>
                        </div>
                    </form>

                    {/* Demo Account */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <button
                            onClick={handleDemoLogin}
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold py-3 px-6 rounded-xl transition-all border border-purple-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Sparkles className="w-5 h-5" />
                            Try Demo Account
                        </button>
                        <p className="text-xs text-gray-500 text-center mt-2">
                            Quick access with pre-configured demo user
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-sm text-gray-500">
                    By continuing, you agree to our Terms of Service and Privacy Policy
                </p>
            </div>
        </div>
    );
};

export default AuthPage;
