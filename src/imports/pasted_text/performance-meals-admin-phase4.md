PERFORMANCE MEALS ADMIN PLATFORM
PHASE 4 — FINAL OPERATIONS LOGIC, ROLE ARCHITECTURE, ADMIN SETTINGS & WORKFLOW HANDOFFS

IMPORTANT:

You are NOT creating a new admin portal from scratch.

You are extending and refining the existing Performance Meals Admin Portal that already contains the 41 documented screens.

Do NOT duplicate existing screens.

Do NOT redesign the existing visual language unnecessarily.

Use the existing screens as the baseline and ADD the missing operational logic, roles, permissions, workflows, settings, ownership, actions, states, handoffs, and edge cases described below.

============================================================
1. CORE BUSINESS MODEL
============================================================

Performance Meals operates two separate business units:

BUSINESS UNIT A
READY SERIES

BUSINESS UNIT B
MEAL PLANS

These are operationally separate businesses.

CRITICAL RULE:

READY SERIES AND MEAL PLANS MUST NEVER BE MIXED.

Never merge:

- Order queues
- Production queues
- Delivery queues
- Delivery Order exports
- Subscriber management
- Revenue reporting
- Business-unit-specific workflows
- Business-unit operational KPIs

Shared departments may see both businesses, but both streams must remain visibly and operationally separated.

When a shared department handles both businesses, show two clearly labelled sections:

READY SERIES

MEAL PLANS

Never use one ambiguous combined queue.

============================================================
2. EXISTING SCREENS — DO NOT DUPLICATE
============================================================

The existing prototype already includes:

- Master Operations Center
- Operations Dashboard
- Executive Control Center
- Business Intelligence
- Orders
- Delivery
- Print Slips
- Customers
- Subscriptions
- Subscription Fulfillment
- Pause Management
- Billing Cycle Center
- Menu Review Engine
- Menu Planning Center
- Kitchen Queue
- Kitchen Production Board
- Production Forecasting
- Kitchen Forecasting
- Delivery Order Export Center
- Inventory
- Procurement Center
- Packaging Center
- Dispatch Control Center
- Failed Delivery Center
- Delivery Operations Hub
- Riders
- Rider Mobile App
- Customer Support
- Customer Success
- Notification Center
- WhatsApp Communication Center
- Marketing
- Wallet & Rewards
- Finance & Billing
- Refund Management
- Reports
- Access Control Center
- Audit Logs
- Business Rules Engine
- Department Login Portal
- Subscriber Profile

Preserve them.

Add the missing logic described below.

============================================================
3. COMPLETE ORGANIZATIONAL ROLE STRUCTURE
============================================================

Create a proper role hierarchy.

EXECUTIVE / MANAGEMENT

1. Super Admin
2. Managing Director / Owner
3. Operations Director

OPERATIONS

4. Operations Manager
5. Operations Executive

KITCHEN

6. Kitchen Manager
7. Head Chef
8. Sous Chef
9. Chef / Cook
10. Kitchen Staff
11. Quality Control Staff

INVENTORY & PROCUREMENT

12. Inventory Manager
13. Inventory Executive
14. Procurement Manager
15. Procurement Executive

DELIVERY & LOGISTICS

16. Delivery Manager
17. Dispatch Manager
18. Dispatcher
19. Rider Supervisor
20. Rider

CUSTOMER SUPPORT

21. Customer Support Manager
22. Customer Support Agent

FINANCE

23. Finance Manager
24. Finance Executive
25. Accounts Executive

MARKETING

26. Marketing Manager
27. Meta Ads Specialist
28. Google Ads Specialist
29. Content Manager
30. Content Executive
31. Affiliate / Referral Manager

IT / ADMINISTRATION

32. IT / System Administrator
33. HR / People Manager

For each role define:

- Department
- Job purpose
- Screens they can access
- Information they can view
- Actions they can perform
- Actions they cannot perform
- Approval authority
- Export authority
- Escalation authority

Do not use generic "Admin" as a substitute for these roles.

============================================================
4. DEPARTMENT OWNERSHIP
============================================================

Define clear ownership.

OPERATIONS owns:

- Order monitoring
- Subscription monitoring
- Escalations
- Cross-department coordination
- Operational reporting

KITCHEN owns:

- Production
- Menu preparation
- Kitchen queue
- Meal readiness
- Quality control

INVENTORY / PROCUREMENT owns:

- Ingredients
- Packaging
- Stock
- Suppliers
- Purchase orders

