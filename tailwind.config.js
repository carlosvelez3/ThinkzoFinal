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
        'primary-accent': '#06B6D4',
        'primary-accent-hover': '#0891B2',
        'secondary-blue': '#0EA5E9',
        'secondary-purple': '#6366F1',
        'button-gradient-start': '#0EA5E9',
        'button-gradient-end': '#6366F1',
        'button-gradient-start-hover': '#0284C7',
        'button-gradient-end-hover': '#4F46E5',
        'dark-primary': '#1A0F3D',
        'light-secondary': '#F5F0FA',
        'terminal-bg-start': 'rgba(30, 30, 30, 0.95)',
        'terminal-bg-end': 'rgba(15, 15, 15, 0.95)',
        'cool-dark-1': '#0F172A',
        'cool-dark-2': '#1E293B',
        'cool-dark-3': '#334155',
        'cool-blue-1': '#0C4A6E',
        'cool-blue-2': '#075985',
        'cool-teal-1': '#134E4A',
        'cool-teal-2': '#0F766E',
        'cta-yellow': '#D97706',
        'cta-yellow-hover': '#B45309',
      },
      maxWidth: {
        'site': '1100px',
      },
      keyframes: {
        'gradient-shift': {
          '0%': { transform: 'translate(-50%, -50%) rotate(0deg)' },
          '100%': { transform: 'translate(-30%, -70%) rotate(360deg)' },
        },
        'code-scroll': {
          '0%': { backgroundPosition: '0% 0%' },
          '100%': { backgroundPosition: '100% 100%' },
        },
        'background-pan': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'cool-wave': {
          '0%': { backgroundPosition: '0% 0%' },
          '50%': { backgroundPosition: '100% 100%' },
          '100%': { backgroundPosition: '0% 0%' },
        },
      },
      animation: {
        'gradient-shift': 'gradient-shift 20s ease-in-out infinite alternate',
        'code-scroll': 'code-scroll 60s linear infinite',
        'background-pan': 'background-pan 15s ease-in-out infinite',
        'cool-wave': 'cool-wave 20s ease-in-out infinite',
      },
      backgroundImage: {
        'code-pattern': `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Ctext x='10' y='20' font-family='monospace' font-size='12' fill='white' fill-opacity='0.05'%3E%3C/%3E%3C/text%3E%3Ctext x='60' y='35' font-family='monospace' font-size='10' fill='white' fill-opacity='0.03'%3E%7B%7D%3C/text%3E%3Ctext x='20' y='50' font-family='monospace' font-size='8' fill='white' fill-opacity='0.04'%3E//%3C/text%3E%3Ctext x='70' y='65' font-family='monospace' font-size='14' fill='white' fill-opacity='0.06'%3E%3E%3C/text%3E%3Ctext x='5' y='80' font-family='monospace' font-size='11' fill='white' fill-opacity='0.03'%3E()%3C/text%3E%3Ctext x='45' y='15' font-family='monospace' font-size='9' fill='white' fill-opacity='0.05'%3E%3D%3E%3C/text%3E%3Ctext x='80' y='45' font-family='monospace' font-size='13' fill='white' fill-opacity='0.04'%3E%5B%5D%3C/text%3E%3Ctext x='30' y='90' font-family='monospace' font-size='10' fill='white' fill-opacity='0.06'%3E%26%26%3C/text%3E%3C/svg%3E")`,
        'cool-gradient-animated': 'linear-gradient(-45deg, #0F172A, #1E293B, #0C4A6E, #134E4A, #075985, #0F766E)',
        'cool-pattern': `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cg fill-opacity='0.03'%3E%3Cpolygon fill='%2300BCD4' points='36,1 14,1 14,37 14,37 25,37 25,25 36,25'/%3E%3Cpolygon fill='%233B82F6' points='20,20 20,20 20,30 30,30 30,20 30,20 30,30 40,30 40,20 40,30 50,30 50,40 40,40 40,50 30,50 30,40 20,40'/%3E%3C/g%3E%3C/svg%3E")`,
      },
    },
  },
  plugins: [],
};
