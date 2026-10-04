import { useState } from "react";
import StatusBadge from "../components/StatusBadge";
import { subscriptions, type CustomerStatus } from "../data";
import type { BusinessStream } from "../App";
import { downloadCSV, downloadExcel } from "../utils/flowUtils";

const tabs: CustomerStatus[] = ["Active", "Paused", "Renewal Due", "Cancelled"];

// ─── Automation data ──────────────────────────────────────────────────────────

const runHistory = [
  { date: "Thu 12 Sep 2024 14:55", evaluated: 11, created: 4, skipped: 4, failed: 3, topup: 1, status: "Partial Fail" },
  { date: "Thu 05 Sep 2024 14:55", evaluated: 7, created: 5, skipped: 1, failed: 1, topup: 0, status: "Completed" },
  { date: "Thu 29 Aug 2024 14:55", evaluated: 7, created: 4, skipped: 2, failed: 1, topup: 1, status: "Completed" },
  { date: "Thu 22 Aug 2024 14:55", evaluated: 6, created: 5, skipped: 0, failed: 1, topup: 0, status: "Completed" },
  { date: "Thu 15 Aug 2024 14:55", evaluated: 6, created: 3, skipped: 2, failed: 1, topup: 1, status: "Partial Fail" },
];

type ResultType = "created" | "paused" | "existing" | "credit" | "nodays" | "fail-menu" | "fail-pricing" | "fail-slot" | "fail-other";

type SubscriberResult = {
  name: string;
  subId: string;
  plan: string;
  dinnersPerWeek: string;
  defaultDays: string;
  timeslot: string;
  credit: string;
  required: string;
  paused: string;
  existingOrder: string;
  menu: string;
  deliveryDates: string;
  price: string;
  result: string;
  resultType: ResultType;
  period: string;
  reason: string;
};

