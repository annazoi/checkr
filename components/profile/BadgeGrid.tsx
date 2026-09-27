"use client";

import {
  AcademicCapIcon,
  CameraIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  ShieldCheckIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils/cn";
import type { BadgeSlug } from "@/lib/gamification/badges";
import { useLocale, useT } from "@/components/i18n/LocaleProvider";

const BADGE_ICONS: Record<BadgeSlug, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  first_report: StarIcon,
  evidence_provider: CameraIcon,
  trusted_signal: ShieldCheckIcon,
  detail_master: ChatBubbleLeftRightIcon,
  consistent_contributor: ClockIcon,
  community_veteran: AcademicCapIcon,
};

export function BadgeGrid({ badges }: { badges: Array<{ slug: BadgeSlug; earned: boolean }> }) {
  const { dictionary } = useLocale();
  const t = useT();

  return (
    <div>
      <h2 className="mb-3 text-lg font-semibold text-text-primary">{t("profile.badges")}</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {badges.map(({ slug, earned }) => {
          const meta = dictionary.badges[slug];
          const Icon = BADGE_ICONS[slug];
          return (
            <div
              key={slug}
              title={meta.description}
              className={cn(
                "flex flex-col items-center gap-2 rounded-card border p-4 text-center",
                earned
                  ? "border-accent/40 bg-accent/10 text-text-primary"
                  : "border-border bg-surface text-text-secondary opacity-50",
              )}
            >
              <Icon className="h-6 w-6" aria-hidden="true" />
              <span className="text-xs font-medium">{meta.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
