import { useState } from "react";
import {
  Plus,
  Trash2,
  Pencil,
  Copy,
  ArrowUp,
  ArrowDown,
  Download,
  Target,
} from "lucide-react";
import { useStore } from "../store/useStore";
import { totals, group, money } from "../data/seed";
import { Chart } from "../components/Charts";
import { Panel, Modal } from "../components/UI";
import { kpiStatus, download, toCSV, formatDate } from "../lib/data";
const metrics = ["revenue", "orders", "customers", "expenses", "profit"];
export function KPIs() {
  const { kpis, rows, patch } = useStore();
  const [editing, setEditing] = useState<string | null>(null);
  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">FOCUS ON WHAT MOVES YOU FORWARD</div>
          <h1>KPI monitoring</h1>
          <p>
            Real targets. Transparent progress. A shared definition of success.
          </p>
        </div>
        <button className="primary" onClick={() => setEditing("new")}>
          <Plus size={16} /> Create KPI
        </button>
      </div>
      <div className="insights-grid">
        {kpis.map((k) => {
          const periodRows = rows.filter(
            (r) =>
              k.period === "Annual" ||
              Number(r.date.slice(5, 7)) > (k.period === "Quarterly" ? 9 : 11),
          );
          const actual =
            totals(periodRows)[k.metric as keyof ReturnType<typeof totals>];
          return (
            <Panel key={k.id} title={k.name} action={<Target size={18} />}>
              <div className="kpi-value">
                {k.metric === "orders" || k.metric === "customers"
                  ? actual.toLocaleString()
                  : money(actual)}
                <small>
                  {" "}
                  /{" "}
                  {k.metric === "orders" || k.metric === "customers"
                    ? k.target
                    : money(k.target)}
                </small>
              </div>
              <div className="progress">
                <i
                  style={{
                    width: `${Math.min(100, (actual / k.target) * 100)}%`,
                  }}
                />
              </div>
              <div className="chart-foot">
                <span className={`badge ${actual >= k.target ? "green" : ""}`}>
                  {kpiStatus(actual, k.target)}
                </span>
                <span>
                  {k.period} · {((actual / k.target) * 100).toFixed(1)}%
                </span>
              </div>
              <Chart
                data={group(periodRows)}
                metric={k.metric}
                type="line"
                height={130}
              />
              <div className="actions">
                <button onClick={() => setEditing(k.id)}>
                  <Pencil size={14} /> Edit
                </button>
                <button
                  aria-label={`Delete ${k.name}`}
                  onClick={() => {
                    if (confirm(`Delete ${k.name}?`))
                      patch({ kpis: kpis.filter((v) => v.id !== k.id) });
                  }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </Panel>
          );
        })}
      </div>
      <div className="notice">
        Status logic: On Track ≥ 100% of target; Needs Attention ≥ 80%; Below
        Target &lt; 80%. All metrics are higher-is-better targets. Annual uses
        the full dataset; Quarterly uses Oct–Dec; Monthly uses December.
      </div>
      {editing && (
        <Modal
          title={editing === "new" ? "Create a KPI" : "Edit KPI"}
          onClose={() => setEditing(null)}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              const k = {
                id: editing === "new" ? crypto.randomUUID() : editing,
                name: String(f.get("name")),
                metric: String(f.get("metric")) as "revenue",
                target: Number(f.get("target")),
                period: String(f.get("period")) as "Annual",
              };
              patch({
                kpis:
                  editing === "new"
                    ? [...kpis, k]
                    : kpis.map((v) => (v.id === editing ? k : v)),
              });
              setEditing(null);
            }}
          >
            <label>
              KPI name
              <input
                name="name"
                required
                defaultValue={kpis.find((k) => k.id === editing)?.name}
              />
            </label>
            <label>
              Metric
              <select
                name="metric"
                defaultValue={kpis.find((k) => k.id === editing)?.metric}
              >
                {metrics.map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </label>
            <label>
              Target
              <input
                name="target"
                type="number"
                required
                min="1"
                defaultValue={
                  kpis.find((k) => k.id === editing)?.target || 100000
                }
              />
            </label>
            <label>
              Measurement period
              <select
                name="period"
                defaultValue={kpis.find((k) => k.id === editing)?.period}
              >
                {["Annual", "Quarterly", "Monthly"].map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </label>
            <button className="primary">Save KPI</button>
          </form>
        </Modal>
      )}
    </>
  );
}
export function Forecasting() {
  const { rows } = useStore();
  const [horizon, setHorizon] = useState(3);
  const hist = group(rows);
  const n = hist.length;
  const mean = n ? hist.reduce((a, r) => a + r.revenue, 0) / n : 0;
  const mx = (n - 1) / 2;
  const denominator = hist.reduce((a, _, i) => a + (i - mx) ** 2, 0);
  const slope = denominator
    ? hist.reduce((a, r, i) => a + (i - mx) * (r.revenue - mean), 0) /
      denominator
    : 0;
  const forecast = Array.from({ length: horizon }, (_, i) => ({
    name: `F${i + 1}`,
    revenue: Math.max(0, Math.round(mean + slope * (n + i - mx))),
  }));
  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">LOOK AHEAD, WITH CONTEXT</div>
          <h1>Forecasting lab</h1>
          <p>A transparent demonstration of a simple linear trend.</p>
        </div>
        <label>
          Forecast horizon
          <select
            value={horizon}
            onChange={(e) => setHorizon(Number(e.target.value))}
          >
            <option value={3}>3 months</option>
            <option value={6}>6 months</option>
            <option value={12}>12 months</option>
          </select>
        </label>
      </div>
      <Panel
        title="Revenue · historical + trend projection"
        sub="F1 onward represents projected values, not observed revenue"
      >
        <Chart data={[...hist, ...forecast]} type="line" height={360} />
      </Panel>
      <div className="two-col">
        <Panel title="Model assumptions">
          <p className="body-text">
            Ordinary least squares fits monthly revenue against month index.
            Slope: {money(slope)} per month. The forecast continues that trend
            and floors predictions at zero. No seasonality, macroeconomic
            factors, uncertainty intervals, or external data are modeled.
          </p>
        </Panel>
        <Panel title="Projected revenue">
          <strong className="insight-value">
            {money(forecast.reduce((a, r) => a + r.revenue, 0))}
          </strong>
          <p className="body-text">
            Across the next {horizon} illustrative months. These projections are
            not professional financial predictions or guaranteed outcomes.
          </p>
        </Panel>
      </div>
    </>
  );
}
export function Builder() {
  const { dashboards, patch, rows } = useStore();
  const [selected, setSelected] = useState(dashboards[0]?.id || "");
  const d = dashboards.find((v) => v.id === selected) || dashboards[0];
  const [editing, setEditing] = useState(false);
  const update = (widgets: typeof d.widgets) =>
    patch({
      dashboards: dashboards.map((v) =>
        v.id === d.id ? { ...v, widgets } : v,
      ),
    });
  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">MAKE ROOM FOR YOUR PERSPECTIVE</div>
          <h1>Dashboard builder</h1>
          <p>
            Build your own view. Every change is saved automatically on this
            device.
          </p>
        </div>
        <div className="actions">
          <button
            onClick={() => {
              const id = crypto.randomUUID();
              patch({
                dashboards: [
                  ...dashboards,
                  { id, name: "Untitled dashboard", widgets: [] },
                ],
              });
              setSelected(id);
            }}
          >
            <Plus size={15} /> New
          </button>
          <button
            onClick={() => {
              const id = crypto.randomUUID();
              patch({
                dashboards: [
                  ...dashboards,
                  { ...d, id, name: `${d.name} copy` },
                ],
              });
              setSelected(id);
            }}
          >
            <Copy size={15} /> Duplicate
          </button>
        </div>
      </div>
      <div className="filter-bar">
        <select
          aria-label="Dashboard"
          value={d.id}
          onChange={(e) => setSelected(e.target.value)}
        >
          {dashboards.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name}
            </option>
          ))}
        </select>
        <button onClick={() => setEditing(true)}>
          <Pencil size={14} /> Rename
        </button>
        <button
          className="primary"
          onClick={() =>
            update([
              ...d.widgets,
              { id: crypto.randomUUID(), metric: "revenue", chart: "area" },
            ])
          }
        >
          <Plus size={15} /> Add widget
        </button>
      </div>
      <div className="two-col">
        {d.widgets.map((w, i) => (
          <Panel
            key={w.id}
            title={w.metric.toUpperCase()}
            action={
              <div className="actions">
                <button
                  aria-label="Move widget up"
                  disabled={i === 0}
                  onClick={() => {
                    const a = [...d.widgets];
                    [a[i - 1], a[i]] = [a[i], a[i - 1]];
                    update(a);
                  }}
                >
                  <ArrowUp size={14} />
                </button>
                <button
                  aria-label="Move widget down"
                  disabled={i === d.widgets.length - 1}
                  onClick={() => {
                    const a = [...d.widgets];
                    [a[i + 1], a[i]] = [a[i], a[i + 1]];
                    update(a);
                  }}
                >
                  <ArrowDown size={14} />
                </button>
                <button
                  aria-label="Remove widget"
                  onClick={() => update(d.widgets.filter((v) => v.id !== w.id))}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            }
          >
            <div className="actions widget-controls">
              <select
                aria-label="Widget metric"
                value={w.metric}
                onChange={(e) =>
                  update(
                    d.widgets.map((v) =>
                      v.id === w.id
                        ? { ...v, metric: e.target.value as "revenue" }
                        : v,
                    ),
                  )
                }
              >
                {metrics.map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
              <select
                aria-label="Widget visualization"
                value={w.chart}
                onChange={(e) =>
                  update(
                    d.widgets.map((v) =>
                      v.id === w.id
                        ? { ...v, chart: e.target.value as "area" }
                        : v,
                    ),
                  )
                }
              >
                {["area", "bar", "line", "donut"].map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </div>
            <Chart data={group(rows)} metric={w.metric} type={w.chart} />
          </Panel>
        ))}
      </div>
      {!d.widgets.length && (
        <div className="empty">
          Your canvas is ready. Add a widget to start exploring.
        </div>
      )}
      {editing && (
        <Modal title="Rename dashboard" onClose={() => setEditing(false)}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const name = String(new FormData(e.currentTarget).get("name"));
              patch({
                dashboards: dashboards.map((v) =>
                  v.id === d.id ? { ...v, name } : v,
                ),
              });
              setEditing(false);
            }}
          >
            <label>
              Name
              <input name="name" required defaultValue={d.name} />
            </label>
            <button className="primary">Save name</button>
          </form>
        </Modal>
      )}
    </>
  );
}
export function Reports() {
  const { reports, patch, rows, dateFormat } = useStore();
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [detail, setDetail] = useState<string | null>(null);
  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">GOOD DECISIONS DESERVE A RECORD</div>
          <h1>Saved reports</h1>
          <p>
            Your saved analytical views, recalculated from the current dataset.
          </p>
        </div>
        <button className="primary" onClick={() => setEditing("new")}>
          <Plus size={15} /> Create report
        </button>
      </div>
      <input
        className="report-search"
        aria-label="Filter reports"
        placeholder="Search reports…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="insights-grid">
        {reports
          .filter((r) => r.name.toLowerCase().includes(query.toLowerCase()))
          .map((r) => (
            <Panel
              key={r.id}
              title={r.name}
              sub={formatDate(r.date, dateFormat)}
            >
              <span className="badge purple">
                {r.metric} by {r.group}
              </span>
              <Chart
                data={group(
                  rows.filter(
                    (v) =>
                      (!r.region ||
                        r.region === "All regions" ||
                        v.region === r.region) &&
                      (!r.period ||
                        r.period === "all" ||
                        Number(v.date.slice(5, 7)) > 6),
                  ),
                  r.group,
                )}
                metric={r.metric}
                height={170}
              />
              <div className="actions">
                <button onClick={() => setDetail(r.id)}>View</button>
                <button
                  aria-label="Rename report"
                  onClick={() => setEditing(r.id)}
                >
                  <Pencil size={14} />
                </button>
                <button
                  aria-label="Export report"
                  onClick={() =>
                    download(
                      `${r.name}.csv`,
                      toCSV(
                        group(
                          rows.filter(
                            (v) =>
                              (!r.region ||
                                r.region === "All regions" ||
                                v.region === r.region) &&
                              (!r.period ||
                                r.period === "all" ||
                                Number(v.date.slice(5, 7)) > 6),
                          ),
                          r.group,
                        ),
                      ),
                    )
                  }
                >
                  <Download size={14} />
                </button>
                <button
                  aria-label="Delete report"
                  onClick={() => {
                    if (confirm(`Delete ${r.name}?`))
                      patch({ reports: reports.filter((v) => v.id !== r.id) });
                  }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </Panel>
          ))}
      </div>
      {!reports.length && (
        <div className="empty">
          No reports yet. Create one here or save an analytical view.
        </div>
      )}
      {editing && (
        <Modal
          title={editing === "new" ? "Create report" : "Rename report"}
          onClose={() => setEditing(null)}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              patch({
                reports:
                  editing === "new"
                    ? [
                        ...reports,
                        {
                          id: crypto.randomUUID(),
                          name: String(f.get("name")),
                          metric: String(f.get("metric")) as "revenue",
                          group: String(f.get("group")) as "date",
                          date: new Date().toISOString(),
                        },
                      ]
                    : reports.map((r) =>
                        r.id === editing
                          ? { ...r, name: String(f.get("name")) }
                          : r,
                      ),
              });
              setEditing(null);
            }}
          >
            <label>
              Report name
              <input
                name="name"
                required
                defaultValue={reports.find((r) => r.id === editing)?.name}
              />
            </label>
            {editing === "new" && (
              <>
                <label>
                  Metric
                  <select name="metric">
                    {metrics.map((m) => (
                      <option key={m}>{m}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Group by
                  <select name="group">
                    {["date", "product", "region", "channel"].map((m) => (
                      <option key={m}>{m}</option>
                    ))}
                  </select>
                </label>
              </>
            )}
            <button className="primary">Save report</button>
          </form>
        </Modal>
      )}
      {detail && (
        <Modal
          title={reports.find((r) => r.id === detail)?.name || "Report"}
          onClose={() => setDetail(null)}
        >
          <p className="body-text">
            Saved view of current illustrative data; values update when records
            change.
          </p>
          <Chart
            data={group(
              rows.filter((v) => {
                const r = reports.find((r) => r.id === detail);
                return (
                  (!r?.region ||
                    r.region === "All regions" ||
                    v.region === r.region) &&
                  (!r?.period ||
                    r.period === "all" ||
                    Number(v.date.slice(5, 7)) > 6)
                );
              }),
              reports.find((r) => r.id === detail)?.group as "date",
            )}
            metric={reports.find((r) => r.id === detail)?.metric}
          />
        </Modal>
      )}
    </>
  );
}
