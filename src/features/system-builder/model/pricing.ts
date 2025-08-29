// util format Rupiah
export function idr(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}

/**
 * Penjumlahan aman untuk list angka yang bisa mengandung null/undefined.
 * Mengabaikan nilai non-number & non-finite.
 */
export function sum(
  items: readonly (number | null | undefined)[] = []
): number {
  let total = 0;
  for (const v of items) {
    if (typeof v === "number" && Number.isFinite(v)) {
      total += v;
    }
  }
  return total;
}

import type { MarketItem } from "./types";

/** Ubah daftar item market jadi data untuk <Select> */
export function toSelectData(items: MarketItem[]) {
  return items.map((i) => ({
    value: i.id,
    label: `${i.name} — ${idr(i.price)}`,
  }));
}
