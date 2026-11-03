# NexaCore

**Turn Business Data Into Better Decisions.**

A local-first enterprise intelligence portfolio project by **Talha**. NexaCore connects data exploration, sales and financial analysis, explainable local insights, KPI tracking, saved reports, and customizable dashboards in a responsive React application.

Planned GitHub Pages URL: https://talhadev-pk.github.io/nexacore/

**Publication status:** prepared for deployment, not deployed or verified from this workspace. The included workflow must run in the `talhadev-pk/nexacore` GitHub repository before this URL can be treated as live.

## Getting started

Use Node.js 22 LTS (Node 20.20.2 was also used for local verification).

```sh
npm ci
npm run dev
```

Open `http://localhost:5173/nexacore/`.

- Application: `#/app` (default landing route)
- Public website: `#/website`
- Public pages: `#/website/features`, `solutions`, `pricing`, `about`, `contact`

No environment variables, backend, API keys, accounts, or external services are required.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Vite development server |
| `npm run typecheck` | Strict TypeScript validation |
| `npm run lint` | ESLint checks |
| `npm test` | 12 Vitest tests for data, CSV, workspace validation, KPI thresholds |
| `npm run build` | Type check and production build into `dist` |
| `npm run preview` | Serve production build |
| `npm run test:e2e` | Browser workflows, requires a running server |
| `npm run format` | Format source with Prettier |

Browser testing setup:

```sh
npx playwright install --with-deps chromium
npm run dev # in a separate terminal
npm run test:e2e
```

To test production, run `npm run preview` and set `E2E_BASE_URL=http://localhost:4173/nexacore/` for the test command. Browser workflows use fresh, isolated browser contexts and do not alter your normal browser workspace.

## Product modules

- **Executive overview:** period filtering, actual dataset totals, revenue/expenses trend, regional revenue donut, product rankings, operational event summaries, CSV export, secondary financial and conversion metrics.
- **Business intelligence:** metric selection, region and period filters, grouping, area/line/bar/pie/donut charts, tooltips, channel comparisons, saved views.
- **Local AI insights:** deterministic grouped arithmetic for product and regional revenue and delayed fulfillment records; explanations, supporting charts, save/unsave.
- **Data Explorer:** Sales, Customers, Products, and Operations datasets; full-text search, sorting, visible columns, pagination, validated Sales CSV import, CSV export.
- **Reports:** create, filter, rename, inspect, delete, export. Analytics-saved reports retain region and period scope. Reports are saved queries of current data, not immutable snapshots.
- **KPIs:** create/edit/delete targets with annual, quarterly, and monthly scopes; actual/target comparison and historical trend.
- **Sales / Finance / Operations:** shared analytical controls with revenue, cost, profit, margin, channel distribution, and fulfillment exception views.
- **Customer analytics:** fictional organization directory, segment counts, regional distribution, illustrative customer value and repeat-order analysis.
- **Forecasting:** selectable horizon, historical series and ordinary least-squares trend continuation; explicit assumptions.
- **Dashboard builder:** add/remove widgets; change metric/chart; reorder with accessible up/down controls; rename, duplicate, and create dashboards; automatic persistence.
- **Workspace settings:** profile, light/dark/system themes, date and currency number formatting preferences, JSON backup/import, dataset restore, dataset-only clear, explicit complete reset.
- **Public website:** home, features, solutions, illustrative pricing, about, contact validation, FAQ, interactive chart preview.

## Architecture

```text
src/
  App.tsx              HashRouter, lazy routes, shell, search, theme
  components/          Shared panels, charts, stats, native dialogs, footer
  pages/               Public pages and feature-level app screens
  data/seed.ts         Deterministic fictional records + aggregations
  lib/data.ts          CSV parser/export, Zod row validation, KPI status logic
  lib/storage.ts       Guarded persistence and recovery notifications
  store/useStore.ts    Versioned, validated Zustand workspace
  styles.css           Responsive light/dark design system + Tailwind entry
```

**Stack:** React 19, TypeScript, Vite 6, Tailwind CSS 4, Motion, React Router, Lucide, Zustand, Recharts, TanStack Table, Zod. Native form validation is used for the simple forms; React Hook Form is installed for future form expansion but is not currently needed.

