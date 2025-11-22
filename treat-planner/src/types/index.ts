import { Timestamp } from 'firebase/firestore';

// User Profile
export interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  photoURL?: string;
  createdAt: Timestamp;
}

// Member in a day plan
export interface Member {
  id?: string;
  name: string;
  email?: string;
}

// Day Plan
export interface DayPlan {
  id: string;
  ownerId: string;
  ownerEmail: string;
  title: string;
  date: Timestamp;
  description?: string;
  members: Member[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Event types
export type EventType = 'Cricket' | 'Food' | 'Movie' | 'Other';

// RSVP Status
export type RSVPStatus = 'yes' | 'no' | 'maybe';

// Event (Treat)
export interface Event {
  id: string;
  dayPlanId: string;
  ownerId: string;
  ownerEmail: string;
  title: string;
  type: EventType;
  dateTime: Timestamp;
  location?: string;
  locationUrl?: string; // Google Maps link
  notes?: string;
  totalBill?: number;
  payer?: string; // display name of the person who paid
  payerEmail?: string; // email of the person who paid
  payerAccountDetails?: string; // bank account or payment details
  attendees: string[]; // member IDs or names
  rsvps: Record<string, RSVPStatus>; // memberId -> status
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Form data types (for creating/editing)
export interface DayPlanFormData {
  title: string;
  date: Date;
  description?: string;
  membersList?: string; // comma-separated names/emails
}

export interface EventFormData {
  title: string;
  type: EventType;
  dateTime: Date;
  location?: string;
  locationUrl?: string; // Google Maps link
  notes?: string;
  totalBill?: number;
  payer?: string; // display name
  payerEmail?: string;
  payerAccountDetails?: string;
  selectedMembers: string[];
}
