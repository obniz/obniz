
const BleRemoteService = require("./bleRemoteService");

class BleRemotePeripheral {

  constructor(Obniz, address){
    this.Obniz = Obniz;
    this.address = address;
    
    this.keys = [
      "device_type",
      "address_type",
      "ble_event_type",
      "rssi",
      "adv_data",
      "scan_resp",
    ];
    
    this.services = [];
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

  connect(callbacks){
    var keys = ["onconnect","ondisconnect"];
    this.setParams(keys, callbacks);
    
    var obj = {
      "ble" :{
        "connect" :{
          "address" : this.address
        }
      }
    };
    this.Obniz.send(obj);
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
    for(var key in this.services){
      if(this.services[key].uuid === uuid){
        return this.services[key];
      }
    }
    var newService = new BleRemoteService(this.Obniz,this, uuid);
    this.services.push(newService);
    return newService;
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

  onconnect(){};
  ondisconnect(){};
  ondiscoverservice(service){};
  ondiscoverservicefinished(services){};

  onerror(err){};

}


module.exports = BleRemotePeripheral;