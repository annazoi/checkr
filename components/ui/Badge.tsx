import { cn } from "@/lib/utils/cn";

type BadgeTone = "neutral" | "accent" | "clear" | "mixed" | "concern" | "risk" | "none";

const toneClasses: Record<BadgeTone, string> = {
  neutral: "bg-elevated text-text-secondary border-border",
  accent: "bg-accent/15 text-accent-light border-accent/30",
  clear: "bg-status-clear/15 text-status-clear border-status-clear/30",
  mixed: "bg-status-mixed/15 text-status-mixed border-status-mixed/30",
  concern: "bg-status-concern/15 text-status-concern border-status-concern/30",
  risk: "bg-status-risk/15 text-status-risk border-status-risk/30",
  none: "bg-status-none/15 text-status-none border-status-none/30",
};

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  tone?: BadgeTone;
  icon?: React.ReactNode;
};

export function Badge({ className, tone = "neutral", icon, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-pill border px-3 py-1 text-xs font-medium",
        toneClasses[tone],
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </span>
  );
}
