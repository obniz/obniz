

const BlePeripheral = require("./blePeripheral");
const BleService = require("./bleService");
const BleCharacteristic = require("./bleCharacteristic");
const BleDescriptor = require("./bleDescriptor");
const BleRemotePeripheral = require("./bleRemotePeripheral");


class ObnizBLE {
  constructor(Obniz) {
    this.Obniz = Obniz;
    this.remotePeripherals =  [];
    this.adv_data = [];
    this.scan_resp = [];
    
    this.service = BleService;
    this.characteristic = BleCharacteristic;
    this.descriptor = BleDescriptor;
    this.peripheral = new BlePeripheral(Obniz);
  }

  startAdvertisement() {
    var obj = {};
    obj["ble"] = {};
    obj["ble"]["advertisement"] = {
      adv_data : this.adv_data
    };
    
    if(this.scan_resp.length > 0){
       obj["ble"]["advertisement"]["scan_resp"]= this.scan_resp;
    }
    
    this.Obniz.send(obj);
    return;
  }

  stopAdvertisement() {
    var obj = {};
    obj["ble"] = {};
    obj["ble"]["advertisement"] = null;
    this.Obniz.send(obj);
    return;
  }

  setAdvDataRaw(adv_data) {
    var obj = {};
    this.adv_data = adv_data;
    return;
  }

  setAdvData(json) {
    var builder = this.advDataBulider(json);
    this.setAdvDataRaw(builder.build());
    return;
  }

  dataBuliderPrototype(){

    var builder = function(Obniz,json){
      this.Obniz = Obniz;
      this.rows  = {};
      
      if (json) {
        if (json.localName) {
          this.setCompleteLocalName(json.localName);
        }
        if (json.manufacturerData && json.manufacturerData.campanyCode && json.manufacturerData.data) {
          this.setManufacturerSpecificData(json.manufacturerData.campanyCode, json.manufacturerData.data);
        }
        if (json.serviceUuids) {
          for (var key in json.serviceUuids) {
            this.setUuid(json.serviceUuids[key]);
          }
        }
      }
      if(typeof(this.extendEvalJson) === "function"){
        this.extendEvalJson(json);
      }
    
    
    };
    builder.prototype.setRow = function(type,data){
      this.rows[type] = data;
    };
    builder.prototype.getRow = function(type){
      return this.rows[type] || [];
    };
    
    builder.prototype.check = function(){
      return true;
    };
    
    builder.prototype.build = function(){
      if(!this.check){
        return;
      }
      var data = [];
      for(var key in this.rows){
        if(this.rows[key].length === 0)continue;
        
        data.push(this.rows[key].length+1);
        data.push(parseInt(key));
        Array.prototype.push.apply(data, this.rows[key]);
      }
      if(data.length > 31){
        this.Obniz.error("Too more data. Advertise/ScanResponse data are must be less than 32 byte.");
      }
      
      return data;
    };
    
    
    builder.prototype.setStringData = function (type, string){
      var data = [];
      
      for (var i = 0; i < string.length; i++) {
        data.push(string.charCodeAt(i));
      }
  
      this.setRow(type, data);
    };
    
    builder.prototype.setShortenedLocalName = function (name){
      this.setStringData(0x08,name);
    };
    builder.prototype.setCompleteLocalName = function (name){
      this.setStringData(0x09,name);
    };
    
    builder.prototype.setManufacturerSpecificData = function (campanyCode, data){
      var row = [];
      row.push(campanyCode & 0xFF);
      row.push((campanyCode >> 8) & 0xFF);
      Array.prototype.push.apply(row , data);
      this.setRow(0xFF, row);
    };
    
    builder.prototype.setUuid =function(uuid){
      var uuidData = this.convertUuid(uuid);
      var type = { 16:0x06, 4:0x04, 2:0x02 }[uuidData.length]; 
      this.setRow(type,uuidData);
    };
    
    builder.prototype.convertUuid = function(uuid){
      var uuidNumeric = uuid.toLowerCase().replace(/[^0-9abcdef]/g, '');
      if (uuidNumeric.length !== 32 
          && uuidNumeric.length !== 8 
          && uuidNumeric.length !== 4 ) {
        this.Obniz.error("BLE uuid must be 16/32/128 bit . (example: c28f0ad5-a7fd-48be-9fd0-eae9ffd3a8bb for 128bit)");
      }
      
      var data = [];
      for (var i = uuidNumeric.length; i > 1 ; i -= 2) {
        data.push(parseInt(uuidNumeric[i-2] + uuidNumeric[i - 1], 16));
      }
      return data;
    };
    
    builder.prototype.setIbeaconData = function (uuid, major, minor, txPower) {
      var data = [];
      data.push(0x02, 0x15); // fixed data
  
      var uuidData = this.convertUuid(uuid);
      Array.prototype.push.apply(data, uuidData);
      
      
      data.push((major >> 8) & 0xFF);
      data.push((major >> 0) & 0xFF);
      data.push((minor >> 8) & 0xFF);
      data.push((minor >> 0) & 0xFF);
      data.push((txPower >> 0) & 0xFF);
  
      this.setManufacturerSpecificData(0x004c, data);
      return;
    };

    return builder;
  }

