import { useState } from "react";

type Department =
  | "operations"
  | "kitchen"
  | "dispatch"
  | "finance"
  | "marketing"
  | "support"
  | "admin";

interface DeptConfig {
  label: string;
  accent: string;
  icon: string;
  roles: string[];
  access: string[];
  description: string;
}

const deptConfig: Record<Department, DeptConfig> = {
  operations: {
    label: "Operations",
    accent: "#F5B300",
    icon: "◉",
    roles: ["Operations Manager", "Operations Staff"],
    access: ["Dashboard", "Orders", "Subscriptions", "Fulfillment", "Reports"],
    description: "End-to-end order management, subscription oversight, and daily operations monitoring.",
  },
  kitchen: {
    label: "Kitchen",
    accent: "#E85D04",
    icon: "◈",
    roles: ["Head Chef", "Kitchen Staff", "Prep Staff"],
    access: ["Kitchen Queue", "Production Board", "Inventory", "Procurement", "Menu Planning"],
    description: "Production queues, ingredient management, and kitchen workflow for both RS and MP streams.",
  },
  dispatch: {
    label: "Dispatch",
    accent: "#3B82F6",
    icon: "⇢",
    roles: ["Dispatch Manager", "Dispatch Staff", "Rider"],
    access: ["Dispatch Center", "Delivery Hub", "Riders", "Failed Deliveries", "Export Center"],
    description: "Delivery assignment, rider management, and last-mile dispatch coordination.",
  },
  finance: {
    label: "Finance",
    accent: "#22C55E",
    icon: "₿",
    roles: ["Finance Manager", "Finance Officer"],
    access: ["Finance & Billing", "Refunds", "Wallet & Rewards", "Reports", "Billing Cycles"],
    description: "Billing oversight, refund approvals, revenue reporting. Read-only Shopify data view.",
  },
  marketing: {
    label: "Marketing",
    accent: "#A855F7",
    icon: "◎",
    roles: ["Marketing Manager", "Marketing Executive"],
    access: ["Marketing", "WhatsApp", "Notifications", "Customers (read-only)"],
    description: "Campaign management, WhatsApp communication, and customer engagement tools.",
  },
  support: {
    label: "Customer Support",
    accent: "#06B6D4",
    icon: "◎",
    roles: ["Support Manager", "Support Agent"],
    access: ["Customer Support", "Customer Success", "Customers", "Refunds (read-only)"],
    description: "Customer ticket resolution, escalation management, and satisfaction monitoring.",
  },
  admin: {
    label: "Admin / IT",
    accent: "#EF4444",
    icon: "⊛",
    roles: ["Super Admin", "System Admin"],
    access: ["All Modules", "Access Control", "Audit Logs", "Business Rules", "Settings"],
    description: "Full system access. ACL management, audit trail, and platform configuration.",
  },
};

const mockUsers: Record<Department, { name: string; email: string; role: string }[]> = {
  operations: [
    { name: "Jerome Lim", email: "jerome@performancemeals.sg", role: "Operations Manager" },
    { name: "Rachel Tan", email: "rachel.t@performancemeals.sg", role: "Operations Staff" },
  ],
  kitchen: [
    { name: "Chef Ravi Kumar", email: "ravi.k@performancemeals.sg", role: "Head Chef" },
    { name: "Mei Lin Ong", email: "meiling@performancemeals.sg", role: "Kitchen Staff" },
  ],
  dispatch: [
    { name: "Daniel Ng", email: "daniel.n@performancemeals.sg", role: "Dispatch Manager" },
    { name: "Ahmad Zaki", email: "ahmad@performancemeals.sg", role: "Rider" },
  ],
  finance: [
    { name: "Sarah Toh", email: "sarah.t@performancemeals.sg", role: "Finance Manager" },
    { name: "Kevin Wong", email: "kevin.w@performancemeals.sg", role: "Finance Officer" },
  ],
  marketing: [
    { name: "Priya Sharma", email: "priya.s@performancemeals.sg", role: "Marketing Manager" },
    { name: "Ben Chua", email: "ben.c@performancemeals.sg", role: "Marketing Executive" },
  ],
  support: [
    { name: "Natalie Foo", email: "natalie.f@performancemeals.sg", role: "Support Manager" },
    { name: "James Chia", email: "james.c@performancemeals.sg", role: "Support Agent" },
  ],
  admin: [
    { name: "System Admin", email: "admin@performancemeals.sg", role: "Super Admin" },
  ],
};

