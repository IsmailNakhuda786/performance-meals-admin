import { useState } from "react";
import type { BusinessStream } from "../App";

type ExportType = "kitchen" | "packing" | "manifest";
type ExportFormat = "PDF" | "Excel" | "CSV";
type ExportTab = "generate" | "history";

const kitchenData = {
  rs: [
    { meal: "Beef Rendang", qty: 32, packaging: "500ml Container", notes: "Reduce gravy 15min extra" },
    { meal: "Nasi Lemak Chicken", qty: 40, packaging: "500ml Container", notes: "Sambal on side" },
    { meal: "Mee Goreng Basah", qty: 24, packaging: "500ml Container", notes: "Extra wok hei required" },
    { meal: "Chicken Laksa", qty: 28, packaging: "500ml Container", notes: "Gravy separate" },
    { meal: "Fish Otah Set", qty: 18, packaging: "500ml Container", notes: "Grill 180°C 12min" },
  ],
  mp: [
    { meal: "Grilled Chicken & Rice (CUT)", qty: 48, packaging: "650ml Container", notes: "No oil, steamed only" },
    { meal: "Salmon Teriyaki & Quinoa (BUILD)", qty: 36, packaging: "650ml Container", notes: "Teriyaki glaze light" },
    { meal: "Sweet Potato & Chicken (MAINTAIN)", qty: 58, packaging: "650ml Container", notes: "Standard macro split" },
    { meal: "High Protein Oats (BUILD)", qty: 30, packaging: "400ml Bowl", notes: "Cold prep overnight" },
    { meal: "Lean Beef & Broccoli (CUT)", qty: 42, packaging: "650ml Container", notes: "Minimal sauce" },
  ],
};

const packingData = {
  rs: [
    { meal: "Beef Rendang", qty: 32, packaging: "500ml Container", labels: 32 },
    { meal: "Nasi Lemak Chicken", qty: 40, packaging: "500ml Container", labels: 40 },
    { meal: "Mee Goreng Basah", qty: 24, packaging: "500ml Container", labels: 24 },
    { meal: "Chicken Laksa", qty: 28, packaging: "500ml Container", labels: 28 },
    { meal: "Fish Otah Set", qty: 18, packaging: "500ml Container", labels: 18 },
  ],
  mp: [
    { meal: "Grilled Chicken & Rice (CUT)", qty: 48, packaging: "650ml Container", labels: 48 },
    { meal: "Salmon Teriyaki & Quinoa (BUILD)", qty: 36, packaging: "650ml Container", labels: 36 },
    { meal: "Sweet Potato & Chicken (MAINTAIN)", qty: 58, packaging: "650ml Container", labels: 58 },
    { meal: "High Protein Oats (BUILD)", qty: 30, packaging: "400ml Bowl", labels: 30 },
    { meal: "Lean Beef & Broccoli (CUT)", qty: 42, packaging: "650ml Container", labels: 42 },
  ],
};

interface ManifestRow {
  orderId: string; customer: string; address: string; contact: string;
  window: string; pickupTime: string; dispatchPoint: string;
  type: string; rider: string; route: string;
  notes: string; status: string; changed?: boolean;
}

