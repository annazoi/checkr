import { SignalProfileSkeleton, Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-page space-y-4 px-6 py-6">
      <Skeleton className="h-11 w-11 rounded-full" />
      <Skeleton className="h-6 w-1/2" />
      <SignalProfileSkeleton />
      <div className="space-y-3 pt-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-2 border-b border-border pb-4">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        ))}
      </div>
    </div>
  );
}
