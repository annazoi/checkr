import { GameCardSkeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-page px-6 py-6">
      <div className="mb-4 h-11 w-full animate-pulse rounded-control bg-elevated" />
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <GameCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
