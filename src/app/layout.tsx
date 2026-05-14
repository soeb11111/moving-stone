import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Moving Stone — AI-Powered Digital Marketing Agency",
  description: "We combine artificial intelligence, data science, and performance marketing to scale your business faster. SEO, Paid Media, AI Automation & more.",
  keywords: ["AI marketing", "digital marketing agency", "SEO", "paid media", "AI automation", "content marketing"],
  openGraph: {
    title: "Moving Stone — AI-Powered Digital Marketing Agency",
    description: "AI-powered digital marketing that transforms data into predictable growth.",
    url: "https://movingstone.com",
    siteName: "Moving Stone",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Moving Stone — AI-Powered Digital Marketing",
    description: "AI-powered digital marketing that transforms data into predictable growth.",
  },
};

import SmoothScroll from "@/components/utils/SmoothScroll";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
