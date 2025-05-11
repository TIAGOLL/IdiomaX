import library from '@idiomax/eslint/library';
import eslintPluginTypescript from '@typescript-eslint/eslint-plugin';
import eslintParser from '@typescript-eslint/parser';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import eslintPluginSimpleImportSort from 'eslint-plugin-simple-import-sort';
import eslintPluginUnusedImports from 'eslint-plugin-unused-imports';

/**  @type {import("eslint").Linter.Config[]} */

export default [
  ...library,
  {
    files: ['**/*.d.ts'],
    languageOptions: {
      parser: eslintParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      'unused-imports/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'off',
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
    plugins: {
      'simple-import-sort': eslintPluginSimpleImportSort,
      '@typescript-eslint': eslintPluginTypescript,
      prettier: eslintPluginPrettier,
      'unused-imports': eslintPluginUnusedImports,
    },
  },
];
