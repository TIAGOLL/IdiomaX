const js = require('@eslint/js');
const globals = require('globals');
const tseslint = require('typescript-eslint');
const { globalIgnores } = require('eslint/config');
const unusedImports = require('eslint-plugin-unused-imports');

module.exports = tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'unused-imports': unusedImports,
    },
    rules: {
      // Aponta erro para imports não usados
      'unused-imports/no-unused-imports': 'warn',
      // Remove variáveis não usadas mas permite se começarem com "_"
      'unused-imports/no-unused-vars': [
        'warn',
        { vars: 'all', varsIgnorePattern: '^_', argsIgnorePattern: '^_' },
      ],
    },
  },
]);
