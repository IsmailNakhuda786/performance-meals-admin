import type { BusinessStream } from "../App";

const mpQueue = [
  { meal: "Herb Grilled Chicken & Brown Rice", goal: "CUT", qty: 24, completed: 18, packaging: "500ml tray", status: "In Progress" },
  { meal: "Teriyaki Chicken & Jasmine Rice", goal: "MAINTAIN", qty: 16, completed: 16, packaging: "500ml tray", status: "Done" },
  { meal: "Korean BBQ Beef & Purple Rice", goal: "BUILD", qty: 20, completed: 8, packaging: "650ml tray", status: "In Progress" },
  { meal: "Lemon Herb Turkey Breast", goal: "BUILD", qty: 18, completed: 0, packaging: "500ml tray", status: "Queued" },
  { meal: "Chilli Lime Chicken & Cauliflower Rice", goal: "CUT", qty: 14, completed: 14, packaging: "500ml tray", status: "Done" },
  { meal: "Greek Chicken & Quinoa Bowl", goal: "MAINTAIN", qty: 10, completed: 5, packaging: "500ml tray", status: "In Progress" },
];

const rsQueue = [
  { meal: "Teriyaki Chicken & Brown Rice", size: "JPSUB01", qty: 45, completed: 45, packaging: "Frozen tray", status: "Done" },
  { meal: "Salmon & Quinoa Power Bowl", size: "JPSUB01", qty: 30, completed: 22, packaging: "Frozen tray", status: "In Progress" },
  { meal: "Spicy Korean Beef Bulgogi", size: "A-la-carte", qty: 15, completed: 15, packaging: "Frozen tray", status: "Done" },
  { meal: "Herb Chicken & Roasted Veg", size: "LCSUB01", qty: 20, completed: 0, packaging: "Frozen tray", status: "Queued" },
  { meal: "Miso Glazed Salmon", size: "A-la-carte", qty: 12, completed: 8, packaging: "Frozen tray", status: "In Progress" },
];

const statusColor: Record<string, string> = {
  Done: "text-green-400 bg-green-950",
  "In Progress": "text-yellow-400 bg-yellow-950/40",
  Queued: "text-[var(--pm-text-muted)] bg-[var(--pm-surface-subtle)]",
};

