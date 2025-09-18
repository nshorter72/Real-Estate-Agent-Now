module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,html}"
  ],
  // Keep a safelist so generated builds preserve commonly used color utilities
  safelist: [
    { pattern: /^(?:bg|text|border)-(?:[a-z]+)-(?:50|100|200|300|400|500|600|700|800|900)$/ },
    { pattern: /^hover:(?:bg|text|border)-(?:[a-z]+)-(?:50|100|200|300|400|500|600|700|800|900)$/ },
    { pattern: /^(?:bg|text|border)-(?:[a-z]+)$/ },
    { pattern: /^hover:(?:bg|text|border)-(?:[a-z]+)$/ }
  ],
  theme: {
    extend: {
      fontFamily: {
        // Use Playfair Display as the display/serif font for a corporate/print-forward look
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif']
      },
      colors: {
        // Corporate neutral palette
        primary: {
          DEFAULT: '#0f1724',
          50: '#f6f8fa',
          100: '#eef2f6',
          200: '#dbe3ee',
          300: '#b7c9da',
          400: '#8ea8c2',
          500: '#5f7f9f',
          600: '#3b5870',
          700: '#283d50',
          800: '#172534',
          900: '#0b1420'
        },
        accent: {
          DEFAULT: '#0ea5a4' // teal accent
        },
        surface: {
          DEFAULT: '#ffffff'
        }
      },
      boxShadow: {
        'corp-1': '0 6px 20px rgba(15,23,42,0.08)',
        'corp-2': '0 10px 30px rgba(15,23,42,0.12)'
      }
    }
  },
  plugins: []
};
