import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 2s linear infinite reverse',
      },
      fontFamily: {
        heading: ['var(--font-alef)', 'serif'],
        body: ['var(--font-rubik)', 'sans-serif'],
      },
      colors: {
        // Base colors for שטיחי בוטיק יוסף
        cream: '#F8F5F0', // צבע בסיס - שמנת/בז' בהיר
        charcoal: '#3A3A3A', // שחור פחם רך (unified site text)
        olive: '#7A8B5C', // גוון זית - הצבע של העלה בלוגו
        gray: {
          // Unify strong text shades to charcoal across the site
          700: '#3A3A3A',
          800: '#3A3A3A',
          900: '#3A3A3A',
        },
        sage: {
          DEFAULT: '#A3B18A', // ירוק מרווה/אקליפטוס
          light: '#C5D1B5',
          dark: '#7A8A6D',
        },
        terracotta: {
          DEFAULT: '#C1784D', // חום-טרקוטה/אדמה
          light: '#D4956F',
          dark: '#A45F39',
        },
        // Primary brand color (sage green)
        primary: {
          50: '#f5f7f3',
          100: '#e8ede2',
          200: '#d4ddc9',
          300: '#b8c7a5',
          400: '#A3B18A', // Main sage color
          500: '#8a9d73',
          600: '#7A8A6D',
          700: '#606d56',
          800: '#4d5745',
          900: '#3f4738',
        },
      },
    },
  },
  plugins: [],
};
export default config;
