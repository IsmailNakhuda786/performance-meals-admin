import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import StatusBadge from "../components/StatusBadge";
import { orders, weeklyRevenue, stockAlerts, subscriptions } from "../data";
import type { BusinessStream, Theme } from "../App";

const mpOrders = orders.filter(o => o.planType === "Meal Plan");
const rsOrders = orders.filter(o => o.planType === "Box Subscription" || o.planType === "Ready-to-Go");

const mpRevenue = mpOrders.reduce((s, o) => s + o.total, 0);
const rsRevenue = rsOrders.reduce((s, o) => s + o.total, 0);

const pausedMpSubs = subscriptions.filter(s => s.status === "Paused" && s.planType === "Meal Plan");
const pausedRsSubs = subscriptions.filter(s => s.status === "Paused" && s.planType !== "Meal Plan");
const renewalDueMp = subscriptions.filter(s => s.status === "Renewal Due" && s.planType === "Meal Plan");

const mpChartData = weeklyRevenue.map(d => ({ day: d.day, revenue: Math.round(d.revenue * 0.72) }));
const rsChartData = weeklyRevenue.map(d => ({ day: d.day, revenue: Math.round(d.revenue * 0.28) }));

const mpActivity = [
  { time: "11:42", text: "ORD-2408 Natalie Foo → Packing", type: "pack" },
  { time: "11:31", text: "Aisha Rahman renewal triggered", type: "renewal" },
  { time: "10:55", text: "ORD-2401 Marcus Tan packed & sealed", type: "pack" },
  { time: "09:30", text: "Run A dispatch started — 5 MP orders", type: "deliver" },
  { time: "08:45", text: "Bryan Low menu swap confirmed", type: "confirm" },
  { time: "08:10", text: "ORD-2407 Reuben Chew plan started", type: "confirm" },
];

const rsActivity = [
  { time: "11:50", text: "ORD-2403 Wei Jie Lim box packed", type: "pack" },
  { time: "10:22", text: "Stock alert: Jasmine Rice below minimum", type: "alert" },
  { time: "09:47", text: "ORD-2405 Darren Ong delivered — Run A", type: "deliver" },
  { time: "09:30", text: "ORD-2406 Jade Koh box confirmed", type: "deliver" },
  { time: "08:55", text: "Jason Yeo box sub pause started", type: "pause" },
  { time: "08:20", text: "ORD-2409 Jason Yeo order confirmed", type: "confirm" },
];

const activityColor: Record<string, string> = {
  pack: "bg-blue-400",
  renewal: "bg-orange-400",
  alert: "bg-red-400",
  deliver: "bg-green-400",
  confirm: "bg-[var(--pm-accent-text)]",
  pause: "bg-yellow-600",
};

interface Props {
  stream: BusinessStream;
  swapAlert: boolean;
  demoMode?: boolean;
  theme: Theme;
}

