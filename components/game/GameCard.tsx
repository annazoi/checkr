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
      className="flex items-center gap-4 border-b border-border py-4 last:border-none"
    >
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-control bg-elevated">
        {coverUrl && <Image src={coverUrl} alt="" fill sizes="56px" className="object-cover" />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-text-primary">{title}</p>
        <p className="truncate text-sm text-text-secondary">
          {[developer, platforms.join(" · ")].filter(Boolean).join(" · ")}
        </p>
        {signalLabel && (
          <div className="mt-2">
            <SignalLabel label={signalLabel} />
          </div>
        )}
      </div>
      <ChevronRightIcon className="h-5 w-5 shrink-0 text-text-secondary" aria-hidden="true" />
    </Link>
  );
}
