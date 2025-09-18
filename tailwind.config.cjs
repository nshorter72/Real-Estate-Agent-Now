module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,html}"
  ],
  // Safelist broad patterns so Tailwind doesn't purge utilities used in templates or generated strings
  safelist: [
    // common utility groups with color scales (e.g. bg-blue-600, text-red-800, border-yellow-200)
    { pattern: /^(?:bg|text|border)-(?:[a-z]+)-(?:50|100|200|300|400|500|600|700|800|900)$/ },
    // hover variants like hover:bg-blue-700
    { pattern: /^hover:(?:bg|text|border)-(?:[a-z]+)-(?:50|100|200|300|400|500|600|700|800|900)$/ },
    // simple utilities without scale (if any)
    { pattern: /^(?:bg|text|border)-(?:[a-z]+)$/ },
    { pattern: /^hover:(?:bg|text|border)-(?:[a-z]+)$/ }
  ],
  theme: {
    extend: {}
  },
  plugins: []
};
