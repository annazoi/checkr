import Link from "next/link";
import { CheckIcon } from "@heroicons/react/24/solid";
import { buttonClasses } from "@/components/ui/Button";
import { getSourceContext } from "@/lib/sources/queries";

export default async function ReportSuccessPage({
  searchParams,
}: {
  searchParams: { source?: string };
}) {
  const context = searchParams.source
    ? await getSourceContext(searchParams.source).catch(() => null)
    : null;

  return (
    <div className="mx-auto flex min-h-[calc(100vh-64px)] max-w-md flex-col items-center justify-center px-6 py-16 text-center">
      <span className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-status-clear/15">
        <CheckIcon className="h-8 w-8 text-status-clear" aria-hidden="true" />
      </span>
      <p className="text-xs font-semibold uppercase tracking-wide text-accent-light">
        Report submitted
      </p>
      <h1 className="mt-2 text-2xl font-bold text-text-primary">Thanks for sharing.</h1>
      <p className="mt-2 text-sm text-text-secondary">
        Your report has been submitted and is pending review. Published reports help other
        players see the pattern.
      </p>

      <div className="mt-8 flex w-full flex-col gap-3">
        {context && (
          <Link
            href={`/sources/${context.gameSourceId}`}
            className={`${buttonClasses({ variant: "primary" })} w-full`}
          >
            Back to source
          </Link>
        )}
        <Link href="/search" className={`${buttonClasses({ variant: "secondary" })} w-full`}>
          Search another game
        </Link>
      </div>
    </div>
  );
}
