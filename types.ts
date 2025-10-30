export interface Report {
  id: string;
  title: string;
  src: string;
  isVisible: boolean;
}

export interface ThemeSettings {
  primaryColor: string;
  secondaryColor: string;
  headerTitle: string;
  headerSubtitle: string;
  logoUrl: string;
  footerText: string;
}

export type AppMode = 'USER' | 'ADMIN';

export type UserStatus = 'PENDING' | 'APPROVED' | 'SUSPENDED';

export interface User {
  id: string;
  username: string;
  password: string; // In a real-world app, this would be a hash.
  status: UserStatus;
  visibleReportIds: string[];
}
