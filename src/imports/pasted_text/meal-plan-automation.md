FINAL REFINEMENT — MEAL PLAN AUTOMATION, ORDER GENERATION, PAYMENT/CREDIT INTEGRITY & ADMIN CONTROLS

IMPORTANT:
Do NOT create a new admin application.
Do NOT redesign the existing admin portal.
Do NOT add unnecessary enterprise/ERP modules.
Do NOT create a rider mobile app.
Do NOT create a separate customer app.
Preserve the existing visual design, navigation, department separation, Ready Series vs Meal Plans separation, and existing admin structure.

This is a targeted Phase 1 refinement based on the latest business logic supplied by Jerome.

The purpose is to document and visually represent the ACTUAL Meal Plan automation and exception rules so the prototype is implementation-ready.

==================================================
1. AUTOMATIC DEFAULT ORDER GENERATION
==================================================

Add/extend the existing Meal Plans / Subscriptions area with an "Automatic Order Generation" capability.

The automation runs:

EVERY THURSDAY AT 2:55 PM GMT+8

The UI should clearly display:
- Automation status: Active / Paused
- Last run timestamp
- Next scheduled run
- Number evaluated
- Orders created
- Skipped
- Insufficient credit
- Paused subscribers
- Missing default delivery days
- Failed/exception cases

DO NOT invent different business rules.

==================================================
2. EXACT AUTOMATION LOGIC
==================================================

For each eligible Meal Plan subscriber:

STEP 1
Has the user selected Default Delivery Days?

NO:
→ END
→ No automatic default orders apply.

YES:
→ Continue.

STEP 2
Is the user subscription currently paused?

YES:
→ END
→ No automatic default orders apply.

NO:
→ Continue.

STEP 3
Does the user have sufficient credit?

NO:
→ Send Top-Up Notification
→ END
→ No automatic default orders apply.

YES:
→ Continue.

STEP 4
Determine subscribed dinner plan:
- 2 dinners/week
- 3 dinners/week
- 4 dinners/week
- 5 dinners/week

STEP 5
Check whether the user has already placed any orders for the applicable period.

For 5 dinners/week:
- No orders → apply selected default delivery days.
- Any existing orders → END.

For 2 / 3 / 4 dinners/week:
- No orders → apply selected default delivery days.
- Any existing orders → END.

IMPORTANT:
Do not interpret "existing orders" as "existing subscription".
The system must check actual orders for the applicable period.

==================================================
3. AUTOMATIC ORDER PREVIEW
==================================================

Add a preview/detail state for an automation run.

For each subscriber show:

- Subscriber name
- Subscription ID
- Plan
- Dinner frequency
- Default delivery days
- Selected delivery timeslot
- Current credit
- Required credit
- Pause status
- Existing order status
- Menu assigned
- Delivery dates
- Junior items if applicable
- Calculated price
- Final automation result

Possible results:
- Order Created
- Skipped — No Default Days
- Skipped — Insufficient Credit
- Skipped — Subscription Paused
- Skipped — Existing Order
- Failed — Invalid Menu
- Failed — Pricing Validation
- Failed — Delivery Slot Validation
- Failed — Other

==================================================
4. MENU DATE VALIDATION
==================================================

Fix the current issue where menu items can randomly appear on dates for which they are not valid.

The system must associate:

MENU ITEM
→ VALID MENU DATE
→ DELIVERY DATE
→ ORDER

Do NOT allow an automatic order to select a meal that is unavailable for its assigned delivery date.

Show a clear validation warning when a menu/date combination is invalid.

Example:

"Chicken Teriyaki is not available for Tuesday delivery."

The admin must be able to identify the affected subscriber/order.

==================================================
5. DELIVERY TIMESLOT
==================================================

Fix the current issue where automatically generated orders receive an incorrect delivery timeslot.

Automatic orders MUST inherit:

Customer's selected/default delivery timeslot.

Do NOT use a generic system default unless the business rules explicitly define one.

Show:
- Customer selected slot
- Generated order slot
- Validation status

Example:

Customer preference:
6:00 PM–8:00 PM

Generated order:
6:00 PM–8:00 PM

Status:
MATCHED

==================================================
6. JUNIOR ITEM PRICING
==================================================

Fix the known pricing problem:

"Automatic junior items are priced wrongly."

Automatic order generation must use the correct junior-item pricing rule.

Show in the automation preview:

- Item
- Item type
- Quantity
- Base price
- Applicable pricing rule
- Final price

Do NOT invent a new junior pricing value.
Represent the pricing as rule-driven/configurable.

Allow the Business Rules / Settings area to define the applicable junior pricing rule.

==================================================
7. CREDIT / PAYMENT INTEGRITY
==================================================

This is a HIGH PRIORITY requirement.

The current system has "phantom credit renewals" where credit can appear without confirmed real payment.

The prototype must clearly enforce this boundary:

REAL PAYMENT
→ PAYMENT PROVIDER CONFIRMATION
→ SUCCESSFUL PAYMENT EVENT
→ CREDIT TRANSACTION
→ CUSTOMER BALANCE UPDATE

Never:

