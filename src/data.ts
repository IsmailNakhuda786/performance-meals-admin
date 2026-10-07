export type OrderStatus = "Confirmed" | "Packing" | "Packed" | "Out for Delivery" | "Delivered" | "Pending" | "Cancelled";
export type PlanType = "Meal Plan" | "Ready Series Subscription" | "Ready Series A-la-carte" | "Ready Series Bundle";
export type GoalType = "CUT" | "MAINTAIN" | "BUILD";
export type CustomerStatus = "Active" | "Paused" | "Renewal Due" | "Cancelled";
export type OtherSaleType = "Wallet Top-Up" | "Gift Card";
export type SaleStatus = "Paid" | "Pending" | "Refunded";

export interface Order {
  id: string;
  customer: string;
  planType: PlanType;
  goal?: GoalType;
  meals: number;
  total: number;
  deliveryWindow: string;
  status: OrderStatus;
  date: string;
  address: string;
  phone: string;
  planWeek?: string;
  mealList?: Meal[];
  productName?: string;
}

export interface Meal {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  session: "Lunch" | "Dinner";
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  planType: PlanType;
  goal?: GoalType;
  planWeek: string;
  status: CustomerStatus;
  nextBilling: string;
  ltv: number;
  walletBalance: number;
  points: number;
  pauseStart?: string;
  pauseEnd?: string;
  joinDate: string;
  address: string;
}

export type MealPlanType =
  | "Low Carb Regular" | "Low Carb Regular+"
  | "Balance Regular" | "Balance Regular+";

export type MealPlanProgramme = "Biweekly" | "Monthly" | "2 Months" | "6 by 60" | "6 by 60 Plus";

export interface Subscription {
  id: string;
  customerId: string;
  customerName: string;
  planType: PlanType;
  mealPlanType?: MealPlanType;
  programme?: MealPlanProgramme;
  goal?: GoalType;
  mealsPerWeek: number;
  planWeek: string;
  weeksRemaining: number;
  status: CustomerStatus;
  nextDelivery: string;
  nextBilling: string;
  menuConfirmed: boolean;
  pauseStart?: string;
  pauseEnd?: string;
  resumeDate?: string;
  // Ready Series fields
  sku?: string;
  term?: "3 months" | "6 months";
  termStartDate?: string;
  renewalDate?: string;
  deliveriesTotal?: number;
  deliveriesCompleted?: number;
  paymentStatus?: "Paid" | "Pending" | "Failed" | "Overdue";
}

export interface OtherSale {
  id: string;
  date: string;
  customer: string;
  type: OtherSaleType;
  amount: number;
  method: string;
  status: SaleStatus;
  reference: string;
}

const meals: Meal[] = [
  { name: "Herb Grilled Chicken & Brown Rice", calories: 460, protein: 42, carbs: 55, fat: 8, session: "Lunch" },
  { name: "Chilli Lime Chicken & Cauliflower Rice", calories: 310, protein: 40, carbs: 14, fat: 10, session: "Dinner" },
  { name: "Smoked Salmon Scrambled Eggs", calories: 290, protein: 28, carbs: 8, fat: 16, session: "Lunch" },
  { name: "Teriyaki Chicken & Jasmine Rice", calories: 450, protein: 38, carbs: 52, fat: 10, session: "Dinner" },
  { name: "Korean BBQ Beef & Purple Rice", calories: 510, protein: 44, carbs: 58, fat: 12, session: "Lunch" },
  { name: "Lemon Herb Turkey Breast", calories: 270, protein: 46, carbs: 6, fat: 6, session: "Dinner" },
  { name: "Greek Chicken & Quinoa Bowl", calories: 350, protein: 38, carbs: 22, fat: 11, session: "Lunch" },
  { name: "Overnight Protein Oats & Berries", calories: 360, protein: 22, carbs: 48, fat: 8, session: "Dinner" },
];

