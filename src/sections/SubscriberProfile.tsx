import { useState } from "react";
import { subscriptions, customers } from "../data";

type Tab = "overview" | "plan" | "meals" | "billing" | "pauses" | "notes";

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

export default function SubscriberProfile({ demoMode: _demoMode }: { demoMode?: boolean } = {}) {
  const [selectedId, setSelectedId] = useState<string>(mpSubs[0]?.id ?? "");
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [noteText, setNoteText] = useState("");

  const sub = mpSubs.find(s => s.id === selectedId) ?? mpSubs[0];
  const cust = customers.find(c => c.name === sub?.customerName);

  const filteredSubs = mpSubs.filter(s =>
    s.customerName.toLowerCase().includes(search.toLowerCase())
  );

  const meals = mealHistory[sub?.customerName ?? ""] ?? [];
  const billing = defaultBilling(sub?.customerName ?? "", cust ? 89.50 : 89.50);

  const goalBorderColor = sub?.goal ? (goalColor[sub.goal] ?? "#F5B300") : "#F5B300";

  if (!sub) return (
    <div className="p-8 text-center text-[#555]">No Meal Plan subscribers found.</div>
  );

  return (
    <div className="p-6 space-y-5">

      {/* ── Customer selector bar ─────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: "0.16em", color: "#555" }}>
          VIEWING SUBSCRIBER
        </span>

        {/* Selector dropdown */}
        <div className="relative flex-1 max-w-xs">
          <button
            onClick={() => { setSearchOpen(o => !o); setSearch(""); }}
            className="w-full flex items-center justify-between gap-2 px-3 py-2 border transition-colors text-left"
            style={{ background: "#111", border: `1px solid ${goalBorderColor}44`, borderLeft: `3px solid ${goalBorderColor}` }}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-6 h-6 flex items-center justify-center text-black text-xs font-extrabold flex-shrink-0"
                style={{ background: goalBorderColor, fontFamily: "'Outfit', sans-serif" }}>
                {sub.customerName.split(" ").map(n => n[0]).join("")}
              </div>
              <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: 13, color: "#EFEFEF" }} className="truncate">
                {sub.customerName}
              </span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#555" }}>
                {sub.id}
              </span>
            </div>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="flex-shrink-0" style={{ color: "#555" }}>
              <path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {searchOpen && (
            <div className="absolute top-full left-0 z-50 w-full shadow-2xl" style={{ background: "#111", border: "1px solid #2A2A2A", minWidth: 280 }}>
              <div className="p-2 border-b border-[#1E1E1E]">
                <input
                  autoFocus
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search subscriber..."
                  className="w-full bg-[#1A1A1A] border border-[#2A2A2A] px-3 py-1.5 text-xs text-[#EFEFEF] outline-none placeholder:text-[#444]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                />
              </div>
              <div className="max-h-64 overflow-y-auto">
                {filteredSubs.length === 0 && (
                  <div className="px-3 py-3 text-xs text-[#555]">No results</div>
                )}
                {filteredSubs.map(s => {
                  const active = s.id === selectedId;
                  const gc = s.goal ? (goalColor[s.goal] ?? "#F5B300") : "#888";
                  return (
                    <button
                      key={s.id}
                      onClick={() => { setSelectedId(s.id); setSearchOpen(false); setActiveTab("overview"); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-[#1A1A1A]"
                      style={{ background: active ? "#1A1A1A" : "transparent" }}
                    >
                      <div className="w-7 h-7 flex items-center justify-center text-black text-xs font-extrabold flex-shrink-0"
                        style={{ background: gc, fontFamily: "'Outfit', sans-serif" }}>
                        {s.customerName.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: 12, color: "#EFEFEF" }}>{s.customerName}</div>
                        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: "#555", marginTop: 1 }}>
                          {s.id} · {s.planWeek} · {s.mealsPerWeek} meals/wk
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 9, color: gc, letterSpacing: "0.1em" }}>{s.goal}</span>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: statusColor[s.status] ?? "#888" }}>{s.status}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="px-3 py-2 border-t border-[#1E1E1E]">
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 9.5, color: "#444" }}>
                  {mpSubs.length} meal plan subscribers total
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Status + goal badges */}
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, color: statusColor[sub.status] ?? "#888", border: `1px solid ${statusColor[sub.status] ?? "#888"}44`, padding: "2px 8px" }}>
          {sub.status.toUpperCase()}
        </span>
        {sub.goal && (
          <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 10, fontWeight: 800, color: goalBorderColor, border: `1px solid ${goalBorderColor}44`, padding: "2px 8px", letterSpacing: "0.1em" }}>
            {sub.goal}
          </span>
        )}
        <div className="flex-1" />
        <button className="text-xs mono px-3 py-1.5 transition-colors" style={{ border: "1px solid #2A2A2A", color: "#666" }}>
          Edit Profile
        </button>
      </div>

      {/* Contact strip */}
      {cust && (
        <div className="flex items-center gap-5 px-4 py-2.5" style={{ background: "#111", border: "1px solid #1E1E1E" }}>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#888" }}>{cust.email}</span>
          <span style={{ color: "#2A2A2A" }}>·</span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#888" }}>{cust.phone}</span>
          <span style={{ color: "#2A2A2A" }}>·</span>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#666" }}>{cust.address}</span>
          <span style={{ color: "#2A2A2A" }}>·</span>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#555" }}>Joined {cust.joinDate}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-[#1E1E1E]">
        {tabConfig.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className="flex items-center gap-1.5 px-4 py-2.5 text-xs mono border-b-2 transition-colors"
            style={activeTab === t.id
              ? { borderBottomColor: "#F5B300", color: "#F5B300" }
              : { borderBottomColor: "transparent", color: "#555" }
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
                { label: "Next Delivery",  value: sub.nextDelivery },
                { label: "Next Billing",   value: sub.nextBilling },
                { label: "Menu Confirmed", value: sub.menuConfirmed ? "✓ Yes" : "✗ No" },
              ].map(f => (
                <div key={f.label} className="p-3" style={{ background: "#111", border: "1px solid #1E1E1E" }}>
                  <div className="pm-section-heading mb-1">{f.label}</div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: 13, color: "#EFEFEF" }}>{f.value}</div>
                </div>
              ))}
            </div>

            {cust && (
              <div className="p-4" style={{ background: "#111", border: "1px solid #1E1E1E" }}>
                <div className="pm-section-heading mb-2">Delivery Address</div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#EFEFEF" }}>{cust.address}</div>
              </div>
            )}

            {sub.weeksRemaining > 0 && (
              <div className="p-4" style={{ background: "#111", border: "1px solid #1E1E1E" }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="pm-section-heading">Plan Progress</div>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#888" }}>{sub.planWeek}</span>
                </div>
                <div className="w-full h-1.5 mb-2" style={{ background: "#222" }}>
                  <div className="h-1.5 transition-all" style={{ width: `${Math.round((1 - sub.weeksRemaining / 12) * 100)}%`, background: goalBorderColor }} />
                </div>
                <div className="flex justify-between">
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: "#555" }}>{12 - sub.weeksRemaining} weeks done</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: "#555" }}>{sub.weeksRemaining} remaining</span>
                </div>
              </div>
            )}
          </div>

          {cust && (
            <div className="space-y-3">
              <div className="p-4" style={{ background: "#111", border: `1px solid ${goalBorderColor}33` }}>
                <div className="pm-section-heading mb-3">Lifetime Value</div>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 28, color: "#F5B300" }}>${cust.ltv.toFixed(2)}</div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: "#555", marginTop: 4 }}>SGD · all invoices</div>
              </div>
              <div className="p-4" style={{ background: "#111", border: "1px solid #1E1E1E" }}>
                <div className="pm-section-heading mb-3">Wallet & Rewards</div>
                <div className="flex items-center justify-between py-1.5 border-b border-[#1A1A1A]">
                  <span style={{ fontSize: 11, color: "#888" }}>Balance</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 13, color: "#22C55E" }}>${cust.walletBalance.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span style={{ fontSize: 11, color: "#888" }}>Points</span>
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
              { label: "Plan Type",    value: sub.planType },
              { label: "Goal",         value: sub.goal ?? "–" },
              { label: "Meals / Week", value: `${sub.mealsPerWeek}` },
              { label: "Status",       value: sub.status },
            ].map(f => (
              <div key={f.label} className="p-4" style={{ background: "#111", border: "1px solid #1E1E1E" }}>
                <div className="pm-section-heading mb-1">{f.label}</div>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 15, color: "#EFEFEF" }}>{f.value}</div>
              </div>
            ))}
          </div>
          <div className="p-4" style={{ background: "#111", border: "1px solid #1E1E1E" }}>
            <div className="pm-section-heading mb-3">Weekly Schedule</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
              {["Mon", "Tue", "Wed", "Thu", "Fri"].map(day => (
                <div key={day} className="p-3 text-center" style={{ border: "1px solid #1E1E1E" }}>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 10, color: "#555", marginBottom: 6 }}>{day}</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#888" }}>1 meal</div>
                  <div style={{ fontSize: 10, color: "#22C55E", marginTop: 4 }}>Active</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Meals */}
      {activeTab === "meals" && (
        <div style={{ border: "1px solid #1E1E1E" }}>
          {meals.length === 0 ? (
            <div className="p-8 text-center text-[#555] text-sm mono">No meal history available for this subscriber.</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid #1E1E1E" }}>
                  {["Week", "Day", "Meal", "Kcal", "Protein", "Carbs", "Fat", "Status"].map(h => (
                    <th key={h} className="pm-section-heading px-4 py-2.5 text-left whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {meals.map((m, i) => (
                  <tr key={`${m.week}-${m.day}`} className="hover:bg-[#141414] transition-colors" style={{ borderBottom: "1px solid #1A1A1A", background: i % 2 !== 0 ? "#111" : "transparent" }}>
                    <td className="px-4 py-2.5 mono text-xs text-[#555]">W{m.week}</td>
                    <td className="px-4 py-2.5 mono text-xs text-[#888]">{m.day}</td>
                    <td className="px-4 py-2.5" style={{ fontFamily: "'Inter', sans-serif", fontSize: 12 }}>{m.meal}</td>
                    <td className="px-4 py-2.5 mono text-xs">{m.kcal}</td>
                    <td className="px-4 py-2.5 mono text-xs text-green-400">{m.protein}g</td>
                    <td className="px-4 py-2.5 mono text-xs text-blue-400">{m.carbs}g</td>
                    <td className="px-4 py-2.5 mono text-xs text-[#888]">{m.fat}g</td>
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
          <div className="px-4 py-2.5 text-xs mono" style={{ background: "#1A1500", border: "1px solid #3D3000", color: "#F5B300" }}>
            ℹ Billing is processed via Shopify. This view is read-only. To issue a refund, use Refund Management.
          </div>
          <table className="w-full text-sm" style={{ border: "1px solid #1E1E1E" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #1E1E1E" }}>
                {["Invoice", "Date", "Amount", "Cycle", "Status"].map(h => (
                  <th key={h} className="pm-section-heading px-4 py-2.5 text-left whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {billing.map((b, i) => (
                <tr key={b.id} className="hover:bg-[#141414] transition-colors" style={{ borderBottom: "1px solid #1A1A1A", background: i % 2 !== 0 ? "#111" : "transparent" }}>
                  <td className="px-4 py-2.5 mono text-xs text-[#F5B300]">{b.id}</td>
                  <td className="px-4 py-2.5 mono text-xs text-[#888]">{b.date}</td>
                  <td className="px-4 py-2.5 mono font-bold text-[#EFEFEF]">${b.amount.toFixed(2)}</td>
                  <td className="px-4 py-2.5 text-xs text-[#888]">{b.cycle}</td>
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
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#555" }}>Pause history for {sub.customerName}</span>
            <button className="text-xs font-bold px-4 py-2 mono transition-colors" style={{ background: "#F5B300", color: "#000" }}>
              + New Pause
            </button>
          </div>
          {sub.pauseStart ? (
            <div className="p-4" style={{ border: "1px solid #2A2A2A", background: "#111" }}>
              <div className="flex items-center justify-between">
                <div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 13, color: "#EFEFEF" }}>Active Pause</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#888", marginTop: 4 }}>
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
            <div className="p-8 text-center" style={{ border: "1px solid #1E1E1E", color: "#555", fontFamily: "'Inter', sans-serif", fontSize: 13 }}>
              No pauses on record for {sub.customerName}.
            </div>
          )}
          <div className="px-4 py-2.5" style={{ border: "1px solid #1E1E1E", color: "#444", fontFamily: "'Inter', sans-serif", fontSize: 11 }}>
            Business rule: Pauses must be in full weeks — 1 · 2 · 3 · 4 weeks max. Billing deferred by exact pause duration.
          </div>
        </div>
      )}

      {/* Tab: Notes */}
      {activeTab === "notes" && (
        <div className="space-y-4">
          <div className="p-4 space-y-2" style={{ border: "1px solid #1E1E1E", background: "#111" }}>
            <div className="pm-section-heading mb-3">Internal Note</div>
            <textarea
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
              placeholder={`Add a note about ${sub.customerName}...`}
              rows={3}
              className="w-full bg-[#0D0D0D] text-[#EFEFEF] text-sm px-3 py-2 outline-none resize-none placeholder:text-[#333]"
              style={{ border: "1px solid #2A2A2A", fontFamily: "'Inter', sans-serif" }}
            />
            <div className="flex justify-end">
              <button
                disabled={!noteText.trim()}
                onClick={() => setNoteText("")}
                className="text-xs font-bold px-4 py-2 mono transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: "#F5B300", color: "#000", fontFamily: "'Outfit', sans-serif" }}
              >
                Save Note
              </button>
            </div>
          </div>
          <div className="p-4 text-sm text-center" style={{ border: "1px solid #1E1E1E", color: "#555" }}>
            No notes yet for {sub.customerName}.
          </div>
        </div>
      )}
    </div>
  );
}
