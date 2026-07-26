export type UserRole =
  'GUEST' | 'REGISTERED' | 'PREMIUM' | 'AIRLINE_MANAGER' | 'ADMIN';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  country: string | null;
  language: string;
  units: 'kg' | 'lb';
  currency: string;
  themePreference: 'light' | 'dark' | 'system';
  role: UserRole;
  notificationPreferences: {
    email: boolean;
    push: boolean;
  };
  createdAt: string;
  updatedAt: string;
}
