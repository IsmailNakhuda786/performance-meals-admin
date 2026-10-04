PERFORMANCE MEALS ADMIN PLATFORM
FINAL REFINEMENT — ROLE ARCHITECTURE, ACL, ADMIN SETTINGS, AUTHENTICATION & DO EXECUTION

IMPORTANT:

This is the FINAL refinement of the existing Performance Meals Admin Portal.

DO NOT create a new application.

DO NOT duplicate the existing 42-screen system.

Update the current prototype in place.

Preserve the existing visual language, navigation, layouts, and business-unit separation.

Focus only on completing and correcting:

1. Complete role catalogue
2. Role mutability
3. ACL behavior
4. Department ownership
5. Admin Settings
6. Authentication behavior
7. Permission requests
8. Escalation requests
9. DO printing and downloading
10. Workflow ownership
11. Audit requirements

============================================================
1. NON-NEGOTIABLE BUSINESS SEPARATION
============================================================

Performance Meals has two separate business units:

READY SERIES

MEAL PLANS

They must NEVER be mixed operationally.

Never merge:

- Orders
- Production
- Kitchen queues
- Delivery Orders
- Dispatch queues
- Business-unit workflows
- Subscriber workflows
- Operational reporting

Shared departments may access both streams only when authorized.

Every shared screen must clearly identify:

READY SERIES

MEAL PLANS

SHARED

============================================================
2. COMPLETE ROLE CATALOGUE
============================================================

Create the following real organizational roles.

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

ADMINISTRATION / IT

32. IT / System Administrator
33. HR / People Manager

Display role, department, responsibilities, permissions and status for every role.

============================================================
3. CRITICAL ROLE MUTABILITY RULE
============================================================

IMPORTANT:

NO ROLE IS PERMANENTLY LOCKED.

EVERY USER ROLE MUST BE CHANGEABLE.

This includes:

- Super Admin
- Managing Director
- Operations Director
- Department Heads
- Managers
- Executives
- Kitchen Staff
- Chefs
- Dispatchers
- Riders
- Finance
- Marketing
- Support
- IT
- HR

A user currently assigned as Super Admin must still be represented in the role-management interface as a role that can be changed.

Example:

Super Admin
↓
Change Role
↓
Manager

or:

Manager
↓
Change Role
↓
Super Admin

or:

Chef
↓
Change Role
↓
Kitchen Manager

Role changes must NOT be hard-coded or visually disabled simply because of the current role.

============================================================
4. ROLE CHANGE SAFETY
============================================================

Changing any user's role is a privileged action.

Before confirmation show:

Current Role
New Role
Current Department
New Department if applicable
Permissions Being Added
Permissions Being Removed
Potential Impact

Require confirmation.

Record:

Changed By
Changed User
Old Role
New Role
Timestamp
Reason

Create Audit Log entry.

============================================================
5. DEPARTMENT CHANGE
============================================================

A user's department must also be changeable.

Example:

Marketing Executive
→ Operations Executive

Kitchen Staff
→ Customer Support Agent

Rider
→ Dispatch Manager

When department changes:

Show the resulting permissions.

Automatically remove permissions that are no longer valid for the old department unless explicitly retained by the new role.

Require confirmation.

Record the change in Audit Logs.

============================================================
6. SUPER ADMIN RULE
============================================================

Super Admin has full access by default.

However:

Super Admin is NOT a permanent immutable role.

The system must allow a properly authorized administrator to change a Super Admin's role.

When changing the LAST remaining Super Admin:

Show a high-risk warning.

Require explicit confirmation.

Require assignment of another full administrator before allowing the final Super Admin role to be removed.

Do NOT allow the system to accidentally end up with zero full administrators.

============================================================
7. COMPLETE ACL MODEL
============================================================

Permissions:

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
- Menu Planning
- Kitchen
- Production
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

Create a real permission matrix.

Show:

FULL ACCESS
PARTIAL ACCESS
NO ACCESS

Also allow individual permission editing when authorized.

============================================================
8. DEPARTMENT HEAD ACL RULE
============================================================

Department Heads can manage users only inside their own department.

Example:

Marketing Manager can:

- Invite Marketing users
- Change Marketing roles
- Assign approved Marketing permissions
- Remove Marketing access

Marketing Manager cannot grant:

- Kitchen permissions
- Finance permissions
- Rider permissions
- IT permissions

Kitchen Manager cannot grant Finance access.

Delivery Manager cannot grant Marketing access.

