import { useState } from "react";
import type { UserAccount } from "../accessControl";

type SettingsTab = "profile" | "security" | "notifications" | "my-access" | "permission-requests" | "escalation-requests" | "team" | "system";

const settingsTabs: { id: SettingsTab; label: string; icon: string; adminOnly?: boolean }[] = [
  { id: "profile", label: "My Profile", icon: "◎" },
  { id: "security", label: "Security", icon: "⊛" },
  { id: "notifications", label: "Notifications", icon: "◇" },
  { id: "my-access", label: "My Access", icon: "⊞" },
  { id: "permission-requests", label: "Permission Requests", icon: "⊟" },
  { id: "escalation-requests", label: "Escalation Requests", icon: "⇢" },
  { id: "team", label: "Team Management", icon: "◈" },
  { id: "system", label: "System Settings", icon: "⚙", adminOnly: true },
];

const defaultUser = {
  name: "Jerome Lim",
  title: "Operations Director",
  department: "Operations",
  role: "Super Admin",
  email: "jerome@performancemeals.sg",
  phone: "+65 9111 2233",
  employeeId: "PM-EMP-001",
  about: "Platform owner and operations lead. Responsible for end-to-end operations across Ready Series and Meal Plans.",
  initials: "JL",
  accessGrantedBy: "System",
  lastPermissionChange: "03 Jul 2024",
  permittedModules: ["All Modules"],
};

const permissionRequests = [
  { id: "PR-004", requestedBy: "Benny Lim", dept: "Delivery", module: "Reports", permission: "Export", reason: "Need to export weekly dispatch reports for review", status: "pending" as const, date: "14 Sep 2024", approvedBy: null },
  { id: "PR-003", requestedBy: "Preethi S", dept: "Customer Support", module: "Refunds", permission: "Approve", reason: "Handle tier-1 refunds independently to reduce escalations", status: "approved" as const, date: "10 Sep 2024", approvedBy: "Sarah Tan" },
  { id: "PR-002", requestedBy: "Kevin Chua", dept: "Kitchen", module: "Inventory", permission: "Create", reason: "Need to raise stock requests directly", status: "rejected" as const, date: "05 Sep 2024", approvedBy: "Hafiz Ahmad" },
  { id: "PR-001", requestedBy: "Ben Chua", dept: "Marketing", module: "Reports", permission: "View", reason: "Marketing analytics review", status: "expired" as const, date: "01 Aug 2024", approvedBy: null },
];

const escalationRequests = [
  { id: "ESC-008", title: "Refund approval — REF-060 ($210)", type: "Refund", priority: "high" as const, raisedBy: "Natalie Foo", dept: "Customer Support", assignedTo: "Jerome Lim", status: "open" as const, notes: "Customer cancellation mid-week. Partial refund dispute. Requires Director approval.", date: "13 Sep 2024" },
  { id: "ESC-007", title: "Inventory override — Chicken Breast deficit 14kg", type: "Inventory", priority: "high" as const, raisedBy: "Hafiz Ahmad", dept: "Kitchen", assignedTo: "Jerome Lim", status: "in-progress" as const, notes: "Production blocked. Requires emergency PO approval.", date: "14 Sep 2024" },
  { id: "ESC-006", title: "Customer exception — meal swap after cutoff", type: "Menu", priority: "medium" as const, raisedBy: "James Chia", dept: "Customer Support", assignedTo: "Sarah Tan", status: "resolved" as const, notes: "Customer medical requirement. Exception approved by Support Manager.", date: "12 Sep 2024" },
  { id: "ESC-005", title: "Rider reassignment — Ahmad unavailable", type: "Delivery", priority: "medium" as const, raisedBy: "Lena Wong", dept: "Delivery", assignedTo: "Daniel Ng", status: "resolved" as const, notes: "Motorcycle breakdown. Rerouted to James Ng.", date: "11 Sep 2024" },
];

const teamMembers = [
  { id: "U02", name: "Rachel Tan", role: "Operations Executive", dept: "Operations", status: "Active", lastActive: "14 Sep 2024 09:15" },
  { id: "U03", name: "Hafiz Ahmad", role: "Kitchen Manager", dept: "Kitchen", status: "Active", lastActive: "14 Sep 2024 07:15" },
  { id: "U04", name: "Lena Wong", role: "Delivery Manager", dept: "Delivery", status: "Active", lastActive: "14 Sep 2024 08:45" },
  { id: "U05", name: "Ravi Kumar", role: "Finance Manager", dept: "Finance", status: "Active", lastActive: "13 Sep 2024 17:20" },
  { id: "U06", name: "Mei Ling", role: "Marketing Manager", dept: "Marketing", status: "Active", lastActive: "14 Sep 2024 10:05" },
  { id: "U09", name: "Preethi S", role: "Support Agent", dept: "Customer Support", status: "Suspended", lastActive: "10 Sep 2024 14:00" },
];

const activeSessions = [
  { device: "MacBook Pro · Chrome 118", ip: "103.22.44.11", location: "Singapore", lastActive: "Now", current: true },
  { device: "iPhone 15 · Safari", ip: "103.22.44.55", location: "Singapore", lastActive: "2h ago", current: false },
];

