import { useState } from "react";
import StatusBadge from "../components/StatusBadge";
import { customers, orders, subscriptions } from "../data";

const tickets = [
  { id: "TKT-001", customer: "Aisha Rahman", issue: "Wrong meal delivered (Dinner slot)", priority: "High", status: "Open", created: "14 Sep 10:24", assigned: "Sarah" },
  { id: "TKT-002", customer: "Wei Jie Lim", issue: "Request to extend pause by 2 more weeks", priority: "Medium", status: "In Progress", created: "14 Sep 09:11", assigned: "Jerome" },
  { id: "TKT-003", customer: "Jason Yeo", issue: "Billing charge after pause — needs refund", priority: "High", status: "Open", created: "14 Sep 08:55", assigned: "Unassigned" },
  { id: "TKT-004", customer: "Marcus Tan", issue: "Cannot access meal menu for next week", priority: "Low", status: "Resolved", created: "13 Sep 16:40", assigned: "Sarah" },
  { id: "TKT-005", customer: "Serene Tay", issue: "Cancel subscription and process refund", priority: "Medium", status: "Resolved", created: "13 Sep 14:20", assigned: "Jerome" },
];

const priorityColor: Record<string, string> = {
  High: "bg-red-950 text-red-400",
  Medium: "bg-orange-950 text-orange-400",
  Low: "bg-[var(--pm-surface-muted)] text-[var(--pm-text-muted)]",
};

const ticketStatusColor: Record<string, string> = {
  Open: "bg-blue-950 text-blue-400",
  "In Progress": "bg-yellow-950 text-yellow-400",
  Resolved: "bg-green-950 text-green-400",
};

const propagationSteps: Record<string, { step: string; system: string; detail: string }[]> = {
  "Update Address": [
    { step: "Subscriber record updated", system: "CRM", detail: "Delivery address changed" },
    { step: "DO updated", system: "Dispatch", detail: "New address applied to next delivery order" },
    { step: "Dispatch record updated", system: "Logistics", detail: "Rider re-routed if applicable" },
    { step: "Audit Log created", system: "Audit", detail: "Changed By · Timestamp · Old/New Address" },
  ],
  "Meal Swap": [
    { step: "Subscriber record updated", system: "CRM", detail: "Meal selection changed" },
    { step: "Kitchen requirement recalculated", system: "Kitchen", detail: "Production count adjusted for new meal" },
    { step: "Packing requirement updated", system: "Packaging", detail: "Packing list and labels regenerated" },
    { step: "DO updated if applicable", system: "Dispatch", detail: "Delivery manifest updated for affected order" },
    { step: "Dispatch record updated if applicable", system: "Logistics", detail: "Rider notified of change" },
    { step: "Audit Log created", system: "Audit", detail: "Meal Swap · Changed By · Timestamp · Old/New Meal" },
  ],
  "Pause Plan": [
    { step: "Subscriber record updated", system: "CRM", detail: "Plan status set to Paused (1–4 weeks)" },
    { step: "Meal schedule suspended", system: "Kitchen", detail: "Production dequeued for pause period" },
    { step: "DO cancelled for pause window", system: "Dispatch", detail: "Future DOs within pause period cancelled" },
    { step: "Audit Log created", system: "Audit", detail: "Pause · Duration · Changed By · Timestamp" },
  ],
  "Resume Plan": [
    { step: "Subscriber record updated", system: "CRM", detail: "Plan status set to Active" },
    { step: "Kitchen re-queued", system: "Kitchen", detail: "Meals re-added to production schedule" },
    { step: "DO regenerated", system: "Dispatch", detail: "Delivery orders recreated from resume date" },
    { step: "Audit Log created", system: "Audit", detail: "Resume · Changed By · Timestamp" },
  ],
  "Update Name": [
    { step: "Subscriber record updated", system: "CRM", detail: "Customer name changed" },
    { step: "DO label updated", system: "Dispatch", detail: "Delivery manifest name updated" },
    { step: "Audit Log created", system: "Audit", detail: "Name Change · Changed By · Timestamp" },
  ],
  "Update Phone": [
    { step: "Subscriber record updated", system: "CRM", detail: "Contact number changed" },
    { step: "Rider contact updated", system: "Logistics", detail: "Rider receives new contact for delivery" },
    { step: "Audit Log created", system: "Audit", detail: "Phone Change · Changed By · Timestamp" },
  ],
};

