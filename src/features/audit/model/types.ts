export type AuditStatus = "draft" | "approved" | "rejected";

export type AuditRecord = {
  id: string;
  ticketId: string;
  ticketCode: string;
  reviewer: string;
  reviewedAt: string;
  status: AuditStatus;
  score: number;
  notes?: string;
  tags: string[];
  publish: boolean;
};

export type AuditLogItem = {
  id: string;
  at: string;
  who: string;
  ticketId: string;
  ticketCode: string;
  action: AuditStatus;
  description: string;
  score?: number;
  tags?: string[];
  partUnit?: string;
};
