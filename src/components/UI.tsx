import { X, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";
export function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    ref.current?.showModal();
  }, []);
  return (
    <dialog
      ref={ref}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-head">
        <h2>{title}</h2>
        <button
          className="icon-btn"
          aria-label="Close dialog"
          onClick={onClose}
        >
          <X size={19} />
        </button>
      </div>
      {children}
    </dialog>
  );
}
export function Panel({
  title,
  sub,
  children,
  action,
  className = "",
}: {
  title: string;
  sub?: string;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <section className={`panel ${className}`}>
      <div className="panel-head">
        <div>
          <h3>{title}</h3>
          {sub && <p>{sub}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
export function Stat({
  label,
  value,
  change,
  icon,
}: {
  label: string;
  value: string;
  change?: number;
  icon: ReactNode;
}) {
  return (
    <div className="stat">
      <div className="stat-top">
        <span>{label}</span>
        <span className="stat-icon">{icon}</span>
      </div>
      <strong>{value}</strong>
      <div className="stat-bottom">
        {change !== undefined ? (
          <>
            <span className={change >= 0 ? "positive" : "negative"}>
              {change >= 0 ? (
                <ArrowUpRight size={13} />
              ) : (
                <ArrowDownRight size={13} />
              )}{" "}
              {Math.abs(change).toFixed(1)}%
            </span>
            <span>vs previous period</span>
          </>
        ) : (
          <span>From selected demonstration data</span>
        )}
        <svg viewBox="0 0 90 25" aria-hidden="true">
          <path d="M0 23L8 18L17 21L26 12L35 15L44 7L53 11L62 4L70 7L80 2L90 1" />
        </svg>
      </div>
    </div>
  );
}
export function Footer() {
  return (
    <footer>
      <span>
        Made with ❤️ by <strong>Talha</strong>
      </span>
      <span>
        This is a demonstration project. All displayed business data, analytics,
        AI insights, and sample records are illustrative or simulated.
      </span>
      <span>NexaCore © 2026</span>
    </footer>
  );
}
