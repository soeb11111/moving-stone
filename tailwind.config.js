/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ember: '#e8702a',
        emberDark: '#d2611f',
      },
    },
  },
  plugins: [],
};
