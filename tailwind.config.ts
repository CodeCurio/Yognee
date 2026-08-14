import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          primary: "#1F002C", // Rich deep imperial purple matching logo exact bg
          secondary: "#2B003B", // Slightly lighter royal violet for containers
          card: "#260134", // Card background
          elevated: "#330245", // Hover card / elevated modal bg
          dark: "#14001F", // Deepest background tone
        },
        foreground: {
          primary: "#FAF4EB", // Warm cream off-white for main text
          secondary: "#D4C2DE", // Soft silvery lavender for body prose
          muted: "#9F86B0", // Muted purple gray for metadata
        },
        gold: {
          DEFAULT: "#D4AF37", // Imperial Vedic Gold
          light: "#FBE492", // Bright gold highlight
          medium: "#E5C158", // Midtone gold
          dark: "#9E7728", // Deep gold accent
          deep: "#6A4A0E", // Dark shadow gold
          amber: "#F59E0B", // Warm candle glow gold
        },
        accent: {
          DEFAULT: "#D4AF37",
          hover: "#E5C158",
          light: "#FBE492",
          dark: "#9E7728",
        },
        amethyst: {
          DEFAULT: "#9F45D3",
          light: "#C084FC",
          dark: "#6B21A8",
        },
        destructive: "#DC2626",
        success: "#16A34A",
        border: "rgba(212, 175, 55, 0.22)", // Subtle gold border
        "border-glow": "rgba(251, 228, 146, 0.4)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
        serif: ["var(--font-playfair)", "Playfair Display", "Georgia", "serif"],
      },
      boxShadow: {
        card: "0 4px 20px rgba(0, 0, 0, 0.4), 0 0 15px rgba(212, 175, 55, 0.08)",
        "card-hover": "0 10px 30px rgba(0, 0, 0, 0.6), 0 0 25px rgba(212, 175, 55, 0.25)",
        gold: "0 0 20px rgba(212, 175, 55, 0.35)",
        "gold-lg": "0 0 40px rgba(212, 175, 55, 0.5)",
      },
      animation: {
        shimmer: "shimmer 2.5s infinite linear",
        marquee: "marquee 25s linear infinite",
        pulseGlow: "pulseGlow 3s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.05)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;

