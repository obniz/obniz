const ObnizUtil = require("../../utils/util");
const emitter = require("eventemitter3");

class BleAttributreAbstruct {

  constructor(params){
    this.uuid = params.uuid.toLowerCase();
    this.parent = null;
    this.children = [];

    this.isRemote = false;
    this.discoverdOnRemote = false;

    this.data = params.data || null;
    if(! this.data && params.text){
      this.data = ObnizUtil.string2dataArray(params.text);
    }
    if(! this.data && params.value){
      this.data = params.value;
    }

    this.property = params.property || [];
    if(!Array.isArray(this.property)){
      this.property = [this.property];
    }

    if(params[this.childrenName]){
      for(var key in params[this.childrenName]){
        this.addChild(params[this.childrenName][key]);
      }
    }

    this.setFunctions();


    this.emitter =  new emitter();

  }

  setFunctions() {
    let childrenName = this.childrenName;
    if(childrenName){
      childrenName = childrenName.charAt(0).toUpperCase() + childrenName.slice(1);
      let childName = childrenName.slice(0,-1);

      let funcName = "add" + childName;
      this[funcName] = this.addChild;

      funcName = "get" + childName;
      this[funcName] = this.getChild;
    }

    let parentName = this.parentName;
    if(parentName){
      Object.defineProperty(this, parentName, {
        get() { return this.parent; },
        set(newValue) { this.parent = newValue; }
      });
    }

  }


  get childrenClass(){
    return Object;
  }
  get childrenName(){
    return null;
  }
  get parentName(){
    return null;
  }

  addChild(child){
    if( ! (child instanceof this.childrenClass) ){
      child = new this.childrenClass(child);
    }
    child.parent = this;

    //あとでけす
    child.characteristic = this;

    this.children.push(child);
    return child;
  }

  getChild(uuid){

    return this.children.filter(function(element){
      return element.uuid.toLowerCase()  === uuid.toLowerCase() ;
    }).shift();

  }



  toJSON (){
    let obj = {uuid: this.uuid.toLowerCase()}

    if (this.children.length > 0) {
      let key = this.childrenName;
      obj[key] = this.children;
    }
    if (this.data) {
      obj.data = this.data
    }
    if (this.property.length > 0 ) {
      obj.property =  this.property;
    }
    return obj;
  }


  /**
   * WS COMMANDS
   */

  read() {}
  write(data){}

  writeNumber(val){
    this.write([val]);
  }

  writeText(str){
    this.write(ObnizUtil.string2dataArray(str));
  }

  readWait(){
    return new Promise(resolve => {
      this.emitter.once("onread",(params)=>{
        resolve(params.data);
      });
      this.read();
    })
  }

  writeWait(data){
    return new Promise(resolve => {
      this.emitter.once("onwrite",(params)=>{
        resolve(params.result);
      });
      this.write(data);
    })
  }

  readFromRemoteWait(){
    return new Promise(resolve => {
      this.emitter.once("onreadfromremote",(params)=>{
        resolve();
      });
    })
  }

  writeFromRemoteWait(){
    return new Promise(resolve => {
      this.emitter.once("onreadfromremote",(params)=>{
        resolve(params.data);
      });
    })
  }



  /**
   * CALLBACKS
   */
  onwrite(){

  };
  onread(){

  };
  onwritefromremote(){

  }
  onreadfromremote(){

  };

  notify(notifyName, params){
    this.emitter.emit(notifyName, params);
    switch(notifyName){
      case "onwrite" : {
        this.onwrite(params.result);
        break;
      }
      case "onread" : {
        this.onread(params.data);
        break;
      }
      case "onwritefromremote" : {
        this.onwritefromremote(params.address, params.data);
        break;
      }
      case "onreadfromremote" : {
        this.onreadfromremote(params.address);
        break;
      }
    }
  }
}

module.exports = BleAttributreAbstruct;