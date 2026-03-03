/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#FFF5EE',
          100: '#FFE8D6',
          200: '#FFD4B8',
          300: '#FFBB8E',
          400: '#FF9B5E',
          500: '#FF6B35',
          600: '#E85A28',
          700: '#C44A1F',
          800: '#9E3B18',
          900: '#7A2F14',
        },
        surface: {
          50: '#FAF8F5',
          100: '#F5F2EE',
          200: '#F0EDE8',
          300: '#E8E3DD',
          400: '#D4CFC8',
          500: '#9E958A',
          600: '#6B635A',
          700: '#4A443C',
          800: '#2E2A26',
          900: '#1E1B18',
          950: '#141210',
        },
      },
      fontFamily: {
        sans: ['"DM Sans"', '"Segoe UI"', 'system-ui', 'sans-serif'],
        display: ['"DM Serif Display"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.25rem',
      },
      boxShadow: {
        'soft': '0 1px 3px rgba(26,22,18,0.06), 0 4px 12px rgba(26,22,18,0.04)',
        'medium': '0 2px 8px rgba(26,22,18,0.08), 0 8px 24px rgba(26,22,18,0.06)',
        'large': '0 4px 16px rgba(26,22,18,0.1), 0 12px 32px rgba(26,22,18,0.08)',
        'soft-dark': '0 1px 3px rgba(0,0,0,0.2), 0 4px 12px rgba(0,0,0,0.15)',
        'medium-dark': '0 2px 8px rgba(0,0,0,0.3), 0 8px 24px rgba(0,0,0,0.2)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'shimmer': 'shimmer 1.5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(12px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        slideInRight: { '0%': { opacity: '0', transform: 'translateX(-8px)' }, '100%': { opacity: '1', transform: 'translateX(0)' } },
        pulseSoft: { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0.7' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
    },
  },
  plugins: [],
};
