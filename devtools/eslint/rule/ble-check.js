/**
 * @fileoverview BLE implementation rule check
 */

'use strict';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = (context) => {
  const checkName = (node) => {
    const StaticProperties = {
      PartsName: 'public',
      AvailableBleMode: 'public',
      Address: 'protected',
      LocalName: 'protected',
      CompanyID: 'protected',
      CompanyID_ScanResponse: 'protected',
      BeaconDataStruct: 'protected',
      static: 'protected',
    };
    if (
      !node.superClass ||
      (node.superClass.name !== 'ObnizPartsBle' &&
        node.superClass.name !== 'ObnizPartsBleConnectable' &&
        node.superClass.name !== 'BaseIBS' &&
        node.superClass.name !== 'BaseIBS01')
    )
      return;
    const properties = node.body.body.filter((p) => p.type === 'ClassProperty');

    const dataType = node.superTypeParameters.params.find(
      (p) => p.type === 'TSTypeReference'
    );
    if (dataType.typeName.name !== `${node.id.name}_Data`)
      context.report(
        node,
        {
          line: dataType.loc.start.line,
          column: dataType.loc.start.column,
        },
        `The type of default data name must be named '${node.id.name}_Data'.`
      );

    properties
      .filter((p) => p.static || p.key.name === 'static')
      .forEach((p) => {
        if (!Object.keys(StaticProperties).includes(p.key.name)) {
          context.report(
            node,
            {
              line: p.key.loc.start.line,
              column: p.key.loc.start.column,
            },
            `'${p.key.name}' implementation is not permitted. Please remove 'static' to implement.`
          );
          return;
        }
        if (!p.readonly)
          context.report(
            node,
            {
              line: p.key.loc.start.line,
              column: p.key.loc.start.column,
            },
            `'${p.key.name}' must be readonly.`
          );
        if (StaticProperties[p.key.name] !== p.accessibility)
          context.report(
            node,
            {
              line: p.key.loc.start.line,
              column: p.key.loc.start.column,
            },
            `To implement '${p.key.name}' with ${StaticProperties[p.key.name]}`
          );
      });

    const partsName = properties.find((p) => p.key.name === 'PartsName');
    if (!partsName)
      context.report(
        node,
        {
          line: node.id.loc.start.line,
          column: node.id.loc.start.column,
        },
        `'PartsName' has not been implemented.`
      );
    else if (
      partsName.value.type !== 'Literal' ||
      partsName.value.value !== node.id.name
    )
      context.report(
        node,
        {
          line: partsName.key.loc.start.line,
          column: partsName.key.loc.start.column,
        },
        `'PartsName' must be the same as class name.`
      );

    const staticProp = properties.find((p) => p.key.name === 'static');
    if (!staticProp)
      context.report(
        node,
        {
          line: node.id.loc.start.line,
          column: node.id.loc.start.column,
        },
        `'static' has not been implemented.`
      );
    else if (staticProp.static)
      context.report(
        node,
        {
          line: staticProp.key.loc.start.line,
          column: staticProp.key.loc.start.column,
        },
        `'static' must be non-static. Please remove 'static' attribute.`
      );
    else if (
      staticProp.value.type !== 'TSAsExpression' ||
      staticProp.value.expression.name !== node.id.name ||
      staticProp.value.typeAnnotation.type !== 'TSTypeQuery'
    )
      context.report(
        node,
        {
          line: staticProp.key.loc.start.line,
          column: staticProp.key.loc.start.column,
        },
        `'static' must be the same instance as class name.\nexample: static = ${node.id.name} as typeof ObnizPartsBle`
      );
  };

  return {
    ClassDeclaration: checkName,
  };
};
