import Image from "next/image";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

type GameHeroProps = {
  title: string;
  developer?: string | null;
  releaseYear?: number | null;
  platforms: string[];
  coverUrl?: string | null;
  children?: React.ReactNode;
};

export function GameHero({
  title,
  developer,
  releaseYear,
  platforms,
  coverUrl,
  children,
}: GameHeroProps) {
  return (
    <div className="relative">
      <div className="relative h-56 w-full overflow-hidden bg-elevated md:h-72">
        {coverUrl && (
          <Image src={coverUrl} alt="" fill sizes="100vw" className="object-cover" priority />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <Link
          href="/search"
          aria-label="Back to search"
          className="absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-background/70 text-text-primary backdrop-blur"
        >
          <ArrowLeftIcon className="h-5 w-5" aria-hidden="true" />
        </Link>
      </div>
      <div className="mx-auto max-w-page px-6 pb-6 pt-4">
        <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">
          {[developer, releaseYear].filter(Boolean).join(" · ")}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold text-text-primary">{title}</h1>
          {children}
        </div>
        {platforms.length > 0 && (
          <p className="mt-1 text-sm text-text-secondary">{platforms.join(" · ")}</p>
        )}
      </div>
    </div>
  );
}
