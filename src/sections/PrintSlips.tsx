import { useState } from "react";
import { orders, type Order } from "../data";
import type { BusinessStream } from "../App";

function SlipModal({ order, onClose }: { order: Order; onClose: () => void }) {
  const handlePrint = () => window.print();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="bg-[var(--pm-surface)] border border-[var(--pm-border)] w-full max-w-[520px] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--pm-border)]">
          <span className="font-bold mono text-[var(--pm-accent-text)]">{order.id} — Print Slip Preview</span>
          <div className="flex gap-2">
            <button onClick={handlePrint} className="bg-[#F5B300] text-black text-xs font-bold px-3 py-1.5 hover:bg-[#C99200] transition-colors mono">
              Print
            </button>
            <button onClick={onClose} className="border border-[var(--pm-border)] text-[var(--pm-text-muted)] text-xs px-3 py-1.5 hover:border-[#F5B300] hover:text-[var(--pm-text-secondary)] transition-colors">
              Close
            </button>
          </div>
        </div>

        {/* Print area */}
        <div className="print-area p-6 font-mono text-black bg-white text-sm leading-relaxed">
          {/* Header */}
          <div className="border-b-2 border-black pb-3 mb-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-xl font-bold tracking-tight">PERFORMANCE MEALS</div>
                <div className="text-xs text-gray-600 mt-0.5">Meal Prep Subscription — Singapore</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg">{order.id}</div>
                <div className="text-xs text-gray-600">{new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</div>
              </div>
            </div>
          </div>

          {/* Customer info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 border-b border-gray-300 pb-4">
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Customer</div>
              <div className="font-bold text-base">{order.customer}</div>
              <div className="text-xs mt-1 text-gray-700">{order.address}</div>
              <div className="text-xs text-gray-700">{order.phone}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Plan Details</div>
              <div className="font-semibold">{order.planType}</div>
              {order.goal && <div className="text-sm font-bold text-gray-800">Goal: {order.goal}</div>}
              {order.planWeek && <div className="text-sm font-bold text-gray-800">Plan Week: {order.planWeek}</div>}
              <div className="text-xs text-gray-600 mt-1">Delivery: {order.deliveryWindow}</div>
            </div>
          </div>

          {/* Meal list */}
          <div className="mb-4">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Meals ({order.meals} total)</div>
            <table className="w-full text-xs border border-gray-300">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-300">
                  <th className="px-2 py-1.5 text-left">#</th>
                  <th className="px-2 py-1.5 text-left">Meal</th>
                  <th className="px-2 py-1.5 text-center">Session</th>
                  <th className="px-2 py-1.5 text-right">kcal</th>
                  <th className="px-2 py-1.5 text-right">P</th>
                  <th className="px-2 py-1.5 text-right">C</th>
                  <th className="px-2 py-1.5 text-right">F</th>
                </tr>
              </thead>
              <tbody>
                {(order.mealList ?? []).map((m, i) => (
                  <tr key={i} className={`border-b border-gray-200 ${i % 2 === 0 ? "" : "bg-gray-50"}`}>
                    <td className="px-2 py-1.5 text-gray-500">{i + 1}</td>
                    <td className="px-2 py-1.5 font-medium">{m.name}</td>
                    <td className="px-2 py-1.5 text-center">
                      <span className={`px-1.5 py-0.5 text-xs font-bold ${m.session === "Lunch" ? "bg-yellow-100 text-yellow-800" : "bg-blue-100 text-blue-800"}`}>
                        {m.session}
                      </span>
                    </td>
                    <td className="px-2 py-1.5 text-right">{m.calories}</td>
                    <td className="px-2 py-1.5 text-right">{m.protein}g</td>
                    <td className="px-2 py-1.5 text-right">{m.carbs}g</td>
                    <td className="px-2 py-1.5 text-right">{m.fat}g</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-100 font-bold border-t border-gray-400">
                  <td className="px-2 py-1.5" colSpan={3}>Total</td>
                  <td className="px-2 py-1.5 text-right">{(order.mealList ?? []).reduce((a, m) => a + m.calories, 0)}</td>
                  <td className="px-2 py-1.5 text-right">{(order.mealList ?? []).reduce((a, m) => a + m.protein, 0)}g</td>
                  <td className="px-2 py-1.5 text-right">{(order.mealList ?? []).reduce((a, m) => a + m.carbs, 0)}g</td>
                  <td className="px-2 py-1.5 text-right">{(order.mealList ?? []).reduce((a, m) => a + m.fat, 0)}g</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Sign-off */}
          <div className="border-t border-gray-300 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">Packed by</div>
              <div className="border-b border-gray-400 h-8" />
              <div className="text-xs text-gray-500 mt-1">Name & Signature</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">Checked by</div>
              <div className="border-b border-gray-400 h-8" />
              <div className="text-xs text-gray-500 mt-1">Name & Signature</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const runLabels = ["Run A (9am–12pm)", "Run B (12pm–3pm)", "Run C (3pm–6pm)"];

export default function PrintSlips({ stream }: { stream: BusinessStream }) {
  const [activeRun, setActiveRun] = useState(0);
  const [modalOrder, setModalOrder] = useState<Order | null>(null);

  const accent = stream === "meal-plans" ? "#F5B300" : "#E85D04";
  const streamOrders = orders.filter(o =>
    stream === "meal-plans" ? o.planType === "Meal Plan" : o.planType !== "Meal Plan"
  );
  const runOrders = [
    streamOrders.filter(o => o.deliveryWindow === "9am–12pm" && o.mealList),
    streamOrders.filter(o => o.deliveryWindow === "12pm–3pm" && o.mealList),
    streamOrders.filter(o => o.deliveryWindow === "3pm–6pm" && o.mealList),
  ];
  const runs = runLabels;

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold">Print Slips</h2>
        <button
          className="text-black px-4 py-2 text-sm font-bold transition-colors mono"
          style={{ background: accent }}
        >
          Print All — {runs[activeRun].split(" ")[0]} {runs[activeRun].split(" ")[1]}
        </button>
      </div>

      {/* Run tabs */}
      <div className="flex border-b border-[var(--pm-border)]">
        {runs.map((r, i) => (
          <button
            key={r}
            onClick={() => setActiveRun(i)}
            className={`px-5 py-3 text-sm font-medium mono transition-colors ${
              activeRun === i
                ? "border-b-2 border-[#F5B300] text-[var(--pm-accent-text)]"
                : "text-[var(--pm-text-muted)] hover:text-[var(--pm-text-secondary)]"
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {runOrders[activeRun].map(order => (
          <div key={order.id} className="border border-[var(--pm-border)] bg-[var(--pm-surface)] hover:border-[#F5B300]/40 transition-colors">
            <div className="px-4 py-3 border-b border-[var(--pm-border)] flex items-center justify-between">
              <div>
                <span className="mono text-[var(--pm-accent-text)] font-bold">{order.id}</span>
                <span className="text-sm ml-2 font-medium">{order.customer}</span>
              </div>
              <button
                onClick={() => setModalOrder(order)}
                className="text-xs border border-[var(--pm-border)] px-3 py-1 text-[var(--pm-text-muted)] hover:border-[#F5B300] hover:text-[var(--pm-accent-text)] transition-colors mono"
              >
                View & Print
              </button>
            </div>
            <div className="px-4 py-3 text-xs text-[var(--pm-text-muted)] space-y-1">
              <div className="flex justify-between">
                <span>{order.planType}{order.goal ? ` — ${order.goal}` : ""}</span>
                <span className="mono">{order.meals} meals</span>
              </div>
              {order.planWeek && <div className="mono text-[var(--pm-secondary-text)]">Plan {order.planWeek}</div>}
              <div className="text-[var(--pm-text-muted)]">{order.address}</div>
            </div>
          </div>
        ))}
      </div>

      {modalOrder && <SlipModal order={modalOrder} onClose={() => setModalOrder(null)} />}
    </div>
  );
}
