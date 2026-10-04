import { useState } from "react";
import type { BusinessStream } from "../App";
import { downloadExcel, printHtml, nowStr, nowTime } from "../utils/flowUtils";

type ProdStatus = "pending" | "in-production" | "produced" | "packed";

interface ProductionItem {
  id: string;
  item: string;
  quantity: number;
  packaging: string;
  priority: "urgent" | "normal" | "low";
  status: ProdStatus;
  stream: "RS" | "MP";
  goal?: "CUT" | "BUILD" | "MAINTAIN";
}

const initialItems: ProductionItem[] = [
  { id: "PB-001", item: "Grilled Chicken & Rice (CUT)", quantity: 48, packaging: "650ml Container", priority: "urgent", status: "in-production", stream: "MP", goal: "CUT" },
  { id: "PB-002", item: "Salmon Teriyaki & Quinoa (BUILD)", quantity: 36, packaging: "650ml Container", priority: "normal", status: "pending", stream: "MP", goal: "BUILD" },
  { id: "PB-003", item: "Sweet Potato & Chicken (MAINTAIN)", quantity: 58, packaging: "650ml Container", priority: "normal", status: "produced", stream: "MP", goal: "MAINTAIN" },
  { id: "PB-004", item: "Ready Meal — Beef Rendang", quantity: 32, packaging: "500ml Container", priority: "urgent", status: "packed", stream: "RS" },
  { id: "PB-005", item: "Ready Meal — Nasi Lemak Chicken", quantity: 40, packaging: "500ml Container", priority: "normal", status: "in-production", stream: "RS" },
  { id: "PB-006", item: "Ready Meal — Mee Goreng Basah", quantity: 24, packaging: "500ml Container", priority: "low", status: "pending", stream: "RS" },
  { id: "PB-007", item: "High Protein Oats Bowl (BUILD)", quantity: 30, packaging: "400ml Bowl", priority: "normal", status: "produced", stream: "MP", goal: "BUILD" },
  { id: "PB-008", item: "Ready Meal — Chicken Laksa", quantity: 28, packaging: "500ml Container", priority: "normal", status: "pending", stream: "RS" },
  { id: "PB-009", item: "Lean Beef & Broccoli (CUT)", quantity: 42, packaging: "650ml Container", priority: "urgent", status: "packed", stream: "MP", goal: "CUT" },
  { id: "PB-010", item: "Ready Meal — Fish Otah Set", quantity: 18, packaging: "500ml Container", priority: "low", status: "pending", stream: "RS" },
];

const statusConfig: Record<ProdStatus, { label: string; color: string; bg: string }> = {
  pending: { label: "Pending", color: "#888", bg: "bg-[#2A2A2A]" },
  "in-production": { label: "In Production", color: "#F5B300", bg: "bg-yellow-950/40 border border-yellow-800/30" },
  produced: { label: "Produced", color: "#3B82F6", bg: "bg-blue-950/40 border border-blue-800/30" },
  packed: { label: "Packed", color: "#22C55E", bg: "bg-green-950/40 border border-green-800/30" },
};

const priorityStyle: Record<string, string> = {
  urgent: "text-red-400 bg-red-950/30 border border-red-800/30",
  normal: "text-[#888] bg-[#1A1A1A] border border-[#2A2A2A]",
  low: "text-[#555] bg-[#141414] border border-[#1A1A1A]",
};


