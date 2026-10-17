import { useState } from "react";
import { downloadCSV } from "../utils/flowUtils";

type FulfillStatus = "active" | "paused" | "cancelled" | "pending-review";

interface Subscriber {
  id: string;
  name: string;
  plan: string;
  goal: "CUT" | "BUILD" | "MAINTAIN";
  mealsRemaining: number;
  totalMeals: number;
  nextBilling: string;
  nextDelivery: string;
  status: FulfillStatus;
  weeklyMeals: number;
  pauseEnd?: string;
}

const subscribers: Subscriber[] = [
  { id: "SUB-001", name: "Marcus Tan", plan: "Low Carb Regular", goal: "CUT", mealsRemaining: 84, totalMeals: 120, nextBilling: "21 Sep 2024", nextDelivery: "16 Sep 2024", status: "active", weeklyMeals: 10 },
  { id: "SUB-002", name: "Priya Nair", plan: "Balance Regular", goal: "BUILD", mealsRemaining: 40, totalMeals: 80, nextBilling: "16 Sep 2024", nextDelivery: "16 Sep 2024", status: "active", weeklyMeals: 10 },
  { id: "SUB-003", name: "Aisha Rahman", plan: "Balance Regular+", goal: "MAINTAIN", mealsRemaining: 60, totalMeals: 80, nextBilling: "23 Sep 2024", nextDelivery: "23 Sep 2024", status: "paused", weeklyMeals: 10, pauseEnd: "23 Sep 2024" },
  { id: "SUB-004", name: "Natalie Foo", plan: "Low Carb Regular+", goal: "BUILD", mealsRemaining: 110, totalMeals: 120, nextBilling: "21 Sep 2024", nextDelivery: "16 Sep 2024", status: "active", weeklyMeals: 10 },
  { id: "SUB-005", name: "Bryan Low", plan: "6 by 60 Plus", goal: "BUILD", mealsRemaining: 20, totalMeals: 80, nextBilling: "16 Sep 2024", nextDelivery: "16 Sep 2024", status: "pending-review", weeklyMeals: 10 },
  { id: "SUB-006", name: "Serene Tay", plan: "Low Carb Regular", goal: "CUT", mealsRemaining: 70, totalMeals: 80, nextBilling: "28 Sep 2024", nextDelivery: "23 Sep 2024", status: "paused", weeklyMeals: 10, pauseEnd: "30 Sep 2024" },
  { id: "SUB-007", name: "Kevin Chia", plan: "Balance Regular+", goal: "MAINTAIN", mealsRemaining: 45, totalMeals: 120, nextBilling: "21 Sep 2024", nextDelivery: "16 Sep 2024", status: "active", weeklyMeals: 10 },
  { id: "SUB-008", name: "Rachel Lim", plan: "Low Carb Regular", goal: "CUT", mealsRemaining: 30, totalMeals: 80, nextBilling: "19 Sep 2024", nextDelivery: "19 Sep 2024", status: "active", weeklyMeals: 10 },
];


const statusStyle: Record<FulfillStatus, { label: string; color: string }> = {
  active: { label: "Active", color: "#22C55E" },
  paused: { label: "Paused", color: "#F5B300" },
  cancelled: { label: "Cancelled", color: "#EF4444" },
  "pending-review": { label: "Pending Review", color: "#E85D04" },
};

