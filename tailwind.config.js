/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'Quicksand': ['Quicksand'],
        'Poppins': ['Poppins']
      }
    },
    colors: {
      'primary': '#3A5C41',
      'secondary': '#FFE175',
      'primary-btn': '#3A5C41',
      'white': '#fff',
      'help': '#737373',
      'side': '#6D8924'
    },
    backgroundColor: {
      'primary': '#3A5C41',
      'secondary': '#FFE175',
      'white': '#fff',
      'side': '#6D8924',
      'nav-bg': "#D1DACF"
    },
  },
  plugins: [],
}

