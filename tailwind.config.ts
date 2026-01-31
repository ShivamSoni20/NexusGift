import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['var(--font-heading)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
      colors: {
        ash: {
          950: '#050505',
          900: '#0a0a0a',
          800: '#1a1a1a',
          700: '#2a2a2a',
        },
        gold: {
          DEFAULT: '#d4af37',
          500: '#d4af37',
          400: '#e5c05b',
          600: '#b08d26',
        }
      },
    },
  },
  plugins: [],
};
export default config;
