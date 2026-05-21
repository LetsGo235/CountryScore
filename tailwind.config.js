/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e8f4fb',
          100: '#d1e9f7',
          200: '#a3d3ef',
          300: '#75bde7',
          400: '#47a7df',
          500: '#1579b8', // Main blue
          600: '#0f5d8e',
          700: '#0b4569',
          800: '#072d44',
          900: '#04151f',
        },
        success: {
          50: '#e8f7ef',
          100: '#d1efdf',
          200: '#a3dfbf',
          300: '#75cf9f',
          400: '#47bf7f',
          500: '#28a86b', // Main green
          600: '#1f8656',
          700: '#166441',
          800: '#0e422b',
          900: '#052114',
        },
        navy: {
          50: '#e8edf0',
          100: '#c9dce7',
          200: '#93b9cf',
          300: '#5d96b7',
          400: '#27739f',
          500: '#0b2638', // Main navy
          600: '#091e2d',
          700: '#071722',
          800: '#050f17',
          900: '#02080c',
        },
        warning: {
          50: '#fff7ed',
          100: '#ffedd5',
          500: '#f97316',
          600: '#ea580c',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 8px rgba(11, 38, 56, 0.08)',
        'card-hover': '0 4px 16px rgba(11, 38, 56, 0.12)',
      },
      borderRadius: {
        'card': '8px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      }
    },
  },
  plugins: [],
}