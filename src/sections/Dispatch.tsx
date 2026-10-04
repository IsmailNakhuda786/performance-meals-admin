import { useState } from "react";
import type { BusinessStream } from "../App";
import { printHtml, nowStr, nowTime } from "../utils/flowUtils";

const riders = [
  { id: "R01", name: "Ahmad Zaki", phone: "+65 9111 0001", vehicle: "Motorcycle", zone: "East", status: "On Route" },
  { id: "R02", name: "Daniel Tan", phone: "+65 9222 0002", vehicle: "Car", zone: "Central", status: "Available" },
  { id: "R03", name: "Raju Kumar", phone: "+65 9333 0003", vehicle: "Motorcycle", zone: "West", status: "On Route" },
  { id: "R04", name: "James Ng", phone: "+65 9444 0004", vehicle: "Van", zone: "North", status: "Available" },
  { id: "R05", name: "Sameer Ali", phone: "+65 9555 0005", vehicle: "Motorcycle", zone: "South", status: "Completed" },
];

interface DispatchOrder {
  id: string;
  customer: string;
  phone?: string;
  unit?: string;
  address: string;
  zone: string;
  window: string;
  pickupTime?: string;
  dispatchPoint?: string;
  type: string;
  stream: "RS" | "MP";
  status: "pending" | "assigned" | "out-for-delivery" | "delivered" | "failed";
  rider?: string;
}

const allOrders: DispatchOrder[] = [
  { id: "ORD-2421", customer: "Wei Jie Lim", phone: "+65 9101 1234", unit: "#08-11", address: "Blk 204 Tampines St 21", zone: "East", window: "10:00–12:00", pickupTime: "08:30", dispatchPoint: "Tampines Hub", type: "Box Subscription", stream: "RS", status: "out-for-delivery", rider: "Ahmad Zaki" },
  { id: "ORD-2422", customer: "Jade Koh", phone: "+65 9202 5678", unit: "#03-22", address: "12 Woodlands Ave 5", zone: "North", window: "10:00–12:00", pickupTime: "08:30", dispatchPoint: "Woodlands DC", type: "Box Subscription", stream: "RS", status: "assigned", rider: "James Ng" },
  { id: "ORD-2423", customer: "Darren Ong", phone: "+65 9303 9012", unit: "#11-04", address: "88 Bukit Timah Rd", zone: "West", window: "14:00–16:00", pickupTime: "12:30", dispatchPoint: "Buona Vista Hub", type: "Ready-to-Go", stream: "RS", status: "pending" },
  { id: "ORD-2424", customer: "Jason Yeo", phone: "+65 9404 3456", unit: "#06-08", address: "Blk 44 Geylang Bahru", zone: "Central", window: "14:00–16:00", pickupTime: "12:30", dispatchPoint: "Toa Payoh Hub", type: "Box Subscription", stream: "RS", status: "pending" },
  { id: "ORD-2425", customer: "Priya K", phone: "+65 9505 7890", unit: "#12-02", address: "3 Orchard Blvd", zone: "Central", window: "10:00–12:00", pickupTime: "08:30", dispatchPoint: "Toa Payoh Hub", type: "Ready-to-Go", stream: "RS", status: "delivered", rider: "Raju Kumar" },
  { id: "SUB-2201", customer: "Marcus Tan", phone: "+65 9606 1122", unit: "#05-14", address: "Blk 113 Bishan St 12", zone: "Central", window: "10:00–12:00", pickupTime: "08:30", dispatchPoint: "Toa Payoh Hub", type: "12-Week BUILD · 10 meals", stream: "MP", status: "out-for-delivery", rider: "Daniel Tan" },
  { id: "SUB-2202", customer: "Priya Nair", phone: "+65 9707 3344", unit: "#04-22", address: "Blk 88 Tampines Ave 7", zone: "East", window: "10:00–12:00", pickupTime: "08:30", dispatchPoint: "Tampines Hub", type: "8-Week CUT · 10 meals", stream: "MP", status: "assigned", rider: "Ahmad Zaki" },
  { id: "SUB-2203", customer: "Natalie Foo", phone: "+65 9808 5566", unit: "#14-33", address: "Blk 77 Clementi Ave 2", zone: "West", window: "14:00–16:00", pickupTime: "12:30", dispatchPoint: "Buona Vista Hub", type: "12-Week BUILD · 10 meals", stream: "MP", status: "pending" },
  { id: "SUB-2204", customer: "Bryan Low", phone: "+65 9909 7788", unit: "#09-11", address: "22 Toa Payoh Rise", zone: "Central", window: "10:00–12:00", pickupTime: "08:30", dispatchPoint: "Toa Payoh Hub", type: "8-Week BUILD · 10 meals", stream: "MP", status: "pending" },
  { id: "SUB-2205", customer: "Kevin Chia", phone: "+65 9100 9900", unit: "#07-05", address: "Blk 301 Jurong West St 42", zone: "West", window: "14:00–16:00", pickupTime: "12:30", dispatchPoint: "Jurong East DC", type: "12-Week MAINTAIN · 10 meals", stream: "MP", status: "delivered", rider: "Daniel Tan" },
];