export default function ProductionBoard({ stream, demoMode }: { stream: BusinessStream; demoMode?: boolean }) {
  const [items, setItems] = useState(initialItems);
  const [statusFilter, setStatusFilter] = useState<ProdStatus | "all">("all");
  const [streamFilter, setStreamFilter] = useState<"RS" | "MP" | "all">("all");

  const filtered = items.filter(i => {
    if (statusFilter !== "all" && i.status !== statusFilter) return false;
    if (streamFilter !== "all" && i.stream !== streamFilter) return false;
    return true;
  });

  const advance = (id: string) => {
    setItems(prev => prev.map(i => {
      if (i.id !== id) return i;
      const order: ProdStatus[] = ["pending", "in-production", "produced", "packed"];
      const idx = order.indexOf(i.status);
      if (idx < order.length - 1) return { ...i, status: order[idx + 1] };
      return i;
    }));
  };

  const counts = {
    pending: items.filter(i => i.status === "pending").length,
    "in-production": items.filter(i => i.status === "in-production").length,
    produced: items.filter(i => i.status === "produced").length,
    packed: items.filter(i => i.status === "packed").length,
  };

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold">Kitchen Production Board</h2>
        <div className="flex gap-2">
          <button onClick={() => {
            const rows = items.map(i => `<tr><td>${i.id}</td><td>${i.item}</td><td>${i.quantity}</td><td>${i.packaging}</td><td>${i.priority}</td><td>${i.stream}</td><td>${statusConfig[i.status].label}</td></tr>`).join("");
            printHtml("Production Sheet", `
              <div class="badge">Performance Meals</div>
              <h1>Kitchen Production Sheet</h1>
              <div class="meta">Printed: ${nowStr()} ${nowTime()}</div>
              <table>
                <thead><tr><th>#</th><th>Item</th><th>Qty</th><th>Packaging</th><th>Priority</th><th>Stream</th><th>Status</th></tr></thead>
                <tbody>${rows}</tbody>
              </table>
              <div class="footer">Performance Meals — Kitchen Production Sheet — Generated ${nowStr()} ${nowTime()}</div>
            `);
          }} className="border border-[#3A3A3A] text-[#CCCCCC] text-xs px-3 py-2 mono hover:border-[#F5B300] hover:text-[#F5B300] transition-colors">
            ⎙ Print Sheet
          </button>
          <button onClick={() => downloadExcel("production-board.xlsx", items.map(i => ({
            "ID": i.id,
            "Item": i.item,
            "Quantity": i.quantity,
            "Packaging": i.packaging,
            "Priority": i.priority,
            "Stream": i.stream,
            "Goal": i.goal ?? "",
            "Status": statusConfig[i.status].label,
          })))} className="border border-[#3A3A3A] text-[#CCCCCC] text-xs px-3 py-2 mono hover:border-[#F5B300] hover:text-[#F5B300] transition-colors">
            Excel ↓
          </button>
        </div>
      </div>

      {/* Status pipeline */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#2A2A2A]">
        {(["pending", "in-production", "produced", "packed"] as ProdStatus[]).map(s => {
          const cfg = statusConfig[s];
          return (
            <div key={s} className="bg-[#181818] p-4 text-center">
              <div className="text-xs text-[#AAAAAA] uppercase tracking-wider mb-1">{cfg.label}</div>
              <div className="text-3xl font-extrabold mono" style={{ color: cfg.color }}>{counts[s]}</div>
              <div className="text-xs mono text-[#555] mt-1">items</div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex gap-3 items-center">
        <div className="flex gap-1">
          {(["all", "pending", "in-production", "produced", "packed"] as (ProdStatus | "all")[]).map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`text-xs px-3 py-1.5 mono border transition-colors capitalize ${statusFilter === s ? "border-[#F5B300] text-[#F5B300] bg-[#F5B300]/10" : "border-[#2A2A2A] text-[#888] hover:text-[#E8E8E8]"}`}>
              {s === "all" ? "All" : statusConfig[s as ProdStatus].label}
            </button>
          ))}
        </div>
        <div className="w-px h-5 bg-[#2A2A2A]" />
        <div className="flex gap-1">
          {(["all", "RS", "MP"] as const).map(s => (
            <button key={s} onClick={() => setStreamFilter(s)}
              className={`text-xs px-3 py-1.5 mono border transition-colors ${streamFilter === s ? "border-[#F5B300] text-[#F5B300]" : "border-[#2A2A2A] text-[#888]"}`}
              style={streamFilter === s && s !== "all" ? { borderColor: s === "RS" ? "#E85D04" : "#F5B300", color: s === "RS" ? "#E85D04" : "#F5B300" } : undefined}>
              {s === "all" ? "All Streams" : s === "RS" ? "Ready Series" : "Meal Plans"}
            </button>
          ))}
        </div>
      </div>

      {/* Production table */}
      <div className="border border-[#2A2A2A] bg-[#181818] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#2A2A2A]">
              {["#", "Item", "Qty", "Packaging", "Priority", "Stream", "Status", "Action"].map(h => (
                <th key={h} className="px-4 py-2.5 text-left text-xs text-[#AAAAAA] uppercase tracking-wider font-medium whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((item, i) => {
              const cfg = statusConfig[item.status];
              const canAdvance = item.status !== "packed";
              return (
                <tr key={item.id} className={`border-b border-[#2A2A2A] hover:bg-[#1F1F1F] transition-colors ${i % 2 === 0 ? "" : "bg-[#141414]"}`}>
                  <td className="px-4 py-2.5 mono text-xs text-[#555]">{item.id}</td>
                  <td className="px-4 py-2.5 font-medium">
                    {item.item}
                    {item.goal && <span className="ml-2 text-xs mono text-[#666]">{item.goal}</span>}
                  </td>
                  <td className="px-4 py-2.5 mono font-bold text-[#E8E8E8]">{item.quantity}</td>
                  <td className="px-4 py-2.5 text-xs text-[#888]">{item.packaging}</td>
                  <td className="px-4 py-2.5">
                    <span className={`text-xs mono px-2 py-0.5 font-bold capitalize ${priorityStyle[item.priority]}`}>{item.priority}</span>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="text-xs mono font-bold" style={{ color: item.stream === "RS" ? "#E85D04" : "#F5B300" }}>{item.stream}</span>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className={`text-xs mono px-2 py-0.5 font-bold ${cfg.bg}`} style={{ color: cfg.color }}>{cfg.label}</span>
                  </td>
                  <td className="px-4 py-2.5">
                    {canAdvance && (
                      <button onClick={() => advance(item.id)}
                        className="text-xs border border-[#2A2A2A] text-[#888] px-2 py-1 hover:border-[#F5B300] hover:text-[#F5B300] mono transition-colors whitespace-nowrap">
                        Mark {statusConfig[["pending", "in-production", "produced"].find((_, idx) => ["pending", "in-production", "produced"].indexOf(item.status) === idx) as ProdStatus ?? item.status]?.label ?? "Next"} →
                      </button>
                    )}
                    {item.status === "packed" && <span className="text-xs text-green-400 mono">✓ Complete</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
