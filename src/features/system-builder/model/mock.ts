import type { MarketItem, ComponentCategory } from "./types";

// === MOCK DATASET MARKET ===
// Nanti ganti dengan dataset scraping milikmu.
// Pastikan kategori selaras dengan ComponentCategory untuk filter picker.
export const MARKET_ITEMS: MarketItem[] = [
  // Desktop/Server parts
  {
    id: "m-cpu-1",
    name: "AMD Ryzen 5 5600",
    category: "cpu",
    vendor: "AMD",
    price: 1850000,
    meta: { socket: "AM4" },
  },
  {
    id: "m-cpu-2",
    name: "Intel Core i5-12400F",
    category: "cpu",
    vendor: "Intel",
    price: 2350000,
    meta: { socket: "LGA1700" },
  },
  {
    id: "m-mb-1",
    name: "B550M Micro-ATX",
    category: "motherboard",
    vendor: "MSI",
    price: 1800000,
    meta: { socket: "AM4" },
  },
  {
    id: "m-mb-2",
    name: "B760 ATX",
    category: "motherboard",
    vendor: "ASUS",
    price: 2650000,
    meta: { socket: "LGA1700" },
  },
  {
    id: "m-ram-1",
    name: "DDR4 16GB (2x8) 3200",
    category: "ram",
    vendor: "Corsair",
    price: 650000,
  },
  {
    id: "m-ram-2",
    name: "DDR5 32GB (2x16) 5600",
    category: "ram",
    vendor: "Kingston",
    price: 1450000,
  },
  {
    id: "m-ssd-1",
    name: "NVMe SSD 1TB Gen3",
    category: "storage",
    vendor: "WD",
    price: 1200000,
  },
  {
    id: "m-ssd-2",
    name: "NVMe SSD 2TB Gen4",
    category: "storage",
    vendor: "Samsung",
    price: 2850000,
  },
  {
    id: "m-gpu-1",
    name: "GeForce RTX 4060 8GB",
    category: "gpu",
    vendor: "MSI",
    price: 4700000,
  },
  {
    id: "m-psu-1",
    name: "PSU 650W 80+ Bronze",
    category: "psu",
    vendor: "Seasonic",
    price: 950000,
  },
  {
    id: "m-case-1",
    name: "ATX Case Minimalis",
    category: "case",
    vendor: "Montech",
    price: 550000,
  },
  {
    id: "m-cool-1",
    name: "Tower Cooler 120mm",
    category: "cooler",
    vendor: "Deepcool",
    price: 350000,
  },

  // Server / NIC
  {
    id: "m-nic-1",
    name: "Intel i350-T2 Dual GbE",
    category: "nic",
    vendor: "Intel",
    price: 850000,
  },

  // IoT / Others
  {
    id: "m-others-1",
    name: "Raspberry Pi 4 4GB",
    category: "others",
    vendor: "Raspberry",
    price: 1300000,
  },
  {
    id: "m-others-2",
    name: "ESP32 DevKitC",
    category: "others",
    vendor: "Espressif",
    price: 85000,
  },
];

// util sederhana untuk filter berdasarkan kategori
export const marketByCategory = (cat: ComponentCategory) =>
  MARKET_ITEMS.filter((m) => m.category === cat);
