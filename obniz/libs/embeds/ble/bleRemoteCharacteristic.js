const ObnizUtil = require("../../utils/util");
const BleRemoteDescriptor = require("./bleRemoteDescriptor");
const BleRemoteAttributeAbstract = require("./bleRemoteAttributeAbstract");

class BleRemoteCharacteristic extends BleRemoteAttributeAbstract{

  constructor(params){
    super(params);

    this.properties = params.properties || [];
    if(!Array.isArray(this.properties)){
      this.properties = [this.properties];
    }


  }

  get parentName(){
    return "service";
  }

  get childrenClass(){
    return BleRemoteDescriptor;
  }
  get childrenName(){
    return "descriptors";
  }


  addDescriptor(params) {
    return this.addChild(params)
  }
  //
  // getCharacteristic(params) {
  //   return this.getChild(params)
  // }

  getDescriptor(uuid){

    let obj = this.getChild(uuid);
    if(obj){return obj;}
    var newCharacteristic = new BleRemoteDescriptor(this.Obniz, this, uuid);
    this.addChild(newCharacteristic);
    return newCharacteristic;
  }

  registerNotify(callback){
    this.onnotify = callback;
    var obj = {
      "ble" :{
        "register_notify_characteristic" :{
          "address" : this.service.peripheral.address,
          "service_uuid" : this.service.uuid,
          "characteristic_uuid" : this.uuid
        }
      }
    };
    this.service.peripheral.Obniz.send(obj);
  }


  unregisterNotify(){
    this.onnotify = function () {};
    var obj = {
      "ble" :{
        "unregister_notify_characteristic" :{
          "address" : this.service.peripheral.address,
          "service_uuid" : this.service.uuid,
          "characteristic_uuid" : this.uuid
        }
      }
    };
    this.service.peripheral.Obniz.send(obj);
  }

  readFromRemoteWait(){
    return new Promise(resolve => {
      this.emitter.once("onreadfromremote",(params)=>{
        resolve();
      });
    })
  }



  read(){
    var obj = {
      "ble" :{
        "read_characteristic" :{
          "address" : this.service.peripheral.address,
          "service_uuid" : this.service.uuid,
          "characteristic_uuid" : this.uuid
        }
      }
    };
    this.service.peripheral.Obniz.send(obj);
  }

  write(array){
    var obj = {
      "ble" :{
        "write_characteristic" :{
          "address" : this.service.peripheral.address,
          "service_uuid" : this.service.uuid,
          "characteristic_uuid" : this.uuid,
          "data" : array
        }
      }
    };
    this.service.peripheral.Obniz.send(obj);
  }

  discoverChildren(){
    var obj = {
      "ble" :{
        "get_descriptors" :{
          "address" : this.service.peripheral.address,
          "service_uuid" : this.service.uuid,
          "characteristic_uuid" : this.uuid
        }
      }
    };
    this.service.peripheral.Obniz.send(obj);
  }

  discoverAllDescriptors(){
    return this.discoverChildren();
  }

  discoverAllDescriptorsWait(){
    return this.discoverChildrenWait();
  }


  toJSON (){
    let obj = super.toJSON();

    if (this.properties.length > 0 ) {
      obj.properties =  this.properties;
    }
    return obj;
  }

  canBroadcast(){
    return this.properties.includes("broadcast");
  }
  canNotify(){
    return  this.properties.includes("notify");
  }
  canRead(){
    return this.properties.includes("read");
  }
  canWrite(){
    return this.properties.includes("write");
  }
  canWriteWithoutResponse(){
    return this.properties.includes("write_without_response");
  }
  canIndicate(){
    return this.properties.includes("indicate");
  }



  ondiscover(descriptor) {
    this.ondiscoverdescriptor(descriptor);
  }
  ondiscoverfinished(descriptors) {
    this.ondiscoverdescriptorfinished(descriptors);
  }

  ondiscoverdescriptor(descriptor){};
  ondiscoverdescriptorfinished(services){};

  onregisternofity(){};
  onunregisternofity(){};
  onnotify(){};

  notifyFromServer(notifyName, params) {
    super.notifyFromServer(notifyName, params);
    switch (notifyName) {
      case "onregisternofity" : {
        this.onregisternofity();
        break;
      }
      case "onunregisternofity" : {
        this.onunregisternofity();
        break;
      }
      case "onnotify" : {
        this.onnotify();
        break;
      }
    }
  }

}
module.exports = BleRemoteCharacteristic;