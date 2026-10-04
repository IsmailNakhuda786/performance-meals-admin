import { useState } from "react";
import { downloadCSV } from "../utils/flowUtils";

type RefundStatus = "pending" | "approved" | "rejected" | "escalated";
type RefundReason = "delivery-failure" | "wrong-order" | "quality" | "cancellation" | "overcharge" | "other";

interface Refund {
  id: string;
  customer: string;
  orderId: string;
  amount: number;
  stream: string;
  reason: RefundReason;
  status: RefundStatus;
  requestDate: string;
  processedBy?: string;
  notes: string;
}

const refunds: Refund[] = [
  { id: "REF-062", customer: "Jason Yeo", orderId: "ORD-2403", amount: 68.00, stream: "Ready Series", reason: "delivery-failure", status: "pending", requestDate: "14 Sep 2024", notes: "Delivery failed twice. Customer requests full box refund." },
  { id: "REF-061", customer: "Aisha Rahman", orderId: "SUB-007", amount: 42.00, stream: "Meal Plans", reason: "wrong-order", status: "pending", requestDate: "14 Sep 2024", notes: "Received wrong meals on Monday delivery." },
  { id: "REF-060", customer: "Marcus Tan", orderId: "SUB-001", amount: 210.00, stream: "Meal Plans", reason: "cancellation", status: "escalated", requestDate: "13 Sep 2024", processedBy: "Jerome Lim", notes: "Customer cancelled plan mid-week. Partial refund dispute — escalated." },
  { id: "REF-059", customer: "Wei Jie Lim", orderId: "SUB-003", amount: 30.00, stream: "Meal Plans", reason: "overcharge", status: "approved", requestDate: "13 Sep 2024", processedBy: "Ravi Kumar", notes: "Double charge on pause date confirmed. Approved $30 credit." },
  { id: "REF-058", customer: "Serene Tay", orderId: "ORD-2400", amount: 89.50, stream: "Ready Series", reason: "quality", status: "approved", requestDate: "12 Sep 2024", processedBy: "Sarah Tan", notes: "Packaging damaged, ice packs melted. Full refund approved." },
  { id: "REF-057", customer: "Raj Nair", orderId: "ORD-2396", amount: 12.00, stream: "Ready Series", reason: "other", status: "rejected", requestDate: "11 Sep 2024", processedBy: "Ravi Kumar", notes: "Promo code issue — credit already applied via wallet. Refund not applicable." },
];

const statusStyle: Record<RefundStatus, string> = {
  pending: "text-yellow-400 bg-yellow-950/30",
  approved: "text-green-400 bg-green-950/30",
  rejected: "text-red-400 bg-red-950/30",
  escalated: "text-orange-400 bg-orange-950/30",
};

const reasonLabels: Record<RefundReason, string> = {
  "delivery-failure": "Delivery Failure",
  "wrong-order": "Wrong Order",
  "quality": "Quality Issue",
  "cancellation": "Cancellation",
  "overcharge": "Overcharge",
  "other": "Other",
};

