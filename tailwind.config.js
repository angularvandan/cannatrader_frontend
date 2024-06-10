/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'Quicksand': ['Quicksand']
      }
    },
    colors: {
      'primary': '',
      'secondary': '#FFE175',
      'primary-btn': '#3A5C41'
    }
  },
  plugins: [],
}

