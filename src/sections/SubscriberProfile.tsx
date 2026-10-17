import { useState } from "react";
import { subscriptions, customers, goalLabel, type CustomerStatus } from "../data";

type Tab = "overview" | "plan" | "meals" | "billing" | "pauses" | "notes";
type ProfileAction = "edit-profile" | "edit-plan" | "delivery" | "pause" | "resume" | "credit" | "refund" | "password-reset" | "cancel";

const tabConfig: { id: Tab; label: string; icon: string }[] = [
  { id: "overview",   label: "Overview",    icon: "◎" },
  { id: "plan",       label: "Plan Details", icon: "◈" },
  { id: "meals",      label: "Meals",        icon: "≡" },
  { id: "billing",    label: "Billing",      icon: "₿" },
  { id: "pauses",     label: "Pauses",       icon: "⊟" },
  { id: "notes",      label: "Notes",        icon: "⊞" },
];

const mpSubs = subscriptions.filter(s => s.planType === "Meal Plan");

const goalColor: Record<string, string> = {
  CUT:      "#3B82F6",
  BUILD:    "#E85D04",
  MAINTAIN: "#22C55E",
};

const statusColor: Record<string, string> = {
  Active:       "#22C55E",
  "Renewal Due":"#F5B300",
  Paused:       "#888",
  Cancelled:    "#EF4444",
};

/* Per-customer meal history (keyed by customerName for simplicity) */
const mealHistory: Record<string, { week: number; day: string; meal: string; kcal: number; protein: number; carbs: number; fat: number; status: string }[]> = {
  "Marcus Tan": [
    { week: 8, day: "Mon", meal: "Grilled Chicken & Brown Rice",     kcal: 620, protein: 52, carbs: 64, fat: 12, status: "delivered" },
    { week: 8, day: "Wed", meal: "Salmon Teriyaki & Quinoa",         kcal: 640, protein: 48, carbs: 68, fat: 18, status: "delivered" },
    { week: 8, day: "Fri", meal: "Tuna & Edamame Bowl",              kcal: 560, protein: 46, carbs: 52, fat: 15, status: "out-for-delivery" },
    { week: 7, day: "Mon", meal: "Lean Beef & Broccoli",             kcal: 590, protein: 55, carbs: 40, fat: 22, status: "delivered" },
    { week: 7, day: "Wed", meal: "Turkey & Sweet Potato",            kcal: 580, protein: 50, carbs: 55, fat: 14, status: "delivered" },
  ],
  "Priya Nair": [
    { week: 3, day: "Mon", meal: "High Protein Oats Bowl",           kcal: 510, protein: 38, carbs: 72, fat: 10, status: "delivered" },
    { week: 3, day: "Tue", meal: "Grilled Chicken & Sweet Potato",   kcal: 600, protein: 50, carbs: 60, fat: 14, status: "delivered" },
    { week: 3, day: "Wed", meal: "Salmon & Brown Rice",              kcal: 640, protein: 48, carbs: 68, fat: 18, status: "scheduled" },
    { week: 3, day: "Thu", meal: "Beef Bowl & Quinoa",               kcal: 660, protein: 56, carbs: 55, fat: 22, status: "scheduled" },
  ],
};

const billingHistory: Record<string, { id: string; date: string; amount: number; cycle: string; status: string }[]> = {
  "Marcus Tan":  [
    { id: "INV-3301", date: "07 Sep 2024", amount: 89.50, cycle: "Bi-Weekly", status: "paid" },
    { id: "INV-3289", date: "24 Aug 2024", amount: 89.50, cycle: "Bi-Weekly", status: "paid" },
  ],
  "Priya Nair":  [{ id: "INV-3305", date: "24 Aug 2024", amount: 168.00, cycle: "Bi-Weekly", status: "paid" }],
  "Aisha Rahman":[{ id: "INV-3290", date: "18 Sep 2024", amount: 168.00, cycle: "Bi-Weekly", status: "due" }],
  "Reuben Chew": [{ id: "INV-3310", date: "09 Sep 2024", amount: 89.50, cycle: "Bi-Weekly", status: "paid" }],
  "Natalie Foo": [
    { id: "INV-3307", date: "07 Sep 2024", amount: 168.00, cycle: "Bi-Weekly", status: "paid" },
    { id: "INV-3292", date: "24 Aug 2024", amount: 168.00, cycle: "Bi-Weekly", status: "paid" },
  ],
  "Bryan Low":   [
    { id: "INV-3300", date: "05 Sep 2024", amount: 168.00, cycle: "Bi-Weekly", status: "paid" },
    { id: "INV-3285", date: "22 Aug 2024", amount: 168.00, cycle: "Bi-Weekly", status: "paid" },
  ],
};