Finance Manager cannot grant Kitchen access.

Only authorized higher-level administration can cross department boundaries.

============================================================
9. ADMIN SETTINGS — COMPLETE
============================================================

The existing Admin Settings screen must remain fully functional.

Create / maintain these sections:

MY PROFILE

- Profile photo
- Full name
- Job title
- Department
- Role
- Email
- Phone
- Employee ID
- About Me

Role and department may be displayed as read-only when the logged-in user is not authorized to change them.

============================================================

SECURITY

- Change Password
- Confirm Password
- Two-Factor Authentication
- Active Sessions
- Sign Out Other Sessions
- Login History
- Failed Login History
- Security Alerts

============================================================

NOTIFICATIONS

Allow personal notification preferences.

Channels:

- Email
- In-App
- WhatsApp where authorized

Events:

- Failed Payment
- Refund Request
- Inventory Alert
- Delivery Failure
- Menu Reminder
- Permission Request
- Escalation
- System Alert

Only expose notification controls the user is permitted to configure.

============================================================

MY ACCESS

Display:

- Current Department
- Current Role
- Modules Available
- Permission Level
- Access Granted By
- Last Modified

============================================================

PERMISSION REQUESTS

Allow users to request:

- Module Access
- View Permission
- Edit Permission
- Export Permission
- Temporary Access
- Additional Department Permission where appropriate

Fields:

- Requested Module
- Requested Permission
- Reason
- Duration if temporary

Status:

Pending
Approved
Rejected
Expired

============================================================

ESCALATION REQUESTS

Allow operational staff to escalate:

- Customer issues
- Refund approvals
- Delivery exceptions
- Inventory exceptions
- Menu exceptions
- Permission problems

Show:

Requester
Department
Priority
Reason
Assigned To
Status
Date

============================================================

TEAM MANAGEMENT

Only show this tab to users authorized to manage their team.

Department Heads can manage their department.

Super Admin can manage all departments.

============================================================

SYSTEM SETTINGS

Only authorized roles can see system-wide settings.

Do not expose system controls to ordinary staff.

============================================================
10. AUTHENTICATION MODEL
============================================================

The Department Login screen may remain as the visual entry point.

However, department selection MUST NOT be treated as the security authority.

Correct logic:

User enters credentials
↓
Authentication
↓
System identifies user
↓
System determines department
↓
System determines role
↓
System determines permissions
↓
Authorized workspace loads

Do not grant access merely because the user selected a department tile.

If the selected department does not match the authenticated user's assigned department:

show an appropriate access message.

============================================================
11. DO — DELIVERY ORDER EXECUTION
============================================================

DO = Delivery Order.

The existing DO Export Center must support REAL operational execution.

The user must be able to:

1. Select date
2. Select business unit
3. Select delivery batch / window
4. Preview records
5. Confirm export
6. Print
7. Download
8. Reprint / re-download when authorized

Business-unit options:

READY SERIES

MEAL PLANS

Do NOT provide an unlabeled combined DO.

============================================================
12. DO CONTENT
============================================================

EVERY DELIVERY ORDER / DELIVERY MANIFEST MUST IDENTIFY:

- Business Unit
- Order Number / Subscription ID
- Customer Name
- Customer Address
- Contact Number
- Delivery Date
- Delivery Window
- Rider
- Route / Batch
- Product / Meal
- Quantity
- Special Delivery Notes
- Relevant order status

For Meal Plans include the required meal information for that delivery day.

============================================================
13. DO PRINTING
============================================================

PRINTING MUST BE A REAL USER ACTION.

Provide:

PRINT

button.

Print action opens a print-ready layout.

The printed document must be properly formatted for operational use.

Include:

- Performance Meals heading
- Business Unit
- Delivery Date
- Batch / Route
- Customer information
- Delivery information
- Products / meals
- Quantity
- Notes

Use a clean printer-friendly layout.

Do NOT rely only on the browser page screenshot.

============================================================
14. DO DOWNLOAD
============================================================

Provide explicit download actions.

Required formats:

DOWNLOAD PDF
DOWNLOAD EXCEL
DOWNLOAD CSV

The user must be able to select the format.

Show download confirmation.

After download, log:

User
Business Unit
Export Type
Date
Time
Format
Number of Records

============================================================
15. DO REPRINT / RE-DOWNLOAD
============================================================

Authorized staff must be able to retrieve a previously generated DO.

Show:

Export History

Columns:

