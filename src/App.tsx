import { useCallback, useEffect, useState } from "react";
import Dashboard from "./sections/Dashboard";
import Orders from "./sections/Orders";
import Delivery from "./sections/Delivery";
import PrintSlips from "./sections/PrintSlips";
import Customers from "./sections/Customers";
import Subscriptions from "./sections/Subscriptions";
import MenuReview from "./sections/MenuReviewWorkspace";
import Kitchen from "./sections/Kitchen";
import Inventory from "./sections/Inventory";
import Dispatch from "./sections/Dispatch";
import Riders from "./sections/Riders";
import Support from "./sections/Support";
import Marketing from "./sections/Marketing";
import Finance from "./sections/Finance";
import Wallet from "./sections/Wallet";
import Reports from "./sections/Reports";
import Executive from "./sections/Executive";
import BusinessIntel from "./sections/BusinessIntel";
import ACL from "./sections/ACL";
import AuditLogs from "./sections/AuditLogs";
import Notifications from "./sections/Notifications";
import CustomerSuccess from "./sections/CustomerSuccess";
import Refunds from "./sections/Refunds";
import KitchenForecast from "./sections/KitchenForecast";
import Procurement from "./sections/Procurement";
import Packaging from "./sections/Packaging";
import DeliveryHub from "./sections/DeliveryHub";
import RiderApp from "./sections/RiderApp";
import MenuPlanning from "./sections/MenuPlanning";
import BusinessRules from "./sections/BusinessRules";
import WhatsApp from "./sections/WhatsApp";
import OperationsCenter from "./sections/OperationsCenter";
import ProductionForecast from "./sections/ProductionForecast";
import ProductionBoard from "./sections/ProductionBoard";
import ExportCenter from "./sections/ExportCenter";
import FailedDeliveries from "./sections/FailedDeliveries";
import Fulfillment from "./sections/Fulfillment";
import PauseManagement from "./sections/PauseManagement";
import BillingCycles from "./sections/BillingCycles";
import CustomerProfile, { type ProfileTab } from "./sections/CustomerProfile";
import Settings from "./sections/Settings";
import CatalogCenter from "./sections/CatalogCenter";
import Escalations from "./sections/Escalations";
import LoginPage from "./components/LoginPage";
import { initialUsers, modulePermissionOptions, rolePermissions, type AccessRequest, type UserAccount } from "./accessControl";
import { orders, subscriptions, type EscalationStatus, type OperationalNotification, type RefundEscalation, type WalletRefund, type WalletRefundStatus } from "./data";
import { refundHistory } from "./refundHistory";

export type BusinessStream = "meal-plans" | "ready-series" | "other-sales";
export type Theme = "light" | "dark";

/* ── Brand logo components ─────────────────────────────────────────────── */

function PMLogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="14" fill="#F5B300" />
    </svg>
  );
}

function PerformanceMealsLogo({ collapsed }: { collapsed: boolean }) {
  if (collapsed) return <PMLogoMark size={28} />;
  return (
    <div className="flex items-center gap-2.5 min-w-0">
      <PMLogoMark size={28} />
      <div className="min-w-0">
        <div className="leading-none" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: "0.12em", color: "var(--pm-text)" }}>
          PERFORMANCE
        </div>
        <div className="mt-0.5" style={{ height: 1, background: "#F5B300", width: "100%" }} />
        <div className="mt-0.5 text-right" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 500, fontSize: 9, letterSpacing: "0.22em", color: "#F5B300" }}>
          MEALS
        </div>
      </div>
    </div>
  );
}

function MealPlanBadge() {
  return (
    <div className="flex items-center gap-1.5">
      <div style={{ width: 3, height: 22, background: "#E85D04", flexShrink: 0 }} />
      <div>
        <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 11, color: "var(--pm-text)", letterSpacing: "0.04em", lineHeight: 1 }}>
          MEAL PLAN
        </div>
        <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: 8.5, color: "#E85D04", letterSpacing: "0.14em", marginTop: 2 }}>
          PERFORMANCE MEALS
        </div>
      </div>
    </div>
  );
}

function ReadySeriesBadge() {
  return (
    <div className="flex items-center gap-1.5">
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
        <circle cx="9" cy="9" r="9" fill="#F5B300" />
      </svg>
      <div>
        <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 11, color: "var(--pm-text)", letterSpacing: "0.04em", lineHeight: 1 }}>
          READY-SERIES
        </div>
        <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: 8.5, color: "#F5B300", letterSpacing: "0.14em", marginTop: 2 }}>
          BY PERFORMANCE MEALS
        </div>
      </div>
    </div>
  );
}

function OtherSalesBadge() {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-full bg-[var(--pm-surface-muted)] text-[10px] font-extrabold text-[var(--pm-text-secondary)]">
        $
      </div>
      <div>
        <div className="text-[11px] font-extrabold leading-none tracking-[0.04em] text-[var(--pm-text)]">
          OTHER SALES
        </div>
        <div className="mt-0.5 text-[8.5px] font-medium tracking-[0.14em] text-[var(--pm-text-muted)]">
          WALLET &amp; GIFT CARDS
        </div>
      </div>
    </div>
  );
}

type Section =
  | "dashboard"
  | "orders" | "delivery" | "print-slips"
  | "customers" | "subscriptions" | "menu-review" | "menu-planning"
  | "kitchen" | "kitchen-forecast" | "inventory" | "procurement" | "packaging"
  | "dispatch" | "delivery-hub" | "riders" | "rider-app"
  | "support" | "customer-success" | "notifications"
  | "marketing"
  | "wallet" | "finance" | "refunds" | "reports"
  | "business-intel" | "executive"
  | "acl" | "audit-logs"
  | "business-rules" | "whatsapp"
  | "operations-center" | "production-forecast" | "production-board" | "export-center"
  | "failed-deliveries" | "fulfillment" | "pause-management" | "billing-cycles"
  | "subscriber-profile"
  | "catalog"
  | "escalations"
  | "settings";

interface NavItem {
  id: Section;
  label: string;
  icon: string;
  streamOnly?: "meal-plans" | "ready-series";
  deferred?: boolean;
}

// Sections retained for roadmap reference but hidden from active navigation.
const DEFERRED_HIDDEN: Section[] = [
  "procurement", "packaging", "rider-app", "business-rules",
  "executive", "business-intel", "customer-success", "marketing",
];

