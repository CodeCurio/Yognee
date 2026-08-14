import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://yoginee.com"),
  title: "Yoginee | Sacred Vedic Astrology, Certified Gemstones & Energy Bracelets",
  description: "Official Yoginee Store - Explore 100% Govt. Lab Certified Natural Gemstones, Nepal Rudraksha Malas, Consecrated 3D Yantras, Energy Bracelets, and 1-on-1 Astrologer Consultations.",
  keywords: [
    "Yoginee",
    "Vedic Astrology",
    "Energy Bracelets",
    "Pyrite Bracelet",
    "Citrine Bracelet",
    "Navgraha Bracelet",
    "Rudraksha Mala",
    "Lab Certified Gemstones",
    "Janam Kundli Report",
    "Astrology Consultation",
  ],
  authors: [{ name: "Yoginee Vedic Sciences" }],
  icons: {
    icon: "/images/yoginee-logo.png",
    shortcut: "/images/yoginee-logo.png",
    apple: "/images/yoginee-logo.png",
  },
  openGraph: {
    title: "Yoginee | Sacred Vedic Astrology & Energy Bracelets",
    description: "Empowering your journey with ancient Vedic wisdom, lab certified gemstones, and divine cosmic guidance.",
    url: "https://yoginee.com",
    siteName: "Yoginee",
    images: [
      {
        url: "/images/yoginee-logo.png",
        width: 1200,
        height: 630,
        alt: "Yoginee Sacred Vedic Astrology Logo",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yoginee | Sacred Vedic Astrology & Energy Bracelets",
    description: "Empowering your journey with ancient Vedic wisdom, lab certified gemstones, and divine cosmic guidance.",
    images: ["/images/yoginee-logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <link rel="icon" href="/images/yoginee-logo.png" type="image/png" />
        <script src="https://checkout.razorpay.com/v1/checkout.js" async />
      </head>
      <body className="bg-background-primary text-foreground-primary antialiased font-sans min-h-screen flex flex-col selection:bg-gold selection:text-background-primary">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
