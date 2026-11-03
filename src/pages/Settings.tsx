import { useRef, useState } from "react";
import { Download, Upload, Save } from "lucide-react";
import { useStore, workspaceSchema, defaults } from "../store/useStore";
import { seed } from "../data/seed";
import { Panel } from "../components/UI";
import { download } from "../lib/data";
export default function Settings() {
  const store = useStore();
  const [message, setMessage] = useState("");
  const ref = useRef<HTMLInputElement>(null);
  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">A WORKSPACE THAT WORKS FOR YOU</div>
          <h1>Workspace settings</h1>
          <p>Your profile, preferences, and data. Always under your control.</p>
        </div>
      </div>
      <div className="two-col">
        <Panel
          title="Personal profile"
          sub="Saved on this device, never sent to a server"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              store.patch({
                profile: {
                  name: String(f.get("name")).trim(),
                  email: String(f.get("email")),
                },
              });
              setMessage(
                "Profile saved. Your changes will remain after refresh.",
              );
            }}
          >
            <div className="profile-large">
              {store.profile.name.slice(0, 1)}
            </div>
            <label>
              Display name
              <input
                name="name"
                required
                minLength={1}
                defaultValue={store.profile.name}
              />
            </label>
            <label>
              Email address
              <input
                name="email"
                type="email"
                required
                defaultValue={store.profile.email}
              />
            </label>
            <button className="primary">
              <Save size={15} /> Save profile
            </button>
          </form>
        </Panel>
        <Panel
          title="Appearance & preferences"
          sub="A comfortable space for clearer thinking"
        >
          <label>
            Color theme
            <select
              value={store.theme}
              onChange={(e) =>
                store.patch({ theme: e.target.value as typeof store.theme })
              }
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </label>
          <label>
            Date format
            <select
              value={store.dateFormat}
              onChange={(e) => store.patch({ dateFormat: e.target.value })}
            >
              <option>MMM DD, YYYY</option>
              <option>DD/MM/YYYY</option>
              <option>YYYY-MM-DD</option>
            </select>
          </label>
          <label>
            Number locale
            <select
              value={store.numberFormat}
              onChange={(e) => store.patch({ numberFormat: e.target.value })}
            >
              <option value="en-US">English (US)</option>
              <option value="en-GB">English (UK)</option>
              <option value="de-DE">German</option>
            </select>
          </label>
          <p className="body-text">
            Dashboard layouts are configured and automatically saved in
            Dashboard Builder. Financial values are always illustrative USD.
          </p>
        </Panel>
        <Panel
          title="Workspace backup"
          sub="Export a versioned backup including profile and saved work"
        >
          <div className="actions">
            <button
              onClick={() =>
                download(
                  "nexacore-workspace.json",
                  JSON.stringify(
                    { version: 1, data: workspaceSchema.parse(store) },
                    null,
                    2,
                  ),
                  "application/json",
                )
              }
            >
              <Download size={15} /> Export workspace
            </button>
            <button onClick={() => ref.current?.click()}>
              <Upload size={15} /> Import workspace
            </button>
          </div>
          <input
            ref={ref}
            hidden
            type="file"
            accept=".json"
            onChange={async (e) => {
              try {
                const f = e.target.files?.[0];
                if (!f) return;
                if (f.size > 10000000) throw Error("Backup exceeds 10 MB");
                const json = JSON.parse(await f.text());
                if (json.version !== 1)
                  throw Error("Unsupported workspace version");
                const data = workspaceSchema.parse(json.data);
                if (!data.dashboards.length)
                  throw Error("At least one dashboard is required");
                if (
                  confirm(
                    "Replace your workspace with this backup? Export your current work first.",
                  )
                ) {
                  store.patch(data);
                  setMessage("Workspace imported successfully.");
                }
              } catch (e) {
                setMessage(
                  `Import rejected: ${e instanceof Error ? e.message : "Invalid backup"}`,
                );
              }
            }}
          />
          <p className="body-text">
            Only validated NexaCore version 1 backups are accepted. Import
            replaces workspace data after confirmation.
          </p>
        </Panel>
        <Panel
          title="Data controls"
          sub="Destructive actions always require confirmation"
        >
          <div className="stack">
            <button
              onClick={() => {
                const keys = Object.keys(localStorage).filter((k) =>
                  k.startsWith("nexacore-recovery"),
                );
                download(
                  "nexacore-recovery.json",
                  JSON.stringify(
                    Object.fromEntries(
                      keys.map((k) => [k, localStorage.getItem(k)]),
                    ),
                  ),
                  "application/json",
                );
              }}
            >
              Export recovery records
            </button>
            <button
              onClick={() => {
                if (
                  confirm(
                    "Replace sales and operations data with demonstration records? Your profile and saved work will be preserved.",
                  )
                ) {
                  store.patch({ rows: seed });
                  setMessage("Demonstration datasets restored.");
                }
              }}
            >
              Restore demonstration datasets
            </button>
            <button
              className="danger"
              onClick={() => {
                if (
                  confirm(
                    "Clear all sales and operations records? Your profile and saved work will remain.",
                  )
                ) {
                  store.patch({ rows: [] });
                  setMessage(
                    "Dataset cleared. Profile and saved work preserved.",
                  );
                }
              }}
            >
              Clear dataset only
            </button>
            <button
              className="danger"
              onClick={() => {
                if (
                  confirm(
                    "Complete reset: delete all personal settings, reports, KPIs, and dashboards?",
                  )
                ) {
                  store.patch(defaults);
                  setMessage("Complete workspace reset.");
                }
              }}
            >
              Complete workspace reset
            </button>
          </div>
        </Panel>
      </div>
      {message && (
        <div className="notice" role="status">
          {message}
        </div>
      )}
    </>
  );
}