const navGroups: { group: string; items: NavItem[] }[] = [
  {
    group: "Overview",
    items: [
      { id: "dashboard",        label: "Dashboard",         icon: "▦" },
      { id: "operations-center", label: "Operations Center", icon: "◉" },
      { id: "reports",          label: "Reports",            icon: "↗" },
    ],
  },
  {
    group: "Fulfilment",
    items: [
      { id: "orders",       label: "Orders",       icon: "≡" },
      { id: "delivery",     label: "Delivery",     icon: "⊡" },
      { id: "dispatch",     label: "Dispatch",     icon: "⇢" },
      { id: "print-slips",  label: "Print Slips",  icon: "⎙" },
    ],
  },
  {
    group: "Subscribers",
    items: [
      { id: "customers",          label: "Customers",          icon: "◎" },
      { id: "subscriptions",      label: "Subscriptions",      icon: "↻" },
      { id: "subscriber-profile", label: "Customer Profile", icon: "◎" },
      { id: "menu-review",        label: "Menu Review",        icon: "☰", streamOnly: "meal-plans" },
      { id: "pause-management",   label: "Pause Management",   icon: "⊟", streamOnly: "meal-plans" },
      { id: "billing-cycles",     label: "Billing Cycles",     icon: "↻", streamOnly: "meal-plans" },
      { id: "fulfillment",        label: "Fulfillment",        icon: "◆", streamOnly: "meal-plans" },
    ],
  },
  {
    group: "Catalog",
    items: [
      { id: "catalog", label: "Catalog", icon: "▣" },
    ],
  },
  {
    group: "Kitchen",
    items: [
      { id: "kitchen",             label: "Kitchen Queue",       icon: "◉" },
      { id: "menu-planning",       label: "Menu Planning",       icon: "⊞", streamOnly: "meal-plans" },
      { id: "production-forecast", label: "Production Forecast", icon: "◈" },
      { id: "production-board",    label: "Production Board",    icon: "⊞" },
      { id: "kitchen-forecast",    label: "Kitchen Forecast",    icon: "◈" },
    ],
  },
  {
    group: "Operations",
    items: [
      { id: "inventory",         label: "Inventory",         icon: "▣" },
      { id: "failed-deliveries", label: "Failed Deliveries", icon: "⊠" },
      { id: "export-center",     label: "Export Center",     icon: "⎙" },
      { id: "riders",            label: "Riders",            icon: "⊙" },
      { id: "delivery-hub",      label: "Delivery Hub",      icon: "◌" },
    ],
  },
  {
    group: "Finance",
    items: [
      { id: "wallet",  label: "Wallet & Credits", icon: "◇" },
      { id: "refunds", label: "Refunds",           icon: "↩" },
      { id: "finance", label: "Finance & Billing", icon: "₿" },
    ],
  },
  {
    group: "Admin",
    items: [
      { id: "acl",           label: "Users & Roles", icon: "⊛" },
      { id: "audit-logs",    label: "Audit Logs",    icon: "⊟" },
      { id: "notifications", label: "Notifications", icon: "◇" },
      { id: "escalations",   label: "Escalations",  icon: "⇧" },
      { id: "settings",      label: "Settings",      icon: "⚙" },
    ],
  },
  {
    group: "Communication",
    items: [
      { id: "whatsapp", label: "WhatsApp",        icon: "◎" },
      { id: "support",  label: "Customer Support", icon: "◎" },
    ],
  },
];

const sectionTitles: Record<Section, string> = {
  dashboard: "Dashboard",
  orders: "Orders",
  delivery: "Delivery",
  "print-slips": "Print Slips",
  customers: "Customers",
  subscriptions: "Subscriptions",
  "menu-review": "Menu Review",
  "menu-planning": "Menu Planning Center",
  kitchen: "Kitchen Queue",
  "kitchen-forecast": "Kitchen Forecasting",
  inventory: "Inventory",
  procurement: "Procurement Center",
  packaging: "Packaging Center",
  dispatch: "Dispatch Center",
  "delivery-hub": "Delivery Operations Hub",
  riders: "Riders",
  "rider-app": "Rider App — Future / Deferred",
  support: "Customer Support",
  "customer-success": "Customer Success Center",
  notifications: "Notification Center",
  marketing: "Marketing",
  wallet: "Wallet & Rewards",
  finance: "Finance & Billing",
  refunds: "Refund Management",
  reports: "Reports",
  "business-intel": "Business Intelligence — Future / Deferred",
  executive: "Executive Control Center — Future / Deferred",
  acl: "Access Control Center",
  "audit-logs": "Audit Logs",
  "business-rules": "Business Rules Engine",
  "whatsapp": "WhatsApp Communication Center",
  "operations-center": "Master Operations Center",
  "production-forecast": "Production Forecasting Engine",
  "production-board": "Kitchen Production Board",
  "export-center": "Delivery Order Export Center",
  "failed-deliveries": "Failed Delivery Center",
  "fulfillment": "Subscription Fulfillment Engine",
  "pause-management": "Pause Management Center",
  "billing-cycles": "Billing Cycle Center",
  "subscriber-profile": "Customer Profile",
  catalog: "Catalog",
  escalations: "Escalations",
  settings: "Settings",
};

// Shared sections show data from both streams but remain operationally separated
const sharedSections: Section[] = [
  "kitchen", "kitchen-forecast", "inventory", "procurement", "packaging",
  "production-board", "production-forecast", "export-center",
  "dispatch", "delivery-hub", "riders", "rider-app", "failed-deliveries",
  "support", "customer-success", "notifications", "marketing",
  "wallet", "refunds",
  "operations-center", "executive", "business-intel",
  "acl", "audit-logs", "business-rules", "whatsapp",
  "settings", "catalog", "subscriber-profile", "escalations",
];

const otherSalesSections = new Set<Section>([
  "dashboard",
  "customers",
  "subscriber-profile",
  "wallet",
  "finance",
  "refunds",
  "acl",
  "audit-logs",
  "notifications",
  "escalations",
  "settings",
  "whatsapp",
  "support",
]);

function checkNearCutoff(): boolean {
  const d = new Date();
  const isThursday = d.getDay() === 4;
  const minutes = d.getHours() * 60 + d.getMinutes();
  const cutoffMinutes = 13 * 60 + 59;
  return isThursday && minutes >= cutoffMinutes - 120 && minutes < cutoffMinutes;
}

function baselineAttentionCount(sectionId: Section, stream: BusinessStream): number {
  if (sectionId === "orders") {
    return readStoredState("pm-orders-workflow", orders).filter(order =>
      order.status === "Pending" &&
      (stream === "meal-plans"
        ? order.planType === "Meal Plan"
        : stream === "ready-series" && order.planType !== "Meal Plan")
    ).length;
  }
  if (sectionId === "menu-review" && stream === "meal-plans") {
    const storedReviews = readStoredState<Array<{ status: string }> | null>("pm-menu-review-workflow", null);
    if (storedReviews) return storedReviews.filter(review => review.status === "Pending").length;
    return subscriptions.filter(subscription =>
      subscription.planType === "Meal Plan" &&
      subscription.status !== "Cancelled" &&
      !subscription.menuConfirmed
    ).length;
  }
  if (sectionId === "kitchen" && stream !== "other-sales") {
    const key = stream === "meal-plans" ? "pm-kitchen-meal-plan-workflow" : "pm-kitchen-ready-series-workflow";
    const storedQueue = readStoredState<Array<{ status: string }> | null>(key, null);
    return storedQueue ? storedQueue.filter(item => item.status === "Queued").length : 1;
  }
  if (sectionId === "fulfillment" && stream === "meal-plans") {
    const storedItems = readStoredState<Array<{ status: string }> | null>("pm-fulfillment-workflow", null);
    return storedItems ? storedItems.filter(item => item.status === "pending-review").length : 1;
  }
  if (sectionId === "finance") {
    if (stream === "meal-plans") {
      const retriedIds = readStoredState<string[]>("pm-finance-retried-payments", []);
      return retriedIds.includes("TXN-3205") ? 0 : 1;
    }
    return 0;
  }
  if (sectionId === "dispatch") {
    const storedItems = readStoredState<Array<{ status: string }> | null>("pm-dispatch-workflow", null);
    return storedItems ? storedItems.filter(item => item.status === "pending").length : 4;
  }
  if (sectionId === "failed-deliveries") {
    const storedItems = readStoredState<Array<{ status: string }> | null>("pm-failed-deliveries-workflow", null);
    return storedItems ? storedItems.filter(item => item.status === "open").length : 1;
  }
  if (sectionId === "inventory") {
    const storedItems = readStoredState<Array<{ stock: number; minimum: number }> | null>("pm-inventory-ingredients", null);
    return storedItems ? storedItems.filter(item => item.stock < item.minimum).length : 5;
  }
  if (sectionId === "production-board") {
    const storedItems = readStoredState<Array<{ status: string }> | null>("pm-production-board-workflow", null);
    return storedItems ? storedItems.filter(item => item.status === "pending").length : 4;
  }
  if (sectionId === "support") {
    const storedItems = readStoredState<Array<{ status: string }> | null>("pm-support-workflow", null);
    return storedItems ? storedItems.filter(item => item.status === "Open").length : 2;
  }
  return 0;
}

