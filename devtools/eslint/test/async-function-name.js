'use strict';
/* eslint-disable non-ascii */

const RuleTester = require('eslint').RuleTester;
const tester = new RuleTester();

tester.run('async-function-name', require('../rule/async-function-name'), {
  valid: [
    {
      code: 'function foo(){}',
      parserOptions: {
        ecmaVersion: 2017,
      },
    },
    {
      code: '(async () => 0)();',
      parserOptions: {
        ecmaVersion: 2017,
      },
    },
    {
      code: '(() => 0)();',
      parserOptions: {
        ecmaVersion: 2017,
      },
    },
    {
      code: 'function aaa( ){ }',
      parserOptions: {
        ecmaVersion: 2017,
      },
    },
    {
      code: 'function aaaWait( ){ }',
      parserOptions: {
        ecmaVersion: 2017,
      },
    },
    {
      code: 'async function aaaWait( ){ }',
      parserOptions: {
        ecmaVersion: 2017,
      },
    },
    {
      code: 'class A { test(){} }',
      parserOptions: {
        ecmaVersion: 2017,
      },
    },
    {
      code: 'class A { async testWait(){} }',
      parserOptions: {
        ecmaVersion: 2017,
      },
    },
  ],
  invalid: [
    {
      code: 'async function foo(){}',
      parserOptions: {
        ecmaVersion: 2017,
      },
      errors: ['Async function name "foo" without suffix "Wait" was found.'],
    },
    {
      code: 'async function aaa( ){ }',
      parserOptions: {
        ecmaVersion: 2017,
      },
      errors: ['Async function name "aaa" without suffix "Wait" was found.'],
    },
    {
      code: 'class A { async test(){} }',
      parserOptions: {
        ecmaVersion: 2017,
      },
      errors: ['Async function name "test" without suffix "Wait" was found.'],
    },
  ],
});
