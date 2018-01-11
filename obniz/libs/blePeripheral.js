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
BleRemotePeripheral = function(rawData){
  
  for(var key in rawData){
    this[key] = rawData[key];
  }
//  return;
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


BleRemotePeripheral.prototype.serarchTypeVal = function(type){
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


BleRemotePeripheral.prototype.connect = function(){
  throw new Error("todo");
};

BleRemotePeripheral.prototype.disconnect = function(){
  throw new Error("todo");
};

BleRemotePeripheral.prototype.updateRssi = function(){
  throw new Error("todo");
};

BleRemotePeripheral.prototype.discoverServices = function(){
  throw new Error("todo");
};

BleRemotePeripheral.prototype.discoverAllServicesAndCharacteristics = function(){
  throw new Error("todo");
};

BleRemotePeripheral.prototype.discoverSomeServicesAndCharacteristics = function(){
  throw new Error("todo");
};





