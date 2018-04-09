
const BleCharacteristic = require("./bleCharacteristic");


class BleService {

  constructor(obj){
    this.characteristics = [];
    this.uuid = obj.uuid.toLowerCase() ;
    
    if(obj["characteristics"]){
       for(var key in obj["characteristics"]){
        this.addCharacteristic(obj["characteristics"][key]);
      }
    }
  }

  addCharacteristic(obj) {
    if(! (obj instanceof BleCharacteristic ) ){
      obj = new BleCharacteristic(obj);
    }
    this.characteristics.push(obj);
    obj.service = this;
  }

  getCharacteristic(uuid) {
    return this.characteristics.filter(function(element){
      return element.uuid.toLowerCase()  === uuid.toLowerCase() ;
    }).shift();
  }

  toJSON (){
    return {
      uuid : this.uuid.toLowerCase()  ,
      characteristics : this.characteristics
    };
  }

  get advData() {
    return {
      flags: ["general_discoverable_mode", "br_edr_not_supported"],
      serviceUuids: [this.uuid]
    }
  }
}


module.exports = BleService;