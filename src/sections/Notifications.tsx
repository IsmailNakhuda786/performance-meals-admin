import { useState, Fragment } from "react";
import PillToggle from "../components/PillToggle";

type Channel = "Email" | "WhatsApp" | "Admin";
type AlertType = "failed-payment" | "inventory" | "delivery-failure" | "menu-reminder" | "new-subscriber" | "refund-request" | "system";

interface Notification {
  id: string;
  type: AlertType;
  message: string;
  customer?: string;
  channel: Channel;
  ts: string;
  read: boolean;
  severity: "critical" | "warning" | "info";
}

const notifications: Notification[] = [
  { id: "N-041", type: "failed-payment", message: "Payment failed for Aisha Rahman — $420.00 overdue 3 days", customer: "Aisha Rahman", channel: "Email", ts: "14 Sep 11:30", read: false, severity: "critical" },
  { id: "N-040", type: "inventory", message: "Jasmine Rice stock at 2.1kg — below 5kg threshold", channel: "Admin", ts: "14 Sep 10:22", read: false, severity: "critical" },
  { id: "N-039", type: "delivery-failure", message: "ORD-2403 delivery failed — no one home. Reattempt scheduled.", customer: "Wei Jie Lim", channel: "WhatsApp", ts: "14 Sep 09:45", read: false, severity: "warning" },
  { id: "N-038", type: "menu-reminder", message: "Meal swap cutoff in 2 hours — 3 customers have not selected meals", channel: "Admin", ts: "14 Sep 09:00", read: true, severity: "warning" },
  { id: "N-037", type: "failed-payment", message: "Payment failed for Marcus Tan — $210.00 pending retry", customer: "Marcus Tan", channel: "Email", ts: "13 Sep 18:15", read: true, severity: "critical" },
  { id: "N-036", type: "inventory", message: "Chicken Breast low — 3.4kg remaining (threshold 8kg)", channel: "Admin", ts: "13 Sep 16:00", read: true, severity: "warning" },
  { id: "N-035", type: "delivery-failure", message: "ORD-2407 failed — wrong address provided by customer", customer: "Jason Yeo", channel: "WhatsApp", ts: "13 Sep 14:30", read: true, severity: "warning" },
  { id: "N-034", type: "menu-reminder", message: "Weekly meal selection reminder sent to 5 MP subscribers", channel: "Email", ts: "13 Sep 09:00", read: true, severity: "info" },
  { id: "N-033", type: "system", message: "Kitchen Queue sync completed — 12 production items loaded", channel: "Admin", ts: "13 Sep 07:00", read: true, severity: "info" },
  { id: "N-032", type: "new-subscriber", message: "New subscriber: Raj Nair — 12-Week BUILD Plan · $630.00", customer: "Raj Nair", channel: "Admin", ts: "13 Sep 12:45", read: false, severity: "info" },
  { id: "N-031", type: "new-subscriber", message: "New Box Sub: Priya K — 10-Meal Box · $144.00", customer: "Priya K", channel: "Email", ts: "13 Sep 11:10", read: true, severity: "info" },
  { id: "N-030", type: "refund-request", message: "Refund requested: Jason Yeo — ORD-2407 · $68.00 · Delivery failure", customer: "Jason Yeo", channel: "Admin", ts: "14 Sep 11:25", read: false, severity: "warning" },
  { id: "N-029", type: "refund-request", message: "Refund requested: Marcus Tan — SUB-001 · $210.00 · Cancellation dispute", customer: "Marcus Tan", channel: "Admin", ts: "13 Sep 15:50", read: true, severity: "warning" },
];

const severityStyle: Record<string, string> = {
  critical: "text-red-400 bg-red-950/40 border-red-800/30",
  warning: "text-yellow-400 bg-yellow-950/30 border-yellow-800/30",
  info: "text-[#888] bg-[#181818] border-[#2A2A2A]",
};

const typeLabels: Record<AlertType, string> = {
  "failed-payment": "Failed Payment",
  "inventory": "Inventory",
  "delivery-failure": "Delivery Failure",
  "menu-reminder": "Menu Reminder",
  "new-subscriber": "New Subscriber",
  "refund-request": "Refund Request",
  "system": "System",
};

const channelIcon: Record<Channel, string> = {
  Email: "✉",
  WhatsApp: "◎",
  Admin: "⚙",
};

const typeFilters: (AlertType | "all")[] = ["all", "failed-payment", "refund-request", "new-subscriber", "inventory", "delivery-failure", "menu-reminder", "system"];

