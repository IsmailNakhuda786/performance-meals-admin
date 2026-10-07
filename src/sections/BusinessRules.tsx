import { useState } from "react";

type RuleStream = "meal-plans" | "ready-series" | "shared";
type RuleStatus = "active" | "draft" | "disabled";

interface Rule {
  id: string;
  name: string;
  stream: RuleStream;
  category: string;
  description: string;
  condition: string;
  action: string;
  status: RuleStatus;
  lastModified: string;
  modifiedBy: string;
}

const rules: Rule[] = [
  { id: "BR-01", name: "Meal Plan Pause — Whole Weeks Only", stream: "meal-plans", category: "Subscription", description: "Pauses must align to full billing weeks. No mid-week pauses.", condition: "pause_request.days % 7 === 0", action: "Allow pause. Otherwise reject with message.", status: "active", lastModified: "01 Sep 2024", modifiedBy: "Jerome Lim" },
  { id: "BR-02", name: "Menu Review Cutoff — Thursday 12pm", stream: "meal-plans", category: "Menu", description: "Meal swap window closes every Thursday at 12:00pm SGT.", condition: "day_of_week === 4 && time >= '12:00'", action: "Lock meal selections. Notify subscribers 2h before.", status: "active", lastModified: "01 Sep 2024", modifiedBy: "Jerome Lim" },
  { id: "BR-03", name: "Billing Cycle — Weekly on Monday", stream: "meal-plans", category: "Billing", description: "All Meal Plan subscriptions bill on Mondays.", condition: "subscription.active && day_of_week === 1", action: "Trigger Shopify billing. Log to Finance.", status: "active", lastModified: "01 Sep 2024", modifiedBy: "Ravi Kumar" },
  { id: "BR-04", name: "Failed Payment — 3 Retry Attempts", stream: "meal-plans", category: "Billing", description: "Retry failed payments up to 3 times over 48 hours before suspending.", condition: "payment.failed && retry_count < 3", action: "Retry via Shopify. Notify customer via Email + WhatsApp.", status: "active", lastModified: "05 Sep 2024", modifiedBy: "Ravi Kumar" },
  { id: "BR-05", name: "Pause Limit — Max 4 Weeks per Cycle", stream: "meal-plans", category: "Subscription", description: "Subscribers may not pause more than 4 consecutive weeks.", condition: "pause_weeks_total > 4", action: "Reject pause. Show customer message. Notify Support.", status: "active", lastModified: "10 Sep 2024", modifiedBy: "Jerome Lim" },
  { id: "BR-06", name: "Ready Series — Free Delivery Threshold $80", stream: "ready-series", category: "Delivery", description: "Orders above $80 qualify for free delivery.", condition: "order.subtotal >= 80", action: "Apply free_delivery discount code via Shopify.", status: "active", lastModified: "01 Sep 2024", modifiedBy: "Jerome Lim" },
  { id: "BR-07", name: "Bundle Discount — 10-Meal Box 10% Off", stream: "ready-series", category: "Pricing", description: "10-meal box orders automatically receive 10% bundle discount.", condition: "order.product_type === 'box-10meal'", action: "Apply BUNDLE10 discount. Log to Finance.", status: "active", lastModified: "01 Sep 2024", modifiedBy: "Ravi Kumar" },
  { id: "BR-08", name: "Promotion — Buy 2 Boxes Get Free Ice Pack", stream: "ready-series", category: "Promotion", description: "When customer orders 2+ boxes in one order, add free ice pack.", condition: "order.box_count >= 2", action: "Add free_ice_pack line item. Notify Kitchen.", status: "draft", lastModified: "12 Sep 2024", modifiedBy: "Mei Ling" },
  { id: "BR-09", name: "Ready Series A-la-carte — Same Day Cutoff 11am", stream: "ready-series", category: "Delivery", description: "RtG orders placed after 11am are queued for next day delivery.", condition: "order.type === 'rtg' && time > '11:00'", action: "Set delivery_date = tomorrow. Notify customer.", status: "active", lastModified: "01 Sep 2024", modifiedBy: "Jerome Lim" },
  { id: "BR-10", name: "Wallet Credit Expiry — 90 Days", stream: "shared", category: "Wallet", description: "Unused wallet credits expire 90 days after issuance.", condition: "credit.age_days > 90 && credit.balance > 0", action: "Expire credit. Send 7-day warning email before expiry.", status: "active", lastModified: "01 Sep 2024", modifiedBy: "Jerome Lim" },
  { id: "BR-11", name: "Refund — Auto-Approve Below $30", stream: "shared", category: "Refunds", description: "Refund requests under $30 are auto-approved without manual review.", condition: "refund.amount < 30 && refund.reason in ['quality', 'wrong-order']", action: "Auto-approve. Issue wallet credit. Log to Finance.", status: "draft", lastModified: "13 Sep 2024", modifiedBy: "Ravi Kumar" },
  { id: "BR-12", name: "Junior Item Pricing — Meal Plan Auto-Orders", stream: "meal-plans", category: "Pricing", description: "Automatic orders must use rule-driven junior item pricing. Junior items are priced at a configurable % of the adult base price. This rule prevents mispricing during automation runs.", condition: "order.has_junior_items === true && order.source === 'automation'", action: "Apply junior_price_rule to all junior line items. Validate price before order creation. Block order if validation fails.", status: "active", lastModified: "12 Sep 2024", modifiedBy: "Jerome Lim" },
];

