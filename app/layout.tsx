import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PersonStructuredData, WebsiteStructuredData } from "@/components/StructuredData";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: 'swap',
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: "Godwill Barasa | Full-Stack Engineer & Performance Architect",
    template: "%s | Godwill Barasa",
  },
  description: "Full-Stack Engineer specializing in high-performance content delivery systems, WordPress-to-React pipelines, and enterprise architecture. Building scalable solutions at Piedmont Global.",
  applicationName: "Godwill Barasa Portfolio",
  keywords: [
    "Godwill Barasa",
    "Full Stack Engineer",
    "React Developer",
    "Next.js Developer",
    "WordPress Expert",
    "Performance Optimization",
    "Web Development",
    "TypeScript",
    "Node.js",
    "Enterprise Architecture",
    "Frontend Developer",
    "Backend Developer",
    "Software Engineer",
    "Web Performance",
    "Core Web Vitals",
  ],
  authors: [{ name: "Godwill Barasa", url: "https://godwill.codes" }],
  creator: "Godwill Barasa",
  publisher: "Godwill Barasa",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://godwill.codes'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Godwill Barasa",
    title: "Godwill Barasa | Full-Stack Engineer & Performance Architect",
    description: "Full-Stack Engineer specializing in high-performance content delivery systems and enterprise architecture.",
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Godwill Barasa - Full-Stack Engineer',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Godwill Barasa | Full-Stack Engineer & Performance Architect",
    description: "Full-Stack Engineer specializing in high-performance content delivery systems and enterprise architecture.",
    creator: "@godwillbarasa",
    site: "@godwillbarasa",
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.webmanifest',
  verification: {
    google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
  category: 'technology',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://godwill.codes'
  
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)" />
      </head>
      <body
        className={`${dmSans.variable} ${geistMono.variable} antialiased bg-white text-zinc-900`}
      >
        <PersonStructuredData 
          data={{
            name: "Godwill Barasa",
            url: siteUrl,
            jobTitle: "Full-Stack Engineer & Performance Architect",
            description: "Full-Stack Engineer specializing in high-performance content delivery systems and enterprise architecture.",
            sameAs: [
              "https://github.com/godwillbarasa",
              "https://linkedin.com/in/godwillbarasa",
              "https://twitter.com/godwillbarasa",
            ],
          }}
        />
        <WebsiteStructuredData 
          data={{
            name: "Godwill Barasa Portfolio",
            url: siteUrl,
            description: "Full-Stack Engineer specializing in high-performance content delivery systems and enterprise architecture.",
          }}
        />
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
