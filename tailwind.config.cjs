const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'body-bg': colors.gray['800'],
        'body-text': colors.blue['50'],
        'h-text': colors.blue['100'],
        'placeholder-text': colors.slate['400'],
        'primary-element': colors.sky['700'],
        'focus': colors.sky['700'],
        'element-bg': colors.gray['700'],
        'element-border': colors.gray['500'],
        'highlight-bg': colors.slate['500'],
      },
      container: { center: true },
    },
  },
  plugins: [],
}
