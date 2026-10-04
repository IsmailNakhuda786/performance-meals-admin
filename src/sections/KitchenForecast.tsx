import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useState } from "react";

type ForecastPeriod = "7d" | "14d" | "30d";

const mealForecast7 = [
  { day: "Mon", mp: 18, rs: 10 },
  { day: "Tue", mp: 16, rs: 9 },
  { day: "Wed", mp: 20, rs: 12 },
  { day: "Thu", mp: 18, rs: 10 },
  { day: "Fri", mp: 16, rs: 8 },
  { day: "Sat", mp: 10, rs: 6 },
  { day: "Sun", mp: 6, rs: 4 },
];

const mealForecast14 = mealForecast7.concat([
  { day: "Mon+7", mp: 20, rs: 11 },
  { day: "Tue+7", mp: 18, rs: 10 },
  { day: "Wed+7", mp: 22, rs: 13 },
  { day: "Thu+7", mp: 19, rs: 10 },
  { day: "Fri+7", mp: 17, rs: 9 },
  { day: "Sat+7", mp: 11, rs: 6 },
  { day: "Sun+7", mp: 7, rs: 4 },
]);

const ingredients = [
  { name: "Chicken Breast", unit: "kg", forecast7: 14.4, forecast14: 28.8, forecast30: 61.7, stock: 3.4, low: true },
  { name: "Jasmine Rice", unit: "kg", forecast7: 8.2, forecast14: 16.4, forecast30: 35.2, stock: 2.1, low: true },
  { name: "Broccoli", unit: "kg", forecast7: 5.1, forecast14: 10.2, forecast30: 21.9, stock: 8.3, low: false },
  { name: "Salmon Fillet", unit: "kg", forecast7: 6.3, forecast14: 12.6, forecast30: 27.0, stock: 12.0, low: false },
  { name: "Sweet Potato", unit: "kg", forecast7: 4.8, forecast14: 9.6, forecast30: 20.6, stock: 6.2, low: false },
  { name: "Brown Rice", unit: "kg", forecast7: 7.5, forecast14: 15.0, forecast30: 32.2, stock: 5.5, low: false },
  { name: "Eggs", unit: "units", forecast7: 120, forecast14: 240, forecast30: 515, stock: 84, low: true },
];

const packaging = [
  { name: "Meal Containers (600ml)", forecast7: 104, forecast14: 208, forecast30: 447, stock: 450, low: false },
  { name: "Box Sub Bags", forecast7: 46, forecast14: 92, forecast30: 198, stock: 32, low: true },
  { name: "Ice Packs", forecast7: 230, forecast14: 460, forecast30: 987, stock: 88, low: true },
  { name: "Delivery Labels", forecast7: 104, forecast14: 208, forecast30: 447, stock: 380, low: false },
];

