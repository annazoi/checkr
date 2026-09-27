"use client";

import {
  ArrowDownTrayIcon,
  ArrowsRightLeftIcon,
  CheckCircleIcon,
  DocumentMagnifyingGlassIcon,
  ExclamationTriangleIcon,
  QuestionMarkCircleIcon,
  ShieldExclamationIcon,
} from "@heroicons/react/24/outline";
import { SelectableChip } from "@/components/ui/Chip";
import { useT } from "@/components/i18n/LocaleProvider";
import type { ReportType } from "@/types";

const CATEGORY_ICONS: Record<ReportType, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  no_issue: CheckCircleIcon,
  suspicious: ExclamationTriangleIcon,
  antivirus_warning: ShieldExclamationIcon,
  unexpected_software: ArrowDownTrayIcon,
  malware: ShieldExclamationIcon,
  suspicious_installer: ArrowDownTrayIcon,
  dangerous_redirect: ArrowsRightLeftIcon,
  fake_content: DocumentMagnifyingGlassIcon,
  other: QuestionMarkCircleIcon,
};

const CATEGORY_ORDER: ReportType[] = [
  "no_issue",
  "suspicious",
  "antivirus_warning",
  "unexpected_software",
  "malware",
  "suspicious_installer",
  "dangerous_redirect",
  "fake_content",
  "other",
];

export function CategoryStep({
  value,
  onChange,
}: {
  value: ReportType | null;
  onChange: (value: ReportType) => void;
}) {
  const t = useT();

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary">{t("report.whatHappened")}</h1>
      <p className="mt-1 text-sm text-accent-light">{t("report.chooseClosest")}</p>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {CATEGORY_ORDER.map((category) => {
          const Icon = CATEGORY_ICONS[category];
          return (
            <SelectableChip
              key={category}
              selected={value === category}
              icon={<Icon className="h-4 w-4 shrink-0" aria-hidden="true" />}
              label={t(`report.categories.${category}`)}
              onClick={() => onChange(category)}
            />
          );
        })}
      </div>
    </div>
  );
}
