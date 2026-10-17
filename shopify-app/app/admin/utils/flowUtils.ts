// Shared flow utilities: downloads, print, audit

export function downloadCSV(filename: string, rows: Record<string, string | number | boolean>[]) {
  if (!rows.length) return;
  const keys = Object.keys(rows[0]);
  const csv = [keys.join(","), ...rows.map(r => keys.map(k => `"${String(r[k] ?? "")}"`).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadExcel(filename: string, rows: Record<string, string | number | boolean>[]) {
  if (!rows.length) return;
  const keys = Object.keys(rows[0]);
  const tsv = [keys.join("\t"), ...rows.map(r => keys.map(k => String(r[k] ?? "")).join("\t"))].join("\n");
  const blob = new Blob([tsv], { type: "application/vnd.ms-excel" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function printHtml(title: string, bodyHtml: string) {
  const w = window.open("", "_blank", "width=960,height=700");
  if (!w) return;
  w.document.write(`<!DOCTYPE html><html><head><title>${title}</title>
<style>
  body{font-family:'Courier New',monospace;margin:24px;font-size:11px;color:#000}
  h1{font-size:16px;font-weight:bold;margin:0 0 4px}
  .meta{font-size:11px;color:#555;margin-bottom:16px;border-bottom:2px solid #000;padding-bottom:8px}
  .badge{display:inline-block;border:2px solid #000;padding:2px 8px;font-weight:bold;font-size:10px;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px}
  table{width:100%;border-collapse:collapse}
  th{border-bottom:2px solid #000;padding:5px 8px;text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:.5px}
  td{border-bottom:1px solid #ccc;padding:5px 8px;font-size:10px}
  tr:nth-child(even) td{background:#f9f9f9}
  .footer{margin-top:20px;font-size:9px;color:#888;border-top:1px solid #ccc;padding-top:8px}
  .close-bar{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;padding-bottom:12px;border-bottom:1px solid #ddd;gap:12px}
  .bar-left{font-size:10px;color:#888;font-family:'Courier New',monospace;}
  .bar-right{display:flex;gap:8px;flex-shrink:0}
  .close-btn{display:inline-flex;align-items:center;gap:6px;background:#111;color:#fff;border:none;padding:7px 16px;font-family:'Courier New',monospace;font-size:11px;font-weight:bold;letter-spacing:.05em;cursor:pointer;border-radius:6px}
  .close-btn:hover{background:#333}
  .print-btn{display:inline-flex;align-items:center;gap:6px;background:#1a6b1a;color:#fff;border:none;padding:7px 16px;font-family:'Courier New',monospace;font-size:11px;font-weight:bold;letter-spacing:.05em;cursor:pointer;border-radius:6px}
  .print-btn:hover{background:#145014}
  @media print{.no-print{display:none}}
</style></head><body>
<div class="close-bar no-print">
  <span class="bar-left">Performance Meals Admin Portal — ${title}</span>
  <div class="bar-right">
    <button class="print-btn" onclick="window.print()">⎙ Print</button>
    <button class="close-btn" onclick="window.close()">← Close &amp; Return to Portal</button>
  </div>
</div>
${bodyHtml}</body></html>`);
  w.document.close();
}

export function nowStr() {
  return new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export function nowTime() {
  return new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}
