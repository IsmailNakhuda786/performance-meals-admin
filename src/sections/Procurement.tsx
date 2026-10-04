import { useState } from "react";

type POStatus = "draft" | "pending-approval" | "approved" | "ordered" | "received" | "partial";

interface PurchaseOrder {
  id: string;
  supplier: string;
  items: string;
  total: number;
  status: POStatus;
  created: string;
  expectedDelivery: string;
  createdBy: string;
}

interface Supplier {
  id: string;
  name: string;
  category: string;
  contact: string;
  leadDays: number;
  rating: number;
  lastOrder: string;
}

const suppliers: Supplier[] = [
  { id: "SUP-01", name: "Fresh Farm SG", category: "Proteins", contact: "tony@freshfarm.sg", leadDays: 2, rating: 4.8, lastOrder: "12 Sep 2024" },
  { id: "SUP-02", name: "Rice & Grains Co", category: "Carbs", contact: "orders@ricegrains.sg", leadDays: 3, rating: 4.5, lastOrder: "10 Sep 2024" },
  { id: "SUP-03", name: "Green Leaf Produce", category: "Vegetables", contact: "gl@greenleaf.sg", leadDays: 1, rating: 4.2, lastOrder: "13 Sep 2024" },
  { id: "SUP-04", name: "PackRight Industries", category: "Packaging", contact: "b2b@packright.sg", leadDays: 5, rating: 4.6, lastOrder: "08 Sep 2024" },
  { id: "SUP-05", name: "CoolChain Logistics", category: "Ice Packs / Cold", contact: "ops@coolchain.sg", leadDays: 4, rating: 4.3, lastOrder: "06 Sep 2024" },
];

const purchaseOrders: PurchaseOrder[] = [
  { id: "PO-2024-088", supplier: "Fresh Farm SG", items: "Chicken Breast 20kg, Salmon Fillet 15kg", total: 284.00, status: "pending-approval", created: "14 Sep 2024", expectedDelivery: "16 Sep 2024", createdBy: "Hafiz Ahmad" },
  { id: "PO-2024-087", supplier: "Rice & Grains Co", items: "Jasmine Rice 25kg, Brown Rice 15kg", total: 118.50, status: "approved", created: "13 Sep 2024", expectedDelivery: "16 Sep 2024", createdBy: "Hafiz Ahmad" },
  { id: "PO-2024-086", supplier: "PackRight Industries", items: "Meal Containers 600ml ×500, Delivery Labels ×1000", total: 163.00, status: "ordered", created: "12 Sep 2024", expectedDelivery: "17 Sep 2024", createdBy: "Jerome Lim" },
  { id: "PO-2024-085", supplier: "CoolChain Logistics", items: "Ice Packs 200g ×300, Ice Packs 400g ×200", total: 245.00, status: "pending-approval", created: "14 Sep 2024", expectedDelivery: "18 Sep 2024", createdBy: "Hafiz Ahmad" },
  { id: "PO-2024-084", supplier: "Green Leaf Produce", items: "Broccoli 10kg, Sweet Potato 12kg", total: 52.80, status: "received", created: "10 Sep 2024", expectedDelivery: "11 Sep 2024", createdBy: "Hafiz Ahmad" },
  { id: "PO-2024-083", supplier: "Fresh Farm SG", items: "Chicken Breast 15kg", total: 108.00, status: "received", created: "08 Sep 2024", expectedDelivery: "10 Sep 2024", createdBy: "Hafiz Ahmad" },
];

const statusStyle: Record<POStatus, string> = {
  draft: "text-[#888] bg-[#2A2A2A]",
  "pending-approval": "text-yellow-400 bg-yellow-950/30",
  approved: "text-blue-400 bg-blue-950/30",
  ordered: "text-purple-400 bg-purple-950/30",
  received: "text-green-400 bg-green-950/30",
  partial: "text-orange-400 bg-orange-950/30",
};

type Tab = "po" | "suppliers" | "requests";

