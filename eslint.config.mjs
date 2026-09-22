import { defineConfig } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-empty-object-type': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: false,
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^(_|ignore)',
        },
      ],
    },
  },
  {
    // The public site reads only the read model. It never touches the publisher or Payload.
    // This rule is the single-application version of Whitehall's separate content store.
    files: ['src/app/(public)/**/*.{ts,tsx}', 'src/content-store/**/*.{ts,tsx}', 'src/components/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            { name: 'payload', message: 'The public site must not import Payload. Read from src/content-store.' },
            { name: '@payload-config', message: 'The public site must not import the Payload config.' },
          ],
          patterns: [
            {
              group: ['@/publishing', '@/publishing/*', '**/publishing/*'],
              message: 'The public site must not import from the publisher.',
            },
          ],
        },
      ],
    },
  },
  {
    ignores: [
      '.next/',
      'src/payload-types.ts',
      'src/payload-generated-schema.ts',
      'src/app/(payload)/admin/importMap.js',
      '.reference/',
      'migrations/',
    ],
  },
])
