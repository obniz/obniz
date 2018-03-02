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
var BlePeripheral = function(Obniz){
  this.Obniz = Obniz;
  this.services = [];
};


BlePeripheral.prototype.addService = function(obj) {
  if(! (obj instanceof BleService ) ){
    obj = new BleService(obj);
  }
  this.services.push(obj);
  obj.peripheral = this;
  this.Obniz.send({ble:{peripheral:{services:[obj]}}});
};


BlePeripheral.prototype.setJson = function(json) {
  if(json["services"]){
    for(var key in json["services"]){
      this.addService(json["services"][key]);
    }
  }
};

BlePeripheral.prototype.getService = function(uuid) {
  return this.services.filter(function(element){
    return element.uuid === uuid;
  }).shift();
};


BlePeripheral.prototype.toJSON = function(){
  return {
    services : this.services
  };
};

BlePeripheral.prototype.onconnectionupdates = function(){};
BlePeripheral.prototype.findCharacteristic = function(param){
  var serviceUuid = param.service_uuid.toLowerCase() ;
  var characteristicUuid = param.characteristic_uuid.toLowerCase() ;
  var s = this.getService(serviceUuid);
  if(s){
    var c = s.getCharacteristic(characteristicUuid);
    return c;
  }
  return null;
};
BlePeripheral.prototype.findDescriptor = function(param){
  var descriptorUuid = param.descriptor_uuid.toLowerCase() ;
  var c = this.findCharacteristic(param);
  if(c){
    var d = c.getDescriptor(descriptorUuid);
    return d;
  }
  return null;
  
};


BlePeripheral.prototype.end = function(){
  
  this.Obniz.send({ble:{peripheral:null}});
  
};

/**
 * 
 * @param {type} rawData
 * @return {BleServiuce}
 */
var BleService = function(obj){
  this.characteristics = [];
  this.uuid = obj.uuid.toLowerCase() ;
  
  if(obj["characteristics"]){
     for(var key in obj["characteristics"]){
      this.addCharacteristic(obj["characteristics"][key]);
    }
  }
};

BleService.prototype.addCharacteristic = function(obj) {
  if(! (obj instanceof BleCharacteristic ) ){
    obj = new BleCharacteristic(obj);
  }
  this.characteristics.push(obj);
  obj.service = this;
};

BleService.prototype.getCharacteristic = function(uuid) {
  return this.characteristics.filter(function(element){
    return element.uuid.toLowerCase()  === uuid.toLowerCase() ;
  }).shift();
};



BleService.prototype.toJSON = function(){
  return {
    uuid : this.uuid.toLowerCase()  ,
    characteristics : this.characteristics
  };
};


/**
 * 
 * @param {type} rawData
 * @return {BleServiuce}
 */
var BleCharacteristic = function(obj){
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
};

BleCharacteristic.prototype.addDescriptor = function(obj) {
  if(! (obj instanceof BleDescriptor ) ){
    obj = new BleDescriptor(obj);
  }
  this.descriptors.push(obj);
  obj.characteristic = this;
};


BleCharacteristic.prototype.getDescriptor = function(uuid) {
  return this.descriptors.filter(function(element){
    return element.uuid.toLowerCase()  === uuid.toLowerCase() ;
  }).shift();
};

BleCharacteristic.prototype.write = function(data){
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
};

BleCharacteristic.prototype.read = function(){
  
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
};

BleCharacteristic.prototype.onwrite = function(){};
BleCharacteristic.prototype.onread = function(){};
BleCharacteristic.prototype.onwritefromremote = function(){};
BleCharacteristic.prototype.onreadfromremote = function(){};

BleCharacteristic.prototype.toJSON = function(){
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

/**
 * 
 * @param {type} rawData
 * @return {BleServiuce}
 */
var BleDescriptor = function(obj){
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
};


BleDescriptor.prototype.toJSON = function(){
  var obj =  {
    uuid : this.uuid.toLowerCase()  ,
    data : this.data ,
  };
  if (this.property.length > 0 ) {
    obj.property =  this.property;
    
  }
  return obj;
}

BleDescriptor.prototype.write = function(data){
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
};

BleDescriptor.prototype.read = function(){
  
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
};

BleDescriptor.prototype.onwrite = function(){};
BleDescriptor.prototype.onread = function(){};
BleDescriptor.prototype.onwritefromremote = function(){};
BleDescriptor.prototype.onreadfromremote = function(){};