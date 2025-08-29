import type { Part, StockMovement, StockMoveType } from "./types";

// ===== In-memory store (UI-only) =====
export let INVENTORY_ITEMS: Part[] = [
  {
    id: "p-1",
    name: "Keyboard Membrane 104-key",
    sku: "KB-MEM-104",
    category: "Keyboard",
    vendor: "Generic",
    unit: "pcs",
    stock: 18,
    minStock: 5,
    location: "R1-A2",
    status: "active",
    price: 120000,
  },
  {
    id: "p-2",
    name: 'LCD 24" IPS 75Hz',
    sku: "LCD-24IPS",
    category: "Display",
    vendor: "ViewSonic",
    unit: "pcs",
    stock: 6,
    minStock: 3,
    location: "R2-C1",
    status: "active",
    price: 1750000,
  },
  {
    id: "p-3",
    name: "Thermal Paste 1g",
    sku: "TP-1G",
    category: "Cooling",
    vendor: "Arctic",
    unit: "pcs",
    stock: 2,
    minStock: 4,
    location: "R1-B3",
    status: "active",
    price: 40000,
  },
  {
    id: "p-4",
    name: "RJ45 Connector Cat6",
    sku: "RJ45-C6",
    category: "Network",
    vendor: "AMP",
    unit: "pcs",
    stock: 120,
    minStock: 50,
    location: "R3-D2",
    status: "active",
    price: 1500,
  },
];

export let STOCK_MOVES: StockMovement[] = [
  {
    id: "m-1",
    partId: "p-1",
    partName: "Keyboard Membrane 104-key",
    type: "out",
    qty: 2,
    ref: "WO-2025-00012",
    note: "Keluar untuk ticket TCK-2025-000125",
    by: "sysadmin",
    at: "2025-08-27T10:10:00Z",
  },
];

// ===== Helpers =====
export function upsertItem(p: Part) {
  const i = INVENTORY_ITEMS.findIndex((x) => x.id === p.id);
  if (i >= 0) INVENTORY_ITEMS[i] = p;
  else INVENTORY_ITEMS.push(p);
}

export function removeItem(id: string) {
  INVENTORY_ITEMS = INVENTORY_ITEMS.filter((x) => x.id !== id);
}

export function nextId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

export function pushMove(move: StockMovement) {
  STOCK_MOVES.unshift(move); // terbaru di atas
}

export function adjustStock(partId: string, type: StockMoveType, qty: number) {
  const p = INVENTORY_ITEMS.find((x) => x.id === partId);
  if (!p) return;
  if (type === "in") p.stock += qty;
  else if (type === "out") p.stock = Math.max(0, p.stock - qty);
  // "adjust" tidak otomatis mengubah, biarkan caller menghitung delta & set explicit
}

export function setStock(partId: string, newStock: number) {
  const p = INVENTORY_ITEMS.find((x) => x.id === partId);
  if (!p) return;
  p.stock = Math.max(0, newStock);
}