const loginHistory = [
  { date: "14 Sep 2024 11:42", device: "MacBook Pro · Chrome", ip: "103.22.44.11", status: "success" },
  { date: "13 Sep 2024 09:00", device: "MacBook Pro · Chrome", ip: "103.22.44.11", status: "success" },
  { date: "12 Sep 2024 08:15", device: "iPhone 15 · Safari", ip: "103.22.44.55", status: "success" },
  { date: "11 Sep 2024 22:30", device: "Unknown Device", ip: "58.182.33.99", status: "failed" },
];

const statusColor: Record<string, string> = {
  pending: "#F5B300",
  approved: "#22C55E",
  rejected: "#EF4444",
  expired: "#555",
  open: "#E85D04",
  "in-progress": "#3B82F6",
  resolved: "#22C55E",
  closed: "#555",
};

const priorityStyle: Record<string, string> = {
  high: "text-red-400 bg-red-950/30 border border-red-800/30",
  medium: "text-yellow-400 bg-yellow-950/30 border border-yellow-800/30",
  low: "text-[#555] bg-[#1A1A1A] border border-[#2A2A2A]",
};

export default function Settings({ demoMode, initialTab, user }: { demoMode?: boolean; initialTab?: string; user?: UserAccount } = {}) {
  const currentUser = user ? {
    name: user.name,
    title: user.role,
    department: user.department,
    role: user.role,
    email: user.email,
    phone: "Not provided",
    employeeId: user.id,
    about: `${user.role} in the ${user.department} department.`,
    initials: user.name.split(" ").map(part => part[0]).join("").slice(0, 2).toUpperCase(),
    accessGrantedBy: "Super Admin",
    lastPermissionChange: "Current session",
    permittedModules: user.permissions,
  } : defaultUser;
  const isSuperAdmin = currentUser.role === "Super Admin";
  const [activeTab, setActiveTab] = useState<SettingsTab>((initialTab as SettingsTab) ?? "profile");
  const [name, setName] = useState(currentUser.name);
  const [title, setTitle] = useState(currentUser.title);
  const [phone, setPhone] = useState(currentUser.phone);
  const [about, setAbout] = useState(currentUser.about);
  const [saved, setSaved] = useState(false);
  const [twoFAEnabled, setTwoFAEnabled] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [inAppAlerts, setInAppAlerts] = useState(true);
  const [waAlerts, setWaAlerts] = useState(false);
  const [newRequestModal, setNewRequestModal] = useState(demoMode ?? false);
  const [newEscModal, setNewEscModal] = useState(false);
  const [suspendModal, setSuspendModal] = useState<string | null>(null);
  const [reqSuccess, setReqSuccess] = useState(false);
  const [escSuccess, setEscSuccess] = useState(false);
  const [suspendSuccess, setSuspendSuccess] = useState<string | null>(null);
  const [inviteModal, setInviteModal] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState<string | null>(null);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Operations Executive");

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#F5B300]/10 border border-[#F5B300]/30 flex items-center justify-center text-[#F5B300] font-extrabold text-lg">
            {currentUser.initials}
          </div>
          <div>
            <h2 className="text-xl font-extrabold">{currentUser.name}</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs mono text-[#F5B300] font-bold">{currentUser.role}</span>
              <span className="text-xs text-[#555]">·</span>
              <span className="text-xs text-[#888]">{currentUser.department}</span>
              <span className="text-xs text-[#555]">·</span>
              <span className="text-xs mono text-[#555]">{currentUser.employeeId}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="flex border-b border-[#2A2A2A] overflow-x-auto">
        {settingsTabs.filter(t => !t.adminOnly || isSuperAdmin).map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs mono border-b-2 whitespace-nowrap transition-colors ${activeTab === t.id ? "border-[#F5B300] text-[#F5B300]" : "border-transparent text-[#BBBBBB] hover:text-[#FFFFFF]"}`}>
            <span>{t.icon}</span>
            <span>{t.label}</span>
            {t.adminOnly && <span className="text-[10px] text-[#E85D04] border border-[#E85D04]/40 px-1 py-0.5 leading-none">SA</span>}
          </button>
        ))}
      </div>

      {/* ── MY PROFILE ── */}
      {activeTab === "profile" && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="col-span-2 space-y-4">
            <div className="border border-[#2A2A2A] bg-[#181818] p-5 space-y-4">
              <div className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider border-b border-[#2A2A2A] pb-2 mb-3">Personal Information</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "Full Name", value: name, onChange: setName },
                  { label: "Job Title", value: title, onChange: setTitle },
                  { label: "Phone", value: phone, onChange: setPhone },
                ].map(f => (
                  <div key={f.label} className="space-y-1">
                    <label className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider">{f.label}</label>
                    <input value={f.value} onChange={e => f.onChange(e.target.value)}
                      className="w-full bg-[#0F0F0F] border border-[#2A2A2A] text-[#E8E8E8] text-sm px-3 py-2 mono outline-none focus:border-[#555]" />
                  </div>
                ))}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider">Email</label>
                  <input value={currentUser.email} disabled
                    className="w-full bg-[#141414] border border-[#2A2A2A] text-[#555] text-sm px-3 py-2 mono cursor-not-allowed" />
                  <div className="text-[10px] text-[#555]">Email managed by IT Admin</div>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider">About / Internal Profile Description</label>
                <textarea value={about} onChange={e => setAbout(e.target.value)} rows={3}
                  className="w-full bg-[#0F0F0F] border border-[#2A2A2A] text-[#E8E8E8] text-sm px-3 py-2 outline-none focus:border-[#555] resize-none" />
              </div>
              <div className="flex items-center justify-between pt-2">
                <div className="text-xs text-[#555]">Changes are logged in the Audit Trail</div>
                <button onClick={handleSave}
                  className="bg-[#F5B300] text-black text-xs font-bold px-5 py-2 mono hover:bg-yellow-400 transition-colors">
                  {saved ? "Saved ✓" : "Save Changes"}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {/* Read-only role info */}
            <div className="border border-[#2A2A2A] bg-[#181818] p-4 space-y-3">
              <div className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider">Account Details</div>
              {[
                { label: "Department", value: currentUser.department },
                { label: "Role", value: currentUser.role, highlight: true },
                { label: "Employee ID", value: currentUser.employeeId },
                { label: "Access Granted By", value: currentUser.accessGrantedBy },
              ].map(f => (
                <div key={f.label} className="flex items-center justify-between py-1.5 border-b border-[#2A2A2A] last:border-0">
                  <span className="text-xs text-[#DDDDDD]">{f.label}</span>
                  <span className={`text-xs font-semibold ${f.highlight ? "text-[#F5B300] mono" : "text-[#CCCCCC]"}`}>{f.value}</span>
                </div>
              ))}
            </div>

            <div className="border border-[#2A2A2A] bg-[#181818] px-4 py-3">
              <div className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider mb-2">Profile Photo</div>
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-[#F5B300]/10 border border-[#F5B300]/30 flex items-center justify-center text-[#F5B300] font-extrabold text-xl">
                  {currentUser.initials}
                </div>
                <button className="text-xs border border-[#2A2A2A] text-[#888] px-3 py-2 mono hover:border-[#555] transition-colors">
                  Upload Photo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── SECURITY ── */}
      {activeTab === "security" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Password change */}
          <div className="border border-[#2A2A2A] bg-[#181818] p-5 space-y-4">
            <div className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider border-b border-[#2A2A2A] pb-2">Change Password</div>
            {["Current Password", "New Password", "Confirm New Password"].map(f => (
              <div key={f} className="space-y-1">
                <label className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider">{f}</label>
                <input type="password" placeholder="••••••••"
                  className="w-full bg-[#0F0F0F] border border-[#2A2A2A] text-[#E8E8E8] text-sm px-3 py-2 mono outline-none focus:border-[#555] placeholder:text-[#333]" />
              </div>
            ))}
            <button className="w-full py-2 bg-[#F5B300] text-black text-xs font-bold mono hover:bg-yellow-400 transition-colors">
              Update Password
            </button>
          </div>

          <div className="space-y-4">
            {/* 2FA */}
            <div className="border border-[#2A2A2A] bg-[#181818] p-5">
              <div className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider border-b border-[#2A2A2A] pb-2 mb-4">Two-Factor Authentication</div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-[#E8E8E8]">Authenticator App</div>
                  <div className="text-xs text-[#555] mt-0.5">Google Authenticator / Authy</div>
                </div>
                <button
                  onClick={() => setTwoFAEnabled(p => !p)}
                  title={twoFAEnabled ? "Disable 2FA" : "Enable 2FA"}
                  style={{
                    position: "relative",
                    width: 52,
                    height: 30,
                    borderRadius: 999,
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    background: twoFAEnabled
                      ? "linear-gradient(135deg, #F5B300 0%, #E8A800 100%)"
                      : "#2A2A2A",
                    boxShadow: twoFAEnabled
                      ? "0 0 0 1px rgba(245,179,0,0.4), inset 0 1px 2px rgba(0,0,0,0.2)"
                      : "inset 0 1px 3px rgba(0,0,0,0.5)",
                    transition: "background 0.25s ease",
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      top: 3,
                      left: twoFAEnabled ? 25 : 3,
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      background: "#FFFFFF",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.35), 0 0 0 0.5px rgba(0,0,0,0.08)",
                      transition: "left 0.25s cubic-bezier(0.4,0,0.2,1)",
                      display: "block",
                    }}
                  />
                </button>
              </div>
              {twoFAEnabled && <div className="mt-3 text-xs text-green-400 mono">✓ 2FA active — account protected</div>}
            </div>

            {/* Active sessions */}
            <div className="border border-[#2A2A2A] bg-[#181818] p-5">
              <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-2 mb-4">
                <div className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider">Active Sessions</div>
                <button className="text-xs text-red-400 border border-red-800/40 px-2 py-1 mono hover:bg-red-950/30 transition-colors">
                  Sign Out All Others
                </button>
              </div>
              {activeSessions.map((s, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-[#2A2A2A] last:border-0">
                  <div>
                    <div className="text-xs font-medium text-[#E8E8E8]">{s.device}</div>
                    <div className="text-xs text-[#555] mono">{s.ip} · {s.location}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs mono" style={{ color: s.current ? "#22C55E" : "#888" }}>{s.lastActive}</div>
                    {s.current && <div className="text-[10px] text-[#555]">This device</div>}
                  </div>
                </div>
              ))}
            </div>

            {/* Login history */}
            <div className="border border-[#2A2A2A] bg-[#181818] p-5">
              <div className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider border-b border-[#2A2A2A] pb-2 mb-4">Login History</div>
              {loginHistory.map((h, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-[#2A2A2A] last:border-0">
                  <div>
                    <div className="text-xs text-[#888]">{h.device}</div>
                    <div className="text-xs mono text-[#555]">{h.ip}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs mono text-[#555]">{h.date}</div>
                    <div className={`text-[10px] font-bold uppercase ${h.status === "success" ? "text-green-400" : "text-red-400"}`}>{h.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── NOTIFICATIONS ── */}
      {activeTab === "notifications" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="border border-[#2A2A2A] bg-[#181818] p-5 space-y-4">
            <div className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider border-b border-[#2A2A2A] pb-2">Alert Channels</div>
            {[
              { label: "Email Alerts", sub: "jerome@performancemeals.sg", value: emailAlerts, set: setEmailAlerts },
              { label: "In-App Alerts", sub: "Push notifications in portal", value: inAppAlerts, set: setInAppAlerts },
              { label: "WhatsApp Alerts", sub: "+65 9111 2233 (requires authorization)", value: waAlerts, set: setWaAlerts },
            ].map(n => (
              <div key={n.label} className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-[#E8E8E8]">{n.label}</div>
                  <div className="text-xs text-[#555] mt-0.5">{n.sub}</div>
                </div>
                <button
                  onClick={() => n.set((p: boolean) => !p)}
                  style={{
                    position: "relative",
                    width: 52,
                    height: 30,
                    borderRadius: 999,
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    background: n.value
                      ? "linear-gradient(135deg, #F5B300 0%, #E8A800 100%)"
                      : "#2A2A2A",
                    boxShadow: n.value
                      ? "0 0 0 1px rgba(245,179,0,0.4), inset 0 1px 2px rgba(0,0,0,0.2)"
                      : "inset 0 1px 3px rgba(0,0,0,0.5)",
                    transition: "background 0.25s ease",
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      top: 3,
                      left: n.value ? 25 : 3,
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      background: "#FFFFFF",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.35), 0 0 0 0.5px rgba(0,0,0,0.08)",
                      transition: "left 0.25s cubic-bezier(0.4,0,0.2,1)",
                      display: "block",
                    }}
                  />
                </button>
              </div>
            ))}
          </div>

          <div className="border border-[#2A2A2A] bg-[#181818] p-5 space-y-3">
            <div className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider border-b border-[#2A2A2A] pb-2 mb-2">Operational Alert Preferences</div>
            {[
              { label: "Failed Payments", owner: "Finance / Operations" },
              { label: "Menu Deadline Approaching", owner: "Meal Plans / Support" },
              { label: "Low Stock Warning", owner: "Kitchen / Procurement" },
              { label: "Failed Delivery", owner: "Delivery / Support" },
              { label: "Refund Requests", owner: "Finance" },
              { label: "Permission Requests", owner: "Dept Head / Super Admin" },
              { label: "Critical Escalations", owner: "Operations" },
            ].map(a => (
              <div key={a.label} className="flex items-center justify-between py-1.5 border-b border-[#2A2A2A] last:border-0">
                <div>
                  <div className="text-xs text-[#E8E8E8]">{a.label}</div>
                  <div className="text-[10px] text-[#555] mono">{a.owner}</div>
                </div>
                <div className="w-4 h-4 border border-[#F5B300] flex items-center justify-center">
                  <div className="w-2 h-2 bg-[#F5B300]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── MY ACCESS ── */}
      {activeTab === "my-access" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="border border-[#2A2A2A] bg-[#181818] p-5 space-y-4">
            <div className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider border-b border-[#2A2A2A] pb-2">Current Access</div>
            {[
              { label: "Department", value: currentUser.department },
              { label: "Role", value: currentUser.role, accent: true },
              { label: "Access Granted By", value: currentUser.accessGrantedBy },
              { label: "Last Permission Change", value: currentUser.lastPermissionChange },
            ].map(f => (
              <div key={f.label} className="flex items-center justify-between py-1.5 border-b border-[#2A2A2A] last:border-0">
                <span className="text-xs text-[#DDDDDD]">{f.label}</span>
                <span className={`text-xs font-semibold ${f.accent ? "text-[#F5B300] mono" : "text-[#CCCCCC]"}`}>{f.value}</span>
              </div>
            ))}
          </div>

          <div className="border border-[#2A2A2A] bg-[#181818] p-5">
            <div className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider border-b border-[#2A2A2A] pb-2 mb-3">Modules I Can Access</div>
            <div className="bg-green-950/10 border border-green-800/30 px-3 py-2 mb-3">
              <div className="text-xs font-bold text-green-400 mono">Super Admin · Full Access</div>
              <div className="text-xs text-[#555] mt-1">All modules, all permissions, all departments</div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {["Operations", "Ready Series", "Meal Plans", "Subscribers", "Kitchen", "Inventory", "Procurement", "Dispatch", "Support", "Finance", "Marketing", "Reports", "ACL", "Audit Logs", "Settings", "Business Rules"].map(m => (
                <span key={m} className="text-xs mono px-2 py-0.5 border border-[#2A2A2A] text-[#888]">{m}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── PERMISSION REQUESTS ── */}
      {activeTab === "permission-requests" && (
        <div className="space-y-4">
          {reqSuccess && (
            <div className="border border-green-800/40 bg-green-950/20 px-4 py-2.5 text-xs text-green-400 mono font-bold">
              ✓ Request submitted — pending approval · Logged to Audit Trail
            </div>
          )}
          <div className="flex items-center justify-between">
            <div className="text-xs text-[#555]">Manage and review module access requests</div>
            <button onClick={() => setNewRequestModal(true)}
              className="bg-[#F5B300] text-black text-xs font-bold px-4 py-2 mono hover:bg-yellow-400 transition-colors">
              + New Request
            </button>
          </div>

          <div className="border border-[#2A2A2A] bg-[#181818] overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2A2A2A]">
                  {["ID", "Requested By", "Dept", "Module", "Permission", "Reason", "Status", "Approved By", "Date"].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left text-xs font-bold text-[#FFFFFF] uppercase tracking-wider font-medium whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {permissionRequests.map((r, i) => (
                  <tr key={r.id} className={`border-b border-[#2A2A2A] hover:bg-[#1F1F1F] transition-colors ${i % 2 === 0 ? "" : "bg-[#141414]"}`}>
                    <td className="px-4 py-2.5 mono text-xs text-[#F5B300]">{r.id}</td>
                    <td className="px-4 py-2.5 font-medium">{r.requestedBy}</td>
                    <td className="px-4 py-2.5 text-xs text-[#888]">{r.dept}</td>
                    <td className="px-4 py-2.5 text-xs mono text-[#888]">{r.module}</td>
                    <td className="px-4 py-2.5 text-xs mono">{r.permission}</td>
                    <td className="px-4 py-2.5 text-xs text-[#555] max-w-xs truncate">{r.reason}</td>
                    <td className="px-4 py-2.5">
                      <span className="text-xs mono font-bold capitalize px-2 py-0.5" style={{ color: statusColor[r.status] }}>{r.status}</span>
                    </td>
                    <td className="px-4 py-2.5 text-xs text-[#555]">{r.approvedBy ?? "—"}</td>
                    <td className="px-4 py-2.5 mono text-xs text-[#555]">{r.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* New request modal */}
          {newRequestModal && (
            <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
              <div className="border border-[#2A2A2A] bg-[#181818] w-full max-w-md p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-3">
                  <span className="font-bold text-[#E8E8E8]">New Permission Request</span>
                  <button onClick={() => setNewRequestModal(false)} className="text-[#555] hover:text-[#888] text-xl leading-none">×</button>
                </div>
                {[
                  { label: "Module", type: "select", options: ["Operations", "Ready Series Orders", "Meal Plans", "Kitchen", "Inventory", "Finance", "Reports", "Dispatch", "Support", "Marketing"] },
                  { label: "Permission Required", type: "select", options: ["View", "Create", "Edit", "Delete", "Approve", "Export", "Assign", "Execute"] },
                  { label: "Request Type", type: "select", options: ["New Module Access", "Additional Permission", "Temporary Access", "Access to Another Workflow"] },
                ].map(f => (
                  <div key={f.label} className="space-y-1">
                    <label className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider">{f.label}</label>
                    <select className="w-full bg-[#0F0F0F] border border-[#2A2A2A] text-[#E8E8E8] text-sm px-3 py-2 mono outline-none">
                      {f.options.map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider">Reason</label>
                  <textarea rows={3} placeholder="Describe why this access is needed..."
                    className="w-full bg-[#0F0F0F] border border-[#2A2A2A] text-[#E8E8E8] text-sm px-3 py-2 outline-none focus:border-[#555] resize-none placeholder:text-[#333]" />
                </div>
                <div className="border border-[#2A2A2A] bg-[#0F0F0F] px-3 py-2 text-xs text-[#555]">
                  Request will be sent to your Department Head and Super Admin for approval.
                </div>
                <div className="flex gap-2 pt-2">
                  <button onClick={() => setNewRequestModal(false)} className="flex-1 py-2 border border-[#2A2A2A] text-[#888] text-xs mono hover:border-[#555] transition-colors">Cancel</button>
                  <button onClick={() => { setNewRequestModal(false); setReqSuccess(true); setTimeout(() => setReqSuccess(false), 4000); }}
                    className="flex-1 py-2 bg-[#F5B300] text-black text-xs font-bold mono hover:bg-yellow-400 transition-colors">Submit Request</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── ESCALATION REQUESTS ── */}
      {activeTab === "escalation-requests" && (
        <div className="space-y-4">
          {escSuccess && (
            <div className="border border-green-800/40 bg-green-950/20 px-4 py-2.5 text-xs text-green-400 mono font-bold">
              ✓ Escalation submitted — assigned to the relevant team · Logged to Audit Trail
            </div>
          )}
          <div className="flex items-center justify-between">
            <div className="text-xs text-[#555]">Raise and track escalation requests to Department Heads or Super Admin</div>
            <button onClick={() => setNewEscModal(true)}
              className="bg-[#E85D04] text-white text-xs font-bold px-4 py-2 mono hover:bg-orange-600 transition-colors">
              + Raise Escalation
            </button>
          </div>

          <div className="border border-[#2A2A2A] bg-[#181818] overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2A2A2A]">
                  {["ID", "Title", "Type", "Priority", "Raised By", "Dept", "Assigned To", "Status", "Date"].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left text-xs font-bold text-[#FFFFFF] uppercase tracking-wider font-medium whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {escalationRequests.map((e, i) => (
                  <tr key={e.id} className={`border-b border-[#2A2A2A] hover:bg-[#1F1F1F] transition-colors ${i % 2 === 0 ? "" : "bg-[#141414]"}`}>
                    <td className="px-4 py-2.5 mono text-xs text-[#E85D04]">{e.id}</td>
                    <td className="px-4 py-2.5 text-xs font-medium max-w-xs">{e.title}</td>
                    <td className="px-4 py-2.5 text-xs text-[#888]">{e.type}</td>
                    <td className="px-4 py-2.5">
                      <span className={`text-xs mono px-2 py-0.5 font-bold capitalize ${priorityStyle[e.priority]}`}>{e.priority}</span>
                    </td>
                    <td className="px-4 py-2.5 text-xs">{e.raisedBy}</td>
                    <td className="px-4 py-2.5 text-xs text-[#888]">{e.dept}</td>
                    <td className="px-4 py-2.5 text-xs text-[#888]">{e.assignedTo}</td>
                    <td className="px-4 py-2.5">
                      <span className="text-xs mono font-bold capitalize" style={{ color: statusColor[e.status] }}>{e.status.replace("-", " ")}</span>
                    </td>
                    <td className="px-4 py-2.5 mono text-xs text-[#555]">{e.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {newEscModal && (
            <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
              <div className="border border-[#2A2A2A] bg-[#181818] w-full max-w-md p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-3">
                  <span className="font-bold text-[#E8E8E8]">Raise Escalation</span>
                  <button onClick={() => setNewEscModal(false)} className="text-[#555] hover:text-[#888] text-xl leading-none">×</button>
                </div>
                {[
                  { label: "Type", options: ["Refund Approval", "Customer Exception", "Inventory Override", "Delivery Exception", "Permission Issue", "Other"] },
                  { label: "Priority", options: ["High", "Medium", "Low"] },
                  { label: "Escalate To", options: ["Department Head", "Operations Manager", "Finance", "Super Admin"] },
                ].map(f => (
                  <div key={f.label} className="space-y-1">
                    <label className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider">{f.label}</label>
                    <select className="w-full bg-[#0F0F0F] border border-[#2A2A2A] text-[#E8E8E8] text-sm px-3 py-2 mono outline-none">
                      {f.options.map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider">Description</label>
                  <textarea rows={3} placeholder="Describe the issue requiring escalation..."
                    className="w-full bg-[#0F0F0F] border border-[#2A2A2A] text-[#E8E8E8] text-sm px-3 py-2 outline-none resize-none placeholder:text-[#333]" />
                </div>
                <div className="flex gap-2 pt-2">
                  <button onClick={() => setNewEscModal(false)} className="flex-1 py-2 border border-[#2A2A2A] text-[#888] text-xs mono hover:border-[#555] transition-colors">Cancel</button>
                  <button onClick={() => { setNewEscModal(false); setEscSuccess(true); setTimeout(() => setEscSuccess(false), 4000); }}
                    className="flex-1 py-2 bg-[#E85D04] text-white text-xs font-bold mono hover:bg-orange-600 transition-colors">Submit</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── TEAM MANAGEMENT ── */}
      {activeTab === "team" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-[#E8E8E8]">Team Management</div>
              <div className="text-xs text-[#555] mt-0.5">Department Heads manage their own team only. Super Admin manages all.</div>
            </div>
            <button onClick={() => setInviteModal(true)}
              className="bg-[#F5B300] text-black text-xs font-bold px-4 py-2 mono hover:bg-yellow-400 transition-colors">
              + Invite Member
            </button>
          </div>

          {inviteSuccess && (
            <div className="border border-green-800/40 bg-green-950/20 px-4 py-2.5 text-xs text-green-400 mono font-bold">
              ✓ {inviteSuccess}
            </div>
          )}
          {suspendSuccess && (
            <div className="border border-green-800/40 bg-green-950/20 px-4 py-2.5 text-xs text-green-400 mono font-bold">
              ✓ {suspendSuccess} suspended · Audit entry created
            </div>
          )}

          <div className="border border-[#E85D04]/30 bg-[#181818] px-4 py-2.5 text-xs text-[#888]">
            <span className="text-[#E85D04] font-bold">ACL Rule:</span> Department Heads can only invite/remove members within their own department. They cannot grant cross-department access.
          </div>

          <div className="border border-[#2A2A2A] bg-[#181818] overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2A2A2A]">
                  {["Name", "Role", "Department", "Status", "Last Active", "Actions"].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left text-xs font-bold text-[#FFFFFF] uppercase tracking-wider font-medium whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {teamMembers.map((u, i) => (
                  <tr key={u.id} className={`border-b border-[#2A2A2A] hover:bg-[#1F1F1F] transition-colors ${i % 2 === 0 ? "" : "bg-[#141414]"}`}>
                    <td className="px-4 py-2.5 font-medium">{u.name}</td>
                    <td className="px-4 py-2.5 text-xs text-[#888]">{u.role}</td>
                    <td className="px-4 py-2.5 text-xs text-[#555]">{u.dept}</td>
                    <td className="px-4 py-2.5">
                      <span className={`text-xs mono font-bold px-2 py-0.5 ${u.status === "Active" ? "text-green-400 bg-green-950/30" : "text-red-400 bg-red-950/30"}`}>{u.status}</span>
                    </td>
                    <td className="px-4 py-2.5 mono text-xs text-[#555]">{u.lastActive}</td>
                    <td className="px-4 py-2.5">
                      <div className="flex gap-1">
                        <button className="text-xs border border-[#2A2A2A] text-[#888] px-2 py-1 mono hover:border-[#F5B300] hover:text-[#F5B300] transition-colors">Edit Role</button>
                        <button onClick={() => setSuspendModal(u.id)}
                          className={`text-xs border px-2 py-1 mono transition-colors ${u.status === "Active" ? "border-red-800/40 text-red-400 hover:bg-red-950/30" : "border-green-800/40 text-green-400 hover:bg-green-950/30"}`}>
                          {u.status === "Active" ? "Suspend" : "Restore"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Invite member modal */}
          {inviteModal && (
            <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
              <div className="border border-[#2A2A2A] bg-[#181818] w-full max-w-md p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-3">
                  <span className="font-bold text-[#E8E8E8]">Invite Team Member</span>
                  <button onClick={() => setInviteModal(false)} className="text-[#555] hover:text-[#888] text-xl leading-none">×</button>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider">Full Name</label>
                  <input value={inviteName} onChange={e => setInviteName(e.target.value)} placeholder="e.g. Wei Jie Lim"
                    className="w-full bg-[#0F0F0F] border border-[#2A2A2A] text-[#E8E8E8] text-sm px-3 py-2 mono outline-none focus:border-[#555] placeholder:text-[#333]" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider">Email</label>
                  <input value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="email@performancemeals.sg"
                    className="w-full bg-[#0F0F0F] border border-[#2A2A2A] text-[#E8E8E8] text-sm px-3 py-2 mono outline-none focus:border-[#555] placeholder:text-[#333]" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider">Role</label>
                  <select value={inviteRole} onChange={e => setInviteRole(e.target.value)}
                    className="w-full bg-[#0F0F0F] border border-[#2A2A2A] text-[#E8E8E8] text-sm px-3 py-2 mono outline-none">
                    {["Operations Executive", "Kitchen Manager", "Delivery Manager", "Finance Manager", "Marketing Manager", "Support Agent", "Department Head"].map(r => (
                      <option key={r}>{r}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2 pt-2">
                  <button onClick={() => setInviteModal(false)} className="flex-1 py-2 border border-[#2A2A2A] text-[#888] text-xs mono hover:border-[#555] transition-colors">Cancel</button>
                  <button onClick={() => { const email = inviteEmail || "team member"; setInviteModal(false); setInviteSuccess(`Invite sent to ${email}`); setInviteName(""); setInviteEmail(""); setTimeout(() => setInviteSuccess(null), 4000); }}
                    className="flex-1 py-2 bg-[#F5B300] text-black text-xs font-bold mono hover:bg-yellow-400 transition-colors">Confirm Invite</button>
                </div>
              </div>
            </div>
          )}

          {/* Suspend confirmation modal */}
          {suspendModal && (
            <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
              <div className="border border-red-800/40 bg-[#181818] w-full max-w-sm p-6 space-y-4">
                <div className="font-bold text-[#E8E8E8]">Confirm Action</div>
                <p className="text-sm text-[#888]">
                  Are you sure you want to suspend <span className="text-[#E8E8E8] font-semibold">{teamMembers.find(u => u.id === suspendModal)?.name}</span>? Their access will be revoked immediately.
                </p>
                <div className="border border-[#2A2A2A] bg-[#0F0F0F] px-3 py-2 text-xs text-[#555] mono">
                  This action will be logged in the Audit Trail.
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setSuspendModal(null)} className="flex-1 py-2 border border-[#2A2A2A] text-[#888] text-xs mono">Cancel</button>
                  <button onClick={() => { const userName = teamMembers.find(u => u.id === suspendModal)?.name ?? "User"; setSuspendModal(null); setSuspendSuccess(userName); setTimeout(() => setSuspendSuccess(null), 4000); }}
                    className="flex-1 py-2 bg-red-900 border border-red-700 text-red-200 text-xs font-bold mono hover:bg-red-800 transition-colors">Confirm Suspend</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── SYSTEM SETTINGS ── */}
      {activeTab === "system" && (
        <div className="space-y-5">
          <div className="border border-[#E85D04]/30 bg-[#181818] px-4 py-2.5 text-xs text-[#888]">
            <span className="text-[#E85D04] font-bold">Super Admin Only:</span> These settings affect the entire platform. All changes are logged.
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Global rules */}
            <div className="border border-[#2A2A2A] bg-[#181818] p-5 space-y-3">
              <div className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider border-b border-[#2A2A2A] pb-2">Global Configuration</div>
              {[
                { label: "Menu Cutoff Day", value: "Thursday" },
                { label: "Menu Cutoff Time", value: "13:00 SGT" },
                { label: "Max Pause Duration", value: "4 weeks" },
                { label: "Min Pause Duration", value: "1 week" },
                { label: "Bi-Weekly Billing Rate", value: "$168 / cycle" },
                { label: "Monthly Billing Rate", value: "$336 / cycle" },
                { label: "Free Delivery Threshold", value: "Configurable" },
              ].map(f => (
                <div key={f.label} className="flex items-center justify-between py-1.5 border-b border-[#2A2A2A] last:border-0">
                  <span className="text-xs text-[#DDDDDD]">{f.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs mono font-bold text-[#F5B300]">{f.value}</span>
                    <button className="text-xs border border-[#3A3A3A] text-[#AAAAAA] px-2 py-0.5 mono hover:border-[#F5B300] hover:text-[#F5B300] transition-colors">Edit</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Shopify integration */}
            <div className="space-y-4">
              <div className="border border-[#2A2A2A] bg-[#181818] p-5 space-y-3">
                <div className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider border-b border-[#2A2A2A] pb-2">Shopify Integration</div>
                <div className="border border-yellow-800/30 bg-yellow-950/10 px-3 py-2 text-xs text-yellow-300 mono">
                  ℹ This portal is the Operations Engine. Shopify is the Commerce Engine. Payment execution never occurs here.
                </div>
                {[
                  { label: "Shopify Store", value: "performancemeals.myshopify.com", status: "connected" },
                  { label: "Webhook Status", value: "Active", status: "connected" },
                  { label: "Last Sync", value: `${new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })} ${new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`, status: "ok" },
                  { label: "Order Sync", value: "Real-time", status: "ok" },
                ].map(f => (
                  <div key={f.label} className="flex items-center justify-between py-1.5 border-b border-[#2A2A2A] last:border-0">
                    <span className="text-xs text-[#DDDDDD]">{f.label}</span>
                    <span className="text-xs mono text-green-400">{f.value}</span>
                  </div>
                ))}
              </div>

              <div className="border border-[#2A2A2A] bg-[#181818] p-5 space-y-3">
                <div className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider border-b border-[#2A2A2A] pb-2">Notification Policy</div>
                {[
                  { label: "Auto-notify on Failed Delivery", value: "On" },
                  { label: "Auto-notify on Low Stock", value: "On" },
                  { label: "Permission Request Routing", value: "Dept Head → Super Admin" },
                  { label: "Escalation SLA", value: "To be configured" },
                  { label: "Auto-Approve Refunds", value: "Off (manual only)" },
                ].map(f => (
                  <div key={f.label} className="flex items-center justify-between py-1.5 border-b border-[#2A2A2A] last:border-0">
                    <span className="text-xs text-[#DDDDDD]">{f.label}</span>
                    <span className="text-xs mono text-[#CCCCCC]">{f.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* System Scope Reference */}
          <div className="border border-[#2A2A2A] bg-[#181818] p-5">
            <div className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider border-b border-[#2A2A2A] pb-2 mb-4 display">System Scope — Implementation Reference</div>
            <p className="text-xs text-[#555] mb-4 mono">Shopify remains the commerce system of record. This platform manages operational and Meal Plan workflows around Shopify.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Phase 1 Core */}
              <div className="border border-green-900/40 bg-green-950/10 p-4">
                <div className="text-xs font-bold text-green-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full" />
                  Phase 1 Core
                </div>
                {["Meal Plan Automation", "Subscription Management", "Default Delivery Days", "Pause Management", "Menu / Date Validation", "Order Generation", "Delivery Scheduling", "Kitchen Operations", "Wallet / Credit Logic", "Admin Menu Changes", "Refund Workflow", "Transaction Description Editing", "Audit Logging", "WhatsApp Notifications", "Shopify Integration Boundaries"].map(item => (
                  <div key={item} className="flex items-start gap-1.5 mb-1">
                    <span className="text-green-600 mt-0.5 text-[10px]">✓</span>
                    <span className="text-xs text-[#AAAAAA]">{item}</span>
                  </div>
                ))}
              </div>

              {/* Shared Operations */}
              <div className="border border-blue-900/40 bg-blue-950/10 p-4">
                <div className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-blue-500 rounded-full" />
                  Shared Operations
                </div>
                {["Ready Series", "Orders", "Delivery", "Dispatch", "Customer Support", "Reporting", "Inventory", "Packaging", "Procurement", "Export Center"].map(item => (
                  <div key={item} className="flex items-start gap-1.5 mb-1">
                    <span className="text-blue-600 mt-0.5 text-[10px]">◆</span>
                    <span className="text-xs text-[#AAAAAA]">{item}</span>
                  </div>
                ))}
              </div>

              {/* Future / Deferred */}
              <div className="border border-[#2A2A2A] bg-[#141414] p-4">
                <div className="text-xs font-bold text-[#555] uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-[#333] rounded-full" />
                  Future / Deferred
                </div>
                {["Rider Mobile App", "Customer Mobile App", "ERP Expansion", "Advanced Business Intelligence", "Executive Analytics Dashboard", "Advanced Delivery Optimization", "Advanced Procurement Automation", "Advanced Marketing Automation", "Affiliate Management", "Other Non-Critical Enterprise Extensions"].map(item => (
                  <div key={item} className="flex items-start gap-1.5 mb-1">
                    <span className="text-[#333] mt-0.5 text-[10px]">○</span>
                    <span className="text-xs text-[#444]">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
