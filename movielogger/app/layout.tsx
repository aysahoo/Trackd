import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SquircleProvider } from "./components/SquircleProvider";
import { ThemeProvider } from "./components/ThemeProvider";
import QueryProvider from "./providers/QueryProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MovieLogger - Track Your Movies & Shows",
  description: "Track, discover, and share your favorite movies and TV shows with friends",
  icons: {
    icon: [
      {
        url: "/logo_light.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/logo_dark.png",
        media: "(prefers-color-scheme: dark)",
      },
    ],
    apple: [
      {
        url: "/logo_light.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/logo_dark.png",
        media: "(prefers-color-scheme: dark)",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen`}
      >
        <QueryProvider>
          <SquircleProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
          </SquircleProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