export default function Fulfillment({ demoMode }: { demoMode?: boolean } = {}) {
  const [statusFilter, setStatusFilter] = useState<FulfillStatus | "all">("all");
  const [selected, setSelected] = useState<Subscriber | null>(demoMode ? subscribers[0] : null);
  const [items, setItems] = useState(subscribers);
  const [showAction, setShowAction] = useState<"pause" | "cancel" | null>(demoMode ? "pause" : null);

  const filtered = items.filter(s =>
    statusFilter === "all" ? true : s.status === statusFilter
  );

  const updateStatus = (id: string, status: FulfillStatus) => {
    setItems(prev => prev.map(s => s.id === id ? { ...s, status } : s));
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null);
    setShowAction(null);
  };

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold">Subscription Fulfillment Engine</h2>
        <button onClick={() => downloadCSV("fulfillment.csv", items.map(s => ({
          "Sub ID": s.id,
          "Name": s.name,
          "Plan": s.plan,
          "Goal": s.goal,
          "Meals Remaining": s.mealsRemaining,
          "Total Meals": s.totalMeals,
          "Weekly Meals": s.weeklyMeals,
          "Next Billing": s.nextBilling,
          "Next Delivery": s.nextDelivery,
          "Status": statusStyle[s.status].label,
        })))} className="border border-[var(--pm-border-strong)] text-[var(--pm-text-secondary)] text-xs px-3 py-2 mono hover:border-[#F5B300] hover:text-[var(--pm-accent-text)] transition-colors">
          Export ↓
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Active Plans", value: items.filter(s => s.status === "active").length, color: "#22C55E" },
          { label: "Paused", value: items.filter(s => s.status === "paused").length, color: "#F5B300" },
          { label: "Pending Review", value: items.filter(s => s.status === "pending-review").length, color: "#E85D04" },
          { label: "Total Meals Remaining", value: items.filter(s => s.status === "active").reduce((a, s) => a + s.mealsRemaining, 0), color: "#F5B300" },
        ].map(k => (
          <div key={k.label} className="border border-[var(--pm-border)] bg-[var(--pm-surface)] p-4">
            <div className="text-xs text-[var(--pm-text-muted)] uppercase tracking-wider mb-1">{k.label}</div>
            <div className="text-3xl font-extrabold mono" style={{ color: k.color }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Status filter */}
      <div className="flex gap-1">
        {(["all", "active", "paused", "pending-review", "cancelled"] as (FulfillStatus | "all")[]).map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`text-xs px-3 py-1.5 mono border transition-colors ${statusFilter === s ? "border-[#F5B300] text-[var(--pm-accent-text)] bg-[#F5B300]/10" : "border-[var(--pm-border)] text-[var(--pm-text-muted)] hover:text-[var(--pm-text-secondary)]"}`}>
            {s === "all" ? "All" : statusStyle[s as FulfillStatus].label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Table */}
        <div className="col-span-2 border border-[var(--pm-border)] bg-[var(--pm-surface)] overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--pm-border)]">
                {["Subscriber", "Plan", "Progress", "Next Billing", "Next Delivery", "Status"].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-xs text-[var(--pm-text-muted)] uppercase tracking-wider font-medium whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => {
                const pct = Math.round(((s.totalMeals - s.mealsRemaining) / s.totalMeals) * 100);
                return (
                  <tr key={s.id} onClick={() => setSelected(s)}
                    className={`border-b border-[var(--pm-border)] hover:bg-[var(--pm-surface-subtle)] cursor-pointer transition-colors ${i % 2 === 0 ? "" : "bg-[var(--pm-surface-subtle)]"} ${selected?.id === s.id ? "bg-[var(--pm-surface-subtle)]" : ""}`}>
                    <td className="px-4 py-2.5">
                      <div className="font-medium">{s.name}</div>
                      <div className="text-xs mono text-[var(--pm-text-muted)]">{s.id}</div>
                    </td>
                    <td className="px-4 py-2.5 text-xs text-[var(--pm-text-muted)]">{s.plan}</td>
                    <td className="px-4 py-2.5 min-w-24">
                      <div className="text-xs mono text-[var(--pm-text-muted)] mb-0.5">{s.mealsRemaining}/{s.totalMeals} remaining</div>
                      <div className="h-1.5 bg-[var(--pm-surface-muted)]">
                        <div className="h-1.5 bg-[#F5B300]" style={{ width: `${pct}%` }} />
                      </div>
                    </td>
                    <td className="px-4 py-2.5 mono text-xs text-[var(--pm-text-muted)]">{s.nextBilling}</td>
                    <td className="px-4 py-2.5 mono text-xs" style={{ color: "#F5B300" }}>{s.nextDelivery}</td>
                    <td className="px-4 py-2.5">
                      <span className="text-xs mono font-bold" style={{ color: statusStyle[s.status].color }}>
                        {statusStyle[s.status].label}
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
              <span className="mono text-xs text-[var(--pm-accent-text)] font-bold">{selected.id}</span>
              <span className="text-xs mono px-1.5 py-0.5 font-bold text-[var(--pm-accent-text)] bg-yellow-950/30 border border-yellow-800/30">{selected.plan}</span>
            </div>
            <div>
              <div className="text-lg font-bold">{selected.name}</div>
              <div className="text-xs text-[var(--pm-text-muted)]">{selected.plan}</div>
            </div>
            <div>
              <div className="text-xs text-[var(--pm-text-muted)] uppercase tracking-wider mb-1">Fulfillment Progress</div>
              <div className="flex justify-between text-xs mono mb-1">
                <span style={{ color: "#F5B300" }}>{selected.totalMeals - selected.mealsRemaining} delivered</span>
                <span className="text-[var(--pm-text-muted)]">{selected.mealsRemaining} remaining</span>
              </div>
              <div className="h-2 bg-[var(--pm-surface-muted)]">
                <div className="h-2 bg-[#F5B300]" style={{ width: `${Math.round(((selected.totalMeals - selected.mealsRemaining) / selected.totalMeals) * 100)}%` }} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <div className="text-[var(--pm-text-muted)] uppercase tracking-wider mb-0.5">Next Billing</div>
                <div className="mono">{selected.nextBilling}</div>
              </div>
              <div>
                <div className="text-[var(--pm-text-muted)] uppercase tracking-wider mb-0.5">Next Delivery</div>
                <div className="mono text-[var(--pm-accent-text)]">{selected.nextDelivery}</div>
              </div>
              <div>
                <div className="text-[var(--pm-text-muted)] uppercase tracking-wider mb-0.5">Weekly Meals</div>
                <div className="mono">{selected.weeklyMeals} meals/week</div>
              </div>
              <div>
                <div className="text-[var(--pm-text-muted)] uppercase tracking-wider mb-0.5">Status</div>
                <div className="mono font-bold" style={{ color: statusStyle[selected.status].color }}>{statusStyle[selected.status].label}</div>
              </div>
            </div>
            {selected.pauseEnd && (
              <div className="border border-yellow-800/30 bg-yellow-950/10 px-3 py-2 text-xs text-yellow-300 mono">
                Paused until {selected.pauseEnd}
              </div>
            )}
            <div className="space-y-2">
              {selected.status === "active" && (
                <button onClick={() => setShowAction("pause")}
                  className="w-full border border-[#F5B300]/40 text-[var(--pm-accent-text)] text-xs py-2 mono hover:bg-[#F5B300]/10 transition-colors font-bold">
                  Pause Subscription
                </button>
              )}
              {selected.status === "paused" && (
                <button onClick={() => updateStatus(selected.id, "active")}
                  className="w-full bg-green-900 text-white text-xs py-2 mono hover:bg-green-800 transition-colors font-bold">
                  Resume Subscription
                </button>
              )}
              {selected.status !== "cancelled" && (
                <button onClick={() => setShowAction("cancel")}
                  className="w-full border border-red-800/40 text-red-400 text-xs py-2 mono hover:bg-red-950/30 transition-colors">
                  Cancel Subscription
                </button>
              )}
            </div>
            {showAction === "pause" && (
              <div className="border border-[var(--pm-border)] bg-[var(--pm-bg)] p-3 space-y-2">
                <div className="text-xs text-[var(--pm-text-muted)]">Pause duration (weeks):</div>
                {[1, 2, 3, 4].map(w => (
                  <button key={w} onClick={() => updateStatus(selected.id, "paused")}
                    className="w-full border border-[var(--pm-border)] text-[var(--pm-text-muted)] text-xs py-1.5 mono hover:border-[#F5B300] hover:text-[var(--pm-accent-text)] transition-colors">
                    {w} Week{w > 1 ? "s" : ""} — Resume {new Date(Date.now() + w * 7 * 86400000).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
                  </button>
                ))}
              </div>
            )}
            {showAction === "cancel" && (
              <div className="border border-red-800/30 bg-red-950/10 p-3 space-y-2">
                <div className="text-xs text-red-300">Confirm cancellation for {selected.name}?</div>
                <div className="flex gap-2">
                  <button onClick={() => updateStatus(selected.id, "cancelled")} className="flex-1 bg-red-900 text-white text-xs py-1.5 mono hover:bg-red-800 transition-colors">Confirm</button>
                  <button onClick={() => setShowAction(null)} className="flex-1 border border-[var(--pm-border)] text-[var(--pm-text-muted)] text-xs py-1.5 mono hover:text-[var(--pm-text-secondary)] transition-colors">Cancel</button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="border border-[var(--pm-border)] bg-[var(--pm-surface)] flex items-center justify-center text-[var(--pm-text-muted)] text-sm p-8 text-center">
            Select a subscriber to view fulfillment details
          </div>
        )}
      </div>
    </div>
  );
}
