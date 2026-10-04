import { useState } from "react";
import { downloadCSV, nowStr } from "../utils/flowUtils";

type CycleType = "bi-weekly" | "monthly" | "2-months";

interface BillingRecord {
  id: string;
  subscriber: string;
  plan: string;
  goal: "CUT" | "BUILD" | "MAINTAIN";
  currentCycle: CycleType;
  nextBillingDate: string;
  nextBillingAmt: number;
  weeklyMeals: number;
  status: "active" | "paused" | "pending-change";
  pendingCycle?: CycleType;
}

const cycleConfig: Record<CycleType, { label: string; desc: string; multiplier: number }> = {
  "bi-weekly": { label: "Bi-Weekly", desc: "Every 2 weeks · 20 meals/cycle", multiplier: 2 },
  monthly: { label: "Monthly", desc: "Every 4 weeks · 40 meals/cycle", multiplier: 4 },
  "2-months": { label: "2 Months", desc: "Every 8 weeks · 80 meals/cycle", multiplier: 8 },
};

const weeklyRate = 84; // $84/week base

const records: BillingRecord[] = [
  { id: "BC-001", subscriber: "Marcus Tan", plan: "Low Carb Regular", goal: "BUILD", currentCycle: "bi-weekly", nextBillingDate: "21 Sep 2024", nextBillingAmt: 168, weeklyMeals: 10, status: "active" },
  { id: "BC-002", subscriber: "Priya Nair", plan: "Balance Regular", goal: "CUT", currentCycle: "bi-weekly", nextBillingDate: "16 Sep 2024", nextBillingAmt: 168, weeklyMeals: 10, status: "active" },
  { id: "BC-003", subscriber: "Aisha Rahman", plan: "Balance Regular+", goal: "MAINTAIN", currentCycle: "monthly", nextBillingDate: "30 Sep 2024", nextBillingAmt: 336, weeklyMeals: 10, status: "paused" },
  { id: "BC-004", subscriber: "Natalie Foo", plan: "Low Carb Regular+", goal: "BUILD", currentCycle: "bi-weekly", nextBillingDate: "21 Sep 2024", nextBillingAmt: 168, weeklyMeals: 10, status: "pending-change", pendingCycle: "monthly" },
  { id: "BC-005", subscriber: "Bryan Low", plan: "6 by 60 Plus", goal: "BUILD", currentCycle: "monthly", nextBillingDate: "16 Oct 2024", nextBillingAmt: 336, weeklyMeals: 10, status: "active" },
  { id: "BC-006", subscriber: "Serene Tay", plan: "Low Carb Regular", goal: "CUT", currentCycle: "bi-weekly", nextBillingDate: "07 Oct 2024", nextBillingAmt: 168, weeklyMeals: 10, status: "paused" },
  { id: "BC-007", subscriber: "Kevin Chia", plan: "Balance Regular+", goal: "MAINTAIN", currentCycle: "monthly", nextBillingDate: "12 Oct 2024", nextBillingAmt: 336, weeklyMeals: 10, status: "active" },
  { id: "BC-008", subscriber: "Raj Nair", plan: "6 by 60", goal: "BUILD", currentCycle: "2-months", nextBillingDate: "14 Oct 2024", nextBillingAmt: 672, weeklyMeals: 10, status: "active" },
];


const statusColor: Record<string, string> = {
  active: "#22C55E",
  paused: "#F5B300",
  "pending-change": "#E85D04",
};

