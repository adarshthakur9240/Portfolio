import type { Metadata } from "next";
import "./globals.css";
import { SoundProvider } from "@/context/SoundContext";
import { TerminalProvider } from "@/context/TerminalContext";

export const metadata: Metadata = {
  title: "Adarsh Singh — Software Architect",
  description:
    "Architecting High-Throughput AI & Distributed Systems. Full-Stack Engineer specialising in scalable infrastructure.",
  openGraph: {
    title: "Adarsh Singh — Software Architect",
    description: "Architecting High-Throughput AI & Distributed Systems.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-cinematic-dark text-foreground">
        <SoundProvider>
          <TerminalProvider>{children}</TerminalProvider>
        </SoundProvider>
      </body>
    </html>
  );
}
