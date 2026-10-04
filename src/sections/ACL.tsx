import { useState, Fragment } from "react";

const departments = [
  { id: "D-01", name: "Operations",       head: "Jerome Lim",  users: 2, desc: "Platform administration, overall operational oversight" },
  { id: "D-02", name: "Kitchen",          head: "Hafiz Ahmad", users: 3, desc: "Production, menu execution, quality control" },
  { id: "D-03", name: "Delivery",         head: "Lena Wong",   users: 3, desc: "Dispatch, riders, route management, failed deliveries" },
  { id: "D-04", name: "Customer Support", head: "Sarah Tan",   users: 2, desc: "Tickets, escalations, subscriber actions" },
  { id: "D-05", name: "Marketing",        head: "Mei Ling",    users: 1, desc: "Campaigns, attribution, affiliate, content" },
  { id: "D-06", name: "Finance",          head: "Ravi Kumar",  users: 2, desc: "Billing, refunds, wallet, revenue reporting" },
  { id: "D-07", name: "Inventory",        head: "—",           users: 1, desc: "Stock management, low-stock monitoring" },
  { id: "D-08", name: "Procurement",      head: "—",           users: 1, desc: "Supplier orders, purchase management" },
  { id: "D-09", name: "IT / Admin",       head: "—",           users: 1, desc: "System administration, access management" },
];

const roles = [
  // Executive
  { id: "R-01", name: "Super Admin", dept: "All", level: "super" },
  { id: "R-02", name: "Managing Director", dept: "Executive", level: "super" },
  { id: "R-03", name: "Operations Director", dept: "Executive", level: "super" },
  // Operations
  { id: "R-04", name: "Operations Manager", dept: "Operations", level: "manager" },
  { id: "R-05", name: "Operations Executive", dept: "Operations", level: "staff" },
  // Kitchen
  { id: "R-06", name: "Kitchen Manager", dept: "Kitchen", level: "manager" },
  { id: "R-07", name: "Head Chef", dept: "Kitchen", level: "manager" },
  { id: "R-08", name: "Sous Chef", dept: "Kitchen", level: "staff" },
  { id: "R-09", name: "Chef / Cook", dept: "Kitchen", level: "staff" },
  { id: "R-10", name: "Kitchen Staff", dept: "Kitchen", level: "staff" },
  { id: "R-11", name: "Quality Control Staff", dept: "Kitchen", level: "staff" },
  // Inventory & Procurement
  { id: "R-12", name: "Inventory Manager", dept: "Inventory", level: "manager" },
  { id: "R-13", name: "Inventory Executive", dept: "Inventory", level: "staff" },
  { id: "R-14", name: "Procurement Manager", dept: "Procurement", level: "manager" },
  { id: "R-15", name: "Procurement Executive", dept: "Procurement", level: "staff" },
  // Delivery & Logistics
  { id: "R-16", name: "Delivery Manager", dept: "Delivery", level: "manager" },
  { id: "R-17", name: "Dispatch Manager", dept: "Delivery", level: "manager" },
  { id: "R-18", name: "Dispatcher", dept: "Delivery", level: "staff" },
  { id: "R-19", name: "Rider Supervisor", dept: "Delivery", level: "staff" },
  { id: "R-20", name: "Rider", dept: "Delivery", level: "staff" },
  // Customer Support
  { id: "R-21", name: "Customer Support Manager", dept: "Customer Support", level: "manager" },
  { id: "R-22", name: "Customer Support Agent", dept: "Customer Support", level: "staff" },
  // Finance
  { id: "R-23", name: "Finance Manager", dept: "Finance", level: "manager" },
  { id: "R-24", name: "Finance Executive", dept: "Finance", level: "staff" },
  { id: "R-25", name: "Accounts Executive", dept: "Finance", level: "staff" },
  // Marketing
  { id: "R-26", name: "Marketing Manager", dept: "Marketing", level: "manager" },
  { id: "R-27", name: "Meta Ads Specialist", dept: "Marketing", level: "staff" },
  { id: "R-28", name: "Google Ads Specialist", dept: "Marketing", level: "staff" },
  { id: "R-29", name: "Content Manager", dept: "Marketing", level: "staff" },
  { id: "R-30", name: "Content Executive", dept: "Marketing", level: "staff" },
  { id: "R-31", name: "Affiliate Manager", dept: "Marketing", level: "staff" },
  // IT / Admin
  { id: "R-32", name: "IT / System Admin", dept: "IT / Admin", level: "manager" },
  { id: "R-33", name: "HR / People Manager", dept: "IT / Admin", level: "staff" },
];

