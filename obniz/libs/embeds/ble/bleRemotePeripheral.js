
const BleRemoteService = require("./bleRemoteService");
const emitter = require("eventemitter3");
const BleAttributeAbstract = require("./bleAttributeAbstract");

class BleRemotePeripheral {

  constructor(Obniz, address){
    this.Obniz = Obniz;
    this.address = address;
    this.connected = false;
    
    this.keys = [
      "device_type",
      "address_type",
      "ble_event_type",
      "rssi",
      "adv_data",
      "scan_resp",
    ];
    
    this.services = [];
    this.emitter = new emitter();
  }

/**
 * 
 * @return {String} json value
 */
  toString() {
    return JSON.stringify({
      id: this.id,
      address: this.address,
      addressType: this.addressType,
      connectable: this.connectable,
      advertisement: this.adv_data,
      scanResponse: this.scan_resp,
      rssi: this.rssi,
      state: this.state
    });
  }

  setParams(dic) {
    for(var key in dic){
      if(this.keys.includes(key)){
        this[key] = dic[key] ;
      }
    }
  }

  analyseAdvertisement() {
    if (!this.advertise_data_rows) {
      this.advertise_data_rows = [];
      if (this.adv_data) {
        for (var i = 0; i < this.adv_data.length; i++) {
          var length = this.adv_data[i];
          var arr = new Array(length);
          for (var j = 0; j < length; j++) {
            arr[j] = this.adv_data[i + j + 1];
          }
          this.advertise_data_rows.push(arr);
          i = i + length;
        }
      }
      if (this.scan_resp) {
  
        for (var i = 0; i < this.scan_resp.length; i++) {
          var length = this.scan_resp[i];
          var arr = new Array(length);
          for (var j = 0; j < length; j++) {
            arr[j] = this.scan_resp[i + j + 1];
          }
          this.advertise_data_rows.push(arr);
          i = i + length;
        }
      }
    }
  }


  serarchTypeVal(type){
    this.analyseAdvertisement();
    for(var i = 0;i<this.advertise_data_rows.length;i++){
      if(this.advertise_data_rows[i][0] === type){
        var results = [].concat(this.advertise_data_rows[i]);
        results.shift();
        return results;
      }
    }
    return undefined;
  }

  localName(){
    var data = this.serarchTypeVal(0x09);
    if(!data){
       data = this.serarchTypeVal(0x08);
    }
    if(!data)return null;
    return String.fromCharCode.apply(null, data);
  }

  iBeacon(){
    var data = this.serarchTypeVal(0xFF);
    if(!data 
        || data[0] !== 0x4c
        || data[1] !== 0x00
        || data[2] !== 0x02
        || data[3] !== 0x15 
        || data.length !== 25)return null;
    
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
  }

  _addServiceUuids(results, data, bit){
    if(!data)return;
    let uuidLength = bit / 4;
    for(let i =0; i< data.length; i = i + uuidLength){
      let one = data.slice(i,i+uuidLength);
      results.push(this.Obniz.ble._dataArray2uuidHex(one,true));
    }
  }

  advertisementServiceUuids(){
    let results = [];
    this._addServiceUuids(results,this.serarchTypeVal(0x02), 16);
    this._addServiceUuids(results,this.serarchTypeVal(0x03), 16);
    this._addServiceUuids(results,this.serarchTypeVal(0x04), 32);
    this._addServiceUuids(results,this.serarchTypeVal(0x05), 32);
    this._addServiceUuids(results,this.serarchTypeVal(0x06), 64);
    this._addServiceUuids(results,this.serarchTypeVal(0x07), 64);
    return results;
  }


  connect(){
    var obj = {
      "ble" :{
        "connect" :{
          "address" : this.address
        }
      }
    };
    this.Obniz.send(obj);
  }

  connectWait(){
    return new Promise((resolve)=>{
      this.emitter.once("statusupdate", (params)=>{
        resolve(params.status === "connected");
      });
      this.connect();
    })
  }

  disconnect(){
    var obj = {
      "ble" :{
        "disconnect" :{
          "address" : this.address
        }
      }
    };
    this.Obniz.send(obj); 
  }



  updateRssi(){
    throw new Error("todo");
  }

  getService(uuid){
    uuid = uuid.toLowerCase();
    for(var key in this.services){
      if(this.services[key].uuid === uuid){
        return this.services[key];
      }
    }
    var newService = new BleRemoteService({uuid});
    newService.parent = this;
    this.services.push(newService);
    return newService;
  }

  findService(param){
    var serviceUuid = param.service_uuid.toLowerCase() ;
    var s = this.getService(serviceUuid);
    return s;
  }

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


  discoverAllServices(){
    var obj = {
      "ble" :{
        "get_services" :{
          "address" : this.address
        }
      }
    };
    this.Obniz.send(obj);
  }

  discoverAllServicesWait(){
    return new Promise((resolve)=>{
      this.emitter.once("discoverfinished", ()=>{
        let children = this.services.filter(elm=>{return elm.discoverdOnRemote;});
        resolve(children);
      });
      this.discoverAllServices();

    })
  }

  onconnect(){};
  ondisconnect(){};


  ondiscoverservice(service){};

  ondiscoverservicefinished(services){};


  ondiscover(){

  };
  ondiscoverfinished(){

  };


  notifyFromServer(notifyName, params){
    this.emitter.emit(notifyName, params);
    switch(notifyName){
      case "statusupdate" : {
        if (params.status === "connected") {
          this.connected = true;
          this.onconnect();
        }
        if (params.status === "disconnected") {
          this.connected = false;
          this.ondisconnect();
        }
        break;
      }
      case "discover" : {
        let child = this.getService(params.service_uuid);
        child.discoverdOnRemote = true;
        this.ondiscoverservice(child);
        break;
      }
      case "discoverfinished" : {
        let children = this.services.filter(elm=>{return elm.discoverdOnRemote;});
        this.ondiscoverservicefinished(children);
        break;
      }
    }
  }

  onerror(err){};

}


module.exports = BleRemotePeripheral;