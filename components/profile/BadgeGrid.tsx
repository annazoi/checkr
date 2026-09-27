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

const BADGE_META: Record<BadgeSlug, { label: string; description: string; icon: React.ComponentType<React.SVGProps<SVGSVGElement>> }> = {
  first_report: {
    label: "First report",
    description: "Submitted your first report.",
    icon: StarIcon,
  },
  evidence_provider: {
    label: "Evidence provider",
    description: "Included evidence in a report.",
    icon: CameraIcon,
  },
  trusted_signal: {
    label: "Trusted signal",
    description: "10+ reports marked helpful.",
    icon: ShieldCheckIcon,
  },
  detail_master: {
    label: "Detail master",
    description: "25+ reports with a description.",
    icon: ChatBubbleLeftRightIcon,
  },
  consistent_contributor: {
    label: "Consistent contributor",
    description: "Active contributor over time.",
    icon: ClockIcon,
  },
  community_veteran: {
    label: "Community veteran",
    description: "A year+ on GameSafe with 10+ reports.",
    icon: AcademicCapIcon,
  },
};

export function BadgeGrid({ badges }: { badges: Array<{ slug: BadgeSlug; earned: boolean }> }) {
  return (
    <div>
      <h2 className="mb-3 text-lg font-semibold text-text-primary">Badges</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {badges.map(({ slug, earned }) => {
          const meta = BADGE_META[slug];
          const Icon = meta.icon;
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
