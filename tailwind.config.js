/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
  safelist: [
    'border-red-500/20',
    'border-yellow-500/20',
    'border-green-500/20',
    'bg-red-500/10',
    'bg-yellow-500/10',
    'bg-green-500/10',
    'text-red-400',
    'text-yellow-400',
    'text-green-400',
    'text-blue-400',
  ],
};