- Export ID
- Business Unit
- Export Type
- Date
- Generated By
- Format
- Record Count

Actions:

- View
- Print Again
- Download Again

Every reprint and re-download should be auditable.

============================================================
16. DO CHANGE CONTROL
============================================================

If an order changes after a DO has already been created:

Show a warning.

Example:

"Order changed after Delivery Order generation."

Show:

Previous Version
Updated Version
Changed Fields
Changed By
Timestamp

Require regeneration of the DO where operationally necessary.

Do not silently overwrite previously generated operational records.

============================================================
17. KITCHEN HANDOFF
============================================================

Ensure the DO and kitchen workflows are connected.

Workflow:

Order / Subscription
↓
Menu Confirmation where required
↓
Production Requirement
↓
Kitchen Production
↓
Packing
↓
DO Generation
↓
Dispatch
↓
Rider

Ready Series and Meal Plans remain separate throughout.

============================================================
18. WORKFLOW OWNERSHIP
============================================================

Every operational stage must show:

CURRENT OWNER
NEXT OWNER
STATUS
AVAILABLE ACTIONS

Example:

Meal Plan Menu Review
Owner: Operations / Authorized Support
Next: Kitchen

Kitchen Production
Owner: Kitchen
Next: Packing

Packing
Owner: Kitchen / Fulfillment
Next: Dispatch

Dispatch
Owner: Delivery / Dispatch

Delivery
Owner: Rider

============================================================
19. CUSTOMER CHANGE PROPAGATION
============================================================

When authorized Support changes:

- Address
- Meal
- Pause
- Resume
- Customer information

show downstream impact.

Example:

Meal Swap
↓
Subscriber record updated
↓
Kitchen requirement recalculated
↓
Packing requirement updated
↓
DO updated if applicable
↓
Dispatch record updated if applicable
↓
Audit Log created

============================================================
20. AUDIT LOG REQUIREMENTS
============================================================

Every consequential administrative action must be logged.

Examples:

- Role change
- Department change
- Permission change
- Password/security change where appropriate
- Customer data change
- Meal override
- Meal swap
- Pause
- Resume
- Cancellation
- Refund decision
- Wallet adjustment
- Inventory adjustment
- Production status
- Rider assignment
- DO generation
- DO print
- DO download
- DO reprint
- DO re-download

Log:

Who
What
When
Where
Previous State
New State
Reason

============================================================
21. FINAL UI REQUIREMENT
============================================================

Do not create unnecessary new dashboards.

Modify the existing prototype.

Use:

- Existing navigation
- Existing components
- Existing visual language
- Existing RS / MP separation

Add only the necessary controls, states, modals, permissions, profile settings and workflow connections.

============================================================
22. FINAL QA CHECKLIST
============================================================

Before considering this refinement complete, verify:

[ ] All 33+ real organizational roles exist
[ ] Every role can be changed
[ ] Super Admin role is mutable
[ ] Department changes are supported
[ ] Department Heads cannot cross department boundaries
[ ] Permission matrix is functional
[ ] Admin profile exists
[ ] Password change exists
[ ] 2FA exists
[ ] Session management exists
[ ] Notification preferences exist
[ ] My Access exists
[ ] Permission Requests exist
[ ] Escalation Requests exist
[ ] Team Management is permission-controlled
[ ] System Settings are permission-controlled
[ ] Authentication determines actual department and role
[ ] Ready Series remains separate
[ ] Meal Plans remains separate
[ ] Kitchen queues remain separate
[ ] Dispatch queues remain separate
[ ] DO exports remain separate
[ ] DO can be printed
[ ] DO can be downloaded as PDF
[ ] DO can be downloaded as Excel
[ ] DO can be downloaded as CSV
[ ] DO can be reprinted
[ ] DO can be re-downloaded
[ ] DO exports are audited
[ ] DO changes are version-aware
[ ] Customer changes propagate operationally
[ ] Role changes are audited
[ ] Permission changes are audited
[ ] Critical actions require confirmation

============================================================
FINAL INSTRUCTION

This is the final functional refinement.

Do not generate a new unrelated application.

Update the existing Performance Meals Admin Portal so that it represents a complete, role-aware, operationally separated administration system.

Prioritize functional clarity over decorative design.

Every screen must answer:

WHO can see this?
WHO can change this?
WHO approves this?
WHAT happens next?
WHERE does the information go?
HOW is the action recorded?

The final prototype should be suitable for development handoff and stakeholder review.