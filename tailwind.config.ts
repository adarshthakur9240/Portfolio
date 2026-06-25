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
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        cinematic: {
          dark: "#050505",
          light: "#0d0d0d",
          border: "rgba(255, 255, 255, 0.05)",
          glass: "rgba(255, 255, 255, 0.02)"
        }
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(to bottom right, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.01))',
      },
      boxShadow: {
        'glass': '0 4px 30px rgba(0, 0, 0, 0.8)',
      },
      cursor: {
        none: 'none',
      }
    },
  },
  plugins: [],
};
export default config;
