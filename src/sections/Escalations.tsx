import { useState } from "react";
import type { EscalationStatus, RefundEscalation } from "../data";

const statusClass: Record<EscalationStatus, string> = {
  Open: "bg-red-950/30 text-red-400",
  "In Progress": "bg-blue-950/30 text-blue-400",
  Approved: "bg-green-950/30 text-green-400",
  Rejected: "bg-[var(--pm-surface-muted)] text-[var(--pm-text-muted)]",
};

export default function Escalations({
  escalations,
  onUpdateStatus,
  onOpenProfile,
  onOpenOrder,
}: {
  escalations: RefundEscalation[];
  onUpdateStatus: (id: string, status: EscalationStatus) => void;
  onOpenProfile: (customerId: string) => void;
  onOpenOrder: (sourceId: string, customerName: string) => void;
}) {
  const [selectedId, setSelectedId] = useState(escalations[0]?.id ?? "");
  const [decisionConfirmation, setDecisionConfirmation] = useState("");
  const [view, setView] = useState<"active" | "history">("active");
  const activeEscalations = escalations.filter(item => item.status === "Open" || item.status === "In Progress");
  const escalationHistory = escalations.filter(item => item.status === "Approved" || item.status === "Rejected");
  const visibleEscalations = view === "active" ? activeEscalations : escalationHistory;
  const selected = visibleEscalations.find(item => item.id === selectedId) ?? visibleEscalations[0];

  const confirmDecision = (status: "Approved" | "Rejected") => {
    if (!selected) return;
    onUpdateStatus(selected.id, status);
    setView("history");
    setDecisionConfirmation(
      status === "Approved"
        ? `Decision confirmed. ${selected.refundId} was approved. Marketing, Sales, and Customer Support were notified, and an outcome email was sent to ${selected.customerName}.`
        : `Decision confirmed. ${selected.refundId} was rejected. Marketing, Sales, and Customer Support were notified, and an outcome email was sent to ${selected.customerName}.`
    );
  };

  return (
    <div className="space-y-5 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-extrabold">Escalations</h2>
          <div className="mt-1 text-xs text-[var(--pm-text-muted)]">Super Admin decision queue for refund exceptions and high-risk matters.</div>
        </div>
        <span className="bg-red-950/30 px-3 py-2 text-xs font-bold text-red-400 mono">{escalations.filter(item => item.status === "Open" || item.status === "In Progress").length} active</span>
      </div>
      {decisionConfirmation && <div role="status" className="border border-green-800/40 bg-green-950/20 px-4 py-3 text-xs font-bold text-green-400 mono">{decisionConfirmation}</div>}

      <div className="flex border-b border-[var(--pm-border)]">
        <button onClick={() => {
          setView("active");
          if (activeEscalations[0]) setSelectedId(activeEscalations[0].id);
        }} className={`border-b-2 px-4 py-3 text-xs font-bold ${view === "active" ? "border-[#F5B300] text-[var(--pm-accent-text)]" : "border-transparent text-[var(--pm-text-muted)]"}`}>Active Queue <span className="ml-1 mono">({activeEscalations.length})</span></button>
        <button onClick={() => {
          setView("history");
          if (escalationHistory[0]) setSelectedId(escalationHistory[0].id);
        }} className={`border-b-2 px-4 py-3 text-xs font-bold ${view === "history" ? "border-[#F5B300] text-[var(--pm-accent-text)]" : "border-transparent text-[var(--pm-text-muted)]"}`}>Decision History <span className="ml-1 mono">({escalationHistory.length})</span></button>
      </div>

      {!visibleEscalations.length ? (
        <div className="border border-[var(--pm-border)] bg-[var(--pm-surface)] p-12 text-center">
          <div className="text-sm font-semibold">{view === "active" ? "No active escalations" : "No escalation history"}</div>
          <div className="mt-1 text-xs text-[var(--pm-text-muted)]">{view === "active" ? "New refund matters escalated by Finance will appear here." : "Approved and rejected matters will appear here with their outcome audit."}</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="border border-[var(--pm-border)] bg-[var(--pm-surface)]">
            <div className="grid grid-cols-[110px_minmax(0,1fr)_130px_120px] gap-3 border-b border-[var(--pm-border)] px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-[var(--pm-text-muted)]">
              <span>Escalation</span><span>Matter</span><span>Amount</span><span>Status</span>
            </div>
            <div className="divide-y divide-[var(--pm-border-soft)]">
              {visibleEscalations.map(item => (
                <button key={item.id} onClick={() => setSelectedId(item.id)} className={`grid w-full grid-cols-[110px_minmax(0,1fr)_130px_120px] gap-3 px-4 py-3 text-left transition-colors ${selected?.id === item.id ? "bg-[var(--pm-active)]" : "hover:bg-[var(--pm-surface-subtle)]"}`}>
                  <span className="text-xs font-bold text-[var(--pm-accent-text)] mono">{item.id}</span>
                  <span><span className="block text-sm font-semibold">{item.customerName}</span><span className="mt-1 block text-xs text-[var(--pm-text-muted)]">{item.refundId} · {item.sourceId}</span></span>
                  <span className="text-sm font-bold mono">${item.amount.toFixed(2)}</span>
                  <span><span className={`px-2 py-1 text-[10px] font-bold mono ${statusClass[item.status]}`}>{item.status}</span></span>
                </button>
              ))}
            </div>
          </div>

          {selected && (
            <aside className="border border-[var(--pm-border)] bg-[var(--pm-surface)]">
              <div className="flex items-center justify-between border-b border-[var(--pm-border)] px-4 py-3">
                <span className="font-bold text-[var(--pm-accent-text)] mono">{selected.id}</span>
                <span className={`px-2 py-1 text-[10px] font-bold mono ${statusClass[selected.status]}`}>{selected.status}</span>
              </div>
              <div className="space-y-4 p-4">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--pm-text-muted)]">Customer</div>
                  <button type="button" disabled={!selected.customerId} onClick={() => selected.customerId && onOpenProfile(selected.customerId)} className="mt-1 text-base font-bold underline decoration-[#F5B300]/50 underline-offset-4 hover:text-[var(--pm-accent-text)] disabled:no-underline">{selected.customerName}</button>
                  <button type="button" disabled={!selected.customerId} onClick={() => selected.customerId && onOpenProfile(selected.customerId)} className="mt-2 block w-full border border-[var(--pm-border)] px-3 py-2 text-left text-xs font-bold text-[var(--pm-accent-text)] disabled:opacity-40">Open Customer Profile &amp; History →</button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="border border-[var(--pm-border)] bg-[var(--pm-bg)] p-3"><div className="text-[10px] uppercase text-[var(--pm-text-muted)]">Refund</div><div className="mt-1 font-bold mono">{selected.refundId}</div></div>
                  <div className="border border-[var(--pm-border)] bg-[var(--pm-bg)] p-3"><div className="text-[10px] uppercase text-[var(--pm-text-muted)]">Amount</div><div className="mt-1 font-bold mono">${selected.amount.toFixed(2)}</div></div>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--pm-text-muted)]">Order / Plan</div>
                  <button onClick={() => onOpenOrder(selected.sourceId, selected.customerName)} className="mt-1 font-bold text-[var(--pm-accent-text)] underline underline-offset-4 mono">{selected.sourceId}</button>
                </div>
                <div className="border border-[var(--pm-border)] bg-[var(--pm-bg)] p-3">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--pm-text-muted)]">Escalation reason</div>
                  <div className="mt-2 text-sm leading-relaxed">{selected.reason}</div>
                </div>
                <div className="space-y-1 text-xs text-[var(--pm-text-muted)] mono">
                  <div>Raised by {selected.raisedBy}</div>
                  <div>Assigned to {selected.assignedTo}</div>
                  <div>{selected.createdAt}</div>
                </div>
                {(selected.status === "Approved" || selected.status === "Rejected") && (
                  <div className={`border p-3 ${selected.status === "Approved" ? "border-green-800/40 bg-green-950/20" : "border-red-800/40 bg-red-950/20"}`}>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--pm-text-muted)]">Decision outcome</div>
                    <div className={`mt-2 text-sm font-bold ${selected.status === "Approved" ? "text-green-400" : "text-red-400"}`}>{selected.status}</div>
                    <div className="mt-2 text-xs leading-relaxed text-[var(--pm-text-secondary)]">{selected.outcomeSummary ?? "Decision recorded by Super Admin."}</div>
                    <div className="mt-3 space-y-1 border-t border-[var(--pm-border)] pt-2 text-xs text-[var(--pm-text-muted)] mono">
                      <div>Decided by {selected.decidedBy ?? selected.assignedTo}</div>
                      <div>{selected.decidedAt ?? "Decision time recorded"}</div>
                    </div>
                  </div>
                )}
                {(selected.status === "Approved" || selected.status === "Rejected") && (
                  <div className="border border-[var(--pm-border)] bg-[var(--pm-bg)] p-3">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--pm-text-muted)]">Outcome notifications</div>
                    <div className="mt-2 space-y-1 text-xs text-[var(--pm-text-secondary)]">
                      {(selected.notifiedDepartments ?? []).map(department => <div key={department}>{department} notified</div>)}
                      <div>{selected.customerEmailSent ? `Outcome email sent to ${selected.customerName}` : "Customer email pending"}</div>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-2 border-t border-[var(--pm-border)] pt-4">
                  {selected.status === "Open" && <button onClick={() => onUpdateStatus(selected.id, "In Progress")} className="col-span-2 bg-blue-900 px-3 py-2 text-xs font-bold text-blue-100">Take Ownership</button>}
                  {(selected.status === "Open" || selected.status === "In Progress") && <><button onClick={() => confirmDecision("Rejected")} className="border border-red-900/50 px-3 py-2 text-xs font-bold text-red-400">Reject</button><button onClick={() => confirmDecision("Approved")} className="bg-green-800 px-3 py-2 text-xs font-bold text-white">Approve Outcome</button></>}
                </div>
              </div>
            </aside>
          )}
        </div>
      )}
    </div>
  );
}