export const orders: Order[] = [
  { id: "ORD-2401", customer: "Marcus Tan", planType: "Meal Plan", productName: "Low Carb Regular · Biweekly · Lunch Only", goal: "CUT", meals: 5, total: 140, deliveryWindow: "9am–12pm", status: "Packing", date: "2024-09-14", address: "Blk 123 Clementi Ave 3 #04-21, S120123", phone: "+65 9123 4567", planWeek: "W 8 / 12", mealList: [meals[0], meals[4], meals[6], meals[3], meals[1]] },
  { id: "ORD-2402", customer: "Priya Nair", planType: "Meal Plan", productName: "Balance Regular · Monthly · Lunch + Dinner", goal: "BUILD", meals: 10, total: 220, deliveryWindow: "12pm–3pm", status: "Confirmed", date: "2024-09-14", address: "11 Tanjong Rhu Rd #08-05, S436895", phone: "+65 9234 5678", planWeek: "W 3 / 12", mealList: [meals[2], meals[5], meals[7], meals[0], meals[3], meals[4], meals[6], meals[1], meals[2], meals[5]] },
  { id: "ORD-2403", customer: "Wei Jie Lim", planType: "Ready Series Bundle", productName: "Low Carb Meals · Signature 5 — Non-Beef", meals: 5, total: 48.99, deliveryWindow: "9am–12pm", status: "Packed", date: "2024-09-14", address: "221 Serangoon Central #12-88, S550221", phone: "+65 9345 6789", mealList: [meals[0], meals[3], meals[6], meals[1], meals[4]] },
  { id: "ORD-2404", customer: "Aisha Rahman", planType: "Meal Plan", productName: "Balance Regular+ · 2 Months · Lunch + Dinner", goal: "MAINTAIN", meals: 10, total: 235, deliveryWindow: "3pm–6pm", status: "Out for Delivery", date: "2024-09-14", address: "18 Bukit Timah Rd #02-14, S229719", phone: "+65 9456 7890", planWeek: "W 13 / 12", mealList: [meals[5], meals[7], meals[2], meals[0], meals[4], meals[1], meals[6], meals[3], meals[5], meals[7]] },
  { id: "ORD-2405", customer: "Darren Ong", planType: "Ready Series A-la-carte", productName: "Teriyaki Chicken & Brown Rice ×3", meals: 3, total: 38.70, deliveryWindow: "12pm–3pm", status: "Delivered", date: "2024-09-14", address: "80 Marine Parade Central #05-07, S440080", phone: "+65 9567 8901", mealList: [meals[0], meals[2], meals[4]] },
  { id: "ORD-2406", customer: "Jade Koh", planType: "Ready Series Bundle", productName: "Low Carb Meals · Essential 10 — Non-Beef", meals: 10, total: 93, deliveryWindow: "9am–12pm", status: "Confirmed", date: "2024-09-14", address: "25 Havelock Rd #07-12, S059763", phone: "+65 9678 9012", mealList: [meals[1], meals[3], meals[5], meals[7], meals[0], meals[2], meals[4], meals[6], meals[1], meals[3]] },
  { id: "ORD-2407", customer: "Reuben Chew", planType: "Meal Plan", productName: "Balance Regular · 6 by 60 Plus · Lunch + Dinner", goal: "BUILD", meals: 10, total: 220, deliveryWindow: "3pm–6pm", status: "Pending", date: "2024-09-14", address: "3 Yishun Ring Rd #10-55, S768675", phone: "+65 9789 0123", planWeek: "W 1 / 12", mealList: [meals[6], meals[2], meals[0], meals[4], meals[7]] },
  { id: "ORD-2408", customer: "Natalie Foo", planType: "Meal Plan", productName: "Low Carb Regular · 6 by 60 · Lunch + Dinner", goal: "CUT", meals: 10, total: 200, deliveryWindow: "9am–12pm", status: "Packing", date: "2024-09-14", address: "1 Kim Tian Pl #03-33, S169089", phone: "+65 9890 1234", planWeek: "W 5 / 12", mealList: [meals[3], meals[5], meals[1], meals[7], meals[0], meals[4], meals[2], meals[6], meals[3], meals[5]] },
  { id: "ORD-2409", customer: "Jason Yeo", planType: "Ready Series Subscription", productName: "Low Carb + Just Protein · Non-Beef · 3 Months", meals: 15, total: 354.56, deliveryWindow: "12pm–3pm", status: "Confirmed", date: "2024-09-14", address: "456 Bishan St 11 #14-22, S570456", phone: "+65 9901 2345" },
  { id: "ORD-2410", customer: "Serene Tay", planType: "Ready Series A-la-carte", productName: "Spicy Korean Beef Bulgogi + Herb Chicken & Roasted Veg", meals: 2, total: 26, deliveryWindow: "3pm–6pm", status: "Cancelled", date: "2024-09-14", address: "89 Redhill Close #08-04, S150089", phone: "+65 9012 3456" },
];