const defaultBilling = (name: string, amount: number) =>
  billingHistory[name] ?? [{ id: "INV-0000", date: "01 Sep 2024", amount, cycle: "Bi-Weekly", status: "paid" }];

const mealStatusColor: Record<string, string> = {
  delivered:         "#22C55E",
  "out-for-delivery":"#F5B300",
  scheduled:         "#3B82F6",
};

export default function SubscriberProfile() {
  const [selectedId, setSelectedId] = useState<string>(mpSubs[0]?.id ?? "");
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [noteText, setNoteText] = useState("");
  const [actionsOpen, setActionsOpen] = useState(false);
  const [profileAction, setProfileAction] = useState<ProfileAction | null>(null);
  const [actionValue, setActionValue] = useState("");
  const [actionNote, setActionNote] = useState("");
  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");
  const [statusOverrides, setStatusOverrides] = useState<Record<string, CustomerStatus>>({});
  const [walletOverrides, setWalletOverrides] = useState<Record<string, number>>({});
  const [addressOverrides, setAddressOverrides] = useState<Record<string, string>>({});
  const [planOverrides, setPlanOverrides] = useState<Record<string, string>>({});
  const [deliveryOverrides, setDeliveryOverrides] = useState<Record<string, string>>({});
  const [pendingCancellationIds, setPendingCancellationIds] = useState<string[]>([]);
  const [savedNotes, setSavedNotes] = useState<Record<string, string[]>>({});

  const sub = mpSubs.find(s => s.id === selectedId) ?? mpSubs[0];
  const cust = customers.find(c => c.name === sub?.customerName);

  const filteredSubs = mpSubs.filter(s =>
    s.customerName.toLowerCase().includes(search.toLowerCase())
  );

  const meals = mealHistory[sub?.customerName ?? ""] ?? [];
  const billing = defaultBilling(sub?.customerName ?? "", cust ? 89.50 : 89.50);
  const effectiveStatus = statusOverrides[sub.id] ?? sub.status;
  const effectiveWallet = walletOverrides[sub.customerId] ?? cust?.walletBalance ?? 0;
  const effectiveAddress = addressOverrides[sub.customerId] ?? cust?.address ?? "";
  const effectivePlan = planOverrides[sub.id] ?? sub.mealPlanType ?? sub.planType;
  const effectiveDelivery = deliveryOverrides[sub.id] ?? sub.nextDelivery;

  const goalBorderColor = sub?.goal ? (goalColor[sub.goal] ?? "#F5B300") : "#F5B300";

  const openAction = (action: ProfileAction) => {
    setProfileAction(action);
    setActionsOpen(false);
    setActionError("");
    setActionNote("");
    if (action === "edit-profile") setActionValue(effectiveAddress);
    else if (action === "edit-plan") setActionValue(effectivePlan);
    else if (action === "delivery") setActionValue("");
    else if (action === "pause") setActionValue("1 week");
    else setActionValue("");
  };

  const completeProfileAction = () => {
    if (!profileAction) return;
    const requiresNote = ["pause", "credit", "refund", "cancel"].includes(profileAction);
    if (requiresNote && !actionNote.trim()) {
      setActionError("Support note is required for the audit trail.");
      return;
    }
    if (["edit-profile", "edit-plan", "delivery", "credit", "refund"].includes(profileAction) && !actionValue.trim()) {
      setActionError("Complete the required field before continuing.");
      return;
    }
    if (["credit", "refund"].includes(profileAction) && Number(actionValue) <= 0) {
      setActionError("Enter an amount greater than $0.");
      return;
    }

    let message = "";
    if (profileAction === "edit-profile") {
      setAddressOverrides(current => ({ ...current, [sub.customerId]: actionValue.trim() }));
      message = `${sub.customerName}'s delivery address was updated.`;
    } else if (profileAction === "edit-plan") {
      setPlanOverrides(current => ({ ...current, [sub.id]: actionValue }));
      message = `${sub.customerName}'s plan was updated to ${actionValue}.`;
    } else if (profileAction === "delivery") {
      setDeliveryOverrides(current => ({ ...current, [sub.id]: actionValue }));
      message = `Next delivery changed to ${actionValue}.`;
    } else if (profileAction === "pause") {
      setStatusOverrides(current => ({ ...current, [sub.id]: "Paused" }));
      message = `Subscription paused for ${actionValue}.`;
    } else if (profileAction === "resume") {
      setStatusOverrides(current => ({ ...current, [sub.id]: "Active" }));
      message = "Subscription resumed.";
    } else if (profileAction === "credit") {
      setWalletOverrides(current => ({ ...current, [sub.customerId]: effectiveWallet + Number(actionValue) }));
      message = `$${Number(actionValue).toFixed(2)} credit added to ${sub.customerName}'s wallet.`;
    } else if (profileAction === "refund") {
      message = `Refund request for $${Number(actionValue).toFixed(2)} created and sent to Refund Management.`;
    } else if (profileAction === "password-reset") {
      message = `Password reset link sent to ${cust?.email ?? sub.customerName}.`;
    } else {
      setPendingCancellationIds(current => [...current, sub.id]);
      message = "Cancellation request submitted. Status: Pending approval.";
    }
    setActionSuccess(message);
    setProfileAction(null);
    setActionValue("");
    setActionNote("");
  };

  if (!sub) return (
    <div className="p-8 text-center text-[var(--pm-text-muted)]">No Meal Plan subscribers found.</div>
  );

  return (
    <div className="p-6 space-y-5">

      {/* ── Customer selector bar ─────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: "0.16em", color: "var(--pm-text-muted)" }}>
          VIEWING SUBSCRIBER
        </span>

        {/* Selector dropdown */}
        <div className="relative flex-1 max-w-xs">
          <button
            onClick={() => { setSearchOpen(o => !o); setSearch(""); }}
            className="w-full flex items-center justify-between gap-2 px-3 py-2 border transition-colors text-left"
            style={{ background: "var(--pm-surface)", border: `1px solid ${goalBorderColor}44`, borderLeft: `3px solid ${goalBorderColor}` }}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-6 h-6 flex items-center justify-center text-black text-xs font-extrabold flex-shrink-0"
                style={{ background: goalBorderColor, fontFamily: "'Outfit', sans-serif" }}>
                {sub.customerName.split(" ").map(n => n[0]).join("")}
              </div>
              <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: 13, color: "var(--pm-text)" }} className="truncate">
                {sub.customerName}
              </span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "var(--pm-text-muted)" }}>
                {sub.id}
              </span>
            </div>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="flex-shrink-0" style={{ color: "var(--pm-text-muted)" }}>
              <path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {searchOpen && (
            <div className="absolute top-full left-0 z-50 w-full shadow-2xl" style={{ background: "var(--pm-surface)", border: "1px solid var(--pm-border)", minWidth: 280 }}>
              <div className="p-2 border-b border-[var(--pm-border-soft)]">
                <input
                  autoFocus
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search subscriber..."
                  className="w-full bg-[var(--pm-surface-muted)] border border-[var(--pm-border)] px-3 py-1.5 text-xs text-[var(--pm-text)] outline-none placeholder:text-[var(--pm-text-muted)]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                />
              </div>
              <div className="max-h-64 overflow-y-auto">
                {filteredSubs.length === 0 && (
                  <div className="px-3 py-3 text-xs text-[var(--pm-text-muted)]">No results</div>
                )}
                {filteredSubs.map(s => {
                  const active = s.id === selectedId;
                  const gc = s.goal ? (goalColor[s.goal] ?? "#F5B300") : "#888";
                  return (
                    <button
                      key={s.id}
                      onClick={() => { setSelectedId(s.id); setSearchOpen(false); setActiveTab("overview"); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-[var(--pm-surface-muted)]"
                      style={{ background: active ? "var(--pm-surface-muted)" : "transparent" }}
                    >
                      <div className="w-7 h-7 flex items-center justify-center text-black text-xs font-extrabold flex-shrink-0"
                        style={{ background: gc, fontFamily: "'Outfit', sans-serif" }}>
                        {s.customerName.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: 12, color: "var(--pm-text)" }}>{s.customerName}</div>
                        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: "var(--pm-text-muted)", marginTop: 1 }}>
                          {s.id} · {s.planWeek} · {s.mealsPerWeek} meals/wk
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 9, color: gc, letterSpacing: "0.1em" }}>{goalLabel(s.goal)}</span>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: statusColor[s.status] ?? "#888" }}>{s.status}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="px-3 py-2 border-t border-[var(--pm-border-soft)]">
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 9.5, color: "var(--pm-text-muted)" }}>
                  {mpSubs.length} meal plan subscribers total
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Status + goal badges */}
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, color: statusColor[effectiveStatus] ?? "#888", border: `1px solid ${statusColor[effectiveStatus] ?? "#888"}44`, padding: "2px 8px" }}>
          {effectiveStatus.toUpperCase()}
        </span>
        {sub.goal && (
          <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 10, fontWeight: 800, color: goalBorderColor, border: `1px solid ${goalBorderColor}44`, padding: "2px 8px", letterSpacing: "0.1em" }}>
            {goalLabel(sub.goal)}
          </span>
        )}
        <div className="flex-1" />
        <div className="relative">
          <button onClick={() => setActionsOpen(open => !open)} className="bg-[#F5B300] px-3 py-1.5 text-xs font-bold text-black mono">
            Actions
          </button>
          {actionsOpen && (
            <div className="absolute right-0 top-full z-40 mt-2 w-72 border border-[var(--pm-border)] bg-[var(--pm-surface)] shadow-2xl">
              {[
                { group: "Profile", actions: [["edit-profile", "Edit delivery address"]] },
                { group: "Subscription", actions: [["edit-plan", "Change meal plan"], ["delivery", "Change delivery date"], [effectiveStatus === "Paused" ? "resume" : "pause", effectiveStatus === "Paused" ? "Resume subscription" : "Pause subscription"], ["cancel", "Submit cancellation request"]] },
                { group: "Financial", actions: [["credit", "Add wallet credit"], ["refund", "Start refund request"]] },
                { group: "Account access", actions: [["password-reset", "Send password reset link"]] },
              ].map(group => (
                <div key={group.group} className="border-b border-[var(--pm-border-soft)] p-2 last:border-0">
                  <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--pm-text-muted)]">{group.group}</div>
                  {group.actions.map(([action, label]) => {
                    const disabled = action === "cancel" && pendingCancellationIds.includes(sub.id);
                    return (
                    <button key={action} disabled={disabled} onClick={() => openAction(action as ProfileAction)} className="block w-full px-2 py-2 text-left text-xs text-[var(--pm-text-secondary)] hover:bg-[var(--pm-surface-muted)] disabled:cursor-not-allowed disabled:opacity-40">
                      {disabled ? "Cancellation pending approval" : label}
                    </button>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {actionSuccess && (
        <div role="status" className="border border-green-800/40 bg-green-950/20 px-4 py-3 text-xs font-bold text-green-400 mono">
          {actionSuccess}
        </div>
      )}

      {/* Contact strip */}
      {cust && (
        <div className="flex items-center gap-5 px-4 py-2.5" style={{ background: "var(--pm-surface)", border: "1px solid var(--pm-border-soft)" }}>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "var(--pm-text-muted)" }}>{cust.email}</span>
          <span style={{ color: "var(--pm-text-subtle)" }}>·</span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "var(--pm-text-muted)" }}>{cust.phone}</span>
          <span style={{ color: "var(--pm-text-subtle)" }}>·</span>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "var(--pm-text-muted)" }}>{effectiveAddress}</span>
          <span style={{ color: "var(--pm-text-subtle)" }}>·</span>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "var(--pm-text-muted)" }}>Joined {cust.joinDate}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-[var(--pm-border-soft)]">
        {tabConfig.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className="flex items-center gap-1.5 px-4 py-2.5 text-xs mono border-b-2 transition-colors"
            style={activeTab === t.id
              ? { borderBottomColor: "#F5B300", color: "#F5B300" }
              : { borderBottomColor: "transparent", color: "var(--pm-text-muted)" }
            }
          >
            <span>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Tab: Overview */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="col-span-2 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { label: "Plan Week",      value: sub.planWeek },
                { label: "Meals / Week",   value: `${sub.mealsPerWeek} meals` },
                { label: "Weeks Left",     value: sub.weeksRemaining > 0 ? `${sub.weeksRemaining} weeks` : "–" },
                { label: "Next Delivery",  value: effectiveDelivery },
                { label: "Next Billing",   value: sub.nextBilling },
                { label: "Menu Confirmed", value: sub.menuConfirmed ? "✓ Yes" : "✗ No" },
              ].map(f => (
                <div key={f.label} className="p-3" style={{ background: "var(--pm-surface)", border: "1px solid var(--pm-border-soft)" }}>
                  <div className="pm-section-heading mb-1">{f.label}</div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: 13, color: "var(--pm-text)" }}>{f.value}</div>
                </div>
              ))}
            </div>

            {cust && (
              <div className="p-4" style={{ background: "var(--pm-surface)", border: "1px solid var(--pm-border-soft)" }}>
                <div className="pm-section-heading mb-2">Delivery Address</div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "var(--pm-text)" }}>{effectiveAddress}</div>
              </div>
            )}

            {sub.weeksRemaining > 0 && (
              <div className="p-4" style={{ background: "var(--pm-surface)", border: "1px solid var(--pm-border-soft)" }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="pm-section-heading">Plan Progress</div>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "var(--pm-text-muted)" }}>{sub.planWeek}</span>
                </div>
                <div className="w-full h-1.5 mb-2" style={{ background: "var(--pm-surface-muted)" }}>
                  <div className="h-1.5 transition-all" style={{ width: `${Math.round((1 - sub.weeksRemaining / 12) * 100)}%`, background: goalBorderColor }} />
                </div>
                <div className="flex justify-between">
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: "var(--pm-text-muted)" }}>{12 - sub.weeksRemaining} weeks done</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: "var(--pm-text-muted)" }}>{sub.weeksRemaining} remaining</span>
                </div>
              </div>
            )}
          </div>

          {cust && (
            <div className="space-y-3">
              <div className="p-4" style={{ background: "var(--pm-surface)", border: `1px solid ${goalBorderColor}33` }}>
                <div className="pm-section-heading mb-3">Lifetime Value</div>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 28, color: "#F5B300" }}>${cust.ltv.toFixed(2)}</div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: "var(--pm-text-muted)", marginTop: 4 }}>SGD · all invoices</div>
              </div>
              <div className="p-4" style={{ background: "var(--pm-surface)", border: "1px solid var(--pm-border-soft)" }}>
                <div className="pm-section-heading mb-3">Wallet & Rewards</div>
                <div className="flex items-center justify-between py-1.5 border-b border-[var(--pm-border-soft)]">
                  <span style={{ fontSize: 11, color: "var(--pm-text-muted)" }}>Balance</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 13, color: "#22C55E" }}>${effectiveWallet.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span style={{ fontSize: 11, color: "var(--pm-text-muted)" }}>Points</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 13, color: "#F5B300" }}>{cust.points} pts</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab: Plan */}
      {activeTab === "plan" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: "Plan Type",    value: effectivePlan },
              { label: "Goal",         value: goalLabel(sub.goal) },
              { label: "Meals / Week", value: `${sub.mealsPerWeek}` },
              { label: "Status",       value: effectiveStatus },
            ].map(f => (
              <div key={f.label} className="p-4" style={{ background: "var(--pm-surface)", border: "1px solid var(--pm-border-soft)" }}>
                <div className="pm-section-heading mb-1">{f.label}</div>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 15, color: "var(--pm-text)" }}>{f.value}</div>
              </div>
            ))}
          </div>
          <div className="p-4" style={{ background: "var(--pm-surface)", border: "1px solid var(--pm-border-soft)" }}>
            <div className="pm-section-heading mb-3">Weekly Schedule</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
              {["Mon", "Tue", "Wed", "Thu", "Fri"].map(day => (
                <div key={day} className="p-3 text-center" style={{ border: "1px solid var(--pm-border-soft)" }}>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 10, color: "var(--pm-text-muted)", marginBottom: 6 }}>{day}</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "var(--pm-text-muted)" }}>1 meal</div>
                  <div style={{ fontSize: 10, color: "#22C55E", marginTop: 4 }}>Active</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Meals */}
      {activeTab === "meals" && (
        <div style={{ border: "1px solid var(--pm-border-soft)" }}>
          {meals.length === 0 ? (
            <div className="p-8 text-center text-[var(--pm-text-muted)] text-sm mono">No meal history available for this subscriber.</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--pm-border-soft)" }}>
                  {["Week", "Day", "Meal", "Kcal", "Protein", "Carbs", "Fat", "Status"].map(h => (
                    <th key={h} className="pm-section-heading px-4 py-2.5 text-left whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {meals.map((m, i) => (
                  <tr key={`${m.week}-${m.day}`} className="hover:bg-[var(--pm-surface-subtle)] transition-colors" style={{ borderBottom: "1px solid var(--pm-border-soft)", background: i % 2 !== 0 ? "var(--pm-surface-subtle)" : "transparent" }}>
                    <td className="px-4 py-2.5 mono text-xs text-[var(--pm-text-muted)]">W{m.week}</td>
                    <td className="px-4 py-2.5 mono text-xs text-[var(--pm-text-muted)]">{m.day}</td>
                    <td className="px-4 py-2.5" style={{ fontFamily: "'Inter', sans-serif", fontSize: 12 }}>{m.meal}</td>
                    <td className="px-4 py-2.5 mono text-xs">{m.kcal}</td>
                    <td className="px-4 py-2.5 mono text-xs text-green-400">{m.protein}g</td>
                    <td className="px-4 py-2.5 mono text-xs text-blue-400">{m.carbs}g</td>
                    <td className="px-4 py-2.5 mono text-xs text-[var(--pm-text-muted)]">{m.fat}g</td>
                    <td className="px-4 py-2.5">
                      <span className="text-xs mono font-bold capitalize" style={{ color: mealStatusColor[m.status] ?? "#888" }}>
                        {m.status.replace("-", " ")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Tab: Billing */}
      {activeTab === "billing" && (
        <div className="space-y-4">
          <div className="px-4 py-2.5 text-xs mono" style={{ background: "var(--pm-warning-bg)", border: "1px solid var(--pm-warning-border)", color: "var(--pm-warning-text)" }}>
            ℹ Billing is processed via Shopify. This view is read-only. To issue a refund, use Refund Management.
          </div>
          <table className="w-full text-sm" style={{ border: "1px solid var(--pm-border-soft)" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--pm-border-soft)" }}>
                {["Invoice", "Date", "Amount", "Cycle", "Status"].map(h => (
                  <th key={h} className="pm-section-heading px-4 py-2.5 text-left whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {billing.map((b, i) => (
                <tr key={b.id} className="hover:bg-[var(--pm-surface-subtle)] transition-colors" style={{ borderBottom: "1px solid var(--pm-border-soft)", background: i % 2 !== 0 ? "var(--pm-surface-subtle)" : "transparent" }}>
                  <td className="px-4 py-2.5 mono text-xs text-[var(--pm-accent-text)]">{b.id}</td>
                  <td className="px-4 py-2.5 mono text-xs text-[var(--pm-text-muted)]">{b.date}</td>
                  <td className="px-4 py-2.5 mono font-bold text-[var(--pm-text)]">${b.amount.toFixed(2)}</td>
                  <td className="px-4 py-2.5 text-xs text-[var(--pm-text-muted)]">{b.cycle}</td>
                  <td className="px-4 py-2.5">
                    <span className="text-xs mono font-bold" style={{ color: b.status === "paid" ? "#22C55E" : "#F5B300" }}>
                      {b.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab: Pauses */}
      {activeTab === "pauses" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "var(--pm-text-muted)" }}>Pause history for {sub.customerName}</span>
            <button onClick={() => openAction(effectiveStatus === "Paused" ? "resume" : "pause")} className="text-xs font-bold px-4 py-2 mono transition-colors" style={{ background: "#F5B300", color: "#000" }}>
              {effectiveStatus === "Paused" ? "Resume Subscription" : "+ New Pause"}
            </button>
          </div>
          {sub.pauseStart ? (
            <div className="p-4" style={{ border: "1px solid var(--pm-border)", background: "var(--pm-surface)" }}>
              <div className="flex items-center justify-between">
                <div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 13, color: "var(--pm-text)" }}>Active Pause</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "var(--pm-text-muted)", marginTop: 4 }}>
                    {sub.pauseStart} → {sub.pauseEnd}
                  </div>
                </div>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, color: "#F5B300", border: "1px solid #F5B30044", padding: "3px 8px" }}>PAUSED</span>
              </div>
              {sub.resumeDate && (
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#22C55E", marginTop: 8 }}>Resumes {sub.resumeDate}</div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center" style={{ border: "1px solid var(--pm-border-soft)", color: "var(--pm-text-muted)", fontFamily: "'Inter', sans-serif", fontSize: 13 }}>
              No pauses on record for {sub.customerName}.
            </div>
          )}
          <div className="px-4 py-2.5" style={{ border: "1px solid var(--pm-border-soft)", color: "var(--pm-text-muted)", fontFamily: "'Inter', sans-serif", fontSize: 11 }}>
            Business rule: Pauses must be in full weeks — 1 · 2 · 3 · 4 weeks max. Billing deferred by exact pause duration.
          </div>
        </div>
      )}

      {/* Tab: Notes */}
      {activeTab === "notes" && (
        <div className="space-y-4">
          <div className="p-4 space-y-2" style={{ border: "1px solid var(--pm-border-soft)", background: "var(--pm-surface)" }}>
            <div className="pm-section-heading mb-3">Internal Note</div>
            <textarea
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
              placeholder={`Add a note about ${sub.customerName}...`}
              rows={3}
              className="w-full bg-[var(--pm-bg)] text-[var(--pm-text)] text-sm px-3 py-2 outline-none resize-none placeholder:text-[var(--pm-text-muted)]"
              style={{ border: "1px solid var(--pm-border)", fontFamily: "'Inter', sans-serif" }}
            />
            <div className="flex justify-end">
              <button
                disabled={!noteText.trim()}
                onClick={() => {
                  const note = noteText.trim();
                  if (!note) return;
                  setSavedNotes(current => ({ ...current, [sub.id]: [note, ...(current[sub.id] ?? [])] }));
                  setNoteText("");
                  setActionSuccess(`Internal note saved for ${sub.customerName}.`);
                }}
                className="text-xs font-bold px-4 py-2 mono transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: "#F5B300", color: "#000", fontFamily: "'Outfit', sans-serif" }}
              >
                Save Note
              </button>
            </div>
          </div>
          {(savedNotes[sub.id] ?? []).length ? (
            <div className="space-y-2">
              {savedNotes[sub.id].map((note, index) => (
                <div key={`${sub.id}-note-${index}`} className="border border-[var(--pm-border-soft)] bg-[var(--pm-surface)] p-4">
                  <div className="text-xs text-[var(--pm-text-secondary)]">{note}</div>
                  <div className="mt-2 text-[10px] text-[var(--pm-text-muted)] mono">Jerome Lim · Just now</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-sm text-center" style={{ border: "1px solid var(--pm-border-soft)", color: "var(--pm-text-muted)" }}>
              No notes yet for {sub.customerName}.
            </div>
          )}
        </div>
      )}

      {profileAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setProfileAction(null)}>
          <div className="w-full max-w-lg space-y-4 border border-[var(--pm-border)] bg-[var(--pm-surface)] p-6" onClick={event => event.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[var(--pm-border)] pb-3">
              <div>
                <div className="font-bold text-[var(--pm-text-secondary)]">
                  {{
                    "edit-profile": "Edit delivery address",
                    "edit-plan": "Change meal plan",
                    delivery: "Change delivery date",
                    pause: "Pause subscription",
                    resume: "Resume subscription",
                    credit: "Add wallet credit",
                    refund: "Start refund request",
                    "password-reset": "Send password reset link",
                    cancel: "Submit cancellation request",
                  }[profileAction]}
                </div>
                <div className="mt-1 text-xs text-[var(--pm-text-muted)]">{sub.customerName} · {sub.id}</div>
              </div>
              <button onClick={() => setProfileAction(null)} className="text-xl text-[var(--pm-text-muted)]">×</button>
            </div>

            {profileAction === "edit-profile" && (
              <label className="block space-y-1 text-xs text-[var(--pm-text-muted)]">Delivery address
                <textarea rows={3} value={actionValue} onChange={event => setActionValue(event.target.value)} className="block w-full resize-none border border-[var(--pm-border)] bg-[var(--pm-bg)] px-3 py-2 text-sm text-[var(--pm-text-secondary)]" />
              </label>
            )}
            {profileAction === "edit-plan" && (
              <label className="block space-y-1 text-xs text-[var(--pm-text-muted)]">Meal plan
                <select value={actionValue} onChange={event => setActionValue(event.target.value)} className="block w-full border border-[var(--pm-border)] bg-[var(--pm-bg)] px-3 py-2 text-sm text-[var(--pm-text-secondary)]">
                  {["Low Carb Regular", "Low Carb Regular+", "Balance Regular", "Balance Regular+"].map(plan => <option key={plan}>{plan}</option>)}
                </select>
              </label>
            )}
            {profileAction === "delivery" && (
              <label className="block space-y-1 text-xs text-[var(--pm-text-muted)]">Next delivery date
                <input type="date" value={actionValue} onChange={event => setActionValue(event.target.value)} className="block w-full border border-[var(--pm-border)] bg-[var(--pm-bg)] px-3 py-2 text-sm text-[var(--pm-text-secondary)]" />
              </label>
            )}
            {(profileAction === "credit" || profileAction === "refund") && (
              <label className="block space-y-1 text-xs text-[var(--pm-text-muted)]">{profileAction === "credit" ? "Credit amount" : "Requested refund amount"}
                <input type="number" min="0.01" step="0.01" value={actionValue} onChange={event => setActionValue(event.target.value)} placeholder="0.00" className="block w-full border border-[var(--pm-border)] bg-[var(--pm-bg)] px-3 py-2 text-sm text-[var(--pm-text-secondary)]" />
              </label>
            )}
            {profileAction === "pause" && (
              <label className="block space-y-1 text-xs text-[var(--pm-text-muted)]">Pause duration
                <select value={actionValue} onChange={event => setActionValue(event.target.value)} className="block w-full border border-[var(--pm-border)] bg-[var(--pm-bg)] px-3 py-2 text-sm text-[var(--pm-text-secondary)]">
                  <option>1 week</option><option>2 weeks</option><option>3 weeks</option><option>4 weeks</option>
                </select>
              </label>
            )}
            {["pause", "credit", "refund", "cancel"].includes(profileAction) && (
              <label className="block space-y-1 text-xs text-[var(--pm-text-muted)]">Support note <span className="text-red-400">*</span>
                <textarea rows={3} value={actionNote} onChange={event => {
                  setActionNote(event.target.value);
                  setActionError("");
                }} placeholder="Required for the audit trail" className={`block w-full resize-none border bg-[var(--pm-bg)] px-3 py-2 text-sm text-[var(--pm-text-secondary)] ${actionError && !actionNote.trim() ? "border-red-600" : "border-[var(--pm-border)]"}`} />
              </label>
            )}
            {profileAction === "refund" && <div className="border border-blue-900/40 bg-blue-950/10 px-3 py-2 text-xs text-blue-300">This creates a request in Refund Management. Shopify remains responsible for payment execution.</div>}
            {profileAction === "password-reset" && <div className="text-sm text-[var(--pm-text-secondary)]">Send a secure reset link to <strong>{cust?.email}</strong>? Staff will not see or set the customer’s password.</div>}
            {profileAction === "cancel" && <div className="text-xs text-[var(--pm-text-muted)]">The subscription remains active until the cancellation request is approved.</div>}
            {actionError && <div role="alert" className="border border-red-700 bg-red-950/30 px-3 py-2 text-xs font-bold text-red-300 mono">{actionError}</div>}
            <div className="flex gap-2">
              <button onClick={() => setProfileAction(null)} className="flex-1 border border-[var(--pm-border)] py-2 text-xs text-[var(--pm-text-muted)] mono">Cancel</button>
              <button onClick={completeProfileAction} className={`flex-1 py-2 text-xs font-bold mono ${profileAction === "cancel" ? "bg-red-900 text-red-100" : "bg-[#F5B300] text-black"}`}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
