import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { Card } from "@/components/ui/Card";
import { SignalBar } from "@/components/ui/SignalBar";
import { SignalLabel } from "@/components/ui/SignalLabel";
import { SignalExplanation } from "@/components/source/SignalExplanation";
import type { SignalProfile as SignalProfileType } from "@/types";

const DISTRIBUTION_LABELS: Record<SignalProfileType["distribution"], string> = {
  predominantly_positive: "Predominantly positive",
  mostly_positive: "Mostly positive",
  divided: "Divided opinions",
  majority_concerns: "Majority concerns",
  strong_concern_pattern: "Strong concern pattern",
};

const RECENCY_LABELS: Record<SignalProfileType["recency"], string> = {
  active: "Active data",
  recent: "Recent activity",
  older: "Older reports",
  historical: "Historical only",
};

export function SignalProfile({ profile }: { profile: SignalProfileType }) {
  return (
    <Card>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-text-primary">Community signal</h2>
        <SignalLabel label={profile.signalLabel} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-control bg-elevated p-3">
          <p className="font-semibold text-text-primary">{profile.volumeCount} reports</p>
          <p className="text-xs text-text-secondary">Shared by players</p>
        </div>
        <div className="rounded-control bg-elevated p-3">
          <p className="font-semibold text-text-primary">
            {DISTRIBUTION_LABELS[profile.distribution]}
          </p>
          <p className="text-xs text-text-secondary">Overall tone</p>
        </div>
        <div className="rounded-control bg-elevated p-3">
          <p className="font-semibold text-text-primary">{RECENCY_LABELS[profile.recency]}</p>
          <p className="text-xs text-text-secondary">Recent activity</p>
        </div>
        <div className="rounded-control bg-elevated p-3">
          <p className="font-semibold text-text-primary">
            {profile.hasEvidence ? `${profile.evidenceCount} with evidence` : "No evidence"}
          </p>
          <p className="text-xs text-text-secondary">Report detail</p>
        </div>
      </div>

      <div className="mt-4">
        <SignalBar
          noIssue={profile.noIssuePercent}
          mixed={Math.max(0, 100 - profile.noIssuePercent - profile.concernPercent)}
          concerns={profile.concernPercent}
        />
      </div>

      <div className="mt-4">
        <SignalExplanation explanation={profile.explanation} />
      </div>

      {profile.anomalyDetected && (
        <div className="mt-4 flex items-start gap-2 rounded-control border border-status-concern/40 bg-status-concern/10 p-3 text-sm text-status-concern">
          <ExclamationTriangleIcon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <span>Unusual report activity detected — this signal may be less reliable.</span>
        </div>
      )}
    </Card>
  );
}
