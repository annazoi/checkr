import { cn } from "@/lib/utils/cn";

type BadgeTone = "neutral" | "accent" | "clear" | "mixed" | "concern" | "risk" | "none";

const toneClasses: Record<BadgeTone, string> = {
  neutral: "bg-elevated text-text-secondary border-border",
  accent: "bg-accent/25 text-accent-light backdrop-blur-sm border-accent/30",
  clear: "bg-status-clear/25 text-status-clear backdrop-blur-sm border-status-clear/30",
  mixed: "bg-status-mixed/25 text-status-mixed backdrop-blur-sm border-status-mixed/30",
  concern: "bg-status-concern/25 text-status-concern backdrop-blur-sm animate-glow-pulse border-status-concern/30",
  risk: "bg-status-risk/25 text-status-risk backdrop-blur-sm animate-risk-pulse border-status-risk/30",
  none: "bg-background/75 text-text-secondary backdrop-blur-sm border-status-none/30",
};

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  tone?: BadgeTone;
  icon?: React.ReactNode;
};

export function Badge({ className, tone = "neutral", icon, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex animate-pop-in items-center gap-1.5 rounded-pill border px-3 py-1 text-xs font-medium transition-colors duration-300",
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
