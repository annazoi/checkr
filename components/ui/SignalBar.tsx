"use client";

import { cn } from "@/lib/utils/cn";
import { useT } from "@/components/i18n/LocaleProvider";

type SignalBarProps = {
  noIssue: number;
  mixed: number;
  concerns: number;
  security?: number;
  leftLabel?: string;
  rightLabel?: string;
};

const segments: Array<{
  key: keyof Pick<SignalBarProps, "noIssue" | "mixed" | "concerns" | "security">;
  colorClass: string;
}> = [
  { key: "noIssue", colorClass: "bg-status-clear" },
  { key: "mixed", colorClass: "bg-status-mixed" },
  { key: "concerns", colorClass: "bg-status-concern" },
  { key: "security", colorClass: "bg-status-risk" },
];

export function SignalBar({
  noIssue,
  mixed,
  concerns,
  security = 0,
  leftLabel,
  rightLabel,
}: SignalBarProps) {
  const t = useT();
  const values = { noIssue, mixed, concerns, security };
  const total = noIssue + mixed + concerns + security;
  const safeTotal = total === 0 ? 1 : total;

  return (
    <div>
      <div className="flex h-2 w-full overflow-hidden rounded-pill bg-elevated">
        {segments.map(({ key, colorClass }) => {
          const value = values[key];
          if (!value) return null;
          const width = (value / safeTotal) * 100;
          return (
            <div
              key={key}
              className={cn(colorClass, "transition-[width] duration-700 ease-out")}
              style={{ width: `${width}%` }}
              role="presentation"
            />
          );
        })}
      </div>
      <div className="mt-2 flex items-center justify-between text-xs text-text-secondary">
        <span>{leftLabel ?? t("signal.noIssuesLabel")}</span>
        {mixed > 0 && <span>{t("signal.mixedPercent", { percent: Math.round((mixed / safeTotal) * 100) })}</span>}
        <span>{rightLabel ?? t("signal.concernsLabel")}</span>
      </div>
    </div>
  );
}
