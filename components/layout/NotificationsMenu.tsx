"use client";

import { useState } from "react";
import { BellIcon } from "@heroicons/react/24/outline";
import { formatRelativeTime } from "@/lib/utils/format-relative-time";
import { useNotifications } from "@/hooks/useNotifications";
import { useLocale, useT } from "@/components/i18n/LocaleProvider";
import { cn } from "@/lib/utils/cn";

export function NotificationsMenu() {
  const [open, setOpen] = useState(false);
  const { data, markAllRead } = useNotifications(true);
  const unreadCount = data?.unreadCount ?? 0;
  const { locale } = useLocale();
  const t = useT();

  function handleToggle() {
    const next = !open;
    setOpen(next);
    if (next && unreadCount > 0) {
      markAllRead();
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleToggle}
        aria-label={t("notifications.label")}
        aria-expanded={open}
        className="relative flex h-11 w-11 items-center justify-center rounded-full text-text-secondary hover:text-text-primary"
      >
        <BellIcon className="h-5 w-5" aria-hidden="true" />
        {unreadCount > 0 && (
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-status-risk" />
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} aria-hidden="true" />
          <div className="absolute right-0 z-50 mt-2 w-80 rounded-card border border-border bg-surface p-2 shadow-xl">
            <p className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wide text-text-secondary">
              {t("notifications.title")}
            </p>
            {!data || data.notifications.length === 0 ? (
              <p className="p-4 text-center text-sm text-text-secondary">{t("notifications.empty")}</p>
            ) : (
              <div className="max-h-96 overflow-y-auto">
                {data.notifications.map((n) => (
                  <div
                    key={n.id}
                    className={cn(
                      "rounded-control p-2.5 text-sm",
                      !n.readAt && "bg-accent/10",
                    )}
                  >
                    <p className="font-medium text-text-primary">{n.title}</p>
                    {n.body && <p className="mt-0.5 text-xs text-text-secondary">{n.body}</p>}
                    <p className="mt-1 text-xs text-text-secondary">
                      {formatRelativeTime(n.createdAt, locale)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
