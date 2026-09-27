"use client";

import { Card } from "@/components/ui/Card";
import { SignalBar } from "@/components/ui/SignalBar";
import { useT } from "@/components/i18n/LocaleProvider";

type CommunityOverviewProps = {
  sourceCount: number;
  concernSourceCount: number;
  noIssue: number;
  mixed: number;
  concerns: number;
  security: number;
};

export function CommunityOverview({
  sourceCount,
  concernSourceCount,
  noIssue,
  mixed,
  concerns,
  security,
}: CommunityOverviewProps) {
  const t = useT();

  return (
    <Card>
      <h2 className="text-lg font-semibold text-text-primary">{t("games.communityOverview")}</h2>
      <p className="mt-1 text-sm text-text-secondary">
        {t(sourceCount === 1 ? "home.sourcesDiscussedSingular" : "home.sourcesDiscussedPlural", { count: sourceCount })}
        {concernSourceCount > 0 ? ` · ${t("games.withConcernsCount", { count: concernSourceCount })}` : ""}
      </p>
      <div className="mt-4">
        <SignalBar noIssue={noIssue} mixed={mixed} concerns={concerns} security={security} />
      </div>
    </Card>
  );
}