export default function Refunds({ demoMode }: { demoMode?: boolean } = {}) {
  const [statusFilter, setStatusFilter] = useState<RefundStatus | "all">("all");
  const [selected, setSelected] = useState<Refund | null>(demoMode ? refunds[0] : null);
  const [confirmAction, setConfirmAction] = useState<"approve" | "reject" | "escalate" | null>(null);
  const [confirmReason, setConfirmReason] = useState("");
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const filtered = refunds.filter(r => statusFilter === "all" || r.status === statusFilter);

  const totalPending = refunds.filter(r => r.status === "pending").reduce((a, r) => a + r.amount, 0);
  const totalApproved = refunds.filter(r => r.status === "approved").reduce((a, r) => a + r.amount, 0);

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold">Refund Management</h2>
        <div className="flex gap-2">
          <button onClick={() => {
            const rows = filtered.map(r => ({ ID: r.id, Customer: r.customer, Order: r.orderId, Amount: r.amount, Stream: r.stream, Reason: reasonLabels[r.reason], Status: r.status, Date: r.requestDate, "Processed By": r.processedBy ?? "", Notes: r.notes }));
            downloadCSV("refunds.csv", rows);
          }} className="border border-[#3A3A3A] text-[#CCCCCC] text-xs px-4 py-2 mono hover:border-[#F5B300] hover:text-[#F5B300] transition-colors">Export CSV</button>
        </div>
      </div>

      {/* Shopify Boundary Banner */}
      <div className="border border-blue-800/40 bg-blue-950/10 px-4 py-3 flex items-start gap-3">
        <span className="text-blue-400 text-base flex-shrink-0 mt-0.5">⚠</span>
        <div className="text-xs text-[#AAAAAA] leading-relaxed">
          <span className="text-blue-300 font-bold">Shopify Boundary:</span>{" "}
          This portal records refund decisions only. Financial execution happens via Shopify.{" "}
          <span className="text-[#E8E8E8] font-semibold">This portal is NOT a payment processor.</span>
        </div>
      </div>

      {actionSuccess && (
        <div className="border border-green-800/40 bg-green-950/20 px-4 py-2.5 text-xs text-green-400 mono font-bold">
          ✓ {actionSuccess}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Pending Review", value: `$${totalPending.toFixed(2)}`, count: refunds.filter(r => r.status === "pending").length, color: "#F5B300" },
          { label: "Approved This Week", value: `$${totalApproved.toFixed(2)}`, count: refunds.filter(r => r.status === "approved").length, color: "#22C55E" },
          { label: "Escalated", value: refunds.filter(r => r.status === "escalated").length, count: null, color: "#E85D04" },
          { label: "Rejected", value: refunds.filter(r => r.status === "rejected").length, count: null, color: "#EF4444" },
        ].map(k => (
          <div key={k.label} className="border border-[#2A2A2A] bg-[#181818] p-4">
            <div className="text-xs font-bold text-[#FFFFFF] uppercase tracking-widest mb-2">{k.label}</div>
            <div className="text-2xl font-extrabold mono" style={{ color: k.color }}>{k.value}</div>
            {k.count !== null && <div className="text-xs text-[#888] mono mt-1">{k.count} requests</div>}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        {(["all", "pending", "approved", "rejected", "escalated"] as (RefundStatus | "all")[]).map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`text-xs px-3 py-1.5 mono border transition-colors capitalize ${statusFilter === s ? "border-[#F5B300] text-[#F5B300] bg-[#F5B300]/10" : "border-[#2A2A2A] text-[#888] hover:text-[#E8E8E8]"}`}>
            {s === "all" ? "All" : s}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="col-span-3 border border-[#2A2A2A] bg-[#181818] overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2A2A2A]">
                {["Ref ID", "Customer", "Order", "Amount", "Reason", "Stream", "Status", "Date"].map(h => (
                  <th key={h} className="px-4 py-2 text-left text-xs text-[#AAAAAA] uppercase tracking-wider font-medium whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr key={r.id} onClick={() => setSelected(r)}
                  className={`border-b border-[#2A2A2A] cursor-pointer transition-colors ${selected?.id === r.id ? "bg-[#1F1F1F]" : i % 2 === 0 ? "hover:bg-[#1A1A1A]" : "bg-[#141414] hover:bg-[#1A1A1A]"}`}>
                  <td className="px-4 py-2.5 mono text-xs text-[#F5B300]">{r.id}</td>
                  <td className="px-4 py-2.5 font-medium">{r.customer}</td>
                  <td className="px-4 py-2.5 mono text-xs text-[#888]">{r.orderId}</td>
                  <td className="px-4 py-2.5 mono font-bold text-[#E8E8E8]">${r.amount.toFixed(2)}</td>
                  <td className="px-4 py-2.5 text-xs text-[#888]">{reasonLabels[r.reason]}</td>
                  <td className="px-4 py-2.5 text-xs">
                    <span style={{ color: r.stream === "Meal Plans" ? "#F5B300" : "#E85D04" }}>{r.stream}</span>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className={`text-xs mono px-2 py-0.5 font-bold capitalize ${statusStyle[r.status]}`}>{r.status}</span>
                  </td>
                  <td className="px-4 py-2.5 mono text-xs text-[#888]">{r.requestDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="col-span-2 border border-[#2A2A2A] bg-[#181818]">
          {!selected ? (
            <div className="flex items-center justify-center h-full text-[#555] text-sm">Select a refund to review</div>
          ) : (
            <div className="flex flex-col h-full">
              <div className="px-4 py-3 border-b border-[#2A2A2A] flex items-center justify-between">
                <span className="font-bold text-[#F5B300] mono">{selected.id}</span>
                <span className={`text-xs mono px-2 py-0.5 font-bold capitalize ${statusStyle[selected.status]}`}>{selected.status}</span>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs text-[#AAAAAA] uppercase tracking-wider mb-1">Customer</div>
                    <div className="font-semibold">{selected.customer}</div>
                  </div>
                  <div>
                    <div className="text-xs text-[#AAAAAA] uppercase tracking-wider mb-1">Order</div>
                    <div className="mono text-sm text-[#888]">{selected.orderId}</div>
                  </div>
                  <div>
                    <div className="text-xs text-[#AAAAAA] uppercase tracking-wider mb-1">Amount</div>
                    <div className="text-2xl font-extrabold mono text-[#F5B300]">${selected.amount.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-[#AAAAAA] uppercase tracking-wider mb-1">Reason</div>
                    <div className="text-sm">{reasonLabels[selected.reason]}</div>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-[#AAAAAA] uppercase tracking-wider mb-1">Notes</div>
                  <div className="text-xs text-[#888] bg-[#0F0F0F] border border-[#2A2A2A] p-2">{selected.notes}</div>
                </div>
                {/* Payment Status */}
                <div>
                  <div className="text-xs text-[#AAAAAA] uppercase tracking-wider mb-1">Payment Status</div>
                  {selected.status === "approved" || selected.status === "rejected" ? (
                    <div className="text-xs mono text-green-400 font-bold">Payment Confirmed — {selected.requestDate}</div>
                  ) : (
                    <div className="text-xs mono text-yellow-400">Awaiting Payment Confirmation</div>
                  )}
                </div>
                {selected.processedBy && (
                  <div className="text-xs text-[#555] mono">Processed by: {selected.processedBy}</div>
                )}
                {selected.status === "pending" && (
                  <div className="border border-yellow-800/30 bg-yellow-950/10 px-3 py-2 text-xs text-yellow-300 mono mb-2">
                    ℹ Approving records the decision here. Shopify Admin executes the actual refund.
                  </div>
                )}
                {selected.status === "pending" && (
                  <div className="flex gap-2">
                    <button onClick={() => { setConfirmAction("approve"); setConfirmReason(""); }} className="flex-1 bg-green-800 text-white text-xs font-bold py-2 mono hover:bg-green-700 transition-colors">Approve</button>
                    <button onClick={() => { setConfirmAction("reject"); setConfirmReason(""); }} className="flex-1 bg-red-950 border border-red-800/40 text-red-400 text-xs py-2 mono hover:bg-red-900/40 transition-colors">Reject</button>
                    <button onClick={() => { setConfirmAction("escalate"); setConfirmReason(""); }} className="flex-1 border border-[#E85D04]/40 text-[#E85D04] text-xs py-2 mono hover:bg-[#E85D04]/10 transition-colors">Escalate</button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Confirm action modal */}
      {confirmAction && selected && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setConfirmAction(null)}>
          <div className="border border-[#2A2A2A] bg-[#181818] w-full max-w-md p-6 space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-3">
              <span className={`font-bold text-base ${confirmAction === "approve" ? "text-green-400" : confirmAction === "reject" ? "text-red-400" : "text-[#E85D04]"}`}>
                {confirmAction === "approve" ? `Approve Refund ${selected.id}` : confirmAction === "reject" ? `Reject Refund ${selected.id}` : `Escalate Refund ${selected.id}`}
              </span>
              <button onClick={() => setConfirmAction(null)} className="text-[#555] hover:text-[#888] text-xl leading-none">×</button>
            </div>
            <div className="border border-[#2A2A2A] bg-[#0F0F0F] px-3 py-2.5 space-y-1">
              <div className="flex justify-between">
                <span className="text-xs text-[#DDDDDD]">Customer</span>
                <span className="text-xs font-semibold text-[#E8E8E8]">{selected.customer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-[#DDDDDD]">Amount</span>
                <span className="mono text-xs font-bold text-[#F5B300]">${selected.amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-[#DDDDDD]">Ref ID</span>
                <span className="mono text-xs text-[#888]">{selected.id}</span>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-[#AAAAAA] uppercase tracking-wider">
                {confirmAction === "approve" ? "Approval Notes" : confirmAction === "reject" ? "Rejection Reason (required)" : "Escalation Reason (required)"}
              </label>
              <textarea rows={3} value={confirmReason} onChange={e => setConfirmReason(e.target.value)}
                placeholder={confirmAction === "approve" ? "Optional notes… (min 10 chars if provided)" : "Required — describe the reason (min 10 chars)…"}
                className="w-full bg-[#0F0F0F] border border-[#2A2A2A] text-[#E8E8E8] text-sm px-3 py-2 mono outline-none focus:border-[#555] resize-none placeholder:text-[#333]" />
              {confirmAction !== "approve" && confirmReason.length > 0 && confirmReason.length < 10 && (
                <div className="text-xs text-red-400 mono">Minimum 10 characters required</div>
              )}
            </div>
            {confirmAction === "approve" && (
              <div className="border border-yellow-800/30 bg-yellow-950/10 px-3 py-2 text-xs text-yellow-300 mono">
                ℹ Approving records the admin decision. The actual financial refund is executed via Shopify/payment provider — NOT by this portal.
              </div>
            )}
            <div className="flex gap-2 pt-1">
              <button onClick={() => setConfirmAction(null)} className="flex-1 py-2 border border-[#2A2A2A] text-[#888] text-xs mono hover:border-[#555] transition-colors">Cancel</button>
              <button
                disabled={confirmAction !== "approve" && confirmReason.length < 10}
                onClick={() => {
                  if (confirmAction !== "approve" && confirmReason.length < 10) return;
                  const actionLabel = confirmAction === "approve" ? "Approved" : confirmAction === "reject" ? "Rejected" : "Escalated";
                  const msg = `${selected.id} ${actionLabel} — ${selected.customer} · $${selected.amount.toFixed(2)} · Logged to Audit Trail`;
                  setConfirmAction(null);
                  setActionSuccess(msg);
                  setTimeout(() => setActionSuccess(null), 4000);
                }}
                className={`flex-1 py-2 text-xs font-bold mono transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${confirmAction === "approve" ? "bg-green-800 text-white hover:bg-green-700" : confirmAction === "reject" ? "bg-red-900 border border-red-700 text-red-200 hover:bg-red-800" : "bg-[#E85D04]/20 border border-[#E85D04]/40 text-[#E85D04] hover:bg-[#E85D04]/30"}`}>
                Confirm {confirmAction.charAt(0).toUpperCase() + confirmAction.slice(1)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
