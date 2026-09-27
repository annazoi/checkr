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
        "inline-flex h-9 min-w-[44px] items-center justify-center rounded-pill px-4 text-sm font-medium",
        "transition-all duration-200 ease-out hover:scale-105 active:scale-90 active:duration-75",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-light focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        active
          ? "bg-accent text-white shadow-[0_0_16px_-4px_rgba(139,127,247,0.7)]"
          : "bg-elevated text-text-secondary hover:text-text-primary hover:shadow-[0_0_10px_-4px_rgba(139,127,247,0.4)]",
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
        "flex min-h-[56px] items-center gap-2 rounded-control border px-4 py-3 text-left text-sm font-medium",
        "transition-all duration-200 ease-out hover:-translate-y-0.5 hover:scale-[1.02] active:translate-y-0 active:scale-[0.98] active:duration-75",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-light focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        selected
          ? "border-accent bg-accent/10 text-accent-light shadow-[0_0_14px_-4px_rgba(139,127,247,0.6)]"
          : "border-border bg-surface text-text-primary hover:border-white/20 hover:shadow-[0_0_10px_-4px_rgba(139,127,247,0.35)]",
        className,
      )}
      {...props}
    >
      {selected ? <CheckIcon className="h-4 w-4 shrink-0" aria-hidden="true" /> : icon}
      <span>{label}</span>
    </button>
  );
}
