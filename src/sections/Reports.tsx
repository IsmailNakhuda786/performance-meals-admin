import { useState } from "react";
import type { BusinessStream } from "../App";
import { downloadCSV } from "../utils/flowUtils";
import { readySeriesProducts } from "../catalog";

// ─── Shared data ──────────────────────────────────────────────────────────────

const revenueTable = [
  { period: "This Week (9–15 Sep)", mealPlan: 5015.00, boxSub: 835.06, rtg: 211.39, total: 6061.45 },
  { period: "Last Week (2–8 Sep)",  mealPlan: 4720.00, boxSub: 783.46, rtg: 328.20, total: 5831.66 },
  { period: "August 2024",          mealPlan: 20340.00, boxSub: 5621.20, rtg: 2318.60, total: 28279.80 },
];

// ─── Meal Plan report data ────────────────────────────────────────────────────

const mealReportData = [
  { subscriber: "Marcus Tan",   subId: "SUB-001", plan: "Meal Plan — BUILD",    meals: 5, days: "Mon,Wed,Fri,Sat,Sun", week: "Wk 38", items: "Chicken Teriyaki ×2, Salmon Bowl ×2, Beef Wrap ×1", status: "Confirmed" },
  { subscriber: "Priya Nair",   subId: "SUB-008", plan: "Meal Plan — CUT",      meals: 3, days: "Mon,Wed,Fri",         week: "Wk 38", items: "Grilled Chicken ×1, Tuna Salad ×1, Salmon Bowl ×1", status: "Confirmed" },
  { subscriber: "Raj Nair",     subId: "SUB-010", plan: "6 by 60 — BUILD",      meals: 5, days: "Mon–Fri",             week: "Wk 38", items: "Beef Wrap ×2, Chicken Rice ×2, Teriyaki Bowl ×1", status: "Confirmed" },
  { subscriber: "Bryan Low",    subId: "SUB-011", plan: "6 by 60 Plus — BUILD", meals: 4, days: "Mon,Tue,Thu,Fri",     week: "Wk 38", items: "Chicken Teriyaki ×2, Salmon Fillet ×2", status: "Confirmed" },
  { subscriber: "Aisha Rahman", subId: "SUB-007", plan: "Meal Plan — MAINTAIN", meals: 0, days: "—",                   week: "Wk 38", items: "Paused", status: "Paused" },
];

const deliveryReportMP = [
  { date: "Mon 16 Sep", orders: 4, subscribers: ["Marcus Tan", "Priya Nair", "Raj Nair", "Bryan Low"], run: "Run A 7–9pm", status: "Scheduled" },
  { date: "Tue 17 Sep", orders: 2, subscribers: ["Raj Nair", "Bryan Low"],                             run: "Run A 7–9pm", status: "Scheduled" },
  { date: "Wed 18 Sep", orders: 3, subscribers: ["Marcus Tan", "Priya Nair", "Raj Nair"],              run: "Run A 7–9pm", status: "Scheduled" },
  { date: "Thu 19 Sep", orders: 2, subscribers: ["Raj Nair", "Bryan Low"],                             run: "Run A 6–8pm", status: "Scheduled" },
  { date: "Fri 20 Sep", orders: 4, subscribers: ["Marcus Tan", "Priya Nair", "Raj Nair", "Bryan Low"], run: "Run A 7–9pm", status: "Scheduled" },
  { date: "Sat 21 Sep", orders: 1, subscribers: ["Marcus Tan"],                                        run: "Run A 7–9pm", status: "Scheduled" },
  { date: "Sun 22 Sep", orders: 1, subscribers: ["Marcus Tan"],                                        run: "Run A 7–9pm", status: "Scheduled" },
];

const marketingReportMP = [
  { subscriber: "Kevin Chia",   subId: "SUB-009", lastOrder: "22 Aug 2024", daysSince: 25, plan: "Meal Plan — MAINTAIN",  status: "Renewal Due", segment: "Re-engagement" },
  { subscriber: "Serene Tay",   subId: "SUB-004", lastOrder: "15 Aug 2024", daysSince: 32, plan: "Meal Plan — CUT",        status: "Cancelled",    segment: "Win-back" },
  { subscriber: "Aisha Rahman", subId: "SUB-007", lastOrder: "05 Sep 2024", daysSince: 10, plan: "Meal Plan — MAINTAIN",   status: "Paused",       segment: "Upsell on resume" },
  { subscriber: "Marcus Tan",   subId: "SUB-001", lastOrder: "15 Sep 2024", daysSince: 1,  plan: "6 by 60 Plus — BUILD",   status: "Active",       segment: "Retention" },
  { subscriber: "Priya Nair",   subId: "SUB-008", lastOrder: "13 Sep 2024", daysSince: 3,  plan: "Meal Plan — CUT",        status: "Active",       segment: "Upsell plan upgrade" },
];

