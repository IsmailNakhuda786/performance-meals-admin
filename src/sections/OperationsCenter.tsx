import { useState } from "react";

const rsMetrics = {
  ordersToday: 84,
  productionRequired: 84,
  packed: 61,
  outForDelivery: 23,
  delivered: 18,
  pendingPacking: 23,
  failedDeliveries: 2,
};

const mpMetrics = {
  activeSubscribers: 142,
  menuReviewsPending: 9,
  productionRequired: 198,
  outForDelivery: 47,
  delivered: 31,
  paused: 7,
  failedPayments: 3,
};

const alerts = [
  { id: "A-001", type: "inventory", severity: "critical", message: "Jasmine Rice — 2.1kg remaining, below 5kg threshold", ts: "09:12", stream: null },
  { id: "A-002", type: "delivery", severity: "warning", message: "ORD-2403 delivery failed — Customer unavailable. Reattempt pending.", ts: "09:45", stream: "RS" },
  { id: "A-003", type: "payment", severity: "critical", message: "3 failed payments this week — $756.00 outstanding (MP)", ts: "08:30", stream: "MP" },
  { id: "A-004", type: "menu", severity: "warning", message: "Menu swap deadline in 2h — 9 MP subscribers have not reviewed", ts: "10:00", stream: "MP" },
  { id: "A-005", type: "inventory", severity: "warning", message: "Chicken Breast — 3.4kg remaining, threshold 8kg", ts: "07:45", stream: null },
  { id: "A-006", type: "delivery", severity: "warning", message: "ORD-2407 delivery failed — Wrong address. Escalated.", ts: "11:15", stream: "RS" },
];

const recentActivity = [
  { id: "ACT-001", action: "Order packed", detail: "ORD-2421 · Ready Series · Wei Jie Lim", ts: "11:42", stream: "RS" },
  { id: "ACT-002", action: "Rider dispatched", detail: "Daniel Tan → 6 RS deliveries assigned", ts: "11:38", stream: "RS" },
  { id: "ACT-003", action: "Menu reviewed", detail: "Marcus Tan confirmed Week 38 meals", ts: "11:30", stream: "MP" },
  { id: "ACT-004", action: "Subscription paused", detail: "Serene Tay — 2 week pause from 16 Sep", ts: "11:20", stream: "MP" },
  { id: "ACT-005", action: "Production started", detail: "Kitchen queue: 84 RS meals + 198 MP meals", ts: "08:00", stream: null },
  { id: "ACT-006", action: "Payment failed", detail: "Aisha Rahman — $420.00 · Retry scheduled", ts: "07:55", stream: "MP" },
];

const alertSeverity: Record<string, string> = {
  critical: "border-red-800/40 bg-red-950/20 text-red-400",
  warning: "border-yellow-800/40 bg-yellow-950/20 text-yellow-400",
  info: "border-[#2A2A2A] bg-[#181818] text-[#888]",
};

const alertIcon: Record<string, string> = {
  inventory: "▣",
  delivery: "⊡",
  payment: "₿",
  menu: "☰",
};

