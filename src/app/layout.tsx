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
  title: "AURA Atelier | Curated Modern Luxury & Fine Crafts",
  description: "Discover luxury fashion, mechanical timepieces, Tuscan leather goods, and refined cashmere outerwear.",
  openGraph: {
    title: "AURA Atelier | Curated Modern Luxury",
    description: "Handcrafted Italian leather, Swiss horology, and architectural tailoring.",
    images: ["https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80"],
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
        <script src="https://checkout.razorpay.com/v1/checkout.js" async />
      </head>
      <body className="bg-background-primary text-foreground-primary antialiased font-sans min-h-screen flex flex-col selection:bg-accent selection:text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
