
Ble = function(Obniz) {
  this.Obniz = Obniz;
  this.scanResults =  [];
};

Ble.prototype.startAdvertisement = function() {
  var obj = {};
  obj["ble"] = {};
  obj["ble"]["advertisement"] = {
      "status":"start"
  };
  this.Obniz.send(obj);
  return;
};
Ble.prototype.stopAdvertisement = function() {
  var obj = {};
  obj["ble"] = {};
  obj["ble"]["advertisement"] = {
      "status":"stop"
  };
  this.Obniz.send(obj);
  return;
};

Ble.prototype.setAdvDataRaw = function(adv_data) {
  console.log(adv_data);
  var obj = {};
  obj["ble"] = {};
  obj["ble"]["advertisement"] = {
      "adv_data":adv_data
  };
  this.Obniz.send(obj);
  return;
};

Ble.prototype.setAdvData = function(json) {
  var builder = this.advDataBulider(json);
 
  this.setAdvDataRaw(builder.build());
  
  return;
};


Ble.prototype.dataBuliderPrototype = function(){
  var builder = function(Obniz,json){
    this.Obniz = Obniz;
    this.rows  = {};
    
    if (json) {
      if (json.localName) {
        this.setCompleteLocalName(json.localName);
      }
      if (json.manufacturerData && json.manufacturerData.campanyCode && json.manufacturerData.data) {
        this.setManufacturerSpecificData(json.manufacturerData.campanyCode, json.manufacturerData.data)
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
  }
  
  builder.prototype.convertUuid = function(uuid){
    var uuidNumeric = uuid.toLowerCase().replace(/[^0-9abcdef]/g, '');
    if (uuidNumeric.length !== 32 
        && uuidNumeric.length !== 8 
        && uuidNumeric.length !== 4 ) {
      this.Obniz.error("BLE uuid must be 16/32/128 bit . (example: c28f0ad5-a7fd-48be-9fd0-eae9ffd3a8bb for 128bit)");
    }
    
    var data = [];
    for (var i = 0; i < uuidNumeric.length; i += 2) {
      data.push(parseInt(uuidNumeric[i] + uuidNumeric[i + 1], 16));
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


Ble.prototype.advDataBulider = function(jsonVal){
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
  }
  
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
};
Ble.prototype.scanRespDataBuilder = function(json){
  var builder = this.dataBuliderPrototype();
  return new builder(this.Obniz,json);
};




Ble.prototype.setScanRespRawData = function(scan_resp) {
  var obj = {};
  obj["ble"] = {};
  obj["ble"]["advertisement"] = {
      "scan_resp":scan_resp
  };
  this.Obniz.send(obj);
  return;
};

Ble.prototype.setScanRespData = function(json) {
  this.setScanRespRawData(this.scanRespDataBuilder(json).build());
  return;
};




Ble.prototype.startScan = function(settings) {
  var obj = {};
  obj["ble"] = {};
  obj["ble"]["scan"] = {
    "settings" : {
      "targetUuid" : settings && settings.targetUuid ? settings.targetUuid : null,
      "interval" : settings && settings.interval ? settings.interval : 30,
      "duration" : settings && settings.duration ? settings.duration : 30,
    },
    "status":"start"
  };
  
  this.scanResults =  [];
  
  this.Obniz.send(obj);
  return;
};

Ble.prototype.stopScan = function() {
  var obj = {};
  obj["ble"] = {};
   obj["ble"]["scan"] = {
    "status":"stop"
  };
  this.Obniz.send(obj);
  return;
}

Ble.prototype.notified = function (obj) {
  if (obj.scan_results) {
    var isFinished = false;
    for (var id in obj.scan_results) {
      var val = new BleRemotePeripheral(obj.scan_results[id]);

      if (val.event_type === "inquiry_complete") {
        isFinished = true;
      } else if (val.event_type === "inquiry_result") {

        this.scanResults.push(val);
        if (this.onscan) {
          this.onscan(val);
        }
      }
    }
    if (isFinished && this.onscanfinish) {
          this.onscanfinish(this.scanResults);
    }
  }
};
