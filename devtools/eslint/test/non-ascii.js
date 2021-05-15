'use strict';
/* eslint-disable rulesdir/non-ascii */

let RuleTester = require('eslint').RuleTester;
let tester = new RuleTester();

tester.run('non-ascii', require('../rule/non-ascii'), {
  valid: [
    { code: 'foo();' },
    { code: 'obj.foo();' },
    { code: '(function() {})();' },
    { code: '(() => 0)();', env: { es6: true } },
    { code: 'false();' },
    { code: 'null();' },
    { code: '100();' },
    { code: '"hello"();' },
    { code: '/abc/();' },
    { code: '[1,2,3]();' },
    { code: '({foo: 0})();' },
    {
      code: '`hello`();',
      env: { es6: true },
    },
    {
      code: '(class A {})();',
      env: { es6: true },
    },
  ],
  invalid: [
    {
      code: '//こんにちは',
      errors: ['Non-ASCII character "こんにちは" found.'],
    },
    {
      code: '/* 範囲コメント */',
      errors: ['Non-ASCII character "範囲コメント" found.'],
    },
    {
      code: '/* \n複数行\nコメント\n */',
      errors: ['Non-ASCII character "複数行" found.'],
    },
  ],
});
