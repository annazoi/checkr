import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { ReportForm } from "@/components/report/ReportForm";

export default function ReportPage({
  searchParams,
}: {
  searchParams: { game?: string };
}) {
  return (
    <div className="mx-auto max-w-lg px-6 py-8">
      <Link
        href="/"
        className="mb-4 inline-flex min-h-[44px] items-center gap-2 text-sm font-medium text-text-secondary hover:text-text-primary"
      >
        <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
        Back
      </Link>
      <ReportForm initialGameSlug={searchParams.game} />
    </div>
  );
}
