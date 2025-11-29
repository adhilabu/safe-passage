import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { SafetyPriority, CommunityStyle, ItineraryType } from '../types';
import { User, Edit2, Save, X, MapPin, Mail, Calendar, Shield, Users, Compass as CompassIcon } from 'lucide-react';
import NotificationModal, { NotificationType } from './NotificationModal';

const ProfilePage: React.FC = () => {
    const { profile, updateProfile, isDemoMode } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [editedProfile, setEditedProfile] = useState(profile);
    const [saving, setSaving] = useState(false);
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

    if (!profile || !editedProfile) {
        return (
            <div className="max-w-4xl mx-auto p-4">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
                    <p className="text-gray-500">No profile data available</p>
                </div>
            </div>
        );
    }

    const handleSave = async () => {
        setSaving(true);
        try {
            await updateProfile(editedProfile);
            setIsEditing(false);
            showNotification('Profile Updated', 'Your profile has been successfully updated.', 'success');
        } catch (error: any) {
            showNotification('Update Failed', error.message || 'Failed to update profile. Please try again.', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setEditedProfile(profile);
        setIsEditing(false);
    };

    const togglePriority = (priority: SafetyPriority) => {
        const current = editedProfile.priorities || [];
        const updated = current.includes(priority)
            ? current.filter(p => p !== priority)
            : [...current, priority];
        setEditedProfile({ ...editedProfile, priorities: updated });
    };

    const toggleItineraryType = (type: ItineraryType) => {
        const current = editedProfile.preferredItineraryTypes || [];
        const updated = current.includes(type)
            ? current.filter(t => t !== type)
            : [...current, type];
        setEditedProfile({ ...editedProfile, preferredItineraryTypes: updated });
    };

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-6">
            <NotificationModal
                isOpen={notification.isOpen}
                onClose={closeNotification}
                title={notification.title}
                message={notification.message}
                type={notification.type}
            />

            {/* Header */}
            <div className="bg-gradient-to-r from-brand-600 to-brand-800 rounded-2xl p-8 text-white shadow-lg">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="text-6xl bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editedProfile.avatar}
                                    onChange={(e) => setEditedProfile({ ...editedProfile, avatar: e.target.value })}
                                    className="w-16 text-center bg-transparent outline-none"
                                    maxLength={2}
                                />
                            ) : (
                                profile.avatar
                            )}
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editedProfile.name}
                                        onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                                        className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg outline-none border-2 border-transparent focus:border-white"
                                        placeholder="Your Name"
                                    />
                                ) : (
                                    profile.name
                                )}
                            </h1>
                            {profile.email && (
                                <p className="text-brand-100 mt-1 flex items-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    {profile.email}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Edit/Save Buttons */}
                    <div className="flex gap-2">
                        {isEditing ? (
                            <>
                                <button
                                    onClick={handleCancel}
                                    className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all"
                                >
                                    <X className="w-5 h-5" />
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="flex items-center gap-2 bg-white text-brand-600 hover:bg-brand-50 px-4 py-2 rounded-lg transition-all font-semibold disabled:opacity-50"
                                >
                                    <Save className="w-5 h-5" />
                                    {saving ? 'Saving...' : 'Save'}
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all"
                            >
                                <Edit2 className="w-5 h-5" />
                                Edit Profile
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Profile Info Cards */}
            <div className="grid md:grid-cols-2 gap-6">

                {/* Basic Info */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-4">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <User className="w-5 h-5 text-brand-500" />
                        Basic Information
                    </h2>

                    <div className="space-y-3">
                        <div>
                            <label className="text-sm font-medium text-gray-600 ml-1">Location</label>
                            {isEditing ? (
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        value={editedProfile.location}
                                        onChange={(e) => setEditedProfile({ ...editedProfile, location: e.target.value })}
                                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                                        placeholder="City, Country"
                                    />
                                </div>
                            ) : (
                                <p className="text-gray-900 flex items-center gap-2 mt-1">
                                    <MapPin className="w-4 h-4 text-gray-400" />
                                    {profile.location || 'Not specified'}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-600 ml-1">Community Style</label>
                            {isEditing ? (
                                <select
                                    value={editedProfile.style}
                                    onChange={(e) => setEditedProfile({ ...editedProfile, style: e.target.value as CommunityStyle })}
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                                >
                                    {Object.values(CommunityStyle).map(style => (
                                        <option key={style} value={style}>{style}</option>
                                    ))}
                                </select>
                            ) : (
                                <p className="text-gray-900 flex items-center gap-2 mt-1">
                                    <Users className="w-4 h-4 text-gray-400" />
                                    {profile.style}
                                </p>
                            )}
                        </div>

                        {profile.createdAt && (
                            <div>
                                <label className="text-sm font-medium text-gray-600 ml-1">Member Since</label>
                                <p className="text-gray-900 flex items-center gap-2 mt-1">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    {new Date(profile.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bio */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-4">
                    <h2 className="text-lg font-bold text-gray-900">About Me</h2>
                    {isEditing ? (
                        <textarea
                            value={editedProfile.bio}
                            onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 min-h-[120px]"
                            placeholder="Tell us about yourself and your travel interests..."
                        />
                    ) : (
                        <p className="text-gray-700 leading-relaxed">
                            {profile.bio || 'No bio added yet.'}
                        </p>
                    )}
                </div>
            </div>

            {/* Safety Priorities */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-brand-500" />
                    Safety & Justice Priorities
                </h2>
                <div className="flex flex-wrap gap-2">
                    {Object.values(SafetyPriority).map(priority => {
                        const isSelected = (editedProfile.priorities || []).includes(priority);
                        return (
                            <button
                                key={priority}
                                onClick={() => isEditing && togglePriority(priority)}
                                disabled={!isEditing}
                                className={`px-4 py-2 rounded-lg font-medium transition-all ${isSelected
                                        ? 'bg-brand-500 text-white shadow-md'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    } ${!isEditing ? 'cursor-default' : 'cursor-pointer'}`}
                            >
                                {priority}
                            </button>
                        );
                    })}
                </div>
                {isEditing && (
                    <p className="text-sm text-gray-500 italic">Click to select/deselect priorities</p>
                )}
            </div>

            {/* Preferred Itinerary Types */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <CompassIcon className="w-5 h-5 text-brand-500" />
                    Preferred Travel Styles
                </h2>
                <div className="flex flex-wrap gap-2">
                    {Object.values(ItineraryType).filter(t => t !== ItineraryType.CUSTOM).map(type => {
                        const isSelected = (editedProfile.preferredItineraryTypes || []).includes(type);
                        return (
                            <button
                                key={type}
                                onClick={() => isEditing && toggleItineraryType(type)}
                                disabled={!isEditing}
                                className={`px-4 py-2 rounded-lg font-medium transition-all ${isSelected
                                        ? 'bg-purple-500 text-white shadow-md'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    } ${!isEditing ? 'cursor-default' : 'cursor-pointer'}`}
                            >
                                {type}
                            </button>
                        );
                    })}
                </div>
                {isEditing && (
                    <p className="text-sm text-gray-500 italic">Click to select/deselect your preferred travel styles</p>
                )}
            </div>

            {/* Demo Mode Notice */}
            {isDemoMode && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
                    <p className="font-semibold">Demo Mode</p>
                    <p className="text-blue-700 mt-1">
                        Profile changes are saved locally. Configure Supabase to persist across sessions.
                    </p>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
