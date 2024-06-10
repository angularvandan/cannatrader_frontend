/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'Quicksand': ['Quicksand'],
        'Poppins':['Poppins']
      }
    },
    colors: {
      'primary': '#3A5C41',
      'secondary': '#FFE175',
      'primary-btn': '#3A5C41'
    },
    backgroundColor:{
      'primary':'#3A5C41',
      'secondary':'#FFE175'
    }
  },
  plugins: [],
}

