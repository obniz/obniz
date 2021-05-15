const path = require('path');
const rulesDirPlugin = require('eslint-plugin-rulesdir');
rulesDirPlugin.RULES_DIR = 'devtools/eslint/rule';

let tsRules = {
  'prettier/prettier': [
    'error',
    {
      singleQuote: true,
      trailingComma: 'es5',
    },
  ],
  'no-inner-declarations': 'warn',
  'no-constant-condition': [
    'error',
    {
      checkLoops: false,
    },
  ],
  'no-var': 'error',
  'rulesdir/non-ascii': [
    'error',
    {
      allowedChars: '°',
    },
  ],
  'rulesdir/async-function-name': ['error'],
  '@typescript-eslint/array-type': [
    'error',
    {
      default: 'array',
    },
  ],
  '@typescript-eslint/consistent-type-assertions': 'error',
  '@typescript-eslint/dot-notation': 'error',
  '@typescript-eslint/no-shadow': [
    'error',
    {
      hoist: 'all',
    },
  ],
  '@typescript-eslint/no-unused-expressions': 'error',
  '@typescript-eslint/restrict-plus-operands': 'warn',
  '@typescript-eslint/prefer-function-type': 'error',
  '@typescript-eslint/unified-signatures': 'error',
  eqeqeq: ['error', 'smart'],
  'jsdoc/check-alignment': 'error',
  'jsdoc/check-indentation': 'error',
  'jsdoc/newline-after-description': 'error',
  'max-classes-per-file': ['error', 1],
  'new-parens': 'error',
  'no-eval': 'error',
  'no-new-wrappers': 'error',
  'no-throw-literal': 'error',
  'no-trailing-spaces': 'error',
  'no-undef-init': 'error',
  'object-shorthand': 'error',
  'one-var': ['error', 'never'],
  'prefer-arrow/prefer-arrow-functions': 'error',
  'prefer-const': 'error',
  'spaced-comment': [
    'error',
    'always',
    {
      markers: ['/'],
    },
  ],
  // '@typescript-eslint/tslint/config': [
  //   'error',
  //   {
  //     rules: {
  //       prettier: [
  //         true,
  //         {
  //           trailingComma: 'all',
  //           arrowParens: 'always',
  //           quoteProps: 'consistent',
  //           printWidth: 120,
  //         },
  //       ],
  //     },
  //   },
  // ],
};
module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2017,
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
    'no-constant-condition': 'off',
    'no-inner-declarations': 'warn',
    'no-var': 'error',
    'rulesdir/non-ascii': [
      'error',
      {
        allowedChars: '°',
      },
    ],
    'rulesdir/async-function-name': ['error'],
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
      plugins: [
        'rulesdir',
        'eslint-plugin-jsdoc',
        'eslint-plugin-prefer-arrow',
        '@typescript-eslint',
      ],
      rules: tsRules,
    },
    {
      files: ['src/parts/Ble/**/*.ts'],
      rules: {
        '@typescript-eslint/no-empty-interface': 'off',
      },
    },
  ],
};
