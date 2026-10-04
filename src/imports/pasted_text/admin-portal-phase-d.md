PERFORMANCE MEALS ADMIN PORTAL
PHASE D — FULL ADMIN RECONCILIATION, SCRUTINY & TARGETED CORRECTION

IMPORTANT

This is a TARGETED CORRECTION AND RECONCILIATION PASS on the EXISTING
Performance Meals Admin Portal.

DO NOT rebuild the application.
DO NOT create a new application.
DO NOT duplicate existing screens.
DO NOT redesign the existing visual system.
DO NOT rewrite functionality that is already correct.

FIRST INSPECT.
THEN COMPARE.
THEN IDENTIFY GAPS.
ONLY THEN MAKE THE MINIMUM NECESSARY CHANGES.

==================================================
SOURCE OF TRUTH FOR THIS PASS
==================================================

You must reconcile the EXISTING Admin prototype against ALL of the following:

1. The current Performance Meals Admin prototype already in this project.
2. The attached Meal Plan Admin Use Case document.
3. The attached Ready Series Admin Use Case document.
4. Jerome's latest operational requirements contained in those documents/email
   material.
5. The approved Phase C scope decisions.

The attached documents are REQUIREMENTS REFERENCES.

Do not replace existing correct implementation simply because the wording
differs.

Where the prototype already satisfies a requirement:
→ KEEP IT.

Where the prototype partially satisfies a requirement:
→ CORRECT / COMPLETE ONLY THE GAP.

Where the prototype conflicts with an approved requirement:
→ CORRECT THE CONFLICT.

Where the requirement is deferred:
→ DO NOT expose it in the active Phase 1 workflow.

Where the source material does not specify something:
→ DO NOT INVENT IT.

==================================================
CRITICAL RULE — PRESERVE DEFERRED CODE
==================================================

For deferred modules:

DO NOT DELETE THEIR CODE.

DO NOT delete:
- source files
- React components
- routes
- data structures
- helper functions
- existing implementation
- existing module logic

Only:
- hide them from the active navigation
- prevent them from appearing in the normal current-phase workflow
- keep them recoverable for a future phase

Deferred does NOT mean deleted.

==================================================
APPROVED ARCHITECTURE
==================================================

Performance Meals has two separate business units:

READY SERIES
- One-time purchases
- Promotions
- Useful Bundles

MEAL PLANS
- Subscription plans
- Menu review
- Billing
- Pause / Resume
- Scheduled fulfillment

They must remain operationally separated.

Do not merge:
- orders
- production
- fulfillment
- delivery
- subscriber workflows
- Delivery Orders
- reporting

Shared departments may access both streams, but the distinction must remain
visible and operationally clear.

==================================================
SHOPIFY BOUNDARY
==================================================

Shopify remains the commerce system of record.

Shopify handles:
- Products
- Product variants
- Customers
- Orders
- Checkout
- Payments
- Refunds
- Commerce records

Do not create:
- custom payment processing
- custom checkout
- replacement commerce engine

Where appropriate, the Admin UI may display Shopify information or indicate
that an action is executed through Shopify.

==================================================
STEP 1 — INSPECT THE EXISTING ADMIN
==================================================

Before changing anything, inspect all existing screens and workflows.

Identify what is ALREADY IMPLEMENTED.

Do not recreate existing functionality.

Pay particular attention to:
- Dashboard
- Orders
- Delivery
- Print Slips
- Customers
- Subscriptions
- Subscription Fulfillment
- Pause Management
- Billing Cycles
- Menu Review
- Menu Planning
- Kitchen
- Production
- Inventory
- Dispatch
- Failed Deliveries
- Customer Support
- Customer Success
- Notifications
- WhatsApp
- Marketing
- Wallet
- Finance / Billing
- Refunds
- Reports
- Access Control
- Audit Logs
- Admin Settings

==================================================
STEP 2 — READY SERIES REQUIREMENT RECONCILIATION
==================================================

Compare the existing Ready Series Admin implementation with the attached
Ready Series Admin Use Case.

Verify that the prototype appropriately supports the documented roles:

CHEF
→ stock report to plan production