DELIVERY / LOGISTICS owns:

- Dispatch
- Rider assignment
- Routes
- Delivery manifests
- Delivery status

CUSTOMER SUPPORT owns:

- Customer account assistance
- Address changes
- Meal swaps
- Pause requests
- Resume requests
- Customer complaints
- Support escalation

FINANCE owns:

- Revenue records
- Refund approval
- Wallet adjustments
- Billing monitoring
- Financial reports

MARKETING owns:

- Campaigns
- Promotions
- Attribution
- Meta
- Google
- Referral / Affiliate activity

IT / SYSTEM ADMIN owns:

- System configuration
- User administration where authorized
- Security
- Access infrastructure

SUPER ADMIN owns everything.

============================================================
5. ACL — COMPLETE PERMISSION MODEL
============================================================

Do not only show roles.

Build a real role-to-permission matrix.

Permission types:

VIEW
CREATE
EDIT
DELETE
APPROVE
EXPORT
ASSIGN
EXECUTE

Modules:

- Operations
- Ready Series Orders
- Meal Plans
- Subscribers
- Menu Review
- Menu Management
- Kitchen
- Inventory
- Procurement
- Packaging
- Dispatch
- Riders
- Customer Support
- Wallet
- Refunds
- Finance
- Marketing
- Reports
- Notifications
- WhatsApp
- Users
- Roles
- Settings
- Audit Logs
- Business Rules

SUPER ADMIN:

Full access.

DEPARTMENT HEAD:

Can manage permissions only within their own department, subject to the Super Admin role boundary.

IMPORTANT:

A department head must NOT be able to grant themselves or another person access to another department.

Example:

Marketing Manager may add:

- Meta Ads Specialist
- Google Ads Specialist
- Content Executive

Marketing Manager cannot grant:

- Kitchen access
- Finance access
- Rider access

Kitchen Manager cannot grant Finance permissions.

Delivery Manager cannot grant Marketing permissions.

============================================================
6. ADMIN PROFILE & SETTINGS
============================================================

The Settings area must NOT be empty.

Create a complete "My Admin Profile" experience.

Every admin user must be able to manage their own account.

MY PROFILE:

- Profile Photo
- Full Name
- Job Title
- Department
- Role
- Email
- Phone
- Employee ID where applicable
- About Me / Internal Profile Description

SECURITY:

- Change Password
- Confirm Password
- Two-Factor Authentication
- Active Sessions
- Login History
- Sign Out Other Sessions

NOTIFICATIONS:

- Email Alerts
- In-App Alerts
- WhatsApp Alerts where authorized
- Operational Alert Preferences

MY ACCESS:

Display:

- Current Department
- Current Role
- Modules I Can Access
- Permissions I Have
- Access Granted By
- Last Permission Change

PERMISSION REQUESTS:

Allow an admin to request:

- New Module Access
- Additional Permission
- Temporary Access
- Access to another workflow

Show:

Requested By
Reason
Module
Permission
Status
Approved By
Date

Possible statuses:

Pending
Approved
Rejected
Expired

ESCALATION REQUESTS:

Allow staff to request assistance from their Department Head or Super Admin.

Examples:

- Refund approval required
- Customer exception requires authorization
- Inventory override required
- Delivery exception requires approval

============================================================
7. ADMIN SETTINGS — DEPARTMENT HEAD
============================================================

Department Heads get additional controls.

They can:

- View their team
- Invite team members
- Remove team members
- Assign approved department roles
- Request permission changes
- Approve department-level requests where authorized
- View departmental activity

They cannot modify Super Admin or other departments.

============================================================
8. SUPER ADMIN SETTINGS
============================================================

Create a Super Admin control area.

Super Admin can:

- Manage every department
- Manage every role
- Approve permission requests
- Revoke permissions
- Suspend users
- Restore users
- View all audit logs
- Configure global rules
- Configure global notification policies

Add confirmation dialogs for dangerous actions.

============================================================
9. READY SERIES OPERATIONAL FLOW
============================================================

Implement this workflow:

READY SERIES ORDER

New Order
↓
Payment Confirmed
↓
Ready Series Order Queue
↓
Kitchen / Fulfillment
↓
Packing
↓
Delivery Order Generated
↓
Dispatch
↓
Rider Assigned
↓
Picked Up
↓
Out For Delivery
↓
Delivered
↓
Completed

Every stage must show:

