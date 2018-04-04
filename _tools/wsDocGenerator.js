'use strict';
var tv4 = require('tv4');
var fs = require('fs');
const ejs = require("ejs");
var through = require('through2');
var PluginError = require('gulp-util').PluginError;
const path = require('path');
var PLUGIN_NAME = 'wsDocGenerator';

module.exports = function() {
  /**
   * @this {Transform}
   */
  var transform = function(file, encoding, callback) {
    if (file.isNull()) {
      this.push(file);
      return callback(null, file);
    }

    if (file.isStream()) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'Streams not supported!'));
      return callback();
    }

    // プラグインの処理本体
    if (file.isBuffer()) {
      // ファイルの内容をcontentsに読み込み
      var contents = String(file.contents);
      let output;
      try {
        output = convert(contents);
      }catch(error){
        this.emit('error', new PluginError(PLUGIN_NAME, error));
      }

      // 編集した内容を出力
      file.contents = new Buffer(output);

      // 処理の完了を通知
      return callback(null, file);
    }

    this.push(file);
    callback();
  };


  return through.obj(transform);
};

var convert = function(str){
  let wsSchema;
  eval(str.substring(3)); //let wsSchema = [ [....} ]
  for(let schema of wsSchema){
    tv4.addSchema(schema);
  }
  let uris = tv4.getSchemaUris(/^\/request|^\/response/);

  var docTemplate = fs.readFileSync( path.resolve(__dirname, "doctemplate/doc.ejs"),'utf8');

  let isDirectory = function(uri){
    let targetUris = uris.filter((elm)=>{return elm.startsWith(uri + "/")});
    return targetUris.length > 0;
  };

  let list = [
    "ws",
    "system",
    "io",
    "ioAnimation",
    "ad",
    "pwm",
    "uart",
    "spi",
    "i2c",
    "logicAnalyzer",
    "measure",
    "display",
    "switch",
    "ble/central",
    "ble/peripheral"
  ];
  let md = [];

  var param = {moduleNames:list, formatter,conditions,jsonExample};
  param.modules = [];
  param.defines = {};

  for (let module of list){
    let moduleParams = {name: module, methods:[]};
    for (let methodType  of ["request", "response"]) {
      let groupUri = "/"+methodType + "/"+module;
      let groupSchema  = tv4.getSchema(groupUri);
      if(!groupSchema)continue;
      let commands = groupSchema.anyOf.map((elm)=>{
        return elm["$ref"]
      });

      let methodParams =  {uri: groupUri, schema:groupSchema, method: methodType, commands:[]};
      for (let command of commands) {
          let schema = tv4.getSchema(command);
          let basePath = groupSchema.basePath;
          let name =  command.split("/").pop();
          let commandParam = {uri: command, schema,name,  params: requestParams(schema, basePath, param.defines )};
          methodParams.commands.push(commandParam);
      }
      moduleParams.methods.push( methodParams ) ;

    }
    param.modules.push(moduleParams);
  }

  function sortOnKeys(dict) {

    var sorted = [];
    for(var key in dict) {
      sorted[sorted.length] = key;
    }
    sorted.sort();

    var tempDict = {};
    for(var i = 0; i < sorted.length; i++) {
      tempDict[sorted[i]] = dict[sorted[i]];
    }

    return tempDict;
  }

  param.defines =  sortOnKeys(param.defines);

  md.push(ejs.render(docTemplate, param));


  return md.join("\n");
};

function formatter(obj){
  let str = JSON.stringify(obj,null, 0);
  str = str.split(",").join(", ");
  return str;
}

function conditions(schema){
  let results = [];

  if(schema.required){
    results.push("required");
  }else if(schema.default){
    results.push("default `" + schema.default + "`");
  }
  if(schema.enum){
    if(schema.enum.length == 1){
      results.push("const `" + formatter(schema.enum[0], true) + "`");
    }else{
      results.push("enum <ul><li>" + schema.enum.map((elm)=> {return "`"+formatter(elm, true)+"`"}).join("</li><li>") + "</li></ul>");
    }
  }
  if(schema.minimum !== undefined || schema.maximum !== undefined){
    results.push(rangeString(schema.minimum,schema.maximum,"value",schema.exclusiveMinimum,schema.exclusiveMaximum));
  }
  if(schema.multipleOf !== undefined){
    results.push(" unit: " + schema.multipleOf );
  }

  if(schema.minLength !== undefined || schema.maxLength !== undefined){
    results.push(rangeString(schema.minLength,schema.maxLength,"length"));
  }
  if(schema.minItems !== undefined || schema.maxItems !== undefined){
    results.push(rangeString(schema.minItems,schema.maxItems,"length"));
  }
  if(schema.items !== undefined){
    results.push("items<br/>" + conditions(schema.items))
  }


  if(results.length == 0 )return "";
  return "<ul><li>" + results.join("</li><li>") + "</li></ul>";
}

