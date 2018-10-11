/**
 * @fileoverview Rule to forbid writing non-ASCII characters.
 * @author amagitakayosi
 */

'use strict';

/**
 * ASCII characters.
 */

let ASCII_REGEXP = new RegExp('([^\x00-\x7F]+)', 'g'); // eslint-disable-line no-control-regex

/**
 * Allowed types of token for non-ASCII characters.
 */
let ALLOWED_TOKENS = []; //['RegularExpression', 'String'];

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {
  let configuration = context.options[0] || {};
  let allowedChars = configuration.allowedChars || '';
  let allowedCharsRegExp = new RegExp('[' + allowedChars + ']+', 'g');

  function check(token) {
    let errors = [];

    if (ALLOWED_TOKENS.indexOf(token.type) !== -1) {
      return;
    }
    let value = token.value;
    let matches = value.replace(allowedCharsRegExp, '').match(ASCII_REGEXP);
    if (matches) {
      errors.push({
        line: token.loc.start.line,
        column: token.loc.start.column + value.indexOf(matches[0]),
        char: matches[0],
      });
    }
    return errors;
  }

  return {
    Program: function checkForForbiddenCharacters(node) {
      let errors = [];

      let sourceCode = context.getSourceCode();
      let tokens = sourceCode.getTokens(node);
      tokens.forEach(function(token) {
        let results = check(token);
        errors.push(...results);
      });

      if (ALLOWED_TOKENS.indexOf('Comment') === -1) {
        let tokens = sourceCode.getAllComments();
        tokens.forEach(function(token) {
          let results = check(token);
          errors.push(...results);
        });
      }

      errors.forEach(function(error) {
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