const statusStyle: Record<RuleStatus, string> = {
  active: "text-green-400 bg-green-950/30",
  draft: "text-yellow-400 bg-yellow-950/30",
  disabled: "text-[var(--pm-text-muted)] bg-[var(--pm-surface-muted)]",
};

const streamAccent: Record<RuleStream, string> = {
  "meal-plans": "#F5B300",
  "ready-series": "#E85D04",
  "shared": "#888",
};

const streamLabel: Record<RuleStream, string> = {
  "meal-plans": "Meal Plans",
  "ready-series": "Ready Series",
  "shared": "Shared",
};

const categories = ["All", "Subscription", "Menu", "Billing", "Delivery", "Pricing", "Promotion", "Wallet", "Refunds"];

const juniorPriceHistory = [
  { date: "12 Sep 2024", user: "Jerome Lim", from: "55%", to: "60%" },
  { date: "01 Aug 2024", user: "Ravi Kumar", from: "50%", to: "55%" },
  { date: "01 Jun 2024", user: "Jerome Lim", from: "50%", to: "50%" },
];

export default function BusinessRules({ demoMode }: { demoMode?: boolean } = {}) {
  const [streamFilter, setStreamFilter] = useState<RuleStream | "all">("all");
  const [catFilter, setCatFilter] = useState("All");
  const [selected, setSelected] = useState<Rule | null>(demoMode ? rules[0] : null);
  const [showNewModal, setShowNewModal] = useState(false);

  // Junior Pricing state
  const [juniorPct, setJuniorPct] = useState(60);
  const [juniorPctInput, setJuniorPctInput] = useState("60");
  const [juniorSaved, setJuniorSaved] = useState(false);
  const [juniorHistory, setJuniorHistory] = useState(juniorPriceHistory);

  function handleSaveJuniorRule() {
    const val = parseInt(juniorPctInput, 10);
    if (isNaN(val) || val < 1 || val > 100) return;
    if (val === juniorPct) return;
    const entry = { date: new Date().toLocaleDateString("en-SG", { day: "2-digit", month: "short", year: "numeric" }), user: "Jerome Lim", from: `${juniorPct}%`, to: `${val}%` };
    setJuniorHistory(prev => [entry, ...prev.slice(0, 2)]);
    setJuniorPct(val);
    setJuniorSaved(true);
    setTimeout(() => setJuniorSaved(false), 4000);
  }

  const filtered = rules.filter(r => {
    if (streamFilter !== "all" && r.stream !== streamFilter) return false;
    if (catFilter !== "All" && r.category !== catFilter) return false;
    return true;
  });

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold">Business Rules Engine</h2>
          <div className="text-xs text-[var(--pm-text-muted)] mono mt-0.5">Operational rules governing both business units</div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowNewModal(true)}
            className="bg-[#F5B300] text-black text-xs font-bold px-4 py-2 mono hover:bg-[#C99200] transition-colors">
            + New Rule
          </button>
          <button className="border border-[var(--pm-border-strong)] text-[var(--pm-text-secondary)] text-xs px-4 py-2 mono hover:border-[#F5B300] hover:text-[var(--pm-accent-text)] transition-colors">
            Export CSV
          </button>
        </div>
      </div>

      <div className="border border-yellow-800/30 bg-yellow-950/10 px-4 py-2.5 text-xs text-yellow-300 mono space-y-1">
        <div>⚠ Rules marked <span className="font-bold">active</span> are enforced immediately. Changes require Super Admin or Finance Manager approval. All changes are logged.</div>
        <div className="text-yellow-400/80">Junior pricing rules are enforced during automatic order generation. Invalid junior pricing will block order creation. See <span className="font-bold text-[var(--pm-accent-text)]">BR-12</span>.</div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Active Rules", value: rules.filter(r => r.status === "active").length, color: "#22C55E" },
          { label: "Draft / Pending", value: rules.filter(r => r.status === "draft").length, color: "#F5B300" },
          { label: "Meal Plans Rules", value: rules.filter(r => r.stream === "meal-plans").length, color: "#F5B300" },
          { label: "Ready Series Rules", value: rules.filter(r => r.stream === "ready-series").length, color: "#E85D04" },
        ].map(k => (
          <div key={k.label} className="border border-[var(--pm-border)] bg-[var(--pm-surface)] p-4">
            <div className="text-xs font-bold text-[var(--pm-text)] uppercase tracking-widest mb-2">{k.label}</div>
            <div className="text-3xl font-extrabold mono" style={{ color: k.color }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap items-center">
        <div className="flex border border-[var(--pm-border)]">
          {([["all", "All Units"], ["meal-plans", "Meal Plans"], ["ready-series", "Ready Series"], ["shared", "Shared"]] as [RuleStream | "all", string][]).map(([s, label]) => (
            <button key={s} onClick={() => setStreamFilter(s)}
              className={`px-4 py-2 text-xs font-bold mono transition-colors ${streamFilter === s
                ? s === "meal-plans" ? "bg-[#F5B300] text-black"
                  : s === "ready-series" ? "bg-[#E85D04] text-black"
                  : "bg-[var(--pm-surface-muted)] text-[var(--pm-text-secondary)]"
                : "text-[var(--pm-text-muted)] hover:text-[var(--pm-text-secondary)] hover:bg-[var(--pm-surface)]"}`}>
              {label}
            </button>
          ))}
        </div>
        <div className="flex gap-1 flex-wrap">
          {categories.map(c => (
            <button key={c} onClick={() => setCatFilter(c)}
              className={`text-xs px-3 py-1 mono border transition-colors ${catFilter === c ? "border-[#F5B300] text-[var(--pm-accent-text)] bg-[#F5B300]/10" : "border-[var(--pm-border)] text-[var(--pm-text-muted)] hover:text-[var(--pm-text-secondary)]"}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Rule list */}
        <div className="col-span-3 space-y-2">
          {filtered.map(r => (
            <div key={r.id} onClick={() => setSelected(r)}
              className={`border p-4 cursor-pointer transition-all ${selected?.id === r.id ? "border-[#F5B300]/40 bg-[var(--pm-surface-muted)]" : "border-[var(--pm-border)] bg-[var(--pm-surface)] hover:bg-[var(--pm-surface-muted)]"}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="mono text-xs text-[var(--pm-text-muted)]">{r.id}</span>
                    <span className="text-xs font-bold mono px-1.5 py-0.5" style={{ color: streamAccent[r.stream] }}>
                      {streamLabel[r.stream]}
                    </span>
                    <span className="text-xs text-[var(--pm-text-muted)] border border-[var(--pm-border)] px-1.5 py-0.5 mono">{r.category}</span>
                    {r.id === "BR-12" && (
                      <span className="text-xs mono px-1.5 py-0.5 text-purple-400 bg-purple-950/30 border border-purple-800/30">Phase 7</span>
                    )}
                  </div>
                  <div className="font-semibold text-sm">{r.name}</div>
                  <div className="text-xs text-[var(--pm-text-muted)] mt-0.5">{r.description}</div>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <span className={`text-xs mono px-2 py-0.5 font-bold ${statusStyle[r.status]}`}>{r.status}</span>
                  <div className="flex gap-1">
                    {r.status === "active" ? (
                      <button className="text-xs border border-[var(--pm-border)] px-2 py-1 text-[var(--pm-text-muted)] hover:border-red-600/40 hover:text-red-400 mono transition-colors" onClick={e => e.stopPropagation()}>Disable</button>
                    ) : (
                      <button className="text-xs border border-green-800/40 px-2 py-1 text-green-400 hover:bg-green-950 mono transition-colors" onClick={e => e.stopPropagation()}>Activate</button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="border border-[var(--pm-border)] bg-[var(--pm-surface)] p-8 text-center text-[var(--pm-text-muted)] text-sm">No rules match your filters.</div>
          )}
        </div>

        {/* Detail panel */}
        <div className="col-span-2 border border-[var(--pm-border)] bg-[var(--pm-surface)]">
          {!selected ? (
            <div className="flex items-center justify-center h-full text-[var(--pm-text-muted)] text-sm p-4">Select a rule to inspect</div>
          ) : (
            <div className="flex flex-col h-full">
              <div className="px-4 py-3 border-b border-[var(--pm-border)] flex items-center justify-between">
                <span className="font-bold mono text-xs" style={{ color: streamAccent[selected.stream] }}>{selected.id} — {streamLabel[selected.stream]}</span>
                <span className={`text-xs mono px-2 py-0.5 font-bold ${statusStyle[selected.status]}`}>{selected.status}</span>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div>
                  <div className="text-xs text-[var(--pm-text-muted)] uppercase tracking-wider mb-1">Rule Name</div>
                  <div className="font-semibold">{selected.name}</div>
                </div>
                <div>
                  <div className="text-xs text-[var(--pm-text-muted)] uppercase tracking-wider mb-1">Description</div>
                  <div className="text-sm text-[var(--pm-text-muted)]">{selected.description}</div>
                </div>
                <div>
                  <div className="text-xs text-[var(--pm-text-muted)] uppercase tracking-wider mb-1">Condition</div>
                  <div className="bg-[var(--pm-bg)] border border-[var(--pm-border)] px-3 py-2 mono text-xs text-green-400">{selected.condition}</div>
                </div>
                <div>
                  <div className="text-xs text-[var(--pm-text-muted)] uppercase tracking-wider mb-1">Action Triggered</div>
                  <div className="bg-[var(--pm-bg)] border border-[var(--pm-border)] px-3 py-2 text-xs text-[var(--pm-text-muted)]">{selected.action}</div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs text-[var(--pm-text-muted)] uppercase tracking-wider mb-1">Category</div>
                    <div className="text-sm">{selected.category}</div>
                  </div>
                  <div>
                    <div className="text-xs text-[var(--pm-text-muted)] uppercase tracking-wider mb-1">Last Modified</div>
                    <div className="mono text-xs text-[var(--pm-text-muted)]">{selected.lastModified}</div>
                  </div>
                </div>
                <div className="text-xs text-[var(--pm-text-muted)] mono">Modified by: {selected.modifiedBy}</div>
                <div className="flex gap-2">
                  <button className="flex-1 border border-[var(--pm-border)] text-[var(--pm-text-muted)] text-xs py-2 mono hover:border-[#F5B300] hover:text-[var(--pm-accent-text)] transition-colors">Edit Rule</button>
                  <button className="flex-1 border border-red-800/40 text-red-400 text-xs py-2 mono hover:bg-red-950 transition-colors">Delete</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Junior Pricing Configuration Panel */}
      <div className="border border-[var(--pm-border)] bg-[var(--pm-surface)]">
        <div className="px-4 py-3 border-b border-[var(--pm-border)] flex items-center gap-3">
          <div className="w-1.5 h-1.5 bg-[#F5B300]" />
          <span className="text-xs font-bold text-[var(--pm-text)] uppercase tracking-wider">Junior Item Pricing Configuration</span>
          <span className="ml-auto mono text-xs text-[var(--pm-text-muted)]">BR-12</span>
        </div>

        {juniorSaved && (
          <div className="mx-4 mt-4 border border-green-800/40 bg-green-950/20 px-4 py-2.5 text-xs text-green-400 mono font-bold">
            ✓ Junior pricing rule saved — takes effect from the next automation run.
          </div>
        )}

        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Left: current rule + editor */}
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-xs text-[var(--pm-text-secondary)]">Current Rule</div>
                <span className="text-xs mono text-green-400 bg-green-950/30 px-2 py-0.5 font-bold">active</span>
              </div>
              <div className="bg-[var(--pm-bg)] border border-[var(--pm-border)] px-3 py-2 text-xs mono text-[var(--pm-accent-text)] font-bold">
                Junior items = {juniorPct}% of adult base price
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mono">
                <div>
                  <div className="text-[var(--pm-text-secondary)] mb-0.5">Rule Type</div>
                  <div className="text-[var(--pm-text-muted)]">% of adult base price</div>
                </div>
                <div>
                  <div className="text-[var(--pm-text-secondary)] mb-0.5">Current %</div>
                  <div className="text-[var(--pm-accent-text)] font-bold">{juniorPct}%</div>
                </div>
              </div>
            </div>

            {/* Editable field */}
            <div className="border border-[var(--pm-border)] bg-[var(--pm-bg)] p-3 space-y-3">
              <div className="text-xs font-bold text-[var(--pm-text)] uppercase tracking-wider">Update Percentage</div>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="text-xs text-[var(--pm-text-secondary)] block mb-1">New % (1–100)</label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={juniorPctInput}
                    onChange={e => setJuniorPctInput(e.target.value)}
                    className="w-full bg-[var(--pm-surface)] border border-[var(--pm-border)] text-[var(--pm-text-secondary)] text-sm px-3 py-2 mono focus:outline-none focus:border-[#F5B300]"
                  />
                </div>
                <button onClick={handleSaveJuniorRule}
                  className="mt-5 bg-[#F5B300] text-black text-xs font-bold px-4 py-2 mono hover:bg-[#C99200] transition-colors whitespace-nowrap">
                  Save Rule
                </button>
              </div>
              <div className="border border-yellow-800/30 bg-yellow-950/10 px-3 py-2 text-xs text-yellow-300 mono">
                ⚠ This value is applied to ALL automatic order junior items. Changes take effect from the next automation run (next Thursday 2:55 PM SGT).
              </div>
            </div>
          </div>

          {/* Right: change history */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-[var(--pm-text)] uppercase tracking-wider">Change History</div>
            <div className="space-y-2">
              {juniorHistory.map((h, i) => (
                <div key={i} className="border border-[var(--pm-border)] bg-[var(--pm-bg)] px-3 py-2.5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="mono text-xs text-[var(--pm-accent-text)]">{h.user}</span>
                    <span className="mono text-xs text-[var(--pm-text-muted)]">{h.date}</span>
                  </div>
                  <div className="mono text-xs">
                    <span className="text-red-400">{h.from}</span>
                    <span className="text-[var(--pm-text-muted)]"> → </span>
                    <span className="text-green-400">{h.to}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-xs text-[var(--pm-text-muted)] mono">Showing last 3 changes. All changes are audit-logged.</div>
          </div>
        </div>
      </div>

      {/* New rule modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="bg-[var(--pm-surface)] border border-[var(--pm-border)] w-full max-w-[520px]">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--pm-border)]">
              <span className="font-bold text-[var(--pm-accent-text)] mono">New Business Rule</span>
              <button onClick={() => setShowNewModal(false)} className="text-[var(--pm-text-muted)] hover:text-[var(--pm-text-secondary)] text-xl">×</button>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <label className="text-xs font-bold text-[var(--pm-text)] uppercase tracking-wider block mb-1">Rule Name</label>
                <input type="text" placeholder="e.g. Free delivery above $80"
                  className="w-full bg-[var(--pm-bg)] border border-[var(--pm-border)] text-[var(--pm-text-secondary)] text-sm px-3 py-2 focus:outline-none focus:border-[#F5B300] placeholder:text-[var(--pm-text-muted)]" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[var(--pm-text)] uppercase tracking-wider block mb-1">Business Unit</label>
                  <select className="w-full bg-[var(--pm-bg)] border border-[var(--pm-border)] text-[var(--pm-text-secondary)] text-sm px-3 py-2 focus:outline-none focus:border-[#F5B300]">
                    <option value="meal-plans">Meal Plans</option>
                    <option value="ready-series">Ready Series</option>
                    <option value="shared">Shared</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-[var(--pm-text)] uppercase tracking-wider block mb-1">Category</label>
                  <select className="w-full bg-[var(--pm-bg)] border border-[var(--pm-border)] text-[var(--pm-text-secondary)] text-sm px-3 py-2 focus:outline-none focus:border-[#F5B300]">
                    {categories.filter(c => c !== "All").map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-[var(--pm-text)] uppercase tracking-wider block mb-1">Description</label>
                <textarea rows={2} placeholder="Describe what this rule does…"
                  className="w-full bg-[var(--pm-bg)] border border-[var(--pm-border)] text-[var(--pm-text-secondary)] text-sm px-3 py-2 focus:outline-none focus:border-[#F5B300] placeholder:text-[var(--pm-text-muted)] resize-none" />
              </div>
              <div>
                <label className="text-xs font-bold text-[var(--pm-text)] uppercase tracking-wider block mb-1">Condition</label>
                <input type="text" placeholder="e.g. order.subtotal >= 80"
                  className="w-full bg-[var(--pm-bg)] border border-[var(--pm-border)] text-[var(--pm-text-secondary)] text-sm px-3 py-2 mono focus:outline-none focus:border-[#F5B300] placeholder:text-[var(--pm-text-muted)]" />
              </div>
              <div>
                <label className="text-xs font-bold text-[var(--pm-text)] uppercase tracking-wider block mb-1">Action</label>
                <textarea rows={2} placeholder="What should happen when the condition is met?"
                  className="w-full bg-[var(--pm-bg)] border border-[var(--pm-border)] text-[var(--pm-text-secondary)] text-sm px-3 py-2 focus:outline-none focus:border-[#F5B300] placeholder:text-[var(--pm-text-muted)] resize-none" />
              </div>
              <div className="flex gap-2">
                <button onClick={() => setShowNewModal(false)} className="flex-1 bg-[#F5B300] text-black py-2 text-sm font-bold mono hover:bg-[#C99200] transition-colors">Save as Draft</button>
                <button onClick={() => setShowNewModal(false)} className="flex-1 border border-[var(--pm-border)] text-[var(--pm-text-muted)] py-2 text-sm mono hover:text-[var(--pm-text-secondary)] transition-colors">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
