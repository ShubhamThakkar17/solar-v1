import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { COMPANY, HERO } from "@/lib/content";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${COMPANY.name} — ${COMPANY.tagline}`,
  description: HERO.sub,
  openGraph: {
    title: `${COMPANY.name} — ${COMPANY.tagline}`,
    description: HERO.sub,
    type: "website",
    siteName: COMPANY.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${COMPANY.name} — ${COMPANY.tagline}`,
    description: HERO.sub,
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0C10",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        {/* The hero bitmap is the LCP element — start it in parallel with CSS. */}
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
