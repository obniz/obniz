/**
 * @fileoverview Rule to async function name
 */

'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function (context) {
  function checkName(node, identifier = null) {
    if (!identifier) {
      identifier = node.id;
    }
    if (!node.async || !identifier) {
      return;
    }
    const functionName = identifier.name;
    if (!functionName) {
      return;
    }
    if (functionName.endsWith('wait') || functionName.endsWith('Wait')) {
      return;
    }
    context.report(
      node,
      {
        line: identifier.loc.start.line,
        column: identifier.loc.start.column,
      },
      `Async function name "${functionName}" without suffix "Wait" was found.`
    );
  }

  return {
    FunctionDeclaration: checkName,
    FunctionExpression: checkName,
    ArrowFunctionExpression: checkName,
    MethodDefinition: (node) => {
      checkName(node.value, node.key);
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
