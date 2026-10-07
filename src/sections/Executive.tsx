import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const revenueWeekly = [
  { day: "Mon", mp: 892, rs: 348 },
  { day: "Tue", mp: 640, rs: 248 },
  { day: "Wed", mp: 1123, rs: 437 },
  { day: "Thu", mp: 1512, rs: 588 },
  { day: "Fri", mp: 1310, rs: 510 },
  { day: "Sat", mp: 706, rs: 274 },
  { day: "Sun", mp: 461, rs: 179 },
];

const churnTrend = [
  { week: "W35", mp: 4.1, rs: 5.2 },
  { week: "W36", mp: 3.8, rs: 4.9 },
  { week: "W37", mp: 3.5, rs: 4.6 },
  { week: "W38", mp: 3.2, rs: 4.3 },
  { week: "W39", mp: 2.8, rs: 4.1 },
];

function KPI({ label, value, sub, color }: { label: string; value: string; sub: string; color?: string }) {
  return (
    <div className="border border-[var(--pm-border)] bg-[var(--pm-surface)] p-4">
      <div className="text-xs font-bold text-[var(--pm-text)] uppercase tracking-widest mb-2">{label}</div>
      <div className="text-2xl font-extrabold mono" style={{ color: color ?? "var(--pm-text-secondary)" }}>{value}</div>
      <div className="text-xs text-[var(--pm-text-muted)] mt-1 mono">{sub}</div>
    </div>
  );
}

