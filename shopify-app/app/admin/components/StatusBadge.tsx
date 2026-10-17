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

const lightConfig: Record<string, { bg: string; text: string; dot: string }> = {
  Active:             { bg: "bg-green-50",  text: "text-green-700",  dot: "bg-green-500" },
  Confirmed:          { bg: "bg-green-50",  text: "text-green-700",  dot: "bg-green-500" },
  Delivered:          { bg: "bg-green-50",  text: "text-green-700",  dot: "bg-green-500" },
  Packed:             { bg: "bg-blue-50",   text: "text-blue-700",   dot: "bg-blue-500" },
  Packing:            { bg: "bg-blue-50",   text: "text-blue-700",   dot: "bg-blue-500" },
  "Out for Delivery": { bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-500" },
  Paused:             { bg: "bg-amber-50",  text: "text-amber-700",  dot: "bg-amber-500" },
  "Renewal Due":      { bg: "bg-orange-50", text: "text-orange-700", dot: "bg-orange-500" },
  Pending:            { bg: "bg-gray-100",  text: "text-gray-700",   dot: "bg-gray-400" },
  Cancelled:          { bg: "bg-red-50",    text: "text-red-700",    dot: "bg-red-500" },
};

export default function StatusBadge({ status, variant = "dark" }: { status: Status; variant?: "dark" | "light" }) {
  const palette = variant === "light" ? lightConfig : config;
  const c = palette[status] ?? palette["Pending"];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium mono ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {status}
    </span>
  );
}
