import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

type Period = "7d" | "14d" | "30d" | "90d";

const forecastData: Record<Period, { day: string; rs: number; mp: number }[]> = {
  "7d": [
    { day: "Mon 16", rs: 88, mp: 204 },
    { day: "Tue 17", rs: 72, mp: 198 },
    { day: "Wed 18", rs: 91, mp: 211 },
    { day: "Thu 19", rs: 84, mp: 199 },
    { day: "Fri 20", rs: 96, mp: 218 },
    { day: "Sat 21", rs: 110, mp: 0 },
    { day: "Sun 22", rs: 105, mp: 0 },
  ],
  "14d": [
    { day: "W1 Mon", rs: 88, mp: 204 },
    { day: "W1 Wed", rs: 91, mp: 211 },
    { day: "W1 Fri", rs: 96, mp: 218 },
    { day: "W1 Sat", rs: 110, mp: 0 },
    { day: "W2 Mon", rs: 85, mp: 201 },
    { day: "W2 Wed", rs: 89, mp: 207 },
    { day: "W2 Fri", rs: 94, mp: 215 },
    { day: "W2 Sat", rs: 108, mp: 0 },
  ],
  "30d": [
    { day: "Week 38", rs: 548, mp: 1030 },
    { day: "Week 39", rs: 561, mp: 1048 },
    { day: "Week 40", rs: 574, mp: 1062 },
    { day: "Week 41", rs: 532, mp: 995 },
  ],
  "90d": [
    { day: "Sep", rs: 2240, mp: 4120 },
    { day: "Oct", rs: 2380, mp: 4350 },
    { day: "Nov", rs: 2510, mp: 4590 },
  ],
};

const rsIngredients = [
  { name: "Jasmine Rice", unit: "kg", perMeal: 0.18, inStock: 14.2, forecast7d: 16.1 },
  { name: "Chicken Breast", unit: "kg", perMeal: 0.22, inStock: 18.4, forecast7d: 19.7 },
  { name: "Broccoli", unit: "kg", perMeal: 0.12, inStock: 9.6, forecast7d: 10.8 },
  { name: "Salmon Fillet", unit: "kg", perMeal: 0.20, inStock: 6.8, forecast7d: 17.9 },
  { name: "Olive Oil", unit: "L", perMeal: 0.03, inStock: 4.2, forecast7d: 2.7 },
];

const mpIngredients = [
  { name: "Brown Rice", unit: "kg", perMeal: 0.20, inStock: 28.4, forecast7d: 40.8 },
  { name: "Chicken Thigh", unit: "kg", perMeal: 0.25, inStock: 31.2, forecast7d: 51.0 },
  { name: "Sweet Potato", unit: "kg", perMeal: 0.18, inStock: 22.6, forecast7d: 36.7 },
  { name: "Egg", unit: "pcs", perMeal: 1.5, inStock: 380, forecast7d: 306.0 },
  { name: "Greek Yogurt", unit: "kg", perMeal: 0.12, inStock: 8.4, forecast7d: 24.5 },
];

const rsPackaging = [
  { name: "Ready Meal Container 500ml", perMeal: 1, inStock: 320, forecast7d: 648 },
  { name: "Insulated Bag (Large)", perBatch: 1, inStock: 95, forecast7d: 110 },
  { name: "Ice Pack 200g", perMeal: 1, inStock: 280, forecast7d: 648 },
  { name: "RS Product Labels", perMeal: 1, inStock: 500, forecast7d: 648 },
];

const mpPackaging = [
  { name: "MP Meal Container 650ml", perMeal: 1, inStock: 680, forecast7d: 1428 },
  { name: "Insulated Cooler Bag", perBatch: 1, inStock: 140, forecast7d: 168 },
  { name: "Ice Pack 400g", perMeal: 1, inStock: 590, forecast7d: 1428 },
  { name: "MP Goal Labels (CUT/BUILD/MAINT)", perMeal: 1, inStock: 820, forecast7d: 1428 },
];

const mpForecastInfo = [
  { label: "Active Subscribers", "7d": 142, "14d": 142, "30d": 148, "90d": 158 },
  { label: "Upcoming Reviews Due", "7d": 9, "14d": 22, "30d": 88, "90d": 260 },
  { label: "Pauses Scheduled", "7d": 7, "14d": 11, "30d": 19, "90d": 42 },
  { label: "Net Meals Required", "7d": 1428, "14d": 2856, "30d": 12240, "90d": 36720 },
];

