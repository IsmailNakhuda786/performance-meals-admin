import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from "recharts";

const monthlyRevenue = [
  { month: "Apr", mp: 16200, rs: 6300 },
  { month: "May", mp: 17800, rs: 6900 },
  { month: "Jun", mp: 18400, rs: 7200 },
  { month: "Jul", mp: 19100, rs: 7800 },
  { month: "Aug", mp: 18760, rs: 7400 },
  { month: "Sep", mp: 14400, rs: 5600 },
];

const subscriberGrowth = [
  { month: "Apr", active: 7, churned: 1 },
  { month: "May", active: 8, churned: 1 },
  { month: "Jun", active: 9, churned: 2 },
  { month: "Jul", active: 10, churned: 1 },
  { month: "Aug", active: 11, churned: 1 },
  { month: "Sep", active: 11, churned: 0 },
];

const deliveryPerf = [
  { week: "W35", success: 91, failed: 9 },
  { week: "W36", success: 93, failed: 7 },
  { week: "W37", success: 90, failed: 10 },
  { week: "W38", success: 95, failed: 5 },
  { week: "W39", success: 94, failed: 6 },
];

const productPerf = [
  { name: "Meal Plan — CUT 12wk", revenue: 9240, subs: 2 },
  { name: "Meal Plan — BUILD 12wk", revenue: 7560, subs: 2 },
  { name: "Meal Plan — MAINTAIN 12wk", revenue: 5040, subs: 1 },
  { name: "Ready Sub — 10-meal", revenue: 4320, subs: 3 },
  { name: "Ready Sub — 5-meal", revenue: 1530, subs: 2 },
  { name: "Ready Series A-la-carte", revenue: 567, subs: 0 },
];

