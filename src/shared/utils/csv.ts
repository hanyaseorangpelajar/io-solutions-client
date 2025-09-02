// Util sederhana untuk download CSV di client
export function downloadCSV(
  filename: string,
  headers: string[],
  rows: (string | number)[][]
) {
  const esc = (v: string | number) => {
    const s = String(v ?? "");
    // escape double quotes
    const e = s.replace(/"/g, '""');
    // jika mengandung koma, newline, atau kutip → bungkus dengan "
    return /[",\n]/.test(e) ? `"${e}"` : e;
  };

  const lines = [
    headers.map(esc).join(","),
    ...rows.map((r) => r.map(esc).join(",")),
  ].join("\n");
  const blob = new Blob(["\uFEFF" + lines], {
    type: "text/csv;charset=utf-8;",
  }); // BOM untuk Excel
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
