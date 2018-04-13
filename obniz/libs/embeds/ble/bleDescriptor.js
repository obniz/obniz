const ObnizUtil = require("../../utils/util");
const BleAttributeAbstract = require("./bleAttributeAbstract");


/**
 * 
 * @param {type} rawData
 * @return {BleServiuce}
 */
class BleDescriptor extends BleAttributeAbstract {

  constructor(obj){
    super(obj);
  }

  get parentName(){
    return "characteristic";
  }

  write(dataArray){
    this.characteristic.service.peripheral.Obniz.send(
        {
          ble : {
          peripheral: {
            write_descriptor: {
              service_uuid: this.characteristic.service.uuid.toLowerCase() ,
              characteristic_uuid: this.characteristic.uuid.toLowerCase() ,
              descriptor_uuid: this.uuid,
              data: dataArray
            }
          }
        }
      }
    );
  }


  read(){
    this.characteristic.service.peripheral.Obniz.send(
        {
          ble : {
          peripheral: {
            read_descriptor: {
              service_uuid: this.characteristic.service.uuid.toLowerCase() ,
              characteristic_uuid: this.characteristic.uuid.toLowerCase() ,
              descriptor_uuid: this.uuid
            }
          }
        }
      }
    );
  }



}

module.exports = BleDescriptor;