import { Link, useParams } from "react-router-dom";
import {
  ArrowRight,
  ChartNoAxesCombined,
  Sparkles,
  Database,
  PanelsTopLeft,
  Target,
  Workflow,
  Check,
  ArrowUpRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Chart } from "../components/Charts";
import { group, seed, totals, money } from "../data/seed";
import { Footer, Panel } from "../components/UI";
const features = [
  {
    icon: ChartNoAxesCombined,
    name: "Business intelligence",
    text: "Go from raw numbers to a clear narrative. Compare metrics, group data, and explore the signals that matter.",
  },
  {
    icon: Sparkles,
    name: "Explainable insights",
    text: "Local, deterministic analysis shows the arithmetic behind every observation. No hidden models. No invented certainty.",
  },
  {
    icon: Database,
    name: "Frictionless exploration",
    text: "Search, sort, filter, import, and export. Work with your data without losing sight of the bigger picture.",
  },
  {
    icon: PanelsTopLeft,
    name: "Your dashboard, your way",
    text: "Create a view that fits your role. Add widgets, choose visualizations, and save your workspace.",
  },
  {
    icon: Target,
    name: "Purposeful KPI tracking",
    text: "Set a target and understand your progress with transparent, calculated statuses.",
  },
  {
    icon: Workflow,
    name: "Connected operations",
    text: "Connect sales, finance, customers, and fulfillment in one consistent analytical workspace.",
  },
];
export default function Marketing() {
  const { page } = useParams();
  useEffect(() => {
    document.title = `NexaCore — ${page ? page[0].toUpperCase() + page.slice(1) : "Turn Business Data Into Better Decisions"}`;
  }, [page]);
  const [sent, setSent] = useState(false);
  const isHome = !page;
  return (
    <div className="marketing">
      <nav className="marketing-nav">
        <Link to="/website" className="brand">
          <span className="brand-mark">N</span>NexaCore
          <span className="brand-dot">®</span>
        </Link>
        <div>
          {["Features", "Solutions", "Pricing", "About", "Contact"].map((p) => (
            <Link
              className={page === p.toLowerCase() ? "active" : ""}
              key={p}
              to={`/website/${p.toLowerCase()}`}
            >
              {p}
            </Link>
          ))}
        </div>
        <Link className="button primary" to="/app">
          Explore platform <ArrowUpRight size={15} />
        </Link>
      </nav>
      <main>
        {isHome ? (
          <>
            <section className="hero">
              <span className="hero-tag">
                <span className="live-dot" /> INTELLIGENCE, WITHOUT THE
                COMPLEXITY
              </span>
              <h1>
                Less noise.
                <br />
                More <span>perspective.</span>
              </h1>
              <p>
                Turn Business Data Into Better Decisions.
                <br />
                Meet your connected workspace for analytics, insights, and the
                next big idea.
              </p>
              <div className="actions">
                <Link className="button primary" to="/app">
                  Explore platform <ArrowRight size={17} />
                </Link>
                <Link className="button" to="/website/features">
                  View features
                </Link>
              </div>
              <small>
                No signup. No live business data. Just possibilities.
              </small>
              <div className="marketing-preview">
                <div className="preview-bar">
                  <span className="brand">
                    <span className="brand-mark">N</span> NexaCore
                  </span>
                  <span className="badge purple">INTERACTIVE PREVIEW</span>
                </div>
                <div className="preview-content">
                  <div>
                    <div className="eyebrow">THE BIG PICTURE</div>
                    <h2>Your next decision starts here.</h2>
                    <strong>{money(totals(seed).revenue)}</strong>
                    <p>Total illustrative revenue</p>
                    <Link to="/app">
                      Open your workspace <ArrowRight size={16} />
                    </Link>
                  </div>
                  <div>
                    <Chart data={group(seed)} height={235} />
                  </div>
                </div>
              </div>
            </section>
            <section className="marketing-section">
              <div className="eyebrow">ONE CONNECTED WORKSPACE</div>
              <h2>
                Built for the questions
                <br />
                that move business forward.
              </h2>
              <div className="feature-grid">
                {features.map((f) => (
                  <article key={f.name}>
                    <f.icon size={24} />
                    <h3>{f.name}</h3>
                    <p>{f.text}</p>
                    <Link to="/website/features">
                      Discover more <ArrowUpRight size={15} />
                    </Link>
                  </article>
                ))}
              </div>
            </section>
            <section className="marketing-section split-feature">
              <div>
                <div className="eyebrow">CONTEXT IS YOUR COMPETITIVE EDGE</div>
                <h2>
                  Not just another chart.
                  <br />A clearer understanding.
                </h2>
                <p>
                  Explore revenue trends, discover the story behind your
                  customer base, and keep operations in focus. Every chart
                  connects to the same sample dataset.
                </p>
                <Link to="/app/insights" className="button primary">
                  Meet local insights <Sparkles size={16} />
                </Link>
              </div>
              <Panel
                title="A signal worth exploring"
                sub="LOCALLY GENERATED · DEMONSTRATION"
              >
                <Sparkles size={30} />
                <h2>
                  Find the story
                  <br />
                  behind the numbers.
                </h2>
                <p className="body-text">
                  Revenue observations. Operational exceptions. Product mix.
                  Transparent calculations, supported by the data you can
                  inspect.
                </p>
                <Chart data={group(seed, "product")} type="bar" height={180} />
              </Panel>
            </section>
            <section className="marketing-section">
              <div className="eyebrow">FOR EVERY PERSPECTIVE</div>
              <h2>One platform. Many ways forward.</h2>
              <div className="solution-grid">
                {[
                  "Business owners",
                  "Analysts",
                  "Operations managers",
                  "Sales teams",
                  "Finance teams",
                  "Marketing teams",
                ].map((x) => (
                  <Link key={x} to="/website/solutions">
                    <h3>{x}</h3>
                    <ArrowUpRight size={20} />
                  </Link>
                ))}
              </div>
            </section>
            <section className="marketing-section faq">
              <div className="eyebrow">A FEW GOOD QUESTIONS</div>
              <h2>Clarity, from the start.</h2>
              {[
                [
                  "Is NexaCore connected to a real business?",
                  "No. All business records, financial metrics, and organizations are fictional or illustrative.",
                ],
                [
                  "Is there a live AI model?",
                  "No. Insights use deterministic local calculations on the workspace dataset. No API calls or secrets are required.",
                ],
                [
                  "Where does my data go?",
                  "Your workspace stays in localStorage in this browser. You can export a backup, import a CSV, or clear your data in settings.",
                ],
                [
                  "Can I use this offline?",
                  "After loading, workspace interactions are local. This is a static demonstration, not a production SaaS or accounting system.",
                ],
              ].map(([q, a]) => (
                <details key={q}>
                  <summary>{q}</summary>
                  <p>{a}</p>
                </details>
              ))}
            </section>
            <section className="final-cta">
              <div className="eyebrow">YOUR NEXT CHAPTER, IN FOCUS</div>
              <h2>See what’s possible.</h2>
              <p>A better perspective is one click away.</p>
              <Link to="/app" className="button primary">
                Explore NexaCore <ArrowRight size={17} />
              </Link>
            </section>
          </>
        ) : (
          <section className="marketing-section public-page">
            <div className="eyebrow">NEXACORE / {page?.toUpperCase()}</div>
            <h1>
              {(
                {
                  features: "Clarity is a powerful feature.",
                  solutions: "A shared view. A stronger business.",
                  pricing: "Big possibilities. Clear plans.",
                  about: "Built with a different perspective.",
                  contact: "Let’s start a conversation.",
                } as Record<string, string>
              )[page || ""] || "Explore NexaCore"}
            </h1>
            {page === "features" ? (
              <>
                <p className="lead">
                  Connected analytics, transparent insights, and a workspace
                  that feels like yours.
                </p>
                <div className="feature-grid">
                  {features.map((f) => (
                    <article key={f.name}>
                      <f.icon />
                      <h3>{f.name}</h3>
                      <p>{f.text}</p>
                    </article>
                  ))}
                </div>
                <Panel title="Forecasting & reporting">
                  <p className="body-text">
                    Project historical trends using a transparent linear model.
                    Save analytical views and export genuine CSV reports.
                    Forecasts are illustrative, not professional predictions.
                  </p>
                </Panel>
              </>
            ) : page === "solutions" ? (
              <div className="feature-grid">
                {[
                  "Business owners",
                  "Analysts",
                  "Operations managers",
                  "Sales teams",
                  "Finance teams",
                  "Marketing teams",
                ].map((s, i) => (
                  <article key={s}>
                    <span className="eyebrow">0{i + 1}</span>
                    <h3>{s}</h3>
                    <p>
                      {
                        [
                          "Monitor the whole business, from revenue to fulfillment.",
                          "Group, visualize, and inspect the records behind each decision.",
                          "Keep fulfillment exceptions and inventory in focus.",
                          "Compare channels, markets, and product performance.",
                          "Understand illustrative expenses, revenue, and profit.",
                          "Explore geographic customer segments and acquisition context.",
                        ][i]
                      }
                    </p>
                    <Link
                      to={
                        [
                          "/app",
                          "/app/analytics",
                          "/app/operations",
                          "/app/sales",
                          "/app/finance",
                          "/app/customers",
                        ][i]
                      }
                    >
                      Explore workspace <ArrowRight size={15} />
                    </Link>
                  </article>
                ))}
              </div>
            ) : page === "pricing" ? (
              <>
                <p className="lead">
                  Illustrative pricing for a demonstration product. No payments,
                  subscriptions, or billing are implemented.
                </p>
                <div className="pricing-grid">
                  {["Free", "Professional", "Enterprise"].map((p, i) => (
                    <article className={i === 1 ? "featured" : ""} key={p}>
                      <span className="eyebrow">{p.toUpperCase()}</span>
                      <h2>
                        {["$0", "$29", "Let’s talk"][i]}
                        <small>{i < 2 ? " / month" : ""}</small>
                      </h2>
                      <p>
                        {
                          [
                            "Explore the fundamentals",
                            "Find your analytical edge",
                            "A shared enterprise perspective",
                          ][i]
                        }
                      </p>
                      {[
                        "Interactive dashboards",
                        "Local insights & CSV export",
                        i === 0
                          ? "Sample datasets"
                          : i === 1
                            ? "Custom KPI tracking"
                            : "Workspace backup & controls",
                      ].map((v) => (
                        <p className="check-line" key={v}>
                          <Check size={15} />
                          {v}
                        </p>
                      ))}
                      <Link
                        className={`button ${i === 1 ? "primary" : ""}`}
                        to="/app"
                      >
                        Try the full demo <ArrowRight size={15} />
                      </Link>
                    </article>
                  ))}
                </div>
              </>
            ) : page === "about" ? (
              <div className="about-copy">
                <p className="lead">
                  Business data should open doors, not create barriers.
                </p>
                <p>
                  NexaCore is a portfolio project designed and developed by
                  Talha. It brings analytics, data exploration, and transparent
                  local intelligence into one coherent frontend experience.
                </p>
                <p>
                  Built with React, TypeScript, and a belief that the best
                  interfaces make complex work feel simple. This demonstration
                  uses illustrative records, browser persistence, and no backend
                  or real AI service.
                </p>
                <Link className="button primary" to="/app">
                  Explore the work <ArrowRight size={16} />
                </Link>
              </div>
            ) : page === "contact" ? (
              <div className="contact-layout">
                <div>
                  <p className="lead">Have a question about the project?</p>
                  <p>
                    This form demonstrates input validation only. Nothing is
                    transmitted or emailed.
                  </p>
                  <p>
                    Developer: Talha
                    <br />
                    talhamalikawan@example.com
                  </p>
                </div>
                <form
                  className="panel"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSent(true);
                  }}
                >
                  <label>
                    Your name
                    <input required name="name" />
                  </label>
                  <label>
                    Email address
                    <input required name="email" type="email" />
                  </label>
                  <label>
                    Message
                    <textarea required name="message" minLength={10} rows={5} />
                  </label>
                  <button className="primary">
                    Validate demo submission <ArrowRight size={15} />
                  </button>
                  {sent && (
                    <p className="positive" role="status">
                      Your form is valid. This is a demo; no message was sent.
                    </p>
                  )}
                </form>
              </div>
            ) : null}
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