  advDataBulider(jsonVal){
    var builder = this.dataBuliderPrototype();
    
    builder.prototype.check = function(){
    
      return true;
    };
    
    builder.prototype.extendEvalJson = function(json){
      if(json){
        if (json.flags) {
          if (json.flags.includes("limited_discoverable_mode"))
            this.setLeLimitedDiscoverableModeFlag();
          if (json.flags.includes("general_discoverable_mode"))
            this.setLeGeneralDiscoverableModeFlag();
          if (json.flags.includes("br_edr_not_supported"))
            this.setBrEdrNotSupportedFlag();
          if (json.flags.includes("le_br_edr_controller"))
            this.setLeBrEdrControllerFlag();
          if (json.flags.includes("le_br_edr_host"))
            this.setLeBrEdrHostFlag();
        }
      }
    };
    
    builder.prototype.setFlags = function(flag){
      var data = this.getRow(0x01);
      data[0] = (data[0] || 0) | flag;
      this.setRow(0x01,data);
    };
    builder.prototype.setLeLimitedDiscoverableModeFlag = function (){
      this.setFlags(0x01);
    };
    builder.prototype.setLeGeneralDiscoverableModeFlag = function (){
      this.setFlags(0x02);
    };
    builder.prototype.setBrEdrNotSupportedFlag = function (){
      this.setFlags(0x04);
    };
    builder.prototype.setLeBrEdrControllerFlag = function (){
      this.setFlags(0x08);
    };
    builder.prototype.setLeBrEdrHostFlag = function (){
      this.setFlags(0x10);
    };
    
    return new builder(this.Obniz,jsonVal);
  }

  scanRespDataBuilder(json){
    var builder = this.dataBuliderPrototype();
    return new builder(this.Obniz,json);
  }

  setScanRespDataRaw(scan_resp) {
    this.scan_resp = scan_resp; 
  }

  setScanRespData(json) {
    this.setScanRespDataRaw(this.scanRespDataBuilder(json).build());
  }

  startScan(settings) {
    var obj = {};
    obj["ble"] = {};
    obj["ble"]["scan"] = {
  //    "targetUuid" : settings && settings.targetUuid ? settings.targetUuid : null,
  //    "interval" : settings && settings.interval ? settings.interval : 30,
      "duration" : settings && settings.duration ? settings.duration : 30
      
    };
    
    this.remotePeripherals =  [];
    
    this.Obniz.send(obj);
    return;
  }

  stopScan() {
    var obj = {};
    obj["ble"] = {};
     obj["ble"]["scan"] = null;
    this.Obniz.send(obj);
  }

  findPeripheral (address) {
    for( var key in this.remotePeripherals){
      if(this.remotePeripherals[key].address === address){
        return this.remotePeripherals[key];
      }
    }
    return null;
  }

