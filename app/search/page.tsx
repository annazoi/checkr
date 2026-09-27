import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { SearchBar } from "@/components/search/SearchBar";
import { SearchResults } from "@/components/search/SearchResults";

export default function SearchPage() {
  return (
    <div className="mx-auto max-w-page px-6 py-6">
      <div className="mb-4 flex items-center gap-3">
        <Link
          href="/"
          aria-label="Back to home"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-text-secondary hover:text-text-primary"
        >
          <ArrowLeftIcon className="h-5 w-5" aria-hidden="true" />
        </Link>
        <Suspense fallback={<div className="h-14 flex-1" />}>
          <SearchBar />
        </Suspense>
      </div>
      <Suspense fallback={null}>
        <SearchResults />
      </Suspense>
    </div>
  );
}
