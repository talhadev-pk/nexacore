import { useMemo, useRef, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  type SortingState,
  type ColumnDef,
} from "@tanstack/react-table";
import {
  Download,
  Upload,
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Columns3,
} from "lucide-react";
import { Panel } from "../components/UI";
import { Chart } from "../components/Charts";
import { useStore } from "../store/useStore";
import { customerRows, productRows } from "../data/seed";
import { csvParse, rowSchema, download, toCSV } from "../lib/data";
export default function DataExplorer({
  customers = false,
}: {
  customers?: boolean;
}) {
  const { rows, patch } = useStore();
  const [dataset, setDataset] = useState(customers ? "Customers" : "Sales"),
    [query, setQuery] = useState(""),
    [sorting, setSorting] = useState<SortingState>([]),
    [visibility, setVisibility] = useState({}),
    [columnsOpen, setColumnsOpen] = useState(false),
    [status, setStatus] = useState("");
  const file = useRef<HTMLInputElement>(null);
  const source: object[] =
    dataset === "Customers"
      ? customerRows
      : dataset === "Products"
        ? productRows
        : dataset === "Operations"
          ? rows.map(({ id, date, status, stock, hours, orders }) => ({
              id,
              date,
              status,
              stock,
              hours,
              orders,
            }))
          : rows;
  const data = useMemo(
    () =>
      source.filter((r) =>
        Object.values(r).some((v) =>
          String(v).toLowerCase().includes(query.toLowerCase()),
        ),
      ),
    [source, query],
  );
  const columns: ColumnDef<object>[] = Object.keys(source[0] || { id: "" }).map(
    (key) => ({ accessorKey: key, header: key }),
  );
  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnVisibility: visibility },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });
  async function importCSV(f: File) {
    try {
      if (f.size > 5000000) throw Error("Maximum import size is 5 MB.");
      const parsed = csvParse(await f.text());
      const validated = rowSchema.array().min(1).max(10000).parse(parsed);
      if (new Set(validated.map((r) => r.id)).size !== validated.length)
        throw Error("Duplicate record IDs in CSV.");
      const ids = new Set(rows.map((r) => r.id));
      if (validated.some((r) => ids.has(r.id)))
        throw Error(
          "Record IDs already exist. Use unique IDs; existing records will not be overwritten.",
        );
      patch({ rows: [...rows, ...validated] });
      setDataset("Sales");
      setStatus(
        `Imported ${validated.length} records. Existing records were preserved.`,
      );
    } catch (e) {
      setStatus(
        `Import rejected. ${e instanceof Error ? e.message : "Invalid CSV."}`,
      );
    }
  }
  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">YOUR DATA, WITHOUT THE FRICTION</div>
          <h1>{customers ? "Customer analytics" : "Data explorer"}</h1>
          <p>
            {customers
              ? "Fictional organizations and illustrative customer value."
              : "Explore, sort, and export your workspace. Import CSV into the Sales schema."}
          </p>
        </div>
        <div className="actions">
          <button onClick={() => file.current?.click()}>
            <Upload size={15} /> Import CSV
          </button>
          <button
            className="primary"
            onClick={() =>
              download(`${dataset.toLowerCase()}.csv`, toCSV(data))
            }
          >
            <Download size={15} /> Export CSV
          </button>
          <input
            type="file"
            ref={file}
            hidden
            accept=".csv,text/csv"
            onChange={(e) => {
              if (e.target.files?.[0]) void importCSV(e.target.files[0]);
              e.target.value = "";
            }}
          />
        </div>
      </div>
      {customers && (
        <div className="two-col">
          <Panel
            title="Customer segmentation"
            sub="Fictional organizations · number of directory records"
          >
            <Chart
              data={["Enterprise", "Growth", "Startup"].map((name) => ({
                name,
                customers: customerRows.filter(
                  (r) =>
                    r.segment === name &&
                    Object.values(r).some((v) =>
                      String(v).toLowerCase().includes(query.toLowerCase()),
                    ),
                ).length,
              }))}
              metric="customers"
              type="bar"
              height={200}
            />
          </Panel>
          <Panel
            title="Repeat customer analysis"
            sub="Based on orders per fictional organization"
          >
            <div className="customer-summary">
              <strong>
                {customerRows.filter((r) => r.orders > 1).length} /{" "}
                {customerRows.length}
              </strong>
              <p>Organizations with more than one sample order.</p>
              <p>
                Average sample value: $
                {(
                  customerRows.reduce((a, r) => a + r.value, 0) /
                  customerRows.length
                ).toFixed(0)}
              </p>
            </div>
            <Chart
              data={[...new Set(customerRows.map((r) => r.region))].map(
                (name) => ({
                  name,
                  customers: customerRows.filter((r) => r.region === name)
                    .length,
                }),
              )}
              metric="customers"
              type="bar"
              height={160}
            />
          </Panel>
        </div>
      )}
      <div className="dataset-cards">
        {["Sales", "Customers", "Products", "Operations"].map((name) => (
          <button
            className={dataset === name ? "dataset active" : "dataset"}
            key={name}
            onClick={() => {
              setDataset(name);
              setQuery("");
              table.setPageIndex(0);
            }}
          >
            <span className="dataset-icon">
              {name === "Sales"
                ? "↗"
                : name === "Customers"
                  ? "♧"
                  : name === "Products"
                    ? "◇"
                    : "▦"}
            </span>
            <div>
              <strong>{name}</strong>
              <span>
                {name === "Customers"
                  ? 48
                  : name === "Products"
                    ? 4
                    : rows.length}{" "}
                sample records
              </span>
            </div>
            <span className="badge">CSV</span>
          </button>
        ))}
      </div>
      <section className="panel">
        <div className="data-toolbar">
          <div className="search-field">
            <Search size={16} />
            <input
              aria-label="Search records"
              placeholder="Search all columns…"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                table.setPageIndex(0);
              }}
            />
          </div>
          <span className="muted">{data.length} matching records</span>
          <button onClick={() => setColumnsOpen(!columnsOpen)}>
            <Columns3 size={15} /> Columns
          </button>
        </div>
        {columnsOpen && (
          <div className="column-options">
            {table.getAllLeafColumns().map((c) => (
              <label key={c.id}>
                <input
                  type="checkbox"
                  checked={c.getIsVisible()}
                  onChange={c.getToggleVisibilityHandler()}
                />
                {c.id}
              </label>
            ))}
          </div>
        )}
        <div className="table-scroll">
          <table>
            <thead>
              {table.getHeaderGroups().map((g) => (
                <tr key={g.id}>
                  {g.headers.map((h) => (
                    <th key={h.id}>
                      <button
                        className="sort-button"
                        onClick={h.column.getToggleSortingHandler()}
                      >
                        {flexRender(h.column.columnDef.header, h.getContext())}
                        <ArrowUpDown size={11} />
                        {h.column.getIsSorted() || ""}
                      </button>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((r) => (
                <tr key={r.id}>
                  {r.getVisibleCells().map((c) => (
                    <td key={c.id}>{String(c.getValue())}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {!data.length && (
            <div className="empty">No records match your search.</div>
          )}
        </div>
        <div className="pagination">
          <span>
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {Math.max(1, table.getPageCount())} · {data.length} records
          </span>
          <div className="actions">
            <button
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.previousPage()}
              aria-label="Previous page"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              disabled={!table.getCanNextPage()}
              onClick={() => table.nextPage()}
              aria-label="Next page"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>
      {status && (
        <div className="notice" role="status">
          {status}
        </div>
      )}
      <div className="notice">
        <div>
          <strong>Import requirements</strong>
          <p>
            Export Sales CSV for a schema template. All fields are required;
            dates use YYYY-MM-DD and numeric fields must be nonnegative. Imports
            append unique records and never replace existing data. Customer and
            product directories are separate illustrative reference datasets.
          </p>
        </div>
      </div>
    </>
  );
}
