 var Validator = require('jsonschema').Validator;
 var fs = require('fs');
 var path = require('path'); 
 var yaml = require('js-yaml');
 var glob = require("glob")


class obnizJsonValidator {
  
    constructor(){
    this._requestDirname = "./json_schema/request/";
    this._responseDirname = "./json_schema/response/";
    this._requestValidator = null;
    this._responseValidator = null;
    }
 
 
  
  get requestValidator(){
    if(this._requestValidator) return this._requestValidator;
   this._requestValidator =  this.readYamls(new Validator(), path.resolve(__dirname, this._requestDirname));
    return this._requestValidator;
  }
  
  get responseValidator(){
    if(this._responseValidator) return this._responseValidator;
    this._responseValidator =  this.readYamls(new Validator(),path.resolve(__dirname, this._responseDirname));
    return this._responseValidator;
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
  
  readYamls(validator, base_dir) {

    var file_list = fs.readdirSync(base_dir);

    var pattern = path.join( base_dir , "**/*.yml");
    let files = glob.sync(pattern,{nodir:true});


    for( let file of files ){
      let schema = yaml.safeLoad(
          fs.readFileSync(file, 'utf8'),
          {schema: yaml.JSON_SCHEMA}
      );
      validator.addSchema(schema);

    }

    return validator;
  
  }
  
  
    requestValidate(requestJson){
      var validator = this.requestValidator;
     
      return validator.validate(requestJson,this.requestBaseSchema, {nestedErrors : true});
    } 
    
    responseValidate(requestJson){
      var validator = this.responseValidator;
      return validator.validate(requestJson,this.responseBaseSchema, {nestedErrors : true});
      
    }
    
};



module.exports = (new obnizJsonValidator());