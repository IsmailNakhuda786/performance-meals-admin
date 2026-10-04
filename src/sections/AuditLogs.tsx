import { useState } from "react";

interface LogEntry {
  id: string;
  user: string;
  dept: string;
  action: string;
  module: string;
  ip: string;
  device: string;
  ts: string;
  type: string;
  prevValue?: string;
  newValue?: string;
  reason?: string;
}

const logs: LogEntry[] = [
  { id: "LOG-0899", user: "Jerome Lim", dept: "Admin", action: "Automation run completed — 5 orders created, 2 skipped, 1 credit notification", module: "Subscriptions", ip: "192.168.1.12", device: "System / Automation", ts: "19 Sep 2024 14:55:01", type: "automation", prevValue: "—", newValue: "5 orders created, 2 skipped, 1 credit notification sent", reason: "Scheduled weekly automation run" },
  { id: "LOG-0898", user: "Jerome Lim", dept: "Admin", action: "Changed meal selection for Aisha Rahman — Prawn Stir Fry → Sweet Potato & Chicken (Mon 16 Sep delivery)", module: "MenuReview", ip: "192.168.1.12", device: "Chrome / macOS", ts: "14 Sep 2024 12:15:33", type: "menu-change", prevValue: "Prawn Stir Fry & Veg", newValue: "Sweet Potato & Chicken", reason: "Customer called in — dietary preference change for Monday delivery" },
  { id: "LOG-0897", user: "Jerome Lim", dept: "Admin", action: "Credit NOT applied — payment pending for Marcus Tan SUB-001 ($210.00)", module: "Wallet", ip: "192.168.1.12", device: "Chrome / macOS", ts: "14 Sep 2024 11:50:20", type: "credit-adjust", prevValue: "Credit pending application", newValue: "Credit blocked — payment status: pending", reason: "Auto-order credit rule: credit not applied while payment is unresolved" },
  { id: "LOG-0896", user: "Ravi Kumar", dept: "Finance", action: "Refund REF-062 approved — $68.00 — Jason Yeo — Delivery Failure", module: "Finance", ip: "10.0.0.50", device: "Firefox / Windows", ts: "14 Sep 2024 11:45:00", type: "refund-decision", prevValue: "REF-062: Pending review", newValue: "REF-062: Approved — $68.00 refunded", reason: "Delivery failure confirmed by dispatch team" },
  { id: "LOG-0895", user: "Jerome Lim", dept: "Admin", action: "Transaction description edited — TXN-8821: \"Week 38 Meal Plan — Marcus Tan\" → \"Week 38 Meal Plan Renewal — Marcus Tan (BUILD)\"", module: "Wallet", ip: "192.168.1.12", device: "Chrome / macOS", ts: "14 Sep 2024 11:40:00", type: "tx-edit", prevValue: "Week 38 Meal Plan — Marcus Tan", newValue: "Week 38 Meal Plan Renewal — Marcus Tan (BUILD)", reason: "Clarifying description to reflect BUILD goal subscription" },
  { id: "LOG-0894", user: "System", dept: "Automation", action: "Top-up notification sent to Serene Tay — insufficient credit for auto-order ($44 available, $168 required)", module: "Subscriptions", ip: "system", device: "System / Automation", ts: "12 Sep 2024 14:55:05", type: "automation", prevValue: "Wallet balance: $44.00", newValue: "Auto-order blocked — top-up notification sent", reason: "Insufficient wallet credit for scheduled auto-order" },
  { id: "LOG-0893", user: "Jerome Lim", dept: "Admin", action: "Junior pricing rule updated — Dinner Plan Junior Item: 60% of adult base price", module: "BusinessRules", ip: "192.168.1.12", device: "Chrome / macOS", ts: "12 Sep 2024 09:30:00", type: "edit", prevValue: "Junior item: 55% of adult base price", newValue: "Junior item: 60% of adult base price", reason: "Pricing committee review — updated to reflect cost increase" },
  { id: "LOG-0891", user: "Jerome Lim", dept: "Admin", action: "Approved menu swap for Aisha Rahman", module: "Subscriptions", ip: "192.168.1.12", device: "Chrome / macOS", ts: "14 Sep 2024 11:44:02", type: "edit", prevValue: "—", newValue: "—", reason: "—" },
  { id: "LOG-0890", user: "Jerome Lim", dept: "Admin", action: "Updated order ORD-2408 status → Packing", module: "Orders", ip: "192.168.1.12", device: "Chrome / macOS", ts: "14 Sep 2024 11:42:15", type: "edit", prevValue: "Status: Confirmed", newValue: "Status: Packing", reason: "—" },
  { id: "LOG-0889", user: "Hafiz Ahmad", dept: "Kitchen", action: "Marked Teriyaki Chicken batch as Done (qty 16)", module: "Kitchen", ip: "192.168.1.31", device: "Safari / iPad", ts: "14 Sep 2024 11:38:44", type: "update", prevValue: "—", newValue: "—", reason: "—" },
  { id: "LOG-0888", user: "Sarah Tan", dept: "Support", action: "Created support ticket TKT-003 for Jason Yeo", module: "Support", ip: "10.0.0.44", device: "Chrome / Windows", ts: "14 Sep 2024 11:31:20", type: "create", prevValue: "—", newValue: "TKT-003 created", reason: "—" },
  { id: "LOG-0887", user: "Lena Wong", dept: "Delivery", action: "Assigned rider Ahmad Farid to ORD-2401", module: "Dispatch", ip: "192.168.1.22", device: "Chrome / macOS", ts: "14 Sep 2024 11:28:55", type: "assign", prevValue: "Unassigned", newValue: "Rider: Ahmad Farid", reason: "—" },
  { id: "LOG-0886", user: "Jerome Lim", dept: "Admin", action: "Added $15 wallet credit to Marcus Tan", module: "Wallet", ip: "192.168.1.12", device: "Chrome / macOS", ts: "14 Sep 2024 10:55:30", type: "finance", prevValue: "—", newValue: "+$15.00 wallet credit", reason: "—" },
  { id: "LOG-0885", user: "Ravi Kumar", dept: "Finance", action: "Exported CSV — Revenue Report Sep 2024", module: "Finance", ip: "10.0.0.50", device: "Firefox / Windows", ts: "14 Sep 2024 10:42:18", type: "export", prevValue: "—", newValue: "—", reason: "—" },
  { id: "LOG-0884", user: "Hafiz Ahmad", dept: "Kitchen", action: "Low stock alert acknowledged — Jasmine Rice", module: "Inventory", ip: "192.168.1.31", device: "Safari / iPad", ts: "14 Sep 2024 10:22:05", type: "alert", prevValue: "—", newValue: "—", reason: "—" },
  { id: "LOG-0883", user: "Sarah Tan", dept: "Support", action: "Paused subscription SUB-003 for Wei Jie Lim", module: "Subscriptions", ip: "10.0.0.44", device: "Chrome / Windows", ts: "14 Sep 2024 09:55:14", type: "edit", prevValue: "Status: Active", newValue: "Status: Paused", reason: "—" },
  { id: "LOG-0882", user: "Lena Wong", dept: "Delivery", action: "Marked ORD-2405 as Delivered — Run A", module: "Dispatch", ip: "192.168.1.22", device: "Chrome / macOS", ts: "14 Sep 2024 09:47:33", type: "update", prevValue: "—", newValue: "—", reason: "—" },
  { id: "LOG-0881", user: "Jerome Lim", dept: "Admin", action: "Invited user preethi@performancemeals.sg", module: "ACL", ip: "192.168.1.12", device: "Chrome / macOS", ts: "14 Sep 2024 09:30:01", type: "admin", prevValue: "—", newValue: "User invited", reason: "—" },
  { id: "LOG-0880", user: "Mei Ling", dept: "Marketing", action: "Created campaign CAM-01 — September Fitness Push", module: "Marketing", ip: "10.0.0.55", device: "Chrome / Windows", ts: "13 Sep 2024 17:45:22", type: "create", prevValue: "—", newValue: "CAM-01 created", reason: "—" },
  { id: "LOG-0879", user: "Ravi Kumar", dept: "Finance", action: "Processed refund $89.50 for Serene Tay", module: "Finance", ip: "10.0.0.50", device: "Firefox / Windows", ts: "13 Sep 2024 16:30:11", type: "finance", prevValue: "—", newValue: "—", reason: "—" },
  { id: "LOG-0878", user: "Jerome Lim", dept: "Admin", action: "Suspended user preethi@performancemeals.sg", module: "ACL", ip: "192.168.1.12", device: "Chrome / macOS", ts: "13 Sep 2024 14:22:08", type: "admin", prevValue: "Status: Active", newValue: "Status: Suspended", reason: "—" },
];

