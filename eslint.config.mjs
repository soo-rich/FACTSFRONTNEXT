import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends(
    'next/core-web-vitals',
    'next/typescript',
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ),
  {
    rules: {
      // ========== IMPORTS ==========
      // Ordre des imports
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
          pathGroups: [
            {
              pattern: '@/**',
              group: 'internal',
              position: 'before',
            },
          ],
        },
      ],
      // Pas d'imports non utilisés
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      // Préférer les imports nommés
      'import/prefer-default-export': 'off',

      // ========== CONSOLE & DEBUG ==========
      // Avertissement pour console.log
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      // Pas de debugger
      //"no-debugger": "error",
      // Pas d'alert
      //"no-alert": "error",

      // ========== CODE QUALITY ==========
      // Variables non utilisées
      'no-unused-vars': 'off', // Désactivé car on utilise la version TypeScript
      // Pas de var
      'no-var': 'error',
      // Préférer const
      'prefer-const': 'off',
      // Pas de code mort
      'no-unreachable': 'error',
      // Pas de conditions toujours vraies/fausses
      'no-constant-condition': 'off',

      // ========== REACT SPECIFIC ==========
      // Hooks rules
      'react-hooks/rules-of-hooks': 'warn',
      'react-hooks/exhaustive-deps': 'warn',
      // Pas de React dans le scope (Next.js)
      'react/react-in-jsx-scope': 'off',
      // Props validation (optionnel)
      'react/prop-types': 'off',

      // ========== TYPESCRIPT SPECIFIC ==========
      // Préférer les interfaces
      //"@typescript-eslint/consistent-type-definitions": ["error", "interface"],
      // Pas de any
      //"@typescript-eslint/no-explicit-any": "warn",
      // Pas de ts-ignore
      //"@typescript-eslint/ban-ts-comment": "warn",
      // Types de retour explicites pour les fonctions exportées
      //"@typescript-eslint/explicit-module-boundary-types": "off",

      // ========== FORMATTING ==========
      // Points-virgules
      semi: ['error', 'never'],
      // Guillemets
      quotes: ['error', 'double', { avoidEscape: true }],
      // Virgule trailing
      'comma-dangle': ['error', 'es5'],
      // Espaces
      'no-trailing-spaces': 'error',
      'no-multiple-empty-lines': ['error', { max: 2, maxEOF: 1 }],

      // ========== NEXT.JS SPECIFIC ==========
      // Pas de <img>, utiliser next/image
      '@next/next/no-img-element': 'error',
      // Pas de <a>, utiliser next/link
      '@next/next/no-html-link-for-pages': 'error',
    },
  },
  {
    // Configuration spécifique pour les fichiers de configuration
    files: ['*.config.js', '*.config.mjs', '*.config.ts'],
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-var-requires': 'off',
    },
  },
];

export default eslintConfig;
