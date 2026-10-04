import { useState } from "react";
import { downloadCSV, nowStr } from "../utils/flowUtils";

type ReviewStatus = "reviewed" | "pending" | "locked";
type WeekTab = "current" | "upcoming" | "locked";

interface ReviewEntry {
  id: string;
  customer: string;
  plan: string;
  goal: "CUT" | "BUILD" | "MAINTAIN";
  week: WeekTab;
  status: ReviewStatus;
  mealsSelected: number;
  totalSlots: number;
  lockedAt?: string;
  meals: string[];
}

interface ChangeLogEntry {
  id: string;
  changedBy: string;
  fromMeal: string;
  toMeal: string;
  date: string;
  deliveryDate: string;
  reason: string;
}

const reviews: ReviewEntry[] = [
  { id: "MR-038", customer: "Marcus Tan", plan: "12-Week BUILD Plan", goal: "BUILD", week: "current", status: "reviewed", mealsSelected: 10, totalSlots: 10, lockedAt: "Thu 12 Sep 11:00", meals: ["Salmon Teriyaki & Quinoa", "Grilled Chicken & Rice", "Chicken & Sweet Potato", "Beef & Broccoli (x2)", "High Protein Oats Bowl (x2)", "Tuna Salad Wrap (x2)", "Egg White Scramble"] },
  { id: "MR-039", customer: "Priya Nair", plan: "8-Week CUT Plan", goal: "CUT", week: "current", status: "reviewed", mealsSelected: 10, totalSlots: 10, lockedAt: "Thu 12 Sep 10:30", meals: ["Grilled Chicken & Rice (x3)", "Lean Beef & Broccoli (x2)", "Prawn Stir Fry & Veg (x3)", "Tuna Salad Wrap (x2)"] },
  { id: "MR-040", customer: "Aisha Rahman", plan: "8-Week MAINTAIN Plan", goal: "MAINTAIN", week: "current", status: "pending", mealsSelected: 6, totalSlots: 10, meals: ["Sweet Potato & Chicken (x2)", "Salmon Teriyaki & Rice (x2)", "Egg White Scramble (x2)"] },
  { id: "MR-041", customer: "Natalie Foo", plan: "12-Week BUILD Plan", goal: "BUILD", week: "current", status: "reviewed", mealsSelected: 10, totalSlots: 10, lockedAt: "Thu 12 Sep 09:45", meals: ["Beef Rendang & Rice (x2)", "Salmon Teriyaki & Quinoa (x3)", "Chicken Stir Fry (x3)", "Oats & Protein Shake (x2)"] },
  { id: "MR-042", customer: "Bryan Low", plan: "8-Week BUILD Plan", goal: "BUILD", week: "current", status: "pending", mealsSelected: 4, totalSlots: 10, meals: ["Grilled Chicken & Rice (x2)", "Beef Steak & Greens (x2)"] },
  { id: "MR-043", customer: "Serene Tay", plan: "8-Week CUT Plan", goal: "CUT", week: "current", status: "locked", mealsSelected: 10, totalSlots: 10, lockedAt: "Auto-locked 12 Sep 12:00", meals: ["Default CUT Meal Selection (system default)"] },
  { id: "MR-044", customer: "Marcus Tan", plan: "12-Week BUILD Plan", goal: "BUILD", week: "upcoming", status: "pending", mealsSelected: 0, totalSlots: 10, meals: [] },
  { id: "MR-045", customer: "Priya Nair", plan: "8-Week CUT Plan", goal: "CUT", week: "upcoming", status: "pending", mealsSelected: 0, totalSlots: 10, meals: [] },
  { id: "MR-046", customer: "Bryan Low", plan: "8-Week BUILD Plan", goal: "BUILD", week: "upcoming", status: "pending", mealsSelected: 2, totalSlots: 10, meals: ["Salmon Teriyaki (x2)"] },
  { id: "MR-037", customer: "Kevin Chia", plan: "12-Week MAINTAIN Plan", goal: "MAINTAIN", week: "locked", status: "locked", mealsSelected: 10, totalSlots: 10, lockedAt: "Thu 05 Sep 11:30", meals: ["Sweet Potato & Chicken (x3)", "Salmon & Quinoa (x3)", "Chicken Stir Fry (x2)", "Egg & Veg Bowl (x2)"] },
  { id: "MR-036", customer: "Rachel Lim", plan: "8-Week CUT Plan", goal: "CUT", week: "locked", status: "locked", mealsSelected: 10, totalSlots: 10, lockedAt: "Thu 05 Sep 10:00", meals: ["Grilled Chicken & Rice (x4)", "Lean Beef & Broccoli (x3)", "Tuna Wrap (x3)"] },
];

