/** @type {import('eslint').Linter.Config} */
module.exports = {
  ignorePatterns: ['node_modules', 'dist', 'build'],
  env: {
    browser: true,
    es2021: true,
    jest: true,
  },
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'standard',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  plugins: [
    'simple-import-sort',
    'unused-imports',
    'react',
    'jsx-a11y',
    '@typescript-eslint',
    'prettier',
  ],
  rules: {
    'no-tabs': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'simple-import-sort/imports': 'error',
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
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'jsx-a11y/alt-text': [
      'warn',
      {
        elements: ['img'],
        img: ['Image'],
      },
    ],
    'jsx-a11y/aria-props': 'warn',
    'jsx-a11y/aria-proptypes': 'warn',
    'jsx-a11y/aria-unsupported-elements': 'warn',
    'jsx-a11y/role-has-required-aria-props': 'warn',
    'jsx-a11y/role-supports-aria-props': 'warn',
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
  settings: {
    react: {
      version: 'detect',
    },
  },
};
