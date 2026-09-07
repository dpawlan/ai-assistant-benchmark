import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "AI Assistant Benchmark | Compare AI Personal Assistants",
  description: "Public scorecard for AI personal assistants. Wirecutter-style comparison with consistent metrics across ChatGPT, Claude, Gemini, Copilot, and 40+ AI tools.",
  keywords: ["AI assistant", "ChatGPT", "Claude", "Gemini", "comparison", "benchmark", "scorecard"],
  openGraph: {
    title: "AI Assistant Benchmark",
    description: "Compare AI personal assistants with consistent metrics and real user feedback",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-background text-foreground antialiased">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
