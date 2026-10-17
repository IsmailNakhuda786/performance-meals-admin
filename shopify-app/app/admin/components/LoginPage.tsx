import { useState } from "react";
import type { Department, UserAccount } from "../accessControl";
import type { Theme } from "../App";

const departments: Department[] = [
  "Admin",
  "Operations",
  "Kitchen",
  "Dispatch",
  "Finance",
  "Customer Support",
];

interface Props {
  users: UserAccount[];
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  onLogin: (user: UserAccount) => void;
}

export default function LoginPage({ users, theme, onThemeChange, onLogin }: Props) {
  const [department, setDepartment] = useState<Department>("Admin");
  const [email, setEmail] = useState("admin@performancemeals.sg");
  const [password, setPassword] = useState("Admin123!");
  const [error, setError] = useState("");
  const [resetSent, setResetSent] = useState(false);

  const handleLogin = () => {
    const user = users.find(account => account.email.toLowerCase() === email.trim().toLowerCase());
    if (!user || user.password !== password) {
      setError("The email or password is incorrect.");
      return;
    }
    if (user.department !== department) {
      setError(`This account belongs to the ${user.department} department.`);
      return;
    }
    if (user.status !== "Active") {
      setError("This account is suspended. Contact a Super Admin.");
      return;
    }
    setError("");
    onLogin(user);
  };

  const fillDemo = (user: UserAccount) => {
    setDepartment(user.department);
    setEmail(user.email);
    setPassword(user.password);
    setError("");
  };

  return (
    <div
      className="pm-auth-shell min-h-screen p-4 sm:p-8"
      data-theme={theme}
      style={{ background: "var(--pm-bg)", color: "var(--pm-text)" }}
    >
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center">
        <div className="grid w-full overflow-hidden rounded-2xl border lg:grid-cols-[1.05fr_0.95fr]" style={{ background: "var(--pm-surface)", borderColor: "var(--pm-border)", boxShadow: "0 24px 70px rgba(16,24,40,0.12)" }}>
          <section className="relative hidden overflow-hidden p-10 lg:flex lg:flex-col lg:justify-between" style={{ background: "#F5B300", color: "#111827" }}>
            <div className="relative z-10">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-[#111827]" />
                <div>
                  <div className="font-display text-sm font-extrabold tracking-[0.16em]">PERFORMANCE</div>
                  <div className="mt-1 h-px bg-[#111827]" />
                  <div className="mt-1 text-right font-display text-[10px] font-bold tracking-[0.24em]">MEALS</div>
                </div>
              </div>
              <div className="mt-20 max-w-md">
                <p className="font-display text-sm font-bold uppercase tracking-[0.16em]">Operations workspace</p>
                <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight text-[#111827]">
                  Welcome back to Performance Meals.
                </h1>
                <p className="mt-5 max-w-sm text-sm leading-6 text-[#273142]">
                  Sign in with your assigned department account. Your workspace will only show modules granted to your role and user profile.
                </p>
              </div>
            </div>
            <div className="relative z-10 rounded-xl border border-black/10 bg-white/35 p-4 text-xs leading-5">
              Access is controlled by department, role, and individual module grants. Administrative changes are intended to be auditable.
            </div>
          </section>

          <section className="p-6 sm:p-10">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <div className="font-display text-xl font-bold">Sign in</div>
                <p className="mt-1 text-sm" style={{ color: "var(--pm-text-muted)" }}>Use your Performance Meals admin account.</p>
              </div>
              <div className="flex rounded-lg p-0.5" style={{ background: "var(--pm-surface-muted)", border: "1px solid var(--pm-border)" }}>
                {(["light", "dark"] as Theme[]).map(option => (
                  <button
                    key={option}
                    onClick={() => onThemeChange(option)}
                    className="rounded-md px-2.5 py-1.5 text-xs font-semibold capitalize"
                    style={{
                      color: theme === option ? "var(--pm-text)" : "var(--pm-text-muted)",
                      background: theme === option ? "var(--pm-surface)" : "transparent",
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-xs font-bold">Department</span>
                <select
                  value={department}
                  onChange={event => { setDepartment(event.target.value as Department); setError(""); }}
                  className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none"
                  style={{ background: "var(--pm-bg)", borderColor: "var(--pm-border-strong)", color: "var(--pm-text)" }}
                >
                  {departments.map(option => <option key={option}>{option}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-bold">Email address</span>
                <input
                  type="email"
                  value={email}
                  onChange={event => { setEmail(event.target.value); setError(""); }}
                  className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none"
                  style={{ background: "var(--pm-bg)", borderColor: "var(--pm-border-strong)", color: "var(--pm-text)" }}
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-bold">Password</span>
                <input
                  type="password"
                  value={password}
                  onChange={event => { setPassword(event.target.value); setError(""); }}
                  onKeyDown={event => event.key === "Enter" && handleLogin()}
                  className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none"
                  style={{ background: "var(--pm-bg)", borderColor: "var(--pm-border-strong)", color: "var(--pm-text)" }}
                />
              </label>

              {error && <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-800">{error}</div>}
              {resetSent && <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2.5 text-sm text-green-800">Password reset request recorded for {email}.</div>}

              <button onClick={handleLogin} className="w-full rounded-lg bg-[#F5B300] py-3 text-sm font-extrabold text-[#111827] hover:bg-[#E3A600]">
                Sign in to workspace
              </button>
              <button onClick={() => setResetSent(true)} className="w-full py-1 text-xs font-semibold" style={{ color: "var(--pm-text-muted)" }}>
                Forgot your password?
              </button>
            </div>

            <div className="mt-8 border-t pt-5" style={{ borderColor: "var(--pm-border)" }}>
              <div className="mb-3 text-xs font-bold uppercase tracking-[0.12em]" style={{ color: "var(--pm-text-muted)" }}>Demo accounts</div>
              <div className="grid gap-2 sm:grid-cols-2">
                {users.slice(0, 6).map(user => (
                  <button
                    key={user.id}
                    onClick={() => fillDemo(user)}
                    className="rounded-lg border p-2.5 text-left transition-colors"
                    style={{ borderColor: "var(--pm-border)", background: "var(--pm-surface-subtle)" }}
                  >
                    <div className="text-xs font-bold">{user.role}</div>
                    <div className="mt-0.5 truncate text-[11px]" style={{ color: "var(--pm-text-muted)" }}>{user.department}</div>
                  </button>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
