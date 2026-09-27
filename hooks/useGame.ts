"use client";

import { useQuery } from "@tanstack/react-query";
import type { GameSourceWithSignal } from "@/lib/games/queries";
import type { Game } from "@/types";

type GameResponse = {
  game: Game;
  sources: GameSourceWithSignal[];
};

export function useGame(slug: string) {
  return useQuery({
    queryKey: ["game", slug],
    queryFn: async (): Promise<GameResponse> => {
      const res = await fetch(`/api/games/${slug}`);
      const body = await res.json();
      if (!res.ok) throw new Error(body.error?.message ?? "Failed to load this game.");
      return body.data;
    },
    enabled: Boolean(slug),
  });
}