export default function BillingCycles({ demoMode }: { demoMode?: boolean } = {}) {
  const [selected, setSelected] = useState<BillingRecord | null>(demoMode ? records[0] : null);
  const [pendingCycle, setPendingCycle] = useState<CycleType | null>(null);
  const [cycleFilter, setCycleFilter] = useState<CycleType | "all">("all");
  const [cycleSuccess, setCycleSuccess] = useState<string | null>(null);

  const filtered = records.filter(r =>
    cycleFilter === "all" ? true : r.currentCycle === cycleFilter
  );

  const handleChangeCycle = () => {
    if (!selected || !pendingCycle) return;
    const msg = `Billing cycle change scheduled for ${selected.subscriber}: ${cycleConfig[pendingCycle].label}. Takes effect at next renewal.`;
    setCycleSuccess(msg);
    setTimeout(() => setCycleSuccess(null), 3000);
    setPendingCycle(null);
  };

  const handleExportCSV = () => {
    const rows = records.map(r => ({
      "ID": r.id,
      "Subscriber": r.subscriber,
      "Plan": r.plan,
      "Goal": r.goal,
      "Current Cycle": cycleConfig[r.currentCycle].label,
      "Next Billing Date": r.nextBillingDate,
      "Next Billing Amount": r.nextBillingAmt,
      "Weekly Meals": r.weeklyMeals,
      "Status": r.status,
    }));
    downloadCSV(`billing-cycles-${nowStr().replace(/ /g, "-")}.csv`, rows);
  };

  const biWeeklyRevenue = records.filter(r => r.status === "active" && r.currentCycle === "bi-weekly")
    .reduce((a, r) => a + r.nextBillingAmt, 0);
  const monthlyRevenue = records.filter(r => r.status === "active" && r.currentCycle === "monthly")
    .reduce((a, r) => a + r.nextBillingAmt, 0);
  const twoMonthRevenue = records.filter(r => r.status === "active" && r.currentCycle === "2-months")
    .reduce((a, r) => a + r.nextBillingAmt, 0);

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold">Billing Cycle Center</h2>
        <button onClick={handleExportCSV} className="border border-[#3A3A3A] text-[#CCCCCC] text-xs px-3 py-2 mono hover:border-[#F5B300] hover:text-[#F5B300] transition-colors">
          Export ↓
        </button>
      </div>
      {cycleSuccess && (
        <div className="border border-green-700 bg-green-950/30 px-4 py-2 text-green-400 text-xs mono">
          {cycleSuccess}
        </div>
      )}

      {/* Cycle overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {(["bi-weekly", "monthly", "2-months"] as CycleType[]).map(cycle => {
          const cfg = cycleConfig[cycle];
          const count = records.filter(r => r.currentCycle === cycle && r.status === "active").length;
          const revenue = cycle === "bi-weekly" ? biWeeklyRevenue : cycle === "monthly" ? monthlyRevenue : twoMonthRevenue;
          return (
            <div key={cycle} className="border border-[#2A2A2A] bg-[#181818]">
              <div className="px-4 py-3 border-b border-[#2A2A2A] flex items-center gap-2">
                <span className="text-sm font-bold text-[#F5B300]">{cfg.label}</span>
                <span className="text-xs mono text-[#555]">{cfg.desc}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-[#2A2A2A]">
                <div className="bg-[#181818] p-4">
                  <div className="text-xs text-[#AAAAAA] uppercase tracking-wider mb-1">Active Plans</div>
                  <div className="text-2xl font-extrabold mono text-[#E8E8E8]">{count}</div>
                </div>
                <div className="bg-[#181818] p-4">
                  <div className="text-xs text-[#AAAAAA] uppercase tracking-wider mb-1">Cycle Revenue</div>
                  <div className="text-2xl font-extrabold mono text-[#F5B300]">${revenue}</div>
                </div>
                <div className="bg-[#181818] p-4">
                  <div className="text-xs text-[#AAAAAA] uppercase tracking-wider mb-1">Per Plan Avg</div>
                  <div className="text-2xl font-extrabold mono text-[#E8E8E8]">${count > 0 ? Math.round(revenue / count) : 0}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pricing impact callout */}
      <div className="border border-[#2A2A2A] bg-[#181818] px-4 py-3">
        <div className="text-xs text-[#AAAAAA] uppercase tracking-wider mb-3">Pricing Impact — Cycle Change</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="border border-[#2A2A2A] p-3">
            <div className="text-[#F5B300] font-bold mono mb-1">Bi-Weekly</div>
            <div className="text-[#888]">$168 / cycle · Every 2 weeks</div>
            <div className="text-[#888]">20 meals per cycle</div>
            <div className="text-[#555] mt-2 mono">= $8.40 / meal</div>
          </div>
          <div className="border border-[#2A2A2A] p-3">
            <div className="text-[#F5B300] font-bold mono mb-1">Monthly</div>
            <div className="text-[#888]">$336 / cycle · Every 4 weeks</div>
            <div className="text-[#888]">40 meals per cycle</div>
            <div className="text-green-400 mt-2 mono">= $8.40 / meal · no price diff</div>
          </div>
          <div className="border border-[#2A2A2A] p-3">
            <div className="text-[#F5B300] font-bold mono mb-1">2 Months</div>
            <div className="text-[#888]">$672 / cycle · Every 8 weeks</div>
            <div className="text-[#888]">80 meals per cycle</div>
            <div className="text-green-400 mt-2 mono">= $8.40 / meal · no price diff</div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-1">
        {(["all", "bi-weekly", "monthly", "2-months"] as (CycleType | "all")[]).map(c => (
          <button key={c} onClick={() => setCycleFilter(c)}
            className={`text-xs px-3 py-1.5 mono border transition-colors ${cycleFilter === c ? "border-[#F5B300] text-[#F5B300] bg-[#F5B300]/10" : "border-[#2A2A2A] text-[#888] hover:text-[#E8E8E8]"}`}>
            {c === "all" ? "All Cycles" : cycleConfig[c as CycleType].label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Table */}
        <div className="col-span-2 border border-[#2A2A2A] bg-[#181818] overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2A2A2A]">
                {["Subscriber", "Plan", "Goal", "Current Cycle", "Next Billing", "Amount", "Status"].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-xs text-[#AAAAAA] uppercase tracking-wider font-medium whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr key={r.id} onClick={() => { setSelected(r); setPendingCycle(null); }}
                  className={`border-b border-[#2A2A2A] hover:bg-[#1F1F1F] cursor-pointer transition-colors ${i % 2 === 0 ? "" : "bg-[#141414]"} ${selected?.id === r.id ? "bg-[#1F1F1F]" : ""}`}>
                  <td className="px-4 py-2.5">
                    <div className="font-medium">{r.subscriber}</div>
                    <div className="text-xs mono text-[#555]">{r.id}</div>
                  </td>
                  <td className="px-4 py-2.5 text-xs text-[#888]">{r.plan}</td>
                  <td className="px-4 py-2.5">
                    <span className="text-xs mono font-bold text-[#F5B300]">{r.plan}</span>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="text-xs mono text-[#F5B300] font-bold">{cycleConfig[r.currentCycle].label}</span>
                    {r.pendingCycle && (
                      <div className="text-xs text-[#E85D04] mono">→ {cycleConfig[r.pendingCycle].label}</div>
                    )}
                  </td>
                  <td className="px-4 py-2.5 mono text-xs text-[#888]">{r.nextBillingDate}</td>
                  <td className="px-4 py-2.5 mono font-bold text-[#E8E8E8]">${r.nextBillingAmt}</td>
                  <td className="px-4 py-2.5">
                    <span className="text-xs mono font-bold" style={{ color: statusColor[r.status] }}>
                      {r.status === "pending-change" ? "Change Pending" : r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Detail panel */}
        {selected ? (
          <div className="border border-[#2A2A2A] bg-[#181818] p-4 space-y-4">
            <div>
              <div className="text-xs mono text-[#555]">{selected.id}</div>
              <div className="text-base font-bold">{selected.subscriber}</div>
              <div className="text-xs text-[#888]">{selected.plan}</div>
            </div>
            <div>
              <div className="text-xs text-[#AAAAAA] uppercase tracking-wider mb-1">Current Cycle</div>
              <div className="text-sm font-bold text-[#F5B300]">{cycleConfig[selected.currentCycle].label}</div>
              <div className="text-xs text-[#555] mono">{cycleConfig[selected.currentCycle].desc}</div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <div className="text-[#AAAAAA] uppercase tracking-wider mb-0.5">Next Billing</div>
                <div className="mono">{selected.nextBillingDate}</div>
              </div>
              <div>
                <div className="text-[#AAAAAA] uppercase tracking-wider mb-0.5">Amount Due</div>
                <div className="mono font-bold text-[#F5B300]">${selected.nextBillingAmt}</div>
              </div>
            </div>

            <div>
              <div className="text-xs text-[#AAAAAA] uppercase tracking-wider mb-2">Change Billing Cycle</div>
              <div className="space-y-2">
                {(["bi-weekly", "monthly", "2-months"] as CycleType[]).map(c => (
                  <button key={c}
                    onClick={() => setPendingCycle(c === selected.currentCycle ? null : c)}
                    disabled={c === selected.currentCycle}
                    className={`w-full border p-3 text-left transition-colors text-xs ${c === selected.currentCycle ? "border-[#2A2A2A] text-[#555] cursor-default" : pendingCycle === c ? "border-[#F5B300] bg-[#F5B300]/10 text-[#F5B300]" : "border-[#2A2A2A] text-[#888] hover:border-[#555] hover:text-[#E8E8E8]"}`}>
                    <div className="font-bold mono">{cycleConfig[c].label}</div>
                    <div className="text-[#555]">{cycleConfig[c].desc}</div>
                    {c === selected.currentCycle && <div className="text-[#555] mt-0.5">Current</div>}
                  </button>
                ))}
              </div>
            </div>

            {pendingCycle && pendingCycle !== selected.currentCycle && (
              <div className="space-y-2">
                <div className="border border-[#F5B300]/20 bg-[#F5B300]/5 px-3 py-2 text-xs mono">
                  <div className="text-[#888]">Impact: billing changes to <span className="text-[#F5B300] font-bold">{cycleConfig[pendingCycle].label}</span> at next renewal.</div>
                  <div className="text-[#555] mt-1">New amount: <span className="text-[#F5B300] font-bold">${weeklyRate * cycleConfig[pendingCycle].multiplier}</span></div>
                </div>
                <button onClick={handleChangeCycle}
                  className="w-full bg-[#F5B300] text-black text-xs font-bold py-2 mono hover:bg-yellow-400 transition-colors">
                  Confirm Cycle Change
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="border border-[#2A2A2A] bg-[#181818] flex items-center justify-center text-[#555] text-sm p-8 text-center">
            Select a subscriber to manage their billing cycle
          </div>
        )}
      </div>
    </div>
  );
}
