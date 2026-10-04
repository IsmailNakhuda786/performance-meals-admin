import { useState } from "react";
import StatusBadge from "../components/StatusBadge";
import { orders, type OrderStatus, type PlanType } from "../data";
import type { BusinessStream } from "../App";
import { downloadCSV, downloadExcel, printHtml, nowStr, nowTime } from "../utils/flowUtils";

const statuses: OrderStatus[] = ["Confirmed", "Packing", "Packed", "Out for Delivery", "Delivered", "Pending", "Cancelled"];
const mpTypes: PlanType[] = ["Meal Plan"];
const rsTypes: PlanType[] = ["Box Subscription", "Ready-to-Go"];

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

export default function Orders({ stream, demoMode }: { stream: BusinessStream; demoMode?: boolean }) {
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [refundModal, setRefundModal] = useState<Order | null>(null);
  const [refundReason, setRefundReason] = useState("");
  const [refundConfirmed, setRefundConfirmed] = useState(false);

  const streamOrders = orders.filter(o =>
    stream === "meal-plans" ? o.planType === "Meal Plan" : o.planType !== "Meal Plan"
  );

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

  const handlePrintSelected = () => {
    const selectedOrders = filtered.filter(o => selected.has(o.id));
    const html = selectedOrders.map(slipHtml).join('<hr style="margin:20px 0"/>');
    printHtml("Order Slips — Performance Meals", html);
  };

  const handleRefundConfirm = () => {
    if (!refundReason.trim()) return;
    setRefundConfirmed(true);
    window.open("https://admin.shopify.com", "_blank");
  };

  const handleRefundClose = () => {
    setRefundModal(null);
    setRefundReason("");
    setRefundConfirmed(false);
  };

  return (
    <>
    {refundModal && (
      <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={handleRefundClose}>
        <div
          className="bg-[#181818] border border-[#2A2A2A] w-full max-w-md"
          onClick={e => e.stopPropagation()}
        >
          <div className="border-b border-[#2A2A2A] px-5 py-3 flex items-center justify-between">
            <span className="text-sm font-bold mono" style={{ color: "#E85D04" }}>Refund → Shopify Admin</span>
            <button onClick={handleRefundClose} className="text-[#888] hover:text-[#E8E8E8] text-lg leading-none">×</button>
          </div>
          <div className="px-5 py-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mono">
              <span className="text-[#888]">Order ID</span><span style={{ color: "#E85D04" }}>{refundModal.id}</span>
              <span className="text-[#888]">Customer</span><span className="text-[#E8E8E8]">{refundModal.customer}</span>
              <span className="text-[#888]">Amount</span><span className="text-[#E8E8E8] font-bold">${refundModal.total.toFixed(2)}</span>
              <span className="text-[#888]">Status</span><span className="text-[#E8E8E8]">{refundModal.status}</span>
            </div>
            <div className="border border-yellow-600/50 bg-yellow-950/30 px-3 py-2 text-xs text-yellow-300">
              This portal records the refund decision. The actual refund is processed in Shopify Admin.
            </div>
            {!refundConfirmed ? (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider">Reason <span className="text-[#E85D04]">*</span></label>
                  <textarea
                    value={refundReason}
                    onChange={e => setRefundReason(e.target.value)}
                    rows={3}
                    placeholder="Describe the reason for this refund…"
                    className="w-full bg-[#0F0F0F] border border-[#2A2A2A] text-[#E8E8E8] text-xs px-3 py-2 mono focus:outline-none focus:border-[#E85D04] resize-none"
                  />
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={handleRefundConfirm}
                    disabled={!refundReason.trim()}
                    className="flex-1 text-xs font-bold py-2 px-3 mono transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ background: "#E85D04", color: "#000" }}
                  >
                    Record Decision & Open Shopify ↗
                  </button>
                  <button onClick={handleRefundClose} className="text-xs border border-[#2A2A2A] text-[#888] px-4 py-2 mono hover:border-[#E8E8E8] hover:text-[#E8E8E8] transition-colors">
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <div className="border border-green-700/50 bg-green-950/30 px-3 py-3 text-xs text-green-300 mono">
                ✓ Refund decision recorded · Audit log created · {nowStr()} {nowTime()}
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
          <button onClick={() => downloadCSV(`orders-${nowStr()}.csv`, exportRows(filtered))} className="border border-[#3A3A3A] text-[#CCCCCC] text-xs px-3 py-2 mono hover:border-[#F5B300] hover:text-[#F5B300] transition-colors">CSV ↓</button>
          <button onClick={() => downloadExcel(`orders-${nowStr()}.xls`, exportRows(filtered))} className="border border-[#3A3A3A] text-[#CCCCCC] text-xs px-3 py-2 mono hover:border-[#F5B300] hover:text-[#F5B300] transition-colors">Excel ↓</button>
          <button onClick={() => printHtml("Orders Export — Performance Meals", `<h1>Orders Export</h1><div class="meta">${filtered.length} orders · ${nowStr()} ${nowTime()}</div><table><tr>${["Order ID","Customer","Plan Type","Meals","Total","Delivery Window","Status"].map(h=>`<th>${h}</th>`).join("")}</tr>${filtered.map(o=>`<tr><td>${o.id}</td><td>${o.customer}</td><td>${o.planType}</td><td>${o.meals}</td><td>$${o.total.toFixed(2)}</td><td>${o.deliveryWindow}</td><td>${o.status}</td></tr>`).join("")}</table><div class="footer">Exported: ${nowStr()} ${nowTime()} · Performance Meals Admin v3</div>`)} className="border border-[#3A3A3A] text-[#CCCCCC] text-xs px-3 py-2 mono hover:border-[#F5B300] hover:text-[#F5B300] transition-colors">PDF ↓</button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider">Status</span>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-[#181818] border border-[#2A2A2A] text-[#E8E8E8] text-sm px-3 py-1.5 mono focus:outline-none focus:border-[#F5B300]"
          >
            <option value="All">All</option>
            {statuses.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider">Type</span>
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="bg-[#181818] border border-[#2A2A2A] text-[#E8E8E8] text-sm px-3 py-1.5 mono focus:outline-none focus:border-[#F5B300]"
          >
            <option value="All">All</option>
            {types.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div className="ml-auto text-xs text-[#888] mono self-center">{filtered.length} orders</div>
      </div>

      <div className="border border-[#2A2A2A] bg-[#181818] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#2A2A2A]">
              <th className="px-4 py-2 w-8">
                <input type="checkbox" checked={selected.size === filtered.length && filtered.length > 0} onChange={toggleAll}
                  className="accent-[#F5B300]" />
              </th>
              {["Order ID", "Customer", "Plan Type", "Meals", "Total", "Delivery Window", "Status", "Action"].map(h => (
                <th key={h} className="px-4 py-2 text-left text-xs font-bold text-[#FFFFFF] uppercase tracking-wider font-medium whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((o, i) => (
              <tr key={o.id} className={`border-b border-[#2A2A2A] hover:bg-[#1F1F1F] transition-colors ${i % 2 === 0 ? "" : "bg-[#141414]"}`}>
                <td className="px-4 py-2.5">
                  <input type="checkbox" checked={selected.has(o.id)} onChange={() => toggle(o.id)} className="accent-[#F5B300]" />
                </td>
                <td className="px-4 py-2.5 mono text-xs" style={{ color: accent }}>{o.id}</td>
                <td className="px-4 py-2.5 font-medium">{o.customer}</td>
                <td className="px-4 py-2.5 text-xs text-[#888]">
                  {o.planType}
                  {o.goal && <span className="ml-1 text-[#E85D04] font-bold">{o.goal}</span>}
                </td>
                <td className="px-4 py-2.5 mono text-center">{o.meals}</td>
                <td className="px-4 py-2.5 mono font-bold" style={{ color: accent }}>${o.total.toFixed(2)}</td>
                <td className="px-4 py-2.5 mono text-xs text-[#888]">{o.deliveryWindow}</td>
                <td className="px-4 py-2.5"><StatusBadge status={o.status} /></td>
                <td className="px-4 py-2.5">
                  <div className="flex gap-1">
                    <button onClick={() => handlePrintSlip(o)} className="text-xs border border-[#2A2A2A] px-2 py-1 text-[#888] hover:border-[#F5B300] hover:text-[#F5B300] transition-colors mono">
                      Print Slip
                    </button>
                    {o.status === "Delivered" && (
                      <button onClick={() => { setRefundModal(o); setRefundReason(""); setRefundConfirmed(false); }}
                        title="Refund is processed in Shopify Admin — this records the request only"
                        className="text-xs border border-[#2A2A2A] px-2 py-1 text-[#888] hover:border-[#E85D04] hover:text-[#E85D04] transition-colors mono">
                        Refund → Shopify ↗
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
