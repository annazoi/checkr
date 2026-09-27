"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowRightIcon, ShieldCheckIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { buttonClasses } from "@/components/ui/Button";
import { NotificationsMenu } from "@/components/layout/NotificationsMenu";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { useT } from "@/components/i18n/LocaleProvider";
import { cn } from "@/lib/utils/cn";

export function TopNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const t = useT();

  const navItems = [
    { href: "/", label: t("nav.discover") },
    { href: "/search", label: t("nav.exploreGames") },
  ];

  if (pathname.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-40 hidden border-b border-border bg-background/95 backdrop-blur md:block">
      <div className="mx-auto flex h-16 max-w-page items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
            <ShieldCheckIcon className="h-5 w-5 text-white" aria-hidden="true" />
          </span>
          <span className="text-lg font-semibold text-text-primary">Checkr</span>
        </Link>

        <nav className="flex items-center gap-6">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors",
                  active ? "text-text-primary" : "text-text-secondary hover:text-text-primary",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/report" className={buttonClasses({ variant: "secondary" })}>
            {t("nav.shareExperience")}
            <ArrowRightIcon className="ml-1.5 h-4 w-4" aria-hidden="true" />
          </Link>
          {session && <NotificationsMenu />}
          <LanguageSwitcher />
          <Link
            href={session ? "/profile/me" : "/auth/login"}
            aria-label={session ? t("nav.yourProfile") : t("nav.login")}
            className="flex h-11 w-11 items-center justify-center rounded-full text-text-secondary hover:text-text-primary"
          >
            <UserCircleIcon className="h-6 w-6" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </header>
  );
}
