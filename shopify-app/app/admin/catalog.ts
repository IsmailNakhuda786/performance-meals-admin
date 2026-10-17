import { READY_SERIES_MEALS } from "./readySeriesData";

export const mealPlanVariants = [
  { id: "Low Carb Regular", calories: "400–450 kcal", protein: 42, carbs: 22, lunchOnly: 140, lunchDinner: 200 },
  { id: "Low Carb Regular+", calories: "450–500 kcal", protein: 48, carbs: 22, lunchOnly: 155, lunchDinner: 215 },
  { id: "Balance Regular", calories: "500–550 kcal", protein: 48, carbs: 55, lunchOnly: 150, lunchDinner: 220 },
  { id: "Balance Regular+", calories: "550–600 kcal", protein: 54, carbs: 58, lunchOnly: 165, lunchDinner: 235 },
] as const;

export const mealPlanProgrammes = [
  { id: "bi-weekly", name: "Biweekly", kind: "Recurring", coverage: "Mon–Fri", menuWeeks: 2 },
  { id: "monthly", name: "Monthly", kind: "Recurring", coverage: "Mon–Fri", menuWeeks: 4 },
  { id: "2-months", name: "2 Months", kind: "Recurring", coverage: "Mon–Fri", menuWeeks: 4 },
  { id: "6by60", name: "6 by 60", kind: "Fixed", coverage: "All week", menuWeeks: 4 },
  { id: "6by60plus", name: "6 by 60 Plus", kind: "Fixed", coverage: "All week", menuWeeks: 4 },
] as const;

export const readySeriesProducts = READY_SERIES_MEALS.map(meal => ({
  id: meal.id,
  name: meal.name,
  category: meal.listingCategory,
  detailCategory: meal.detailCategory,
  price: meal.price,
  protein: meal.protein,
  carbs: meal.carbs,
  fat: meal.fat,
  calories: meal.cal,
  dietaryFibre: meal.dietaryFibre,
  sugars: meal.sugars,
  sodium: meal.sodium,
  ingredients: meal.ingredients,
  inStock: meal.inStock,
  bundleOnly: meal.bundleOnly ?? false,
  badge: meal.badge,
  listingImage: meal.listingImage,
  detailImage: meal.detailImage,
  rating: meal.rating,
  reviews: meal.reviews,
  description: meal.description,
}));

