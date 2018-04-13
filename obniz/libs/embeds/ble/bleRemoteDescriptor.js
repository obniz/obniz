
const BleRemoteAttributeAbstract = require("./bleRemoteAttributeAbstract");

class BleRemoteDescriptor extends BleRemoteAttributeAbstract{
  constructor(params){
    super(params);
  }

  get parentName(){
    return "characteristic";
  }

  read(){
    var obj = {
      "ble" :{
        "read_descriptor" :{
          "address" : this.characteristic.service.peripheral.address,
          "service_uuid" : this.characteristic.service.uuid,
          "characteristic_uuid" : this.characteristic.uuid,
          "descriptor_uuid" : this.uuid
        }
      }
    };
    this.characteristic.service.peripheral.Obniz.send(obj);
  }

  write(array){
    var obj = {
      "ble" :{
        "write_descriptor" :{
          "address" : this.characteristic.service.peripheral.address,
          "service_uuid" : this.characteristic.service.uuid,
          "characteristic_uuid" : this.characteristic.uuid,
          "descriptor_uuid" : this.uuid,
          "data" : array
        }
      }
    };
    this.characteristic.service.peripheral.Obniz.send(obj);
  }


}

module.exports = BleRemoteDescriptor;