  notified(obj) {
    if (obj.scan_result) {
      let isFinished = false;
      if (obj.scan_result.event_type === "inquiry_complete") {
        isFinished = true;
      } else if (obj.scan_result.event_type === "inquiry_result") {
        let val = new BleRemotePeripheral(this.Obniz, obj.scan_result.address);
        val.setParams(obj.scan_result);
        this.remotePeripherals.push(val);
        if (this.onscan) {
          this.onscan(val);
        }
      }
      if (isFinished && this.onscanfinish) {
        this.onscanfinish(this.remotePeripherals);
      }
    }

    if (obj.status_update) {
      let params = obj.status_update;
      if (!params.address)
        return;
      let p = this.findPeripheral(params.address);
      if (p) {
        if (params.status === "connected") {
          p.onconnect();
        }
        if (params.status === "disconnected") {
          p.ondisconnect();
        }
      }
    }

    if (obj.get_service_result) {
      let params = obj.get_service_result;
      if (params.address) {
        let p = this.findPeripheral(params.address);
        if (p) {
          let service = p.getService(params.service_uuid);
          p.ondiscoverservice(service);
        }
      }
    }
    if (obj.get_characteristic_result) {
      let params = get_characteristic_result;
      if (params.address) {
        let p = this.findPeripheral(params.address);
        if (p) {
          let service = p.getService(params.service_uuid);
          let chara = service.getCharacteristic(params.characteristic_uuid);
          service.ondiscovercharacteristic(chara);
        }
      }
    }
    if (obj.write_characteristic_result) {
      let params = obj.write_characteristic_result;
      if (params.address) {
        let p = this.findPeripheral(params.address);
        if (p) {
          let service = p.getService(params.service_uuid);
          let chara = service.getCharacteristic(params.characteristic_uuid);
          chara.onwrite(params.result);
        }
      }
    }

    if (obj.read_characteristic_result) {
      let params = obj.read_characteristic_result;
      if (params.address) {
        let p = this.findPeripheral(params.address);
        if (p) {
          let service = p.getService(params.service_uuid);
          let chara = service.getCharacteristic(params.characteristic_uuid);
          chara.onread(params.data);
        }
      }
    }
    if (obj.get_descriptors_result) {
      let params = obj.get_descriptors_result;
      if (params.address) {
        let p = this.findPeripheral(params.address);
        if (p) {
          let service = p.getService(params.service_uuid);
          let chara = service.getCharacteristic(params.characteristic_uuid);
          let descr = chara.getDescriptor(params.descriptor_uuid);
          chara.ondiscoverdescriptor(descr);
        }
      }
    }
    if (obj.read_descriptor_result) {
      let params = obj.read_descriptor_result;
      if (params.address) {
        let p = this.findPeripheral(params.address);
        if (p) {
          let service = p.getService(params.service_uuid);
          let chara = service.getCharacteristic(params.characteristic_uuid);
          let descr = chara.getDescriptor(params.descriptor_uuid);
          descr.onread(params.data);
        }
      }
    }
    if (obj.write_descriptor_result) {
      let params = obj.write_descriptor_result;
      if (params.address) {
        var p = this.findPeripheral(params.address);
        if (p) {
          let service = p.getService(params.service_uuid);
          let chara = service.getCharacteristic(params.characteristic_uuid);
          let descr = chara.getDescriptor(params.descriptor_uuid);
          descr.onwrite(params.data);
        }
      }
    }
    
    var callbackFunc = function (val, func, type) {
      var obj = null;
      if(val === undefined) return;
      if (type === "service") {
        obj = this.peripheral.getService(val);
      } else if (type === "characteristic") {
        obj = this.peripheral.findCharacteristic(val);
      } else if (type === "descriptor") {
        obj = this.peripheral.findDescriptor(val);
      }
      func(val, obj);
    }.bind(this);
    
     if (obj.peripheral) {
       callbackFunc(obj.peripheral.connection_status, function(val){
         this.peripheral.onconnectionupdates(val);
       }.bind(this));
       
       var paramList = {
         read_characteristic_result : { method: "onread", obj:"characteristic"},
         write_characteristic_result : { method: "onwrite", obj:"characteristic"},
         notify_read_characteristic : { method: "onreadfromremote", obj:"characteristic"},
         notify_write_characteristic : { method: "onwritefromremote", obj:"characteristic"},
         read_descriptor_result : { method: "onread", obj:"descriptor"},
         write_descriptor_result : { method: "onwrite", obj:"descriptor"},
         notify_read_descriptor : { method: "onreadfromremote", obj:"descriptor"},
         notify_write_descriptor : { method: "onwritefromremote", obj:"descriptor"},
       }
       
       for(var key in paramList){
        callbackFunc(obj.peripheral[key], function(val,bleobj){
          bleobj[paramList[key].method](val);
        }.bind(this), paramList[key].obj);
      }
     }

    if (obj.error) {
      let params = obj.error;
        if (!params.address){
           if(typeof(this.onerror) === "function"){
             this.onerror(params);
           }
        }
         
        let p = this.findPeripheral(params.address);
        if (p) {
          p.onerror(params);
        }
    }
  }
}


module.exports = ObnizBLE;