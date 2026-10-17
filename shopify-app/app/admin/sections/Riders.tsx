import { useState } from "react";

const riders = [
  { id: "R01", name: "Ahmad Farid", phone: "+65 9111 0001", vehicle: "Motorcycle", zone: "Central", assigned: 4, delivered: 3, failed: 0, status: "On Route", joinDate: "2 Jan 2024", rating: 4.9 },
  { id: "R02", name: "Kumar Raj", phone: "+65 9222 0002", vehicle: "Motorcycle", zone: "East", assigned: 3, delivered: 3, failed: 0, status: "Available", joinDate: "15 Feb 2024", rating: 4.8 },
  { id: "R03", name: "Tan Wei", phone: "+65 9333 0003", vehicle: "Car", zone: "West", assigned: 5, delivered: 4, failed: 1, status: "On Route", joinDate: "8 Nov 2023", rating: 4.6 },
  { id: "R04", name: "Siti Nora", phone: "+65 9444 0004", vehicle: "Motorcycle", zone: "North", assigned: 3, delivered: 3, failed: 0, status: "Available", joinDate: "20 Mar 2024", rating: 5.0 },
  { id: "R05", name: "Lee Jun Hao", phone: "+65 9555 0005", vehicle: "Van", zone: "All Zones", assigned: 8, delivered: 6, failed: 0, status: "On Route", joinDate: "5 Sep 2023", rating: 4.7 },
  { id: "R06", name: "Muthu Samy", phone: "+65 9666 0006", vehicle: "Motorcycle", zone: "Central", assigned: 2, delivered: 1, failed: 1, status: "Available", joinDate: "11 Jul 2024", rating: 4.2 },
];

const statusColor: Record<string, string> = {
  Available: "bg-green-950 text-green-400",
  "On Route": "bg-yellow-950 text-yellow-400",
  "Off Duty": "bg-[var(--pm-surface-muted)] text-[var(--pm-text-muted)]",
};

