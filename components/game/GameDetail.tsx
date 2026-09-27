"use client";

import Link from "next/link";
import { GameHero } from "@/components/game/GameHero";
import { CommunityOverview } from "@/components/game/CommunityOverview";
import { SourceCard } from "@/components/source/SourceCard";
import { SignalLabel } from "@/components/ui/SignalLabel";
import { Disclaimer } from "@/components/ui/Disclaimer";
import { Card } from "@/components/ui/Card";
import { buttonClasses } from "@/components/ui/Button";
import { useT } from "@/components/i18n/LocaleProvider";
import type { GameSourceWithSignal } from "@/lib/games/queries";
import type { SignalLabelType } from "@/types";

type GameDetailProps = {
  game: {
    slug: string;
    title: string;
    developer: string | null;
    releaseYear: number | null;
    platforms: string[];
    coverUrl: string | null;
  };
  sources: GameSourceWithSignal[];
  isAuthenticated: boolean;
  aggregateSignalLabel: SignalLabelType;
  concernSourceCount: number;
  avgNoIssue: number;
  avgMixed: number;
  avgConcerns: number;
};

export function GameDetail({
  game,
  sources,
  isAuthenticated,
  aggregateSignalLabel,
  concernSourceCount,
  avgNoIssue,
  avgMixed,
  avgConcerns,
}: GameDetailProps) {
  const t = useT();

  return (
    <div>
      <GameHero
        title={game.title}
        developer={game.developer}
        releaseYear={game.releaseYear}
        platforms={game.platforms}
        coverUrl={game.coverUrl}
      >
        <SignalLabel label={aggregateSignalLabel} />
      </GameHero>

      <div className="mx-auto grid max-w-page gap-6 px-6 pb-16 md:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <CommunityOverview
            sourceCount={sources.length}
            concernSourceCount={concernSourceCount}
            noIssue={avgNoIssue}
            mixed={avgMixed}
            concerns={avgConcerns}
            security={0}
          />

          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-text-primary">{t("games.sourcesDiscussed")}</h2>
              {isAuthenticated ? (
                <Link href={`/report?game=${game.slug}`} className="text-sm font-medium text-accent-light">
                  {t("games.addSource")}
                </Link>
              ) : null}
            </div>

            {sources.length === 0 ? (
              <Card className="text-center text-sm text-text-secondary">{t("games.noSourcesYet")}</Card>
            ) : (
              <div className="space-y-3">
                {sources.map((s) => (
                  <SourceCard
                    key={s.gameSourceId}
                    gameSourceId={s.gameSourceId}
                    domain={s.source.domain}
                    sourceType={s.source.sourceType}
                    signal={s.signal}
                  />
                ))}
              </div>
            )}
          </div>

          <Disclaimer />
        </div>

        <div className="space-y-4">
          <Card>
            <p className="text-xs font-semibold uppercase tracking-wide text-accent-light">{t("games.atAGlance")}</p>
            <h2 className="mt-1 text-lg font-semibold text-text-primary">{t("games.communityOverview")}</h2>
            <p className="mt-1 text-sm text-text-secondary">{t("games.communityOverviewDescription")}</p>

            <div className="mt-4 space-y-2">
              {sources.map((s) => (
                <div key={s.gameSourceId} className="flex items-center justify-between text-sm">
                  <span className="truncate text-text-secondary">{s.source.domain}</span>
                  <SignalLabel label={s.signal.signalLabel} />
                </div>
              ))}
            </div>

            {isAuthenticated ? (
              <Link
                href={`/report?game=${game.slug}`}
                className={`${buttonClasses({ variant: "primary" })} mt-5 w-full`}
              >
                {t("games.reportYourExperience")}
              </Link>
            ) : (
              <Link
                href={`/auth/login?callbackUrl=/games/${game.slug}`}
                className={`${buttonClasses({ variant: "primary" })} mt-5 w-full`}
              >
                {t("games.logInToReport")}
              </Link>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