// ─── Ready Series report data ─────────────────────────────────────────────────

const frozenStockData = readySeriesProducts.map((product, index) => {
  const currentStock = [42, 18, 55, 28, 63, 16, 34, 47, 22, 31, 26, 11][index];
  const parLevel = product.category === "Just Protein" ? 40 : 35;
  const status = currentStock === 0 ? "OUT" : currentStock < parLevel ? "LOW" : "OK";
  return {
    product: product.name,
    sku: `RS-${product.id}`,
    currentStock,
    parLevel,
    status,
    lastAudit: "11 Sep 2024",
    note: status === "LOW" ? "Replenish before next production run" : "",
  };
});

const deliveryReportRS = [
  { date: "Mon 16 Sep", orders: 6, channel: "Shopify", run: "9am–12pm", status: "Scheduled" },
  { date: "Wed 18 Sep", orders: 8, channel: "Shopify", run: "9am–12pm", status: "Scheduled" },
  { date: "Fri 20 Sep", orders: 5, channel: "Shopify", run: "9am–12pm", status: "Scheduled" },
];

const marketingReportRS = [
  { customer: "Emily Koh",     shopifyId: "SH-44221", lastPurchase: "20 Jul 2024", daysSince: 58, products: "Teriyaki Chicken & Brown Rice ×2",  segment: "Lapsed > 30 days",   action: "Re-engagement campaign" },
  { customer: "Derek Ng",      shopifyId: "SH-44089", lastPurchase: "01 Aug 2024", daysSince: 46, products: "Salmon & Quinoa Power Bowl ×1",    segment: "Lapsed > 30 days",   action: "Promotional offer" },
  { customer: "Charlene Ong",  shopifyId: "SH-44307", lastPurchase: "05 Sep 2024", daysSince: 11, products: "Spicy Korean Beef Bulgogi ×3",     segment: "Loyal — single item", action: "Upsell bundle" },
  { customer: "Vivienne Lim",  shopifyId: "SH-44120", lastPurchase: "12 Sep 2024", daysSince: 4,  products: "Beef Rendang ×2, Miso Salmon ×1", segment: "Multi-product buyer", action: "Retention — bundle promo" },
  { customer: "Jason Yeo",     shopifyId: "SH-44198", lastPurchase: "10 Sep 2024", daysSince: 6,  products: "Prawn Fried Rice ×1",          segment: "Low frequency",       action: "Re-engagement" },
];





// ─── Component ────────────────────────────────────────────────────────────────

type MPTab = "overview" | "meal-report" | "delivery-report" | "marketing-report";
type RSTab = "overview" | "frozen-stock" | "delivery-report" | "marketing-report";

