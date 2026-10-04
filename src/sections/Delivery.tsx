import { orders } from "../data";
import type { BusinessStream } from "../App";
import { downloadCSV, printHtml, nowStr, nowTime } from "../utils/flowUtils";

const mealSummary = [
  { name: "Grilled Chicken & Jasmine Rice", count: 18 },
  { name: "Salmon with Sweet Potato", count: 14 },
  { name: "Beef Bolognese Wholemeal Pasta", count: 11 },
  { name: "Turkey Meatballs & Brown Rice", count: 10 },
  { name: "Teriyaki Chicken & Broccoli", count: 8 },
  { name: "Pan-Seared Barramundi & Quinoa", count: 7 },
  { name: "Chicken Tikka & Basmati Rice", count: 5 },
];

export default function Delivery({ stream, demoMode }: { stream: BusinessStream; demoMode?: boolean }) {
  const accent = stream === "meal-plans" ? "#F5B300" : "#E85D04";

  const streamOrders = orders.filter(o =>
    stream === "meal-plans" ? o.planType === "Meal Plan" : o.planType !== "Meal Plan"
  );

  const runs = [
    { id: "Run A", window: "9am – 12pm", orders: streamOrders.filter(o => o.deliveryWindow === "9am–12pm"), packed: 2 },
    { id: "Run B", window: "12pm – 3pm", orders: streamOrders.filter(o => o.deliveryWindow === "12pm–3pm"), packed: 1 },
    { id: "Run C", window: "3pm – 6pm", orders: streamOrders.filter(o => o.deliveryWindow === "3pm–6pm"), packed: 0 },
  ];

  const handlePrintManifest = () => {
    const runsRows = runs.map(run => `
      <tr><td colspan="5" style="background:#111;color:#F5B300;font-weight:bold;padding:8px">${run.id} — ${run.window} (${run.packed}/${run.orders.length} packed)</td></tr>
      ${run.orders.map(o => `<tr><td>${o.id}</td><td>${o.customer}</td><td>${o.meals}×</td><td>${o.planType}</td><td>${o.status}</td></tr>`).join("")}
    `).join("");
    const body = `
      <div class="badge">Performance Meals</div>
      <h1>Delivery Manifest</h1>
      <div class="meta">Printed: ${nowStr()} ${nowTime()}</div>
      <table>
        <thead><tr><th>Order ID</th><th>Customer</th><th>Meals</th><th>Plan Type</th><th>Status</th></tr></thead>
        <tbody>${runsRows}</tbody>
      </table>
      <div class="footer">Performance Meals — Delivery Manifest — Generated ${nowStr()} ${nowTime()}</div>
    `;
    printHtml("Delivery Manifest", body);
  };

  const handleCSV = () => {
    const rows = streamOrders.map(o => ({
      "Order ID": o.id,
      "Customer": o.customer,
      "Plan Type": o.planType,
      "Meals": o.meals,
      "Delivery Window": o.deliveryWindow,
      "Status": o.status,
    }));
    downloadCSV("delivery-manifest.csv", rows);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold">Delivery</h2>
        <div className="flex gap-2">
          <button onClick={handlePrintManifest} className="border border-[#3A3A3A] text-[#CCCCCC] text-xs px-3 py-2 mono hover:border-[#F5B300] hover:text-[#F5B300] transition-colors">Export Manifest ↓</button>
          <button onClick={handleCSV} className="border border-[#3A3A3A] text-[#CCCCCC] text-xs px-3 py-2 mono hover:border-[#F5B300] hover:text-[#F5B300] transition-colors">CSV ↓</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {runs.map(run => {
          const total = run.orders.length || 1;
          const pct = Math.round((run.packed / total) * 100);
          return (
            <div key={run.id} className="border border-[#2A2A2A] bg-[#181818]">
              <div className="px-4 py-3 border-b border-[#2A2A2A] flex items-center justify-between">
                <div>
                  <span className="font-bold mono" style={{ color: accent }}>{run.id}</span>
                  <span className="text-[#888] text-xs mono ml-2">{run.window}</span>
                </div>
                <span className="mono text-xs text-[#888]">{run.packed}/{run.orders.length} packed</span>
              </div>
              <div className="p-4 space-y-3">
                {/* Progress bar */}
                <div className="h-2 bg-[#2A2A2A]">
                  <div
                    className="h-2 transition-all"
                    style={{ width: `${pct}%`, background: pct === 100 ? "#22C55E" : accent }}
                  />
                </div>
                <div className="text-xs mono text-[#888]">{pct}% packed</div>

                {/* Orders in run */}
                <div className="space-y-1 mt-2">
                  {run.orders.map(o => (
                    <div key={o.id} className="flex items-center justify-between text-xs border border-[#2A2A2A] px-3 py-2 hover:border-[#F5B300]/30">
                      <div>
                        <span className="mono" style={{ color: accent }}>{o.id}</span>
                        <span className="ml-2 text-[#E8E8E8]">{o.customer}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="mono text-[#888]">{o.meals}×</span>
                        <span className={`mono text-xs ${
                          o.status === "Packed" ? "text-blue-400" :
                          o.status === "Packing" ? "text-yellow-400" :
                          "text-[#888]"
                        }`}>{o.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Meals by type */}
      <div className="border border-[#2A2A2A] bg-[#181818]">
        <div className="px-4 py-3 border-b border-[#2A2A2A]">
          <span className="text-sm font-semibold tracking-wide">Meals to Prepare Today</span>
        </div>
        <div className="p-4 space-y-2">
          {mealSummary.map(m => {
            const pct = Math.round((m.count / 73) * 100);
            return (
              <div key={m.name} className="flex items-center gap-4">
                <div className="w-52 text-sm truncate">{m.name}</div>
                <div className="flex-1 h-1.5 bg-[#2A2A2A]">
                  <div className="h-1.5 bg-[#E85D04]" style={{ width: `${pct}%` }} />
                </div>
                <div className="mono text-sm font-bold text-[#E8E8E8] w-6 text-right">{m.count}</div>
              </div>
            );
          })}
          <div className="pt-2 border-t border-[#2A2A2A] flex justify-between text-xs">
            <span className="text-[#888]">Total meals today</span>
            <span className="mono font-bold text-[#F5B300]">73</span>
          </div>
        </div>
      </div>
    </div>
  );
}
