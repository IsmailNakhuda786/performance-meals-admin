import { useEffect, useMemo, useState } from "react";
import { customers as initialCustomers, goalLabel, orders, subscriptions, type Customer, type CustomerStatus } from "../data";

type ProfileTab = "overview" | "subscription" | "orders" | "billing" | "activity" | "notes";
type ProfileAction = "edit-profile" | "edit-plan" | "pause" | "resume" | "credit" | "refund" | "password-reset" | "cancel";

const tabs: { id: ProfileTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "subscription", label: "Subscription" },
  { id: "orders", label: "Orders & Meals" },
  { id: "billing", label: "Billing & Refunds" },
  { id: "activity", label: "Activity & Reports" },
  { id: "notes", label: "Notes" },
];

const statusClass: Record<CustomerStatus, string> = {
  Active: "bg-green-950/30 text-green-400",
  Paused: "bg-yellow-950/30 text-yellow-400",
  "Renewal Due": "bg-orange-950/30 text-orange-400",
  Cancelled: "bg-red-950/30 text-red-400",
};

export default function CustomerProfile({ initialCustomerId }: { initialCustomerId?: string }) {
  const [customerRows, setCustomerRows] = useState(initialCustomers);
  const [selectedId, setSelectedId] = useState(initialCustomerId ?? initialCustomers[0].id);
  const [activeTab, setActiveTab] = useState<ProfileTab>("overview");
  const [search, setSearch] = useState("");
  const [actionsOpen, setActionsOpen] = useState(false);
  const [activeAction, setActiveAction] = useState<ProfileAction | null>(null);
  const [actionValue, setActionValue] = useState("");
  const [actionNote, setActionNote] = useState("");
  const [actionError, setActionError] = useState("");
  const [success, setSuccess] = useState("");
  const [pendingCancellations, setPendingCancellations] = useState<string[]>([]);
  const [refundRequests, setRefundRequests] = useState<Record<string, { amount: number; note: string }[]>>({});
  const [notes, setNotes] = useState<Record<string, string[]>>({});
  const [noteDraft, setNoteDraft] = useState("");

  useEffect(() => {
    if (initialCustomerId && initialCustomers.some(customer => customer.id === initialCustomerId)) {
      setSelectedId(initialCustomerId);
      setActiveTab("overview");
    }
  }, [initialCustomerId]);

  const customer = customerRows.find(item => item.id === selectedId) ?? customerRows[0];
  const subscription = subscriptions.find(item => item.customerId === customer.id);
  const customerOrders = orders.filter(order => order.customer === customer.name);
  const customerRefunds = refundRequests[customer.id] ?? [];
  const averageOrder = customerOrders.length ? customerOrders.reduce((sum, order) => sum + order.total, 0) / customerOrders.length : 0;
  const filteredCustomers = customerRows.filter(item => `${item.name} ${item.email} ${item.phone}`.toLowerCase().includes(search.toLowerCase()));

  const activity = useMemo(() => [
    ...(notes[customer.id] ?? []).map(note => ({ type: "Internal note", detail: note, date: "Just now" })),
    ...customerRefunds.map(request => ({ type: "Refund request", detail: `$${request.amount.toFixed(2)} · ${request.note}`, date: "Just now" })),
    ...customerOrders.map(order => ({ type: "Order", detail: `${order.id} · ${order.status} · $${order.total.toFixed(2)}`, date: order.date })),
    { type: "Customer joined", detail: `${customer.planType} account created`, date: customer.joinDate },
  ], [customer, customerOrders, customerRefunds, notes]);

  const updateCustomer = (changes: Partial<Customer>) => {
    setCustomerRows(current => current.map(item => item.id === customer.id ? { ...item, ...changes } : item));
  };

  const openAction = (action: ProfileAction) => {
    setActiveAction(action);
    setActionsOpen(false);
    setActionError("");
    setActionNote("");
    if (action === "edit-profile") setActionValue(customer.address);
    else if (action === "edit-plan") setActionValue(customer.planType);
    else setActionValue("");
  };

  const completeAction = () => {
    if (!activeAction) return;
    const noteRequired = ["pause", "credit", "refund", "cancel"].includes(activeAction);
    if (noteRequired && !actionNote.trim()) {
      setActionError("A support note is required for the audit trail.");
      return;
    }
    if (["edit-profile", "edit-plan", "credit", "refund"].includes(activeAction) && !actionValue.trim()) {
      setActionError("Complete the required field before continuing.");
      return;
    }
    if (["credit", "refund"].includes(activeAction) && Number(actionValue) <= 0) {
      setActionError("Enter an amount greater than $0.");
      return;
    }

    let message = "";
    if (activeAction === "edit-profile") {
      updateCustomer({ address: actionValue.trim() });
      message = `${customer.name}'s profile was updated.`;
    } else if (activeAction === "edit-plan") {
      updateCustomer({ planType: actionValue as Customer["planType"] });
      message = `${customer.name}'s plan was updated.`;
    } else if (activeAction === "pause") {
      updateCustomer({ status: "Paused" });
      message = "Subscription paused.";
    } else if (activeAction === "resume") {
      updateCustomer({ status: "Active" });
      message = "Subscription resumed.";
    } else if (activeAction === "credit") {
      updateCustomer({ walletBalance: customer.walletBalance + Number(actionValue) });
      message = `$${Number(actionValue).toFixed(2)} credit added to ${customer.name}'s wallet.`;
    } else if (activeAction === "refund") {
      setRefundRequests(current => ({
        ...current,
        [customer.id]: [{ amount: Number(actionValue), note: actionNote.trim() }, ...(current[customer.id] ?? [])],
      }));
      message = `Refund request for $${Number(actionValue).toFixed(2)} sent to Refund Management.`;
    } else if (activeAction === "password-reset") {
      message = `Password reset link sent to ${customer.email}.`;
    } else {
      setPendingCancellations(current => [...current, customer.id]);
      message = "Cancellation request submitted. Status: Pending approval.";
    }
    setSuccess(message);
    setActiveAction(null);
    setActionValue("");
    setActionNote("");
  };

  return (
    <div className="space-y-5 p-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="min-w-0 flex-1">
          <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--pm-text-muted)]">Customer profile</div>
          <div className="mt-1 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center bg-[#F5B300] text-sm font-extrabold text-black">{customer.name.split(" ").map(part => part[0]).join("")}</div>
            <div>
              <h2 className="text-xl font-extrabold">{customer.name}</h2>
              <div className="text-xs text-[var(--pm-text-muted)] mono">{customer.id} · {customer.email} · {customer.phone}</div>
            </div>
          </div>
        </div>
        <span className={`px-2 py-1 text-xs font-bold mono ${statusClass[customer.status]}`}>{customer.status}</span>
        <div className="relative">
          <button onClick={() => setActionsOpen(open => !open)} className="bg-[#F5B300] px-4 py-2 text-xs font-bold text-black mono">Customer actions</button>
          {actionsOpen && (
            <div className="absolute right-0 top-full z-40 mt-2 w-72 border border-[var(--pm-border)] bg-[var(--pm-surface)] shadow-2xl">
              {[
                { heading: "Profile", items: [["edit-profile", "Edit customer details"]] },
                ...(subscription ? [{ heading: "Subscription", items: [["edit-plan", "Change plan"], [customer.status === "Paused" ? "resume" : "pause", customer.status === "Paused" ? "Resume subscription" : "Pause subscription"], ["cancel", pendingCancellations.includes(customer.id) ? "Cancellation pending approval" : "Request cancellation"]] }] : []),
                { heading: "Financial", items: [["credit", "Add wallet credit"], ["refund", "Start refund request"]] },
                { heading: "Account access", items: [["password-reset", "Send password reset link"]] },
              ].map(group => (
                <div key={group.heading} className="border-b border-[var(--pm-border-soft)] p-2 last:border-0">
                  <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--pm-text-muted)]">{group.heading}</div>
                  {group.items.map(([action, label]) => {
                    const disabled = action === "cancel" && pendingCancellations.includes(customer.id);
                    return <button key={action} disabled={disabled} onClick={() => openAction(action as ProfileAction)} className="block w-full px-2 py-2 text-left text-xs text-[var(--pm-text-secondary)] hover:bg-[var(--pm-surface-muted)] disabled:cursor-not-allowed disabled:opacity-40">{label}</button>;
                  })}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="border border-[var(--pm-border)] bg-[var(--pm-surface)] p-3">
        <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--pm-text-muted)]">Open another customer</label>
        <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
          <input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search by name, email, or phone" className="border border-[var(--pm-border)] bg-[var(--pm-bg)] px-3 py-2 text-xs text-[var(--pm-text-secondary)]" />
          <select value={selectedId} onChange={event => {
            setSelectedId(event.target.value);
            setActiveTab("overview");
            setSuccess("");
          }} className="border border-[var(--pm-border)] bg-[var(--pm-bg)] px-3 py-2 text-sm text-[var(--pm-text-secondary)]">
            {filteredCustomers.map(item => <option key={item.id} value={item.id}>{item.name} · {item.planType}</option>)}
          </select>
        </div>
      </div>

      {success && <div role="status" className="border border-green-800/40 bg-green-950/20 px-4 py-3 text-xs font-bold text-green-400 mono">{success}</div>}

      <div className="flex overflow-x-auto border-b border-[var(--pm-border)]">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`whitespace-nowrap border-b-2 px-4 py-3 text-xs font-semibold ${activeTab === tab.id ? "border-[#F5B300] text-[var(--pm-accent-text)]" : "border-transparent text-[var(--pm-text-muted)]"}`}>{tab.label}</button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {[
                ["Lifetime value", `$${customer.ltv.toFixed(2)}`],
                ["Wallet", `$${customer.walletBalance.toFixed(2)}`],
                ["Reward points", customer.points.toLocaleString()],
                ["Orders", String(customerOrders.length)],
              ].map(([label, value]) => <div key={label} className="border border-[var(--pm-border)] bg-[var(--pm-surface)] p-4"><div className="text-[10px] uppercase tracking-wider text-[var(--pm-text-muted)]">{label}</div><div className="mt-2 text-xl font-extrabold text-[var(--pm-text-secondary)] mono">{value}</div></div>)}
            </div>
            <div className="border border-[var(--pm-border)] bg-[var(--pm-surface)] p-4">
              <div className="text-xs font-bold uppercase tracking-wider text-[var(--pm-text)]">Contact & delivery</div>
              <div className="mt-3 grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                <div><div className="text-xs text-[var(--pm-text-muted)]">Email</div><div className="mt-1">{customer.email}</div></div>
                <div><div className="text-xs text-[var(--pm-text-muted)]">Phone</div><div className="mt-1 mono">{customer.phone}</div></div>
                <div className="md:col-span-2"><div className="text-xs text-[var(--pm-text-muted)]">Delivery address</div><div className="mt-1">{customer.address}</div></div>
              </div>
            </div>
          </div>
          <div className="border border-[var(--pm-border)] bg-[var(--pm-surface)] p-4">
            <div className="text-xs font-bold uppercase tracking-wider text-[var(--pm-text)]">Current relationship</div>
            <div className="mt-3 space-y-3 text-sm">
              <div><div className="text-xs text-[var(--pm-text-muted)]">Customer type</div><div className="mt-1 font-semibold">{customer.planType}</div></div>
              <div><div className="text-xs text-[var(--pm-text-muted)]">Goal</div><div className="mt-1 font-semibold">{goalLabel(customer.goal)}</div></div>
              <div><div className="text-xs text-[var(--pm-text-muted)]">Member since</div><div className="mt-1 mono">{customer.joinDate}</div></div>
              <div><div className="text-xs text-[var(--pm-text-muted)]">Next billing</div><div className="mt-1 mono">{customer.nextBilling}</div></div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "subscription" && (
        subscription ? (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="border border-[var(--pm-border)] bg-[var(--pm-surface)] p-4 lg:col-span-2">
              <div className="text-xs font-bold uppercase tracking-wider text-[var(--pm-text)]">Subscription details</div>
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                {[["Subscription ID", subscription.id], ["Plan", subscription.mealPlanType ?? subscription.sku ?? subscription.planType], ["Programme", subscription.programme ?? subscription.term ?? "—"], ["Meals per week", String(subscription.mealsPerWeek)], ["Plan progress", subscription.planWeek], ["Next delivery", subscription.nextDelivery]].map(([label, value]) => <div key={label}><div className="text-xs text-[var(--pm-text-muted)]">{label}</div><div className="mt-1 font-semibold">{value}</div></div>)}
              </div>
            </div>
            <div className="border border-[var(--pm-border)] bg-[var(--pm-surface)] p-4">
              <div className="text-xs font-bold uppercase tracking-wider text-[var(--pm-text)]">Subscription status</div>
              <div className={`mt-4 inline-block px-2 py-1 text-xs font-bold mono ${statusClass[customer.status]}`}>{customer.status}</div>
              <div className="mt-4 text-xs text-[var(--pm-text-muted)]">Use Customer actions to change the plan, pause or resume service, or submit a cancellation request.</div>
            </div>
          </div>
        ) : <div className="border border-[var(--pm-border)] bg-[var(--pm-surface)] p-8 text-center text-sm text-[var(--pm-text-muted)]">This customer does not have an active subscription. Order history and financial actions remain available.</div>
      )}

      {activeTab === "orders" && (
        <div className="border border-[var(--pm-border)] bg-[var(--pm-surface)]">
          <table className="w-full text-sm"><thead><tr className="border-b border-[var(--pm-border)]">{["Order", "Date", "Product / Plan", "Meals", "Total", "Status"].map(label => <th key={label} className="px-4 py-2 text-left text-xs uppercase tracking-wider text-[var(--pm-text-muted)]">{label}</th>)}</tr></thead><tbody>{customerOrders.map(order => <tr key={order.id} className="border-b border-[var(--pm-border-soft)]"><td className="px-4 py-3 text-xs font-bold text-[var(--pm-accent-text)] mono">{order.id}</td><td className="px-4 py-3 text-xs mono">{order.date}</td><td className="px-4 py-3 text-xs">{order.productName ?? order.planType}</td><td className="px-4 py-3 text-xs mono">{order.meals}</td><td className="px-4 py-3 text-xs font-bold mono">${order.total.toFixed(2)}</td><td className="px-4 py-3 text-xs">{order.status}</td></tr>)}</tbody></table>
          {!customerOrders.length && <div className="p-8 text-center text-sm text-[var(--pm-text-muted)]">No orders found for this customer.</div>}
        </div>
      )}

      {activeTab === "billing" && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="border border-[var(--pm-border)] bg-[var(--pm-surface)] p-4">
            <div className="text-xs font-bold uppercase tracking-wider text-[var(--pm-text)]">Billing summary</div>
            <div className="mt-4 grid grid-cols-2 gap-3"><div className="border border-[var(--pm-border)] bg-[var(--pm-bg)] p-3"><div className="text-xs text-[var(--pm-text-muted)]">Lifetime value</div><div className="mt-1 text-xl font-bold mono">${customer.ltv.toFixed(2)}</div></div><div className="border border-[var(--pm-border)] bg-[var(--pm-bg)] p-3"><div className="text-xs text-[var(--pm-text-muted)]">Average order</div><div className="mt-1 text-xl font-bold mono">${averageOrder.toFixed(2)}</div></div></div>
            <div className="mt-3 border border-blue-900/40 bg-blue-950/10 p-3 text-xs text-blue-300">Shopify remains responsible for payment and refund execution.</div>
          </div>
          <div className="border border-[var(--pm-border)] bg-[var(--pm-surface)] p-4">
            <div className="flex items-center justify-between"><div className="text-xs font-bold uppercase tracking-wider text-[var(--pm-text)]">Refund requests</div><button onClick={() => openAction("refund")} className="border border-[#F5B300]/50 px-3 py-1.5 text-xs font-bold text-[var(--pm-accent-text)]">Start request</button></div>
            <div className="mt-3 space-y-2">{customerRefunds.map((request, index) => <div key={index} className="border border-[var(--pm-border)] bg-[var(--pm-bg)] p-3"><div className="flex justify-between text-xs"><span className="font-bold mono">${request.amount.toFixed(2)}</span><span className="text-yellow-400 mono">Pending review</span></div><div className="mt-1 text-xs text-[var(--pm-text-muted)]">{request.note}</div></div>)}{!customerRefunds.length && <div className="py-6 text-center text-xs text-[var(--pm-text-muted)]">No locally created refund requests.</div>}</div>
          </div>
        </div>
      )}

      {activeTab === "activity" && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="grid grid-cols-2 gap-3 lg:col-span-1 lg:grid-cols-1">
            {[["Lifetime value", `$${customer.ltv.toFixed(2)}`], ["Average order", `$${averageOrder.toFixed(2)}`], ["Completed orders", String(customerOrders.filter(order => order.status === "Delivered").length)], ["Refund requests", String(customerRefunds.length)]].map(([label, value]) => <div key={label} className="border border-[var(--pm-border)] bg-[var(--pm-surface)] p-4"><div className="text-xs text-[var(--pm-text-muted)]">{label}</div><div className="mt-1 text-xl font-extrabold mono">{value}</div></div>)}
          </div>
          <div className="border border-[var(--pm-border)] bg-[var(--pm-surface)] lg:col-span-2">
            <div className="border-b border-[var(--pm-border)] px-4 py-3 text-xs font-bold uppercase tracking-wider">Customer activity</div>
            <div className="divide-y divide-[var(--pm-border-soft)]">{activity.map((item, index) => <div key={`${item.type}-${index}`} className="flex gap-4 p-4"><div className="w-28 flex-shrink-0 text-xs font-bold text-[var(--pm-text-secondary)]">{item.type}</div><div className="min-w-0 flex-1 text-xs text-[var(--pm-text-muted)]">{item.detail}</div><div className="text-xs text-[var(--pm-text-muted)] mono">{item.date}</div></div>)}</div>
          </div>
        </div>
      )}

      {activeTab === "notes" && (
        <div className="space-y-3">
          <div className="border border-[var(--pm-border)] bg-[var(--pm-surface)] p-4">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--pm-text)]">Internal support note</label>
            <textarea rows={3} value={noteDraft} onChange={event => setNoteDraft(event.target.value)} placeholder={`Add a note about ${customer.name}`} className="mt-2 w-full resize-none border border-[var(--pm-border)] bg-[var(--pm-bg)] px-3 py-2 text-sm text-[var(--pm-text-secondary)]" />
            <div className="mt-2 flex justify-end"><button disabled={!noteDraft.trim()} onClick={() => { setNotes(current => ({ ...current, [customer.id]: [noteDraft.trim(), ...(current[customer.id] ?? [])] })); setNoteDraft(""); setSuccess(`Note saved for ${customer.name}.`); }} className="bg-[#F5B300] px-4 py-2 text-xs font-bold text-black disabled:opacity-40">Save note</button></div>
          </div>
          {(notes[customer.id] ?? []).map((note, index) => <div key={index} className="border border-[var(--pm-border)] bg-[var(--pm-surface)] p-4"><div className="text-sm">{note}</div><div className="mt-2 text-xs text-[var(--pm-text-muted)] mono">Jerome Lim · Just now</div></div>)}
        </div>
      )}

      {activeAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setActiveAction(null)}>
          <div className="w-full max-w-lg space-y-4 border border-[var(--pm-border)] bg-[var(--pm-surface)] p-6" onClick={event => event.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[var(--pm-border)] pb-3"><div><div className="font-bold text-[var(--pm-text-secondary)]">{{ "edit-profile": "Edit customer details", "edit-plan": "Change plan", pause: "Pause subscription", resume: "Resume subscription", credit: "Add wallet credit", refund: "Start refund request", "password-reset": "Send password reset link", cancel: "Request cancellation" }[activeAction]}</div><div className="mt-1 text-xs text-[var(--pm-text-muted)]">{customer.name} · {customer.id}</div></div><button onClick={() => setActiveAction(null)} className="text-xl text-[var(--pm-text-muted)]">×</button></div>
            {activeAction === "edit-profile" && <label className="block space-y-1 text-xs text-[var(--pm-text-muted)]">Delivery address<textarea rows={3} value={actionValue} onChange={event => setActionValue(event.target.value)} className="block w-full resize-none border border-[var(--pm-border)] bg-[var(--pm-bg)] px-3 py-2 text-sm" /></label>}
            {activeAction === "edit-plan" && <label className="block space-y-1 text-xs text-[var(--pm-text-muted)]">Plan<select value={actionValue} onChange={event => setActionValue(event.target.value)} className="block w-full border border-[var(--pm-border)] bg-[var(--pm-bg)] px-3 py-2 text-sm">{["Meal Plan", "Ready Series Subscription", "Ready Series A-la-carte", "Ready Series Bundle"].map(plan => <option key={plan}>{plan}</option>)}</select></label>}
            {(activeAction === "credit" || activeAction === "refund") && <label className="block space-y-1 text-xs text-[var(--pm-text-muted)]">{activeAction === "credit" ? "Credit amount" : "Requested refund amount"}<input type="number" min="0.01" step="0.01" value={actionValue} onChange={event => setActionValue(event.target.value)} placeholder="0.00" className="block w-full border border-[var(--pm-border)] bg-[var(--pm-bg)] px-3 py-2 text-sm" /></label>}
            {["pause", "credit", "refund", "cancel"].includes(activeAction) && <label className="block space-y-1 text-xs text-[var(--pm-text-muted)]">Support note <span className="text-red-400">*</span><textarea rows={3} value={actionNote} onChange={event => { setActionNote(event.target.value); setActionError(""); }} placeholder="Required for the audit trail" className={`block w-full resize-none border bg-[var(--pm-bg)] px-3 py-2 text-sm ${actionError && !actionNote.trim() ? "border-red-600" : "border-[var(--pm-border)]"}`} /></label>}
            {activeAction === "refund" && <div className="border border-blue-900/40 bg-blue-950/10 px-3 py-2 text-xs text-blue-300">This records a request. Shopify executes approved refunds.</div>}
            {activeAction === "password-reset" && <div className="text-sm text-[var(--pm-text-secondary)]">Send a secure password reset link to <strong>{customer.email}</strong>? Staff cannot view or set the password.</div>}
            {activeAction === "cancel" && <div className="text-xs text-[var(--pm-text-muted)]">Service continues until an administrator approves this request.</div>}
            {actionError && <div role="alert" className="border border-red-700 bg-red-950/30 px-3 py-2 text-xs font-bold text-red-300 mono">{actionError}</div>}
            <div className="flex gap-2"><button onClick={() => setActiveAction(null)} className="flex-1 border border-[var(--pm-border)] py-2 text-xs text-[var(--pm-text-muted)]">Cancel</button><button onClick={completeAction} className={`flex-1 py-2 text-xs font-bold ${activeAction === "cancel" ? "bg-red-900 text-red-100" : "bg-[#F5B300] text-black"}`}>Confirm</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
