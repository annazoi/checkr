"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { localeCookieName, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";

type Vars = Record<string, string | number>;

type LocaleContextValue = {
  locale: Locale;
  dictionary: Dictionary;
  setLocale: (locale: Locale) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function resolvePath(dictionary: Dictionary, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, dictionary);
}

function interpolate(value: string, vars?: Vars): string {
  if (!vars) return value;
  return value.replace(/\{(\w+)\}/g, (match, key) => {
    const replacement = vars[key];
    return replacement === undefined ? match : String(replacement);
  });
}

export function LocaleProvider({
  initialLocale,
  children,
}: {
  initialLocale: Locale;
  children: React.ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    document.cookie = `${localeCookieName}=${next}; path=/; max-age=31536000; samesite=lax`;
  }, []);

  const dictionary = useMemo(() => getDictionary(locale), [locale]);

  const value = useMemo(() => ({ locale, dictionary, setLocale }), [locale, dictionary, setLocale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within a LocaleProvider");
  return ctx;
}

export function useT() {
  const { dictionary } = useLocale();
  return useCallback(
    (path: string, vars?: Vars) => {
      const value = resolvePath(dictionary, path);
      if (typeof value !== "string") return path;
      return interpolate(value, vars);
    },
    [dictionary],
  );
}
