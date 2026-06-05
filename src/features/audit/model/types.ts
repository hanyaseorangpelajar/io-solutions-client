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

export interface KBEntryDto {
  kbId: string;
  symptom: string;
  deviceModel: string;
  diagnosis: string;
  solution: string;
  imageUrl: string | null;
  sourceTicket: {
    ticketId: string;
    ticketNumber: string;
    technicianId?: string;
  } | null;
  tags: {
    tagId: string;
    name: string;
  }[];
  createdAt: string;
  createdBy: {
    userId: string;
    name: string;
  } | null;
  updatedAt: string;
}
