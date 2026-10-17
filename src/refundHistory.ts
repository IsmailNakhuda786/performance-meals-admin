export type RefundStatus = "pending" | "approved" | "rejected" | "escalated";
export type RefundReason = "delivery-failure" | "wrong-order" | "quality" | "cancellation" | "overcharge" | "other";

export interface Refund {
  id: string;
  customer: string;
  orderId: string;
  amount: number;
  stream: string;
  reason: RefundReason;
  status: RefundStatus;
  requestDate: string;
  processedBy?: string;
  notes: string;
}

export const refundHistory: Refund[] = [
  { id: "REF-062", customer: "Jason Yeo", orderId: "ORD-2403", amount: 68.00, stream: "Ready Series", reason: "delivery-failure", status: "pending", requestDate: "14 Sep 2024", notes: "Delivery failed twice. Customer requests full box refund." },
  { id: "REF-061", customer: "Aisha Rahman", orderId: "SUB-007", amount: 42.00, stream: "Meal Plans", reason: "wrong-order", status: "pending", requestDate: "14 Sep 2024", notes: "Received wrong meals on Monday delivery." },
  { id: "REF-060", customer: "Marcus Tan", orderId: "SUB-001", amount: 210.00, stream: "Meal Plans", reason: "cancellation", status: "escalated", requestDate: "13 Sep 2024", processedBy: "Jerome Lim", notes: "Customer cancelled plan mid-week. Partial refund dispute — escalated." },
  { id: "REF-059", customer: "Wei Jie Lim", orderId: "SUB-003", amount: 30.00, stream: "Meal Plans", reason: "overcharge", status: "approved", requestDate: "13 Sep 2024", processedBy: "Ravi Kumar", notes: "Double charge on pause date confirmed. Approved $30 credit." },
  { id: "REF-058", customer: "Serene Tay", orderId: "ORD-2400", amount: 89.50, stream: "Ready Series", reason: "quality", status: "approved", requestDate: "12 Sep 2024", processedBy: "Sarah Tan", notes: "Packaging damaged, ice packs melted. Full refund approved." },
  { id: "REF-057", customer: "Raj Nair", orderId: "ORD-2396", amount: 12.00, stream: "Ready Series", reason: "other", status: "rejected", requestDate: "11 Sep 2024", processedBy: "Ravi Kumar", notes: "Promo code issue — credit already applied via wallet. Refund not applicable." },
];
