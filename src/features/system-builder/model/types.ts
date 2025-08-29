// ==== System Builder types (UI layer) ====

export type BuildType = "desktop" | "server" | "iot";

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

export type SourceType = "store" | "market";

export type MarketItem = {
  id: string;
  name: string;
  category: ComponentCategory;
  vendor?: string;
  price: number; // IDR
  // metadata opsional untuk future compatibility check
  meta?: Record<string, string | number | boolean>;
};

export type BuilderPick = {
  source: SourceType;
  itemId: string | null;
};

export type BuilderSelection = Partial<Record<ComponentCategory, BuilderPick>>;

export type RequiredMap = Partial<Record<BuildType, ComponentCategory[]>>;

export const REQUIRED_BY_BUILD: RequiredMap = {
  desktop: ["cpu", "motherboard", "ram", "storage", "psu", "case"],
  server: ["cpu", "motherboard", "ram", "storage", "psu", "nic"],
  iot: ["others", "storage"], // sederhana: SoC/MCU taruh di "others"
};
