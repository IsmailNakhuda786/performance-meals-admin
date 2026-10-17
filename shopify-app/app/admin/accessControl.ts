export type Department =
  | "Admin"
  | "Operations"
  | "Kitchen"
  | "Dispatch"
  | "Finance"
  | "Customer Support";

export type UserStatus = "Active" | "Suspended";

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  password: string;
  department: Department;
  role: string;
  status: UserStatus;
  permissions: string[];
}

export interface ModuleOption {
  id: string;
  label: string;
  group: string;
}

export const moduleOptions: ModuleOption[] = [
  { id: "dashboard", label: "Dashboard", group: "Overview" },
  { id: "operations-center", label: "Operations Center", group: "Overview" },
  { id: "reports", label: "Reports", group: "Overview" },
  { id: "orders", label: "Orders", group: "Fulfilment" },
  { id: "delivery", label: "Delivery", group: "Fulfilment" },
  { id: "dispatch", label: "Dispatch", group: "Fulfilment" },
  { id: "print-slips", label: "Print Slips", group: "Fulfilment" },
  { id: "customers", label: "Customers", group: "Subscribers" },
  { id: "subscriptions", label: "Subscriptions", group: "Subscribers" },
  { id: "subscriber-profile", label: "Subscriber Profile", group: "Subscribers" },
  { id: "menu-review", label: "Menu Review", group: "Subscribers" },
  { id: "pause-management", label: "Pause Management", group: "Subscribers" },
  { id: "billing-cycles", label: "Billing Cycles", group: "Subscribers" },
  { id: "fulfillment", label: "Fulfillment", group: "Subscribers" },
  { id: "kitchen", label: "Kitchen Queue", group: "Kitchen" },
  { id: "menu-planning", label: "Menu Planning", group: "Kitchen" },
  { id: "production-forecast", label: "Production Forecast", group: "Kitchen" },
  { id: "production-board", label: "Production Board", group: "Kitchen" },
  { id: "kitchen-forecast", label: "Kitchen Forecast", group: "Kitchen" },
  { id: "inventory", label: "Inventory", group: "Operations" },
  { id: "failed-deliveries", label: "Failed Deliveries", group: "Operations" },
  { id: "export-center", label: "Export Center", group: "Operations" },
  { id: "riders", label: "Riders", group: "Operations" },
  { id: "delivery-hub", label: "Delivery Hub", group: "Operations" },
  { id: "wallet", label: "Wallet & Credits", group: "Finance" },
  { id: "refunds", label: "Refunds", group: "Finance" },
  { id: "finance", label: "Finance & Billing", group: "Finance" },
  { id: "acl", label: "Users & Roles", group: "Admin" },
  { id: "audit-logs", label: "Audit Logs", group: "Admin" },
  { id: "notifications", label: "Notifications", group: "Admin" },
  { id: "settings", label: "Settings", group: "Admin" },
  { id: "whatsapp", label: "WhatsApp", group: "Communication" },
  { id: "support", label: "Customer Support", group: "Communication" },
];

const allModules = moduleOptions.map(module => module.id);

export const rolePermissions: Record<string, string[]> = {
  "Super Admin": allModules,
  "Operations Manager": [
    "dashboard", "operations-center", "reports", "orders", "delivery", "dispatch",
    "print-slips", "customers", "subscriptions", "subscriber-profile", "menu-review",
    "pause-management", "billing-cycles", "fulfillment", "notifications", "support", "settings",
  ],
  "Kitchen Manager": [
    "dashboard", "kitchen", "menu-planning", "production-forecast", "production-board",
    "kitchen-forecast", "inventory", "export-center", "reports", "notifications", "settings",
  ],
  "Dispatch Manager": [
    "dashboard", "orders", "delivery", "dispatch", "failed-deliveries", "export-center",
    "riders", "delivery-hub", "customers", "notifications", "reports", "settings",
  ],
  "Finance Manager": [
    "dashboard", "reports", "customers", "billing-cycles", "wallet", "refunds",
    "finance", "audit-logs", "notifications", "settings",
  ],
  "Support Manager": [
    "dashboard", "customers", "subscriber-profile", "subscriptions", "pause-management",
    "failed-deliveries", "refunds", "whatsapp", "support", "notifications", "settings",
  ],
  "Team Member": ["dashboard", "notifications", "settings"],
};

export const rolesByDepartment: Record<Department, string[]> = {
  Admin: ["Super Admin"],
  Operations: ["Operations Manager", "Team Member"],
  Kitchen: ["Kitchen Manager", "Team Member"],
  Dispatch: ["Dispatch Manager", "Team Member"],
  Finance: ["Finance Manager", "Team Member"],
  "Customer Support": ["Support Manager", "Team Member"],
};

export const initialUsers: UserAccount[] = [
  {
    id: "U-001",
    name: "Jerome Lim",
    email: "admin@performancemeals.sg",
    password: "Admin123!",
    department: "Admin",
    role: "Super Admin",
    status: "Active",
    permissions: rolePermissions["Super Admin"],
  },
  {
    id: "U-002",
    name: "Rachel Tan",
    email: "rachel@performancemeals.sg",
    password: "Demo123!",
    department: "Operations",
    role: "Operations Manager",
    status: "Active",
    permissions: rolePermissions["Operations Manager"],
  },
  {
    id: "U-003",
    name: "Chef Ravi Kumar",
    email: "ravi@performancemeals.sg",
    password: "Demo123!",
    department: "Kitchen",
    role: "Kitchen Manager",
    status: "Active",
    permissions: rolePermissions["Kitchen Manager"],
  },
  {
    id: "U-004",
    name: "Daniel Ng",
    email: "daniel@performancemeals.sg",
    password: "Demo123!",
    department: "Dispatch",
    role: "Dispatch Manager",
    status: "Active",
    permissions: rolePermissions["Dispatch Manager"],
  },
  {
    id: "U-005",
    name: "Sarah Toh",
    email: "sarah@performancemeals.sg",
    password: "Demo123!",
    department: "Finance",
    role: "Finance Manager",
    status: "Active",
    permissions: rolePermissions["Finance Manager"],
  },
  {
    id: "U-006",
    name: "Natalie Foo",
    email: "natalie@performancemeals.sg",
    password: "Demo123!",
    department: "Customer Support",
    role: "Support Manager",
    status: "Active",
    permissions: rolePermissions["Support Manager"],
  },
];