const statusConfig: Record<DispatchOrder["status"], { label: string; color: string }> = {
  pending: { label: "Pending", color: "#888" },
  assigned: { label: "Assigned", color: "#3B82F6" },
  "out-for-delivery": { label: "Out for Delivery", color: "#F5B300" },
  delivered: { label: "Delivered", color: "#22C55E" },
  failed: { label: "Failed", color: "#EF4444" },
};

const riderStatusColor: Record<string, string> = {
  Available: "text-green-400",
  "On Route": "text-yellow-400",
  Completed: "text-[#555]",
};

export default function Dispatch({ stream, demoMode }: { stream: BusinessStream; demoMode?: boolean }) {
  const [assignModal, setAssignModal] = useState<string | null>(demoMode ? allOrders.find(o => o.status === "pending")?.id ?? null : null);
  const [orders, setOrders] = useState(allOrders);
  const [selectedRider, setSelectedRider] = useState("");
  const [queueStream, setQueueStream] = useState<"RS" | "MP">("RS");

  const rsOrders = orders.filter(o => o.stream === "RS");
  const mpOrders = orders.filter(o => o.stream === "MP");
  const queueOrders = queueStream === "RS" ? rsOrders : mpOrders;

  const assignRider = (orderId: string, riderName: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, rider: riderName, status: "assigned" } : o));
    setAssignModal(null);
    setSelectedRider("");
  };

  const rsKpis = {
    total: rsOrders.length,
    pending: rsOrders.filter(o => o.status === "pending").length,
    outForDelivery: rsOrders.filter(o => o.status === "out-for-delivery").length,
    delivered: rsOrders.filter(o => o.status === "delivered").length,
  };
  const mpKpis = {
    total: mpOrders.length,
    pending: mpOrders.filter(o => o.status === "pending").length,
    outForDelivery: mpOrders.filter(o => o.status === "out-for-delivery").length,
    delivered: mpOrders.filter(o => o.status === "delivered").length,
  };

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold">Dispatch Control Center</h2>
        <div className="flex gap-2">
          <button
            onClick={() => {
              const rows = orders.map(o => `
                <tr>
                  <td>${o.id}</td>
                  <td>${o.customer}<br/><span style="color:#888;font-size:11px;">${o.phone ?? ""}</span></td>
                  <td>${o.address}${o.unit ? " " + o.unit : ""}</td>
                  <td style="font-family:monospace">${o.window}</td>
                  <td style="font-family:monospace">${o.pickupTime ?? "—"}</td>
                  <td>${o.dispatchPoint ?? "—"}</td>
                  <td>${o.rider ?? "Unassigned"}</td>
                  <td>${o.status}</td>
                </tr>`).join("");
              printHtml("Dispatch Manifest — Performance Meals", `
                <div class="badge">Dispatch Manifest</div>
                <h1>Dispatch Manifest — Performance Meals</h1>
                <div class="meta">Generated ${nowStr()} at ${nowTime()} · ${orders.length} orders total</div>
                <table>
                  <thead><tr><th>Order ID</th><th>Customer / Phone</th><th>Address</th><th>Window</th><th>Pickup</th><th>Dispatch Point</th><th>Rider</th><th>Status</th></tr></thead>
                  <tbody>${rows}</tbody>
                </table>
                <div class="footer">Performance Meals · Dispatch Portal · ${nowStr()} ${nowTime()}</div>
              `);
            }}
            className="border border-[#3A3A3A] text-[#CCCCCC] text-xs px-3 py-2 mono hover:border-[#F5B300] hover:text-[#F5B300] transition-colors">
            Generate Manifest
          </button>
          <button
            onClick={() => {
              const zones = [...new Set(orders.map(o => o.zone))].sort();
              const sections = zones.map(zone => {
                const zoneOrders = orders.filter(o => o.zone === zone);
                const zoneRows = zoneOrders.map(o => `
                  <tr>
                    <td>${o.id}</td>
                    <td>${o.customer}<br/><span style="color:#888;font-size:11px;">${o.phone ?? ""}</span></td>
                    <td>${o.address}${o.unit ? " " + o.unit : ""}</td>
                    <td style="font-family:monospace">${o.window}</td>
                    <td style="font-family:monospace">${o.pickupTime ?? "—"}</td>
                    <td>${o.dispatchPoint ?? "—"}</td>
                    <td>${o.stream}</td>
                    <td>${o.rider ?? "Unassigned"}</td>
                    <td>${o.status}</td>
                  </tr>`).join("");
                return `
                  <h2 style="margin:20px 0 6px;font-size:13px;border-bottom:2px solid #000;padding-bottom:4px;">${zone} Zone — ${zoneOrders.length} orders</h2>
                  <table>
                    <thead><tr><th>Order ID</th><th>Customer / Phone</th><th>Address</th><th>Window</th><th>Pickup</th><th>Dispatch Point</th><th>Stream</th><th>Rider</th><th>Status</th></tr></thead>
                    <tbody>${zoneRows}</tbody>
                  </table>`;
              }).join("");
              printHtml("Route Sheet — Performance Meals", `
                <div class="badge">Route Sheet</div>
                <h1>Route Sheet — Performance Meals</h1>
                <div class="meta">Generated ${nowStr()} at ${nowTime()} · ${orders.length} orders across ${zones.length} zones</div>
                ${sections}
                <div class="footer">Performance Meals · Dispatch Portal · ${nowStr()} ${nowTime()}</div>
              `);
            }}
            className="border border-[#3A3A3A] text-[#CCCCCC] text-xs px-3 py-2 mono hover:border-[#F5B300] hover:text-[#F5B300] transition-colors">
            ⎙ Route Sheet
          </button>
        </div>
      </div>

      {/* CRITICAL: Two-stream KPI blocks — never merged */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="border border-[#E85D04]/30 bg-[#181818]">
          <div className="px-4 py-2.5 border-b border-[#E85D04]/20 flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-[#E85D04]" />
            <span className="text-xs font-extrabold tracking-widest uppercase" style={{ color: "#E85D04" }}>Ready Series Queue</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#2A2A2A]">
            {[
              { label: "Total", value: rsKpis.total },
              { label: "Pending", value: rsKpis.pending, warn: true },
              { label: "En Route", value: rsKpis.outForDelivery },
              { label: "Delivered", value: rsKpis.delivered, good: true },
            ].map(k => (
              <div key={k.label} className="bg-[#181818] p-3 text-center">
                <div className="text-xs text-[#AAAAAA] uppercase tracking-wider mb-1">{k.label}</div>
                <div className="text-xl font-extrabold mono" style={{ color: k.good ? "#22C55E" : k.warn && k.value > 0 ? "#E85D04" : "#E8E8E8" }}>{k.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-[#F5B300]/30 bg-[#181818]">
          <div className="px-4 py-2.5 border-b border-[#F5B300]/20 flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-[#F5B300]" />
            <span className="text-xs font-extrabold tracking-widest uppercase" style={{ color: "#F5B300" }}>Meal Plans Queue</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#2A2A2A]">
            {[
              { label: "Total", value: mpKpis.total },
              { label: "Pending", value: mpKpis.pending, warn: true },
              { label: "En Route", value: mpKpis.outForDelivery },
              { label: "Delivered", value: mpKpis.delivered, good: true },
            ].map(k => (
              <div key={k.label} className="bg-[#181818] p-3 text-center">
                <div className="text-xs text-[#AAAAAA] uppercase tracking-wider mb-1">{k.label}</div>
                <div className="text-xl font-extrabold mono" style={{ color: k.good ? "#22C55E" : k.warn && k.value > 0 ? "#F5B300" : "#E8E8E8" }}>{k.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Queue stream selector */}
      <div className="flex items-center gap-3">
        <div className="text-xs mono text-[#555] uppercase tracking-widest">Dispatch Queue</div>
        <div className="flex gap-1 border border-[#2A2A2A]">
          <button onClick={() => setQueueStream("RS")}
            className={`px-4 py-1.5 text-xs font-extrabold mono uppercase transition-colors ${queueStream === "RS" ? "bg-[#E85D04] text-black" : "text-[#888] hover:text-[#E8E8E8]"}`}>
            Ready Series
          </button>
          <div className="w-px bg-[#2A2A2A]" />
          <button onClick={() => setQueueStream("MP")}
            className={`px-4 py-1.5 text-xs font-extrabold mono uppercase transition-colors ${queueStream === "MP" ? "bg-[#F5B300] text-black" : "text-[#888] hover:text-[#E8E8E8]"}`}>
            Meal Plans
          </button>
        </div>
        <div className="text-xs mono text-[#555]">— {queueOrders.length} orders in queue</div>
      </div>

      {/* Orders table */}
      <div className="border border-[#2A2A2A] bg-[#181818] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#2A2A2A]">
              {["Order ID", "Customer", "Phone", "Address", "Window", "Pickup", "Dispatch Point", "Type", "Rider", "Status", "Actions"].map(h => (
                <th key={h} className="px-4 py-2.5 text-left text-xs text-[#AAAAAA] uppercase tracking-wider font-medium whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {queueOrders.map((o, i) => {
              const cfg = statusConfig[o.status];
              return (
                <tr key={o.id} className={`border-b border-[#2A2A2A] hover:bg-[#1F1F1F] transition-colors ${i % 2 === 0 ? "" : "bg-[#141414]"}`}>
                  <td className="px-4 py-2.5 mono text-xs" style={{ color: queueStream === "RS" ? "#E85D04" : "#F5B300" }}>{o.id}</td>
                  <td className="px-4 py-2.5 font-medium whitespace-nowrap">{o.customer}</td>
                  <td className="px-4 py-2.5 mono text-xs text-[#AAAAAA] whitespace-nowrap">{o.phone ?? <span className="text-[#555]">—</span>}</td>
                  <td className="px-4 py-2.5 text-xs text-[#CCCCCC]">
                    <div>{o.address}</div>
                    {o.unit && <div className="text-[#888] mono">{o.unit}</div>}
                  </td>
                  <td className="px-4 py-2.5 mono text-xs text-[#F5B300] whitespace-nowrap">{o.window}</td>
                  <td className="px-4 py-2.5 mono text-xs text-[#888] whitespace-nowrap">{o.pickupTime ?? <span className="text-[#555]">—</span>}</td>
                  <td className="px-4 py-2.5 text-xs text-[#888] whitespace-nowrap">{o.dispatchPoint ?? <span className="text-[#555]">—</span>}</td>
                  <td className="px-4 py-2.5 text-xs text-[#888] whitespace-nowrap">{o.type}</td>
                  <td className="px-4 py-2.5 text-xs whitespace-nowrap">{o.rider ?? <span className="text-[#555]">Unassigned</span>}</td>
                  <td className="px-4 py-2.5">
                    <span className="text-xs mono font-bold whitespace-nowrap" style={{ color: cfg.color }}>{cfg.label}</span>
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex gap-1">
                      {o.status === "pending" && (
                        <button onClick={() => setAssignModal(o.id)}
                          className="text-xs border border-[#2A2A2A] text-[#888] px-2 py-1 hover:border-[#F5B300] hover:text-[#F5B300] mono transition-colors whitespace-nowrap">
                          Assign Rider
                        </button>
                      )}
                      {o.status === "assigned" && (
                        <button onClick={() => setAssignModal(o.id)}
                          className="text-xs border border-[#2A2A2A] text-[#888] px-2 py-1 hover:border-[#F5B300] hover:text-[#F5B300] mono transition-colors">
                          Reassign
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Rider availability */}
      <div className="border border-[#2A2A2A] bg-[#181818]">
        <div className="px-4 py-3 border-b border-[#2A2A2A]">
          <span className="text-sm font-semibold">Rider Availability</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2A2A2A]">
                {["Rider", "Vehicle", "Zone", "Status", "Assigned Today"].map(h => (
                  <th key={h} className="px-4 py-2 text-left text-xs text-[#AAAAAA] uppercase tracking-wider font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {riders.map((r, i) => {
                const assigned = orders.filter(o => o.rider === r.name).length;
                return (
                  <tr key={r.id} className={`border-b border-[#2A2A2A] hover:bg-[#1F1F1F] ${i % 2 === 0 ? "" : "bg-[#141414]"}`}>
                    <td className="px-4 py-2.5 font-medium">{r.name}</td>
                    <td className="px-4 py-2.5 text-xs text-[#888]">{r.vehicle}</td>
                    <td className="px-4 py-2.5 text-xs text-[#888]">{r.zone}</td>
                    <td className="px-4 py-2.5">
                      <span className={`text-xs mono font-bold ${riderStatusColor[r.status]}`}>{r.status}</span>
                    </td>
                    <td className="px-4 py-2.5 mono text-xs text-[#E8E8E8]">{assigned} orders</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign modal */}
      {assignModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center" onClick={() => setAssignModal(null)}>
          <div className="bg-[#141414] border border-[#2A2A2A] w-full max-w-sm p-6 space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="font-bold">Assign Rider — {assignModal}</h3>
              <button onClick={() => setAssignModal(null)} className="text-[#888] hover:text-[#E8E8E8] text-xl mono">×</button>
            </div>
            <select value={selectedRider} onChange={e => setSelectedRider(e.target.value)}
              className="w-full bg-[#181818] border border-[#2A2A2A] text-[#E8E8E8] text-sm px-3 py-2 mono focus:outline-none focus:border-[#F5B300]">
              <option value="">Select rider…</option>
              {riders.filter(r => r.status !== "Completed").map(r => (
                <option key={r.id} value={r.name}>{r.name} · {r.zone} · {r.status}</option>
              ))}
            </select>
            <div className="flex gap-2">
              <button onClick={() => selectedRider && assignRider(assignModal, selectedRider)}
                disabled={!selectedRider}
                className="flex-1 bg-[#F5B300] text-black text-xs font-bold py-2.5 mono hover:bg-yellow-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                Assign
              </button>
              <button onClick={() => setAssignModal(null)}
                className="flex-1 border border-[#2A2A2A] text-[#888] text-xs py-2.5 mono hover:text-[#E8E8E8] transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