const systemColors: Record<string, string> = {
  CRM: "#F5B300", Kitchen: "#E85D04", Packaging: "#3B82F6",
  Dispatch: "#8B5CF6", Logistics: "#06B6D4", Audit: "#22C55E",
};

export default function Support({ demoMode }: { demoMode?: boolean } = {}) {
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<typeof customers[0] | null>(demoMode ? customers[0] : null);
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [propagating, setPropagating] = useState(false);
  const [propagationDone, setPropagationDone] = useState(false);

  const searchResult = search.length > 1
    ? customers.filter(c =>
        `${c.name} ${c.email} ${c.phone}`.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  const getCustomerOrders = (name: string) => orders.filter(o => o.customer === name);
  const getCustomerSubs = (id: string) => subscriptions.filter(s => s.customerId === id);

  const openTickets = tickets.filter(t => t.status === "Open").length;
  const inProgress = tickets.filter(t => t.status === "In Progress").length;

  return (
    <div className="p-6 space-y-5">
      <h2 className="text-xl font-extrabold">Customer Support</h2>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Open Tickets", value: String(openTickets), sub: "need attention", accent: "#EF4444" },
          { label: "In Progress", value: String(inProgress), sub: "being handled", accent: "#F5B300" },
          { label: "Resolved Today", value: "2", sub: "closed tickets", accent: "#22C55E" },
          { label: "Avg Response Time", value: "18m", sub: "today", accent: undefined },
        ].map(k => (
          <div key={k.label} className="border border-[var(--pm-border)] bg-[var(--pm-surface)] p-4">
            <div className="text-xs font-bold text-[var(--pm-text)] uppercase tracking-widest mb-2">{k.label}</div>
            <div className="text-3xl font-extrabold mono" style={{ color: k.accent ?? "var(--pm-text-secondary)" }}>{k.value}</div>
            <div className="text-xs text-[var(--pm-text-muted)] mt-1 mono">{k.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Customer search */}
        <div className="space-y-3">
          <div className="text-sm font-semibold tracking-wide">Customer Lookup</div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name, email, or phone…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-[var(--pm-surface)] border border-[var(--pm-border)] text-[var(--pm-text-secondary)] text-sm px-3 py-3 focus:outline-none focus:border-[#F5B300] placeholder:text-[var(--pm-text-muted)]"
            />
          </div>

          {searchResult.length > 0 && (
            <div className="border border-[var(--pm-border)] bg-[var(--pm-surface)] divide-y divide-[#1F1F1F]">
              {searchResult.map(c => (
                <div
                  key={c.id}
                  className="px-4 py-3 cursor-pointer hover:bg-[var(--pm-surface-subtle)] transition-colors"
                  onClick={() => { setSelectedCustomer(c); setSearch(""); setActiveAction(null); }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-sm">{c.name}</div>
                      <div className="text-xs text-[var(--pm-text-muted)] mono">{c.email} · {c.phone}</div>
                    </div>
                    <StatusBadge status={c.status} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedCustomer && (
            <div className="border border-[var(--pm-border)] bg-[var(--pm-surface)] space-y-0">
              {/* Customer header */}
              <div className="px-4 py-4 border-b border-[var(--pm-border)]">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-extrabold text-base">{selectedCustomer.name}</div>
                    <div className="text-xs text-[var(--pm-text-muted)] mono mt-0.5">{selectedCustomer.id} · {selectedCustomer.email}</div>
                  </div>
                  <StatusBadge status={selectedCustomer.status} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3">
                  {[
                    { label: "LTV", value: `$${selectedCustomer.ltv.toFixed(0)}`, color: "#F5B300" },
                    { label: "Wallet", value: `$${selectedCustomer.walletBalance.toFixed(2)}`, color: "var(--pm-text-secondary)" },
                    { label: "Points", value: String(selectedCustomer.points), color: "var(--pm-text-secondary)" },
                  ].map(s => (
                    <div key={s.label} className="border border-[var(--pm-border)] p-2 text-center">
                      <div className="text-xs text-[var(--pm-text-muted)]">{s.label}</div>
                      <div className="font-bold mono text-sm" style={{ color: s.color }}>{s.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick info */}
              <div className="px-4 py-3 border-b border-[var(--pm-border)] text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-[var(--pm-text-muted)]">Plan</span>
                  <span className="font-medium">{selectedCustomer.planType}{selectedCustomer.goal ? ` · ${selectedCustomer.goal}` : ""}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--pm-text-muted)]">Address</span>
                  <span className="text-right max-w-[200px] truncate">{selectedCustomer.address}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--pm-text-muted)]">Next Billing</span>
                  <span className="mono">{selectedCustomer.nextBilling}</span>
                </div>
              </div>

              {/* Recent orders */}
              <div className="px-4 py-3 border-b border-[var(--pm-border)]">
                <div className="text-xs font-bold text-[var(--pm-text)] uppercase tracking-wider mb-2">Recent Orders</div>
                {getCustomerOrders(selectedCustomer.name).slice(0, 2).map(o => (
                  <div key={o.id} className="flex justify-between text-xs py-1.5 border-b border-[var(--pm-border-soft)]">
                    <span className="mono text-[var(--pm-accent-text)]">{o.id}</span>
                    <span className="text-[var(--pm-text-muted)]">{o.meals} meals · ${o.total.toFixed(2)}</span>
                    <StatusBadge status={o.status} />
                  </div>
                ))}
              </div>

              {/* RS/MP customer type indicator */}
              {(() => {
                const hasSub = getCustomerSubs(selectedCustomer.id).length > 0;
                const isMP = hasSub || selectedCustomer.planType === "Meal Plan";
                return (
                  <div className={`px-4 py-2 border-b border-[var(--pm-border)] flex items-center gap-2`}>
                    <div className={`w-1.5 h-1.5 ${isMP ? "bg-[#F5B300]" : "bg-[#E85D04]"}`} />
                    <span className="text-xs font-extrabold mono tracking-widest" style={{ color: isMP ? "#F5B300" : "#E85D04" }}>
                      {isMP ? "MEAL PLAN CUSTOMER" : "READY SERIES CUSTOMER"}
                    </span>
                    <span className="text-xs text-[var(--pm-text-muted)] ml-1">{isMP ? "Subscription-based" : "Order-based"}</span>
                  </div>
                );
              })()}

              {/* Actions */}
              <div className="px-4 py-3">
                <div className="text-xs font-bold text-[var(--pm-text)] uppercase tracking-wider mb-2">Support Actions</div>
                {/* Shared actions */}
                <div className="text-[10px] text-[var(--pm-text-muted)] uppercase tracking-wider mb-1.5 mono">Common</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
                  {["Update Name", "Update Phone", "Update Address", "Reset Password", "View Order", "Add Note"].map(action => (
                    <button key={action} onClick={() => setActiveAction(action)}
                      className="text-xs py-2 px-2 font-medium mono border border-[var(--pm-border)] text-[var(--pm-text-muted)] hover:border-[#F5B300] hover:text-[var(--pm-accent-text)] transition-colors">
                      {action}
                    </button>
                  ))}
                </div>
                {/* MP-specific */}
                {(getCustomerSubs(selectedCustomer.id).length > 0 || selectedCustomer.planType === "Meal Plan") && (
                  <>
                    <div className="text-[10px] text-[var(--pm-accent-text)] uppercase tracking-wider mb-1.5 mono">Meal Plan Only</div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
                      {["Pause Plan", "Resume Plan", "Meal Swap", "Billing Inquiry"].map(action => (
                        <button key={action} onClick={() => setActiveAction(action)}
                          className="text-xs py-2 px-2 font-medium mono border border-[#F5B300]/40 text-[var(--pm-accent-text)] hover:bg-[#F5B300]/10 transition-colors">
                          {action}
                        </button>
                      ))}
                    </div>
                  </>
                )}
                {/* RS-specific */}
                {selectedCustomer.planType !== "Meal Plan" && (
                  <>
                    <div className="text-[10px] text-[var(--pm-secondary-text)] uppercase tracking-wider mb-1.5 mono">Ready Series Only</div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
                      {["Order Issue", "Bundle Issue", "Delivery Issue", "Refund Request"].map(action => (
                        <button key={action} onClick={() => setActiveAction(action)}
                          className="text-xs py-2 px-2 font-medium mono border border-[#E85D04]/40 text-[var(--pm-secondary-text)] hover:bg-[#E85D04]/10 transition-colors">
                          {action}
                        </button>
                      ))}
                    </div>
                  </>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {["Swap Meals", "Add Credit", "Escalate"].map(action => (
                    <button
                      key={action}
                      onClick={() => setActiveAction(action)}
                      className="text-xs py-2 px-2 font-medium mono border border-[var(--pm-border)] text-[var(--pm-text-secondary)] hover:border-[#F5B300] hover:text-[var(--pm-accent-text)] transition-colors"
                    >
                      {action}
                    </button>
                  ))}
                </div>
                {activeAction && (
                  <div className="mt-2 space-y-2">
                    <div className="border border-[#F5B300]/30 bg-[#F5B300]/5 px-3 py-2.5">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-xs font-bold mono text-[var(--pm-accent-text)]">Action: {activeAction}</div>
                        <button onClick={() => { setActiveAction(null); setPropagating(false); setPropagationDone(false); }}
                          className="text-xs text-[var(--pm-text-muted)] hover:text-[var(--pm-text-muted)]">✕</button>
                      </div>
                      {!propagating && !propagationDone && (
                        <div className="space-y-2">
                          {activeAction === "Meal Swap" && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {["Current Meal", "New Meal"].map(label => (
                                <div key={label}>
                                  <div className="text-[10px] text-[var(--pm-text-muted)] uppercase tracking-wider mb-1">{label}</div>
                                  <select className="w-full bg-[var(--pm-bg)] border border-[var(--pm-border)] text-[var(--pm-text-secondary)] text-xs px-2 py-1.5 focus:outline-none focus:border-[#F5B300]">
                                    <option>Grilled Chicken & Rice (CUT)</option>
                                    <option>Salmon Teriyaki & Quinoa (BUILD)</option>
                                    <option>Sweet Potato & Chicken (MAINTAIN)</option>
                                    <option>Lean Beef & Broccoli (CUT)</option>
                                  </select>
                                </div>
                              ))}
                            </div>
                          )}
                          {(activeAction === "Update Address") && (
                            <input type="text" defaultValue={selectedCustomer?.address} placeholder="New delivery address…"
                              className="w-full bg-[var(--pm-bg)] border border-[var(--pm-border)] text-[var(--pm-text-secondary)] text-xs px-2 py-1.5 focus:outline-none focus:border-[#F5B300]" />
                          )}
                          {(activeAction === "Pause Plan") && (
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-[var(--pm-text-muted)]">Duration (full weeks only):</span>
                              <select className="bg-[var(--pm-bg)] border border-[var(--pm-border)] text-[var(--pm-text-secondary)] text-xs px-2 py-1 focus:outline-none focus:border-[#F5B300]">
                                {[1, 2, 3, 4].map(w => <option key={w} value={w}>{w} week{w > 1 ? "s" : ""}</option>)}
                              </select>
                            </div>
                          )}
                          {propagationSteps[activeAction] && (
                            <div>
                              <div className="text-[10px] text-[var(--pm-text-muted)] uppercase tracking-wider mb-1.5 mt-2">Downstream Impact Preview</div>
                              <div className="space-y-1">
                                {propagationSteps[activeAction].map((s, i) => (
                                  <div key={i} className="flex items-start gap-2 text-[10px]">
                                    <span className="text-[var(--pm-text-muted)] mono shrink-0">{i + 1}.</span>
                                    <span className="font-bold shrink-0" style={{ color: systemColors[s.system] ?? "#888" }}>{s.step}</span>
                                    <span className="text-[var(--pm-text-muted)]">— {s.detail}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={() => { setPropagating(true); setTimeout(() => setPropagationDone(true), 1200); }}
                              className="flex-1 bg-[#F5B300] text-black py-1.5 text-xs font-bold mono hover:bg-[#C99200] transition-colors">
                              Apply Change
                            </button>
                            <button onClick={() => { setActiveAction(null); setPropagating(false); setPropagationDone(false); }}
                              className="border border-[var(--pm-border)] text-[var(--pm-text-muted)] py-1.5 px-3 text-xs mono hover:text-[var(--pm-text-secondary)] transition-colors">
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}

                      {propagating && !propagationDone && (
                        <div className="space-y-1 py-1">
                          <div className="text-xs text-[var(--pm-accent-text)] mono animate-pulse">Propagating changes…</div>
                          {propagationSteps[activeAction]?.map((s, i) => (
                            <div key={i} className="flex items-center gap-2 text-[10px] text-[var(--pm-text-muted)]">
                              <span className="w-3 h-3 border border-[var(--pm-border-strong)] animate-spin" />
                              <span>{s.step}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {propagationDone && (
                        <div className="space-y-1.5">
                          <div className="text-xs font-bold text-green-400 mono">✓ Change applied successfully</div>
                          {propagationSteps[activeAction]?.map((s, i) => (
                            <div key={i} className="flex items-center gap-2 text-[10px]">
                              <span className="text-green-400 font-bold shrink-0">✓</span>
                              <span className="font-bold shrink-0" style={{ color: systemColors[s.system] ?? "#888" }}>{s.step}</span>
                              <span className="text-[var(--pm-text-muted)]">— {s.detail}</span>
                            </div>
                          ))}
                          <div className="text-[10px] text-[var(--pm-text-muted)] mono mt-1 border border-[var(--pm-border)] bg-[var(--pm-bg)] px-2 py-1.5">
                            ⊟ Audit entry created · {new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })} · {activeAction} · {selectedCustomer?.name}
                          </div>
                          <button onClick={() => { setActiveAction(null); setPropagating(false); setPropagationDone(false); }}
                            className="text-xs text-[var(--pm-text-muted)] mono hover:text-[var(--pm-text-secondary)] underline mt-1">
                            Close
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Support tickets */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold tracking-wide">Support Queue</div>
            <button className="bg-[#F5B300] text-black text-xs font-bold px-3 py-1.5 mono hover:bg-[#C99200] transition-colors">
              + New Ticket
            </button>
          </div>
          <div className="border border-[var(--pm-border)] bg-[var(--pm-surface)] divide-y divide-[#1F1F1F]">
            {tickets.map(t => (
              <div key={t.id} className="px-4 py-3 hover:bg-[var(--pm-surface-subtle)] transition-colors cursor-pointer">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs mono text-[var(--pm-accent-text)] font-bold">{t.id}</span>
                      <span className={`text-xs mono px-1.5 py-0.5 font-bold ${priorityColor[t.priority]}`}>{t.priority}</span>
                      <span className={`text-xs mono px-1.5 py-0.5 font-bold ${ticketStatusColor[t.status]}`}>{t.status}</span>
                    </div>
                    <div className="font-medium text-sm">{t.customer}</div>
                    <div className="text-xs text-[var(--pm-text-muted)] mt-0.5">{t.issue}</div>
                    <div className="text-xs text-[var(--pm-text-muted)] mono mt-1">{t.created} · {t.assigned}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
