import { useState } from "react";

type WorkflowStage = "create" | "approve" | "publish" | "review" | "export";
type MealStatus = "draft" | "approved" | "published" | "locked";

interface Meal {
  id: string;
  name: string;
  goal: "CUT" | "BUILD" | "MAINTAIN";
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  allergens: string;
  prep: string;
  status: MealStatus;
}

const weekMeals: Meal[] = [
  { id: "M-01", name: "Teriyaki Chicken with Jasmine Rice", goal: "BUILD", calories: 620, protein: 48, carbs: 62, fat: 14, allergens: "Soy, Gluten", prep: "30 min", status: "approved" },
  { id: "M-02", name: "Lemon Herb Salmon with Broccoli", goal: "CUT", calories: 420, protein: 38, carbs: 18, fat: 22, allergens: "Fish", prep: "25 min", status: "approved" },
  { id: "M-03", name: "Beef Bulgogi Bowl", goal: "MAINTAIN", calories: 540, protein: 42, carbs: 48, fat: 16, allergens: "Soy, Gluten", prep: "35 min", status: "draft" },
  { id: "M-04", name: "Tofu Stir Fry with Brown Rice", goal: "CUT", calories: 380, protein: 28, carbs: 44, fat: 10, allergens: "Soy", prep: "20 min", status: "draft" },
  { id: "M-05", name: "Chicken Caesar Wrap", goal: "MAINTAIN", calories: 490, protein: 36, carbs: 40, fat: 18, allergens: "Gluten, Dairy", prep: "15 min", status: "approved" },
];

const stages: { id: WorkflowStage; label: string; role: string; desc: string }[] = [
  { id: "create", label: "Create Menu", role: "Kitchen Manager", desc: "Draft weekly meals with macros, allergens, prep time" },
  { id: "approve", label: "Approve Menu", role: "Operations + Nutrition", desc: "Review nutritional accuracy, flag issues, approve or reject" },
  { id: "publish", label: "Publish Menu", role: "Operations", desc: "Push approved menu live to customer-facing Shopify portal" },
  { id: "review", label: "Customer Review", role: "Subscribers", desc: "Customers select or swap meals. Window closes Thursday 12pm" },
  { id: "export", label: "Kitchen Export", role: "Kitchen Manager", desc: "Export finalised production list grouped by goal and meal" },
];

const goalColor: Record<string, string> = { CUT: "#EF4444", BUILD: "#22C55E", MAINTAIN: "#F5B300" };
const statusStyle: Record<MealStatus, string> = {
  draft: "text-[var(--pm-text-muted)] bg-[var(--pm-surface-muted)]",
  approved: "text-green-400 bg-green-950/30",
  published: "text-blue-400 bg-blue-950/30",
  locked: "text-[var(--pm-accent-text)] bg-yellow-950/30",
};

