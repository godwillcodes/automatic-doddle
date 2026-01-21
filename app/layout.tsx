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
    default: "Godwill Barasa | Senior Full-Stack Engineer (React, Next.js, Laravel, WordPress)",
    template: "%s | Godwill Barasa",
  },
  description: "Senior Full-Stack Engineer building high-performance web applications with React, Next.js, TypeScript, Laravel, and WordPress. Focused on Core Web Vitals, experimentation, analytics, and CI/CD.",
  applicationName: "Godwill Barasa Portfolio",
  keywords: [
    "Godwill Barasa",
    "Senior Full Stack Engineer",
    "Full Stack Engineer",
    "React Engineer",
    "Next.js Engineer",
    "TypeScript Engineer",
    "Laravel Developer",
    "WordPress Developer",
    "Performance Optimization",
    "Web Development",
    "Core Web Vitals",
    "Frontend Performance",
    "CI/CD",
    "Experimentation",
    "A/B Testing",
    "Google Analytics",
    "Google Tag Manager",
    "Frontend Developer",
    "Backend Developer",
    "Software Engineer",
    "Web Performance",
  ],
  authors: [{ name: "Godwill Barasa", url: "https://godwillbarasa.netlify.app" }],
  creator: "Godwill Barasa",
  publisher: "Godwill Barasa",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://godwillbarasa.netlify.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Godwill Barasa",
    title: "Godwill Barasa | Senior Full-Stack Engineer (React, Next.js, Laravel, WordPress)",
    description: "Senior Full-Stack Engineer building high-performance web applications with React, Next.js, TypeScript, Laravel, and WordPress.",
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
    title: "Godwill Barasa | Senior Full-Stack Engineer (React, Next.js, Laravel, WordPress)",
    description: "Senior Full-Stack Engineer building high-performance web applications with React, Next.js, TypeScript, Laravel, and WordPress.",
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
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://godwillbarasa.netlify.app'
  
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
            jobTitle: "Senior Full-Stack Engineer",
            description: "Senior Full-Stack Engineer building high-performance web applications with React, Next.js, TypeScript, Laravel, and WordPress.",
            sameAs: [
              "https://github.com/godwillcodes",
              "https://www.linkedin.com/in/godwillcodes/",
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
