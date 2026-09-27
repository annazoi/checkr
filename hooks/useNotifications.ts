"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";

export type NotificationRow = {
  id: string;
  type: string;
  title: string;
  body: string | null;
  readAt: string | null;
  createdAt: string;
};

const POLL_INTERVAL_MS = 60_000;

export function useNotifications(enabled: boolean) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["notifications"],
    queryFn: async (): Promise<{ notifications: NotificationRow[]; unreadCount: number }> => {
      const res = await fetch("/api/notifications");
      const body = await res.json();
      if (!res.ok) throw new Error(body.error?.message ?? "Failed to load notifications.");
      return body.data;
    },
    enabled,
    refetchInterval: enabled ? POLL_INTERVAL_MS : false,
  });

  async function markAllRead() {
    await fetch("/api/notifications/read", { method: "POST" });
    queryClient.setQueryData(["notifications"], (current: typeof query.data) =>
      current
        ? {
            ...current,
            unreadCount: 0,
            notifications: current.notifications.map((n) => ({
              ...n,
              readAt: n.readAt ?? new Date().toISOString(),
            })),
          }
        : current,
    );
  }

  return { ...query, markAllRead };
}
