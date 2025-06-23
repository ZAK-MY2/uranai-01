import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { initializeMonitoring } from "@/lib/monitoring/setup";
import { EnvironmentBadge } from "@/components/EnvironmentBadge";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "COSMIC ORACLE - 宇宙の神託",
  description: "10の古代占術と環境データが織りなす、あなただけの運命の導き",
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
      >
        {children}
        <EnvironmentBadge />
      </body>
    </html>
  );
}