- Current owner
- Current status
- Timestamp
- Next responsible department
- Available actions

Do not send the order into Meal Plan workflows.

============================================================
10. MEAL PLAN OPERATIONAL FLOW
============================================================

Implement this workflow:

MEAL PLAN SUBSCRIPTION

Subscription Created
↓
Billing Confirmed
↓
Plan Active
↓
Menu Available
↓
Customer Menu Review
↓
Menu Confirmed
↓
Selection Locked
↓
Kitchen Production
↓
Packing
↓
Delivery Order Generated
↓
Dispatch
↓
Rider Assigned
↓
Delivered
↓
Next Billing Cycle

The workflow must also support:

Pause
Resume
Cancel
Meal Swap
Billing Failure
Delivery Failure

============================================================
11. MENU REVIEW → KITCHEN HANDOFF
============================================================

This is a critical workflow.

When a customer changes meals:

1. Customer selection is updated.
2. Subscriber record updates.
3. Menu Review status updates.
4. Kitchen requirement recalculates.
5. Production quantity updates.
6. Packing requirements update.
7. Delivery output updates where required.
8. Audit entry is created.

Show the relationship between these screens.

Do not design Menu Review as an isolated page.

============================================================
12. MENU CUTOFF LOGIC
============================================================

Maintain the existing weekly cutoff concept.

Show:

- Current Week
- Upcoming Week
- Locked Week

Display:

- Cutoff date
- Cutoff time
- Time remaining

Before cutoff:

Customer/authorized staff can modify selection.

After cutoff:

Selection is locked.

If an authorized staff member overrides after cutoff:

Require:

- Reason
- Notes
- User identity
- Confirmation

Create an Audit Log entry.

============================================================
13. SUBSCRIPTION PAUSE LOGIC
============================================================

Pause duration must be full weeks.

Options:

1 Week
2 Weeks
3 Weeks
4 Weeks

Show:

- Pause Start Date
- Pause End Date
- Resume Date
- Billing Impact
- Delivery Impact

When pause is confirmed:

- Subscription status updates
- Future fulfillment changes
- Billing schedule reflects the pause
- Delivery schedule reflects the pause
- Audit log records the action

============================================================
14. BILLING CYCLE LOGIC
============================================================

Meal Plans support:

- Bi-Weekly
- Monthly

When changing billing cycle:

Show:

Current Plan
Current Price
New Cycle
New Price
Next Billing Date
Effective Date
Price Difference

Do not make the user guess the effect.

A pending change must have a visible state.

============================================================
15. CUSTOMER SUPPORT — ACCOUNT CHANGE WORKFLOW
============================================================

Customer Support must be able to search a customer and determine:

READY SERIES CUSTOMER

or

MEAL PLAN CUSTOMER

Actions must change according to the business type.

Support actions may include:

- Update Name
- Update Phone
- Update Address
- Reset Password
- View Order
- View Delivery
- Add Support Note

Meal Plan-specific actions:

- Pause
- Resume
- Meal Swap
- Billing inquiry

Ready Series-specific actions:

- Order issue
- Bundle issue
- Delivery issue
- Refund request

Every change must record:

Changed By
Date
Previous Value
New Value
Reason

============================================================
16. REFUND WORKFLOW
============================================================

Refund lifecycle:

Request
↓
Review
↓
Approve / Reject / Escalate
↓
Shopify Execution
↓
Confirmation
↓
Audit Log

IMPORTANT:

This portal does NOT process the payment itself.

The portal records the operational decision.

Shopify executes the actual payment/refund action.

Keep this boundary visible.

============================================================
17. DELIVERY ORDER / DO WORKFLOW
============================================================

DO = Delivery Order.

For every Delivery Order:

Identify:

- Business Unit
- Customer
- Order / Subscription ID
- Delivery Date
- Delivery Window
- Address
- Contact Number
- Meal / Product Details
- Special Instructions
- Rider
- Route
- Status

IMPORTANT:

Ready Series DOs and Meal Plan DOs must never be mixed in the same operational export.

Allow:

READY SERIES DO EXPORT

MEAL PLAN DO EXPORT

SHARED VIEW WITH SEPARATE SECTIONS

Never create one unlabeled combined DO.

============================================================
18. DO EXPORT WORKFLOW
============================================================

Workflow:

Select Date
↓
Select Business Unit
↓
Select Delivery Window / Batch
↓
Preview Records
↓
Confirm
↓
Generate Export

Formats:

