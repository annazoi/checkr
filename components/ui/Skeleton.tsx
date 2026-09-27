import { cn } from "@/lib/utils/cn";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn("animate-pulse rounded-control bg-elevated", className)}
      aria-hidden="true"
    />
  );
}

export function GameCardSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-card border border-border bg-surface p-4">
      <Skeleton className="h-14 w-14 shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
  );
}

export function SourceCardSkeleton() {
  return (
    <div className="space-y-3 rounded-card border border-border bg-surface p-5">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-3 w-2/3" />
      <Skeleton className="h-2 w-full" />
    </div>
  );
}
