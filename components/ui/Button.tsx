import { forwardRef } from "react";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils/cn";
import { Spinner } from "@/components/ui/Spinner";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "md" | "lg";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  trailingIcon?: boolean;
  isLoading?: boolean;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-white hover:bg-accent-light disabled:bg-accent/40 disabled:text-white/60 hover:shadow-[0_0_24px_-2px_rgba(139,127,247,0.65)] active:shadow-[0_0_10px_-2px_rgba(139,127,247,0.5)]",
  secondary:
    "bg-transparent border border-accent text-text-primary hover:bg-accent/10 disabled:border-border disabled:text-text-secondary hover:shadow-[0_0_16px_-4px_rgba(108,92,231,0.6)] hover:border-accent-light",
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
    "group relative isolate inline-flex min-h-[48px] items-center justify-center overflow-hidden rounded-pill font-semibold",
    "transition-[transform,box-shadow,background-color,border-color,color] duration-200 ease-out",
    "hover:-translate-y-0.5 hover:scale-[1.03] active:translate-y-0 active:scale-95 active:duration-75",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-light focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:translate-y-0 disabled:scale-100 disabled:shadow-none",
    "before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent before:transition-transform before:duration-700 before:ease-out hover:before:translate-x-full",
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
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        aria-busy={isLoading || undefined}
        className={buttonClasses({ variant, size, className })}
        {...props}
      >
        {isLoading && <Spinner size={16} />}
        {children}
        {!isLoading && trailingIcon && (
          <ArrowRightIcon
            className="h-4 w-4 transition-transform duration-200 ease-out group-hover:translate-x-1"
            aria-hidden="true"
          />
        )}
      </button>
    );
  },
);
Button.displayName = "Button";
