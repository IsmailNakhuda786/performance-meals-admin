import { useState } from "react";

type Screen = "login" | "route" | "details" | "delivered" | "proof" | "failure";

interface Stop {
  id: string;
  seq: number;
  customer: string;
  address: string;
  unit: string;
  phone: string;
  items: string;
  stream: string;
  status: "pending" | "completed" | "failed";
  note?: string;
}

const stops: Stop[] = [
  { id: "ORD-2401", seq: 1, customer: "Marcus Tan", address: "Blk 123 Bishan St 12", unit: "#05-22", phone: "+65 9123 4567", items: "5 meals — CUT plan", stream: "Meal Plans", status: "completed" },
  { id: "ORD-2402", seq: 2, customer: "Aisha Rahman", address: "28 Jln Jurong Kechil", unit: "#03-08", phone: "+65 8234 5678", items: "10-meal Ready Sub", stream: "Ready Series", status: "completed" },
  { id: "ORD-2403", seq: 3, customer: "Wei Jie Lim", address: "Blk 44 Ang Mo Kio Ave 3", unit: "#08-12", phone: "+65 9345 6789", items: "5 meals — BUILD plan", stream: "Meal Plans", status: "failed", note: "No one home. Called twice." },
  { id: "ORD-2404", seq: 4, customer: "Serene Tay", address: "35 Telok Blangah Rise", unit: "#11-04", phone: "+65 9456 7890", items: "Ready Series A-la-carte ×3", stream: "Ready Series", status: "pending" },
  { id: "ORD-2405", seq: 5, customer: "Jason Yeo", address: "21 Tanjong Pagar Plaza", unit: "#04-05", phone: "+65 8567 8901", items: "5 meals — MAINTAIN plan", stream: "Meal Plans", status: "pending" },
];

const failureReasons = ["No one home", "Wrong address", "Customer refused delivery", "Unable to access building", "Item damaged", "Other"];

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-72 border-4 border-[var(--pm-border)] bg-[var(--pm-bg)] overflow-hidden" style={{ height: 600, borderRadius: 24 }}>
      <div className="h-6 bg-[#0A0A0A] flex items-center justify-center">
        <div className="w-16 h-1 bg-[var(--pm-surface-muted)] rounded-full" />
      </div>
      <div className="h-full overflow-y-auto">{children}</div>
    </div>
  );
}

function StatusDot({ status }: { status: Stop["status"] }) {
  const colors: Record<Stop["status"], string> = { pending: "#888", completed: "#22C55E", failed: "#EF4444" };
  return <div className="w-3 h-3 flex-shrink-0" style={{ background: colors[status] }} />;
}

