"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";
import { useT } from "@/components/i18n/LocaleProvider";

type GameHit = { slug: string; title: string };

export function GameStep({
  onSelect,
}: {
  onSelect: (game: { slug: string; title: string }) => void;
}) {
  const [q, setQ] = useState("");
  const t = useT();

  const { data, isLoading } = useQuery({
    queryKey: ["report-game-search", q],
    queryFn: async (): Promise<{ hits: GameHit[] }> => {
      const params = new URLSearchParams({ q });
      const res = await fetch(`/api/games?${params.toString()}`);
      const body = await res.json();
      if (!res.ok) throw new Error(body.error?.message ?? "Search failed.");
      return body.data;
    },
    enabled: q.trim().length > 1,
  });

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-accent-light">
        {t("report.shareAnExperience")}
      </p>
      <h1 className="mt-2 text-2xl font-bold text-text-primary">{t("report.whichGame")}</h1>
      <p className="mt-1 text-sm text-text-secondary">{t("report.findGameFirst")}</p>

      <div className="relative mt-5">
        <MagnifyingGlassIcon
          className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-secondary"
          aria-hidden="true"
        />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t("common.searchPlaceholder")}
          className="h-14 pl-12"
          autoFocus
        />
      </div>

      <div className="mt-3">
        {isLoading && (
          <p className="flex items-center gap-2 text-sm text-text-secondary">
            <Spinner size={14} /> {t("common.searching")}
          </p>
        )}
        {!isLoading &&
          data?.hits.map((hit) => (
            <button
              key={hit.slug}
              type="button"
              onClick={() => onSelect(hit)}
              className="flex min-h-[48px] w-full items-center justify-between border-b border-border py-3 text-left last:border-none"
            >
              <span className="font-medium text-text-primary">{hit.title}</span>
            </button>
          ))}
        {!isLoading && q.trim().length > 1 && data?.hits.length === 0 && (
          <p className="py-4 text-sm text-text-secondary">{t("report.noGamesFound")}</p>
        )}
      </div>
    </div>
  );
}
