import { useState } from "react";
import PillToggle from "../components/PillToggle";

interface PackagingItem {
  id: string;
  name: string;
  category: string;
  unit: string;
  inStock: number;
  lowThreshold: number;
  reorderQty: number;
  supplier: string;
  lastRestocked: string;
  usedPerWeek: number;
  weeksLeft: number;
}

const packagingItems: PackagingItem[] = [
  { id: "PKG-01", name: "Meal Containers 600ml", category: "Containers", unit: "units", inStock: 450, lowThreshold: 200, reorderQty: 500, supplier: "PackRight Industries", lastRestocked: "08 Sep 2024", usedPerWeek: 104, weeksLeft: 4.3 },
  { id: "PKG-02", name: "Meal Containers 450ml", category: "Containers", unit: "units", inStock: 180, lowThreshold: 100, reorderQty: 300, supplier: "PackRight Industries", lastRestocked: "08 Sep 2024", usedPerWeek: 60, weeksLeft: 3.0 },
  { id: "PKG-03", name: "Box Sub Delivery Bags", category: "Bags", unit: "units", inStock: 32, lowThreshold: 50, reorderQty: 200, supplier: "PackRight Industries", lastRestocked: "06 Sep 2024", usedPerWeek: 46, weeksLeft: 0.7 },
  { id: "PKG-04", name: "Meal Plan Delivery Bags", category: "Bags", unit: "units", inStock: 95, lowThreshold: 60, reorderQty: 200, supplier: "PackRight Industries", lastRestocked: "06 Sep 2024", usedPerWeek: 52, weeksLeft: 1.8 },
  { id: "PKG-05", name: "Ice Packs 200g", category: "Ice Packs", unit: "units", inStock: 88, lowThreshold: 150, reorderQty: 300, supplier: "CoolChain Logistics", lastRestocked: "06 Sep 2024", usedPerWeek: 130, weeksLeft: 0.7 },
  { id: "PKG-06", name: "Ice Packs 400g", category: "Ice Packs", unit: "units", inStock: 44, lowThreshold: 80, reorderQty: 200, supplier: "CoolChain Logistics", lastRestocked: "01 Sep 2024", usedPerWeek: 100, weeksLeft: 0.4 },
  { id: "PKG-07", name: "Delivery Labels (MP)", category: "Labels", unit: "units", inStock: 380, lowThreshold: 100, reorderQty: 500, supplier: "PackRight Industries", lastRestocked: "08 Sep 2024", usedPerWeek: 52, weeksLeft: 7.3 },
  { id: "PKG-08", name: "Delivery Labels (RS)", category: "Labels", unit: "units", inStock: 290, lowThreshold: 100, reorderQty: 500, supplier: "PackRight Industries", lastRestocked: "08 Sep 2024", usedPerWeek: 46, weeksLeft: 6.3 },
  { id: "PKG-09", name: "Sticker Seals (Logo)", category: "Labels", unit: "sheets", inStock: 120, lowThreshold: 50, reorderQty: 200, supplier: "PackRight Industries", lastRestocked: "08 Sep 2024", usedPerWeek: 20, weeksLeft: 6.0 },
  { id: "PKG-10", name: "Nutritional Info Cards", category: "Labels", unit: "units", inStock: 200, lowThreshold: 80, reorderQty: 300, supplier: "PackRight Industries", lastRestocked: "08 Sep 2024", usedPerWeek: 52, weeksLeft: 3.8 },
];

const categories = ["All", "Containers", "Bags", "Ice Packs", "Labels"];

function stockStatus(item: PackagingItem): { label: string; color: string } {
  if (item.inStock === 0) return { label: "Out of Stock", color: "#EF4444" };
  if (item.inStock < item.lowThreshold) return { label: "Low Stock", color: "#F5B300" };
  return { label: "In Stock", color: "#22C55E" };
}

