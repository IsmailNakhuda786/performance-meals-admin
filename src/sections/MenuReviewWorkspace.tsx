import { useMemo, useState } from "react";
import { goalLabel, type GoalType } from "../data";

type ReviewStatus = "Pending" | "Confirmed" | "Locked";

type MealOption = {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
};

type ReviewRecord = {
  id: string;
  customer: string;
  plan: string;
  goal: GoalType;
  cycle: string;
  deliveryDate: string;
  status: ReviewStatus;
  slots: string[];
  requiredSlots: number;
};

const mealOptions: MealOption[] = [
  { name: "Salmon Teriyaki & Quinoa", calories: 640, protein: 48, carbs: 68 },
  { name: "Grilled Chicken & Rice", calories: 620, protein: 52, carbs: 64 },
  { name: "Beef & Broccoli", calories: 590, protein: 55, carbs: 40 },
  { name: "Sweet Potato & Chicken", calories: 580, protein: 50, carbs: 55 },
  { name: "Tuna Salad Wrap", calories: 520, protein: 42, carbs: 46 },
  { name: "Egg White Scramble", calories: 410, protein: 36, carbs: 24 },
  { name: "Chicken Stir Fry", calories: 560, protein: 48, carbs: 52 },
  { name: "Prawn Stir Fry & Veg", calories: 470, protein: 40, carbs: 34 },
];

const initialReviews: ReviewRecord[] = [
  { id: "MR-038", customer: "Marcus Tan", plan: "Low Carb Regular · Biweekly", goal: "CUT", cycle: "Week 38 · 16–22 Sep", deliveryDate: "21 Sep 2024", status: "Confirmed", requiredSlots: 5, slots: ["Salmon Teriyaki & Quinoa", "Grilled Chicken & Rice", "Sweet Potato & Chicken", "Beef & Broccoli", "Tuna Salad Wrap"] },
  { id: "MR-039", customer: "Priya Nair", plan: "Balance Regular · Monthly", goal: "BUILD", cycle: "Week 38 · 16–22 Sep", deliveryDate: "21 Sep 2024", status: "Confirmed", requiredSlots: 5, slots: ["Grilled Chicken & Rice", "Beef & Broccoli", "Prawn Stir Fry & Veg", "Tuna Salad Wrap", "Chicken Stir Fry"] },
  { id: "MR-040", customer: "Aisha Rahman", plan: "Balance Regular+ · 2 Months", goal: "MAINTAIN", cycle: "Week 38 · 16–22 Sep", deliveryDate: "21 Sep 2024", status: "Pending", requiredSlots: 5, slots: ["Sweet Potato & Chicken", "Salmon Teriyaki & Quinoa", "Egg White Scramble"] },
  { id: "MR-042", customer: "Bryan Low", plan: "Balance Regular+ · 6 by 60 Plus", goal: "BUILD", cycle: "Week 38 · 16–22 Sep", deliveryDate: "21 Sep 2024", status: "Pending", requiredSlots: 5, slots: ["Grilled Chicken & Rice", "Beef & Broccoli"] },
  { id: "MR-043", customer: "Serene Tay", plan: "Low Carb Regular", goal: "CUT", cycle: "Week 37 · 09–15 Sep", deliveryDate: "14 Sep 2024", status: "Locked", requiredSlots: 5, slots: ["Grilled Chicken & Rice", "Tuna Salad Wrap", "Egg White Scramble", "Chicken Stir Fry", "Prawn Stir Fry & Veg"] },
];

const statusClass: Record<ReviewStatus, string> = {
  Pending: "text-yellow-400 bg-yellow-950/30",
  Confirmed: "text-green-400 bg-green-950/30",
  Locked: "text-[var(--pm-text-muted)] bg-[var(--pm-surface-muted)]",
};

