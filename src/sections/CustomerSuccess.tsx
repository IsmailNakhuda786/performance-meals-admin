import { useState } from "react";

type EscStatus = "open" | "in-progress" | "escalated" | "resolved";
type Priority = "critical" | "high" | "medium" | "low";

interface Escalation {
  id: string;
  customer: string;
  issue: string;
  stream: string;
  priority: Priority;
  status: EscStatus;
  assignee: string;
  created: string;
  updated: string;
  notes: string;
}

const agents = ["Sarah Tan", "Kevin Chua", "Jerome Lim", "Unassigned"];

const escalations: Escalation[] = [
  { id: "ESC-018", customer: "Jason Yeo", issue: "Delivery failed twice — demanded refund for whole box", stream: "Ready Series", priority: "critical", status: "open", assignee: "Unassigned", created: "14 Sep 11:20", updated: "14 Sep 11:20", notes: "Customer called in twice, very frustrated. Refund request pending." },
  { id: "ESC-017", customer: "Aisha Rahman", issue: "Meals received did not match meal plan selections", stream: "Meal Plans", priority: "high", status: "in-progress", assignee: "Sarah Tan", created: "14 Sep 09:00", updated: "14 Sep 10:45", notes: "Kitchen error confirmed. Replacement meal scheduled for Wed." },
  { id: "ESC-016", customer: "Marcus Tan", issue: "Payment declined — card dispute with bank", stream: "Meal Plans", priority: "high", status: "escalated", assignee: "Jerome Lim", created: "13 Sep 15:30", updated: "14 Sep 09:15", notes: "Escalated to Finance. Customer advised 3-5 business days." },
  { id: "ESC-015", customer: "Wei Jie Lim", issue: "Subscription paused but still charged", stream: "Meal Plans", priority: "medium", status: "in-progress", assignee: "Sarah Tan", created: "13 Sep 12:00", updated: "13 Sep 16:00", notes: "Investigating Shopify charge timing vs pause date." },
  { id: "ESC-014", customer: "Serene Tay", issue: "Packaging damaged — ice packs melted, food spoiled", stream: "Ready Series", priority: "critical", status: "resolved", assignee: "Sarah Tan", created: "12 Sep 14:00", updated: "13 Sep 10:00", notes: "Replacement dispatched same day. Customer satisfied. Refund issued for ice packs." },
  { id: "ESC-013", customer: "Raj Nair", issue: "Promo code not applied at checkout", stream: "Ready Series", priority: "low", status: "resolved", assignee: "Kevin Chua", created: "12 Sep 09:00", updated: "12 Sep 11:30", notes: "Manual credit applied via Wallet. Customer confirmed receipt." },
];

const statusStyle: Record<EscStatus, string> = {
  open: "text-red-400 bg-red-950/40",
  "in-progress": "text-yellow-400 bg-yellow-950/30",
  escalated: "text-orange-400 bg-orange-950/30",
  resolved: "text-green-400 bg-green-950/30",
};

const priorityStyle: Record<Priority, string> = {
  critical: "text-red-400",
  high: "text-orange-400",
  medium: "text-yellow-400",
  low: "text-[#888]",
};

