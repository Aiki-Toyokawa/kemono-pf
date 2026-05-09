export type Role = 'USER' | 'ARTIST' | 'ADMIN';

export interface User {
  id: string;
  handle: string | null;
  email: string;
  role: Role;
  displayName: string;
  bio: string | null;
  avatarUrl: string | null;
  isNsfwEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}
