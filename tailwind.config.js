/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Brand Colors - WCAG AA Compliant
        primary: {
          50: '#f1f4f8',
          100: '#dde4ed',
          200: '#c2d1e0',
          300: '#9bb4cc',
          400: '#6d8fb3',
          500: '#4f739c',
          600: '#3f5d82',
          700: '#354d6a',
          800: '#2f4159',
          900: '#1F2A44', // Main primary color - Deep Blue "Confiance"
        },
        secondary: {
          50: '#f0fdff',
          100: '#ccf7fe',
          200: '#99effd',
          300: '#60e2fa',
          400: '#3BBFD6', // Main secondary color - Soft Teal "Innovation"
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        accent: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#3DC487', // Main accent color - Light Green "Énergie"
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        // Neutral Grays
        neutral: {
          50: '#F7F9FB',   // Very light gray
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#A0A6B1',  // Medium gray
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#23262F',  // Anthracite gray
        },
        // Keep existing gray scale for compatibility
        gray: {
          50: '#F7F9FB',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#A0A6B1',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#23262F',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 0.6s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        }
      }
    },
  },
  plugins: [],
}