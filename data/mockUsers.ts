import { UserProfile, SafetyPriority, CommunityStyle, ItineraryType } from '../types';

export const DEMO_CREDENTIALS = {
    email: 'demo@safepassage.network',
    password: 'DemoPass2024!'
};

export const MOCK_USERS: UserProfile[] = [
    {
        id: 'demo-user-1',
        userId: 'demo-auth-1',
        email: 'demo@safepassage.network',
        name: 'Sarah Chen',
        avatar: '👩‍💼',
        location: 'San Francisco, CA',
        priorities: [SafetyPriority.SOLO_FEMALE, SafetyPriority.MINORITY_SUPPORT],
        style: CommunityStyle.ACTIVE_ADVOCATE,
        bio: 'Solo traveler passionate about supporting local communities and exploring hidden gems. Always ready to share safety tips!',
        preferredItineraryTypes: [ItineraryType.FOOD_EXPLORATION, ItineraryType.CULTURAL_IMMERSION],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: 'mock-user-2',
        userId: 'mock-auth-2',
        email: 'alex@example.com',
        name: 'Alex Rivera',
        avatar: '🧑‍🦽',
        location: 'Austin, TX',
        priorities: [SafetyPriority.ACCESSIBILITY, SafetyPriority.NEURODIVERGENT],
        style: CommunityStyle.COMMUNITY_BUILDER,
        bio: 'Accessibility advocate making travel inclusive for everyone. Love connecting travelers with similar needs.',
        preferredItineraryTypes: [ItineraryType.RELAXATION, ItineraryType.SIGHTSEEING],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: 'mock-user-3',
        userId: 'mock-auth-3',
        email: 'priya@example.com',
        name: 'Priya Patel',
        avatar: '👩‍🎨',
        location: 'Mumbai, India',
        priorities: [SafetyPriority.RELIGIOUS_INCLUSIVE, SafetyPriority.MINORITY_SUPPORT],
        style: CommunityStyle.CULTURE_SEEKER,
        bio: 'Cultural explorer seeking authentic experiences. Interested in interfaith dialogue and traditional arts.',
        preferredItineraryTypes: [ItineraryType.CULTURAL_IMMERSION, ItineraryType.FOOD_EXPLORATION],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: 'mock-user-4',
        userId: 'mock-auth-4',
        email: 'jordan@example.com',
        name: 'Jordan Kim',
        avatar: '🧗',
        location: 'Seattle, WA',
        priorities: [SafetyPriority.SOLO_FEMALE, SafetyPriority.ACCESSIBILITY],
        style: CommunityStyle.QUIET_OBSERVER,
        bio: 'Adventure seeker who loves the outdoors. Prefers small group travels and off-the-beaten-path destinations.',
        preferredItineraryTypes: [ItineraryType.TREKKING, ItineraryType.ADVENTURE_SPORTS],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
];

// Get demo user (for quick login)
export const getDemoUser = (): UserProfile => MOCK_USERS[0];

// Find user by email
export const findUserByEmail = (email: string): UserProfile | undefined => {
    return MOCK_USERS.find(user => user.email === email);
};