Pages are lazy-loaded. The chart, table, validation, router, and animation code is split into chunks. No external fonts or images are needed. Animations respect reduced-motion preferences. Native modal dialogs provide focus containment and Escape dismissal.

## Data and calculation definitions

The initial Sales dataset contains 144 illustrative aggregated records across twelve months in 2026. Operations is a projection of those same records. Customers (48 fictional organizations) and Products (4 product definitions) are separate reference tables; they are not a real CRM or deduplicated customer ledger.

- Revenue, expenses, orders, and customer observations are summed from Sales records.
- Profit = revenue − expenses; margin = profit ÷ revenue × 100.
- Average order value = revenue ÷ orders.
- Customer totals on the executive screen are summed sample observations, **not unique people**.
- Order conversion uses orders from records with positive recorded sessions divided by those sessions. Legacy CSVs without sessions are excluded from this calculation.
- Executive growth compares the latter half of selected records with the first half, in stored order. It is not year-over-year growth.
- KPI status: `actual >= target` → On Track; `actual >= 0.8 * target` → Needs Attention; otherwise Below Target. Targets are higher-is-better. Annual uses all records, Quarterly Oct–Dec, Monthly December.
- Insights use grouped sums and counts only. No statistical confidence, causal relationship, or live model is claimed.
- Forecasting fits monthly revenue against month index using ordinary least squares, extrapolates, and floors at zero. It ignores seasonality and external factors. `F1` onward labels projected values.

## Persistence and safety

Storage key: `nexacore-workspace`, version 1. A valid saved profile is restored without being replaced by defaults. Defaults are used for a new browser workspace only. Reports, insights, KPIs, layouts, imported sales records, and preferences persist across refreshes.

Writes are guarded against browser storage errors and quota exhaustion. Failed validation produces a visible warning and a `nexacore-recovery-*` copy where browser storage allows. Recovery records can be downloaded in Settings. A manual browser backup is still recommended before importing or resetting data. There is no cloud synchronization.

Backups include personal profile fields. Treat exported JSON as personal data. Workspace import validates the version and schema and requires confirmation before replacement. Dataset clear/restore does not remove profile or saved work. Complete reset explicitly removes personal workspace changes.

### CSV import

Export the Sales dataset for a schema template. Required columns:

`id,date,product,region,channel,revenue,expenses,orders,customers,status,stock,hours`

`sessions` is optional (defaults to zero). Dates use YYYY-MM-DD. Numeric values must be nonnegative; orders/customers must be integers. IDs must be unique across new and existing records. Max file size 5 MB, max 10,000 records per import. Quoted commas, escaped quotes, and multiline fields are supported. Invalid files are rejected atomically with an explanation; records are never silently dropped or overwritten. CSV import currently targets Sales; customer/product directory import is not implemented.

## Deployment

1. Create/push this directory as `talhadev-pk/nexacore`, branch `main`.
2. In repository Settings → Pages, choose **GitHub Actions** as the source.
3. The included workflow installs from the lockfile, checks types and lint, runs unit tests, builds, uploads `dist`, and deploys Pages.
4. Review the workflow result and verify the actual published URL and hash routes on desktop/mobile before announcing deployment.

Vite base is `/nexacore/`; HashRouter avoids static-host route fallback problems. No secrets are required. No successful GitHub Actions run or published website is claimed here.

## Demonstration limitations

- No live AI, business integrations, authentication, backend, payment processing, message sending, or production monitoring.
- Contact form validates locally and explicitly says no message was sent.
- Illustrative pricing does not create a subscription.
- Financial summaries are neither an accounting system nor financial advice. Forecasts are not guarantees.
- Customer acquisition/cohort modeling, drag-and-drop widget movement, PDF export, cross-device sync, and production-grade large-data virtualization are not implemented.
- Date-series aggregation is month-oriented for the seeded one-year demonstration; multi-year imports need a year-aware analytical model before production use.
- Browser tests cover major workflows and three responsive widths, not a full accessibility audit, every browser, every possible storage failure, or all performance conditions.
- `npm audit --omit=dev` reports no production dependency vulnerabilities at verification. Development-tool transitive dependencies have moderate advisories; review dependency updates before public maintenance/deployment.

## Attribution

**Made with ❤️ by Talha**

This is a demonstration project. All displayed business data, analytics, AI insights, and sample records are illustrative or simulated.

MIT licensed. See [LICENSE](LICENSE).
