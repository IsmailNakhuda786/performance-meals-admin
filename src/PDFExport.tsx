import { useState, useRef } from "react";
import { toJpeg } from "html-to-image";
import jsPDF from "jspdf";
import type { BusinessStream } from "./App";

type Section =
  | "dashboard" | "orders" | "delivery" | "print-slips"
  | "customers" | "subscriptions" | "menu-review" | "menu-planning"
  | "kitchen" | "kitchen-forecast" | "inventory" | "procurement" | "packaging"
  | "production-board" | "production-forecast" | "export-center"
  | "dispatch" | "delivery-hub" | "riders" | "rider-app" | "failed-deliveries"
  | "support" | "customer-success" | "notifications" | "whatsapp" | "marketing"
  | "wallet" | "finance" | "refunds" | "reports"
  | "fulfillment" | "pause-management" | "billing-cycles"
  | "operations-center" | "executive" | "business-intel"
  | "acl" | "audit-logs" | "business-rules" | "settings"
  | "department-login" | "subscriber-profile";

interface ScreenDef {
  id: Section;
  title: string;
  stream: BusinessStream | "both";
  department: string;
  description: string;
  module: string;
}

const allScreens: ScreenDef[] = [
  // ── OVERVIEW ───────────────────────────────────────────────────────
  {
    id: "operations-center", title: "Master Operations Center", stream: "both", department: "Operations",
    module: "Module 30",
    description: "Real-time single-pane view of the entire company. Shows Ready Series and Meal Plans KPIs in strictly separated panels — orders, production, packing, dispatch, delivery progress. Includes active alerts (inventory, payments, failed deliveries) and a live activity feed.",
  },
  {
    id: "dashboard", title: "Dashboard", stream: "meal-plans", department: "Operations",
    module: "Phase 1 — Screen 2",
    description: "Stream-specific operational dashboard. Meal Plans view: active subscribers, weekly production, swap deadlines, revenue. Swap cutoff warning animates when within 2 hours of Thursday 12:00 deadline.",
  },
  {
    id: "executive", title: "Executive Control Center", stream: "both", department: "Leadership",
    module: "Module 14 / 46",
    description: "CEO and Operations Director view. Displays Ready Series (revenue, orders, production, deliveries) and Meal Plans (subscribers, revenue, churn, deliveries) in labelled StreamBlock panels — never merged. Shared KPIs: kitchen efficiency, delivery success rate, refund rate, customer satisfaction.",
  },
  {
    id: "business-intel", title: "Business Intelligence", stream: "both", department: "Leadership",
    module: "Module 13",
    description: "Monthly revenue trend, subscriber growth area chart, delivery performance line chart, product performance table. All powered by recharts with RS/MP separation.",
  },

  // ── READY SERIES FULFILMENT ─────────────────────────────────────────
  {
    id: "orders", title: "Orders", stream: "ready-series", department: "Operations",
    module: "Phase 1 — Screen 4",
    description: "Ready Series order queue. Columns: Order ID, Customer, Products, Amount, Payment Method, Status, Actions. Stream-filtered. Each row has Print Slip and Refund (→ Shopify Admin) actions. Export CSV/Excel/PDF.",
  },
  {
    id: "delivery", title: "Delivery", stream: "ready-series", department: "Dispatch",
    module: "Phase 1 — Screen 13",
    description: "Delivery tracking for Ready Series orders. Run A/B/C grouping by delivery window. Shows packing progress per run. Stream separated from Meal Plans.",
  },
  {
    id: "print-slips", title: "Print Slips", stream: "meal-plans", department: "Kitchen / Dispatch",
    module: "Phase 1 — Screen 14",
    description: "Printable delivery slips for Meal Plans subscribers. Each slip includes customer name, address, phone, order ID, delivery window, plan goal, full meal list with macros table (Kcal, Protein, Carbs, Fat), and per-meal totals. Print button triggers window.print().",
  },

  // ── SUBSCRIBERS ─────────────────────────────────────────────────────
  {
    id: "customers", title: "Customers", stream: "meal-plans", department: "Operations / Support",
    module: "Phase 1 — Screen 6",
    description: "Customer directory with search and filter. Shows subscriber status, plan, goal, next billing date. Click row to view subscriber summary.",
  },
  {
    id: "subscriptions", title: "Subscriptions", stream: "meal-plans", department: "Operations",
    module: "Phase 1 — Screen 7",
    description: "Meal Plans subscription management. Active, Paused, and Cancelled plans. Actions per row: Pause, Resume, Cancel. Swap cutoff countdown banner when within deadline. Filter by status and goal (CUT / BUILD / MAINTAIN).",
  },
  {
    id: "fulfillment", title: "Subscription Fulfillment Engine", stream: "meal-plans", department: "Operations",
    module: "Module 43",
    description: "Tracks fulfillment progress per Meal Plans subscriber. Shows meals remaining vs total, next billing and delivery dates. Progress bar per subscriber. Actions: Pause (with 1–4 week selector), Resume, Cancel with confirmation step.",
  },
  {
    id: "pause-management", title: "Pause Management Center", stream: "meal-plans", department: "Operations",
    module: "Module 44",
    description: "Manages all subscription pauses. Business rule enforced: pause duration must be in full weeks (1/2/3/4). Resume date auto-calculated. History table with Active / Scheduled / Completed / Cancelled statuses. New Pause modal with week-selector and billing impact preview.",
  },
  {
    id: "billing-cycles", title: "Billing Cycle Center", stream: "meal-plans", department: "Finance",
    module: "Module 45",
    description: "Billing cycle management for Meal Plans. Supported cycles: Bi-Weekly ($168 / 20 meals) and Monthly ($336 / 40 meals). Cycle change workflow shows pricing impact before confirmation. Pending change state visible in table.",
  },
  {
    id: "menu-review", title: "Menu Review Engine", stream: "meal-plans", department: "Operations / Kitchen",
    module: "Module 35 / Phase 1 Screen 8",
    description: "Weekly meal selection review. Three week tabs: Current Week, Upcoming Week, Locked Reviews. Per subscriber: selections count, progress bar, status (Reviewed / Pending / Locked). Actions: Override Review (with reason + notes modal), Send Reminder, Lock Menu. Meal list shown in detail panel.",
  },
  {
    id: "menu-planning", title: "Menu Planning Center", stream: "meal-plans", department: "Kitchen",
    module: "Module 36 / Phase 1 Screen 9",
    description: "Five-stage workflow: Create → Approve → Publish → Review → Export. Meals displayed with goal (CUT/BUILD/MAINTAIN), macros, allergens. Push to kitchen queue at Export stage. Add Meal modal with full nutrition fields. Readiness check before publish.",
  },

  // ── KITCHEN ──────────────────────────────────────────────────────────
  {
    id: "kitchen", title: "Kitchen Queue", stream: "meal-plans", department: "Kitchen",
    module: "Phase 1 — Screen 10",
    description: "Daily production queue. Ready Series and Meal Plans displayed in separate panels — never merged. Each row: meal, quantity, packaging, status, goal. Print Kitchen Sheet and Export Excel actions. Inventory alert strip at top when items are low.",
  },
  {
    id: "production-board", title: "Kitchen Production Board", stream: "both", department: "Kitchen",
    module: "Module 33",
    description: "Kanban-style production board. Status pipeline: Pending → In Production → Produced → Packed. Columns: Item, Quantity, Packaging Type, Priority, Status, Stream. Mark Produced advances status. Filter by status and stream. Print Sheet and Excel export.",
  },
  {
    id: "production-forecast", title: "Production Forecasting Engine", stream: "both", department: "Kitchen / Operations",
    module: "Module 31",
    description: "Forward-looking production forecast. Period toggle: 7 / 14 / 30 / 90 days. Separate bar chart for RS and MP (never merged). Ingredient requirements tables with deficit calculation for both streams. Packaging requirements with REORDER alert. MP subscriber forecast panel.",
  },
  {
    id: "kitchen-forecast", title: "Kitchen Forecasting", stream: "both", department: "Kitchen",
    module: "Module 27",
    description: "Ingredient and packaging requirements for the current production period. Low stock and out-of-stock alerts. Separated RS and MP tables.",
  },
  {
    id: "export-center", title: "Delivery Order Export Center", stream: "both", department: "Kitchen / Dispatch",
    module: "Module 34 — Phase 5 Enhanced",
    description: "Two tabs: Generate DO and Export History. Generate tab: export type selector (Kitchen Production Sheet, Packing Sheet, Delivery Manifest), strict RS/MP stream selector, delivery window filter. Manifest has full columns: Order ID, Customer, Address, Contact, Window, Rider, Route, Product/Plan, Notes, Status. PRINT button opens a print-ready new window with operational layout. Download PDF/Excel/CSV with confirmation dialog (logs to Audit Trail). DO Change Control: warning banner when an order changed after DO generation — shows Previous Version vs Updated Version, Changed Fields, Changed By, Timestamp. Export History tab: table of past exports (Export ID, BU, Type, Date, Generated By, Format, Records) with View/Print Again/Download Again actions — all auditable.",
  },
  {
    id: "inventory", title: "Inventory", stream: "both", department: "Kitchen",
    module: "Phase 1 — Screen 11",
    description: "Ingredient and packaging stock levels. Low stock and out-of-stock alerts. Search and category filter. Used per week, weeks remaining calculation. Reorder action per item.",
  },
  {
    id: "procurement", title: "Procurement Center", stream: "both", department: "Kitchen",
    module: "Module 28",
    description: "Three tabs: Purchase Orders, Suppliers, Stock Requests. PO status filter and approve action. Create PO modal. Supplier list with lead time and star rating.",
  },
  {
    id: "packaging", title: "Packaging Center", stream: "both", department: "Kitchen",
    module: "Module 29",
    description: "10 packaging SKUs across Containers, Bags, Ice Packs, Labels. Weeks-left calculated dynamically. Low/out-of-stock alert banner. Allocate, Receive, Reorder actions per SKU.",
  },

  // ── DISPATCH ─────────────────────────────────────────────────────────
  {
    id: "dispatch", title: "Dispatch Control Center", stream: "both", department: "Dispatch",
    module: "Module 39 / Phase 1 Screen 13",
    description: "Explicit two-stream dispatch. Ready Series Queue and Meal Plans Queue shown as separate KPI blocks — never merged. Queue stream toggle (RS | MP) switches the order table. Assign Rider modal. Reassign action. Rider availability table. Generate Manifest and Print Route Sheet.",
  },
  {
    id: "failed-deliveries", title: "Failed Delivery Center", stream: "both", department: "Dispatch / Support",
    module: "Module 42",
    description: "Exception management for failed deliveries. Reasons: Customer Unavailable, Wrong Address, Customer Rejected, Other. Actions per case: Schedule Redeliver, Initiate Refund, Escalate. Detail panel shows customer, address, rider, notes, attempt count. Status filter: Open / Reattempt Scheduled / Refund Requested / Escalated / Resolved.",
  },
  {
    id: "delivery-hub", title: "Delivery Operations Hub", stream: "both", department: "Dispatch",
    module: "Module 30",
    description: "Zone heatmap (North/East/West/Central/South), rider leaderboard ranked by on-time %, delivery success trend line chart, failed delivery queue with reattempt/contact/mark-failed actions.",
  },
  {
    id: "riders", title: "Riders", stream: "both", department: "Dispatch",
    module: "Module 40 / Phase 1 Screen 16",
    description: "Rider management. Columns: Rider Name, Deliveries Assigned, Success Rate, Status. Statuses: Available, Assigned, On Route, Completed. Search and zone filter.",
  },
  {
    id: "rider-app", title: "Rider Mobile App", stream: "both", department: "Dispatch",
    module: "Module 41 / Phase 1 Screen 17",
    description: "Mobile phone frame simulator. Six screens: Login, Today's Deliveries (route list with stream labels), Delivery Details (customer, address, contact, notes), Mark Delivered, Upload Proof of Delivery, Report Failure (reason selection). Screen selector above phone frame.",
  },

  // ── OPERATIONS ───────────────────────────────────────────────────────
  {
    id: "support", title: "Customer Support", stream: "both", department: "Support",
    module: "Phase 1 — Screen 18 (Phase 5 Enhanced)",
    description: "Support ticket queue with RS/MP customer type detection badge. Customer lookup by name/email/phone. Customer panel shows plan, address, billing, recent orders, RS/MP type indicator. Action buttons split by stream: Common (Update Name, Phone, Address, Reset Password, View Order, Add Note), Meal Plan Only (Pause Plan, Resume Plan, Meal Swap, Billing Inquiry), Ready Series Only (Order Issue, Bundle Issue, Delivery Issue, Refund Request). Customer Change Propagation: when an action is applied, shows full downstream impact cascade — Subscriber record → Kitchen requirement → Packing → DO → Dispatch → Audit Log. Animated propagation states: preview, propagating, done with timestamp audit entry.",
  },
  {
    id: "customer-success", title: "Customer Success Center", stream: "both", department: "Support",
    module: "Module 24",
    description: "Escalation management. Six escalations with priority (Critical / High / Medium / Low) and status (Open / In-Progress / Escalated / Resolved). Detail panel: assign-to dropdown, Resolve / Escalate / Add Note actions.",
  },
  {
    id: "notifications", title: "Notification Center", stream: "both", department: "Operations",
    module: "Module 23",
    description: "All system notifications. Types: Failed Payment, Refund Request, New Subscriber, Inventory, Delivery Failure, Menu Reminder, System. Channel filter: Email / WhatsApp / Admin. Unread-only toggle. Mark All Read. Alert configuration matrix per type/channel.",
  },
  {
    id: "whatsapp", title: "WhatsApp Communication Center", stream: "both", department: "Marketing / Operations",
    module: "Module 29",
    description: "Four tabs: Message Log (with delivery status icons), Templates (order confirmed, delivery updates, payment reminders, weekly reminders), Broadcast (composer + recent history with delivery stats), API Settings (auto-send rules per trigger type).",
  },
  {
    id: "marketing", title: "Marketing", stream: "both", department: "Marketing",
    module: "Phase 1 — Screen 19",
    description: "Campaign management, attribution tracking, referral codes, and promotional tools. Separate MP and RS campaign tracking.",
  },

  // ── FINANCE ──────────────────────────────────────────────────────────
  {
    id: "wallet", title: "Wallet & Rewards", stream: "both", department: "Finance",
    module: "Module 26",
    description: "Internal credit and wallet management. Customer wallet balances, credit top-ups, redemption history. Note: no payment processing — Shopify executes all charges.",
  },
  {
    id: "finance", title: "Finance & Billing", stream: "meal-plans", department: "Finance",
    module: "Phase 1 — Screen 20",
    description: "Transaction records synced read-only from Shopify. Three tabs: All Transactions, Failed Payments (with Retry → Shopify note), Refunds. Payment method breakdown chart. Revenue summary: Today / Week / Month. Shopify boundary clearly labelled: 'This portal records the decision; Shopify executes it.'",
  },
  {
    id: "refunds", title: "Refund Management", stream: "both", department: "Finance",
    module: "Module 25",
    description: "Refund request queue across both streams. Status filter: Pending / Approved / Rejected / Escalated. Detail panel with Approve / Reject / Escalate actions. Shopify boundary note: 'Approving records the decision here. Shopify Admin executes the actual refund.'",
  },
  {
    id: "reports", title: "Reports", stream: "meal-plans", department: "Finance / Operations",
    module: "Phase 1 — Screen 20",
    description: "Operational reports. Revenue, delivery performance, subscription metrics. Export CSV / Excel / PDF.",
  },

  // ── ADMIN ─────────────────────────────────────────────────────────────
  {
    id: "acl", title: "Access Control Center", stream: "both", department: "Admin",
    module: "Module 21 — Phase 5 Enhanced",
    description: "Four tabs: User Directory (10 users, filter by dept, Manage button opens Change Role / Department Transfer / Reset Password modals). Change Role modal shows: Current Role vs New Role side-by-side, full Permissions Being Added (green) and Permissions Being Removed (red) diff list, Potential Impact summary, Reason field (required), Last Super Admin warning — high-risk banner with explicit checkbox if changing the final SA. Department Transfer modal shows permissions impact and requires reason. All changes require Reason field. Audit Log note shows: Changed By / Changed User / Old Role / New Role / Timestamp / Reason. Role Builder: 33 roles across 7 departments, 8 permission types (View, Create, Edit, Delete, Approve, Export, Assign, Execute), full matrix display. Permission Matrix: all roles × all modules with Full / count/8 / — display. Department Management: dept head ACL rule enforced — can only manage own department.",
  },
  {
    id: "audit-logs", title: "Audit Logs", stream: "both", department: "Admin",
    module: "Module 22",
    description: "Immutable log of every admin action. Columns: Log ID, Timestamp, User, Department, Action, Module, Type, Device, IP Address. Filter by type, date range, department. Export all.",
  },
  {
    id: "business-rules", title: "Business Rules Engine", stream: "both", department: "Admin",
    module: "Module 28",
    description: "11 business rules covering both streams: pause rules, menu cutoff, billing cycle, retry logic, free delivery threshold, bundle discounts, promotions, wallet expiry, auto-approve refunds. Stream filter (MP/RS/Shared), category filter. Rule detail panel with condition code and action text. New Rule modal.",
  },
  {
    id: "department-login", title: "Department Login Portal", stream: "both", department: "Admin / All Departments",
    module: "Phase 1 · Screen 1 (Phase 5 Enhanced)",
    description: "Role-based login with correct authentication model: department tile selection does NOT grant access — credentials are authenticated first, then the system determines the user's actual department and role. If selected department does not match the authenticated user's assigned department → Access Denied / Department Mismatch error with explanation. Error states: not-found (email not in system), mismatch (wrong department selected), password error. Authentication flow displayed in info panel: Enter credentials → Authentication → System identifies user → System determines department/role/permissions → Authorized workspace loads. On success: shows permitted modules, role, email, and active session notice. All login events recorded in Audit Trail.",
  },
  {
    id: "subscriber-profile", title: "Subscriber Profile — 7 Tabs", stream: "meal-plans", department: "Operations / Support",
    module: "Phase 1 · Screen 7",
    description: "Full subscriber profile for Meal Plans. 7 tabs: (1) Overview — plan progress bar, macro targets, address, billing cadence; (2) Plan Details — weekly schedule grid, macro per-meal breakdown; (3) Meals — week-by-week meal log with Kcal/Protein/Carbs/Fat per row and delivery status; (4) Deliveries — full delivery history with rider, window, address, status; (5) Billing — invoice history, amounts, Shopify payment method (read-only, Shopify boundary enforced); (6) Pauses — pause history, New Pause CTA, business rule callout (1–4 weeks only); (7) Notes — internal team notes log with author, department type, and Add Note form.",
  },
  {
    id: "settings", title: "Admin Settings — 8 Tabs", stream: "both", department: "All Departments",
    module: "Phase 4 · Module 31",
    description: "Complete admin settings experience. 8 tabs: (1) My Profile — name, title, phone, about, read-only role/dept/employee ID, profile photo upload; (2) Security — change password, 2FA toggle, active sessions with sign-out all, login history with failed attempt highlighting; (3) Notifications — email/in-app/WhatsApp channel toggles, per-event alert preferences with department owner labels; (4) My Access — current role/dept display, permitted modules list, access provenance; (5) Permission Requests — table of all requests (pending/approved/rejected/expired), New Request modal with module/permission/type/reason fields; (6) Escalation Requests — table with priority badges, Raise Escalation modal for refund approvals/inventory overrides/delivery exceptions; (7) Team Management — department member roster with Edit Role and Suspend/Restore actions, confirmation modal for suspension, ACL rule banner (dept heads cannot cross-grant); (8) System Settings (Super Admin only) — global config values (cutoff times, billing rates, pause limits), Shopify integration status with boundary notice, notification policy table.",
  },
];

