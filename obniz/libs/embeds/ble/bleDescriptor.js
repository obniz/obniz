const ObnizUtil = require("../../utils/util");

/**
 * 
 * @param {type} rawData
 * @return {BleServiuce}
 */
class BleDescriptor {

  constructor(obj){
    this.descriptors = [];
    this.uuid = obj.uuid.toLowerCase() ;
    
    this.data = obj.data || null;
    if(! this.data && obj.text){
      this.data = ObnizUtil.string2dataArray(obj.text);
    }
    if(! this.data && obj.value){
      this.data = obj.value;
    }
    
    this.property = obj.property || [];
    if(!Array.isArray(this.property)){
      this.property = [this.property];
    }
  }

  toJSON(){
    var obj =  {
      uuid : this.uuid.toLowerCase()  ,
      data : this.data ,
    };
    if (this.property.length > 0 ) {
      obj.property =  this.property;
    }
    return obj;
  }

  write(arr){
    this.characteristic.service.peripheral.Obniz.send(
        {
          ble : {
          peripheral: {
            write_descriptor: {
              service_uuid: this.characteristic.service.uuid.toLowerCase() ,
              characteristic_uuid: this.characteristic.uuid.toLowerCase() ,
              descriptor_uuid: this.uuid,
              data: data
            }
          }
        }
      }
    );
  }

  writeNumber(val){
    this.write([val]);
  }

  writeText(val){
    this.write(ObnizUtil.string2dataArray(str));
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

  onwrite(){};
  onread(){};
  onwritefromremote(){}
  onreadfromremote(){};
}

module.exports = BleDescriptor;