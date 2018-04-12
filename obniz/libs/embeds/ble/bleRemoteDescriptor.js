

class BleRemoteDescriptor {
  constructor(Obniz, characteristic, uuid){
    this.Obniz = Obniz;
    this.characteristic = characteristic;
    this.discoverdOnRemote = false;
    this.uuid = uuid;
  }

  toString(){
    return JSON.stringify({
      "address" : this.characteristic.service.peripheral.address,
      "service_uuid" : this.characteristic.service.uuid,
      "characteristic_uuid" : this.characteristic.uuid,
      "descriptor_uuid" : this.uuid
    });
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
    this.Obniz.send(obj);
  }

  async readWait(){
    throw new Error("TODO");
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
    this.Obniz.send(obj);
  }


  writeNumber(val){
    this.write([val]);
  }

  writeText(val){
    this.write(ObnizUtil.string2dataArray(str));
  }

  onread(value){};
  onwrite(value){};
}

module.exports = BleRemoteDescriptor;
