import { create } from "zustand";
import { persist } from "zustand/middleware";
import { z } from "zod";
import { seed } from "../data/seed";
import { safeStorage, archiveInvalidState } from "../lib/storage";
import { rowSchema } from "../lib/data";
const report = z.object({
  id: z.string(),
  name: z.string(),
  metric: z.enum(["revenue", "orders", "customers", "expenses", "profit"]),
  group: z.enum(["date", "region", "product", "channel"]),
  date: z.string(),
  region: z.string().optional(),
  period: z.string().optional(),
});
const widget = z.object({
  id: z.string(),
  metric: z.enum(["revenue", "orders", "customers", "expenses", "profit"]),
  chart: z.enum(["area", "bar", "line", "donut"]),
});
export const workspaceSchema = z.object({
  profile: z.object({ name: z.string().min(1), email: z.email() }),
  theme: z.enum(["light", "dark", "system"]),
  dateFormat: z.string(),
  numberFormat: z.string(),
  rows: z.array(rowSchema),
  reports: z.array(report),
  insights: z.array(z.string()),
  kpis: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      target: z.number().positive(),
      metric: z.enum(["revenue", "orders", "customers", "expenses", "profit"]),
      period: z.enum(["Annual", "Quarterly", "Monthly"]),
    }),
  ),
  dashboards: z
    .array(
      z.object({ id: z.string(), name: z.string(), widgets: z.array(widget) }),
    )
    .min(1),
});
export type Workspace = z.infer<typeof workspaceSchema>;
export const defaults: Workspace = {
  profile: { name: "Talha", email: "talhamalikawan@example.com" },
  theme: "light",
  dateFormat: "MMM DD, YYYY",
  numberFormat: "en-US",
  rows: seed,
  reports: [],
  insights: [],
  kpis: [
    {
      id: "revenue",
      name: "Revenue target",
      target: 1200000,
      metric: "revenue",
      period: "Annual",
    },
    {
      id: "orders",
      name: "Order volume",
      target: 5000,
      metric: "orders",
      period: "Annual",
    },
  ],
  dashboards: [
    {
      id: "default",
      name: "My executive dashboard",
      widgets: [
        { id: "w1", metric: "revenue", chart: "area" },
        { id: "w2", metric: "orders", chart: "bar" },
      ],
    },
  ],
};
type Store = Workspace & { patch: (p: Partial<Workspace>) => void };
export const useStore = create<Store>()(
  persist((set) => ({ ...defaults, patch: (p) => set(p) }), {
    name: "nexacore-workspace",
    version: 1,
    storage: safeStorage<Workspace>(),
    merge: (saved, current) => {
      if (saved === undefined || saved === null) return current;
      const p = workspaceSchema.safeParse(saved);
      if (p.success) return { ...current, ...p.data };
      archiveInvalidState(saved);
      return current;
    },
  }),
);