function rangeString(min, max, val, exclusiveMin, exclusiveMax) {
  if(min === max && min !== undefined && !exclusiveMin && !exclusiveMax){
    return (`${val} = ${min}`);
  }

  val = val || "value";
  let left = "", right = "", last = "";
  if (min !== undefined) {
    left = min;
    if (exclusiveMin) {
      left += " < "
    } else {
      left += " &le; "
    }
  }

  if (max !== undefined) {
    if (exclusiveMax) {
      right += " < "
    } else {
      right += " &le; "
    }
    right += max;
  }
  return (`${left}${val}${right}`);
}

function jsonExample(params,schema) {
  let jsonObj = {};
  let exampleRotate = {};
  if(schema.commandExample !== undefined){
    if (Array.isArray(schema.commandExample )) {
      jsonObj = schema.commandExample[0];
    }else{
      jsonObj = schema.commandExample;
    }
  }else{

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
    } else if (param.schema.type === "boolean") {
      value = true;
    } else if (param.schema.type === "null") {
      value = null;
    } else if (param.schema.type === "integer" || param.schema.type === "number") {
      let min = param.schema.minimum || 0;
      let max = param.schema.maximum || 1000;
      let multipleOf = param.schema.multipleOf || 1;
      value = Math.floor((min + max) / 2 / multipleOf) * multipleOf;
      // }else if(param.schema.type === "string"){
      //
      //   value = "obniz";

    } else {
      throw Error("patternProperties 未対応");
    }

    let obj = jsonObj;
    let pathParts = path.split(".");
    for (let i = 0; i < pathParts.length; i++) {

      if (i === pathParts.length - 1) {
        if (pathParts[i].endsWith("[]")) {
          obj[pathParts[i].slice(0, -2)] = obj[pathParts[i].slice(0, -2)] || [];
          obj[pathParts[i].slice(0, -2)][0] = value;

        } else {
          obj[pathParts[i]] = value;
        }
      } else {

        if (pathParts[i].endsWith("[]")) {
          obj[pathParts[i].slice(0, -2)] = obj[pathParts[i].slice(0, -2)] || [{}];
          obj = obj[pathParts[i].slice(0, -2)][0];
        } else {
          obj[pathParts[i]] = obj[pathParts[i]] || {};
          obj = obj[pathParts[i]];
        }
      }
    }
  }
}

  let str =  JSON.stringify(jsonObj,null ,4);
  let reg1 = /\n\s+(\d+,)$/gm;
  str = str.replace(reg1, (match,val) =>{
    return val + " ";
  });

  let reg2 = /\s*\n\s*(\d+)\n\s*]/gm;
  str = str.replace(reg2, (match,val) =>{
    return " " + val + "]";
  });
  return str;

  return JSON.stringify(jsonObj,function(k,v){
    if(v instanceof Array)
      return JSON.stringify(v);
    return v;
  },4).split(",").join(", ");

}

function requestParams(schema, base, needDefs){
  let results = [];
  _checkSchema(schema, base, true, results,needDefs);
  return results;

}

function _checkSchema(schema, path, required, results, needDefs){

  if(schema["$ref"]){
    schema.required = required;
    let row = {
      path : path,
      type : schema["$ref"].split("/").pop(),
      ref : schema["$ref"].split("/").pop(),
      schema : schema,
    };
    let ref = tv4.getSchema(schema["$ref"]);
    if (ref) {
      needDefs[row.type] = ref;
      if (ref.example !== undefined) {
        row.example = ref.example;
      }
    }
    results.push(row);
    return;
  }

  if(schema.type === "string"
      || schema.type === "integer"
      || schema.type === "boolean"
      || schema.type === "number"
      || schema.type === "null"){

    schema.required = required;
    let row = {
      path : path,
      type : schema.type,
      schema : schema,
    };
    results.push(row);
    return;

  }

  if(schema.type === "array"){
    let required = schema.minItems > 0;
    _checkSchema( schema.items, path + "[]", required, results,needDefs);
    return;
  }

  if(schema.type === "object"){
    for( let key in schema.properties){
      let required = schema.required && schema.required.includes(key);
      _checkSchema(schema.properties[key], path + "." + key,required, results ,needDefs );
    }

    if(schema.patternProperties){
      if(schema.patternExample){
        let key = schema.patternExample;
        if(typeof key !== "string"){key = key[0];}
        for(let pattern in schema.patternProperties){
          if(new RegExp(pattern).test(key)){
            _checkSchema(schema.patternProperties[pattern], path + "." + key, false, results, needDefs);
            return;
          }
        }
      }

      throw Error("patternProperties 未対応");
    }
    if(!schema.properties && !schema.patternProperties){
      schema.required = required;
      let row = {
        path : path,
        type : "object",
        schema : schema,
      };
      results.push(row);
    }
    return;
  }

  throw Error("unknown json schema type");
}


//
//
// //test
// const gulp_yaml = require("gulp-yaml");
// const gulp = require("gulp");
// const concatWith = require("./concatWith");
// const schemaSrcPath = path.join(__dirname, '../json_schema/**/*.yml');
// gulp.src(schemaSrcPath)
//     .pipe(gulp_yaml({ safe: true }))
//     .pipe(concatWith("schema.md",{header:"let wsSchema = [", separator:",", footer:"];" }))
//     .pipe(module.exports())
//     .pipe(gulp.dest(__dirname));