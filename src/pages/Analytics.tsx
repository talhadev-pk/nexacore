import { useState } from "react";
import { useStore } from "../store/useStore";
import { group, totals, money } from "../data/seed";
import { Panel, Stat } from "../components/UI";
import { Chart } from "../components/Charts";
import {
  Download,
  Save,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Percent,
} from "lucide-react";
import { download, toCSV } from "../lib/data";
export default function Analytics({ mode = "analytics" }: { mode?: string }) {
  const { rows, patch, reports } = useStore();
  const [region, setRegion] = useState("All regions");
  const [metric, setMetric] = useState(
    mode === "operations" ? "orders" : "revenue",
  );
  const [by, setBy] = useState<"date" | "region" | "product" | "channel">(
    "date",
  );
  const [chart, setChart] = useState("area");
  const [period, setPeriod] = useState("all");
  const [saved, setSaved] = useState(false);
  const data = rows.filter(
    (r) =>
      (region === "All regions" || r.region === region) &&
      (period === "all" || Number(r.date.slice(5, 7)) > 6),
  );
  const t = totals(data);
  const grouped = group(data, by);
  const titles: Record<string, string> = {
    analytics: "Business intelligence",
    sales: "Sales intelligence",
    finance: "Financial overview",
    operations: "Operations monitoring",
  };
  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">EXPLORE. UNDERSTAND. ACT.</div>
          <h1>{titles[mode]}</h1>
          <p>
            Connected analysis, powered by your illustrative workspace data.
          </p>
        </div>
        <button onClick={() => download(`${mode}.csv`, toCSV(grouped))}>
          <Download size={15} /> Export data
        </button>
      </div>
      <div className="filter-bar">
        <label>
          Region
          <select
            aria-label="Region"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          >
            {["All regions", ...new Set(rows.map((r) => r.region))].map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </label>
        <label>
          Metric
          <select
            aria-label="Metric"
            value={metric}
            onChange={(e) => setMetric(e.target.value)}
          >
            {["revenue", "orders", "customers", "expenses", "profit"].map(
              (v) => (
                <option key={v}>{v}</option>
              ),
            )}
          </select>
        </label>
        <label>
          Group by
          <select
            aria-label="Group by"
            value={by}
            onChange={(e) => setBy(e.target.value as typeof by)}
          >
            {["date", "product", "region", "channel"].map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </label>
        <label>
          Period
          <select
            aria-label="Period"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            <option value="all">Full year</option>
            <option value="h2">Jul – Dec</option>
          </select>
        </label>
        <label>
          Visualization
          <select
            aria-label="Visualization"
            value={chart}
            onChange={(e) => setChart(e.target.value)}
          >
            {["area", "line", "bar", "donut", "pie"].map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </label>
        <button
          className="primary"
          onClick={() => {
            patch({
              reports: [
                ...reports,
                {
                  id: crypto.randomUUID(),
                  name: `${titles[mode]} · ${metric}`,
                  metric: metric as "revenue",
                  group: by,
                  region,
                  period,
                  date: new Date().toISOString(),
                },
              ],
            });
            setSaved(true);
          }}
        >
          <Save size={15} />
          {saved ? "Saved to reports" : "Save view"}
        </button>
      </div>
      <div className="stats-grid">
        <Stat
          label="Revenue"
          value={money(t.revenue)}
          icon={<DollarSign size={17} />}
        />
        <Stat
          label={
            mode === "operations" ? "Fulfilled records" : "Operating expenses"
          }
          value={
            mode === "operations"
              ? String(data.filter((r) => r.status === "Fulfilled").length)
              : money(t.expenses)
          }
          icon={<ShoppingBag size={17} />}
        />
        <Stat
          label="Net profit"
          value={money(t.profit)}
          icon={<TrendingUp size={17} />}
        />
        <Stat
          label="Profit margin"
          value={`${t.margin.toFixed(1)}%`}
          icon={<Percent size={17} />}
        />
      </div>
      <Panel
        title={`${metric[0].toUpperCase() + metric.slice(1)} by ${by === "date" ? "month" : by}`}
        sub={`${data.length} underlying sample records · hover to inspect`}
      >
        <Chart data={grouped} metric={metric} type={chart} height={340} />
      </Panel>
      <div className="two-col">
        <Panel
          title={
            mode === "operations"
              ? "Fulfillment exceptions"
              : "Channel performance"
          }
          sub="Calculated from current filters"
        >
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>{mode === "operations" ? "Record" : "Channel"}</th>
                  <th>{mode === "operations" ? "Status" : "Revenue"}</th>
                  <th>Orders</th>
                </tr>
              </thead>
              <tbody>
                {mode === "operations"
                  ? data
                      .filter((r) => r.status !== "Fulfilled")
                      .slice(0, 8)
                      .map((r) => (
                        <tr key={r.id}>
                          <td>{r.id}</td>
                          <td>
                            <span className="badge">{r.status}</span>
                          </td>
                          <td>{r.orders}</td>
                        </tr>
                      ))
                  : group(data, "channel").map((r) => (
                      <tr key={r.name}>
                        <td>{r.name}</td>
                        <td>{money(r.revenue)}</td>
                        <td>{r.orders}</td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </Panel>
        <Panel
          title={
            mode === "finance" ? "Financial context" : "Regional distribution"
          }
          sub={
            mode === "finance"
              ? "Illustrative values, not accounting or financial advice"
              : "Revenue across your selected data"
          }
        >
          <Chart data={group(data, "region")} type="bar" />
        </Panel>
      </div>
    </>
  );
}
