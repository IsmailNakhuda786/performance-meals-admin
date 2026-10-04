PERFORMANCE MEALS ADMIN PLATFORM
PROMPT 7A — FINAL BUSINESS LOGIC & DATA-INTEGRITY CORRECTION

IMPORTANT:
This is a correction pass on the EXISTING Performance Meals Admin Portal.

DO NOT create a new application.
DO NOT redesign the portal.
DO NOT add new modules.
DO NOT create a rider mobile app.
DO NOT create a customer app.
DO NOT remove existing business-unit separation.
DO NOT change unrelated screens.

Use the existing screens and components already implemented.

This pass ONLY corrects and completes the Meal Plan business logic, automation, menu/date validation, payment/credit integrity and related admin workflows.

==================================================
1. THURSDAY AUTOMATIC DEFAULT ORDER ENGINE
==================================================

Preserve the exact schedule:

EVERY THURSDAY AT 2:55 PM GMT+8

For each eligible Meal Plan subscriber:

1. Has Default Delivery Days been selected?

NO:
→ STOP
→ No automatic default order.

YES:
→ continue.

2. Is the subscription currently PAUSED?

YES:
→ STOP
→ No automatic default order.

NO:
→ continue.

3. Does the customer have sufficient confirmed credit?

NO:
→ Send Top-Up Notification
→ STOP
→ No automatic default order.

YES:
→ continue.

4. Determine dinner plan:
- 2 dinners/week
- 3 dinners/week
- 4 dinners/week
- 5 dinners/week

5. Check actual customer orders for the applicable period.

If NO existing order:
→ apply the customer's selected default delivery days.

If ANY applicable order already exists:
→ STOP
→ No automatic default order.

IMPORTANT:
"Existing order" means an actual order for the applicable period.
Do not treat subscription existence as an order.

==================================================
2. AUTOMATION RESULT STATES
==================================================

The automation result model MUST visibly support:

- Order Created
- Skipped — No Default Delivery Days
- Skipped — Subscription Paused
- Skipped — Insufficient Credit
- Skipped — Existing Order
- Failed — Invalid Menu
- Failed — Pricing Validation
- Failed — Delivery Slot Validation
- Failed — Other

Each result must identify:
- Subscriber
- Subscription ID
- Plan
- Dinner frequency
- Applicable period
- Default delivery days
- Delivery dates
- Timeslot
- Credit
- Required amount
- Result
- Reason where applicable

Do not collapse all failures into a generic "Failed" state.

==================================================
3. MENU / DELIVERY DATE VALIDATION
==================================================

IMPORTANT CORRECTION:

Do NOT validate all meals against one hardcoded delivery day.

For EVERY automatically generated or administratively changed meal:

Meal
→ Actual delivery date
→ Weekday
→ Menu availability rule
→ VALID / INVALID

Example:

Customer delivery days:
Tuesday / Thursday / Saturday

Validate each meal independently against:
Tuesday
Thursday
Saturday

If a meal is unavailable on one date:
- Mark that date INVALID
- Show the affected meal
- Show the date
- Show the reason
- Require admin resolution

An invalid menu/date combination MUST NOT proceed silently to order creation.

==================================================
4. DELIVERY TIMESLOT VALIDATION
==================================================

Automatic orders must inherit the customer's saved/selected delivery timeslot.

Show:

Customer Timeslot
Generated Order Timeslot
Validation Result

Possible results:
- MATCHED
- MISMATCH — ADMIN ACTION REQUIRED

Do not use a generic system default unless an explicit business rule exists.

==================================================
5. JUNIOR ITEM PRICING
==================================================

The current problem is:

Automatic junior items can be priced incorrectly.

The prototype must represent rule-driven junior pricing.

Show:
- Item
- Item type
- Base price
- Pricing rule
- Final calculated price
- Validation result

Do NOT invent or hardcode a new junior price.

The final pricing value must be configurable through the Business Rules area once the business confirms it.

==================================================
6. PAYMENT / CREDIT INTEGRITY
==================================================

Preserve this exact financial boundary:

REAL PAYMENT
→ PAYMENT PROVIDER CONFIRMATION
→ SUCCESSFUL PAYMENT EVENT
→ CREDIT TRANSACTION
→ CUSTOMER BALANCE UPDATE

NEVER:

RENEWAL EVENT
→ CREDIT ADDED
without confirmed payment.

The UI must clearly distinguish:

Payment Pending
Payment Successful
Payment Failed
Credit Applied
Credit Not Applied

Payment-backed credit requires confirmed payment.

==================================================
7. MANUAL CREDIT ADJUSTMENT
==================================================

Manual admin adjustments may remain in the prototype.

However, clearly distinguish:

PAYMENT-BACKED CREDIT
from
MANUAL ADMIN ADJUSTMENT

Manual adjustment must require:
- Customer
- Amount or points
- Reason
- Admin identity
- Timestamp
- Audit event

Do not represent a manual adjustment as proof that a payment occurred.

==================================================
8. ADMIN MEAL CHANGE
==================================================

Keep the existing Meal Review / Admin Override workflow.

Admin must be able to:
- View original selection
- Select replacement meal
- Select delivery date
- Enter mandatory reason
- Save change

After saving, visually show the intended downstream propagation:

ADMIN CHANGE
→ SUBSCRIBER RECORD
→ ORDER
→ KITCHEN / PACKING
→ DELIVERY ORDER
→ CUSTOMER NOTIFICATION
→ AUDIT LOG

The replacement meal must still pass menu/date validation.

==================================================
9. REFUND WORKFLOW
==================================================

Preserve the Shopify boundary.

This portal:
- Records refund request
- Reviews refund
- Approves / rejects / escalates
- Records reason and audit information

This portal does NOT become the payment processor.

Financial execution remains with the Shopify/payment layer.

==================================================
10. TRANSACTION DESCRIPTION EDITOR
==================================================

Keep the existing description editor.

Editing a description MUST NOT change:
- Amount
- Payment status
- Payment provider transaction ID
- Original financial transaction

Store:
- Previous description
- New description
- Changed by
- Timestamp

==================================================
11. AUTOMATION HISTORY
==================================================

Keep the existing Automation History.

Each run must show:
- Run date/time
- Evaluated
- Created
- Skipped
- Failed
- Top-up notifications
- Failure categories

Clicking a run must expose subscriber-level results.

==================================================
12. FINAL BUSINESS-LOGIC QA
==================================================

Before finishing this prompt, verify all of the following:

□ Thursday 2:55 PM GMT+8 remains unchanged
□ No-default-days stops automation
□ Pause stops automation
□ Insufficient credit stops order creation
□ Top-up notification is triggered for insufficient credit
□ Existing orders prevent automatic defaults
□ 2/3/4/5 dinner plans are represented
□ Menu validation uses each ACTUAL delivery date
□ Timeslot is inherited from customer preference
□ Junior pricing is rule-driven
□ Credit cannot be granted without confirmed payment
□ Manual adjustments are clearly distinguished
□ Admin meal changes require a reason
□ Admin meal changes propagate downstream conceptually
□ Refunds respect Shopify/payment execution boundaries
□ Transaction descriptions can be edited without changing financial values
□ Automation history shows the required results

IMPORTANT:
Do not make unrelated changes.
Do not add new modules.
Do not redesign existing screens.