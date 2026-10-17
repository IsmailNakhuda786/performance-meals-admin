import { useEffect, useState } from "react";
import StatusBadge from "../components/StatusBadge";
import PendingWorkBanner from "../components/PendingWorkBanner";
import { customers, goalLabel, orders, subscriptions, type OrderStatus, type PlanType, type WalletRefund } from "../data";
import type { BusinessStream } from "../App";
import { downloadCSV, downloadExcel, printHtml, nowStr, nowTime } from "../utils/flowUtils";
import { readLocalState, writeLocalState } from "../utils/localState";

const statuses: OrderStatus[] = ["Confirmed", "Packing", "Packed", "Out for Delivery", "Delivered", "Pending", "Cancelled"];
const mpTypes: PlanType[] = ["Meal Plan"];
const rsTypes: PlanType[] = ["Ready Series Subscription", "Ready Series A-la-carte", "Ready Series Bundle"];

type Order = typeof orders[0];

function slipHtml(o: Order) {
  return `<div class="badge">PERFORMANCE MEALS</div>
<h1>Order Slip</h1>
<div class="meta">Order: ${o.id} · ${o.customer} · ${nowStr()}</div>
<table>
  <tr><th>Field</th><th>Value</th></tr>
  <tr><td>Plan Type</td><td>${o.planType}</td></tr>
  <tr><td>Meals</td><td>${o.meals}</td></tr>
  <tr><td>Total</td><td>$${o.total.toFixed(2)}</td></tr>
  <tr><td>Delivery Window</td><td>${o.deliveryWindow}</td></tr>
  <tr><td>Status</td><td>${o.status}</td></tr>
</table>
<div class="footer">Printed: ${nowStr()} ${nowTime()} · Performance Meals Admin v3</div>`;
}

function orderExportRows(o: Order) {
  const meals = o.mealList?.length ? o.mealList : [null];
  return meals.map((meal, index) => ({
    "Order ID": o.id,
    Customer: o.customer,
    "Order Date": o.date,
    Status: o.status,
    Product: o.productName ?? o.planType,
    "Delivery Window": o.deliveryWindow,
    Address: o.address,
    Phone: o.phone,
    "Order Total": o.total,
    "Item Number": index + 1,
    "Meal / Item": meal?.name ?? o.productName ?? `${o.meals} items`,
    Session: meal?.session ?? "",
    Calories: meal?.calories ?? "",
    "Protein (g)": meal?.protein ?? "",
    "Carbs (g)": meal?.carbs ?? "",
    "Fat (g)": meal?.fat ?? "",
  }));
}

function orderDetailsHtml(o: Order) {
  const itemRows = o.mealList?.length
    ? o.mealList.map((meal, index) => `<tr><td>${index + 1}</td><td>${meal.name}</td><td>${meal.session}</td><td>${meal.calories}</td><td>${meal.protein}g</td><td>${meal.carbs}g</td><td>${meal.fat}g</td></tr>`).join("")
    : `<tr><td>1</td><td colspan="6">${o.productName ?? `${o.meals} items`}</td></tr>`;
  return `<div class="badge">PERFORMANCE MEALS</div>
<h1>Order Details — ${o.id}</h1>
<div class="meta">${o.customer} · ${o.date} · Exported ${nowStr()} ${nowTime()}</div>
<table>
  <tr><th>Field</th><th>Value</th></tr>
  <tr><td>Status</td><td>${o.status}</td></tr>
  <tr><td>Product / Package</td><td>${o.productName ?? o.planType}</td></tr>
  <tr><td>Meals</td><td>${o.meals}</td></tr>
  <tr><td>Total</td><td>$${o.total.toFixed(2)}</td></tr>
  <tr><td>Delivery Window</td><td>${o.deliveryWindow}</td></tr>
  <tr><td>Phone</td><td>${o.phone}</td></tr>
  <tr><td>Address</td><td>${o.address}</td></tr>
</table>
<h1 style="margin-top:20px">Order Items</h1>
<table>
  <tr><th>#</th><th>Meal / Item</th><th>Session</th><th>Kcal</th><th>Protein</th><th>Carbs</th><th>Fat</th></tr>
  ${itemRows}
</table>
<div class="footer">Performance Meals Admin · ${o.id}</div>`;
}

