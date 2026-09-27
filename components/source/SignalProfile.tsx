"use client";

import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { Card } from "@/components/ui/Card";
import { SignalBar } from "@/components/ui/SignalBar";
import { SignalLabel } from "@/components/ui/SignalLabel";
import { SignalExplanation } from "@/components/source/SignalExplanation";
import { useLocale, useT } from "@/components/i18n/LocaleProvider";
import type { SignalProfile as SignalProfileType } from "@/types";

export function SignalProfile({ profile }: { profile: SignalProfileType }) {
  const t = useT();
  const { dictionary } = useLocale();

  return (
    <Card>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-text-primary">{t("signal.communitySignal")}</h2>
        <SignalLabel label={profile.signalLabel} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-control bg-elevated p-3">
          <p className="font-semibold text-text-primary">{t("home.reportsCount", { count: profile.volumeCount })}</p>
          <p className="text-xs text-text-secondary">{t("signal.reportsSharedByPlayers")}</p>
        </div>
        <div className="rounded-control bg-elevated p-3">
          <p className="font-semibold text-text-primary">{dictionary.signal.distribution[profile.distribution]}</p>
          <p className="text-xs text-text-secondary">{t("signal.overallTone")}</p>
        </div>
        <div className="rounded-control bg-elevated p-3">
          <p className="font-semibold text-text-primary">{dictionary.signal.recency[profile.recency]}</p>
          <p className="text-xs text-text-secondary">{t("signal.recentActivityLabel")}</p>
        </div>
        <div className="rounded-control bg-elevated p-3">
          <p className="font-semibold text-text-primary">
            {profile.hasEvidence ? t("signal.withEvidence", { count: profile.evidenceCount }) : t("signal.noEvidence")}
          </p>
          <p className="text-xs text-text-secondary">{t("signal.reportDetail")}</p>
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
          <span>{t("signal.anomalyWarning")}</span>
        </div>
      )}
    </Card>
  );
}
