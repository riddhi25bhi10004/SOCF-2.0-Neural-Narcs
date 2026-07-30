/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'eco-dark': '#2f220f',
        'eco-surface': '#fffaf2',
        'eco-card': '#fffdfa',
        'eco-border': '#e8d6b0',
        'eco-muted': '#8b6f4f',
        'eco-text': '#3f2e20',
        'eco-primary': '#c97a1d',
        'eco-primary-glow': '#e0a53e',
        'eco-accent': '#d9a61a',
        'eco-warning': '#b86b1f',
        'eco-danger': '#a4513c',
        'eco-success': '#6d8b3d',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(37, 99, 235, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(37, 99, 235, 0.4)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
