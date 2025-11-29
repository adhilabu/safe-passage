export enum SafetyPriority {
  SOLO_FEMALE = "Solo Female Safety",
  ACCESSIBILITY = "Accessible Travel (Mobility)",
  MINORITY_SUPPORT = "Minority Community Support",
  RELIGIOUS_INCLUSIVE = "Religious Inclusivity",
  NEURODIVERGENT = "Neurodivergent Friendly"
}

export enum CommunityStyle {
  QUIET_OBSERVER = "Quiet Observer",
  ACTIVE_ADVOCATE = "Active Advocate",
  COMMUNITY_BUILDER = "Community Builder",
  CULTURE_SEEKER = "Culture Seeker"
}

export enum ItineraryType {
  TREKKING = "Trekking & Hiking",
  SIGHTSEEING = "Sightseeing & Landmarks",
  FOOD_EXPLORATION = "Food Exploration",
  CULTURAL_IMMERSION = "Cultural Immersion",
  ADVENTURE_SPORTS = "Adventure Sports",
  RELAXATION = "Relaxation & Wellness",
  CUSTOM = "Custom"
}

export interface UserProfile {
  id: string;
  userId?: string; // Supabase auth user ID
  email?: string;
  name: string;
  avatar: string;
  location: string;
  priorities: SafetyPriority[];
  style: CommunityStyle;
  bio: string;
  preferredItineraryTypes?: ItineraryType[];
  createdAt?: string;
  updatedAt?: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface ItineraryResult {
  markdown: string;
  sources: GroundingSource[];
}

export interface IcebreakerResult {
  message: string;
}

export enum AppView {
  HOME = 'HOME',
  MATCH = 'MATCH',
  ITINERARY = 'ITINERARY',
  PROFILE = 'PROFILE'
}