function MealPlansDashboard({ swapAlert, theme }: { swapAlert: boolean; theme: Theme }) {
  const activeMpSubs = subscriptions.filter(s => s.status === "Active" && s.planType === "Meal Plan");

  return (
    <div className="dashboard-pilot p-4 sm:p-6 lg:p-8 space-y-6">
      {swapAlert && (
        <div className={`rounded-lg border px-4 py-3 flex items-center gap-3 ${theme === "dark" ? "border-yellow-800/50 bg-yellow-950/40" : "border-amber-200 bg-amber-50"}`}>
          <span className={`text-lg ${theme === "dark" ? "text-yellow-400" : "text-amber-700"}`}>!</span>
          <span className={`text-sm font-medium ${theme === "dark" ? "text-yellow-200" : "text-amber-900"}`}>
            Menu swap cutoff in less than 2 hours — <strong>Thursday 1:59 PM</strong>.
            {" "}{subscriptions.filter(s => s.planType === "Meal Plan" && !s.menuConfirmed && s.status === "Active").length} plan(s) have unconfirmed menus.
          </span>
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Active Plans", value: String(activeMpSubs.length), sub: `${renewalDueMp.length} renewal due`, accent: false },
          { label: "Orders Today", value: String(mpOrders.length), sub: `${mpOrders.reduce((a, o) => a + o.meals, 0)} meals to pack`, accent: false },
          { label: "Revenue Today", value: `$${mpRevenue.toFixed(0)}`, sub: "SGD", accent: true },
          { label: "Paused Plans", value: String(pausedMpSubs.length), sub: "resuming this month", accent: false },
        ].map(k => (
          <div key={k.label} className="pm-stat-card p-5" style={{ borderColor: k.accent ? "rgba(183,121,0,0.22)" : "var(--pm-border)" }}>
            <div className="pm-section-heading mb-3">{k.label}</div>
            <div className={`text-4xl font-extrabold mono leading-none ${k.accent ? "text-[var(--pm-accent-text)]" : "text-[var(--pm-text)]"}`}>{k.value}</div>
            <div className="text-xs text-[var(--pm-text-muted)] mt-2 mono">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Plan type breakdown + Renewal alerts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[var(--pm-surface)] border border-[var(--pm-border)] p-4">
          <div className="pm-section-heading mb-3">Active Plans by Type</div>
          <div className="space-y-3">
            {(["Low Carb Regular", "Low Carb Regular+", "Balance Regular", "Balance Regular+", "6 by 60", "6 by 60 Plus"] as const).map(pt => {
              const count = activeMpSubs.filter(s => s.mealPlanType === pt).length;
              return (
                <div key={pt}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[var(--pm-text-secondary)]">{pt}</span>
                    <span className="mono text-[var(--pm-accent-text)] font-bold">{count}</span>
                  </div>
                  <div className="h-1.5 bg-[var(--pm-border-soft)]">
                    <div className="h-1.5 bg-[var(--pm-accent-text)]" style={{ width: activeMpSubs.length ? `${(count / activeMpSubs.length) * 100}%` : "0%" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-[var(--pm-surface)] border border-[var(--pm-border)] p-4">
          <div className="pm-section-heading mb-3">Renewal Due</div>
          {renewalDueMp.length === 0 ? (
            <div className="text-xs text-[var(--pm-text-muted)] mono">No renewals pending</div>
          ) : (
            <div className="space-y-2">
              {renewalDueMp.map(s => (
                <div key={s.id} className="flex items-center justify-between border border-[var(--pm-secondary-text)]/20 px-3 py-2">
                  <div>
                    <div className="text-sm font-semibold">{s.customerName}</div>
                    <div className="text-xs text-[var(--pm-text-muted)] mono">{s.mealPlanType ?? s.planType}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs mono text-[var(--pm-secondary-text)] font-bold">{s.nextBilling}</div>
                    <div className="text-xs text-[var(--pm-text-muted)] mono">{s.planWeek}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-[var(--pm-surface)] border border-[var(--pm-border)] p-4">
          <div className="pm-section-heading mb-3">Menu Confirmation</div>
          <div className="space-y-2">
            {activeMpSubs.map(s => (
              <div key={s.id} className="flex items-center justify-between text-xs">
                <span className="text-[var(--pm-text-secondary)]">{s.customerName}</span>
                <span className={`mono px-2 py-0.5 font-bold ${
                  s.menuConfirmed
                    ? theme === "dark" ? "bg-green-950 text-green-400" : "bg-green-50 text-green-700"
                    : theme === "dark" ? "bg-orange-950 text-orange-400" : "bg-orange-50 text-orange-700"
                }`}>
                  {s.menuConfirmed ? "Confirmed" : "Pending"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Orders table */}
      <div className="border border-[var(--pm-border)] bg-[var(--pm-surface)]">
        <div className="px-4 py-2.5 border-b border-[var(--pm-border)] flex items-center justify-between">
          <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 13, color: "var(--pm-text)" }}>Meal Plan Orders — Today</span>
          <span className="text-xs mono text-[var(--pm-text-muted)]">14 Sep 2024 · {mpOrders.length} orders</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--pm-border-soft)]">
                {["Order", "Customer", "Plan Type", "Meals", "Plan Week", "Delivery Window", "Total", "Status"].map(h => (
                  <th key={h} className="px-4 py-2 text-left text-xs text-[var(--pm-text-muted)] uppercase tracking-wider font-medium whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mpOrders.map((o, i) => (
                <tr key={o.id} className={`border-b border-[var(--pm-border-soft)] hover:bg-[var(--pm-bg)] transition-colors ${i % 2 === 0 ? "" : "bg-[var(--pm-surface-subtle)]"}`}>
                  <td className="px-4 py-2.5 mono text-[var(--pm-accent-text)] text-xs">{o.id}</td>
                  <td className="px-4 py-2.5 font-medium">{o.customer}</td>
                  <td className="px-4 py-2.5 text-xs text-[var(--pm-text-muted)]">{o.planType}</td>
                  <td className="px-4 py-2.5 mono text-center">{o.meals}</td>
                  <td className="px-4 py-2.5 mono text-xs text-[var(--pm-text-muted)]">{o.planWeek ?? "–"}</td>
                  <td className="px-4 py-2.5 mono text-xs text-[var(--pm-text-muted)]">{o.deliveryWindow}</td>
                  <td className="px-4 py-2.5 mono font-bold">${o.total.toFixed(2)}</td>
                  <td className="px-4 py-2.5"><StatusBadge status={o.status} variant={theme} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Chart + Paused + Activity */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="border border-[var(--pm-border)] bg-[var(--pm-surface)]">
          <div className="px-4 py-3 border-b border-[var(--pm-border)]">
            <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 12, color: "var(--pm-text)", letterSpacing: "0.01em" }}>7-Day Meal Plan Revenue</span>
          </div>
          <div className="p-4 h-48">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={mpChartData} barCategoryGap="30%">
                <XAxis dataKey="day" tick={{ fill: "var(--pm-text-muted)", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "var(--pm-text-muted)", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} width={38} />
                <Tooltip
                  contentStyle={{ background: "var(--pm-surface)", border: "1px solid var(--pm-border)", borderRadius: 8, fontFamily: "JetBrains Mono", fontSize: 11 }}
                  labelStyle={{ color: "var(--pm-text-muted)" }}
                  formatter={(v) => [`$${Number(v ?? 0).toFixed(0)}`, "MP Revenue"]}
                />
                <Bar dataKey="revenue" fill="var(--pm-accent-text)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="border border-[var(--pm-border)] bg-[var(--pm-surface)]">
          <div className="px-4 py-3 border-b border-[var(--pm-border)]">
            <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 12, color: "var(--pm-text)" }}>Paused Plans</span>
          </div>
          {pausedMpSubs.length === 0 ? (
            <div className="p-4 text-xs text-[var(--pm-text-muted)] mono">No paused plans</div>
          ) : (
            <div className="p-3 space-y-2">
              {pausedMpSubs.map(s => (
                <div key={s.id} className="border border-[var(--pm-border-soft)] px-3 py-2.5 flex items-center justify-between">
                  <div>
                    <div className="text-base font-semibold">{s.customerName}</div>
                    <div className="text-sm font-medium text-[var(--pm-text-muted)] mono">{s.planType} · {s.mealsPerWeek} meals/wk</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm mono font-bold ${theme === "dark" ? "text-yellow-400" : "text-amber-700"}`}>{s.pauseStart} – {s.pauseEnd}</div>
                    <div className={`text-sm mono font-semibold ${theme === "dark" ? "text-green-400" : "text-green-700"}`}>Resumes {s.resumeDate}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="px-4 py-3 border-t border-[var(--pm-border-soft)]">
            <div className="text-xs font-bold text-[var(--pm-text)] uppercase tracking-wider mb-2">Stock Alerts</div>
            {stockAlerts.slice(0, 3).map(s => (
              <div key={s.item} className="flex justify-between text-xs py-1 border-b border-[var(--pm-border-soft)]">
                <span className="text-[var(--pm-text-secondary)] truncate pr-2">{s.item}</span>
                <span className={`mono font-bold flex-shrink-0 ${s.current < s.minimum ? "text-red-400" : "text-[var(--pm-text-muted)]"}`}>
                  {s.current}/{s.minimum}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-[var(--pm-border)] bg-[var(--pm-surface)]">
          <div className="px-4 py-3 border-b border-[var(--pm-border)]">
            <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 12, color: "var(--pm-text)" }}>Activity Feed</span>
          </div>
          <div className="p-3 space-y-1">
            {mpActivity.map((a, i) => (
              <div key={i} className="flex items-start gap-2.5 py-1.5 border-b border-[var(--pm-border-soft)]">
                <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${activityColor[a.type]}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-[var(--pm-text-secondary)] leading-snug">{a.text}</div>
                </div>
                <div className="mono text-xs text-[var(--pm-text-muted)] flex-shrink-0">{a.time}</div>
              </div>
            ))}
          </div>
          <div className="px-4 py-3 border-t border-[var(--pm-border-soft)] flex justify-between text-xs mono">
            <span className="text-[var(--pm-text-muted)]">MP revenue today</span>
            <span className="text-[var(--pm-accent-text)] font-bold">${mpRevenue.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReadySeriesDashboard({ swapAlert, theme }: { swapAlert: boolean; theme: Theme }) {
  const activeRsSubs = subscriptions.filter(s => s.status === "Active" && s.planType === "Box Subscription");
  const subOrders = rsOrders.filter(o => o.planType === "Box Subscription");
  const rtgOrders = rsOrders.filter(o => o.planType === "Ready-to-Go");

  const termBreakdown = [
    { term: "3 Months", count: subscriptions.filter(s => s.planType !== "Meal Plan" && s.term === "3 months" && s.status === "Active").length },
    { term: "6 Months", count: subscriptions.filter(s => s.planType !== "Meal Plan" && s.term === "6 months" && s.status === "Active").length },
  ];

  return (
    <div className="dashboard-pilot p-4 sm:p-6 lg:p-8 space-y-6">
      {swapAlert && (
        <div className={`rounded-lg border px-4 py-3 flex items-center gap-3 ${theme === "dark" ? "border-yellow-800/50 bg-yellow-950/40" : "border-amber-200 bg-amber-50"}`}>
          <span className={`text-lg ${theme === "dark" ? "text-yellow-400" : "text-amber-700"}`}>!</span>
          <span className={`text-sm font-medium ${theme === "dark" ? "text-yellow-200" : "text-amber-900"}`}>
            Subscription cutoff in less than 2 hours — <strong>Thursday 1:59 PM</strong>. Confirm pending subscription changes.
          </span>
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Active RS Subscriptions", value: String(activeRsSubs.length), sub: `${pausedRsSubs.length} paused`, accent: false },
          { label: "Subscription Orders Today", value: String(subOrders.length), sub: `${subOrders.reduce((a, o) => a + o.meals, 0)} items`, accent: false },
          { label: "Ready-to-Go Today", value: String(rtgOrders.length), sub: `${rtgOrders.reduce((a, o) => a + o.meals, 0)} individual meals`, accent: false },
          { label: "RS Revenue Today", value: `$${rsRevenue.toFixed(0)}`, sub: "SGD", accent: true },
        ].map(k => (
          <div key={k.label} className="pm-stat-card pm-stat-card-orange p-5" style={{ borderColor: k.accent ? "rgba(194,65,12,0.20)" : "var(--pm-border)" }}>
            <div className="pm-section-heading mb-3">{k.label}</div>
            <div className={`text-4xl font-extrabold mono leading-none ${k.accent ? "text-[var(--pm-secondary-text)]" : "text-[var(--pm-text)]"}`}>{k.value}</div>
            <div className="text-xs text-[var(--pm-text-muted)] mt-2 mono">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Box size breakdown + Paused RS subs + Dispatch summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="border border-[var(--pm-border)] bg-[var(--pm-surface)] p-4">
          <div className="pm-section-heading mb-3">Ready Series Subscriptions</div>
          <div className="space-y-3 mb-4">
            {termBreakdown.map(b => (
              <div key={b.term}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[var(--pm-text-secondary)]">{b.term}</span>
                  <span className={`mono font-extrabold ${b.count > 0 ? "text-[var(--pm-secondary-text)]" : "text-[var(--pm-text-muted)]"}`}>{b.count}</span>
                </div>
                <div className="h-1.5 bg-[var(--pm-border-soft)]">
                  <div className="h-1.5 bg-[var(--pm-secondary-text)]" style={{ width: activeRsSubs.length ? `${(b.count / (activeRsSubs.length || 1)) * 100}%` : "0%" }} />
                </div>
              </div>
            ))}
          </div>
          <div className="pt-3 border-t border-[var(--pm-border-soft)] text-xs mono text-[var(--pm-text-muted)]">
            Single purchase / RtG: <span className="text-[var(--pm-text-secondary)] font-bold">{rtgOrders.length}</span> orders today
          </div>
        </div>

        <div className="border border-[var(--pm-border-soft)] bg-[var(--pm-surface)] p-4">
          <div className="text-xs font-bold text-[var(--pm-text)] uppercase tracking-wider mb-3">Paused RS Subscriptions</div>
          {pausedRsSubs.length === 0 ? (
            <div className="text-xs text-[var(--pm-text-muted)] mono">No paused subscriptions</div>
          ) : (
            <div className="space-y-2">
              {pausedRsSubs.map(s => (
                <div key={s.id} className="border border-[var(--pm-border-soft)] px-3 py-2.5 flex items-center justify-between">
                  <div>
                    <div className="text-base font-semibold">{s.customerName}</div>
                    <div className="text-sm font-medium text-[var(--pm-text-muted)] mono">{s.sku ?? "RS Subscription"}</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm mono font-bold ${theme === "dark" ? "text-yellow-400" : "text-amber-700"}`}>{s.pauseStart} – {s.pauseEnd}</div>
                    <div className={`text-sm mono font-semibold ${theme === "dark" ? "text-green-400" : "text-green-700"}`}>Resumes {s.resumeDate}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border border-[var(--pm-border-soft)] bg-[var(--pm-surface)] p-4">
          <div className="text-xs font-bold text-[var(--pm-text)] uppercase tracking-wider mb-3">Dispatch Summary</div>
          <div className="space-y-2">
            {[
              { run: "Run A", time: "9am–12pm", count: rsOrders.filter(o => o.deliveryWindow === "9am–12pm").length, status: "Dispatched" },
              { run: "Run B", time: "12pm–3pm", count: rsOrders.filter(o => o.deliveryWindow === "12pm–3pm").length, status: "In Progress" },
              { run: "Run C", time: "3pm–6pm", count: rsOrders.filter(o => o.deliveryWindow === "3pm–6pm").length, status: "Pending" },
            ].map(r => (
              <div key={r.run} className="flex items-center justify-between border border-[var(--pm-border-soft)] px-3 py-2">
                <div>
                  <span className="text-sm font-bold text-[var(--pm-text-secondary)]">{r.run}</span>
                  <span className="text-xs text-[var(--pm-text-muted)] mono ml-2">{r.time}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="mono text-[var(--pm-secondary-text)] font-bold text-sm">{r.count}</span>
                  <span className={`text-xs mono ${
                    r.status === "Dispatched" ? "text-green-400" :
                    r.status === "In Progress" ? "text-[var(--pm-accent-text)]" : "text-[var(--pm-text-muted)]"
                  }`}>{r.status}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-[var(--pm-border-soft)]">
            <div className="text-xs font-bold text-[var(--pm-text)] uppercase tracking-wider mb-2">Stock Alerts</div>
            {stockAlerts.slice(0, 2).map(s => (
              <div key={s.item} className="flex justify-between text-xs py-1 border-b border-[var(--pm-border-soft)]">
                <span className="text-[var(--pm-text-secondary)] truncate pr-2">{s.item}</span>
                <span className={`mono font-bold flex-shrink-0 ${s.current < s.minimum ? "text-red-400" : "text-[var(--pm-text-muted)]"}`}>
                  {s.current}/{s.minimum}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RS Orders table */}
      <div className="border border-[var(--pm-border-soft)] bg-[var(--pm-surface)]">
        <div className="px-4 py-2.5 border-b border-[var(--pm-border-soft)] flex items-center justify-between">
          <span className="text-sm font-semibold tracking-wide">Ready Series Orders — Today</span>
          <span className="text-xs mono text-[var(--pm-text-muted)]">14 Sep 2024 · {rsOrders.length} orders</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--pm-border-soft)]">
                {["Order", "Customer", "Type", "Meals", "Delivery Window", "Total", "Status"].map(h => (
                  <th key={h} className="px-4 py-2 text-left text-xs text-[var(--pm-text-muted)] uppercase tracking-wider font-medium whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rsOrders.map((o, i) => (
                <tr key={o.id} className={`border-b border-[var(--pm-border-soft)] hover:bg-[var(--pm-bg)] transition-colors ${i % 2 === 0 ? "" : "bg-[var(--pm-surface-subtle)]"}`}>
                  <td className="px-4 py-2.5 mono text-[var(--pm-secondary-text)] text-xs">{o.id}</td>
                  <td className="px-4 py-2.5 font-medium">{o.customer}</td>
                  <td className="px-4 py-2.5">
                    <span className={`text-xs mono font-bold ${o.planType === "Box Subscription" ? "text-[var(--pm-secondary-text)]" : "text-[var(--pm-text-muted)]"}`}>
                      {o.planType === "Box Subscription" ? "Box Sub" : "RtG"}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 mono text-center">{o.meals}</td>
                  <td className="px-4 py-2.5 mono text-xs text-[var(--pm-text-muted)]">{o.deliveryWindow}</td>
                  <td className="px-4 py-2.5 mono font-bold">${o.total.toFixed(2)}</td>
                  <td className="px-4 py-2.5"><StatusBadge status={o.status} variant={theme} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Chart + Activity */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="border border-[var(--pm-border-soft)] bg-[var(--pm-surface)]">
          <div className="px-4 py-3 border-b border-[var(--pm-border-soft)]">
            <span className="text-sm font-semibold tracking-wide">7-Day Ready Series Revenue</span>
          </div>
          <div className="p-4 h-48">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={rsChartData} barCategoryGap="30%">
                <XAxis dataKey="day" tick={{ fill: "var(--pm-text-muted)", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "var(--pm-text-muted)", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} width={38} />
                <Tooltip
                  contentStyle={{ background: "var(--pm-surface)", border: "1px solid var(--pm-border)", borderRadius: 8, fontFamily: "JetBrains Mono", fontSize: 11 }}
                  labelStyle={{ color: "var(--pm-text-muted)" }}
                  formatter={(v) => [`$${Number(v ?? 0).toFixed(0)}`, "RS Revenue"]}
                />
                <Bar dataKey="revenue" fill="var(--pm-secondary-text)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="border border-[var(--pm-border)] bg-[var(--pm-surface)]">
          <div className="px-4 py-3 border-b border-[var(--pm-border)]">
            <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 12, color: "var(--pm-text)" }}>Activity Feed</span>
          </div>
          <div className="p-3 space-y-1">
            {rsActivity.map((a, i) => (
              <div key={i} className="flex items-start gap-2.5 py-1.5 border-b border-[var(--pm-border-soft)]">
                <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${activityColor[a.type]}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-[var(--pm-text-secondary)] leading-snug">{a.text}</div>
                </div>
                <div className="mono text-xs text-[var(--pm-text-muted)] flex-shrink-0">{a.time}</div>
              </div>
            ))}
          </div>
          <div className="px-4 py-3 border-t border-[var(--pm-border-soft)] flex justify-between text-xs mono">
            <span className="text-[var(--pm-text-muted)]">RS revenue today</span>
            <span className="text-[var(--pm-secondary-text)] font-bold">${rsRevenue.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard({ stream, swapAlert, theme }: Props) {
  if (stream === "meal-plans") {
    return <MealPlansDashboard swapAlert={swapAlert} theme={theme} />;
  }
  return <ReadySeriesDashboard swapAlert={swapAlert} theme={theme} />;
}
