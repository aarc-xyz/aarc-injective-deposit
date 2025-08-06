/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'injective': {
          // Primary colors
          'purple': '#4C3DFF',        // Primary purple
          'dark-purple': '#18214D',    // Dark purple
          'green': '#15B8A6',          // Green accent
          'dark-green': '#102736',     // Dark green
          
          // Grays and neutrals
          'white': '#FFFFFF',          // White
          'gray': '#8A8A8C',           // Gray
          'dark-gray': '#5C5C5E',      // Dark gray
          'gray-clickable': '#94A2B8', // Gray clickable
          'placeholder': '#64738B',    // Placeholder
          
          // Background colors
          'item-bg': '#0F1C2E',        // Item background
          'item-dark-bg': '#0F172A',   // Item dark background
          'border': '#1E293B',         // Border
          'page-bg': '#0B182B',        // Page background
          
          // Legacy mappings for backward compatibility
          'ocean': '#4C3DFF',          // Primary (using purple)
          'snow': '#FFFFFF',           // White
          'midnight': '#0B182B',       // Page background
          'sky': '#15B8A6',            // Green accent
          'light-blue': '#94A2B8',     // Gray clickable
          'bg': '#0B182B',             // Page background
          'primary': '#4C3DFF',        // Primary (using purple)
          'text': '#FFFFFF',           // White text
          'button-text': '#FFFFFF',    // Button text
          'border-light': '#1E293B',   // Border
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
      },
      boxShadow: {
        'injective': '0px 4px 20px rgba(76, 61, 255, 0.1)',
      },
      backgroundImage: {
        'grid-pattern': 'linear-gradient(to right, rgba(76, 61, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(76, 61, 255, 0.05) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid': '24px 24px',
      },
    },
  },
  plugins: [],
}