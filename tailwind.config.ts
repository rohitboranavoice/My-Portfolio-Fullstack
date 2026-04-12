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
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          orange: "#FD853A",
        },
        neutral: {
          900: "#171717",
          800: "#1D2939",
          700: "#344054",
          400: "#98A2B3",
          100: "#FCFCFD",
          50: "#F9FAFB",
        }
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },
      animation: {
        marquee: "marquee 25s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