RENEWAL EVENT
→ CREDIT ADDED

Credit must NOT be granted simply because a renewal process executes.

Add appropriate status concepts:
- Payment Pending
- Payment Successful
- Payment Failed
- Credit Applied
- Credit Not Applied

Show transaction/reference information where applicable.

The admin interface must make it obvious that payment confirmation is required before credit is disbursed.

==================================================
8. PAUSE DINNER PLAN RULE
==================================================

Extend the existing Pause Management functionality.

Pause options:
- 1 week
- 2 weeks
- 3 weeks
- 4 weeks

Show:
- Pause start date
- Pause end date
- Current pause status

IMPORTANT AUTOMATION RULE:

If subscription is paused:
→ No automatic default orders are created.

Show this rule visibly in the subscription/automation detail.

Example:

Subscription Status:
PAUSED

Automatic Default Order:
BLOCKED

Reason:
"Subscription is currently paused."

==================================================
9. ADMIN MENU CHANGE
==================================================

Extend the existing Meal Plan Menu Review / Subscriber workflow.

Admin users with the appropriate permission must be able to:

- View selected meal
- Change selected meal
- See original selection
- See replacement meal
- Enter reason
- Save change

The change must be clearly associated with:
- Subscriber
- Delivery date
- Order/subscription
- Admin user
- Timestamp
- Reason

Do not allow menu changes to bypass menu/date validity.

==================================================
10. REFUND WORKFLOW
==================================================

Add/refine refund functionality within the existing Finance / Refund Management workflow.

Admin can:
- Request refund
- Review refund
- Approve / Reject / Escalate
- Enter reason
- View order/subscriber reference

IMPORTANT:
The custom admin interface does NOT become the payment processor.

The admin records the refund decision.
The Shopify/payment layer executes the actual financial refund.

Clearly preserve this boundary.

==================================================
11. TRANSACTION HISTORY DESCRIPTION EDITOR
==================================================

Allow authorized admins to edit the human-readable transaction description.

The description change must NOT modify:
- transaction amount
- payment status
- payment provider transaction ID
- original financial record

Record:
- Previous description
- New description
- Changed by
- Timestamp

==================================================
12. AUTOMATION RUN HISTORY
==================================================

Add a lightweight "Automation History" section under Meal Plans / Operations.

Show previous runs:

- Run date/time
- Number evaluated
- Orders created
- Skipped
- Failed
- Top-up notifications
- Run status

Clicking a run shows subscriber-level results.

==================================================
13. AUDIT TRAIL
==================================================

All sensitive actions must be represented as auditable events:

- Automatic order creation
- Menu change
- Refund decision
- Wallet/credit adjustment
- Pause/resume
- Transaction description edit
- Pricing-rule change
- Delivery-slot override

Show:
- User
- Role
- Timestamp
- Action
- Object affected
- Previous value
- New value
- Reason where applicable

Do not imply that frontend UI alone provides security.
This is a functional/admin blueprint for server-side authorization and audit implementation.

==================================================
14. SHOPIFY BOUNDARY
==================================================

Preserve the architectural boundary:

SHOPIFY:
- Commerce
- Orders
- Products
- Customers
- Payments
- Refund execution
- Checkout

CUSTOM PERFORMANCE MEALS APPLICATION / LOGIC:
- Meal Plan subscription rules
- Default delivery days
- Automatic order generation
- Menu/date validation
- Meal selections
- Pause rules
- Operational workflow
- Wallet/credit business rules
- Delivery scheduling logic
- Admin operational controls
- Automation logs
- Audit records

Do not duplicate Shopify functionality unnecessarily.

==================================================
15. UI REQUIREMENT
==================================================

Reuse existing components, tables, modals, filters and design system.

Do not create another dashboard.

Use:
- Automation status card
- Run history table
- Subscriber automation detail drawer/modal
- Validation/error badges
- Business-rule indicators
- Audit timeline

Keep the UI clean and operational.

==================================================
16. FINAL ACCEPTANCE CRITERIA
==================================================

The final prototype must visibly demonstrate that:

1. Thursday 2:55 PM GMT+8 automation exists.
2. Default delivery days are required.
3. Paused subscriptions create no automatic orders.
4. Insufficient credit creates no automatic order and triggers top-up notification.
5. Existing orders prevent automatic default orders.
6. 2/3/4/5 dinner plans are supported.
7. Menu items cannot be assigned to invalid dates.
8. Automatic orders inherit the customer's selected delivery timeslot.
9. Junior pricing is rule-driven and no longer blindly mispriced.
10. Credit cannot be granted without confirmed payment.
11. Admin can change menu items with reason/audit.
12. Refund workflow respects Shopify/payment execution boundaries.
13. Transaction descriptions can be edited without changing financial values.
14. Automation history is available.
15. Sensitive actions are auditable.
16. Ready Series and Meal Plans remain operationally separated.
17. No rider app or separate ERP is introduced.
18. Existing admin design/navigation is preserved.

FINAL NOTE:
This is the FINAL targeted refinement of the current admin prototype.
Do not expand scope beyond these requirements.
Do not invent missing business rules.