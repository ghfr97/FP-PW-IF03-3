/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
        admin: ['"Syne"', 'sans-serif'],
      },
      colors: {
        snow: {
          50: '#f0f9ff',
          100: '#e0f4ff',
          500: '#38bdf8',
          600: '#0ea5e9',
          700: '#0284c7',
        },
        ice: '#e8f4fd',
        frost: '#1e3a5f',
        teal: '#00c9a7',
        gold: '#f5a623',
      },
      animation: {
        'spin-slow': 'spin 4s linear infinite',
        'bubble': 'bubble 6s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease forwards',
        'fade-in': 'fadeIn 0.4s ease forwards',
      },
      keyframes: {
        bubble: {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '50%': { transform: 'translateY(-20px) scale(1.05)' },
        },
        slideUp: {
          from: { opacity: 0, transform: 'translateY(30px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        }
      }
    },
  },
  plugins: [],
}
