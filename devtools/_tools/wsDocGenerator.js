'use strict';
let tv4 = require('tv4');
let fs = require('fs');
const ejs = require('ejs');
let through = require('through2');
let PluginError = require('gulp-util').PluginError;
let PLUGIN_NAME = 'wsDocGenerator';

module.exports = function(docfilePath, moduleName) {
  /**
   * @this {Transform}
   */
  let transform = function(file, encoding, callback) {
    if (file.isNull()) {
      this.push(file);
      return callback(null, file);
    }

    if (file.isStream()) {
      this.emit(
        'error',
        new PluginError(PLUGIN_NAME, 'Streams not supported!')
      );
      return callback();
    }
    if (file.isBuffer()) {
      let contents = String(file.contents);
      let output;
      try {
        output = convert(contents, docfilePath, moduleName);
      } catch (error) {
        this.emit('error', new PluginError(PLUGIN_NAME, error));
      }

      // console.log(moduleName);
      file.contents = Buffer.from(output);

      return callback(null, file);
    }

    this.push(file);
    callback();
  };

  return through.obj(transform);
};

let convert = function(str, docfilePath, moduleName) {
  let wsSchema;
  eval(str.substring(3)); //let wsSchema = [ [....} ]
  for (let schema of wsSchema) {
    tv4.addSchema(schema);
  }

  let docTemplate = fs.readFileSync(docfilePath, 'utf8');
  //
  // let list = [
  //   'ws',
  //   'system',
  //   'io',
  //   'ioAnimation',
  //   'ad',
  //   'pwm',
  //   'uart',
  //   'spi',
  //   'i2c',
  //   'logicAnalyzer',
  //   'measure',
  //   'display',
  //   'switch',
  //   'ble/central',
  //   'ble/peripheral',
  //   'message',
  //   'debug',
  // ];
  let md = [];

  let param = { formatter, conditions, jsonExample };
  param.defines = {};

  let moduleParams = { name: moduleName, methods: [] };
  for (let methodType of ['request', 'response']) {
    let groupUri = '/' + methodType + '/' + moduleName;
    let groupSchema = tv4.getSchema(groupUri);
    if (!groupSchema) continue;
    let commands = groupSchema.anyOf.map(elm => {
      return elm['$ref'];
    });

    let methodParams = {
      uri: groupUri,
      schema: groupSchema,
      method: methodType,
      commands: [],
    };
    for (let command of commands) {
      let schema = tv4.getSchema(command);
      let basePath = groupSchema.basePath;
      let name = command.split('/').pop();
      let commandParam = {
        uri: command,
        schema,
        name,
        params: requestParams(schema, basePath, param.defines),
      };
      methodParams.commands.push(commandParam);
    }
    moduleParams.methods.push(methodParams);
  }
  param.module = moduleParams;

  function sortOnKeys(dict) {
    let sorted = [];
    for (let key in dict) {
      sorted[sorted.length] = key;
    }
    sorted.sort();

    let tempDict = {};
    for (let i = 0; i < sorted.length; i++) {
      tempDict[sorted[i]] = dict[sorted[i]];
    }

    return tempDict;
  }

  param.defines = sortOnKeys(param.defines);

  md.push(ejs.render(docTemplate, param));

  return md.join('\n');
};

function formatter(obj) {
  let str = JSON.stringify(obj, null, 0);
  str = str.split(',').join(', ');
  return str;
}

