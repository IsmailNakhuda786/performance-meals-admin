import { useState } from "react";

const ingredients = [
  { id: "I01", name: "Chicken Breast (1kg)", category: "Protein", unit: "packs", stock: 8, minimum: 20, weeklyUsage: 45, supplier: "SG Fresh Meats", cost: 12.50 },
  { id: "I02", name: "Salmon Fillet (500g)", category: "Protein", unit: "portions", stock: 12, minimum: 15, weeklyUsage: 28, supplier: "Ocean Fresh SG", cost: 9.80 },
  { id: "I03", name: "Beef Mince (500g)", category: "Protein", unit: "packs", stock: 22, minimum: 15, weeklyUsage: 20, supplier: "SG Fresh Meats", cost: 8.40 },
  { id: "I04", name: "Turkey Mince (500g)", category: "Protein", unit: "packs", stock: 18, minimum: 10, weeklyUsage: 18, supplier: "SG Fresh Meats", cost: 7.90 },
  { id: "I05", name: "Jasmine Rice (5kg)", category: "Carbs", unit: "bags", stock: 3, minimum: 10, weeklyUsage: 22, supplier: "Prima Foods", cost: 14.00 },
  { id: "I06", name: "Brown Rice (5kg)", category: "Carbs", unit: "bags", stock: 7, minimum: 8, weeklyUsage: 18, supplier: "Prima Foods", cost: 15.50 },
  { id: "I07", name: "Wholemeal Pasta (500g)", category: "Carbs", unit: "packs", stock: 25, minimum: 12, weeklyUsage: 14, supplier: "Fairprice Wholesale", cost: 3.20 },
  { id: "I08", name: "Sweet Potato (1kg)", category: "Veg", unit: "bags", stock: 5, minimum: 12, weeklyUsage: 16, supplier: "Ah Huat Veg", cost: 4.50 },
  { id: "I09", name: "Broccoli (500g)", category: "Veg", unit: "packs", stock: 14, minimum: 10, weeklyUsage: 12, supplier: "Ah Huat Veg", cost: 3.80 },
  { id: "I10", name: "Quinoa (1kg)", category: "Carbs", unit: "bags", stock: 9, minimum: 6, weeklyUsage: 8, supplier: "Fairprice Wholesale", cost: 8.90 },
];

const packaging = [
  { id: "P01", name: "500ml PP Tray", type: "Container", stock: 480, minimum: 200, weeklyUsage: 320 },
  { id: "P02", name: "650ml PP Tray", type: "Container", stock: 180, minimum: 150, weeklyUsage: 120 },
  { id: "P03", name: "Vacuum Seal Bag (M)", type: "Packaging", stock: 350, minimum: 200, weeklyUsage: 200 },
  { id: "P04", name: "Clamshell Box (S)", type: "Container", stock: 90, minimum: 100, weeklyUsage: 80 },
  { id: "P05", name: "Performance Meals Label", type: "Label", stock: 650, minimum: 400, weeklyUsage: 500 },
  { id: "P06", name: "Delivery Box (Large)", type: "Shipping", stock: 45, minimum: 60, weeklyUsage: 50 },
];

const categories = ["All", "Protein", "Carbs", "Veg"];

// Ready Series frozen products with physical vs rolling stock
const frozenProducts = [
  { id: "RS-01", name: "Chicken Teriyaki Bowl", sku: "RS-CHK-001", rollingStock: 42, physicalStock: 38, parLevel: 60, lastPhysicalAudit: "11 Sep 2024", status: "LOW" },
  { id: "RS-02", name: "Salmon Fillet Pack",    sku: "RS-SAL-002", rollingStock: 28, physicalStock: 25, parLevel: 40, lastPhysicalAudit: "11 Sep 2024", status: "LOW" },
  { id: "RS-03", name: "Beef Bolognese",        sku: "RS-BEF-003", rollingStock: 75, physicalStock: 72, parLevel: 50, lastPhysicalAudit: "11 Sep 2024", status: "OK" },
  { id: "RS-04", name: "Grilled Lemon Chicken", sku: "RS-GLC-004", rollingStock: 18, physicalStock: 18, parLevel: 40, lastPhysicalAudit: "11 Sep 2024", status: "LOW" },
  { id: "RS-05", name: "Vegetable Stir Fry",    sku: "RS-VEG-005", rollingStock: 55, physicalStock: 52, parLevel: 45, lastPhysicalAudit: "11 Sep 2024", status: "OK" },
  { id: "RS-06", name: "Prawn Fried Rice",      sku: "RS-PRN-006", rollingStock: 0,  physicalStock: 0,  parLevel: 30, lastPhysicalAudit: "11 Sep 2024", status: "OUT" },
  { id: "RS-07", name: "Korean BBQ Pork",       sku: "RS-KBQ-007", rollingStock: 63, physicalStock: 60, parLevel: 50, lastPhysicalAudit: "11 Sep 2024", status: "OK" },
];

