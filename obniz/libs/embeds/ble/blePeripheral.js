
const BleService = require("./bleService");

class BlePeripheral {

  constructor(Obniz){
    this.Obniz = Obniz;
    this.services = [];
  }

  addService(obj) {
    if(! (obj instanceof BleService ) ){
      obj = new BleService(obj);
    }
    this.services.push(obj);
    obj.peripheral = this;
    this.Obniz.send({ble:{peripheral:{services:[obj]}}});
  }

  setJson(json) {
    if(json["services"]){
      for(var key in json["services"]){
        this.addService(json["services"][key]);
      }
    }
  }

  getService(uuid) {
    uuid = uuid.toLowerCase();
    return this.services.filter(function(element){
      return element.uuid.toLowerCase() === uuid;
    }).shift();
  }

  removeService(uuid){
    this.services = this.services.filter(function(element){
      return element.uuid.toLowerCase() !== uuid;
    });
  }

  stopAllService(){
    this.Obniz.send(
        {
          ble : {
            peripheral: null

          }
        }
    );
    this.services = [];
  }

  toJSON(){
    return {
      services : this.services
    };
  }


  findCharacteristic(param){
    var serviceUuid = param.service_uuid.toLowerCase() ;
    var characteristicUuid = param.characteristic_uuid.toLowerCase() ;
    var s = this.getService(serviceUuid);
    if(s){
      var c = s.getCharacteristic(characteristicUuid);
      return c;
    }
    return null;
  }

  findDescriptor(param){
    var descriptorUuid = param.descriptor_uuid.toLowerCase() ;
    var c = this.findCharacteristic(param);
    if(c){
      var d = c.getDescriptor(descriptorUuid);
      return d;
    }
    return null;
  }

  end(){
    this.Obniz.send({ble:{peripheral:null}});
  }

  onconnectionupdates(){};
  onerror(){};
}


module.exports = BlePeripheral;