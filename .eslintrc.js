const path = require('path');
const rulesDirPlugin = require('eslint-plugin-rulesdir');
rulesDirPlugin.RULES_DIR = path.join(__dirname, 'devtools/eslint/rule');

module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2017,
    project: path.join(__dirname, 'tsconfig.debug.json'),
  },
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  plugins: ['rulesdir', 'eslint-plugin-jsdoc', 'eslint-plugin-prefer-arrow'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        trailingComma: 'es5',
      },
    ],
    'jsdoc/check-alignment': 'error',
    'jsdoc/check-indentation': 'error',
    'jsdoc/newline-after-description': 'error',
    'rulesdir/async-function-name': ['error'],
    'prefer-arrow/prefer-arrow-functions': 'error',
    eqeqeq: ['error', 'smart'],
    'max-classes-per-file': ['error', 1],
    'new-parens': 'error',
    'no-inner-declarations': 'warn',
    'no-constant-condition': [
      'error',
      {
        checkLoops: false,
      },
    ],
    'no-eval': 'error',
    'no-new-wrappers': 'error',
    'no-throw-literal': 'error',
    'no-trailing-spaces': 'error',
    'no-undef-init': 'error',
    'no-var': 'error',
    'object-shorthand': 'error',
    'one-var': ['error', 'never'],
    'prefer-const': 'error',
    'spaced-comment': [
      'error',
      'always',
      {
        markers: ['/'],
      },
    ],
  },
  overrides: [
    {
      files: ['**/*.ts'],
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
      ],
      parser: '@typescript-eslint/parser',

      parserOptions: {
        ecmaVersion: 2017,
        project: path.join(__dirname, 'tsconfig.eslint.json'),
        sourceType: 'module',
      },
      plugins: ['@typescript-eslint'],
      rules: {
        '@typescript-eslint/array-type': [
          'error',
          {
            default: 'array',
          },
        ],
        '@typescript-eslint/consistent-type-assertions': 'error',
        'dot-notation': 'off',
        '@typescript-eslint/dot-notation': 'error',
        'no-shadow': 'off',
        '@typescript-eslint/no-shadow': [
          'error',
          {
            hoist: 'all',
          },
        ],
        'no-unused-expressions': 'off',
        '@typescript-eslint/no-unused-expressions': 'error',
        '@typescript-eslint/unified-signatures': 'error',
      },
    },
  ],
};
