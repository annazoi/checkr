import { CheckIcon } from "@heroicons/react/24/solid";
import { cn } from "@/lib/utils/cn";

type ChipProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
};

export function Chip({ className, active = false, children, ...props }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cn(
        "inline-flex h-9 min-w-[44px] items-center justify-center rounded-pill px-4 text-sm font-medium transition-colors",
        active
          ? "bg-accent text-white"
          : "bg-elevated text-text-secondary hover:text-text-primary",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

type SelectableChipProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  selected?: boolean;
  icon?: React.ReactNode;
  label: string;
};

export function SelectableChip({
  className,
  selected = false,
  icon,
  label,
  ...props
}: SelectableChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        "flex min-h-[56px] items-center gap-2 rounded-control border px-4 py-3 text-left text-sm font-medium transition-colors",
        selected
          ? "border-accent bg-accent/10 text-accent-light"
          : "border-border bg-surface text-text-primary hover:border-white/20",
        className,
      )}
      {...props}
    >
      {selected ? <CheckIcon className="h-4 w-4 shrink-0" aria-hidden="true" /> : icon}
      <span>{label}</span>
    </button>
  );
}