const subscriberDetails: SubscriberResult[] = [
  { name: "Marcus Tan",   subId: "SUB-001", plan: "Low Carb Regular",    dinnersPerWeek: "5/wk", defaultDays: "Mon,Wed,Fri,Sat,Sun", timeslot: "7-9pm",  credit: "$630", required: "$210", paused: "No",          existingOrder: "None",    menu: "Week 38", deliveryDates: "16,18,20,21,22 Sep", price: "$210.00", result: "Order Created",                    resultType: "created",      period: "Week 38 · 16–22 Sep 2024", reason: "—" },
  { name: "Aisha Rahman", subId: "SUB-007", plan: "Balance Regular+",    dinnersPerWeek: "3/wk", defaultDays: "Mon,Wed,Fri",         timeslot: "6-8pm",  credit: "$84",  required: "$126", paused: "YES (active)", existingOrder: "—",        menu: "—",       deliveryDates: "—",                  price: "—",       result: "Skipped — Subscription Paused",    resultType: "paused",       period: "Week 38 · 16–22 Sep 2024", reason: "Subscription on active pause until 30 Sep 2024" },
  { name: "Wei Jie Lim",  subId: "SUB-003", plan: "Low Carb Regular+",   dinnersPerWeek: "5/wk", defaultDays: "Mon–Fri",             timeslot: "7-9pm",  credit: "$420", required: "$210", paused: "No",          existingOrder: "ORD-2403", menu: "—",       deliveryDates: "—",                  price: "—",       result: "Skipped — Existing Order",         resultType: "existing",     period: "Week 38 · 16–22 Sep 2024", reason: "Order ORD-2403 already exists for this period" },
  { name: "Serene Tay",   subId: "SUB-004", plan: "Low Carb Regular",    dinnersPerWeek: "4/wk", defaultDays: "Tue,Thu,Sat,Sun",     timeslot: "8-10am", credit: "$44",  required: "$168", paused: "No",          existingOrder: "None",    menu: "—",       deliveryDates: "—",                  price: "—",       result: "Skipped — Insufficient Credit",    resultType: "credit",       period: "Week 38 · 16–22 Sep 2024", reason: "Balance $44 below required $168 — top-up notification sent" },
  { name: "Priya Nair",   subId: "SUB-008", plan: "Balance Regular",     dinnersPerWeek: "3/wk", defaultDays: "Mon,Wed,Fri",         timeslot: "7-9pm",  credit: "$252", required: "$126", paused: "No",          existingOrder: "None",    menu: "Week 38", deliveryDates: "16,18,20 Sep",       price: "$126.00", result: "Order Created",                    resultType: "created",      period: "Week 38 · 16–22 Sep 2024", reason: "—" },
  { name: "Raj Nair",     subId: "SUB-010", plan: "6 by 60",             dinnersPerWeek: "5/wk", defaultDays: "Mon–Fri",             timeslot: "6-8pm",  credit: "$630", required: "$210", paused: "No",          existingOrder: "None",    menu: "Week 38", deliveryDates: "16,17,18,19,20 Sep", price: "$210.00", result: "Order Created",                    resultType: "created",      period: "Week 38 · 16–22 Sep 2024", reason: "—" },
  { name: "Kevin Chia",   subId: "SUB-009", plan: "Balance Regular+",    dinnersPerWeek: "3/wk", defaultDays: "None",                timeslot: "—",      credit: "$378", required: "—",    paused: "No",          existingOrder: "—",        menu: "—",       deliveryDates: "—",                  price: "—",       result: "Skipped — No Default Days",        resultType: "nodays",       period: "Week 38 · 16–22 Sep 2024", reason: "No default delivery days configured by customer" },
  { name: "Bryan Low",    subId: "SUB-011", plan: "6 by 60 Plus",        dinnersPerWeek: "4/wk", defaultDays: "Mon,Tue,Thu,Fri",     timeslot: "7-9pm",  credit: "$336", required: "$168", paused: "No",          existingOrder: "None",    menu: "Week 38", deliveryDates: "16,17,19,20 Sep",    price: "$168.00", result: "Order Created",                    resultType: "created",      period: "Week 38 · 16–22 Sep 2024", reason: "—" },
  { name: "Diana Chua",   subId: "SUB-014", plan: "Low Carb Regular",    dinnersPerWeek: "3/wk", defaultDays: "Mon,Wed,Fri",         timeslot: "7-9pm",  credit: "$504", required: "$126", paused: "No",          existingOrder: "None",    menu: "Week 38", deliveryDates: "16,18,20 Sep",       price: "—",       result: "Failed — Invalid Menu",            resultType: "fail-menu",    period: "Week 38 · 16–22 Sep 2024", reason: "Lemon Herb Salmon not available Fri 20 Sep (Fri menu: no fish)" },
  { name: "Farid Hassan",  subId: "SUB-016", plan: "Balance Regular",     dinnersPerWeek: "4/wk", defaultDays: "Tue,Wed,Thu,Fri",     timeslot: "6-8pm",  credit: "$336", required: "$168", paused: "No",          existingOrder: "None",    menu: "Week 38", deliveryDates: "17,18,19,20 Sep",    price: "—",       result: "Failed — Pricing Validation",      resultType: "fail-pricing", period: "Week 38 · 16–22 Sep 2024", reason: "Junior item rate rule BR-12 returned null — pricing config incomplete" },
  { name: "Mei Ling Yeo",  subId: "SUB-019", plan: "Balance Regular+",    dinnersPerWeek: "3/wk", defaultDays: "Mon,Wed,Sat",         timeslot: "7-9pm",  credit: "$504", required: "$126", paused: "No",          existingOrder: "None",    menu: "Week 38", deliveryDates: "16,18,21 Sep",       price: "—",       result: "Failed — Delivery Slot Validation", resultType: "fail-slot",    period: "Week 38 · 16–22 Sep 2024", reason: "Saved timeslot '7–9pm' unavailable Sat 21 Sep — no Saturday evening slot" },
];

const resultStyle: Record<ResultType, { bg: string; text: string }> = {
  created:      { bg: "bg-green-950",  text: "text-green-400" },
  paused:       { bg: "bg-yellow-950", text: "text-yellow-400" },
  existing:     { bg: "bg-blue-950",   text: "text-blue-400" },
  credit:       { bg: "bg-orange-950", text: "text-orange-400" },
  nodays:       { bg: "bg-[#1E1E1E]",  text: "text-[#888]" },
  "fail-menu":     { bg: "bg-red-950",   text: "text-red-400" },
  "fail-pricing":  { bg: "bg-red-950",   text: "text-red-400" },
  "fail-slot":     { bg: "bg-red-950",   text: "text-red-400" },
  "fail-other":    { bg: "bg-red-950",   text: "text-red-400" },
};

// ─── Automation Logic flow ────────────────────────────────────────────────────

