import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const channels = [
  { name: "Meta Ads", spend: 1800, revenue: 7200, conversions: 24, newCustomers: 18, roas: 4.0, cac: 100 },
  { name: "Google Ads", spend: 1200, revenue: 4320, conversions: 16, newCustomers: 12, roas: 3.6, cac: 100 },
  { name: "WhatsApp", spend: 0, revenue: 2160, conversions: 12, newCustomers: 8, roas: 0, cac: 0 },
  { name: "Referral", spend: 400, revenue: 1800, conversions: 6, newCustomers: 6, roas: 4.5, cac: 67 },
  { name: "Organic", spend: 0, revenue: 960, conversions: 4, newCustomers: 4, roas: 0, cac: 0 },
];

const weeklyAcquisition = [
  { week: "W35", meta: 8, google: 5, whatsapp: 3, referral: 2 },
  { week: "W36", meta: 12, google: 7, whatsapp: 4, referral: 3 },
  { week: "W37", meta: 10, google: 6, whatsapp: 5, referral: 2 },
  { week: "W38", meta: 14, google: 9, whatsapp: 4, referral: 4 },
  { week: "W39", meta: 18, google: 12, whatsapp: 6, referral: 6 },
];

const campaigns = [
  { id: "CAM-01", name: "September Fitness Push — Meta", channel: "Meta", budget: 1800, spent: 1240, conversions: 14, status: "Active" },
  { id: "CAM-02", name: "Google Search — Meal Plans SG", channel: "Google", budget: 1200, spent: 890, conversions: 9, status: "Active" },
  { id: "CAM-03", name: "WhatsApp Broadcast — Win-Back", channel: "WhatsApp", budget: 0, spent: 0, conversions: 7, status: "Active" },
  { id: "CAM-04", name: "Referral Programme Q3", channel: "Referral", budget: 400, spent: 180, conversions: 6, status: "Active" },
  { id: "CAM-05", name: "August Retention Blast", channel: "Meta", budget: 900, spent: 900, conversions: 18, status: "Completed" },
];

const channelColor: Record<string, string> = {
  Meta: "#1877F2",
  Google: "#34A853",
  WhatsApp: "#25D366",
  Referral: "#F5B300",
  Organic: "#888888",
};

