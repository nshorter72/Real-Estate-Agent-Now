module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,html}"
  ],
  safelist: [
    { pattern: /^(?:bg|text|border)-(?:[a-z]+)-(?:50|100|200|300|400|500|600|700|800|900)$/ },
    { pattern: /^hover:(?:bg|text|border)-(?:[a-z]+)-(?:50|100|200|300|400|500|600|700|800|900)$/ },
    { pattern: /^(?:bg|text|border)-(?:[a-z]+)$/ },
    { pattern: /^hover:(?:bg|text|border)-(?:[a-z]+)$/ }
  ],
  theme: {
    extend: {
      fontFamily: {
        // Use Inter as the primary UI font for a modern corporate look
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial']
      },
      colors: {
        primary: {
          DEFAULT: '#0f1724', // deep neutral for text
        },
        teal: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a'
        },
        surface: {
          DEFAULT: '#ffffff'
        }
      },
      boxShadow: {
        'card-sm': '0 6px 18px rgba(15,23,42,0.08)',
        'card-md': '0 12px 30px rgba(15,23,42,0.12)',
        'lift': '0 18px 40px rgba(15,23,42,0.14)'
      },
      keyframes: {
        lift: {
          '0%': { transform: 'translateY(0px)', boxShadow: '0 6px 18px rgba(15,23,42,0.06)' },
          '100%': { transform: 'translateY(-6px)', boxShadow: '0 18px 40px rgba(15,23,42,0.12)' }
        },
        fadein: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      },
      animation: {
        lift: 'lift 220ms ease',
        fadein: 'fadein 220ms ease'
      }
    }
  },
  plugins: []
};