- PDF
- Excel
- CSV
- Print

After export, record:

- Who exported
- Date
- Time
- Stream
- Number of records

Allow Reprint / Re-export with audit logging.

============================================================
19. KITCHEN PRODUCTION HANDOFF
============================================================

Kitchen receives the production requirement.

Display separately:

READY SERIES PRODUCTION

MEAL PLAN PRODUCTION

Each row should contain:

- Meal
- Quantity
- Business Unit
- Packaging
- Priority
- Status
- Notes

Statuses:

Pending
In Production
Produced
Packed

Actions:

- Start Production
- Mark Produced
- Mark Packed
- Print Production Sheet
- Export

============================================================
20. INVENTORY IMPACT
============================================================

When production quantities change:

Show the effect on:

- Ingredient demand
- Packaging demand
- Current stock
- Forecast stock

If stock is insufficient:

Show warning.

Example:

"Chicken Breast: 84 required / 70 available / deficit 14"

Allow authorized users to:

- Create Stock Request
- Create Purchase Order
- Flag Exception

============================================================
21. PROCUREMENT WORKFLOW
============================================================

Low Stock
↓
Stock Request
↓
Purchase Order
↓
Approval
↓
Supplier
↓
Receive Stock
↓
Inventory Updated

Display:

Owner
Status
Supplier
Expected Delivery
Amount
Approval State

============================================================
22. PACKAGING WORKFLOW
============================================================

Track:

- Containers
- Bags
- Labels
- Ice Packs
- Other packaging SKUs

Show:

Required
Available
Allocated
Remaining
Reorder Needed

Keep packaging requirements connected to production quantities.

============================================================
23. DISPATCH WORKFLOW
============================================================

Dispatch receives completed packing records.

Separate:

READY SERIES DISPATCH

MEAL PLAN DISPATCH

Workflow:

Packed
↓
DO Generated
↓
Route / Batch
↓
Rider Assignment
↓
Rider Accepts
↓
Picked Up
↓
Out For Delivery
↓
Delivered

Allow reassignment with reason.

============================================================
24. RIDER WORKFLOW
============================================================

Rider can see ONLY assigned deliveries.

Rider cannot see:

- Revenue
- Finance
- Other riders' confidential data
- Full customer account history
- Inventory
- Marketing

Rider Mobile App:

LOGIN
↓
TODAY'S ROUTE
↓
DELIVERY DETAILS
↓
CUSTOMER CONTACT
↓
PICKUP CONFIRMATION
↓
OUT FOR DELIVERY
↓
MARK DELIVERED
↓
PROOF OF DELIVERY

Proof:

- Photo
- Signature where applicable
- Timestamp

============================================================
25. FAILED DELIVERY WORKFLOW
============================================================

Failure reasons:

- Customer Unavailable
- Wrong Address
- Customer Rejected
- Other

After failure:

Record:

- Rider
- Attempt Number
- Time
- Reason
- Notes

Actions:

- Reschedule
- Re-dispatch
- Refund Request
- Escalate
- Resolve

Do not automatically refund unless the configured business rule permits it.

============================================================
26. SUPPORT ESCALATION WORKFLOW
============================================================

Customer Support can escalate to:

Support Manager
Operations Manager
Finance
Kitchen
Delivery
Super Admin

Every escalation has:

- Priority
- Owner
- Status
- Notes
- SLA / due date if configured

Statuses:

Open
In Progress
Escalated
Resolved
Closed

============================================================
27. MARKETING ACCESS
============================================================

Marketing dashboard must remain limited to marketing information.

Marketing Manager can manage:

- Campaigns
- Promotions
- Attribution
- Referral / Affiliate
- Meta
- Google
- WhatsApp campaigns

Meta Ads Specialist should NOT automatically see:

- Finance
- Kitchen
- Inventory
- Customer billing

Marketing metrics must remain separated by:

READY SERIES
MEAL PLANS

============================================================
28. FINANCE ACCESS
============================================================

Finance can see:

- Revenue
- Transactions
- Refund Requests
- Wallet Adjustments
- Failed Payments
- Reports

Where payment execution occurs in Shopify:

Clearly show:

"Decision recorded in Operations Portal"

"Payment action executed in Shopify"

============================================================
29. NOTIFICATIONS
============================================================

Every important event should have an owner and notification rule.

Examples:

