/** @type {import('eslint').Linter.Config} */

module.exports = {
  ignores: ['node_modules', 'dist', 'build'],
  extends: ['standard', 'plugin:@typescript-eslint/recommended', 'prettier'],
  plugins: ['simple-import-sort', 'unused-imports', '@typescript-eslint', 'prettier'],
  rules: {
    'simple-import-sort/imports': 'error',
    '@typescript-eslint/no-unused-vars': 'off',
    'simple-import-sort/exports': 'error',
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
        singleQuote: true,
        trailingComma: 'all',
        semi: true,
        printWidth: 100,
        plugins: ['prettier-plugin-tailwindcss'],
        tabWidth: 2,
        quoteProps: 'as-needed',
        jsxSingleQuote: true,
        bracketSpacing: true,
        bracketSameLine: true,
        arrowParens: 'always',
        singleAttributePerLine: false,
        requirePragma: false,
      },
      {
        usePrettierrc: false,
      },
    ],
  },
};
