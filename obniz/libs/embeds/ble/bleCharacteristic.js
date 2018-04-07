
const BleDescriptor = require("./bleDescriptor");

class BleCharacteristic {
  
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
    
    if(obj["descriptors"]){
       for(var key in obj["descriptors"]){
        this.addDescriptor(obj["descriptors"][key]);
      }
    }
  }

  addDescriptor(obj) {
    if(! (obj instanceof BleDescriptor ) ){
      obj = new BleDescriptor(obj);
    }
    this.descriptors.push(obj);
    obj.characteristic = this;
  }

  getDescriptor(uuid) {
    return this.descriptors.filter(function(element){
      return element.uuid.toLowerCase()  === uuid.toLowerCase() ;
    }).shift();
  }

  write(data){
    if(!Array.isArray(data)){
      data = [data];
    }
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
  onwrite(){};
  onread(){};
  onwritefromremote(){};
  onreadfromremote(){};

  toJSON(){
    var obj = {
      uuid : this.uuid.toLowerCase()  ,
      data : this.data ,
      descriptors : this.descriptors
    };
    if (this.property.length > 0 ) {
      obj.property =  this.property;
      
    }
    return obj;
  }
}


module.exports = BleCharacteristic;