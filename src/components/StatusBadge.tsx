import type { OrderStatus, CustomerStatus } from "../data";

type Status = OrderStatus | CustomerStatus;

const config: Record<string, { bg: string; text: string; dot: string }> = {
  Active:           { bg: "bg-green-950", text: "text-green-400", dot: "bg-green-400" },
  Confirmed:        { bg: "bg-green-950", text: "text-green-400", dot: "bg-green-400" },
  Delivered:        { bg: "bg-green-950", text: "text-green-400", dot: "bg-green-400" },
  Packed:           { bg: "bg-blue-950", text: "text-blue-400", dot: "bg-blue-400" },
  Packing:          { bg: "bg-blue-950", text: "text-blue-300", dot: "bg-blue-300" },
  "Out for Delivery": { bg: "bg-purple-950", text: "text-purple-300", dot: "bg-purple-300" },
  Paused:           { bg: "bg-yellow-950", text: "text-yellow-400", dot: "bg-yellow-400" },
  "Renewal Due":    { bg: "bg-orange-950", text: "text-orange-400", dot: "bg-orange-400" },
  Pending:          { bg: "bg-neutral-800", text: "text-neutral-400", dot: "bg-neutral-400" },
  Cancelled:        { bg: "bg-red-950", text: "text-red-400", dot: "bg-red-400" },
};

export default function StatusBadge({ status }: { status: Status }) {
  const c = config[status] ?? config["Pending"];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium mono ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {status}
    </span>
  );
}
