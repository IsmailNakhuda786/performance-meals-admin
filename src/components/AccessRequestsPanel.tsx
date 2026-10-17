import type { AccessRequest } from "../accessControl";

interface Props {
  requests: AccessRequest[];
  selectedRequestId?: string | null;
  onSelectRequest?: (requestId: string | null) => void;
  onDecide: (requestId: string, status: "Approved" | "Rejected") => void;
}

const statusStyle: Record<AccessRequest["status"], string> = {
  Pending: "border-yellow-300 bg-yellow-50 text-yellow-800",
  Approved: "border-green-300 bg-green-50 text-green-800",
  Rejected: "border-red-300 bg-red-50 text-red-800",
  Expired: "border-gray-300 bg-gray-50 text-gray-700",
};

export default function AccessRequestsPanel({ requests, selectedRequestId, onSelectRequest, onDecide }: Props) {
  const sortedRequests = [...requests].sort((a, b) => Number(b.status === "Pending") - Number(a.status === "Pending"));
  const selectedRequest = requests.find(request => request.id === selectedRequestId) ?? null;

  const accessLabel = (request: AccessRequest) => request.requestType === "Module Permission"
    ? request.moduleLabel
    : `${request.targetDepartment} — ${request.targetRole}`;

  return (
    <>
      <div className="overflow-hidden rounded-xl border" style={{ background: "var(--pm-surface)", borderColor: "var(--pm-border)" }}>
        <div className="border-b p-4" style={{ borderColor: "var(--pm-border)" }}>
          <h3 className="font-display text-sm font-bold">Internal access requests</h3>
          <p className="mt-1 text-xs" style={{ color: "var(--pm-text-muted)" }}>Review requested screens, permissions, duration, and business justification before deciding.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] table-fixed text-sm">
            <colgroup>
              <col className="w-[115px]" />
              <col className="w-[170px]" />
              <col className="w-[300px]" />
              <col className="w-[115px]" />
              <col className="w-[125px]" />
              <col className="w-[220px]" />
            </colgroup>
            <thead style={{ background: "var(--pm-surface-subtle)" }}>
              <tr>
                {["Request", "Team member", "Requested access", "Duration", "Status", "Actions"].map(label => (
                  <th key={label} className="px-4 py-3 text-left text-xs font-bold">{label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedRequests.map(request => (
                <tr
                  key={request.id}
                  tabIndex={0}
                  onClick={() => onSelectRequest?.(request.id)}
                  onKeyDown={event => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      onSelectRequest?.(request.id);
                    }
                  }}
                  className="cursor-pointer border-t hover:bg-[#F5B300]/5 focus:bg-[#F5B300]/5 focus:outline-none"
                  style={{ borderColor: "var(--pm-border-soft)" }}
                >
                  <td className="px-4 py-3 font-mono text-xs font-bold text-[var(--pm-accent-text)]">{request.id}</td>
                  <td className="px-4 py-3">
                    <div className="font-semibold">{request.requestedBy}</div>
                    <div className="mt-0.5 text-xs text-[var(--pm-text-muted)]">{request.requestedAt}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold">{accessLabel(request)}</div>
                    {request.requestType === "Module Permission" && <div className="mt-1 line-clamp-2 text-xs text-[var(--pm-text-muted)]">{(request.permissions ?? ["View"]).join(", ")}</div>}
                  </td>
                  <td className="px-4 py-3 text-xs font-semibold">{request.duration}</td>
                  <td className="px-4 py-3"><span className={`inline-flex rounded-full border px-2 py-1 text-xs font-bold ${statusStyle[request.status]}`}>{request.status}</span></td>
                  <td className="px-4 py-3">
                    {request.status === "Pending" ? (
                      <div className="flex gap-2">
                        <button onClick={event => { event.stopPropagation(); onDecide(request.id, "Rejected"); }} className="rounded-md border border-red-300 px-3 py-1.5 text-xs font-bold text-red-700">Reject</button>
                        <button onClick={event => { event.stopPropagation(); onDecide(request.id, "Approved"); }} className="rounded-md bg-[#F5B300] px-3 py-1.5 text-xs font-extrabold text-[#111827]">Approve</button>
                      </div>
                    ) : <span className="text-xs text-[var(--pm-text-muted)]">{request.decidedBy ?? "—"}</span>}
                  </td>
                </tr>
              ))}
              {!sortedRequests.length && <tr><td colSpan={6} className="px-4 py-12 text-center text-sm text-[var(--pm-text-muted)]">No access requests have been submitted.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {selectedRequest && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 p-4" onMouseDown={event => {
          if (event.currentTarget === event.target) onSelectRequest?.(null);
        }}>
          <div role="dialog" aria-modal="true" aria-labelledby="acl-request-title" className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border p-5 shadow-2xl sm:p-6" style={{ background: "var(--pm-surface)", borderColor: "var(--pm-border)" }}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--pm-accent-text)]">Access request</p>
                <h3 id="acl-request-title" className="mt-1 font-display text-xl font-extrabold">{selectedRequest.id}</h3>
              </div>
              <button onClick={() => onSelectRequest?.(null)} className="text-xl" aria-label="Close request details">×</button>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                ["Requested by", selectedRequest.requestedBy],
                ["Request type", selectedRequest.requestType],
                ["Duration", selectedRequest.duration],
                ["Status", selectedRequest.status],
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg border p-3" style={{ borderColor: "var(--pm-border)", background: "var(--pm-bg)" }}>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--pm-text-muted)]">{label}</div>
                  <div className="mt-1 text-sm font-semibold">{value}</div>
                </div>
              ))}
            </div>

            <div className="mt-5">
              <div className="text-xs font-bold uppercase tracking-wider">Requested access</div>
              <div className="mt-2 rounded-lg border p-4" style={{ borderColor: "var(--pm-border)", background: "var(--pm-bg)" }}>
                <div className="font-bold">{accessLabel(selectedRequest)}</div>
                {selectedRequest.requestType === "Module Permission" && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(selectedRequest.permissions ?? ["View"]).map(permission => <span key={permission} className="rounded-md border border-[#F5B300]/40 bg-[#F5B300]/10 px-2 py-1 text-xs font-bold text-[var(--pm-accent-text)]">{permission}</span>)}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-5">
              <div className="text-xs font-bold uppercase tracking-wider">Business reason</div>
              <div className="mt-2 whitespace-pre-wrap rounded-lg border p-4 text-sm leading-6" style={{ borderColor: "var(--pm-border)", background: "var(--pm-bg)" }}>{selectedRequest.reason}</div>
            </div>

            <div className="mt-5 grid gap-2 text-xs text-[var(--pm-text-muted)] sm:grid-cols-2">
              <div><strong className="text-[var(--pm-text-secondary)]">Submitted:</strong> {selectedRequest.requestedAt}</div>
              <div><strong className="text-[var(--pm-text-secondary)]">Decided by:</strong> {selectedRequest.decidedBy ?? "Pending decision"}</div>
              {selectedRequest.expiresAt && <div><strong className="text-[var(--pm-text-secondary)]">Expires:</strong> {new Date(selectedRequest.expiresAt).toLocaleString("en-SG")}</div>}
            </div>

            <div className="mt-6 flex justify-end gap-2 border-t pt-4" style={{ borderColor: "var(--pm-border)" }}>
              <button onClick={() => onSelectRequest?.(null)} className="rounded-md border px-4 py-2 text-xs font-bold" style={{ borderColor: "var(--pm-border)" }}>Close</button>
              {selectedRequest.status === "Pending" && (
                <>
                  <button onClick={() => onDecide(selectedRequest.id, "Rejected")} className="rounded-md border border-red-300 px-4 py-2 text-xs font-bold text-red-700">Reject</button>
                  <button onClick={() => onDecide(selectedRequest.id, "Approved")} className="rounded-md bg-[#F5B300] px-4 py-2 text-xs font-extrabold text-[#111827]">Approve request</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
