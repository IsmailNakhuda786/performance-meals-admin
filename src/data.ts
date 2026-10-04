export type OrderStatus = "Confirmed" | "Packing" | "Packed" | "Out for Delivery" | "Delivered" | "Pending" | "Cancelled";
export type PlanType = "Meal Plan" | "Box Subscription" | "Ready-to-Go";
export type GoalType = "CUT" | "MAINTAIN" | "BUILD";
export type CustomerStatus = "Active" | "Paused" | "Renewal Due" | "Cancelled";

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
  | "Balance Regular" | "Balance Regular+"
  | "6 by 60" | "6 by 60 Plus";

export interface Subscription {
  id: string;
  customerId: string;
  customerName: string;
  planType: PlanType;
  mealPlanType?: MealPlanType;
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

const meals: Meal[] = [
  { name: "Grilled Chicken & Jasmine Rice", calories: 520, protein: 45, carbs: 58, fat: 9, session: "Lunch" },
  { name: "Salmon with Sweet Potato", calories: 480, protein: 38, carbs: 42, fat: 14, session: "Dinner" },
  { name: "Beef Bolognese Wholemeal Pasta", calories: 610, protein: 42, carbs: 65, fat: 16, session: "Dinner" },
  { name: "Turkey Meatballs & Brown Rice", calories: 495, protein: 40, carbs: 52, fat: 11, session: "Lunch" },
  { name: "Teriyaki Chicken & Broccoli", calories: 445, protein: 41, carbs: 38, fat: 10, session: "Lunch" },
  { name: "Pan-Seared Barramundi & Quinoa", calories: 430, protein: 36, carbs: 40, fat: 12, session: "Dinner" },
  { name: "Chicken Tikka & Basmati Rice", calories: 510, protein: 44, carbs: 54, fat: 10, session: "Lunch" },
  { name: "Pork Tenderloin & Roasted Veg", calories: 470, protein: 39, carbs: 35, fat: 15, session: "Dinner" },
];

export const orders: Order[] = [
  { id: "ORD-2401", customer: "Marcus Tan", planType: "Meal Plan", goal: "CUT", meals: 5, total: 89.50, deliveryWindow: "9am–12pm", status: "Packing", date: "2024-09-14", address: "Blk 123 Clementi Ave 3 #04-21, S120123", phone: "+65 9123 4567", planWeek: "W 8 / 12", mealList: [meals[0], meals[4], meals[6], meals[3], meals[1]] },
  { id: "ORD-2402", customer: "Priya Nair", planType: "Meal Plan", goal: "BUILD", meals: 10, total: 168.00, deliveryWindow: "12pm–3pm", status: "Confirmed", date: "2024-09-14", address: "11 Tanjong Rhu Rd #08-05, S436895", phone: "+65 9234 5678", planWeek: "W 3 / 12", mealList: [meals[2], meals[5], meals[7], meals[0], meals[3], meals[4], meals[6], meals[1], meals[2], meals[5]] },
  { id: "ORD-2403", customer: "Wei Jie Lim", planType: "Box Subscription", meals: 5, total: 76.50, deliveryWindow: "9am–12pm", status: "Packed", date: "2024-09-14", address: "221 Serangoon Central #12-88, S550221", phone: "+65 9345 6789", mealList: [meals[0], meals[3], meals[6], meals[1], meals[4]] },
  { id: "ORD-2404", customer: "Aisha Rahman", planType: "Meal Plan", goal: "MAINTAIN", meals: 10, total: 168.00, deliveryWindow: "3pm–6pm", status: "Out for Delivery", date: "2024-09-14", address: "18 Bukit Timah Rd #02-14, S229719", phone: "+65 9456 7890", planWeek: "W 13 / 12", mealList: [meals[5], meals[7], meals[2], meals[0], meals[4], meals[1], meals[6], meals[3], meals[5], meals[7]] },
  { id: "ORD-2405", customer: "Darren Ong", planType: "Ready-to-Go", meals: 3, total: 28.50, deliveryWindow: "12pm–3pm", status: "Delivered", date: "2024-09-14", address: "80 Marine Parade Central #05-07, S440080", phone: "+65 9567 8901", mealList: [meals[0], meals[2], meals[4]] },
  { id: "ORD-2406", customer: "Jade Koh", planType: "Box Subscription", meals: 10, total: 144.00, deliveryWindow: "9am–12pm", status: "Confirmed", date: "2024-09-14", address: "25 Havelock Rd #07-12, S059763", phone: "+65 9678 9012", mealList: [meals[1], meals[3], meals[5], meals[7], meals[0], meals[2], meals[4], meals[6], meals[1], meals[3]] },
  { id: "ORD-2407", customer: "Reuben Chew", planType: "Meal Plan", goal: "BUILD", meals: 5, total: 89.50, deliveryWindow: "3pm–6pm", status: "Pending", date: "2024-09-14", address: "3 Yishun Ring Rd #10-55, S768675", phone: "+65 9789 0123", planWeek: "W 1 / 12", mealList: [meals[6], meals[2], meals[0], meals[4], meals[7]] },
  { id: "ORD-2408", customer: "Natalie Foo", planType: "Meal Plan", goal: "CUT", meals: 10, total: 168.00, deliveryWindow: "9am–12pm", status: "Packing", date: "2024-09-14", address: "1 Kim Tian Pl #03-33, S169089", phone: "+65 9890 1234", planWeek: "W 5 / 12", mealList: [meals[3], meals[5], meals[1], meals[7], meals[0], meals[4], meals[2], meals[6], meals[3], meals[5]] },
  { id: "ORD-2409", customer: "Jason Yeo", planType: "Box Subscription", meals: 15, total: 216.00, deliveryWindow: "12pm–3pm", status: "Confirmed", date: "2024-09-14", address: "456 Bishan St 11 #14-22, S570456", phone: "+65 9901 2345" },
  { id: "ORD-2410", customer: "Serene Tay", planType: "Ready-to-Go", meals: 2, total: 19.00, deliveryWindow: "3pm–6pm", status: "Cancelled", date: "2024-09-14", address: "89 Redhill Close #08-04, S150089", phone: "+65 9012 3456" },
];

export const customers: Customer[] = [
  { id: "C001", name: "Marcus Tan", email: "marcus.tan@gmail.com", phone: "+65 9123 4567", planType: "Meal Plan", goal: "CUT", planWeek: "W 8 / 12", status: "Active", nextBilling: "21 Sep 2024", ltv: 1240.50, walletBalance: 15.00, points: 820, joinDate: "12 Jan 2024", address: "Blk 123 Clementi Ave 3 #04-21, S120123" },
  { id: "C002", name: "Priya Nair", email: "priya.nair@outlook.com", phone: "+65 9234 5678", planType: "Meal Plan", goal: "BUILD", planWeek: "W 3 / 12", status: "Active", nextBilling: "21 Sep 2024", ltv: 504.00, walletBalance: 0.00, points: 336, joinDate: "24 Aug 2024", address: "11 Tanjong Rhu Rd #08-05, S436895" },
  { id: "C003", name: "Wei Jie Lim", email: "weijie.lim@gmail.com", phone: "+65 9345 6789", planType: "Box Subscription", planWeek: "–", status: "Paused", nextBilling: "5 Oct 2024", ltv: 918.00, walletBalance: 22.50, points: 612, joinDate: "3 Mar 2024", address: "221 Serangoon Central #12-88, S550221", pauseStart: "15 Sep", pauseEnd: "5 Oct" },
  { id: "C004", name: "Aisha Rahman", email: "aisha.rahman@yahoo.com", phone: "+65 9456 7890", planType: "Meal Plan", goal: "MAINTAIN", planWeek: "W 13 / 12", status: "Renewal Due", nextBilling: "18 Sep 2024", ltv: 2184.00, walletBalance: 50.00, points: 1456, joinDate: "15 Sep 2023", address: "18 Bukit Timah Rd #02-14, S229719" },
  { id: "C005", name: "Darren Ong", email: "darren.ong@gmail.com", phone: "+65 9567 8901", planType: "Ready-to-Go", planWeek: "–", status: "Active", nextBilling: "–", ltv: 156.00, walletBalance: 5.00, points: 104, joinDate: "7 Jul 2024", address: "80 Marine Parade Central #05-07, S440080" },
  { id: "C006", name: "Jade Koh", email: "jade.koh@hotmail.com", phone: "+65 9678 9012", planType: "Box Subscription", planWeek: "–", status: "Active", nextBilling: "21 Sep 2024", ltv: 1440.00, walletBalance: 0.00, points: 960, joinDate: "5 Feb 2024", address: "25 Havelock Rd #07-12, S059763" },
  { id: "C007", name: "Reuben Chew", email: "reuben.chew@gmail.com", phone: "+65 9789 0123", planType: "Meal Plan", goal: "BUILD", planWeek: "W 1 / 12", status: "Active", nextBilling: "21 Sep 2024", ltv: 89.50, walletBalance: 0.00, points: 60, joinDate: "9 Sep 2024", address: "3 Yishun Ring Rd #10-55, S768675" },
  { id: "C008", name: "Natalie Foo", email: "natalie.foo@gmail.com", phone: "+65 9890 1234", planType: "Meal Plan", goal: "CUT", planWeek: "W 5 / 12", status: "Active", nextBilling: "21 Sep 2024", ltv: 840.00, walletBalance: 10.00, points: 560, joinDate: "11 May 2024", address: "1 Kim Tian Pl #03-33, S169089" },
  { id: "C009", name: "Jason Yeo", email: "jason.yeo@outlook.com", phone: "+65 9901 2345", planType: "Box Subscription", planWeek: "–", status: "Paused", nextBilling: "28 Sep 2024", ltv: 1080.00, walletBalance: 30.00, points: 720, joinDate: "10 Jan 2024", address: "456 Bishan St 11 #14-22, S570456", pauseStart: "1 Sep", pauseEnd: "28 Sep" },
  { id: "C010", name: "Serene Tay", email: "serene.tay@gmail.com", phone: "+65 9012 3456", planType: "Meal Plan", goal: "CUT", planWeek: "–", status: "Cancelled", nextBilling: "–", ltv: 357.00, walletBalance: 0.00, points: 238, joinDate: "20 Apr 2024", address: "89 Redhill Close #08-04, S150089" },
  { id: "C011", name: "Bryan Low", email: "bryan.low@gmail.com", phone: "+65 9111 2233", planType: "Meal Plan", goal: "BUILD", planWeek: "W 11 / 12", status: "Renewal Due", nextBilling: "19 Sep 2024", ltv: 1848.00, walletBalance: 0.00, points: 1232, joinDate: "15 Oct 2023", address: "72 Jurong West St 42 #09-11, S640072" },
  { id: "C012", name: "Vanessa Ng", email: "vanessa.ng@hotmail.com", phone: "+65 9222 3344", planType: "Box Subscription", planWeek: "–", status: "Active", nextBilling: "21 Sep 2024", ltv: 432.00, walletBalance: 8.00, points: 288, joinDate: "20 Jun 2024", address: "5 Tampines Central 1 #03-20, S529538" },
];

export const subscriptions: Subscription[] = [
  { id: "SUB-001", customerId: "C001", customerName: "Marcus Tan", planType: "Meal Plan", mealPlanType: "Low Carb Regular", goal: "CUT", mealsPerWeek: 5, planWeek: "W 8 / 12", weeksRemaining: 4, status: "Active", nextDelivery: "21 Sep", nextBilling: "21 Sep 2024", menuConfirmed: true },
  { id: "SUB-002", customerId: "C002", customerName: "Priya Nair", planType: "Meal Plan", mealPlanType: "Balance Regular", goal: "BUILD", mealsPerWeek: 10, planWeek: "W 3 / 12", weeksRemaining: 9, status: "Active", nextDelivery: "21 Sep", nextBilling: "21 Sep 2024", menuConfirmed: false },
  { id: "SUB-003", customerId: "C003", customerName: "Wei Jie Lim", planType: "Box Subscription", mealsPerWeek: 5, planWeek: "–", weeksRemaining: 0, status: "Paused", nextDelivery: "5 Oct", nextBilling: "5 Oct 2024", menuConfirmed: false, pauseStart: "15 Sep", pauseEnd: "5 Oct", resumeDate: "5 Oct 2024", sku: "RS-BOX-05", term: "3 months", termStartDate: "1 Jul 2024", renewalDate: "30 Sep 2024", deliveriesTotal: 26, deliveriesCompleted: 20, paymentStatus: "Paid" },
  { id: "SUB-004", customerId: "C004", customerName: "Aisha Rahman", planType: "Meal Plan", mealPlanType: "Balance Regular+", goal: "MAINTAIN", mealsPerWeek: 10, planWeek: "W 13 / 12", weeksRemaining: 0, status: "Renewal Due", nextDelivery: "21 Sep", nextBilling: "18 Sep 2024", menuConfirmed: true },
  { id: "SUB-005", customerId: "C006", customerName: "Jade Koh", planType: "Box Subscription", mealsPerWeek: 10, planWeek: "–", weeksRemaining: 0, status: "Active", nextDelivery: "21 Sep", nextBilling: "21 Sep 2024", menuConfirmed: true, sku: "RS-BOX-10", term: "6 months", termStartDate: "1 Apr 2024", renewalDate: "30 Sep 2024", deliveriesTotal: 78, deliveriesCompleted: 75, paymentStatus: "Paid" },
  { id: "SUB-006", customerId: "C007", customerName: "Reuben Chew", planType: "Meal Plan", mealPlanType: "Low Carb Regular+", goal: "BUILD", mealsPerWeek: 5, planWeek: "W 1 / 12", weeksRemaining: 11, status: "Active", nextDelivery: "21 Sep", nextBilling: "21 Sep 2024", menuConfirmed: false },
  { id: "SUB-007", customerId: "C008", customerName: "Natalie Foo", planType: "Meal Plan", mealPlanType: "Low Carb Regular", goal: "CUT", mealsPerWeek: 10, planWeek: "W 5 / 12", weeksRemaining: 7, status: "Active", nextDelivery: "21 Sep", nextBilling: "21 Sep 2024", menuConfirmed: true },
  { id: "SUB-008", customerId: "C009", customerName: "Jason Yeo", planType: "Box Subscription", mealsPerWeek: 15, planWeek: "–", weeksRemaining: 0, status: "Paused", nextDelivery: "28 Sep", nextBilling: "28 Sep 2024", menuConfirmed: false, pauseStart: "1 Sep", pauseEnd: "28 Sep", resumeDate: "28 Sep 2024", sku: "RS-BOX-15", term: "3 months", termStartDate: "1 Jul 2024", renewalDate: "30 Sep 2024", deliveriesTotal: 26, deliveriesCompleted: 16, paymentStatus: "Pending" },
  { id: "SUB-009", customerId: "C010", customerName: "Serene Tay", planType: "Meal Plan", mealPlanType: "Low Carb Regular", goal: "CUT", mealsPerWeek: 5, planWeek: "–", weeksRemaining: 0, status: "Cancelled", nextDelivery: "–", nextBilling: "–", menuConfirmed: false },
  { id: "SUB-010", customerId: "C011", customerName: "Bryan Low", planType: "Meal Plan", mealPlanType: "6 by 60 Plus", goal: "BUILD", mealsPerWeek: 10, planWeek: "W 11 / 12", weeksRemaining: 1, status: "Renewal Due", nextDelivery: "21 Sep", nextBilling: "19 Sep 2024", menuConfirmed: true },
  { id: "SUB-011", customerId: "C012", customerName: "Vanessa Ng", planType: "Box Subscription", mealsPerWeek: 5, planWeek: "–", weeksRemaining: 0, status: "Active", nextDelivery: "21 Sep", nextBilling: "21 Sep 2024", menuConfirmed: true, sku: "RS-BOX-05", term: "6 months", termStartDate: "1 Apr 2024", renewalDate: "30 Sep 2024", deliveriesTotal: 78, deliveriesCompleted: 70, paymentStatus: "Paid" },
  // RS-specific renewal-due record
  { id: "RS-001", customerId: "C005", customerName: "Darren Ong", planType: "Box Subscription", mealsPerWeek: 3, planWeek: "–", weeksRemaining: 0, status: "Renewal Due", nextDelivery: "22 Sep", nextBilling: "30 Sep 2024", menuConfirmed: false, sku: "RS-RTG-03", term: "3 months", termStartDate: "1 Jul 2024", renewalDate: "30 Sep 2024", deliveriesTotal: 26, deliveriesCompleted: 24, paymentStatus: "Pending" },
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

export const stockAlerts = [
  { item: "Grilled Chicken Breast (1kg)", current: 8, minimum: 20, unit: "packs" },
  { item: "Jasmine Rice (5kg)", current: 3, minimum: 10, unit: "bags" },
  { item: "Salmon Fillet (500g)", current: 12, minimum: 15, unit: "portions" },
  { item: "Sweet Potato (1kg)", current: 5, minimum: 12, unit: "bags" },
];
