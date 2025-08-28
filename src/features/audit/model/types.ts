export type AuditStatus = "draft" | "approved" | "rejected";

export type AuditRecord = {
  id: string; // audit id
  ticketId: string; // link to Ticket.id
  ticketCode: string; // denormalized for table
  reviewer: string; // user who audits
  reviewedAt: string; // ISO datetime
  status: AuditStatus;
  score: number; // 0..100
  notes?: string; // reviewer notes / rationale
  tags: string[]; // curated tags for knowledge base
  publish: boolean; // true if promoted to Repository (SOP)
};
