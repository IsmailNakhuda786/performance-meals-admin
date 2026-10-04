import { useState } from "react";
import type { BusinessStream } from "../App";
import { downloadCSV } from "../utils/flowUtils";

// ─── Shared data ──────────────────────────────────────────────────────────────

const revenueTable = [
  { period: "This Week (9–15 Sep)", mealPlan: 4284.00, boxSub: 1134.00, rtg: 537.00, total: 5955.00 },
  { period: "Last Week (2–8 Sep)",  mealPlan: 3948.00, boxSub: 1080.00, rtg: 312.00, total: 5340.00 },
  { period: "August 2024",          mealPlan: 18760.00, boxSub: 4920.00, rtg: 1780.00, total: 25460.00 },
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

const frozenStockData = [
  { product: "Chicken Teriyaki Bowl",    sku: "RS-CHK-001", currentStock: 42, parLevel: 60, status: "LOW",  lastAudit: "11 Sep 2024", note: "Replenish before Wed 18 Sep" },
  { product: "Salmon Fillet Pack",       sku: "RS-SAL-002", currentStock: 28, parLevel: 40, status: "LOW",  lastAudit: "11 Sep 2024", note: "Order from supplier" },
  { product: "Beef Bolognese",           sku: "RS-BEF-003", currentStock: 75, parLevel: 50, status: "OK",   lastAudit: "11 Sep 2024", note: "" },
  { product: "Grilled Lemon Chicken",    sku: "RS-GLC-004", currentStock: 18, parLevel: 40, status: "LOW",  lastAudit: "11 Sep 2024", note: "Critical — replenish immediately" },
  { product: "Vegetable Stir Fry",       sku: "RS-VEG-005", currentStock: 55, parLevel: 45, status: "OK",   lastAudit: "11 Sep 2024", note: "" },
  { product: "Prawn Fried Rice",         sku: "RS-PRN-006", currentStock: 0,  parLevel: 30, status: "OUT",  lastAudit: "11 Sep 2024", note: "Out of stock — DO NOT sell" },
  { product: "Korean BBQ Pork",          sku: "RS-KBQ-007", currentStock: 63, parLevel: 50, status: "OK",   lastAudit: "11 Sep 2024", note: "" },
  { product: "Tom Yum Seafood Noodles",  sku: "RS-TYM-008", currentStock: 11, parLevel: 35, status: "LOW",  lastAudit: "11 Sep 2024", note: "Replenish" },
];

const deliveryReportRS = [
  { date: "Mon 16 Sep", orders: 6, channel: "Shopify", run: "9am–12pm", status: "Scheduled" },
  { date: "Wed 18 Sep", orders: 8, channel: "Shopify", run: "9am–12pm", status: "Scheduled" },
  { date: "Fri 20 Sep", orders: 5, channel: "Shopify", run: "9am–12pm", status: "Scheduled" },
];

const marketingReportRS = [
  { customer: "Emily Koh",     shopifyId: "SH-44221", lastPurchase: "20 Jul 2024", daysSince: 58, products: "Chicken Teriyaki Bowl ×2",  segment: "Lapsed > 30 days",   action: "Re-engagement campaign" },
  { customer: "Derek Ng",      shopifyId: "SH-44089", lastPurchase: "01 Aug 2024", daysSince: 46, products: "Salmon Fillet Pack ×1",       segment: "Lapsed > 30 days",   action: "Promotional offer" },
  { customer: "Charlene Ong",  shopifyId: "SH-44307", lastPurchase: "05 Sep 2024", daysSince: 11, products: "Korean BBQ Pork ×3",          segment: "Loyal — single item", action: "Upsell bundle" },
  { customer: "Vivienne Lim",  shopifyId: "SH-44120", lastPurchase: "12 Sep 2024", daysSince: 4,  products: "Beef Bolognese ×2, Salmon ×1", segment: "Multi-product buyer", action: "Retention — bundle promo" },
  { customer: "Jason Yeo",     shopifyId: "SH-44198", lastPurchase: "10 Sep 2024", daysSince: 6,  products: "Prawn Fried Rice ×1",          segment: "Low frequency",       action: "Re-engagement" },
];

// ─── Delivery Order data ──────────────────────────────────────────────────────

const doDataMP = [
  { doNo: "DO-MP-0901", subscriber: "Marcus Tan", subId: "SUB-001", address: "Blk 123 Clementi Ave 3 #04-21", phone: "+65 9123 4567", window: "7–10am", meals: 5, plan: "Meal Plan — BUILD", date: "Mon 16 Sep", status: "Ready" },
  { doNo: "DO-MP-0902", subscriber: "Priya Nair", subId: "SUB-002", address: "11 Tanjong Rhu Rd #08-05", phone: "+65 9234 5678", window: "7–10am", meals: 5, plan: "Meal Plan — CUT", date: "Mon 16 Sep", status: "Ready" },
  { doNo: "DO-MP-0903", subscriber: "Raj Nair", subId: "SUB-006", address: "Blk 302 Tampines St 32 #11-22", phone: "+65 9567 8901", window: "10am–1pm", meals: 5, plan: "6 by 60 — BUILD", date: "Mon 16 Sep", status: "Ready" },
  { doNo: "DO-MP-0904", subscriber: "Bryan Low", subId: "SUB-010", address: "72 Jurong West St 42 #09-11", phone: "+65 9111 2233", window: "10am–1pm", meals: 10, plan: "6 by 60 Plus — BUILD", date: "Mon 16 Sep", status: "Pending" },
];

const doDataRS = [
  { doNo: "DO-RS-0901", customer: "Wei Jie Lim", shopifyId: "SH-44301", address: "Blk 204 Tampines St 21 #08-11", phone: "+65 9101 1234", window: "10:00–12:00", sku: "RS-BOX-05", term: "3 months", date: "Mon 16 Sep", status: "Ready" },
  { doNo: "DO-RS-0902", customer: "Jade Koh", shopifyId: "SH-44302", address: "12 Woodlands Ave 5 #03-22", phone: "+65 9202 5678", window: "10:00–12:00", sku: "RS-BOX-10", term: "6 months", date: "Mon 16 Sep", status: "Ready" },
  { doNo: "DO-RS-0903", customer: "Darren Ong", shopifyId: "SH-44303", address: "88 Bukit Timah Rd #11-04", phone: "+65 9303 9012", window: "14:00–16:00", sku: "RS-RTG-03", term: "Single", date: "Mon 16 Sep", status: "Pending" },
  { doNo: "DO-RS-0904", customer: "Jason Yeo", shopifyId: "SH-44304", address: "Blk 44 Geylang Bahru #06-08", phone: "+65 9404 3456", window: "14:00–16:00", sku: "RS-BOX-15", term: "3 months", date: "Mon 16 Sep", status: "Ready" },
];

// ─── Component ────────────────────────────────────────────────────────────────

type MPTab = "overview" | "meal-report" | "delivery-report" | "marketing-report";
type RSTab = "overview" | "frozen-stock" | "delivery-report" | "marketing-report";

export default function Reports({ stream, demoMode }: { stream: BusinessStream; demoMode?: boolean }) {
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
    { label: "Active Box Subs", value: "3",     sub: "this week",      accent: false },
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
            <div key={m.label} className="border border-[#2A2A2A] bg-[#181818] p-4">
              <div className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider mb-2">{m.label}</div>
              <div className="text-2xl font-extrabold mono" style={{ color: m.accent ? accent : "#E8E8E8" }}>{m.value}</div>
              <div className="text-xs text-[#888] mono mt-1">{m.sub}</div>
            </div>
          ))}
        </div>

        <div className="border border-[#2A2A2A] bg-[#181818]">
          <div className="px-4 py-3 border-b border-[#2A2A2A] flex items-center justify-between">
            <span className="text-sm font-semibold tracking-wide">Revenue Summary</span>
            <button onClick={() => downloadCSV("revenue.csv", revenueTable.map(r => ({ Period: r.period, "Meal Plan": r.mealPlan, Total: r.total })))} className="text-xs mono text-[#888] hover:text-[#F5B300] transition-colors">CSV ↓</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2A2A2A]">
                  {["Period", "Meal Plan", "Box Sub", "Ready-to-Go", "Total"].map(h => (
                    <th key={h} className="px-4 py-2 text-left text-xs font-bold text-[#FFFFFF] uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {revenueTable.map((r, i) => (
                  <tr key={r.period} className={`border-b border-[#2A2A2A] hover:bg-[#1F1F1F] ${i % 2 === 0 ? "" : "bg-[#141414]"}`}>
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
          <div className="border border-[#2A2A2A] bg-[#181818] p-4 space-y-2">
            <div className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider border-b border-[#2A2A2A] pb-2 mb-3">Subscription Health</div>
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
                <div className="h-1.5 bg-[#2A2A2A]">
                  <div className="h-1.5" style={{ width: `${(s.count / s.total) * 100}%`, background: s.color }} />
                </div>
              </div>
            ))}
          </div>
          <div className="border border-[#2A2A2A] bg-[#0D0D0D] p-4">
            <div className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider border-b border-[#2A2A2A] pb-2 mb-3">Weekly Schedule Reference — Meal Plans</div>
            {[
              { time: "Wed 2:00 PM",     label: "Menu review & billing notification sent to customers" },
              { time: "Thu 1:59 PM",     label: "Customer cutoff — menu finalized, subscription changes finalized" },
              { time: "Thu 2:00 PM",     label: "Subscription locked · Customer charged · Changes closed" },
              { time: "Thu 3:00 PM",     label: "Failed billing follow-up · Consolidation" },
              { time: "Fri 9:00 AM",     label: "Export: Meal Report · Delivery Order · Delivery Report" },
              { time: "Every other day", label: "Menu updates · Sales & marketing data export" },
            ].map(row => (
              <div key={row.time} className="flex gap-3 py-1.5 border-b border-[#1E1E1E] last:border-0">
                <span className="mono text-[10px] text-[#F5B300] w-28 flex-shrink-0">{row.time}</span>
                <span className="text-xs text-[#888]">{row.label}</span>
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
            <p className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider display">Meal Report — Week 38 · 16–22 Sep 2024</p>
            <p className="text-xs text-[#666] mono mt-0.5">Generated: Fri 13 Sep 2024 09:00 · Export for Chef production planning and Packing Supervisor</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => downloadCSV("meal-report-wk38.csv", mealReportData.map(r => ({ Subscriber: r.subscriber, Plan: r.plan, "Meals/wk": r.meals, Days: r.days, Items: r.items, Status: r.status })))} className="border border-[#3A3A3A] text-[#CCCCCC] text-xs px-3 py-1.5 mono hover:border-[#F5B300] hover:text-[#F5B300] transition-colors">CSV ↓</button>
          </div>
        </div>
        <div className="border border-[#2A2A2A] bg-[#181818] overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#2A2A2A]">
                {["Subscriber", "Sub ID", "Plan", "Meals/wk", "Delivery Days", "Week", "Meal Items", "Status"].map(h => (
                  <th key={h} className="px-4 py-2 text-left text-xs font-bold text-[#FFFFFF] uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mealReportData.map((r, i) => (
                <tr key={r.subId} className={`border-b border-[#2A2A2A] hover:bg-[#1F1F1F] ${i % 2 === 0 ? "" : "bg-[#141414]"}`}>
                  <td className="px-4 py-2.5 font-medium text-[#E8E8E8]">{r.subscriber}</td>
                  <td className="px-4 py-2.5 mono text-[#F5B300]">{r.subId}</td>
                  <td className="px-4 py-2.5 text-[#888]">{r.plan}</td>
                  <td className="px-4 py-2.5 mono text-center">{r.meals || "—"}</td>
                  <td className="px-4 py-2.5 mono text-[#CCCCCC] whitespace-nowrap">{r.days}</td>
                  <td className="px-4 py-2.5 mono text-[#888]">{r.week}</td>
                  <td className="px-4 py-2.5 text-[#888]">{r.items}</td>
                  <td className="px-4 py-2.5">
                    <span className={`mono px-2 py-0.5 text-xs ${r.status === "Confirmed" ? "bg-green-950 text-green-400" : "bg-yellow-950 text-yellow-400"}`}>{r.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border border-[#2A2A2A] bg-[#0D0D0D] px-4 py-3 text-xs text-[#555] mono">
          Total meals to prepare: <span className="text-[#CCCCCC]">{mealReportData.reduce((s, r) => s + r.meals, 0)} meals</span> across <span className="text-[#CCCCCC]">{mealReportData.filter(r => r.status === "Confirmed").length} active subscribers</span> · Week 38
        </div>
      </div>
    );
  }

  function MPDeliveryReport() {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider display">Delivery Report — Week 38 · Meal Plans</p>
            <p className="text-xs text-[#666] mono mt-0.5">Generated: Fri 13 Sep 2024 09:00 · Export for Logistics Admin delivery planning</p>
          </div>
          <button onClick={() => downloadCSV("delivery-report-wk38-mp.csv", deliveryReportMP.map(r => ({ Date: r.date, Orders: r.orders, Run: r.run, Status: r.status })))} className="border border-[#3A3A3A] text-[#CCCCCC] text-xs px-3 py-1.5 mono hover:border-[#F5B300] hover:text-[#F5B300] transition-colors">CSV ↓</button>
        </div>
        <div className="border border-[#2A2A2A] bg-[#181818] overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#2A2A2A]">
                {["Delivery Date", "Orders", "Subscribers", "Delivery Run", "Status"].map(h => (
                  <th key={h} className="px-4 py-2 text-left text-xs font-bold text-[#FFFFFF] uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {deliveryReportMP.map((r, i) => (
                <tr key={r.date} className={`border-b border-[#2A2A2A] hover:bg-[#1F1F1F] ${i % 2 === 0 ? "" : "bg-[#141414]"}`}>
                  <td className="px-4 py-2.5 mono text-[#E8E8E8] whitespace-nowrap">{r.date}</td>
                  <td className="px-4 py-2.5 mono text-[#F5B300] text-center">{r.orders}</td>
                  <td className="px-4 py-2.5 text-[#888] text-xs">{r.subscribers.join(", ")}</td>
                  <td className="px-4 py-2.5 mono text-[#CCCCCC]">{r.run}</td>
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
            <p className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider display">Marketing Report — Meal Plans</p>
            <p className="text-xs text-[#666] mono mt-0.5">Customer segmentation for upsell, re-engagement, and retention · Export for Sales & Marketing</p>
          </div>
          <button onClick={() => downloadCSV("marketing-report-mp.csv", marketingReportMP.map(r => ({ Subscriber: r.subscriber, "Sub ID": r.subId, "Last Order": r.lastOrder, "Days Since": r.daysSince, Status: r.status, Segment: r.segment })))} className="border border-[#3A3A3A] text-[#CCCCCC] text-xs px-3 py-1.5 mono hover:border-[#F5B300] hover:text-[#F5B300] transition-colors">CSV ↓</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-2">
          {[
            { label: "Re-engagement",       count: 1, color: "#E85D04" },
            { label: "Win-back",            count: 1, color: "#EF4444" },
            { label: "Upsell on resume",    count: 1, color: "#F5B300" },
            { label: "Retention / Upsell",  count: 2, color: "#22C55E" },
          ].map(seg => (
            <div key={seg.label} className="border border-[#2A2A2A] bg-[#181818] p-3 text-center">
              <div className="text-xl font-extrabold mono" style={{ color: seg.color }}>{seg.count}</div>
              <div className="text-xs text-[#888] mt-1">{seg.label}</div>
            </div>
          ))}
        </div>
        <div className="border border-[#2A2A2A] bg-[#181818] overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#2A2A2A]">
                {["Subscriber", "Sub ID", "Last Order", "Days Since", "Plan", "Status", "Segment / Action"].map(h => (
                  <th key={h} className="px-4 py-2 text-left text-xs font-bold text-[#FFFFFF] uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {marketingReportMP.map((r, i) => (
                <tr key={r.subId} className={`border-b border-[#2A2A2A] hover:bg-[#1F1F1F] ${i % 2 === 0 ? "" : "bg-[#141414]"}`}>
                  <td className="px-4 py-2.5 font-medium text-[#E8E8E8]">{r.subscriber}</td>
                  <td className="px-4 py-2.5 mono text-[#F5B300]">{r.subId}</td>
                  <td className="px-4 py-2.5 mono text-[#888]">{r.lastOrder}</td>
                  <td className="px-4 py-2.5 mono text-center" style={{ color: r.daysSince > 20 ? "#EF4444" : r.daysSince > 7 ? "#F5B300" : "#22C55E" }}>{r.daysSince}d</td>
                  <td className="px-4 py-2.5 text-[#888]">{r.plan}</td>
                  <td className="px-4 py-2.5 mono text-[#AAAAAA]">{r.status}</td>
                  <td className="px-4 py-2.5 text-xs text-[#CCCCCC]">{r.segment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  function MPDeliveryOrder() {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold">Delivery Order — Meal Plans</div>
            <div className="text-xs text-[#888] mono mt-0.5">Fri 9:00 AM export · Week 38</div>
          </div>
          <button onClick={() => downloadCSV("DO-MP-wk38.csv", doDataMP.map(r => ({ "DO No": r.doNo, Subscriber: r.subscriber, "Sub ID": r.subId, Plan: r.plan, Address: r.address, Phone: r.phone, Window: r.window, Meals: r.meals, Date: r.date, Status: r.status })))}
            className="border border-[#3A3A3A] text-[#CCCCCC] text-xs px-3 py-1.5 mono hover:border-[#F5B300] hover:text-[#F5B300] transition-colors">
            CSV ↓
          </button>
        </div>
        <div className="border border-[#2A2A2A] bg-[#181818] overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2A2A2A]">
                {["DO No", "Subscriber", "Sub ID", "Plan", "Address", "Phone", "Window", "Meals", "Date", "Status"].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-xs text-[#AAAAAA] uppercase tracking-wider font-medium whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {doDataMP.map((r, i) => (
                <tr key={r.doNo} className={`border-b border-[#2A2A2A] hover:bg-[#1F1F1F] ${i % 2 === 0 ? "" : "bg-[#141414]"}`}>
                  <td className="px-4 py-2.5 mono text-xs text-[#F5B300]">{r.doNo}</td>
                  <td className="px-4 py-2.5 font-medium whitespace-nowrap">{r.subscriber}</td>
                  <td className="px-4 py-2.5 mono text-xs text-[#888]">{r.subId}</td>
                  <td className="px-4 py-2.5 text-xs text-[#CCCCCC]">{r.plan}</td>
                  <td className="px-4 py-2.5 text-xs text-[#888]">{r.address}</td>
                  <td className="px-4 py-2.5 mono text-xs text-[#888] whitespace-nowrap">{r.phone}</td>
                  <td className="px-4 py-2.5 mono text-xs text-[#F5B300] whitespace-nowrap">{r.window}</td>
                  <td className="px-4 py-2.5 mono text-xs font-bold text-[#E8E8E8]">{r.meals}</td>
                  <td className="px-4 py-2.5 text-xs text-[#888] whitespace-nowrap">{r.date}</td>
                  <td className="px-4 py-2.5">
                    <span className={`text-xs mono font-bold ${r.status === "Ready" ? "text-green-400" : "text-[#888]"}`}>{r.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ── Ready Series tabs ───────────────────────────────────────────────────────

  function RSDeliveryOrder() {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold">Delivery Order — Ready Series</div>
            <div className="text-xs text-[#888] mono mt-0.5">Day-before 2:00 PM export</div>
          </div>
          <button onClick={() => downloadCSV("DO-RS-wk38.csv", doDataRS.map(r => ({ "DO No": r.doNo, Customer: r.customer, "Shopify ID": r.shopifyId, SKU: r.sku, Term: r.term, Address: r.address, Phone: r.phone, Window: r.window, Date: r.date, Status: r.status })))}
            className="border border-[#3A3A3A] text-[#CCCCCC] text-xs px-3 py-1.5 mono hover:border-[#E85D04] hover:text-[#E85D04] transition-colors">
            CSV ↓
          </button>
        </div>
        <div className="border border-[#2A2A2A] bg-[#181818] overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2A2A2A]">
                {["DO No", "Customer", "Shopify ID", "SKU", "Term", "Address", "Phone", "Window", "Date", "Status"].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-xs text-[#AAAAAA] uppercase tracking-wider font-medium whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {doDataRS.map((r, i) => (
                <tr key={r.doNo} className={`border-b border-[#2A2A2A] hover:bg-[#1F1F1F] ${i % 2 === 0 ? "" : "bg-[#141414]"}`}>
                  <td className="px-4 py-2.5 mono text-xs text-[#E85D04]">{r.doNo}</td>
                  <td className="px-4 py-2.5 font-medium whitespace-nowrap">{r.customer}</td>
                  <td className="px-4 py-2.5 mono text-xs text-[#888]">{r.shopifyId}</td>
                  <td className="px-4 py-2.5 mono text-xs font-bold text-[#E85D04]">{r.sku}</td>
                  <td className="px-4 py-2.5 text-xs text-[#888]">{r.term}</td>
                  <td className="px-4 py-2.5 text-xs text-[#888]">{r.address}</td>
                  <td className="px-4 py-2.5 mono text-xs text-[#888] whitespace-nowrap">{r.phone}</td>
                  <td className="px-4 py-2.5 mono text-xs text-[#E85D04] whitespace-nowrap">{r.window}</td>
                  <td className="px-4 py-2.5 text-xs text-[#888] whitespace-nowrap">{r.date}</td>
                  <td className="px-4 py-2.5">
                    <span className={`text-xs mono font-bold ${r.status === "Ready" ? "text-green-400" : "text-[#888]"}`}>{r.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  function RSOverview() {
    return (
      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 sm:grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {metrics.map(m => (
            <div key={m.label} className="border border-[#2A2A2A] bg-[#181818] p-4">
              <div className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider mb-2">{m.label}</div>
              <div className="text-2xl font-extrabold mono" style={{ color: m.accent ? accent : "#E8E8E8" }}>{m.value}</div>
              <div className="text-xs text-[#888] mono mt-1">{m.sub}</div>
            </div>
          ))}
        </div>
        <div className="border border-[#2A2A2A] bg-[#0D0D0D] p-4">
          <div className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider border-b border-[#2A2A2A] pb-2 mb-3">Operational Schedule Reference — Ready Series</div>
          {[
            { time: "Every other day",       label: "Deduct meals purchased · Add new stock to inventory · Promotional updates · Export customer data for Sales & Marketing" },
            { time: "Day before delivery 2pm", label: "Export Delivery Order (DO) for packing · Export delivery list" },
            { time: "Thu 3:00 PM",           label: "Export Inventory Report" },
            { time: "Biweekly Wednesday",    label: "Update physical stock date — audit & rolling stock accuracy" },
          ].map(row => (
            <div key={row.time} className="flex gap-3 py-1.5 border-b border-[#1E1E1E] last:border-0">
              <span className="mono text-[10px] text-[#E85D04] w-36 flex-shrink-0">{row.time}</span>
              <span className="text-xs text-[#888]">{row.label}</span>
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
            <p className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider display">Frozen Stock Report — Week 38</p>
            <p className="text-xs text-[#666] mono mt-0.5">Par level vs current stock · Chef production planning · Last audit: Wed 11 Sep 2024</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => downloadCSV("frozen-stock-wk38.csv", frozenStockData.map(r => ({ Product: r.product, SKU: r.sku, "Current Stock": r.currentStock, "Par Level": r.parLevel, Status: r.status, "Last Audit": r.lastAudit, Note: r.note })))} className="border border-[#3A3A3A] text-[#CCCCCC] text-xs px-3 py-1.5 mono hover:border-[#E85D04] hover:text-[#E85D04] transition-colors">CSV ↓</button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "Total SKUs",    value: String(frozenStockData.length), color: "#E8E8E8" },
            { label: "OK",           value: String(frozenStockData.filter(r => r.status === "OK").length),  color: "#22C55E" },
            { label: "Below Par",    value: String(lowCount),  color: "#F5B300" },
            { label: "Out of Stock", value: String(outCount),  color: "#EF4444" },
          ].map(s => (
            <div key={s.label} className="border border-[#2A2A2A] bg-[#181818] p-4 text-center">
              <div className="text-2xl font-extrabold mono" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs text-[#888] mt-1 uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>
        <div className="border border-[#2A2A2A] bg-[#181818] overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#2A2A2A]">
                {["Product", "SKU", "Current Stock", "Par Level", "Variance", "Status", "Last Audit", "Note"].map(h => (
                  <th key={h} className="px-4 py-2 text-left text-xs font-bold text-[#FFFFFF] uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {frozenStockData.map((r, i) => {
                const variance = r.currentStock - r.parLevel;
                const statusStyle = r.status === "OK" ? "bg-green-950 text-green-400" : r.status === "OUT" ? "bg-red-950 text-red-400" : "bg-yellow-950 text-yellow-400";
                return (
                  <tr key={r.sku} className={`border-b border-[#2A2A2A] hover:bg-[#1F1F1F] ${i % 2 === 0 ? "" : "bg-[#141414]"}`}>
                    <td className="px-4 py-2.5 font-medium text-[#E8E8E8]">{r.product}</td>
                    <td className="px-4 py-2.5 mono text-[#E85D04]">{r.sku}</td>
                    <td className="px-4 py-2.5 mono text-center font-bold" style={{ color: r.currentStock === 0 ? "#EF4444" : r.currentStock < r.parLevel ? "#F5B300" : "#22C55E" }}>{r.currentStock}</td>
                    <td className="px-4 py-2.5 mono text-center text-[#888]">{r.parLevel}</td>
                    <td className="px-4 py-2.5 mono text-center" style={{ color: variance < 0 ? "#EF4444" : "#22C55E" }}>{variance > 0 ? "+" : ""}{variance}</td>
                    <td className="px-4 py-2.5"><span className={`mono px-2 py-0.5 ${statusStyle}`}>{r.status}</span></td>
                    <td className="px-4 py-2.5 mono text-[#666]">{r.lastAudit}</td>
                    <td className="px-4 py-2.5 text-[#888] text-xs">{r.note || "—"}</td>
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
            <p className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider display">Delivery Report — Ready Series</p>
            <p className="text-xs text-[#666] mono mt-0.5">Generated day before delivery · Logistics Admin delivery planning · Shopify orders</p>
          </div>
          <button onClick={() => downloadCSV("delivery-report-rs.csv", deliveryReportRS.map(r => ({ Date: r.date, Orders: r.orders, Channel: r.channel, Run: r.run, Status: r.status })))} className="border border-[#3A3A3A] text-[#CCCCCC] text-xs px-3 py-1.5 mono hover:border-[#E85D04] hover:text-[#E85D04] transition-colors">CSV ↓</button>
        </div>
        <div className="border border-[#2A2A2A] bg-[#181818] overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#2A2A2A]">
                {["Delivery Date", "Orders", "Channel", "Delivery Run", "Status"].map(h => (
                  <th key={h} className="px-4 py-2 text-left text-xs font-bold text-[#FFFFFF] uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {deliveryReportRS.map((r, i) => (
                <tr key={r.date} className={`border-b border-[#2A2A2A] hover:bg-[#1F1F1F] ${i % 2 === 0 ? "" : "bg-[#141414]"}`}>
                  <td className="px-4 py-2.5 mono text-[#E8E8E8]">{r.date}</td>
                  <td className="px-4 py-2.5 mono text-[#E85D04] text-center">{r.orders}</td>
                  <td className="px-4 py-2.5 text-[#888]">{r.channel}</td>
                  <td className="px-4 py-2.5 mono text-[#CCCCCC]">{r.run}</td>
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
            <p className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider display">Marketing Report — Ready Series</p>
            <p className="text-xs text-[#666] mono mt-0.5">Customer segmentation · Lapsed customers · Product purchase history · Export for Sales & Marketing</p>
          </div>
          <button onClick={() => downloadCSV("marketing-report-rs.csv", marketingReportRS.map(r => ({ Customer: r.customer, "Shopify ID": r.shopifyId, "Last Purchase": r.lastPurchase, "Days Since": r.daysSince, Products: r.products, Segment: r.segment, Action: r.action })))} className="border border-[#3A3A3A] text-[#CCCCCC] text-xs px-3 py-1.5 mono hover:border-[#E85D04] hover:text-[#E85D04] transition-colors">CSV ↓</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-2">
          {[
            { label: "Lapsed > 30 days",   count: 2, color: "#EF4444" },
            { label: "Single-product buyer", count: 1, color: "#F5B300" },
            { label: "Multi-product buyer", count: 2, color: "#22C55E" },
          ].map(seg => (
            <div key={seg.label} className="border border-[#2A2A2A] bg-[#181818] p-3 text-center">
              <div className="text-xl font-extrabold mono" style={{ color: seg.color }}>{seg.count}</div>
              <div className="text-xs text-[#888] mt-1">{seg.label}</div>
            </div>
          ))}
        </div>
        <div className="border border-[#2A2A2A] bg-[#181818] overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#2A2A2A]">
                {["Customer", "Shopify ID", "Last Purchase", "Days Since", "Products", "Segment", "Action"].map(h => (
                  <th key={h} className="px-4 py-2 text-left text-xs font-bold text-[#FFFFFF] uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {marketingReportRS.map((r, i) => (
                <tr key={r.shopifyId} className={`border-b border-[#2A2A2A] hover:bg-[#1F1F1F] ${i % 2 === 0 ? "" : "bg-[#141414]"}`}>
                  <td className="px-4 py-2.5 font-medium text-[#E8E8E8]">{r.customer}</td>
                  <td className="px-4 py-2.5 mono text-[#E85D04]">{r.shopifyId}</td>
                  <td className="px-4 py-2.5 mono text-[#888]">{r.lastPurchase}</td>
                  <td className="px-4 py-2.5 mono text-center" style={{ color: r.daysSince > 30 ? "#EF4444" : r.daysSince > 14 ? "#F5B300" : "#22C55E" }}>{r.daysSince}d</td>
                  <td className="px-4 py-2.5 text-[#888]">{r.products}</td>
                  <td className="px-4 py-2.5 mono text-[#AAAAAA] whitespace-nowrap">{r.segment}</td>
                  <td className="px-4 py-2.5 text-xs text-[#CCCCCC]">{r.action}</td>
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
      <div className="flex border-b border-[#2A2A2A]">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => isMealPlan ? setMpTab(t.id as MPTab) : setRsTab(t.id as RSTab)}
            className={`px-5 py-3 text-sm mono transition-colors whitespace-nowrap ${activeTab === t.id ? "border-b-2 text-[#FFFFFF]" : "text-[#666] hover:text-[#AAAAAA]"}`}
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
