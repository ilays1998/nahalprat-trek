/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'desert': {
          50: '#fdf8ef',
          100: '#faf0d7',
          200: '#f4dfad',
          300: '#ecc878',
          400: '#e3a842',
          500: '#db8b1e',
          600: '#c56f19',
          700: '#a45417',
          800: '#864419',
          900: '#6f3918',
        },
        'canyon': {
          50: '#f8f4f2',
          100: '#ede3dd',
          200: '#dbc9bd',
          300: '#c3a596',
          400: '#ab8170',
          500: '#966654',
          600: '#7f5149',
          700: '#68423d',
          800: '#563836',
          900: '#4a3130',
        }
      },
      fontFamily: {
        'display': ['Poppins', 'system-ui', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      boxShadow: {
        'warm': '0 10px 30px -5px rgba(219, 139, 30, 0.15)',
        'warm-lg': '0 20px 50px -10px rgba(219, 139, 30, 0.25)',
      },
      backgroundImage: {
        'desert-gradient': 'linear-gradient(135deg, #f4dfad 0%, #ecc878 25%, #db8b1e 50%, #c56f19 100%)',
        'sunset-gradient': 'linear-gradient(to bottom, #fdf8ef 0%, #faf0d7 25%, #f4dfad 50%, #ecc878 100%)',
      }
    },
  },
  plugins: [],
} 