export default function CustomerSuccess({ demoMode }: { demoMode?: boolean } = {}) {
  const [selected, setSelected] = useState<Escalation | null>(demoMode ? escalations[0] : null);
  const [statusFilter, setStatusFilter] = useState<EscStatus | "all">("all");

  const filtered = escalations.filter(e => statusFilter === "all" || e.status === statusFilter);

  const kpis = [
    { label: "Open", value: escalations.filter(e => e.status === "open").length, color: "#EF4444" },
    { label: "In Progress", value: escalations.filter(e => e.status === "in-progress").length, color: "#F5B300" },
    { label: "Escalated", value: escalations.filter(e => e.status === "escalated").length, color: "#E85D04" },
    { label: "Resolved Today", value: escalations.filter(e => e.status === "resolved").length, color: "#22C55E" },
  ];

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold">Customer Success Center</h2>
        <button className="bg-[#F5B300] text-black text-xs font-bold px-4 py-2 mono hover:bg-[#C99200] transition-colors">
          + New Escalation
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map(k => (
          <div key={k.label} className="border border-[#2A2A2A] bg-[#181818] p-4">
            <div className="text-xs font-bold text-[#FFFFFF] uppercase tracking-widest mb-2">{k.label}</div>
            <div className="text-3xl font-extrabold mono" style={{ color: k.color }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Status filter */}
      <div className="flex gap-2">
        {(["all", "open", "in-progress", "escalated", "resolved"] as (EscStatus | "all")[]).map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`text-xs px-3 py-1.5 mono border transition-colors capitalize ${statusFilter === s ? "border-[#F5B300] text-[#F5B300] bg-[#F5B300]/10" : "border-[#2A2A2A] text-[#888] hover:text-[#E8E8E8]"}`}>
            {s === "all" ? "All" : s.replace("-", " ")}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Table */}
        <div className="col-span-3 border border-[#2A2A2A] bg-[#181818] overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2A2A2A]">
                {["ID", "Customer", "Issue", "Stream", "Priority", "Status", "Assignee"].map(h => (
                  <th key={h} className="px-4 py-2 text-left text-xs text-[#AAAAAA] uppercase tracking-wider font-medium whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((e, i) => (
                <tr key={e.id} onClick={() => setSelected(e)}
                  className={`border-b border-[#2A2A2A] cursor-pointer transition-colors ${selected?.id === e.id ? "bg-[#1F1F1F]" : i % 2 === 0 ? "hover:bg-[#1A1A1A]" : "bg-[#141414] hover:bg-[#1A1A1A]"}`}>
                  <td className="px-4 py-2.5 mono text-xs text-[#F5B300]">{e.id}</td>
                  <td className="px-4 py-2.5 font-medium">{e.customer}</td>
                  <td className="px-4 py-2.5 text-xs text-[#888] max-w-[160px] truncate">{e.issue}</td>
                  <td className="px-4 py-2.5 text-xs">
                    <span className="border border-[#2A2A2A] px-1.5 py-0.5 mono" style={{ color: e.stream === "Meal Plans" ? "#F5B300" : "#E85D04" }}>{e.stream}</span>
                  </td>
                  <td className={`px-4 py-2.5 text-xs font-bold mono capitalize ${priorityStyle[e.priority]}`}>{e.priority}</td>
                  <td className="px-4 py-2.5">
                    <span className={`text-xs px-2 py-0.5 font-bold mono capitalize ${statusStyle[e.status]}`}>{e.status.replace("-", " ")}</span>
                  </td>
                  <td className="px-4 py-2.5 text-xs text-[#888]">{e.assignee}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Detail panel */}
        <div className="col-span-2 border border-[#2A2A2A] bg-[#181818]">
          {!selected ? (
            <div className="flex items-center justify-center h-full text-[#555] text-sm">Select an escalation to view details</div>
          ) : (
            <div className="flex flex-col h-full">
              <div className="px-4 py-3 border-b border-[#2A2A2A] flex items-center justify-between">
                <span className="font-bold text-[#F5B300] mono">{selected.id}</span>
                <span className={`text-xs px-2 py-0.5 font-bold mono capitalize ${statusStyle[selected.status]}`}>{selected.status.replace("-", " ")}</span>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div>
                  <div className="text-xs text-[#AAAAAA] uppercase tracking-wider mb-1">Customer</div>
                  <div className="font-semibold">{selected.customer}</div>
                </div>
                <div>
                  <div className="text-xs text-[#AAAAAA] uppercase tracking-wider mb-1">Issue</div>
                  <div className="text-sm text-[#E8E8E8]">{selected.issue}</div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs text-[#AAAAAA] uppercase tracking-wider mb-1">Stream</div>
                    <div className="text-sm" style={{ color: selected.stream === "Meal Plans" ? "#F5B300" : "#E85D04" }}>{selected.stream}</div>
                  </div>
                  <div>
                    <div className="text-xs text-[#AAAAAA] uppercase tracking-wider mb-1">Priority</div>
                    <div className={`text-sm font-bold mono capitalize ${priorityStyle[selected.priority]}`}>{selected.priority}</div>
                  </div>
                  <div>
                    <div className="text-xs text-[#AAAAAA] uppercase tracking-wider mb-1">Created</div>
                    <div className="mono text-xs text-[#888]">{selected.created}</div>
                  </div>
                  <div>
                    <div className="text-xs text-[#AAAAAA] uppercase tracking-wider mb-1">Last Updated</div>
                    <div className="mono text-xs text-[#888]">{selected.updated}</div>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-[#AAAAAA] uppercase tracking-wider mb-1">Notes</div>
                  <div className="text-xs text-[#888] bg-[#0F0F0F] border border-[#2A2A2A] p-2">{selected.notes}</div>
                </div>
                <div>
                  <div className="text-xs text-[#AAAAAA] uppercase tracking-wider mb-1">Assign To</div>
                  <select defaultValue={selected.assignee} className="w-full bg-[#0F0F0F] border border-[#2A2A2A] text-[#E8E8E8] text-sm px-3 py-2 focus:outline-none focus:border-[#F5B300]">
                    {agents.map(a => <option key={a}>{a}</option>)}
                  </select>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button className="flex-1 bg-[#F5B300] text-black text-xs font-bold py-2 mono hover:bg-[#C99200] transition-colors">Resolve</button>
                  <button className="flex-1 border border-[#E85D04]/40 text-[#E85D04] text-xs py-2 mono hover:bg-[#E85D04]/10 transition-colors">Escalate</button>
                  <button className="flex-1 border border-[#2A2A2A] text-[#888] text-xs py-2 mono hover:text-[#E8E8E8] transition-colors">Add Note</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
