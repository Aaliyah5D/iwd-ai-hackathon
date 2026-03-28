export type HelpType = 'pads' | 'medical-aid' | 'disability-aid' | 'safety-escort';

export interface UserProfile {
  uid: string;
  firstName: string;
  surname: string;
  email: string;
  displayName: string;
  university: string;
  studentNumber: string;
  gender: 'Female' | 'Male' | 'Other';
  idNumber: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  universityLocation?: {
    lat: number;
    lng: number;
  };
  skills: string[];
  avatar: string;
  isGuardian: boolean;
  helpsCompleted: number;
  achievements: string[];
  createdAt: number;
}

export interface HelpRequest {
  id: string;
  requesterId: string | null; // null if anonymous
  type: HelpType;
  isAnonymous: boolean;
  additionalInfo?: string;
  location: {
    lat: number;
    lng: number;
  };
  status: 'pending' | 'accepted' | 'completed' | 'cancelled';
  acceptedBy: string | null;
  thankYouSent?: boolean;
  createdAt: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  requiredCount: number;
  currentCount: number;
  unlocked: boolean;
}
