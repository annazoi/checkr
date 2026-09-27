import { Card } from "@/components/ui/Card";
import { SignalBar } from "@/components/ui/SignalBar";

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
  return (
    <Card>
      <h2 className="text-lg font-semibold text-text-primary">Community overview</h2>
      <p className="mt-1 text-sm text-text-secondary">
        {sourceCount} source{sourceCount === 1 ? "" : "s"} discussed
        {concernSourceCount > 0 ? ` · ${concernSourceCount} with concerns` : ""}
      </p>
      <div className="mt-4">
        <SignalBar noIssue={noIssue} mixed={mixed} concerns={concerns} security={security} />
      </div>
    </Card>
  );
}