export default function KitchenForecast({ demoMode }: { demoMode?: boolean } = {}) {
  const [period, setPeriod] = useState<ForecastPeriod>("7d");
  const data = period === "7d" ? mealForecast7 : mealForecast14;
  const periodKey = period === "7d" ? "forecast7" : period === "14d" ? "forecast14" : "forecast30";

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold">Kitchen Forecasting</h2>
          <div className="text-xs text-[#888] mono mt-0.5">Production demand prediction by business unit</div>
        </div>
        <div className="flex border border-[#2A2A2A]">
          {(["7d", "14d", "30d"] as ForecastPeriod[]).map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-4 py-2 text-xs mono font-bold transition-colors ${period === p ? "bg-[#F5B300] text-black" : "text-[#888] hover:text-[#E8E8E8]"}`}>
              {p === "7d" ? "7 Days" : p === "14d" ? "14 Days" : "30 Days"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Meals to Produce (MP)", value: data.reduce((a, d) => a + d.mp, 0), color: "#F5B300" },
          { label: "Meals to Produce (RS)", value: data.reduce((a, d) => a + d.rs, 0), color: "#E85D04" },
          { label: "Ingredient Alerts", value: ingredients.filter(i => i.low).length, color: "#EF4444" },
          { label: "Packaging Alerts", value: packaging.filter(p => p.low).length, color: "#E85D04" },
        ].map(k => (
          <div key={k.label} className="border border-[#2A2A2A] bg-[#181818] p-4">
            <div className="text-xs font-bold text-[#FFFFFF] uppercase tracking-widest mb-2">{k.label}</div>
            <div className="text-3xl font-extrabold mono" style={{ color: k.color }}>{k.value}</div>
            <div className="text-xs text-[#888] mono mt-1">Next {period}</div>
          </div>
        ))}
      </div>

      {/* Production chart */}
      {period !== "30d" && (
        <div className="border border-[#2A2A2A] bg-[#181818]">
          <div className="px-4 py-3 border-b border-[#2A2A2A] flex items-center justify-between">
            <span className="text-sm font-semibold">Daily Production Forecast — Next {period === "7d" ? "7" : "14"} Days</span>
            <div className="flex gap-3 text-xs mono">
              <span className="text-[#F5B300]">■ Meal Plans</span>
              <span className="text-[#E85D04]">■ Ready Series</span>
            </div>
          </div>
          <div className="p-4 h-48">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data} barCategoryGap="25%" barGap={2}>
                <XAxis dataKey="day" tick={{ fill: "#888", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#888", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} width={24} />
                <Tooltip contentStyle={{ background: "#181818", border: "1px solid #2A2A2A", borderRadius: 0, fontFamily: "JetBrains Mono", fontSize: 11 }}
                  formatter={(v, name) => [`${Number(v ?? 0)} meals`, name === "mp" ? "Meal Plans" : "Ready Series"]} />
                <Bar dataKey="mp" fill="#F5B300" radius={0} name="mp" />
                <Bar dataKey="rs" fill="#E85D04" radius={0} name="rs" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Ingredient forecast */}
        <div className="border border-[#2A2A2A] bg-[#181818]">
          <div className="px-4 py-3 border-b border-[#2A2A2A] flex items-center justify-between">
            <span className="text-sm font-semibold">Ingredient Requirements</span>
            <button className="text-xs border border-[#2A2A2A] text-[#888] px-3 py-1 mono hover:border-[#F5B300] hover:text-[#F5B300] transition-colors">Export</button>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2A2A2A]">
                <th className="px-4 py-2 text-left text-xs text-[#AAAAAA] uppercase tracking-wider font-medium">Ingredient</th>
                <th className="px-4 py-2 text-right text-xs text-[#AAAAAA] uppercase tracking-wider font-medium">Required</th>
                <th className="px-4 py-2 text-right text-xs text-[#AAAAAA] uppercase tracking-wider font-medium">In Stock</th>
                <th className="px-4 py-2 text-right text-xs text-[#AAAAAA] uppercase tracking-wider font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {ingredients.map((ing, i) => {
                const required = ing[periodKey as keyof typeof ing] as number;
                const deficit = required - ing.stock;
                return (
                  <tr key={ing.name} className={`border-b border-[#2A2A2A] ${i % 2 === 0 ? "" : "bg-[#141414]"}`}>
                    <td className="px-4 py-2.5 font-medium">{ing.name}</td>
                    <td className="px-4 py-2.5 mono text-right text-[#E8E8E8]">{required} {ing.unit}</td>
                    <td className="px-4 py-2.5 mono text-right" style={{ color: ing.low ? "#EF4444" : "#22C55E" }}>{ing.stock} {ing.unit}</td>
                    <td className="px-4 py-2.5 text-right">
                      {deficit > 0 ? (
                        <span className="text-xs text-red-400 mono">-{deficit.toFixed(1)} {ing.unit}</span>
                      ) : (
                        <span className="text-xs text-green-400 mono">OK</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Packaging forecast */}
        <div className="border border-[#2A2A2A] bg-[#181818]">
          <div className="px-4 py-3 border-b border-[#2A2A2A] flex items-center justify-between">
            <span className="text-sm font-semibold">Packaging Requirements</span>
            <button className="text-xs border border-[#2A2A2A] text-[#888] px-3 py-1 mono hover:border-[#F5B300] hover:text-[#F5B300] transition-colors">Export</button>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2A2A2A]">
                <th className="px-4 py-2 text-left text-xs text-[#AAAAAA] uppercase tracking-wider font-medium">Item</th>
                <th className="px-4 py-2 text-right text-xs text-[#AAAAAA] uppercase tracking-wider font-medium">Required</th>
                <th className="px-4 py-2 text-right text-xs text-[#AAAAAA] uppercase tracking-wider font-medium">In Stock</th>
                <th className="px-4 py-2 text-right text-xs text-[#AAAAAA] uppercase tracking-wider font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {packaging.map((pkg, i) => {
                const required = pkg[periodKey as keyof typeof pkg] as number;
                const deficit = required - pkg.stock;
                return (
                  <tr key={pkg.name} className={`border-b border-[#2A2A2A] ${i % 2 === 0 ? "" : "bg-[#141414]"}`}>
                    <td className="px-4 py-2.5 font-medium text-sm">{pkg.name}</td>
                    <td className="px-4 py-2.5 mono text-right">{required}</td>
                    <td className="px-4 py-2.5 mono text-right" style={{ color: pkg.low ? "#EF4444" : "#22C55E" }}>{pkg.stock}</td>
                    <td className="px-4 py-2.5 text-right">
                      {deficit > 0 ? (
                        <span className="text-xs text-red-400 mono font-bold">REORDER</span>
                      ) : (
                        <span className="text-xs text-green-400 mono">OK</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
