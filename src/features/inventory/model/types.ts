export type PartStatus = "active" | "inactive" | "discontinued";

export type Part = {
  id: string;
  name: string;
  sku?: string;
  category?: string; // contoh: "Keyboard", "Display", "Network"
  vendor?: string; // contoh: "Logitech", "Intel"
  unit: string; // "pcs", "set", "roll", etc.
  stock: number; // stok saat ini
  minStock?: number; // ambang low-stock
  location?: string; // lokasi rak/bin
  price?: number; // harga satuan (opsional)
  status: PartStatus;
};

export type StockMoveType = "in" | "out" | "adjust";

export type StockMovement = {
  id: string;
  partId: string;
  partName: string;
  type: StockMoveType;
  qty: number; // jumlah positif; untuk 'adjust' simpan nilai absolut & catat delta pada note
  ref?: string; // nomor referensi PO/WO/TT
  note?: string;
  by: string; // user yang melakukan
  at: string; // ISO datetime
};
