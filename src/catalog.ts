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

export const readySeriesProducts = [
  { id: 101, name: "Teriyaki Chicken & Brown Rice", category: "Just Protein", price: 12.9, protein: 42, carbs: 48, fat: 8, calories: 478 },
  { id: 102, name: "Spicy Korean Beef Bulgogi", category: "Low Carb", price: 13.5, protein: 38, carbs: 12, fat: 14, calories: 326 },
  { id: 103, name: "Herb Chicken & Roasted Veg", category: "Low Carb", price: 12.5, protein: 36, carbs: 14, fat: 10, calories: 290 },
  { id: 104, name: "Salmon & Quinoa Power Bowl", category: "Just Protein", price: 15.9, protein: 44, carbs: 38, fat: 16, calories: 468 },
  { id: 105, name: "Thai Basil Pork Rice Bowl", category: "High Carb", price: 11.9, protein: 28, carbs: 62, fat: 8, calories: 436 },
  { id: 106, name: "Miso Glazed Salmon", category: "Just Protein", price: 16.9, protein: 46, carbs: 18, fat: 18, calories: 414 },
  { id: 107, name: "Overnight Oats & Berry", category: "High Carb", price: 8.9, protein: 18, carbs: 52, fat: 6, calories: 334 },
  { id: 108, name: "Greek Chicken Wrap", category: "Just Protein", price: 12.9, protein: 34, carbs: 36, fat: 10, calories: 374 },
  { id: 109, name: "Egg White & Avocado Toast", category: "High Carb", price: 9.5, protein: 22, carbs: 34, fat: 12, calories: 332 },
  { id: 110, name: "Beef Rendang & Cauliflower", category: "Low Carb", price: 14.9, protein: 40, carbs: 10, fat: 22, calories: 398 },
  { id: 111, name: "Chicken Burrito Bowl", category: "High Carb", price: 12.5, protein: 30, carbs: 58, fat: 10, calories: 450 },
  { id: 112, name: "Prawn Fried Rice", category: "High Carb", price: 13.9, protein: 26, carbs: 60, fat: 8, calories: 428 },
] as const;

export const readySeriesBundles = [
  { category: "Low Carb Meals", name: "Signature 5 — Non-Beef", meals: 5, price: 48.99 },
  { category: "Low Carb Meals", name: "Signature 5 — Beef", meals: 5, price: 48.99 },
  { category: "Low Carb Meals", name: "9 Flavours of the Month", meals: 9, price: 86.55 },
  { category: "Low Carb Meals", name: "Essential 10 — Non-Beef", meals: 10, price: 93 },
  { category: "Low Carb Meals", name: "Essential 10 — Beef", meals: 10, price: 93 },
  { category: "High Carb Meals", name: "Signature 5 — Non-Beef", meals: 5, price: 48.99 },
  { category: "High Carb Meals", name: "Signature 5 — Beef", meals: 5, price: 48.99 },
  { category: "High Carb Meals", name: "9 Flavours of the Month", meals: 9, price: 88.45 },
  { category: "High Carb Meals", name: "Essential 10 — Non-Beef", meals: 10, price: 93 },
  { category: "High Carb Meals", name: "Essential 10 — Beef", meals: 10, price: 93 },
  { category: "Just Protein", name: "JP Variety Bundle of 10", meals: 10, price: 55.1 },
  { category: "Mixed Bundle", name: "7 Low Carb + 7 Just Protein", meals: 14, price: 118.3 },
  { category: "Mixed Bundle", name: "7 High Carb + 7 Just Protein", meals: 14, price: 117.37 },
] as const;

export const readySeriesSubscriptions = [
  { sku: "JPSUB01", name: "Just Protein", variant: "Non-Beef", items: 14, price3m: 252.9, price6m: 480.5 },
  { sku: "JPSUB02", name: "Just Protein", variant: "Beef", items: 14, price3m: 252.9, price6m: 480.5 },
  { sku: "LCSUB01", name: "Low Carb Meals", variant: "Non-Beef", items: 10, price3m: 303, price6m: 575.7 },
  { sku: "LCSUB02", name: "Low Carb Meals", variant: "Beef", items: 10, price3m: 303, price6m: 575.7 },
  { sku: "HCSUB01", name: "High Carb Meals", variant: "Non-Beef", items: 10, price3m: 303, price6m: 575.7 },
  { sku: "HCSUB02", name: "High Carb Meals", variant: "Beef", items: 10, price3m: 303, price6m: 575.7 },
  { sku: "LCMIXSUB01", name: "Low Carb + Just Protein", variant: "Non-Beef", items: 15, price3m: 354.56, price6m: 693.9 },
  { sku: "LCMIXSUB02", name: "Low Carb + Just Protein", variant: "Beef", items: 15, price3m: 354.56, price6m: 693.9 },
  { sku: "HCMIXSUB01", name: "High Carb + Just Protein", variant: "Non-Beef", items: 15, price3m: 354.56, price6m: 693.9 },
  { sku: "HCMIXSUB02", name: "High Carb + Just Protein", variant: "Beef", items: 15, price3m: 354.56, price6m: 693.9 },
] as const;

export const walletRules = {
  presets: [20, 50, 100, 200],
  customMinimum: 5,
  customMaximum: 500,
  redemptionTiers: [
    { points: 500, credit: 5 },
    { points: 1000, credit: 11 },
    { points: 2000, credit: 25 },
  ],
  loyaltyTiers: [
    { name: "Starter", minimum: 0, maximum: 499, earnRate: 1 },
    { name: "Gold", minimum: 500, maximum: 1999, earnRate: 1.5 },
    { name: "Platinum", minimum: 2000, maximum: null, earnRate: 2 },
  ],
  referralPoints: 200,
  inactivityExpiryDays: 90,
} as const;

export const giftCardRules = {
  denominations: [25, 50, 100, 150],
  physicalCardFee: 5,
  expires: false,
  refundable: false,
  appliesTo: ["Ready Series Individual Selection", "Ready Series Bundles", "Meal Plan subscriptions"],
} as const;
