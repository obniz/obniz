/**
 * @fileoverview BLE implementation rule check
 */

'use strict';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = (context) => {
  const checkName = (node) => {
    const PropertiesSettings = {
      accessibility: 'protected',
      static: true,
      readonly: true,
      required: false,
    };
    /**
     * Need to describe all static properties.
     */
    const Properties = {
      PartsName: {
        accessibility: 'public',
        required: true,
      },
      AvailableBleMode: {
        accessibility: 'public',
        required: 'ObnizPartsBle',
      },
      Address: {},
      LocalName: {},
      BeaconDataLength: {},
      BeaconDataLength_ScanResponse: {},
      CompanyID: {},
      CompanyID_ScanResponse: {},
      BeaconDataStruct: {},
      static: {
        static: false,
        required: true,
      },
    };
    if (
      !node.superClass ||
      (node.superClass.name !== 'ObnizPartsBle' &&
        node.superClass.name !== 'ObnizPartsBleConnectable' &&
        node.superClass.name !== 'BaseiBS' &&
        node.superClass.name !== 'BaseiBS01')
    )
      return;
    const properties = node.body.body.filter((p) => p.type === 'ClassProperty');

    const dataTypeName = (index) =>
      [`${node.id.name}_Data`, `${node.id.name}_Connected_Data`][index];
    node.superTypeParameters.params.forEach((dataType, i) => {
      if (
        dataType.type !== 'TSTypeReference' ||
        dataType.typeName.name !== dataTypeName(i)
      )
        context.report(
          node,
          {
            line: dataType.loc.start.line,
            column: dataType.loc.start.column,
          },
          `The type of default data name must be named '${dataTypeName(i)}'.`
        );
    });

    properties
      .filter((p) => Properties[p.key.name])
      .forEach((p) => {
        const settings = Properties[p.key.name];
        Object.keys(PropertiesSettings).forEach((key) => {
          if (key === 'required') return;
          const val =
            settings[key] !== undefined
              ? settings[key]
              : PropertiesSettings[key];
          if (p[key] !== val) {
            context.report(
              node,
              {
                line: p.key.loc.start.line,
                column: p.key.loc.start.column,
              },
              key === 'accessibility'
                ? `To implement '${p.key.name}' with ${val}.`
                : `'${p.key.name}' must be ${val ? key : `no ${key}`}.`
            );
          }
        });
      });

    properties
      .filter((p) => p.static && !Properties[p.key.name])
      .forEach((p) =>
        context.report(
          node,
          {
            line: p.key.loc.start.line,
            column: p.key.loc.start.column,
          },
          `'${p.key.name}' implementation is not permitted. Please remove 'static' to implement.`
        )
      );
    Object.keys(Properties)
      .filter(
        (key) =>
          (Properties[key].required === true ||
            (node.superClass &&
              node.superClass.name.startsWith(Properties[key].required))) &&
          !properties.find((p) => p.key.name === key)
      )
      .forEach((key) => {
        context.report(
          node,
          {
            line: node.id.loc.start.line,
            column: node.id.loc.start.column,
          },
          `'${key}' has not been implemented.`
        );
      });

    const partsNameProp = properties.find((p) => p.key.name === 'PartsName');
    if (
      partsNameProp &&
      (partsNameProp.value.type !== 'Literal' ||
        partsNameProp.value.value !== node.id.name)
    )
      context.report(
        node,
        {
          line: partsNameProp.key.loc.start.line,
          column: partsNameProp.key.loc.start.column,
        },
        `'PartsName' must be the same as class name.`
      );

    const staticProp = properties.find((p) => p.key.name === 'static');
    if (
      staticProp &&
      (staticProp.value.type !== 'TSAsExpression' ||
        staticProp.value.expression.name !== node.id.name ||
        staticProp.value.typeAnnotation.type !== 'TSTypeQuery')
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
