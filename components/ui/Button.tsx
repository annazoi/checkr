import { forwardRef } from "react";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils/cn";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "md" | "lg";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  trailingIcon?: boolean;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-white hover:bg-accent-light disabled:bg-accent/40 disabled:text-white/60",
  secondary:
    "bg-transparent border border-accent text-text-primary hover:bg-accent/10 disabled:border-border disabled:text-text-secondary",
  ghost:
    "bg-transparent text-text-secondary hover:text-text-primary disabled:text-text-secondary/50",
};

const sizeClasses: Record<ButtonSize, string> = {
  md: "h-11 px-4 text-sm gap-1.5",
  lg: "h-12 px-6 text-base gap-2",
};

export function buttonClasses({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}) {
  return cn(
    "inline-flex min-h-[48px] items-center justify-center rounded-pill font-semibold transition-colors disabled:cursor-not-allowed",
    variantClasses[variant],
    sizeClasses[size],
    className,
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      trailingIcon = false,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={buttonClasses({ variant, size, className })}
        {...props}
      >
        {children}
        {trailingIcon && <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />}
      </button>
    );
  },
);
Button.displayName = "Button";
