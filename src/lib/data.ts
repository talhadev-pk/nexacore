import { z } from "zod";
export const rowSchema = z.object({
  id: z.string().min(1),
  date: z.iso.date(),
  product: z.string().min(1),
  region: z.string().min(1),
  channel: z.string().min(1),
  revenue: z.coerce.number().nonnegative(),
  expenses: z.coerce.number().nonnegative(),
  orders: z.coerce.number().int().nonnegative(),
  customers: z.coerce.number().int().nonnegative(),
  status: z.string(),
  stock: z.coerce.number().nonnegative(),
  hours: z.coerce.number().nonnegative(),
  sessions: z.coerce.number().nonnegative().default(0),
});
export function csvParse(text: string) {
  const lines: string[][] = [];
  let row: string[] = [],
    value = "",
    quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') {
      if (quoted && text[i + 1] === '"') {
        value += '"';
        i++;
      } else quoted = !quoted;
    } else if (c === "," && !quoted) {
      row.push(value);
      value = "";
    } else if (c === "\n" && !quoted) {
      row.push(value.replace(/\r$/, ""));
      if (row.some(Boolean)) lines.push(row);
      row = [];
      value = "";
    } else value += c;
  }
  if (quoted) throw Error("Unclosed quoted field.");
  row.push(value.replace(/\r$/, ""));
  if (row.some(Boolean)) lines.push(row);
  const headers = lines.shift();
  if (!headers || !lines.length)
    throw Error("CSV needs headers and at least one record.");
  if (new Set(headers).size !== headers.length)
    throw Error("Duplicate column names.");
  return lines.map((r, i) => {
    if (r.length !== headers.length)
      throw Error(`Row ${i + 2}: column count does not match.`);
    return Object.fromEntries(headers.map((h, j) => [h.trim(), r[j]]));
  });
}
export function download(name: string, content: string, type = "text/csv") {
  const a = document.createElement("a");
  const url = URL.createObjectURL(new Blob([content], { type }));
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function toCSV(rows: object[]) {
  if (!rows.length) return "";
  const keys = Object.keys(rows[0]);
  const escape = (v: unknown) => `"${String(v ?? "").replaceAll('"', '""')}"`;
  return [
    keys.map(escape).join(","),
    ...rows.map((r) =>
      keys.map((k) => escape((r as Record<string, unknown>)[k])).join(","),
    ),
  ].join("\n");
}
export const kpiStatus = (actual: number, target: number) =>
  actual >= target
    ? "On Track"
    : actual >= target * 0.8
      ? "Needs Attention"
      : "Below Target";

export function formatDate(date: string, format: string) {
  const d = new Date(date);
  if (format === "YYYY-MM-DD") return d.toISOString().slice(0, 10);
  if (format === "DD/MM/YYYY") return d.toLocaleDateString("en-GB");
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}