export default function OperationsCenter({ demoMode }: { demoMode?: boolean } = {}) {
  const [alertFilter, setAlertFilter] = useState<"all" | "critical" | "warning">("all");

  const filteredAlerts = alerts.filter(a =>
    alertFilter === "all" ? true : a.severity === alertFilter
  );

  const criticalCount = alerts.filter(a => a.severity === "critical").length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-extrabold">Master Operations Center</h2>
          {criticalCount > 0 && (
            <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 mono animate-pulse">
              {criticalCount} CRITICAL
            </span>
          )}
        </div>
        <div className="text-xs mono text-[#555]">Live · {new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })} · {new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</div>
      </div>

      {/* Two-stream status panels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Ready Series */}
        <div className="border border-[#E85D04]/30 bg-[#181818]">
          <div className="px-4 py-3 border-b border-[#E85D04]/20 flex items-center gap-2">
            <div className="w-2 h-2 bg-[#E85D04]" />
            <span className="text-sm font-extrabold tracking-widest uppercase" style={{ color: "#E85D04" }}>Ready Series</span>
            <span className="text-xs mono text-[#888] ml-auto">Box Subs · Ready-to-Go</span>
          </div>
          <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-px bg-[#2A2A2A]">
            {[
              { label: "Orders Today", value: rsMetrics.ordersToday, accent: true },
              { label: "Production Req.", value: rsMetrics.productionRequired, accent: false },
              { label: "Packed", value: rsMetrics.packed, accent: false },
              { label: "Out for Delivery", value: rsMetrics.outForDelivery, accent: false },
              { label: "Delivered", value: rsMetrics.delivered, color: "#22C55E" },
              { label: "Failed Deliveries", value: rsMetrics.failedDeliveries, color: rsMetrics.failedDeliveries > 0 ? "#EF4444" : "#22C55E" },
            ].map(m => (
              <div key={m.label} className="bg-[#181818] p-3">
                <div className="text-xs text-[#AAAAAA] uppercase tracking-wider mb-1">{m.label}</div>
                <div className="text-2xl font-extrabold mono" style={{ color: m.color ?? (m.accent ? "#E85D04" : "#E8E8E8") }}>
                  {m.value}
                </div>
              </div>
            ))}
          </div>
          <div className="px-4 pb-3 pt-1">
            <div className="h-2 bg-[#0F0F0F] relative overflow-hidden">
              <div className="h-full bg-[#E85D04]/60" style={{ width: `${(rsMetrics.packed / rsMetrics.ordersToday) * 100}%` }} />
              <div className="absolute inset-y-0 left-0 bg-[#E85D04]" style={{ width: `${(rsMetrics.delivered / rsMetrics.ordersToday) * 100}%` }} />
            </div>
            <div className="flex justify-between text-xs mono text-[#555] mt-1">
              <span>{Math.round((rsMetrics.delivered / rsMetrics.ordersToday) * 100)}% delivered</span>
              <span>{rsMetrics.ordersToday - rsMetrics.delivered} remaining</span>
            </div>
          </div>
        </div>

        {/* Meal Plans */}
        <div className="border border-[#F5B300]/30 bg-[#181818]">
          <div className="px-4 py-3 border-b border-[#F5B300]/20 flex items-center gap-2">
            <div className="w-2 h-2 bg-[#F5B300]" />
            <span className="text-sm font-extrabold tracking-widest uppercase" style={{ color: "#F5B300" }}>Meal Plans</span>
            <span className="text-xs mono text-[#888] ml-auto">Subscriptions · Menu · Billing</span>
          </div>
          <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-px bg-[#2A2A2A]">
            {[
              { label: "Active Subscribers", value: mpMetrics.activeSubscribers, accent: true },
              { label: "Menu Reviews Pending", value: mpMetrics.menuReviewsPending, color: mpMetrics.menuReviewsPending > 5 ? "#F5B300" : "#22C55E" },
              { label: "Production Req.", value: mpMetrics.productionRequired, accent: false },
              { label: "Out for Delivery", value: mpMetrics.outForDelivery, accent: false },
              { label: "Delivered", value: mpMetrics.delivered, color: "#22C55E" },
              { label: "Failed Payments", value: mpMetrics.failedPayments, color: mpMetrics.failedPayments > 0 ? "#EF4444" : "#22C55E" },
            ].map(m => (
              <div key={m.label} className="bg-[#181818] p-3">
                <div className="text-xs text-[#AAAAAA] uppercase tracking-wider mb-1">{m.label}</div>
                <div className="text-2xl font-extrabold mono" style={{ color: m.color ?? (m.accent ? "#F5B300" : "#E8E8E8") }}>
                  {m.value}
                </div>
              </div>
            ))}
          </div>
          <div className="px-4 pb-3 pt-1">
            <div className="h-2 bg-[#0F0F0F] relative overflow-hidden">
              <div className="h-full bg-[#F5B300]/60" style={{ width: `${(mpMetrics.outForDelivery / mpMetrics.activeSubscribers) * 100}%` }} />
              <div className="absolute inset-y-0 left-0 bg-[#F5B300]" style={{ width: `${(mpMetrics.delivered / mpMetrics.activeSubscribers) * 100}%` }} />
            </div>
            <div className="flex justify-between text-xs mono text-[#555] mt-1">
              <span>{Math.round((mpMetrics.delivered / mpMetrics.activeSubscribers) * 100)}% delivered today</span>
              <span>{mpMetrics.paused} paused this week</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom row: Alerts + Activity */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Active Alerts */}
        <div className="border border-[#2A2A2A] bg-[#181818]">
          <div className="px-4 py-3 border-b border-[#2A2A2A] flex items-center justify-between">
            <span className="text-sm font-semibold">Active Alerts</span>
            <div className="flex gap-1">
              {(["all", "critical", "warning"] as const).map(f => (
                <button key={f} onClick={() => setAlertFilter(f)}
                  className={`text-xs px-2 py-0.5 mono border transition-colors capitalize ${alertFilter === f ? "border-[#F5B300] text-[#F5B300]" : "border-[#2A2A2A] text-[#555]"}`}>
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="divide-y divide-[#1A1A1A] max-h-72 overflow-y-auto">
            {filteredAlerts.map(a => (
              <div key={a.id} className={`px-4 py-2.5 flex items-start gap-3 border-l-2 ${a.severity === "critical" ? "border-red-600" : "border-yellow-600"}`}>
                <span className={`text-base flex-shrink-0 mt-0.5 ${alertSeverity[a.severity].split(" ")[2]}`}>{alertIcon[a.type]}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-[#E8E8E8]">{a.message}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs mono text-[#555]">{a.ts}</span>
                    {a.stream && (
                      <span className="text-xs mono font-bold" style={{ color: a.stream === "RS" ? "#E85D04" : "#F5B300" }}>{a.stream}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="border border-[#2A2A2A] bg-[#181818]">
          <div className="px-4 py-3 border-b border-[#2A2A2A]">
            <span className="text-sm font-semibold">Recent Activity</span>
          </div>
          <div className="divide-y divide-[#1A1A1A] max-h-72 overflow-y-auto">
            {recentActivity.map(a => (
              <div key={a.id} className="px-4 py-2.5 flex items-start gap-3">
                <div className="w-1 h-1 rounded-full mt-2 flex-shrink-0" style={{ background: a.stream === "RS" ? "#E85D04" : a.stream === "MP" ? "#F5B300" : "#555" }} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-[#E8E8E8]">{a.action}</div>
                  <div className="text-xs text-[#888]">{a.detail}</div>
                </div>
                <span className="text-xs mono text-[#555] flex-shrink-0">{a.ts}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Operational Schedule Reference */}
      <div className="border border-[#2A2A2A] bg-[#0D0D0D]">
        <div className="px-4 py-3 border-b border-[#2A2A2A] flex items-center gap-3">
          <span className="text-sm font-semibold">Operational Weekly Schedule</span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8.5, color: "#444", letterSpacing: "0.1em", padding: "2px 6px", border: "1px solid #2A2A2A" }}>REFERENCE</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 divide-x divide-[#2A2A2A]">
          <div className="p-4">
            <div className="text-xs font-bold text-[#F5B300] uppercase tracking-wider mb-3">Meal Plans</div>
            {[
              { time: "Wed 2:00 PM",     event: "Customer receives menu review & billing notification" },
              { time: "Thu 1:59 PM",     event: "Customer cutoff — reviewed menu & subscription changes finalized" },
              { time: "Thu 2:00 PM",     event: "Subscription locked · Customer charged · Changes closed" },
              { time: "Thu 3:00 PM",     event: "Failed billing customers followed up & consolidated" },
              { time: "Fri 9:00 AM",     event: "Export: Meal Report · Delivery Order · Delivery Report" },
              { time: "Every other day", event: "Menu updates · Sales & marketing data pull" },
            ].map(row => (
              <div key={row.time} className="flex gap-3 py-1.5 border-b border-[#1A1A1A] last:border-0">
                <span className="mono text-[10px] text-[#F5B300] w-28 flex-shrink-0">{row.time}</span>
                <span className="text-xs text-[#777]">{row.event}</span>
              </div>
            ))}
          </div>
          <div className="p-4">
            <div className="text-xs font-bold text-[#E85D04] uppercase tracking-wider mb-3">Ready Series</div>
            {[
              { time: "Every other day",    event: "Deduct meals purchased · Add new stock to inventory · Promotional updates · Customer data export" },
              { time: "Day before 2pm",     event: "Export Delivery Order (DO) for packing · Export delivery list" },
              { time: "Thu 3:00 PM",        event: "Export Inventory Report" },
              { time: "Biweekly Wed",       event: "Update physical stock date — audit & rolling stock accuracy" },
            ].map(row => (
              <div key={row.time} className="flex gap-3 py-1.5 border-b border-[#1A1A1A] last:border-0">
                <span className="mono text-[10px] text-[#E85D04] w-28 flex-shrink-0">{row.time}</span>
                <span className="text-xs text-[#777]">{row.event}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Combined KPIs bar */}
      <div className="border border-[#2A2A2A] bg-[#181818]">
        <div className="px-4 py-3 border-b border-[#2A2A2A]">
          <span className="text-sm font-semibold">Shared Operational KPIs</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#2A2A2A]">
          {[
            { label: "Kitchen Efficiency", value: "94%", sub: "production on time", good: true },
            { label: "Delivery Success Rate", value: "97.1%", sub: "out of 282 today", good: true },
            { label: "Refund Rate", value: "1.4%", sub: "last 30 days", good: true },
            { label: "Customer Satisfaction", value: "4.7 / 5", sub: "based on 89 ratings", good: true },
          ].map(k => (
            <div key={k.label} className="bg-[#181818] p-4">
              <div className="text-xs text-[#AAAAAA] uppercase tracking-wider mb-2">{k.label}</div>
              <div className="text-2xl font-extrabold mono text-[#22C55E]">{k.value}</div>
              <div className="text-xs mono text-[#555] mt-1">{k.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
