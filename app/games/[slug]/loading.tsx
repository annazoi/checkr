import { GameHeroSkeleton, SourceCardSkeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div>
      <GameHeroSkeleton />
      <div className="mx-auto max-w-page space-y-4 px-6 pb-10">
        {Array.from({ length: 3 }).map((_, i) => (
          <SourceCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