const users = [
  { id: "U01", name: "Jerome Lim", role: "Super Admin", dept: "All", status: "Active", lastLogin: "14 Sep 2024 11:42", email: "jerome@performancemeals.sg", createdBy: "System" },
  { id: "U02", name: "Sarah Tan", role: "Customer Support Manager", dept: "Customer Support", status: "Active", lastLogin: "14 Sep 2024 09:30", email: "sarah@performancemeals.sg", createdBy: "Jerome Lim" },
  { id: "U03", name: "Hafiz Ahmad", role: "Kitchen Manager", dept: "Kitchen", status: "Active", lastLogin: "14 Sep 2024 07:15", email: "hafiz@performancemeals.sg", createdBy: "Jerome Lim" },
  { id: "U04", name: "Lena Wong", role: "Dispatch Manager", dept: "Delivery", status: "Active", lastLogin: "14 Sep 2024 08:45", email: "lena@performancemeals.sg", createdBy: "Jerome Lim" },
  { id: "U05", name: "Ravi Kumar", role: "Finance Manager", dept: "Finance", status: "Active", lastLogin: "13 Sep 2024 17:20", email: "ravi@performancemeals.sg", createdBy: "Jerome Lim" },
  { id: "U06", name: "Mei Ling", role: "Marketing Manager", dept: "Marketing", status: "Active", lastLogin: "14 Sep 2024 10:05", email: "meiling@performancemeals.sg", createdBy: "Jerome Lim" },
  { id: "U07", name: "Kevin Chua", role: "Kitchen Staff", dept: "Kitchen", status: "Active", lastLogin: "14 Sep 2024 07:00", email: "kevin@performancemeals.sg", createdBy: "Hafiz Ahmad" },
  { id: "U08", name: "Ahmad Farid", role: "Rider", dept: "Delivery", status: "Active", lastLogin: "14 Sep 2024 06:55", email: "farid@performancemeals.sg", createdBy: "Lena Wong" },
  { id: "U09", name: "Preethi S", role: "Customer Support Agent", dept: "Customer Support", status: "Suspended", lastLogin: "10 Sep 2024 14:00", email: "preethi@performancemeals.sg", createdBy: "Sarah Tan" },
  { id: "U10", name: "Benny Lim", role: "Dispatcher", dept: "Delivery", status: "Active", lastLogin: "14 Sep 2024 07:30", email: "benny@performancemeals.sg", createdBy: "Lena Wong" },
];

const modules = [
  "Operations", "RS Orders", "Meal Plans", "Subscribers", "Menu Review", "Menu Mgmt",
  "Kitchen", "Inventory", "Procurement", "Packaging", "Dispatch", "Riders",
  "Support", "Wallet", "Refunds", "Finance", "Marketing", "Reports",
  "Notifications", "WhatsApp", "Users", "Roles", "Settings", "Audit Logs", "Business Rules",
];

const permLabels = ["View", "Create", "Edit", "Delete", "Approve", "Export", "Assign", "Execute"];

type PermRow = [boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean];

// Helper: build a perm row as 8-tuple
const p = (v: boolean[], pad = 8): PermRow => {
  const r = [...v];
  while (r.length < pad) r.push(false);
  return r.slice(0, pad) as PermRow;
};

// Perm shortcuts
const FULL: PermRow = [true, true, true, true, true, true, true, true];
const VIEW_EXP: PermRow = p([true, false, false, false, false, true]);
const VIEW_ONLY: PermRow = p([true]);
const NONE: PermRow = p([]);

const build = (allowed: string[], canCreate: string[] = [], canEdit: string[] = [], canDelete: string[] = [], canApprove: string[] = [], canExport: string[] = [], canAssign: string[] = [], canExecute: string[] = []): Record<string, PermRow> =>
  Object.fromEntries(modules.map(m => [m, p([
    allowed.includes(m) || allowed.includes("*"),
    canCreate.includes(m) || canCreate.includes("*"),
    canEdit.includes(m) || canEdit.includes("*"),
    canDelete.includes(m) || canDelete.includes("*"),
    canApprove.includes(m) || canApprove.includes("*"),
    canExport.includes(m) || canExport.includes("*"),
    canAssign.includes(m) || canAssign.includes("*"),
    canExecute.includes(m) || canExecute.includes("*"),
  ])]));