const MEAL_OPTIONS = [
  "Salmon Teriyaki & Quinoa",
  "Grilled Chicken & Rice",
  "Beef & Broccoli",
  "Sweet Potato & Chicken",
  "Tuna Salad Wrap",
  "Egg White Scramble",
  "Chicken Stir Fry",
  "Prawn Stir Fry & Veg",
];

const DELIVERY_DATES = [
  { label: "Mon 16 Sep", day: 1 },
  { label: "Tue 17 Sep", day: 2 },
  { label: "Wed 18 Sep", day: 3 },
  { label: "Thu 19 Sep", day: 4 },
  { label: "Fri 20 Sep", day: 5 },
  { label: "Sat 21 Sep", day: 6 },
];

// day: 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat, 0=Sun
const MEAL_VALIDITY: Record<string, number[]> = {
  "Salmon Teriyaki & Quinoa": [1, 3, 5],
  "Grilled Chicken & Rice": [1, 2, 3, 4, 5, 6, 0],
  "Beef & Broccoli": [1, 2, 3, 4],
  "Lean Beef & Broccoli": [1, 2, 3, 4],
  "Sweet Potato & Chicken": [1, 2, 3, 4, 5, 6, 0],
  "Tuna Salad Wrap": [1, 3, 5, 6],
  "Chicken Teriyaki": [1, 3, 5],
  "Egg White Scramble": [1, 2, 3, 4, 5, 6, 0],
  "Chicken Stir Fry": [1, 2, 3, 4, 5, 6, 0],
  "Prawn Stir Fry & Veg": [1, 2, 3, 4, 5, 6, 0],
};

function getMealValidity(baseName: string, day: number): { valid: boolean; warning?: string } {
  const validDays = MEAL_VALIDITY[baseName];
  if (!validDays) return { valid: true };
  const valid = validDays.includes(day);
  if (!valid && baseName === "Chicken Teriyaki" && day === 2) {
    return { valid: false, warning: "Chicken Teriyaki is not available for Tuesday delivery" };
  }
  return { valid };
}

const weekLabels: Record<WeekTab, { label: string; dates: string; cutoff: string }> = {
  current: { label: "Current Week", dates: "Week 38 · 16–22 Sep 2024", cutoff: "Cutoff: Thu 12 Sep 1:59 PM" },
  upcoming: { label: "Upcoming Week", dates: "Week 39 · 23–29 Sep 2024", cutoff: "Cutoff: Thu 19 Sep 1:59 PM" },
  locked: { label: "Locked Reviews", dates: "Week 37 · 09–15 Sep 2024", cutoff: "Locked" },
};

const statusStyle: Record<ReviewStatus, { color: string; label: string }> = {
  reviewed: { color: "#22C55E", label: "Reviewed" },
  pending: { color: "#F5B300", label: "Pending" },
  locked: { color: "#888", label: "Locked" },
};


