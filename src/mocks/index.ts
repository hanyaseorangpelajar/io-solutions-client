/**
 * Pusat eksport semua MOCK.
 * Tujuan: satu import point -> "@/mocks"
 *
 * NB:
 * - re-export nama-nama asli dari setiap fitur agar kode lama tetap kompatibel.
 */

/* ----------------------------- Tickets ----------------------------- */
export * from "@/features/tickets/model/mock";
export * as ticketsMock from "@/features/tickets/model/mock";

/* ----------------------------- Inventory --------------------------- */
export * from "@/features/inventory/model/mock";
export * as inventoryMock from "@/features/inventory/model/mock";

/* ----------------------------- RMA -------------------------------- */
export * from "@/features/rma/model/mock";
export * as rmaMock from "@/features/rma/model/mock";

/* ----------------------------- Audit ------------------------------ */
export * from "@/features/audit/model/mock";
export * as auditMock from "@/features/audit/model/mock";

/* ----------------------------- Staff ------------------------------ */
export * from "@/features/staff/model/mock";
export * as staffMock from "@/features/staff/model/mock";

/* ----------------------------- System Builder --------------------- */
export * from "@/features/system-builder/model/mock";
export * as systemBuilderMock from "@/features/system-builder/model/mock";

/* ----------------------------- Access Control (RBAC/Staff) -------- */
export * from "@/features/rbac/model/mock";
export * as accessMock from "@/features/rbac/model/mock";
