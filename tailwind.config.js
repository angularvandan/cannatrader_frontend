/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'Quicksand': ['Quicksand'],
        'Poppins': ['Poppins'],
        'urbanist': ['Urbanist'],
      }
    },
    colors: {
      'primary': '#3A5C41',
      'secondary': '#FFE175',
      'primary-btn': '#3A5C41',
      'white': '#fff',
      'help': '#737373',
      'side': '#6D8924',
      'red': 'red',
      'inner': '#8D8D8D',
      ...require('tailwindcss/colors')
    },
    backgroundColor: {
      'primary': '#3A5C41',
      'secondary': '#FFE175',
      'white': '#fff',
      'side': '#6D8924',
      'nav-bg': "#D1DACF",
      'trashbg': '#0000000A',
      ...require('tailwindcss/colors')

    },
  },
  plugins: [],
}