export default function Packaging({ demoMode }: { demoMode?: boolean } = {}) {
  const [catFilter, setCatFilter] = useState("All");
  const [showLowOnly, setShowLowOnly] = useState(false);

  const filtered = packagingItems.filter(p => {
    if (catFilter !== "All" && p.category !== catFilter) return false;
    if (showLowOnly && p.inStock >= p.lowThreshold) return false;
    return true;
  });

  const outCount = packagingItems.filter(p => p.inStock === 0).length;
  const lowCount = packagingItems.filter(p => p.inStock > 0 && p.inStock < p.lowThreshold).length;

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold">Packaging Center</h2>
        <div className="flex gap-2">
          <button className="border border-[#3A3A3A] text-[#CCCCCC] text-xs px-4 py-2 mono hover:border-[#F5B300] hover:text-[#F5B300] transition-colors">Export CSV</button>
          <button className="bg-[#F5B300] text-black text-xs font-bold px-4 py-2 mono hover:bg-[#C99200] transition-colors">+ Add Item</button>
        </div>
      </div>

      {(outCount > 0 || lowCount > 0) && (
        <div className="border border-red-800/30 bg-red-950/10 px-4 py-2.5 text-xs text-red-300 mono">
          ⚠ {outCount > 0 ? `${outCount} item${outCount > 1 ? "s" : ""} out of stock.` : ""} {lowCount > 0 ? `${lowCount} item${lowCount > 1 ? "s" : ""} below minimum threshold.` : ""} Raise purchase orders immediately.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total SKUs", value: packagingItems.length, color: "#888" },
          { label: "In Stock", value: packagingItems.filter(p => p.inStock >= p.lowThreshold).length, color: "#22C55E" },
          { label: "Low Stock", value: lowCount, color: "#F5B300" },
          { label: "Out of Stock", value: outCount, color: "#EF4444" },
        ].map(k => (
          <div key={k.label} className="border border-[#2A2A2A] bg-[#181818] p-4">
            <div className="text-xs font-bold text-[#FFFFFF] uppercase tracking-widest mb-2">{k.label}</div>
            <div className="text-3xl font-extrabold mono" style={{ color: k.color }}>{k.value}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 items-center flex-wrap">
        <div className="flex gap-1">
          {categories.map(c => (
            <button key={c} onClick={() => setCatFilter(c)}
              className={`text-xs px-3 py-1.5 mono border transition-colors ${catFilter === c ? "border-[#F5B300] text-[#F5B300] bg-[#F5B300]/10" : "border-[#2A2A2A] text-[#888] hover:text-[#E8E8E8]"}`}>
              {c}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-xs text-[#AAAAAA] cursor-pointer select-none ml-auto">
          <PillToggle checked={showLowOnly} onChange={setShowLowOnly} accent="orange" />
          Low / out of stock only
        </label>
      </div>

      <div className="border border-[#2A2A2A] bg-[#181818] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#2A2A2A]">
              {["ID", "Item", "Category", "In Stock", "Min Threshold", "Weeks Left", "Used/Wk", "Supplier", "Status", "Actions"].map(h => (
                <th key={h} className="px-4 py-2 text-left text-xs text-[#AAAAAA] uppercase tracking-wider font-medium whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => {
              const st = stockStatus(p);
              const pct = Math.min(100, Math.round((p.inStock / (p.lowThreshold * 2)) * 100));
              return (
                <tr key={p.id} className={`border-b border-[#2A2A2A] hover:bg-[#1F1F1F] transition-colors ${i % 2 === 0 ? "" : "bg-[#141414]"}`}>
                  <td className="px-4 py-2.5 mono text-xs text-[#555]">{p.id}</td>
                  <td className="px-4 py-2.5 font-medium">{p.name}</td>
                  <td className="px-4 py-2.5 text-xs text-[#888]">{p.category}</td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 bg-[#2A2A2A]">
                        <div className="h-1.5 transition-all" style={{ width: `${pct}%`, background: st.color }} />
                      </div>
                      <span className="mono text-xs" style={{ color: st.color }}>{p.inStock} {p.unit}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 mono text-xs text-[#888]">{p.lowThreshold}</td>
                  <td className="px-4 py-2.5 mono text-xs" style={{ color: p.weeksLeft < 1 ? "#EF4444" : p.weeksLeft < 2 ? "#F5B300" : "#22C55E" }}>
                    {p.weeksLeft.toFixed(1)}w
                  </td>
                  <td className="px-4 py-2.5 mono text-xs text-[#888]">{p.usedPerWeek}</td>
                  <td className="px-4 py-2.5 text-xs text-[#888]">{p.supplier}</td>
                  <td className="px-4 py-2.5">
                    <span className="text-xs mono px-2 py-0.5 font-bold" style={{ color: st.color }}>{st.label}</span>
                  </td>
                  <td className="px-4 py-2.5">
                    <button className="text-xs border border-[#2A2A2A] px-2 py-1 text-[#888] hover:border-[#F5B300] hover:text-[#F5B300] mono transition-colors">Reorder</button>
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
