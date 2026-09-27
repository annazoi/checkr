"use client";

import { useState } from "react";
import { LanguageIcon } from "@heroicons/react/24/outline";
import { locales, type Locale } from "@/lib/i18n/config";
import { useLocale, useT } from "@/components/i18n/LocaleProvider";
import { cn } from "@/lib/utils/cn";

const LOCALE_LABELS: Record<Locale, string> = {
  en: "EN",
  el: "ΕΛ",
};

export function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const { locale, setLocale } = useLocale();
  const t = useT();

  function handleSelect(next: Locale) {
    setLocale(next);
    setOpen(false);
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={t("nav.language")}
        aria-expanded={open}
        className="flex h-11 w-11 items-center justify-center rounded-full text-text-secondary hover:text-text-primary"
      >
        <LanguageIcon className="h-5 w-5" aria-hidden="true" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} aria-hidden="true" />
          <div className="absolute right-0 z-50 mt-2 w-32 rounded-card border border-border bg-surface p-1 shadow-xl">
            {locales.map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => handleSelect(code)}
                className={cn(
                  "flex w-full items-center rounded-control px-3 py-2 text-sm font-medium hover:bg-elevated",
                  locale === code ? "text-text-primary" : "text-text-secondary",
                )}
              >
                {LOCALE_LABELS[code]}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