const permMatrix: Record<string, Record<string, PermRow>> = {
  // EXECUTIVE
  "Super Admin": Object.fromEntries(modules.map(m => [m, FULL])),
  "Managing Director": build(["*"], ["*"], ["*"], [], ["*"], ["*"], ["*"], []),
  "Operations Director": build(["Operations","RS Orders","Meal Plans","Subscribers","Menu Review","Kitchen","Inventory","Procurement","Dispatch","Support","Finance","Reports","Notifications","Audit Logs"], ["Operations","RS Orders","Meal Plans"], ["Operations","RS Orders","Meal Plans","Subscribers"], [], ["*"], ["*"], ["Dispatch","Riders"], []),

  // OPERATIONS
  "Operations Manager": build(["Operations","RS Orders","Meal Plans","Subscribers","Menu Review","Dispatch","Support","Reports","Notifications"], ["RS Orders","Meal Plans"], ["Operations","RS Orders","Meal Plans","Subscribers","Menu Review"], [], ["Operations","Support","Refunds"], ["Operations","RS Orders","Meal Plans","Reports"], ["Dispatch"], []),
  "Operations Executive": build(["Operations","RS Orders","Meal Plans","Subscribers","Menu Review","Reports","Notifications"], [], ["Operations","RS Orders","Meal Plans"], [], [], ["RS Orders","Meal Plans","Reports"], [], []),

  // KITCHEN
  "Kitchen Manager": build(["Operations","Kitchen","Inventory","Procurement","Packaging","Menu Review","Menu Mgmt","Reports","Notifications"], ["Kitchen","Menu Mgmt"], ["Kitchen","Inventory","Packaging","Menu Review","Menu Mgmt"], ["Kitchen"], ["Kitchen","Menu Mgmt"], ["Kitchen","Inventory","Reports"], [], ["Kitchen"]),
  "Head Chef": build(["Kitchen","Inventory","Menu Review","Menu Mgmt","Packaging"], ["Kitchen","Menu Mgmt"], ["Kitchen","Menu Mgmt"], [], ["Kitchen"], ["Kitchen"], [], ["Kitchen"]),
  "Sous Chef": build(["Kitchen","Inventory","Menu Review"], [], ["Kitchen"], [], [], ["Kitchen"], [], ["Kitchen"]),
  "Chef / Cook": build(["Kitchen"], [], ["Kitchen"], [], [], [], [], ["Kitchen"]),
  "Kitchen Staff": build(["Kitchen"], [], ["Kitchen"], [], [], [], [], []),
  "Quality Control Staff": build(["Kitchen","Inventory"], [], ["Kitchen","Inventory"], [], ["Kitchen"], ["Kitchen"], [], []),

  // INVENTORY & PROCUREMENT
  "Inventory Manager": build(["Inventory","Procurement","Packaging","Kitchen","Reports"], ["Inventory","Procurement"], ["Inventory","Packaging"], ["Inventory"], ["Procurement"], ["Inventory","Reports"], [], []),
  "Inventory Executive": build(["Inventory","Packaging"], [], ["Inventory","Packaging"], [], [], ["Inventory"], [], []),
  "Procurement Manager": build(["Inventory","Procurement","Reports"], ["Procurement"], ["Procurement"], [], ["Procurement"], ["Procurement","Reports"], [], []),
  "Procurement Executive": build(["Inventory","Procurement"], ["Procurement"], ["Procurement"], [], [], ["Procurement"], [], []),

  // DELIVERY & LOGISTICS
  "Delivery Manager": build(["Operations","RS Orders","Dispatch","Riders","Reports","Notifications"], ["Dispatch"], ["Dispatch","Riders"], ["Dispatch"], ["Dispatch"], ["Dispatch","Reports"], ["Riders","Dispatch"], []),
  "Dispatch Manager": build(["RS Orders","Meal Plans","Dispatch","Riders","Reports"], [], ["Dispatch"], ["Dispatch"], ["Dispatch"], ["Dispatch","Reports"], ["Riders","Dispatch"], []),
  "Dispatcher": build(["RS Orders","Meal Plans","Dispatch","Riders"], [], ["Dispatch"], [], [], ["Dispatch"], ["Riders"], []),
  "Rider Supervisor": build(["Dispatch","Riders"], [], ["Riders"], [], [], [], ["Riders"], []),
  "Rider": build(["Dispatch"], [], [], [], [], [], [], ["Dispatch"]),

  // CUSTOMER SUPPORT
  "Customer Support Manager": build(["Operations","RS Orders","Meal Plans","Subscribers","Support","Refunds","Wallet","Reports","Notifications"], [], ["Support","Subscribers"], [], ["Refunds","Support"], ["Support","Reports"], [], []),
  "Customer Support Agent": build(["RS Orders","Meal Plans","Subscribers","Support","Notifications"], [], ["Support","Subscribers"], [], [], [], [], []),

  // FINANCE
  "Finance Manager": build(["Finance","Refunds","Wallet","Reports","Notifications","RS Orders","Meal Plans"], [], ["Finance","Wallet"], [], ["Refunds","Finance"], ["Finance","Reports"], [], []),
  "Finance Executive": build(["Finance","Refunds","Reports"], [], ["Finance"], [], ["Refunds"], ["Finance","Reports"], [], []),
  "Accounts Executive": build(["Finance","Reports"], [], [], [], [], ["Reports"], [], []),

  // MARKETING
  "Marketing Manager": build(["Marketing","WhatsApp","Reports","Notifications","RS Orders","Meal Plans"], ["Marketing","WhatsApp"], ["Marketing","WhatsApp"], [], ["Marketing"], ["Marketing","Reports"], [], []),
  "Meta Ads Specialist": build(["Marketing","Reports"], [], ["Marketing"], [], [], ["Marketing","Reports"], [], []),
  "Google Ads Specialist": build(["Marketing","Reports"], [], ["Marketing"], [], [], ["Marketing","Reports"], [], []),
  "Content Manager": build(["Marketing","WhatsApp","Notifications"], ["Marketing"], ["Marketing","WhatsApp","Notifications"], [], [], ["Marketing"], [], []),
  "Content Executive": build(["Marketing"], [], ["Marketing"], [], [], [], [], []),
  "Affiliate Manager": build(["Marketing","Reports"], ["Marketing"], ["Marketing"], [], [], ["Marketing","Reports"], [], []),

  // IT / ADMIN
  "IT / System Admin": build(["*"], ["Users","Roles","Settings"], ["Settings","Users","Roles"], ["Users"], [], ["Audit Logs"], [], ["Settings"]),
  "HR / People Manager": build(["Users","Reports","Audit Logs"], ["Users"], ["Users"], [], [], ["Reports"], [], []),
};

