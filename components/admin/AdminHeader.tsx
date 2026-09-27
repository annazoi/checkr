"use client";

import { signOut } from "next-auth/react";
import { ShieldCheckIcon } from "@heroicons/react/24/outline";
import { useT } from "@/components/i18n/LocaleProvider";

export function AdminHeader({ username, role }: { username: string; role: string }) {
  const t = useT();

  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex h-16 max-w-page items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <ShieldCheckIcon className="h-5 w-5 text-accent-light" aria-hidden="true" />
          <span className="font-semibold text-text-primary">{t("admin.checkrAdmin")}</span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-text-secondary">
            {username} · {role}
          </span>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="font-medium text-accent-light"
          >
            {t("admin.signOut")}
          </button>
        </div>
      </div>
    </header>
  );
}