PACKING SUPERVISOR
→ physical stock audit/update
→ update new stock ready to sell
→ export Delivery Order

LOGISTICS ADMIN
→ delivery planning report

SALES & MARKETING
→ promotional specials
→ upsell / re-engagement
→ product sellability
→ customer segmentation/reporting

Verify the required report concepts where applicable:

- Delivery Order
- Frozen Stock Report
- Delivery Report
- Marketing Report

Frozen Stock Report must support the documented purpose:
→ weekly production planning
→ par level versus current stock

Marketing reporting must support the documented use cases:
→ customers who have not purchased for a period
→ customers who purchased a certain product
→ customer segmentation

Do NOT add fictional report fields where the source material does not define
them.

==================================================
STEP 3 — READY SERIES TIMING RECONCILIATION
==================================================

Verify the existing prototype against the documented operational timing.

Relevant requirements include:

EVERY OTHER DAY
→ deduct meals purchased
→ add new stock to inventory
→ promotional updates
→ customer data export for sales/marketing

DAY BEFORE DELIVERY / REQUIRED OPERATING TIME
→ Delivery Order export for packing
→ delivery list export

THURSDAY 3 PM
→ inventory report export

BIWEEKLY WEDNESDAY
→ physical stock date update for audit / rolling stock accuracy

Where these are already represented:
→ preserve them.

Where missing:
→ add only the minimum UI representation needed.

Do not build a separate automation product.

==================================================
STEP 4 — MEAL PLAN REQUIREMENT RECONCILIATION
==================================================

Compare the Admin prototype with the attached Meal Plan Admin Use Case.

Verify:

CHEF
→ production planning report

PACKING SUPERVISOR
→ packing planning report

LOGISTICS ADMIN
→ delivery planning report

SALES & MARKETING
→ upsell / re-engagement
→ menu updates

Other required functions:

MENU MANAGEMENT
→ enter menu
→ nutrition information
→ revolving weekly menu

CUSTOMER ACCOUNT MODIFIER
→ Pause
→ Resume
→ Billing

WALLET
→ Add credit
→ Deduct credit

REPORTS / EXPORTS
→ Delivery Order
→ Meal Report
→ Delivery Report
→ Marketing Report

==================================================
STEP 5 — MEAL PLAN WEEKLY SCHEDULE
==================================================

Reconcile the existing interface with the documented schedule.

WEDNESDAY 2:00 PM
→ customer receives menu review / billing reminder

THURSDAY 1:59 PM
→ customer cutoff
→ reviewed menu is finalized
→ subscription changes are finalized

THURSDAY 2:00 PM
→ customer notified
→ subscription locked
→ changes close
→ customer charged

THURSDAY 3:00 PM
→ failed billing customers handled / consolidated

FRIDAY 9:00 AM
→ Meal Report
→ Delivery Order
→ Delivery Report

Every other day:
→ relevant menu / operational / sales & marketing activities

IMPORTANT:
Do not change these times unless another approved requirement explicitly
overrides them.

==================================================
STEP 6 — MEAL PLAN SUBSCRIPTION LOGIC
==================================================

Preserve correct existing functionality for:

- Active
- Paused
- Renewal Due
- Cancelled

Billing:
- Bi-Weekly
- Monthly

Pause:
- 1 week
- 2 weeks
- 3 weeks
- 4 weeks

Pause must use whole weeks.

Pause and Cancel must remain separate.

Preserve:
- next billing date
- next delivery
- plan information
- billing status
- menu review status

Do not create unrestricted box-building behaviour.

==================================================
STEP 7 — DELIVERY WORKFLOW
==================================================

Do not create a Rider Mobile App.

The documented operational workflow is:

Customer Order
→ Fulfillment / Order Data
→ Logistics Admin exports / prepares delivery list
→ Address / route organisation
→ Driver communication
→ Delivery
→ Completed or Failed Delivery

The prototype may represent:
- route grouping
- driver assignment
- delivery status
- delivery notes
- failed delivery
- reattempt

Do NOT create a separate rider application.

==================================================
STEP 8 — EXPORT / REPORT RECONCILIATION
==================================================

