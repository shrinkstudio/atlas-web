import type { ReactNode } from "react";
import { DM_Sans, DM_Mono } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-mono",
});

export const metadata = {
  title: "Ruxlo animations",
  description: "Embedded UI animations for the Ruxlo site.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${dmMono.variable} antialiased`}>
        <main className="stage">{children}</main>
      </body>
    </html>
  );
}
