/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Orange palette
        saffron: {
          50:  '#fff7ed', 100: '#ffedd5', 200: '#fed7aa',
          300: '#fdba74', 400: '#fb923c', 500: '#f97316',
          600: '#ea580c', 700: '#c2410c', 800: '#9a3412', 900: '#7c2d12',
        },
        // Dark navy palette
        navy: {
          950: '#0f1117',
          900: '#131720',
          800: '#181d27',
          700: '#1a2035',
          600: '#1e2636',
          500: '#212940',
          400: '#2a3450',
        },
        // UI helpers
        border: 'rgba(255,255,255,0.07)',
      },
      fontFamily: {
        mukta:   ['Mukta', 'sans-serif'],
        grotesk: ['"Space Grotesk"', 'sans-serif'],
      },
      animation: {
        'pulse-border': 'pulseBorder 1.5s ease-in-out infinite',
        'slide-in':     'slideIn 0.3s ease-out',
        'fade-in':      'fadeIn 0.4s ease-out',
      },
      keyframes: {
        pulseBorder: {
          '0%,100%': { boxShadow: '0 0 0 0 rgba(239,68,68,0.5)' },
          '50%':     { boxShadow: '0 0 0 10px rgba(239,68,68,0)' },
        },
        slideIn: {
          from: { transform: 'translateX(100%)', opacity: 0 },
          to:   { transform: 'translateX(0)', opacity: 1 },
        },
        fadeIn: {
          from: { opacity: 0, transform: 'translateY(6px)' },
          to:   { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