- Failed Payment → Finance / Operations
- Menu Deadline → Meal Plans / Support
- Low Stock → Kitchen / Procurement
- Failed Delivery → Delivery / Support
- Refund Request → Finance
- Permission Request → Department Head / Super Admin
- Critical Escalation → Operations

Do not notify every department about everything.

Notifications must respect role permissions.

============================================================
30. AUDITABILITY
============================================================

Every consequential action must create an audit record.

Examples:

- Pause subscription
- Resume subscription
- Cancel subscription
- Meal override
- Address change
- Refund decision
- Wallet adjustment
- Permission change
- User suspension
- DO export
- Production status change
- Delivery status change

Audit record:

User
Department
Action
Object
Previous Value
New Value
Timestamp
Reason

============================================================
31. SETTINGS — COMPLETE NAVIGATION
============================================================

Settings should contain:

MY PROFILE

SECURITY

NOTIFICATIONS

MY ACCESS

PERMISSION REQUESTS

ESCALATION REQUESTS

TEAM MANAGEMENT where permitted

SYSTEM SETTINGS for authorized admins

AUDIT / SECURITY HISTORY

Do not leave Settings as a placeholder page.

============================================================
32. UX REQUIREMENTS
============================================================

The platform must be:

- Minimalistic
- Sleek
- Professional
- Extremely easy to scan
- Low-click
- Consistent
- Shopify-inspired
- Enterprise SaaS quality

Use:

- Clear page titles
- Breadcrumbs
- Business-unit indicators
- KPI cards
- Data tables
- Filters
- Search
- Bulk actions
- Side drawers
- Confirmation modals
- Empty states
- Loading states
- Error states
- Success feedback

============================================================
33. BUSINESS-UNIT VISUAL LANGUAGE
============================================================

Always make the active business unit obvious.

READY SERIES

Use its established visual identifier.

MEAL PLANS

Use its established visual identifier.

SHARED SERVICES

Use neutral shared-service styling.

Never depend only on color.

Also display text labels:

READY SERIES

MEAL PLANS

SHARED

============================================================
34. EDGE CASES
============================================================

Design appropriate states for:

- No orders
- No subscribers
- Failed Shopify sync
- Duplicate order
- Payment failed
- Menu cutoff passed
- Customer changes after cutoff
- Insufficient inventory
- Rider unavailable
- Failed delivery
- Refund rejected
- Permission request rejected
- Suspended admin account
- User loses permission while logged in

============================================================
35. RESPONSIVE ADMIN EXPERIENCE
============================================================

Desktop is primary.

Tablet must remain usable.

Mobile should support operationally important tasks:

- Rider workflow
- Support customer lookup
- Delivery status
- Production status where practical
- Notifications
- Admin profile

Do not simply shrink desktop screens.

============================================================
36. FINAL PROTOTYPE CONNECTIONS
============================================================

Connect the existing screens through realistic navigation.

Examples:

Operations Center
→ Ready Series Orders

Operations Center
→ Meal Plan Subscribers

Menu Review
→ Subscriber
→ Kitchen Requirement

Kitchen
→ Production Sheet
→ DO Export

Dispatch
→ Rider Assignment
→ Rider Mobile View

Failed Delivery
→ Support
→ Refund Request

Access Control
→ User
→ Role
→ Permission

Settings
→ My Profile
→ Security
→ My Access
→ Permission Request

============================================================
37. FINAL QUALITY RULE
============================================================

Do not invent new business policies where Performance Meals has not specified them.

When a rule is not explicitly defined:

show the setting as configurable, approval-based, or "to be configured".

Do NOT hard-code assumptions into the business workflow.

============================================================
38. FINAL OUTPUT
============================================================

Update the existing 41-screen prototype rather than creating a duplicate application.

The final prototype must demonstrate:

1. Complete role architecture
2. Department ownership
3. ACL enforcement
4. Admin profile and settings
5. Permission requests
6. Escalation requests
7. Ready Series separation
8. Meal Plans separation
9. Menu Review → Kitchen handoff
10. Production → Packing → DO handoff
11. Inventory impact
12. Procurement workflow
13. Dispatch workflow
14. Rider workflow
15. Failed delivery workflow
16. Customer Support workflow
17. Refund workflow
18. Marketing access
19. Finance access
20. Auditability
21. Notifications
22. Shopify boundary
23. Complete operational states

Do not create decorative screens merely to increase screen count.

Every screen and component must support a real operational task.

The result should feel like a real, usable Performance Meals operations platform that a development team could use as the basis for implementation.