export const readySeriesBundles = [
  { category: "Low Carb Meals", name: "Signature 5", variant: "With Beef", description: "One-off purchase · 5 meals · 4% bundle discount.", badge: "POPULAR", price: 50.4, items: [{ itemId: 264890, quantity: 1 }, { itemId: 273884, quantity: 1 }, { itemId: 257925, quantity: 1 }, { itemId: 257923, quantity: 1 }, { itemId: 266697, quantity: 1 }] },
  { category: "Low Carb Meals", name: "Signature 5 — No-Beef", variant: "No-Beef", description: "One-off purchase · 5 distinct dishes · 4% bundle discount.", badge: null, price: 50.4, items: [{ itemId: 264890, quantity: 1 }, { itemId: 266697, quantity: 1 }, { itemId: 257925, quantity: 1 }, { itemId: 273884, quantity: 1 }, { itemId: 266701, quantity: 1 }] },
  { category: "Low Carb Meals", name: "Variety 9", variant: null, description: "One-off purchase · 9 meals · 5% bundle discount.", badge: "VARIETY", price: 89.9, items: [{ itemId: 273884, quantity: 1 }, { itemId: 264887, quantity: 1 }, { itemId: 257923, quantity: 1 }, { itemId: 264890, quantity: 1 }, { itemId: 257925, quantity: 1 }, { itemId: 266701, quantity: 1 }, { itemId: 284502, quantity: 2 }, { itemId: 266699, quantity: 1 }] },
  { category: "Low Carb Meals", name: "Essential 10", variant: "With Beef", description: "One-off purchase · 10 meals · 7% bundle discount.", badge: "BEST VALUE", price: 97.2, items: [{ itemId: 273884, quantity: 2 }, { itemId: 266697, quantity: 2 }, { itemId: 257925, quantity: 2 }, { itemId: 264887, quantity: 1 }, { itemId: 264890, quantity: 2 }, { itemId: 257923, quantity: 1 }] },
  { category: "Low Carb Meals", name: "Essential 10 — No-Beef", variant: "No-Beef", description: "One-off purchase · 10 meals · 7% bundle discount.", badge: null, price: 97.2, items: [{ itemId: 273884, quantity: 2 }, { itemId: 257925, quantity: 2 }, { itemId: 264890, quantity: 2 }, { itemId: 266697, quantity: 2 }, { itemId: 264887, quantity: 1 }, { itemId: 266701, quantity: 1 }] },
  { category: "High Carb Meals", name: "Signature 5", variant: "With Beef", description: "One-off purchase · 5 meals · 4% bundle discount.", badge: "POPULAR", price: 50.4, items: [{ itemId: 257903, quantity: 1 }, { itemId: 264710, quantity: 1 }, { itemId: 257264, quantity: 1 }, { itemId: 257279, quantity: 1 }, { itemId: 266700, quantity: 1 }] },
  { category: "High Carb Meals", name: "Signature 5 — No-Beef", variant: "No-Beef", description: "One-off purchase · 5 meals · 4% bundle discount.", badge: null, price: 50.4, items: [{ itemId: 257903, quantity: 1 }, { itemId: 264710, quantity: 1 }, { itemId: 257264, quantity: 1 }, { itemId: 257279, quantity: 1 }, { itemId: 266694, quantity: 1 }] },
  { category: "High Carb Meals", name: "Variety 9", variant: null, description: "One-off purchase · 9 distinct meals · 5% bundle discount.", badge: "VARIETY", price: 90.8, items: [{ itemId: 257279, quantity: 1 }, { itemId: 264700, quantity: 1 }, { itemId: 257264, quantity: 1 }, { itemId: 266700, quantity: 1 }, { itemId: 257992, quantity: 1 }, { itemId: 266694, quantity: 1 }, { itemId: 257903, quantity: 1 }, { itemId: 274808, quantity: 1 }, { itemId: 264710, quantity: 1 }] },
  { category: "High Carb Meals", name: "Essential 10", variant: "With Beef", description: "One-off purchase · 10 meals · 7% bundle discount.", badge: "BEST VALUE", price: 97.2, items: [{ itemId: 257264, quantity: 2 }, { itemId: 257903, quantity: 2 }, { itemId: 264710, quantity: 2 }, { itemId: 274808, quantity: 2 }, { itemId: 257279, quantity: 1 }, { itemId: 266700, quantity: 1 }] },
  { category: "High Carb Meals", name: "Essential 10 — No-Beef", variant: "No-Beef", description: "One-off purchase · 10 meals · 7% bundle discount.", badge: null, price: 97.2, items: [{ itemId: 257264, quantity: 2 }, { itemId: 257903, quantity: 2 }, { itemId: 264710, quantity: 2 }, { itemId: 274808, quantity: 2 }, { itemId: 257279, quantity: 1 }, { itemId: 266694, quantity: 1 }] },
  { category: "Just Protein & Mixed", name: "Just Protein Variety 10", variant: null, description: "One of each protein dish · 4% bundle discount.", badge: "POPULAR", price: 59.9, items: [{ itemId: 284284, quantity: 1 }, { itemId: 275168, quantity: 1 }, { itemId: 284263, quantity: 1 }, { itemId: 262576, quantity: 1 }, { itemId: 284286, quantity: 1 }, { itemId: 284283, quantity: 1 }, { itemId: 256158, quantity: 1 }, { itemId: 262591, quantity: 1 }, { itemId: 284285, quantity: 1 }, { itemId: 284282, quantity: 1 }] },
  { category: "Just Protein & Mixed", name: "Low Carb + Just Protein Mixed", variant: "7 meals + 7 protein items", description: "One-off mixed purchase · 14 items · 7% bundle discount.", badge: "MIXED", price: 109.8, items: [257925, 284502, 264887, 264890, 266701, 257923, 266697, 256158, 284285, 275168, 284284, 262591, 284283, 262576].map(itemId => ({ itemId, quantity: 1 })) },
  { category: "Just Protein & Mixed", name: "High Carb + Just Protein Mixed", variant: "7 meals + 7 protein items", description: "One-off mixed purchase · 14 items · 7% bundle discount.", badge: "MIXED", price: 109.8, items: [257264, 257279, 257903, 266694, 266700, 274808, 264710, 256158, 284285, 275168, 284284, 262591, 284283, 262576].map(itemId => ({ itemId, quantity: 1 })) },
];

