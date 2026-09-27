"use client";

import Link from "next/link";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { useT } from "@/components/i18n/LocaleProvider";

type ProfileHeaderProps = {
  username: string;
  levelName: string;
  reportCount: number;
  helpfulCount: number;
  badgeCount: number;
  isOwnProfile: boolean;
};

export function ProfileHeader({
  username,
  levelName,
  reportCount,
  helpfulCount,
  badgeCount,
  isOwnProfile,
}: ProfileHeaderProps) {
  const t = useT();

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-accent-light">
          {t("profile.communityProfile")}
        </p>
        {isOwnProfile && (
          <Link
            href="/settings"
            aria-label={t("profile.settingsAria")}
            className="flex h-11 w-11 items-center justify-center rounded-full text-text-secondary hover:text-text-primary"
          >
            <Cog6ToothIcon className="h-5 w-5" aria-hidden="true" />
          </Link>
        )}
      </div>

      <div className="flex flex-col items-center text-center">
        <Avatar name={username} size="lg" />
        <h1 className="mt-3 text-2xl font-bold text-text-primary">{username}</h1>
        <div className="mt-2">
          <Badge tone="accent">{levelName}</Badge>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <div className="rounded-card border border-border bg-surface p-4 text-center">
          <p className="text-2xl font-bold text-text-primary">{reportCount}</p>
          <p className="text-xs text-text-secondary">{t("profile.reports")}</p>
        </div>
        <div className="rounded-card border border-border bg-surface p-4 text-center">
          <p className="text-2xl font-bold text-text-primary">{helpfulCount}</p>
          <p className="text-xs text-text-secondary">{t("profile.helpful")}</p>
        </div>
        <div className="rounded-card border border-border bg-surface p-4 text-center">
          <p className="text-2xl font-bold text-text-primary">{badgeCount}</p>
          <p className="text-xs text-text-secondary">{t("profile.badges")}</p>
        </div>
      </div>
    </div>
  );
}
