import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div>
      <Skeleton className="h-7 w-1/3" />
      <Skeleton className="mt-2 h-4 w-2/3" />
      <div className="mt-6 space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-3 rounded-card border border-border bg-surface p-5">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-3 w-3/4" />
            <div className="flex gap-2 pt-1">
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
