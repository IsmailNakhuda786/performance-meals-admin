import { useState, useRef } from "react";
import PDFExport from "./PDFExport";
import Dashboard from "./sections/Dashboard";
import Orders from "./sections/Orders";
import Delivery from "./sections/Delivery";
import PrintSlips from "./sections/PrintSlips";
import Customers from "./sections/Customers";
import Subscriptions from "./sections/Subscriptions";
import MenuReview from "./sections/MenuReview";
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
import DepartmentLogin from "./sections/DepartmentLogin";
import SubscriberProfile from "./sections/SubscriberProfile";
import Settings from "./sections/Settings";

export type BusinessStream = "meal-plans" | "ready-series";

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
        <div className="leading-none" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: "0.12em", color: "#FFFFFF" }}>
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
        <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 11, color: "#E8E8E8", letterSpacing: "0.04em", lineHeight: 1 }}>
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
        <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 11, color: "#E8E8E8", letterSpacing: "0.04em", lineHeight: 1 }}>
          READY-SERIES
        </div>
        <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: 8.5, color: "#F5B300", letterSpacing: "0.14em", marginTop: 2 }}>
          BY PERFORMANCE MEALS
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
  | "department-login" | "subscriber-profile"
  | "settings";

interface NavItem {
  id: Section;
  label: string;
  icon: string;
  streamOnly?: "meal-plans" | "ready-series";
  deferred?: boolean;
}

// Sections hidden from active nav per Phase D deferred scope.
// CODE IS PRESERVED — sections remain reachable via direct setSection() calls.
const DEFERRED_HIDDEN: Section[] = [
  "procurement", "packaging", "rider-app", "business-rules",
  "executive", "business-intel", "customer-success", "marketing",
  "department-login",
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
      { id: "subscriber-profile", label: "Subscriber Profile", icon: "◎", streamOnly: "meal-plans" },
      { id: "menu-review",        label: "Menu Review",        icon: "☰", streamOnly: "meal-plans" },
      { id: "pause-management",   label: "Pause Management",   icon: "⊟", streamOnly: "meal-plans" },
      { id: "billing-cycles",     label: "Billing Cycles",     icon: "↻", streamOnly: "meal-plans" },
      { id: "fulfillment",        label: "Fulfillment",        icon: "◆", streamOnly: "meal-plans" },
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
  "department-login": "Department Login",
  "subscriber-profile": "Subscriber Profile",
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
  "settings",
];

function checkNearCutoff(): boolean {
  const d = new Date();
  const isThursday = d.getDay() === 4;
  const h = d.getHours();
  const m = d.getMinutes();
  return isThursday && ((h === 11 && m >= 0) || (h === 12 && m < 60));
}

