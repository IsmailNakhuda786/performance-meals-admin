import { useState } from "react";
import type { BusinessStream } from "../App";
import { otherSales } from "../data";
import { downloadCSV, downloadExcel, printHtml, nowStr, nowTime } from "../utils/flowUtils";

const mpTransactions = [
  { id: "TXN-3201", date: "14 Sep 2024", customer: "Marcus Tan", type: "Subscription Billing", amount: 168.00, method: "Card (via Shopify)", status: "Paid" },
  { id: "TXN-3202", date: "14 Sep 2024", customer: "Priya Nair", type: "Subscription Billing", amount: 168.00, method: "Card (via Shopify)", status: "Paid" },
  { id: "TXN-3203", date: "14 Sep 2024", customer: "Aisha Rahman", type: "Subscription Renewal", amount: 168.00, method: "Card (via Shopify)", status: "Pending" },
  { id: "TXN-3204", date: "13 Sep 2024", customer: "Natalie Foo", type: "Subscription Billing", amount: 168.00, method: "GrabPay", status: "Paid" },
  { id: "TXN-3205", date: "13 Sep 2024", customer: "Bryan Low", type: "Renewal Attempt", amount: 168.00, method: "Card (via Shopify)", status: "Failed" },
  { id: "TXN-3206", date: "12 Sep 2024", customer: "Serene Tay", type: "Refund", amount: -89.50, method: "Card (via Shopify)", status: "Refunded" },
];

const rsTransactions = [
  { id: "TXN-4101", date: "14 Sep 2024", customer: "Wei Jie Lim", type: "Signature 5 — Non-Beef", amount: 48.99, method: "Card (via Shopify)", status: "Paid" },
  { id: "TXN-4102", date: "14 Sep 2024", customer: "Jade Koh", type: "JPSUB01 · 6 Months", amount: 480.50, method: "PayNow", status: "Paid" },
  { id: "TXN-4103", date: "14 Sep 2024", customer: "Darren Ong", type: "Ready Series A-la-carte", amount: 38.70, method: "Card (via Shopify)", status: "Paid" },
  { id: "TXN-4104", date: "14 Sep 2024", customer: "Jason Yeo", type: "LCMIXSUB01 · 3 Months", amount: 354.56, method: "GrabPay", status: "Pending" },
  { id: "TXN-4105", date: "13 Sep 2024", customer: "Serene Tay", type: "Ready Series A-la-carte", amount: 26.00, method: "Card (via Shopify)", status: "Refunded" },
];

const otherTransactions = otherSales.map(sale => ({
  id: sale.id,
  date: sale.date,
  customer: sale.customer,
  type: sale.type,
  amount: sale.amount,
  method: sale.method,
  status: sale.status,
}));

const statusStyle: Record<string, string> = {
  Paid: "bg-green-950 text-green-400",
  Pending: "bg-yellow-950 text-yellow-400",
  Failed: "bg-red-950 text-red-400",
  Refunded: "bg-[var(--pm-surface-muted)] text-[var(--pm-text-muted)]",
};

type Txn = typeof mpTransactions[0];

interface ShopifyModal {
  txn: Txn;
  reason: string;
  confirmed: boolean;
}

