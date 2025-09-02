// Kumpulan util sederhana untuk agregasi & export

export function monthKey(d: Date | string | number): `${number}-${number}` {
  const dt = new Date(d);
  return `${dt.getFullYear()}-${dt.getMonth() + 1}` as `${number}-${number}`;
}

export function toCsv<T extends Record<string, any>>(
  rows: T[],
  headerOrder?: (keyof T)[]
) {
  if (!rows.length) return "";
  const keys = (
    headerOrder?.length ? headerOrder : Object.keys(rows[0])
  ) as string[];
  const esc = (v: any) => {
    if (v == null) return "";
    const s = String(v);
    if (s.includes('"') || s.includes(",") || s.includes("\n")) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };
  const header = keys.join(",");
  const body = rows
    .map((r) => keys.map((k) => esc((r as any)[k])).join(","))
    .join("\n");
  return header + "\n" + body;
}

export function downloadCsv(filename: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
