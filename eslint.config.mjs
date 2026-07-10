// @ts-check

import eslint from '@eslint/js'
import tsEslint from 'typescript-eslint'

import globals from 'globals'

import eslintReact from 'eslint-plugin-react'
import eslintReactHooks from 'eslint-plugin-react-hooks'
import eslintBetterTailwindcss from 'eslint-plugin-better-tailwindcss'

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
    },
  },
  {
    files: ['**/*.js', '**/*.mjs'],
    ...tsEslint.configs.disableTypeChecked,
  },
  {
    files: ['src/**/*.tsx'],
    plugins: {
      'react': eslintReact,
      'react-hooks': eslintReactHooks,
      'better-tailwindcss': eslintBetterTailwindcss,
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
      ...eslintReactHooks.configs['recommended-latest'].rules,
      'react/react-in-jsx-scope': 0,
      'react/jsx-uses-react': 0,
      'react/display-name': 0,
      ...eslintBetterTailwindcss.configs.recommended.rules,
      'better-tailwindcss/enforce-consistent-line-wrapping': 0,
    },
    settings: {
      'react': {
        version: '19.2', // instead of 'detect', cf. https://github.com/jsx-eslint/eslint-plugin-react/issues/3977#issuecomment-3945790562
      },
      'better-tailwindcss': {
        'entryPoint': './src/index.css',
        'callees': ['cns'],
      },
    },
  }
)
