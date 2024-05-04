// @ts-check

/** @type {import('postcss-load-config').Config} */
export default function (ctx) {
  return {
    plugins: ctx.env === 'test' ? {} : {
      tailwindcss: {},
      'tailwindcss/nesting': {},
      autoprefixer: {},
    },
  }
}
