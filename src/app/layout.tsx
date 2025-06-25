import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { initializeMonitoring } from "@/lib/monitoring/setup";
import { EnvironmentBadge } from "@/components/EnvironmentBadge";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { SkipToContent } from "@/components/ui/skip-to-content";
import { AccessibilityMenu } from "@/components/ui/accessibility-menu";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ORACLE ECHO - 古の知恵が響き合う",
  description: "10の古の知恵が響き合う、あなただけの運命の導き",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // サーバーサイドでのみ監視システムを初期化
  if (typeof window === 'undefined') {
    initializeMonitoring();
  }

  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <SkipToContent />
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
        <AccessibilityMenu />
        <EnvironmentBadge />
      </body>
    </html>
  );
}
