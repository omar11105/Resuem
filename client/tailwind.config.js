import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    path.join(__dirname, 'index.html'),
    path.join(__dirname, 'src/**/*.{js,jsx}'),
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        polished: {
          50: '#f8f7f4',
          100: '#efece6',
          200: '#ddd6c8',
          300: '#c4b9a4',
          400: '#a8997d',
          500: '#8f7d62',
          600: '#73644e',
          700: '#5c5040',
          800: '#4d4336',
          900: '#423b31',
          950: '#231f19',
        },
      },
    },
  },
  plugins: [],
};
