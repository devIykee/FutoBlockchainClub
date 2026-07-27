import type { Metadata } from "next";
import { Space_Grotesk, Archivo, JetBrains_Mono } from "next/font/google";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { RefCapture } from "@/components/RefCapture";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["400", "500", "600", "700"],
});

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  weight: ["400", "500", "600", "700"],
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "FBC × Ledger Invite Contest",
  description:
    "FUTO Blockchain Club × Ledger invite contest. Join, refer classmates, climb the leaderboard.",
  openGraph: {
    title: "FBC × Ledger Invite Contest",
    description:
      "Join FBC, join the Ledger community, share your ref link, and compete for prizes.",
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
        className={`${spaceGrotesk.variable} ${archivo.variable} ${jetbrains.variable} flex min-h-screen flex-col bg-navy font-body text-ink antialiased`}
      >
        <RefCapture />
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
