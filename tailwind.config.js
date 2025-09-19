/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'montserrat': ['Montserrat', 'sans-serif'],
        'poppins': ['Poppins', 'sans-serif'],
        'retro-mono': ['Courier New', 'Monaco', 'Menlo', 'Consolas', 'monospace'],
      },
      colors: {
        'primary-accent': '#E03A8A',
        'primary-accent-hover': '#C02A7A',
        'secondary-blue': '#3B82F6',
        'secondary-purple': '#8B5CF6',
        'dark-primary': '#1A0F3D',
        'light-secondary': '#F5F0FA',
        'terminal-bg-start': 'rgba(30, 30, 30, 0.95)',
        'terminal-bg-end': 'rgba(15, 15, 15, 0.95)',
      },
      maxWidth: {
        'site': '1100px',
      },
      keyframes: {
        'gradient-shift': {
          '0%': { transform: 'translate(-50%, -50%) rotate(0deg)' },
          '100%': { transform: 'translate(-30%, -70%) rotate(360deg)' },
        },
      },
      animation: {
        'gradient-shift': 'gradient-shift 20s ease-in-out infinite alternate',
      },
    },
  },
  plugins: [],
};