const statusStyle: Record<string, string> = {
  Active: "bg-green-950 text-green-400",
  Suspended: "bg-red-950 text-red-400",
  Pending: "bg-yellow-950 text-yellow-400",
};

type Tab = "users" | "roles" | "matrix" | "departments";

interface UserActionModal {
  user: typeof users[0];
  action: "edit" | "role" | "transfer" | "reset";
}

export default function ACL({ demoMode }: { demoMode?: boolean } = {}) {
  const [tab, setTab] = useState<Tab>("users");
  const [selectedRole, setSelectedRole] = useState("Super Admin");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [actionModal, setActionModal] = useState<UserActionModal | null>(demoMode ? { user: users[0], action: "role" } : null);
  const [deptFilter, setDeptFilter] = useState("All");
  const [roleNewRole, setRoleNewRole] = useState("");
  const [roleNewDept, setRoleNewDept] = useState("");
  const [roleReason, setRoleReason] = useState("");
  const [lastSaWarning, setLastSaWarning] = useState(false);

  const filteredUsers = users.filter(u => deptFilter === "All" || u.dept === deptFilter);

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold">Access Control Center</h2>
        <button onClick={() => setInviteOpen(true)}
          className="bg-[#F5B300] text-black text-xs font-bold px-4 py-2 mono hover:bg-[#C99200] transition-colors">
          + Invite User
        </button>
      </div>

      {/* Auth boundary disclaimer */}
      <div className="border border-[#2A2A2A] bg-[#0D0D0D] px-4 py-3 flex items-start gap-3">
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", color: "#555", background: "#1A1A1A", border: "1px solid #2A2A2A", padding: "2px 6px", flexShrink: 0, marginTop: 1 }}>PROTOTYPE</span>
        <div>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#555", lineHeight: 1.6 }}>
            <span className="text-[#888]">UI permissions are enforced by server-side authorization in production.</span>{" "}
            Hiding a button in the UI is not a security mechanism. Role assignments shown here are prototype representations. Production requires server-side identity verification, session management, and access controls. Super Admin can access all modules; cross-department access requires explicit authorization.
          </p>
        </div>
      </div>

      {/* Permission types reference */}
      <div className="border border-[#2A2A2A] bg-[#181818] px-4 py-3">
        <div className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider mb-2 display">Supported Permission Types</div>
        <div className="flex flex-wrap gap-2">
          {[
            { id: "VIEW",    desc: "Read access to module data" },
            { id: "CREATE",  desc: "Create new records" },
            { id: "EDIT",    desc: "Modify existing records" },
            { id: "DELETE",  desc: "Remove records" },
            { id: "APPROVE", desc: "Authorize requests (refunds, overrides)" },
            { id: "EXPORT",  desc: "Download / export data" },
            { id: "ASSIGN",  desc: "Assign tasks or personnel" },
            { id: "EXECUTE", desc: "Trigger operational actions" },
          ].map(p => (
            <div key={p.id} className="flex items-center gap-1.5 border border-[#2A2A2A] bg-[#141414] px-3 py-1.5">
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", color: "#F5B300" }}>{p.id}</span>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: "#666" }}>{p.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          { label: "Total Users", value: String(users.length), sub: "registered", color: undefined as string | undefined },
          { label: "Active", value: String(users.filter(u => u.status === "Active").length), sub: "can log in", color: "#22C55E" as string | undefined },
          { label: "Suspended", value: String(users.filter(u => u.status === "Suspended").length), sub: "no access", color: "#EF4444" as string | undefined },
          { label: "Roles", value: String(roles.length), sub: "configured", color: undefined as string | undefined },
          { label: "Departments", value: String(departments.length), sub: "active", color: undefined as string | undefined },
        ].map(k => (
          <div key={k.label} className="border border-[#2A2A2A] bg-[#181818] p-4">
            <div className="text-xs font-bold text-[#FFFFFF] uppercase tracking-widest mb-2">{k.label}</div>
            <div className="text-3xl font-extrabold mono" style={{ color: k.color ?? "#E8E8E8" }}>{k.value}</div>
            <div className="text-xs text-[#888] mt-1 mono">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#2A2A2A]">
        {(["users", "roles", "matrix", "departments"] as Tab[]).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-3 text-sm font-medium mono transition-colors ${tab === t ? "border-b-2 border-[#F5B300] text-[#F5B300]" : "text-[#888] hover:text-[#E8E8E8]"}`}>
            {t === "users" ? "User Directory" : t === "roles" ? "Role Builder" : t === "matrix" ? "Permission Matrix" : "Departments"}
          </button>
        ))}
      </div>

      {/* ── USER DIRECTORY ── */}
      {tab === "users" && (
        <div className="space-y-3">
          <div className="flex gap-2 flex-wrap items-center">
            <span className="text-xs text-[#888] mono">Filter by dept:</span>
            {["All", ...departments.map(d => d.name)].map(d => (
              <button key={d} onClick={() => setDeptFilter(d)}
                className={`text-xs px-3 py-1 mono border transition-colors ${deptFilter === d ? "border-[#F5B300] text-[#F5B300] bg-[#F5B300]/10" : "border-[#2A2A2A] text-[#888] hover:text-[#E8E8E8]"}`}>
                {d}
              </button>
            ))}
            <span className="ml-auto text-xs text-[#888] mono">{filteredUsers.length} users</span>
          </div>

          <div className="border border-[#2A2A2A] bg-[#181818] overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2A2A2A]">
                  {["#", "Name", "Email", "Department", "Role", "Status", "Last Login", "Created By", "Actions"].map(h => (
                    <th key={h} className="px-4 py-2 text-left text-xs text-[#AAAAAA] uppercase tracking-wider font-medium whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u, i) => (
                  <tr key={u.id} className={`border-b border-[#2A2A2A] hover:bg-[#1F1F1F] transition-colors ${i % 2 === 0 ? "" : "bg-[#141414]"}`}>
                    <td className="px-4 py-2.5 mono text-xs text-[#555]">{u.id}</td>
                    <td className="px-4 py-2.5 font-semibold">{u.name}</td>
                    <td className="px-4 py-2.5 text-xs text-[#888] mono">{u.email}</td>
                    <td className="px-4 py-2.5 text-xs text-[#888]">{u.dept}</td>
                    <td className="px-4 py-2.5 text-xs">
                      <span className="border border-[#2A2A2A] px-2 py-0.5 mono text-[#E8E8E8]">{u.role}</span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`text-xs mono px-2 py-0.5 font-bold ${statusStyle[u.status]}`}>{u.status}</span>
                    </td>
                    <td className="px-4 py-2.5 mono text-xs text-[#888]">{u.lastLogin}</td>
                    <td className="px-4 py-2.5 text-xs text-[#888]">{u.createdBy}</td>
                    <td className="px-4 py-2.5">
                      <div className="flex gap-1 flex-wrap">
                        <button onClick={() => setActionModal({ user: u, action: "role" })}
                          className="text-xs border border-[#2A2A2A] px-2 py-1 text-[#888] hover:border-[#F5B300] hover:text-[#F5B300] mono transition-colors">Role</button>
                        <button onClick={() => setActionModal({ user: u, action: "transfer" })}
                          className="text-xs border border-[#2A2A2A] px-2 py-1 text-[#888] hover:border-[#F5B300] hover:text-[#F5B300] mono transition-colors">Transfer</button>
                        <button onClick={() => setActionModal({ user: u, action: "reset" })}
                          className="text-xs border border-[#2A2A2A] px-2 py-1 text-[#888] hover:border-blue-500 hover:text-blue-400 mono transition-colors">Reset PW</button>
                        {u.status === "Active" ? (
                          <button className="text-xs border border-red-800/40 px-2 py-1 text-red-400 hover:bg-red-950 mono transition-colors">Suspend</button>
                        ) : (
                          <button className="text-xs border border-green-800/40 px-2 py-1 text-green-400 hover:bg-green-950 mono transition-colors">Activate</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── ROLE BUILDER ── */}
      {tab === "roles" && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="border border-[#2A2A2A] bg-[#181818]">
            <div className="px-4 py-3 border-b border-[#2A2A2A] flex items-center justify-between">
              <span className="text-sm font-semibold">Roles ({roles.length})</span>
              <button className="text-xs border border-[#F5B300]/40 text-[#F5B300] px-2 py-1 mono hover:bg-[#F5B300]/10 transition-colors">+ New Role</button>
            </div>
            <div className="divide-y divide-[#1F1F1F]">
              {roles.map(r => (
                <div key={r.id} onClick={() => setSelectedRole(r.name)}
                  className={`px-4 py-3 cursor-pointer hover:bg-[#1F1F1F] transition-colors ${selectedRole === r.name ? "bg-[#1F1F1F] border-l-2 border-[#F5B300]" : ""}`}>
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-sm">{r.name}</div>
                    <span className={`text-xs mono ${r.level === "super" ? "text-[#F5B300]" : r.level === "manager" ? "text-blue-400" : "text-[#888]"}`}>{r.level}</span>
                  </div>
                  <div className="text-xs text-[#888] mono mt-0.5">{r.dept}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-2 border border-[#2A2A2A] bg-[#181818]">
            <div className="px-4 py-3 border-b border-[#2A2A2A] flex items-center justify-between">
              <span className="text-sm font-semibold">Permissions — {selectedRole}</span>
              <div className="flex gap-2">
                <button className="text-xs border border-[#2A2A2A] px-2 py-1 text-[#888] hover:border-[#F5B300] hover:text-[#F5B300] mono transition-colors">Edit Role</button>
                <button className="text-xs border border-red-800/40 px-2 py-1 text-red-400 hover:bg-red-950 mono transition-colors">Delete</button>
              </div>
            </div>
            <div className="p-4 overflow-x-auto">
              <div className="grid gap-1" style={{ gridTemplateColumns: "1fr repeat(8, 56px)" }}>
                <div className="text-xs text-[#AAAAAA] uppercase tracking-wider py-1">Module</div>
                {permLabels.map(l => (
                  <div key={l} className="text-xs text-[#AAAAAA] uppercase tracking-wider text-center py-1">{l}</div>
                ))}
                {modules.map(m => {
                  const perms = permMatrix[selectedRole]?.[m] ?? [false, false, false, false, false, false];
                  return (
                    <Fragment key={m}>
                      <div className="text-sm py-1.5 border-b border-[#1A1A1A]">{m}</div>
                      {perms.map((p, pi) => (
                        <div key={pi} className="flex justify-center py-1.5 border-b border-[#1A1A1A]">
                          <div className={`w-4 h-4 flex items-center justify-center text-xs font-bold ${p ? "text-green-400" : "text-[#2A2A2A]"}`}>
                            {p ? "✓" : "✕"}
                          </div>
                        </div>
                      ))}
                    </Fragment>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── PERMISSION MATRIX ── */}
      {tab === "matrix" && (
        <div className="border border-[#2A2A2A] bg-[#181818] overflow-x-auto">
          <div className="px-4 py-3 border-b border-[#2A2A2A]">
            <span className="text-sm font-semibold">Permission Matrix — All Roles × All Modules</span>
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#2A2A2A]">
                <th className="px-4 py-2 text-left text-[#AAAAAA] uppercase tracking-wider font-medium sticky left-0 bg-[#181818] whitespace-nowrap">Module</th>
                {Object.keys(permMatrix).map(r => (
                  <th key={r} className="px-3 py-2 text-center text-[#888] font-medium whitespace-nowrap">
                    {r.replace("Manager", "Mgr").replace("Agent", "Agt").replace("Officer", "Ofcr").replace("Executive", "Exec")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {modules.map((m, i) => (
                <tr key={m} className={`border-b border-[#2A2A2A] ${i % 2 === 0 ? "" : "bg-[#141414]"}`}>
                  <td className="px-4 py-2 font-medium sticky left-0 bg-inherit">{m}</td>
                  {Object.entries(permMatrix).map(([role, mods]) => {
                    const perms = mods[m] ?? new Array(6).fill(false);
                    const count = perms.filter(Boolean).length;
                    return (
                      <td key={role} className="px-3 py-2 text-center">
                        {count === 8 ? <span className="text-green-400 font-bold">Full</span>
                          : count > 0 ? <span className="text-[#F5B300] mono">{count}/8</span>
                          : <span className="text-[#333]">—</span>}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── DEPARTMENT MANAGEMENT ── */}
      {tab === "departments" && (
        <div className="space-y-4">
          <div className="border border-yellow-800/30 bg-yellow-950/10 px-4 py-2.5 text-xs text-yellow-300 mono">
            ⚠ Department Heads can only manage users within their own department. Cross-department access requires Super Admin.
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {departments.map(d => {
              const deptUsers = users.filter(u => u.dept === d.name);
              return (
                <div key={d.id} className="border border-[#2A2A2A] bg-[#181818]">
                  <div className="px-4 py-3 border-b border-[#2A2A2A] flex items-start justify-between">
                    <div>
                      <div className="font-semibold text-sm">{d.name}</div>
                      <div className="text-xs text-[#888] mono mt-0.5">{d.desc}</div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-3">
                      <div className="text-xs text-[#555] mono">Head</div>
                      <div className="text-xs text-[#F5B300] font-semibold">{d.head}</div>
                    </div>
                  </div>
                  <div className="divide-y divide-[#1A1A1A]">
                    {deptUsers.map(u => (
                      <div key={u.id} className="px-4 py-2.5 flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium">{u.name}</div>
                          <div className="text-xs text-[#888] mono">{u.role}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs mono px-2 py-0.5 font-bold ${statusStyle[u.status]}`}>{u.status}</span>
                          <button className="text-xs border border-[#2A2A2A] px-2 py-1 text-[#888] hover:border-[#F5B300] hover:text-[#F5B300] mono transition-colors">Manage</button>
                        </div>
                      </div>
                    ))}
                    {deptUsers.length === 0 && (
                      <div className="px-4 py-3 text-xs text-[#555]">No users in this department.</div>
                    )}
                  </div>
                  <div className="px-4 py-2.5 border-t border-[#2A2A2A] flex gap-2">
                    <button className="text-xs border border-[#F5B300]/40 text-[#F5B300] px-3 py-1 mono hover:bg-[#F5B300]/10 transition-colors">+ Add User</button>
                    <button className="text-xs border border-[#2A2A2A] text-[#888] px-3 py-1 mono hover:text-[#E8E8E8] transition-colors">Edit Dept</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Invite Modal ── */}
      {inviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="bg-[#181818] border border-[#2A2A2A] w-full max-w-[420px]">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#2A2A2A]">
              <span className="font-bold text-[#F5B300] mono">Invite New User</span>
              <button onClick={() => setInviteOpen(false)} className="text-[#888] hover:text-[#E8E8E8] text-xl">×</button>
            </div>
            <div className="p-4 space-y-3">
              {["Full Name", "Email Address"].map(field => (
                <div key={field}>
                  <label className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider block mb-1">{field}</label>
                  <input type={field === "Email Address" ? "email" : "text"} placeholder={`Enter ${field.toLowerCase()}…`}
                    className="w-full bg-[#0F0F0F] border border-[#2A2A2A] text-[#E8E8E8] text-sm px-3 py-2 focus:outline-none focus:border-[#F5B300] placeholder:text-[#444]" />
                </div>
              ))}
              <div>
                <label className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider block mb-1">Department</label>
                <select className="w-full bg-[#0F0F0F] border border-[#2A2A2A] text-[#E8E8E8] text-sm px-3 py-2 focus:outline-none focus:border-[#F5B300]">
                  {departments.map(d => <option key={d.id}>{d.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider block mb-1">Role</label>
                <select className="w-full bg-[#0F0F0F] border border-[#2A2A2A] text-[#E8E8E8] text-sm px-3 py-2 focus:outline-none focus:border-[#F5B300]">
                  {roles.map(r => <option key={r.id}>{r.name}</option>)}
                </select>
              </div>
              <button onClick={() => setInviteOpen(false)}
                className="w-full bg-[#F5B300] text-black py-2 text-sm font-bold mono hover:bg-[#C99200] transition-colors">
                Send Invite
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── User Action Modals ── */}
      {actionModal && (() => {
        const currentPerms = permMatrix[actionModal.user.role] ?? {};
        const targetRole = roleNewRole || actionModal.user.role;
        const newPerms = permMatrix[targetRole] ?? {};
        const added: string[] = [];
        const removed: string[] = [];
        modules.forEach(m => {
          const cur = currentPerms[m] ?? [];
          const nxt = newPerms[m] ?? [];
          const addedPerms = permLabels.filter((_, i) => !cur[i] && nxt[i]);
          const removedPerms = permLabels.filter((_, i) => cur[i] && !nxt[i]);
          if (addedPerms.length) added.push(`${m}: +${addedPerms.join(", ")}`);
          if (removedPerms.length) removed.push(`${m}: −${removedPerms.join(", ")}`);
        });
        const superAdminCount = users.filter(u => u.role === "Super Admin").length;
        const isLastSA = actionModal.user.role === "Super Admin" && superAdminCount === 1 && targetRole !== "Super Admin";
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
            <div className="bg-[#181818] border border-[#2A2A2A] w-full max-w-[520px] max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#2A2A2A] sticky top-0 bg-[#181818] z-10">
                <span className="font-bold text-[#F5B300] mono">
                  {actionModal.action === "role" ? "Change Role" : actionModal.action === "transfer" ? "Department Transfer" : "Reset Password"}
                  {" — "}{actionModal.user.name}
                </span>
                <button onClick={() => { setActionModal(null); setRoleNewRole(""); setRoleReason(""); setLastSaWarning(false); }} className="text-[#888] hover:text-[#E8E8E8] text-xl">×</button>
              </div>
              <div className="p-4 space-y-3">

                {actionModal.action === "role" && (
                  <>
                    {/* Current vs New role summary */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="border border-[#2A2A2A] bg-[#0F0F0F] p-3">
                        <div className="text-[10px] text-[#AAAAAA] uppercase tracking-wider mb-1">Current Role</div>
                        <div className="font-bold text-[#E8E8E8]">{actionModal.user.role}</div>
                        <div className="text-xs text-[#888] mt-0.5">{actionModal.user.dept}</div>
                      </div>
                      <div className="border border-[#F5B300]/40 bg-[#F5B300]/5 p-3">
                        <div className="text-[10px] text-[#AAAAAA] uppercase tracking-wider mb-1">New Role</div>
                        <div className="font-bold text-[#F5B300]">{targetRole || "Select below"}</div>
                        <div className="text-xs text-[#888] mt-0.5">{roles.find(r => r.name === targetRole)?.dept ?? "—"}</div>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider block mb-1">New Role</label>
                      <select
                        value={roleNewRole || actionModal.user.role}
                        onChange={e => setRoleNewRole(e.target.value)}
                        className="w-full bg-[#0F0F0F] border border-[#2A2A2A] text-[#E8E8E8] text-sm px-3 py-2 focus:outline-none focus:border-[#F5B300]"
                      >
                        {roles.map(r => <option key={r.id} value={r.name}>{r.name} ({r.dept})</option>)}
                      </select>
                    </div>

                    {/* Permissions diff */}
                    {(added.length > 0 || removed.length > 0) && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {added.length > 0 && (
                          <div className="border border-green-800/30 bg-green-950/10 p-3 max-h-32 overflow-y-auto">
                            <div className="text-[10px] font-bold text-green-400 uppercase tracking-wider mb-1.5">Permissions Being Added ({added.length})</div>
                            {added.slice(0, 8).map(a => <div key={a} className="text-[10px] text-green-400/70 mono">{a}</div>)}
                            {added.length > 8 && <div className="text-[10px] text-[#555]">+{added.length - 8} more</div>}
                          </div>
                        )}
                        {removed.length > 0 && (
                          <div className="border border-red-800/30 bg-red-950/10 p-3 max-h-32 overflow-y-auto">
                            <div className="text-[10px] font-bold text-red-400 uppercase tracking-wider mb-1.5">Permissions Being Removed ({removed.length})</div>
                            {removed.slice(0, 8).map(r => <div key={r} className="text-[10px] text-red-400/70 mono">{r}</div>)}
                            {removed.length > 8 && <div className="text-[10px] text-[#555]">+{removed.length - 8} more</div>}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Potential impact */}
                    {targetRole !== actionModal.user.role && (
                      <div className="border border-[#2A2A2A] bg-[#0F0F0F] p-3 text-xs text-[#888]">
                        <div className="text-[10px] font-bold text-[#AAAAAA] uppercase tracking-wider mb-1">Potential Impact</div>
                        {removed.length > 0
                          ? `Removing ${removed.length} permission group(s). User will lose access to affected modules immediately upon confirmation.`
                          : "No permissions will be removed. Access will be expanded per new role."}
                      </div>
                    )}

                    {/* Last SA warning */}
                    {isLastSA && (
                      <div className="border-2 border-red-600 bg-red-950/30 px-4 py-3 space-y-2">
                        <div className="text-xs font-extrabold text-red-400 mono uppercase tracking-wider">⛔ CRITICAL: Last Super Admin Warning</div>
                        <div className="text-xs text-red-300">
                          <strong>{actionModal.user.name}</strong> is the ONLY remaining Super Admin.
                          Removing this role will leave the system with zero full administrators.
                          Assign Super Admin to another user before proceeding.
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" onChange={e => setLastSaWarning(e.target.checked)} className="accent-red-500" />
                          <span className="text-xs text-red-400 mono">I understand the risk and have assigned another Super Admin</span>
                        </label>
                      </div>
                    )}
                  </>
                )}

                {actionModal.action === "transfer" && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="border border-[#2A2A2A] bg-[#0F0F0F] p-3">
                        <div className="text-[10px] text-[#AAAAAA] uppercase tracking-wider mb-1">Current Department</div>
                        <div className="font-bold text-[#E8E8E8]">{actionModal.user.dept}</div>
                        <div className="text-xs text-[#888] mt-0.5">{actionModal.user.role}</div>
                      </div>
                      <div className="border border-[#F5B300]/40 bg-[#F5B300]/5 p-3">
                        <div className="text-[10px] text-[#AAAAAA] uppercase tracking-wider mb-1">Destination Department</div>
                        <div className="font-bold text-[#F5B300]">{roleNewDept || "Select below"}</div>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider block mb-1">Transfer To Department</label>
                      <select
                        value={roleNewDept}
                        onChange={e => setRoleNewDept(e.target.value)}
                        className="w-full bg-[#0F0F0F] border border-[#2A2A2A] text-[#E8E8E8] text-sm px-3 py-2 focus:outline-none focus:border-[#F5B300]"
                      >
                        <option value="">Select department…</option>
                        {departments.filter(d => d.name !== actionModal.user.dept).map(d => (
                          <option key={d.id}>{d.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="border border-yellow-800/30 bg-yellow-950/10 px-3 py-2 text-xs text-yellow-400 mono">
                      ⚠ Department transfer will remove all permissions no longer valid for the new department. The user&apos;s role will be updated to the default role of the destination department.
                    </div>
                    <div className="border border-[#2A2A2A] bg-[#0F0F0F] p-3 text-xs text-[#888]">
                      <div className="text-[10px] font-bold text-[#AAAAAA] uppercase tracking-wider mb-1">Permissions Impact</div>
                      All current {actionModal.user.dept} department permissions will be revoked. New permissions will be determined by the destination department role.
                    </div>
                  </>
                )}

                {actionModal.action === "reset" && (
                  <>
                    <div className="text-xs text-[#888]">A password reset link will be sent to:</div>
                    <div className="mono text-sm text-[#F5B300] bg-[#0F0F0F] border border-[#2A2A2A] px-3 py-2">{actionModal.user.email}</div>
                    <div className="text-xs text-[#888]">The user will be required to set a new password on next login. This action will be recorded in the Audit Log.</div>
                  </>
                )}

                {/* Reason field for role and transfer actions */}
                {(actionModal.action === "role" || actionModal.action === "transfer") && (
                  <div>
                    <label className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider block mb-1">Reason for Change <span className="text-red-400">*</span></label>
                    <textarea
                      value={roleReason}
                      onChange={e => setRoleReason(e.target.value)}
                      placeholder="Enter reason for this role/department change…"
                      rows={2}
                      className="w-full bg-[#0F0F0F] border border-[#2A2A2A] text-[#E8E8E8] text-xs px-3 py-2 focus:outline-none focus:border-[#F5B300] placeholder:text-[#444] resize-none"
                    />
                  </div>
                )}

                {/* Audit note */}
                <div className="text-[10px] text-[#555] mono border border-[#2A2A2A] bg-[#0F0F0F] px-3 py-2">
                  ⊟ This action will be recorded in the Audit Log: Changed By · Changed User · Old Role · New Role · Timestamp · Reason
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => { setActionModal(null); setRoleNewRole(""); setRoleReason(""); setRoleNewDept(""); setLastSaWarning(false); }}
                    disabled={
                      ((actionModal.action === "role" || actionModal.action === "transfer") && !roleReason.trim()) ||
                      (isLastSA && !lastSaWarning)
                    }
                    className="flex-1 bg-[#F5B300] text-black py-2 text-sm font-bold mono hover:bg-[#C99200] transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                    Confirm
                  </button>
                  <button onClick={() => { setActionModal(null); setRoleNewRole(""); setRoleReason(""); setRoleNewDept(""); setLastSaWarning(false); }}
                    className="flex-1 border border-[#2A2A2A] text-[#888] py-2 text-sm mono hover:text-[#E8E8E8] transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
