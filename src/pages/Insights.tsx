import { useState } from "react";
import {
  Sparkles,
  Bookmark,
  ArrowUpRight,
  Check,
  RefreshCw,
} from "lucide-react";
import { useStore } from "../store/useStore";
import { group, totals, money } from "../data/seed";
import { Chart } from "../components/Charts";
import { Panel } from "../components/UI";
export default function Insights() {
  const { rows, insights, patch } = useStore();
  const [processing, setProcessing] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const t = totals(rows),
    products = group(rows, "product").sort((a, b) => b.revenue - a.revenue),
    regions = group(rows, "region").sort((a, b) => b.revenue - a.revenue);
  const delayed = rows.filter((r) => r.status === "Delayed");
  const cards = [
    {
      id: "product",
      category: "REVENUE OPPORTUNITY",
      title: `${products[0]?.name || "No product"} leads revenue`,
      text: products.length
        ? `${products[0].name} contributes ${money(products[0].revenue)}, representing ${((products[0].revenue / t.revenue) * 100).toFixed(1)}% of total revenue. Compare product mix before reallocating resources.`
        : "Import records to analyze product revenue.",
      metric: money(products[0]?.revenue || 0),
      data: products,
    },
    {
      id: "region",
      category: "MARKET PERFORMANCE",
      title: `${regions[0]?.name || "No region"} is your largest market`,
      text: regions.length
        ? `Summing revenue by region yields ${money(regions[0].revenue)} for ${regions[0].name}. This describes the dataset; it does not establish future demand.`
        : "No regional records available.",
      metric: money(regions[0]?.revenue || 0),
      data: regions,
    },
    {
      id: "operations",
      category: "OPERATIONAL OBSERVATION",
      title: `${delayed.length} records need a closer look`,
      text: `${delayed.length} of ${rows.length} records are marked Delayed (${rows.length ? ((delayed.length / rows.length) * 100).toFixed(1) : 0}%). Review fulfillment exceptions. No cause is inferred from this status alone.`,
      metric: `${delayed.length} delayed`,
      data: group(delayed),
    },
  ];
  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">A CLEARER WAY TO SEE THE SIGNAL</div>
          <h1>
            AI insights <Sparkles size={25} />
          </h1>
          <p>
            Transparent, deterministic analysis. Useful context, without the
            black box.
          </p>
        </div>
        <button
          className="primary"
          disabled={processing}
          onClick={() => {
            setProcessing(true);
            setTimeout(() => setProcessing(false), 900);
          }}
        >
          <RefreshCw size={15} className={processing ? "spin" : ""} />
          {processing ? "Analyzing local data…" : "Generate insights"}
        </button>
      </div>
      <div className="notice">
        <Sparkles size={19} />
        <div>
          <strong>Local analytical engine · not a live AI model</strong>
          <p>
            Insights are generated from arithmetic on your current dataset. No
            external AI service, statistical confidence, or causal claims are
            used.
          </p>
        </div>
      </div>
      <div className="tabs">
        <button
          className={!showSaved ? "active" : ""}
          onClick={() => setShowSaved(false)}
        >
          All insights ({cards.length})
        </button>
        <button
          className={showSaved ? "active" : ""}
          onClick={() => setShowSaved(true)}
        >
          Saved ({insights.length})
        </button>
      </div>
      <div className={`insights-grid ${processing ? "processing" : ""}`}>
        {cards
          .filter((c) => !showSaved || insights.includes(c.id))
          .map((c) => (
            <Panel
              key={c.id}
              title={c.category}
              action={<span className="badge purple">LOCALLY GENERATED</span>}
            >
              <h2>{c.title}</h2>
              <strong className="insight-value">
                {c.metric} <ArrowUpRight size={23} />
              </strong>
              <p className="body-text">{c.text}</p>
              <Chart data={c.data} type="bar" height={180} />
              <div className="chart-foot">
                <span>Method: grouped sums / record counts</span>
                <button
                  onClick={() =>
                    patch({
                      insights: insights.includes(c.id)
                        ? insights.filter((id) => id !== c.id)
                        : [...insights, c.id],
                    })
                  }
                >
                  {insights.includes(c.id) ? (
                    <Check size={14} />
                  ) : (
                    <Bookmark size={14} />
                  )}{" "}
                  {insights.includes(c.id) ? "Saved" : "Save"}
                </button>
              </div>
            </Panel>
          ))}
      </div>
      {showSaved && !insights.length && (
        <div className="empty">
          No saved insights yet. Save an insight to revisit it here.
        </div>
      )}
    </>
  );
}
