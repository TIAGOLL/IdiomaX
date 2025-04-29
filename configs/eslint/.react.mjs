/** @type {import('eslint').Linter.FlatConfig[]} */

import eslintPluginReact from 'eslint-plugin-react';
import eslintPluginReactHooks from 'eslint-plugin-react-hooks';
import eslintPluginTypescript from '@typescript-eslint/eslint-plugin';
import eslintParser from '@typescript-eslint/parser';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import eslintPluginSimpleImportSort from 'eslint-plugin-simple-import-sort';
import eslintPluginUnusedImports from 'eslint-plugin-unused-imports';
import eslintPluginJsxA11y from 'eslint-plugin-jsx-a11y';

export default [
  {
    ignores: ['node_modules', 'dist', 'build'],
  },
  {
    files: ['**/*.{js,ts,jsx,tsx}'],
    languageOptions: {
      parser: eslintParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      'react': eslintPluginReact,
      'react-hooks': eslintPluginReactHooks,
      'simple-import-sort': eslintPluginSimpleImportSort,
      'unused-imports': eslintPluginUnusedImports,
      'jsx-a11y': eslintPluginJsxA11y,
      '@typescript-eslint': eslintPluginTypescript,
      'prettier': eslintPluginPrettier,
    },
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
  },
];
