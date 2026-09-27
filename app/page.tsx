import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { SearchBar } from "@/components/search/SearchBar";
import { SignalLabel } from "@/components/ui/SignalLabel";
import { Card } from "@/components/ui/Card";
import { getRecentGames, getSourcesWithConcerns } from "@/lib/home/queries";

export const revalidate = 300;

export default async function HomePage() {
  const [recentGames, concernSources] = await Promise.all([
    getRecentGames(3).catch(() => []),
    getSourcesWithConcerns(2).catch(() => []),
  ]);

  return (
    <div className="mx-auto max-w-page px-6 py-10">
      <section className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-wide text-accent-light">
          Community-powered game intelligence
        </p>
        <h1 className="mt-2 text-4xl font-bold leading-tight text-text-primary">
          Know the source.
          <br />
          <span className="text-accent-light">Play with perspective.</span>
        </h1>
        <p className="mt-4 text-text-secondary">
          See what other players have experienced with third-party stores, resellers, and
          download sites around your games.
        </p>

        <div className="mt-6">
          <Suspense fallback={<div className="h-14" />}>
            <SearchBar />
          </Suspense>
        </div>
        <p className="mt-2 text-xs text-text-secondary">
          Community reports reflect personal experiences, not security audits or guarantees.
          Always use your own judgment.
        </p>
      </section>

      <section className="mt-12">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-accent-light">
              Discover
            </p>
            <h2 className="text-xl font-semibold text-text-primary">Recent community activity</h2>
          </div>
          <Link href="/search" className="text-sm font-medium text-accent-light">
            View all →
          </Link>
        </div>

        {recentGames.length === 0 ? (
          <Card className="text-center text-sm text-text-secondary">
            No games have community reports yet. Search for a game and be the first to share your
            experience.
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-3">
            {recentGames.map((game) => (
              <Link
                key={game.slug}
                href={`/games/${game.slug}`}
                className="group relative aspect-[4/5] overflow-hidden rounded-card bg-elevated"
              >
                {game.coverUrl && (
                  <Image
                    src={game.coverUrl}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <SignalLabel label={game.signalLabel} />
                  <p className="mt-2 font-semibold text-text-primary">{game.title}</p>
                  <p className="text-xs text-text-secondary">
                    {game.sourceCount} source{game.sourceCount === 1 ? "" : "s"} discussed
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="mt-12">
        <p className="text-xs font-semibold uppercase tracking-wide text-accent-light">
          Worth a closer look
        </p>
        <h2 className="mb-3 text-xl font-semibold text-text-primary">
          Sources with recent concerns
        </h2>

        {concernSources.length === 0 ? (
          <Card className="text-center text-sm text-text-secondary">
            No sources have raised recent concerns.
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {concernSources.map((row) => (
              <Link
                key={row.gameSourceId}
                href={`/sources/${row.gameSourceId}`}
                className="block rounded-card border border-border bg-surface p-5 transition-colors hover:border-white/20"
              >
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-accent-light">{row.domain}</p>
                  <ArrowRightIcon className="h-4 w-4 text-text-secondary" aria-hidden="true" />
                </div>
                <p className="text-xs text-text-secondary">
                  {row.sourceType === "reseller" ? "Reseller" : "Third-party"}
                </p>
                <p className="mt-2 text-sm text-text-secondary">
                  {row.signal.signalLabel === "mixed_reports"
                    ? "Experiences vary across recent community reports."
                    : "Several contributors described unexpected behavior."}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <SignalLabel label={row.signal.signalLabel} />
                  <span className="text-xs text-text-secondary">
                    {row.signal.volumeCount} reports
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="mt-12 flex items-center justify-between border-t border-border pt-6">
        <div>
          <p className="text-sm font-medium text-text-primary">Every report adds context.</p>
          <p className="text-sm text-text-secondary">
            Your experience could help another player decide what to look into.
          </p>
        </div>
        <Link href="/report" aria-label="Share your experience" className="text-accent-light">
          <ArrowRightIcon className="h-5 w-5" aria-hidden="true" />
        </Link>
      </section>
    </div>
  );
}
