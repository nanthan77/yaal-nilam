import type { Locale } from "./translations";

// Match the billing periods used by the listing dashboard.
export function rentalPriceSuffix(intent: string, locale: Locale): string {
  if (intent === "rent") return locale === "ta" ? "/மாதம்" : "/month";
  if (intent === "short_rent") return locale === "ta" ? "/இரவு" : "/night";
  return "";
}

export function localDateToday(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}
