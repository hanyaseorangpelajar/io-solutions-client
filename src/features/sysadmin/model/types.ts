export type AuditLevel = "info" | "warning" | "error";

export type AuditEntry = {
  id: string;
  at: string; // ISO datetime
  actor: string; // user who did the action
  action: string; // e.g., "UPDATE_PARAM"
  target?: string; // e.g., "system.theme"
  level: AuditLevel; // severity
  metadata?: Record<string, unknown>;
};

export type SystemParams = {
  siteName: string;
  allowRegistration: boolean;
  sessionTimeoutMin: number;
  defaultLocale: "id" | "en";
  maintenanceMode: boolean;
};
