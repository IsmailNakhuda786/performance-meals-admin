import { useState } from "react";
import ReadySeriesCatalog from "./ReadySeriesCatalog";
import { mealPlanProgrammes, mealPlanVariants, readySeriesSubscriptions } from "../catalog";
import { goalLabel, type GoalType } from "../data";
import type { BusinessStream } from "../App";

type CatalogTab = "ready-products" | "ready-subscriptions" | "meal-plans";

type ReadySubscription = {
  sku: string;
  name: string;
  variant: string;
  items: number;
  price3m: number;
  price6m: number;
};

type MealPlanTemplate = {
  id: string;
  name: string;
  goal: GoalType;
  variant: string;
  cadence: string;
  duration: string;
  mealsPerWeek: number;
  price: number;
  status: "Draft" | "Published";
};

const initialTemplates: MealPlanTemplate[] = [
  { id: "MPT-001", name: "Low Carb Fat Loss · Biweekly", goal: "CUT", variant: "Low Carb Regular", cadence: "Biweekly", duration: "12 weeks", mealsPerWeek: 5, price: 140, status: "Published" },
  { id: "MPT-002", name: "Balanced Muscle Gain · Monthly", goal: "BUILD", variant: "Balance Regular", cadence: "Monthly", duration: "12 weeks", mealsPerWeek: 10, price: 220, status: "Published" },
  { id: "MPT-003", name: "Maintenance Plus · 2 Months", goal: "MAINTAIN", variant: "Balance Regular+", cadence: "2 Months", duration: "8 weeks", mealsPerWeek: 10, price: 235, status: "Draft" },
];

const emptyReadySubscription = (): ReadySubscription => ({
  sku: "",
  name: "",
  variant: "Non-Beef",
  items: 10,
  price3m: 0,
  price6m: 0,
});

const emptyMealPlan = (index: number): MealPlanTemplate => ({
  id: `MPT-${String(index + 1).padStart(3, "0")}`,
  name: "",
  goal: "CUT",
  variant: mealPlanVariants[0].id,
  cadence: mealPlanProgrammes[0].name,
  duration: "12 weeks",
  mealsPerWeek: 5,
  price: 0,
  status: "Draft",
});

