/**
 * @fileoverview Parts name check
 */

'use strict';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = (context) => {
  const check = (node) => {
    const properties = node.body.body.filter((p) => p.type === 'ClassProperty');
    const partsName = properties.find((p) => p.key.name === 'PartsName');
    if (!partsName) return;

    if (
      partsName &&
      (partsName.value.type !== 'Literal' ||
        partsName.value.value !== node.id.name)
    )
      context.report(
        node,
        {
          line: partsName.key.loc.start.line,
          column: partsName.key.loc.start.column,
        },
        `'PartsName' should be the same as class name.`
      );
  };

  return {
    ClassDeclaration: check,
  };
};
