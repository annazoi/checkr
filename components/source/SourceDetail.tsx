"use client";

import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { SignalProfile } from "@/components/source/SignalProfile";
import { SourceReportsList } from "@/components/source/SourceReportsList";
import { Disclaimer } from "@/components/ui/Disclaimer";
import { Badge } from "@/components/ui/Badge";
import { useLocale, useT } from "@/components/i18n/LocaleProvider";
import type { SignalProfile as SignalProfileType } from "@/types";
import type { SourceReportRow } from "@/hooks/useReports";

export function SourceDetail({
  gameSlug,
  domain,
  sourceType,
  signal,
  gameSourceId,
  initialReports,
}: {
  gameSlug: string;
  domain: string;
  sourceType: string;
  signal: SignalProfileType;
  gameSourceId: string;
  initialReports: SourceReportRow[];
}) {
  const t = useT();
  const { dictionary } = useLocale();
  const sourceTypeLabel =
    dictionary.sources.types[sourceType as keyof typeof dictionary.sources.types] ?? dictionary.sources.types.unknown;

  return (
    <div className="mx-auto max-w-page px-6 py-6">
      <Link
        href={`/games/${gameSlug}`}
        className="group mb-6 flex items-center gap-2 text-sm font-medium text-text-secondary transition-colors duration-200 hover:text-text-primary"
      >
        <ArrowLeftIcon
          className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1"
          aria-hidden="true"
        />
        {t("sources.backToGame")}
      </Link>

      <p className="text-xs font-semibold uppercase tracking-wide text-accent-light">{t("sources.sourceProfile")}</p>
      <div className="mt-1 flex flex-wrap items-center gap-2">
        <h1 className="text-2xl font-bold text-text-primary">{domain}</h1>
        <Badge tone="neutral">{sourceTypeLabel}</Badge>
      </div>
      <p className="mt-1 text-sm text-text-secondary">{t("sources.sourceProfileDescription")}</p>

      <div className="mt-6">
        <SignalProfile profile={signal} />
      </div>

      <div className="mt-8">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-accent-light">{t("sources.fromCommunity")}</p>
        <h2 className="mb-3 text-lg font-semibold text-text-primary">{t("sources.playerExperiences")}</h2>
        <SourceReportsList gameSourceId={gameSourceId} initialReports={initialReports} />
      </div>

      <div className="mt-8">
        <Disclaimer />
      </div>
    </div>
  );
}
