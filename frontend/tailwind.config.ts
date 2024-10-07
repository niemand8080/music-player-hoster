import type { Config } from "tailwindcss";

const config: Config = {
  mode: 'jit',
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
      },
      keyframes: {
        "fade-in-bottom": {
          "0%": {
            transform: "translateY(100%)",
            opacity: "0",
            filter: "blur(10px)"
          },
          "60%": {
            transform: "translateY(0px)",
            opacity: "0.8",
            filter: "blur(3px)"
          },
          "100%": {
            transform: "translateY(0px)",
            opacity: "1",
            filter: "blur(0px)"
          }
        }
      },
      animation: {
        "fade-in-bottom": "fade-in-bottom 0.8s cubic-bezier(0.16, 1, 0.3, 1)"
      }
    },
  },
  plugins: [],
};
export default config;
