export interface ProfileAvatarImage {
  fileName: string;
  storagePath: string;
  downloadUrl: string;
  mimeType: string;
  size?: number;
}

export interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  avatarUrl?: string;
  avatar?: ProfileAvatarImage | null;
  defaultCurrency: string;
  createdAt: number;
  updatedAt: number;
}
