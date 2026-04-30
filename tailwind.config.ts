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
        background: "#030303",
        foreground: "#ffffff",
        neon: {
          cyan: "#00f3ff",
          purple: "#bc13fe",
          magenta: "#ff003c"
        },
        cinematic: {
          dark: "#030303",
          light: "#0b0c16",
          border: "rgba(255, 255, 255, 0.05)",
          glass: "rgba(255, 255, 255, 0.02)"
        }
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(to bottom right, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.01))',
      },
      boxShadow: {
        'neon-cyan': '0 0 15px rgba(0, 243, 255, 0.5), 0 0 30px rgba(0, 243, 255, 0.2)',
        'neon-magenta': '0 0 15px rgba(255, 0, 60, 0.5), 0 0 30px rgba(255, 0, 60, 0.2)',
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
