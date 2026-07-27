import type { Metadata } from "next";
import { Hanken_Grotesk, Inter } from "next/font/google";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { RefCapture } from "@/components/RefCapture";
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

export const metadata: Metadata = {
  title: {
    default: "FBC — FUTO Blockchain Club",
    template: "%s · FBC",
  },
  description:
    "Official website of FUTO Blockchain Club (FBC) — community, education, bounties, and on-chain builders at FUTO.",
  openGraph: {
    title: "FBC — FUTO Blockchain Club",
    description:
      "University blockchain club at FUTO. Events, education, community, and campaigns.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${hanken.variable} ${inter.variable} flex min-h-screen flex-col bg-bg font-sans text-ink antialiased`}
      >
        <RefCapture />
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
