export type AccountProfile = {
  name: string;
  email: string;
  phone?: string;
  department?: string;
};

export type SecuritySettings = {
  twoFactorEnabled: boolean;
  recoveryEmail?: string;
};

export type NotificationSettings = {
  updates: boolean; // update tiket/pekerjaan
  announcements: boolean; // pengumuman sistem
  alerts: boolean; // alert penting
  frequency: "immediate" | "daily" | "weekly";
};
