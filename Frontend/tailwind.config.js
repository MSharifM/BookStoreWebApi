/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Vazirmatn', 'ui-sans-serif', 'system-ui', 'Tahoma', 'sans-serif'],
      },
      colors: {
        // ذغالی گرم - چوب کهنه و چرم
        ink: {
          50:  '#faf6ee',
          100: '#efe7d6',
          200: '#d4c7ab',
          300: '#a89878',
          400: '#7d6f54',
          500: '#5a4f3c',
          600: '#413a2c',
          700: '#2d281e',
          800: '#1e1a14',
          900: '#13100b',
          950: '#0a0805',
        },
        // برنج کهنه - طلایی گرم
        accent: {
          50:  '#fbf4dc',
          100: '#f5e6b4',
          200: '#ecd08a',
          300: '#e0b95f',
          400: '#d1a447',
          500: '#b78a35',
          600: '#986d28',
          700: '#755220',
          800: '#573d1a',
          900: '#3d2a15',
        },
        // مسی سوخته - هشدار و لهجه گرم
        copper: {
          200: '#f0c9a8',
          300: '#e8a37a',
          400: '#d98258',
          500: '#c1653d',
          600: '#9c4d2e',
          700: '#7a3b23',
        },
        // خزه‌ای آرام - موفقیت
        moss: {
          200: '#c4d4c0',
          300: '#9eb89a',
          400: '#7a9a78',
          500: '#5c7f5c',
          600: '#456345',
          700: '#334a33',
        },
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        soft: '0 2px 4px rgba(0,0,0,0.3), 0 12px 32px -16px rgba(0,0,0,0.5)',
        card: '0 4px 6px rgba(0,0,0,0.4), 0 24px 56px -20px rgba(0,0,0,0.7)',
        'card-glow': '0 0 0 1px rgba(209,164,71,0.08), 0 4px 6px rgba(0,0,0,0.4), 0 24px 56px -20px rgba(0,0,0,0.7)',
        brass: '0 4px 20px -4px rgba(209,164,71,0.35), 0 0 0 1px rgba(209,164,71,0.15)',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: 0, transform: 'translateY(10px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        shake: {
          '10%, 90%': { transform: 'translateX(-1px)' },
          '20%, 80%': { transform: 'translateX(2px)' },
          '30%, 50%, 70%': { transform: 'translateX(-3px)' },
          '40%, 60%': { transform: 'translateX(3px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        pingSlow: {
          '75%, 100%': { transform: 'scale(2)', opacity: '0' },
        },
        glow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.7' },
        },
      },
      animation: {
        'fade-up': 'fadeUp 420ms cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-in': 'fadeIn 240ms ease-out both',
        shake: 'shake 320ms cubic-bezier(0.36, 0.07, 0.19, 0.97) both',
        float: 'float 5s ease-in-out infinite',
        'ping-slow': 'pingSlow 2.2s cubic-bezier(0, 0, 0.2, 1) infinite',
        glow: 'glow 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};