export default function App() {
  const [signedOut, setSignedOut] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  const [section, setSection] = useState<Section>("dashboard");
  const [settingsTab, setSettingsTab] = useState<string>("profile");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [stream, setStream] = useState<BusinessStream>("meal-plans");
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(
    new Set(navGroups.map(g => g.group))
  );
  const [streamDropdownOpen, setStreamDropdownOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  const isNearCutoff = checkNearCutoff();

  const goToSettings = (tab: string) => {
    setSettingsTab(tab);
    setSection("settings");
    setProfileMenuOpen(false);
  };

  const handleLogin = () => {
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setLoginError("Please enter your email and password.");
      return;
    }
    // Demo: any credentials work
    setSignedOut(false);
    setLoginEmail("");
    setLoginPassword("");
    setLoginError("");
    setShowForgot(false);
    setForgotSent(false);
  };

  /* ── Login / Sign-out screen ──────────────────────────────────────── */
  if (signedOut) {
    return (
      <div className="flex h-screen items-center justify-center" style={{ background: "#0D0D0D" }}>
        <div className="w-full max-w-sm mx-4">

          {/* Brand */}
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center gap-3 mb-2">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <circle cx="18" cy="18" r="18" fill="#F5B300" />
              </svg>
              <div>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 18, color: "#FFFFFF", letterSpacing: "0.1em" }}>PERFORMANCE</div>
                <div style={{ height: 2, background: "#F5B300", marginTop: 2 }} />
                <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 500, fontSize: 11, color: "#F5B300", letterSpacing: "0.22em", textAlign: "right" }}>MEALS</div>
              </div>
            </div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#555", marginTop: 4 }}>Admin Portal</div>
          </div>

          {!showForgot ? (
            /* Sign-in form */
            <div style={{ background: "#111", border: "1px solid #222" }}>
              <div className="px-6 py-4" style={{ borderBottom: "1px solid #1E1E1E" }}>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 14, color: "#EFEFEF" }}>Sign in to your account</div>
              </div>
              <div className="px-6 py-5 space-y-4">
                <div>
                  <label style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: "0.16em", color: "#CCCCCC", display: "block", marginBottom: 6 }}>EMAIL ADDRESS</label>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={e => { setLoginEmail(e.target.value); setLoginError(""); }}
                    onKeyDown={e => e.key === "Enter" && handleLogin()}
                    placeholder="jerome@performancemeals.sg"
                    className="w-full px-3 py-2.5 outline-none text-sm"
                    style={{ background: "#0D0D0D", border: "1px solid #2A2A2A", color: "#EFEFEF", fontFamily: "'Inter', sans-serif" }}
                    autoFocus
                  />
                </div>
                <div>
                  <label style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: "0.16em", color: "#CCCCCC", display: "block", marginBottom: 6 }}>PASSWORD</label>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={e => { setLoginPassword(e.target.value); setLoginError(""); }}
                    onKeyDown={e => e.key === "Enter" && handleLogin()}
                    placeholder="••••••••"
                    className="w-full px-3 py-2.5 outline-none text-sm"
                    style={{ background: "#0D0D0D", border: "1px solid #2A2A2A", color: "#EFEFEF", fontFamily: "'Inter', sans-serif" }}
                  />
                </div>

                {loginError && (
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#EF4444", background: "#1A0000", border: "1px solid #3A0000", padding: "8px 12px" }}>
                    {loginError}
                  </div>
                )}

                <button
                  onClick={handleLogin}
                  className="w-full py-2.5 font-extrabold transition-opacity hover:opacity-90"
                  style={{ background: "#F5B300", color: "#000", fontFamily: "'Outfit', sans-serif", fontSize: 12, letterSpacing: "0.12em" }}
                >
                  SIGN IN
                </button>

                <div className="text-center">
                  <button
                    onClick={() => setShowForgot(true)}
                    style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#555" }}
                    className="hover:text-[#888] transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Forgot password form */
            <div style={{ background: "#111", border: "1px solid #222" }}>
              <div className="px-6 py-4" style={{ borderBottom: "1px solid #1E1E1E" }}>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 14, color: "#EFEFEF" }}>Reset your password</div>
              </div>
              <div className="px-6 py-5 space-y-4">
                {!forgotSent ? (
                  <>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#888", lineHeight: 1.6 }}>
                      Enter your admin email address. We'll send a reset link to your inbox.
                    </p>
                    <div>
                      <label style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: "0.16em", color: "#CCCCCC", display: "block", marginBottom: 6 }}>EMAIL ADDRESS</label>
                      <input
                        type="email"
                        value={forgotEmail}
                        onChange={e => setForgotEmail(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && setForgotSent(true)}
                        placeholder="jerome@performancemeals.sg"
                        className="w-full px-3 py-2.5 outline-none text-sm"
                        style={{ background: "#0D0D0D", border: "1px solid #2A2A2A", color: "#EFEFEF", fontFamily: "'Inter', sans-serif" }}
                        autoFocus
                      />
                    </div>
                    <button
                      onClick={() => forgotEmail.trim() && setForgotSent(true)}
                      className="w-full py-2.5 font-extrabold transition-opacity hover:opacity-90"
                      style={{ background: "#E85D04", color: "#fff", fontFamily: "'Outfit', sans-serif", fontSize: 12, letterSpacing: "0.12em" }}
                    >
                      SEND RESET LINK
                    </button>
                  </>
                ) : (
                  <div className="text-center py-4 space-y-3">
                    <div style={{ fontSize: 28 }}>✓</div>
                    <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 14, color: "#22C55E" }}>Reset link sent</div>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#888" }}>
                      Check <span style={{ color: "#EFEFEF" }}>{forgotEmail}</span> for your reset link. Check spam if it doesn't arrive within 2 minutes.
                    </p>
                  </div>
                )}
                <div className="text-center">
                  <button
                    onClick={() => { setShowForgot(false); setForgotSent(false); setForgotEmail(""); }}
                    style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#555" }}
                    className="hover:text-[#888] transition-colors"
                  >
                    ← Back to sign in
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="mt-5 px-4 py-3" style={{ background: "#0D0D0D", border: "1px solid #1E1E1E" }}>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8.5, color: "#3A3A3A", lineHeight: 1.6, textAlign: "center" }}>
              PROTOTYPE DEMO — NOT PRODUCTION AUTHENTICATION<br/>
              Production requires server-side identity, secure session management &amp; access controls.<br/>
              Roles must be derived from authenticated server-side authorization.
            </p>
          </div>
          <div className="text-center mt-4" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "#2A2A2A" }}>
            Performance Meals Admin · KT-ADMIN-01
          </div>
        </div>
      </div>
    );
  }

  const isMealPlans = stream === "meal-plans";
  const streamAccent = isMealPlans ? "#E85D04" : "#F5B300";
  const isShared = sharedSections.includes(section);

  const handleStreamSwitch = (newStream: BusinessStream) => {
    setStream(newStream);
    setStreamDropdownOpen(false);
    if (newStream === "ready-series" && ["menu-review", "menu-planning", "fulfillment", "pause-management", "billing-cycles", "subscriber-profile", "subscriptions"].includes(section)) {
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
      className="flex h-screen overflow-hidden"
      style={{ background: "#0D0D0D", color: "#EFEFEF" }}
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
        className={`flex-shrink-0 flex flex-col transition-all duration-200 fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto ${mobileNavOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        style={{ width: collapsed ? 52 : 236, background: "#090909", borderRight: "1px solid #232323" }}
      >
        {/* Brand logo area */}
        <div className="relative" style={{ borderBottom: "1px solid #1E1E1E" }}>
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
                  ? <path d="M3.5 2l4 4-4 4" stroke="#EFEFEF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  : <path d="M8.5 2l-4 4 4 4" stroke="#EFEFEF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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
                {isMealPlans ? <MealPlanBadge /> : <ReadySeriesBadge />}
              </div>
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none" className="flex-shrink-0 ml-2 opacity-40 group-hover:opacity-80 transition-opacity">
                <path d="M2 4l3.5 3.5L9 4" stroke="#EFEFEF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}

          {/* Stream dropdown */}
          {streamDropdownOpen && (
            <div
              className="absolute top-full left-0 z-50 w-full shadow-2xl"
              style={{ background: "#111", border: "1px solid #2A2A2A", borderTop: "none" }}
              onClick={e => e.stopPropagation()}
            >
              <div className="px-3 py-2" style={{ borderBottom: "1px solid #1A1A1A" }}>
                <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 8.5, letterSpacing: "0.2em", color: "#444" }}>
                  SWITCH BUSINESS UNIT
                </span>
              </div>

              {/* Meal Plan */}
              <button
                onClick={() => handleStreamSwitch("meal-plans")}
                className="w-full px-3 py-3 flex items-center gap-3 text-left transition-colors hover:bg-[#181818]"
                style={{ background: isMealPlans ? "#161616" : "transparent" }}
              >
                <div style={{ width: 2, alignSelf: "stretch", background: "#E85D04", flexShrink: 0 }} />
                <div className="flex-1 min-w-0">
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 11.5, color: "#EFEFEF", letterSpacing: "0.06em" }}>MEAL PLAN</div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 9.5, color: "#555", marginTop: 2 }}>Subscriptions · Menu · Billing</div>
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
                className="w-full px-3 py-3 flex items-center gap-3 text-left transition-colors hover:bg-[#181818]"
                style={{ background: !isMealPlans ? "#161616" : "transparent", borderTop: "1px solid #1A1A1A" }}
              >
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none" className="flex-shrink-0 ml-px">
                  <circle cx="4" cy="4" r="4" fill="#F5B300" />
                </svg>
                <div className="flex-1 min-w-0">
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 11.5, color: "#EFEFEF", letterSpacing: "0.06em" }}>READY-SERIES</div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 9.5, color: "#555", marginTop: 2 }}>Box Subs · Ready-to-Go</div>
                </div>
                {!isMealPlans && (
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                    <path d="M1.5 5.5l3 3 5-5" stroke="#F5B300" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
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
              if (item.streamOnly && item.streamOnly !== stream) return false;
              return true;
            });
            if (visibleItems.length === 0) return null;
            const isGCollapsed = collapsedGroups.has(g.group);
            return (
              <div key={g.group} className="mb-1">
                {!collapsed && (
                  <button
                    onClick={() => toggleGroup(g.group)}
                    className="w-full flex items-center justify-between px-3 py-1 group"
                  >
                    <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 9, letterSpacing: "0.18em", color: "#FFFFFF" }}>
                      {g.group.toUpperCase()}
                    </span>
                    {/* Prominent chevron badge */}
                    <span
                      className="flex items-center justify-center transition-all duration-150"
                      style={{
                        width: 16, height: 16,
                        background: isGCollapsed ? "#1E1E1E" : "transparent",
                        border: isGCollapsed ? "1px solid #2E2E2E" : "1px solid transparent",
                        color: isGCollapsed ? "#888" : "#3A3A3A",
                        transform: isGCollapsed ? "rotate(-90deg)" : "rotate(0deg)",
                      }}
                    >
                      <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                        <path d="M1.5 3l3 3 3-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  </button>
                )}

                {!isGCollapsed && visibleItems.map(item => {
                  const active = section === item.id;
                  const isItemShared = sharedSections.includes(item.id);
                  const accent = isItemShared ? "#666" : streamAccent;
                  return (
                    <button
                      key={item.id}
                      onClick={() => { setSection(item.id); setMobileNavOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 transition-colors border-l-2 group"
                      style={active
                        ? { borderLeftColor: item.deferred ? "#444" : accent, background: "#161616", color: item.deferred ? "#666" : accent }
                        : { borderLeftColor: "transparent", color: "#666" }
                      }
                      title={collapsed ? item.label : undefined}
                    >
                      <span className="mono flex-shrink-0 w-4 text-center text-[13px]" style={{ opacity: active ? 1 : item.deferred ? 0.3 : 0.5 }}>{item.icon}</span>
                      {!collapsed && (
                        <span className="flex-1 flex items-center gap-1.5" style={{ fontFamily: "'Inter', sans-serif", fontWeight: active ? 600 : 400, fontSize: 12.5, color: active ? (item.deferred ? "#555" : accent) : item.deferred ? "#555" : "#C0C0C0" }}>
                          {item.label}
                          {item.deferred && (
                            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 7.5, letterSpacing: "0.1em", color: "#3A3A3A", background: "#1A1A1A", border: "1px solid #2A2A2A", padding: "1px 4px", flexShrink: 0 }}>
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

        {/* Download prototype strip */}
        <div className="px-3 py-2" style={{ borderTop: "1px solid #1A1A1A" }}>
          <a
            href="/performance-meals-admin-prototype.zip"
            download="performance-meals-admin-prototype.zip"
            className="flex items-center gap-2 w-full px-3 py-2 transition-colors hover:bg-[#181818]"
            style={{ textDecoration: "none" }}
            title="Download full prototype source"
          >
            <span style={{ fontSize: 13, color: "#F5B300", flexShrink: 0 }}>⬇</span>
            {!collapsed && (
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11.5, color: "#888", letterSpacing: "0.02em" }}>
                Download Prototype (.zip)
              </span>
            )}
          </a>
        </div>

        {/* User strip */}
        <div className="relative px-3 py-3" style={{ borderTop: "1px solid #1A1A1A" }}>

          {/* Profile popup — above the strip */}
          {profileMenuOpen && (
            <div
              className="absolute bottom-full left-0 right-0 mb-1 shadow-2xl z-50"
              style={{ background: "#111", border: "1px solid #2A2A2A" }}
              onClick={e => e.stopPropagation()}
            >
              {/* User header inside popup */}
              <div className="px-3 py-3 border-b border-[#1E1E1E] flex items-center gap-2.5">
                <div className="w-8 h-8 flex items-center justify-center text-black font-bold text-sm flex-shrink-0" style={{ background: "#F5B300", fontFamily: "'Outfit', sans-serif" }}>J</div>
                <div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 13, color: "#EFEFEF" }}>Jerome Lim</div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: streamAccent, letterSpacing: "0.06em" }}>Super Admin · KT-ADMIN-01</div>
                </div>
              </div>

              {/* Menu items */}
              {[
                { icon: "◎", label: "My Profile",         sub: "Name, role, contact",       action: () => goToSettings("profile") },
                { icon: "⊛", label: "Change Password",    sub: "Security & email settings",  action: () => goToSettings("security") },
                { icon: "◇", label: "Notifications",      sub: "Alerts & preferences",       action: () => goToSettings("notifications") },
                { icon: "⚙", label: "System Settings",    sub: "App config & business rules", action: () => goToSettings("system") },
              ].map(item => (
                <button
                  key={item.label}
                  onClick={item.action}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-[#1A1A1A]"
                >
                  <span className="mono text-base w-5 text-center flex-shrink-0" style={{ color: "#666" }}>{item.icon}</span>
                  <div className="min-w-0">
                    <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: 12, color: "#EFEFEF" }}>{item.label}</div>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: "#555", marginTop: 1 }}>{item.sub}</div>
                  </div>
                </button>
              ))}

              {/* Sign out */}
              <div style={{ borderTop: "1px solid #1E1E1E" }}>
                <button
                  onClick={() => { setProfileMenuOpen(false); setSignedOut(true); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-[#200000]"
                >
                  <span className="mono text-base w-5 text-center flex-shrink-0" style={{ color: "#EF4444" }}>↩</span>
                  <div>
                    <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: 12, color: "#EF4444" }}>Sign Out</div>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: "#5A2222", marginTop: 1 }}>End your session</div>
                  </div>
                </button>
              </div>
            </div>
          )}

          <button
            onClick={(e) => { e.stopPropagation(); setProfileMenuOpen(o => !o); }}
            className="w-full transition-colors hover:bg-[#141414] rounded px-1 py-1 -mx-1"
          >
            {!collapsed ? (
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 flex-shrink-0 flex items-center justify-center text-black font-bold text-xs" style={{ background: "#F5B300", fontFamily: "'Outfit', sans-serif" }}>J</div>
                <div className="flex-1 min-w-0 text-left">
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: 12, color: "#EFEFEF" }}>Jerome</div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: streamAccent, letterSpacing: "0.08em" }}>Super Admin</div>
                </div>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ color: "#444", flexShrink: 0 }}>
                  <path d="M2 6.5l3-3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            ) : (
              <div className="w-7 h-7 mx-auto flex items-center justify-center text-black font-bold text-xs" style={{ background: "#F5B300", fontFamily: "'Outfit', sans-serif" }}>J</div>
            )}
          </button>
        </div>
      </aside>

      {/* ── Main ────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden lg:ml-0">

        {/* Top bar */}
        <header
          className="flex-shrink-0 px-3 sm:px-5 flex items-center justify-between gap-2 sm:gap-4"
          style={{ minHeight: 50, background: "#090909", borderBottom: "1px solid #1E1E1E" }}
        >
          {/* Hamburger — mobile only */}
          <button
            className="lg:hidden flex-shrink-0 w-8 h-8 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity"
            onClick={(e) => { e.stopPropagation(); setMobileNavOpen(o => !o); }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 4h12M2 8h12M2 12h12" stroke="#EFEFEF" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>

          {/* Left: title + stream tag */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <h1
              className="truncate"
              style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 14, color: "#EFEFEF", letterSpacing: "0.01em" }}
            >
              {sectionTitles[section]}
            </h1>

            {isShared ? (
              <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: "0.16em", color: "#3A3A3A", border: "1px solid #252525", padding: "2px 6px" }}>
                SHARED
              </span>
            ) : (
              <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: "0.16em", color: streamAccent, borderLeft: `2px solid ${streamAccent}`, paddingLeft: 7 }}>
                {isMealPlans ? "MEAL PLAN" : "READY-SERIES"}
              </span>
            )}

            {isNearCutoff && ["dashboard", "subscriptions", "menu-review", "menu-planning"].includes(section) && (
              <span className="animate-pulse" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", color: "#F5B300", background: "#1A1500", border: "1px solid #3D3000", padding: "2px 7px" }}>
                SWAP CUTOFF SOON
              </span>
            )}
          </div>

          {/* Right: stream toggle + pdf + date */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Download button — hidden on small screens */}
            <a
              href="/performance-meals-admin-prototype.zip"
              download="performance-meals-admin-prototype.zip"
              className="hidden sm:inline-flex"
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: "#F5B300", color: "#000",
                fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 9.5,
                letterSpacing: "0.1em", textTransform: "uppercase",
                padding: "0 10px", height: 26, textDecoration: "none", flexShrink: 0,
              }}
              title="Download prototype source .zip"
            >
              ⬇ Download .zip
            </a>

            {/* Stream toggle */}
            <div className="flex items-center overflow-hidden" style={{ height: 26, border: "1px solid #252525", borderRadius: 8 }}>
              <button
                onClick={() => handleStreamSwitch("meal-plans")}
                className="px-3 h-full flex items-center transition-all rounded-none"
                style={isMealPlans
                  ? { background: "#E85D04", fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 9.5, letterSpacing: "0.1em", color: "#fff" }
                  : { fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 9.5, letterSpacing: "0.1em", color: "#3A3A3A" }
                }
              >
                MEAL PLAN
              </button>
              <div className="h-full" style={{ width: 1, background: "#252525" }} />
              <button
                onClick={() => handleStreamSwitch("ready-series")}
                className="px-3 h-full flex items-center transition-all rounded-none"
                style={!isMealPlans
                  ? { background: "#F5B300", fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 9.5, letterSpacing: "0.1em", color: "#000" }
                  : { fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 9.5, letterSpacing: "0.1em", color: "#3A3A3A" }
                }
              >
                READY-SERIES
              </button>
            </div>

            <div style={{ width: 1, height: 16, background: "#252525" }} />

            <PDFExport
              setSection={setSection as (s: string) => void}
              setStream={setStream}
              setCapturing={setCapturing}
              mainRef={mainRef}
            />

            <div className="hidden sm:block" style={{ width: 1, height: 16, background: "#252525" }} />

            {/* Date — hidden on small screens */}
            <span className="hidden sm:block" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 600, color: "#B0B0B0", letterSpacing: "0.04em" }}>
              {new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
            </span>

            <div className="hidden md:block" style={{ width: 1, height: 16, background: "#252525" }} />

            <span className="hidden md:block" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#666666", letterSpacing: "0.04em" }}>
              KT-ADMIN-01
            </span>
          </div>
        </header>

        {/* Shopify system-of-record banner for commerce-adjacent sections */}
        {["orders", "refunds", "wallet", "finance", "customers"].includes(section) && (
          <div className="flex-shrink-0 px-5 py-1.5 flex items-center gap-2" style={{ background: "#0A0A0A", borderBottom: "1px solid #1A1A1A" }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8.5, color: "#3A6B3A", letterSpacing: "0.06em" }}>◈ SHOPIFY</span>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: "#3A3A3A" }}>
              Shopify is the commerce system of record — orders, payments, products &amp; refund execution remain in Shopify. This portal manages Meal Plan &amp; operational workflows.
            </span>
          </div>
        )}

        {/* Deferred section banner */}
        {DEFERRED_HIDDEN.includes(section) && (
          <div className="flex-shrink-0 px-5 py-2 flex items-center gap-3" style={{ background: "#0F0A00", borderBottom: "1px solid #2A1A00" }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8.5, fontWeight: 700, letterSpacing: "0.12em", color: "#7A4A00", background: "#1A1000", border: "1px solid #3A2A00", padding: "2px 7px" }}>FUTURE / DEFERRED</span>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#5A3A00" }}>
              This module is not part of the Phase 1 implementation scope. It is presented as a roadmap reference only.
            </span>
          </div>
        )}

        {/* Section content — demoMode=capturing forces modals/panels open for PDF capture */}
        <main ref={mainRef} className="flex-1 overflow-y-auto">
          {section === "dashboard" && <Dashboard stream={stream} swapAlert={isNearCutoff} demoMode={capturing} />}
          {section === "orders" && <Orders stream={stream} demoMode={capturing} />}
          {section === "delivery" && <Delivery stream={stream} demoMode={capturing} />}
          {section === "print-slips" && <PrintSlips stream={stream} demoMode={capturing} />}
          {section === "customers" && <Customers stream={stream} demoMode={capturing} />}
          {section === "subscriptions" && <Subscriptions stream={stream} swapAlert={isNearCutoff} demoMode={capturing} />}
          {section === "menu-review" && <MenuReview demoMode={capturing} />}
          {section === "menu-planning" && <MenuPlanning demoMode={capturing} />}
          {section === "kitchen" && <Kitchen stream={stream} demoMode={capturing} />}
          {section === "kitchen-forecast" && <KitchenForecast demoMode={capturing} />}
          {section === "inventory" && <Inventory demoMode={capturing} />}
          {section === "procurement" && <Procurement demoMode={capturing} />}
          {section === "packaging" && <Packaging demoMode={capturing} />}
          {section === "dispatch" && <Dispatch stream={stream} demoMode={capturing} />}
          {section === "delivery-hub" && <DeliveryHub demoMode={capturing} />}
          {section === "riders" && <Riders demoMode={capturing} />}
          {section === "rider-app" && <RiderApp demoMode={capturing} />}
          {section === "support" && <Support demoMode={capturing} />}
          {section === "customer-success" && <CustomerSuccess demoMode={capturing} />}
          {section === "notifications" && <Notifications demoMode={capturing} />}
          {section === "marketing" && <Marketing demoMode={capturing} />}
          {section === "wallet" && <Wallet demoMode={capturing} />}
          {section === "finance" && <Finance stream={stream} demoMode={capturing} />}
          {section === "refunds" && <Refunds demoMode={capturing} />}
          {section === "reports" && <Reports stream={stream} demoMode={capturing} />}
          {section === "business-intel" && <BusinessIntel demoMode={capturing} />}
          {section === "executive" && <Executive demoMode={capturing} />}
          {section === "acl" && <ACL demoMode={capturing} />}
          {section === "audit-logs" && <AuditLogs demoMode={capturing} />}
          {section === "business-rules" && <BusinessRules demoMode={capturing} />}
          {section === "whatsapp" && <WhatsApp demoMode={capturing} />}
          {section === "operations-center" && <OperationsCenter demoMode={capturing} />}
          {section === "production-forecast" && <ProductionForecast demoMode={capturing} />}
          {section === "production-board" && <ProductionBoard stream={stream} demoMode={capturing} />}
          {section === "export-center" && <ExportCenter stream={stream} demoMode={capturing} />}
          {section === "failed-deliveries" && <FailedDeliveries demoMode={capturing} />}
          {section === "fulfillment" && <Fulfillment demoMode={capturing} />}
          {section === "pause-management" && <PauseManagement demoMode={capturing} />}
          {section === "billing-cycles" && <BillingCycles demoMode={capturing} />}
          {section === "department-login" && <DepartmentLogin demoMode={capturing} />}
          {section === "subscriber-profile" && <SubscriberProfile demoMode={capturing} />}
          {section === "settings" && <Settings demoMode={capturing} initialTab={settingsTab} />}
        </main>
      </div>
    </div>
  );
}
