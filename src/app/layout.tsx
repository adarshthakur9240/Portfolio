import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfitFont = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["400", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Adarsh's Portfolio",
  description: "Architecting High-Throughput AI & Distributed Systems.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfitFont.variable} font-sans antialiased bg-cinematic-dark text-foreground`}>
        {children}
      </body>
    </html>
  );
}