export default function Riders() {
  const [selected, setSelected] = useState<typeof riders[0] | null>(null);

  const onRoute = riders.filter(r => r.status === "On Route").length;
  const available = riders.filter(r => r.status === "Available").length;
  const totalDelivered = riders.reduce((a, r) => a + r.delivered, 0);
  const successRate = riders.reduce((a, r) => a + r.delivered, 0) / riders.reduce((a, r) => a + r.assigned, 0) * 100;

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold">Rider Management</h2>
        <button className="bg-[#F5B300] text-black text-xs font-bold px-4 py-2 mono hover:bg-[#C99200] transition-colors">
          + Add Rider
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Riders", value: String(riders.length), sub: "on roster" },
          { label: "On Route", value: String(onRoute), sub: "active right now", accent: "#F5B300" },
          { label: "Available", value: String(available), sub: "ready to deploy", accent: "#22C55E" },
          { label: "Success Rate", value: `${successRate.toFixed(0)}%`, sub: `${totalDelivered} delivered today`, accent: "#22C55E" },
        ].map(k => (
          <div key={k.label} className="border border-[var(--pm-border)] bg-[var(--pm-surface)] p-4">
            <div className="text-xs font-bold text-[var(--pm-text)] uppercase tracking-widest mb-2">{k.label}</div>
            <div className="text-3xl font-extrabold mono" style={{ color: k.accent ?? "var(--pm-text-secondary)" }}>{k.value}</div>
            <div className="text-xs text-[var(--pm-text-muted)] mt-1 mono">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Rider table */}
      <div className="border border-[var(--pm-border)] bg-[var(--pm-surface)] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--pm-border)]">
              {["#", "Rider", "Phone", "Vehicle", "Zone", "Assigned", "Delivered", "Failed", "Success Rate", "Rating", "Status", ""].map(h => (
                <th key={h} className="px-4 py-2 text-left text-xs text-[var(--pm-text-muted)] uppercase tracking-wider font-medium whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {riders.map((r, i) => {
              const rate = r.assigned > 0 ? Math.round((r.delivered / r.assigned) * 100) : 0;
              return (
                <tr
                  key={r.id}
                  className={`border-b border-[var(--pm-border)] hover:bg-[var(--pm-surface-subtle)] transition-colors cursor-pointer ${i % 2 === 0 ? "" : "bg-[var(--pm-surface-subtle)]"}`}
                  onClick={() => setSelected(r)}
                >
                  <td className="px-4 py-2.5 mono text-xs text-[var(--pm-text-muted)]">{r.id}</td>
                  <td className="px-4 py-2.5 font-semibold">{r.name}</td>
                  <td className="px-4 py-2.5 mono text-xs text-[var(--pm-text-muted)]">{r.phone}</td>
                  <td className="px-4 py-2.5 text-xs text-[var(--pm-text-muted)]">{r.vehicle}</td>
                  <td className="px-4 py-2.5 text-xs text-[var(--pm-text-muted)]">{r.zone}</td>
                  <td className="px-4 py-2.5 mono text-center font-bold text-[var(--pm-accent-text)]">{r.assigned}</td>
                  <td className="px-4 py-2.5 mono text-center font-bold text-green-400">{r.delivered}</td>
                  <td className="px-4 py-2.5 mono text-center font-bold text-red-400">{r.failed}</td>
                  <td className="px-4 py-2.5 mono">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 bg-[var(--pm-surface-muted)]">
                        <div className="h-1.5 bg-green-400" style={{ width: `${rate}%` }} />
                      </div>
                      <span className={`text-xs font-bold ${rate >= 90 ? "text-green-400" : rate >= 70 ? "text-yellow-400" : "text-red-400"}`}>
                        {rate}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 mono text-[var(--pm-accent-text)] font-bold">{"★".repeat(Math.round(r.rating))} <span className="text-xs text-[var(--pm-text-muted)]">{r.rating}</span></td>
                  <td className="px-4 py-2.5">
                    <span className={`text-xs mono px-2 py-0.5 font-bold ${statusColor[r.status]}`}>{r.status}</span>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="text-xs text-[var(--pm-text-muted)] hover:text-[var(--pm-accent-text)] transition-colors">View →</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Rider detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={() => setSelected(null)}>
          <div className="bg-[var(--pm-surface)] border border-[var(--pm-border)] w-full max-w-[480px]" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--pm-border)]">
              <div>
                <div className="font-extrabold text-lg">{selected.name}</div>
                <div className="text-xs text-[var(--pm-text-muted)] mono">{selected.id} · {selected.vehicle} · {selected.zone}</div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs mono px-2 py-0.5 font-bold ${statusColor[selected.status]}`}>{selected.status}</span>
                <button onClick={() => setSelected(null)} className="text-[var(--pm-text-muted)] hover:text-[var(--pm-text-secondary)] text-xl">×</button>
              </div>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { label: "Assigned Today", value: String(selected.assigned), color: "#F5B300" },
                  { label: "Delivered", value: String(selected.delivered), color: "#22C55E" },
                  { label: "Failed", value: String(selected.failed), color: "#EF4444" },
                ].map(s => (
                  <div key={s.label} className="border border-[var(--pm-border)] p-3 text-center">
                    <div className="text-xs font-bold text-[var(--pm-text)] uppercase tracking-wider mb-1">{s.label}</div>
                    <div className="text-2xl font-extrabold mono" style={{ color: s.color }}>{s.value}</div>
                  </div>
                ))}
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between border-b border-[var(--pm-border)] pb-2">
                  <span className="text-[var(--pm-text-muted)]">Phone</span>
                  <span className="mono">{selected.phone}</span>
                </div>
                <div className="flex justify-between border-b border-[var(--pm-border)] pb-2">
                  <span className="text-[var(--pm-text-muted)]">Zone</span>
                  <span>{selected.zone}</span>
                </div>
                <div className="flex justify-between border-b border-[var(--pm-border)] pb-2">
                  <span className="text-[var(--pm-text-muted)]">Rider Since</span>
                  <span className="mono">{selected.joinDate}</span>
                </div>
                <div className="flex justify-between border-b border-[var(--pm-border)] pb-2">
                  <span className="text-[var(--pm-text-muted)]">Rating</span>
                  <span className="text-[var(--pm-accent-text)] font-bold mono">★ {selected.rating}</span>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button className="flex-1 border border-[var(--pm-border)] text-xs py-2 mono text-[var(--pm-text-muted)] hover:border-[#F5B300] hover:text-[var(--pm-accent-text)] transition-colors">
                  Call Rider
                </button>
                <button className="flex-1 border border-[var(--pm-border)] text-xs py-2 mono text-[var(--pm-text-muted)] hover:border-[#F5B300] hover:text-[var(--pm-accent-text)] transition-colors">
                  View Orders
                </button>
                <button className="flex-1 border border-red-800 text-xs py-2 mono text-red-400 hover:bg-red-950 transition-colors">
                  Deactivate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
