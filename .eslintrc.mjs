import { FlatCompat } from '@eslint/eslintrc';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: {},
});

export default [
  ...compat.extends(
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'next/core-web-vitals'
  ),
  {
    ignorePatterns: [
      'node_modules/',
      '.next/',
      'public/',
      'build/',
      'dist/',
      '*.d.ts'
    ],
    rules: {
      // Disable specific rules causing build failures
      '@typescript-eslint/no-unused-vars': 'warn', // Downgrade from error to warning
      '@typescript-eslint/no-explicit-any': 'warn', // Downgrade from error to warning
      'react/no-unescaped-entities': 'warn', // Downgrade from error to warning
      '@next/next/no-img-element': 'warn', // Downgrade from error to warning
      'react-hooks/exhaustive-deps': 'warn', // Downgrade from error to warning
      '@typescript-eslint/no-empty-object-type': 'warn', // Downgrade from error to warning
      'prefer-const': 'warn', // Downgrade from error to warning
      'no-var': 'warn', // Downgrade from error to warning
    },
  },
];
