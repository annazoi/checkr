import Image from "next/image";
import Link from "next/link";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { SignalLabel } from "@/components/ui/SignalLabel";
import type { SignalLabelType } from "@/types";

type GameCardProps = {
  slug: string;
  title: string;
  developer?: string | null;
  platforms?: string[];
  coverUrl?: string | null;
  signalLabel?: SignalLabelType;
};

export function GameCard({
  slug,
  title,
  developer,
  platforms = [],
  coverUrl,
  signalLabel,
}: GameCardProps) {
  return (
    <Link
      href={`/games/${slug}`}
      className="group flex items-center gap-4 border-b border-border rounded-control px-2 py-4 -mx-2 transition-colors duration-200 hover:bg-elevated last:border-none"
    >
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-control bg-elevated transition-all duration-200 group-hover:shadow-[0_0_16px_-4px_rgba(139,127,247,0.7)]">
        {coverUrl && (
          <Image
            src={coverUrl}
            alt=""
            fill
            sizes="56px"
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-text-primary transition-colors duration-200 group-hover:text-accent-light">
          {title}
        </p>
        <p className="truncate text-sm text-text-secondary">
          {[developer, platforms.join(" · ")].filter(Boolean).join(" · ")}
        </p>
        {signalLabel && (
          <div className="mt-2">
            <SignalLabel label={signalLabel} />
          </div>
        )}
      </div>
      <ChevronRightIcon
        className="h-5 w-5 shrink-0 text-text-secondary transition-all duration-200 group-hover:translate-x-1 group-hover:text-accent-light"
        aria-hidden="true"
      />
    </Link>
  );
}
