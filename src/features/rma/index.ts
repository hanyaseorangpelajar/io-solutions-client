// src/features/rma/index.ts

// ---- Model
export * from "./model/types";
export * from "./model/schema";
export { MOCK_RMAS, getMockRmaById } from "./model/mock";

// ---- UI (default exports di-alias jadi named)
export { default as RmaListPage } from "./ui/RmaListPage";
export { default as RmaDetailPage } from "./ui/RmaDetailPage";
export { default as RmaFormModal } from "./ui/RmaFormModal";
export { default as RmaActionModal } from "./ui/RmaActionModal";
export { default as RmaStatusBadge } from "./ui/RmaStatusBadge";
