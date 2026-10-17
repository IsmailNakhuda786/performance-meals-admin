import { useEffect, useState } from "react";
import { downloadCSV } from "../utils/flowUtils";
import { customers, orders, type RefundEscalation, type WalletRefund, type WalletRefundStatus } from "../data";
import { refundHistory as refunds, type Refund, type RefundReason, type RefundStatus } from "../refundHistory";
import PendingWorkBanner from "../components/PendingWorkBanner";
import { readLocalState, writeLocalState } from "../utils/localState";

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

function CustomerContactPanel({
  customerName,
  email,
  phone,
  refundId,
  sourceId,
}: {
  customerName: string;
  email?: string;
  phone?: string;
  refundId: string;
  sourceId: string;
}) {
  const [channel, setChannel] = useState<"WhatsApp" | "Email">("WhatsApp");
  const [subject, setSubject] = useState(`Update on refund request ${refundId}`);
  const [message, setMessage] = useState("");
  const [sentMessages, setSentMessages] = useState<{ channel: "WhatsApp" | "Email"; subject?: string; text: string }[]>([]);
  const [sentConfirmation, setSentConfirmation] = useState("");

  const templates = [
    { label: "Request evidence", text: `Hi ${customerName}, we are reviewing refund request ${refundId} for ${sourceId}. Please send photos or details showing the issue so our support team can complete the review.` },
    { label: "Confirm issue", text: `Hi ${customerName}, we are reviewing refund request ${refundId}. Could you confirm which delivered items were affected and when you noticed the issue?` },
    { label: "Resolution update", text: `Hi ${customerName}, your refund request ${refundId} is currently under review. We will update you once the wallet refund decision is complete.` },
  ];

  const sendMessage = () => {
    const text = message.trim();
    if (!text) return;
    setSentMessages(current => [...current, { channel, subject: channel === "Email" ? subject : undefined, text }]);
    setMessage("");
    setSentConfirmation(`${channel} message recorded in the customer contact history.`);
    window.setTimeout(() => setSentConfirmation(""), 4000);
  };

  return (
    <div className="border border-[var(--pm-border)] bg-[var(--pm-bg)]">
      <div className="border-b border-[var(--pm-border)] p-4">
        <div className="text-xs font-bold uppercase tracking-wider">Contact customer</div>
        <div className="mt-1 text-[10px] text-[var(--pm-text-muted)]">Keep the conversation beside the refund review evidence.</div>
      </div>
      <div className="space-y-3 p-4">
        <div className="grid grid-cols-2 gap-2">
          {(["WhatsApp", "Email"] as const).map(value => (
            <button key={value} onClick={() => {
              setChannel(value);
              setSentConfirmation("");
            }} className={`border px-3 py-2 text-xs font-bold ${channel === value ? value === "WhatsApp" ? "border-green-700 bg-green-950/30 text-green-400" : "border-blue-700 bg-blue-950/30 text-blue-400" : "border-[var(--pm-border)] text-[var(--pm-text-muted)]"}`}>
              {value}
            </button>
          ))}
        </div>

        <div className="border border-[var(--pm-border)] bg-[var(--pm-surface)] px-3 py-2">
          <div className="text-[10px] uppercase tracking-wider text-[var(--pm-text-muted)]">Sending to</div>
          <div className="mt-1 text-xs font-semibold">{channel === "WhatsApp" ? phone ?? "Phone unavailable" : email ?? "Email unavailable"}</div>
        </div>

        {sentMessages.length > 0 && (
          <div className="max-h-36 space-y-2 overflow-y-auto border border-[var(--pm-border)] bg-[var(--pm-surface)] p-2">
            {sentMessages.map((sent, index) => (
              <div key={`${sent.channel}-${index}`} className={`ml-6 border px-3 py-2 text-xs ${sent.channel === "WhatsApp" ? "border-green-900/50 bg-green-950/20" : "border-blue-900/50 bg-blue-950/20"}`}>
                {sent.subject && <div className="mb-1 font-bold">{sent.subject}</div>}
                <div className="leading-relaxed text-[var(--pm-text-secondary)]">{sent.text}</div>
                <div className="mt-1 text-right text-[9px] text-[var(--pm-text-muted)] mono">Support · Just now</div>
              </div>
            ))}
          </div>
        )}

        <div>
          <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[var(--pm-text-muted)]">Quick message</div>
          <div className="flex flex-wrap gap-1">
            {templates.map(template => <button key={template.label} onClick={() => setMessage(template.text)} className="border border-[var(--pm-border)] px-2 py-1 text-[10px] text-[var(--pm-text-muted)] hover:border-[#F5B300]/50 hover:text-[var(--pm-accent-text)]">{template.label}</button>)}
          </div>
        </div>

        {channel === "Email" && <input value={subject} onChange={event => setSubject(event.target.value)} placeholder="Email subject" className="w-full border border-[var(--pm-border)] bg-[var(--pm-surface)] px-3 py-2 text-xs text-[var(--pm-text-secondary)]" />}
        <textarea rows={4} value={message} onChange={event => setMessage(event.target.value)} placeholder={channel === "WhatsApp" ? "Type a WhatsApp message…" : "Write an email…"} className="w-full resize-none border border-[var(--pm-border)] bg-[var(--pm-surface)] px-3 py-2 text-xs text-[var(--pm-text-secondary)]" />
        <button disabled={!message.trim() || (channel === "WhatsApp" ? !phone : !email)} onClick={sendMessage} className={`w-full px-3 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-40 ${channel === "WhatsApp" ? "bg-green-800" : "bg-blue-800"}`}>
          Send via {channel}
        </button>
        {sentConfirmation && <div role="status" className="border border-green-800/40 bg-green-950/20 px-3 py-2 text-[10px] font-bold text-green-400">{sentConfirmation}</div>}
      </div>
    </div>
  );
}