const typeColor: Record<string, string> = {
  edit: "text-blue-400 bg-blue-950",
  update: "text-yellow-400 bg-yellow-950/40",
  create: "text-green-400 bg-green-950",
  assign: "text-purple-400 bg-purple-950",
  finance: "text-[#F5B300] bg-yellow-950/40",
  export: "text-[#888] bg-[#2A2A2A]",
  alert: "text-red-400 bg-red-950",
  admin: "text-[#E85D04] bg-orange-950",
  automation: "text-purple-400 bg-purple-950/40",
  "menu-change": "text-cyan-400 bg-cyan-950/40",
  "credit-adjust": "text-emerald-400 bg-emerald-950/40",
  "refund-decision": "text-red-400 bg-red-950/40",
  "tx-edit": "text-orange-400 bg-orange-950/40",
};

const typeLabel: Record<string, string> = {
  edit: "edit",
  update: "update",
  create: "create",
  assign: "assign",
  finance: "finance",
  export: "export",
  alert: "alert",
  admin: "admin",
  automation: "Automation",
  "menu-change": "Menu Change",
  "credit-adjust": "Credit Adjust",
  "refund-decision": "Refund",
  "tx-edit": "TX Edit",
};

const depts = ["All", "Admin", "Kitchen", "Delivery", "Support", "Finance", "Marketing", "Automation"];
const types = ["All", "edit", "create", "update", "assign", "finance", "export", "alert", "admin", "automation", "menu-change", "credit-adjust", "refund-decision", "tx-edit"];