export default function Inventory({ demoMode }: { demoMode?: boolean } = {}) {
  const [tab, setTab] = useState<"ingredients" | "ready-series">("ingredients");
  const [catFilter, setCatFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filteredIng = ingredients.filter(i => {
    if (catFilter !== "All" && i.category !== catFilter) return false;
    if (search && !i.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const lowStockIng = ingredients.filter(i => i.stock < i.minimum).length;
  const lowStockPkg = packaging.filter(p => p.stock < p.minimum).length;

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold">Inventory</h2>
        <div className="flex gap-2">
          <button className="border border-[#3A3A3A] text-[#CCCCCC] text-xs px-4 py-2 mono hover:border-[#F5B300] hover:text-[#F5B300] transition-colors">
            Export CSV
          </button>
          <button className="bg-[#F5B300] text-black text-xs font-bold px-4 py-2 mono hover:bg-[#C99200] transition-colors">
            + Add Stock
          </button>
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Ingredients", value: String(ingredients.length), sub: "tracked items" },
          { label: "Low Stock Alerts", value: String(lowStockIng), sub: "need reorder", accent: true },
          { label: "Frozen Products", value: String(frozenProducts.length), sub: "RS tracked" },
          { label: "Frozen Alerts", value: String(frozenProducts.filter(r => r.status !== "OK").length), sub: "below par / out", warn: frozenProducts.filter(r => r.status !== "OK").length > 0 },
        ].map(k => (
          <div key={k.label} className="border bg-[#181818] p-4" style={{ borderColor: k.accent || k.warn ? "#ef444440" : "#2A2A2A" }}>
            <div className="text-xs font-bold text-[#FFFFFF] uppercase tracking-widest mb-2">{k.label}</div>
            <div className={`text-3xl font-extrabold mono ${k.accent || k.warn ? "text-red-400" : "text-[#E8E8E8]"}`}>{k.value}</div>
            <div className="text-xs text-[#888] mt-1 mono">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Operational schedule notice */}
      <div className="border border-[#2A2A2A] bg-[#0D0D0D] px-4 py-2.5 flex items-center gap-4 flex-wrap">
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "#444", letterSpacing: "0.1em" }}>SCHEDULE:</span>
        <span className="text-xs text-[#555]"><span className="mono text-[#888]">Thu 3pm</span> — Export Inventory Report</span>
        <span className="text-xs text-[#555]"><span className="mono text-[#888]">Biweekly Wed</span> — Update physical stock date (audit & rolling stock accuracy)</span>
        <span className="text-xs text-[#555]"><span className="mono text-[#888]">Every other day</span> — Deduct sold meals · Add new stock ready to sell</span>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#2A2A2A]">
        {([
          { id: "ingredients" as const,  label: "Ingredients",           badge: lowStockIng },
          { id: "ready-series" as const, label: "Ready Series — Frozen",  badge: frozenProducts.filter(r => r.status !== "OK").length },
        ]).map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-5 py-3 text-sm font-medium mono transition-colors ${
              tab === t.id ? "border-b-2 border-[#F5B300] text-[#F5B300]" : "text-[#888] hover:text-[#E8E8E8]"
            }`}
          >
            {t.label}
            {t.badge > 0 && (
              <span className="ml-2 bg-red-900 text-red-400 text-xs px-1.5 py-0.5 mono">{t.badge}</span>
            )}
          </button>
        ))}
      </div>

      {tab === "ingredients" && (
        <>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Search ingredient…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-[#181818] border border-[#2A2A2A] text-[#E8E8E8] text-sm px-3 py-2 w-64 focus:outline-none focus:border-[#F5B300] placeholder:text-[#444]"
            />
            <div className="flex gap-1">
              {categories.map(c => (
                <button
                  key={c}
                  onClick={() => setCatFilter(c)}
                  className={`px-3 py-2 text-xs mono transition-colors ${
                    catFilter === c ? "bg-[#F5B300] text-black font-bold" : "border border-[#2A2A2A] text-[#888] hover:text-[#E8E8E8]"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div className="border border-[#2A2A2A] bg-[#181818] overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2A2A2A]">
                  {["#", "Ingredient", "Category", "In Stock", "Minimum", "Wkly Usage", "Weeks Cover", "Supplier", "Unit Cost", "Status"].map(h => (
                    <th key={h} className="px-4 py-2 text-left text-xs text-[#AAAAAA] uppercase tracking-wider font-medium whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredIng.map((item, i) => {
                  const isLow = item.stock < item.minimum;
                  const weeksCover = item.weeklyUsage > 0 ? (item.stock / item.weeklyUsage * 7).toFixed(1) : "—";
                  return (
                    <tr key={item.id} className={`border-b border-[#2A2A2A] hover:bg-[#1F1F1F] transition-colors ${i % 2 === 0 ? "" : "bg-[#141414]"}`}>
                      <td className="px-4 py-2.5 mono text-xs text-[#555]">{item.id}</td>
                      <td className="px-4 py-2.5 font-medium">{item.name}</td>
                      <td className="px-4 py-2.5 text-xs text-[#888]">{item.category}</td>
                      <td className={`px-4 py-2.5 mono font-bold ${isLow ? "text-red-400" : "text-green-400"}`}>{item.stock} {item.unit}</td>
                      <td className="px-4 py-2.5 mono text-xs text-[#888]">{item.minimum}</td>
                      <td className="px-4 py-2.5 mono text-xs text-[#888]">{item.weeklyUsage}</td>
                      <td className={`px-4 py-2.5 mono text-xs font-bold ${Number(weeksCover) < 1 ? "text-red-400" : "text-[#888]"}`}>{weeksCover}d</td>
                      <td className="px-4 py-2.5 text-xs text-[#888]">{item.supplier}</td>
                      <td className="px-4 py-2.5 mono text-xs">${item.cost.toFixed(2)}</td>
                      <td className="px-4 py-2.5">
                        <span className={`text-xs mono px-2 py-0.5 font-bold ${isLow ? "bg-red-950 text-red-400" : "bg-green-950 text-green-400"}`}>
                          {isLow ? "LOW" : "OK"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}


      {tab === "ready-series" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider display">Ready Series — Frozen Stock</p>
              <p className="text-xs text-[#666] mono mt-0.5">Rolling stock (system) vs Physical stock (packing supervisor audit) · Par level reference for Chef production planning</p>
            </div>
            <div className="flex gap-2">
              <div className="border border-[#2A2A2A] px-3 py-1.5 text-xs mono text-[#888]">
                Last physical audit: <span className="text-[#CCCCCC]">Wed 11 Sep 2024</span>
              </div>
              <button className="border border-[#2A2A2A] text-[#888] text-xs px-3 py-1.5 mono hover:border-[#E85D04] hover:text-[#E85D04] transition-colors">
                Update Physical Stock Date
              </button>
              <button className="border border-[#3A3A3A] text-[#CCCCCC] text-xs px-3 py-1.5 mono hover:border-[#F5B300] hover:text-[#F5B300] transition-colors">
                Export Inventory Report ↓
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: "Below Par Level", value: String(frozenProducts.filter(r => r.status === "LOW").length), color: "#F5B300" },
              { label: "Out of Stock",    value: String(frozenProducts.filter(r => r.status === "OUT").length),  color: "#EF4444" },
              { label: "Stock OK",        value: String(frozenProducts.filter(r => r.status === "OK").length),   color: "#22C55E" },
            ].map(s => (
              <div key={s.label} className="border border-[#2A2A2A] bg-[#181818] p-4 text-center">
                <div className="text-2xl font-extrabold mono" style={{ color: s.color }}>{s.value}</div>
                <div className="text-xs text-[#888] mt-1 uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="border border-[#2A2A2A] bg-[#181818] overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[#2A2A2A]">
                  {["Product", "SKU", "Rolling Stock", "Physical Stock", "Variance", "Par Level", "Status", "Last Physical Audit", "Actions"].map(h => (
                    <th key={h} className="px-4 py-2 text-left text-xs font-bold text-[#FFFFFF] uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {frozenProducts.map((r, i) => {
                  const variance = r.physicalStock - r.rollingStock;
                  const statusStyle = r.status === "OK" ? "bg-green-950 text-green-400" : r.status === "OUT" ? "bg-red-950 text-red-400" : "bg-yellow-950 text-yellow-400";
                  return (
                    <tr key={r.sku} className={`border-b border-[#2A2A2A] hover:bg-[#1F1F1F] ${i % 2 === 0 ? "" : "bg-[#141414]"}`}>
                      <td className="px-4 py-2.5 font-medium text-[#E8E8E8]">{r.name}</td>
                      <td className="px-4 py-2.5 mono text-[#E85D04]">{r.sku}</td>
                      <td className="px-4 py-2.5 mono text-center text-[#AAAAAA]">{r.rollingStock}</td>
                      <td className="px-4 py-2.5 mono text-center font-bold" style={{ color: r.physicalStock === 0 ? "#EF4444" : r.physicalStock < r.parLevel ? "#F5B300" : "#22C55E" }}>{r.physicalStock}</td>
                      <td className="px-4 py-2.5 mono text-center text-xs" style={{ color: variance < 0 ? "#EF4444" : variance > 0 ? "#F5B300" : "#555" }}>{variance === 0 ? "—" : (variance > 0 ? "+" : "") + variance}</td>
                      <td className="px-4 py-2.5 mono text-center text-[#888]">{r.parLevel}</td>
                      <td className="px-4 py-2.5"><span className={`mono px-2 py-0.5 ${statusStyle}`}>{r.status}</span></td>
                      <td className="px-4 py-2.5 mono text-[#666] text-xs">{r.lastPhysicalAudit}</td>
                      <td className="px-4 py-2.5">
                        <button className="text-xs mono text-[#888] border border-[#2A2A2A] px-2 py-0.5 hover:border-[#E85D04] hover:text-[#E85D04] transition-colors">
                          Update Count
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="text-[10px] text-[#444] mono">Rolling Stock = system-tracked count. Physical Stock = Packing Supervisor physical count. Biweekly Wednesday: update physical stock date for audit accuracy. New stock ready to sell → use "+ Add Stock" to increase rolling stock.</p>
        </div>
      )}
    </div>
  );
}