function StreamBlock({ stream, accent, kpis }: { stream: string; accent: string; kpis: { label: string; value: string; sub: string; warn?: boolean }[] }) {
  return (
    <div className="border bg-[var(--pm-surface)] p-5" style={{ borderColor: `${accent}30` }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="h-px flex-1 bg-[var(--pm-surface-muted)]" />
        <span className="text-xs font-extrabold tracking-widest uppercase mono" style={{ color: accent }}>{stream}</span>
        <div className="h-px flex-1 bg-[var(--pm-surface-muted)]" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map(k => (
          <div key={k.label} className="border border-[var(--pm-border)] bg-[var(--pm-surface)] p-3">
            <div className="text-xs font-bold text-[var(--pm-text)] uppercase tracking-wider mb-1.5">{k.label}</div>
            <div className="text-xl font-extrabold mono" style={{ color: k.warn ? "#EF4444" : accent }}>{k.value}</div>
            <div className="text-xs text-[var(--pm-text-muted)] mt-0.5 mono">{k.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Executive() {
  const mpRevTotal = revenueWeekly.reduce((a, d) => a + d.mp, 0);
  const rsRevTotal = revenueWeekly.reduce((a, d) => a + d.rs, 0);

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold">Executive Control Center</h2>
          <div className="text-xs text-[var(--pm-text-muted)] mono mt-0.5">CEO Overview — Week of {new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</div>
        </div>
        <div className="flex gap-2">
          <button className="border border-[var(--pm-border-strong)] text-[var(--pm-text-secondary)] text-xs px-4 py-2 mono hover:border-[#F5B300] hover:text-[var(--pm-accent-text)] transition-colors">Export PDF</button>
          <button className="border border-[var(--pm-border-strong)] text-[var(--pm-text-secondary)] text-xs px-4 py-2 mono hover:border-[#F5B300] hover:text-[var(--pm-accent-text)] transition-colors">Schedule Report</button>
        </div>
      </div>

      {/* Top-line KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 sm:grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <KPI label="Total Revenue" value="$5,955" sub="this week" color="#F5B300" />
        <KPI label="Total Subscribers" value="11" sub="active plans" />
        <KPI label="Delivery Success" value="94%" sub="on-time rate" color="#22C55E" />
        <KPI label="Kitchen Efficiency" value="78%" sub="production complete" color="#F5B300" />
        <KPI label="Refund Rate" value="1.8%" sub="this week" />
        <KPI label="Open Tickets" value="3" sub="support queue" color="#EF4444" />
      </div>

      {/* Separated stream performance — never merged */}
      <div className="space-y-3">
        <StreamBlock
          stream="Meal Plans"
          accent="#F5B300"
          kpis={[
            { label: "Active Plans", value: "5", sub: "this week" },
            { label: "Revenue", value: `$${mpRevTotal.toLocaleString()}`, sub: "this week" },
            { label: "Churn Rate", value: "2.8%", sub: "30-day" },
            { label: "Renewal Rate", value: "83%", sub: "last 30d" },
          ]}
        />
        <StreamBlock
          stream="Ready Series"
          accent="#E85D04"
          kpis={[
            { label: "Active Ready Subs", value: "3", sub: "this week" },
            { label: "Revenue", value: `$${rsRevTotal.toLocaleString()}`, sub: "this week" },
            { label: "RtG Orders", value: "2", sub: "today" },
            { label: "Churn Rate", value: "4.1%", sub: "30-day", warn: true },
          ]}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="col-span-2 border border-[var(--pm-border)] bg-[var(--pm-surface)]">
          <div className="px-4 py-3 border-b border-[var(--pm-border)] flex items-center justify-between">
            <span className="text-sm font-semibold">Revenue by Stream — This Week</span>
            <div className="flex gap-3 text-xs mono">
              <span className="text-[var(--pm-accent-text)]">■ Meal Plans</span>
              <span className="text-[var(--pm-secondary-text)]">■ Ready Series</span>
            </div>
          </div>
          <div className="p-4 h-48">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={revenueWeekly} barCategoryGap="25%" barGap={2}>
                <XAxis dataKey="day" tick={{ fill: "var(--pm-text-muted)", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "var(--pm-text-muted)", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} width={40} />
                <Tooltip
                  contentStyle={{ background: "var(--pm-surface)", border: "1px solid var(--pm-border)", borderRadius: 0, fontFamily: "JetBrains Mono", fontSize: 11 }}
                  labelStyle={{ color: "var(--pm-text-muted)" }}
                  formatter={(v, name) => [`$${Number(v ?? 0)}`, name === "mp" ? "Meal Plans" : "Ready Series"]}
                />
                <Bar dataKey="mp" fill="#F5B300" radius={0} name="mp" />
                <Bar dataKey="rs" fill="#E85D04" radius={0} name="rs" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="border border-[var(--pm-border)] bg-[var(--pm-surface)]">
          <div className="px-4 py-3 border-b border-[var(--pm-border)]">
            <span className="text-sm font-semibold">Churn Trend — 5 Weeks</span>
          </div>
          <div className="p-4 h-48">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={churnTrend}>
                <XAxis dataKey="week" tick={{ fill: "var(--pm-text-muted)", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "var(--pm-text-muted)", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} width={30} />
                <Tooltip
                  contentStyle={{ background: "var(--pm-surface)", border: "1px solid var(--pm-border)", borderRadius: 0, fontFamily: "JetBrains Mono", fontSize: 11 }}
                  formatter={(v, name) => [`${Number(v ?? 0)}%`, name === "mp" ? "Meal Plans" : "Ready Series"]}
                />
                <Line type="monotone" dataKey="mp" stroke="#F5B300" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="rs" stroke="#E85D04" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Operational snapshot */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: "Kitchen",
            items: [
              { label: "MP Production", value: "68%", ok: true },
              { label: "RS Production", value: "85%", ok: true },
              { label: "Inventory Alerts", value: "4", ok: false },
            ],
          },
          {
            title: "Delivery",
            items: [
              { label: "Orders Dispatched", value: "6 / 10", ok: true },
              { label: "Out for Delivery", value: "2", ok: true },
              { label: "Failed Today", value: "1", ok: false },
            ],
          },
          {
            title: "Support",
            items: [
              { label: "Open Tickets", value: "3", ok: false },
              { label: "In Progress", value: "1", ok: true },
              { label: "Avg Response", value: "18m", ok: true },
            ],
          },
          {
            title: "Finance",
            items: [
              { label: "Collected Today", value: "$730", ok: true },
              { label: "Pending", value: "$384", ok: true },
              { label: "Failed Payments", value: "1", ok: false },
            ],
          },
        ].map(card => (
          <div key={card.title} className="border border-[var(--pm-border)] bg-[var(--pm-surface)]">
            <div className="px-4 py-2.5 border-b border-[var(--pm-border)]">
              <span className="text-xs font-extrabold mono tracking-widest text-[var(--pm-text-muted)] uppercase">{card.title}</span>
            </div>
            <div className="p-3 space-y-2">
              {card.items.map(item => (
                <div key={item.label} className="flex justify-between text-xs">
                  <span className="text-[var(--pm-text-muted)]">{item.label}</span>
                  <span className={`mono font-bold ${item.ok ? "text-[var(--pm-text-secondary)]" : "text-red-400"}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
