import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"], // Use class-based dark mode
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@shadcn/ui/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)", // Reference the CSS variable for background
        foreground: "var(--foreground)", // Reference the CSS variable for foreground
      },
    },
  },
  plugins: [require("tailwindcss-animate")], // TailwindCSS animate plugin
} satisfies Config;
