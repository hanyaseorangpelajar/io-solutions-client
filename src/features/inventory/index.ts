// src/features/inventory/index.ts

// ---- Model
export * from "./model/types";
export * from "./model/schema";
export { INVENTORY_ITEMS, STOCK_MOVES } from "./model/mock";

// ---- UI (default exports di-alias jadi named)
export { default as InventoryListPage } from "./ui/InventoryListPage";
export { default as StockMovementsPage } from "./ui/StockMovementsPage";
export { default as PartFormModal } from "./ui/PartFormModal";
export { default as PartStatusBadge } from "./ui/PartStatusBadge";
export { default as StockMoveModal } from "./ui/StockMoveModal";
export { default as StockOutFromTicketModal } from "./ui/StockOutFromTicketModal";
