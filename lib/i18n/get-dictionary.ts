import type { Locale } from "./config";
import type { Dictionary } from "./dictionaries/en";
import en from "./dictionaries/en";
import el from "./dictionaries/el";

const dictionaries: Record<Locale, Dictionary> = { en, el };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries.en;
}