function readStoredState<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? JSON.parse(stored) as T : fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "light";
    return window.localStorage.getItem("pm-admin-theme") === "dark" ? "dark" : "light";
  });
  const [users, setUsers] = useState<UserAccount[]>(() => readStoredState("pm-access-users", initialUsers));
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);

  const [section, setSection] = useState<Section>("dashboard");
  const [settingsTab, setSettingsTab] = useState<string>("profile");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [stream, setStream] = useState<BusinessStream>("meal-plans");
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(
    new Set(["Communication"])
  );
  const [streamDropdownOpen, setStreamDropdownOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [profileCustomerId, setProfileCustomerId] = useState<string | undefined>(undefined);
  const [aclRequestId, setAclRequestId] = useState<string | null>(null);
  const [profileInitialTab, setProfileInitialTab] = useState<ProfileTab>("overview");
  const [focusedOrder, setFocusedOrder] = useState<{ sourceId: string; customerName: string } | undefined>(undefined);
  const [walletRefunds, setWalletRefunds] = useState<WalletRefund[]>([]);
  const [refundEscalations, setRefundEscalations] = useState<RefundEscalation[]>([
    { id: "ESC-001", refundId: "REF-060", customerId: "C001", customerName: "Marcus Tan", sourceId: "SUB-001", amount: 210, reason: "Partial refund dispute on a mid-week plan cancellation requires Super Admin review.", raisedBy: "Finance Team", assignedTo: "Jerome Lim", status: "Open", createdAt: "13 Sep 2024" },
  ]);
  const [outcomeNotifications, setOutcomeNotifications] = useState<OperationalNotification[]>(() => readStoredState("pm-workflow-notifications", []));
  const [notificationUnreadCount, setNotificationUnreadCount] = useState(5);
  const [accessRequests, setAccessRequests] = useState<AccessRequest[]>(() => readStoredState("pm-access-requests", []));
  const [reportedAttentionCounts, setReportedAttentionCounts] = useState<Record<string, number>>({});
  const isNearCutoff = checkNearCutoff();

  const reportAttentionCount = useCallback((sectionId: Section, scope: BusinessStream | "shared", count: number) => {
    const key = `${scope}:${sectionId}`;
    setReportedAttentionCounts(current => current[key] === count ? current : { ...current, [key]: count });
  }, []);

  useEffect(() => {
    window.localStorage.setItem("pm-access-users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    window.localStorage.setItem("pm-access-requests", JSON.stringify(accessRequests));
  }, [accessRequests]);

  useEffect(() => {
    window.localStorage.setItem("pm-workflow-notifications", JSON.stringify(outcomeNotifications));
  }, [outcomeNotifications]);

  useEffect(() => {
    const scheduled = accessRequests
      .filter(request => request.status === "Approved" && request.expiresAt)
      .sort((a, b) => new Date(a.expiresAt!).getTime() - new Date(b.expiresAt!).getTime());
    const nextRequest = scheduled[0];
    if (!nextRequest) return;

    const expireDueRequests = () => {
      const now = Date.now();
      const due = accessRequests.filter(request =>
        request.status === "Approved" &&
        request.expiresAt &&
        new Date(request.expiresAt).getTime() <= now
      );
      if (!due.length) return;
      const restoreUser = (user: UserAccount) => {
        const latestDueRequest = due.filter(request => request.requestedById === user.id).at(-1);
        if (!latestDueRequest?.originalPermissions || !latestDueRequest.originalDepartmentAssignments) return user;
        return {
          ...user,
          permissions: latestDueRequest.originalPermissions,
          modulePermissions: latestDueRequest.originalModulePermissions,
          departmentAssignments: latestDueRequest.originalDepartmentAssignments,
        };
      };
      setUsers(current => current.map(restoreUser));
      setCurrentUser(current => current ? restoreUser(current) : null);
      setAccessRequests(current => current.map(request =>
        due.some(item => item.id === request.id) ? { ...request, status: "Expired" } : request
      ));
      setOutcomeNotifications(current => [
        ...due.map<OperationalNotification>(request => ({
          id: `ACCESS-EXPIRED-${request.id}`,
          type: "access-request",
          message: `${request.duration} access for ${request.moduleLabel ?? `${request.targetDepartment} — ${request.targetRole}`} has expired. Your original access has been restored.`,
          department: request.targetDepartment,
          channel: "Admin",
          ts: "Just now",
          read: false,
          severity: "warning",
          recipientId: request.requestedById,
          accessRequestId: request.id,
        })),
        ...current,
      ]);
    };

    let timer: number;
    const scheduleExpiryCheck = () => {
      const remaining = new Date(nextRequest.expiresAt!).getTime() - Date.now();
      timer = window.setTimeout(() => {
        if (remaining <= 2_147_000_000) expireDueRequests();
        else scheduleExpiryCheck();
      }, Math.max(0, Math.min(remaining, 2_147_000_000)));
    };
    scheduleExpiryCheck();
    return () => window.clearTimeout(timer);
  }, [accessRequests]);

  const selectTheme = (nextTheme: Theme) => {
    setTheme(nextTheme);
    window.localStorage.setItem("pm-admin-theme", nextTheme);
  };

  const goToSettings = (tab: string) => {
    setSettingsTab(tab);
    setSection("settings");
    setProfileMenuOpen(false);
  };

  if (!currentUser) {
    return (
      <LoginPage
        users={users}
        theme={theme}
        onThemeChange={selectTheme}
        onLogin={user => { setCurrentUser(user); setSection("dashboard"); }}
      />
    );
  }

  const grantedSections = new Set(currentUser.permissions);
  const userInitials = currentUser.name
    .split(" ")
    .map(part => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const createUser = (user: UserAccount) => setUsers(current => [...current, user]);
  const updateUser = (user: UserAccount) => {
    setUsers(current => current.map(account => account.id === user.id ? user : account));
    if (currentUser.id === user.id) setCurrentUser(user);
  };
  const deleteUser = (userId: string) => setUsers(current => current.filter(user => user.id !== userId));
  const createWalletRefund = (refund: Omit<WalletRefund, "id" | "status" | "createdAt">) => {
    setWalletRefunds(current => [{
      ...refund,
      id: `WR-${String(current.length + 1).padStart(4, "0")}`,
      status: "Pending",
      createdAt: "Just now",
    }, ...current]);
  };
  const decideWalletRefund = (refundId: string, status: Exclude<WalletRefundStatus, "Pending">) => {
    setWalletRefunds(current => current.map(refund => refund.id === refundId ? { ...refund, status } : refund));
  };
  const createRefundEscalation = (matter: Omit<RefundEscalation, "id" | "status" | "createdAt" | "assignedTo">) => {
    setRefundEscalations(current => {
      if (current.some(item => item.refundId === matter.refundId && item.status !== "Approved" && item.status !== "Rejected")) return current;
      return [{
        ...matter,
        id: `ESC-${String(current.length + 1).padStart(3, "0")}`,
        assignedTo: "Jerome Lim",
        status: "Open",
        createdAt: "Just now",
      }, ...current];
    });
  };
  const updateEscalationStatus = (id: string, status: EscalationStatus) => {
    const escalation = refundEscalations.find(item => item.id === id);
    setRefundEscalations(current => current.map(item => item.id === id ? {
      ...item,
      status,
      ...(status === "Approved" || status === "Rejected" ? {
        decidedBy: currentUser.name,
        decidedAt: "Just now",
        outcomeSummary: status === "Approved"
          ? `Refund outcome approved by ${currentUser.name}. Proceed with the approved wallet refund and point reversal.`
          : `Refund outcome rejected by ${currentUser.name}. No wallet credit should be issued.`,
        notifiedDepartments: ["Marketing", "Sales", "Customer Support"],
        customerEmailSent: true,
      } : {}),
    } : item));
    if (!escalation || (status !== "Approved" && status !== "Rejected") || escalation.status === status) return;
    const outcome = status === "Approved" ? "approved" : "rejected";
    const baseId = Date.now();
    setOutcomeNotifications(current => [
      {
        id: `OUT-${baseId}-M`,
        type: "escalation-outcome",
        message: `${escalation.refundId} ${outcome} by ${currentUser.name}. Coordinate the approved refund outcome and customer-facing resolution.`,
        customer: escalation.customerName,
        department: "Marketing",
        channel: "Admin",
        ts: "Just now",
        read: false,
        severity: status === "Approved" ? "info" : "warning",
      },
      {
        id: `OUT-${baseId}-SA`,
        type: "escalation-outcome",
        message: `${escalation.refundId} ${outcome}. Complete the refund workflow and update the sales record.`,
        customer: escalation.customerName,
        department: "Sales",
        channel: "Admin",
        ts: "Just now",
        read: false,
        severity: "info",
      },
      {
        id: `OUT-${baseId}-S`,
        type: "escalation-outcome",
        message: `${escalation.refundId} ${outcome}. Contact ${escalation.customerName} and record the support follow-up.`,
        customer: escalation.customerName,
        department: "Customer Support",
        channel: "Admin",
        ts: "Just now",
        read: false,
        severity: "info",
      },
      {
        id: `OUT-${baseId}-C`,
        type: "escalation-outcome",
        message: `Outcome email sent to ${escalation.customerName}: refund request ${escalation.refundId} was ${outcome}.`,
        customer: escalation.customerName,
        department: "Customer",
        channel: "Email",
        ts: "Just now",
        read: false,
        severity: "info",
      },
      ...current,
    ]);
    setNotificationUnreadCount(current => current + 4);
  };
  const createAccessRequest = (request: Omit<AccessRequest, "id" | "status" | "requestedAt">) => {
    const requestId = `PR-${Date.now().toString().slice(-6)}`;
    setAccessRequests(current => [{
      ...request,
      id: requestId,
      status: "Pending",
      requestedAt: "Just now",
    }, ...current]);
    const requestedAccess = request.moduleLabel
      ? `${request.moduleLabel} (${(request.permissions ?? ["View"]).join(", ")})`
      : `${request.targetDepartment} — ${request.targetRole}`;
    setOutcomeNotifications(current => [
      ...users.filter(user => user.role === "Super Admin").map<OperationalNotification>(admin => ({
        id: `ACCESS-SUBMITTED-${requestId}-${admin.id}`,
        type: "access-request",
        message: `${request.requestedBy} requested ${requestedAccess} access for ${request.duration}.`,
        department: request.targetDepartment,
        channel: "Admin",
        ts: "Just now",
        read: false,
        severity: "info",
        recipientId: admin.id,
        accessRequestId: requestId,
      })),
      ...current,
    ]);
  };
  const decideAccessRequest = (requestId: string, status: "Approved" | "Rejected") => {
    if (currentUser.role !== "Super Admin") return;
    const request = accessRequests.find(item => item.id === requestId);
    if (!request || request.status !== "Pending") return;
    const durationMs: Partial<Record<AccessRequest["duration"], number>> = {
      "24 hours": 24 * 60 * 60 * 1000,
      "1 week": 7 * 24 * 60 * 60 * 1000,
      "1 month": 30 * 24 * 60 * 60 * 1000,
    };
    const expiresIn = status === "Approved" ? durationMs[request.duration] : undefined;
    const expiresAt = expiresIn ? new Date(Date.now() + expiresIn) : undefined;
    const originalUser = users.find(user => user.id === request.requestedById);
    setAccessRequests(current => current.map(item => item.id === requestId ? {
      ...item,
      status,
      decidedBy: currentUser.name,
      decidedAt: "Just now",
      ...(expiresAt ? { expiresAt: expiresAt.toISOString() } : {}),
      ...(status === "Approved" && originalUser ? {
        originalPermissions: originalUser.permissions,
        originalModulePermissions: originalUser.modulePermissions,
        originalDepartmentAssignments: originalUser.departmentAssignments,
      } : {}),
    } : item));
    const requestedAccess = request.moduleLabel
      ? `${request.moduleLabel} (${(request.permissions ?? ["View"]).join(", ")})`
      : `${request.targetDepartment} — ${request.targetRole}`;
    setOutcomeNotifications(current => [{
      id: `ACCESS-${status.toUpperCase()}-${requestId}`,
      type: "access-request",
      message: status === "Approved"
        ? `${requestedAccess} access was approved by ${currentUser.name} for ${request.duration}.`
        : `${requestedAccess} access was rejected by ${currentUser.name}.`,
      department: request.targetDepartment,
      channel: "Admin",
      ts: "Just now",
      read: false,
      severity: status === "Approved" ? "info" : "warning",
      recipientId: request.requestedById,
      accessRequestId: requestId,
    }, ...current]);
    if (status !== "Approved") return;
    setUsers(current => current.map(user => {
      if (user.id !== request.requestedById) return user;
      if (request.requestType === "Module Permission" && request.moduleId) {
        const approvedPermissions = request.permissions ?? ["View"];
        return {
          ...user,
          permissions: [...new Set([...user.permissions, request.moduleId])],
          modulePermissions: {
            ...(user.modulePermissions ?? {}),
            [request.moduleId]: [...new Set([...(user.modulePermissions?.[request.moduleId] ?? []), ...approvedPermissions])],
          },
        };
      }
      if (request.requestType === "Department Role" && request.targetDepartment && request.targetRole) {
        const assignments = user.departmentAssignments.some(item => item.department === request.targetDepartment)
          ? user.departmentAssignments.map(item => item.department === request.targetDepartment ? { department: request.targetDepartment!, role: request.targetRole! } : item)
          : [...user.departmentAssignments, { department: request.targetDepartment, role: request.targetRole }];
        const permissions = [...new Set(assignments.flatMap(item => rolePermissions[item.role] ?? []))];
        return {
          ...user,
          departmentAssignments: assignments,
          permissions,
          modulePermissions: {
            ...(user.modulePermissions ?? {}),
            ...Object.fromEntries(permissions.map(module => [module, [...modulePermissionOptions]])),
          },
        };
      }
      return user;
    }));
  };

  const isMealPlans = stream === "meal-plans";
  const isReadySeries = stream === "ready-series";
  const isOtherSales = stream === "other-sales";
  const streamAccent = isMealPlans ? "#E85D04" : isReadySeries ? "#F5B300" : "var(--pm-text-secondary)";
  const isShared = sharedSections.includes(section);
  const pendingCountForSection = (sectionId: Section) => {
    if (sectionId === "escalations") return refundEscalations.filter(item => item.status === "Open" || item.status === "In Progress").length;
    if (sectionId === "notifications") return notificationUnreadCount;
    if (sectionId === "acl" && currentUser.role === "Super Admin") return accessRequests.filter(item => item.status === "Pending").length;
    if (sectionId === "settings" && currentUser.role !== "Super Admin") return accessRequests.filter(item => item.status === "Pending" && item.requestedById === currentUser.id).length;
    const scope = ["orders", "kitchen", "finance"].includes(sectionId) ? stream : "shared";
    const reportedCount = reportedAttentionCounts[`${scope}:${sectionId}`];
    if (reportedCount !== undefined) return reportedCount;
    if (sectionId === "refunds") {
      const storedRefunds = readStoredState("pm-refunds-workflow", refundHistory);
      return walletRefunds.filter(item => item.status === "Pending").length + storedRefunds.filter(item => item.status === "pending").length;
    }
    return baselineAttentionCount(sectionId, stream);
  };

  const handleStreamSwitch = (newStream: BusinessStream) => {
    setStream(newStream);
    setStreamDropdownOpen(false);
    if (newStream === "other-sales") {
      setSection("dashboard");
    } else if (newStream === "ready-series" && ["menu-review", "menu-planning", "fulfillment", "pause-management", "billing-cycles", "subscriber-profile", "subscriptions"].includes(section)) {
      setSection("subscriptions");
    }
  };

  const toggleGroup = (group: string) => {
    setCollapsedGroups(prev => {
      const next = new Set(prev);
      if (next.has(group)) next.delete(group);
      else next.add(group);
      return next;
    });
  };

  return (
    <div
      className="pm-light-shell flex h-screen overflow-hidden"
      data-theme={theme}
      data-stream={stream}
      style={{ background: "var(--pm-bg)", color: "var(--pm-text)" }}
      onClick={() => { setStreamDropdownOpen(false); setProfileMenuOpen(false); }}
    >
      {/* Mobile nav overlay */}
      {mobileNavOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 lg:hidden"
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <aside
        className={`pm-admin-sidebar flex-shrink-0 flex flex-col transition-all duration-200 fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto ${mobileNavOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        style={{ width: collapsed ? 52 : 236, background: "var(--pm-surface)", borderRight: "1px solid var(--pm-border)" }}
      >
        {/* Brand logo area */}
        <div className="relative" style={{ borderBottom: "1px solid var(--pm-border)" }}>
          <div className="flex items-center justify-between px-3 pt-3 pb-1 gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); setStreamDropdownOpen(o => !o); }}
              className="flex items-center gap-2 flex-1 min-w-0 text-left"
              title="Switch business unit"
            >
              <PerformanceMealsLogo collapsed={collapsed} />
            </button>
            <button
              onClick={() => setCollapsed(c => !c)}
              className="flex-shrink-0 w-5 h-5 flex items-center justify-center transition-opacity opacity-30 hover:opacity-70"
              title="Toggle sidebar"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                {collapsed
                  ? <path d="M3.5 2l4 4-4 4" stroke="var(--pm-text)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  : <path d="M8.5 2l-4 4 4 4" stroke="var(--pm-text)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                }
              </svg>
            </button>
          </div>

          {/* Stream badge — clickable dropdown trigger */}
          {!collapsed && (
            <button
              onClick={(e) => { e.stopPropagation(); setStreamDropdownOpen(o => !o); }}
              className="w-full px-3 pt-1 pb-2.5 flex items-center justify-between group"
            >
              <div className="flex-1 min-w-0">
                {isMealPlans ? <MealPlanBadge /> : isReadySeries ? <ReadySeriesBadge /> : <OtherSalesBadge />}
              </div>
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none" className="flex-shrink-0 ml-2 opacity-40 group-hover:opacity-80 transition-opacity">
                <path d="M2 4l3.5 3.5L9 4" stroke="var(--pm-text)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}

          {/* Stream dropdown */}
          {streamDropdownOpen && (
            <div
              className="absolute top-full left-0 z-50 w-full shadow-2xl"
              style={{ background: "var(--pm-surface)", border: "1px solid var(--pm-border-strong)", borderTop: "none" }}
              onClick={e => e.stopPropagation()}
            >
              <div className="px-3 py-2" style={{ borderBottom: "1px solid var(--pm-surface-muted)" }}>
                <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 8.5, letterSpacing: "0.2em", color: "var(--pm-text-muted)" }}>
                  SWITCH BUSINESS UNIT
                </span>
              </div>

              {/* Meal Plan */}
              <button
                onClick={() => handleStreamSwitch("meal-plans")}
                className="w-full px-3 py-3 flex items-center gap-3 text-left transition-colors hover:bg-[var(--pm-surface-subtle)]"
                style={{ background: isMealPlans ? "var(--pm-active)" : "transparent" }}
              >
                <div style={{ width: 2, alignSelf: "stretch", background: "#E85D04", flexShrink: 0 }} />
                <div className="flex-1 min-w-0">
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 11.5, color: "var(--pm-text)", letterSpacing: "0.06em" }}>MEAL PLAN</div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 9.5, color: "var(--pm-text-muted)", marginTop: 2 }}>Subscriptions · Menu · Billing</div>
                </div>
                {isMealPlans && (
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                    <path d="M1.5 5.5l3 3 5-5" stroke="#E85D04" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>

              {/* Ready-Series */}
              <button
                onClick={() => handleStreamSwitch("ready-series")}
                className="w-full px-3 py-3 flex items-center gap-3 text-left transition-colors hover:bg-[var(--pm-surface-subtle)]"
                style={{ background: isReadySeries ? "var(--pm-active)" : "transparent", borderTop: "1px solid var(--pm-surface-muted)" }}
              >
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none" className="flex-shrink-0 ml-px">
                  <circle cx="4" cy="4" r="4" fill="#F5B300" />
                </svg>
                <div className="flex-1 min-w-0">
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 11.5, color: "var(--pm-text)", letterSpacing: "0.06em" }}>READY-SERIES</div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 9.5, color: "var(--pm-text-muted)", marginTop: 2 }}>Subscriptions · A-la-carte · Bundles</div>
                </div>
                {isReadySeries && (
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                    <path d="M1.5 5.5l3 3 5-5" stroke="#F5B300" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>

              {/* Other Sales */}
              <button
                onClick={() => handleStreamSwitch("other-sales")}
                className="w-full px-3 py-3 flex items-center gap-3 text-left transition-colors hover:bg-[var(--pm-surface-subtle)]"
                style={{ background: isOtherSales ? "var(--pm-active)" : "transparent", borderTop: "1px solid var(--pm-surface-muted)" }}
              >
                <div className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-[var(--pm-surface-muted)] text-[9px] font-extrabold text-[var(--pm-text-secondary)]">$</div>
                <div className="flex-1 min-w-0">
                  <div className="text-[11.5px] font-extrabold tracking-[0.06em] text-[var(--pm-text)]">OTHER SALES</div>
                  <div className="mt-0.5 text-[9.5px] text-[var(--pm-text-muted)]">Wallet Top-Ups · Gift Cards</div>
                </div>
                {isOtherSales && (
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                    <path d="M1.5 5.5l3 3 5-5" stroke="var(--pm-text-secondary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            </div>
          )}
        </div>

        {/* ── Nav ─────────────────────────────────────────────────────── */}
        <nav className="flex-1 overflow-y-auto py-2">
          {navGroups.map(g => {
            const visibleItems = g.items.filter(item => {
              if (isOtherSales && !otherSalesSections.has(item.id)) return false;
              if (item.streamOnly && item.streamOnly !== stream) return false;
              return currentUser.role === "Super Admin" || grantedSections.has(item.id);
            });
            if (visibleItems.length === 0) return null;
            const isGCollapsed = collapsedGroups.has(g.group);
            const groupPendingCount = visibleItems.reduce((sum, item) => sum + pendingCountForSection(item.id), 0);
            return (
              <div key={g.group} className="mb-1">
                {!collapsed && (
                  <button
                    onClick={() => toggleGroup(g.group)}
                    className="w-full flex items-center justify-between px-3 py-1 group"
                  >
                    <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 9, letterSpacing: "0.18em", color: "var(--pm-text)" }}>
                      {g.group.toUpperCase()}
                    </span>
                    <span className="flex items-center gap-1.5">
                      {groupPendingCount > 0 && (
                        <span className="min-w-4 bg-[#F5B300] px-1.5 py-0.5 text-center text-[9px] font-extrabold text-[#111827] mono">
                          {groupPendingCount}
                        </span>
                      )}
                      <span
                        className="flex items-center justify-center transition-all duration-150"
                        style={{
                          width: 16, height: 16,
                          background: isGCollapsed ? "var(--pm-border)" : "transparent",
                          border: isGCollapsed ? "1px solid var(--pm-border-strong)" : "1px solid transparent",
                          color: "var(--pm-text-muted)",
                          transform: isGCollapsed ? "rotate(-90deg)" : "rotate(0deg)",
                        }}
                      >
                        <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                          <path d="M1.5 3l3 3 3-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                    </span>
                  </button>
                )}

                {!isGCollapsed && visibleItems.map(item => {
                  const active = section === item.id;
                  const isItemShared = sharedSections.includes(item.id);
                  const accent = isItemShared ? "var(--pm-text-muted)" : streamAccent;
                  const pendingCount = pendingCountForSection(item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => { setSection(item.id); setMobileNavOpen(false); }}
                      className="relative w-full flex items-center gap-2.5 px-3 py-2 transition-colors border-l-2 group"
                      style={active
                        ? { borderLeftColor: item.deferred ? "var(--pm-text-muted)" : accent, background: "var(--pm-active)", color: item.deferred ? "var(--pm-text-muted)" : accent }
                        : { borderLeftColor: "transparent", color: "var(--pm-text-muted)" }
                      }
                      title={collapsed ? `${item.label}${pendingCount > 0 ? ` · ${pendingCount} pending` : ""}` : undefined}
                      aria-label={`${item.label}${pendingCount > 0 ? `, ${pendingCount} pending tasks` : ""}`}
                    >
                      <span className="mono flex-shrink-0 w-4 text-center text-[13px]" style={{ opacity: active ? 1 : item.deferred ? 0.3 : 0.5 }}>{item.icon}</span>
                      {collapsed && pendingCount > 0 && (
                        <span className="absolute right-0.5 top-0.5 min-w-3.5 rounded-full bg-[#F5B300] px-1 py-0.5 text-center text-[8px] font-extrabold leading-none text-[#111827] mono">
                          {pendingCount}
                        </span>
                      )}
                      {!collapsed && (
                        <span className="flex-1 flex items-center gap-1.5" style={{ fontFamily: "'Inter', sans-serif", fontWeight: active ? 600 : 400, fontSize: 12.5, color: active ? (item.deferred ? "var(--pm-text-muted)" : accent) : item.deferred ? "var(--pm-text-muted)" : "var(--pm-text-secondary)" }}>
                          {item.label}
                          {pendingCount > 0 && (
                            <span className="ml-auto bg-[#F5B300] px-1.5 py-0.5 text-[9px] font-extrabold text-[#111827] mono">
                              {pendingCount}
                            </span>
                          )}
                          {item.deferred && (
                            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 7.5, letterSpacing: "0.1em", color: "var(--pm-text-muted)", background: "var(--pm-surface-muted)", border: "1px solid var(--pm-border-strong)", padding: "1px 4px", flexShrink: 0 }}>
                              DEFERRED
                            </span>
                          )}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </nav>

        {/* User strip */}
        <div className="relative px-3 py-3" style={{ borderTop: "1px solid var(--pm-surface-muted)" }}>

          {/* Profile popup — above the strip */}
          {profileMenuOpen && (
            <div
              className="absolute bottom-full left-0 right-0 mb-1 shadow-2xl z-50"
              style={{ background: "var(--pm-surface)", border: "1px solid var(--pm-border-strong)" }}
              onClick={e => e.stopPropagation()}
            >
              {/* User header inside popup */}
              <div className="px-3 py-3 border-b border-[var(--pm-border)] flex items-center gap-2.5">
                <div className="w-8 h-8 flex items-center justify-center text-black font-bold text-sm flex-shrink-0" style={{ background: "#F5B300", fontFamily: "'Outfit', sans-serif" }}>{userInitials}</div>
                <div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 13, color: "var(--pm-text)" }}>{currentUser.name}</div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: streamAccent, letterSpacing: "0.06em" }}>{currentUser.role} · {currentUser.department}</div>
                </div>
              </div>

              {/* Menu items */}
              {[
                { icon: "◎", label: "My Profile",         sub: "Name, role, contact",       action: () => goToSettings("profile") },
                { icon: "⊛", label: "Change Password",    sub: "Security & email settings",  action: () => goToSettings("security") },
                { icon: "◇", label: "Notifications",      sub: "Alerts & preferences",       action: () => goToSettings("notifications") },
                { icon: "⚙", label: "System Settings",    sub: "App config & business rules", action: () => goToSettings("system") },
              ]
                .filter(item => item.label !== "System Settings" || currentUser.role === "Super Admin")
                .map(item => (
                <button
                  key={item.label}
                  onClick={item.action}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-[var(--pm-surface-muted)]"
                >
                  <span className="mono text-base w-5 text-center flex-shrink-0" style={{ color: "var(--pm-text-muted)" }}>{item.icon}</span>
                  <div className="min-w-0">
                    <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: 12, color: "var(--pm-text)" }}>{item.label}</div>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: "var(--pm-text-muted)", marginTop: 1 }}>{item.sub}</div>
                  </div>
                </button>
              ))}

              {/* Sign out */}
              <div style={{ borderTop: "1px solid var(--pm-border)" }}>
                <button
                  onClick={() => { setProfileMenuOpen(false); setCurrentUser(null); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-[#FEF3F2]"
                >
                  <span className="mono text-base w-5 text-center flex-shrink-0" style={{ color: "#EF4444" }}>↩</span>
                  <div>
                    <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: 12, color: "#EF4444" }}>Sign Out</div>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: "#B42318", marginTop: 1 }}>End your session</div>
                  </div>
                </button>
              </div>
            </div>
          )}

          <button
            onClick={(e) => { e.stopPropagation(); setProfileMenuOpen(o => !o); }}
            className="w-full transition-colors hover:bg-[var(--pm-surface-subtle)] rounded px-1 py-1 -mx-1"
          >
            {!collapsed ? (
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 flex-shrink-0 flex items-center justify-center text-black font-bold text-xs" style={{ background: "#F5B300", fontFamily: "'Outfit', sans-serif" }}>{userInitials}</div>
                <div className="flex-1 min-w-0 text-left">
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: 12, color: "var(--pm-text)" }}>{currentUser.name}</div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: streamAccent, letterSpacing: "0.08em" }}>{currentUser.role}</div>
                </div>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ color: "var(--pm-text-muted)", flexShrink: 0 }}>
                  <path d="M2 6.5l3-3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            ) : (
              <div className="w-7 h-7 mx-auto flex items-center justify-center text-black font-bold text-xs" style={{ background: "#F5B300", fontFamily: "'Outfit', sans-serif" }}>{userInitials}</div>
            )}
          </button>
        </div>
      </aside>

      {/* ── Main ────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden lg:ml-0">

        {/* Top bar */}
        <header
          className="pm-admin-header flex-shrink-0 px-3 sm:px-5 flex items-center justify-between gap-2 sm:gap-4"
          style={{ minHeight: 56, background: "var(--pm-surface)", borderBottom: "1px solid var(--pm-border)" }}
        >
          {/* Hamburger — mobile only */}
          <button
            className="lg:hidden flex-shrink-0 w-8 h-8 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity"
            onClick={(e) => { e.stopPropagation(); setMobileNavOpen(o => !o); }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 4h12M2 8h12M2 12h12" stroke="var(--pm-text)" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>

          {/* Left: title + stream tag */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <h1
              className="truncate"
              style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 14, color: "var(--pm-text)", letterSpacing: "0.01em" }}
            >
              {sectionTitles[section]}
            </h1>

            {isShared ? (
              <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: "0.16em", color: "var(--pm-text-muted)", border: "1px solid var(--pm-border)", padding: "2px 6px" }}>
                SHARED
              </span>
            ) : (
              <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: "0.16em", color: streamAccent, borderLeft: `2px solid ${streamAccent}`, paddingLeft: 7 }}>
                {isMealPlans ? "MEAL PLAN" : isReadySeries ? "READY-SERIES" : "OTHER SALES"}
              </span>
            )}

            {isNearCutoff && ["dashboard", "subscriptions", "menu-review", "menu-planning"].includes(section) && (
              <span className="animate-pulse" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", color: theme === "dark" ? "#F5B300" : "#B54708", background: theme === "dark" ? "#1A1500" : "#FFFAEB", border: `1px solid ${theme === "dark" ? "#3D3000" : "#FEDF89"}`, padding: "2px 7px" }}>
                SWAP CUTOFF SOON
              </span>
            )}
          </div>

          {/* Right: signed-in identity, theme, and business stream */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {!isOtherSales && (
              <button
                onClick={() => setSection("catalog")}
                className="hidden border border-[#F5B300]/50 bg-[#F5B300]/10 px-3 py-2 text-xs font-bold text-[var(--pm-accent-text)] transition-colors hover:bg-[#F5B300]/20 lg:block"
              >
                {isMealPlans ? "+ Create Meal Plan" : "+ Create Ready Series Item"}
              </button>
            )}
            <div
              className="flex max-w-44 items-center gap-2 rounded-lg border px-2 py-1.5"
              style={{ background: "var(--pm-surface-subtle)", borderColor: "var(--pm-border)" }}
              title={`${currentUser.name} · ${currentUser.role} · ${currentUser.department}`}
            >
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-[#F5B300] text-[10px] font-extrabold text-[#111827]">
                {userInitials}
              </div>
              <div className="min-w-0">
                <div className="truncate text-xs font-bold" style={{ color: "var(--pm-text)" }}>{currentUser.name}</div>
                <div className="hidden truncate text-[9px] sm:block" style={{ color: "var(--pm-text-muted)" }}>{currentUser.role}</div>
              </div>
            </div>

            {/* Customer theme preference */}
            <div
              className="theme-switch flex items-center rounded-lg p-0.5"
              style={{ background: "var(--pm-surface-muted)", border: "1px solid var(--pm-border)" }}
              aria-label="Color theme"
            >
              <button
                onClick={() => selectTheme("light")}
                aria-pressed={theme === "light"}
                title="Use light theme"
                className="flex h-7 items-center gap-1.5 rounded-md px-2 transition-all"
                style={{
                  background: theme === "light" ? "var(--pm-surface)" : "transparent",
                  color: theme === "light" ? "var(--pm-text)" : "var(--pm-text-muted)",
                  boxShadow: theme === "light" ? "0 1px 2px rgba(16, 24, 40, 0.10)" : "none",
                }}
              >
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M8 1.5v1.25M8 13.25v1.25M1.5 8h1.25M13.25 8h1.25M3.4 3.4l.9.9M11.7 11.7l.9.9M12.6 3.4l-.9.9M4.3 11.7l-.9.9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <span className="hidden 2xl:inline text-[10px] font-semibold">Light</span>
              </button>
              <button
                onClick={() => selectTheme("dark")}
                aria-pressed={theme === "dark"}
                title="Use dark theme"
                className="flex h-7 items-center gap-1.5 rounded-md px-2 transition-all"
                style={{
                  background: theme === "dark" ? "var(--pm-surface)" : "transparent",
                  color: theme === "dark" ? "var(--pm-text)" : "var(--pm-text-muted)",
                  boxShadow: theme === "dark" ? "0 1px 2px rgba(0, 0, 0, 0.35)" : "none",
                }}
              >
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M13.25 10.25A5.75 5.75 0 015.75 2.75a5.76 5.76 0 107.5 7.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                </svg>
                <span className="hidden 2xl:inline text-[10px] font-semibold">Dark</span>
              </button>
            </div>

            {/* Stream toggle */}
            <div className="hidden items-center overflow-hidden md:flex" style={{ height: 26, border: "1px solid var(--pm-border)", borderRadius: 8 }}>
              <button
                onClick={() => handleStreamSwitch("meal-plans")}
                className="px-3 h-full flex items-center transition-all rounded-none"
                style={isMealPlans
                  ? { background: "#E85D04", fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 9.5, letterSpacing: "0.1em", color: "#fff" }
                  : { fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 9.5, letterSpacing: "0.1em", color: "var(--pm-text-muted)" }
                }
              >
                MEAL PLAN
              </button>
              <div className="h-full" style={{ width: 1, background: "var(--pm-border)" }} />
              <button
                onClick={() => handleStreamSwitch("ready-series")}
                className="px-3 h-full flex items-center transition-all rounded-none"
                style={isReadySeries
                  ? { background: "#F5B300", fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 9.5, letterSpacing: "0.1em", color: "var(--pm-text)" }
                  : { fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 9.5, letterSpacing: "0.1em", color: "var(--pm-text-muted)" }
                }
              >
                READY-SERIES
              </button>
              <div className="h-full" style={{ width: 1, background: "var(--pm-border)" }} />
              <button
                onClick={() => handleStreamSwitch("other-sales")}
                className="px-3 h-full flex items-center transition-all rounded-none"
                style={isOtherSales
                  ? { background: "var(--pm-text)", fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 9.5, letterSpacing: "0.1em", color: "var(--pm-bg)" }
                  : { fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 9.5, letterSpacing: "0.1em", color: "var(--pm-text-muted)" }
                }
              >
                OTHER SALES
              </button>
            </div>
          </div>
        </header>

        {/* Shopify system-of-record banner for commerce-adjacent sections */}
        {["orders", "wallet", "finance", "customers", "catalog"].includes(section) && (
          <div className="flex-shrink-0 px-5 py-1.5 flex items-center gap-2" style={{ background: theme === "dark" ? "#0A0A0A" : "#F6FEF9", borderBottom: "1px solid var(--pm-surface-muted)" }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8.5, color: theme === "dark" ? "#66A566" : "#3A6B3A", letterSpacing: "0.06em" }}>◈ SHOPIFY</span>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: "var(--pm-text-muted)" }}>
              Shopify is the commerce system of record — orders, payments, products &amp; refund execution remain in Shopify. This portal manages Meal Plan &amp; operational workflows.
            </span>
          </div>
        )}

        {/* Deferred section banner */}
        {DEFERRED_HIDDEN.includes(section) && (
          <div className="flex-shrink-0 px-5 py-2 flex items-center gap-3" style={{ background: theme === "dark" ? "#0F0A00" : "#FFFAEB", borderBottom: `1px solid ${theme === "dark" ? "#2A1A00" : "#FEDF89"}` }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8.5, fontWeight: 700, letterSpacing: "0.12em", color: theme === "dark" ? "#D98A22" : "#B54708", background: theme === "dark" ? "#1A1000" : "#FEF0C7", border: `1px solid ${theme === "dark" ? "#3A2A00" : "#FEDF89"}`, padding: "2px 7px" }}>FUTURE / DEFERRED</span>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: theme === "dark" ? "#C98B45" : "#7A2E0E" }}>
              This module is not part of the Phase 1 implementation scope. It is presented as a roadmap reference only.
            </span>
          </div>
        )}

        {/* Section content */}
        <main className="pm-admin-main flex-1 overflow-y-auto">
          {section === "dashboard" && <Dashboard stream={stream} swapAlert={isNearCutoff} theme={theme} onOpenProfile={customerId => {
            setProfileCustomerId(customerId);
            setProfileInitialTab("overview");
            setSection("subscriber-profile");
          }} />}
          {section === "orders" && <Orders stream={stream} focusedOrder={focusedOrder} onPendingCountChange={count => reportAttentionCount("orders", stream, count)} onOpenProfile={customerId => {
            setProfileCustomerId(customerId);
            setProfileInitialTab("overview");
            setSection("subscriber-profile");
          }} onCreateWalletRefund={createWalletRefund} />}
          {section === "delivery" && <Delivery stream={stream} />}
          {section === "print-slips" && <PrintSlips stream={stream} />}
          {section === "customers" && <Customers stream={stream} onOpenProfile={customerId => {
            setProfileCustomerId(customerId);
            setProfileInitialTab("overview");
            setSection("subscriber-profile");
          }} />}
          {section === "subscriptions" && <Subscriptions stream={stream} swapAlert={isNearCutoff} />}
          {section === "menu-review" && <MenuReview onPendingCountChange={count => reportAttentionCount("menu-review", "shared", count)} />}
          {section === "menu-planning" && <MenuPlanning />}
          {section === "kitchen" && <Kitchen stream={stream} onPendingCountChange={count => reportAttentionCount("kitchen", stream, count)} />}
          {section === "kitchen-forecast" && <KitchenForecast />}
          {section === "inventory" && <Inventory onPendingCountChange={count => reportAttentionCount("inventory", "shared", count)} />}
          {section === "procurement" && <Procurement />}
          {section === "packaging" && <Packaging />}
          {section === "dispatch" && <Dispatch onPendingCountChange={count => reportAttentionCount("dispatch", "shared", count)} />}
          {section === "delivery-hub" && <DeliveryHub />}
          {section === "riders" && <Riders />}
          {section === "rider-app" && <RiderApp />}
          {section === "support" && <Support onPendingCountChange={count => reportAttentionCount("support", "shared", count)} />}
          {section === "customer-success" && <CustomerSuccess />}
          {section === "notifications" && <Notifications
            externalNotifications={outcomeNotifications
              .filter(notification => !notification.recipientId || notification.recipientId === currentUser.id)
              .map(notification => notification.type === "access-request" && !notification.accessRequestId
                ? { ...notification, accessRequestId: notification.id.match(/PR-\d+/)?.[0] }
                : notification)}
            onOpenAccessRequest={requestId => {
              if (currentUser.role === "Super Admin") {
                setAclRequestId(requestId);
                setSection("acl");
              } else {
                setSettingsTab("permission-requests");
                setSection("settings");
              }
            }}
            onUnreadCountChange={setNotificationUnreadCount}
          />}
          {section === "marketing" && <Marketing />}
          {section === "wallet" && <Wallet walletRefunds={walletRefunds} />}
          {section === "finance" && <Finance stream={stream} onPendingCountChange={count => reportAttentionCount("finance", stream, count)} />}
          {section === "refunds" && <Refunds
            walletRefunds={walletRefunds}
            onPendingCountChange={count => reportAttentionCount("refunds", "shared", count)}
            onDecideWalletRefund={decideWalletRefund}
            onOpenProfile={customerId => {
              setProfileCustomerId(customerId);
              setProfileInitialTab("overview");
              setSection("subscriber-profile");
            }}
            onOpenOrder={(sourceId, customerName, refundStream) => {
              setStream(refundStream === "Meal Plans" ? "meal-plans" : "ready-series");
              setFocusedOrder({ sourceId, customerName });
              setSection("orders");
            }}
            onEscalate={createRefundEscalation}
          />}
          {section === "reports" && <Reports stream={stream} />}
          {section === "business-intel" && <BusinessIntel />}
          {section === "executive" && <Executive />}
          {section === "acl" && (
            <ACL
              users={users}
              currentUserId={currentUser.id}
              onCreate={createUser}
              onUpdate={updateUser}
              onDelete={deleteUser}
              accessRequests={accessRequests}
              initialRequestId={aclRequestId}
              onSelectRequest={setAclRequestId}
              onDecideAccessRequest={decideAccessRequest}
            />
          )}
          {section === "audit-logs" && <AuditLogs />}
          {section === "business-rules" && <BusinessRules />}
          {section === "whatsapp" && <WhatsApp />}
          {section === "operations-center" && <OperationsCenter />}
          {section === "production-forecast" && <ProductionForecast />}
          {section === "production-board" && <ProductionBoard onPendingCountChange={count => reportAttentionCount("production-board", "shared", count)} />}
          {section === "export-center" && <ExportCenter stream={stream} />}
          {section === "failed-deliveries" && <FailedDeliveries onPendingCountChange={count => reportAttentionCount("failed-deliveries", "shared", count)} />}
          {section === "fulfillment" && <Fulfillment onPendingCountChange={count => reportAttentionCount("fulfillment", "shared", count)} />}
          {section === "pause-management" && <PauseManagement />}
          {section === "billing-cycles" && <BillingCycles />}
          {section === "subscriber-profile" && <CustomerProfile initialCustomerId={profileCustomerId} initialTab={profileInitialTab} walletRefunds={walletRefunds} onCreateWalletRefund={createWalletRefund} />}
          {section === "catalog" && <CatalogCenter stream={stream} />}
          {section === "escalations" && <Escalations
            escalations={refundEscalations}
            onUpdateStatus={updateEscalationStatus}
            onOpenProfile={customerId => {
              setProfileCustomerId(customerId);
              setProfileInitialTab("activity");
              setSection("subscriber-profile");
            }}
            onOpenOrder={(sourceId, customerName) => {
              setStream("meal-plans");
              setFocusedOrder({ sourceId, customerName });
              setSection("orders");
            }}
          />}
          {section === "settings" && <Settings
            initialTab={settingsTab}
            user={currentUser}
            accessRequests={accessRequests}
            onCreateAccessRequest={createAccessRequest}
            onDecideAccessRequest={decideAccessRequest}
          />}
        </main>
      </div>
    </div>
  );
}
