"use client";

import { ShieldExclamationIcon } from "@heroicons/react/24/outline";
import { useT } from "@/components/i18n/LocaleProvider";

export function Disclaimer() {
  const t = useT();

  return (
    <p className="flex items-start gap-2 text-xs text-text-secondary">
      <ShieldExclamationIcon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <span>{t("disclaimer.text")}</span>
    </p>
  );
}
