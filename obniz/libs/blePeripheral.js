/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * 
 * @param {type} rawData
 * @return {BleRemotePeripheral}
 */
BleRemotePeripheral = function(Obniz, deviceAddress){
  this.Obniz = Obniz;
  this.device_address = deviceAddress;
  
  this.keys = [
    "device_type",
    "address_type",
    "ble_event_type",
    "rssi",
    "advertise_data",
    "advertise_length",
    "scan_response_length"
  ];
  
  
  this.services = [];
};

/**
 * 
 * @return {String} json value
 */
BleRemotePeripheral.prototype.toString = function() {
  return JSON.stringify({
    id: this.id,
    address: this.address,
    addressType: this.addressType,
    connectable: this.connectable,
    advertisement: this.advertisement,
    rssi: this.rssi,
    state: this.state
  });
};


BleRemotePeripheral.prototype.setParams = function(dic) {
  
  for(var key in dic){
    if(this.keys.includes(key)){
      this[key] = dic[key] ;
    }
  }
};


BleRemotePeripheral.prototype.analyseAdvertisement = function() {
  
  if(this.advertise_data && !this.advertise_data_rows  ){
    this.advertise_data_rows = [];
    for(var i = 0; i < this.advertise_data.length;i++){
      var length = this.advertise_data[i];
      var arr = new Array(length);
      for(var j=0;j<length;j++){
        arr[j] = this.advertise_data[i+j+1];
      }
      this.advertise_data_rows.push(arr);
      i=i+length;
    }
  } 
};


BleRemotePeripheral.prototype.serarchTypeVal = function(type){
  this.analyseAdvertisement();
  for(var i = 0;i<this.advertise_data_rows.length;i++){
    if(this.advertise_data_rows[i][0] === type){
      var results = [].concat(this.advertise_data_rows[i]);
      results.shift();
      return results;
    }
  }
  return undefined;
};

BleRemotePeripheral.prototype.localName = function(){
  var data = this.serarchTypeVal(0x09);
  if(!data){
     data = this.serarchTypeVal(0x08);
  }
  if(!data)return undefined;
  return String.fromCharCode.apply(null, data);
};





BleRemotePeripheral.prototype.iBeacon = function(){
  var data = this.serarchTypeVal(0xFF);
  if(!data 
      || data[0] !== 0x4c
      || data[1] !== 0x00
      || data[2] !== 0x02
      || data[3] !== 0x15 
      || data.length !== 25)return undefined;
  
  var uuidData = data.slice(4, 20);
  var uuid = "";
  for(var i = 0; i< uuidData.length;i++){
    uuid = uuid + (( '00' + uuidData[i].toString(16) ).slice( -2 ));
    if(i === (4-1) ||i === (4+2-1) ||i === (4+2*2-1) ||i === (4+2*3-1) ){
      uuid += "-";
    }
  }
  
  var major = (data[20]<<8) + data[21];
  var minor = (data[22]<<8) + data[23];
  var power = data[24];
  
  
  return {
    uuid : uuid,
    major: major,
    minor :minor,
    power :power,
    rssi :this.rssi
  };
};


BleRemotePeripheral.prototype.connect = function(callbacks){
  var keys = ["onconnect","ondisconnect"];
  this.setParams(keys, callbacks);
  
  var obj = {
    "ble" :{
      "connect" :{
        "device_address" : this.device_address
      }
    }
  };
  this.Obniz.send(obj);
};

BleRemotePeripheral.prototype.disconnect = function(){
  var obj = {
    "ble" :{
      "disconnect" :{
        "device_address" : this.device_address
      }
    }
  };
  this.Obniz.send(obj);
  
};

BleRemotePeripheral.prototype.updateRssi = function(){
  throw new Error("todo");
};

BleRemotePeripheral.prototype.getService = function(uuid){
  for(var key in this.services){
    if(this.services[key].uuid === uuid){
      return this.services[key];
    }
  }
  var newService = new BleRemoteService(this.Obniz,this, uuid);
  this.services.push(newService);
  return newService;
};

BleRemotePeripheral.prototype.discoverAllServices = function(){
  var obj = {
    "ble" :{
      "get_services" :{
        "device_address" : this.device_address
      }
    }
  };
  this.Obniz.send(obj);
};

