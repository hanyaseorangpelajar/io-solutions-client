export type MonthKey = `${number}-${number}`; // "2025-8" dsb.

export type TicketAgg = {
  month: MonthKey;
  created: number;
  resolved: number;
  byStatus: Record<string, number>;
  byPriority: Record<string, number>;
};

export type InventoryAgg = {
  byCategory: Record<string, number>; // stok per kategori
  movementsIn: number;
  movementsOut: number;
};

export type RmaAgg = {
  month: MonthKey;
  created: number;
  closed: number;
  byStatus: Record<string, number>;
};
