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

export function GameHeroSkeleton() {
  return (
    <div>
      <Skeleton className="h-56 w-full rounded-none md:h-72" />
      <div className="mx-auto max-w-page px-6 pb-6 pt-4">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="mt-2 h-8 w-2/3" />
        <Skeleton className="mt-2 h-3 w-1/4" />
      </div>
    </div>
  );
}

export function SignalProfileSkeleton() {
  return (
    <div className="space-y-4 rounded-card border border-border bg-surface p-5">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-5 w-20" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
      <Skeleton className="h-3 w-full" />
    </div>
  );
}

export function ProfileHeaderSkeleton() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-11 w-11 rounded-full" />
      </div>
      <div className="flex flex-col items-center text-center">
        <Skeleton className="mt-1 h-20 w-20 rounded-full" />
        <Skeleton className="mt-3 h-6 w-1/3" />
        <Skeleton className="mt-2 h-5 w-20" />
      </div>
      <div className="mt-6 grid grid-cols-3 gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    </div>
  );
}

export function HomeSkeleton() {
  return (
    <div className="mx-auto max-w-page px-6 py-10">
      <div className="max-w-2xl">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="mt-3 h-10 w-full" />
        <Skeleton className="mt-2 h-10 w-2/3" />
        <Skeleton className="mt-4 h-4 w-1/2" />
        <Skeleton className="mt-6 h-14 w-full" />
      </div>

      <div className="mt-12">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="mt-2 h-6 w-1/3" />
        <div className="mt-3 grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[4/5] w-full" />
          ))}
        </div>
      </div>

      <div className="mt-12">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="mt-2 h-6 w-1/3" />
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <SourceCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