export default function Refunds({
  demoMode,
  walletRefunds = [],
  onDecideWalletRefund,
  onOpenProfile,
  onOpenOrder,
  onEscalate,
  onPendingCountChange,
}: {
  demoMode?: boolean;
  walletRefunds?: WalletRefund[];
  onDecideWalletRefund?: (refundId: string, status: Exclude<WalletRefundStatus, "Pending">) => void;
  onOpenProfile?: (customerId: string) => void;
  onOpenOrder?: (sourceId: string, customerName: string, stream: string) => void;
  onEscalate?: (matter: Omit<RefundEscalation, "id" | "status" | "createdAt" | "assignedTo">) => void;
  onPendingCountChange?: (count: number) => void;
} = {}) {
  const [refundItems, setRefundItems] = useState(() => readLocalState("pm-refunds-workflow", refunds));
  const [statusFilter, setStatusFilter] = useState<RefundStatus | "all">("all");
  const [selected, setSelected] = useState<Refund | null>(demoMode ? refunds[0] : null);
  const [confirmAction, setConfirmAction] = useState<"approve" | "reject" | "escalate" | null>(null);
  const [confirmReason, setConfirmReason] = useState("");
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [detailRefund, setDetailRefund] = useState<Refund | null>(null);
  const [detailWalletRefund, setDetailWalletRefund] = useState<WalletRefund | null>(null);

  const filtered = refundItems.filter(r => statusFilter === "all" || r.status === statusFilter);

  const pendingRefunds = refundItems.filter(refund => refund.status === "pending");
  const pendingWalletRefunds = walletRefunds.filter(refund => refund.status === "Pending");
  const totalPending = pendingRefunds.reduce((a, r) => a + r.amount, 0);
  const totalApproved = refundItems.filter(r => r.status === "approved").reduce((a, r) => a + r.amount, 0);

  useEffect(() => {
    onPendingCountChange?.(pendingRefunds.length + pendingWalletRefunds.length);
  }, [onPendingCountChange, pendingRefunds.length, pendingWalletRefunds.length]);

  useEffect(() => {
    writeLocalState("pm-refunds-workflow", refundItems);
  }, [refundItems]);

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold">Refund Management</h2>
        <div className="flex gap-2">
          <button onClick={() => {
            const rows = filtered.map(r => ({ ID: r.id, Customer: r.customer, Order: r.orderId, Amount: r.amount, Stream: r.stream, Reason: reasonLabels[r.reason], Status: r.status, Date: r.requestDate, "Processed By": r.processedBy ?? "", Notes: r.notes }));
            downloadCSV("refunds.csv", rows);
          }} className="border border-[var(--pm-border-strong)] text-[var(--pm-text-secondary)] text-xs px-4 py-2 mono hover:border-[#F5B300] hover:text-[var(--pm-accent-text)] transition-colors">Export CSV</button>
        </div>
      </div>

      <div className="border border-green-800/40 bg-green-950/10 px-4 py-3 text-xs text-green-300">
        <span className="font-bold">Wallet refund workflow:</span> Approved refunds are deposited into the customer wallet. Full refunds include the delivery fee paid, deduct bonus credits and rewards used, and reverse points earned.
      </div>

      {actionSuccess && (
        <div className="border border-green-800/40 bg-green-950/20 px-4 py-2.5 text-xs text-green-400 mono font-bold">
          ✓ {actionSuccess}
        </div>
      )}

      <PendingWorkBanner
        count={pendingRefunds.length + pendingWalletRefunds.length}
        itemLabel="pending refund review"
        detail={[...pendingWalletRefunds.map(refund => `${refund.id} · ${refund.customerName}`), ...pendingRefunds.map(refund => `${refund.id} · ${refund.customer}`)].join(", ") + " require a decision."}
        reviewing={statusFilter === "pending"}
        onReview={() => {
          setStatusFilter("pending");
          if (pendingRefunds[0]) setSelected(pendingRefunds[0]);
          else if (pendingWalletRefunds[0]) setDetailWalletRefund(pendingWalletRefunds[0]);
        }}
        onShowAll={() => setStatusFilter("all")}
      />

      <div className="border border-[var(--pm-border)] bg-[var(--pm-surface)]">
        <div className="flex items-center justify-between border-b border-[var(--pm-border)] px-4 py-3">
          <div>
            <div className="text-sm font-semibold">Customer Wallet Refund Requests</div>
            <div className="mt-1 text-xs text-[var(--pm-text-muted)]">Approval deposits the refund into the customer wallet and reverses the recorded points earned.</div>
          </div>
          <span className="bg-yellow-950/30 px-2 py-1 text-xs font-bold text-yellow-400 mono">{walletRefunds.filter(refund => refund.status === "Pending").length} pending</span>
        </div>
        {walletRefunds.length ? (
          <div className="divide-y divide-[var(--pm-border-soft)]">
            {walletRefunds.map(refund => (
              <div key={refund.id} className="grid grid-cols-1 gap-3 px-4 py-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-[var(--pm-accent-text)] mono">{refund.id}</span>
                    <span className="font-semibold">{refund.customerName}</span>
                    <span className="text-xs text-[var(--pm-text-muted)] mono">{refund.sourceId}</span>
                    <span className="border border-[var(--pm-border)] px-2 py-0.5 text-[10px] text-[var(--pm-text-muted)]">{refund.type}</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--pm-text-muted)] mono">
                    <span>Purchase ${refund.purchaseAmount.toFixed(2)}</span>
                    <span>Delivery +${refund.deliveryFee.toFixed(2)}</span>
                    <span>Credits/rewards -${(refund.bonusCreditsUsed + refund.rewardsUsed).toFixed(2)}</span>
                    <span className="font-bold text-green-400">Wallet +${refund.refundAmount.toFixed(2)}</span>
                    <span className="text-red-400">Points -{refund.pointsReversed}</span>
                  </div>
                  <div className="mt-1 text-xs text-[var(--pm-text-muted)]">{refund.reason} · {refund.createdAt}</div>
                </div>
                {refund.status === "Pending" ? (
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => setDetailWalletRefund(refund)} className="border border-[var(--pm-border)] px-3 py-2 text-xs font-bold text-[var(--pm-text-secondary)]">View Details</button>
                    <button onClick={() => onDecideWalletRefund?.(refund.id, "Rejected")} className="border border-red-900/50 px-3 py-2 text-xs text-red-400">Reject</button>
                    <button onClick={() => {
                      if (window.confirm(`Approve $${refund.refundAmount.toFixed(2)} wallet refund for ${refund.customerName}?`)) {
                        onDecideWalletRefund?.(refund.id, "Approved");
                        setActionSuccess(`${refund.id} approved — $${refund.refundAmount.toFixed(2)} deposited into ${refund.customerName}'s wallet and ${refund.pointsReversed} points reversed.`);
                      }
                    }} className="bg-green-800 px-3 py-2 text-xs font-bold text-white">Approve Wallet Refund</button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <button onClick={() => setDetailWalletRefund(refund)} className="border border-[var(--pm-border)] px-3 py-2 text-xs font-bold text-[var(--pm-text-secondary)]">View Details</button>
                    <span className={`px-2 py-1 text-xs font-bold mono ${refund.status === "Approved" ? "bg-green-950/30 text-green-400" : "bg-red-950/30 text-red-400"}`}>{refund.status}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-sm text-[var(--pm-text-muted)]">No wallet refund requests have been submitted.</div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Pending Review", value: `$${totalPending.toFixed(2)}`, count: pendingRefunds.length, color: "#F5B300" },
          { label: "Approved This Week", value: `$${totalApproved.toFixed(2)}`, count: refunds.filter(r => r.status === "approved").length, color: "#22C55E" },
          { label: "Escalated", value: refunds.filter(r => r.status === "escalated").length, count: null, color: "#E85D04" },
          { label: "Rejected", value: refunds.filter(r => r.status === "rejected").length, count: null, color: "#EF4444" },
        ].map(k => (
          <div key={k.label} className="border border-[var(--pm-border)] bg-[var(--pm-surface)] p-4">
            <div className="text-xs font-bold text-[var(--pm-text)] uppercase tracking-widest mb-2">{k.label}</div>
            <div className="text-2xl font-extrabold mono" style={{ color: k.color }}>{k.value}</div>
            {k.count !== null && <div className="text-xs text-[var(--pm-text-muted)] mono mt-1">{k.count} requests</div>}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        {(["all", "pending", "approved", "rejected", "escalated"] as (RefundStatus | "all")[]).map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`text-xs px-3 py-1.5 mono border transition-colors capitalize ${statusFilter === s ? "border-[#F5B300] text-[var(--pm-accent-text)] bg-[#F5B300]/10" : "border-[var(--pm-border)] text-[var(--pm-text-muted)] hover:text-[var(--pm-text-secondary)]"}`}>
            {s === "all" ? "All" : s}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="col-span-3 border border-[var(--pm-border)] bg-[var(--pm-surface)] overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--pm-border)]">
                {["Ref ID", "Customer", "Order", "Amount", "Reason", "Stream", "Status", "Date"].map(h => (
                  <th key={h} className="px-4 py-2 text-left text-xs text-[var(--pm-text-muted)] uppercase tracking-wider font-medium whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr key={r.id} onClick={() => setSelected(r)}
                  className={`border-b border-[var(--pm-border)] cursor-pointer transition-colors ${selected?.id === r.id ? "bg-[var(--pm-surface-subtle)]" : i % 2 === 0 ? "hover:bg-[var(--pm-surface-muted)]" : "bg-[var(--pm-surface-subtle)] hover:bg-[var(--pm-surface-muted)]"}`}>
                  <td className="px-4 py-2.5 mono text-xs text-[var(--pm-accent-text)]">{r.id}</td>
                  <td className="px-4 py-2.5 font-medium">{r.customer}</td>
                  <td className="px-4 py-2.5 mono text-xs text-[var(--pm-text-muted)]">{r.orderId}</td>
                  <td className="px-4 py-2.5 mono font-bold text-[var(--pm-text-secondary)]">${r.amount.toFixed(2)}</td>
                  <td className="px-4 py-2.5 text-xs text-[var(--pm-text-muted)]">{reasonLabels[r.reason]}</td>
                  <td className="px-4 py-2.5 text-xs">
                    <span style={{ color: r.stream === "Meal Plans" ? "#F5B300" : "#E85D04" }}>{r.stream}</span>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className={`text-xs mono px-2 py-0.5 font-bold capitalize ${statusStyle[r.status]}`}>{r.status}</span>
                  </td>
                  <td className="px-4 py-2.5 mono text-xs text-[var(--pm-text-muted)]">{r.requestDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="col-span-2 border border-[var(--pm-border)] bg-[var(--pm-surface)]">
          {!selected ? (
            <div className="flex items-center justify-center h-full text-[var(--pm-text-muted)] text-sm">Select a refund to review</div>
          ) : (
            <div className="flex flex-col h-full">
              <div className="px-4 py-3 border-b border-[var(--pm-border)] flex items-center justify-between">
                <span className="font-bold text-[var(--pm-accent-text)] mono">{selected.id}</span>
                <span className={`text-xs mono px-2 py-0.5 font-bold capitalize ${statusStyle[selected.status]}`}>{selected.status}</span>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs text-[var(--pm-text-muted)] uppercase tracking-wider mb-1">Customer</div>
                    <div className="font-semibold">{selected.customer}</div>
                  </div>
                  <div>
                    <div className="text-xs text-[var(--pm-text-muted)] uppercase tracking-wider mb-1">Order</div>
                    <div className="mono text-sm text-[var(--pm-text-muted)]">{selected.orderId}</div>
                  </div>
                  <div>
                    <div className="text-xs text-[var(--pm-text-muted)] uppercase tracking-wider mb-1">Amount</div>
                    <div className="text-2xl font-extrabold mono text-[var(--pm-accent-text)]">${selected.amount.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-[var(--pm-text-muted)] uppercase tracking-wider mb-1">Reason</div>
                    <div className="text-sm">{reasonLabels[selected.reason]}</div>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-[var(--pm-text-muted)] uppercase tracking-wider mb-1">Notes</div>
                  <div className="text-xs text-[var(--pm-text-muted)] bg-[var(--pm-bg)] border border-[var(--pm-border)] p-2">{selected.notes}</div>
                </div>
                {/* Wallet refund status */}
                <div>
                  <div className="text-xs text-[var(--pm-text-muted)] uppercase tracking-wider mb-1">Wallet Refund Status</div>
                  {selected.status === "approved" || selected.status === "rejected" ? (
                    <div className="text-xs mono text-green-400 font-bold">{selected.status === "approved" ? "Wallet refund approved" : "Refund rejected"} — {selected.requestDate}</div>
                  ) : (
                    <div className="text-xs mono text-yellow-400">Awaiting refund review</div>
                  )}
                </div>
                {selected.processedBy && (
                  <div className="text-xs text-[var(--pm-text-muted)] mono">Processed by: {selected.processedBy}</div>
                )}
                {selected.status === "pending" && (
                  <div className="border border-yellow-800/30 bg-yellow-950/10 px-3 py-2 text-xs text-yellow-300 mono mb-2">
                    Approval deposits the approved amount into the customer wallet.
                  </div>
                )}
                <button onClick={() => setDetailRefund(selected)} className="w-full border border-[var(--pm-border)] py-2 text-xs font-bold text-[var(--pm-text-secondary)] mono hover:border-[#F5B300] hover:text-[var(--pm-accent-text)]">View Details</button>
                {selected.status === "pending" && (
                  <div className="flex gap-2">
                    <button onClick={() => { setConfirmAction("approve"); setConfirmReason(""); }} className="flex-1 bg-green-800 text-white text-xs font-bold py-2 mono hover:bg-green-700 transition-colors">Approve</button>
                    <button onClick={() => { setConfirmAction("reject"); setConfirmReason(""); }} className="flex-1 bg-red-950 border border-red-800/40 text-red-400 text-xs py-2 mono hover:bg-red-900/40 transition-colors">Reject</button>
                    <button onClick={() => { setConfirmAction("escalate"); setConfirmReason(""); }} className="flex-1 border border-[#E85D04]/40 text-[var(--pm-secondary-text)] text-xs py-2 mono hover:bg-[#E85D04]/10 transition-colors">Escalate</button>
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
          <div className="border border-[var(--pm-border)] bg-[var(--pm-surface)] w-full max-w-md p-6 space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[var(--pm-border)] pb-3">
              <span className={`font-bold text-base ${confirmAction === "approve" ? "text-green-400" : confirmAction === "reject" ? "text-red-400" : "text-[var(--pm-secondary-text)]"}`}>
                {confirmAction === "approve" ? `Approve Refund ${selected.id}` : confirmAction === "reject" ? `Reject Refund ${selected.id}` : `Escalate Refund ${selected.id}`}
              </span>
              <button onClick={() => setConfirmAction(null)} className="text-[var(--pm-text-muted)] hover:text-[var(--pm-text-muted)] text-xl leading-none">×</button>
            </div>
            <div className="border border-[var(--pm-border)] bg-[var(--pm-bg)] px-3 py-2.5 space-y-1">
              <div className="flex justify-between">
                <span className="text-xs text-[var(--pm-text-secondary)]">Customer</span>
                <span className="text-xs font-semibold text-[var(--pm-text-secondary)]">{selected.customer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-[var(--pm-text-secondary)]">Amount</span>
                <span className="mono text-xs font-bold text-[var(--pm-accent-text)]">${selected.amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-[var(--pm-text-secondary)]">Ref ID</span>
                <span className="mono text-xs text-[var(--pm-text-muted)]">{selected.id}</span>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-[var(--pm-text-muted)] uppercase tracking-wider">
                {confirmAction === "approve" ? "Approval Notes" : confirmAction === "reject" ? "Rejection Reason (required)" : "Escalation Reason (required)"}
              </label>
              <textarea rows={3} value={confirmReason} onChange={e => setConfirmReason(e.target.value)}
                placeholder={confirmAction === "approve" ? "Optional notes… (min 10 chars if provided)" : "Required — describe the reason (min 10 chars)…"}
                className="w-full bg-[var(--pm-bg)] border border-[var(--pm-border)] text-[var(--pm-text-secondary)] text-sm px-3 py-2 mono outline-none focus:border-[var(--pm-border-strong)] resize-none placeholder:text-[var(--pm-text-muted)]" />
              {confirmAction !== "approve" && confirmReason.length > 0 && confirmReason.length < 10 && (
                <div className="text-xs text-red-400 mono">Minimum 10 characters required</div>
              )}
            </div>
            {confirmAction === "approve" && (
              <div className="border border-green-800/30 bg-green-950/10 px-3 py-2 text-xs text-green-300 mono">
                Approval records the decision and deposits the approved refund into the customer wallet.
              </div>
            )}
            <div className="flex gap-2 pt-1">
              <button onClick={() => setConfirmAction(null)} className="flex-1 py-2 border border-[var(--pm-border)] text-[var(--pm-text-muted)] text-xs mono hover:border-[var(--pm-border-strong)] transition-colors">Cancel</button>
              <button
                disabled={confirmAction !== "approve" && confirmReason.length < 10}
                onClick={() => {
                  if (confirmAction !== "approve" && confirmReason.length < 10) return;
                  const nextStatus: RefundStatus = confirmAction === "approve" ? "approved" : confirmAction === "reject" ? "rejected" : "escalated";
                  const actionLabel = confirmAction === "approve" ? "Approved" : confirmAction === "reject" ? "Rejected" : "Escalated";
                  if (confirmAction === "escalate") {
                    const customer = customers.find(item => item.name === selected.customer);
                    onEscalate?.({
                      refundId: selected.id,
                      customerId: customer?.id,
                      customerName: selected.customer,
                      sourceId: selected.orderId,
                      amount: selected.amount,
                      reason: confirmReason,
                      raisedBy: "Finance Team",
                    });
                  }
                  const msg = `${selected.id} ${actionLabel} — ${selected.customer} · $${selected.amount.toFixed(2)} · Logged to Audit Trail`;
                  setRefundItems(current => current.map(refund => refund.id === selected.id ? { ...refund, status: nextStatus, processedBy: "Current user" } : refund));
                  setSelected(current => current?.id === selected.id ? { ...current, status: nextStatus, processedBy: "Current user" } : current);
                  setConfirmAction(null);
                  setActionSuccess(msg);
                  setTimeout(() => setActionSuccess(null), 4000);
                }}
                className={`flex-1 py-2 text-xs font-bold mono transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${confirmAction === "approve" ? "bg-green-800 text-white hover:bg-green-700" : confirmAction === "reject" ? "bg-red-900 border border-red-700 text-red-200 hover:bg-red-800" : "bg-[#E85D04]/20 border border-[#E85D04]/40 text-[var(--pm-secondary-text)] hover:bg-[#E85D04]/30"}`}>
                Confirm {confirmAction.charAt(0).toUpperCase() + confirmAction.slice(1)}
              </button>
            </div>
          </div>
        </div>
      )}

      {detailWalletRefund && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setDetailWalletRefund(null)}>
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto border border-[var(--pm-border)] bg-[var(--pm-surface)] p-6" onClick={event => event.stopPropagation()}>
            <div className="flex items-start justify-between border-b border-[var(--pm-border)] pb-4">
              <div><div className="text-xs font-bold uppercase tracking-wider text-[var(--pm-text-muted)]">Wallet refund request</div><div className="mt-1 text-xl font-extrabold text-[var(--pm-accent-text)] mono">{detailWalletRefund.id}</div></div>
              <button onClick={() => setDetailWalletRefund(null)} className="text-xl text-[var(--pm-text-muted)]">×</button>
            </div>
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[["Customer", detailWalletRefund.customerName], ["Source", detailWalletRefund.sourceId], ["Type", detailWalletRefund.type], ["Status", detailWalletRefund.status]].map(([label, value]) => <div key={label} className="border border-[var(--pm-border)] bg-[var(--pm-bg)] p-3"><div className="text-[10px] uppercase tracking-wider text-[var(--pm-text-muted)]">{label}</div><div className="mt-1 text-sm font-bold">{value}</div></div>)}
            </div>
            {(() => {
              const customer = customers.find(item => item.id === detailWalletRefund.customerId);
              return (
                <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div className="border border-[var(--pm-border)] bg-[var(--pm-bg)] p-4">
                    <div className="text-xs font-bold uppercase tracking-wider text-[var(--pm-text-muted)]">Customer contact</div>
                    <button onClick={() => onOpenProfile?.(detailWalletRefund.customerId)} className="mt-2 text-base font-bold underline decoration-[#F5B300]/50 underline-offset-4 hover:text-[var(--pm-accent-text)]">{detailWalletRefund.customerName}</button>
                    <div className="mt-2 text-xs text-[var(--pm-text-muted)]">{customer?.email ?? "Email unavailable"}</div>
                    <div className="mt-1 text-xs text-[var(--pm-text-muted)] mono">{customer?.phone ?? "Phone unavailable"}</div>
                    <button onClick={() => onOpenProfile?.(detailWalletRefund.customerId)} className="mt-3 text-xs font-bold text-[var(--pm-accent-text)]">Review complete customer history →</button>
                  </div>
                  <div className="border border-[var(--pm-border)] bg-[var(--pm-bg)] p-4">
                    <div className="text-xs font-bold uppercase tracking-wider text-[var(--pm-text-muted)]">Source order / plan</div>
                    <button onClick={() => onOpenOrder?.(detailWalletRefund.sourceId, detailWalletRefund.customerName, detailWalletRefund.type === "Full plan" ? "Meal Plans" : "Ready Series")} className="mt-2 text-base font-bold underline decoration-[#F5B300]/50 underline-offset-4 hover:text-[var(--pm-accent-text)] mono">{detailWalletRefund.sourceId}</button>
                    <div className="mt-2 text-xs text-[var(--pm-text-muted)]">Open the related order to verify delivery contents and status.</div>
                    <button onClick={() => onOpenOrder?.(detailWalletRefund.sourceId, detailWalletRefund.customerName, detailWalletRefund.type === "Full plan" ? "Meal Plans" : "Ready Series")} className="mt-3 text-xs font-bold text-[var(--pm-accent-text)]">Open order details →</button>
                  </div>
                </div>
              );
            })()}
            <div className="mt-4 border border-[var(--pm-border)] bg-[var(--pm-bg)] p-4">
              <div className="mb-3 text-xs font-bold uppercase tracking-wider">Refund calculation</div>
              <div className="space-y-2 text-sm mono">
                <div className="flex justify-between"><span className="text-[var(--pm-text-muted)]">Purchase amount</span><span>${detailWalletRefund.purchaseAmount.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-[var(--pm-text-muted)]">Delivery fee paid</span><span>+${detailWalletRefund.deliveryFee.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-[var(--pm-text-muted)]">Bonus credits used</span><span>-${detailWalletRefund.bonusCreditsUsed.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-[var(--pm-text-muted)]">Rewards used</span><span>-${detailWalletRefund.rewardsUsed.toFixed(2)}</span></div>
                <div className="flex justify-between border-t border-[var(--pm-border)] pt-2 text-base font-bold text-green-400"><span>Wallet refund</span><span>${detailWalletRefund.refundAmount.toFixed(2)}</span></div>
                <div className="flex justify-between text-red-400"><span>Points reversed</span><span>{detailWalletRefund.pointsReversed} pts</span></div>
              </div>
            </div>
            <div className="mt-4 border border-[var(--pm-border)] p-4"><div className="text-xs font-bold uppercase tracking-wider text-[var(--pm-text-muted)]">Reason</div><div className="mt-2 text-sm">{detailWalletRefund.reason}</div><div className="mt-3 text-xs text-[var(--pm-text-muted)] mono">Submitted {detailWalletRefund.createdAt}</div></div>
            <div className="mt-5 flex flex-wrap gap-2 border-t border-[var(--pm-border)] pt-4">
              {detailWalletRefund.status === "Pending" && <><button onClick={() => { onDecideWalletRefund?.(detailWalletRefund.id, "Rejected"); setDetailWalletRefund(current => current ? { ...current, status: "Rejected" } : current); }} className="border border-red-900/50 px-4 py-2 text-xs font-bold text-red-400">Reject</button><button onClick={() => { onDecideWalletRefund?.(detailWalletRefund.id, "Approved"); setDetailWalletRefund(current => current ? { ...current, status: "Approved" } : current); setActionSuccess(`${detailWalletRefund.id} approved — wallet credited.`); }} className="bg-green-800 px-4 py-2 text-xs font-bold text-white">Approve Wallet Refund</button></>}
              <button onClick={() => setDetailWalletRefund(null)} className="ml-auto border border-[var(--pm-border)] px-4 py-2 text-xs text-[var(--pm-text-muted)]">Close</button>
            </div>
          </div>
        </div>
      )}

      {detailRefund && (
        (() => {
          const customer = customers.find(item => item.name === detailRefund.customer);
          const relatedOrder = orders.find(order => order.id === detailRefund.orderId)
            ?? orders.find(order => order.customer === detailRefund.customer);
          const priorRefunds = refunds.filter(refund => refund.customer === detailRefund.customer);
          const priorWalletRefunds = walletRefunds.filter(refund => refund.customerName === detailRefund.customer);
          const totalRequests = priorRefunds.length + priorWalletRefunds.length;
          const approvedCount = priorRefunds.filter(refund => refund.status === "approved").length + priorWalletRefunds.filter(refund => refund.status === "Approved").length;
          const rejectedCount = priorRefunds.filter(refund => refund.status === "rejected").length + priorWalletRefunds.filter(refund => refund.status === "Rejected").length;
          const totalRequested = priorRefunds.reduce((sum, refund) => sum + refund.amount, 0) + priorWalletRefunds.reduce((sum, refund) => sum + refund.refundAmount, 0);
          const reviewLevel = totalRequests >= 3 || rejectedCount >= 2 ? "High review" : totalRequests >= 2 ? "Review history" : "Normal";
          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4" onClick={() => setDetailRefund(null)}>
              <div className="max-h-[94vh] w-full max-w-5xl overflow-y-auto border border-[var(--pm-border)] bg-[var(--pm-surface)] shadow-2xl" onClick={event => event.stopPropagation()}>
                <div className="flex items-start justify-between border-b border-[var(--pm-border)] px-6 py-5">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--pm-text-muted)]">Refund investigation</div>
                      <span className={`px-2 py-1 text-[10px] font-bold uppercase mono ${statusStyle[detailRefund.status]}`}>{detailRefund.status}</span>
                    </div>
                    <div className="mt-2 flex flex-wrap items-end gap-4">
                      <div className="text-2xl font-extrabold text-[var(--pm-accent-text)] mono">{detailRefund.id}</div>
                      <div className="text-sm text-[var(--pm-text-muted)]">{reasonLabels[detailRefund.reason]} · Requested {detailRefund.requestDate}</div>
                    </div>
                  </div>
                  <button onClick={() => setDetailRefund(null)} className="text-2xl text-[var(--pm-text-muted)] hover:text-[var(--pm-text)]">×</button>
                </div>

                <div className="grid grid-cols-1 gap-5 p-6 lg:grid-cols-[minmax(0,1fr)_320px]">
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <div className="border border-[var(--pm-border)] bg-[var(--pm-bg)] p-4">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--pm-text-muted)]">Customer</div>
                        <button disabled={!customer} onClick={() => customer && onOpenProfile?.(customer.id)} className="mt-2 text-lg font-bold text-[var(--pm-text)] underline decoration-[#F5B300]/50 underline-offset-4 hover:text-[var(--pm-accent-text)] disabled:no-underline">{detailRefund.customer}</button>
                        <div className="mt-3 space-y-1 text-xs text-[var(--pm-text-muted)]">
                          <div>{customer?.email ?? "Email not available"}</div>
                          <div className="mono">{customer?.phone ?? "Phone not available"}</div>
                          <div className="pt-1">{customer?.address ?? "Address not available"}</div>
                        </div>
                        {customer && <button onClick={() => onOpenProfile?.(customer.id)} className="mt-3 text-xs font-bold text-[var(--pm-accent-text)]">Open complete customer history →</button>}
                      </div>

                      <div className="border border-[var(--pm-border)] bg-[var(--pm-bg)] p-4">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--pm-text-muted)]">Order / Plan under review</div>
                        <button onClick={() => onOpenOrder?.(detailRefund.orderId, detailRefund.customer, detailRefund.stream)} className="mt-2 text-lg font-bold text-[var(--pm-text)] underline decoration-[#F5B300]/50 underline-offset-4 hover:text-[var(--pm-accent-text)] mono">{detailRefund.orderId}</button>
                        <div className="mt-3 text-xs text-[var(--pm-text-muted)]">{relatedOrder?.productName ?? relatedOrder?.planType ?? detailRefund.stream}</div>
                        {relatedOrder && <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--pm-text-muted)] mono"><span>{relatedOrder.id}</span><span>{relatedOrder.date}</span><span>{relatedOrder.status}</span><span>${relatedOrder.total.toFixed(2)}</span></div>}
                        <button onClick={() => onOpenOrder?.(detailRefund.orderId, detailRefund.customer, detailRefund.stream)} className="mt-3 text-xs font-bold text-[var(--pm-accent-text)]">Open delivered order details →</button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      <div className="border border-[var(--pm-border)] bg-[var(--pm-bg)] p-4"><div className="text-[10px] uppercase tracking-wider text-[var(--pm-text-muted)]">Requested refund</div><div className="mt-2 text-2xl font-extrabold text-green-400 mono">${detailRefund.amount.toFixed(2)}</div><div className="mt-1 text-xs text-[var(--pm-text-muted)]">Destination: customer wallet</div></div>
                      <div className="border border-[var(--pm-border)] bg-[var(--pm-bg)] p-4"><div className="text-[10px] uppercase tracking-wider text-[var(--pm-text-muted)]">Original order</div><div className="mt-2 text-2xl font-extrabold mono">${relatedOrder?.total.toFixed(2) ?? "—"}</div><div className="mt-1 text-xs text-[var(--pm-text-muted)]">{relatedOrder ? `${Math.round((detailRefund.amount / relatedOrder.total) * 100)}% requested` : "Order amount unavailable"}</div></div>
                      <div className="border border-[var(--pm-border)] bg-[var(--pm-bg)] p-4"><div className="text-[10px] uppercase tracking-wider text-[var(--pm-text-muted)]">Business stream</div><div className="mt-2 text-lg font-bold">{detailRefund.stream}</div><div className="mt-1 text-xs text-[var(--pm-text-muted)]">Processed by {detailRefund.processedBy ?? "Awaiting reviewer"}</div></div>
                    </div>

                    <div className="border border-[var(--pm-border)] bg-[var(--pm-bg)] p-4">
                      <div className="text-xs font-bold uppercase tracking-wider">Customer’s claim</div>
                      <div className="mt-3 border-l-2 border-[#F5B300] pl-4 text-sm leading-relaxed text-[var(--pm-text-secondary)]">{detailRefund.notes}</div>
                    </div>

                    <div className="border border-[var(--pm-border)] bg-[var(--pm-bg)]">
                      <div className="flex items-center justify-between border-b border-[var(--pm-border)] px-4 py-3">
                        <div><div className="text-xs font-bold uppercase tracking-wider">Related delivery contents</div><div className="mt-1 text-[10px] text-[var(--pm-text-muted)]">Review what was scheduled before approving a wrong-order or quality claim.</div></div>
                        {relatedOrder && <span className="text-xs text-[var(--pm-text-muted)] mono">{relatedOrder.meals} meals · {relatedOrder.deliveryWindow}</span>}
                      </div>
                      {relatedOrder?.mealList?.length ? (
                        <div className="divide-y divide-[var(--pm-border-soft)]">
                          {relatedOrder.mealList.map((meal, index) => <div key={`${meal.name}-${index}`} className="flex items-center justify-between gap-4 px-4 py-3"><div><div className="text-sm font-semibold">{meal.name}</div><div className="mt-1 text-xs text-[var(--pm-text-muted)]">{meal.session} · {meal.calories} kcal</div></div><div className="text-xs text-[var(--pm-text-muted)] mono">P {meal.protein}g · C {meal.carbs}g · F {meal.fat}g</div></div>)}
                        </div>
                      ) : <div className="p-5 text-sm text-[var(--pm-text-muted)]">Detailed meal contents are unavailable for this historical order. Open the linked order for the latest available record.</div>}
                    </div>
                  </div>

                  <aside className="space-y-4">
                    <div className={`border p-4 ${reviewLevel === "High review" ? "border-red-800/50 bg-red-950/20" : reviewLevel === "Review history" ? "border-yellow-800/50 bg-yellow-950/20" : "border-green-800/40 bg-green-950/10"}`}>
                      <div className="flex items-center justify-between"><div className="text-xs font-bold uppercase tracking-wider">Refund behavior</div><span className={`text-[10px] font-bold uppercase mono ${reviewLevel === "High review" ? "text-red-400" : reviewLevel === "Review history" ? "text-yellow-400" : "text-green-400"}`}>{reviewLevel}</span></div>
                      <div className="mt-4 grid grid-cols-2 gap-3">
                        {[["Requests", totalRequests], ["Requested", `$${totalRequested.toFixed(2)}`], ["Approved", approvedCount], ["Rejected", rejectedCount]].map(([label, value]) => <div key={label} className="border border-[var(--pm-border)] bg-[var(--pm-bg)] p-3"><div className="text-[10px] uppercase text-[var(--pm-text-muted)]">{label}</div><div className="mt-1 text-lg font-bold mono">{value}</div></div>)}
                      </div>
                      <button disabled={!customer} onClick={() => customer && onOpenProfile?.(customer.id)} className="mt-3 w-full border border-[var(--pm-border)] py-2 text-xs font-bold text-[var(--pm-text-secondary)] disabled:opacity-40">Review full customer history</button>
                    </div>

                    <div className="border border-[var(--pm-border)] bg-[var(--pm-bg)] p-4">
                      <div className="text-xs font-bold uppercase tracking-wider">Prior refund requests</div>
                      <div className="mt-3 space-y-2">
                        {priorRefunds.map(refund => <div key={refund.id} className="border-b border-[var(--pm-border-soft)] pb-2 text-xs last:border-0"><div className="flex justify-between"><span className="font-bold text-[var(--pm-accent-text)] mono">{refund.id}</span><span className="capitalize text-[var(--pm-text-muted)]">{refund.status}</span></div><div className="mt-1 flex justify-between text-[var(--pm-text-muted)]"><span>{reasonLabels[refund.reason]}</span><span className="mono">${refund.amount.toFixed(2)}</span></div></div>)}
                      </div>
                    </div>

                    <div className="border border-[var(--pm-border)] bg-[var(--pm-bg)] p-4">
                      <div className="text-xs font-bold uppercase tracking-wider">Review checklist</div>
                      <div className="mt-3 space-y-2 text-xs text-[var(--pm-text-muted)]">
                        <div>Customer identity and contact verified</div>
                        <div>Related order and delivered meals reviewed</div>
                        <div>Previous refund behavior checked</div>
                        <div>Wallet amount and point reversal confirmed</div>
                      </div>
                    </div>

                    <CustomerContactPanel
                      customerName={detailRefund.customer}
                      email={customer?.email}
                      phone={customer?.phone}
                      refundId={detailRefund.id}
                      sourceId={detailRefund.orderId}
                    />
                  </aside>
                </div>

                <div className="flex flex-wrap gap-2 border-t border-[var(--pm-border)] px-6 py-4">
                  {detailRefund.status === "pending" && <><button onClick={() => { setSelected(detailRefund); setDetailRefund(null); setConfirmAction("reject"); setConfirmReason(""); }} className="border border-red-900/50 px-4 py-2 text-xs font-bold text-red-400">Reject</button><button onClick={() => { setSelected(detailRefund); setDetailRefund(null); setConfirmAction("escalate"); setConfirmReason(""); }} className="border border-[#E85D04]/50 px-4 py-2 text-xs font-bold text-[var(--pm-secondary-text)]">Escalate</button><button onClick={() => { setSelected(detailRefund); setDetailRefund(null); setConfirmAction("approve"); setConfirmReason(""); }} className="bg-green-800 px-4 py-2 text-xs font-bold text-white">Approve Wallet Refund</button></>}
                  <button onClick={() => setDetailRefund(null)} className="ml-auto border border-[var(--pm-border)] px-4 py-2 text-xs text-[var(--pm-text-muted)]">Close</button>
                </div>
              </div>
            </div>
          );
        })()
      )}
    </div>
  );
}
