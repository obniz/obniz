const tv4 = require("tv4");


var fs = require('fs');
var path = require('path');
var yaml = require('js-yaml');
var glob = require("glob");


class obnizJsonValidator {

  constructor() {
    this.schemaBase = path.join(__dirname,"../json_schema/");
    this.readYamls(this.schemaBase);

  }

  get requestBaseSchema(){
    if(this._requestBaseSchema) return this._requestBaseSchema;
    return yaml.safeLoad(
          fs.readFileSync(path.resolve(__dirname, this._requestDirname + "index.yml"), 'utf8'),
          {schema: yaml.JSON_SCHEMA}
      );
  }
  get responseBaseSchema(){
    if(this._requestBaseSchema) return this._requestBaseSchema;
    return yaml.safeLoad(
          fs.readFileSync(path.resolve(__dirname, this._responseDirname + "index.yml"), 'utf8'),
          {schema: yaml.JSON_SCHEMA}
      );
  }
  
  readYamls(base_dir) {


    var pattern = path.join(base_dir, "**/*.yml");

    let files = glob.sync(pattern, {nodir: true});


    for (let file of files) {
      let schema = yaml.safeLoad(
          fs.readFileSync(file, 'utf8'),
          {schema: yaml.JSON_SCHEMA}
      );
      tv4.addSchema(schema);

    }

  }


  requestValidate(requestJson) {
    var schema = tv4.getSchema("/request");
    return tv4.validateMultiple(requestJson, schema);
  }

  responseValidate(requestJson) {
    var schema = tv4.getSchema("/response");
    return tv4.validateMultiple(requestJson, schema);

  }

};


module.exports = (new obnizJsonValidator());