const manifestData: { rs: ManifestRow[]; mp: ManifestRow[] } = {
  rs: [
    { orderId: "RS-0201", customer: "Wei Jie Lim", address: "Blk 204 Tampines St 21 #08-11", contact: "+65 9123 4567", window: "10:00–12:00", pickupTime: "08:30", dispatchPoint: "Tampines Hub", type: "RS Subscription", rider: "Ahmad Farid", route: "NE Batch A", notes: "Leave at door", status: "Ready to Dispatch" },
    { orderId: "RS-0202", customer: "Jade Koh", address: "12 Woodlands Ave 5 #03-22", contact: "+65 9234 5678", window: "10:00–12:00", pickupTime: "08:30", dispatchPoint: "Woodlands DC", type: "Ready Series A-la-carte", rider: "Benny Lim", route: "North Batch A", notes: "Call on arrival", status: "Ready to Dispatch" },
    { orderId: "RS-0203", customer: "Darren Ong", address: "88 Bukit Timah Rd #11-04", contact: "+65 9345 6789", window: "14:00–16:00", pickupTime: "12:30", dispatchPoint: "Buona Vista Hub", type: "RS Subscription", rider: "Ahmad Farid", route: "Central Batch B", notes: "—", status: "Packing" },
    { orderId: "RS-0204", customer: "Jason Yeo", address: "Blk 44 Geylang Bahru #06-08", contact: "+65 9456 7890", window: "14:00–16:00", pickupTime: "12:30", dispatchPoint: "Toa Payoh Hub", type: "RS Subscription", rider: "Benny Lim", route: "East Batch B", notes: "Fragile — handle with care", status: "Ready to Dispatch", changed: true },
    { orderId: "RS-0205", customer: "Priya K", address: "3 Orchard Blvd #12-02", contact: "+65 9567 8901", window: "10:00–12:00", pickupTime: "08:30", dispatchPoint: "Toa Payoh Hub", type: "Ready Series A-la-carte", rider: "Ahmad Farid", route: "Central Batch A", notes: "—", status: "Ready to Dispatch" },
  ],
  mp: [
    { orderId: "MP-0601", customer: "Marcus Tan", address: "Blk 113 Bishan St 12 #05-14", contact: "+65 9111 2222", window: "10:00–12:00", pickupTime: "08:30", dispatchPoint: "Toa Payoh Hub", type: "Low Carb Regular", rider: "Benny Lim", route: "Central Batch A", notes: "No nuts", status: "Ready to Dispatch" },
    { orderId: "MP-0602", customer: "Aisha Rahman", address: "30 Jalan Besar #07-01", contact: "+65 9222 3333", window: "10:00–12:00", pickupTime: "08:30", dispatchPoint: "Toa Payoh Hub", type: "Balance Regular+", rider: "Ahmad Farid", route: "Central Batch A", notes: "—", status: "Ready to Dispatch" },
    { orderId: "MP-0603", customer: "Natalie Foo", address: "Blk 77 Clementi Ave 2 #14-33", contact: "+65 9333 4444", window: "14:00–16:00", pickupTime: "12:30", dispatchPoint: "Buona Vista Hub", type: "Low Carb Regular", rider: "Benny Lim", route: "West Batch B", notes: "Intercom code: #1433", status: "Packing" },
    { orderId: "MP-0604", customer: "Bryan Low", address: "22 Toa Payoh Rise #09-11", contact: "+65 9444 5555", window: "10:00–12:00", pickupTime: "08:30", dispatchPoint: "Toa Payoh Hub", type: "6 by 60 Plus", rider: "Ahmad Farid", route: "Central Batch A", notes: "—", status: "Ready to Dispatch" },
    { orderId: "MP-0605", customer: "Serene Tay", address: "Blk 5 Ang Mo Kio Ave 10 #03-08", contact: "+65 9555 6666", window: "14:00–16:00", pickupTime: "12:30", dispatchPoint: "AMK Hub", type: "Low Carb Regular", rider: "Benny Lim", route: "NE Batch B", notes: "Delivery window strict", status: "Ready to Dispatch" },
  ],
};

const exportHistory = [
  { id: "EXP-0041", bu: "Meal Plans", type: "Delivery Manifest", date: "15 Sep 2026 07:45", by: "Jerome Lim", format: "PDF", count: 5 },
  { id: "EXP-0040", bu: "Ready Series", type: "Delivery Manifest", date: "15 Sep 2026 07:30", by: "Lena Wong", format: "CSV", count: 5 },
  { id: "EXP-0039", bu: "Meal Plans", type: "Kitchen Production Sheet", date: "15 Sep 2026 06:00", by: "Hafiz Ahmad", format: "PDF", count: 5 },
  { id: "EXP-0038", bu: "Ready Series", type: "Kitchen Production Sheet", date: "15 Sep 2026 06:00", by: "Hafiz Ahmad", format: "Excel", count: 5 },
  { id: "EXP-0037", bu: "Meal Plans", type: "Packing Sheet", date: "14 Sep 2026 17:55", by: "Jerome Lim", format: "PDF", count: 5 },
  { id: "EXP-0036", bu: "Ready Series", type: "Packing Sheet", date: "14 Sep 2026 17:50", by: "Lena Wong", format: "CSV", count: 5 },
];

const exportTypes: { id: ExportType; label: string; icon: string; desc: string }[] = [
  { id: "kitchen", label: "Kitchen Production Sheet", icon: "◉", desc: "Meal · Quantity · Packaging · Production notes" },
  { id: "packing", label: "Packing Sheet", icon: "◧", desc: "Meal · Quantity · Packaging · Labels required" },
  { id: "manifest", label: "Delivery Manifest", icon: "⊡", desc: "Order · Customer · Address · Rider · Route · Status" },
];