export default function RiderApp() {
  const [screen, setScreen] = useState<Screen>("login");
  const [loggedIn, setLoggedIn] = useState(false);
  const [selectedStop, setSelectedStop] = useState<Stop | null>(null);
  const [failureReason, setFailureReason] = useState(failureReasons[0]);
  const [proofNote, setProofNote] = useState("");

  const completed = stops.filter(s => s.status === "completed").length;
  const failed = stops.filter(s => s.status === "failed").length;
  const pending = stops.filter(s => s.status === "pending").length;

  return (
    <div className="p-6 space-y-5">
      {/* Future / Deferred scope banner */}
      <div className="border border-[#3A2A00] bg-[#0F0A00] px-5 py-4">
        <div className="flex items-start gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", color: "var(--pm-warning-text)", background: "var(--pm-warning-bg)", border: "1px solid var(--pm-warning-border)", padding: "3px 8px" }}>FUTURE / DEFERRED — NOT PHASE 1</span>
            </div>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#5A3A00", lineHeight: 1.6 }}>
              A standalone <strong style={{ color: "#7A4A00" }}>Rider Mobile Application</strong> is explicitly out of scope for Phase 1. This screen is a roadmap reference only — not an active custom product being built in this project.
            </p>
            <p className="mt-2" style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#3A2A00" }}>
              The admin platform retains a <strong style={{ color: "#5A3A00" }}>Riders (Admin)</strong> module under Operations for rider assignment, route management, and dispatch. A future external rider application or integration would be a separate project.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold">Rider App — Prototype Reference</h2>
          <div className="text-xs text-[var(--pm-text-muted)] mono mt-0.5">Future concept — external rider application / integration</div>
        </div>
        <div className="text-xs mono border px-3 py-1.5" style={{ borderColor: "#3A2A00", color: "#5A3A00" }}>Not Phase 1 Scope</div>
      </div>

      {/* Screen selector */}
      <div className="flex gap-2 flex-wrap">
        {([
          ["login", "Login"],
          ["route", "Today's Route"],
          ["details", "Delivery Details"],
          ["delivered", "Mark Delivered"],
          ["proof", "Upload Proof"],
          ["failure", "Report Failure"],
        ] as [Screen, string][]).map(([s, label]) => (
          <button key={s} onClick={() => { setScreen(s); if (s !== "login") { setLoggedIn(true); if (!selectedStop) setSelectedStop(stops[3]); } }}
            className={`text-xs px-3 py-1.5 mono border transition-colors ${screen === s ? "border-[#F5B300] text-[var(--pm-accent-text)] bg-[#F5B300]/10" : "border-[var(--pm-border)] text-[var(--pm-text-muted)] hover:text-[var(--pm-text-secondary)]"}`}>
            {label}
          </button>
        ))}
      </div>

      <div className="flex gap-8 items-start">
        {/* Phone */}
        <PhoneFrame>
          {screen === "login" && (
            <div className="p-5 flex flex-col items-center justify-center h-full space-y-5 bg-[var(--pm-bg)]">
              <div>
                <div className="text-[var(--pm-accent-text)] font-extrabold text-2xl tracking-widest mono text-center">PM</div>
                <div className="text-[var(--pm-text-muted)] text-xs tracking-wider text-center mt-1">Performance Meals</div>
                <div className="text-[var(--pm-text-muted)] text-xs tracking-wider text-center mono">Rider Portal</div>
              </div>
              <div className="w-full space-y-3">
                <div>
                  <div className="text-xs text-[var(--pm-text-muted)] uppercase tracking-wider mb-1">Rider ID</div>
                  <input defaultValue="RDR-01" className="w-full bg-[var(--pm-surface)] border border-[var(--pm-border)] text-[var(--pm-text-secondary)] text-sm px-3 py-2 focus:outline-none mono" />
                </div>
                <div>
                  <div className="text-xs text-[var(--pm-text-muted)] uppercase tracking-wider mb-1">PIN</div>
                  <input type="password" defaultValue="••••" className="w-full bg-[var(--pm-surface)] border border-[var(--pm-border)] text-[var(--pm-text-secondary)] text-sm px-3 py-2 focus:outline-none mono" />
                </div>
                <button onClick={() => { setLoggedIn(true); setScreen("route"); }}
                  className="w-full bg-[#F5B300] text-black font-bold py-3 text-sm mono hover:bg-[#C99200] transition-colors">
                  Log In
                </button>
              </div>
            </div>
          )}

          {screen === "route" && loggedIn && (
            <div className="bg-[var(--pm-bg)] min-h-full">
              <div className="bg-[var(--pm-surface)] px-4 py-3 border-b border-[var(--pm-border)]">
                <div className="text-xs text-[var(--pm-accent-text)] mono font-bold">Ahmad Farid · Run A</div>
                <div className="text-xs text-[var(--pm-text-muted)] mono mt-0.5">14 Sep 2024 · {stops.length} stops</div>
              </div>
              <div className="px-3 py-2 flex gap-3 border-b border-[var(--pm-border)] bg-[#0A0A0A]">
                <div className="text-center flex-1">
                  <div className="text-[#22C55E] font-extrabold mono text-lg">{completed}</div>
                  <div className="text-xs text-[var(--pm-text-muted)]">Done</div>
                </div>
                <div className="text-center flex-1">
                  <div className="text-[var(--pm-accent-text)] font-extrabold mono text-lg">{pending}</div>
                  <div className="text-xs text-[var(--pm-text-muted)]">Left</div>
                </div>
                <div className="text-center flex-1">
                  <div className="text-[#EF4444] font-extrabold mono text-lg">{failed}</div>
                  <div className="text-xs text-[var(--pm-text-muted)]">Failed</div>
                </div>
              </div>
              <div className="divide-y divide-[var(--pm-border-soft)]">
                {stops.map(s => (
                  <div key={s.id} onClick={() => { setSelectedStop(s); setScreen("details"); }}
                    className={`px-4 py-3 flex items-center gap-3 cursor-pointer hover:bg-[var(--pm-surface)] transition-colors ${s.status === "completed" ? "opacity-50" : ""}`}>
                    <StatusDot status={s.status} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold truncate">{s.customer}</div>
                      <div className="text-xs text-[var(--pm-text-muted)] truncate">{s.address}</div>
                      <div className="text-xs mono mt-0.5" style={{ color: s.stream === "Meal Plans" ? "#F5B300" : "#E85D04" }}>{s.items}</div>
                    </div>
                    <div className="text-xs mono text-[var(--pm-text-muted)]">#{s.seq}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {screen === "details" && selectedStop && (
            <div className="bg-[var(--pm-bg)] min-h-full">
              <div className="bg-[var(--pm-surface)] px-4 py-3 border-b border-[var(--pm-border)] flex items-center gap-2">
                <button onClick={() => setScreen("route")} className="text-[var(--pm-text-muted)] hover:text-[var(--pm-text-secondary)]">←</button>
                <div>
                  <div className="text-xs text-[var(--pm-accent-text)] mono font-bold">{selectedStop.id}</div>
                  <div className="text-xs text-[var(--pm-text-muted)]">Stop #{selectedStop.seq}</div>
                </div>
              </div>
              <div className="p-4 space-y-4">
                <div className="border border-[var(--pm-border)] bg-[var(--pm-surface)] p-3 space-y-2">
                  <div className="font-semibold">{selectedStop.customer}</div>
                  <div className="text-xs text-[var(--pm-text-muted)]">{selectedStop.address}</div>
                  <div className="text-xs text-[var(--pm-text-muted)]">Unit: {selectedStop.unit}</div>
                  <div className="text-xs mono" style={{ color: selectedStop.stream === "Meal Plans" ? "#F5B300" : "#E85D04" }}>{selectedStop.items}</div>
                </div>
                <div className="flex gap-2">
                  <a href={`tel:${selectedStop.phone}`} className="flex-1 border border-[var(--pm-border)] py-2 text-center text-xs text-[var(--pm-text-muted)] mono hover:text-[var(--pm-text-secondary)] transition-colors">
                    📞 Call
                  </a>
                  <button className="flex-1 border border-[var(--pm-border)] py-2 text-xs text-[var(--pm-text-muted)] mono hover:text-[var(--pm-text-secondary)] transition-colors">
                    🗺 Navigate
                  </button>
                </div>
                <button onClick={() => setScreen("delivered")} className="w-full bg-[#F5B300] text-black py-3 font-bold text-sm mono">
                  Mark as Delivered
                </button>
                <button onClick={() => setScreen("failure")} className="w-full border border-red-800/40 text-red-400 py-2.5 text-sm mono hover:bg-red-950 transition-colors">
                  Report Failure
                </button>
              </div>
            </div>
          )}

          {screen === "delivered" && selectedStop && (
            <div className="bg-[var(--pm-bg)] min-h-full">
              <div className="bg-[var(--pm-surface)] px-4 py-3 border-b border-[var(--pm-border)] flex items-center gap-2">
                <button onClick={() => setScreen("details")} className="text-[var(--pm-text-muted)] hover:text-[var(--pm-text-secondary)]">←</button>
                <span className="text-sm font-semibold">Confirm Delivery</span>
              </div>
              <div className="p-4 space-y-4">
                <div className="text-xs text-[var(--pm-text-muted)]">Delivering to: <span className="text-[var(--pm-text-secondary)] font-semibold">{selectedStop.customer}</span></div>
                <div>
                  <div className="text-xs text-[var(--pm-text-muted)] uppercase tracking-wider mb-2">Delivery Method</div>
                  {["Hand to customer", "Left at door", "Left with security", "Left with neighbour"].map(opt => (
                    <label key={opt} className="flex items-center gap-2 py-2 text-sm cursor-pointer">
                      <input type="radio" name="method" className="accent-yellow-500" defaultChecked={opt === "Hand to customer"} />
                      {opt}
                    </label>
                  ))}
                </div>
                <div>
                  <div className="text-xs text-[var(--pm-text-muted)] uppercase tracking-wider mb-1">Note (optional)</div>
                  <textarea rows={2} value={proofNote} onChange={e => setProofNote(e.target.value)} placeholder="Left at door mat…"
                    className="w-full bg-[var(--pm-surface)] border border-[var(--pm-border)] text-[var(--pm-text-secondary)] text-xs px-3 py-2 focus:outline-none resize-none placeholder:text-[var(--pm-text-muted)]" />
                </div>
                <button onClick={() => setScreen("proof")} className="w-full bg-[#F5B300] text-black py-3 font-bold text-sm mono">
                  Confirm & Upload Proof
                </button>
              </div>
            </div>
          )}

          {screen === "proof" && (
            <div className="bg-[var(--pm-bg)] min-h-full">
              <div className="bg-[var(--pm-surface)] px-4 py-3 border-b border-[var(--pm-border)] flex items-center gap-2">
                <button onClick={() => setScreen("delivered")} className="text-[var(--pm-text-muted)] hover:text-[var(--pm-text-secondary)]">←</button>
                <span className="text-sm font-semibold">Upload Proof</span>
              </div>
              <div className="p-4 space-y-4">
                <div className="border-2 border-dashed border-[var(--pm-border)] h-36 flex flex-col items-center justify-center gap-2 text-[var(--pm-text-muted)] text-xs mono cursor-pointer hover:border-[#F5B300]/50 transition-colors">
                  <div className="text-3xl">📷</div>
                  <div>Tap to take photo</div>
                </div>
                <div className="text-xs text-[var(--pm-text-muted)] text-center mono">Photo will be attached to delivery record</div>
                <button className="w-full bg-[#22C55E] text-black py-3 font-bold text-sm mono hover:bg-green-400 transition-colors">
                  ✓ Submit Delivery
                </button>
              </div>
            </div>
          )}

          {screen === "failure" && selectedStop && (
            <div className="bg-[var(--pm-bg)] min-h-full">
              <div className="bg-[var(--pm-surface)] px-4 py-3 border-b border-[var(--pm-border)] flex items-center gap-2">
                <button onClick={() => setScreen("details")} className="text-[var(--pm-text-muted)] hover:text-[var(--pm-text-secondary)]">←</button>
                <span className="text-sm font-semibold">Report Failure</span>
              </div>
              <div className="p-4 space-y-4">
                <div className="text-xs text-red-400 border border-red-800/30 bg-red-950/10 px-3 py-2 mono">
                  Reporting failed delivery for {selectedStop.customer}
                </div>
                <div>
                  <div className="text-xs text-[var(--pm-text-muted)] uppercase tracking-wider mb-2">Failure Reason</div>
                  {failureReasons.map(r => (
                    <label key={r} className="flex items-center gap-2 py-2 text-sm cursor-pointer">
                      <input type="radio" name="reason" value={r} checked={failureReason === r} onChange={() => setFailureReason(r)} className="accent-red-500" />
                      {r}
                    </label>
                  ))}
                </div>
                <div>
                  <div className="text-xs text-[var(--pm-text-muted)] uppercase tracking-wider mb-1">Additional Notes</div>
                  <textarea rows={3} placeholder="Describe what happened…"
                    className="w-full bg-[var(--pm-surface)] border border-[var(--pm-border)] text-[var(--pm-text-secondary)] text-xs px-3 py-2 focus:outline-none resize-none placeholder:text-[var(--pm-text-muted)]" />
                </div>
                <button className="w-full bg-red-700 text-white py-3 font-bold text-sm mono hover:bg-red-600 transition-colors">
                  Submit Failure Report
                </button>
              </div>
            </div>
          )}
        </PhoneFrame>

        {/* Instructions */}
        <div className="flex-1 space-y-4">
          <div className="border border-[var(--pm-border)] bg-[var(--pm-surface)] p-5">
            <div className="text-sm font-semibold mb-3">App Flow</div>
            <div className="space-y-2">
              {[
                ["Login", "Rider logs in with ID + PIN issued by Delivery Manager"],
                ["Today's Route", "Ordered stop list — tap any stop to view details"],
                ["Delivery Details", "Address, unit, customer contact, items, stream label"],
                ["Mark Delivered", "Confirm delivery method + optional note"],
                ["Upload Proof", "Camera capture — photo attached to order record in admin"],
                ["Report Failure", "Select reason + note → creates failed delivery ticket in hub"],
              ].map(([step, desc]) => (
                <div key={step} className="flex gap-3 text-sm">
                  <span className="text-[var(--pm-accent-text)] mono font-bold w-28 flex-shrink-0">{step}</span>
                  <span className="text-[var(--pm-text-muted)] text-xs">{desc}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-[var(--pm-border)] bg-[var(--pm-surface)] p-5">
            <div className="text-sm font-semibold mb-3">Stream Separation on Device</div>
            <div className="space-y-2 text-xs text-[var(--pm-text-muted)]">
              <div className="flex items-center gap-2"><span className="w-3 h-3 bg-[#F5B300] inline-block" /><span>Meal Plans orders shown with yellow accent</span></div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 bg-[#E85D04] inline-block" /><span>Ready Series orders shown with orange accent</span></div>
              <div className="text-[var(--pm-text-muted)] mt-2">Riders see both business streams in a single run list but each order is clearly labelled. Manifests are generated separately per stream in the admin hub.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
