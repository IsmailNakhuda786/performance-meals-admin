import { useState } from "react";
import StatusBadge from "../components/StatusBadge";
import { customers as initialCustomers, goalLabel, type Customer, type PlanType } from "../data";
import type { BusinessStream } from "../App";

function CustomerModal({ customer, onClose, onUpdate }: { customer: Customer; onClose: () => void; onUpdate: (customer: Customer) => void }) {
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [planType, setPlanType] = useState<PlanType>(customer.planType);
  const [credit, setCredit] = useState("");
  const [reason, setReason] = useState("");
  const [success, setSuccess] = useState("");
  const [validationError, setValidationError] = useState("");
  const timeline = [
    { date: "9 Sep 2024", event: "Plan week 8 started", type: "normal" },
    { date: "21 Aug 2024", event: "Menu confirmed for W7", type: "normal" },
    { date: "14 Aug 2024", event: "Plan week 7 started", type: "normal" },
    { date: "7 Aug 2024", event: "Pause request submitted (1 week)", type: "pause" },
    { date: "12 Jan 2024", event: "Subscription started — CUT 12-week plan", type: "start" },
  ];

  const completeAction = () => {
    if (!activeAction) return;
    setValidationError("");
    let updated = { ...customer };
    if (activeAction === "Pause") {
      if (!startDate || !endDate || !reason.trim()) {
        setValidationError("Pause dates and a support note are required.");
        return;
      }
      updated = { ...updated, status: "Paused", pauseStart: startDate, pauseEnd: endDate };
    } else if (activeAction === "Resume") {
      updated = { ...updated, status: "Active", pauseStart: undefined, pauseEnd: undefined };
    } else if (activeAction === "Edit Plan") {
      updated = { ...updated, planType };
    } else if (activeAction === "Add Credit") {
      const amount = Number(credit);
      if (!Number.isFinite(amount) || amount <= 0) {
        setValidationError("Enter a credit amount greater than $0.");
        return;
      }
      if (!reason.trim()) {
        setValidationError("Support note required before credits can be added.");
        return;
      }
      updated = { ...updated, walletBalance: updated.walletBalance + amount };
    } else if (activeAction === "Cancel") {
      if (!reason.trim()) {
        setValidationError("Cancellation reason is required.");
        return;
      }
      setSuccess("Cancellation request submitted for administrator approval. No refund was issued.");
      setActiveAction(null);
      setReason("");
      setTimeout(() => setSuccess(""), 4000);
      return;
    }
    onUpdate(updated);
    setSuccess(
      activeAction === "Add Credit"
        ? `$${Number(credit).toFixed(2)} credit added to ${customer.name}'s wallet.`
        : activeAction === "Pause"
          ? "Subscription paused."
          : activeAction === "Resume"
            ? "Subscription resumed."
            : "Subscription plan updated."
    );
    setActiveAction(null);
    setCredit("");
    setReason("");
    setStartDate("");
    setEndDate("");
    setTimeout(() => setSuccess(""), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={onClose}>
      <div className="bg-[var(--pm-surface)] border border-[var(--pm-border)] w-[680px] max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--pm-border)]">
          <div>
            <div className="font-extrabold text-lg">{customer.name}</div>
            <div className="text-xs text-[var(--pm-text-muted)] mono mt-0.5">{customer.id} · {customer.email}</div>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={customer.status} />
            <button onClick={onClose} className="text-[var(--pm-text-muted)] hover:text-[var(--pm-text-secondary)] text-xl leading-none">×</button>
          </div>
        </div>

        <div className="p-5 space-y-5">
          {/* Stats row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: "LTV", value: `$${customer.ltv.toFixed(2)}`, accent: true },
              { label: "Wallet", value: `$${customer.walletBalance.toFixed(2)}`, accent: false },
              { label: "Points", value: customer.points.toString(), accent: false },
              { label: "Plan Week", value: customer.planWeek, accent: false },
            ].map(s => (
              <div key={s.label} className="border border-[var(--pm-border)] bg-[var(--pm-bg)] p-3">
                <div className="text-xs font-bold text-[var(--pm-text)] uppercase tracking-wider mb-1">{s.label}</div>
                <div className={`text-lg font-extrabold mono ${s.accent ? "text-[var(--pm-accent-text)]" : "text-[var(--pm-text-secondary)]"}`}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex justify-between border-b border-[var(--pm-border)] pb-2">
                <span className="text-[var(--pm-text-muted)]">Plan Type</span>
                <span className="font-medium">{customer.planType}</span>
              </div>
              {customer.goal && (
                <div className="flex justify-between border-b border-[var(--pm-border)] pb-2">
                  <span className="text-[var(--pm-text-muted)]">Goal</span>
                  <span className="font-bold text-[var(--pm-secondary-text)]">{goalLabel(customer.goal)}</span>
                </div>
              )}
              <div className="flex justify-between border-b border-[var(--pm-border)] pb-2">
                <span className="text-[var(--pm-text-muted)]">Next Billing</span>
                <span className="mono">{customer.nextBilling}</span>
              </div>
              <div className="flex justify-between border-b border-[var(--pm-border)] pb-2">
                <span className="text-[var(--pm-text-muted)]">Member Since</span>
                <span className="mono">{customer.joinDate}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between border-b border-[var(--pm-border)] pb-2">
                <span className="text-[var(--pm-text-muted)]">Phone</span>
                <span className="mono">{customer.phone}</span>
              </div>
              <div className="border-b border-[var(--pm-border)] pb-2">
                <span className="text-[var(--pm-text-muted)] block mb-1">Address</span>
                <span className="text-xs">{customer.address}</span>
              </div>
              {customer.pauseStart && (
                <div className="flex justify-between border-b border-[var(--pm-border)] pb-2">
                  <span className="text-[var(--pm-text-muted)]">Paused</span>
                  <span className="mono text-yellow-400">{customer.pauseStart} – {customer.pauseEnd}</span>
                </div>
              )}
            </div>
          </div>

          {/* Timeline */}
          <div>
            <div className="text-xs font-bold text-[var(--pm-text)] uppercase tracking-wider mb-3">Subscription Timeline</div>
            <div className="space-y-1">
              {timeline.map((t, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                    t.type === "start" ? "bg-green-400" :
                    t.type === "pause" ? "bg-yellow-400" : "bg-[var(--pm-surface-muted)]"
                  }`} />
                  <div className="flex-1 flex justify-between text-xs border-b border-[var(--pm-border-soft)] pb-1.5">
                    <span className={t.type === "pause" ? "text-yellow-300" : "text-[var(--pm-text-secondary)]"}>{t.event}</span>
                    <span className="mono text-[var(--pm-text-muted)]">{t.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-[var(--pm-border)]">
            {[
              customer.status === "Paused" ? "Resume" : "Pause",
              "Edit Plan",
              "Add Credit",
              "Cancel",
            ].map(action => (
              <button
                key={action}
                onClick={() => {
                  setActiveAction(action);
                  setValidationError("");
                  setSuccess("");
                }}
                className={`text-xs px-3 py-2 font-medium mono transition-colors ${
                  action === "Cancel"
                    ? "border border-red-800 text-red-400 hover:bg-red-950"
                    : action === "Resume"
                    ? "bg-green-900 text-green-300 hover:bg-green-800"
                    : "border border-[var(--pm-border)] text-[var(--pm-text-secondary)] hover:border-[#F5B300] hover:text-[var(--pm-accent-text)]"
                }`}
              >
                {action}
              </button>
            ))}
          </div>
          {success && (
            <div className="border border-green-800/40 bg-green-950/20 px-4 py-3 text-sm text-green-400 mono">{success}</div>
          )}
          {activeAction && (
            <div className="space-y-3 border border-[#F5B300]/30 bg-[var(--pm-bg)] p-4">
              <div>
                <div className="text-sm font-bold text-[var(--pm-text-secondary)]">{activeAction} subscription</div>
                <div className="mt-1 text-xs text-[var(--pm-text-muted)]">
                  {activeAction === "Cancel"
                    ? "This creates a cancellation request for administrator approval. Renewal continues until the request is approved, and refunds remain separate."
                    : "Review the details before confirming this change."}
                </div>
              </div>
              {activeAction === "Pause" && (
                <div className="grid grid-cols-2 gap-3">
                  <label className="space-y-1 text-xs text-[var(--pm-text-muted)]">Pause start
                    <input type="date" value={startDate} onChange={event => setStartDate(event.target.value)} className="block w-full border border-[var(--pm-border)] bg-[var(--pm-surface)] px-3 py-2 text-[var(--pm-text-secondary)]" />
                  </label>
                  <label className="space-y-1 text-xs text-[var(--pm-text-muted)]">Resume date
                    <input type="date" value={endDate} min={startDate} onChange={event => setEndDate(event.target.value)} className="block w-full border border-[var(--pm-border)] bg-[var(--pm-surface)] px-3 py-2 text-[var(--pm-text-secondary)]" />
                  </label>
                </div>
              )}
              {activeAction === "Edit Plan" && (
                <label className="block space-y-1 text-xs text-[var(--pm-text-muted)]">Plan
                  <select value={planType} onChange={event => setPlanType(event.target.value as PlanType)} className="block w-full border border-[var(--pm-border)] bg-[var(--pm-surface)] px-3 py-2 text-[var(--pm-text-secondary)]">
                    {["Meal Plan", "Ready Series Subscription", "Ready Series A-la-carte", "Ready Series Bundle"].map(plan => <option key={plan}>{plan}</option>)}
                  </select>
                </label>
              )}
              {activeAction === "Add Credit" && (
                <label className="block space-y-1 text-xs text-[var(--pm-text-muted)]">Credit amount
                  <input type="number" min="0.01" step="0.01" value={credit} onChange={event => setCredit(event.target.value)} placeholder="0.00" className="block w-full border border-[var(--pm-border)] bg-[var(--pm-surface)] px-3 py-2 text-[var(--pm-text-secondary)]" />
                </label>
              )}
              {["Pause", "Add Credit", "Cancel"].includes(activeAction) && (
                <label className="block space-y-1 text-xs text-[var(--pm-text-muted)]">Reason
                  <textarea rows={2} value={reason} onChange={event => {
                    setReason(event.target.value);
                    setValidationError("");
                  }} placeholder="Required for the audit trail" className={`block w-full resize-none border bg-[var(--pm-surface)] px-3 py-2 text-[var(--pm-text-secondary)] ${validationError && !reason.trim() ? "border-red-600" : "border-[var(--pm-border)]"}`} />
                </label>
              )}
              {validationError && (
                <div role="alert" className="border border-red-700 bg-red-950/30 px-3 py-2 text-xs font-bold text-red-300 mono">
                  {validationError}
                </div>
              )}
              <div className="flex gap-2">
                <button onClick={() => {
                  setActiveAction(null);
                  setValidationError("");
                }} className="flex-1 border border-[var(--pm-border)] py-2 text-xs text-[var(--pm-text-muted)] mono">Back</button>
                <button onClick={completeAction} className={`flex-1 py-2 text-xs font-bold mono ${activeAction === "Cancel" ? "bg-red-900 text-red-100" : "bg-[#F5B300] text-black"}`}>
                  Confirm {activeAction}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Customers({ stream, onOpenProfile }: { stream: BusinessStream; onOpenProfile?: (customerId: string) => void }) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Customer | null>(null);
  const [customers, setCustomers] = useState(initialCustomers);

  const accent = stream === "meal-plans" ? "var(--pm-accent-text)" : "var(--pm-secondary-text)";

  const streamCustomers = customers.filter(c =>
    stream === "meal-plans" ? c.planType === "Meal Plan" : c.planType !== "Meal Plan"
  );

  const filtered = streamCustomers.filter(c =>
    `${c.name} ${c.email} ${c.planType}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold">Customers</h2>
        <span className="mono text-xs text-[var(--pm-text-muted)]">{filtered.length} customers</span>
      </div>

      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Search by name, email, plan…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-[var(--pm-surface)] border border-[var(--pm-border)] text-[var(--pm-text-secondary)] text-sm px-3 py-2 w-72 focus:outline-none focus:border-[#F5B300] placeholder:text-[var(--pm-text-muted)]"
        />
      </div>

      <div className="border border-[var(--pm-border)] bg-[var(--pm-surface)] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--pm-border)]">
              {["Name", "Email", "Plan Type", "Goal", "Plan Week", "Status", "Next Billing", "LTV", "Wallet", ""].map(h => (
                <th key={h} className="px-4 py-2 text-left text-xs font-bold text-[var(--pm-text)] uppercase tracking-wider font-medium whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((c, i) => (
              <tr
                key={c.id}
                className={`border-b border-[var(--pm-border)] hover:bg-[var(--pm-surface-subtle)] cursor-pointer transition-colors ${i % 2 === 0 ? "" : "bg-[var(--pm-surface-subtle)]"}`}
                onClick={() => onOpenProfile ? onOpenProfile(c.id) : setSelected(c)}
              >
                <td className="px-4 py-2.5 font-semibold">{c.name}</td>
                <td className="px-4 py-2.5 text-xs text-[var(--pm-text-muted)]">{c.email}</td>
                <td className="px-4 py-2.5 text-xs">{c.planType}</td>
                <td className="px-4 py-2.5">
                  {c.goal ? <span className="text-xs font-bold text-[var(--pm-secondary-text)]">{goalLabel(c.goal)}</span> : <span className="text-[var(--pm-text-muted)]">—</span>}
                </td>
                <td className="px-4 py-2.5 mono text-xs">{c.planWeek}</td>
                <td className="px-4 py-2.5"><StatusBadge status={c.status} /></td>
                <td className="px-4 py-2.5 mono text-xs">{c.nextBilling}</td>
                <td className="px-4 py-2.5 mono font-bold" style={{ color: accent }}>${c.ltv.toFixed(2)}</td>
                <td className="px-4 py-2.5 mono text-xs">${c.walletBalance.toFixed(2)}</td>
                <td className="px-4 py-2.5">
                  <span className="text-xs text-[var(--pm-text-muted)] hover:text-[var(--pm-accent-text)] transition-colors">View →</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && <CustomerModal customer={selected} onClose={() => setSelected(null)} onUpdate={updated => {
        setCustomers(current => current.map(customer => customer.id === updated.id ? updated : customer));
        setSelected(updated);
      }} />}
    </div>
  );
}