export default function Reports({ stream }: { stream: BusinessStream }) {
  const accent = stream === "meal-plans" ? "#F5B300" : "#E85D04";
  const isMealPlan = stream === "meal-plans";

  const [mpTab, setMpTab] = useState<MPTab>("overview");
  const [rsTab, setRsTab] = useState<RSTab>("overview");

  const mpTabs: { id: MPTab; label: string }[] = [
    { id: "overview",         label: "Overview" },
    { id: "meal-report",      label: "Meal Report" },
    { id: "delivery-report",  label: "Delivery Report" },
    { id: "marketing-report", label: "Marketing Report" },
  ];

  const rsTabs: { id: RSTab; label: string }[] = [
    { id: "overview",         label: "Overview" },
    { id: "frozen-stock",     label: "Frozen Stock Report" },
    { id: "delivery-report",  label: "Delivery Report" },
    { id: "marketing-report", label: "Marketing Report" },
  ];

  const metrics = isMealPlan ? [
    { label: "MRR",           value: "$18,200", sub: "MP projected",   accent: true },
    { label: "Active MP Subs", value: "5",      sub: "this week",      accent: false },
    { label: "Churn Rate",    value: "2.8%",    sub: "30-day",         accent: false },
    { label: "Avg MP LTV",    value: "$1,180",  sub: "per customer",   accent: false },
    { label: "Renewal Rate",  value: "83%",     sub: "last 30 days",   accent: false },
    { label: "New MP Subs",   value: "2",       sub: "this week",      accent: false },
  ] : [
    { label: "MRR",            value: "$4,200", sub: "RS projected",   accent: true },
    { label: "Active Ready Subs", value: "3",     sub: "this week",      accent: false },
    { label: "Churn Rate",     value: "4.1%",   sub: "30-day",         accent: false },
    { label: "Avg RS LTV",     value: "$620",   sub: "per customer",   accent: false },
    { label: "Renewal Rate",   value: "76%",    sub: "last 30 days",   accent: false },
    { label: "New RtG Orders", value: "4",      sub: "this week",      accent: false },
  ];

  // ── Meal Plan tabs ──────────────────────────────────────────────────────────

  function MPOverview() {
    return (
      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 sm:grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {metrics.map(m => (
            <div key={m.label} className="border border-[var(--pm-border)] bg-[var(--pm-surface)] p-4">
              <div className="text-xs font-bold text-[var(--pm-text)] uppercase tracking-wider mb-2">{m.label}</div>
              <div className="text-2xl font-extrabold mono" style={{ color: m.accent ? accent : "var(--pm-text-secondary)" }}>{m.value}</div>
              <div className="text-xs text-[var(--pm-text-muted)] mono mt-1">{m.sub}</div>
            </div>
          ))}
        </div>

        <div className="border border-[var(--pm-border)] bg-[var(--pm-surface)]">
          <div className="px-4 py-3 border-b border-[var(--pm-border)] flex items-center justify-between">
            <span className="text-sm font-semibold tracking-wide">Revenue Summary</span>
            <button onClick={() => downloadCSV("revenue.csv", revenueTable.map(r => ({ Period: r.period, "Meal Plan": r.mealPlan, Total: r.total })))} className="text-xs mono text-[var(--pm-text-muted)] hover:text-[var(--pm-accent-text)] transition-colors">CSV ↓</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--pm-border)]">
                  {["Period", "Meal Plan", "Ready Sub", "Ready Series A-la-carte", "Total"].map(h => (
                    <th key={h} className="px-4 py-2 text-left text-xs font-bold text-[var(--pm-text)] uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {revenueTable.map((r, i) => (
                  <tr key={r.period} className={`border-b border-[var(--pm-border)] hover:bg-[var(--pm-surface-subtle)] ${i % 2 === 0 ? "" : "bg-[var(--pm-surface-subtle)]"}`}>
                    <td className="px-4 py-3 font-medium">{r.period}</td>
                    <td className="px-4 py-3 mono">${r.mealPlan.toFixed(2)}</td>
                    <td className="px-4 py-3 mono">${r.boxSub.toFixed(2)}</td>
                    <td className="px-4 py-3 mono">${r.rtg.toFixed(2)}</td>
                    <td className="px-4 py-3 mono font-bold" style={{ color: accent }}>${r.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="border border-[var(--pm-border)] bg-[var(--pm-surface)] p-4 space-y-2">
            <div className="text-xs font-bold text-[var(--pm-text)] uppercase tracking-wider border-b border-[var(--pm-border)] pb-2 mb-3">Subscription Health</div>
            {[
              { label: "Active",            count: 5, total: 10, color: "#22C55E" },
              { label: "Paused",            count: 2, total: 10, color: "#F5B300" },
              { label: "Renewal Due",       count: 2, total: 10, color: "#E85D04" },
              { label: "Cancelled (30d)",   count: 1, total: 10, color: "#EF4444" },
            ].map(s => (
              <div key={s.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{s.label}</span>
                  <span className="mono font-bold" style={{ color: s.color }}>{s.count}</span>
                </div>
                <div className="h-1.5 bg-[var(--pm-surface-muted)]">
                  <div className="h-1.5" style={{ width: `${(s.count / s.total) * 100}%`, background: s.color }} />
                </div>
              </div>
            ))}
          </div>
          <div className="border border-[var(--pm-border)] bg-[var(--pm-bg)] p-4">
            <div className="text-xs font-bold text-[var(--pm-text)] uppercase tracking-wider border-b border-[var(--pm-border)] pb-2 mb-3">Weekly Schedule Reference — Meal Plans</div>
            {[
              { time: "Wed 2:00 PM",     label: "Menu review & billing notification sent to customers" },
              { time: "Thu 1:59 PM",     label: "Customer cutoff — menu finalized, subscription changes finalized" },
              { time: "Thu 2:00 PM",     label: "Subscription locked · Customer charged · Changes closed" },
              { time: "Thu 3:00 PM",     label: "Failed billing follow-up · Consolidation" },
              { time: "Fri 9:00 AM",     label: "Export: Meal Report · Delivery Order · Delivery Report" },
              { time: "Every other day", label: "Menu updates · Sales & marketing data export" },
            ].map(row => (
              <div key={row.time} className="flex gap-3 py-1.5 border-b border-[var(--pm-border-soft)] last:border-0">
                <span className="mono text-[10px] text-[var(--pm-accent-text)] w-28 flex-shrink-0">{row.time}</span>
                <span className="text-xs text-[var(--pm-text-muted)]">{row.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function MPMealReport() {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-[var(--pm-text)] uppercase tracking-wider display">Meal Report — Week 38 · 16–22 Sep 2024</p>
            <p className="text-xs text-[var(--pm-text-muted)] mono mt-0.5">Generated: Fri 13 Sep 2024 09:00 · Export for Chef production planning and Packing Supervisor</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => downloadCSV("meal-report-wk38.csv", mealReportData.map(r => ({ Subscriber: r.subscriber, Plan: r.plan, "Meals/wk": r.meals, Days: r.days, Items: r.items, Status: r.status })))} className="border border-[var(--pm-border-strong)] text-[var(--pm-text-secondary)] text-xs px-3 py-1.5 mono hover:border-[#F5B300] hover:text-[var(--pm-accent-text)] transition-colors">CSV ↓</button>
          </div>
        </div>
        <div className="border border-[var(--pm-border)] bg-[var(--pm-surface)] overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[var(--pm-border)]">
                {["Subscriber", "Sub ID", "Plan", "Meals/wk", "Delivery Days", "Week", "Meal Items", "Status"].map(h => (
                  <th key={h} className="px-4 py-2 text-left text-xs font-bold text-[var(--pm-text)] uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mealReportData.map((r, i) => (
                <tr key={r.subId} className={`border-b border-[var(--pm-border)] hover:bg-[var(--pm-surface-subtle)] ${i % 2 === 0 ? "" : "bg-[var(--pm-surface-subtle)]"}`}>
                  <td className="px-4 py-2.5 font-medium text-[var(--pm-text-secondary)]">{r.subscriber}</td>
                  <td className="px-4 py-2.5 mono text-[var(--pm-accent-text)]">{r.subId}</td>
                  <td className="px-4 py-2.5 text-[var(--pm-text-muted)]">{r.plan}</td>
                  <td className="px-4 py-2.5 mono text-center">{r.meals || "—"}</td>
                  <td className="px-4 py-2.5 mono text-[var(--pm-text-secondary)] whitespace-nowrap">{r.days}</td>
                  <td className="px-4 py-2.5 mono text-[var(--pm-text-muted)]">{r.week}</td>
                  <td className="px-4 py-2.5 text-[var(--pm-text-muted)]">{r.items}</td>
                  <td className="px-4 py-2.5">
                    <span className={`mono px-2 py-0.5 text-xs ${r.status === "Confirmed" ? "bg-green-950 text-green-400" : "bg-yellow-950 text-yellow-400"}`}>{r.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border border-[var(--pm-border)] bg-[var(--pm-bg)] px-4 py-3 text-xs text-[var(--pm-text-muted)] mono">
          Total meals to prepare: <span className="text-[var(--pm-text-secondary)]">{mealReportData.reduce((s, r) => s + r.meals, 0)} meals</span> across <span className="text-[var(--pm-text-secondary)]">{mealReportData.filter(r => r.status === "Confirmed").length} active subscribers</span> · Week 38
        </div>
      </div>
    );
  }

  function MPDeliveryReport() {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-[var(--pm-text)] uppercase tracking-wider display">Delivery Report — Week 38 · Meal Plans</p>
            <p className="text-xs text-[var(--pm-text-muted)] mono mt-0.5">Generated: Fri 13 Sep 2024 09:00 · Export for Logistics Admin delivery planning</p>
          </div>
          <button onClick={() => downloadCSV("delivery-report-wk38-mp.csv", deliveryReportMP.map(r => ({ Date: r.date, Orders: r.orders, Run: r.run, Status: r.status })))} className="border border-[var(--pm-border-strong)] text-[var(--pm-text-secondary)] text-xs px-3 py-1.5 mono hover:border-[#F5B300] hover:text-[var(--pm-accent-text)] transition-colors">CSV ↓</button>
        </div>
        <div className="border border-[var(--pm-border)] bg-[var(--pm-surface)] overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[var(--pm-border)]">
                {["Delivery Date", "Orders", "Subscribers", "Delivery Run", "Status"].map(h => (
                  <th key={h} className="px-4 py-2 text-left text-xs font-bold text-[var(--pm-text)] uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {deliveryReportMP.map((r, i) => (
                <tr key={r.date} className={`border-b border-[var(--pm-border)] hover:bg-[var(--pm-surface-subtle)] ${i % 2 === 0 ? "" : "bg-[var(--pm-surface-subtle)]"}`}>
                  <td className="px-4 py-2.5 mono text-[var(--pm-text-secondary)] whitespace-nowrap">{r.date}</td>
                  <td className="px-4 py-2.5 mono text-[var(--pm-accent-text)] text-center">{r.orders}</td>
                  <td className="px-4 py-2.5 text-[var(--pm-text-muted)] text-xs">{r.subscribers.join(", ")}</td>
                  <td className="px-4 py-2.5 mono text-[var(--pm-text-secondary)]">{r.run}</td>
                  <td className="px-4 py-2.5"><span className="mono px-2 py-0.5 bg-blue-950 text-blue-400">{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  function MPMarketingReport() {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-[var(--pm-text)] uppercase tracking-wider display">Marketing Report — Meal Plans</p>
            <p className="text-xs text-[var(--pm-text-muted)] mono mt-0.5">Customer segmentation for upsell, re-engagement, and retention · Export for Sales & Marketing</p>
          </div>
          <button onClick={() => downloadCSV("marketing-report-mp.csv", marketingReportMP.map(r => ({ Subscriber: r.subscriber, "Sub ID": r.subId, "Last Order": r.lastOrder, "Days Since": r.daysSince, Status: r.status, Segment: r.segment })))} className="border border-[var(--pm-border-strong)] text-[var(--pm-text-secondary)] text-xs px-3 py-1.5 mono hover:border-[#F5B300] hover:text-[var(--pm-accent-text)] transition-colors">CSV ↓</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-2">
          {[
            { label: "Re-engagement",       count: 1, color: "#E85D04" },
            { label: "Win-back",            count: 1, color: "#EF4444" },
            { label: "Upsell on resume",    count: 1, color: "#F5B300" },
            { label: "Retention / Upsell",  count: 2, color: "#22C55E" },
          ].map(seg => (
            <div key={seg.label} className="border border-[var(--pm-border)] bg-[var(--pm-surface)] p-3 text-center">
              <div className="text-xl font-extrabold mono" style={{ color: seg.color }}>{seg.count}</div>
              <div className="text-xs text-[var(--pm-text-muted)] mt-1">{seg.label}</div>
            </div>
          ))}
        </div>
        <div className="border border-[var(--pm-border)] bg-[var(--pm-surface)] overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[var(--pm-border)]">
                {["Subscriber", "Sub ID", "Last Order", "Days Since", "Plan", "Status", "Segment / Action"].map(h => (
                  <th key={h} className="px-4 py-2 text-left text-xs font-bold text-[var(--pm-text)] uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {marketingReportMP.map((r, i) => (
                <tr key={r.subId} className={`border-b border-[var(--pm-border)] hover:bg-[var(--pm-surface-subtle)] ${i % 2 === 0 ? "" : "bg-[var(--pm-surface-subtle)]"}`}>
                  <td className="px-4 py-2.5 font-medium text-[var(--pm-text-secondary)]">{r.subscriber}</td>
                  <td className="px-4 py-2.5 mono text-[var(--pm-accent-text)]">{r.subId}</td>
                  <td className="px-4 py-2.5 mono text-[var(--pm-text-muted)]">{r.lastOrder}</td>
                  <td className="px-4 py-2.5 mono text-center" style={{ color: r.daysSince > 20 ? "#EF4444" : r.daysSince > 7 ? "#F5B300" : "#22C55E" }}>{r.daysSince}d</td>
                  <td className="px-4 py-2.5 text-[var(--pm-text-muted)]">{r.plan}</td>
                  <td className="px-4 py-2.5 mono text-[var(--pm-text-muted)]">{r.status}</td>
                  <td className="px-4 py-2.5 text-xs text-[var(--pm-text-secondary)]">{r.segment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ── Ready Series tabs ───────────────────────────────────────────────────────

  function RSOverview() {
    return (
      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 sm:grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {metrics.map(m => (
            <div key={m.label} className="border border-[var(--pm-border)] bg-[var(--pm-surface)] p-4">
              <div className="text-xs font-bold text-[var(--pm-text)] uppercase tracking-wider mb-2">{m.label}</div>
              <div className="text-2xl font-extrabold mono" style={{ color: m.accent ? accent : "var(--pm-text-secondary)" }}>{m.value}</div>
              <div className="text-xs text-[var(--pm-text-muted)] mono mt-1">{m.sub}</div>
            </div>
          ))}
        </div>
        <div className="border border-[var(--pm-border)] bg-[var(--pm-bg)] p-4">
          <div className="text-xs font-bold text-[var(--pm-text)] uppercase tracking-wider border-b border-[var(--pm-border)] pb-2 mb-3">Operational Schedule Reference — Ready Series</div>
          {[
            { time: "Every other day",       label: "Deduct meals purchased · Add new stock to inventory · Promotional updates · Export customer data for Sales & Marketing" },
            { time: "Day before delivery 2pm", label: "Export Delivery Order (DO) for packing · Export delivery list" },
            { time: "Thu 3:00 PM",           label: "Export Inventory Report" },
            { time: "Biweekly Wednesday",    label: "Update physical stock date — audit & rolling stock accuracy" },
          ].map(row => (
            <div key={row.time} className="flex gap-3 py-1.5 border-b border-[var(--pm-border-soft)] last:border-0">
              <span className="mono text-[10px] text-[var(--pm-secondary-text)] w-36 flex-shrink-0">{row.time}</span>
              <span className="text-xs text-[var(--pm-text-muted)]">{row.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function RSFrozenStock() {
    const lowCount = frozenStockData.filter(r => r.status === "LOW").length;
    const outCount = frozenStockData.filter(r => r.status === "OUT").length;
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-[var(--pm-text)] uppercase tracking-wider display">Frozen Stock Report — Week 38</p>
            <p className="text-xs text-[var(--pm-text-muted)] mono mt-0.5">Par level vs current stock · Chef production planning · Last audit: Wed 11 Sep 2024</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => downloadCSV("frozen-stock-wk38.csv", frozenStockData.map(r => ({ Product: r.product, SKU: r.sku, "Current Stock": r.currentStock, "Par Level": r.parLevel, Status: r.status, "Last Audit": r.lastAudit, Note: r.note })))} className="border border-[var(--pm-border-strong)] text-[var(--pm-text-secondary)] text-xs px-3 py-1.5 mono hover:border-[#E85D04] hover:text-[var(--pm-secondary-text)] transition-colors">CSV ↓</button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "Total SKUs",    value: String(frozenStockData.length), color: "var(--pm-text-secondary)" },
            { label: "OK",           value: String(frozenStockData.filter(r => r.status === "OK").length),  color: "#22C55E" },
            { label: "Below Par",    value: String(lowCount),  color: "#F5B300" },
            { label: "Out of Stock", value: String(outCount),  color: "#EF4444" },
          ].map(s => (
            <div key={s.label} className="border border-[var(--pm-border)] bg-[var(--pm-surface)] p-4 text-center">
              <div className="text-2xl font-extrabold mono" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs text-[var(--pm-text-muted)] mt-1 uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>
        <div className="border border-[var(--pm-border)] bg-[var(--pm-surface)] overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[var(--pm-border)]">
                {["Product", "SKU", "Current Stock", "Par Level", "Variance", "Status", "Last Audit", "Note"].map(h => (
                  <th key={h} className="px-4 py-2 text-left text-xs font-bold text-[var(--pm-text)] uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {frozenStockData.map((r, i) => {
                const variance = r.currentStock - r.parLevel;
                const statusStyle = r.status === "OK" ? "bg-green-950 text-green-400" : r.status === "OUT" ? "bg-red-950 text-red-400" : "bg-yellow-950 text-yellow-400";
                return (
                  <tr key={r.sku} className={`border-b border-[var(--pm-border)] hover:bg-[var(--pm-surface-subtle)] ${i % 2 === 0 ? "" : "bg-[var(--pm-surface-subtle)]"}`}>
                    <td className="px-4 py-2.5 font-medium text-[var(--pm-text-secondary)]">{r.product}</td>
                    <td className="px-4 py-2.5 mono text-[var(--pm-secondary-text)]">{r.sku}</td>
                    <td className="px-4 py-2.5 mono text-center font-bold" style={{ color: r.currentStock === 0 ? "#EF4444" : r.currentStock < r.parLevel ? "#F5B300" : "#22C55E" }}>{r.currentStock}</td>
                    <td className="px-4 py-2.5 mono text-center text-[var(--pm-text-muted)]">{r.parLevel}</td>
                    <td className="px-4 py-2.5 mono text-center" style={{ color: variance < 0 ? "#EF4444" : "#22C55E" }}>{variance > 0 ? "+" : ""}{variance}</td>
                    <td className="px-4 py-2.5"><span className={`mono px-2 py-0.5 ${statusStyle}`}>{r.status}</span></td>
                    <td className="px-4 py-2.5 mono text-[var(--pm-text-muted)]">{r.lastAudit}</td>
                    <td className="px-4 py-2.5 text-[var(--pm-text-muted)] text-xs">{r.note || "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  function RSDeliveryReport() {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-[var(--pm-text)] uppercase tracking-wider display">Delivery Report — Ready Series</p>
            <p className="text-xs text-[var(--pm-text-muted)] mono mt-0.5">Generated day before delivery · Logistics Admin delivery planning · Shopify orders</p>
          </div>
          <button onClick={() => downloadCSV("delivery-report-rs.csv", deliveryReportRS.map(r => ({ Date: r.date, Orders: r.orders, Channel: r.channel, Run: r.run, Status: r.status })))} className="border border-[var(--pm-border-strong)] text-[var(--pm-text-secondary)] text-xs px-3 py-1.5 mono hover:border-[#E85D04] hover:text-[var(--pm-secondary-text)] transition-colors">CSV ↓</button>
        </div>
        <div className="border border-[var(--pm-border)] bg-[var(--pm-surface)] overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[var(--pm-border)]">
                {["Delivery Date", "Orders", "Channel", "Delivery Run", "Status"].map(h => (
                  <th key={h} className="px-4 py-2 text-left text-xs font-bold text-[var(--pm-text)] uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {deliveryReportRS.map((r, i) => (
                <tr key={r.date} className={`border-b border-[var(--pm-border)] hover:bg-[var(--pm-surface-subtle)] ${i % 2 === 0 ? "" : "bg-[var(--pm-surface-subtle)]"}`}>
                  <td className="px-4 py-2.5 mono text-[var(--pm-text-secondary)]">{r.date}</td>
                  <td className="px-4 py-2.5 mono text-[var(--pm-secondary-text)] text-center">{r.orders}</td>
                  <td className="px-4 py-2.5 text-[var(--pm-text-muted)]">{r.channel}</td>
                  <td className="px-4 py-2.5 mono text-[var(--pm-text-secondary)]">{r.run}</td>
                  <td className="px-4 py-2.5"><span className="mono px-2 py-0.5 bg-blue-950 text-blue-400">{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  function RSMarketingReport() {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-[var(--pm-text)] uppercase tracking-wider display">Marketing Report — Ready Series</p>
            <p className="text-xs text-[var(--pm-text-muted)] mono mt-0.5">Customer segmentation · Lapsed customers · Product purchase history · Export for Sales & Marketing</p>
          </div>
          <button onClick={() => downloadCSV("marketing-report-rs.csv", marketingReportRS.map(r => ({ Customer: r.customer, "Shopify ID": r.shopifyId, "Last Purchase": r.lastPurchase, "Days Since": r.daysSince, Products: r.products, Segment: r.segment, Action: r.action })))} className="border border-[var(--pm-border-strong)] text-[var(--pm-text-secondary)] text-xs px-3 py-1.5 mono hover:border-[#E85D04] hover:text-[var(--pm-secondary-text)] transition-colors">CSV ↓</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-2">
          {[
            { label: "Lapsed > 30 days",   count: 2, color: "#EF4444" },
            { label: "Single-product buyer", count: 1, color: "#F5B300" },
            { label: "Multi-product buyer", count: 2, color: "#22C55E" },
          ].map(seg => (
            <div key={seg.label} className="border border-[var(--pm-border)] bg-[var(--pm-surface)] p-3 text-center">
              <div className="text-xl font-extrabold mono" style={{ color: seg.color }}>{seg.count}</div>
              <div className="text-xs text-[var(--pm-text-muted)] mt-1">{seg.label}</div>
            </div>
          ))}
        </div>
        <div className="border border-[var(--pm-border)] bg-[var(--pm-surface)] overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[var(--pm-border)]">
                {["Customer", "Shopify ID", "Last Purchase", "Days Since", "Products", "Segment", "Action"].map(h => (
                  <th key={h} className="px-4 py-2 text-left text-xs font-bold text-[var(--pm-text)] uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {marketingReportRS.map((r, i) => (
                <tr key={r.shopifyId} className={`border-b border-[var(--pm-border)] hover:bg-[var(--pm-surface-subtle)] ${i % 2 === 0 ? "" : "bg-[var(--pm-surface-subtle)]"}`}>
                  <td className="px-4 py-2.5 font-medium text-[var(--pm-text-secondary)]">{r.customer}</td>
                  <td className="px-4 py-2.5 mono text-[var(--pm-secondary-text)]">{r.shopifyId}</td>
                  <td className="px-4 py-2.5 mono text-[var(--pm-text-muted)]">{r.lastPurchase}</td>
                  <td className="px-4 py-2.5 mono text-center" style={{ color: r.daysSince > 30 ? "#EF4444" : r.daysSince > 14 ? "#F5B300" : "#22C55E" }}>{r.daysSince}d</td>
                  <td className="px-4 py-2.5 text-[var(--pm-text-muted)]">{r.products}</td>
                  <td className="px-4 py-2.5 mono text-[var(--pm-text-muted)] whitespace-nowrap">{r.segment}</td>
                  <td className="px-4 py-2.5 text-xs text-[var(--pm-text-secondary)]">{r.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  const tabs = isMealPlan ? mpTabs : rsTabs;
  const activeTab = isMealPlan ? mpTab : rsTab;

  return (
    <div className="p-6 space-y-5">
      <h2 className="text-xl font-extrabold">Reports — {isMealPlan ? "Meal Plans" : "Ready Series"}</h2>

      {/* Tab bar */}
      <div className="flex border-b border-[var(--pm-border)]">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => isMealPlan ? setMpTab(t.id as MPTab) : setRsTab(t.id as RSTab)}
            className={`px-5 py-3 text-sm mono transition-colors whitespace-nowrap ${activeTab === t.id ? "border-b-2 text-[var(--pm-text)]" : "text-[var(--pm-text-muted)] hover:text-[var(--pm-text-muted)]"}`}
            style={activeTab === t.id ? { borderBottomColor: accent } : {}}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Meal Plans tab content */}
      {isMealPlan && mpTab === "overview"         && <MPOverview />}
      {isMealPlan && mpTab === "meal-report"      && <MPMealReport />}
      {isMealPlan && mpTab === "delivery-report"  && <MPDeliveryReport />}
      {isMealPlan && mpTab === "marketing-report" && <MPMarketingReport />}

      {/* Ready Series tab content */}
      {!isMealPlan && rsTab === "overview"         && <RSOverview />}
      {!isMealPlan && rsTab === "frozen-stock"     && <RSFrozenStock />}
      {!isMealPlan && rsTab === "delivery-report"  && <RSDeliveryReport />}
      {!isMealPlan && rsTab === "marketing-report" && <RSMarketingReport />}
    </div>
  );
}