interface Props {
  setSection: (s: Section) => void;
  setStream: (s: BusinessStream) => void;
  setCapturing: (v: boolean) => void;
  mainRef: React.RefObject<HTMLElement | null>;
}

export default function PDFExport({ setSection, setStream, setCapturing, mainRef }: Props) {
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentLabel, setCurrentLabel] = useState("");
  const cancelRef = useRef(false);

  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

  const captureScreen = async (el: HTMLElement): Promise<string> => {
    return toJpeg(el, {
      backgroundColor: "#0F0F0F",
      quality: 0.88,
      pixelRatio: 1.5,
      skipFonts: false,
      cacheBust: true,
      height: el.scrollHeight,
      style: { overflow: "visible" },
    });
  };

  const run = async () => {
    if (!mainRef.current) return;
    setExporting(true);
    cancelRef.current = false;

    const PDF_W = 297; // A4 landscape width mm
    const PDF_H = 210; // A4 landscape height mm
    const MARGIN = 12;
    const HEADER_H = 22;

    const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

    // ── Cover page ──────────────────────────────────────────────────────
    pdf.setFillColor(15, 15, 15);
    pdf.rect(0, 0, PDF_W, PDF_H, "F");

    // Accent strip
    pdf.setFillColor(245, 179, 0);
    pdf.rect(0, 0, 4, PDF_H, "F");

    // Title
    pdf.setTextColor(245, 179, 0);
    pdf.setFontSize(28);
    pdf.setFont("helvetica", "bold");
    pdf.text("Performance Meals", MARGIN + 8, 68);

    pdf.setTextColor(232, 232, 232);
    pdf.setFontSize(20);
    pdf.text("Admin Platform — QA Documentation", MARGIN + 8, 82);

    pdf.setTextColor(136, 136, 136);
    pdf.setFontSize(10);
    pdf.text("Phase 1 · Phase 2 · Phase 3  ·  All Modules", MARGIN + 8, 96);
    pdf.text(`Generated: ${new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}  ·  ${allScreens.length} screens documented`, MARGIN + 8, 103);

    // Two-stream legend
    pdf.setFillColor(232, 93, 4);
    pdf.rect(MARGIN + 8, 118, 3, 3, "F");
    pdf.setTextColor(232, 93, 4);
    pdf.setFontSize(9);
    pdf.text("Ready Series  —  Box Subscriptions · Ready-to-Go", MARGIN + 14, 121);

    pdf.setFillColor(245, 179, 0);
    pdf.rect(MARGIN + 8, 125, 3, 3, "F");
    pdf.setTextColor(245, 179, 0);
    pdf.text("Meal Plans  —  Subscriptions · Menu · Billing", MARGIN + 14, 128);

    pdf.setTextColor(42, 42, 42);
    pdf.setFontSize(8);
    pdf.text("Shopify Admin remains the commerce engine. This portal is the operations engine.", MARGIN + 8, 148);
    pdf.text("No payment processing, product creation, or checkout in this platform.", MARGIN + 8, 154);

    pdf.setTextColor(42, 42, 42);
    pdf.setFontSize(7);
    pdf.text("Performance Meals · Singapore · Confidential", MARGIN + 8, PDF_H - 8);
    pdf.text(`Page 1 of ${allScreens.length + 1}`, PDF_W - MARGIN - 20, PDF_H - 8);

    // ── Table of Contents ───────────────────────────────────────────────
    pdf.addPage();
    pdf.setFillColor(15, 15, 15);
    pdf.rect(0, 0, PDF_W, PDF_H, "F");
    pdf.setFillColor(245, 179, 0);
    pdf.rect(0, 0, 4, PDF_H, "F");

    pdf.setTextColor(245, 179, 0);
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text("Table of Contents", MARGIN + 8, MARGIN + 10);

    pdf.setFontSize(7.5);
    const cols = [
      allScreens.slice(0, Math.ceil(allScreens.length / 2)),
      allScreens.slice(Math.ceil(allScreens.length / 2)),
    ];
    cols.forEach((col, ci) => {
      let y = MARGIN + 22;
      col.forEach((s, i) => {
        const absIdx = ci === 0 ? i : i + Math.ceil(allScreens.length / 2);
        pdf.setTextColor(136, 136, 136);
        pdf.text(`${String(absIdx + 1).padStart(2, "0")}`, MARGIN + 8 + ci * 140, y);
        pdf.setTextColor(232, 232, 232);
        pdf.text(s.title, MARGIN + 16 + ci * 140, y);
        pdf.setTextColor(85, 85, 85);
        pdf.text(s.module, MARGIN + 98 + ci * 140, y);
        y += 6.2;
      });
    });

    // ── Screenshot pages ────────────────────────────────────────────────
    const el = mainRef.current;

    // Turn on demoMode so all sections pre-open their modals/panels
    setCapturing(true);
    await sleep(60);

    for (let i = 0; i < allScreens.length; i++) {
      if (cancelRef.current) break;
      const screen = allScreens[i];
      setCurrentLabel(`${screen.title} (${i + 1}/${allScreens.length})`);
      setProgress(Math.round(((i + 1) / allScreens.length) * 100));

      // Switch stream appropriately
      if (screen.stream === "meal-plans") setStream("meal-plans");
      else if (screen.stream === "ready-series") setStream("ready-series");

      setSection(screen.id as Section);
      el.scrollTop = 0;
      // Wait for section mount + modal/panel state to fully render
      await sleep(600);

      const imgData = await captureScreen(el);
      const imgProps = { w: el.offsetWidth, h: el.scrollHeight };
      const aspect = imgProps.h / imgProps.w;

      pdf.addPage();
      pdf.setFillColor(15, 15, 15);
      pdf.rect(0, 0, PDF_W, PDF_H, "F");

      // Accent strip colour by stream
      if (screen.stream === "ready-series") {
        pdf.setFillColor(232, 93, 4);
      } else if (screen.stream === "meal-plans") {
        pdf.setFillColor(245, 179, 0);
      } else {
        pdf.setFillColor(42, 42, 42);
      }
      pdf.rect(0, 0, 4, PDF_H, "F");

      // Header band
      pdf.setFillColor(24, 24, 24);
      pdf.rect(4, 0, PDF_W - 4, HEADER_H, "F");

      // Screen number badge
      pdf.setFillColor(42, 42, 42);
      pdf.rect(MARGIN, 4, 14, 14, "F");
      pdf.setTextColor(136, 136, 136);
      pdf.setFontSize(7);
      pdf.setFont("helvetica", "bold");
      pdf.text(String(i + 1).padStart(2, "0"), MARGIN + 4.5, 12.5);

      // Title
      pdf.setTextColor(232, 232, 232);
      pdf.setFontSize(11);
      pdf.text(screen.title, MARGIN + 18, 11);

      // Module + Department
      pdf.setTextColor(136, 136, 136);
      pdf.setFontSize(7.5);
      pdf.text(`${screen.module}  ·  ${screen.department}`, MARGIN + 18, 18);

      // Stream badge
      const streamLabel = screen.stream === "both" ? "Shared" : screen.stream === "meal-plans" ? "Meal Plans" : "Ready Series";
      const streamColor: [number, number, number] = screen.stream === "both" ? [85, 85, 85] : screen.stream === "meal-plans" ? [245, 179, 0] : [232, 93, 4];
      pdf.setTextColor(...streamColor);
      pdf.setFontSize(7);
      pdf.text(`▪ ${streamLabel}`, PDF_W - MARGIN - 30, 11);

      // Page number
      pdf.setTextColor(85, 85, 85);
      pdf.text(`${i + 3} / ${allScreens.length + 2}`, PDF_W - MARGIN - 16, 18);

      // Description strip
      const DESC_H = 14;
      const SS_TOP = HEADER_H + DESC_H;
      const SS_H = PDF_H - SS_TOP - MARGIN;
      const SS_W = PDF_W - MARGIN - 4;

      pdf.setFillColor(18, 18, 18);
      pdf.rect(4, HEADER_H, PDF_W - 4, DESC_H, "F");
      pdf.setTextColor(160, 160, 160);
      pdf.setFontSize(7.2);
      pdf.setFont("helvetica", "normal");
      const descLines = pdf.splitTextToSize(screen.description, SS_W - 4);
      pdf.text(descLines.slice(0, 2), MARGIN, HEADER_H + 6);

      // Screenshot — fit to remaining space
      const availW = SS_W;
      const availH = SS_H;
      let drawW = availW;
      let drawH = drawW * aspect;
      if (drawH > availH) {
        drawH = availH;
        drawW = drawH / aspect;
      }
      const drawX = MARGIN + (availW - drawW) / 2;
      const drawY = SS_TOP + (availH - drawH) / 2;

      pdf.addImage(imgData, "JPEG", drawX, drawY, drawW, drawH);

      // Border around screenshot
      pdf.setDrawColor(42, 42, 42);
      pdf.setLineWidth(0.3);
      pdf.rect(drawX, drawY, drawW, drawH);
    }

    // Restore normal mode before saving
    setCapturing(false);

    if (!cancelRef.current) {
      pdf.save(`PerformanceMeals_Admin_QA_${new Date().toISOString().slice(0, 10)}.pdf`);
    }

    setExporting(false);
    setProgress(0);
    setCurrentLabel("");
  };

  return (
    <>
      <button
        onClick={run}
        disabled={exporting}
        className="flex items-center gap-2 border border-[#2A2A2A] text-[#888] text-xs px-3 py-1.5 mono hover:border-[#F5B300] hover:text-[#F5B300] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        title="Download Final QA Handoff PDF — all screens with modals"
      >
        <span>⎙</span>
        <span>{exporting ? "Generating…" : "Final QA Handoff ✓"}</span>
      </button>

      {/* Progress overlay */}
      {exporting && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex flex-col items-center justify-center gap-6 backdrop-blur-sm">
          <div className="w-full max-w-md px-8 space-y-5">
            <div className="text-center space-y-1">
              <div className="text-[#F5B300] text-xl font-extrabold mono tracking-widest">GENERATING PDF</div>
              <div className="text-[#888] text-xs mono">Capturing all screens for QA review</div>
            </div>

            {/* Progress bar */}
            <div className="h-1 bg-[#2A2A2A] w-full">
              <div
                className="h-1 bg-[#F5B300] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex justify-between text-xs mono text-[#555]">
              <span className="text-[#E8E8E8] truncate max-w-xs">{currentLabel}</span>
              <span className="text-[#F5B300] font-bold flex-shrink-0 ml-2">{progress}%</span>
            </div>

            <div className="text-center text-xs text-[#555] mono">
              {allScreens.length} screens · do not interact with the portal during capture
            </div>

            <button
              onClick={() => { cancelRef.current = true; setCapturing(false); }}
              className="w-full border border-[#2A2A2A] text-[#555] text-xs py-2 mono hover:border-red-800 hover:text-red-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
