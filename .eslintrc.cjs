module.exports = {
  root: true,
  env: { node: true, browser: true, es2023: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/strict-type-checked',
    'plugin:@typescript-eslint/stylistic-type-checked',
    'plugin:jsx-a11y/recommended',
    'plugin:tailwindcss/recommended'
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs', '*.config.ts'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.json'],
    ecmaFeatures: { jsx: true },
  },
  plugins: ['react-refresh', 'jsx-a11y'],
  rules: {
    /* formatting */
    indent: ['warn', 2, { 'SwitchCase': 1 }],
    quotes: ['warn', 'single'],
    semi: ['warn', 'never'],
    'comma-dangle': ['warn', {
      'arrays': 'always-multiline',
      'objects': 'always-multiline',
      'imports': 'only-multiline',
      'exports': 'only-multiline',
      'functions': 'never'
    }],
    'space-unary-ops': ['warn'],
    'consistent-return': ['warn'],
    'eol-last': ['warn'],
    'no-else-return': ['warn'],
    'no-empty-function': ['warn'],
    'no-multiple-empty-lines': ['warn', { max: 1 }],
    'no-trailing-spaces': ['warn'],
    'object-curly-spacing': ['warn', 'always'],

    /* typescript */
    '@typescript-eslint/consistent-type-definitions': 'off',
    '@typescript-eslint/no-confusing-void-expression': ['error', { ignoreArrowShorthand: true }],
    '@typescript-eslint/prefer-readonly': ['warn'],
    '@typescript-eslint/space-before-blocks': ['error'],
    '@typescript-eslint/switch-exhaustiveness-check': ['warn'],
    '@typescript-eslint/type-annotation-spacing': ['error', {
      before: false,
      after: true,
      overrides: { arrow: { before: true, after: true } },
    }],

    /* react */
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],

    /* tailwind */
    'tailwindcss/no-custom-classname': 'off'
  },
}
