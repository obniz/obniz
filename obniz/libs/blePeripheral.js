/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * 
 * @param {type} rawData
 * @return {BlePeripheral}
 */

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
    return this.services.filter(function(element){
      return element.uuid === uuid;
    }).shift();
  }

  toJSON(){
    return {
      services : this.services
    };
  }

  onconnectionupdates(){};

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
}


/**
 * 
 * @param {type} rawData
 * @return {BleServiuce}
 */
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
}


/**
 * 
 * @param {type} rawData
 * @return {BleServiuce}
 */

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

  write(data){
    if(!Array.isArray(data)){
      data = [data];
    }
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