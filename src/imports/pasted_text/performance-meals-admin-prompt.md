PERFORMANCE MEALS ADMIN PLATFORM — PROMPT 7B — FINAL SCOPE, ACL, SHOPIFY BOUNDARY & PROTOTYPE CLEANUP

IMPORTANT:
This is a FINAL REFINEMENT / CLEANUP PASS on the EXISTING Performance Meals Admin Portal.

DO NOT create a new application.
DO NOT redesign the portal.
DO NOT introduce a new visual system.
DO NOT create a separate ERP.
DO NOT create a rider mobile app.
DO NOT create a customer mobile app.
DO NOT create a separate customer portal inside this admin platform.
DO NOT create a custom payment processor.
DO NOT replace Shopify as the commerce/order/payment system.

Preserve the existing UI, navigation structure, data concepts, business streams, and existing functionality unless explicitly instructed below.

==================================================
1. CORE ARCHITECTURE — FINAL SOURCE OF TRUTH
==================================================

The system boundary must be explicit:

SHOPIFY REMAINS THE COMMERCE SYSTEM OF RECORD.

Shopify is responsible for:
- Products
- Product variants
- Customers
- Orders
- Checkout
- Payments
- Refund execution
- Commerce transactions
- Customer/order commerce history

CUSTOM MEAL PLAN LOGIC / ADMIN OPERATIONS are responsible for:
- Meal Plan subscription rules
- Default delivery days
- Automatic order-generation logic
- Menu/date validation
- Meal selections
- Pause logic
- Wallet / credit business rules
- Delivery scheduling logic
- Subscription operational controls
- Menu review
- Kitchen operational workflows
- Delivery order preparation
- Automation history
- Administrative operational records
- Audit records

IMPORTANT:
The custom system must NOT visually imply that it replaces Shopify.

Add/retain clear Shopify boundary messaging wherever relevant:
"Shopify is the commerce system of record. This admin platform manages Meal Plan and operational workflows around Shopify."

Do not create duplicate payment/order-management systems.

==================================================
2. REMOVE / DEFER OUT-OF-SCOPE SYSTEMS
==================================================

The current prototype contains several enterprise-style modules that make the platform appear larger than the approved Phase 1 scope.

DO NOT delete useful workflow concepts that are already represented.

Instead, classify broad enterprise modules as:
- Phase 1
- Supporting Operations
- Future / Deferred

The interface must make it clear that Future / Deferred functionality is not part of the initial implementation.

The following must NOT be presented as active Phase 1 custom products:

- Rider Mobile App
- Customer Mobile App
- Standalone ERP
- Custom Payment Gateway
- Independent Checkout System
- Independent Product Commerce System
- Independent Customer Commerce Database
- Independent Financial Transaction Processor

==================================================
3. RIDER APP — EXPLICITLY OUT OF SCOPE
==================================================

The existing source contains a "Rider App" / "rider-app" concept.

This MUST NOT be represented as an active custom application.

Do not create:
- rider mobile screens
- rider login application
- rider mobile workflows
- rider navigation
- rider delivery app UI
- rider-specific mobile product

The administrative platform may retain a DELIVERY / RIDERS operational module for:
- rider assignment
- rider information
- route assignment
- delivery status
- dispatch management

But this is ADMIN / OPERATIONS functionality only.

Label any future rider application concept as:

"Future — external rider application / integration"

Do not imply it is being built in this project.

==================================================
4. BUSINESS UNIT SEPARATION
==================================================

Maintain strict separation between:

READY SERIES
and
MEAL PLAN

These are separate business streams.

They must NEVER accidentally share:
- orders
- production queues
- menu rules
- delivery workflows
- subscription logic
- financial reporting
- operational queues

Shared infrastructure may exist, but the business data must remain separated.

Use the existing business stream identifiers:

"ready-series"
"meal-plans"

Where relevant, every operational record should make the business stream explicit.

Examples:

Order:
Business Stream = Meal Plans / Ready Series

Kitchen:
Business Stream = Meal Plans / Ready Series

Delivery:
Business Stream = Meal Plans / Ready Series

Reports:
Business Stream = Meal Plans / Ready Series

Do not merge them into a generic queue.

==================================================
5. ADMIN NAVIGATION CLEANUP
==================================================

Keep the current high-level navigation structure.

However, make the navigation feel like a focused operations platform rather than a giant ERP.

Primary functional groups:

OVERVIEW
- Dashboard
- Operations Center
- Reports

FULFILMENT
- Orders
- Delivery
- Dispatch
- Print Slips

SUBSCRIBERS
- Customers
- Subscriptions
- Subscriber Profile
- Menu Review
- Pause Management
- Billing Cycles