export const readySeriesSubscriptions = [
  { sku: "JPSUB01", name: "Just Protein", variant: "Non-Beef", items: 15, price3m: 255.2, price6m: 493.6, badge: null },
  { sku: "JPSUB02", name: "Just Protein", variant: "Beef", items: 15, price3m: 253.6, price6m: 490.5, badge: null },
  { sku: "LCSUB01", name: "Low Carb Meals", variant: "Non-Beef", items: 10, price3m: 286.65, price6m: 554.4, badge: "POPULAR" },
  { sku: "LCSUB02", name: "Low Carb Meals", variant: "Beef", items: 10, price3m: 286.65, price6m: 554.4, badge: null },
  { sku: "HCSUB01", name: "High Carb Meals", variant: "Non-Beef", items: 10, price3m: 286.65, price6m: 554.4, badge: null },
  { sku: "HCSUB02", name: "High Carb Meals", variant: "Beef", items: 10, price3m: 286.65, price6m: 554.4, badge: null },
  { sku: "LCMIXSUB01", name: "Low Carb + Just Protein", variant: "Non-Beef", items: 15, price3m: 359, price6m: 694.3, badge: "BEST VALUE" },
  { sku: "LCMIXSUB02", name: "Low Carb + Just Protein", variant: "Beef", items: 15, price3m: 359, price6m: 694.3, badge: null },
  { sku: "HCMIXSUB01", name: "High Carb + Just Protein", variant: "Non-Beef", items: 15, price3m: 359, price6m: 694.3, badge: "BEST VALUE" },
  { sku: "HCMIXSUB02", name: "High Carb + Just Protein", variant: "Beef", items: 15, price3m: 359, price6m: 694.3, badge: null },
];

export const walletRules = {
  presets: [20, 50, 100, 200],
  customMinimum: 5,
  customMaximum: 500,
  redemptionTiers: [
    { points: 100, credit: 10 },
    { points: 500, credit: 50 },
    { points: 1000, credit: 100 },
  ],
  loyaltyTiers: [
    { name: "Starter", minimum: 0, maximum: 499, earnRate: 1 },
    { name: "Gold", minimum: 500, maximum: 1999, earnRate: 1 },
    { name: "Platinum", minimum: 2000, maximum: null, earnRate: 1 },
  ],
  referralPoints: 0,
  inactivityExpiryDays: 90,
  creditExpiryDays: 365,
} as const;

export const giftCardRules = {
  denominations: [25, 50, 100, 150],
  physicalCardFee: 5,
  expires: true,
  expiryDays: 365,
  refundable: false,
  appliesTo: ["Ready Series Individual Selection", "Ready Series Bundles", "Meal Plan subscriptions"],
} as const;

export const commerceRules = {
  gstRate: 0.09,
  minimumOrder: 50,
  deliveryFee: 10,
  reducedDeliveryFee: 5,
  reducedDeliveryThreshold: 75,
  freeDeliveryThreshold: 125,
  readySeriesDeliveryChangeNoticeHours: 72,
  readySeriesDeliveryIntervalWeeks: 4,
  readySeriesPackageDeliveries: [3, 6],
  mealSelectionCutoff: { weekday: "Thursday", time: "13:59", timezone: "Asia/Singapore" },
} as const;
