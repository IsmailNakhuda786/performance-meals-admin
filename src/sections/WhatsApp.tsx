import { useState } from "react";
import PillToggle from "../components/PillToggle";

type MsgStatus = "delivered" | "read" | "failed" | "pending";
type MsgType = "order-notification" | "delivery-update" | "subscription-reminder" | "payment-reminder" | "support";

interface Message {
  id: string;
  customer: string;
  phone: string;
  type: MsgType;
  content: string;
  stream: string;
  status: MsgStatus;
  ts: string;
}

const messages: Message[] = [
  { id: "WA-182", customer: "Marcus Tan", phone: "+65 9123 4567", type: "order-notification", content: "Hi Marcus! Your Meal Plan order for Mon 16 Sep is confirmed. 5 meals will be delivered between 7–10am. Track here: [link]", stream: "Meal Plans", status: "read", ts: "14 Sep 10:30" },
  { id: "WA-181", customer: "Aisha Rahman", phone: "+65 8234 5678", type: "delivery-update", content: "Your delivery is on the way! Ahmad Farid is your rider today. Expected arrival: 8:30–9:00am.", stream: "Meal Plans", status: "delivered", ts: "14 Sep 08:15" },
  { id: "WA-180", customer: "Wei Jie Lim", phone: "+65 9345 6789", type: "delivery-update", content: "We tried to deliver your order but couldn't reach you. Please contact us to reschedule. Ref: ORD-2403", stream: "Meal Plans", status: "read", ts: "14 Sep 09:50" },
  { id: "WA-179", customer: "Serene Tay", phone: "+65 9456 7890", type: "order-notification", content: "Your Ready-to-Go order (3 meals) is confirmed! Pickup/delivery scheduled for today. Ref: ORD-2404", stream: "Ready Series", status: "read", ts: "14 Sep 07:00" },
  { id: "WA-178", customer: "Jason Yeo", phone: "+65 8567 8901", type: "payment-reminder", content: "Reminder: Your Meal Plan payment of $210.00 is due today. Pay here: [link] or call us to arrange.", stream: "Meal Plans", status: "failed", ts: "13 Sep 09:00" },
  { id: "WA-177", customer: "Raj Nair", phone: "+65 9678 9012", type: "subscription-reminder", content: "Hi Raj! Your 12-Week BUILD Plan renews on Monday 16 Sep. Your meals this week: Chicken Rice, Salmon Bowl, Beef Bulgogi, Tofu Stir Fry, Chicken Wrap.", stream: "Meal Plans", status: "delivered", ts: "13 Sep 18:00" },
  { id: "WA-176", customer: "Priya K", phone: "+65 8789 0123", type: "order-notification", content: "Your 10-Meal Box Sub has been confirmed! First delivery: Mon 16 Sep 7–10am. Welcome to Ready Series!", stream: "Ready Series", status: "read", ts: "13 Sep 12:50" },
  { id: "WA-175", customer: "Marcus Tan", phone: "+65 9123 4567", type: "support", content: "Hi Jerome here from Performance Meals Support. Your refund of $30.00 has been approved and added to your wallet. It'll reflect within 24h.", stream: "Meal Plans", status: "read", ts: "13 Sep 11:00" },
];

const templates = [
  { id: "T-01", name: "Order Confirmed", type: "order-notification" as MsgType, stream: "both", preview: "Hi [Name]! Your [Stream] order is confirmed. [Qty] meals will be delivered [Date] between 7–10am." },
  { id: "T-02", name: "Delivery On The Way", type: "delivery-update" as MsgType, stream: "both", preview: "Your delivery is on the way! [Rider] is your rider. Expected arrival: [Time]." },
  { id: "T-03", name: "Delivery Failed", type: "delivery-update" as MsgType, stream: "both", preview: "We tried to deliver your order but couldn't reach you. Contact us to reschedule. Ref: [OrderID]" },
  { id: "T-04", name: "Payment Due", type: "payment-reminder" as MsgType, stream: "meal-plans", preview: "Reminder: Your Meal Plan payment of $[Amount] is due [Date]. Pay here: [Link]" },
  { id: "T-05", name: "Payment Failed", type: "payment-reminder" as MsgType, stream: "meal-plans", preview: "We couldn't process your payment of $[Amount]. Please update your payment method: [Link]" },
  { id: "T-06", name: "Weekly Meal Reminder", type: "subscription-reminder" as MsgType, stream: "meal-plans", preview: "Hi [Name]! Your [Plan] renews [Date]. This week's meals: [MealList]" },
  { id: "T-07", name: "Swap Deadline Reminder", type: "subscription-reminder" as MsgType, stream: "meal-plans", preview: "Reminder: Meal swap window closes Thursday 12pm. Select your meals now: [Link]" },
  { id: "T-08", name: "Box Sub Welcome", type: "subscription-reminder" as MsgType, stream: "ready-series", preview: "Welcome to Ready Series! Your 10-Meal Box first delivery is [Date]. We're excited to have you!" },
];

