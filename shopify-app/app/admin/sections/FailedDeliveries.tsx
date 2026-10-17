import { useState } from "react";
import { downloadCSV, nowStr } from "../utils/flowUtils";

type FailureReason = "unavailable" | "wrong-address" | "rejected" | "other";
type FailStatus = "open" | "reattempt-scheduled" | "refund-requested" | "resolved" | "escalated";

interface FailedDelivery {
  id: string;
  customer: string;
  address: string;
  rider: string;
  orderId: string;
  stream: "RS" | "MP";
  reason: FailureReason;
  status: FailStatus;
  failedAt: string;
  notes: string;
  attempts: number;
}

const failures: FailedDelivery[] = [
  { id: "FD-041", customer: "Wei Jie Lim", address: "Blk 204 Tampines St 21 #08-11", rider: "Ahmad Zaki", orderId: "ORD-2403", stream: "RS", reason: "unavailable", status: "reattempt-scheduled", failedAt: "14 Sep 10:22", notes: "Customer did not answer bell. Reattempt 15 Sep 10:00–12:00.", attempts: 1 },
  { id: "FD-040", customer: "Jason Yeo", address: "Blk 44 Geylang Bahru #06-08", rider: "Raju Kumar", orderId: "ORD-2407", stream: "RS", reason: "wrong-address", status: "escalated", failedAt: "14 Sep 11:15", notes: "Customer provided old address. New address obtained via support.", attempts: 1 },
  { id: "FD-039", customer: "Aisha Rahman", address: "30 Jalan Besar #07-01", rider: "Daniel Tan", orderId: "SUB-003", stream: "MP", reason: "unavailable", status: "open", failedAt: "13 Sep 10:45", notes: "No response after 3 bell rings. Left notice.", attempts: 2 },
  { id: "FD-038", customer: "Bryan Low", address: "22 Toa Payoh Rise #09-11", rider: "Ahmad Zaki", orderId: "SUB-005", stream: "MP", reason: "rejected", status: "refund-requested", failedAt: "12 Sep 11:30", notes: "Customer rejected — meal plan cancelled. Refund initiated.", attempts: 1 },
  { id: "FD-037", customer: "Jade Koh", address: "12 Woodlands Ave 5 #03-22", rider: "Raju Kumar", orderId: "ORD-2391", stream: "RS", reason: "unavailable", status: "resolved", failedAt: "11 Sep 10:00", notes: "Successfully delivered on reattempt 12 Sep.", attempts: 2 },
  { id: "FD-036", customer: "Darren Ong", address: "88 Bukit Timah Rd #11-04", rider: "James Ng", orderId: "ORD-2388", stream: "RS", reason: "other", status: "resolved", failedAt: "10 Sep 14:30", notes: "Lift breakdown. Stairs delivery completed.", attempts: 1 },
];

const reasonLabels: Record<FailureReason, string> = {
  unavailable: "Customer Unavailable",
  "wrong-address": "Wrong Address",
  rejected: "Customer Rejected",
  other: "Other",
};

const statusStyle: Record<FailStatus, { label: string; color: string; bg: string }> = {
  open: { label: "Open", color: "#EF4444", bg: "bg-red-950/30 border border-red-800/30" },
  "reattempt-scheduled": { label: "Reattempt Scheduled", color: "#F5B300", bg: "bg-yellow-950/30 border border-yellow-800/30" },
  "refund-requested": { label: "Refund Requested", color: "#E85D04", bg: "bg-orange-950/30 border border-orange-800/30" },
  escalated: { label: "Escalated", color: "#EF4444", bg: "bg-red-950/30 border border-red-800/30" },
  resolved: { label: "Resolved", color: "#22C55E", bg: "bg-green-950/30 border border-green-800/30" },
};

