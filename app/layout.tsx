import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/layout/Providers";
import { TopNav } from "@/components/layout/TopNav";
import { BottomNav } from "@/components/layout/BottomNav";
import { ToastViewport } from "@/components/ui/Toast";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";
import { defaultLocale, isLocale, localeCookieName } from "@/lib/i18n/config";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Checkr",
  description:
    "Community-powered safety intelligence for gamers. See what other players have experienced with third-party stores, resellers, and download sites.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieLocale = cookies().get(localeCookieName)?.value;
  const locale = isLocale(cookieLocale) ? cookieLocale : defaultLocale;

  return (
    <html lang={locale}>
      <body className={`${inter.variable} font-sans antialiased bg-background text-text-primary`}>
        <LocaleProvider initialLocale={locale}>
          <Providers>
            <TopNav />
            <main className="pb-24 md:pb-0">{children}</main>
            <BottomNav />
            <ToastViewport />
          </Providers>
        </LocaleProvider>
      </body>
    </html>
  );
}
