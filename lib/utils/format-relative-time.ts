import { defaultLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

const UNITS: { limit: number; divisor: number; key: "seconds" | "minutes" | "hours" | "days" | "weeks" | "months" }[] = [
  { limit: 60, divisor: 1, key: "seconds" },
  { limit: 3600, divisor: 60, key: "minutes" },
  { limit: 86400, divisor: 3600, key: "hours" },
  { limit: 604800, divisor: 86400, key: "days" },
  { limit: 2629800, divisor: 604800, key: "weeks" },
  { limit: 31557600, divisor: 2629800, key: "months" },
];

export function formatRelativeTime(iso: string, locale: Locale = defaultLocale) {
  const dictionary = getDictionary(locale);
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 30) return dictionary.relativeTime.justNow;

  for (const unit of UNITS) {
    if (seconds < unit.limit) {
      const value = Math.floor(seconds / unit.divisor);
      const template = dictionary.relativeTime[unit.key];
      return (value === 1 ? template.singular : template.plural).replace("{count}", String(value));
    }
  }

  const years = Math.floor(seconds / 31557600);
  const template = dictionary.relativeTime.years;
  return (years === 1 ? template.singular : template.plural).replace("{count}", String(years));
}
