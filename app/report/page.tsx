"use client";

import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { ReportForm } from "@/components/report/ReportForm";
import { useT } from "@/components/i18n/LocaleProvider";

export default function ReportPage({
  searchParams,
}: {
  searchParams: { game?: string };
}) {
  const t = useT();

  return (
    <div className="mx-auto max-w-page px-6 py-8 md:py-12">
      <div className="mx-auto md:max-w-2xl">
        <Link
          href={searchParams.game ? `/games/${searchParams.game}` : "/"}
          className="mb-4 inline-flex min-h-[44px] items-center gap-2 text-sm font-medium text-text-secondary hover:text-text-primary"
        >
          <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
          {t("common.back")}
        </Link>
        <div className="md:rounded-card md:border md:border-border md:bg-surface md:p-8">
          <ReportForm initialGameSlug={searchParams.game} />
        </div>
      </div>
    </div>
  );
}