export default function Orders({
  stream,
  onOpenProfile,
  onCreateWalletRefund,
  focusedOrder,
  onPendingCountChange,
}: {
  stream: BusinessStream;
  onOpenProfile: (customerId: string) => void;
  onCreateWalletRefund: (refund: Omit<WalletRefund, "id" | "status" | "createdAt">) => void;
  focusedOrder?: { sourceId: string; customerName: string };
  onPendingCountChange?: (count: number) => void;
}) {
  const [orderItems, setOrderItems] = useState(() => readLocalState("pm-orders-workflow", orders));
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [refundModal, setRefundModal] = useState<Order | null>(null);
  const [refundReason, setRefundReason] = useState("");
  const [refundConfirmed, setRefundConfirmed] = useState(false);
  const [detailOrder, setDetailOrder] = useState<Order | null>(null);
  const [refundType, setRefundType] = useState<"full" | "partial" | "custom">("full");
  const [selectedRefundItems, setSelectedRefundItems] = useState<Set<number>>(new Set());
  const [customRefundAmount, setCustomRefundAmount] = useState("");
  const [bonusCreditsUsed, setBonusCreditsUsed] = useState("0");
  const [rewardsUsed, setRewardsUsed] = useState("0");

  useEffect(() => {
    if (!focusedOrder) return;
    const sourceSubscription = subscriptions.find(subscription => subscription.id === focusedOrder.sourceId);
    const customerName = sourceSubscription?.customerName ?? focusedOrder.customerName;
    const matchingOrder = orders.find(order => order.id === focusedOrder.sourceId)
      ?? orders.find(order => order.customer === customerName);
    if (matchingOrder) setDetailOrder(matchingOrder);
  }, [focusedOrder]);

  const streamOrders = orderItems.filter(o =>
    stream === "meal-plans" ? o.planType === "Meal Plan" : o.planType !== "Meal Plan"
  );
  const pendingOrders = streamOrders.filter(order => order.status === "Pending");

  useEffect(() => {
    onPendingCountChange?.(pendingOrders.length);
  }, [onPendingCountChange, pendingOrders.length]);

  useEffect(() => {
    writeLocalState("pm-orders-workflow", orderItems);
  }, [orderItems]);

  const types = stream === "meal-plans" ? mpTypes : rsTypes;
  const accent = stream === "meal-plans" ? "#F5B300" : "#E85D04";

  const filtered = streamOrders.filter(o => {
    if (statusFilter !== "All" && o.status !== statusFilter) return false;
    if (typeFilter !== "All" && o.planType !== typeFilter) return false;
    return true;
  });

  const toggleAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map(o => o.id)));
  };

  const toggle = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelected(next);
  };

  const exportRows = (list: Order[]) =>
    list.map(o => ({ id: o.id, customer: o.customer, planType: o.planType, meals: o.meals, total: o.total, window: o.deliveryWindow, status: o.status }));

  const handlePrintSlip = (o: Order) => {
    printHtml("Order Slip — Performance Meals", slipHtml(o));
  };

  const confirmOrder = (order: Order) => {
    setOrderItems(current => current.map(item => item.id === order.id ? { ...item, status: "Confirmed" } : item));
    setDetailOrder(current => current?.id === order.id ? { ...current, status: "Confirmed" } : current);
  };

  const handlePrintSelected = () => {
    const selectedOrders = filtered.filter(o => selected.has(o.id));
    const html = selectedOrders.map(slipHtml).join('<hr style="margin:20px 0"/>');
    printHtml("Order Slips — Performance Meals", html);
  };

  const handleRefundConfirm = () => {
    if (!refundModal || !refundReason.trim()) return;
    const customer = customers.find(item => item.name === refundModal.customer);
    if (!customer) return;
    const deliveryFee = refundModal.total >= 125 ? 0 : refundModal.total >= 75 ? 5 : 10;
    const maximumRefund = Math.max(0, refundModal.total + deliveryFee - Number(bonusCreditsUsed || 0) - Number(rewardsUsed || 0));
    const partialAmount = selectedRefundItems.size * (refundModal.total / Math.max(1, refundModal.meals));
    const refundAmount = refundType === "full" ? maximumRefund : refundType === "partial" ? partialAmount : Number(customRefundAmount);
    if (!Number.isFinite(refundAmount) || refundAmount <= 0 || refundAmount > maximumRefund) return;
    onCreateWalletRefund({
      customerId: customer.id,
      customerName: customer.name,
      sourceId: refundModal.id,
      type: refundType === "full" ? (refundModal.planType === "Meal Plan" ? "Full plan" : "Full order") : refundType === "partial" ? "Partial items" : "Custom amount",
      purchaseAmount: refundModal.total,
      deliveryFee,
      bonusCreditsUsed: Number(bonusCreditsUsed || 0),
      rewardsUsed: Number(rewardsUsed || 0),
      refundAmount,
      pointsReversed: refundType === "full" ? Math.floor(Math.max(0, refundModal.total - Number(bonusCreditsUsed || 0) - Number(rewardsUsed || 0))) : Math.floor(refundAmount),
      reason: refundReason.trim(),
    });
    setRefundConfirmed(true);
  };

  const handleRefundClose = () => {
    setRefundModal(null);
    setRefundReason("");
    setRefundConfirmed(false);
    setRefundType("full");
    setSelectedRefundItems(new Set());
    setCustomRefundAmount("");
    setBonusCreditsUsed("0");
    setRewardsUsed("0");
  };

  return (
    <>
    {detailOrder && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setDetailOrder(null)}>
        <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto border border-[var(--pm-border)] bg-[var(--pm-surface)]" onClick={event => event.stopPropagation()}>
          <div className="flex items-start justify-between border-b border-[var(--pm-border)] px-5 py-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[var(--pm-text-muted)]">Order details</div>
              <div className="mt-1 text-lg font-extrabold mono" style={{ color: accent }}>{detailOrder.id}</div>
            </div>
            <button onClick={() => setDetailOrder(null)} className="text-xl text-[var(--pm-text-muted)]">×</button>
          </div>
          <div className="space-y-5 p-5">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["Status", detailOrder.status],
                ["Order date", detailOrder.date],
                ["Meals", String(detailOrder.meals)],
                ["Total", `$${detailOrder.total.toFixed(2)}`],
              ].map(([label, value]) => (
                <div key={label} className="border border-[var(--pm-border)] bg-[var(--pm-bg)] p-3">
                  <div className="text-[10px] uppercase tracking-wider text-[var(--pm-text-muted)]">{label}</div>
                  <div className="mt-1 text-sm font-bold text-[var(--pm-text-secondary)]">{value}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-4 border border-[var(--pm-border)] bg-[var(--pm-bg)] p-4 sm:grid-cols-2">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-[var(--pm-text)]">Customer</div>
                <button onClick={() => {
                  const customer = customers.find(item => item.name === detailOrder.customer);
                  if (customer) onOpenProfile(customer.id);
                }} className="mt-2 font-semibold text-[var(--pm-text)] underline decoration-[var(--pm-border-strong)] underline-offset-2 hover:text-[var(--pm-accent-text)]">
                  {detailOrder.customer}
                </button>
                <div className="mt-1 text-xs text-[var(--pm-text-muted)] mono">{detailOrder.phone}</div>
                <div className="mt-2 text-xs text-[var(--pm-text-muted)]">{detailOrder.address}</div>
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-[var(--pm-text)]">Product & delivery</div>
                <div className="mt-2 text-sm font-semibold">{detailOrder.productName ?? detailOrder.planType}</div>
                {detailOrder.goal && <div className="mt-1 text-xs text-[var(--pm-text-muted)]">Goal: {goalLabel(detailOrder.goal)}</div>}
                <div className="mt-2 text-xs text-[var(--pm-text-muted)]">Delivery window</div>
                <div className="mt-1 text-sm font-semibold mono">{detailOrder.deliveryWindow}</div>
              </div>
            </div>

            <div>
              <div className="mb-2 text-xs font-bold uppercase tracking-wider text-[var(--pm-text)]">Order items</div>
              {detailOrder.mealList?.length ? (
                <div className="divide-y divide-[var(--pm-border-soft)] border border-[var(--pm-border)]">
                  {detailOrder.mealList.map((meal, index) => (
                    <div key={`${meal.name}-${index}`} className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 p-3">
                      <div>
                        <div className="text-sm font-semibold">{meal.name}</div>
                        <div className="mt-1 text-xs text-[var(--pm-text-muted)]">{meal.session} · {meal.calories} kcal</div>
                      </div>
                      <div className="text-right text-xs text-[var(--pm-text-muted)] mono">P {meal.protein}g · C {meal.carbs}g · F {meal.fat}g</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border border-[var(--pm-border)] bg-[var(--pm-bg)] p-4 text-sm text-[var(--pm-text-muted)]">{detailOrder.productName ?? `${detailOrder.meals} items`}</div>
              )}
            </div>

            <div className="flex flex-wrap gap-2 border-t border-[var(--pm-border)] pt-4">
              <button onClick={() => handlePrintSlip(detailOrder)} className="border border-[var(--pm-border)] px-4 py-2 text-xs font-bold text-[var(--pm-text-secondary)] mono">Print slip</button>
              <button onClick={() => downloadCSV(`order-${detailOrder.id}.csv`, orderExportRows(detailOrder))} className="border border-[var(--pm-border)] px-4 py-2 text-xs font-bold text-[var(--pm-text-secondary)] mono">Download CSV</button>
              <button onClick={() => printHtml(`Order Details — ${detailOrder.id}`, orderDetailsHtml(detailOrder), true)} className="border border-[var(--pm-border)] px-4 py-2 text-xs font-bold text-[var(--pm-text-secondary)] mono">Download PDF</button>
              {detailOrder.status !== "Cancelled" && <button onClick={() => {
                setRefundModal(detailOrder);
                setDetailOrder(null);
                setRefundReason("");
                setRefundConfirmed(false);
              }} className="border border-[#E85D04]/50 px-4 py-2 text-xs font-bold text-[var(--pm-secondary-text)] mono">Start refund request</button>}
              <button onClick={() => setDetailOrder(null)} className="ml-auto border border-[var(--pm-border)] px-4 py-2 text-xs text-[var(--pm-text-muted)]">Close</button>
            </div>
          </div>
        </div>
      </div>
    )}
    {refundModal && (
      <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={handleRefundClose}>
        <div
          className="bg-[var(--pm-surface)] border border-[var(--pm-border)] w-full max-w-md"
          onClick={e => e.stopPropagation()}
        >
          <div className="border-b border-[var(--pm-border)] px-5 py-3 flex items-center justify-between">
            <span className="text-sm font-bold mono" style={{ color: "#E85D04" }}>Wallet Refund Request</span>
            <button onClick={handleRefundClose} className="text-[var(--pm-text-muted)] hover:text-[var(--pm-text-secondary)] text-lg leading-none">×</button>
          </div>
          <div className="px-5 py-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mono">
              <span className="text-[var(--pm-text-muted)]">Order ID</span><span style={{ color: "#E85D04" }}>{refundModal.id}</span>
              <span className="text-[var(--pm-text-muted)]">Customer</span><span className="text-[var(--pm-text-secondary)]">{refundModal.customer}</span>
              <span className="text-[var(--pm-text-muted)]">Amount</span><span className="text-[var(--pm-text-secondary)] font-bold">${refundModal.total.toFixed(2)}</span>
              <span className="text-[var(--pm-text-muted)]">Status</span><span className="text-[var(--pm-text-secondary)]">{refundModal.status}</span>
            </div>
            <div className="border border-blue-800/40 bg-blue-950/20 px-3 py-2 text-xs text-blue-300">
              Approved refunds are deposited into the customer wallet. Full refunds include any delivery fee paid, deduct bonus credits and rewards used, and reverse points earned.
            </div>
            {!refundConfirmed ? (
              <>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    ["full", refundModal.planType === "Meal Plan" ? "Full Plan" : "Full Order"],
                    ["partial", "Partial Items"],
                    ["custom", "Custom Amount"],
                  ].map(([value, label]) => (
                    <button key={value} onClick={() => setRefundType(value as "full" | "partial" | "custom")} className={`border px-2 py-2 text-xs font-bold ${refundType === value ? "border-[#F5B300] bg-[#F5B300]/10 text-[var(--pm-accent-text)]" : "border-[var(--pm-border)] text-[var(--pm-text-muted)]"}`}>
                      {label}
                    </button>
                  ))}
                </div>

                {refundType === "full" && (
                  <div className="space-y-3 border border-[var(--pm-border)] bg-[var(--pm-bg)] p-3">
                    <div className="text-xs font-bold uppercase tracking-wider text-[var(--pm-text)]">Full refund calculation</div>
                    <div className="grid grid-cols-2 gap-3">
                      <label className="text-xs text-[var(--pm-text-muted)]">Bonus credits used
                        <input type="number" min="0" step="0.01" value={bonusCreditsUsed} onChange={event => setBonusCreditsUsed(event.target.value)} className="mt-1 block w-full border border-[var(--pm-border)] bg-[var(--pm-surface)] px-3 py-2 text-[var(--pm-text-secondary)]" />
                      </label>
                      <label className="text-xs text-[var(--pm-text-muted)]">Reward value used
                        <input type="number" min="0" step="0.01" value={rewardsUsed} onChange={event => setRewardsUsed(event.target.value)} className="mt-1 block w-full border border-[var(--pm-border)] bg-[var(--pm-surface)] px-3 py-2 text-[var(--pm-text-secondary)]" />
                      </label>
                    </div>
                    {(() => {
                      const deliveryFee = refundModal.total >= 125 ? 0 : refundModal.total >= 75 ? 5 : 10;
                      const amount = Math.max(0, refundModal.total + deliveryFee - Number(bonusCreditsUsed || 0) - Number(rewardsUsed || 0));
                      return (
                        <div className="space-y-1 border-t border-[var(--pm-border)] pt-2 text-xs mono">
                          <div className="flex justify-between"><span className="text-[var(--pm-text-muted)]">Purchase</span><span>${refundModal.total.toFixed(2)}</span></div>
                          <div className="flex justify-between"><span className="text-[var(--pm-text-muted)]">Delivery fee paid</span><span>+${deliveryFee.toFixed(2)}</span></div>
                          <div className="flex justify-between"><span className="text-[var(--pm-text-muted)]">Bonus credits and rewards</span><span>-${(Number(bonusCreditsUsed || 0) + Number(rewardsUsed || 0)).toFixed(2)}</span></div>
                          <div className="flex justify-between pt-1 text-sm font-bold text-green-400"><span>Wallet refund</span><span>${amount.toFixed(2)}</span></div>
                          <div className="flex justify-between text-red-400"><span>Points reversed</span><span>{Math.floor(Math.max(0, refundModal.total - Number(bonusCreditsUsed || 0) - Number(rewardsUsed || 0)))} pts</span></div>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {refundType === "partial" && (
                  <div className="space-y-2 border border-[var(--pm-border)] bg-[var(--pm-bg)] p-3">
                    <div className="text-xs font-bold uppercase tracking-wider text-[var(--pm-text)]">Select refunded items</div>
                    {(refundModal.mealList ?? []).map((meal, index) => (
                      <label key={`${meal.name}-${index}`} className="flex items-center gap-3 border-b border-[var(--pm-border-soft)] py-2 text-xs">
                        <input type="checkbox" checked={selectedRefundItems.has(index)} onChange={event => setSelectedRefundItems(current => {
                          const next = new Set(current);
                          if (event.target.checked) next.add(index); else next.delete(index);
                          return next;
                        })} />
                        <span className="flex-1">{meal.name}</span>
                        <span className="mono">${(refundModal.total / Math.max(1, refundModal.meals)).toFixed(2)}</span>
                      </label>
                    ))}
                    {!refundModal.mealList?.length && <div className="text-xs text-[var(--pm-text-muted)]">Item-level data is unavailable. Use Custom Amount instead.</div>}
                    <div className="flex justify-between pt-1 text-sm font-bold text-green-400"><span>Wallet refund</span><span>${(selectedRefundItems.size * (refundModal.total / Math.max(1, refundModal.meals))).toFixed(2)}</span></div>
                  </div>
                )}

                {refundType === "custom" && (
                  <label className="block text-xs text-[var(--pm-text-muted)]">Custom wallet refund amount
                    <input type="number" min="0.01" max={refundModal.total + (refundModal.total >= 125 ? 0 : refundModal.total >= 75 ? 5 : 10)} step="0.01" value={customRefundAmount} onChange={event => setCustomRefundAmount(event.target.value)} placeholder="0.00" className="mt-1 block w-full border border-[var(--pm-border)] bg-[var(--pm-bg)] px-3 py-2 text-[var(--pm-text-secondary)]" />
                  </label>
                )}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[var(--pm-text)] uppercase tracking-wider">Reason <span className="text-[var(--pm-secondary-text)]">*</span></label>
                  <textarea
                    value={refundReason}
                    onChange={e => setRefundReason(e.target.value)}
                    rows={3}
                    placeholder="Describe the reason for this refund…"
                    className="w-full bg-[var(--pm-bg)] border border-[var(--pm-border)] text-[var(--pm-text-secondary)] text-xs px-3 py-2 mono focus:outline-none focus:border-[#E85D04] resize-none"
                  />
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={handleRefundConfirm}
                    disabled={!refundReason.trim() || (refundType === "partial" && selectedRefundItems.size === 0) || (refundType === "custom" && Number(customRefundAmount) <= 0)}
                    className="flex-1 text-xs font-bold py-2 px-3 mono transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ background: "#E85D04", color: "#000" }}
                  >
                    Submit for Approval
                  </button>
                  <button onClick={handleRefundClose} className="text-xs border border-[var(--pm-border)] text-[var(--pm-text-muted)] px-4 py-2 mono hover:border-[#E8E8E8] hover:text-[var(--pm-text-secondary)] transition-colors">
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <div className="border border-green-700/50 bg-green-950/30 px-3 py-3 text-xs text-green-300 mono">
                Refund request submitted for approval. On approval, the calculated amount will be deposited into the customer wallet and earned points will be reversed.
              </div>
            )}
          </div>
        </div>
      </div>
    )}
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold">Orders</h2>
        <div className="flex gap-2">
          {selected.size > 0 && (
            <button
              onClick={handlePrintSelected}
              className="text-black px-4 py-2 text-sm font-bold transition-colors mono"
              style={{ background: accent }}
            >
              Print {selected.size} Slip{selected.size > 1 ? "s" : ""}
            </button>
          )}
          <button onClick={() => downloadCSV(`orders-${nowStr()}.csv`, exportRows(filtered))} className="border border-[var(--pm-border-strong)] text-[var(--pm-text-secondary)] text-xs px-3 py-2 mono hover:border-[#F5B300] hover:text-[var(--pm-accent-text)] transition-colors">CSV ↓</button>
          <button onClick={() => downloadExcel(`orders-${nowStr()}.xls`, exportRows(filtered))} className="border border-[var(--pm-border-strong)] text-[var(--pm-text-secondary)] text-xs px-3 py-2 mono hover:border-[#F5B300] hover:text-[var(--pm-accent-text)] transition-colors">Excel ↓</button>
          <button onClick={() => printHtml("Orders Export — Performance Meals", `<h1>Orders Export</h1><div class="meta">${filtered.length} orders · ${nowStr()} ${nowTime()}</div><table><tr>${["Order ID","Customer","Plan Type","Meals","Total","Delivery Window","Status"].map(h=>`<th>${h}</th>`).join("")}</tr>${filtered.map(o=>`<tr><td>${o.id}</td><td>${o.customer}</td><td>${o.planType}</td><td>${o.meals}</td><td>$${o.total.toFixed(2)}</td><td>${o.deliveryWindow}</td><td>${o.status}</td></tr>`).join("")}</table><div class="footer">Exported: ${nowStr()} ${nowTime()} · Performance Meals Admin v3</div>`)} className="border border-[var(--pm-border-strong)] text-[var(--pm-text-secondary)] text-xs px-3 py-2 mono hover:border-[#F5B300] hover:text-[var(--pm-accent-text)] transition-colors">PDF ↓</button>
        </div>
      </div>

      <PendingWorkBanner
        count={pendingOrders.length}
        itemLabel="pending order"
        detail={pendingOrders.length === 1
          ? `${pendingOrders[0].id} · ${pendingOrders[0].customer} is awaiting order confirmation.`
          : "These orders are awaiting confirmation before fulfilment can continue."}
        reviewing={statusFilter === "Pending"}
        onReview={() => {
          setStatusFilter("Pending");
          setTypeFilter("All");
        }}
        onShowAll={() => setStatusFilter("All")}
      />

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[var(--pm-text)] uppercase tracking-wider">Status</span>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-[var(--pm-surface)] border border-[var(--pm-border)] text-[var(--pm-text-secondary)] text-sm px-3 py-1.5 mono focus:outline-none focus:border-[#F5B300]"
          >
            <option value="All">All</option>
            {statuses.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[var(--pm-text)] uppercase tracking-wider">Type</span>
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="bg-[var(--pm-surface)] border border-[var(--pm-border)] text-[var(--pm-text-secondary)] text-sm px-3 py-1.5 mono focus:outline-none focus:border-[#F5B300]"
          >
            <option value="All">All</option>
            {types.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div className="ml-auto text-xs text-[var(--pm-text-muted)] mono self-center">{filtered.length} orders</div>
      </div>

      <div className="border border-[var(--pm-border)] bg-[var(--pm-surface)] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--pm-border)]">
              <th className="px-4 py-2 w-8">
                <input type="checkbox" checked={selected.size === filtered.length && filtered.length > 0} onChange={toggleAll}
                  className="accent-[#F5B300]" />
              </th>
              {["Order ID", "Customer", "Product / Package", "Meals", "Total", "Delivery Window", "Status", "Action"].map(h => (
                <th key={h} className="px-4 py-2 text-left text-xs font-bold text-[var(--pm-text)] uppercase tracking-wider font-medium whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((o, i) => (
              <tr
                key={o.id}
                onClick={() => setDetailOrder(o)}
                className={`cursor-pointer border-b border-[var(--pm-border)] transition-colors hover:bg-[var(--pm-surface-subtle)] ${o.status === "Pending" ? "border-l-2 border-l-[#F5B300] bg-[#F5B300]/5" : i % 2 === 0 ? "" : "bg-[var(--pm-surface-subtle)]"}`}
              >
                <td className="px-4 py-2.5" onClick={event => event.stopPropagation()}>
                  <input type="checkbox" checked={selected.has(o.id)} onChange={() => toggle(o.id)} className="accent-[#F5B300]" />
                </td>
                <td className="px-4 py-2.5">
                  <button onClick={() => setDetailOrder(o)} className="mono text-xs font-bold underline underline-offset-2" style={{ color: accent }}>{o.id}</button>
                </td>
                <td className="px-4 py-2.5">
                  <button onClick={event => {
                    event.stopPropagation();
                    const customer = customers.find(item => item.name === o.customer);
                    if (customer) onOpenProfile(customer.id);
                  }} className="font-semibold text-[var(--pm-text)] underline decoration-[var(--pm-border-strong)] underline-offset-2 hover:text-[var(--pm-accent-text)]">
                    {o.customer}
                  </button>
                </td>
                <td className="px-4 py-2.5 text-xs text-[var(--pm-text-muted)]">
                  {o.productName ?? o.planType}
                  {o.goal && <span className="ml-1 text-[var(--pm-secondary-text)] font-bold">{goalLabel(o.goal)}</span>}
                </td>
                <td className="px-4 py-2.5 mono text-center">{o.meals}</td>
                <td className="px-4 py-2.5 mono font-bold" style={{ color: accent }}>${o.total.toFixed(2)}</td>
                <td className="px-4 py-2.5 mono text-xs text-[var(--pm-text-muted)]">{o.deliveryWindow}</td>
                <td className="px-4 py-2.5">
                  <StatusBadge status={o.status} />
                  {o.status === "Pending" && <div className="mt-1 text-[10px] font-bold text-[var(--pm-accent-text)]">Action required</div>}
                </td>
                <td className="px-4 py-2.5" onClick={event => event.stopPropagation()}>
                  <div className="flex flex-wrap gap-1">
                    <button onClick={() => setDetailOrder(o)} className="border border-[#F5B300]/50 bg-[#F5B300]/10 px-2 py-1 text-xs font-bold text-[var(--pm-accent-text)] transition-colors hover:bg-[#F5B300]/20 mono">
                      View Details
                    </button>
                    {o.status === "Pending" && (
                      <button onClick={() => confirmOrder(o)} className="border border-green-700 bg-green-50 px-2 py-1 text-xs font-bold text-green-800 transition-colors hover:bg-green-100 mono">
                        Confirm order
                      </button>
                    )}
                    <button onClick={() => handlePrintSlip(o)} className="text-xs border border-[var(--pm-border)] px-2 py-1 text-[var(--pm-text-muted)] hover:border-[#F5B300] hover:text-[var(--pm-accent-text)] transition-colors mono">
                      Print Slip
                    </button>
                    {o.status !== "Cancelled" && (
                      <button onClick={() => { setRefundModal(o); setRefundReason(""); setRefundConfirmed(false); }}
                        title="Create a refund request to be deposited into the customer wallet after approval"
                        className="text-xs border border-[var(--pm-border)] px-2 py-1 text-[var(--pm-text-muted)] hover:border-[#E85D04] hover:text-[var(--pm-secondary-text)] transition-colors mono">
                        Refund to Wallet
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </>
  );
}