const statusStyle: Record<MsgStatus, string> = {
  delivered: "text-blue-400",
  read: "text-green-400",
  failed: "text-red-400",
  pending: "text-[#888]",
};

const statusIcon: Record<MsgStatus, string> = {
  delivered: "✓✓",
  read: "✓✓",
  failed: "✕",
  pending: "⏳",
};

const typeLabels: Record<MsgType, string> = {
  "order-notification": "Order",
  "delivery-update": "Delivery",
  "subscription-reminder": "Subscription",
  "payment-reminder": "Payment",
  "support": "Support",
};

type Tab = "inbox" | "templates" | "broadcast" | "settings";

export default function WhatsApp({ demoMode }: { demoMode?: boolean } = {}) {
  const [tab, setTab] = useState<Tab>("inbox");
  const [selected, setSelected] = useState<Message | null>(null);
  const [typeFilter, setTypeFilter] = useState<MsgType | "all">("all");
  const [streamFilter, setStreamFilter] = useState<"all" | "Meal Plans" | "Ready Series">("all");
  const [composeOpen, setComposeOpen] = useState(demoMode ?? false);
  const [autoRules, setAutoRules] = useState([true, true, true, true, true, true, true]);

  const filtered = messages.filter(m => {
    if (typeFilter !== "all" && m.type !== typeFilter) return false;
    if (streamFilter !== "all" && m.stream !== streamFilter) return false;
    return true;
  });

  const failedCount = messages.filter(m => m.status === "failed").length;

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-600 flex items-center justify-center text-white font-bold text-sm">W</div>
          <div>
            <h2 className="text-xl font-extrabold">WhatsApp Communication Center</h2>
            <div className="text-xs text-[#888] mono mt-0.5">Operational messaging — all channels separated by business unit</div>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setComposeOpen(true)}
            className="bg-green-700 text-white text-xs font-bold px-4 py-2 mono hover:bg-green-600 transition-colors">
            + Send Message
          </button>
          <button className="border border-[#3A3A3A] text-[#CCCCCC] text-xs px-4 py-2 mono hover:border-[#F5B300] hover:text-[#F5B300] transition-colors">Export CSV</button>
        </div>
      </div>

      {failedCount > 0 && (
        <div className="border border-red-800/30 bg-red-950/10 px-4 py-2.5 text-xs text-red-300 mono">
          ⚠ {failedCount} message{failedCount > 1 ? "s" : ""} failed to deliver. Check recipient numbers or WhatsApp Business API status.
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          { label: "Sent Today", value: messages.filter(m => m.ts.startsWith("14 Sep")).length, color: "#E8E8E8" },
          { label: "Delivered", value: messages.filter(m => m.status === "delivered").length, color: "#888" },
          { label: "Read", value: messages.filter(m => m.status === "read").length, color: "#22C55E" },
          { label: "Failed", value: failedCount, color: failedCount > 0 ? "#EF4444" : "#888" },
          { label: "Templates", value: templates.length, color: "#F5B300" },
        ].map(k => (
          <div key={k.label} className="border border-[#2A2A2A] bg-[#181818] p-4">
            <div className="text-xs font-bold text-[#FFFFFF] uppercase tracking-widest mb-2">{k.label}</div>
            <div className="text-2xl font-extrabold mono" style={{ color: k.color }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#2A2A2A]">
        {([["inbox", "Message Log"], ["templates", "Templates"], ["broadcast", "Broadcast"], ["settings", "API Settings"]] as [Tab, string][]).map(([t, label]) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-3 text-sm font-medium mono transition-colors ${tab === t ? "border-b-2 border-[#F5B300] text-[#F5B300]" : "text-[#888] hover:text-[#E8E8E8]"}`}>
            {label}
          </button>
        ))}
      </div>

      {tab === "inbox" && (
        <div className="space-y-3">
          <div className="flex gap-2 flex-wrap items-center">
            <div className="flex border border-[#2A2A2A]">
              {(["all", "Meal Plans", "Ready Series"] as ("all" | "Meal Plans" | "Ready Series")[]).map(s => (
                <button key={s} onClick={() => setStreamFilter(s)}
                  className={`px-3 py-1.5 text-xs font-bold mono transition-colors ${streamFilter === s
                    ? s === "Meal Plans" ? "bg-[#F5B300] text-black" : s === "Ready Series" ? "bg-[#E85D04] text-black" : "bg-[#2A2A2A] text-[#E8E8E8]"
                    : "text-[#666] hover:text-[#E8E8E8] hover:bg-[#181818]"}`}>
                  {s === "all" ? "All" : s}
                </button>
              ))}
            </div>
            <div className="flex gap-1 flex-wrap">
              {(["all", "order-notification", "delivery-update", "subscription-reminder", "payment-reminder", "support"] as (MsgType | "all")[]).map(t => (
                <button key={t} onClick={() => setTypeFilter(t)}
                  className={`text-xs px-3 py-1 mono border transition-colors ${typeFilter === t ? "border-[#F5B300] text-[#F5B300] bg-[#F5B300]/10" : "border-[#2A2A2A] text-[#888] hover:text-[#E8E8E8]"}`}>
                  {t === "all" ? "All" : typeLabels[t]}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Message list */}
            <div className="col-span-3 space-y-1.5">
              {filtered.map(m => (
                <div key={m.id} onClick={() => setSelected(m)}
                  className={`border px-4 py-3 cursor-pointer transition-colors ${selected?.id === m.id ? "border-[#F5B300]/40 bg-[#1A1A1A]" : "border-[#2A2A2A] bg-[#181818] hover:bg-[#1A1A1A]"}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <span className="font-semibold text-sm">{m.customer}</span>
                        <span className="text-xs mono text-[#555]">{m.phone}</span>
                        <span className="text-xs px-1.5 py-0.5 border border-[#2A2A2A] mono text-[#888]">{typeLabels[m.type]}</span>
                        <span className="text-xs mono font-bold" style={{ color: m.stream === "Meal Plans" ? "#F5B300" : "#E85D04" }}>{m.stream}</span>
                      </div>
                      <div className="text-xs text-[#888] truncate">{m.content}</div>
                    </div>
                    <div className="text-right flex-shrink-0 space-y-1">
                      <div className="mono text-xs text-[#555]">{m.ts}</div>
                      <div className={`text-xs mono font-bold ${statusStyle[m.status]}`}>{statusIcon[m.status]} {m.status}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message detail */}
            <div className="col-span-2 border border-[#2A2A2A] bg-[#181818]">
              {!selected ? (
                <div className="flex items-center justify-center h-full text-[#555] text-sm p-4">Select a message to view</div>
              ) : (
                <div className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">{selected.customer}</div>
                    <span className={`text-xs mono font-bold ${statusStyle[selected.status]}`}>{statusIcon[selected.status]} {selected.status}</span>
                  </div>
                  <div className="mono text-xs text-[#888]">{selected.phone}</div>
                  <div className="flex gap-2">
                    <span className="text-xs px-2 py-0.5 border border-[#2A2A2A] mono text-[#888]">{typeLabels[selected.type]}</span>
                    <span className="text-xs mono font-bold" style={{ color: selected.stream === "Meal Plans" ? "#F5B300" : "#E85D04" }}>{selected.stream}</span>
                  </div>
                  <div className="bg-green-950/20 border border-green-800/30 p-3 text-sm text-[#E8E8E8]">{selected.content}</div>
                  <div className="mono text-xs text-[#555]">{selected.ts} · ID: {selected.id}</div>
                  {selected.status === "failed" && (
                    <button className="w-full border border-[#F5B300]/40 text-[#F5B300] text-xs py-2 mono hover:bg-[#F5B300]/10 transition-colors">Retry Send</button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {tab === "templates" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#888]">{templates.length} templates configured</span>
            <button className="text-xs border border-[#F5B300]/40 text-[#F5B300] px-3 py-1.5 mono hover:bg-[#F5B300]/10 transition-colors">+ New Template</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {templates.map(t => (
              <div key={t.id} className="border border-[#2A2A2A] bg-[#181818] p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-semibold text-sm">{t.name}</div>
                    <div className="flex gap-2 mt-1">
                      <span className="text-xs border border-[#2A2A2A] px-1.5 py-0.5 mono text-[#888]">{typeLabels[t.type]}</span>
                      <span className="text-xs mono font-bold" style={{ color: t.stream === "meal-plans" ? "#F5B300" : t.stream === "ready-series" ? "#E85D04" : "#888" }}>
                        {t.stream === "both" ? "Both Units" : t.stream === "meal-plans" ? "Meal Plans" : "Ready Series"}
                      </span>
                    </div>
                  </div>
                  <span className="mono text-xs text-[#555]">{t.id}</span>
                </div>
                <div className="bg-[#0F0F0F] border border-[#2A2A2A] p-2 text-xs text-[#888] mono">{t.preview}</div>
                <div className="flex gap-2 mt-3">
                  <button className="text-xs border border-[#2A2A2A] px-2 py-1 text-[#888] hover:border-[#F5B300] hover:text-[#F5B300] mono transition-colors flex-1">Edit</button>
                  <button className="text-xs border border-green-800/40 px-2 py-1 text-green-400 hover:bg-green-950 mono transition-colors flex-1">Send Now</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "broadcast" && (
        <div className="space-y-4">
          <div className="border border-yellow-800/30 bg-yellow-950/10 px-4 py-2.5 text-xs text-yellow-300 mono">
            ⚠ Broadcasts send to all subscribers matching the selected criteria. Preview carefully before sending.
          </div>
          <div className="border border-[#2A2A2A] bg-[#181818] p-5 space-y-4">
            <div className="text-sm font-semibold">New Broadcast</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider block mb-1">Business Unit</label>
                <select className="w-full bg-[#0F0F0F] border border-[#2A2A2A] text-[#E8E8E8] text-sm px-3 py-2 focus:outline-none focus:border-[#F5B300]">
                  <option>Meal Plans — All Subscribers</option>
                  <option>Ready Series — Box Subscribers</option>
                  <option>Ready Series — Ready-to-Go Customers</option>
                  <option>Both Units (Super Admin only)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider block mb-1">Template</label>
                <select className="w-full bg-[#0F0F0F] border border-[#2A2A2A] text-[#E8E8E8] text-sm px-3 py-2 focus:outline-none focus:border-[#F5B300]">
                  {templates.map(t => <option key={t.id}>{t.name}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider block mb-1">Message Preview</label>
              <div className="bg-green-950/20 border border-green-800/30 p-3 text-sm text-[#888] mono min-h-[80px]">
                {templates[0].preview}
              </div>
            </div>
            <div className="flex gap-2">
              <button className="bg-green-700 text-white text-xs font-bold px-6 py-2.5 mono hover:bg-green-600 transition-colors">Send Broadcast</button>
              <button className="border border-[#2A2A2A] text-[#888] text-xs px-6 py-2.5 mono hover:text-[#E8E8E8] transition-colors">Schedule</button>
            </div>
          </div>

          <div className="border border-[#2A2A2A] bg-[#181818]">
            <div className="px-4 py-3 border-b border-[#2A2A2A]"><span className="text-sm font-semibold">Recent Broadcasts</span></div>
            <div className="divide-y divide-[#1A1A1A]">
              {[
                { name: "Weekly Meal Reminder — Wk 38", stream: "Meal Plans", sent: 5, delivered: 5, read: 4, ts: "Mon 9 Sep 08:00" },
                { name: "Delivery Confirmation — Mon Run", stream: "Both", sent: 10, delivered: 9, read: 8, ts: "Mon 9 Sep 06:30" },
                { name: "Box Sub Welcome — Priya K", stream: "Ready Series", sent: 1, delivered: 1, read: 1, ts: "13 Sep 12:55" },
              ].map((b, i) => (
                <div key={i} className="px-4 py-3 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">{b.name}</div>
                    <div className="mono text-xs text-[#555] mt-0.5">{b.ts}</div>
                  </div>
                  <div className="flex items-center gap-4 text-xs mono">
                    <span className="text-[#888]">{b.sent} sent</span>
                    <span className="text-blue-400">{b.delivered} delivered</span>
                    <span className="text-green-400">{b.read} read</span>
                    <span className="font-bold" style={{ color: b.stream === "Meal Plans" ? "#F5B300" : b.stream === "Ready Series" ? "#E85D04" : "#888" }}>{b.stream}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "settings" && (
        <div className="space-y-4">
          <div className="border border-[#2A2A2A] bg-[#181818] p-5 space-y-4">
            <div className="text-sm font-semibold">WhatsApp Business API Configuration</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Business Account ID", value: "WA-PMSG-001" },
                { label: "Phone Number", value: "+65 3105 XXXX" },
                { label: "API Provider", value: "360dialog" },
                { label: "Webhook Status", value: "Active ✓" },
              ].map(f => (
                <div key={f.label} className="bg-[#0F0F0F] border border-[#2A2A2A] px-4 py-3">
                  <div className="text-xs text-[#AAAAAA] uppercase tracking-wider">{f.label}</div>
                  <div className="mono text-sm mt-1 text-[#F5B300]">{f.value}</div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button className="border border-[#3A3A3A] text-[#CCCCCC] text-xs px-4 py-2 mono hover:border-[#F5B300] hover:text-[#F5B300] transition-colors">Edit Config</button>
              <button className="border border-green-800/40 text-green-400 text-xs px-4 py-2 mono hover:bg-green-950 transition-colors">Test Connection</button>
            </div>
          </div>

          <div className="border border-[#2A2A2A] bg-[#181818] p-5 space-y-3">
            <div className="text-sm font-semibold">Auto-Send Rules</div>
            {[
              { trigger: "Order confirmed", template: "Order Confirmed" },
              { trigger: "Rider dispatched", template: "Delivery On The Way" },
              { trigger: "Delivery failed", template: "Delivery Failed" },
              { trigger: "Payment due (T-1 day)", template: "Payment Due" },
              { trigger: "Payment failed", template: "Payment Failed" },
              { trigger: "Swap window opens", template: "Weekly Meal Reminder" },
              { trigger: "New Box Sub signup", template: "Box Sub Welcome" },
            ].map((r, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-[#1A1A1A]">
                <div>
                  <div className="text-sm">{r.trigger}</div>
                  <div className="text-xs text-[#888] mono mt-0.5">Template: {r.template}</div>
                </div>
                <PillToggle checked={autoRules[i]} onChange={v => setAutoRules(prev => prev.map((x, j) => j === i ? v : x))} accent="green" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Compose modal */}
      {composeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="bg-[#181818] border border-[#2A2A2A] w-full max-w-[480px]">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#2A2A2A]">
              <span className="font-bold text-green-400 mono">Send WhatsApp Message</span>
              <button onClick={() => setComposeOpen(false)} className="text-[#888] hover:text-[#E8E8E8] text-xl">×</button>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <label className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider block mb-1">Recipient</label>
                <input type="text" placeholder="Customer name or phone number…"
                  className="w-full bg-[#0F0F0F] border border-[#2A2A2A] text-[#E8E8E8] text-sm px-3 py-2 focus:outline-none focus:border-green-600 placeholder:text-[#444]" />
              </div>
              <div>
                <label className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider block mb-1">Template</label>
                <select className="w-full bg-[#0F0F0F] border border-[#2A2A2A] text-[#E8E8E8] text-sm px-3 py-2 focus:outline-none focus:border-green-600">
                  <option value="">— Select template or write custom —</option>
                  {templates.map(t => <option key={t.id}>{t.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider block mb-1">Message</label>
                <textarea rows={4} placeholder="Type your message…"
                  className="w-full bg-[#0F0F0F] border border-[#2A2A2A] text-[#E8E8E8] text-sm px-3 py-2 focus:outline-none focus:border-green-600 placeholder:text-[#444] resize-none" />
              </div>
              <div className="text-xs text-[#555] mono">All outbound messages are logged in Audit Logs.</div>
              <button onClick={() => setComposeOpen(false)}
                className="w-full bg-green-700 text-white py-2 text-sm font-bold mono hover:bg-green-600 transition-colors">
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
