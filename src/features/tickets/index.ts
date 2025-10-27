// src/features/tickets/index.ts

// ---- Model
export * from "./model/types";
export * from "./model/schema";

// ---- Pages (List & History = named; lainnya default)
export { TicketsListPage } from "./ui/TicketsListPage";
export { TicketsHistoryPage } from "./ui/TicketsHistoryPage";
export { default as TicketsMyWorkPage } from "./ui/TicketsMyWorkPage";
export { default as TicketDetailPage } from "./ui/TicketDetailPage";

// ---- UI components
export { default as ResolveTicketModal } from "./ui/ResolveTicketModal";
export { default as TicketFormModal } from "./ui/TicketFormModal";
export { default as TicketPriorityBadge } from "./ui/TicketPriorityBadge";
export { default as TicketStatusBadge } from "./ui/TicketStatusBadge";

// ---- Utils
export * from "./utils/format";