//callbacks
BleRemotePeripheral.prototype.onconnect = function(){};
BleRemotePeripheral.prototype.ondisconnect = function(){};
BleRemotePeripheral.prototype.ondiscoverservice = function (service){};
BleRemotePeripheral.prototype.ondiscovercharacteristic = function( service, characteristic){};
BleRemotePeripheral.prototype.onwritecharacteristic = function(service, characteristic, status){};
BleRemotePeripheral.prototype.onreadcharacteristic = function(service, characteristic, value){};
BleRemotePeripheral.prototype.onerror = function(err){};



BleRemotePeripheral.prototype.notify = function( funcName, serviceUuid, characteristicUuid, param){
  if(typeof (this[funcName])  === "function"){
    if(!serviceUuid){
      this[funcName](param);
    }else{
      var service = this.getService(serviceUuid);
      if(!characteristicUuid){
        this[funcName](service,param);
      }else{
        var characteristic = service.getCharacteristic(characteristicUuid);
        this[funcName](service,characteristic,param);
        
      }
      
    }
  }
};

/**
 * 
 * @param {type} Obniz
 * @param {type} peripheral
 * @param {type} uuid
 * @return {BleRemoteService}
 */
BleRemoteService = function(Obniz, peripheral, uuid){
  this.Obniz = Obniz;
  this.uuid = uuid;
  this.peripheral = peripheral;
  
  this.characteristics = [];
  
};


BleRemoteService.prototype.toString = function(){
  return JSON.stringify({
        "device_address" : this.peripheral.device_address,
        "service_uuid" : this.uuid
  });
};

BleRemoteService.prototype.discoverAllCharacteristics = function(){
  var obj = {
    "ble" :{
      "get_characteristics" :{
        "device_address" : this.peripheral.device_address,
        "service_uuid" : this.uuid
      }
    }
  };
  this.Obniz.send(obj);
};

BleRemoteService.prototype.getCharacteristic = function(uuid){
  
  for(var key in this.characteristics){
    if(this.characteristics[key].uuid === uuid){
      return this.characteristics[key];
    }
  }
  var newCharacteristic = new BleRemoteCharacteristic(this.Obniz, this, uuid);
  this.characteristics.push(newCharacteristic);
  return newCharacteristic;
};


/**
 * 
 * @param {type} Obniz
 * @param {type} service
 * @param {type} uuid
 * @return {BleRemoteCharacteristic}
 */
BleRemoteCharacteristic = function(Obniz, service, uuid){
  this.Obniz = Obniz;
  this.service = service;
  this.uuid = uuid;
};

BleRemoteCharacteristic.prototype.toString = function(){
  return JSON.stringify({
        "device_address" : this.service.peripheral.device_address,
        "service_uuid" : this.service.uuid,
        "characteristic_uuid" : this.uuid
      });
};

BleRemoteCharacteristic.prototype.read = function(){
  var obj = {
    "ble" :{
      "read_characteristic" :{
        "device_address" : this.service.peripheral.device_address,
        "service_uuid" : this.service.uuid,
        "characteristic_uuid" : this.uuid
      }
    }
  };
  this.Obniz.send(obj);
};


BleRemoteCharacteristic.prototype.readWait = async function(){

 throw new Error("TODO");
};

BleRemoteCharacteristic.prototype.write = function(array){
  var obj = {
    "ble" :{
      "write_characteristic" :{
        "device_address" : this.service.peripheral.device_address,
        "service_uuid" : this.service.uuid,
        "characteristic_uuid" : this.uuid,
        "data" : array,
      }
    }
  };
  this.Obniz.send(obj);
};
BleRemoteCharacteristic.prototype.writeNumber = function(val){
  var obj = {
    "ble" :{
      "write_characteristic" :{
        "device_address" : this.service.peripheral.device_address,
        "service_uuid" : this.service.uuid,
        "characteristic_uuid" : this.uuid,
        "value" : val
      }
    }
  };
  this.Obniz.send(obj);
};

BleRemoteCharacteristic.prototype.writeText = function(str){
  var obj = {
    "ble" :{
      "write_characteristic" :{
        "device_address" : this.service.peripheral.device_address,
        "service_uuid" : this.service.uuid,
        "characteristic_uuid" : this.uuid,
        "text" : str
      }
    }
  };
  this.Obniz.send(obj);
};










