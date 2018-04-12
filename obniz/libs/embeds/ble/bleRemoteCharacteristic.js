const ObnizUtil = require("../../utils/util");
const BleRemoteDescriptor = require("./bleRemoteDescriptor");


class BleRemoteCharacteristic {

  constructor(Obniz, service, uuid){
    this.Obniz = Obniz;
    this.service = service;
    this.uuid = uuid;
    this.discoverdOnRemote = false;
    this.descriptors = [];
    this.properties = [];
  }

  toString(){
    return JSON.stringify({
          "address" : this.service.peripheral.address,
          "service_uuid" : this.service.uuid,
          "characteristic_uuid" : this.uuid,
          "properties" : this.properties
        });
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
    this.Obniz.send(obj);
  }

  async readWait(){
    throw new Error("TODO");
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
    this.Obniz.send(obj);
  }

  writeNumber(val){
    this.write([val]);
  }

  writeText(val){
    this.write(ObnizUtil.string2dataArray(str));
  }

  discoverAllDescriptors(str){
    var obj = {
      "ble" :{
        "get_descriptors" :{
          "address" : this.service.peripheral.address,
          "service_uuid" : this.service.uuid,
          "characteristic_uuid" : this.uuid
        }
      }
    };
    this.Obniz.send(obj);
  }

  getDescriptor(uuid){
    for(var key in this.descriptors){
      if(this.descriptors[key].uuid === uuid){
        return this.descriptors[key];
      }
    }
    var newDescriptors = new BleRemoteDescriptor(this.Obniz, this, uuid);
    this.descriptors.push(newDescriptors);
    return newDescriptors;
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


  onwrite(status){};
  onread(value){};
  ondiscoverdescriptor(descriptor){};
  ondiscoverdescriptorfinished(services){};


}
module.exports = BleRemoteCharacteristic;