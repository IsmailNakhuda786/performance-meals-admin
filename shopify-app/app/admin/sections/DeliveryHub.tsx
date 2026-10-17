import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useState } from "react";

const successTrend = [
  { week: "W35", rate: 91 },
  { week: "W36", rate: 93 },
  { week: "W37", rate: 90 },
  { week: "W38", rate: 95 },
  { week: "W39", rate: 94 },
];

const riders = [
  { id: "RDR-01", name: "Ahmad Farid", zone: "North", deliveriesToday: 8, completed: 7, failed: 0, onTime: 100, rating: 4.9, status: "active" },
  { id: "RDR-02", name: "Benny Lim", zone: "East", deliveriesToday: 6, completed: 5, failed: 1, onTime: 83, rating: 4.5, status: "active" },
  { id: "RDR-03", name: "Chandra S", zone: "West", deliveriesToday: 7, completed: 6, failed: 0, onTime: 91, rating: 4.7, status: "active" },
  { id: "RDR-04", name: "David Koh", zone: "Central", deliveriesToday: 5, completed: 3, failed: 1, onTime: 75, rating: 4.1, status: "active" },
  { id: "RDR-05", name: "Encik Rizal", zone: "South", deliveriesToday: 4, completed: 4, failed: 0, onTime: 100, rating: 4.8, status: "idle" },
];

const failedQueue = [
  { id: "ORD-2403", customer: "Wei Jie Lim", address: "Blk 44 Ang Mo Kio Ave 3 #08-12", rider: "Benny Lim", stream: "Meal Plans", reason: "No one home", time: "09:45", attempts: 2 },
  { id: "ORD-2407", customer: "Jason Yeo", address: "21 Tanjong Pagar Plaza #04-05", rider: "David Koh", stream: "Ready Series", reason: "Wrong address", time: "11:20", attempts: 1 },
];

const heatZones = [
  { zone: "North", deliveries: 18, success: 94, color: "#22C55E" },
  { zone: "East", deliveries: 14, success: 86, color: "#F5B300" },
  { zone: "West", deliveries: 16, success: 91, color: "#22C55E" },
  { zone: "Central", deliveries: 22, success: 82, color: "#F5B300" },
  { zone: "South", deliveries: 10, success: 97, color: "#22C55E" },
];