export default function BusinessIntel() {
  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold">Business Intelligence</h2>
          <div className="text-xs text-[var(--pm-text-muted)] mono mt-0.5">Analytics — {new Date(Date.now() - 5*30*24*60*60*1000).toLocaleDateString("en-GB", { month: "short" })}–{new Date().toLocaleDateString("en-GB", { month: "short", year: "numeric" })}</div>
        </div>
        <div className="flex gap-2">
          <button className="border border-[var(--pm-border-strong)] text-[var(--pm-text-secondary)] text-xs px-4 py-2 mono hover:border-[#F5B300] hover:text-[var(--pm-accent-text)] transition-colors">Export PDF</button>
          <button className="border border-[var(--pm-border-strong)] text-[var(--pm-text-secondary)] text-xs px-4 py-2 mono hover:border-[#F5B300] hover:text-[var(--pm-accent-text)] transition-colors">Export CSV</button>
        </div>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 sm:grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: "Total MRR", value: "$22,400", sub: "projected Sep", color: "#F5B300" },
          { label: "Active Subscribers", value: "11", sub: "+1 vs last week", color: "#22C55E" },
          { label: "Churn Rate", value: "3.2%", sub: "30-day avg" },
          { label: "Avg LTV", value: "$964", sub: "per customer", color: "#F5B300" },
          { label: "Delivery Success", value: "94%", sub: "this week" },
          { label: "Refund Rate", value: "1.8%", sub: "this week", color: undefined },
        ].map(k => (
          <div key={k.label} className="border border-[var(--pm-border)] bg-[var(--pm-surface)] p-4">
            <div className="text-xs font-bold text-[var(--pm-text)] uppercase tracking-widest mb-2">{k.label}</div>
            <div className="text-2xl font-extrabold mono" style={{ color: k.color ?? "var(--pm-text-secondary)" }}>{k.value}</div>
            <div className="text-xs text-[var(--pm-text-muted)] mt-1 mono">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Revenue trend */}
      <div className="border border-[var(--pm-border)] bg-[var(--pm-surface)]">
        <div className="px-4 py-3 border-b border-[var(--pm-border)] flex items-center justify-between">
          <span className="text-sm font-semibold">Monthly Revenue by Business Unit — {new Date(Date.now() - 5*30*24*60*60*1000).toLocaleDateString("en-GB", { month: "short" })}–{new Date().toLocaleDateString("en-GB", { month: "short", year: "numeric" })}</span>
          <div className="flex gap-3 text-xs mono">
            <span className="text-[var(--pm-accent-text)]">■ Meal Plans</span>
            <span className="text-[var(--pm-secondary-text)]">■ Ready Series</span>
          </div>
        </div>
        <div className="p-4 h-52">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyRevenue} barCategoryGap="25%" barGap={2}>
              <XAxis dataKey="month" tick={{ fill: "var(--pm-text-muted)", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "var(--pm-text-muted)", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} width={40} />
              <Tooltip
                contentStyle={{ background: "var(--pm-surface)", border: "1px solid var(--pm-border)", borderRadius: 0, fontFamily: "JetBrains Mono", fontSize: 11 }}
                formatter={(v, name) => [`$${Number(v ?? 0).toLocaleString()}`, name === "mp" ? "Meal Plans" : "Ready Series"]}
              />
              <Bar dataKey="mp" fill="#F5B300" radius={0} name="mp" />
              <Bar dataKey="rs" fill="#E85D04" radius={0} name="rs" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Subscriber growth */}
        <div className="border border-[var(--pm-border)] bg-[var(--pm-surface)]">
          <div className="px-4 py-3 border-b border-[var(--pm-border)]">
            <span className="text-sm font-semibold">Subscriber Growth vs Churn</span>
          </div>
          <div className="p-4 h-48">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={subscriberGrowth}>
                <XAxis dataKey="month" tick={{ fill: "var(--pm-text-muted)", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "var(--pm-text-muted)", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} width={24} />
                <Tooltip
                  contentStyle={{ background: "var(--pm-surface)", border: "1px solid var(--pm-border)", borderRadius: 0, fontFamily: "JetBrains Mono", fontSize: 11 }}
                />
                <Area type="monotone" dataKey="active" stroke="#F5B300" fill="#F5B30015" strokeWidth={2} name="Active" />
                <Area type="monotone" dataKey="churned" stroke="#EF4444" fill="#EF444415" strokeWidth={2} name="Churned" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Delivery performance */}
        <div className="border border-[var(--pm-border)] bg-[var(--pm-surface)]">
          <div className="px-4 py-3 border-b border-[var(--pm-border)]">
            <span className="text-sm font-semibold">Delivery Success Rate — 5 Weeks</span>
          </div>
          <div className="p-4 h-48">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={deliveryPerf}>
                <XAxis dataKey="week" tick={{ fill: "var(--pm-text-muted)", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "var(--pm-text-muted)", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} width={36} domain={[80, 100]} />
                <Tooltip
                  contentStyle={{ background: "var(--pm-surface)", border: "1px solid var(--pm-border)", borderRadius: 0, fontFamily: "JetBrains Mono", fontSize: 11 }}
                  formatter={(v, name) => [`${Number(v ?? 0)}%`, name]}
                />
                <Line type="monotone" dataKey="success" stroke="#22C55E" strokeWidth={2} dot={{ fill: "#22C55E" }} name="Success" />
                <Line type="monotone" dataKey="failed" stroke="#EF4444" strokeWidth={2} dot={{ fill: "#EF4444" }} name="Failed" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Product performance */}
      <div className="border border-[var(--pm-border)] bg-[var(--pm-surface)]">
        <div className="px-4 py-3 border-b border-[var(--pm-border)]">
          <span className="text-sm font-semibold">Product Performance — Revenue This Month</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--pm-border)]">
                {["Product", "Revenue", "Subscribers", "Share", "Trend"].map(h => (
                  <th key={h} className="px-4 py-2 text-left text-xs text-[var(--pm-text-muted)] uppercase tracking-wider font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {productPerf.map((p, i) => {
                const totalRev = productPerf.reduce((a, x) => a + x.revenue, 0);
                const pct = Math.round((p.revenue / totalRev) * 100);
                const isMp = p.name.includes("Meal Plan");
                return (
                  <tr key={p.name} className={`border-b border-[var(--pm-border)] hover:bg-[var(--pm-surface-subtle)] ${i % 2 === 0 ? "" : "bg-[var(--pm-surface-subtle)]"}`}>
                    <td className="px-4 py-2.5 font-medium">
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 inline-block" style={{ background: isMp ? "#F5B300" : "#E85D04" }} />
                        {p.name}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 mono font-bold text-[var(--pm-accent-text)]">${p.revenue.toLocaleString()}</td>
                    <td className="px-4 py-2.5 mono text-center">{p.subs > 0 ? p.subs : "—"}</td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-20 bg-[var(--pm-surface-muted)]">
                          <div className="h-1.5" style={{ width: `${pct}%`, background: isMp ? "#F5B300" : "#E85D04" }} />
                        </div>
                        <span className="mono text-xs text-[var(--pm-text-muted)]">{pct}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-xs mono text-green-400">↑ stable</td>
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