export default function ProductionForecast() {
  const [period, setPeriod] = useState<Period>("7d");

  const data = forecastData[period];
  const totalRS = data.reduce((a, d) => a + d.rs, 0);
  const totalMP = data.reduce((a, d) => a + d.mp, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold">Production Forecasting Engine</h2>
        <div className="flex gap-1 border border-[var(--pm-border)]">
          {(["7d", "14d", "30d", "90d"] as Period[]).map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-4 py-2 text-xs mono font-bold uppercase transition-colors ${period === p ? "bg-[#F5B300] text-black" : "text-[var(--pm-text-muted)] hover:text-[var(--pm-text-secondary)] hover:bg-[var(--pm-surface)]"}`}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="border border-[#E85D04]/30 bg-[var(--pm-surface)] p-4">
          <div className="text-xs text-[var(--pm-text-muted)] uppercase tracking-wider mb-1">RS Meals ({period})</div>
          <div className="text-3xl font-extrabold mono" style={{ color: "#E85D04" }}>{totalRS.toLocaleString()}</div>
        </div>
        <div className="border border-[#F5B300]/30 bg-[var(--pm-surface)] p-4">
          <div className="text-xs text-[var(--pm-text-muted)] uppercase tracking-wider mb-1">MP Meals ({period})</div>
          <div className="text-3xl font-extrabold mono" style={{ color: "#F5B300" }}>{totalMP.toLocaleString()}</div>
        </div>
        <div className="border border-[var(--pm-border)] bg-[var(--pm-surface)] p-4">
          <div className="text-xs text-[var(--pm-text-muted)] uppercase tracking-wider mb-1">Total Production</div>
          <div className="text-3xl font-extrabold mono text-[var(--pm-text-secondary)]">{(totalRS + totalMP).toLocaleString()}</div>
        </div>
        <div className="border border-[var(--pm-border)] bg-[var(--pm-surface)] p-4">
          <div className="text-xs text-[var(--pm-text-muted)] uppercase tracking-wider mb-1">MP Subs (active)</div>
          <div className="text-3xl font-extrabold mono text-[var(--pm-text-secondary)]">{mpForecastInfo[0][period]}</div>
        </div>
      </div>

      {/* Production chart — RS and MP separated, never merged */}
      <div className="border border-[var(--pm-border)] bg-[var(--pm-surface)]">
        <div className="px-4 py-3 border-b border-[var(--pm-border)] flex items-center justify-between">
          <span className="text-sm font-semibold">Production Load Forecast — {period}</span>
          <div className="flex gap-4 text-xs mono">
            <span style={{ color: "#E85D04" }}>■ Ready Series</span>
            <span style={{ color: "#F5B300" }}>■ Meal Plans</span>
          </div>
        </div>
        <div className="p-4" style={{ height: 260 }}>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={data} barGap={2} barCategoryGap="30%">
              <XAxis dataKey="day" tick={{ fill: "var(--pm-text-muted)", fontSize: 11, fontFamily: "JetBrains Mono, monospace" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "var(--pm-text-muted)", fontSize: 11, fontFamily: "JetBrains Mono, monospace" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "var(--pm-surface)", border: "1px solid var(--pm-border)", borderRadius: 0 }}
                labelStyle={{ color: "var(--pm-text-muted)", fontSize: 11 }}
                itemStyle={{ color: "var(--pm-text-secondary)", fontSize: 11 }}
              />
              <Bar dataKey="rs" name="Ready Series" fill="#E85D04" radius={0} />
              <Bar dataKey="mp" name="Meal Plans" fill="#F5B300" radius={0} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two-column ingredient + packaging tables */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Ready Series Ingredients */}
        <div className="border border-[#E85D04]/20 bg-[var(--pm-surface)]">
          <div className="px-4 py-3 border-b border-[#E85D04]/20 flex items-center gap-2">
            <div className="w-2 h-2 bg-[#E85D04]" />
            <span className="text-sm font-semibold" style={{ color: "#E85D04" }}>RS — Ingredient Requirements</span>
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[var(--pm-border)]">
                {["Ingredient", "In Stock", "Need (7d)", "Status"].map(h => (
                  <th key={h} className="px-3 py-2 text-left text-[var(--pm-text-muted)] uppercase tracking-wider font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rsIngredients.map(i => {
                const deficit = i.forecast7d - i.inStock;
                const ok = deficit <= 0;
                return (
                  <tr key={i.name} className="border-b border-[var(--pm-border-soft)] hover:bg-[var(--pm-surface-subtle)]">
                    <td className="px-3 py-2 font-medium">{i.name}</td>
                    <td className="px-3 py-2 mono">{i.inStock}{i.unit}</td>
                    <td className="px-3 py-2 mono">{i.forecast7d.toFixed(1)}{i.unit}</td>
                    <td className="px-3 py-2">
                      {ok
                        ? <span className="text-green-400 font-bold">OK</span>
                        : <span className="text-red-400 font-bold">DEFICIT {deficit.toFixed(1)}{i.unit}</span>
                      }
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Meal Plans Ingredients */}
        <div className="border border-[#F5B300]/20 bg-[var(--pm-surface)]">
          <div className="px-4 py-3 border-b border-[#F5B300]/20 flex items-center gap-2">
            <div className="w-2 h-2 bg-[#F5B300]" />
            <span className="text-sm font-semibold" style={{ color: "#F5B300" }}>MP — Ingredient Requirements</span>
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[var(--pm-border)]">
                {["Ingredient", "In Stock", "Need (7d)", "Status"].map(h => (
                  <th key={h} className="px-3 py-2 text-left text-[var(--pm-text-muted)] uppercase tracking-wider font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mpIngredients.map(i => {
                const deficit = i.forecast7d - i.inStock;
                const ok = deficit <= 0;
                return (
                  <tr key={i.name} className="border-b border-[var(--pm-border-soft)] hover:bg-[var(--pm-surface-subtle)]">
                    <td className="px-3 py-2 font-medium">{i.name}</td>
                    <td className="px-3 py-2 mono">{i.inStock}{i.unit}</td>
                    <td className="px-3 py-2 mono">{i.forecast7d.toFixed(1)}{i.unit}</td>
                    <td className="px-3 py-2">
                      {ok
                        ? <span className="text-green-400 font-bold">OK</span>
                        : <span className="text-red-400 font-bold">DEFICIT {deficit.toFixed(1)}{i.unit}</span>
                      }
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Packaging forecast */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="border border-[#E85D04]/20 bg-[var(--pm-surface)]">
          <div className="px-4 py-3 border-b border-[#E85D04]/20 flex items-center gap-2">
            <div className="w-2 h-2 bg-[#E85D04]" />
            <span className="text-sm font-semibold" style={{ color: "#E85D04" }}>RS — Packaging Requirements</span>
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[var(--pm-border)]">
                {["Item", "In Stock", "Need (7d)", "Status"].map(h => (
                  <th key={h} className="px-3 py-2 text-left text-[var(--pm-text-muted)] uppercase tracking-wider font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rsPackaging.map(p => {
                const deficit = p.forecast7d - p.inStock;
                const ok = deficit <= 0;
                return (
                  <tr key={p.name} className="border-b border-[var(--pm-border-soft)] hover:bg-[var(--pm-surface-subtle)]">
                    <td className="px-3 py-2 font-medium">{p.name}</td>
                    <td className="px-3 py-2 mono">{p.inStock}</td>
                    <td className="px-3 py-2 mono">{p.forecast7d}</td>
                    <td className="px-3 py-2">
                      {ok
                        ? <span className="text-green-400 font-bold">OK</span>
                        : <span className="text-red-400 font-bold">REORDER +{deficit}</span>
                      }
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="border border-[#F5B300]/20 bg-[var(--pm-surface)]">
          <div className="px-4 py-3 border-b border-[#F5B300]/20 flex items-center gap-2">
            <div className="w-2 h-2 bg-[#F5B300]" />
            <span className="text-sm font-semibold" style={{ color: "#F5B300" }}>MP — Packaging Requirements</span>
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[var(--pm-border)]">
                {["Item", "In Stock", "Need (7d)", "Status"].map(h => (
                  <th key={h} className="px-3 py-2 text-left text-[var(--pm-text-muted)] uppercase tracking-wider font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mpPackaging.map(p => {
                const deficit = p.forecast7d - p.inStock;
                const ok = deficit <= 0;
                return (
                  <tr key={p.name} className="border-b border-[var(--pm-border-soft)] hover:bg-[var(--pm-surface-subtle)]">
                    <td className="px-3 py-2 font-medium">{p.name}</td>
                    <td className="px-3 py-2 mono">{p.inStock}</td>
                    <td className="px-3 py-2 mono">{p.forecast7d}</td>
                    <td className="px-3 py-2">
                      {ok
                        ? <span className="text-green-400 font-bold">OK</span>
                        : <span className="text-red-400 font-bold">REORDER +{deficit}</span>
                      }
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MP-specific forecast info */}
      <div className="border border-[#F5B300]/20 bg-[var(--pm-surface)]">
        <div className="px-4 py-3 border-b border-[#F5B300]/20 flex items-center gap-2">
          <div className="w-2 h-2 bg-[#F5B300]" />
          <span className="text-sm font-semibold" style={{ color: "#F5B300" }}>Meal Plan Subscriber Forecast</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--pm-surface-muted)]">
          {mpForecastInfo.map(row => (
            <div key={row.label} className="bg-[var(--pm-surface)] p-4">
              <div className="text-xs text-[var(--pm-text-muted)] uppercase tracking-wider mb-2">{row.label}</div>
              <div className="text-2xl font-extrabold mono text-[var(--pm-accent-text)]">{(row[period] as number).toLocaleString()}</div>
              <div className="text-xs mono text-[var(--pm-text-muted)] mt-1">{period} window</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