export default function Marketing() {
  const totalRevenue = channels.reduce((a, c) => a + c.revenue, 0);
  const totalSpend = channels.reduce((a, c) => a + c.spend, 0);
  const totalNewCustomers = channels.reduce((a, c) => a + c.newCustomers, 0);
  const blendedROAS = totalSpend > 0 ? (totalRevenue / totalSpend).toFixed(1) : "—";

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold">Marketing & Attribution</h2>
        <div className="flex gap-2">
          <button className="border border-[var(--pm-border-strong)] text-[var(--pm-text-secondary)] text-xs px-4 py-2 mono hover:border-[#F5B300] hover:text-[var(--pm-accent-text)] transition-colors">
            Export CSV
          </button>
          <button className="border border-[var(--pm-border-strong)] text-[var(--pm-text-secondary)] text-xs px-4 py-2 mono hover:border-[#F5B300] hover:text-[var(--pm-accent-text)] transition-colors">
            Shopify Analytics ↗
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Revenue (This Month)", value: `$${totalRevenue.toLocaleString()}`, sub: "attributed", accent: "#F5B300" },
          { label: "Ad Spend", value: `$${totalSpend.toLocaleString()}`, sub: "this month", accent: undefined },
          { label: "Blended ROAS", value: `${blendedROAS}×`, sub: "across all channels", accent: "#22C55E" },
          { label: "New Customers", value: String(totalNewCustomers), sub: "acquired this month", accent: undefined },
        ].map(k => (
          <div key={k.label} className="border border-[var(--pm-border)] bg-[var(--pm-surface)] p-4">
            <div className="text-xs font-bold text-[var(--pm-text)] uppercase tracking-widest mb-2">{k.label}</div>
            <div className="text-3xl font-extrabold mono" style={{ color: k.accent ?? "var(--pm-text-secondary)" }}>{k.value}</div>
            <div className="text-xs text-[var(--pm-text-muted)] mt-1 mono">{k.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Channel breakdown */}
        <div className="border border-[var(--pm-border)] bg-[var(--pm-surface)]">
          <div className="px-4 py-3 border-b border-[var(--pm-border)]">
            <span className="text-sm font-semibold tracking-wide">Revenue by Channel</span>
          </div>
          <div className="p-4 space-y-3">
            {channels.map(c => {
              const pct = Math.round((c.revenue / totalRevenue) * 100);
              return (
                <div key={c.name}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium">{c.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="mono text-[var(--pm-text-muted)] text-xs">${c.revenue.toLocaleString()}</span>
                      <span className="mono font-bold text-xs" style={{ color: channelColor[c.name] ?? "#888" }}>{pct}%</span>
                    </div>
                  </div>
                  <div className="h-2 bg-[var(--pm-surface-muted)]">
                    <div className="h-2" style={{ width: `${pct}%`, background: channelColor[c.name] ?? "#888" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Weekly acquisition chart */}
        <div className="border border-[var(--pm-border)] bg-[var(--pm-surface)]">
          <div className="px-4 py-3 border-b border-[var(--pm-border)]">
            <span className="text-sm font-semibold tracking-wide">New Customer Acquisition — By Week</span>
          </div>
          <div className="p-4 h-52">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyAcquisition} barCategoryGap="20%" barGap={1}>
                <XAxis dataKey="week" tick={{ fill: "var(--pm-text-muted)", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "var(--pm-text-muted)", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} width={24} />
                <Tooltip
                  contentStyle={{ background: "var(--pm-surface)", border: "1px solid var(--pm-border)", borderRadius: 0, fontFamily: "JetBrains Mono", fontSize: 11 }}
                  labelStyle={{ color: "var(--pm-text-muted)" }}
                />
                <Bar dataKey="meta" stackId="a" fill="#1877F2" radius={0} name="Meta" />
                <Bar dataKey="google" stackId="a" fill="#34A853" radius={0} name="Google" />
                <Bar dataKey="whatsapp" stackId="a" fill="#25D366" radius={0} name="WhatsApp" />
                <Bar dataKey="referral" stackId="a" fill="#F5B300" radius={0} name="Referral" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Channel performance table */}
      <div className="border border-[var(--pm-border)] bg-[var(--pm-surface)]">
        <div className="px-4 py-3 border-b border-[var(--pm-border)]">
          <span className="text-sm font-semibold tracking-wide">Channel Performance — This Month</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--pm-border)]">
                {["Channel", "Spend", "Revenue", "ROAS", "Conversions", "New Customers", "CAC"].map(h => (
                  <th key={h} className="px-4 py-2 text-left text-xs text-[var(--pm-text-muted)] uppercase tracking-wider font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {channels.map((c, i) => (
                <tr key={c.name} className={`border-b border-[var(--pm-border)] hover:bg-[var(--pm-surface-subtle)] ${i % 2 === 0 ? "" : "bg-[var(--pm-surface-subtle)]"}`}>
                  <td className="px-4 py-2.5 font-medium flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: channelColor[c.name] ?? "#888" }} />
                    {c.name}
                  </td>
                  <td className="px-4 py-2.5 mono text-[var(--pm-text-muted)]">{c.spend > 0 ? `$${c.spend}` : "—"}</td>
                  <td className="px-4 py-2.5 mono text-[var(--pm-accent-text)] font-bold">${c.revenue.toLocaleString()}</td>
                  <td className="px-4 py-2.5 mono font-bold text-green-400">{c.roas > 0 ? `${c.roas}×` : "—"}</td>
                  <td className="px-4 py-2.5 mono text-center">{c.conversions}</td>
                  <td className="px-4 py-2.5 mono text-center">{c.newCustomers}</td>
                  <td className="px-4 py-2.5 mono">{c.cac > 0 ? `$${c.cac}` : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Active campaigns */}
      <div className="border border-[var(--pm-border)] bg-[var(--pm-surface)]">
        <div className="px-4 py-3 border-b border-[var(--pm-border)] flex items-center justify-between">
          <span className="text-sm font-semibold tracking-wide">Campaigns</span>
          <button className="bg-[#F5B300] text-black text-xs font-bold px-3 py-1.5 mono hover:bg-[#C99200] transition-colors">
            + New Campaign
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--pm-border)]">
                {["ID", "Campaign", "Channel", "Budget", "Spent", "Conversions", "Status"].map(h => (
                  <th key={h} className="px-4 py-2 text-left text-xs text-[var(--pm-text-muted)] uppercase tracking-wider font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c, i) => {
                const pct = c.budget > 0 ? Math.round((c.spent / c.budget) * 100) : 0;
                return (
                  <tr key={c.id} className={`border-b border-[var(--pm-border)] hover:bg-[var(--pm-surface-subtle)] ${i % 2 === 0 ? "" : "bg-[var(--pm-surface-subtle)]"}`}>
                    <td className="px-4 py-2.5 mono text-xs text-[var(--pm-accent-text)]">{c.id}</td>
                    <td className="px-4 py-2.5 font-medium">{c.name}</td>
                    <td className="px-4 py-2.5">
                      <span className="text-xs font-bold" style={{ color: channelColor[c.channel] ?? "#888" }}>{c.channel}</span>
                    </td>
                    <td className="px-4 py-2.5 mono">{c.budget > 0 ? `$${c.budget}` : "—"}</td>
                    <td className="px-4 py-2.5">
                      {c.budget > 0 ? (
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-16 bg-[var(--pm-surface-muted)]">
                            <div className="h-1.5 bg-[#F5B300]" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="mono text-xs text-[var(--pm-text-muted)]">${c.spent} ({pct}%)</span>
                        </div>
                      ) : <span className="text-[var(--pm-text-muted)] mono">—</span>}
                    </td>
                    <td className="px-4 py-2.5 mono text-center font-bold text-green-400">{c.conversions}</td>
                    <td className="px-4 py-2.5">
                      <span className={`text-xs mono px-2 py-0.5 font-bold ${c.status === "Active" ? "bg-green-950 text-green-400" : "bg-[var(--pm-surface-muted)] text-[var(--pm-text-muted)]"}`}>
                        {c.status}
                      </span>
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
