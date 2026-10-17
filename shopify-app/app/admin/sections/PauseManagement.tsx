import { useState } from "react";
import { downloadCSV } from "../utils/flowUtils";

type PauseWeeks = 1 | 2 | 3 | 4;

interface PauseRecord {
  id: string;
  subscriber: string;
  plan: string;
  pauseStart: string;
  pauseEnd: string;
  weeks: PauseWeeks;
  status: "active" | "scheduled" | "completed" | "cancelled";
  requestedBy: string;
  requestedAt: string;
  billingImpact: string;
}

const pauses: PauseRecord[] = [
  { id: "PAU-011", subscriber: "Aisha Rahman", plan: "8-Week MAINTAIN Plan", pauseStart: "16 Sep 2024", pauseEnd: "30 Sep 2024", weeks: 2, status: "active", requestedBy: "Customer Portal", requestedAt: "13 Sep 08:30", billingImpact: "Next billing deferred to 30 Sep" },
  { id: "PAU-010", subscriber: "Serene Tay", plan: "8-Week CUT Plan", pauseStart: "23 Sep 2024", pauseEnd: "21 Oct 2024", weeks: 4, status: "scheduled", requestedBy: "Admin — Jerome", requestedAt: "14 Sep 10:00", billingImpact: "Next billing deferred to 21 Oct" },
  { id: "PAU-009", subscriber: "Kevin Chia", plan: "12-Week MAINTAIN Plan", pauseStart: "02 Sep 2024", pauseEnd: "09 Sep 2024", weeks: 1, status: "completed", requestedBy: "Customer Portal", requestedAt: "31 Aug 14:15", billingImpact: "Billing resumed 09 Sep" },
  { id: "PAU-008", subscriber: "Marcus Tan", plan: "12-Week BUILD Plan", pauseStart: "19 Aug 2024", pauseEnd: "02 Sep 2024", weeks: 2, status: "completed", requestedBy: "Customer Portal", requestedAt: "17 Aug 09:00", billingImpact: "Billing resumed 02 Sep" },
  { id: "PAU-007", subscriber: "Rachel Lim", plan: "8-Week CUT Plan", pauseStart: "26 Aug 2024", pauseEnd: "26 Aug 2024", weeks: 1, status: "cancelled", requestedBy: "Admin — Ravi", requestedAt: "24 Aug 12:30", billingImpact: "Cancelled before start" },
];

const statusStyle: Record<string, { color: string; bg: string }> = {
  active: { color: "#F5B300", bg: "bg-yellow-950/30 border border-yellow-800/30" },
  scheduled: { color: "#3B82F6", bg: "bg-blue-950/30 border border-blue-800/30" },
  completed: { color: "#22C55E", bg: "bg-green-950/30 border border-green-800/30" },
  cancelled: { color: "var(--pm-text-muted)", bg: "bg-[var(--pm-surface-muted)]" },
};

const addWeeks = (base: string, weeks: number) => {
  const [day, month, year] = base.split(" ");
  const months: Record<string, number> = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
  const d = new Date(parseInt(year), months[month], parseInt(day));
  d.setDate(d.getDate() + weeks * 7);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).replace(",", "");
};