export default function FailedDeliveries({ demoMode }: { demoMode?: boolean } = {}) {
  const [statusFilter, setStatusFilter] = useState<FailStatus | "all">("all");
  const [selected, setSelected] = useState<FailedDelivery | null>(demoMode ? failures[0] : null);
  const [items, setItems] = useState(failures);

  const filtered = items.filter(f =>
    statusFilter === "all" ? true : f.status === statusFilter
  );

  const updateStatus = (id: string, status: FailStatus) => {
    setItems(prev => prev.map(f => f.id === id ? { ...f, status } : f));
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null);
  };

  const counts = {
    open: items.filter(f => f.status === "open").length,
    reattempt: items.filter(f => f.status === "reattempt-scheduled").length,
    refund: items.filter(f => f.status === "refund-requested").length,
    resolved: items.filter(f => f.status === "resolved").length,
  };

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-extrabold">Failed Delivery Center</h2>
          {counts.open > 0 && (
            <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 mono">{counts.open} open</span>
          )}
        </div>
        <button onClick={() => downloadCSV(`failed-deliveries-${nowStr()}.csv`, failures.map(f => ({ id: f.id, customer: f.customer, orderId: f.orderId, stream: f.stream, reason: reasonLabels[f.reason], status: f.status, rider: f.rider, attempts: f.attempts, failedAt: f.failedAt, notes: f.notes })))} className="border border-[var(--pm-border-strong)] text-[var(--pm-text-secondary)] text-xs px-3 py-2 mono hover:border-[#F5B300] hover:text-[var(--pm-accent-text)] transition-colors">
          Export ↓
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Open", value: counts.open, color: "#EF4444" },
          { label: "Reattempt Sched.", value: counts.reattempt, color: "#F5B300" },
          { label: "Refund Requested", value: counts.refund, color: "#E85D04" },
          { label: "Resolved", value: counts.resolved, color: "#22C55E" },
        ].map(k => (
          <div key={k.label} className="border border-[var(--pm-border)] bg-[var(--pm-surface)] p-4">
            <div className="text-xs text-[var(--pm-text-muted)] uppercase tracking-wider mb-1">{k.label}</div>
            <div className="text-3xl font-extrabold mono" style={{ color: k.color }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Status filter */}
      <div className="flex gap-1 flex-wrap">
        {(["all", "open", "reattempt-scheduled", "refund-requested", "escalated", "resolved"] as (FailStatus | "all")[]).map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`text-xs px-3 py-1.5 mono border capitalize transition-colors ${statusFilter === s ? "border-[#F5B300] text-[var(--pm-accent-text)] bg-[#F5B300]/10" : "border-[var(--pm-border)] text-[var(--pm-text-muted)] hover:text-[var(--pm-text-secondary)]"}`}>
            {s === "all" ? "All" : statusStyle[s as FailStatus].label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Table */}
        <div className="col-span-2 border border-[var(--pm-border)] bg-[var(--pm-surface)] overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--pm-border)]">
                {["ID", "Customer", "Rider", "Stream", "Reason", "Attempts", "Status"].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-xs text-[var(--pm-text-muted)] uppercase tracking-wider font-medium whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((f, i) => {
                const cfg = statusStyle[f.status];
                return (
                  <tr key={f.id}
                    onClick={() => setSelected(f)}
                    className={`border-b border-[var(--pm-border)] hover:bg-[var(--pm-surface-subtle)] cursor-pointer transition-colors ${i % 2 === 0 ? "" : "bg-[var(--pm-surface-subtle)]"} ${selected?.id === f.id ? "bg-[var(--pm-surface-subtle)]" : ""}`}>
                    <td className="px-4 py-2.5 mono text-xs text-red-400">{f.id}</td>
                    <td className="px-4 py-2.5 font-medium">{f.customer}</td>
                    <td className="px-4 py-2.5 text-xs text-[var(--pm-text-muted)]">{f.rider}</td>
                    <td className="px-4 py-2.5">
                      <span className="text-xs mono font-bold" style={{ color: f.stream === "RS" ? "#E85D04" : "#F5B300" }}>{f.stream}</span>
                    </td>
                    <td className="px-4 py-2.5 text-xs text-[var(--pm-text-muted)]">{reasonLabels[f.reason]}</td>
                    <td className="px-4 py-2.5 mono text-center text-[var(--pm-text-secondary)]">{f.attempts}</td>
                    <td className="px-4 py-2.5">
                      <span className={`text-xs mono px-2 py-0.5 font-bold ${cfg.bg}`} style={{ color: cfg.color }}>
                        {cfg.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Detail panel */}
        {selected ? (
          <div className="border border-[var(--pm-border)] bg-[var(--pm-surface)] p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="mono text-xs text-red-400 font-bold">{selected.id}</span>
              <span className="text-xs mono font-bold" style={{ color: selected.stream === "RS" ? "#E85D04" : "#F5B300" }}>{selected.stream}</span>
            </div>
            <div>
              <div className="text-xs text-[var(--pm-text-muted)] uppercase tracking-wider mb-0.5">Customer</div>
              <div className="font-semibold">{selected.customer}</div>
            </div>
            <div>
              <div className="text-xs text-[var(--pm-text-muted)] uppercase tracking-wider mb-0.5">Address</div>
              <div className="text-xs text-[var(--pm-text-muted)]">{selected.address}</div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="text-xs text-[var(--pm-text-muted)] uppercase tracking-wider mb-0.5">Order</div>
                <div className="mono text-xs">{selected.orderId}</div>
              </div>
              <div>
                <div className="text-xs text-[var(--pm-text-muted)] uppercase tracking-wider mb-0.5">Rider</div>
                <div className="text-xs">{selected.rider}</div>
              </div>
            </div>
            <div>
              <div className="text-xs text-[var(--pm-text-muted)] uppercase tracking-wider mb-0.5">Reason</div>
              <div className="text-xs">{reasonLabels[selected.reason]}</div>
            </div>
            <div>
              <div className="text-xs text-[var(--pm-text-muted)] uppercase tracking-wider mb-0.5">Notes</div>
              <div className="text-xs text-[var(--pm-text-muted)] bg-[var(--pm-bg)] border border-[var(--pm-border)] p-2">{selected.notes}</div>
            </div>
            <div className="text-xs mono text-[var(--pm-text-muted)]">Failed: {selected.failedAt} · Attempt {selected.attempts}</div>

            {(selected.status === "open" || selected.status === "reattempt-scheduled") && (
              <div className="space-y-2">
                <button onClick={() => updateStatus(selected.id, "reattempt-scheduled")}
                  className="w-full border border-[#F5B300]/40 text-[var(--pm-accent-text)] text-xs py-2 mono hover:bg-[#F5B300]/10 transition-colors font-bold">
                  Schedule Redeliver
                </button>
                <div className="border border-yellow-800/30 bg-yellow-950/10 px-2 py-1 text-[10px] text-yellow-300 mono">
                  ℹ Refund decision recorded here. Shopify Admin executes the payment.
                </div>
                <button onClick={() => updateStatus(selected.id, "refund-requested")}
                  className="w-full border border-[#E85D04]/40 text-[var(--pm-secondary-text)] text-xs py-2 mono hover:bg-orange-950/30 transition-colors font-bold">
                  Request Refund → Shopify ↗
                </button>
                <button onClick={() => updateStatus(selected.id, "escalated")}
                  className="w-full border border-red-800/40 text-red-400 text-xs py-2 mono hover:bg-red-950/30 transition-colors font-bold">
                  Escalate
                </button>
              </div>
            )}
            {selected.status === "escalated" && (
              <button onClick={() => updateStatus(selected.id, "resolved")}
                className="w-full bg-green-900 text-white text-xs py-2 mono hover:bg-green-800 transition-colors font-bold">
                Mark Resolved
              </button>
            )}
            {selected.status === "resolved" && (
              <div className="text-xs text-green-400 mono font-bold text-center py-2">✓ Resolved</div>
            )}
          </div>
        ) : (
          <div className="border border-[var(--pm-border)] bg-[var(--pm-surface)] flex items-center justify-center text-[var(--pm-text-muted)] text-sm p-8 text-center">
            Select a failed delivery to view details and actions
          </div>
        )}
      </div>
    </div>
  );
}
