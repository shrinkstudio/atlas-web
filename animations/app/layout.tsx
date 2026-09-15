import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Ruxlo animations",
  description: "Embedded UI animations for the Ruxlo site.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Serif+Display&family=DM+Mono:wght@500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <main className="stage">{children}</main>
      </body>
    </html>
  );
}