export default function Notifications({ demoMode }: { demoMode?: boolean } = {}) {
  const [typeFilter, setTypeFilter] = useState<AlertType | "all">("all");
  const [channelFilter, setChannelFilter] = useState<Channel | "all">("all");
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [items, setItems] = useState(notifications);

  const filtered = items.filter(n => {
    if (typeFilter !== "all" && n.type !== typeFilter) return false;
    if (channelFilter !== "all" && n.channel !== channelFilter) return false;
    if (unreadOnly && n.read) return false;
    return true;
  });

  const unreadCount = items.filter(n => !n.read).length;

  const markAllRead = () => setItems(prev => prev.map(n => ({ ...n, read: true })));
  const dismiss = (id: string) => setItems(prev => prev.filter(n => n.id !== id));

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-extrabold">Notification Center</h2>
          {unreadCount > 0 && (
            <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 mono">{unreadCount} unread</span>
          )}
        </div>
        <div className="flex gap-2">
          <button onClick={markAllRead} className="border border-[#3A3A3A] text-[#CCCCCC] text-xs px-4 py-2 mono hover:border-[#F5B300] hover:text-[#F5B300] transition-colors">
            Mark All Read
          </button>
          <button className="border border-[#3A3A3A] text-[#CCCCCC] text-xs px-4 py-2 mono hover:border-[#F5B300] hover:text-[#F5B300] transition-colors">
            Configure Alerts
          </button>
        </div>
      </div>

      {/* Channel stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {(["Email", "WhatsApp", "Admin"] as Channel[]).map(ch => {
          const count = items.filter(n => n.channel === ch && !n.read).length;
          const total = items.filter(n => n.channel === ch).length;
          return (
            <div key={ch} className="border border-[#2A2A2A] bg-[#181818] p-4 flex items-center gap-4">
              <div className="text-2xl text-[#888]">{channelIcon[ch]}</div>
              <div>
                <div className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider">{ch}</div>
                <div className="font-extrabold mono text-xl">{total}</div>
                {count > 0 && <div className="text-xs text-red-400 mono">{count} unread</div>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap items-center">
        <div className="flex gap-1 flex-wrap">
          {typeFilters.map(t => (
            <button key={t} onClick={() => setTypeFilter(t)}
              className={`text-xs px-3 py-1.5 mono border transition-colors ${typeFilter === t ? "border-[#F5B300] text-[#F5B300] bg-[#F5B300]/10" : "border-[#2A2A2A] text-[#888] hover:text-[#E8E8E8]"}`}>
              {t === "all" ? "All" : typeLabels[t]}
            </button>
          ))}
        </div>
        <div className="ml-auto flex gap-3 items-center">
          <select value={channelFilter} onChange={e => setChannelFilter(e.target.value as Channel | "all")}
            className="bg-[#181818] border border-[#2A2A2A] text-[#E8E8E8] text-xs px-3 py-1.5 mono focus:outline-none focus:border-[#F5B300]">
            <option value="all">All Channels</option>
            <option>Email</option>
            <option>WhatsApp</option>
            <option>Admin</option>
          </select>
          <label className="flex items-center gap-2 text-xs text-[#AAAAAA] cursor-pointer select-none">
            <PillToggle checked={unreadOnly} onChange={setUnreadOnly} />
            Unread only
          </label>
        </div>
      </div>

      {/* Notification list */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="border border-[#2A2A2A] bg-[#181818] p-8 text-center text-[#888] text-sm">No notifications match your filters.</div>
        )}
        {filtered.map(n => (
          <div key={n.id} className={`border px-4 py-3 flex items-start gap-4 transition-all ${n.read ? "opacity-60" : ""} ${severityStyle[n.severity]}`}>
            {!n.read && <div className="w-2 h-2 bg-red-500 mt-1 flex-shrink-0" />}
            {n.read && <div className="w-2 h-2 mt-1 flex-shrink-0" />}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xs font-bold mono uppercase">{typeLabels[n.type]}</span>
                <span className="text-xs text-[#555] mono">{n.id}</span>
                {n.customer && <span className="text-xs text-[#888]">— {n.customer}</span>}
              </div>
              <div className="text-sm">{n.message}</div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0 text-xs mono text-[#555]">
              <span>{channelIcon[n.channel]} {n.channel}</span>
              <span>{n.ts}</span>
              <button onClick={() => dismiss(n.id)} className="text-[#555] hover:text-red-400 transition-colors">×</button>
            </div>
          </div>
        ))}
      </div>

      {/* Alert config panel */}
      <div className="border border-[#2A2A2A] bg-[#181818]">
        <div className="px-4 py-3 border-b border-[#2A2A2A]">
          <span className="text-sm font-semibold">Alert Configuration</span>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-[#2A2A2A]">
            <div className="bg-[#181818] px-4 py-2 text-xs text-[#AAAAAA] uppercase tracking-wider font-medium">Alert Type</div>
            {(["Email", "WhatsApp", "Admin"] as Channel[]).map(ch => (
              <div key={ch} className="bg-[#181818] px-4 py-2 text-xs text-[#AAAAAA] uppercase tracking-wider font-medium text-center">{ch}</div>
            ))}
            {Object.entries(typeLabels).map(([key, label]) => (
              <Fragment key={key}>
                <div className="bg-[#181818] px-4 py-2 text-sm">{label}</div>
                {(["Email", "WhatsApp", "Admin"] as Channel[]).map(ch => (
                  <div key={`${key}-${ch}`} className="bg-[#181818] px-4 py-2 flex justify-center">
                    <input type="checkbox" defaultChecked={key !== "system" || ch === "Admin"} className="w-3 h-3 accent-yellow-500 cursor-pointer" />
                  </div>
                ))}
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