export default function DepartmentLogin({ demoMode }: { demoMode?: boolean } = {}) {
  const [selectedDept, setSelectedDept] = useState<Department | null>(demoMode ? "operations" : null);
  const [email, setEmail] = useState(demoMode ? "jerome@performancemeals.sg" : "");
  const [password, setPassword] = useState(demoMode ? "••••••••" : "");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<"not-found" | "mismatch" | "password" | null>(null);
  const [mismatchDept, setMismatchDept] = useState<Department | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);

  const dept = selectedDept ? deptConfig[selectedDept] : null;
  const deptUsers = selectedDept ? mockUsers[selectedDept] : [];

  const allUsers = (Object.entries(mockUsers) as [Department, typeof mockUsers.operations][]).flatMap(
    ([deptKey, list]) => list.map(u => ({ ...u, deptKey }))
  );

  const handleLogin = () => {
    if (demoMode) { setLoggedIn(true); setLoginError(null); return; }
    const found = allUsers.find(u => u.email === email);
    if (!found) { setLoginError("not-found"); return; }
    if (found.deptKey !== selectedDept) {
      setLoginError("mismatch");
      setMismatchDept(found.deptKey);
      return;
    }
    if (!password || password.length < 3) { setLoginError("password"); return; }
    setLoggedIn(true);
    setLoginError(null);
  };

  if (loggedIn && dept && selectedDept) {
    const user = allUsers.find(u => u.email === email) ?? deptUsers[0];
    return (
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold">Department Login</h2>
          <button onClick={() => { setLoggedIn(false); setSelectedDept(null); setEmail(""); setPassword(""); }}
            className="text-xs border border-[#2A2A2A] text-[#888] px-3 py-1.5 mono hover:border-red-800 hover:text-red-400 transition-colors">
            ← Back to Login
          </button>
        </div>
        <div className="border bg-[#181818] p-6 max-w-lg" style={{ borderColor: dept.accent + "40" }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 flex items-center justify-center text-xl border" style={{ borderColor: dept.accent + "40", color: dept.accent }}>
              {dept.icon}
            </div>
            <div>
              <div className="text-xs font-bold text-[#FFFFFF] uppercase tracking-widest">Logged In · {dept.label} Department</div>
              <div className="font-extrabold text-[#E8E8E8]">{user.name}</div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mb-4">
            <div className="border border-[#2A2A2A] p-3">
              <div className="text-[#AAAAAA] uppercase tracking-wider mb-1">Role</div>
              <div className="font-semibold text-[#E8E8E8]">{user.role}</div>
            </div>
            <div className="border border-[#2A2A2A] p-3">
              <div className="text-[#AAAAAA] uppercase tracking-wider mb-1">Email</div>
              <div className="mono text-[#888]">{user.email}</div>
            </div>
          </div>
          <div className="border border-[#2A2A2A] p-3 mb-4">
            <div className="text-xs text-[#AAAAAA] uppercase tracking-wider mb-2">Permitted Modules</div>
            <div className="flex flex-wrap gap-1.5">
              {dept.access.map(a => (
                <span key={a} className="text-xs mono px-2 py-0.5 border border-[#2A2A2A] text-[#888]">{a}</span>
              ))}
            </div>
          </div>
          <div className="border border-green-800/30 bg-green-950/10 px-3 py-2 text-xs text-green-400 mono">
            ✓ Session active · All actions logged to Audit Trail
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold">Department Login</h2>
          <p className="text-xs text-[#555] mt-1">Select your department to access the admin portal</p>
        </div>
        <div className="text-right">
          <div className="text-xs mono text-[#555]">Performance Meals · Singapore</div>
          <div className="text-xs text-[#E85D04] mono font-bold">Admin Platform v3</div>
        </div>
      </div>

      {/* Department selector grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {(Object.entries(deptConfig) as [Department, DeptConfig][]).map(([key, cfg]) => (
          <button
            key={key}
            onClick={() => { setSelectedDept(key); setLoginError(null); }}
            className="border p-4 text-left transition-all"
            style={{
              borderColor: selectedDept === key ? cfg.accent : "#2A2A2A",
              backgroundColor: selectedDept === key ? cfg.accent + "10" : "#181818",
            }}
          >
            <div className="text-lg mb-2" style={{ color: selectedDept === key ? cfg.accent : "#555" }}>{cfg.icon}</div>
            <div className="text-sm font-bold text-[#E8E8E8]">{cfg.label}</div>
            <div className="text-xs text-[#555] mt-1">{cfg.roles.length} role{cfg.roles.length > 1 ? "s" : ""}</div>
          </button>
        ))}
      </div>

      {/* Login form — shown when dept selected */}
      {dept && selectedDept && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Form */}
          <div className="border bg-[#181818] p-5 space-y-4" style={{ borderColor: dept.accent + "40" }}>
            <div className="flex items-center gap-2 pb-3 border-b border-[#2A2A2A]">
              <span style={{ color: dept.accent }}>{dept.icon}</span>
              <span className="font-bold text-sm">{dept.label} — Sign In</span>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-[#AAAAAA] uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setLoginError(null); }}
                placeholder={deptUsers[0]?.email ?? "your@email.com"}
                className="w-full bg-[#0F0F0F] border border-[#2A2A2A] text-[#E8E8E8] text-sm px-3 py-2 mono outline-none focus:border-[#555] placeholder:text-[#333]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-[#AAAAAA] uppercase tracking-wider">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#0F0F0F] border border-[#2A2A2A] text-[#E8E8E8] text-sm px-3 py-2 mono outline-none focus:border-[#555] placeholder:text-[#333]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#555] hover:text-[#888]"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {loginError === "not-found" && (
              <div className="border border-red-800/40 bg-red-950/20 px-3 py-2 text-xs text-red-400 mono">
                ✕ Email not found in the system. Contact admin@performancemeals.sg
              </div>
            )}
            {loginError === "mismatch" && mismatchDept && (
              <div className="border-2 border-red-600 bg-red-950/30 px-3 py-2 space-y-1">
                <div className="text-xs font-bold text-red-400 mono uppercase tracking-wider">⛔ Access Denied — Department Mismatch</div>
                <div className="text-xs text-red-300">
                  Your credentials are valid but your account belongs to the{" "}
                  <strong>{deptConfig[mismatchDept].label}</strong> department.
                  You selected <strong>{dept.label}</strong>.
                </div>
                <div className="text-xs text-red-400/70 mono">
                  Please select the correct department tile or contact your department administrator.
                </div>
              </div>
            )}
            {loginError === "password" && (
              <div className="border border-red-800/40 bg-red-950/20 px-3 py-2 text-xs text-red-400 mono">
                ✕ Invalid password. Contact admin@performancemeals.sg to reset.
              </div>
            )}

            <button
              onClick={handleLogin}
              disabled={!email || !password}
              className="w-full py-2.5 text-sm font-bold mono transition-colors disabled:opacity-40"
              style={{ backgroundColor: dept.accent, color: "#000" }}
            >
              Sign In → {dept.label}
            </button>

            <div className="text-xs text-[#555] text-center">
              Forgot password? Contact <span className="mono text-[#888]">admin@performancemeals.sg</span>
            </div>
          </div>

          {/* Department info panel */}
          <div className="border border-[#2A2A2A] bg-[#181818] p-5 space-y-4">
            <div className="text-xs text-[#AAAAAA] uppercase tracking-wider mb-3">Department Access Summary</div>
            <p className="text-xs text-[#888]">{dept.description}</p>

            <div>
              <div className="text-xs text-[#AAAAAA] uppercase tracking-wider mb-2">Roles in This Department</div>
              {dept.roles.map(r => (
                <div key={r} className="flex items-center gap-2 py-1.5 border-b border-[#2A2A2A] last:border-0">
                  <div className="w-1 h-1 rounded-full" style={{ backgroundColor: dept.accent }} />
                  <span className="text-xs text-[#E8E8E8]">{r}</span>
                </div>
              ))}
            </div>

            <div>
              <div className="text-xs text-[#AAAAAA] uppercase tracking-wider mb-2">Permitted Modules</div>
              <div className="flex flex-wrap gap-1.5">
                {dept.access.map(a => (
                  <span key={a} className="text-xs mono px-2 py-0.5 border border-[#2A2A2A] text-[#888]">{a}</span>
                ))}
              </div>
            </div>

            <div className="border border-[#2A2A2A] bg-[#0F0F0F] px-3 py-2 space-y-1.5">
              <div className="text-xs font-bold text-[#AAAAAA] uppercase tracking-wider text-[10px]">Authentication Flow</div>
              {["Enter credentials", "System authenticates user", "System determines department & role", "System loads permitted modules"].map((step, i) => (
                <div key={step} className="flex items-center gap-2 text-[10px] mono text-[#555]">
                  <span className="text-[#333]">{i + 1}.</span>
                  <span>{step}</span>
                </div>
              ))}
              <div className="text-[10px] text-[#444] mono mt-1">⊟ All login events are recorded in the Audit Trail.</div>
            </div>
          </div>
        </div>
      )}

      {/* Quick-access user list */}
      {dept && selectedDept && (
        <div className="border border-[#2A2A2A] bg-[#181818]">
          <div className="px-4 py-2.5 border-b border-[#2A2A2A] flex items-center justify-between">
            <span className="text-xs text-[#AAAAAA] uppercase tracking-wider">Users in {dept.label} Department</span>
            <span className="text-[10px] mono text-[#444]">Demo: credentials must match assigned department</span>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2A2A2A]">
                {["Name", "Email", "Role", "Quick Fill"].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-xs text-[#AAAAAA] uppercase tracking-wider font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {deptUsers.map((u, i) => (
                <tr key={u.email} className={`border-b border-[#2A2A2A] hover:bg-[#1F1F1F] transition-colors ${i % 2 === 0 ? "" : "bg-[#141414]"}`}>
                  <td className="px-4 py-2.5 font-medium">{u.name}</td>
                  <td className="px-4 py-2.5 mono text-xs text-[#888]">{u.email}</td>
                  <td className="px-4 py-2.5 text-xs text-[#888]">{u.role}</td>
                  <td className="px-4 py-2.5">
                    <button
                      onClick={() => setEmail(u.email)}
                      className="text-xs mono border border-[#2A2A2A] text-[#555] px-2 py-1 hover:text-[#E8E8E8] hover:border-[#555] transition-colors"
                    >
                      Use →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