export default function MenuPlanning({ demoMode }: { demoMode?: boolean } = {}) {
  const [activeStage, setActiveStage] = useState<WorkflowStage>("create");
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [showAddMeal, setShowAddMeal] = useState(demoMode ?? false);

  const approvedCount = weekMeals.filter(m => m.status === "approved").length;
  const draftCount = weekMeals.filter(m => m.status === "draft").length;
  const canAdvance = draftCount === 0;

  const stageIndex = stages.findIndex(s => s.id === activeStage);

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold">Menu Planning Center</h2>
          <div className="text-xs text-[var(--pm-text-muted)] mono mt-0.5">{`Week of ${new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })} — Meal Plans only`}</div>
        </div>
        <div className="flex gap-2">
          <button className="border border-[var(--pm-border-strong)] text-[var(--pm-text-secondary)] text-xs px-4 py-2 mono hover:border-[#F5B300] hover:text-[var(--pm-accent-text)] transition-colors">Export PDF</button>
          <button className="border border-[var(--pm-border-strong)] text-[var(--pm-text-secondary)] text-xs px-4 py-2 mono hover:border-[#F5B300] hover:text-[var(--pm-accent-text)] transition-colors">Export Kitchen List</button>
        </div>
      </div>

      {/* Workflow stages */}
      <div className="border border-[var(--pm-border)] bg-[var(--pm-surface)] p-4">
        <div className="flex items-center gap-0">
          {stages.map((s, i) => {
            const isPast = i < stageIndex;
            const isCurrent = i === stageIndex;
            return (
              <div key={s.id} className="flex items-center flex-1 min-w-0">
                <button
                  onClick={() => setActiveStage(s.id)}
                  className={`flex-1 min-w-0 px-3 py-2.5 text-center transition-colors border-b-2 ${
                    isCurrent
                      ? "border-[#F5B300] bg-[#F5B300]/10"
                      : isPast
                      ? "border-green-700 bg-green-950/20"
                      : "border-transparent hover:bg-[var(--pm-surface-muted)]"
                  }`}
                >
                  <div className={`text-xs font-bold mono mb-0.5 ${isCurrent ? "text-[var(--pm-accent-text)]" : isPast ? "text-green-400" : "text-[var(--pm-text-muted)]"}`}>
                    {isPast ? "✓" : `0${i + 1}`}
                  </div>
                  <div className={`text-xs font-medium ${isCurrent ? "text-[var(--pm-text-secondary)]" : isPast ? "text-green-400" : "text-[var(--pm-text-muted)]"}`}>{s.label}</div>
                  <div className="text-xs text-[var(--pm-text-muted)] mono mt-0.5 hidden sm:block">{s.role}</div>
                </button>
                {i < stages.length - 1 && <div className={`w-px h-8 flex-shrink-0 ${isPast ? "bg-green-700" : "bg-[var(--pm-surface-muted)]"}`} />}
              </div>
            );
          })}
        </div>
        <div className="mt-3 px-1 text-xs text-[var(--pm-text-muted)]">
          <span className="text-[var(--pm-accent-text)] font-semibold">{stages[stageIndex].label}:</span> {stages[stageIndex].desc}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Meals This Week", value: weekMeals.length, color: "var(--pm-text-secondary)" },
          { label: "Approved", value: approvedCount, color: "#22C55E" },
          { label: "Drafts Remaining", value: draftCount, color: draftCount > 0 ? "#F5B300" : "#22C55E" },
          { label: "Status", value: canAdvance ? "Ready" : "Pending", color: canAdvance ? "#22C55E" : "#F5B300" },
        ].map(k => (
          <div key={k.label} className="border border-[var(--pm-border)] bg-[var(--pm-surface)] p-4">
            <div className="text-xs font-bold text-[var(--pm-text)] uppercase tracking-widest mb-2">{k.label}</div>
            <div className="text-2xl font-extrabold mono" style={{ color: k.color }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Create / Approve stage: meal list + editor */}
      {(activeStage === "create" || activeStage === "approve") && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="col-span-3 border border-[var(--pm-border)] bg-[var(--pm-surface)]">
            <div className="px-4 py-3 border-b border-[var(--pm-border)] flex items-center justify-between">
              <span className="text-sm font-semibold">Week Menu — {weekMeals.length} meals</span>
              {activeStage === "create" && (
                <button onClick={() => setShowAddMeal(true)} className="text-xs border border-[#F5B300]/40 text-[var(--pm-accent-text)] px-3 py-1 mono hover:bg-[#F5B300]/10 transition-colors">+ Add Meal</button>
              )}
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--pm-border)]">
                  {["Meal", "Goal", "Cal", "Pro", "Carb", "Fat", "Status", ""].map(h => (
                    <th key={h} className="px-3 py-2 text-left text-xs text-[var(--pm-text-muted)] uppercase tracking-wider font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {weekMeals.map((m, i) => (
                  <tr key={m.id} onClick={() => setSelectedMeal(m)}
                    className={`border-b border-[var(--pm-border)] cursor-pointer transition-colors ${selectedMeal?.id === m.id ? "bg-[var(--pm-surface-subtle)]" : i % 2 === 0 ? "hover:bg-[var(--pm-surface-muted)]" : "bg-[var(--pm-surface-subtle)] hover:bg-[var(--pm-surface-muted)]"}`}>
                    <td className="px-3 py-2.5 font-medium text-xs">{m.name}</td>
                    <td className="px-3 py-2.5">
                      <span className="text-xs mono font-bold" style={{ color: goalColor[m.goal] }}>{m.goal}</span>
                    </td>
                    <td className="px-3 py-2.5 mono text-xs">{m.calories}</td>
                    <td className="px-3 py-2.5 mono text-xs text-[var(--pm-text-muted)]">{m.protein}g</td>
                    <td className="px-3 py-2.5 mono text-xs text-[var(--pm-text-muted)]">{m.carbs}g</td>
                    <td className="px-3 py-2.5 mono text-xs text-[var(--pm-text-muted)]">{m.fat}g</td>
                    <td className="px-3 py-2.5">
                      <span className={`text-xs mono px-1.5 py-0.5 font-bold ${statusStyle[m.status]}`}>{m.status}</span>
                    </td>
                    <td className="px-3 py-2.5">
                      {activeStage === "approve" && m.status === "draft" && (
                        <button className="text-xs border border-green-800/40 px-2 py-0.5 text-green-400 hover:bg-green-950 mono transition-colors">Approve</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="col-span-2 border border-[var(--pm-border)] bg-[var(--pm-surface)]">
            {!selectedMeal ? (
              <div className="flex items-center justify-center h-full text-[var(--pm-text-muted)] text-sm">Select a meal to view details</div>
            ) : (
              <div className="p-4 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold text-sm">{selectedMeal.name}</div>
                    <div className="text-xs mono mt-0.5" style={{ color: goalColor[selectedMeal.goal] }}>{selectedMeal.goal} Plan</div>
                  </div>
                  <span className={`text-xs mono px-2 py-0.5 font-bold ${statusStyle[selectedMeal.status]}`}>{selectedMeal.status}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    ["Calories", `${selectedMeal.calories} kcal`],
                    ["Protein", `${selectedMeal.protein}g`],
                    ["Carbs", `${selectedMeal.carbs}g`],
                    ["Fat", `${selectedMeal.fat}g`],
                    ["Prep Time", selectedMeal.prep],
                    ["Allergens", selectedMeal.allergens],
                  ].map(([label, val]) => (
                    <div key={label} className="bg-[var(--pm-bg)] border border-[var(--pm-border)] px-3 py-2">
                      <div className="text-xs text-[var(--pm-text-muted)] uppercase tracking-wider">{label}</div>
                      <div className="text-sm mono font-semibold mt-0.5">{val}</div>
                    </div>
                  ))}
                </div>
                {activeStage === "create" && (
                  <div className="flex gap-2">
                    <button className="flex-1 border border-[var(--pm-border)] text-[var(--pm-text-muted)] text-xs py-2 mono hover:text-[var(--pm-text-secondary)] transition-colors">Edit</button>
                    <button className="flex-1 border border-red-800/40 text-red-400 text-xs py-2 mono hover:bg-red-950 transition-colors">Remove</button>
                  </div>
                )}
                {activeStage === "approve" && selectedMeal.status === "draft" && (
                  <div className="flex gap-2">
                    <button className="flex-1 bg-green-800 text-white text-xs font-bold py-2 mono hover:bg-green-700 transition-colors">Approve</button>
                    <button className="flex-1 border border-red-800/40 text-red-400 text-xs py-2 mono hover:bg-red-950 transition-colors">Reject</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Publish stage */}
      {activeStage === "publish" && (
        <div className="border border-[var(--pm-border)] bg-[var(--pm-surface)] p-6 space-y-4">
          <div className="text-sm font-semibold">Publish to Shopify Storefront</div>
          {!canAdvance ? (
            <div className="border border-yellow-800/30 bg-yellow-950/10 px-4 py-3 text-xs text-yellow-300 mono">
              ⚠ {draftCount} meal{draftCount > 1 ? "s" : ""} still in draft. All meals must be approved before publishing.
            </div>
          ) : (
            <div className="border border-green-800/30 bg-green-950/10 px-4 py-3 text-xs text-green-300 mono">
              ✓ All {weekMeals.length} meals approved. Ready to publish to subscriber portal.
            </div>
          )}
          <div className="space-y-2 text-sm">
            {weekMeals.map(m => (
              <div key={m.id} className="flex items-center gap-3">
                <div className="w-2 h-2" style={{ background: goalColor[m.goal] }} />
                <span className="flex-1">{m.name}</span>
                <span className="text-xs mono" style={{ color: goalColor[m.goal] }}>{m.goal}</span>
                <span className={`text-xs mono ${statusStyle[m.status]} px-1.5 py-0.5`}>{m.status}</span>
              </div>
            ))}
          </div>
          <button disabled={!canAdvance} className={`px-6 py-2.5 text-sm font-bold mono transition-colors ${canAdvance ? "bg-[#F5B300] text-black hover:bg-[#C99200]" : "bg-[var(--pm-surface-muted)] text-[var(--pm-text-muted)] cursor-not-allowed"}`}>
            Publish Menu to Portal
          </button>
        </div>
      )}

      {/* Customer review stage */}
      {activeStage === "review" && (
        <div className="space-y-3">
          <div className="border border-yellow-800/30 bg-yellow-950/10 px-4 py-2.5 text-xs text-yellow-300 mono">
            Customer review window closes Thursday 12:00pm. Subscribers select or swap meals via portal.
          </div>
          <div className="border border-[var(--pm-border)] bg-[var(--pm-surface)]">
            <div className="px-4 py-3 border-b border-[var(--pm-border)]">
              <span className="text-sm font-semibold">Subscriber Selections — Current Week</span>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--pm-border)]">
                  {["Subscriber", "Plan", "Goal", "Meals Selected", "Swaps", "Status"].map(h => (
                    <th key={h} className="px-4 py-2 text-left text-xs text-[var(--pm-text-muted)] uppercase tracking-wider font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "Marcus Tan", plan: "12-week", goal: "BUILD", meals: 5, swaps: 1, done: true },
                  { name: "Aisha Rahman", plan: "12-week", goal: "CUT", meals: 5, swaps: 0, done: true },
                  { name: "Wei Jie Lim", plan: "12-week", goal: "MAINTAIN", meals: 5, swaps: 2, done: true },
                  { name: "Serene Tay", plan: "8-week", goal: "CUT", meals: 5, swaps: 0, done: false },
                  { name: "Jason Yeo", plan: "4-week", goal: "BUILD", meals: 5, swaps: 0, done: false },
                ].map((r, i) => (
                  <tr key={r.name} className={`border-b border-[var(--pm-border)] ${i % 2 === 0 ? "" : "bg-[var(--pm-surface-subtle)]"}`}>
                    <td className="px-4 py-2.5 font-medium">{r.name}</td>
                    <td className="px-4 py-2.5 text-xs text-[var(--pm-text-muted)]">{r.plan}</td>
                    <td className="px-4 py-2.5"><span className="text-xs mono font-bold" style={{ color: goalColor[r.goal] }}>{r.goal}</span></td>
                    <td className="px-4 py-2.5 mono text-xs">{r.meals} / 5</td>
                    <td className="px-4 py-2.5 mono text-xs text-[var(--pm-text-muted)]">{r.swaps}</td>
                    <td className="px-4 py-2.5">
                      <span className={`text-xs mono px-2 py-0.5 font-bold ${r.done ? "text-green-400 bg-green-950/30" : "text-yellow-400 bg-yellow-950/30"}`}>
                        {r.done ? "Confirmed" : "Pending"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Kitchen export stage */}
      {activeStage === "export" && (
        <div className="space-y-4">
          <div className="border border-green-800/30 bg-green-950/10 px-4 py-2.5 text-xs text-green-300 mono">
            ✓ Menu locked. Export production list to kitchen for current week.
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {["CUT", "BUILD", "MAINTAIN"].map(goal => {
              const goalMeals = weekMeals.filter(m => m.goal === goal);
              return (
                <div key={goal} className="border border-[var(--pm-border)] bg-[var(--pm-surface)]">
                  <div className="px-4 py-3 border-b border-[var(--pm-border)] flex items-center justify-between">
                    <span className="text-sm font-bold mono" style={{ color: goalColor[goal] }}>{goal}</span>
                    <span className="text-xs text-[var(--pm-text-muted)] mono">{goalMeals.length} meals</span>
                  </div>
                  <div className="divide-y divide-[var(--pm-border-soft)]">
                    {goalMeals.map(m => (
                      <div key={m.id} className="px-4 py-3 text-xs">
                        <div className="font-medium">{m.name}</div>
                        <div className="text-[var(--pm-text-muted)] mono mt-0.5">{m.calories} kcal · {m.protein}g protein · Prep {m.prep}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex gap-3">
            <button className="bg-[#F5B300] text-black text-xs font-bold px-6 py-2.5 mono hover:bg-[#C99200] transition-colors">Export Kitchen PDF</button>
            <button className="border border-[var(--pm-border-strong)] text-[var(--pm-text-secondary)] text-xs px-6 py-2.5 mono hover:border-[#F5B300] hover:text-[var(--pm-accent-text)] transition-colors">Export CSV</button>
            <button className="border border-[var(--pm-border-strong)] text-[var(--pm-text-secondary)] text-xs px-6 py-2.5 mono hover:border-[#F5B300] hover:text-[var(--pm-accent-text)] transition-colors">Send to Kitchen Queue</button>
          </div>
        </div>
      )}

      {/* Add Meal Modal */}
      {showAddMeal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="bg-[var(--pm-surface)] border border-[var(--pm-border)] w-full max-w-[480px]">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--pm-border)]">
              <span className="font-bold text-[var(--pm-accent-text)] mono">Add Meal</span>
              <button onClick={() => setShowAddMeal(false)} className="text-[var(--pm-text-muted)] hover:text-[var(--pm-text-secondary)] text-xl">×</button>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <label className="text-xs font-bold text-[var(--pm-text)] uppercase tracking-wider block mb-1">Meal Name</label>
                <input type="text" placeholder="e.g. Grilled Chicken with Quinoa" className="w-full bg-[var(--pm-bg)] border border-[var(--pm-border)] text-[var(--pm-text-secondary)] text-sm px-3 py-2 focus:outline-none focus:border-[#F5B300] placeholder:text-[var(--pm-text-muted)]" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[var(--pm-text)] uppercase tracking-wider block mb-1">Goal</label>
                  <select className="w-full bg-[var(--pm-bg)] border border-[var(--pm-border)] text-[var(--pm-text-secondary)] text-sm px-3 py-2 focus:outline-none focus:border-[#F5B300]">
                    <option>CUT</option><option>BUILD</option><option>MAINTAIN</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-[var(--pm-text)] uppercase tracking-wider block mb-1">Calories</label>
                  <input type="number" placeholder="500" className="w-full bg-[var(--pm-bg)] border border-[var(--pm-border)] text-[var(--pm-text-secondary)] text-sm px-3 py-2 focus:outline-none focus:border-[#F5B300] placeholder:text-[var(--pm-text-muted)]" />
                </div>
                <div>
                  <label className="text-xs font-bold text-[var(--pm-text)] uppercase tracking-wider block mb-1">Protein (g)</label>
                  <input type="number" placeholder="40" className="w-full bg-[var(--pm-bg)] border border-[var(--pm-border)] text-[var(--pm-text-secondary)] text-sm px-3 py-2 focus:outline-none focus:border-[#F5B300] placeholder:text-[var(--pm-text-muted)]" />
                </div>
                <div>
                  <label className="text-xs font-bold text-[var(--pm-text)] uppercase tracking-wider block mb-1">Carbs (g)</label>
                  <input type="number" placeholder="45" className="w-full bg-[var(--pm-bg)] border border-[var(--pm-border)] text-[var(--pm-text-secondary)] text-sm px-3 py-2 focus:outline-none focus:border-[#F5B300] placeholder:text-[var(--pm-text-muted)]" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-[var(--pm-text)] uppercase tracking-wider block mb-1">Allergens</label>
                <input type="text" placeholder="e.g. Gluten, Soy" className="w-full bg-[var(--pm-bg)] border border-[var(--pm-border)] text-[var(--pm-text-secondary)] text-sm px-3 py-2 focus:outline-none focus:border-[#F5B300] placeholder:text-[var(--pm-text-muted)]" />
              </div>
              <button onClick={() => setShowAddMeal(false)} className="w-full bg-[#F5B300] text-black py-2 text-sm font-bold mono hover:bg-[#C99200] transition-colors">
                Save as Draft
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