function conditions(schema) {
  let results = [];

  if (schema.required) {
    results.push('required');
  } else if (schema.default) {
    results.push('default `' + schema.default + '`');
  }
  if (schema.enum) {
    if (schema.enum.length == 1) {
      results.push('const `' + formatter(schema.enum[0], true) + '`');
    } else {
      results.push(
        'enum <ul><li>' +
          schema.enum
            .map(elm => {
              return '`' + formatter(elm, true) + '`';
            })
            .join('</li><li>') +
          '</li></ul>'
      );
    }
  }
  if (schema.minimum !== undefined || schema.maximum !== undefined) {
    results.push(
      rangeString(
        schema.minimum,
        schema.maximum,
        'value',
        schema.exclusiveMinimum,
        schema.exclusiveMaximum
      )
    );
  }
  if (schema.multipleOf !== undefined) {
    results.push(' unit: ' + schema.multipleOf);
  }

  if (schema.minLength !== undefined || schema.maxLength !== undefined) {
    results.push(rangeString(schema.minLength, schema.maxLength, 'length'));
  }
  if (schema.minItems !== undefined || schema.maxItems !== undefined) {
    results.push(rangeString(schema.minItems, schema.maxItems, 'length'));
  }
  if (schema.items !== undefined) {
    results.push('items<br/>' + conditions(schema.items));
  }

  if (results.length == 0) return '&nbsp;';
  return '<ul><li>' + results.join('</li><li>') + '</li></ul>';
}

function rangeString(min, max, val, exclusiveMin, exclusiveMax) {
  if (min === max && min !== undefined && !exclusiveMin && !exclusiveMax) {
    return `${val} = ${min}`;
  }

  val = val || 'value';
  let left = '',
    right = '';
  if (min !== undefined) {
    left = min;
    if (exclusiveMin) {
      left += ' < ';
    } else {
      left += ' &le; ';
    }
  }

  if (max !== undefined) {
    if (exclusiveMax) {
      right += ' < ';
    } else {
      right += ' &le; ';
    }
    right += max;
  }
  return `${left}${val}${right}`;
}

function jsonExample(params, schema) {
  let jsonObj = {};
  let exampleRotate = {};
  if (schema.commandExample !== undefined) {
    if (Array.isArray(schema.commandExample)) {
      jsonObj = schema.commandExample[0];
    } else {
      jsonObj = schema.commandExample;
    }
  } else {
    for (let param of params) {
      let path = param.path;
      let value;
      if (param.schema.example !== undefined) {
        if (Array.isArray(value)) {
          value = param.schema.example[0];
        } else {
          value = param.schema.example;
        }
      } else if (param.example !== undefined) {
        if (Array.isArray(param.example)) {
          let index = exampleRotate[param.ref] || 0;
          exampleRotate[param.ref] = index + 1;
          value = param.example[index % param.example.length];
        } else {
          value = param.example;
        }
      } else if (param.schema.default !== undefined) {
        value = param.schema.default;
      } else if (param.default !== undefined) {
        value = param.default;
      } else if (param.schema.enum) {
        value = param.schema.enum[0];
      } else if (param.schema.type === 'boolean') {
        value = true;
      } else if (param.schema.type === 'null') {
        value = null;
      } else if (param.schema.type === undefined) {
        value = undefined;
      } else if (
        param.schema.type === 'integer' ||
        param.schema.type === 'number'
      ) {
        let min = param.schema.minimum || 0;
        let max = param.schema.maximum || 1000;
        let multipleOf = param.schema.multipleOf || 1;
        value = Math.floor((min + max) / 2 / multipleOf) * multipleOf;
        // }else if(param.schema.type === "string"){
        //
        //   value = "obniz";
      } else {
        throw Error(
          'patternProperties is not compatible for ' +
            path +
            ' type ' +
            param.schema.type
        );
      }

      let obj = jsonObj;
      let pathParts = path.split('.');
      for (let i = 0; i < pathParts.length; i++) {
        if (i === pathParts.length - 1) {
          if (pathParts[i].endsWith('[]')) {
            obj[pathParts[i].slice(0, -2)] =
              obj[pathParts[i].slice(0, -2)] || [];
            obj[pathParts[i].slice(0, -2)][0] = value;
          } else {
            obj[pathParts[i]] = value;
          }
        } else {
          if (pathParts[i].endsWith('[]')) {
            obj[pathParts[i].slice(0, -2)] = obj[pathParts[i].slice(0, -2)] || [
              {},
            ];
            obj = obj[pathParts[i].slice(0, -2)][0];
          } else {
            obj[pathParts[i]] = obj[pathParts[i]] || {};
            obj = obj[pathParts[i]];
          }
        }
      }
    }
  }

  let str = JSON.stringify([jsonObj], null, 4);
  let reg1 = /\n\s+(\d+,)$/gm;
  str = str.replace(reg1, (match, val) => {
    return val + ' ';
  });

  let reg2 = /\s*\n\s*(\d+)\n\s*]/gm;
  str = str.replace(reg2, (match, val) => {
    return ' ' + val + ']';
  });
  return str;
}