KITCHEN
- Kitchen
- Menu Planning
- Production Forecast

OPERATIONS
- Inventory
- Packaging
- Procurement
- Failed Deliveries
- Export Center

FINANCE
- Wallet
- Refunds
- Finance

ADMIN
- Users / Roles / ACL
- Audit Logs
- Notifications
- Settings

COMMUNICATION
- WhatsApp
- Customer Support

Do not make every existing enterprise module feel equally important.

==================================================
6. FUTURE / DEFERRED MODULES
==================================================

For modules that are broader than the initial implementation, visually mark them as:

"Future / Deferred"

Examples may include:
- Advanced Business Intelligence
- Executive dashboards beyond operational reporting
- Advanced procurement automation
- Advanced production forecasting
- Advanced customer-success automation
- Advanced marketing automation
- Advanced affiliate management
- Advanced delivery optimization
- External rider application integration
- Other ERP-style functionality

Do not remove the concepts if they are already useful to the product roadmap.

Just prevent them from being interpreted as mandatory Phase 1 implementation.

==================================================
7. ACL — FINAL ROLE STRUCTURE
==================================================

Preserve the existing role architecture.

Roles must remain configurable rather than permanently hardcoded.

Supported permissions:

VIEW
CREATE
EDIT
DELETE
APPROVE
EXPORT
ASSIGN
EXECUTE

The system must visually communicate:

- Super Admin can access all modules.
- Department heads can operate within their own departments.
- Cross-department access requires explicit authorization.
- Sensitive actions require elevated permissions.
- Financial actions require appropriate Finance-level permissions.
- Refund approval requires authorized Finance/admin permissions.
- Operational execution requires appropriate operational permissions.
- Export functions require EXPORT permission.
- Approval workflows require APPROVE permission.

Do not imply that simply hiding a button in the UI is security.

Display an appropriate system note:

"UI permissions are enforced by server-side authorization in production."

The prototype is a workflow representation, not a security certification.

==================================================
8. DEPARTMENT CATALOG CONSISTENCY
==================================================

Normalize the department model so the departments represented in Roles / ACL match the departments used throughout Settings and Login.

Ensure the department taxonomy can support all currently defined operational roles.

At minimum, ensure consistency across:
- Operations
- Kitchen
- Delivery
- Customer Support
- Marketing
- Finance
- Inventory
- Procurement
- IT / Administration

Do not create duplicate department names or conflicting department labels.

Roles must reference valid departments.

==================================================
9. LOGIN / AUTHENTICATION BOUNDARY
==================================================

Keep the Department Login interface as a prototype/reference.

Do NOT present demo credentials or local login state as production authentication.

Clearly indicate:

"Production authentication must use server-side identity, authorization, secure session management, and appropriate access controls."

Do not imply:
- passwords are securely stored in the prototype
- sessions are production-secure
- 2FA is production-enabled
- frontend role selection is a security mechanism

The selected role must be derived from authenticated authorization in the real implementation.

==================================================
10. AUDIT LOGGING — FINAL EXPECTATION
==================================================

Maintain Audit Logs for sensitive actions.

Examples:

- Automatic order generation
- Menu change
- Wallet adjustment
- Refund decision
- Transaction description edit
- Subscription pause
- Billing change
- Admin override
- Export
- Reprint
- Permission change
- Role change
- User access change

Each record should support:

Action
Entity
Business Stream
User / Admin
Timestamp
Reason
Previous Value
New Value
Reference ID

Make it visually clear:

"Production audit records must be server-side and tamper-resistant."

Do not claim the current local demo log is production-grade immutable auditing.

==================================================
11. WALLET / CREDIT BOUNDARY
==================================================

Maintain the current wallet / credit workflows.

Separate these two concepts clearly:

PAYMENT-BACKED CREDIT

Payment provider confirms payment
→ successful payment event
→ credit transaction created
→ wallet balance updated

MANUAL ADMIN ADJUSTMENT

Admin
→ authorized adjustment
→ mandatory reason
→ customer
→ amount
→ audit record

Manual adjustment must NOT be visually presented as if it were a payment.

The UI should distinguish:

"Payment-backed credit"

from:

"Manual administrative adjustment"

==================================================
12. REFUND BOUNDARY
==================================================

Maintain the Refund workflow.

Do not create payment execution inside the custom admin UI.

The workflow should represent:

Admin Request
→ Review
→ Approve / Reject / Escalate
→ Shopify / Payment Layer executes refund
→ Result recorded in admin audit history

Display:

"Refund execution occurs through Shopify / payment infrastructure."

