import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk, Inter } from "next/font/google";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { RefCapture } from "@/components/RefCapture";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeScript } from "@/components/theme-script";
import "./globals.css";

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f2f4f7" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0c10" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://fbc-ledger-contest.vercel.app"
  ),
  title: {
    default: "FutoBlockchainClub",
    template: "%s · FutoBlockchainClub",
  },
  description:
    "Official website of FutoBlockchainClub (FBC) — community, education, bounties, and on-chain builders at FUTO.",
  applicationName: "FutoBlockchainClub",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other: [
      {
        rel: "android-chrome",
        url: "/android-chrome-192x192.png",
        sizes: "192x192",
      },
    ],
  },
  openGraph: {
    title: "FutoBlockchainClub",
    description:
      "FUTO Blockchain Club — events, education, community, and campaigns.",
    type: "website",
    siteName: "FutoBlockchainClub",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "FutoBlockchainClub" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "FutoBlockchainClub",
    description:
      "FUTO Blockchain Club — events, education, community, and campaigns.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body
        className={`${hanken.variable} ${inter.variable} flex min-h-screen flex-col bg-bg font-sans text-ink antialiased`}
      >
        <ThemeProvider>
          <RefCapture />
          <Nav />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
