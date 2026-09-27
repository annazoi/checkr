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
import type { ReportType } from "@/types";

const CATEGORIES: Array<{
  value: ReportType;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}> = [
  { value: "no_issue", label: "No issues", icon: CheckCircleIcon },
  { value: "suspicious", label: "Suspicious behavior", icon: ExclamationTriangleIcon },
  { value: "antivirus_warning", label: "Security warning", icon: ShieldExclamationIcon },
  { value: "unexpected_software", label: "Unexpected download", icon: ArrowDownTrayIcon },
  { value: "malware", label: "Malware", icon: ShieldExclamationIcon },
  { value: "suspicious_installer", label: "Unexpected installer", icon: ArrowDownTrayIcon },
  { value: "dangerous_redirect", label: "Dangerous redirect", icon: ArrowsRightLeftIcon },
  { value: "fake_content", label: "Misleading details", icon: DocumentMagnifyingGlassIcon },
  { value: "other", label: "Something else", icon: QuestionMarkCircleIcon },
];

export function CategoryStep({
  value,
  onChange,
}: {
  value: ReportType | null;
  onChange: (value: ReportType) => void;
}) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary">What happened at a game source?</h1>
      <p className="mt-1 text-sm text-accent-light">Choose the option closest to your experience.</p>

      <div className="mt-5 grid grid-cols-2 gap-3">
        {CATEGORIES.map((category) => (
          <SelectableChip
            key={category.value}
            selected={value === category.value}
            icon={<category.icon className="h-4 w-4 shrink-0" aria-hidden="true" />}
            label={category.label}
            onClick={() => onChange(category.value)}
          />
        ))}
      </div>
    </div>
  );
}
