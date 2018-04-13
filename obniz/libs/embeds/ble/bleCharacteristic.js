
const BleDescriptor = require("./bleDescriptor");
const BleAttributeAbstract = require("./bleAttributeAbstract");

class BleCharacteristic extends BleAttributeAbstract{
  
  constructor(obj){
    super(obj);

    this.addDescriptor = this.addChild;
    this.getDescriptor = this.getChild;
  }

  get parentName(){
    return "service";
  }

  get childrenClass(){
    return BleDescriptor;
  }
  get childrenName(){
    return "descriptors";
  }

  write(data){
    this.service.peripheral.Obniz.send(
        {
          ble : {
          peripheral: {
            write_characteristic: {
              service_uuid: this.service.uuid.toLowerCase() ,
              characteristic_uuid: this.uuid.toLowerCase() ,
              data: data
            }
          }
        }
      }
    );
  }



  read(){
    this.service.peripheral.Obniz.send(
        {
          ble : {
          peripheral: {
            read_characteristic: {
              service_uuid: this.service.uuid.toLowerCase() ,
              characteristic_uuid: this.uuid.toLowerCase() ,
            }
          }
        }
      }
    );
  }



}


module.exports = BleCharacteristic;