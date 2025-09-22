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
        'button-gradient-start': '#3B82F6',
        'button-gradient-end': '#8B5CF6',
        'button-gradient-start-hover': '#2563EB',
        'button-gradient-end-hover': '#7C3AED',
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
        'code-scroll': {
          '0%': { backgroundPosition: '0% 0%' },
          '100%': { backgroundPosition: '100% 100%' },
        },
      },
      animation: {
        'gradient-shift': 'gradient-shift 20s ease-in-out infinite alternate',
        'code-scroll': 'code-scroll 60s linear infinite',
      },
      backgroundImage: {
        'code-pattern': `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Ctext x='10' y='20' font-family='monospace' font-size='12' fill='white' fill-opacity='0.05'%3E%3C/%3E%3C/text%3E%3Ctext x='60' y='35' font-family='monospace' font-size='10' fill='white' fill-opacity='0.03'%3E%7B%7D%3C/text%3E%3Ctext x='20' y='50' font-family='monospace' font-size='8' fill='white' fill-opacity='0.04'%3E//%3C/text%3E%3Ctext x='70' y='65' font-family='monospace' font-size='14' fill='white' fill-opacity='0.06'%3E%3E%3C/text%3E%3Ctext x='5' y='80' font-family='monospace' font-size='11' fill='white' fill-opacity='0.03'%3E()%3C/text%3E%3Ctext x='45' y='15' font-family='monospace' font-size='9' fill='white' fill-opacity='0.05'%3E%3D%3E%3C/text%3E%3Ctext x='80' y='45' font-family='monospace' font-size='13' fill='white' fill-opacity='0.04'%3E%5B%5D%3C/text%3E%3Ctext x='30' y='90' font-family='monospace' font-size='10' fill='white' fill-opacity='0.06'%3E%26%26%3C/text%3E%3C/svg%3E")`,
      },
    },
  },
  plugins: [],
};
