import { useState } from "react";
import StatusBadge from "../components/StatusBadge";
import { customers } from "../data";
import { giftCardRules, walletRules } from "../catalog";

const tiers = walletRules.redemptionTiers.map((tier, index) => ({
  points: tier.points,
  value: tier.credit,
  bonus: index === 1 ? "+10% bonus" : index === 2 ? "+25% bonus" : null,
  label: index === 0 ? "Standard" : index === 1 ? "Bonus" : "Best Value",
}));

const earnRates = [
  { type: "Meal Plan", rate: "1.5× points", note: "automatic plan multiplier" },
  { type: "Ready Series", rate: "Tier rate", note: "1× / 1.5× / 2× per $ spent" },
  { type: "Referral", rate: `${walletRules.referralPoints} pts`, note: "after the first completed order" },
  { type: "Points validity", rate: "90 days", note: "place an order to remain active" },
];

interface TxRecord {
  id: string;
  amount: number;
  description: string;
  status: string;
  date: string;
}

interface DescEdit {
  txId: string;
  previousDesc: string;
  newDesc: string;
  changedBy: string;
  timestamp: string;
}

const txData: TxRecord[] = [
  { id: "TXN-8821", amount: 210.00, description: "Week 38 Meal Plan — Marcus Tan", status: "Payment Successful", date: "16 Sep 2024" },
  { id: "TXN-8820", amount: 126.00, description: "Week 38 Meal Plan — Priya Nair", status: "Payment Successful", date: "16 Sep 2024" },
  { id: "TXN-8819", amount: 42.00, description: "Wallet top-up — Aisha Rahman", status: "Payment Successful", date: "15 Sep 2024" },
  { id: "TXN-8818", amount: -89.50, description: "Refund REF-058 — Serene Tay", status: "Credit Applied", date: "13 Sep 2024" },
  { id: "TXN-8817", amount: 168.00, description: "Week 37 Meal Plan — Bryan Low", status: "Payment Successful", date: "09 Sep 2024" },
];

const statusColor: Record<string, string> = {
  "Payment Successful": "text-green-400",
  "Credit Applied": "text-green-400",
  "Payment Failed": "text-red-400",
  "Payment Pending": "text-yellow-400",
  "Credit Not Applied": "text-[var(--pm-text-muted)]",
};

