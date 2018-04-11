
const BleRemoteCharacteristic = require("./bleRemoteCharacteristic");

class BleRemoteService {

  constructor(Obniz, peripheral, uuid){
    this.Obniz = Obniz;
    this.uuid = uuid;
    this.peripheral = peripheral;
    this.discoverdOnRemote = false;
    
    this.characteristics = [];
  }

  toString(){
    return JSON.stringify({
          "address" : this.peripheral.address,
          "service_uuid" : this.uuid
    });
  }

  discoverAllCharacteristics(){
    var obj = {
      "ble" :{
        "get_characteristics" :{
          "address" : this.peripheral.address,
          "service_uuid" : this.uuid
        }
      }
    };
    this.Obniz.send(obj);
  }

  getCharacteristic(uuid){
  
    for(var key in this.characteristics){
      if(this.characteristics[key].uuid === uuid){
        return this.characteristics[key];
      }
    }
    var newCharacteristic = new BleRemoteCharacteristic(this.Obniz, this, uuid);
    this.characteristics.push(newCharacteristic);
    return newCharacteristic;
  }


  ondiscovercharacteristic( characteristic){};
  ondiscovercharacteristicfinished( characteristic){};

}



module.exports = BleRemoteService;