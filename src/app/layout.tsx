import { Barlow } from "next/font/google";
import "./globals.css";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: "normal",
  display: "swap",
  fallback: ["Arial", "sans-serif"],
  variable: "--font-barlow",
});

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={barlow.variable}><body>{children}</body></html>;
}
