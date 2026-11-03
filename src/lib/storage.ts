import type { PersistStorage } from "zustand/middleware";
export let storageWarning = "";
const warn = (message: string) => {
  storageWarning = message;
  if (typeof window !== "undefined")
    window.dispatchEvent(
      new CustomEvent("nexacore-storage-warning", { detail: message }),
    );
};
export function safeStorage<T>(): PersistStorage<T> {
  return {
    getItem(name) {
      try {
        const raw = localStorage.getItem(name);
        if (!raw) return null;
        try {
          return JSON.parse(raw);
        } catch {
          archiveInvalidState(raw);
          return null;
        }
      } catch {
        warn(
          "Saved workspace could not be read. No stored data has been intentionally deleted. Export a backup before making further changes.",
        );
        return null;
      }
    },
    setItem(name, value) {
      try {
        localStorage.setItem(name, JSON.stringify(value));
      } catch {
        warn(
          "Browser storage is unavailable or full. Changes may not survive refresh. Export your workspace now.",
        );
      }
    },
    removeItem(name) {
      try {
        localStorage.removeItem(name);
      } catch {
        warn("Browser storage could not be cleared.");
      }
    },
  };
}
export function archiveInvalidState(saved: unknown) {
  try {
    localStorage.setItem(
      `nexacore-recovery-${Date.now()}`,
      JSON.stringify(saved),
    );
    warn(
      "The saved workspace did not pass validation. A recovery copy was preserved in browser storage under nexacore-recovery. Export it through Data controls before resetting.",
    );
  } catch {
    warn(
      "Stored data did not pass validation and could not be archived. Avoid changes until you have backed up browser storage.",
    );
  }
}