Inspect all existing report/export interfaces.

Check whether the prototype properly supports the documented operational
exports:

- Delivery Order (DO)
- Meal Report
- Delivery Report
- Frozen Stock Report
- Marketing Report
- Inventory Report

Where appropriate support:
- Preview
- Print
- PDF
- Excel
- CSV

Keep Ready Series and Meal Plans clearly separated.

Do not invent reports not supported by the source documents.

==================================================
STEP 9 — INVENTORY RECONCILIATION
==================================================

Verify the existing Inventory interface against the source requirements.

Required concepts include:
- current stock
- physical stock
- rolling stock
- stock threshold / par level where applicable
- stock update
- new stock ready to sell
- audit date

Do not introduce Procurement into the current active workflow.

==================================================
STEP 10 — KITCHEN / PRODUCTION RECONCILIATION
==================================================

Verify:

READY SERIES production
and
MEAL PLAN production

remain separate.

Existing production functionality should be preserved where correct.

Do not create a new kitchen application.

==================================================
STEP 11 — WALLET / CREDIT
==================================================

Wallet must function as an internal credit ledger.

Support where already applicable:
- Add credit
- Deduct credit
- Current balance
- Transaction history
- Reason
- User
- Timestamp

Manual adjustments should be auditable.

Do not turn this into a payment processor.

==================================================
STEP 12 — FINANCE / BILLING
==================================================

Preserve the Shopify boundary.

Admin may:
- display transactions
- display failed payments
- display billing state
- display refund status
- record administrative handling

Shopify remains responsible for execution of commerce/payment/refund
transactions.

Do not create a replacement payment system.

==================================================
STEP 13 — ACCESS CONTROL / SETTINGS / AUDIT
==================================================

Review the existing:

- Access Control
- Admin Settings
- Audit Logs

Preserve already-correct functionality.

Verify that important actions can be audited, including:
- subscription changes
- pause/resume
- wallet adjustments
- billing-related actions
- permission changes
- manual operational changes
- exports
- automation results where applicable

Do not redesign these areas unnecessarily.

==================================================
STEP 14 — DEFERRED MODULES
==================================================

The following are deferred from the current implementation scope:

- Procurement
- Packaging
- Rider Mobile App
- Executive BI / Executive Control
- Business Rules Engine
- Other explicitly deferred Phase 2 / Phase 3 enterprise modules

Again:

HIDE THEM FROM ACTIVE NAVIGATION / CURRENT WORKFLOW.

DO NOT DELETE THEIR CODE.

==================================================
STEP 15 — TERMINOLOGY
==================================================

All visible terminology must use:

Performance Meals
Ready Series
Meal Plans

Remove visible legacy terminology where it appears in the user-facing UI.

Do not rename internal files or historical code identifiers unless required for
the UI.

==================================================
FINAL QA REQUIREMENT
==================================================

After comparing the entire Admin prototype against ALL attached source
documents:

Create NO duplicate screens.

Do NOT rebuild correct screens.

Do NOT redesign the portal.

Only correct actual discrepancies.

Before finishing, verify:

✓ Existing correct functionality was preserved.
✓ Ready Series remains separate from Meal Plans.
✓ Required Ready Series workflows are represented.
✓ Required Meal Plan workflows are represented.
✓ Required operational timing is represented.
✓ Required reports/exports are represented.
✓ Shopify remains the commerce system of record.
✓ No Rider App is introduced.
✓ Deferred modules are hidden, NOT deleted.
✓ No unsupported functionality was invented.
✓ No visible legacy brand terminology remains.
✓ Admin navigation reflects the approved current scope.

MOST IMPORTANT INSTRUCTION:

THIS IS A RECONCILIATION PASS.

INSPECT → COMPARE → IDENTIFY GAP → CORRECT ONLY THE GAP.

DO NOT ASSUME SOMETHING IS MISSING JUST BECAUSE IT IS NOT STATED IN THIS
PROMPT.

DO NOT CHANGE SOMETHING THAT IS ALREADY CORRECT.

PRESERVE THE EXISTING WORK.