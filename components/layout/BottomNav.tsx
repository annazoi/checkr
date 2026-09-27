"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, MagnifyingGlassIcon, PlusIcon, UserIcon } from "@heroicons/react/24/outline";
import { HomeIcon as HomeIconSolid, MagnifyingGlassIcon as SearchIconSolid, UserIcon as UserIconSolid } from "@heroicons/react/24/solid";
import { cn } from "@/lib/utils/cn";

const tabs = [
  { href: "/", label: "Home", icon: HomeIcon, activeIcon: HomeIconSolid },
  { href: "/search", label: "Search", icon: MagnifyingGlassIcon, activeIcon: SearchIconSolid },
  { href: "/report", label: "Report", icon: PlusIcon, activeIcon: PlusIcon, isReport: true },
  { href: "/profile/me", label: "Profile", icon: UserIcon, activeIcon: UserIconSolid },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 flex h-20 items-center justify-around border-t border-border bg-background/95 backdrop-blur md:hidden"
    >
      {tabs.map((tab) => {
        const active = pathname === tab.href;
        const Icon = active ? tab.activeIcon : tab.icon;

        if (tab.isReport) {
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-label={tab.label}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-white"
            >
              <Icon className="h-6 w-6" aria-hidden="true" />
            </Link>
          );
        }

        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-label={tab.label}
            className={cn(
              "flex min-h-[48px] min-w-[48px] flex-col items-center justify-center gap-0.5 text-xs",
              active ? "text-accent-light" : "text-text-secondary",
            )}
          >
            <Icon className="h-6 w-6" aria-hidden="true" />
            <span>{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