const deliveryWindows = ["All Windows", "10:00–12:00", "12:00–14:00", "14:00–16:00", "16:00–18:00"];

export default function ExportCenter({ stream, demoMode }: { stream: BusinessStream; demoMode?: boolean }) {
  const [tab, setTab] = useState<ExportTab>("generate");
  const [exportType, setExportType] = useState<ExportType>("manifest");
  const [streamSel, setStreamSel] = useState<"RS" | "MP">(stream === "meal-plans" ? "MP" : "RS");
  const [selectedWindow, setSelectedWindow] = useState("All Windows");
  const [confirmModal, setConfirmModal] = useState<{ format: ExportFormat } | null>(null);
  const [exported, setExported] = useState(false);
  const [changeControlOpen, setChangeControlOpen] = useState(demoMode ?? false);
  const [historyAction, setHistoryAction] = useState<{ entry: typeof exportHistory[0]; action: string } | null>(null);

  const isMp = streamSel === "MP";
  const accent = isMp ? "#F5B300" : "#E85D04";
  const dateStr = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  const refId = `DO-${Date.now().toString().slice(-6)}`;

  const getRows = () => {
    if (exportType === "kitchen") return isMp ? kitchenData.mp : kitchenData.rs;
    if (exportType === "packing") return isMp ? packingData.mp : packingData.rs;
    return isMp ? manifestData.mp : manifestData.rs;
  };

  const handlePrint = () => {
    if (exportType !== "manifest") {
      setExportType("manifest");
      return;
    }
    const rows = isMp ? manifestData.mp : manifestData.rs;
    const buLabel = isMp ? "Meal Plans" : "Ready Series";
    const html = `<!DOCTYPE html>
<html><head><title>Delivery Order — Performance Meals</title>
<style>
  body { font-family: 'Courier New', monospace; margin: 24px; font-size: 11px; color: #000; }
  h1 { font-size: 16px; font-weight: bold; margin: 0 0 4px; }
  .meta { font-size: 11px; color: #555; margin-bottom: 16px; border-bottom: 2px solid #000; padding-bottom: 8px; }
  .bu-badge { display: inline-block; border: 2px solid #000; padding: 2px 8px; font-weight: bold; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 8px; }
  table { width: 100%; border-collapse: collapse; }
  th { border-bottom: 2px solid #000; padding: 5px 6px; text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; }
  td { border-bottom: 1px solid #ccc; padding: 5px 6px; font-size: 10px; }
  tr:nth-child(even) td { background: #f9f9f9; }
  .footer { margin-top: 24px; font-size: 9px; color: #888; border-top: 1px solid #ccc; padding-top: 8px; }
  .changed-row td { background: #fff3cd !important; }
  .changed-badge { background: #ffc107; padding: 1px 4px; font-size: 8px; font-weight: bold; }
</style></head>
<body>
  <div class="bu-badge">${buLabel}</div>
  <h1>Performance Meals Singapore — Delivery Order</h1>
  <div class="meta">
    Delivery Date: ${dateStr} &nbsp;·&nbsp; Ref: ${refId} &nbsp;·&nbsp; Batch: ${selectedWindow}<br/>
    Generated: ${new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })} &nbsp;·&nbsp; By: Operations Team
  </div>
  <table>
    <thead>
      <tr>
        <th>Order ID</th><th>Customer</th><th>Address</th><th>Contact</th>
        <th>Window</th><th>Pickup</th><th>Dispatch Point</th>
        <th>Rider</th><th>Route</th><th>Product / Plan</th><th>Notes</th><th>Status</th>
      </tr>
    </thead>
    <tbody>
      ${rows.map((r) => `
        <tr ${r.changed ? 'class="changed-row"' : ""}>
          <td>${r.orderId}${r.changed ? ' <span class="changed-badge">CHANGED</span>' : ""}</td>
          <td>${r.customer}</td><td>${r.address}</td><td>${r.contact}</td>
          <td>${r.window}</td><td>${r.pickupTime}</td><td>${r.dispatchPoint}</td>
          <td>${r.rider}</td><td>${r.route}</td>
          <td>${r.type}</td><td>${r.notes}</td><td>${r.status}</td>
        </tr>`).join("")}
    </tbody>
  </table>
  <div class="footer">
    Printed: ${new Date().toLocaleString("en-GB")} &nbsp;·&nbsp; Performance Meals Admin Platform v3 &nbsp;·&nbsp; ${rows.length} records &nbsp;·&nbsp; Confidential — for internal dispatch use only
  </div>
</body></html>`;
    const w = window.open("", "_blank", "width=1000,height=700");
    if (w) { w.document.write(html); w.document.close(); w.print(); }
  };

  const handleDownloadConfirm = (format: ExportFormat) => {
    setConfirmModal({ format });
  };

  const executeDownload = (format: ExportFormat) => {
    setConfirmModal(null);
    setExported(true);

    if (format === "CSV") {
      const rows = getRows() as Record<string, string | number | boolean>[];
      const keys = Object.keys(rows[0]).filter(k => k !== "changed");
      const header = keys.join(",");
      const body = rows.map(r => keys.map(k => `"${r[k] ?? ""}"`).join(",")).join("\n");
      const blob = new Blob([header + "\n" + body], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `PM-${streamSel}-${exportType}-${dateStr.replace(/ /g, "-")}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === "Excel") {
      const rows = getRows() as Record<string, string | number | boolean>[];
      const keys = Object.keys(rows[0]).filter(k => k !== "changed");
      const header = keys.join("\t");
      const body = rows.map(r => keys.map(k => r[k] ?? "").join("\t")).join("\n");
      const blob = new Blob([header + "\n" + body], { type: "application/vnd.ms-excel" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `PM-${streamSel}-${exportType}-${dateStr.replace(/ /g, "-")}.xls`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      handlePrint();
    }
  };

  const renderTable = () => {
    if (exportType === "kitchen") {
      const rows = isMp ? kitchenData.mp : kitchenData.rs;
      return (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--pm-border)]">
              {["Meal Name", "Quantity", "Packaging Type", "Production Notes"].map(h => (
                <th key={h} className="px-4 py-2.5 text-left text-xs text-[var(--pm-text-muted)] uppercase tracking-wider font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.meal} className={`border-b border-[var(--pm-border)] hover:bg-[var(--pm-surface-subtle)] ${i % 2 ? "bg-[var(--pm-surface-subtle)]" : ""}`}>
                <td className="px-4 py-2.5 font-medium">{r.meal}</td>
                <td className="px-4 py-2.5 mono font-bold text-[var(--pm-text-secondary)]">{r.qty}</td>
                <td className="px-4 py-2.5 text-xs text-[var(--pm-text-muted)]">{r.packaging}</td>
                <td className="px-4 py-2.5 text-xs text-[var(--pm-text-muted)] italic">{r.notes}</td>
              </tr>
            ))}
            <tr className="border-t-2 border-[var(--pm-border)] bg-[var(--pm-bg)]">
              <td className="px-4 py-2.5 font-bold text-xs uppercase tracking-wider text-[var(--pm-text-muted)]">TOTAL</td>
              <td className="px-4 py-2.5 mono font-extrabold" style={{ color: accent }}>{rows.reduce((a, r) => a + r.qty, 0)}</td>
              <td colSpan={2} />
            </tr>
          </tbody>
        </table>
      );
    }

    if (exportType === "packing") {
      const rows = isMp ? packingData.mp : packingData.rs;
      return (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--pm-border)]">
              {["Meal Name", "Quantity", "Packaging Type", "Labels Required"].map(h => (
                <th key={h} className="px-4 py-2.5 text-left text-xs text-[var(--pm-text-muted)] uppercase tracking-wider font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.meal} className={`border-b border-[var(--pm-border)] hover:bg-[var(--pm-surface-subtle)] ${i % 2 ? "bg-[var(--pm-surface-subtle)]" : ""}`}>
                <td className="px-4 py-2.5 font-medium">{r.meal}</td>
                <td className="px-4 py-2.5 mono font-bold text-[var(--pm-text-secondary)]">{r.qty}</td>
                <td className="px-4 py-2.5 text-xs text-[var(--pm-text-muted)]">{r.packaging}</td>
                <td className="px-4 py-2.5 mono text-[var(--pm-text-secondary)]">{r.labels}</td>
              </tr>
            ))}
            <tr className="border-t-2 border-[var(--pm-border)] bg-[var(--pm-bg)]">
              <td className="px-4 py-2.5 font-bold text-xs uppercase tracking-wider text-[var(--pm-text-muted)]">TOTAL</td>
              <td className="px-4 py-2.5 mono font-extrabold" style={{ color: accent }}>{rows.reduce((a, r) => a + r.qty, 0)}</td>
              <td />
              <td className="px-4 py-2.5 mono font-extrabold" style={{ color: accent }}>{rows.reduce((a, r) => a + r.labels, 0)}</td>
            </tr>
          </tbody>
        </table>
      );
    }

    const rows = isMp ? manifestData.mp : manifestData.rs;
    const changedCount = rows.filter(r => r.changed).length;
    return (
      <>
        {changedCount > 0 && changeControlOpen && (
          <div className="border-b border-orange-700/40 bg-orange-950/20 px-4 py-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs font-extrabold text-orange-400 mono uppercase tracking-wider mb-1">
                  ⚠ DO Change Control — {changedCount} order{changedCount > 1 ? "s" : ""} changed after DO generation
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2 text-xs">
                  <div className="border border-orange-700/30 p-2">
                    <div className="text-[var(--pm-text-muted)] uppercase tracking-wider mb-1 text-[10px]">Previous Version</div>
                    <div className="mono text-[var(--pm-text-muted)]">RS-0204 · Jason Yeo</div>
                    <div className="text-[var(--pm-text-muted)]">Address: Blk 44 Geylang Bahru #06-08</div>
                    <div className="text-[var(--pm-text-muted)]">Notes: —</div>
                  </div>
                  <div className="border border-orange-700/30 p-2">
                    <div className="text-[var(--pm-text-muted)] uppercase tracking-wider mb-1 text-[10px]">Updated Version</div>
                    <div className="mono text-[var(--pm-text-secondary)]">RS-0204 · Jason Yeo</div>
                    <div className="text-orange-300">Address: Blk 44 Geylang Bahru #06-08 ← unchanged</div>
                    <div className="text-orange-300">Notes: Fragile — handle with care ← added</div>
                  </div>
                </div>
                <div className="flex gap-4 mt-2 text-[10px] text-[var(--pm-text-muted)] mono">
                  <span>Changed by: <span className="text-[var(--pm-text-muted)]">Sarah Tan (Support)</span></span>
                  <span>·</span>
                  <span>Timestamp: <span className="text-[var(--pm-text-muted)]">{dateStr} 09:14</span></span>
                  <span>·</span>
                  <span className="text-orange-400">DO regeneration required</span>
                </div>
              </div>
              <button onClick={() => setChangeControlOpen(false)} className="text-[var(--pm-text-muted)] hover:text-[var(--pm-text-muted)] text-lg ml-4">×</button>
            </div>
          </div>
        )}
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--pm-border)]">
              {["Order ID", "Customer", "Address", "Contact", "Window", "Pickup", "Dispatch Point", "Rider", "Route", "Product / Plan", "Notes", "Status"].map(h => (
                <th key={h} className="px-3 py-2.5 text-left text-xs text-[var(--pm-text-muted)] uppercase tracking-wider font-medium whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.orderId} className={`border-b border-[var(--pm-border)] hover:bg-[var(--pm-surface-subtle)] ${r.changed ? "bg-orange-950/10" : i % 2 ? "bg-[var(--pm-surface-subtle)]" : ""}`}>
                <td className="px-3 py-2.5 mono text-xs">
                  <span style={{ color: accent }}>{r.orderId}</span>
                  {r.changed && <span className="ml-1 text-[9px] bg-orange-900/60 text-orange-400 px-1 py-0.5 font-bold">CHANGED</span>}
                </td>
                <td className="px-3 py-2.5 font-medium text-xs whitespace-nowrap">{r.customer}</td>
                <td className="px-3 py-2.5 text-xs text-[var(--pm-text-muted)] max-w-[140px] truncate">{r.address}</td>
                <td className="px-3 py-2.5 mono text-xs text-[var(--pm-text-muted)] whitespace-nowrap">{r.contact}</td>
                <td className="px-3 py-2.5 mono text-xs whitespace-nowrap" style={{ color: accent }}>{r.window}</td>
                <td className="px-3 py-2.5 mono text-xs text-[var(--pm-text-muted)] whitespace-nowrap">{r.pickupTime}</td>
                <td className="px-3 py-2.5 text-xs text-[var(--pm-text-muted)] whitespace-nowrap">{r.dispatchPoint}</td>
                <td className="px-3 py-2.5 text-xs text-[var(--pm-text-muted)] whitespace-nowrap">{r.rider}</td>
                <td className="px-3 py-2.5 text-xs text-[var(--pm-text-muted)] whitespace-nowrap">{r.route}</td>
                <td className="px-3 py-2.5 text-xs text-[var(--pm-text-muted)] max-w-[120px] truncate">{r.type}</td>
                <td className="px-3 py-2.5 text-xs text-[var(--pm-text-muted)] italic max-w-[120px] truncate">{r.notes}</td>
                <td className="px-3 py-2.5 text-xs whitespace-nowrap">
                  <span className={`mono text-xs px-2 py-0.5 font-bold ${
                    r.status === "Ready to Dispatch" ? "bg-green-950/40 text-green-400" : "bg-yellow-950/40 text-yellow-400"
                  }`}>{r.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    );
  };

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold">Delivery Order Export Center</h2>
          <div className="text-xs text-[var(--pm-text-muted)] mono mt-0.5">
            DO Ref: <span className="text-[var(--pm-text-muted)]">{refId}</span> &nbsp;·&nbsp; {dateStr}
          </div>
        </div>
        <div className="flex gap-1 border border-[var(--pm-border)]">
          {(["generate", "history"] as ExportTab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 text-xs font-bold mono uppercase tracking-wider transition-colors ${
                tab === t ? "bg-[#F5B300] text-black" : "text-[var(--pm-text-muted)] hover:text-[var(--pm-text-secondary)]"
              }`}>
              {t === "generate" ? "Generate DO" : "Export History"}
            </button>
          ))}
        </div>
      </div>

      {tab === "generate" && (
        <>
          {/* Export type selector */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {exportTypes.map(e => (
              <button key={e.id} onClick={() => setExportType(e.id)}
                className={`border p-4 text-left transition-colors ${exportType === e.id ? "border-[#F5B300] bg-[#F5B300]/5" : "border-[var(--pm-border)] bg-[var(--pm-surface)] hover:border-[var(--pm-border-strong)]"}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg" style={{ color: exportType === e.id ? "#F5B300" : "#888" }}>{e.icon}</span>
                  <span className={`text-sm font-bold ${exportType === e.id ? "text-[var(--pm-accent-text)]" : "text-[var(--pm-text-secondary)]"}`}>{e.label}</span>
                </div>
                <div className="text-xs text-[var(--pm-text-muted)]">{e.desc}</div>
              </button>
            ))}
          </div>

          {/* Controls row */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* BU selector — strict separation */}
            <div className="flex gap-0 border border-[var(--pm-border)]">
              <button onClick={() => setStreamSel("MP")}
                className={`px-4 py-2 text-xs font-extrabold mono uppercase tracking-widest transition-colors ${streamSel === "MP" ? "bg-[#F5B300] text-black" : "text-[var(--pm-text-muted)] hover:text-[var(--pm-text-secondary)]"}`}>
                Meal Plans
              </button>
              <div className="w-px bg-[var(--pm-surface-muted)]" />
              <button onClick={() => setStreamSel("RS")}
                className={`px-4 py-2 text-xs font-extrabold mono uppercase tracking-widest transition-colors ${streamSel === "RS" ? "bg-[#E85D04] text-black" : "text-[var(--pm-text-muted)] hover:text-[var(--pm-text-secondary)]"}`}>
                Ready Series
              </button>
            </div>

            {/* Delivery window filter */}
            <select
              value={selectedWindow}
              onChange={e => setSelectedWindow(e.target.value)}
              className="bg-[var(--pm-surface)] border border-[var(--pm-border)] text-[var(--pm-text-muted)] text-xs px-3 py-2 mono focus:outline-none focus:border-[#F5B300]"
            >
              {deliveryWindows.map(w => <option key={w}>{w}</option>)}
            </select>

            <div className="ml-auto flex gap-2">
              {exportType === "manifest" && (
                <button onClick={handlePrint}
                  className="border border-[var(--pm-border)] text-xs px-4 py-2 mono font-bold transition-colors hover:border-[#E8E8E8] hover:text-[var(--pm-text-secondary)] text-[var(--pm-text-muted)]">
                  ⎙ PRINT
                </button>
              )}
              {(["PDF", "Excel", "CSV"] as ExportFormat[]).map(f => (
                <button key={f} onClick={() => handleDownloadConfirm(f)}
                  className="border text-xs px-4 py-2 mono font-bold transition-colors"
                  style={{ borderColor: accent + "60", color: accent }}>
                  {f} ↓
                </button>
              ))}
            </div>
          </div>

          {/* Preview label */}
          <div className="flex items-center gap-3">
            <div className="text-xs mono text-[var(--pm-text-muted)] uppercase tracking-widest">Preview —</div>
            <div className="text-xs mono font-bold" style={{ color: accent }}>
              {exportTypes.find(e => e.id === exportType)?.label} · {streamSel}
            </div>
            <div className="text-xs mono text-[var(--pm-text-muted)]">{dateStr}</div>
            {exported && (
              <div className="text-xs mono text-green-400 border border-green-800/40 bg-green-950/10 px-2 py-0.5">
                ✓ Export logged to Audit Trail
              </div>
            )}
          </div>

          {/* Table preview */}
          <div className="border border-[var(--pm-border)] bg-[var(--pm-surface)] overflow-x-auto">
            {renderTable()}
          </div>

          {/* Export summary footer */}
          <div className="border border-[var(--pm-border)] bg-[var(--pm-surface)] px-4 py-3 flex items-center justify-between">
            <div className="text-xs text-[var(--pm-text-muted)]">
              <span className="font-bold text-[var(--pm-text-secondary)]">{getRows().length}</span> records ·{" "}
              <span className="font-bold" style={{ color: accent }}>{streamSel === "MP" ? "Meal Plans" : "Ready Series"}</span> ·{" "}
              {exportTypes.find(e => e.id === exportType)?.label}
            </div>
            <div className="text-xs mono text-[var(--pm-text-muted)]">
              Ref: {refId} · Authorized staff only
            </div>
          </div>
        </>
      )}

      {tab === "history" && (
        <div className="space-y-4">
          <div className="text-xs text-[var(--pm-text-muted)] mono">
            All exports are audited. Reprints and re-downloads are logged with user and timestamp.
          </div>
          <div className="border border-[var(--pm-border)] bg-[var(--pm-surface)] overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--pm-border)]">
                  {["Export ID", "Business Unit", "Export Type", "Date", "Generated By", "Format", "Records", "Actions"].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left text-xs text-[var(--pm-text-muted)] uppercase tracking-wider font-medium whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {exportHistory.map((entry, i) => (
                  <tr key={entry.id} className={`border-b border-[var(--pm-border)] hover:bg-[var(--pm-surface-subtle)] ${i % 2 ? "bg-[var(--pm-surface-subtle)]" : ""}`}>
                    <td className="px-4 py-2.5 mono text-xs text-[var(--pm-accent-text)]">{entry.id}</td>
                    <td className="px-4 py-2.5">
                      <span className="text-xs font-bold mono px-2 py-0.5"
                        style={{ color: entry.bu === "Meal Plans" ? "#F5B300" : "#E85D04", borderColor: (entry.bu === "Meal Plans" ? "#F5B300" : "#E85D04") + "40", border: "1px solid" }}>
                        {entry.bu === "Meal Plans" ? "MP" : "RS"}
                      </span>
                      <span className="ml-2 text-xs text-[var(--pm-text-muted)]">{entry.bu}</span>
                    </td>
                    <td className="px-4 py-2.5 text-xs text-[var(--pm-text-muted)]">{entry.type}</td>
                    <td className="px-4 py-2.5 mono text-xs text-[var(--pm-text-muted)] whitespace-nowrap">{entry.date}</td>
                    <td className="px-4 py-2.5 text-xs text-[var(--pm-text-secondary)]">{entry.by}</td>
                    <td className="px-4 py-2.5">
                      <span className="text-xs mono font-bold border border-[var(--pm-border)] px-2 py-0.5 text-[var(--pm-text-muted)]">{entry.format}</span>
                    </td>
                    <td className="px-4 py-2.5 mono text-xs text-[var(--pm-text-secondary)] text-center">{entry.count}</td>
                    <td className="px-4 py-2.5">
                      <div className="flex gap-1.5">
                        {["View", "Print Again", "Download Again"].map(action => (
                          <button key={action}
                            onClick={() => setHistoryAction({ entry, action })}
                            className="text-xs border border-[var(--pm-border)] text-[var(--pm-text-muted)] px-2 py-1 mono hover:border-[#F5B300] hover:text-[var(--pm-accent-text)] transition-colors whitespace-nowrap">
                            {action}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-xs text-[var(--pm-text-muted)] mono border border-[var(--pm-border)] bg-[var(--pm-surface)] px-4 py-2">
            ⊟ Every reprint and re-download is recorded in the Audit Log with user, timestamp, and export reference.
          </div>
        </div>
      )}

      {/* Download confirmation modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="bg-[var(--pm-surface)] border border-[var(--pm-border)] w-[400px]">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--pm-border)]">
              <span className="font-bold mono" style={{ color: accent }}>Confirm Export — {confirmModal.format}</span>
              <button onClick={() => setConfirmModal(null)} className="text-[var(--pm-text-muted)] hover:text-[var(--pm-text-secondary)] text-xl">×</button>
            </div>
            <div className="p-4 space-y-3">
              <div className="border border-[var(--pm-border)] bg-[var(--pm-bg)] p-3 space-y-1.5 text-xs">
                {[
                  ["Business Unit", streamSel === "MP" ? "Meal Plans" : "Ready Series"],
                  ["Export Type", exportTypes.find(e => e.id === exportType)?.label ?? ""],
                  ["Format", confirmModal.format],
                  ["Records", String(getRows().length)],
                  ["Date", dateStr],
                  ["Ref", refId],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-[var(--pm-text-muted)] uppercase tracking-wider">{k}</span>
                    <span className="mono text-[var(--pm-text-secondary)]">{v}</span>
                  </div>
                ))}
              </div>
              <div className="text-xs text-[var(--pm-text-muted)] border border-[var(--pm-border)] px-3 py-2 bg-[var(--pm-bg)]">
                This export will be logged to the Audit Trail with your user ID, timestamp, and record count.
              </div>
              <div className="flex gap-2">
                <button onClick={() => executeDownload(confirmModal.format)}
                  className="flex-1 py-2 text-sm font-bold mono transition-colors text-black"
                  style={{ backgroundColor: accent }}>
                  Confirm & Download
                </button>
                <button onClick={() => setConfirmModal(null)}
                  className="flex-1 border border-[var(--pm-border)] text-[var(--pm-text-muted)] py-2 text-sm mono hover:text-[var(--pm-text-secondary)] transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History action modal */}
      {historyAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="bg-[var(--pm-surface)] border border-[var(--pm-border)] w-[380px]">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--pm-border)]">
              <span className="font-bold text-[var(--pm-accent-text)] mono">{historyAction.action} — {historyAction.entry.id}</span>
              <button onClick={() => setHistoryAction(null)} className="text-[var(--pm-text-muted)] hover:text-[var(--pm-text-secondary)] text-xl">×</button>
            </div>
            <div className="p-4 space-y-3">
              <div className="border border-[var(--pm-border)] bg-[var(--pm-bg)] p-3 text-xs space-y-1.5">
                {[
                  ["Export ID", historyAction.entry.id],
                  ["Business Unit", historyAction.entry.bu],
                  ["Type", historyAction.entry.type],
                  ["Originally Generated", historyAction.entry.date],
                  ["Generated By", historyAction.entry.by],
                  ["Format", historyAction.entry.format],
                  ["Records", String(historyAction.entry.count)],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-[var(--pm-text-muted)] uppercase tracking-wider">{k}</span>
                    <span className="mono text-[var(--pm-text-muted)]">{v}</span>
                  </div>
                ))}
              </div>
              <div className="text-xs text-yellow-400 bg-yellow-950/20 border border-yellow-800/30 px-3 py-2 mono">
                ⚠ {historyAction.action} will be recorded in Audit Log with your credentials and timestamp.
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (historyAction.action === "Print Again") handlePrint();
                    else if (historyAction.action === "Download Again") executeDownload(historyAction.entry.format as ExportFormat);
                    setHistoryAction(null);
                  }}
                  className="flex-1 bg-[#F5B300] text-black py-2 text-sm font-bold mono hover:bg-[#C99200] transition-colors">
                  {historyAction.action}
                </button>
                <button onClick={() => setHistoryAction(null)}
                  className="flex-1 border border-[var(--pm-border)] text-[var(--pm-text-muted)] py-2 text-sm mono hover:text-[var(--pm-text-secondary)] transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