export default function MenuReview({ demoMode }: { demoMode?: boolean } = {}) {
  const [weekTab, setWeekTab] = useState<WeekTab>("current");
  const [selected, setSelected] = useState<ReviewEntry | null>(demoMode ? reviews.filter(r => r.week === "current")[0] ?? null : null);
  const [showOverride, setShowOverride] = useState(demoMode ?? false);
  const [menuLocked, setMenuLocked] = useState(false);
  const [overrideSuccess, setOverrideSuccess] = useState<string | null>(null);

  // Admin Meal Change state
  const [showMealChange, setShowMealChange] = useState(false);
  const [newMeal, setNewMeal] = useState(MEAL_OPTIONS[0]);
  const [changeDelivery, setChangeDelivery] = useState(DELIVERY_DATES[0].label);
  const [changeReason, setChangeReason] = useState("");
  const [reasonError, setReasonError] = useState(false);
  const [changeLogs, setChangeLogs] = useState<Record<string, ChangeLogEntry[]>>({});

  const weekRows = reviews.filter(r => r.week === weekTab);
  const info = weekLabels[weekTab];

  const reviewedCount = weekRows.filter(r => r.status === "reviewed").length;
  const pendingCount = weekRows.filter(r => r.status === "pending").length;
  const lockedCount = weekRows.filter(r => r.status === "locked").length;

  const selectedLogs = selected ? (changeLogs[selected.id] ?? []) : [];

  function handleSaveChange() {
    if (!changeReason.trim()) { setReasonError(true); return; }
    if (!selected) return;
    setReasonError(false);
    const originalMeal = selected.meals[0] ?? "—";
    const entry: ChangeLogEntry = {
      id: `CHG-${Date.now()}`,
      changedBy: "Jerome Lim (Super Admin)",
      fromMeal: originalMeal,
      toMeal: newMeal,
      date: nowStr(),
      deliveryDate: changeDelivery,
      reason: changeReason,
    };
    setChangeLogs(prev => ({ ...prev, [selected.id]: [entry, ...(prev[selected.id] ?? [])] }));
    setShowMealChange(false);
    setChangeReason("");
    setNewMeal(MEAL_OPTIONS[0]);
    const msg = `Meal change saved for ${selected.customer} — ${originalMeal} → ${newMeal}`;
    setOverrideSuccess(msg);
    setShowPropagation(true);
    setTimeout(() => setOverrideSuccess(null), 8000);
  }

  // Downstream propagation state — shown after admin meal change is saved
  const [showPropagation, setShowPropagation] = useState(false);

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold">Menu Review Engine</h2>
        <div className="flex gap-2">
          {weekTab === "current" && !menuLocked && (
            <button onClick={() => setMenuLocked(true)}
              className="bg-[#F5B300] text-black text-xs font-bold px-4 py-2 mono hover:bg-yellow-400 transition-colors">
              Lock Menu
            </button>
          )}
          <button onClick={() => {
            const rows = weekRows.map(r => ({ ID: r.id, Customer: r.customer, Plan: r.plan, Goal: r.goal, Selections: `${r.mealsSelected}/${r.totalSlots}`, Status: r.status, "Locked At": r.lockedAt ?? "" }));
            downloadCSV("menu-review.csv", rows);
          }} className="border border-[#3A3A3A] text-[#CCCCCC] text-xs px-3 py-2 mono hover:border-[#F5B300] hover:text-[#F5B300] transition-colors">
            Export Menu List ↓
          </button>
        </div>
      </div>

      {overrideSuccess && (
        <div className="border border-green-800/40 bg-green-950/20 px-4 py-2.5 flex items-center gap-2 text-xs text-green-400 mono font-bold">
          ✓ {overrideSuccess}
        </div>
      )}

      {menuLocked && weekTab === "current" && (
        <div className="border border-green-800/40 bg-green-950/20 px-4 py-2.5 flex items-center gap-2 text-xs text-green-400 mono font-bold">
          ✓ Week 38 menu is locked — kitchen production queue updated.
        </div>
      )}

      {/* Week tabs */}
      <div className="flex border-b border-[#2A2A2A]">
        {(["current", "upcoming", "locked"] as WeekTab[]).map(tab => (
          <button key={tab} onClick={() => { setWeekTab(tab); setSelected(null); setShowMealChange(false); }}
            className={`px-5 py-3 text-sm font-medium mono transition-colors ${weekTab === tab ? "border-b-2 border-[#F5B300] text-[#F5B300]" : "text-[#888] hover:text-[#E8E8E8]"}`}>
            {weekLabels[tab].label}
            {tab === "current" && pendingCount > 0 && (
              <span className="ml-2 bg-yellow-900 text-yellow-400 text-xs px-1.5 py-0.5 mono">{pendingCount}</span>
            )}
          </button>
        ))}
      </div>

      {/* Week info bar */}
      <div className="flex items-center gap-4 text-xs">
        <span className="text-[#F5B300] font-bold mono">{info.dates}</span>
        <span className="text-[#555]">·</span>
        <span className={`mono ${weekTab === "locked" ? "text-[#555]" : "text-[#888]"}`}>{info.cutoff}</span>
        <div className="ml-auto flex gap-4 mono text-xs">
          <span className="text-green-400">{reviewedCount} reviewed</span>
          <span className="text-[#F5B300]">{pendingCount} pending</span>
          {lockedCount > 0 && <span className="text-[#555]">{lockedCount} auto-locked</span>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Review table */}
        <div className="col-span-2 border border-[#2A2A2A] bg-[#181818] overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2A2A2A]">
                {["ID", "Customer", "Plan", "Goal", "Selections", "Status", "Locked At"].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-xs text-[#AAAAAA] uppercase tracking-wider font-medium whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {weekRows.map((r, i) => (
                <tr key={r.id} onClick={() => { setSelected(r); setShowMealChange(false); }}
                  className={`border-b border-[#2A2A2A] hover:bg-[#1F1F1F] cursor-pointer transition-colors ${i % 2 === 0 ? "" : "bg-[#141414]"} ${selected?.id === r.id ? "bg-[#1F1F1F]" : ""}`}>
                  <td className="px-4 py-2.5 mono text-xs text-[#F5B300]">{r.id}</td>
                  <td className="px-4 py-2.5 font-medium">{r.customer}</td>
                  <td className="px-4 py-2.5 text-xs text-[#888]">{r.plan}</td>
                  <td className="px-4 py-2.5">
                    <span className="text-xs mono px-1.5 py-0.5 font-bold text-[#F5B300] bg-yellow-950/30 border border-yellow-800/30">{r.plan}</span>
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <span className="mono text-xs text-[#E8E8E8] font-bold">{r.mealsSelected}/{r.totalSlots}</span>
                      <div className="w-16 h-1.5 bg-[#2A2A2A]">
                        <div className="h-1.5 bg-[#F5B300]" style={{ width: `${(r.mealsSelected / r.totalSlots) * 100}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="text-xs mono font-bold" style={{ color: statusStyle[r.status].color }}>
                      {statusStyle[r.status].label}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 mono text-xs text-[#555]">{r.lockedAt ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Detail panel */}
        {selected ? (
          <div className="border border-[#2A2A2A] bg-[#181818] p-4 space-y-4 overflow-y-auto" style={{ maxHeight: "720px" }}>
            <div className="flex items-center justify-between">
              <span className="mono text-xs text-[#F5B300]">{selected.id}</span>
              <span className="text-xs mono px-1.5 py-0.5 font-bold text-[#F5B300] bg-yellow-950/30 border border-yellow-800/30">{selected.plan}</span>
            </div>
            <div>
              <div className="font-bold">{selected.customer}</div>
              <div className="text-xs text-[#888]">{selected.plan}</div>
            </div>

            {/* Meal Selections */}
            <div>
              <div className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider mb-1">Meal Selections ({selected.mealsSelected}/{selected.totalSlots})</div>
              {selected.meals.length > 0 ? (
                <div className="space-y-1">
                  {selected.meals.map((m, i) => (
                    <div key={`${selected.id}-meal-${i}`} className="text-xs text-[#E8E8E8] bg-[#0F0F0F] border border-[#1A1A1A] px-2 py-1.5">{m}</div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-[#555] italic">No selections yet</div>
              )}
            </div>

            {/* Menu Validity — validated per actual delivery date */}
            {selected.meals.length > 0 && (
              <div className="border border-[#2A2A2A] bg-[#0F0F0F] p-3 space-y-2">
                <div className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider mb-2">Menu / Date Validity Matrix</div>
                <div className="text-xs text-[#888] mono mb-2">Each meal validated against every delivery date — not a single hardcoded day.</div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr>
                        <th className="text-left text-[#AAAAAA] font-bold pb-1.5 pr-2 whitespace-nowrap">Meal</th>
                        {DELIVERY_DATES.map(d => (
                          <th key={d.label} className="text-center text-[#AAAAAA] font-bold pb-1.5 px-1 whitespace-nowrap">{d.label}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[...new Set(selected.meals.map(m => m.replace(/\s*\(x\d+\)$/, "").trim()))].map(baseName => (
                        <tr key={baseName} className="border-t border-[#1A1A1A]">
                          <td className="py-1.5 pr-2 text-[#CCCCCC] mono leading-tight">{baseName}</td>
                          {DELIVERY_DATES.map(d => {
                            const { valid, warning } = getMealValidity(baseName, d.day);
                            return (
                              <td key={d.label} className="py-1.5 px-1 text-center" title={warning}>
                                <span className={`mono font-bold px-1 py-0.5 ${valid ? "text-green-400 bg-green-950/30" : "text-red-400 bg-red-950/30"}`}>
                                  {valid ? "✓" : "✕"}
                                </span>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Warnings for any invalid combos */}
                {(() => {
                  const warnings: string[] = [];
                  [...new Set(selected.meals.map(m => m.replace(/\s*\(x\d+\)$/, "").trim()))].forEach(baseName => {
                    DELIVERY_DATES.forEach(d => {
                      const { valid, warning } = getMealValidity(baseName, d.day);
                      if (!valid) {
                        warnings.push(warning ?? `${baseName} is not available for ${d.label} delivery.`);
                      }
                    });
                  });
                  return warnings.length > 0 ? (
                    <div className="space-y-1 mt-2">
                      {warnings.map((w, i) => (
                        <div key={i} className="border border-red-800/40 bg-red-950/20 px-2 py-1.5 text-xs text-red-400 mono">
                          ⚠ {w} Admin action required before order creation.
                        </div>
                      ))}
                    </div>
                  ) : null;
                })()}
              </div>
            )}

            {selected.lockedAt && (
              <div className="text-xs mono text-[#555]">Locked: {selected.lockedAt}</div>
            )}

            {selected.status === "pending" && (
              <>
                <button onClick={() => setShowOverride(true)}
                  className="w-full border border-[#F5B300]/40 text-[#F5B300] text-xs py-2 mono hover:bg-[#F5B300]/10 transition-colors font-bold">
                  Override Review
                </button>
                <button
                  className="w-full border border-[#2A2A2A] text-[#888] text-xs py-2 mono hover:border-[#555] hover:text-[#E8E8E8] transition-colors">
                  Send Reminder
                </button>
              </>
            )}
            {selected.status === "reviewed" && (
              <button onClick={() => setShowOverride(true)}
                className="w-full border border-[#2A2A2A] text-[#888] text-xs py-2 mono hover:border-[#F5B300] hover:text-[#F5B300] transition-colors">
                Override Selections
              </button>
            )}
            {selected.status === "locked" && (
              <div className="text-xs text-[#555] mono text-center py-2">Menu is locked — view only</div>
            )}

            {/* Admin Override Section */}
            <div className="border-t border-[#2A2A2A] pt-4 space-y-3">
              <div className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider">Admin Override</div>
              {!showMealChange ? (
                <button onClick={() => setShowMealChange(true)}
                  className="w-full border border-[#3A3A3A] text-[#CCCCCC] text-xs px-3 py-1.5 mono hover:border-[#F5B300] hover:text-[#F5B300] transition-colors">
                  Change Meal Selection
                </button>
              ) : (
                <div className="bg-[#0F0F0F] border border-[#2A2A2A] p-3 space-y-3">
                  {/* Original selections — read-only */}
                  <div>
                    <div className="text-xs text-[#DDDDDD] mb-1">Original Selections</div>
                    <div className="space-y-0.5">
                      {selected.meals.length > 0
                        ? selected.meals.map((m, i) => (
                          <div key={i} className="text-xs mono text-[#555] px-2 py-1 bg-[#181818] border border-[#1A1A1A]">{m}</div>
                        ))
                        : <div className="text-xs mono text-[#555] italic">No selections</div>
                      }
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-[#DDDDDD] block mb-1">New Meal</label>
                    <select value={newMeal} onChange={e => setNewMeal(e.target.value)}
                      className="w-full bg-[#181818] border border-[#2A2A2A] text-[#E8E8E8] text-xs px-2 py-1.5 mono focus:outline-none focus:border-[#F5B300]">
                      {MEAL_OPTIONS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-[#DDDDDD] block mb-1">Delivery Date</label>
                    <select value={changeDelivery} onChange={e => setChangeDelivery(e.target.value)}
                      className="w-full bg-[#181818] border border-[#2A2A2A] text-[#E8E8E8] text-xs px-2 py-1.5 mono focus:outline-none focus:border-[#F5B300]">
                      {DELIVERY_DATES.map(d => <option key={d.label} value={d.label}>{d.label}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-[#DDDDDD] block mb-1">
                      Reason <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      rows={2}
                      value={changeReason}
                      onChange={e => { setChangeReason(e.target.value); setReasonError(false); }}
                      placeholder="Required — state reason for admin change…"
                      className={`w-full bg-[#181818] border text-[#E8E8E8] text-xs px-2 py-1.5 mono focus:outline-none resize-none ${reasonError ? "border-red-600" : "border-[#2A2A2A] focus:border-[#F5B300]"}`}
                    />
                    {reasonError && <div className="text-xs text-red-400 mono mt-1">Reason is required.</div>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mono">
                    <div>
                      <div className="text-[#DDDDDD] mb-0.5">Admin</div>
                      <div className="text-[#555]">Jerome Lim (Super Admin)</div>
                    </div>
                    <div>
                      <div className="text-[#DDDDDD] mb-0.5">Timestamp</div>
                      <div className="text-[#555]">{nowStr()}</div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button onClick={handleSaveChange}
                      className="flex-1 bg-[#F5B300] text-black text-xs font-bold px-4 py-2 mono hover:bg-[#C99200] transition-colors">
                      Save Change
                    </button>
                    <button onClick={() => { setShowMealChange(false); setReasonError(false); setChangeReason(""); }}
                      className="flex-1 border border-[#3A3A3A] text-[#CCCCCC] text-xs px-3 py-1.5 mono hover:border-[#F5B300] hover:text-[#F5B300] transition-colors">
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Downstream Propagation — shown after save */}
            {showPropagation && selectedLogs.length > 0 && (
              <div className="border border-[#F5B300]/30 bg-[#1A1500] p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-[#F5B300] uppercase tracking-wider">Change Propagation</div>
                  <button onClick={() => setShowPropagation(false)} className="text-[#555] hover:text-[#888] mono text-sm">×</button>
                </div>
                <div className="text-xs text-[#888] mono mb-1">Admin meal change will propagate through the following systems:</div>
                <div className="flex flex-col gap-1">
                  {[
                    { step: "Admin Change", note: "Saved to admin portal", color: "#F5B300", done: true },
                    { step: "Subscriber Record", note: "Meal selection updated", color: "#CCCCCC", done: true },
                    { step: "Order", note: "Order line item updated", color: "#CCCCCC", done: false },
                    { step: "Kitchen / Packing", note: "Production list updated", color: "#CCCCCC", done: false },
                    { step: "Delivery Order", note: "Manifest updated", color: "#CCCCCC", done: false },
                    { step: "Customer Notification", note: "WhatsApp / Email sent", color: "#CCCCCC", done: false },
                    { step: "Audit Log", note: "Immutable record created", color: "#22C55E", done: true },
                  ].map((s, i, arr) => (
                    <div key={s.step} className="flex items-start gap-2">
                      <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs font-bold ${s.done ? "bg-[#F5B300]/20 border-[#F5B300]/50 text-[#F5B300]" : "bg-[#1A1A1A] border-[#2A2A2A] text-[#555]"}`}>
                          {s.done ? "✓" : i + 1}
                        </div>
                        {i < arr.length - 1 && <div className="w-px h-3 bg-[#2A2A2A]" />}
                      </div>
                      <div className="pb-1">
                        <div className="text-xs font-bold" style={{ color: s.color }}>{s.step}</div>
                        <div className="text-xs text-[#555] mono">{s.note}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-xs text-[#888] mono border-t border-[#2A2A2A] pt-2">Replacement meal passed menu/date validation before propagation.</div>
              </div>
            )}

            {/* Change Log */}
            {selectedLogs.length > 0 && (
              <div className="border-t border-[#2A2A2A] pt-4 space-y-2">
                <div className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider">Change Log</div>
                <div className="space-y-2">
                  {selectedLogs.map(log => (
                    <div key={log.id} className="bg-[#0F0F0F] border border-[#1A1A1A] p-2.5 space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="mono text-[#F5B300] font-bold">{log.changedBy}</span>
                        <span className="mono text-[#555]">{log.date}</span>
                      </div>
                      <div className="mono">
                        <span className="text-red-400">{log.fromMeal}</span>
                        <span className="text-[#555]"> → </span>
                        <span className="text-green-400">{log.toMeal}</span>
                      </div>
                      <div className="mono text-[#555]">Delivery: {log.deliveryDate}</div>
                      <div className="text-[#CCCCCC]">{log.reason}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="border border-[#2A2A2A] bg-[#181818] flex items-center justify-center text-[#555] text-sm p-8 text-center">
            Select a review to see meal selections
          </div>
        )}
      </div>

      {/* Override modal */}
      {showOverride && selected && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center" onClick={() => setShowOverride(false)}>
          <div className="bg-[#141414] border border-[#2A2A2A] w-full max-w-md p-6 space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="font-bold">Override Review — {selected.customer}</h3>
              <button onClick={() => setShowOverride(false)} className="text-[#888] hover:text-[#E8E8E8] text-xl mono">×</button>
            </div>
            <div className="border border-yellow-800/30 bg-yellow-950/10 px-3 py-2 text-xs text-yellow-300 mono">
              Overriding meal selections will notify the customer via email and WhatsApp.
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-[#AAAAAA] uppercase tracking-wider block mb-1">Override Reason</label>
                <select className="w-full bg-[#181818] border border-[#2A2A2A] text-[#E8E8E8] text-sm px-3 py-2 mono focus:outline-none focus:border-[#F5B300]">
                  <option>Customer request (called in)</option>
                  <option>Meal unavailable — substitution</option>
                  <option>Nutritional adjustment required</option>
                  <option>Admin correction</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-[#AAAAAA] uppercase tracking-wider block mb-1">Override Notes</label>
                <textarea rows={3} placeholder="Describe the override…"
                  className="w-full bg-[#181818] border border-[#2A2A2A] text-[#E8E8E8] text-sm px-3 py-2 mono focus:outline-none focus:border-[#F5B300] resize-none" />
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => {
                setShowOverride(false);
                const msg = `Override saved for ${selected.customer} — customer notified`;
                setOverrideSuccess(msg);
                setTimeout(() => setOverrideSuccess(null), 4000);
              }}
                className="flex-1 bg-[#F5B300] text-black text-xs font-bold py-2.5 mono hover:bg-yellow-400 transition-colors">
                Save Override
              </button>
              <button onClick={() => setShowOverride(false)}
                className="flex-1 border border-[#2A2A2A] text-[#888] text-xs py-2.5 mono hover:text-[#E8E8E8] transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Kitchen Handoff Panel */}
      <div className="border border-[#F5B300]/30 bg-[#181818]">
        <div className="px-4 py-2.5 border-b border-[#F5B300]/20 flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-[#F5B300]" />
          <span className="text-xs font-extrabold tracking-widest uppercase text-[#F5B300]">Menu → Kitchen Handoff</span>
          <span className="ml-auto text-xs mono text-[#555]">Impact of current week selections on Kitchen</span>
        </div>
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "Meals Confirmed", value: "48", sub: "Current week", color: "#22C55E" },
            { label: "Pending Review", value: "12", sub: "Awaiting customer", color: "#F5B300" },
            { label: "Kitchen Qty Impact", value: "+60", sub: "vs. base forecast", color: "#3B82F6" },
            { label: "Packing Update", value: "Triggered", sub: "Labels regenerated", color: "#888" },
          ].map(k => (
            <div key={k.label} className="border border-[#2A2A2A] bg-[#0F0F0F] p-3 text-center">
              <div className="text-xs text-[#AAAAAA] uppercase tracking-wider mb-1">{k.label}</div>
              <div className="text-xl font-extrabold mono" style={{ color: k.color }}>{k.value}</div>
              <div className="text-xs text-[#555] mt-1">{k.sub}</div>
            </div>
          ))}
        </div>
        <div className="px-4 pb-4">
          <div className="text-xs text-[#AAAAAA] uppercase tracking-wider mb-2">Handoff Workflow Status</div>
          <div className="flex items-center gap-1 text-xs mono overflow-x-auto pb-1">
            {[
              { step: "Customer Selection", done: true },
              { step: "Subscriber Record Updated", done: true },
              { step: "Menu Review Status", done: true },
              { step: "Kitchen Qty Recalculated", done: true },
              { step: "Production Queue Updated", done: false },
              { step: "Packing Requirements Updated", done: false },
              { step: "DO Generated", done: false },
              { step: "Audit Logged", done: true },
            ].map((s, i, arr) => (
              <div key={s.step} className="flex items-center gap-1 whitespace-nowrap">
                <span className={`px-2 py-1 border ${s.done ? "border-green-800/40 text-green-400 bg-green-950/20" : "border-[#2A2A2A] text-[#555]"}`}>{s.step}</span>
                {i < arr.length - 1 && <span className="text-[#333]">→</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
