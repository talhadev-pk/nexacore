import { lazy, Suspense, useEffect, useState } from "react";
import {
  HashRouter,
  Routes,
  Route,
  NavLink,
  Link,
  useLocation,
  useNavigate,
  Navigate,
} from "react-router-dom";
import {
  LayoutDashboard,
  ChartNoAxesCombined,
  Sparkles,
  Database,
  FileChartColumn,
  Target,
  TrendingUp,
  Wallet,
  Users,
  Workflow,
  ChartSpline,
  PanelsTopLeft,
  Settings,
  Search,
  Bell,
  ChevronDown,
  ArrowUpRight,
  HelpCircle,
  PanelLeftClose,
  Menu,
  Sun,
  Moon,
  Command,
} from "lucide-react";
import { motion, AnimatePresence, MotionConfig } from "motion/react";
import { useStore } from "./store/useStore";
import { storageWarning } from "./lib/storage";
import { Footer, Modal } from "./components/UI";
const Overview = lazy(() => import("./pages/Overview"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Insights = lazy(() => import("./pages/Insights"));
const DataExplorer = lazy(() => import("./pages/DataExplorer"));
const SettingsPage = lazy(() => import("./pages/Settings"));
const Marketing = lazy(() => import("./pages/Marketing"));
const KPIs = lazy(() =>
  import("./pages/Advanced").then((m) => ({ default: m.KPIs })),
);
const Reports = lazy(() =>
  import("./pages/Advanced").then((m) => ({ default: m.Reports })),
);
const Forecasting = lazy(() =>
  import("./pages/Advanced").then((m) => ({ default: m.Forecasting })),
);
const Builder = lazy(() =>
  import("./pages/Advanced").then((m) => ({ default: m.Builder })),
);
const nav = [
  { name: "Overview", path: "", icon: LayoutDashboard },
  { name: "Analytics", path: "analytics", icon: ChartNoAxesCombined },
  { name: "AI Insights", path: "insights", icon: Sparkles },
  { name: "Data Explorer", path: "data", icon: Database },
  { name: "Reports", path: "reports", icon: FileChartColumn },
  { name: "KPIs", path: "kpis", icon: Target },
  { name: "Sales", path: "sales", icon: TrendingUp },
  { name: "Finance", path: "finance", icon: Wallet },
  { name: "Customers", path: "customers", icon: Users },
  { name: "Operations", path: "operations", icon: Workflow },
  { name: "Forecasting", path: "forecasting", icon: ChartSpline },
  { name: "Dashboard Builder", path: "builder", icon: PanelsTopLeft },
];
function Shell() {
  const { profile, theme, patch } = useStore();
  const location = useLocation(),
    navigate = useNavigate();
  const [mobile, setMobile] = useState(false),
    [search, setSearch] = useState(false),
    [q, setQ] = useState(""),
    [notifications, setNotifications] = useState(false),
    [profileMenu, setProfileMenu] = useState(false),
    [workspace, setWorkspace] = useState(false),
    [help, setHelp] = useState(false);
  useEffect(() => {
    setMobile(false);
    document.title = `NexaCore — ${nav.find((n) => `/app${n.path ? "/" + n.path : ""}` === location.pathname)?.name || "Settings"}`;
  }, [location.pathname]);
  useEffect(() => {
    function key(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearch((v) => !v);
      }
    }
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);
  return (
    <div className="app-shell">
      {mobile && (
        <button
          className="sidebar-overlay"
          aria-label="Close navigation"
          onClick={() => setMobile(false)}
        />
      )}
      <aside className={mobile ? "sidebar open" : "sidebar"}>
        <Link className="brand" to="/app">
          <span className="brand-mark">N</span>NexaCore
          <span className="brand-dot">®</span>
        </Link>
        <div className="workspace-switch-wrap">
          <button
            className="workspace-switch"
            onClick={() => setWorkspace(!workspace)}
          >
            <span className="workspace-logo">
              N<span />
            </span>
            <span>
              <strong>NexaCore workspace</strong>
              <small>Enterprise demo</small>
            </span>
            <ChevronDown size={14} />
          </button>
          {workspace && (
            <div className="workspace-pop">
              <strong>Demonstration workspace</strong>
              <p>Local workspace · {profile.name}</p>
              <button
                onClick={() => {
                  navigate("/app/settings");
                  setWorkspace(false);
                }}
              >
                Manage workspace <ArrowUpRight size={13} />
              </button>
            </div>
          )}
        </div>
        <div className="nav-heading">WORKSPACE</div>
        <nav className="side-nav">
          {nav.map((n, i) => (
            <div key={n.path}>
              {i === 6 && (
                <div className="nav-heading section-heading">
                  BUSINESS INTELLIGENCE
                </div>
              )}
              {i === 11 && (
                <div className="nav-heading section-heading">CUSTOMIZE</div>
              )}
              <NavLink
                end={n.path === ""}
                to={`/app${n.path ? "/" + n.path : ""}`}
              >
                <n.icon size={17} />
                <span>{n.name}</span>
                {n.path === "insights" && <span className="nav-new">NEW</span>}
                {n.path === "" && <span className="active-dot" />}
              </NavLink>
            </div>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="upgrade-card">
            <span className="upgrade-icon">
              <Sparkles size={17} />
            </span>
            <strong>More clarity. More possibility.</strong>
            <p>Explore the full NexaCore experience.</p>
            <Link to="/website">
              Discover NexaCore <ArrowUpRight size={14} />
            </Link>
          </div>
          <NavLink className="bottom-link" to="/app/settings">
            <Settings size={17} /> Settings
          </NavLink>
          <button className="bottom-link" onClick={() => setHelp(true)}>
            <HelpCircle size={17} /> Help & documentation{" "}
            <ArrowUpRight size={13} />
          </button>
          <button
            className="sidebar-profile"
            onClick={() => navigate("/app/settings")}
          >
            <span className="avatar">{profile.name.slice(0, 1)}</span>
            <span>
              <strong>{profile.name}</strong>
              <small>Workspace admin</small>
            </span>
            <ChevronDown size={14} />
          </button>
        </div>
      </aside>
      <div className="app-main">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="icon-btn desktop-toggle"
              aria-label="Navigation information"
              onClick={() => setHelp(true)}
            >
              <PanelLeftClose size={18} />
            </button>
            <button
              className="icon-btn mobile-toggle"
              aria-label="Open navigation"
              onClick={() => setMobile(true)}
            >
              <Menu size={20} />
            </button>
            <span className="topbar-divider" />
            <span className="top-workspace">
              Workspace <ChevronDown size={12} />
            </span>
            <span className="badge demo-badge">
              <span /> Demo mode
            </span>
          </div>
          <div className="topbar-right">
            <button className="global-search" onClick={() => setSearch(true)}>
              <Search size={16} />
              <span>Search anything…</span>
              <kbd>
                <Command size={11} /> K
              </kbd>
            </button>
            <button
              className="icon-btn theme-toggle"
              aria-label="Toggle color theme"
              onClick={() =>
                patch({ theme: theme === "dark" ? "light" : "dark" })
              }
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <div className="popover-anchor">
              <button
                className="icon-btn notification-btn"
                aria-label="Notifications"
                onClick={() => setNotifications(!notifications)}
              >
                <Bell size={18} />
                <span />
              </button>
              {notifications && (
                <div className="top-popover">
                  <strong>Workspace notifications</strong>
                  <p>No live alerts are connected.</p>
                  <div className="notice">
                    Your sample workspace is ready to explore. All changes are
                    stored on this device.
                  </div>
                  <button onClick={() => setNotifications(false)}>
                    Dismiss
                  </button>
                </div>
              )}
            </div>
            <span className="topbar-divider" />
            <div className="popover-anchor">
              <button
                className="top-profile"
                onClick={() => setProfileMenu(!profileMenu)}
              >
                <span className="avatar">{profile.name.slice(0, 1)}</span>
                <span>{profile.name}</span>
                <ChevronDown size={13} />
              </button>
              {profileMenu && (
                <div className="top-popover profile-pop">
                  <strong>{profile.name}</strong>
                  <p>{profile.email}</p>
                  <Link
                    to="/app/settings"
                    onClick={() => setProfileMenu(false)}
                  >
                    Profile & settings
                  </Link>
                  <Link to="/website" onClick={() => setProfileMenu(false)}>
                    Visit NexaCore website
                  </Link>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="main-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
            >
              <Suspense
                fallback={
                  <div className="loading">
                    <span className="brand-mark">N</span> Preparing your
                    workspace…
                  </div>
                }
              >
                <Routes>
                  <Route index element={<Overview />} />
                  <Route path="analytics" element={<Analytics />} />
                  <Route path="insights" element={<Insights />} />
                  <Route path="data" element={<DataExplorer />} />
                  <Route path="reports" element={<Reports />} />
                  <Route path="kpis" element={<KPIs />} />
                  <Route path="sales" element={<Analytics mode="sales" />} />
                  <Route
                    path="finance"
                    element={<Analytics mode="finance" />}
                  />
                  <Route
                    path="customers"
                    element={<DataExplorer customers />}
                  />
                  <Route
                    path="operations"
                    element={<Analytics mode="operations" />}
                  />
                  <Route path="forecasting" element={<Forecasting />} />
                  <Route path="builder" element={<Builder />} />
                  <Route path="settings" element={<SettingsPage />} />
                  <Route path="*" element={<Navigate to="/app" replace />} />
                </Routes>
              </Suspense>
            </motion.div>
          </AnimatePresence>
          <Footer />
        </main>
      </div>
      {search && (
        <Modal title="Search your workspace" onClose={() => setSearch(false)}>
          <div className="search-field">
            <Search size={17} />
            <input
              autoFocus
              aria-label="Search modules"
              placeholder="Find a page or capability…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <div className="command-results">
            {[...nav, { name: "Settings", path: "settings", icon: Settings }]
              .filter((n) => n.name.toLowerCase().includes(q.toLowerCase()))
              .map((n) => (
                <button
                  key={n.path}
                  onClick={() => {
                    navigate(`/app/${n.path}`);
                    setSearch(false);
                    setQ("");
                  }}
                >
                  <n.icon size={18} />
                  {n.name}
                  <ArrowUpRight size={15} />
                </button>
              ))}
          </div>
        </Modal>
      )}
      {help && (
        <Modal title="Welcome to NexaCore" onClose={() => setHelp(false)}>
          <p className="body-text">
            This is a local-first enterprise intelligence demonstration by
            Talha. Use the sidebar to explore modules, or press Ctrl / ⌘ K to
            find a page.
          </p>
          <p className="body-text">
            Charts use your current Sales dataset. Import Sales CSV in Data
            Explorer. Create targets in KPIs, save views in Reports, and
            customize your dashboard in Dashboard Builder.
          </p>
          <p className="body-text">
            Use Settings to back up your workspace. Nothing is sent to a server.
            Insights and forecasts are locally calculated, illustrative, and not
            professional advice.
          </p>
          <Link
            className="button primary"
            to="/website"
            onClick={() => setHelp(false)}
          >
            Explore the website <ArrowUpRight size={15} />
          </Link>
        </Modal>
      )}
    </div>
  );
}
function AppContent() {
  const [warning, setWarning] = useState(storageWarning);
  useEffect(() => {
    const handler = (e: Event) => setWarning((e as CustomEvent<string>).detail);
    window.addEventListener("nexacore-storage-warning", handler);
    return () =>
      window.removeEventListener("nexacore-storage-warning", handler);
  }, []);
  const theme = useStore((s) => s.theme);
  const locale = useStore((s) => s.numberFormat);
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () =>
      (document.documentElement.dataset.theme =
        theme === "system" ? (mq.matches ? "dark" : "light") : theme);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [theme]);
  return (
    <>
      <div className={warning ? "storage-warning" : "hidden"} role="status">
        {warning}
      </div>
      <Suspense fallback={<div className="loading">Loading NexaCore…</div>}>
        <Routes>
          <Route path="/website" element={<Marketing />} />
          <Route path="/website/:page" element={<Marketing />} />
          <Route path="/app/*" element={<Shell />} />
          <Route path="*" element={<Navigate to="/app" replace />} />
        </Routes>
      </Suspense>
    </>
  );
}
export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <HashRouter>
        <AppContent />
      </HashRouter>
    </MotionConfig>
  );
}
