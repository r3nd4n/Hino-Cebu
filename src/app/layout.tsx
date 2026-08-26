import type { Metadata } from "next";
import { Barlow_Condensed, Inter } from "next/font/google";

import "./globals.css";

const displayFont = Barlow_Condensed({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["700", "800"],
});

const bodyFont = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hino Cebu | Commercial vehicle support for Cebu businesses",
  description:
    "Hino Cebu provides local sales, parts, service, and support conversations for Cebu businesses.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${displayFont.variable} ${bodyFont.variable}`}>{children}</body>
    </html>
  );
}
