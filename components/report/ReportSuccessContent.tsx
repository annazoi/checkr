"use client";

import Link from "next/link";
import { CheckIcon } from "@heroicons/react/24/solid";
import { buttonClasses } from "@/components/ui/Button";
import { useT } from "@/components/i18n/LocaleProvider";

export function ReportSuccessContent({ gameSourceId }: { gameSourceId: string | null }) {
  const t = useT();

  return (
    <div className="mx-auto flex min-h-[calc(100vh-64px)] max-w-md flex-col items-center justify-center px-6 py-16 text-center">
      <span className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-status-clear/15">
        <CheckIcon className="h-8 w-8 text-status-clear" aria-hidden="true" />
      </span>
      <p className="text-xs font-semibold uppercase tracking-wide text-accent-light">
        {t("reportSuccess.reportSubmitted")}
      </p>
      <h1 className="mt-2 text-2xl font-bold text-text-primary">{t("reportSuccess.thanksForSharing")}</h1>
      <p className="mt-2 text-sm text-text-secondary">{t("reportSuccess.pendingReviewMessage")}</p>

      <div className="mt-8 flex w-full flex-col gap-3">
        {gameSourceId && (
          <Link
            href={`/sources/${gameSourceId}`}
            className={`${buttonClasses({ variant: "primary" })} w-full`}
          >
            {t("reportSuccess.backToSource")}
          </Link>
        )}
        <Link href="/search" className={`${buttonClasses({ variant: "secondary" })} w-full`}>
          {t("reportSuccess.searchAnotherGame")}
        </Link>
      </div>
    </div>
  );
}
