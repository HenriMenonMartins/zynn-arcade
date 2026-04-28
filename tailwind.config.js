/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        zynn: {
          bg: '#070b14',
          card: '#10182a',
          edge: '#223153',
          accent: '#11d8ff',
          accent2: '#72ff8f',
          danger: '#ff5c77'
        }
      },
      boxShadow: {
        glow: '0 0 30px rgba(17, 216, 255, 0.25)'
      }
    }
  },
  plugins: []
};
