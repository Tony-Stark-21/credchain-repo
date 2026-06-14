/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        credchain: {
          primary: '#6d28d9',
          accent: '#10b981',
          dark: '#0f172a',
        },
      },
    },
  },
  plugins: [],
};