export const customers: Customer[] = [
  { id: "C001", name: "Marcus Tan", email: "marcus.tan@gmail.com", phone: "+65 9123 4567", planType: "Meal Plan", goal: "CUT", planWeek: "W 8 / 12", status: "Active", nextBilling: "21 Sep 2024", ltv: 1240.50, walletBalance: 15.00, points: 820, joinDate: "12 Jan 2024", address: "Blk 123 Clementi Ave 3 #04-21, S120123" },
  { id: "C002", name: "Priya Nair", email: "priya.nair@outlook.com", phone: "+65 9234 5678", planType: "Meal Plan", goal: "BUILD", planWeek: "W 3 / 12", status: "Active", nextBilling: "21 Sep 2024", ltv: 504.00, walletBalance: 0.00, points: 336, joinDate: "24 Aug 2024", address: "11 Tanjong Rhu Rd #08-05, S436895" },
  { id: "C003", name: "Wei Jie Lim", email: "weijie.lim@gmail.com", phone: "+65 9345 6789", planType: "Ready Series Subscription", planWeek: "–", status: "Paused", nextBilling: "5 Oct 2024", ltv: 918.00, walletBalance: 22.50, points: 612, joinDate: "3 Mar 2024", address: "221 Serangoon Central #12-88, S550221", pauseStart: "15 Sep", pauseEnd: "5 Oct" },
  { id: "C004", name: "Aisha Rahman", email: "aisha.rahman@yahoo.com", phone: "+65 9456 7890", planType: "Meal Plan", goal: "MAINTAIN", planWeek: "W 13 / 12", status: "Renewal Due", nextBilling: "18 Sep 2024", ltv: 2184.00, walletBalance: 50.00, points: 1456, joinDate: "15 Sep 2023", address: "18 Bukit Timah Rd #02-14, S229719" },
  { id: "C005", name: "Darren Ong", email: "darren.ong@gmail.com", phone: "+65 9567 8901", planType: "Ready Series A-la-carte", planWeek: "–", status: "Active", nextBilling: "–", ltv: 156.00, walletBalance: 5.00, points: 104, joinDate: "7 Jul 2024", address: "80 Marine Parade Central #05-07, S440080" },
  { id: "C006", name: "Jade Koh", email: "jade.koh@hotmail.com", phone: "+65 9678 9012", planType: "Ready Series Subscription", planWeek: "–", status: "Active", nextBilling: "21 Sep 2024", ltv: 1440.00, walletBalance: 0.00, points: 960, joinDate: "5 Feb 2024", address: "25 Havelock Rd #07-12, S059763" },
  { id: "C007", name: "Reuben Chew", email: "reuben.chew@gmail.com", phone: "+65 9789 0123", planType: "Meal Plan", goal: "BUILD", planWeek: "W 1 / 12", status: "Active", nextBilling: "21 Sep 2024", ltv: 89.50, walletBalance: 0.00, points: 60, joinDate: "9 Sep 2024", address: "3 Yishun Ring Rd #10-55, S768675" },
  { id: "C008", name: "Natalie Foo", email: "natalie.foo@gmail.com", phone: "+65 9890 1234", planType: "Meal Plan", goal: "CUT", planWeek: "W 5 / 12", status: "Active", nextBilling: "21 Sep 2024", ltv: 840.00, walletBalance: 10.00, points: 560, joinDate: "11 May 2024", address: "1 Kim Tian Pl #03-33, S169089" },
  { id: "C009", name: "Jason Yeo", email: "jason.yeo@outlook.com", phone: "+65 9901 2345", planType: "Ready Series Subscription", planWeek: "–", status: "Paused", nextBilling: "28 Sep 2024", ltv: 1080.00, walletBalance: 30.00, points: 720, joinDate: "10 Jan 2024", address: "456 Bishan St 11 #14-22, S570456", pauseStart: "1 Sep", pauseEnd: "28 Sep" },
  { id: "C010", name: "Serene Tay", email: "serene.tay@gmail.com", phone: "+65 9012 3456", planType: "Meal Plan", goal: "CUT", planWeek: "–", status: "Cancelled", nextBilling: "–", ltv: 357.00, walletBalance: 0.00, points: 238, joinDate: "20 Apr 2024", address: "89 Redhill Close #08-04, S150089" },
  { id: "C011", name: "Bryan Low", email: "bryan.low@gmail.com", phone: "+65 9111 2233", planType: "Meal Plan", goal: "BUILD", planWeek: "W 11 / 12", status: "Renewal Due", nextBilling: "19 Sep 2024", ltv: 1848.00, walletBalance: 0.00, points: 1232, joinDate: "15 Oct 2023", address: "72 Jurong West St 42 #09-11, S640072" },
  { id: "C012", name: "Vanessa Ng", email: "vanessa.ng@hotmail.com", phone: "+65 9222 3344", planType: "Ready Series Subscription", planWeek: "–", status: "Active", nextBilling: "21 Sep 2024", ltv: 432.00, walletBalance: 8.00, points: 288, joinDate: "20 Jun 2024", address: "5 Tampines Central 1 #03-20, S529538" },
];

