import Link from "next/link";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { SignalBar } from "@/components/ui/SignalBar";
import { SignalLabel } from "@/components/ui/SignalLabel";
import type { SignalProfile, SourceType } from "@/types";

type SourceCardProps = {
  gameSourceId: string;
  domain: string;
  sourceType: SourceType;
  signal: SignalProfile;
};

const SOURCE_TYPE_LABELS: Record<SourceType, string> = {
  official_store: "Official store",
  reseller: "Reseller",
  third_party: "Third-party store",
  unknown: "Unknown source",
};

function describeSignal(signal: SignalProfile) {
  switch (signal.signalLabel) {
    case "mostly_clear":
      return "Most contributors described an ordinary experience.";
    case "mixed_reports":
      return "Experiences vary across recent community reports.";
    case "concerns_reported":
    case "security_reports":
      return "Several contributors described unexpected behavior.";
    default:
      return "Not enough reports yet to see a pattern.";
  }
}

export function SourceCard({ gameSourceId, domain, sourceType, signal }: SourceCardProps) {
  return (
    <Link
      href={`/sources/${gameSourceId}`}
      className="block rounded-card border border-border bg-surface p-5 transition-colors hover:border-white/20"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-semibold text-accent-light">{domain}</p>
          <p className="text-xs text-text-secondary">{SOURCE_TYPE_LABELS[sourceType]}</p>
        </div>
        <ChevronRightIcon className="h-5 w-5 shrink-0 text-text-secondary" aria-hidden="true" />
      </div>
      <p className="mt-3 text-sm text-text-secondary">{describeSignal(signal)}</p>
      <div className="mt-3">
        <SignalBar
          noIssue={signal.noIssuePercent}
          mixed={Math.max(0, 100 - signal.noIssuePercent - signal.concernPercent)}
          concerns={signal.concernPercent}
        />
      </div>
      <div className="mt-3 flex items-center justify-between">
        <SignalLabel label={signal.signalLabel} />
        <span className="text-xs text-text-secondary">{signal.volumeCount} reports</span>
      </div>
    </Link>
  );
}
