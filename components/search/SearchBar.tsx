"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Input } from "@/components/ui/Input";
import { useT } from "@/components/i18n/LocaleProvider";

const DEBOUNCE_MS = 200;

export function SearchBar({ placeholder }: { placeholder?: string }) {
  const router = useRouter();
  const t = useT();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("q") ?? "");
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  function handleChange(next: string) {
    setValue(next);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (next) params.set("q", next);
      else params.delete("q");
      router.push(`/search?${params.toString()}`);
    }, DEBOUNCE_MS);
  }

  return (
    <div className="relative flex-1">
      <MagnifyingGlassIcon
        className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-secondary"
        aria-hidden="true"
      />
      <Input
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder ?? t("common.searchPlaceholder")}
        aria-label={t("common.searchPlaceholder")}
        className="h-14 pl-12 pr-4 text-base"
      />
    </div>
  );
}