export const subscriptions: Subscription[] = [
  { id: "SUB-001", customerId: "C001", customerName: "Marcus Tan", planType: "Meal Plan", mealPlanType: "Low Carb Regular", programme: "Biweekly", goal: "CUT", mealsPerWeek: 5, planWeek: "W 8 / 12", weeksRemaining: 4, status: "Active", nextDelivery: "21 Sep", nextBilling: "21 Sep 2024", menuConfirmed: true },
  { id: "SUB-002", customerId: "C002", customerName: "Priya Nair", planType: "Meal Plan", mealPlanType: "Balance Regular", programme: "Monthly", goal: "BUILD", mealsPerWeek: 10, planWeek: "W 3 / 12", weeksRemaining: 9, status: "Active", nextDelivery: "21 Sep", nextBilling: "21 Sep 2024", menuConfirmed: false },
  { id: "SUB-003", customerId: "C003", customerName: "Wei Jie Lim", planType: "Ready Series Subscription", mealsPerWeek: 10, planWeek: "–", weeksRemaining: 0, status: "Paused", nextDelivery: "5 Oct", nextBilling: "5 Oct 2024", menuConfirmed: false, pauseStart: "15 Sep", pauseEnd: "5 Oct", resumeDate: "5 Oct 2024", sku: "LCSUB01", term: "3 months", termStartDate: "1 Jul 2024", renewalDate: "30 Sep 2024", deliveriesTotal: 3, deliveriesCompleted: 2, paymentStatus: "Paid" },
  { id: "SUB-004", customerId: "C004", customerName: "Aisha Rahman", planType: "Meal Plan", mealPlanType: "Balance Regular+", programme: "2 Months", goal: "MAINTAIN", mealsPerWeek: 10, planWeek: "W 13 / 12", weeksRemaining: 0, status: "Renewal Due", nextDelivery: "21 Sep", nextBilling: "18 Sep 2024", menuConfirmed: true },
  { id: "SUB-005", customerId: "C006", customerName: "Jade Koh", planType: "Ready Series Subscription", mealsPerWeek: 14, planWeek: "–", weeksRemaining: 0, status: "Active", nextDelivery: "21 Sep", nextBilling: "21 Sep 2024", menuConfirmed: true, sku: "JPSUB01", term: "6 months", termStartDate: "1 Apr 2024", renewalDate: "30 Sep 2024", deliveriesTotal: 6, deliveriesCompleted: 5, paymentStatus: "Paid" },
  { id: "SUB-006", customerId: "C007", customerName: "Reuben Chew", planType: "Meal Plan", mealPlanType: "Balance Regular", programme: "6 by 60 Plus", goal: "BUILD", mealsPerWeek: 14, planWeek: "W 1 / 12", weeksRemaining: 11, status: "Active", nextDelivery: "21 Sep", nextBilling: "21 Sep 2024", menuConfirmed: false },
  { id: "SUB-007", customerId: "C008", customerName: "Natalie Foo", planType: "Meal Plan", mealPlanType: "Low Carb Regular", programme: "6 by 60", goal: "CUT", mealsPerWeek: 14, planWeek: "W 5 / 12", weeksRemaining: 7, status: "Active", nextDelivery: "21 Sep", nextBilling: "21 Sep 2024", menuConfirmed: true },
  { id: "SUB-008", customerId: "C009", customerName: "Jason Yeo", planType: "Ready Series Subscription", mealsPerWeek: 15, planWeek: "–", weeksRemaining: 0, status: "Paused", nextDelivery: "28 Sep", nextBilling: "28 Sep 2024", menuConfirmed: false, pauseStart: "1 Sep", pauseEnd: "28 Sep", resumeDate: "28 Sep 2024", sku: "LCMIXSUB01", term: "3 months", termStartDate: "1 Jul 2024", renewalDate: "30 Sep 2024", deliveriesTotal: 3, deliveriesCompleted: 2, paymentStatus: "Pending" },
  { id: "SUB-009", customerId: "C010", customerName: "Serene Tay", planType: "Meal Plan", mealPlanType: "Low Carb Regular", goal: "CUT", mealsPerWeek: 5, planWeek: "–", weeksRemaining: 0, status: "Cancelled", nextDelivery: "–", nextBilling: "–", menuConfirmed: false },
  { id: "SUB-010", customerId: "C011", customerName: "Bryan Low", planType: "Meal Plan", mealPlanType: "Balance Regular+", programme: "6 by 60 Plus", goal: "BUILD", mealsPerWeek: 14, planWeek: "W 11 / 12", weeksRemaining: 1, status: "Renewal Due", nextDelivery: "21 Sep", nextBilling: "19 Sep 2024", menuConfirmed: true },
  { id: "SUB-011", customerId: "C012", customerName: "Vanessa Ng", planType: "Ready Series Subscription", mealsPerWeek: 10, planWeek: "–", weeksRemaining: 0, status: "Active", nextDelivery: "21 Sep", nextBilling: "21 Sep 2024", menuConfirmed: true, sku: "HCSUB01", term: "6 months", termStartDate: "1 Apr 2024", renewalDate: "30 Sep 2024", deliveriesTotal: 6, deliveriesCompleted: 5, paymentStatus: "Paid" },
];

