/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        quest: {
          dark: '#0d0d1a',
          darker: '#07070f',
          purple: '#6c3dc7',
          'purple-light': '#9b6dff',
          gold: '#f5c842',
          'gold-dark': '#c9a227',
          teal: '#00d4aa',
          red: '#e05c5c',
          blue: '#4a9eff',
        },
      },
      fontFamily: {
        quest: ['"Cinzel"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'star-field': "url('/stars.svg')",
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          from: { boxShadow: '0 0 10px #6c3dc7, 0 0 20px #6c3dc7' },
          to: { boxShadow: '0 0 20px #9b6dff, 0 0 40px #9b6dff' },
        },
      },
    },
  },
  plugins: [],
}
