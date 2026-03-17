export interface Recruiter {
  name: string;
  email: string;
  specialization: string;
}

export type OpeningHours = Record<string, string>;

export interface Agency {
  id: string;
  name: string;
  address: string;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  linkedIn?: string | null;
  latitude: string | number;
  longitude: string | number;
  description?: string | null;
  services?: string | null;
  documentsRequired?: string | null;
  openingHours?: OpeningHours | null;
  region?: string | null;
  recruiters?: Recruiter[] | string | null;
  createdAt: Date | string;
}

export interface AgenciesListResponse {
  items: Agency[];
  source: "database" | "fallback";
  fallbackReason?: string;
}

export interface AgencyInquiryInput {
  agencyId: string;
  agencyName: string;
  agencyEmail?: string | null;
  recruiterEmail?: string | null;
  recruiterName?: string | null;
  senderName: string;
  senderEmail: string;
  senderPhone?: string;
  message: string;
}

export interface AgencyReview {
  id: string;
  author: string;
  rating: number;
  comment: string;
  createdAt: string;
}