function requestParams(schema, base, needDefs) {
  let results = [];
  _checkSchema(schema, base, true, results, needDefs);
  return results;
}

function _checkSchema(schema, path, required, results, needDefs) {
  if (schema['$ref']) {
    schema.required = required;
    let row = {
      path: path,
      type: schema['$ref'].split('/').pop(),
      ref: schema['$ref'].split('/').pop(),
      schema: schema,
    };
    let ref = tv4.getSchema(schema['$ref']);
    if (ref) {
      needDefs[row.type] = ref;
      if (ref.example !== undefined) {
        row.example = ref.example;
      }
    }
    results.push(row);
    return;
  }

  if (
    schema.type === 'string' ||
    schema.type === 'integer' ||
    schema.type === 'boolean' ||
    schema.type === 'number' ||
    schema.type === 'null'
  ) {
    schema.required = required;
    let row = {
      path: path,
      type: schema.type,
      schema: schema,
    };
    results.push(row);
    return;
  }

  if (schema.type === 'array') {
    let required = schema.minItems > 0;
    _checkSchema(schema.items, path + '[]', required, results, needDefs);
    return;
  }

  if (schema.type === 'object') {
    for (let key in schema.properties) {
      let required = schema.required && schema.required.includes(key);
      _checkSchema(
        schema.properties[key],
        path + '.' + key,
        required,
        results,
        needDefs
      );
    }

    if (schema.patternProperties) {
      if (schema.patternExample) {
        let key = schema.patternExample;
        if (typeof key !== 'string') {
          key = key[0];
        }
        for (let pattern in schema.patternProperties) {
          if (new RegExp(pattern).test(key)) {
            _checkSchema(
              schema.patternProperties[pattern],
              path + '.' + key,
              false,
              results,
              needDefs
            );
            return;
          }
        }
      }

      throw Error('patternProperties is not compatible');
    }
    if (!schema.properties && !schema.patternProperties) {
      schema.required = required;
      let row = {
        path: path,
        type: 'object',
        schema: schema,
      };
      results.push(row);
    }
    return;
  }
  if (Array.isArray(schema.type)) {
    // let oneResult = [];
    // let oneSchema = Object.assign({},schema);
    // for(let type of schema.type){
    //   oneSchema.type = type;
    //   _checkSchema(oneSchema, path, false, oneResult, needDefs);
    // }
    let row = {
      path: path,
      type: schema.type,
      schema: schema,
    };
    results.push(row);
    return;
  }

  if (schema.type === undefined) {
    schema.required = required;
    let row = {
      path: path,
      type: 'anyType',
      schema: schema,
    };
    results.push(row);
    return;
  }

  throw Error('unknown json schema type');
}

//test
const gulp_yaml = require('gulp-yaml');
const gulp = require('gulp');
const concatWith = require('./concatWith');
const path = require('path');
const target = 'ble/security';
const schemaSrcPath = path.join(
  __dirname,
  '../json_schema/*/' + target + '/*.yml'
);
const baseSchemaSrcPath = path.join(__dirname, '../json_schema/index.yml');

gulp
  .src([schemaSrcPath, baseSchemaSrcPath])
  .pipe(gulp_yaml({ safe: true }))
  .pipe(
    concatWith('schema.md', {
      header: 'let wsSchema = [',
      separator: ',',
      footer: '];',
    })
  )
  .pipe(
    module.exports(path.resolve(__dirname, 'doctemplate/doc-one.ejs'), target)
  )
  .pipe(gulp.dest(__dirname));
