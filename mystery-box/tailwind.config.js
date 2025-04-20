/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
      extend: {
        colors: {
          primary: {
            light: '#3B82F6',
            DEFAULT: '#1E3A8A',
            dark: '#1E40AF',
            50: '#EFF6FF',
            100: '#DBEAFE',
            200: '#BFDBFE',
            300: '#93C5FD',
            400: '#60A5FA',
            500: '#3B82F6',
            600: '#2563EB',
            700: '#1D4ED8',
            800: '#1E40AF',
            900: '#1E3A8A',
          },
          secondary: {
            light: '#FFD700',
            DEFAULT: '#D4AF37',
            dark: '#996515',
            50: '#FFFBEB',
            100: '#FEF3C7',
            200: '#FDE68A',
            300: '#FCD34D',
            400: '#FBBF24',
            500: '#F59E0B',
            600: '#D97706',
            700: '#B45309',
            800: '#92400E',
            900: '#78350F',
          },
          tertiary: {
            light: '#F9FAFB',
            DEFAULT: '#F3F4F6',
            dark: '#E5E7EB',
          },
          gray: {
            50: '#F9FAFB',
            100: '#F3F4F6',
            200: '#E5E7EB',
            300: '#D1D5DB',
            400: '#9CA3AF',
            500: '#6B7280',
            600: '#4B5563',
            700: '#374151',
            800: '#1F2937',
            900: '#111827',
          },
        },
        fontFamily: {
          sans: ['var(--font-geist-sans)', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        },
        boxShadow: {
          'soft': '0 2px 10px rgba(0, 0, 0, 0.05)',
          'medium': '0 4px 20px rgba(0, 0, 0, 0.1)',
          'hard': '0 8px 30px rgba(0, 0, 0, 0.15)',
        },
        borderRadius: {
          'xl': '1rem',
          '2xl': '1.5rem',
        },
        animation: {
          'fade-in': 'fadeIn 0.5s ease-in-out',
          'slide-up': 'slideUp 0.5s ease-in-out',
          'slide-down': 'slideDown 0.5s ease-in-out',
          'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        },
        keyframes: {
          fadeIn: {
            '0%': { opacity: '0' },
            '100%': { opacity: '1' },
          },
          slideUp: {
            '0%': { transform: 'translateY(20px)', opacity: '0' },
            '100%': { transform: 'translateY(0)', opacity: '1' },
          },
          slideDown: {
            '0%': { transform: 'translateY(-20px)', opacity: '0' },
            '100%': { transform: 'translateY(0)', opacity: '1' },
          },
        },
        backgroundImage: {
          'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
          'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        },
        spacing: {
          '72': '18rem',
          '84': '21rem',
          '96': '24rem',
          '128': '32rem',
        },
        maxWidth: {
          '8xl': '90rem',
        },
      },
    },
  plugins: [],
}