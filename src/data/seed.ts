export type Row = {
  id: string;
  date: string;
  product: string;
  region: string;
  channel: string;
  revenue: number;
  expenses: number;
  orders: number;
  customers: number;
  status: string;
  stock: number;
  hours: number;
  sessions: number;
};
export const seed: Row[] = Array.from({ length: 144 }, (_, i) => {
  const m = Math.floor(i / 12),
    n = i % 12;
  const revenue = Math.round(
    4600 +
      m * 390 +
      Math.sin(m * 1.5) * 1400 +
      Math.sin(i * 2.7) * 1800 +
      n * 180,
  );
  return {
    id: `NX-${1001 + i}`,
    date: `2026-${String(m + 1).padStart(2, "0")}-${String(n * 2 + 1).padStart(2, "0")}`,
    product: ["Analytics Pro", "Cloud Suite", "Data Connect", "Enterprise API"][
      i % 4
    ],
    region: ["North America", "Europe", "Asia Pacific", "Middle East"][i % 4],
    channel: ["Direct", "Partner", "Online"][i % 3],
    revenue,
    expenses: Math.round(revenue * (0.54 + (i % 4) * 0.03)),
    orders: 18 + (i % 22),
    customers: 10 + (i % 17),
    status: i % 11 === 0 ? "Delayed" : i % 5 === 0 ? "Processing" : "Fulfilled",
    stock: 35 + (i % 90),
    hours: 12 + (i % 36),
    sessions: 650 + (i % 22) * 35,
  };
});
export const money = (n: number) =>
  new Intl.NumberFormat(
    typeof document === "undefined"
      ? "en-US"
      : document.documentElement.lang || "en-US",
    { style: "currency", currency: "USD", maximumFractionDigits: 0 },
  ).format(n);
export function totals(rows: Row[]) {
  const revenue = rows.reduce((a, r) => a + r.revenue, 0),
    expenses = rows.reduce((a, r) => a + r.expenses, 0),
    orders = rows.reduce((a, r) => a + r.orders, 0),
    customers = rows.reduce((a, r) => a + r.customers, 0);
  const sessions = rows.reduce((a, r) => a + (r.sessions || 0), 0);
  return {
    revenue,
    expenses,
    orders,
    customers,
    sessions,
    conversion: sessions
      ? (rows.filter((r) => r.sessions > 0).reduce((a, r) => a + r.orders, 0) /
          sessions) *
        100
      : 0,
    profit: revenue - expenses,
    aov: orders ? revenue / orders : 0,
    margin: revenue ? ((revenue - expenses) / revenue) * 100 : 0,
  };
}
export function group(
  rows: Row[],
  key: "date" | "product" | "region" | "channel" = "date",
) {
  const map = new Map<
    string,
    {
      name: string;
      revenue: number;
      expenses: number;
      orders: number;
      customers: number;
      profit: number;
    }
  >();
  rows.forEach((r) => {
    const name =
      key === "date"
        ? new Date(r.date).toLocaleDateString("en-US", { month: "short" })
        : r[key];
    const v = map.get(name) || {
      name,
      revenue: 0,
      expenses: 0,
      orders: 0,
      customers: 0,
      profit: 0,
    };
    v.revenue += r.revenue;
    v.expenses += r.expenses;
    v.orders += r.orders;
    v.customers += r.customers;
    v.profit += r.revenue - r.expenses;
    map.set(name, v);
  });
  return [...map.values()];
}
export const customerRows = Array.from({ length: 48 }, (_, i) => ({
  id: `CUS-${i + 101}`,
  name: `Demo Organization ${String(i + 1).padStart(2, "0")}`,
  region: seed[i].region,
  segment: i % 3 === 0 ? "Enterprise" : i % 2 === 0 ? "Growth" : "Startup",
  orders: 2 + (i % 18),
  value: seed[i].revenue,
}));
export const productRows = [
  "Analytics Pro",
  "Cloud Suite",
  "Data Connect",
  "Enterprise API",
].map((name, i) => ({
  id: `PRD-${i + 1}`,
  name,
  stock: 120 + i * 45,
  price: 99 + i * 150,
  category: i % 2 ? "Infrastructure" : "Analytics",
}));
