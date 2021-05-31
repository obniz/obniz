/**
 * @fileoverview Rule to forbid writing non-ASCII characters.
 */

'use strict';

/**
 * ASCII characters.
 */

const ASCII_REGEXP = new RegExp('([^\x00-\x7F]+)', 'g'); // eslint-disable-line no-control-regex

/**
 * Allowed types of token for non-ASCII characters.
 */
const ALLOWED_TOKENS = []; // ['RegularExpression', 'String'];

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = (context) => {
  const configuration = context.options[0] || {};
  const allowedChars = configuration.allowedChars || '';
  const allowedCharsRegExp = new RegExp('[' + allowedChars + ']+', 'g');

  const check = (token) => {
    const errors = [];

    if (ALLOWED_TOKENS.indexOf(token.type) !== -1) {
      return;
    }
    const value = token.value;
    const matches = value.replace(allowedCharsRegExp, '').match(ASCII_REGEXP);
    if (matches) {
      errors.push({
        line: token.loc.start.line,
        column: token.loc.start.column + value.indexOf(matches[0]),
        char: matches[0],
      });
    }
    return errors;
  };

  return {
    Program: (node) => {
      const errors = [];

      const sourceCode = context.getSourceCode();
      const tokens = sourceCode.getTokens(node);
      tokens.forEach((token) => {
        const results = check(token);
        errors.push(...results);
      });

      if (ALLOWED_TOKENS.indexOf('Comment') === -1) {
        const tokens = sourceCode.getAllComments();
        tokens.forEach((token) => {
          const results = check(token);
          errors.push(...results);
        });
      }

      errors.forEach((error) => {
        context.report(
          node,
          {
            line: error.line,
            column: error.column,
          },
          'Non-ASCII character "' + error.char + '" found.'
        );
      });
    },
  };
};

module.exports.schema = [
  {
    type: 'object',
    properties: {
      allowedChars: {
        type: 'string',
      },
    },
    additionalProperties: false,
  },
];