Do not present the custom portal as the payment processor.

==================================================
13. TRANSACTION DESCRIPTION EDITOR
==================================================

Keep the transaction description editor.

It may change:

- Description
- Internal note / administrative description

It must NOT change:

- Amount
- Currency
- Provider transaction ID
- Original financial status
- Original payment record
- Payment confirmation state

Keep:

Previous Description
New Description
Changed By
Timestamp
Reason

==================================================
14. SHOPIFY INTEGRATION VISUAL LANGUAGE
==================================================

Where Shopify-related workflows appear, make the integration boundary clear.

Use labels such as:

"Shopify Order"
"Shopify Customer"
"Shopify Product"
"Shopify Payment"
"Shopify Refund"

Do not duplicate these as if the custom platform were the master system.

For operational records, make references explicit.

Example:

Order #PM-1042
Shopify Order: #10584
Business Stream: Meal Plan
Operational Status: Scheduled

This demonstrates that the admin platform operates around Shopify rather than replacing it.

==================================================
15. DATA OWNERSHIP
==================================================

For every important record, visually distinguish SYSTEM OF RECORD vs OPERATIONAL DATA.

Examples:

SHOPIFY OWNERSHIP:
- customer commerce identity
- commerce order
- product
- payment
- refund execution

CUSTOM OPERATIONS OWNERSHIP:
- subscription rules
- default delivery days
- meal schedule
- pause period
- menu validation state
- operational delivery date
- kitchen workflow
- automation result
- administrative audit

Do not create conflicting duplicate ownership.

==================================================
16. NO NEW CUSTOMER PORTAL
==================================================

Do not add customer-facing application functionality to this admin platform.

The customer experience remains a separate customer-facing Shopify implementation.

This admin system only manages the operational/admin side of the experience.

==================================================
17. VISUAL PRIORITY
==================================================

Preserve the existing design system.

Do not redesign.

Keep the interface:
- clean
- operational
- minimal
- high signal
- data-first
- easy to scan

Do not add unnecessary cards simply to make the interface look more "enterprise".

Use clear operational states:

ACTIVE
PAUSED
READY
PENDING
FAILED
SKIPPED
COMPLETED
REQUIRES ACTION
FUTURE / DEFERRED

==================================================
18. FINAL SCOPE INFORMATION PANEL
==================================================

Add a compact "System Scope" reference in Settings / Admin documentation.

Display:

PHASE 1 CORE
- Meal Plan Automation
- Subscription Management
- Default Delivery Days
- Pause Management
- Menu / Date Validation
- Order Generation
- Delivery Scheduling
- Kitchen Operations
- Wallet / Credit Logic
- Admin Menu Changes
- Refund Workflow
- Transaction Description Editing
- Audit Logging
- WhatsApp Notifications
- Shopify Integration Boundaries

SHARED OPERATIONS
- Ready Series
- Orders
- Delivery
- Dispatch
- Support
- Reporting

FUTURE / DEFERRED
- Rider Mobile App
- Customer Mobile App
- ERP expansion
- Advanced BI
- Advanced automation
- Advanced delivery optimization
- Other non-critical enterprise extensions

==================================================
19. FINAL QA CHECK
==================================================

Before completing this refinement, verify:

[ ] Shopify remains the commerce system of record
[ ] No custom payment processor is implied
[ ] No custom checkout system is implied
[ ] No separate customer app is implied
[ ] No rider mobile app is active scope
[ ] Meal Plans and Ready Series remain separated
[ ] ACL permissions are clearly defined
[ ] Department and role names are consistent
[ ] Production authentication is not falsely represented
[ ] Audit logging is represented as server-side production functionality
[ ] Payment-backed credit is separated from manual adjustment
[ ] Refund execution remains with Shopify/payment infrastructure
[ ] Transaction descriptions cannot alter financial facts
[ ] Future / Deferred modules are clearly separated from Phase 1
[ ] No unnecessary ERP scope is implied
[ ] Existing business logic from Prompt 7A remains intact
[ ] Thursday 2:55 PM automation remains intact
[ ] Menu/date validation remains intact
[ ] Timeslot inheritance remains intact
[ ] Junior pricing remains rule-driven
[ ] Pause logic remains intact
[ ] Automation history remains intact
[ ] Sensitive actions remain auditable

FINAL OBJECTIVE:

Make the existing portal feel like a focused, Shopify-compatible Performance Meals operations platform with strong Meal Plan automation and administrative control — NOT a custom ERP, NOT a payment platform, and NOT a rider/customer application.

Do not add new product concepts.

Do not redesign.

Refine the existing system so the scope and architecture are unambiguous.