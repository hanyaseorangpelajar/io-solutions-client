// ==== System Builder types (UI layer) ====

// Lebih fleksibel: bisa tambah id baru ke depan
export type BuildId = "desktop" | "server" | "iot" | (string & {});

export type ComponentCategory =
  | "cpu"
  | "motherboard"
  | "ram"
  | "storage"
  | "gpu"
  | "psu"
  | "case"
  | "cooler"
  | "nic"
  | "others";

export const COMPONENT_LABEL: Record<ComponentCategory, string> = {
  cpu: "CPU",
  motherboard: "Motherboard",
  ram: "RAM",
  storage: "Storage",
  gpu: "GPU",
  psu: "PSU",
  case: "Case",
  cooler: "Cooler",
  nic: "Network Card",
  others: "Others",
};

// Pilihan sumber item
export type SourceType = "store" | "market";

export type MarketItem = {
  id: string;
  name: string;
  category: ComponentCategory;
  vendor?: string;
  price: number; // IDR
  meta?: Record<string, string | number | boolean>;
};

export type BuilderPick = {
  source: SourceType;
  itemId: string | null;
};

export type BuilderSelection = Partial<Record<ComponentCategory, BuilderPick>>;

// Mapping kategori wajib per jenis sistem
export const REQUIRED_BY_SYSTEM: Partial<Record<BuildId, ComponentCategory[]>> =
  {
    desktop: ["cpu", "motherboard", "ram", "storage", "psu", "case"],
    server: ["cpu", "motherboard", "ram", "storage", "psu", "nic"],
    iot: ["others", "storage"],
  };
