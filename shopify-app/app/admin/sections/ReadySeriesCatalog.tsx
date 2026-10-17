import { useState } from "react";
import { readySeriesBundles, readySeriesProducts } from "../catalog";

type CatalogItem = {
  id: number;
  name: string;
  category: string;
  price: number;
  protein: number;
  carbs: number;
  fat: number;
  calories: number;
  detailCategory: string;
  dietaryFibre: string;
  sugars: string;
  sodium: string;
  ingredients: string;
  description: string;
  listingImage: string;
  detailImage: string;
  inStock: boolean;
  bundleOnly: boolean;
  badge: string;
};

type BundleItem = { itemId: number; quantity: number };

type CatalogBundle = {
  id: string;
  category: string;
  name: string;
  price: number;
  image: string;
  variant: string;
  description: string;
  badge: string;
  items: BundleItem[];
};

const itemSeed: CatalogItem[] = readySeriesProducts.map(item => ({ ...item, badge: item.badge ?? "" }));
const bundleSeed: CatalogBundle[] = readySeriesBundles.map((bundle, index) => ({
  id: `B-${index + 1}`,
  category: bundle.category,
  name: bundle.name,
  price: bundle.price,
  image: "",
  variant: bundle.variant ?? "",
  description: bundle.description,
  badge: bundle.badge ?? "",
  items: bundle.items.map(item => ({ ...item })),
}));

const emptyItem = (): CatalogItem => ({
  id: Date.now(),
  name: "",
  category: "Low Carb",
  price: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
  calories: 0,
  detailCategory: "Low Carb",
  dietaryFibre: "",
  sugars: "",
  sodium: "",
  ingredients: "",
  description: "",
  listingImage: "",
  detailImage: "",
  inStock: true,
  bundleOnly: false,
  badge: "",
});

const emptyBundle = (): CatalogBundle => ({
  id: `B-${Date.now()}`,
  category: "Mixed Bundle",
  name: "",
  price: 0,
  image: "",
  variant: "",
  description: "",
  badge: "",
  items: [],
});

