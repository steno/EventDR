import { Syne, Inter } from "next/font/google";
import { ThemeScript } from "@/components/ThemeScript";
import { PageGlow } from "@/components/PageGlow";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${syne.variable} ${inter.variable}`}
    >
      <head>
        <ThemeScript />
      </head>
      <body className="relative min-h-dvh font-sans antialiased bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
        <div
          className="pointer-events-none fixed inset-0 z-0 hidden overflow-hidden dark:block"
          aria-hidden
        >
          <PageGlow />
        </div>
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
