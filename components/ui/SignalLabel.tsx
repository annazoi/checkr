import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
  ShieldExclamationIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import { Badge } from "@/components/ui/Badge";
import type { SignalLabelType } from "@/types";

const config: Record<
  SignalLabelType,
  { tone: "clear" | "mixed" | "concern" | "risk" | "none"; text: string; icon: React.ComponentType<React.SVGProps<SVGSVGElement>> }
> = {
  mostly_clear: { tone: "clear", text: "Mostly clear", icon: CheckCircleIcon },
  mixed_reports: { tone: "mixed", text: "Mixed reports", icon: ExclamationTriangleIcon },
  concerns_reported: { tone: "concern", text: "Concerns reported", icon: ExclamationCircleIcon },
  security_reports: { tone: "risk", text: "Security reports", icon: ShieldExclamationIcon },
  limited_data: { tone: "none", text: "Limited data", icon: QuestionMarkCircleIcon },
  no_reports: { tone: "none", text: "No reports yet", icon: QuestionMarkCircleIcon },
};

export function SignalLabel({ label }: { label: SignalLabelType }) {
  const { tone, text, icon: Icon } = config[label];
  return (
    <Badge tone={tone} icon={<Icon className="h-3.5 w-3.5" aria-hidden="true" />}>
      {text}
    </Badge>
  );
}
