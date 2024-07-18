// @ts-check

import eslint from '@eslint/js'
import tsEslint from 'typescript-eslint'

import globals from 'globals'

import eslintReact from 'eslint-plugin-react'
import eslintReactHooks from 'eslint-plugin-react-hooks'
import eslintTailwindcss from 'eslint-plugin-tailwindcss'

export default tsEslint.config(
  {
    ignores: ['**/dist/**', '**/.idea/**', '**/node_modules/**'],
  },
  eslint.configs.recommended,
  ...tsEslint.configs.strictTypeChecked,
  ...tsEslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    // plugins: { reactHooks, reactRefresh, tailwindcss },
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
        'functions': 'never',
      }],
      'space-before-blocks': ['warn'],
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
      '@typescript-eslint/no-unused-vars': 'off', // enforced by tsconfig
      '@typescript-eslint/prefer-readonly': ['warn'],
      '@typescript-eslint/switch-exhaustiveness-check': ['warn'],

      /* tailwind */
      // 'tailwindcss/no-custom-classname': 'off'
    },
  },
  {
    files: ['**/*.js', '**/*.mjs'],
    ...tsEslint.configs.disableTypeChecked,
  },
  {
    files: ['expert-ui/src/**/*.tsx'],
    plugins: {
      'react': eslintReact,
      'react-hooks': eslintReactHooks,
      'tailwindcss': eslintTailwindcss,
    },
    settings: {
      'react': {
        version: 'detect',
      },
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      ...eslintReact.configs.recommended.rules,
      ...eslintReactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 0,
      'react/jsx-uses-react': 0,
      ...eslintTailwindcss.configs.recommended.rules,
    },
  }
)
