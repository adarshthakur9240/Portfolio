import type { Metadata } from "next";
import "./globals.css";
import { SoundProvider } from "@/context/SoundContext";
import { TerminalProvider } from "@/context/TerminalContext";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Adarsh Singh — Software Engineer",
  description:
    "Architecting High-Throughput AI & Distributed Systems. Full-Stack Engineer specialising in scalable infrastructure.",
  openGraph: {
    title: "Adarsh Singh — Software Engineer",
    description: "Architecting High-Throughput AI & Distributed Systems.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "antialiased bg-cinematic-dark text-foreground")}>
        <SoundProvider>
          <TerminalProvider>{children}</TerminalProvider>
        </SoundProvider>
      </body>
    </html>
  );
}
