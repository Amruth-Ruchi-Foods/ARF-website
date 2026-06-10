/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          green: '#2E7D32',
          lightGreen: '#8BC34A',
          orange: '#FF9800',
        },
        neutral: {
          cream: '#F5F5F5',
          darkBg: '#0F172A',
        },
        accent: {
          glow: '#7CFFB2',
        },
      },
      fontFamily: {
        heading: ['Poppins', 'Montserrat', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        natural: ['Playfair Display', 'serif'],
      },
      screens: {
        mobile: '320px',
        tablet: '768px',
        desktop: '1024px',
        wide: '1440px',
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(-10px)' },
          '50%': { transform: 'translateY(10px)' },
        },
      },
    },
  },
  plugins: [],
};
