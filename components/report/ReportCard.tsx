"use client";

import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ShieldExclamationIcon,
} from "@heroicons/react/24/outline";
import { formatRelativeTime } from "@/lib/utils/format-relative-time";
import { useLocale, useT } from "@/components/i18n/LocaleProvider";
import type { SourceReportRow } from "@/hooks/useReports";

const SECURITY_TYPES = new Set(["malware", "antivirus_warning"]);

function iconFor(reportType: string) {
  if (reportType === "no_issue") {
    return { Icon: CheckCircleIcon, className: "text-status-clear" };
  }
  if (SECURITY_TYPES.has(reportType)) {
    return { Icon: ShieldExclamationIcon, className: "text-status-risk" };
  }
  return { Icon: ExclamationTriangleIcon, className: "text-status-concern" };
}

function trustLabelKey(level: number | null) {
  if (!level || level <= 2) return "contributor";
  if (level === 3) return "trustedReporter";
  if (level === 4) return "expertContributor";
  return "communityGuardian";
}

export function ReportCard({ report }: { report: SourceReportRow }) {
  const { Icon, className } = iconFor(report.reportType);
  const { dictionary, locale } = useLocale();
  const t = useT();
  const reportTypeLabel =
    dictionary.reportTypes[report.reportType as keyof typeof dictionary.reportTypes] ?? report.reportType;

  return (
    <div className="border-b border-border py-4 last:border-none">
      <div className="flex items-start gap-2">
        <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${className}`} aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline justify-between gap-x-2">
            <p className="font-medium text-text-primary">{reportTypeLabel}</p>
            <span className="text-xs text-text-secondary">{formatRelativeTime(report.createdAt, locale)}</span>
          </div>
          {report.description && (
            <p className="mt-1 text-sm text-text-secondary">{report.description}</p>
          )}
          <span className="mt-2 inline-block text-xs font-medium text-accent-light">
            {t(`admin.trust.${trustLabelKey(report.level)}`)}
          </span>
        </div>
      </div>
    </div>
  );
}
