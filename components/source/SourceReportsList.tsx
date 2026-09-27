"use client";

import { useEffect, useState } from "react";
import { Chip } from "@/components/ui/Chip";
import { ReportCard } from "@/components/report/ReportCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { Spinner } from "@/components/ui/Spinner";
import { useReports, type SourceReportRow } from "@/hooks/useReports";
import { useT } from "@/components/i18n/LocaleProvider";

const TAB_KEYS = ["all", "no_issues", "concerns", "security"] as const;

const PAGE_SIZE = 10;

export function SourceReportsList({
  gameSourceId,
  initialReports,
}: {
  gameSourceId: string;
  initialReports: SourceReportRow[];
}) {
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<SourceReportRow[]>(initialReports);
  const t = useT();

  const tabs = TAB_KEYS.map((key) => ({
    key,
    label:
      key === "all"
        ? t("search.all")
        : key === "no_issues"
          ? t("report.categories.no_issue")
          : key === "concerns"
            ? t("signal.concernsLabel")
            : t("reportTypes.antivirus_warning"),
  }));

  const skipFetch = page === 1 && filter === "all";
  const { data, isLoading } = useReports(gameSourceId, filter, page);

  useEffect(() => {
    if (skipFetch) {
      setItems(initialReports);
      return;
    }
    if (!data) return;
    setItems((prev) => (page === 1 ? data.reports : [...prev, ...data.reports]));
  }, [data, page, skipFetch, initialReports]);

  function handleFilterChange(next: string) {
    setFilter(next);
    setPage(1);
  }

  const loading = !skipFetch && isLoading && page === 1;
  const loadingMore = !skipFetch && isLoading && page > 1;
  const hasMore = skipFetch
    ? initialReports.length === PAGE_SIZE
    : (data?.reports.length ?? 0) === PAGE_SIZE;

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map((tab) => (
          <Chip key={tab.key} active={filter === tab.key} onClick={() => handleFilterChange(tab.key)}>
            {tab.label}
          </Chip>
        ))}
      </div>

      <div className="mt-2">
        {loading &&
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2 border-b border-border py-4 last:border-none">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          ))}

        {!loading && items.length === 0 && (
          <p className="py-8 text-center text-sm text-text-secondary">{t("sources.noReportsMatchFilter")}</p>
        )}

        {!loading && items.map((report) => <ReportCard key={report.id} report={report} />)}
      </div>

      {!loading && hasMore && (
        <button
          type="button"
          onClick={() => setPage((p) => p + 1)}
          disabled={loadingMore}
          className="mt-4 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-control border border-accent text-sm font-medium text-accent-light disabled:opacity-60"
        >
          {loadingMore ? <Spinner size={16} /> : t("common.loadMore")}
        </button>
      )}
    </div>
  );
}
