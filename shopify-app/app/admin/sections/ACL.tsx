import { useMemo, useState } from "react";
import {
  moduleOptions,
  rolePermissions,
  rolesByDepartment,
  type Department,
  type UserAccount,
} from "../accessControl";

interface Props {
  users?: UserAccount[];
  currentUserId?: string;
  onCreate?: (user: UserAccount) => void;
  onUpdate?: (user: UserAccount) => void;
  onDelete?: (userId: string) => void;
}

const departments = Object.keys(rolesByDepartment) as Department[];

const emptyUser = (): UserAccount => ({
  id: `U-${Date.now()}`,
  name: "",
  email: "",
  password: "Welcome123!",
  department: "Operations",
  role: "Operations Manager",
  status: "Active",
  permissions: [...rolePermissions["Operations Manager"]],
});

const normalizeUser = (user: UserAccount): UserAccount => ({
  ...user,
  permissions: Array.isArray(user.permissions)
    ? user.permissions
    : [...(rolePermissions[user.role] ?? rolePermissions["Team Member"])],
});

export default function ACL({ users = [], currentUserId, onCreate, onUpdate, onDelete }: Props) {
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<UserAccount | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [notice, setNotice] = useState("");
  const safeUsers = useMemo(() => users.map(normalizeUser), [users]);
  const editingPermissions = editing?.permissions ?? [];

  const filteredUsers = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return safeUsers;
    return safeUsers.filter(user =>
      [user.name, user.email, user.department, user.role].some(value => value.toLowerCase().includes(needle))
    );
  }, [query, safeUsers]);

  const updateDraft = (patch: Partial<UserAccount>) => {
    setEditing(current => current ? { ...current, ...patch } : current);
  };

  const changeDepartment = (department: Department) => {
    const role = rolesByDepartment[department][0];
    updateDraft({ department, role, permissions: [...(rolePermissions[role] ?? [])] });
  };

  const changeRole = (role: string) => {
    updateDraft({ role, permissions: [...(rolePermissions[role] ?? [])] });
  };

  const togglePermission = (permission: string) => {
    if (!editing || editing.role === "Super Admin") return;
    const permissions = editingPermissions.includes(permission)
      ? editingPermissions.filter(item => item !== permission)
      : [...editingPermissions, permission];
    updateDraft({ permissions });
  };

  const save = () => {
    if (!editing?.name.trim() || !editing.email.trim() || !editing.password.trim()) return;
    if (isNew) onCreate?.(editing);
    else onUpdate?.(editing);
    setNotice(`${editing.name}'s account and access were saved.`);
    setEditing(null);
    setIsNew(false);
  };

  const resetPassword = (user: UserAccount) => {
    onUpdate?.({ ...normalizeUser(user), password: "Welcome123!" });
    setNotice(`Temporary password reset for ${user.name}: Welcome123!`);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8" style={{ color: "var(--pm-text)" }}>
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--pm-accent-text)]">Super Admin</p>
            <h2 className="mt-1 font-display text-2xl font-extrabold">Users, roles and access</h2>
            <p className="mt-1 text-sm" style={{ color: "var(--pm-text-muted)" }}>
              Assign departments and roles, then tailor module access for each user.
            </p>
          </div>
          <button
            onClick={() => { setEditing(emptyUser()); setIsNew(true); }}
            className="rounded-lg bg-[#F5B300] px-4 py-2.5 text-sm font-extrabold text-[#111827]"
          >
            Add user
          </button>
        </div>

        {notice && (
          <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
            <span>{notice}</span>
            <button onClick={() => setNotice("")} className="font-bold">Dismiss</button>
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Total users", safeUsers.length],
            ["Active", safeUsers.filter(user => user.status === "Active").length],
            ["Departments", new Set(safeUsers.map(user => user.department)).size],
            ["Super Admins", safeUsers.filter(user => user.role === "Super Admin").length],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl border p-4" style={{ background: "var(--pm-surface)", borderColor: "var(--pm-border)" }}>
              <div className="text-xs font-semibold" style={{ color: "var(--pm-text-muted)" }}>{label}</div>
              <div className="mt-2 font-display text-2xl font-extrabold">{value}</div>
            </div>
          ))}
        </div>

        <div className="overflow-hidden rounded-xl border" style={{ background: "var(--pm-surface)", borderColor: "var(--pm-border)" }}>
          <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between" style={{ borderColor: "var(--pm-border)" }}>
            <div>
              <div className="font-display text-sm font-bold">User directory</div>
              <div className="text-xs" style={{ color: "var(--pm-text-muted)" }}>Changes apply to the next sign-in.</div>
            </div>
            <input
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder="Search users, roles or departments"
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none sm:w-80"
              style={{ background: "var(--pm-bg)", borderColor: "var(--pm-border)", color: "var(--pm-text)" }}
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead style={{ background: "var(--pm-surface-subtle)" }}>
                <tr>
                  {["User", "Department", "Role", "Access", "Status", "Actions"].map(label => (
                    <th key={label} className="px-4 py-3 text-left text-xs font-bold">{label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id} className="border-t" style={{ borderColor: "var(--pm-border-soft)" }}>
                    <td className="px-4 py-3">
                      <div className="font-semibold">{user.name}</div>
                      <div className="text-xs" style={{ color: "var(--pm-text-muted)" }}>{user.email}</div>
                    </td>
                    <td className="px-4 py-3">{user.department}</td>
                    <td className="px-4 py-3 font-semibold">{user.role}</td>
                    <td className="px-4 py-3">{user.permissions?.length ?? 0} modules</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-1 text-xs font-bold ${user.status === "Active" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button onClick={() => { setEditing({ ...user, permissions: [...(user.permissions ?? [])] }); setIsNew(false); }} className="rounded-md border px-2.5 py-1.5 text-xs font-semibold" style={{ borderColor: "var(--pm-border)" }}>Manage</button>
                        <button onClick={() => resetPassword(user)} className="rounded-md border px-2.5 py-1.5 text-xs font-semibold" style={{ borderColor: "var(--pm-border)" }}>Reset password</button>
                        <button
                          onClick={() => onUpdate?.({ ...normalizeUser(user), status: user.status === "Active" ? "Suspended" : "Active" })}
                          disabled={user.id === currentUserId}
                          className="rounded-md border px-2.5 py-1.5 text-xs font-semibold disabled:opacity-30"
                          style={{ borderColor: "var(--pm-border)" }}
                        >
                          {user.status === "Active" ? "Suspend" : "Restore"}
                        </button>
                        <button
                          onClick={() => window.confirm(`Delete ${user.name}?`) && onDelete?.(user.id)}
                          disabled={user.id === currentUserId || user.role === "Super Admin"}
                          className="rounded-md border border-red-200 px-2.5 py-1.5 text-xs font-semibold text-red-700 disabled:opacity-30"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {editing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border p-5 sm:p-6" style={{ background: "var(--pm-surface)", borderColor: "var(--pm-border)" }}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-display text-xl font-extrabold">{isNew ? "Create user" : `Manage ${editing.name}`}</h3>
                <p className="mt-1 text-sm" style={{ color: "var(--pm-text-muted)" }}>Account identity, role and module-level access.</p>
              </div>
              <button onClick={() => setEditing(null)} className="text-xl" aria-label="Close">×</button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                ["Full name", editing.name, (value: string) => updateDraft({ name: value }), "text"],
                ["Email address", editing.email, (value: string) => updateDraft({ email: value }), "email"],
                ["Password", editing.password, (value: string) => updateDraft({ password: value }), "text"],
              ].map(([label, value, onChange, type]) => (
                <label key={label as string} className="block">
                  <span className="mb-1.5 block text-xs font-bold">{label as string}</span>
                  <input
                    type={type as string}
                    value={value as string}
                    onChange={event => (onChange as (value: string) => void)(event.target.value)}
                    className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none"
                    style={{ background: "var(--pm-bg)", borderColor: "var(--pm-border)", color: "var(--pm-text)" }}
                  />
                </label>
              ))}
              <label className="block">
                <span className="mb-1.5 block text-xs font-bold">Department</span>
                <select value={editing.department} onChange={event => changeDepartment(event.target.value as Department)} className="w-full rounded-lg border px-3 py-2.5 text-sm" style={{ background: "var(--pm-bg)", borderColor: "var(--pm-border)", color: "var(--pm-text)" }}>
                  {departments.map(department => <option key={department}>{department}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-bold">Role</span>
                <select value={editing.role} onChange={event => changeRole(event.target.value)} className="w-full rounded-lg border px-3 py-2.5 text-sm" style={{ background: "var(--pm-bg)", borderColor: "var(--pm-border)", color: "var(--pm-text)" }}>
                  {rolesByDepartment[editing.department].map(role => <option key={role}>{role}</option>)}
                </select>
              </label>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold">Granted modules</div>
                  <div className="text-xs" style={{ color: "var(--pm-text-muted)" }}>Role defaults can be adjusted per user.</div>
                </div>
                <span className="text-xs font-bold">{editingPermissions.length} selected</span>
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {moduleOptions.map(module => {
                  const checked = editingPermissions.includes(module.id);
                  return (
                    <label key={module.id} className="flex cursor-pointer items-center gap-2 rounded-lg border p-2.5 text-xs" style={{ borderColor: checked ? "#F5B300" : "var(--pm-border)", background: checked ? "var(--pm-active)" : "var(--pm-surface-subtle)" }}>
                      <input type="checkbox" checked={checked} disabled={editing.role === "Super Admin"} onChange={() => togglePermission(module.id)} />
                      <span className="font-semibold">{module.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2 border-t pt-4" style={{ borderColor: "var(--pm-border)" }}>
              <button onClick={() => setEditing(null)} className="rounded-lg border px-4 py-2 text-sm font-semibold" style={{ borderColor: "var(--pm-border)" }}>Cancel</button>
              <button onClick={save} className="rounded-lg bg-[#F5B300] px-5 py-2 text-sm font-extrabold text-[#111827]">Save access</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
