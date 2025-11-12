import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Base colors for שטיחי בוטיק יוסף
        cream: '#F8F5F0', // צבע בסיס - שמנת/בז' בהיר
        charcoal: '#2B2B2B', // שחור עדין/פחם כהה
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
