import Link from "next/link";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { formatRelativeTime } from "@/lib/utils/format-relative-time";

const REPORT_TYPE_LABELS: Record<string, string> = {
  no_issue: "No issues encountered",
  suspicious: "Suspicious behavior",
  malware: "Malware",
  suspicious_installer: "Unexpected installer",
  fake_content: "Misleading details",
  dangerous_redirect: "Dangerous redirect",
  unexpected_software: "Unexpected download",
  antivirus_warning: "Security warning",
  other: "Something else",
};

type HistoryRow = {
  id: string;
  reportType: string;
  status: string;
  createdAt: Date | string | null;
  gameSourceId: string;
  domain: string;
};

export function ContributionHistory({ history }: { history: HistoryRow[] }) {
  if (history.length === 0) {
    return (
      <div>
        <h2 className="mb-3 text-lg font-semibold text-text-primary">Contribution history</h2>
        <p className="rounded-card border border-border bg-surface p-5 text-center text-sm text-text-secondary">
          No reports shared yet.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-3 text-lg font-semibold text-text-primary">Contribution history</h2>
      <div className="divide-y divide-border rounded-card border border-border bg-surface">
        {history.map((row) => (
          <Link
            key={row.id}
            href={`/sources/${row.gameSourceId}`}
            className="flex items-center justify-between gap-3 p-4 first:rounded-t-card last:rounded-b-card hover:bg-elevated"
          >
            <div className="min-w-0">
              <p className="truncate font-medium text-text-primary">
                {REPORT_TYPE_LABELS[row.reportType] ?? row.reportType}
              </p>
              <p className="truncate text-xs text-text-secondary">
                {row.domain} · {row.createdAt ? formatRelativeTime(new Date(row.createdAt).toISOString()) : ""}
              </p>
            </div>
            <ChevronRightIcon className="h-5 w-5 shrink-0 text-text-secondary" aria-hidden="true" />
          </Link>
        ))}
      </div>
    </div>
  );
}
