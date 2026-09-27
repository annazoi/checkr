"use client";

import { useT } from "@/components/i18n/LocaleProvider";

export function AdminQueueHeader() {
  const t = useT();

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary">{t("admin.moderationQueue")}</h1>
      <p className="mt-1 text-sm text-text-secondary">{t("admin.moderationQueueDescription")}</p>
    </div>
  );
}