export default function DeliveryHub() {
  const [tab, setTab] = useState<"overview" | "riders" | "failed">("overview");

  const totalToday = riders.reduce((a, r) => a + r.deliveriesToday, 0);
  const completedToday = riders.reduce((a, r) => a + r.completed, 0);
  const failedToday = riders.reduce((a, r) => a + r.failed, 0);
  const avgOnTime = Math.round(riders.reduce((a, r) => a + r.onTime, 0) / riders.length);

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold">Delivery Operations Hub</h2>
          <div className="text-xs text-[var(--pm-text-muted)] mono mt-0.5">Real-time delivery performance — {new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</div>
        </div>
        <div className="flex gap-2">
          <button className="border border-[var(--pm-border-strong)] text-[var(--pm-text-secondary)] text-xs px-4 py-2 mono hover:border-[#F5B300] hover:text-[var(--pm-accent-text)] transition-colors">Export Manifest</button>
          <button className="border border-[var(--pm-border-strong)] text-[var(--pm-text-secondary)] text-xs px-4 py-2 mono hover:border-[#F5B300] hover:text-[var(--pm-accent-text)] transition-colors">Export CSV</button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Deliveries Today", value: totalToday, sub: "total assigned", color: "var(--pm-text-secondary)" },
          { label: "Completed", value: completedToday, sub: `${Math.round((completedToday / totalToday) * 100)}% of today`, color: "#22C55E" },
          { label: "Failed", value: failedToday, sub: "need reattempt", color: failedToday > 0 ? "#EF4444" : "#22C55E" },
          { label: "On-Time Rate", value: `${avgOnTime}%`, sub: "avg this week", color: avgOnTime >= 90 ? "#22C55E" : "#F5B300" },
        ].map(k => (
          <div key={k.label} className="border border-[var(--pm-border)] bg-[var(--pm-surface)] p-4">
            <div className="text-xs font-bold text-[var(--pm-text)] uppercase tracking-widest mb-2">{k.label}</div>
            <div className="text-3xl font-extrabold mono" style={{ color: k.color }}>{k.value}</div>
            <div className="text-xs text-[var(--pm-text-muted)] mono mt-1">{k.sub}</div>
          </div>
        ))}
      </div>

      {failedToday > 0 && (
        <div className="border border-red-800/30 bg-red-950/10 px-4 py-2.5 text-xs text-red-300 mono">
          ⚠ {failedToday} failed deliver{failedToday > 1 ? "ies" : "y"} today. See Failed Queue tab for reattempt scheduling.
        </div>
      )}

      <div className="flex border-b border-[var(--pm-border)]">
        {([["overview", "Zone Overview"], ["riders", "Rider Leaderboard"], ["failed", "Failed Queue"]] as ["overview" | "riders" | "failed", string][]).map(([t, label]) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-3 text-sm font-medium mono transition-colors ${tab === t ? "border-b-2 border-[#F5B300] text-[var(--pm-accent-text)]" : "text-[var(--pm-text-muted)] hover:text-[var(--pm-text-secondary)]"}`}>
            {label}
            {t === "failed" && failedToday > 0 && (
              <span className="ml-2 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 mono">{failedToday}</span>
            )}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Heatmap */}
          <div className="col-span-2 border border-[var(--pm-border)] bg-[var(--pm-surface)]">
            <div className="px-4 py-3 border-b border-[var(--pm-border)]">
              <span className="text-sm font-semibold">Delivery Heatmap — Zone Performance</span>
            </div>
            <div className="p-4 space-y-3">
              {heatZones.map(z => (
                <div key={z.zone} className="flex items-center gap-3">
                  <div className="w-16 text-xs text-[var(--pm-text-muted)] mono">{z.zone}</div>
                  <div className="flex-1 h-8 bg-[var(--pm-bg)] border border-[var(--pm-border)] relative flex items-center">
                    <div className="h-full transition-all" style={{ width: `${z.success}%`, background: `${z.color}22` }} />
                    <div className="absolute inset-0 flex items-center px-3 justify-between">
                      <span className="text-xs mono text-[var(--pm-text-muted)]">{z.deliveries} deliveries</span>
                      <span className="text-xs mono font-bold" style={{ color: z.color }}>{z.success}% success</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Success trend */}
          <div className="border border-[var(--pm-border)] bg-[var(--pm-surface)]">
            <div className="px-4 py-3 border-b border-[var(--pm-border)]">
              <span className="text-sm font-semibold">Success Rate Trend</span>
            </div>
            <div className="p-4 h-48">
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={successTrend}>
                  <XAxis dataKey="week" tick={{ fill: "var(--pm-text-muted)", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "var(--pm-text-muted)", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} domain={[80, 100]} width={36} />
                  <Tooltip contentStyle={{ background: "var(--pm-surface)", border: "1px solid var(--pm-border)", borderRadius: 0, fontFamily: "JetBrains Mono", fontSize: 11 }}
                    formatter={(v) => [`${Number(v ?? 0)}%`, "Success"]} />
                  <Line type="monotone" dataKey="rate" stroke="#22C55E" strokeWidth={2} dot={{ fill: "#22C55E", r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {tab === "riders" && (
        <div className="border border-[var(--pm-border)] bg-[var(--pm-surface)] overflow-x-auto">
          <div className="px-4 py-3 border-b border-[var(--pm-border)]">
            <span className="text-sm font-semibold">Rider Leaderboard — Today</span>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--pm-border)]">
                {["Rank", "Rider", "Zone", "Assigned", "Completed", "Failed", "On-Time %", "Rating", "Status"].map(h => (
                  <th key={h} className="px-4 py-2 text-left text-xs text-[var(--pm-text-muted)] uppercase tracking-wider font-medium whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...riders].sort((a, b) => b.onTime - a.onTime).map((r, i) => (
                <tr key={r.id} className={`border-b border-[var(--pm-border)] hover:bg-[var(--pm-surface-subtle)] transition-colors ${i % 2 === 0 ? "" : "bg-[var(--pm-surface-subtle)]"}`}>
                  <td className="px-4 py-2.5 mono font-bold text-sm" style={{ color: i === 0 ? "#F5B300" : i === 1 ? "#888" : "#555" }}>#{i + 1}</td>
                  <td className="px-4 py-2.5 font-semibold">{r.name}</td>
                  <td className="px-4 py-2.5 text-xs text-[var(--pm-text-muted)]">{r.zone}</td>
                  <td className="px-4 py-2.5 mono text-center">{r.deliveriesToday}</td>
                  <td className="px-4 py-2.5 mono text-center text-green-400">{r.completed}</td>
                  <td className="px-4 py-2.5 mono text-center" style={{ color: r.failed > 0 ? "#EF4444" : "#555" }}>{r.failed}</td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 bg-[var(--pm-surface-muted)]">
                        <div className="h-1.5" style={{ width: `${r.onTime}%`, background: r.onTime >= 90 ? "#22C55E" : "#F5B300" }} />
                      </div>
                      <span className="mono text-xs">{r.onTime}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 mono font-bold text-[var(--pm-accent-text)]">★ {r.rating}</td>
                  <td className="px-4 py-2.5">
                    <span className={`text-xs mono px-2 py-0.5 font-bold ${r.status === "active" ? "text-green-400 bg-green-950/30" : "text-[var(--pm-text-muted)] bg-[var(--pm-surface-muted)]"}`}>{r.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "failed" && (
        <div className="space-y-3">
          {failedQueue.length === 0 ? (
            <div className="border border-[var(--pm-border)] bg-[var(--pm-surface)] p-8 text-center text-[var(--pm-text-muted)] text-sm">No failed deliveries today.</div>
          ) : failedQueue.map(f => (
            <div key={f.id} className="border border-red-800/30 bg-red-950/10 p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="mono text-[var(--pm-accent-text)] font-bold text-sm">{f.id}</span>
                    <span className="text-xs border px-2 py-0.5 mono" style={{ color: f.stream === "Meal Plans" ? "#F5B300" : "#E85D04", borderColor: f.stream === "Meal Plans" ? "#F5B300" + "40" : "#E85D04" + "40" }}>{f.stream}</span>
                    <span className="text-xs text-red-400 mono font-bold">{f.attempts} attempt{f.attempts > 1 ? "s" : ""}</span>
                  </div>
                  <div className="font-semibold">{f.customer}</div>
                  <div className="text-xs text-[var(--pm-text-muted)] mono">{f.address}</div>
                  <div className="text-xs text-[var(--pm-text-muted)]">Rider: {f.rider} · Failed at {f.time} · Reason: {f.reason}</div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button className="text-xs border border-[#F5B300]/40 text-[var(--pm-accent-text)] px-3 py-1.5 mono hover:bg-[#F5B300]/10 transition-colors">Schedule Reattempt</button>
                  <button className="text-xs border border-[#E85D04]/40 text-[var(--pm-secondary-text)] px-3 py-1.5 mono hover:bg-[#E85D04]/10 transition-colors">Contact Customer</button>
                  <button className="text-xs border border-red-800/40 text-red-400 px-3 py-1.5 mono hover:bg-red-950 transition-colors">Mark as Failed</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