function QueueTable({ rows, stream }: {
  rows: { meal: string; qty: number; completed: number; packaging: string; status: string; goal?: string; size?: string }[];
  stream: BusinessStream;
}) {
  const accent = stream === "meal-plans" ? "#F5B300" : "#E85D04";
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--pm-border)]">
            {["Meal / Item", stream === "meal-plans" ? "Goal" : "Type", "Required", "Completed", "Progress", "Packaging", "Status", ""].map(h => (
              <th key={h} className="px-4 py-2 text-left text-xs text-[var(--pm-text-muted)] uppercase tracking-wider font-medium whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => {
            const pct = Math.round((r.completed / r.qty) * 100);
            return (
              <tr key={r.meal} className={`border-b border-[var(--pm-border)] hover:bg-[var(--pm-surface-subtle)] transition-colors ${i % 2 === 0 ? "" : "bg-[var(--pm-surface-subtle)]"}`}>
                <td className="px-4 py-2.5 font-medium max-w-[200px] truncate">{r.meal}</td>
                <td className="px-4 py-2.5">
                  <span className="mono text-xs font-bold text-[var(--pm-text-muted)]">{r.goal ?? r.size}</span>
                </td>
                <td className="px-4 py-2.5 mono font-bold" style={{ color: accent }}>{r.qty}</td>
                <td className="px-4 py-2.5 mono font-bold text-green-400">{r.completed}</td>
                <td className="px-4 py-2.5 w-32">
                  <div className="h-1.5 bg-[var(--pm-surface-muted)] w-24">
                    <div
                      className="h-1.5 transition-all"
                      style={{ width: `${pct}%`, background: pct === 100 ? "#22C55E" : accent }}
                    />
                  </div>
                  <div className="text-xs mono text-[var(--pm-text-muted)] mt-0.5">{pct}%</div>
                </td>
                <td className="px-4 py-2.5 text-xs text-[var(--pm-text-muted)]">{r.packaging}</td>
                <td className="px-4 py-2.5">
                  <span className={`text-xs mono px-2 py-0.5 font-bold ${statusColor[r.status]}`}>{r.status}</span>
                </td>
                <td className="px-4 py-2.5">
                  <button className="text-xs border border-[var(--pm-border)] px-2 py-1 text-[var(--pm-text-muted)] hover:border-[#F5B300] hover:text-[var(--pm-accent-text)] transition-colors mono">
                    Update
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function Kitchen({ stream }: { stream: BusinessStream }) {
  const isMp = stream === "meal-plans";
  const accent = isMp ? "#F5B300" : "#E85D04";
  const queue = isMp ? mpQueue : rsQueue;

  const totalRequired = queue.reduce((a, r) => a + r.qty, 0);
  const totalCompleted = queue.reduce((a, r) => a + r.completed, 0);
  const inProgress = queue.filter(r => r.status === "In Progress").length;
  const done = queue.filter(r => r.status === "Done").length;

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold">
          Kitchen — {isMp ? "Meal Plans Production" : "Ready Series Production"}
        </h2>
        <div className="flex gap-2">
          <button className="border border-[var(--pm-border-strong)] text-[var(--pm-text-secondary)] text-xs px-4 py-2 mono hover:border-[#F5B300] hover:text-[var(--pm-accent-text)] transition-colors">
            Print Kitchen Sheet
          </button>
          <button className="border border-[var(--pm-border-strong)] text-[var(--pm-text-secondary)] text-xs px-4 py-2 mono hover:border-[#F5B300] hover:text-[var(--pm-accent-text)] transition-colors">
            Export Excel
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Meals Required", value: String(totalRequired), sub: "today's production" },
          { label: "Meals Completed", value: String(totalCompleted), sub: `${Math.round((totalCompleted / totalRequired) * 100)}% done`, accent: true },
          { label: "In Progress", value: String(inProgress), sub: "active items" },
          { label: "Completed Items", value: String(done), sub: `of ${queue.length} items` },
        ].map(k => (
          <div key={k.label} className="border bg-[var(--pm-surface)] p-4" style={{ borderColor: k.accent ? `${accent}40` : "var(--pm-border)" }}>
            <div className="text-xs font-bold text-[var(--pm-text)] uppercase tracking-widest mb-2">{k.label}</div>
            <div className="text-3xl font-extrabold mono" style={{ color: k.accent ? accent : "var(--pm-text-secondary)" }}>{k.value}</div>
            <div className="text-xs text-[var(--pm-text-muted)] mt-1 mono">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Production queue */}
      <div className="border border-[var(--pm-border)] bg-[var(--pm-surface)]">
        <div className="px-4 py-3 border-b border-[var(--pm-border)] flex items-center justify-between">
          <span className="text-sm font-semibold tracking-wide">
            {isMp ? "Meal Plan Production Queue" : "Ready Series Production Queue"}
          </span>
          <div className="flex items-center gap-3">
            <span className="text-xs mono text-[var(--pm-text-muted)]">{new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</span>
            <div className="h-2 w-24 bg-[var(--pm-surface-muted)]">
              <div
                className="h-2 transition-all"
                style={{ width: `${Math.round((totalCompleted / totalRequired) * 100)}%`, background: accent }}
              />
            </div>
            <span className="text-xs mono" style={{ color: accent }}>
              {Math.round((totalCompleted / totalRequired) * 100)}% overall
            </span>
          </div>
        </div>
        <QueueTable rows={queue} stream={stream} />
      </div>

      {/* Inventory alerts */}
      <div className="border border-red-900/40 bg-[var(--pm-surface)]">
        <div className="px-4 py-3 border-b border-red-900/40 flex items-center gap-2">
          <span className="text-sm font-semibold tracking-wide text-red-400">Inventory Alerts</span>
          <span className="bg-red-900 text-red-400 text-xs mono px-1.5 py-0.5">4</span>
        </div>
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { item: "Grilled Chicken Breast (1kg)", current: 8, minimum: 20 },
            { item: "Jasmine Rice (5kg)", current: 3, minimum: 10 },
            { item: "Salmon Fillet (500g)", current: 12, minimum: 15 },
            { item: "Sweet Potato (1kg)", current: 5, minimum: 12 },
          ].map(a => (
            <div key={a.item} className="border border-red-900/30 bg-red-950/10 p-3">
              <div className="text-sm font-medium mb-1">{a.item}</div>
              <div className="flex justify-between text-xs mono">
                <span className="text-red-400 font-bold">{a.current} remaining</span>
                <span className="text-[var(--pm-text-muted)]">min {a.minimum}</span>
              </div>
              <div className="mt-2 h-1 bg-[var(--pm-surface-muted)]">
                <div className="h-1 bg-red-500" style={{ width: `${(a.current / a.minimum) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
