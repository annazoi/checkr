"use client";

import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
  ShieldExclamationIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import { Badge } from "@/components/ui/Badge";
import { useLocale } from "@/components/i18n/LocaleProvider";
import type { SignalLabelType } from "@/types";

const config: Record<
  SignalLabelType,
  { tone: "clear" | "mixed" | "concern" | "risk" | "none"; icon: React.ComponentType<React.SVGProps<SVGSVGElement>> }
> = {
  mostly_clear: { tone: "clear", icon: CheckCircleIcon },
  mixed_reports: { tone: "mixed", icon: ExclamationTriangleIcon },
  concerns_reported: { tone: "concern", icon: ExclamationCircleIcon },
  security_reports: { tone: "risk", icon: ShieldExclamationIcon },
  limited_data: { tone: "none", icon: QuestionMarkCircleIcon },
  no_reports: { tone: "none", icon: QuestionMarkCircleIcon },
};

export function SignalLabel({ label }: { label: SignalLabelType }) {
  const { dictionary } = useLocale();
  const { tone, icon: Icon } = config[label];
  return (
    <Badge tone={tone} icon={<Icon className="h-3.5 w-3.5" aria-hidden="true" />}>
      {dictionary.signal.label[label]}
    </Badge>
  );
}
