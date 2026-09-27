import Image from "next/image";
import { cn } from "@/lib/utils/cn";

type AvatarProps = {
  name: string;
  src?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-12 w-12 text-base",
  lg: "h-20 w-20 text-2xl",
};

export function Avatar({ name, src, size = "md", className }: AvatarProps) {
  const initial = name.trim().charAt(0).toUpperCase() || "?";

  if (src) {
    const pixelSize = size === "sm" ? 32 : size === "md" ? 48 : 80;
    return (
      <Image
        src={src}
        alt={name}
        width={pixelSize}
        height={pixelSize}
        className={cn("rounded-full object-cover", sizeClasses[size], className)}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-accent font-semibold text-white",
        sizeClasses[size],
        className,
      )}
      aria-hidden="true"
    >
      {initial}
    </div>
  );
}