export default function Wallet() {
  const [creditCustomer, setCreditCustomer] = useState("");
  const [creditAmount, setCreditAmount] = useState("");
  const [creditType, setCreditType] = useState<"credit" | "points">("credit");
  const [creditNote, setCreditNote] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [editingTx, setEditingTx] = useState<string | null>(null);
  const [editDesc, setEditDesc] = useState("");
  const [descHistory, setDescHistory] = useState<DescEdit[]>([]);
  const [txDescriptions, setTxDescriptions] = useState<Record<string, string>>(
    Object.fromEntries(txData.map(t => [t.id, t.description]))
  );

  const topBalances = customers.filter(c => c.walletBalance > 0 || c.points > 0)
    .sort((a, b) => b.points - a.points);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setCreditCustomer(""); setCreditAmount(""); setCreditNote("");
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-extrabold">Wallet & Rewards</h2>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="border border-[var(--pm-border)] bg-[var(--pm-surface)] p-4">
          <div className="text-xs font-bold uppercase tracking-wider text-[var(--pm-text)]">Customer Wallet Top-Ups</div>
          <div className="mt-2 text-sm text-[var(--pm-text-secondary)]">
            Presets: {walletRules.presets.map(amount => `$${amount}`).join(" · ")}
          </div>
          <div className="mt-1 text-xs text-[var(--pm-text-muted)] mono">
            Custom amount ${walletRules.customMinimum}–${walletRules.customMaximum} · Card payment · Available immediately after confirmation
          </div>
          <div className="mt-2 text-xs text-[var(--pm-text-muted)]">
            Loyalty: Starter 0–499 pts · Gold 500–1,999 pts · Platinum 2,000+ pts
          </div>
        </div>
        <div className="border border-[var(--pm-border)] bg-[var(--pm-surface)] p-4">
          <div className="text-xs font-bold uppercase tracking-wider text-[var(--pm-text)]">Performance Gift Cards</div>
          <div className="mt-2 text-sm text-[var(--pm-text-secondary)]">
            Values: {giftCardRules.denominations.map(amount => `$${amount}`).join(" · ")}
          </div>
          <div className="mt-1 text-xs text-[var(--pm-text-muted)] mono">
            Never expires · All purchases · Physical card +${giftCardRules.physicalCardFee} · Non-refundable
          </div>
        </div>
      </div>

      {/* Payment Integrity Section */}
      <div className="border border-[var(--pm-border)] bg-[var(--pm-surface)]">
        <div className="px-4 py-3 border-b border-[var(--pm-border)]">
          <span className="text-xs font-bold text-[var(--pm-text)] uppercase tracking-wider">Payment Integrity</span>
        </div>
        <div className="p-4 space-y-4">
          {/* Required Flow */}
          <div>
            <div className="text-xs font-bold text-green-400 uppercase tracking-wider mb-2">Required Flow</div>
            <div className="flex flex-wrap items-center gap-1">
              {["Real Payment", "Payment Provider Confirmation", "Successful Payment Event", "Credit Transaction", "Customer Balance Update"].map((step, i, arr) => (
                <div key={step} className="flex items-center gap-1">
                  <div className="bg-green-950/40 border border-green-800/50 text-green-300 text-xs mono px-2.5 py-1.5 font-semibold">{step}</div>
                  {i < arr.length - 1 && <span className="text-green-600 font-bold text-sm">→</span>}
                </div>
              ))}
            </div>
          </div>
          {/* Never path */}
          <div>
            <div className="text-xs font-bold text-red-400 uppercase tracking-wider mb-2">Never</div>
            <div className="flex items-center gap-1 opacity-70">
              {["Renewal Event", "Credit Added (without payment confirmation)"].map((step, i, arr) => (
                <div key={step} className="flex items-center gap-1">
                  <div className="bg-red-950/40 border border-red-800/50 text-red-400 text-xs mono px-2.5 py-1.5 line-through">{step}</div>
                  {i < arr.length - 1 && <span className="text-red-600 font-bold text-sm">→</span>}
                </div>
              ))}
            </div>
          </div>
          {/* Warning */}
          <div className="border border-red-800/40 bg-red-950/10 px-3 py-2">
            <span className="text-xs font-bold text-red-300">Credit must NOT be granted unless payment is confirmed by the payment provider.</span>
          </div>
          {/* Legend */}
          <div className="flex flex-wrap gap-3">
            {[
              { label: "Payment Pending", color: "bg-yellow-500" },
              { label: "Payment Successful", color: "bg-green-500" },
              { label: "Payment Failed", color: "bg-red-500" },
              { label: "Credit Applied", color: "bg-green-500" },
              { label: "Credit Not Applied", color: "bg-[var(--pm-text-muted)]" },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${s.color} flex-shrink-0`} />
                <span className="text-xs text-[var(--pm-text-muted)] mono">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Voucher tiers */}
        <div className="col-span-2 border border-[var(--pm-border)] bg-[var(--pm-surface)]">
          <div className="px-4 py-3 border-b border-[var(--pm-border)]">
            <span className="text-sm font-semibold tracking-wide">Voucher Redemption Tiers</span>
          </div>
          <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {tiers.map(t => (
              <div key={t.points} className="border border-[var(--pm-border)] p-4 hover:border-[#F5B300]/40 transition-colors">
                <div className="text-xs font-bold text-[var(--pm-text)] uppercase tracking-wider mb-1">{t.label}</div>
                <div className="text-2xl font-extrabold mono text-[var(--pm-accent-text)]">${t.value}</div>
                <div className="text-xs text-[var(--pm-text-muted)] mono mt-1">{t.points.toLocaleString()} points</div>
                {t.bonus && <div className="text-xs text-[var(--pm-secondary-text)] mono mt-1 font-bold">{t.bonus}</div>}
              </div>
            ))}
          </div>
          <div className="px-4 pb-4">
            <div className="text-xs font-bold text-[var(--pm-text)] uppercase tracking-wider mb-2">Earn Rates</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {earnRates.map(r => (
                <div key={r.type} className="border border-[var(--pm-border)] px-3 py-2 flex justify-between items-center">
                  <span className="text-sm">{r.type}</span>
                  <div className="text-right">
                    <span className="mono text-[var(--pm-accent-text)] font-bold text-sm">{r.rate}</span>
                    <span className="text-xs text-[var(--pm-text-muted)] mono block">{r.note}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Manual adjustment */}
        <div className="border border-[#E85D04]/40 bg-[var(--pm-surface)]">
          <div className="px-4 py-3 border-b border-[var(--pm-border)] flex items-center justify-between">
            <span className="text-sm font-semibold tracking-wide">Manual Admin Adjustment</span>
            <span className="text-xs mono font-bold text-[var(--pm-secondary-text)] bg-[#E85D04]/10 border border-[#E85D04]/30 px-2 py-0.5">NOT PAYMENT-BACKED</span>
          </div>
          <div className="px-4 py-2.5 border-b bg-[var(--pm-warning-bg)]" style={{ borderColor: "var(--pm-warning-border)" }}>
            <div className="text-xs mono font-bold mb-0.5" style={{ color: "var(--pm-warning-text)" }}>Manual Adjustment — Not a Payment Record</div>
            <div className="text-xs" style={{ color: "var(--pm-warning-body)" }}>This is an admin-initiated credit or points adjustment. It does <strong>not</strong> represent a payment confirmation and must not be treated as payment-backed credit. A confirmed payment through Shopify is required for payment-backed credit.</div>
          </div>
          <form onSubmit={handleSubmit} className="p-4 space-y-3">
            <div>
              <label className="text-xs font-bold text-[var(--pm-text)] uppercase tracking-wider block mb-1">Customer</label>
              <select
                value={creditCustomer}
                onChange={e => setCreditCustomer(e.target.value)}
                className="w-full bg-[var(--pm-bg)] border border-[var(--pm-border)] text-[var(--pm-text-secondary)] text-sm px-3 py-2 focus:outline-none focus:border-[#F5B300]"
                required
              >
                <option value="">Select customer…</option>
                {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-[var(--pm-text)] uppercase tracking-wider block mb-1">Type</label>
              <div className="flex gap-2">
                {(["credit", "points"] as const).map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setCreditType(t)}
                    className={`flex-1 py-2 text-xs font-bold mono transition-colors ${
                      creditType === t
                        ? "bg-[#F5B300] text-black"
                        : "border border-[var(--pm-border)] text-[var(--pm-text-muted)] hover:border-[#F5B300]"
                    }`}
                  >
                    {t === "credit" ? "$ Credit" : "Points"}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-[var(--pm-text)] uppercase tracking-wider block mb-1">
                Amount {creditType === "credit" ? "(SGD)" : "(pts)"}
              </label>
              <input
                type="number"
                value={creditAmount}
                onChange={e => setCreditAmount(e.target.value)}
                placeholder={creditType === "credit" ? "0.00" : "0"}
                className="w-full bg-[var(--pm-bg)] border border-[var(--pm-border)] text-[var(--pm-text-secondary)] text-sm px-3 py-2 mono focus:outline-none focus:border-[#F5B300] placeholder:text-[var(--pm-text-muted)]"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[var(--pm-text)] uppercase tracking-wider block mb-1">Reason <span className="text-red-400">*</span></label>
              <input
                type="text"
                value={creditNote}
                onChange={e => setCreditNote(e.target.value)}
                placeholder="Required — state reason for this manual adjustment…"
                className="w-full bg-[var(--pm-bg)] border border-[var(--pm-border)] text-[var(--pm-text-secondary)] text-sm px-3 py-2 focus:outline-none focus:border-[#F5B300] placeholder:text-[var(--pm-text-muted)]"
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mono">
              <div>
                <div className="text-[var(--pm-text-muted)] mb-0.5">Admin Identity</div>
                <div className="text-[var(--pm-text-secondary)] font-bold">Jerome Lim</div>
                <div className="text-[var(--pm-text-muted)]">Super Admin · PM-EMP-001</div>
              </div>
              <div>
                <div className="text-[var(--pm-text-muted)] mb-0.5">Adjustment Type</div>
                <div className="text-[var(--pm-secondary-text)] font-bold">Manual Admin</div>
                <div className="text-[var(--pm-text-muted)]">Audit event will be logged</div>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-[#F5B300] text-black py-2 text-sm font-bold hover:bg-[#C99200] transition-colors mono"
            >
              Apply Adjustment
            </button>
            {submitted && (
              <div className="text-xs text-green-400 mono text-center">Adjustment applied successfully</div>
            )}
          </form>
        </div>
      </div>

      {/* Top balances */}
      <div className="border border-[var(--pm-border)] bg-[var(--pm-surface)]">
        <div className="px-4 py-3 border-b border-[var(--pm-border)]">
          <span className="text-sm font-semibold tracking-wide">Top Wallet Balances</span>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--pm-border)]">
              {["Customer", "Status", "Wallet Balance", "Points", "Tier Eligibility"].map(h => (
                <th key={h} className="px-4 py-2 text-left text-xs font-bold text-[var(--pm-text)] uppercase tracking-wider font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {topBalances.map((c, i) => {
              const tier = c.points >= 2000 ? "Platinum" : c.points >= 500 ? "Gold" : "Starter";
              const tierColor = tier === "Platinum" ? "text-slate-300" : tier === "Gold" ? "text-[var(--pm-accent-text)]" : "text-[var(--pm-text-muted)]";
              return (
                <tr key={c.id} className={`border-b border-[var(--pm-border)] hover:bg-[var(--pm-surface-subtle)] ${i % 2 === 0 ? "" : "bg-[var(--pm-surface-subtle)]"}`}>
                  <td className="px-4 py-2.5 font-medium">{c.name}</td>
                  <td className="px-4 py-2.5"><StatusBadge status={c.status} /></td>
                  <td className="px-4 py-2.5 mono font-bold text-[var(--pm-accent-text)]">${c.walletBalance.toFixed(2)}</td>
                  <td className="px-4 py-2.5 mono">{c.points.toLocaleString()}</td>
                  <td className={`px-4 py-2.5 mono font-bold text-sm ${tierColor}`}>{tier}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* Transaction Description Editor */}
      <div className="border border-[var(--pm-border)] bg-[var(--pm-surface)]">
        <div className="px-4 py-3 border-b border-[var(--pm-border)]">
          <span className="text-xs font-bold text-[var(--pm-text)] uppercase tracking-wider">Transaction Description Editor</span>
        </div>
        <div className="p-4 space-y-3">
          <div className="border border-yellow-800/30 bg-yellow-950/10 px-3 py-2 text-xs text-yellow-300 mono">
            ⚠ Description edits do NOT modify: transaction amount, payment status, payment provider transaction ID, or the original financial record.
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--pm-border)]">
                  {["TX ID", "Amount", "Current Description", "Status", "Date", ""].map(h => (
                    <th key={h} className="px-3 py-2 text-left text-xs text-[var(--pm-text-muted)] uppercase tracking-wider font-medium whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {txData.map((tx, i) => (
                  <tr key={tx.id} className={`border-b border-[var(--pm-border)] ${i % 2 === 0 ? "" : "bg-[var(--pm-surface-subtle)]"}`}>
                    <td className="px-3 py-2.5 mono text-xs text-[var(--pm-accent-text)]">{tx.id}</td>
                    <td className={`px-3 py-2.5 mono text-xs font-bold ${tx.amount < 0 ? "text-red-400" : "text-[var(--pm-text-secondary)]"}`}>
                      {tx.amount < 0 ? `-$${Math.abs(tx.amount).toFixed(2)}` : `$${tx.amount.toFixed(2)}`}
                    </td>
                    <td className="px-3 py-2.5 text-xs text-[var(--pm-text-secondary)] max-w-[200px]">
                      {editingTx === tx.id ? (
                        <div className="space-y-2">
                          <div className="text-xs text-[var(--pm-text-muted)] mono">Previous: {txDescriptions[tx.id]}</div>
                          <textarea
                            rows={2}
                            value={editDesc}
                            onChange={e => setEditDesc(e.target.value)}
                            className="w-full bg-[var(--pm-bg)] border border-[#F5B300]/40 text-[var(--pm-text-secondary)] text-xs px-2 py-1.5 mono outline-none resize-none"
                            autoFocus
                          />
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => {
                                if (!editDesc.trim()) return;
                                const now = new Date().toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
                                setDescHistory(prev => [{ txId: tx.id, previousDesc: txDescriptions[tx.id], newDesc: editDesc.trim(), changedBy: "Jerome Lim", timestamp: now }, ...prev]);
                                setTxDescriptions(prev => ({ ...prev, [tx.id]: editDesc.trim() }));
                                setEditingTx(null);
                                setEditDesc("");
                              }}
                              className="bg-[#F5B300] text-black text-xs font-bold px-3 py-1 mono hover:bg-[#C99200] transition-colors"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => { setEditingTx(null); setEditDesc(""); }}
                              className="border border-[var(--pm-border-strong)] text-[var(--pm-text-muted)] text-xs px-3 py-1 mono hover:border-[#F5B300] hover:text-[var(--pm-accent-text)] transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        txDescriptions[tx.id]
                      )}
                    </td>
                    <td className={`px-3 py-2.5 text-xs mono font-semibold ${statusColor[tx.status] ?? "text-[var(--pm-text-muted)]"}`}>{tx.status}</td>
                    <td className="px-3 py-2.5 mono text-xs text-[var(--pm-text-muted)]">{tx.date}</td>
                    <td className="px-3 py-2.5">
                      {editingTx !== tx.id && (
                        <button
                          onClick={() => { setEditingTx(tx.id); setEditDesc(txDescriptions[tx.id]); }}
                          className="border border-[var(--pm-border-strong)] text-[var(--pm-text-secondary)] text-xs px-3 py-1.5 mono hover:border-[#F5B300] hover:text-[var(--pm-accent-text)] transition-colors whitespace-nowrap"
                        >
                          Edit Description
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Edit history log */}
          {descHistory.length > 0 && (
            <div className="border border-[var(--pm-border)] bg-[var(--pm-bg)] p-3 space-y-2">
              <div className="text-xs font-bold text-[var(--pm-text)] uppercase tracking-wider mb-1">Edit History</div>
              {descHistory.map((entry, i) => (
                <div key={i} className="text-xs text-[var(--pm-text-muted)] mono border-b border-[var(--pm-border-soft)] pb-1.5 last:border-0 last:pb-0">
                  <span className="text-[var(--pm-accent-text)]">{entry.txId}</span> — Changed by{" "}
                  <span className="text-[var(--pm-text-secondary)]">{entry.changedBy}</span> · {entry.timestamp}
                  <div className="mt-0.5 text-[var(--pm-text-muted)]">"{entry.previousDesc}" → "<span className="text-[var(--pm-text-muted)]">{entry.newDesc}</span>"</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
