import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/layout/Providers";
import { TopNav } from "@/components/layout/TopNav";
import { BottomNav } from "@/components/layout/BottomNav";
import { ToastViewport } from "@/components/ui/Toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "GameSafe",
  description:
    "Community-powered safety intelligence for gamers. See what other players have experienced with third-party stores, resellers, and download sites.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased bg-background text-text-primary`}>
        <Providers>
          <TopNav />
          <main className="pb-24 md:pb-0">{children}</main>
          <BottomNav />
          <ToastViewport />
        </Providers>
      </body>
    </html>
  );
}
