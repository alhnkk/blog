import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/providers/theme-provider";
import { ImageKitProvider } from "@imagekit/next";
import { Toaster } from "sonner";
import { NavigationProgress } from "@/components/navigation-progress";
import { Suspense } from "react";

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600", "700"], // Sadece gerekli ağırlıklar
  display: "swap",
  preload: true,
  fallback: ["Georgia", "serif"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600"], // Sadece gerekli ağırlıklar
  display: "swap",
  preload: true,
  fallback: ["system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  title: {
    default: "Jurnalize",
    template: "%s | Kişisel Blog",
  },
  description:
    "Jurnalize, edebiyat, psikoloji, günlük yazılarımı paylaştığım kişisel blogum.",
  keywords: [
    "blog",
    "edebiyat",
    "psikoloji",
    "felsefe",
    "günlük",
    "kişisel blog",
  ],
  authors: [{ name: "Blog Yazarı" }],
  creator: "Blog Yazarı",
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    siteName: "Kişisel Blog",
    title: "Kişisel Blog",
    description:
      "Jurnalize, edebiyat, psikoloji, günlük yazılarımı paylaştığım kişisel blogum.",

    images: [
      {
        url: "/images/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Kişisel Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kişisel Blog",
    description:
      "Jurnalize, edebiyat, psikoloji, günlük yazılarımı paylaştığım kişisel blogum.",
    images: ["/images/og-default.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      suppressHydrationWarning
      lang="tr"
      className={`${poppins.variable} ${playfairDisplay.variable}`}
    >
      <body className={`font-sans antialiased`}>
        <ImageKitProvider
          urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Suspense fallback={null}>
              <NavigationProgress />
            </Suspense>
            {children}
            <Toaster richColors position="top-right" />
          </ThemeProvider>
        </ImageKitProvider>
        <Analytics />
      </body>
    </html>
  );
}
