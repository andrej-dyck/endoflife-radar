/** @type {import('postcss-load-config').Config} */
module.exports = (ctx) => ({
  plugins: ctx.env === 'test' ? {} : {
    tailwindcss: {},
    'tailwindcss/nesting': {},
    autoprefixer: {},
  },
})
