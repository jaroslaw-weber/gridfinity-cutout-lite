import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import globals from 'globals'

export default [
  {
    ignores: ['node_modules/**', 'dist/**', '.astro/**', '.git/**']
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: globals.browser
    }
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      'max-lines': ['error', { max: 200 }]
    }
  }
]