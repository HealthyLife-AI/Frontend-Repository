import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "HealthyLife AI",
  description:
    "AI-powered health and nutrition platform — personalized calorie and macro insights.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" className={`h-full antialiased ${inter.variable}`}>
      <head>
        {/*
          Material Symbols are loaded via Google Fonts CDN.
          Inter is loaded via next/font/google for optimal performance.
          If fully offline hosting is required, switch to next/font/local
          with self-hosted font files instead.
        */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-on-background">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
