let isNode = (typeof window === 'undefined');

class ObnizUtil {

  constructor(obniz) {
    this.obniz = obniz;
  }

  createCanvasContext(width, height) {
    if (this.obniz.isNode) {
      try {
        const { createCanvas } = require('canvas');
        return createCanvas(this.width, this.height); 
      } catch(e) {
        throw new Error('obniz.js require node-canvas to draw rich contents. see more detail on docs');
      }
    } else {
      var canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      canvas.style["-webkit-font-smoothing"] = "none";
      var body = document.getElementsByTagName("body")[0];
      body.appendChild(canvas);
      
      var ctx = canvas.getContext("2d");
      return ctx;
    } 
  }
  
  static _keyFilter(params,keys){
    var filterdParams = {};
    if(typeof params !== "object" ){
      return filterdParams;
    }
    filterdParams =  Object.keys(params)
    .filter(key => keys.includes(key))
    .reduce((obj, key) => {
      obj[key] = params[key];
      return obj;
    }, {});
    
    return filterdParams;
  }
  
  /**
   *
   * @return {String} key name of not found. 
   */
  static _requiredKeys(params, keys){
    if(typeof params !== "object" ){
      return keys[0];
    }
    
    for( var index in keys){
        if(!(keys[index] in params )){
            return keys[index];
        }
    }
    return null;
  }
  
  static dataArray2string(data) {
    var string = null;
    try {
        if(isNode){
          const StringDecoder = require('string_decoder').StringDecoder;
          if(StringDecoder){
             string = new StringDecoder('utf8').write(Buffer.from(data));
          }
        }else if(TextDecoder){
          string = new TextDecoder("utf-8").decode(new Uint8Array(data));
        }
      }catch(e) {
        //this.obniz.error(e);
      }
      return string;
  };

  static string2dataArray(str){
    if (isNode) {
      const buf = Buffer(str);
      return [... buf];
    } else if(TextEncoder){
      const typedArray = new TextEncoder("utf-8").encode(str);
      var arr = new Array(typedArray.length);
      for (var i=0; i<typedArray.length;i++) {
        arr[i] = typedArray[i];
      }
      return arr;
      
    }
    return null;
  }
}

module.exports = ObnizUtil;