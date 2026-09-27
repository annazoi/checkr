"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Chip } from "@/components/ui/Chip";
import { GameCard } from "@/components/game/GameCard";
import { GameCardSkeleton } from "@/components/ui/Skeleton";
import { useT } from "@/components/i18n/LocaleProvider";

const PLATFORM_VALUES = ["All", "PC", "PlayStation", "Xbox", "Switch", "Mobile"];

type GameHit = {
  id: string;
  slug: string;
  title: string;
  developer?: string;
  platforms?: string[];
  coverUrl?: string;
};

export function SearchResults() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const [platform, setPlatform] = useState("All");
  const t = useT();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["games-search", q, platform],
    queryFn: async () => {
      const params = new URLSearchParams({ q, platform });
      const res = await fetch(`/api/games?${params.toString()}`);
      const body = await res.json();
      if (!res.ok) throw new Error(body.error?.message ?? "Search failed.");
      return body.data as { hits: GameHit[]; total: number };
    },
  });

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {PLATFORM_VALUES.map((p) => (
          <Chip key={p} active={platform === p} onClick={() => setPlatform(p)}>
            {p === "All" ? t("search.all") : p}
          </Chip>
        ))}
      </div>

      <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-text-secondary">
        {isLoading ? t("common.searching") : t("search.gamesFoundCount", { count: data?.total ?? 0 })}
      </p>

      <div className="mt-2">
        {isLoading &&
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="py-2">
              <GameCardSkeleton />
            </div>
          ))}

        {!isLoading && isError && (
          <div className="flex flex-col items-center gap-2 py-16 text-center text-text-secondary">
            <MagnifyingGlassIcon className="h-8 w-8" aria-hidden="true" />
            <p>{t("search.searchUnavailable")}</p>
          </div>
        )}

        {!isLoading && !isError && data?.hits.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-16 text-center text-text-secondary">
            <MagnifyingGlassIcon className="h-8 w-8" aria-hidden="true" />
            <p>{t("search.noGamesFound")}</p>
          </div>
        )}

        {!isLoading &&
          !isError &&
          data?.hits.map((hit) => (
            <GameCard
              key={hit.id}
              slug={hit.slug}
              title={hit.title}
              developer={hit.developer}
              platforms={hit.platforms}
              coverUrl={hit.coverUrl}
            />
          ))}
      </div>
    </div>
  );
}
