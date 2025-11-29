import { UserProfile, SafetyPriority, CommunityStyle } from './types';

export const MOCK_USERS: UserProfile[] = [
  {
    id: '1',
    name: "Aisha R.",
    avatar: "https://picsum.photos/200/200?random=1",
    location: "London, UK",
    priorities: [SafetyPriority.SOLO_FEMALE, SafetyPriority.MINORITY_SUPPORT],
    style: CommunityStyle.CULTURE_SEEKER,
    bio: "Love history and art. Always looking for women-owned cafes."
  },
  {
    id: '2',
    name: "Elena M.",
    avatar: "https://picsum.photos/200/200?random=2",
    location: "Barcelona, Spain",
    priorities: [SafetyPriority.ACCESSIBILITY, SafetyPriority.SOLO_FEMALE],
    style: CommunityStyle.QUIET_OBSERVER,
    bio: "Wheelchair user passionate about finding accessible hidden gems."
  },
  {
    id: '3',
    name: "Sam T.",
    avatar: "https://picsum.photos/200/200?random=3",
    location: "Toronto, Canada",
    priorities: [SafetyPriority.NEURODIVERGENT, SafetyPriority.MINORITY_SUPPORT],
    style: CommunityStyle.COMMUNITY_BUILDER,
    bio: "Looking for sensory-friendly travel buddies and safe spaces."
  }
];

export const REPORT_REASONS = [
  "Unsafe Recommendation",
  "Biased or discriminatory language",
  "Outdated information",
  "Promotes unethical business",
  "Other"
];