export default function ReadySeriesCatalog() {
  const [tab, setTab] = useState<"items" | "bundles">("items");
  const [items, setItems] = useState(itemSeed);
  const [bundles, setBundles] = useState(bundleSeed);
  const [editingItem, setEditingItem] = useState<CatalogItem | null>(null);
  const [editingBundle, setEditingBundle] = useState<CatalogBundle | null>(null);
  const [success, setSuccess] = useState("");

  const notify = (message: string) => {
    setSuccess(message);
    setTimeout(() => setSuccess(""), 4000);
  };

  const saveItem = () => {
    if (!editingItem?.name.trim() || editingItem.price < 0) return;
    const exists = items.some(item => item.id === editingItem.id);
    setItems(current => exists
      ? current.map(item => item.id === editingItem.id ? editingItem : item)
      : [...current, editingItem]);
    notify(`${editingItem.name} ${exists ? "updated" : "added"} in the individual menu.`);
    setEditingItem(null);
  };

  const saveBundle = () => {
    if (!editingBundle?.name.trim() || editingBundle.price < 0 || editingBundle.items.length === 0) return;
    const exists = bundles.some(bundle => bundle.id === editingBundle.id);
    setBundles(current => exists
      ? current.map(bundle => bundle.id === editingBundle.id ? editingBundle : bundle)
      : [...current, editingBundle]);
    notify(`${editingBundle.name} ${exists ? "updated" : "created"}.`);
    setEditingBundle(null);
  };

  return (
    <div className="space-y-3 border border-[var(--pm-border)] bg-[var(--pm-surface)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--pm-border)] px-4 py-3">
        <div>
          <div className="text-sm font-semibold">Ready Series Catalog Management</div>
          <div className="mt-1 text-xs text-[var(--pm-text-muted)]">Individual meals provide the selectable components used to build bundles.</div>
        </div>
        <button onClick={() => tab === "items" ? setEditingItem(emptyItem()) : setEditingBundle(emptyBundle())}
          className="bg-[#F5B300] px-3 py-2 text-xs font-bold text-black mono">
          + Add {tab === "items" ? "Individual Item" : "Bundle"}
        </button>
      </div>

      <div className="flex border-b border-[var(--pm-border)] px-4">
        {(["items", "bundles"] as const).map(value => (
          <button key={value} onClick={() => setTab(value)}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider ${tab === value ? "border-b-2 border-[#F5B300] text-[var(--pm-accent-text)]" : "text-[var(--pm-text-muted)]"}`}>
            {value === "items" ? `Individual Menu (${items.length})` : `Bundles (${bundles.length})`}
          </button>
        ))}
      </div>

      {success && <div className="mx-4 border border-green-800/40 bg-green-950/20 px-3 py-2 text-xs text-green-400 mono">{success}</div>}

      {tab === "items" ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--pm-border-soft)]">
                {["Item", "Category", "Price", "Calories", "Protein", "Carbs", "Fat", "Availability", "Images", "Actions"].map(label => (
                  <th key={label} className="whitespace-nowrap px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-[var(--pm-text-muted)]">{label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} className="border-b border-[var(--pm-border-soft)]">
                  <td className="px-4 py-2 font-semibold text-[var(--pm-text-secondary)]">{item.name}</td>
                  <td className="px-4 py-2 text-xs text-[var(--pm-text-muted)]">{item.category}</td>
                  <td className="px-4 py-2 text-xs mono">${item.price.toFixed(2)}</td>
                  <td className="px-4 py-2 text-xs mono">{item.calories} kcal</td>
                  <td className="px-4 py-2 text-xs mono">{item.protein}g</td>
                  <td className="px-4 py-2 text-xs mono">{item.carbs}g</td>
                  <td className="px-4 py-2 text-xs mono">{item.fat}g</td>
                  <td className="px-4 py-2 text-xs">
                    <span className={item.inStock ? "text-green-400" : "text-red-400"}>{item.inStock ? "In stock" : "Sold out"}</span>
                    {item.bundleOnly && <span className="ml-1 text-[var(--pm-text-muted)]">· Bundle only</span>}
                  </td>
                  <td className="px-4 py-2 text-xs text-[var(--pm-text-muted)]">{item.listingImage && item.detailImage ? "2 added" : item.listingImage || item.detailImage ? "1 added" : "Missing"}</td>
                  <td className="px-4 py-2">
                    <div className="flex gap-2">
                      <button onClick={() => setEditingItem({ ...item })} className="border border-[var(--pm-border)] px-2 py-1 text-xs text-[var(--pm-text-muted)] mono">Edit</button>
                      <button onClick={() => {
                        const usedBy = bundles.filter(bundle => bundle.items.some(component => component.itemId === item.id));
                        if (usedBy.length) {
                          window.alert(`This item is used by ${usedBy.map(bundle => bundle.name).join(", ")}. Remove it from those bundles first.`);
                          return;
                        }
                        if (window.confirm(`Remove ${item.name} from the individual menu?`)) setItems(current => current.filter(row => row.id !== item.id));
                      }} className="border border-red-800/40 px-2 py-1 text-xs text-red-400 mono">Remove</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 p-4 lg:grid-cols-2">
          {bundles.map(bundle => {
            const selectedItems = bundle.items.flatMap(component => {
              const item = items.find(candidate => candidate.id === component.itemId);
              return item ? [{ item, quantity: component.quantity }] : [];
            });
            const itemCount = selectedItems.reduce((sum, component) => sum + component.quantity, 0);
            return (
              <div key={bundle.id} className="border border-[var(--pm-border)] bg-[var(--pm-bg)] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold text-[var(--pm-text-secondary)]">{bundle.name}</div>
                    <div className="mt-1 text-xs text-[var(--pm-text-muted)]">{bundle.category} · {itemCount || "Composition not set"} items</div>
                  </div>
                  <div className="font-bold text-[var(--pm-accent-text)] mono">${bundle.price.toFixed(2)}</div>
                </div>
                <div className="mt-3 min-h-8 text-xs text-[var(--pm-text-muted)]">
                  {selectedItems.length ? selectedItems.map(component => `${component.item.name} ×${component.quantity}`).join(" · ") : "Select the individual menu items and quantities for this bundle."}
                </div>
                <div className="mt-3 flex gap-2 border-t border-[var(--pm-border)] pt-3">
                  <button onClick={() => setEditingBundle({ ...bundle, items: bundle.items.map(item => ({ ...item })) })} className="border border-[var(--pm-border)] px-2 py-1 text-xs text-[var(--pm-text-muted)] mono">Edit Composition</button>
                  <button onClick={() => {
                    if (window.confirm(`Remove ${bundle.name}? Individual menu items will not be deleted.`)) setBundles(current => current.filter(row => row.id !== bundle.id));
                  }} className="border border-red-800/40 px-2 py-1 text-xs text-red-400 mono">Remove</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setEditingItem(null)}>
          <div className="max-h-[90vh] w-full max-w-2xl space-y-4 overflow-y-auto border border-[var(--pm-border)] bg-[var(--pm-surface)] p-6" onClick={event => event.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[var(--pm-border)] pb-3">
              <div className="font-bold text-[var(--pm-text-secondary)]">{items.some(item => item.id === editingItem.id) ? "Edit" : "Add"} Individual Menu Item</div>
              <button onClick={() => setEditingItem(null)} className="text-xl text-[var(--pm-text-muted)]">×</button>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                ["name", "Item name", "text", "sm:col-span-2"],
                ["category", "Category", "text", ""],
                ["detailCategory", "Detail category", "text", ""],
                ["price", "Selling price", "number", ""],
                ["calories", "Calories (kcal)", "number", ""],
                ["protein", "Protein (g)", "number", ""],
                ["carbs", "Carbohydrates (g)", "number", ""],
                ["fat", "Fat (g)", "number", ""],
                ["dietaryFibre", "Dietary fibre", "text", ""],
                ["sugars", "Sugars", "text", ""],
                ["sodium", "Sodium", "text", ""],
                ["badge", "Storefront badge", "text", ""],
                ["listingImage", "Listing image URL", "url", "sm:col-span-2"],
                ["detailImage", "Detail image URL", "url", "sm:col-span-2"],
              ].map(([key, label, type, width]) => (
                <label key={key} className={`space-y-1 text-xs text-[var(--pm-text-muted)] ${width}`}>{label}
                  <input type={type} min={type === "number" ? "0" : undefined} step={key === "price" ? "0.01" : undefined}
                    value={editingItem[key as keyof CatalogItem] as string | number}
                    onChange={event => setEditingItem(current => current ? { ...current, [key]: type === "number" ? Number(event.target.value) : event.target.value } : current)}
                    className="block w-full border border-[var(--pm-border)] bg-[var(--pm-bg)] px-3 py-2 text-sm text-[var(--pm-text-secondary)]" />
                </label>
              ))}
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="space-y-1 text-xs text-[var(--pm-text-muted)]">Description
                <textarea rows={3} value={editingItem.description} onChange={event => setEditingItem(current => current ? { ...current, description: event.target.value } : current)}
                  className="block w-full resize-none border border-[var(--pm-border)] bg-[var(--pm-bg)] px-3 py-2 text-sm text-[var(--pm-text-secondary)]" />
              </label>
              <label className="space-y-1 text-xs text-[var(--pm-text-muted)]">Ingredients
                <textarea rows={3} value={editingItem.ingredients} onChange={event => setEditingItem(current => current ? { ...current, ingredients: event.target.value } : current)}
                  className="block w-full resize-none border border-[var(--pm-border)] bg-[var(--pm-bg)] px-3 py-2 text-sm text-[var(--pm-text-secondary)]" />
              </label>
            </div>
            <div className="flex flex-wrap gap-5 border border-[var(--pm-border)] bg-[var(--pm-bg)] p-3 text-xs text-[var(--pm-text-secondary)]">
              <label className="flex items-center gap-2"><input type="checkbox" checked={editingItem.inStock} onChange={event => setEditingItem(current => current ? { ...current, inStock: event.target.checked } : current)} /> Available for individual sale</label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={editingItem.bundleOnly} onChange={event => setEditingItem(current => current ? { ...current, bundleOnly: event.target.checked } : current)} /> Bundle-only item</label>
            </div>
            <div className="flex gap-3">
              {[editingItem.listingImage, editingItem.detailImage].filter(Boolean).map((image, index) => <img key={image} src={image} alt="" className="h-24 w-24 border border-[var(--pm-border)] object-cover" title={index === 0 ? "Listing image" : "Detail image"} />)}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditingItem(null)} className="flex-1 border border-[var(--pm-border)] py-2 text-xs text-[var(--pm-text-muted)] mono">Cancel</button>
              <button onClick={saveItem} className="flex-1 bg-[#F5B300] py-2 text-xs font-bold text-black mono">Save Item</button>
            </div>
          </div>
        </div>
      )}

      {editingBundle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setEditingBundle(null)}>
          <div className="max-h-[90vh] w-full max-w-2xl space-y-4 overflow-y-auto border border-[var(--pm-border)] bg-[var(--pm-surface)] p-6" onClick={event => event.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[var(--pm-border)] pb-3">
              <div>
                <div className="font-bold text-[var(--pm-text-secondary)]">Bundle Builder</div>
                <div className="mt-1 text-xs text-[var(--pm-text-muted)]">Select the individual menu items included in this bundle.</div>
              </div>
              <button onClick={() => setEditingBundle(null)} className="text-xl text-[var(--pm-text-muted)]">×</button>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                ["name", "Bundle name", "text"],
                ["category", "Category", "text"],
                ["variant", "Variant", "text"],
                ["price", "Bundle selling price", "number"],
                ["badge", "Storefront badge", "text"],
                ["image", "Shopify image URL", "url"],
              ].map(([key, label, type]) => (
                <label key={key} className="space-y-1 text-xs text-[var(--pm-text-muted)]">{label}
                  <input type={type} min={type === "number" ? "0" : undefined} step={key === "price" ? "0.01" : undefined}
                    value={editingBundle[key as keyof CatalogBundle] as string | number}
                    onChange={event => setEditingBundle(current => current ? { ...current, [key]: type === "number" ? Number(event.target.value) : event.target.value } : current)}
                    className="block w-full border border-[var(--pm-border)] bg-[var(--pm-bg)] px-3 py-2 text-sm text-[var(--pm-text-secondary)]" />
                </label>
              ))}
            </div>
            <label className="block space-y-1 text-xs text-[var(--pm-text-muted)]">Description
              <textarea rows={2} value={editingBundle.description} onChange={event => setEditingBundle(current => current ? { ...current, description: event.target.value } : current)}
                className="block w-full resize-none border border-[var(--pm-border)] bg-[var(--pm-bg)] px-3 py-2 text-sm text-[var(--pm-text-secondary)]" />
            </label>
            <div>
              <div className="mb-2 text-xs font-bold uppercase tracking-wider text-[var(--pm-text)]">Bundle items ({editingBundle.items.reduce((sum, component) => sum + component.quantity, 0)} total)</div>
              <div className="grid max-h-64 grid-cols-1 gap-2 overflow-y-auto border border-[var(--pm-border)] p-3 sm:grid-cols-2">
                {items.map(item => {
                  const quantity = editingBundle.items.find(component => component.itemId === item.id)?.quantity ?? 0;
                  return (
                  <label key={item.id} className="flex items-center gap-2 border border-[var(--pm-border-soft)] p-2 text-xs text-[var(--pm-text-secondary)]">
                    <span className="flex-1">{item.name}</span>
                    <span className="text-[var(--pm-text-muted)] mono">${item.price.toFixed(2)}</span>
                    <input type="number" min="0" max="99" value={quantity} aria-label={`${item.name} quantity`} onChange={event => setEditingBundle(current => {
                      if (!current) return current;
                      const nextQuantity = Math.max(0, Number(event.target.value));
                      return {
                        ...current,
                        items: nextQuantity === 0
                          ? current.items.filter(component => component.itemId !== item.id)
                          : current.items.some(component => component.itemId === item.id)
                            ? current.items.map(component => component.itemId === item.id ? { ...component, quantity: nextQuantity } : component)
                            : [...current.items, { itemId: item.id, quantity: nextQuantity }],
                      };
                    })} className="w-14 border border-[var(--pm-border)] bg-[var(--pm-bg)] px-2 py-1 text-center mono" />
                  </label>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center justify-between border border-[var(--pm-border)] bg-[var(--pm-bg)] px-3 py-2 text-xs">
              <span className="text-[var(--pm-text-muted)]">Individual item total</span>
              <span className="font-bold text-[var(--pm-text-secondary)] mono">${editingBundle.items.reduce((sum, component) => sum + (items.find(item => item.id === component.itemId)?.price ?? 0) * component.quantity, 0).toFixed(2)}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditingBundle(null)} className="flex-1 border border-[var(--pm-border)] py-2 text-xs text-[var(--pm-text-muted)] mono">Cancel</button>
              <button onClick={saveBundle} disabled={!editingBundle.items.length} className="flex-1 bg-[#F5B300] py-2 text-xs font-bold text-black disabled:opacity-40 mono">Save Bundle</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
