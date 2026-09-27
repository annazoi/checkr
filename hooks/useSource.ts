"use client";

import { useQuery } from "@tanstack/react-query";
import type { SignalProfile, SourceType } from "@/types";

type SourceResponse = {
  gameSourceId: string;
  source: { id: string; domain: string; sourceType: SourceType };
  game: { id: string; slug: string; title: string };
  signal: SignalProfile;
};

export function useSource(gameSourceId: string) {
  return useQuery({
    queryKey: ["source", gameSourceId],
    queryFn: async (): Promise<SourceResponse> => {
      const res = await fetch(`/api/sources/${gameSourceId}`);
      const body = await res.json();
      if (!res.ok) throw new Error(body.error?.message ?? "Failed to load this source.");
      return body.data;
    },
    enabled: Boolean(gameSourceId),
  });
}
