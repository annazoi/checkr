import { ShieldExclamationIcon } from "@heroicons/react/24/outline";

export function Disclaimer() {
  return (
    <p className="flex items-start gap-2 text-xs text-text-secondary">
      <ShieldExclamationIcon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <span>
        Community reports reflect user experiences, not security audits. They are signals, not
        guarantees. Always use antivirus software.
      </span>
    </p>
  );
}
