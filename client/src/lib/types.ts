export interface Agency {
  id: string;
  name: string;
  address: string;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  latitude: string | number;
  longitude: string | number;
  description?: string | null;
  services?: string | null;
  documentsRequired?: string | null;
  openingHours?: unknown;
  region?: string | null;
  createdAt: Date;
}