export default function AuditLogs({ demoMode }: { demoMode?: boolean } = {}) {
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(demoMode ? logs[0] : null);

  const filtered = logs.filter(l => {
    if (deptFilter !== "All" && l.dept !== deptFilter) return false;
    if (typeFilter !== "All" && l.type !== typeFilter) return false;
    if (search && !`${l.user} ${l.action} ${l.module}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold">Audit Logs</h2>
        <button className="border border-[#3A3A3A] text-[#CCCCCC] text-xs px-4 py-2 mono hover:border-[#F5B300] hover:text-[#F5B300] transition-colors">
          Export Logs CSV
        </button>
      </div>

      <div className="border border-[#2A2A2A] bg-[#0D0D0D] px-4 py-3 flex items-start gap-3">
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", color: "#555", background: "#1A1A1A", border: "1px solid #2A2A2A", padding: "2px 6px", flexShrink: 0, marginTop: 1 }}>PROTOTYPE</span>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#555", lineHeight: 1.6 }}>
          <span className="text-[#777]">Production audit records must be server-side and tamper-resistant.</span>{" "}
          The log entries shown here are prototype representations for workflow reference. In production, sensitive actions (order generation, menu changes, wallet adjustments, refund decisions, permission changes) are recorded server-side with immutable timestamps and cannot be altered from the admin UI.
        </p>
      </div>

      <div className="border border-yellow-800/30 bg-yellow-950/10 px-4 py-2.5 text-xs text-yellow-300 mono">
        ℹ Every action performed in this platform is logged. In production, logs are server-side, tamper-resistant, and retained per business policy.
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <input
          type="text"
          placeholder="Search user, action, module…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-[#181818] border border-[#2A2A2A] text-[#E8E8E8] text-sm px-3 py-2 w-64 focus:outline-none focus:border-[#F5B300] placeholder:text-[#444]"
        />
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider">Dept</span>
          <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)}
            className="bg-[#181818] border border-[#2A2A2A] text-[#E8E8E8] text-sm px-3 py-2 mono focus:outline-none focus:border-[#F5B300]">
            {depts.map(d => <option key={d}>{d}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider">Type</span>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
            className="bg-[#181818] border border-[#2A2A2A] text-[#E8E8E8] text-sm px-3 py-2 mono focus:outline-none focus:border-[#F5B300]">
            {types.map(t => <option key={t} value={t}>{typeLabel[t] ?? t}</option>)}
          </select>
        </div>
        <div className="ml-auto text-xs text-[#888] mono self-center">{filtered.length} entries</div>
      </div>

      <div className={`grid gap-4 ${selectedLog ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-1"}`}>
        {/* Log table */}
        <div className={`${selectedLog ? "col-span-2" : ""} border border-[#2A2A2A] bg-[#181818] overflow-x-auto`}>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2A2A2A]">
                {["Log ID", "Timestamp", "User", "Department", "Action", "Module", "Type"].map(h => (
                  <th key={h} className="px-4 py-2 text-left text-xs text-[#AAAAAA] uppercase tracking-wider font-medium whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((log, i) => (
                <tr key={log.id}
                  onClick={() => setSelectedLog(selectedLog?.id === log.id ? null : log)}
                  className={`border-b border-[#2A2A2A] hover:bg-[#1F1F1F] transition-colors cursor-pointer ${i % 2 === 0 ? "" : "bg-[#141414]"} ${selectedLog?.id === log.id ? "bg-[#1F1F1F]" : ""}`}>
                  <td className="px-4 py-2.5 mono text-xs text-[#F5B300]">{log.id}</td>
                  <td className="px-4 py-2.5 mono text-xs text-[#888] whitespace-nowrap">{log.ts}</td>
                  <td className="px-4 py-2.5 font-medium whitespace-nowrap">{log.user}</td>
                  <td className="px-4 py-2.5 text-xs text-[#888]">{log.dept}</td>
                  <td className="px-4 py-2.5 text-xs max-w-[240px] truncate">{log.action}</td>
                  <td className="px-4 py-2.5 text-xs text-[#888]">{log.module}</td>
                  <td className="px-4 py-2.5">
                    <span className={`text-xs mono px-2 py-0.5 font-bold ${typeColor[log.type] ?? "text-[#888]"}`}>
                      {typeLabel[log.type] ?? log.type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Detail panel */}
        {selectedLog && (
          <div className="border border-[#2A2A2A] bg-[#181818] p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="mono text-xs text-[#F5B300] font-bold">{selectedLog.id}</span>
              <button onClick={() => setSelectedLog(null)} className="text-[#555] hover:text-[#E8E8E8] text-lg mono">×</button>
            </div>
            <div className="space-y-3">
              <div>
                <div className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider mb-1">Action</div>
                <div className="text-xs text-[#E8E8E8] leading-relaxed">{selectedLog.action}</div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="text-xs text-[#DDDDDD] mb-0.5">User</div>
                  <div className="text-xs mono text-[#E8E8E8]">{selectedLog.user}</div>
                </div>
                <div>
                  <div className="text-xs text-[#DDDDDD] mb-0.5">Role / Dept</div>
                  <div className="text-xs mono text-[#888]">{selectedLog.dept}</div>
                </div>
              </div>
              <div>
                <div className="text-xs text-[#DDDDDD] mb-0.5">Timestamp</div>
                <div className="text-xs mono text-[#888]">{selectedLog.ts}</div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="text-xs text-[#DDDDDD] mb-0.5">Module</div>
                  <div className="text-xs mono text-[#888]">{selectedLog.module}</div>
                </div>
                <div>
                  <div className="text-xs text-[#DDDDDD] mb-0.5">Type</div>
                  <span className={`text-xs mono px-2 py-0.5 font-bold ${typeColor[selectedLog.type] ?? "text-[#888]"}`}>
                    {typeLabel[selectedLog.type] ?? selectedLog.type}
                  </span>
                </div>
              </div>
              <div className="border border-[#2A2A2A] bg-[#0F0F0F] p-3 space-y-2">
                <div>
                  <div className="text-xs text-[#DDDDDD] mb-0.5">Previous Value</div>
                  <div className="text-xs mono text-[#888]">{selectedLog.prevValue ?? "—"}</div>
                </div>
                <div>
                  <div className="text-xs text-[#DDDDDD] mb-0.5">New Value</div>
                  <div className="text-xs mono text-green-400">{selectedLog.newValue ?? "—"}</div>
                </div>
                <div>
                  <div className="text-xs text-[#DDDDDD] mb-0.5">Reason</div>
                  <div className="text-xs text-[#CCCCCC]">{selectedLog.reason ?? "—"}</div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="text-xs text-[#DDDDDD] mb-0.5">IP Address</div>
                  <div className="text-xs mono text-[#555]">{selectedLog.ip}</div>
                </div>
                <div>
                  <div className="text-xs text-[#DDDDDD] mb-0.5">Device</div>
                  <div className="text-xs mono text-[#555]">{selectedLog.device}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
