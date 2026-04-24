export interface Trip {
  id: string;
  name: string;
  description?: string;
  startDate: string; // ISO date string
  endDate: string;
  currency: string;
  budget?: number;
  totalSpent: number;
  coverColor: string;
  coverImage?: TripCoverImage | null;
  createdAt: number;
  updatedAt: number;
}

export interface TripCoverImage {
  fileName: string;
  storagePath: string;
  downloadUrl?: string;
  mimeType: string;
  size?: number;
}

export type CreateTripData = Omit<
  Trip,
  'id' | 'totalSpent' | 'createdAt' | 'updatedAt'
>;
