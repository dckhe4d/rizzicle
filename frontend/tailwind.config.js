/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ice-blue': '#00CFFD',
        'electric-purple': '#7D2AE8',
        'jet-black': '#1A1A1A',
      },
      fontFamily: {
        'orbitron': ['Orbitron', 'monospace'],
        'inter': ['Inter', 'sans-serif'],
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #00CFFD, 0 0 10px #00CFFD, 0 0 15px #00CFFD' },
          '100%': { boxShadow: '0 0 10px #00CFFD, 0 0 20px #00CFFD, 0 0 30px #00CFFD' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        'pulse-glow': {
          '0%, 100%': { opacity: 1, boxShadow: '0 0 20px rgba(0, 207, 253, 0.5)' },
          '50%': { opacity: 0.8, boxShadow: '0 0 40px rgba(0, 207, 253, 0.8)' }
        }
      }
    },
  },
  plugins: [],
}