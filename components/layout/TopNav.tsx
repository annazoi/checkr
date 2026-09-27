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
        <Link href="/" className="group flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent transition-all duration-200 group-hover:scale-110 group-hover:shadow-[0_0_16px_-2px_rgba(139,127,247,0.8)]">
            <ShieldCheckIcon className="h-5 w-5 text-white" aria-hidden="true" />
          </span>
          <span className="text-lg font-semibold text-text-primary transition-colors duration-200 group-hover:text-accent-light">
            Checkr
          </span>
        </Link>

        <nav className="flex items-center gap-6">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative py-1 text-sm font-medium transition-colors duration-200 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:rounded-full after:bg-accent-light after:transition-all after:duration-300 after:ease-out",
                  active
                    ? "text-text-primary after:w-full"
                    : "text-text-secondary after:w-0 hover:text-text-primary hover:after:w-full",
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
            <ArrowRightIcon className="ml-1.5 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
          </Link>
          {session && <NotificationsMenu />}
          <LanguageSwitcher />
          <Link
            href={session ? "/profile/me" : "/auth/login"}
            aria-label={session ? t("nav.yourProfile") : t("nav.login")}
            className="flex h-11 w-11 items-center justify-center rounded-full text-text-secondary transition-all duration-200 hover:scale-110 hover:text-accent-light"
          >
            <UserCircleIcon className="h-6 w-6" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </header>
  );
}