export default function MenuReviewWorkspace() {
  const [reviews, setReviews] = useState(initialReviews);
  const [selectedId, setSelectedId] = useState(initialReviews[0].id);
  const [search, setSearch] = useState("");
  const [reviewing, setReviewing] = useState(false);
  const [success, setSuccess] = useState("");

  const selected = reviews.find(review => review.id === selectedId) ?? reviews[0];
  const filtered = reviews.filter(review => `${review.customer} ${review.plan}`.toLowerCase().includes(search.toLowerCase()));
  const canEdit = selected.status !== "Locked";
  const complete = selected.slots.length === selected.requiredSlots;

  const totals = useMemo(() => selected.slots.reduce((sum, mealName) => {
    const meal = mealOptions.find(option => option.name === mealName);
    return {
      calories: sum.calories + (meal?.calories ?? 0),
      protein: sum.protein + (meal?.protein ?? 0),
      carbs: sum.carbs + (meal?.carbs ?? 0),
    };
  }, { calories: 0, protein: 0, carbs: 0 }), [selected.slots]);

  const updateSlots = (slots: string[]) => {
    setReviews(current => current.map(review => review.id === selected.id
      ? { ...review, slots, status: review.status === "Locked" ? "Locked" : "Pending" }
      : review));
    setReviewing(false);
    setSuccess("");
  };

  const confirmPlan = () => {
    if (!complete) return;
    setReviews(current => current.map(review => review.id === selected.id ? { ...review, status: "Confirmed" } : review));
    setReviewing(false);
    setSuccess(`${selected.customer}'s meal plan was confirmed for ${selected.cycle}.`);
  };

  return (
    <div className="space-y-5 p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold">Menu Review</h2>
          <div className="mt-1 text-xs text-[var(--pm-text-muted)]">Review and adjust one subscriber’s meals before the selection cutoff.</div>
        </div>
        <div className="border border-[var(--pm-border)] bg-[var(--pm-surface)] px-3 py-2 text-xs text-[var(--pm-text-muted)] mono">
          Meal selection cutoff · Thu 1:59 PM SGT
        </div>
      </div>

      {success && (
        <div role="status" className="border border-green-800/40 bg-green-950/20 px-4 py-3 text-xs font-bold text-green-400 mono">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="border border-[var(--pm-border)] bg-[var(--pm-surface)]">
          <div className="border-b border-[var(--pm-border)] p-3">
            <div className="mb-2 text-xs font-bold uppercase tracking-wider text-[var(--pm-text)]">Subscriber queue</div>
            <input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search subscriber or plan" className="w-full border border-[var(--pm-border)] bg-[var(--pm-bg)] px-3 py-2 text-xs text-[var(--pm-text-secondary)]" />
          </div>
          <div className="max-h-[680px] divide-y divide-[var(--pm-border-soft)] overflow-y-auto">
            {filtered.map(review => (
              <button key={review.id} onClick={() => {
                setSelectedId(review.id);
                setReviewing(false);
                setSuccess("");
              }} className={`w-full p-3 text-left transition-colors ${review.id === selected.id ? "bg-[var(--pm-active)]" : "hover:bg-[var(--pm-surface-subtle)]"}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-[var(--pm-text)]">{review.customer}</div>
                    <div className="mt-1 text-[11px] text-[var(--pm-text-muted)]">{review.plan}</div>
                  </div>
                  <span className={`px-2 py-0.5 text-[10px] font-bold mono ${statusClass[review.status]}`}>{review.status}</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-[10px] text-[var(--pm-text-muted)] mono">
                  <span>{review.cycle}</span>
                  <span>{review.slots.length}/{review.requiredSlots} meals</span>
                </div>
              </button>
            ))}
          </div>
        </aside>

        <section className="space-y-4">
          <div className="border border-[var(--pm-border)] bg-[var(--pm-surface)]">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[var(--pm-border)] p-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold">{selected.customer}</h3>
                  <span className={`px-2 py-0.5 text-[10px] font-bold mono ${statusClass[selected.status]}`}>{selected.status}</span>
                </div>
                <div className="mt-1 text-xs text-[var(--pm-text-muted)]">{selected.plan} · Goal: {goalLabel(selected.goal)}</div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="border border-[var(--pm-border)] bg-[var(--pm-bg)] px-3 py-2">
                  <div className="text-[10px] uppercase tracking-wider text-[var(--pm-text-muted)]">Delivery cycle</div>
                  <div className="mt-1 font-semibold text-[var(--pm-text-secondary)]">{selected.cycle}</div>
                </div>
                <div className="border border-[var(--pm-border)] bg-[var(--pm-bg)] px-3 py-2">
                  <div className="text-[10px] uppercase tracking-wider text-[var(--pm-text-muted)]">Delivery date</div>
                  <div className="mt-1 font-semibold text-[var(--pm-text-secondary)]">{selected.deliveryDate}</div>
                </div>
              </div>
            </div>

            <div className="space-y-3 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold">Assigned meals</div>
                  <div className="mt-0.5 text-xs text-[var(--pm-text-muted)]">Swap a meal using the selector, or remove it from this delivery.</div>
                </div>
                <button disabled={!canEdit || selected.slots.length >= selected.requiredSlots} onClick={() => updateSlots([...selected.slots, mealOptions[0].name])} className="border border-[#F5B300]/50 px-3 py-2 text-xs font-bold text-[var(--pm-accent-text)] disabled:cursor-not-allowed disabled:opacity-40 mono">
                  Add meal
                </button>
              </div>

              <div className="space-y-2">
                {selected.slots.map((meal, index) => {
                  const nutrition = mealOptions.find(option => option.name === meal);
                  return (
                    <div key={`${selected.id}-${index}`} className="grid grid-cols-[34px_minmax(0,1fr)_auto] items-center gap-3 border border-[var(--pm-border)] bg-[var(--pm-bg)] p-3">
                      <div className="flex h-7 w-7 items-center justify-center bg-[var(--pm-surface-muted)] text-xs font-bold text-[var(--pm-text-muted)] mono">{index + 1}</div>
                      <div className="min-w-0">
                        <select disabled={!canEdit} value={meal} onChange={event => updateSlots(selected.slots.map((slot, slotIndex) => slotIndex === index ? event.target.value : slot))} className="w-full border-0 bg-transparent text-sm font-semibold text-[var(--pm-text-secondary)] outline-none disabled:opacity-70">
                          {mealOptions.map(option => <option key={option.name}>{option.name}</option>)}
                        </select>
                        <div className="mt-1 text-[10px] text-[var(--pm-text-muted)] mono">{nutrition?.calories} kcal · {nutrition?.protein}g protein · {nutrition?.carbs}g carbs</div>
                      </div>
                      <button disabled={!canEdit} onClick={() => updateSlots(selected.slots.filter((_, slotIndex) => slotIndex !== index))} className="border border-red-900/50 px-2 py-1 text-xs text-red-400 disabled:opacity-30">Remove</button>
                    </div>
                  );
                })}
                {!selected.slots.length && <div className="border border-dashed border-[var(--pm-border)] p-8 text-center text-sm text-[var(--pm-text-muted)]">No meals assigned yet. Add {selected.requiredSlots} meals to complete this plan.</div>}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
            <div className="border border-[var(--pm-border)] bg-[var(--pm-surface)] p-4">
              <div className="mb-3 text-xs font-bold uppercase tracking-wider text-[var(--pm-text)]">Plan summary</div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  ["Meals", `${selected.slots.length} / ${selected.requiredSlots}`],
                  ["Calories", `${totals.calories.toLocaleString()} kcal`],
                  ["Protein", `${totals.protein}g`],
                  ["Carbs", `${totals.carbs}g`],
                ].map(([label, value]) => (
                  <div key={label} className="border border-[var(--pm-border)] bg-[var(--pm-bg)] p-3">
                    <div className="text-[10px] uppercase tracking-wider text-[var(--pm-text-muted)]">{label}</div>
                    <div className="mt-1 text-sm font-bold text-[var(--pm-text-secondary)] mono">{value}</div>
                  </div>
                ))}
              </div>
              {!complete && <div className="mt-3 border border-yellow-800/40 bg-yellow-950/20 px-3 py-2 text-xs text-yellow-300">{selected.requiredSlots - selected.slots.length} more meal{selected.requiredSlots - selected.slots.length === 1 ? "" : "s"} required before confirmation.</div>}
            </div>

            <div className="border border-[var(--pm-border)] bg-[var(--pm-surface)] p-4">
              <div className="text-xs font-bold uppercase tracking-wider text-[var(--pm-text)]">Confirm changes</div>
              <div className="mt-2 text-xs text-[var(--pm-text-muted)]">Review the meal count and nutrition summary before updating the subscriber’s plan.</div>
              {!reviewing ? (
                <button disabled={!complete || !canEdit} onClick={() => setReviewing(true)} className="mt-4 w-full bg-[#F5B300] py-2.5 text-xs font-bold text-black disabled:cursor-not-allowed disabled:opacity-40 mono">Review changes</button>
              ) : (
                <div className="mt-4 space-y-2">
                  <div className="border border-green-800/40 bg-green-950/20 px-3 py-2 text-xs text-green-300">Ready to confirm {selected.requiredSlots} meals for {selected.deliveryDate}.</div>
                  <button onClick={confirmPlan} className="w-full bg-green-800 py-2.5 text-xs font-bold text-white mono">Confirm meal plan</button>
                  <button onClick={() => setReviewing(false)} className="w-full border border-[var(--pm-border)] py-2 text-xs text-[var(--pm-text-muted)] mono">Back to editing</button>
                </div>
              )}
            </div>
          </div>

          <details className="border border-[var(--pm-border)] bg-[var(--pm-surface)]">
            <summary className="cursor-pointer px-4 py-3 text-xs font-bold text-[var(--pm-text-secondary)]">Advanced details</summary>
            <div className="grid grid-cols-1 gap-3 border-t border-[var(--pm-border)] p-4 text-xs md:grid-cols-3">
              <div><div className="font-bold text-[var(--pm-text)]">Availability validation</div><div className="mt-1 text-[var(--pm-text-muted)]">All selected meals are available for this delivery date.</div></div>
              <div><div className="font-bold text-[var(--pm-text)]">Kitchen impact</div><div className="mt-1 text-[var(--pm-text-muted)]">Quantities recalculate after confirmation.</div></div>
              <div><div className="font-bold text-[var(--pm-text)]">Audit trail</div><div className="mt-1 text-[var(--pm-text-muted)]">Changes are recorded under Jerome Lim.</div></div>
            </div>
          </details>
        </section>
      </div>
    </div>
  );
}
