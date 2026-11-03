import { useState } from "react";
import {
  DollarSign,
  ShoppingBag,
  Users,
  ArrowUpRight,
  ArrowRight,
  Sparkles,
  Download,
  CalendarDays,
  ChevronDown,
  Globe2,
  Activity,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useStore } from "../store/useStore";
import { group, money, totals } from "../data/seed";
import { Chart, colors } from "../components/Charts";
import { Panel, Stat } from "../components/UI";
import { download, toCSV } from "../lib/data";
export default function Overview() {
  const { rows, profile } = useStore();
  const [period, setPeriod] = useState("year");
  const filtered = rows.filter(
    (r) =>
      period === "year" ||
      Number(r.date.slice(5, 7)) > (period === "quarter" ? 9 : 11),
  );
  const t = totals(filtered),
    monthly = group(filtered),
    regions = group(filtered, "region"),
    products = group(filtered, "product");
  const half = Math.floor(filtered.length / 2);
  const prev = totals(filtered.slice(0, half)),
    next = totals(filtered.slice(half));
  const change = (a: number, b: number) => (b ? ((a - b) / b) * 100 : 0);
  const [trend, setTrend] = useState("revenue");
  return (
    <>
      <div className="breadcrumb">
        Workspace <span>/</span> Overview
      </div>
      <div className="page-heading">
        <div>
          <div className="eyebrow">YOUR BUSINESS, AT A GLANCE</div>
          <h1>
            Executive overview<span className="heading-dot">.</span>
          </h1>
          <p>
            Welcome back, {profile.name}. Here’s how your business is
            performing.
          </p>
        </div>
        <div className="actions">
          <label className="select-wrap">
            <CalendarDays size={15} />
            <select
              aria-label="Reporting period"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            >
              <option value="year">Jan 1 – Dec 31, 2026</option>
              <option value="quarter">Q4 · Oct – Dec 2026</option>
              <option value="month">December 2026</option>
            </select>
          </label>
          <button
            onClick={() => download("nexacore-overview.csv", toCSV(filtered))}
          >
            <Download size={15} /> Export report
          </button>
        </div>
      </div>
      <div className="demo-strip">
        <span>
          <span className="live-dot" /> Demonstration workspace{" "}
          <span className="muted">
            · All metrics are powered by sample data
          </span>
        </span>
        <Link to="/app/data">
          Explore datasets <ArrowRight size={13} />
        </Link>
      </div>
      <div className="stats-grid">
        <Stat
          label="Total revenue"
          value={money(t.revenue)}
          change={change(next.revenue, prev.revenue)}
          icon={<DollarSign size={17} />}
        />
        <Stat
          label="Total orders"
          value={t.orders.toLocaleString()}
          change={change(next.orders, prev.orders)}
          icon={<ShoppingBag size={17} />}
        />
        <Stat
          label="Total customers"
          value={t.customers.toLocaleString()}
          change={change(next.customers, prev.customers)}
          icon={<Users size={17} />}
        />
        <Stat
          label="Average order value"
          value={money(t.aov)}
          change={change(next.aov, prev.aov)}
          icon={<Activity size={17} />}
        />
      </div>
      <div className="overview-main">
        <Panel
          title="Revenue overview"
          sub="A clearer picture of your business performance"
          action={
            <select
              aria-label="Chart metric"
              value={trend}
              onChange={(e) => setTrend(e.target.value)}
            >
              <option value="revenue">Revenue</option>
              <option value="profit">Net profit</option>
              <option value="orders">Orders</option>
            </select>
          }
        >
          <div className="chart-summary">
            <strong>
              {trend === "orders"
                ? t.orders.toLocaleString()
                : money(trend === "profit" ? t.profit : t.revenue)}
            </strong>
            <span className="badge green">
              ↗ {change(next.revenue, prev.revenue).toFixed(1)}%
            </span>
            <div className="chart-legend">
              <span>
                <i /> {trend}
              </span>
              <span>
                <i className="gray" /> Expenses
              </span>
            </div>
          </div>
          <Chart data={monthly} metric={trend} />
          <div className="chart-foot">
            <span>
              <span className="live-dot" /> Calculated from {filtered.length}{" "}
              sample records
            </span>
            <Link to="/app/analytics">
              View analytics <ArrowUpRight size={14} />
            </Link>
          </div>
        </Panel>
        <Panel
          title="Revenue by region"
          sub="Where your business is growing"
          action={<Globe2 size={17} className="muted" />}
        >
          <div className="donut-holder">
            <Chart data={regions} type="donut" height={190} />
            <div className="donut-center">
              <span>Total revenue</span>
              <strong>{(t.revenue / 1000).toFixed(0)}k</strong>
              <span>USD · illustrative</span>
            </div>
          </div>
          <div className="region-list">
            {regions.map((r, i) => (
              <div key={r.name}>
                <span>
                  <i style={{ background: colors[i] }} />
                  {r.name}
                </span>
                <strong>
                  {t.revenue ? ((r.revenue / t.revenue) * 100).toFixed(1) : 0}%
                </strong>
              </div>
            ))}
          </div>
        </Panel>
      </div>
      <div className="insight-banner">
        <div className="ai-icon">
          <Sparkles size={22} />
        </div>
        <div>
          <div className="inline">
            <h3>A little insight. A bigger perspective.</h3>
            <span className="badge purple">LOCAL INSIGHTS</span>
          </div>
          <p>
            {products.length
              ? `${products.reduce((a, b) => (a.revenue > b.revenue ? a : b)).name} leads product revenue. Explore the numbers behind your next decision.`
              : "Import a dataset to unlock locally generated insights."}
          </p>
        </div>
        <Link className="button" to="/app/insights">
          Explore AI insights <ArrowRight size={15} />
        </Link>
      </div>
      <div className="overview-bottom">
        <Panel
          title="Product performance"
          sub="Your top revenue-driving products"
          action={
            <Link to="/app/sales" className="text-link">
              View all <ArrowUpRight size={14} />
            </Link>
          }
        >
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Revenue</th>
                  <th>Orders</th>
                  <th>Share</th>
                </tr>
              </thead>
              <tbody>
                {products
                  .sort((a, b) => b.revenue - a.revenue)
                  .map((r, i) => (
                    <tr key={r.name}>
                      <td>
                        <span className={`product-icon p${i}`}>
                          {["◈", "▦", "⌘", "◇"][i]}
                        </span>
                        <strong>{r.name}</strong>
                      </td>
                      <td>{money(r.revenue)}</td>
                      <td>{r.orders}</td>
                      <td>
                        <span className="mini-track">
                          <i
                            style={{
                              width: `${t.revenue ? (r.revenue / t.revenue) * 100 : 0}%`,
                            }}
                          />
                        </span>
                        {t.revenue
                          ? ((r.revenue / t.revenue) * 100).toFixed(1)
                          : 0}
                        %
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Panel>
        <Panel
          title="Business activity"
          sub="Recent events in your sample workspace"
          action={<span className="badge">SAMPLE</span>}
        >
          <div className="activity-list">
            {[
              {
                icon: "↗",
                title: "Performance summary available",
                desc: `${monthly.length} reporting periods ready for review`,
                time: "Dataset",
              },
              {
                icon: "◇",
                title: "Product analysis refreshed",
                desc: `${products.length} product lines in your workspace`,
                time: "Local",
              },
              {
                icon: "✓",
                title: "Fulfillment overview",
                desc: `${filtered.filter((r) => r.status === "Fulfilled").length} records marked fulfilled`,
                time: "Sample",
              },
            ].map((e) => (
              <div className="activity-item" key={e.title}>
                <span className="activity-icon">{e.icon}</span>
                <div>
                  <strong>{e.title}</strong>
                  <p>{e.desc}</p>
                </div>
                <small>{e.time}</small>
              </div>
            ))}
          </div>
          <Link className="activity-link" to="/app/operations">
            View operations <ArrowRight size={14} />
          </Link>
        </Panel>
      </div>
      <div className="stats-grid secondary-stats">
        <Stat
          label="Operating expenses"
          value={money(t.expenses)}
          icon={<DollarSign size={17} />}
        />
        <Stat
          label="Net profit"
          value={money(t.profit)}
          icon={<Activity size={17} />}
        />
        <Stat
          label="Order conversion"
          value={`${t.conversion.toFixed(2)}%`}
          icon={<ShoppingBag size={17} />}
        />
        <Stat
          label="Revenue growth"
          value={`${change(next.revenue, prev.revenue).toFixed(1)}%`}
          icon={<ArrowUpRight size={17} />}
        />
      </div>
      <p className="metric-note">
        Metric definitions: customer counts are summed sample observations, not
        deduplicated identities. Conversion = orders with recorded sessions ÷
        those sample sessions; imports without sessions are excluded. Growth
        compares the second half of selected records with the first half,
        ordered as stored.
      </p>
      <div className="workspace-status">
        <span>
          <span className="live-dot" /> Workspace ready{" "}
          <span className="muted">· Stored locally on this device</span>
        </span>
        <span>
          Data period: 2026 <ChevronDown size={12} />
        </span>
      </div>
    </>
  );
}
