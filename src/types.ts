export type AgeRange = "3-5" | "6-9" | "10-13" | "14+";

export type SupportNeed = 
  | "Autism" 
  | "ADHD" 
  | "Down Syndrome" 
  | "Non-verbal" 
  | "Sensory Sensitivity" 
  | "Cerebral Palsy" 
  | "Global Developmental Delay"
  | "Special Needs Community";

export type CommMode = "Chat" | "Email" | "Video" | "In-person / Chat";

export interface FamilyProfile {
  id: string;
  email?: string;
  role?: "admin" | "user";
  parentName: string;
  childAge: AgeRange;
  supportNeeds: SupportNeed[];
  languages: string[];
  commMode: CommMode;
  nearbyMosque: string;
  interests: string[];
  isLocationPrivate: boolean;
  cityRegion: string;
  bio?: string;
  avatarBg: string;
}

export interface MatchedFamily {
  id: string;
  familyTitle: string;
  parentNames: string;
  childAge: string;
  nearbyMosque: string;
  distance: string;
  supportNeeds: SupportNeed[];
  interests: string[];
  languages: string[];
  preferredMode: CommMode;
  matchScore: number;
  matchingCriteria: string[];
  bio: string;
  avatarInitials: string;
  bgGradient: string;
}

export interface CommunityCircle {
  id: string;
  title: string;
  category: string;
  description: string;
  memberCount: number;
  iconName: string;
  tags: string[];
  meetingSchedule: string;
  isJoined?: boolean;
  pinnedTip: string;
  recentMessages: {
    sender: string;
    time: string;
    text: string;
    avatar: string;
  }[];
}

export interface FAQItem {
  id: string;
  category: "Salah Accommodations" | "Sensory Overload in Crowds" | "Religious Exemptions (Fasting/Congregation)" | "Caregiving in Islam";
  question: string;
  answer: string;
  scholarlyBasis: string;
  keyTakeaway: string;
  tags: string[];
  helpfulCount: number;
}

export interface HopeReminder {
  id: string;
  type: "Quran" | "Hadith";
  arabicText?: string;
  translation: string;
  source: string;
  context: string;
  isBookmarked?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
  isFallback?: boolean;
  topicTag?: string;
}

export interface CaregiverReview {
  id: string;
  reviewerName: string;
  date: string;
  rating: number;
  comment: string;
  isVerifiedFamily?: boolean;
}

export interface CaregiverProfile {
  id: string;
  name: string;
  title: string;
  photoUrl?: string;
  avatarInitials: string;
  bgGradient: string;
  location: string;
  city: string;
  zipCode: string;
  distanceMiles: number;
  yearsExperience: number;
  hourlyRateMin: number;
  hourlyRateMax: number;
  rating: number;
  reviewCount: number;
  shortBio: string;
  aboutMe: string;
  experienceDetails: string;
  gender: "Female" | "Male";
  mode: "In-Person" | "Virtual" | "Both";
  disabilitiesSupported: string[];
  servicesProvided: string[];
  languagesSpoken: string[];
  availableDays: string[];
  badges: string[];
  certifications: string[];
  reviews: CaregiverReview[];
  availabilityGrid: {
    day: string;
    slots: string[];
  }[];
  phoneContact?: string;
  emailContact?: string;
}