export default function Finance({ stream }: { stream: BusinessStream }) {
  const [tab, setTab] = useState<"transactions" | "failed" | "refunds">("transactions");
  const [retryModal, setRetryModal] = useState<ShopifyModal | null>(null);
  const [refundModal, setRefundModal] = useState<ShopifyModal | null>(null);

  const isMp = stream === "meal-plans";
  const isRs = stream === "ready-series";
  const streamLabel = isMp ? "Meal Plans" : isRs ? "Ready Series" : "Other Sales";
  const accent = isMp ? "#F5B300" : isRs ? "#E85D04" : "var(--pm-text-secondary)";
  const txns = isMp ? mpTransactions : isRs ? rsTransactions : otherTransactions;

  const totalRevenue = txns.filter(t => t.status === "Paid").reduce((a, t) => a + t.amount, 0);
  const totalPending = txns.filter(t => t.status === "Pending").reduce((a, t) => a + t.amount, 0);
  const totalFailed = txns.filter(t => t.status === "Failed").length;
  const totalRefunded = txns.filter(t => t.status === "Refunded").reduce((a, t) => a + Math.abs(t.amount), 0);

  const exportRows = txns.map(t => ({
    id: t.id,
    customer: t.customer,
    amount: t.amount,
    date: t.date,
    status: t.status,
    method: t.method,
  }));

  const handleExport = (type: string) => {
    const label = isMp ? "MealPlans" : isRs ? "ReadySeries" : "OtherSales";
    if (type === "CSV") {
      downloadCSV(`Finance_${label}_${nowStr()}.csv`, exportRows);
    } else if (type === "Excel") {
      downloadExcel(`Finance_${label}_${nowStr()}.xls`, exportRows);
    } else if (type === "PDF") {
      const rows = txns.map(t => `
        <tr>
          <td>${t.id}</td>
          <td>${t.date}</td>
          <td>${t.customer}</td>
          <td>${t.type}</td>
          <td>${t.amount < 0 ? `-$${Math.abs(t.amount).toFixed(2)}` : `$${t.amount.toFixed(2)}`}</td>
          <td>${t.method}</td>
          <td>${t.status}</td>
        </tr>`).join("");
      printHtml("Finance Export — Performance Meals", `
        <div class="badge">Finance Export</div>
        <h1>Finance & Billing — ${streamLabel}</h1>
        <div class="meta">Exported ${nowStr()} at ${nowTime()}</div>
        <table>
          <thead><tr><th>ID</th><th>Date</th><th>Customer</th><th>Type</th><th>Amount</th><th>Method</th><th>Status</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
        <div class="footer">Performance Meals · Finance Portal · Generated ${nowStr()} ${nowTime()}</div>
      `);
    }
  };

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold">Finance & Billing — {streamLabel}</h2>
        <div className="flex gap-2">
          <button onClick={() => handleExport("CSV")} className="border border-[var(--pm-border-strong)] text-[var(--pm-text-secondary)] text-xs px-3 py-2 mono hover:border-[#F5B300] hover:text-[var(--pm-accent-text)] transition-colors">CSV ↓</button>
          <button onClick={() => handleExport("Excel")} className="border border-[var(--pm-border-strong)] text-[var(--pm-text-secondary)] text-xs px-3 py-2 mono hover:border-[#F5B300] hover:text-[var(--pm-accent-text)] transition-colors">Excel ↓</button>
          <button onClick={() => handleExport("PDF")} className="border border-[var(--pm-border-strong)] text-[var(--pm-text-secondary)] text-xs px-3 py-2 mono hover:border-[#F5B300] hover:text-[var(--pm-accent-text)] transition-colors">PDF ↓</button>
        </div>
      </div>

      <div className="border border-yellow-800/30 bg-yellow-950/10 px-4 py-2.5 text-xs text-yellow-300 mono flex items-center gap-2">
        <span>ℹ</span>
        <span>Transaction records are synced from Shopify (read-only). To process refunds or modify payment methods, use <strong>Shopify Admin → Orders</strong>. This portal records the decision; Shopify executes it.</span>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Revenue Collected", value: `$${totalRevenue.toFixed(2)}`, sub: "this week", accent: true },
          { label: "Pending Payments", value: `$${totalPending.toFixed(2)}`, sub: "awaiting capture", warn: true },
          { label: "Failed Payments", value: String(totalFailed), sub: "need follow-up", error: true },
          { label: "Refunds Issued", value: `$${totalRefunded.toFixed(2)}`, sub: "this week" },
        ].map(k => (
          <div
            key={k.label}
            className="border bg-[var(--pm-surface)] p-4"
            style={{ borderColor: k.accent ? `${accent}40` : k.error ? "#ef444440" : k.warn ? "#f5b30040" : "var(--pm-border)" }}
          >
            <div className="text-xs font-bold text-[var(--pm-text)] uppercase tracking-widest mb-2">{k.label}</div>
            <div
              className="text-3xl font-extrabold mono"
              style={{ color: k.accent ? accent : k.error ? "#EF4444" : k.warn ? "#F5B300" : "var(--pm-text-secondary)" }}
            >{k.value}</div>
            <div className="text-xs text-[var(--pm-text-muted)] mt-1 mono">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Billing summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="col-span-2 border border-[var(--pm-border)] bg-[var(--pm-surface)]">
          <div className="px-4 py-3 border-b border-[var(--pm-border)] flex items-center justify-between">
            <span className="text-sm font-semibold tracking-wide">Revenue Summary</span>
          </div>
          <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { period: "Today", revenue: totalRevenue, orders: txns.filter(t => t.status === "Paid").length },
              { period: "This Week", revenue: totalRevenue * 3.2, orders: txns.length * 2 },
              { period: "This Month", revenue: totalRevenue * 14, orders: txns.length * 8 },
            ].map(p => (
              <div key={p.period} className="border border-[var(--pm-border)] p-4">
                <div className="text-xs font-bold text-[var(--pm-text)] uppercase tracking-wider mb-2">{p.period}</div>
                <div className="text-2xl font-extrabold mono" style={{ color: accent }}>${p.revenue.toFixed(0)}</div>
                <div className="text-xs text-[var(--pm-text-muted)] mono mt-1">{p.orders} transactions</div>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-[var(--pm-border)] bg-[var(--pm-surface)] p-4">
          <div className="text-xs font-bold text-[var(--pm-text)] uppercase tracking-wider mb-3">Payment Methods</div>
          <div className="space-y-3">
            {[
              { method: "Card (via Shopify)", pct: 68, color: accent },
              { method: "GrabPay", pct: 19, color: "#22C55E" },
              { method: "PayNow", pct: 13, color: "#3B82F6" },
            ].map(p => (
              <div key={p.method}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[var(--pm-text-secondary)]">{p.method}</span>
                  <span className="mono font-bold" style={{ color: p.color }}>{p.pct}%</span>
                </div>
                <div className="h-1.5 bg-[var(--pm-surface-muted)]">
                  <div className="h-1.5" style={{ width: `${p.pct}%`, background: p.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transactions tab */}
      <div className="flex border-b border-[var(--pm-border)]">
        {(["transactions", "failed", "refunds"] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-3 text-sm font-medium mono transition-colors capitalize ${
              tab === t ? "border-b-2 text-[var(--pm-text-secondary)]" : "text-[var(--pm-text-muted)] hover:text-[var(--pm-text-secondary)]"
            }`}
            style={tab === t ? { borderBottomColor: accent, color: accent } : undefined}
          >
            {t === "transactions" ? "All Transactions" : t === "failed" ? "Failed Payments" : "Refunds"}
            {t === "failed" && totalFailed > 0 && (
              <span className="ml-2 bg-red-900 text-red-400 text-xs px-1.5 py-0.5 mono">{totalFailed}</span>
            )}
          </button>
        ))}
      </div>

      <div className="border border-[var(--pm-border)] bg-[var(--pm-surface)] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--pm-border)]">
              {["Transaction ID", "Date", "Customer", "Type", "Amount", "Method", "Status", ""].map(h => (
                <th key={h} className="px-4 py-2 text-left text-xs text-[var(--pm-text-muted)] uppercase tracking-wider font-medium whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {txns
              .filter(t => {
                if (tab === "failed") return t.status === "Failed";
                if (tab === "refunds") return t.status === "Refunded";
                return true;
              })
              .map((t, i) => (
                <tr key={t.id} className={`border-b border-[var(--pm-border)] hover:bg-[var(--pm-surface-subtle)] transition-colors ${i % 2 === 0 ? "" : "bg-[var(--pm-surface-subtle)]"}`}>
                  <td className="px-4 py-2.5 mono text-xs" style={{ color: accent }}>{t.id}</td>
                  <td className="px-4 py-2.5 mono text-xs text-[var(--pm-text-muted)]">{t.date}</td>
                  <td className="px-4 py-2.5 font-medium">{t.customer}</td>
                  <td className="px-4 py-2.5 text-xs text-[var(--pm-text-muted)]">{t.type}</td>
                  <td className={`px-4 py-2.5 mono font-bold ${t.amount < 0 ? "text-red-400" : "text-[var(--pm-text-secondary)]"}`}>
                    {t.amount < 0 ? `-$${Math.abs(t.amount).toFixed(2)}` : `$${t.amount.toFixed(2)}`}
                  </td>
                  <td className="px-4 py-2.5 text-xs text-[var(--pm-text-muted)]">{t.method}</td>
                  <td className="px-4 py-2.5">
                    <span className={`text-xs mono px-2 py-0.5 font-bold ${statusStyle[t.status]}`}>{t.status}</span>
                  </td>
                  <td className="px-4 py-2.5">
                    {t.status === "Failed" && (
                      <button
                        onClick={() => setRetryModal({ txn: t, reason: "", confirmed: false })}
                        className="text-xs border border-[#E85D04]/40 text-[var(--pm-secondary-text)] px-2 py-1 hover:bg-orange-950/30 mono transition-colors">
                        Retry → Shopify
                      </button>
                    )}
                    {t.status === "Paid" && (
                      <button
                        onClick={() => setRefundModal({ txn: t, reason: "", confirmed: false })}
                        className="text-xs border border-[var(--pm-border)] text-[var(--pm-text-muted)] px-2 py-1 hover:border-[#F5B300] hover:text-[var(--pm-accent-text)] mono transition-colors">
                        Refund → Shopify ↗
                      </button>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Retry → Shopify modal */}
      {retryModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center" onClick={() => setRetryModal(null)}>
          <div className="bg-[var(--pm-surface-subtle)] border border-[var(--pm-border)] w-full max-w-md p-6 space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="font-bold mono text-[var(--pm-text-secondary)]">Retry Payment — {retryModal.txn.id}</h3>
              <button onClick={() => setRetryModal(null)} className="text-[var(--pm-text-muted)] hover:text-[var(--pm-text-secondary)] text-xl mono">×</button>
            </div>

            {/* Transaction details */}
            <div className="border border-[var(--pm-border)] bg-[var(--pm-surface)] p-3 space-y-1 text-xs mono">
              <div className="flex justify-between"><span className="text-[var(--pm-text-muted)]">Customer</span><span className="text-[var(--pm-text-secondary)]">{retryModal.txn.customer}</span></div>
              <div className="flex justify-between"><span className="text-[var(--pm-text-muted)]">Amount</span><span className="text-[var(--pm-text-secondary)]">${retryModal.txn.amount.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-[var(--pm-text-muted)]">Method</span><span className="text-[var(--pm-text-secondary)]">{retryModal.txn.method}</span></div>
              <div className="flex justify-between"><span className="text-[var(--pm-text-muted)]">Date</span><span className="text-[var(--pm-text-secondary)]">{retryModal.txn.date}</span></div>
              <div className="flex justify-between"><span className="text-[var(--pm-text-muted)]">Status</span><span className="text-red-400 font-bold">{retryModal.txn.status}</span></div>
            </div>

            {/* Shopify boundary notice */}
            <div className="border border-yellow-700 bg-yellow-950/20 px-3 py-2 text-xs text-yellow-300 mono">
              This triggers a payment retry in Shopify. The portal records this decision only.
            </div>

            {!retryModal.confirmed ? (
              <>
                <div>
                  <label className="text-xs text-[var(--pm-text-muted)] mono uppercase tracking-wider block mb-1">Reason</label>
                  <input
                    type="text"
                    value={retryModal.reason}
                    onChange={e => setRetryModal(prev => prev ? { ...prev, reason: e.target.value } : null)}
                    placeholder="e.g. Customer confirmed card details updated"
                    className="w-full bg-[var(--pm-surface)] border border-[var(--pm-border)] text-[var(--pm-text-secondary)] text-xs px-3 py-2 mono focus:outline-none focus:border-[#F5B300] placeholder:text-[var(--pm-text-muted)]"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      window.open("https://admin.shopify.com", "_blank");
                      setRetryModal(prev => prev ? { ...prev, confirmed: true } : null);
                    }}
                    className="flex-1 bg-[#E85D04] text-black text-xs font-bold py-2.5 mono hover:bg-orange-500 transition-colors">
                    Retry → Shopify Admin ↗
                  </button>
                  <button onClick={() => setRetryModal(null)}
                    className="flex-1 border border-[var(--pm-border)] text-[var(--pm-text-muted)] text-xs py-2.5 mono hover:text-[var(--pm-text-secondary)] transition-colors">
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <div className="border border-green-800 bg-green-950/20 px-4 py-3 text-xs text-green-400 mono text-center space-y-1">
                <div className="font-bold text-sm">Retry recorded.</div>
                <div>Shopify Admin has been opened to complete the retry. This portal has logged the intent.</div>
                <button onClick={() => setRetryModal(null)} className="mt-2 border border-green-800 px-4 py-1.5 text-green-400 hover:bg-green-950/40 transition-colors">
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Refund → Shopify modal */}
      {refundModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center" onClick={() => setRefundModal(null)}>
          <div className="bg-[var(--pm-surface-subtle)] border border-[var(--pm-border)] w-full max-w-md p-6 space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="font-bold mono text-[var(--pm-text-secondary)]">Refund — {refundModal.txn.id}</h3>
              <button onClick={() => setRefundModal(null)} className="text-[var(--pm-text-muted)] hover:text-[var(--pm-text-secondary)] text-xl mono">×</button>
            </div>

            {/* Transaction details */}
            <div className="border border-[var(--pm-border)] bg-[var(--pm-surface)] p-3 space-y-1 text-xs mono">
              <div className="flex justify-between"><span className="text-[var(--pm-text-muted)]">Customer</span><span className="text-[var(--pm-text-secondary)]">{refundModal.txn.customer}</span></div>
              <div className="flex justify-between"><span className="text-[var(--pm-text-muted)]">Amount</span><span className="text-[var(--pm-text-secondary)]">${refundModal.txn.amount.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-[var(--pm-text-muted)]">Method</span><span className="text-[var(--pm-text-secondary)]">{refundModal.txn.method}</span></div>
              <div className="flex justify-between"><span className="text-[var(--pm-text-muted)]">Date</span><span className="text-[var(--pm-text-secondary)]">{refundModal.txn.date}</span></div>
              <div className="flex justify-between"><span className="text-[var(--pm-text-muted)]">Status</span><span className="text-green-400 font-bold">{refundModal.txn.status}</span></div>
            </div>

            {/* Shopify boundary notice */}
            <div className="border border-yellow-700 bg-yellow-950/20 px-3 py-2 text-xs text-yellow-300 mono">
              Refunds are processed in Shopify Admin. This portal records the decision only.
            </div>

            {!refundModal.confirmed ? (
              <>
                <div>
                  <label className="text-xs text-[var(--pm-text-muted)] mono uppercase tracking-wider block mb-1">Reason</label>
                  <input
                    type="text"
                    value={refundModal.reason}
                    onChange={e => setRefundModal(prev => prev ? { ...prev, reason: e.target.value } : null)}
                    placeholder="e.g. Customer requested cancellation"
                    className="w-full bg-[var(--pm-surface)] border border-[var(--pm-border)] text-[var(--pm-text-secondary)] text-xs px-3 py-2 mono focus:outline-none focus:border-[#F5B300] placeholder:text-[var(--pm-text-muted)]"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      window.open("https://admin.shopify.com", "_blank");
                      setRefundModal(prev => prev ? { ...prev, confirmed: true } : null);
                    }}
                    className="flex-1 bg-[#F5B300] text-black text-xs font-bold py-2.5 mono hover:bg-yellow-400 transition-colors">
                    Refund → Shopify Admin ↗
                  </button>
                  <button onClick={() => setRefundModal(null)}
                    className="flex-1 border border-[var(--pm-border)] text-[var(--pm-text-muted)] text-xs py-2.5 mono hover:text-[var(--pm-text-secondary)] transition-colors">
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <div className="border border-green-800 bg-green-950/20 px-4 py-3 text-xs text-green-400 mono text-center space-y-1">
                <div className="font-bold text-sm">Refund recorded.</div>
                <div>Shopify Admin has been opened to complete the refund. This portal has logged the intent.</div>
                <button onClick={() => setRefundModal(null)} className="mt-2 border border-green-800 px-4 py-1.5 text-green-400 hover:bg-green-950/40 transition-colors">
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