export default function CatalogCenter({ stream }: { stream: BusinessStream }) {
  const [tab, setTab] = useState<CatalogTab>(stream === "meal-plans" ? "meal-plans" : "ready-products");
  const [subscriptions, setSubscriptions] = useState<ReadySubscription[]>(readySeriesSubscriptions.map(item => ({ ...item })));
  const [templates, setTemplates] = useState(initialTemplates);
  const [editingSubscription, setEditingSubscription] = useState<ReadySubscription | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<MealPlanTemplate | null>(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const notify = (message: string) => {
    setSuccess(message);
    setTimeout(() => setSuccess(""), 4000);
  };

  const saveSubscription = () => {
    if (!editingSubscription?.sku.trim() || !editingSubscription.name.trim()) {
      setError("SKU and package name are required.");
      return;
    }
    const exists = subscriptions.some(item => item.sku === editingSubscription.sku);
    setSubscriptions(current => exists
      ? current.map(item => item.sku === editingSubscription.sku ? editingSubscription : item)
      : [...current, editingSubscription]);
    notify(`${editingSubscription.name} ${exists ? "updated" : "created"} in Ready Series subscriptions.`);
    setEditingSubscription(null);
    setError("");
  };

  const saveTemplate = (status: MealPlanTemplate["status"]) => {
    if (!editingTemplate?.name.trim()) {
      setError("Plan name is required.");
      return;
    }
    const next = { ...editingTemplate, status };
    const exists = templates.some(item => item.id === next.id);
    setTemplates(current => exists
      ? current.map(item => item.id === next.id ? next : item)
      : [...current, next]);
    notify(`${next.name} saved as ${status.toLowerCase()}.`);
    setEditingTemplate(null);
    setError("");
  };

  return (
    <div className="space-y-5 p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold">Catalog</h2>
          <div className="mt-1 text-xs text-[var(--pm-text-muted)]">Create and manage sellable Ready Series products and reusable Meal Plan templates.</div>
        </div>
        <div className="border border-blue-900/40 bg-blue-950/10 px-3 py-2 text-xs text-blue-300">Prototype records only · Shopify remains the product system of record.</div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {[
          { id: "ready-products" as const, title: "Create Ready Series Meal", description: "Add an individual meal or build a bundle." },
          { id: "ready-subscriptions" as const, title: "Create Ready Subscription", description: "Create a 3- or 6-delivery package." },
          { id: "meal-plans" as const, title: "Create Meal Plan", description: "Create a reusable plan template for subscribers." },
        ].map(action => (
          <button key={action.id} onClick={() => setTab(action.id)} className={`border p-4 text-left transition-colors ${tab === action.id ? "border-[#F5B300] bg-[#F5B300]/10" : "border-[var(--pm-border)] bg-[var(--pm-surface)] hover:border-[#F5B300]/50"}`}>
            <div className="text-sm font-bold text-[var(--pm-text-secondary)]">{action.title}</div>
            <div className="mt-1 text-xs text-[var(--pm-text-muted)]">{action.description}</div>
          </button>
        ))}
      </div>

      <div className="flex overflow-x-auto border-b border-[var(--pm-border)]">
        {[
          ["ready-products", "Ready meals & bundles"],
          ["ready-subscriptions", "Ready subscriptions"],
          ["meal-plans", "Meal Plan templates"],
        ].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id as CatalogTab)} className={`whitespace-nowrap border-b-2 px-5 py-3 text-sm font-semibold ${tab === id ? "border-[#F5B300] text-[var(--pm-accent-text)]" : "border-transparent text-[var(--pm-text-muted)]"}`}>
            {label}
          </button>
        ))}
      </div>

      {success && <div role="status" className="border border-green-800/40 bg-green-950/20 px-4 py-3 text-xs font-bold text-green-400 mono">{success}</div>}

      {tab === "ready-products" && <ReadySeriesCatalog />}

      {tab === "ready-subscriptions" && (
        <div className="border border-[var(--pm-border)] bg-[var(--pm-surface)]">
          <div className="flex items-center justify-between border-b border-[var(--pm-border)] px-4 py-3">
            <div>
              <div className="text-sm font-semibold">Ready Series subscription packages</div>
              <div className="mt-1 text-xs text-[var(--pm-text-muted)]">Prepaid packages delivered every four weeks.</div>
            </div>
            <button onClick={() => setEditingSubscription(emptyReadySubscription())} className="bg-[#F5B300] px-3 py-2 text-xs font-bold text-black mono">Create subscription</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-[var(--pm-border)]">{["SKU", "Package", "Variant", "Items", "3 deliveries", "6 deliveries", "Actions"].map(label => <th key={label} className="px-4 py-2 text-left text-xs uppercase tracking-wider text-[var(--pm-text-muted)]">{label}</th>)}</tr></thead>
              <tbody>
                {subscriptions.map(item => (
                  <tr key={item.sku} className="border-b border-[var(--pm-border-soft)]">
                    <td className="px-4 py-2.5 text-xs font-bold text-[var(--pm-accent-text)] mono">{item.sku}</td>
                    <td className="px-4 py-2.5 font-semibold">{item.name}</td>
                    <td className="px-4 py-2.5 text-xs text-[var(--pm-text-muted)]">{item.variant}</td>
                    <td className="px-4 py-2.5 text-xs mono">{item.items}</td>
                    <td className="px-4 py-2.5 text-xs mono">${item.price3m.toFixed(2)}</td>
                    <td className="px-4 py-2.5 text-xs mono">${item.price6m.toFixed(2)}</td>
                    <td className="px-4 py-2.5"><button onClick={() => setEditingSubscription({ ...item })} className="border border-[var(--pm-border)] px-2 py-1 text-xs text-[var(--pm-text-muted)]">Edit</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "meal-plans" && (
        <div className="border border-[var(--pm-border)] bg-[var(--pm-surface)]">
          <div className="flex items-center justify-between border-b border-[var(--pm-border)] px-4 py-3">
            <div>
              <div className="text-sm font-semibold">Reusable Meal Plan templates</div>
              <div className="mt-1 text-xs text-[var(--pm-text-muted)]">Templates define the sellable plan; weekly meal assignments are managed in Menu Planning.</div>
            </div>
            <button onClick={() => setEditingTemplate(emptyMealPlan(templates.length))} className="bg-[#F5B300] px-3 py-2 text-xs font-bold text-black mono">Create Meal Plan</button>
          </div>
          <div className="grid grid-cols-1 gap-3 p-4 lg:grid-cols-2">
            {templates.map(template => (
              <div key={template.id} className="border border-[var(--pm-border)] bg-[var(--pm-bg)] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold text-[var(--pm-text-secondary)]">{template.name}</div>
                    <div className="mt-1 text-xs text-[var(--pm-text-muted)]">{goalLabel(template.goal)} · {template.variant}</div>
                  </div>
                  <span className={`px-2 py-0.5 text-[10px] font-bold mono ${template.status === "Published" ? "bg-green-950/30 text-green-400" : "bg-[var(--pm-surface-muted)] text-[var(--pm-text-muted)]"}`}>{template.status}</span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <div><span className="text-[var(--pm-text-muted)]">Cadence</span><div className="font-semibold">{template.cadence}</div></div>
                  <div><span className="text-[var(--pm-text-muted)]">Duration</span><div className="font-semibold">{template.duration}</div></div>
                  <div><span className="text-[var(--pm-text-muted)]">Meals / week</span><div className="font-semibold mono">{template.mealsPerWeek}</div></div>
                  <div><span className="text-[var(--pm-text-muted)]">Price</span><div className="font-semibold mono">${template.price.toFixed(2)}</div></div>
                </div>
                <button onClick={() => setEditingTemplate({ ...template })} className="mt-4 border border-[var(--pm-border)] px-3 py-1.5 text-xs text-[var(--pm-text-muted)]">Edit template</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {editingSubscription && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setEditingSubscription(null)}>
          <div className="w-full max-w-lg space-y-4 border border-[var(--pm-border)] bg-[var(--pm-surface)] p-6" onClick={event => event.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[var(--pm-border)] pb-3"><div className="font-bold">Ready Series subscription</div><button onClick={() => setEditingSubscription(null)} className="text-xl text-[var(--pm-text-muted)]">×</button></div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                ["sku", "SKU", "text"],
                ["name", "Package name", "text"],
                ["variant", "Variant", "text"],
                ["items", "Items per delivery", "number"],
                ["price3m", "3-delivery price", "number"],
                ["price6m", "6-delivery price", "number"],
              ].map(([key, label, type]) => (
                <label key={key} className="space-y-1 text-xs text-[var(--pm-text-muted)]">{label}
                  <input type={type} min={type === "number" ? "0" : undefined} step={key.startsWith("price") ? "0.01" : undefined} value={editingSubscription[key as keyof ReadySubscription]} onChange={event => {
                    setError("");
                    setEditingSubscription(current => current ? { ...current, [key]: type === "number" ? Number(event.target.value) : event.target.value } : current);
                  }} className="block w-full border border-[var(--pm-border)] bg-[var(--pm-bg)] px-3 py-2 text-sm text-[var(--pm-text-secondary)]" />
                </label>
              ))}
            </div>
            {error && <div role="alert" className="border border-red-700 bg-red-950/30 px-3 py-2 text-xs text-red-300">{error}</div>}
            <div className="flex gap-2"><button onClick={() => setEditingSubscription(null)} className="flex-1 border border-[var(--pm-border)] py-2 text-xs text-[var(--pm-text-muted)]">Cancel</button><button onClick={saveSubscription} className="flex-1 bg-[#F5B300] py-2 text-xs font-bold text-black">Save subscription</button></div>
          </div>
        </div>
      )}

      {editingTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setEditingTemplate(null)}>
          <div className="max-h-[90vh] w-full max-w-2xl space-y-4 overflow-y-auto border border-[var(--pm-border)] bg-[var(--pm-surface)] p-6" onClick={event => event.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[var(--pm-border)] pb-3"><div><div className="font-bold">Meal Plan template</div><div className="mt-1 text-xs text-[var(--pm-text-muted)]">Create a reusable offering that can be assigned to subscribers.</div></div><button onClick={() => setEditingTemplate(null)} className="text-xl text-[var(--pm-text-muted)]">×</button></div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="space-y-1 text-xs text-[var(--pm-text-muted)] sm:col-span-2">Plan name<input value={editingTemplate.name} onChange={event => { setError(""); setEditingTemplate(current => current ? { ...current, name: event.target.value } : current); }} className="block w-full border border-[var(--pm-border)] bg-[var(--pm-bg)] px-3 py-2 text-sm text-[var(--pm-text-secondary)]" /></label>
              <label className="space-y-1 text-xs text-[var(--pm-text-muted)]">Goal<select value={editingTemplate.goal} onChange={event => setEditingTemplate(current => current ? { ...current, goal: event.target.value as GoalType } : current)} className="block w-full border border-[var(--pm-border)] bg-[var(--pm-bg)] px-3 py-2 text-sm">{(["CUT", "BUILD", "MAINTAIN"] as GoalType[]).map(goal => <option key={goal} value={goal}>{goalLabel(goal)}</option>)}</select></label>
              <label className="space-y-1 text-xs text-[var(--pm-text-muted)]">Meal variant<select value={editingTemplate.variant} onChange={event => setEditingTemplate(current => current ? { ...current, variant: event.target.value } : current)} className="block w-full border border-[var(--pm-border)] bg-[var(--pm-bg)] px-3 py-2 text-sm">{mealPlanVariants.map(variant => <option key={variant.id}>{variant.id}</option>)}</select></label>
              <label className="space-y-1 text-xs text-[var(--pm-text-muted)]">Billing cadence<select value={editingTemplate.cadence} onChange={event => setEditingTemplate(current => current ? { ...current, cadence: event.target.value } : current)} className="block w-full border border-[var(--pm-border)] bg-[var(--pm-bg)] px-3 py-2 text-sm">{mealPlanProgrammes.map(programme => <option key={programme.id}>{programme.name}</option>)}</select></label>
              <label className="space-y-1 text-xs text-[var(--pm-text-muted)]">Duration<select value={editingTemplate.duration} onChange={event => setEditingTemplate(current => current ? { ...current, duration: event.target.value } : current)} className="block w-full border border-[var(--pm-border)] bg-[var(--pm-bg)] px-3 py-2 text-sm"><option>4 weeks</option><option>8 weeks</option><option>12 weeks</option></select></label>
              <label className="space-y-1 text-xs text-[var(--pm-text-muted)]">Meals per week<input type="number" min="1" value={editingTemplate.mealsPerWeek} onChange={event => setEditingTemplate(current => current ? { ...current, mealsPerWeek: Number(event.target.value) } : current)} className="block w-full border border-[var(--pm-border)] bg-[var(--pm-bg)] px-3 py-2 text-sm" /></label>
              <label className="space-y-1 text-xs text-[var(--pm-text-muted)]">Price (SGD)<input type="number" min="0" step="0.01" value={editingTemplate.price} onChange={event => setEditingTemplate(current => current ? { ...current, price: Number(event.target.value) } : current)} className="block w-full border border-[var(--pm-border)] bg-[var(--pm-bg)] px-3 py-2 text-sm" /></label>
            </div>
            <div className="border border-[var(--pm-border)] bg-[var(--pm-bg)] p-3 text-xs text-[var(--pm-text-muted)]">Weekly meal recipes and assignments are managed separately in Menu Planning. Publishing this template makes it available for subscriber assignment in the prototype.</div>
            {error && <div role="alert" className="border border-red-700 bg-red-950/30 px-3 py-2 text-xs text-red-300">{error}</div>}
            <div className="flex flex-wrap gap-2"><button onClick={() => setEditingTemplate(null)} className="border border-[var(--pm-border)] px-4 py-2 text-xs text-[var(--pm-text-muted)]">Cancel</button><button onClick={() => saveTemplate("Draft")} className="ml-auto border border-[#F5B300]/50 px-4 py-2 text-xs font-bold text-[var(--pm-accent-text)]">Save as draft</button><button onClick={() => saveTemplate("Published")} className="bg-[#F5B300] px-4 py-2 text-xs font-bold text-black">Publish template</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