export default function Procurement({ demoMode }: { demoMode?: boolean } = {}) {
  const [tab, setTab] = useState<Tab>("po");
  const [poFilter, setPoFilter] = useState<POStatus | "all">("all");
  const [showPOModal, setShowPOModal] = useState(demoMode ?? false);

  const filteredPOs = purchaseOrders.filter(p => poFilter === "all" || p.status === poFilter);
  const pendingTotal = purchaseOrders.filter(p => p.status === "pending-approval").reduce((a, p) => a + p.total, 0);

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold">Procurement Center</h2>
        <div className="flex gap-2">
          <button onClick={() => setShowPOModal(true)} className="bg-[#F5B300] text-black text-xs font-bold px-4 py-2 mono hover:bg-[#C99200] transition-colors">
            + Create PO
          </button>
          <button className="border border-[#3A3A3A] text-[#CCCCCC] text-xs px-4 py-2 mono hover:border-[#F5B300] hover:text-[#F5B300] transition-colors">Export CSV</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Pending Approval", value: purchaseOrders.filter(p => p.status === "pending-approval").length, sub: `$${pendingTotal.toFixed(2)}`, color: "#F5B300" },
          { label: "Orders Placed", value: purchaseOrders.filter(p => p.status === "ordered").length, sub: "awaiting delivery", color: "#888" },
          { label: "Suppliers Active", value: suppliers.length, sub: "registered", color: "#888" },
          { label: "Received This Week", value: purchaseOrders.filter(p => p.status === "received").length, sub: "completed", color: "#22C55E" },
        ].map(k => (
          <div key={k.label} className="border border-[#2A2A2A] bg-[#181818] p-4">
            <div className="text-xs font-bold text-[#FFFFFF] uppercase tracking-widest mb-2">{k.label}</div>
            <div className="text-3xl font-extrabold mono" style={{ color: k.color }}>{k.value}</div>
            <div className="text-xs text-[#888] mono mt-1">{k.sub}</div>
          </div>
        ))}
      </div>

      <div className="flex border-b border-[#2A2A2A]">
        {([["po", "Purchase Orders"], ["suppliers", "Suppliers"], ["requests", "Stock Requests"]] as [Tab, string][]).map(([t, label]) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-3 text-sm font-medium mono transition-colors ${tab === t ? "border-b-2 border-[#F5B300] text-[#F5B300]" : "text-[#888] hover:text-[#E8E8E8]"}`}>
            {label}
          </button>
        ))}
      </div>

      {tab === "po" && (
        <>
          <div className="flex gap-2 flex-wrap">
            {(["all", "pending-approval", "approved", "ordered", "received", "partial"] as (POStatus | "all")[]).map(s => (
              <button key={s} onClick={() => setPoFilter(s)}
                className={`text-xs px-3 py-1.5 mono border transition-colors ${poFilter === s ? "border-[#F5B300] text-[#F5B300] bg-[#F5B300]/10" : "border-[#2A2A2A] text-[#888] hover:text-[#E8E8E8]"}`}>
                {s === "all" ? "All" : s.replace("-", " ")}
              </button>
            ))}
          </div>
          <div className="border border-[#2A2A2A] bg-[#181818] overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2A2A2A]">
                  {["PO Number", "Supplier", "Items", "Total", "Status", "Expected", "Created By", "Actions"].map(h => (
                    <th key={h} className="px-4 py-2 text-left text-xs text-[#AAAAAA] uppercase tracking-wider font-medium whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredPOs.map((po, i) => (
                  <tr key={po.id} className={`border-b border-[#2A2A2A] hover:bg-[#1F1F1F] transition-colors ${i % 2 === 0 ? "" : "bg-[#141414]"}`}>
                    <td className="px-4 py-2.5 mono text-xs text-[#F5B300]">{po.id}</td>
                    <td className="px-4 py-2.5 font-medium">{po.supplier}</td>
                    <td className="px-4 py-2.5 text-xs text-[#888] max-w-[180px] truncate">{po.items}</td>
                    <td className="px-4 py-2.5 mono font-bold">${po.total.toFixed(2)}</td>
                    <td className="px-4 py-2.5">
                      <span className={`text-xs mono px-2 py-0.5 font-bold capitalize ${statusStyle[po.status]}`}>{po.status.replace("-", " ")}</span>
                    </td>
                    <td className="px-4 py-2.5 mono text-xs text-[#888]">{po.expectedDelivery}</td>
                    <td className="px-4 py-2.5 text-xs text-[#888]">{po.createdBy}</td>
                    <td className="px-4 py-2.5">
                      <div className="flex gap-1">
                        {po.status === "pending-approval" && (
                          <button className="text-xs border border-green-800/40 px-2 py-1 text-green-400 hover:bg-green-950 mono transition-colors">Approve</button>
                        )}
                        <button className="text-xs border border-[#2A2A2A] px-2 py-1 text-[#888] hover:border-[#F5B300] hover:text-[#F5B300] mono transition-colors">View</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === "suppliers" && (
        <div className="border border-[#2A2A2A] bg-[#181818] overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2A2A2A]">
                {["ID", "Supplier Name", "Category", "Contact", "Lead Time", "Rating", "Last Order", "Actions"].map(h => (
                  <th key={h} className="px-4 py-2 text-left text-xs text-[#AAAAAA] uppercase tracking-wider font-medium whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {suppliers.map((s, i) => (
                <tr key={s.id} className={`border-b border-[#2A2A2A] hover:bg-[#1F1F1F] transition-colors ${i % 2 === 0 ? "" : "bg-[#141414]"}`}>
                  <td className="px-4 py-2.5 mono text-xs text-[#555]">{s.id}</td>
                  <td className="px-4 py-2.5 font-semibold">{s.name}</td>
                  <td className="px-4 py-2.5 text-xs text-[#888]">{s.category}</td>
                  <td className="px-4 py-2.5 mono text-xs text-[#888]">{s.contact}</td>
                  <td className="px-4 py-2.5 mono text-xs">{s.leadDays} days</td>
                  <td className="px-4 py-2.5 mono font-bold text-[#F5B300]">★ {s.rating}</td>
                  <td className="px-4 py-2.5 mono text-xs text-[#888]">{s.lastOrder}</td>
                  <td className="px-4 py-2.5">
                    <button className="text-xs border border-[#2A2A2A] px-2 py-1 text-[#888] hover:border-[#F5B300] hover:text-[#F5B300] mono transition-colors">Order</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "requests" && (
        <div className="space-y-3">
          {[
            { item: "Jasmine Rice", qty: "25kg", requestedBy: "Hafiz Ahmad", urgency: "urgent", ts: "14 Sep 11:00" },
            { item: "Chicken Breast", qty: "20kg", requestedBy: "Hafiz Ahmad", urgency: "urgent", ts: "14 Sep 10:45" },
            { item: "Box Sub Bags", qty: "200 units", requestedBy: "Lena Wong", urgency: "normal", ts: "13 Sep 16:00" },
            { item: "Ice Packs 200g", qty: "300 units", requestedBy: "Hafiz Ahmad", urgency: "normal", ts: "13 Sep 09:30" },
          ].map((r, i) => (
            <div key={i} className={`border px-4 py-3 flex items-center gap-4 ${r.urgency === "urgent" ? "border-red-800/30 bg-red-950/10" : "border-[#2A2A2A] bg-[#181818]"}`}>
              <div className="flex-1">
                <div className="font-semibold">{r.item}</div>
                <div className="text-xs text-[#888] mono">{r.qty} — requested by {r.requestedBy} at {r.ts}</div>
              </div>
              {r.urgency === "urgent" && <span className="text-xs text-red-400 mono font-bold">URGENT</span>}
              <button className="text-xs border border-[#F5B300]/40 text-[#F5B300] px-3 py-1 mono hover:bg-[#F5B300]/10 transition-colors">Create PO</button>
            </div>
          ))}
        </div>
      )}

      {showPOModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="bg-[#181818] border border-[#2A2A2A] w-full max-w-[480px]">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#2A2A2A]">
              <span className="font-bold text-[#F5B300] mono">Create Purchase Order</span>
              <button onClick={() => setShowPOModal(false)} className="text-[#888] hover:text-[#E8E8E8] text-xl">×</button>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <label className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider block mb-1">Supplier</label>
                <select className="w-full bg-[#0F0F0F] border border-[#2A2A2A] text-[#E8E8E8] text-sm px-3 py-2 focus:outline-none focus:border-[#F5B300]">
                  {suppliers.map(s => <option key={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider block mb-1">Items (describe)</label>
                <textarea rows={3} placeholder="e.g. Chicken Breast 20kg, Jasmine Rice 25kg…"
                  className="w-full bg-[#0F0F0F] border border-[#2A2A2A] text-[#E8E8E8] text-sm px-3 py-2 focus:outline-none focus:border-[#F5B300] placeholder:text-[#444] resize-none" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider block mb-1">Total Amount (SGD)</label>
                  <input type="number" placeholder="0.00" className="w-full bg-[#0F0F0F] border border-[#2A2A2A] text-[#E8E8E8] text-sm px-3 py-2 focus:outline-none focus:border-[#F5B300] placeholder:text-[#444]" />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider block mb-1">Expected Delivery</label>
                  <input type="date" className="w-full bg-[#0F0F0F] border border-[#2A2A2A] text-[#E8E8E8] text-sm px-3 py-2 focus:outline-none focus:border-[#F5B300]" />
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setShowPOModal(false)} className="flex-1 bg-[#F5B300] text-black py-2 text-sm font-bold mono hover:bg-[#C99200] transition-colors">Submit for Approval</button>
                <button onClick={() => setShowPOModal(false)} className="flex-1 border border-[#2A2A2A] text-[#888] py-2 text-sm mono hover:text-[#E8E8E8] transition-colors">Save Draft</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