export default function PauseManagement({ demoMode }: { demoMode?: boolean } = {}) {
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "scheduled" | "completed" | "cancelled">("all");
  const [showNew, setShowNew] = useState(demoMode ?? false);
  const [newWeeks, setNewWeeks] = useState<PauseWeeks>(1);
  const [newStart, setNewStart] = useState(new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }));
  const [pauseSuccess, setPauseSuccess] = useState<string | null>(null);
  const [selectedPause, setSelectedPause] = useState<PauseRecord | null>(null);

  const filtered = pauses.filter(p =>
    statusFilter === "all" ? true : p.status === statusFilter
  );

  const activePauses = pauses.filter(p => p.status === "active").length;
  const scheduledPauses = pauses.filter(p => p.status === "scheduled").length;

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-extrabold">Pause Management Center</h2>
          {activePauses > 0 && (
            <span className="bg-yellow-900 text-yellow-400 border border-yellow-700 text-xs font-bold px-2 py-0.5 mono">{activePauses} active</span>
          )}
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowNew(true)} className="bg-[#F5B300] text-black text-xs font-bold px-4 py-2 mono hover:bg-yellow-400 transition-colors">
            + New Pause
          </button>
          <button onClick={() => {
            const rows = filtered.map(p => ({ ID: p.id, Subscriber: p.subscriber, Plan: p.plan, "Pause Start": p.pauseStart, "Pause End": p.pauseEnd, Weeks: p.weeks, Status: p.status, "Billing Impact": p.billingImpact, "Requested By": p.requestedBy, "Requested At": p.requestedAt }));
            downloadCSV("pause-management.csv", rows);
          }} className="border border-[var(--pm-border-strong)] text-[var(--pm-text-secondary)] text-xs px-3 py-2 mono hover:border-[#F5B300] hover:text-[var(--pm-accent-text)] transition-colors">
            Export ↓
          </button>
        </div>
      </div>

      {pauseSuccess && (
        <div className="border border-green-800/40 bg-green-950/20 px-4 py-2.5 text-xs text-green-400 mono font-bold">
          ✓ {pauseSuccess}
        </div>
      )}

      {/* Business rule callout */}
      <div className="border border-[var(--pm-border)] bg-[var(--pm-surface)] px-4 py-3 flex items-start gap-3">
        <span className="text-[var(--pm-accent-text)] text-base flex-shrink-0">⊞</span>
        <div className="text-xs text-[var(--pm-text-muted)]">
          <span className="text-[var(--pm-text-secondary)] font-semibold">Pause Duration Rule:</span> Pause duration must be in full weeks —{" "}
          <span className="mono text-[var(--pm-accent-text)]">Options: 1 week | 2 weeks | 3 weeks | 4 weeks (maximum)</span>.
          Billing cycle is deferred by the exact pause duration. Meals are not credited for paused periods.
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Active Pauses", value: activePauses, color: "#F5B300" },
          { label: "Scheduled", value: scheduledPauses, color: "#3B82F6" },
          { label: "Completed (30d)", value: pauses.filter(p => p.status === "completed").length, color: "#22C55E" },
          { label: "Avg Pause Duration", value: "2.1 wk", color: "var(--pm-text-muted)" },
        ].map(k => (
          <div key={k.label} className="border border-[var(--pm-border)] bg-[var(--pm-surface)] p-4">
            <div className="text-xs text-[var(--pm-text-muted)] uppercase tracking-wider mb-1">{k.label}</div>
            <div className="text-3xl font-extrabold mono" style={{ color: k.color }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-1">
        {(["all", "active", "scheduled", "completed", "cancelled"] as const).map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`text-xs px-3 py-1.5 mono border capitalize transition-colors ${statusFilter === s ? "border-[#F5B300] text-[var(--pm-accent-text)] bg-[#F5B300]/10" : "border-[var(--pm-border)] text-[var(--pm-text-muted)] hover:text-[var(--pm-text-secondary)]"}`}>
            {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Table + Detail Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className={`${selectedPause ? "col-span-3" : "col-span-5"} border border-[var(--pm-border)] bg-[var(--pm-surface)] overflow-x-auto`}>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--pm-border)]">
                {["ID", "Subscriber", "Plan", "Pause Start", "Pause End", "Weeks", "Billing Impact", "Status", "Requested By"].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-xs text-[var(--pm-text-muted)] uppercase tracking-wider font-medium whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => {
                const cfg = statusStyle[p.status];
                return (
                  <tr key={p.id} onClick={() => setSelectedPause(selectedPause?.id === p.id ? null : p)}
                    className={`border-b border-[var(--pm-border)] cursor-pointer transition-colors ${selectedPause?.id === p.id ? "bg-[var(--pm-surface-subtle)]" : i % 2 === 0 ? "hover:bg-[var(--pm-surface-muted)]" : "bg-[var(--pm-surface-subtle)] hover:bg-[var(--pm-surface-muted)]"}`}>
                    <td className="px-4 py-2.5 mono text-xs text-[var(--pm-accent-text)]">{p.id}</td>
                    <td className="px-4 py-2.5 font-medium">{p.subscriber}</td>
                    <td className="px-4 py-2.5 text-xs text-[var(--pm-text-muted)]">{p.plan}</td>
                    <td className="px-4 py-2.5 mono text-xs">{p.pauseStart}</td>
                    <td className="px-4 py-2.5 mono text-xs">{p.pauseEnd}</td>
                    <td className="px-4 py-2.5 mono text-center font-bold text-[var(--pm-text-secondary)]">{p.weeks}w</td>
                    <td className="px-4 py-2.5 text-xs text-[var(--pm-text-muted)]">{p.billingImpact}</td>
                    <td className="px-4 py-2.5">
                      <span className={`text-xs mono px-2 py-0.5 font-bold capitalize ${cfg.bg}`} style={{ color: cfg.color }}>{p.status}</span>
                    </td>
                    <td className="px-4 py-2.5 text-xs text-[var(--pm-text-muted)]">{p.requestedBy}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Detail Panel */}
        {selectedPause && (
          <div className="col-span-2 border border-[var(--pm-border)] bg-[var(--pm-surface)] flex flex-col">
            <div className="px-4 py-3 border-b border-[var(--pm-border)] flex items-center justify-between">
              <span className="font-bold text-[var(--pm-accent-text)] mono">{selectedPause.id}</span>
              <button onClick={() => setSelectedPause(null)} className="text-[var(--pm-text-muted)] hover:text-[var(--pm-text-muted)] text-xl leading-none mono">×</button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Automation Blocking Status — active pauses */}
              {selectedPause.status === "active" && (
                <div className="border border-[#F5B300]/40 bg-[#F5B300]/5 p-3 space-y-2">
                  <div className="text-xs font-bold text-[var(--pm-accent-text)] uppercase tracking-wider">Automation Status</div>
                  <div className="space-y-1.5 mt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-[var(--pm-text-secondary)]">Subscription Status</span>
                      <span className="mono text-xs font-bold text-[var(--pm-accent-text)] bg-yellow-950/50 border border-yellow-800/40 px-2 py-0.5">PAUSED</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-[var(--pm-text-secondary)]">Automatic Default Order</span>
                      <span className="mono text-xs font-bold text-[var(--pm-secondary-text)] bg-orange-950/40 border border-orange-800/40 px-2 py-0.5">BLOCKED</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-[var(--pm-text-secondary)]">Resume Date</span>
                      <span className="mono text-xs font-bold text-[var(--pm-text-secondary)]">{selectedPause.pauseEnd}</span>
                    </div>
                  </div>
                  <div className="border-t border-[#F5B300]/20 pt-2 mt-1">
                    <p className="text-xs text-[var(--pm-text-muted)] leading-relaxed italic">
                      "Subscription is currently paused. No automatic orders will be generated until the pause ends."
                    </p>
                  </div>
                </div>
              )}

              {/* Scheduled pause automation notice */}
              {selectedPause.status === "scheduled" && (
                <div className="border border-blue-800/40 bg-blue-950/10 p-3 space-y-2">
                  <div className="text-xs font-bold text-blue-400 uppercase tracking-wider">Upcoming Automation Block</div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-[var(--pm-text-secondary)]">Subscription Status</span>
                    <span className="mono text-xs font-bold text-blue-400 bg-blue-950/40 border border-blue-800/40 px-2 py-0.5">SCHEDULED PAUSE</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[var(--pm-text-secondary)]">Orders Blocked From</span>
                    <span className="mono text-xs font-bold text-[var(--pm-text-secondary)]">{selectedPause.pauseStart}</span>
                  </div>
                  <p className="text-xs text-[var(--pm-text-muted)] mt-1">Automatic order generation will be blocked once this pause becomes active.</p>
                </div>
              )}

              {/* Pause details */}
              <div className="space-y-2.5">
                <div className="text-xs font-bold text-[var(--pm-text)] uppercase tracking-wider">Pause Details</div>
                {[
                  { label: "Subscriber", value: selectedPause.subscriber },
                  { label: "Plan", value: selectedPause.plan },
                  { label: "Pause Start", value: selectedPause.pauseStart },
                  { label: "Pause End", value: selectedPause.pauseEnd },
                  { label: "Duration", value: `${selectedPause.weeks} week${selectedPause.weeks > 1 ? "s" : ""}` },
                  { label: "Billing Impact", value: selectedPause.billingImpact },
                  { label: "Requested By", value: selectedPause.requestedBy },
                  { label: "Requested At", value: selectedPause.requestedAt },
                ].map(row => (
                  <div key={row.label} className="flex justify-between items-start gap-2">
                    <span className="text-xs text-[var(--pm-text-secondary)] flex-shrink-0">{row.label}</span>
                    <span className="text-xs mono text-[var(--pm-text-secondary)] text-right">{row.value}</span>
                  </div>
                ))}
              </div>

              {/* Duration options reminder */}
              <div className="border border-[var(--pm-border)] bg-[var(--pm-bg)] px-3 py-2.5">
                <div className="text-xs font-bold text-[var(--pm-text)] uppercase tracking-wider mb-2">Duration Options</div>
                <div className="flex gap-2">
                  {[1, 2, 3, 4].map(w => (
                    <span key={w} className={`mono text-xs px-2 py-1 border ${selectedPause.weeks === w ? "border-[#F5B300] text-[var(--pm-accent-text)] bg-[#F5B300]/10" : "border-[var(--pm-border)] text-[var(--pm-text-muted)]"}`}>
                      {w}w
                    </span>
                  ))}
                </div>
                <div className="text-xs text-[var(--pm-text-muted)] mono mt-1.5">Maximum: 4 weeks</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* New pause modal */}
      {showNew && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center" onClick={() => setShowNew(false)}>
          <div className="bg-[var(--pm-surface-subtle)] border border-[var(--pm-border)] w-full max-w-md p-6 space-y-5" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg">Schedule Pause</h3>
              <button onClick={() => setShowNew(false)} className="text-[var(--pm-text-muted)] hover:text-[var(--pm-text-secondary)] text-xl mono">×</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-[var(--pm-text-muted)] uppercase tracking-wider block mb-2">Subscriber</label>
                <select className="w-full bg-[var(--pm-surface)] border border-[var(--pm-border)] text-[var(--pm-text-secondary)] text-sm px-3 py-2 mono focus:outline-none focus:border-[#F5B300]">
                  {["Marcus Tan", "Priya Nair", "Aisha Rahman", "Natalie Foo", "Bryan Low"].map(n => (
                    <option key={n}>{n}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-[var(--pm-text-muted)] uppercase tracking-wider block mb-2">Pause Start Date</label>
                <input type="text" value={newStart} onChange={e => setNewStart(e.target.value)}
                  className="w-full bg-[var(--pm-surface)] border border-[var(--pm-border)] text-[var(--pm-text-secondary)] text-sm px-3 py-2 mono focus:outline-none focus:border-[#F5B300]" />
              </div>
              <div>
                <label className="text-xs text-[var(--pm-text-muted)] uppercase tracking-wider block mb-2">
                  Pause Duration — <span className="text-[var(--pm-accent-text)]">Options: 1 week | 2 weeks | 3 weeks | 4 weeks (maximum)</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                  {([1, 2, 3, 4] as PauseWeeks[]).map(w => (
                    <button key={w} onClick={() => setNewWeeks(w)}
                      className={`py-3 text-sm font-bold mono border transition-colors ${newWeeks === w ? "bg-[#F5B300] text-black border-[#F5B300]" : "border-[var(--pm-border)] text-[var(--pm-text-muted)] hover:border-[#F5B300] hover:text-[var(--pm-accent-text)]"}`}>
                      {w}w
                    </button>
                  ))}
                </div>
              </div>
              <div className="border border-[#F5B300]/20 bg-[#F5B300]/5 px-3 py-2 text-xs mono">
                <span className="text-[var(--pm-text-muted)]">Resume date: </span>
                <span className="text-[var(--pm-accent-text)] font-bold">{addWeeks(newStart, newWeeks)}</span>
                <span className="text-[var(--pm-text-muted)] ml-2">· {newWeeks} week{newWeeks > 1 ? "s" : ""} pause</span>
              </div>
              <button onClick={() => { setShowNew(false); const msg = `Pause scheduled for ${newWeeks} week${newWeeks > 1 ? "s" : ""} from ${newStart} · Resume: ${addWeeks(newStart, newWeeks)}`; setPauseSuccess(msg); setTimeout(() => setPauseSuccess(null), 4000); }}
                className="w-full bg-[#F5B300] text-black text-sm font-bold py-3 mono hover:bg-yellow-400 transition-colors">
                Confirm Pause
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