function AutoLogicFlow() {
  const steps = [
    {
      label: "Default Delivery Days selected?",
      no: "NO → End (no order)",
      yes: "YES → Continue",
      noStyle: "bg-red-950 text-red-400 border border-red-800",
      yesStyle: "bg-green-950 text-green-400 border border-green-800",
    },
    {
      label: "Subscription paused?",
      no: "NO → Continue",
      yes: "YES → End (blocked)",
      noStyle: "bg-green-950 text-green-400 border border-green-800",
      yesStyle: "bg-yellow-950 text-yellow-400 border border-yellow-800",
    },
    {
      label: "Sufficient credit?",
      no: "NO → Send top-up notification → End",
      yes: "YES → Continue",
      noStyle: "bg-orange-950 text-orange-400 border border-orange-800",
      yesStyle: "bg-green-950 text-green-400 border border-green-800",
    },
  ];

  return (
    <div className="flex flex-col gap-0 items-start">
      {steps.map((step, idx) => (
        <div key={idx} className="flex items-stretch gap-4 w-full">
          <div className="flex flex-col items-center">
            <div className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center mono ${idx === 0 ? "bg-[#F5B300] text-black" : "bg-[#2A2A2A] text-[#F5B300] border border-[#F5B300]"}`}>
              {idx + 1}
            </div>
            <div className="w-px flex-1 bg-[#2A2A2A] mt-1" />
          </div>
          <div className="flex-1 pb-4">
            <p className="text-sm font-medium text-[#E8E8E8] mb-2">{step.label}</p>
            <div className="flex gap-3 flex-wrap">
              <span className={`mono text-xs px-2 py-1 ${step.yesStyle}`}>{step.yes}</span>
              <span className={`mono text-xs px-2 py-1 ${step.noStyle}`}>{step.no}</span>
            </div>
          </div>
        </div>
      ))}

      {/* Step 4 */}
      <div className="flex items-stretch gap-4 w-full">
        <div className="flex flex-col items-center">
          <div className="w-7 h-7 rounded-full bg-[#2A2A2A] text-[#F5B300] text-xs font-bold flex items-center justify-center mono border border-[#F5B300]">4</div>
          <div className="w-px flex-1 bg-[#2A2A2A] mt-1" />
        </div>
        <div className="flex-1 pb-4">
          <p className="text-sm font-medium text-[#E8E8E8] mb-1">Determine dinner plan</p>
          <p className="text-xs text-[#888]">2 / 3 / 4 / 5 dinners per week</p>
        </div>
      </div>

      {/* Step 5 */}
      <div className="flex items-stretch gap-4 w-full">
        <div className="flex flex-col items-center">
          <div className="w-7 h-7 rounded-full bg-[#2A2A2A] text-[#F5B300] text-xs font-bold flex items-center justify-center mono border border-[#F5B300]">5</div>
        </div>
        <div className="flex-1 pb-2">
          <p className="text-sm font-medium text-[#E8E8E8] mb-2">Existing orders for period?</p>
          <div className="flex gap-3 flex-wrap">
            <span className="mono text-xs px-2 py-1 bg-green-950 text-green-400 border border-green-800">NO → Create order using default delivery days</span>
            <span className="mono text-xs px-2 py-1 bg-blue-950 text-blue-400 border border-blue-800">YES → End (skip)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────

function DetailModal({ onClose }: { onClose: () => void }) {
  const timeslotRows = [
    { name: "Marcus Tan", customerSlot: "7-9pm", orderSlot: "7-9pm", status: "MATCHED" },
    { name: "Priya Nair",  customerSlot: "7-9pm", orderSlot: "7-9pm", status: "MATCHED" },
    { name: "Raj Nair",    customerSlot: "6-8pm", orderSlot: "6-8pm", status: "MATCHED" },
    { name: "Bryan Low",   customerSlot: "7-9pm", orderSlot: "7-9pm", status: "MATCHED" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 overflow-y-auto py-8 px-4">
      <div className="w-full max-w-[1200px] bg-[#161616] border border-[#2A2A2A]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2A2A2A]">
          <div>
            <h3 className="text-sm font-bold text-[#FFFFFF] uppercase tracking-wider display">Automation Run Detail</h3>
            <p className="text-xs text-[#888] mono mt-0.5">Thu 12 Sep 2024 — 14:55:00 SGT</p>
          </div>
          <button
            onClick={onClose}
            className="border border-[#3A3A3A] text-[#CCCCCC] text-xs px-4 py-2 mono hover:border-[#F5B300] hover:text-[#F5B300] transition-colors"
          >
            Close ✕
          </button>
        </div>

        {/* Subscriber results */}
        <div className="px-6 pt-5 pb-3">
          <p className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider display mb-3">Subscriber Results</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[#2A2A2A]">
                  {["Subscriber", "Sub ID", "Plan", "Dinners/wk", "Default Days", "Timeslot", "Credit", "Required", "Paused", "Existing Order", "Menu", "Delivery Dates", "Price", "Applicable Period", "Result", "Reason"].map(h => (
                    <th key={h} className="px-3 py-2 text-left text-xs font-bold text-[#FFFFFF] uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {subscriberDetails.map((row, i) => {
                  const rs = resultStyle[row.resultType];
                  return (
                    <tr key={row.subId} className={`border-b border-[#2A2A2A] hover:bg-[#1F1F1F] transition-colors ${i % 2 === 0 ? "" : "bg-[#141414]"}`}>
                      <td className="px-3 py-2.5 font-medium text-[#E8E8E8] whitespace-nowrap">{row.name}</td>
                      <td className="px-3 py-2.5 mono text-[#F5B300] whitespace-nowrap">{row.subId}</td>
                      <td className="px-3 py-2.5 text-[#888] whitespace-nowrap">{row.plan}</td>
                      <td className="px-3 py-2.5 mono text-center">{row.dinnersPerWeek}</td>
                      <td className="px-3 py-2.5 mono text-[#CCCCCC] whitespace-nowrap">{row.defaultDays}</td>
                      <td className="px-3 py-2.5 mono whitespace-nowrap">{row.timeslot}</td>
                      <td className="px-3 py-2.5 mono text-green-400">{row.credit}</td>
                      <td className="px-3 py-2.5 mono text-[#CCCCCC]">{row.required}</td>
                      <td className="px-3 py-2.5 mono">
                        <span className={row.paused.startsWith("YES") ? "text-yellow-400" : "text-[#888]"}>{row.paused}</span>
                      </td>
                      <td className="px-3 py-2.5 mono text-[#888]">{row.existingOrder}</td>
                      <td className="px-3 py-2.5 mono text-[#888]">{row.menu}</td>
                      <td className="px-3 py-2.5 mono text-[#CCCCCC] whitespace-nowrap">{row.deliveryDates}</td>
                      <td className="px-3 py-2.5 mono text-[#CCCCCC]">{row.price}</td>
                      <td className="px-3 py-2.5 mono text-[#AAAAAA] whitespace-nowrap">{row.period}</td>
                      <td className="px-3 py-2.5">
                        <span className={`mono px-2 py-0.5 whitespace-nowrap ${rs.bg} ${rs.text}`}>{row.result}</span>
                      </td>
                      <td className="px-3 py-2.5 text-[#888] text-xs max-w-[260px]">{row.reason}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Junior Pricing breakdown */}
        <div className="px-6 pt-2 pb-4">
          <p className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider display mb-1 mt-4">Junior Item Pricing — Orders Created This Run</p>
          <p className="text-xs text-[#666] mb-3">Rule-driven via BR-12. Final price configurable in Business Rules. Values pending business confirmation.</p>
          <div className="border border-[#2A2A2A] bg-[#181818] overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[#2A2A2A]">
                  {["Subscriber", "Item", "Item Type", "Base Price", "Pricing Rule", "Final Price", "Validation"].map(h => (
                    <th key={h} className="px-4 py-2 text-left text-xs font-bold text-[#FFFFFF] uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { sub: "Marcus Tan",  item: "Chicken Rice (Junior)",     type: "Junior Main",  base: "$42.00", rule: "BR-12 · 60% of adult", final: "$25.20", valid: "VALID" },
                  { sub: "Marcus Tan",  item: "Salmon Bowl (Junior)",      type: "Junior Main",  base: "$48.00", rule: "BR-12 · 60% of adult", final: "$28.80", valid: "VALID" },
                  { sub: "Priya Nair",  item: "Grilled Chicken (Junior)",  type: "Junior Main",  base: "$42.00", rule: "BR-12 · 60% of adult", final: "$25.20", valid: "VALID" },
                  { sub: "Raj Nair",    item: "Beef Wrap (Junior)",        type: "Junior Main",  base: "$44.00", rule: "BR-12 · 60% of adult", final: "$26.40", valid: "VALID" },
                  { sub: "Bryan Low",   item: "Teriyaki Bowl (Junior)",    type: "Junior Main",  base: "$42.00", rule: "BR-12 · 60% of adult", final: "$25.20", valid: "VALID" },
                  { sub: "Farid Hassan", item: "Salmon Fillet (Junior)",   type: "Junior Main",  base: "$48.00", rule: "BR-12 · 60% of adult", final: "—",       valid: "FAILED — null" },
                ].map((row, i) => (
                  <tr key={i} className={`border-b border-[#2A2A2A] hover:bg-[#1F1F1F] transition-colors ${i % 2 === 0 ? "" : "bg-[#141414]"}`}>
                    <td className="px-4 py-2.5 font-medium text-[#E8E8E8] whitespace-nowrap">{row.sub}</td>
                    <td className="px-4 py-2.5 text-[#CCCCCC] whitespace-nowrap">{row.item}</td>
                    <td className="px-4 py-2.5 text-[#888]">{row.type}</td>
                    <td className="px-4 py-2.5 mono text-[#AAAAAA]">{row.base}</td>
                    <td className="px-4 py-2.5 mono text-[#F5B300] whitespace-nowrap">{row.rule}</td>
                    <td className="px-4 py-2.5 mono font-bold text-green-400">{row.final}</td>
                    <td className="px-4 py-2.5">
                      <span className={`mono px-2 py-0.5 ${row.valid === "VALID" ? "bg-green-950 text-green-400" : "bg-red-950 text-red-400"}`}>{row.valid}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[10px] text-[#555] mt-2 mono">⚠ BR-12 percentage (currently 60%) is configurable under Business Rules → BR-12. Farid Hassan order was not created due to pricing validation failure.</p>
        </div>

        {/* Timeslot validation */}
        <div className="px-6 pt-2 pb-6">
          <p className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider display mb-3 mt-4">Timeslot Validation</p>
          <div className="border border-[#2A2A2A] bg-[#181818] overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[#2A2A2A]">
                  {["Subscriber", "Customer Slot", "Generated Order Slot", "Status"].map(h => (
                    <th key={h} className="px-4 py-2 text-left text-xs font-bold text-[#FFFFFF] uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeslotRows.map((row, i) => (
                  <tr key={row.name} className={`border-b border-[#2A2A2A] hover:bg-[#1F1F1F] transition-colors ${i % 2 === 0 ? "" : "bg-[#141414]"}`}>
                    <td className="px-4 py-2.5 font-medium text-[#E8E8E8]">{row.name}</td>
                    <td className="px-4 py-2.5 mono text-[#CCCCCC]">{row.customerSlot}</td>
                    <td className="px-4 py-2.5 mono text-[#CCCCCC]">{row.orderSlot}</td>
                    <td className="px-4 py-2.5">
                      <span className={`mono px-2 py-0.5 ${row.status === "MATCHED" ? "bg-green-950 text-green-400" : "bg-red-950 text-red-400"}`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Automation tab ───────────────────────────────────────────────────────────

function AutomationTab() {
  const [showLogic, setShowLogic] = useState(false);
  const [selectedRun, setSelectedRun] = useState<number | null>(null);

  const stats = [
    { label: "Evaluated",             value: "11", color: "text-[#E8E8E8]" },
    { label: "Orders Created",        value: "4",  color: "text-green-400" },
    { label: "Skipped",               value: "4",  color: "text-blue-400" },
    { label: "Insufficient Credit",   value: "1",  color: "text-orange-400" },
    { label: "Paused Subs",           value: "1",  color: "text-yellow-400" },
    { label: "No Default Days",       value: "1",  color: "text-[#888]" },
    { label: "Failed",                value: "3",  color: "text-red-400" },
  ];

  return (
    <div className="space-y-4">
      {/* Engine status card */}
      <div className="border border-[#2A2A2A] bg-[#181818] p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-[#FFFFFF] uppercase tracking-wider display mb-2">Meal Plan Auto-Order Engine</h3>
            <span className="mono text-xs px-2 py-0.5 bg-green-950 text-green-400 border border-green-800">● ACTIVE</span>
          </div>
        </div>
        <div className="flex gap-6 flex-wrap text-xs text-[#888] mb-4">
          <span>Last run: <span className="mono text-[#CCCCCC]">Thu 12 Sep 2024 — 14:55:00 SGT</span></span>
          <span>
            Next run: <span className="mono text-[#F5B300]">Thu 19 Sep 2024 — 14:55:00 SGT</span>
            {" "}<span className="text-[#666]">(Every Thursday 2:55 PM GMT+8)</span>
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 sm:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:grid-cols-7 gap-2">
          {stats.map(stat => (
            <div key={stat.label} className="border border-[#2A2A2A] bg-[#0D0D0D] px-3 py-2.5 text-center">
              <div className={`text-lg font-bold mono ${stat.color}`}>{stat.value}</div>
              <div className="text-[10px] text-[#666] uppercase tracking-wide mt-0.5 leading-tight">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Automation Logic — collapsible */}
      <div className="border border-[#2A2A2A] bg-[#181818]">
        <button
          onClick={() => setShowLogic(v => !v)}
          className="w-full flex items-center justify-between px-5 py-3 text-left hover:bg-[#1F1F1F] transition-colors"
        >
          <span className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider display">Automation Logic — 5-Step Flow</span>
          <span className="mono text-[#888] text-sm">{showLogic ? "▲" : "▼"}</span>
        </button>
        {showLogic && (
          <div className="px-5 pb-5 pt-3 border-t border-[#2A2A2A]">
            <AutoLogicFlow />
          </div>
        )}
      </div>

      {/* Run History */}
      <div>
        <p className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider display mb-3">Run History</p>
        <div className="border border-[#2A2A2A] bg-[#181818] overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2A2A2A]">
                {["Run Date / Time", "Evaluated", "Created", "Skipped", "Failed", "Top-up Sent", "Status", "Action"].map(h => (
                  <th key={h} className="px-4 py-2 text-left text-xs font-bold text-[#FFFFFF] uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {runHistory.map((row, i) => (
                <tr key={row.date} className={`border-b border-[#2A2A2A] hover:bg-[#1F1F1F] transition-colors ${i % 2 === 0 ? "" : "bg-[#141414]"}`}>
                  <td className="px-4 py-2.5 mono text-xs text-[#CCCCCC] whitespace-nowrap">{row.date}</td>
                  <td className="px-4 py-2.5 mono text-center">{row.evaluated}</td>
                  <td className="px-4 py-2.5 mono text-center text-green-400">{row.created}</td>
                  <td className="px-4 py-2.5 mono text-center text-blue-400">{row.skipped}</td>
                  <td className="px-4 py-2.5 mono text-center text-red-400">{row.failed}</td>
                  <td className="px-4 py-2.5 mono text-center text-orange-400">{row.topup}</td>
                  <td className="px-4 py-2.5">
                    <span className={`mono text-xs px-2 py-0.5 ${row.status === "Completed" ? "bg-green-950 text-green-400" : "bg-orange-950 text-orange-400"}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <button
                      onClick={() => setSelectedRun(i)}
                      className="border border-[#3A3A3A] text-[#CCCCCC] text-xs px-3 py-1 mono hover:border-[#F5B300] hover:text-[#F5B300] transition-colors"
                    >
                      View Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedRun !== null && (
        <DetailModal onClose={() => setSelectedRun(null)} />
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

type TabType = CustomerStatus | "Automation";

export default function Subscriptions({ swapAlert, stream, demoMode }: { swapAlert: boolean; stream: BusinessStream; demoMode?: boolean }) {
  const [activeTab, setActiveTab] = useState<TabType>("Active");

  const accent = stream === "meal-plans" ? "#F5B300" : "#E85D04";

  const streamSubs = subscriptions.filter(s =>
    stream === "meal-plans" ? s.planType === "Meal Plan" : s.planType !== "Meal Plan"
  );

  const isAutoTab = activeTab === "Automation";
  const filtered = isAutoTab ? [] : streamSubs.filter(s => s.status === activeTab);

  const counts: Record<CustomerStatus, number> = {
    Active:       streamSubs.filter(s => s.status === "Active").length,
    Paused:       streamSubs.filter(s => s.status === "Paused").length,
    "Renewal Due": streamSubs.filter(s => s.status === "Renewal Due").length,
    Cancelled:    streamSubs.filter(s => s.status === "Cancelled").length,
  };

  const subRows = streamSubs.map(s => ({
    "Sub ID": s.id,
    "Customer": s.customerName,
    "Plan Type": s.planType,
    "Goal": s.goal ?? "",
    "Meals/wk": s.mealsPerWeek,
    "Status": s.status,
    "Plan Week": s.planWeek,
    "Weeks Remaining": s.weeksRemaining,
    "Next Delivery": s.nextDelivery ?? "",
    "Next Billing": s.nextBilling ?? "",
    "Menu Confirmed": s.menuConfirmed ? "Yes" : "No",
  }));

  const allTabs: TabType[] = stream === "meal-plans" ? [...tabs, "Automation"] : [...tabs];

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold">Subscriptions</h2>
        <div className="flex gap-2">
          <button onClick={() => downloadCSV("subscriptions.csv", subRows)} className="border border-[#3A3A3A] text-[#CCCCCC] text-xs px-3 py-2 mono hover:border-[#F5B300] hover:text-[#F5B300] transition-colors">CSV ↓</button>
          <button onClick={() => downloadExcel("subscriptions.xlsx", subRows)} className="border border-[#3A3A3A] text-[#CCCCCC] text-xs px-3 py-2 mono hover:border-[#F5B300] hover:text-[#F5B300] transition-colors">Excel ↓</button>
        </div>
      </div>

      {swapAlert && (
        <div className="border border-yellow-600 bg-yellow-950/40 px-4 py-3 flex items-center gap-3">
          <span className="text-yellow-400 text-lg">⚠</span>
          <span className="text-yellow-200 text-sm font-medium">
            Menu swap cutoff in less than 2 hours — <strong>Thursday 1:59 PM</strong>.
            {" "}{isAutoTab ? 0 : filtered.filter(s => !s.menuConfirmed).length} subscription(s) have unconfirmed menus.
          </span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-[#2A2A2A]">
        {allTabs.map(tab => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 text-sm font-medium mono transition-colors flex items-center gap-2 ${
                isActive ? "border-b-2" : "text-[#888] hover:text-[#E8E8E8]"
              }`}
              style={isActive ? { borderBottomColor: accent, color: accent } : undefined}
            >
              {tab}
              {tab !== "Automation" && (
                <span
                  className="text-xs px-1.5 py-0.5"
                  style={isActive ? { background: accent, color: "black" } : { background: "#2A2A2A", color: "#888" }}
                >
                  {counts[tab as CustomerStatus]}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {isAutoTab ? (
        <AutomationTab />
      ) : (
        <div className="border border-[#2A2A2A] bg-[#181818] overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2A2A2A]">
                {stream === "ready-series"
                  ? (activeTab === "Paused"
                      ? ["Sub ID", "Customer", "SKU", "Term", "Pause Period", "Resume Date", "Payment"].map(h => (
                          <th key={h} className="px-4 py-2 text-left text-xs font-bold text-[#FFFFFF] uppercase tracking-wider font-medium whitespace-nowrap">{h}</th>
                        ))
                      : ["Sub ID", "Customer", "SKU", "Term", "Deliveries", "Renewal Date", "Next Delivery", "Payment", ""].map(h => (
                          <th key={h} className="px-4 py-2 text-left text-xs font-bold text-[#FFFFFF] uppercase tracking-wider font-medium whitespace-nowrap">{h}</th>
                        ))
                    )
                  : (activeTab === "Paused"
                      ? ["Sub ID", "Customer", "Plan", "Goal", "Meals/wk", "Pause Period", "Resume Date", "Menu"].map(h => (
                          <th key={h} className="px-4 py-2 text-left text-xs font-bold text-[#FFFFFF] uppercase tracking-wider font-medium whitespace-nowrap">{h}</th>
                        ))
                      : ["Sub ID", "Customer", "Plan", "Goal", "Meals/wk", "Plan Week", "Wks Left", "Next Delivery", "Next Billing", "Menu", ""].map(h => (
                          <th key={h} className="px-4 py-2 text-left text-xs font-bold text-[#FFFFFF] uppercase tracking-wider font-medium whitespace-nowrap">{h}</th>
                        ))
                    )
                }
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => (
                <tr key={s.id} className={`border-b border-[#2A2A2A] hover:bg-[#1F1F1F] transition-colors ${i % 2 === 0 ? "" : "bg-[#141414]"}`}>
                  <td className="px-4 py-2.5 mono text-xs" style={{ color: accent }}>{s.id}</td>
                  <td className="px-4 py-2.5 font-medium">{s.customerName}</td>

                  {stream === "ready-series" ? (
                    <>
                      <td className="px-4 py-2.5 mono text-xs text-[#888]">{s.sku ?? "—"}</td>
                      <td className="px-4 py-2.5 mono text-xs text-[#E85D04]">{s.term ?? "—"}</td>
                      {activeTab === "Paused" ? (
                        <>
                          <td className="px-4 py-2.5 mono text-xs text-yellow-400">{s.pauseStart} – {s.pauseEnd}</td>
                          <td className="px-4 py-2.5 mono text-xs text-green-400">{s.resumeDate ?? "—"}</td>
                        </>
                      ) : (
                        <>
                          <td className="px-4 py-2.5 mono text-xs text-center">
                            {s.deliveriesCompleted != null && s.deliveriesTotal != null
                              ? <span>{s.deliveriesCompleted} / {s.deliveriesTotal}</span>
                              : "—"}
                          </td>
                          <td className="px-4 py-2.5 mono text-xs text-[#F5B300]">{s.renewalDate ?? "—"}</td>
                          <td className="px-4 py-2.5 mono text-xs">{s.nextDelivery}</td>
                        </>
                      )}
                      <td className="px-4 py-2.5">
                        <span className={`text-xs mono px-2 py-0.5 ${
                          s.paymentStatus === "Paid" ? "bg-green-950 text-green-400"
                          : s.paymentStatus === "Failed" || s.paymentStatus === "Overdue" ? "bg-red-950 text-red-400"
                          : "bg-orange-950 text-orange-400"
                        }`}>
                          {s.paymentStatus ?? "—"}
                        </span>
                      </td>
                      {activeTab !== "Paused" && (
                        <td className="px-4 py-2.5">
                          <button className="text-xs border border-[#2A2A2A] px-2 py-1 text-[#888] hover:border-[#E85D04] hover:text-[#E85D04] transition-colors mono">
                            Manage
                          </button>
                        </td>
                      )}
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-2.5 text-xs text-[#888]">{s.planType}</td>
                      <td className="px-4 py-2.5">
                        {s.goal ? <span className="mono text-xs font-bold text-[#E85D04]">{s.goal}</span> : <span className="text-[#444]">—</span>}
                      </td>
                      <td className="px-4 py-2.5 mono text-center">{s.mealsPerWeek}</td>

                      {activeTab === "Paused" ? (
                        <>
                          <td className="px-4 py-2.5 mono text-xs text-yellow-400">{s.pauseStart} – {s.pauseEnd}</td>
                          <td className="px-4 py-2.5 mono text-xs text-green-400">{s.resumeDate}</td>
                        </>
                      ) : (
                        <>
                          <td className="px-4 py-2.5 mono text-xs">
                            {s.planWeek !== "–" ? (
                              <span className={parseInt(s.planWeek.split(" ")[1]) > parseInt(s.planWeek.split("/")[1]) ? "text-[#E85D04]" : ""}>
                                {s.planWeek}
                              </span>
                            ) : "–"}
                          </td>
                          <td className="px-4 py-2.5 mono text-xs text-center">
                            {s.weeksRemaining === 0 ? (
                              <span className="text-orange-400">EXT</span>
                            ) : s.weeksRemaining}
                          </td>
                          <td className="px-4 py-2.5 mono text-xs">{s.nextDelivery}</td>
                          <td className="px-4 py-2.5 mono text-xs">{s.nextBilling}</td>
                        </>
                      )}

                      <td className="px-4 py-2.5">
                        <span className={`text-xs mono px-2 py-0.5 ${
                          s.menuConfirmed
                            ? "bg-green-950 text-green-400"
                            : "bg-orange-950 text-orange-400"
                        }`}>
                          {s.menuConfirmed ? "Confirmed" : "Pending"}
                        </span>
                      </td>

                      {activeTab !== "Paused" && (
                        <td className="px-4 py-2.5">
                          <button className="text-xs border border-[#2A2A2A] px-2 py-1 text-[#888] hover:border-[#F5B300] hover:text-[#F5B300] transition-colors mono">
                            Manage
                          </button>
                        </td>
                      )}
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="px-4 py-8 text-center text-[#888] text-sm">No {(activeTab as string).toLowerCase()} subscriptions</div>
          )}
        </div>
      )}
    </div>
  );
}