export const weeklyRevenue = [
  { day: "Mon", revenue: 1240 },
  { day: "Tue", revenue: 890 },
  { day: "Wed", revenue: 1560 },
  { day: "Thu", revenue: 2100 },
  { day: "Fri", revenue: 1820 },
  { day: "Sat", revenue: 980 },
  { day: "Sun", revenue: 640 },
];

// Non-product transactions are intentionally excluded from Meal Plan and
// Ready Series orders, revenue, fulfilment, and production calculations.
export const otherSales: OtherSale[] = [
  { id: "OS-5101", date: "14 Sep 2024", customer: "Aisha Rahman", type: "Wallet Top-Up", amount: 50.00, method: "Card (via Shopify)", status: "Paid", reference: "WALLET-1048" },
  { id: "OS-5102", date: "14 Sep 2024", customer: "Mei Lin Wong", type: "Gift Card", amount: 100.00, method: "PayNow", status: "Paid", reference: "GIFT-2841" },
  { id: "OS-5103", date: "13 Sep 2024", customer: "Bryan Low", type: "Wallet Top-Up", amount: 80.00, method: "GrabPay", status: "Paid", reference: "WALLET-1047" },
  { id: "OS-5104", date: "13 Sep 2024", customer: "Sarah Lim", type: "Gift Card", amount: 50.00, method: "Card (via Shopify)", status: "Pending", reference: "GIFT-2840" },
  { id: "OS-5105", date: "12 Sep 2024", customer: "Natalie Foo", type: "Wallet Top-Up", amount: -30.00, method: "Card (via Shopify)", status: "Refunded", reference: "WALLET-1042" },
];

export const stockAlerts = [
  { item: "Grilled Chicken Breast (1kg)", current: 8, minimum: 20, unit: "packs" },
  { item: "Jasmine Rice (5kg)", current: 3, minimum: 10, unit: "bags" },
  { item: "Salmon Fillet (500g)", current: 12, minimum: 15, unit: "portions" },
  { item: "Sweet Potato (1kg)", current: 5, minimum: 12, unit: "bags" },
];
