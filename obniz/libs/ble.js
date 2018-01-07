
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

Ble.prototype.setAdvData = function(adv_data) {
  var obj = {};
  obj["ble"] = {};
  obj["ble"]["advertisement"] = {
      "adv_data":adv_data
  };
  this.Obniz.send(obj);
  return;
};


Ble.prototype.setAdvDataAsShortenedLocalName = function(name) {
  var data = [];
  data.push(0x02, 0x01, 0x06); //flags
  data.push(name.length+1); //length
  data.push(0x08);  //BLE_AD_TYPE_NAME_SHRT
  
  for(var i=0;i<name.length; i++){
      data.push(name.charCodeAt(i));
  }
  
  this.setAdvData(data);
  return;
};

Ble.prototype.setAdvDataAsIbeacon = function(uuid, major, minor, txPower) {
  var uuidNumeric = uuid.toLowerCase().replace(/[^0-9abcdef]/g, '');
  if(uuidNumeric.length !== (8+4+4+4+12) ){
    throw Error("BLE iBeacon uuid digit must be 32. (example: c28f0ad5-a7fd-48be-9fd0-eae9ffd3a8bb )");
  }
  
  var data = [];
  data.push(0x02, 0x01, 0x06); //flags
  data.push(0x1A, 0xFF, 0x4C, 0x00, 0x02, 0x15); //length, type, capmanycode
 
  // uuid
  for(var i=0;i<uuidNumeric.length; i+=2){
      data.push(parseInt(uuidNumeric[i] + uuidNumeric[i+1],16 ));
  }
  
  data.push((major >> 2 ) & 0xFF);
  data.push((major >> 0 ) & 0xFF);
  data.push((minor >> 2 ) & 0xFF);
  data.push((minor >> 0 ) & 0xFF);
  data.push((txPower >> 0 ) & 0xFF);
  
  this.setAdvData(data);
  return;
};



Ble.prototype.setScanRespData = function(scan_resp) {
  var obj = {};
  obj["ble"] = {};
  obj["ble"]["advertisement"] = {
      "scan_resp":scan_resp
  };
  this.Obniz.send(obj);
  return;
};



Ble.prototype.setScanRespDataAsName = function(name) {
  var data = [];
  data.push(name.length+1);
  data.push(0x09);  //BLE_AD_TYPE_NAME_CMPL
  
  for(var i=0;i<name.length; i++){
      data.push(name.charCodeAt(i));
  }
  
  this.setScanRespData(data);
  return;
};


Ble.prototype.setScanRespDataAsName = function(name) {
  var data = [];
  data.push(name.length+1);
  data.push(0x09);  //BLE_AD_TYPE_NAME_CMPL
  
  for(var i=0;i<name.length; i++){
      data.push(name.charCodeAt(i));
  }
  
  this.setScanRespData(data);
  return;
};



Ble.prototype.startScan = function(settings) {
  var obj = {};
  obj["ble"] = {};
  obj["ble"]["scan"] = {
    "settings" : {
      "targetUuid" : settings.targetUuid ? settings.targetUuid : null,
      "interval" : settings.interval ? settings.interval : 30,
      "duration" : settings.duration ? settings.duration : 30,
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
      var val = new BleScanResponse(obj.scan_results[id]);

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

BleScanResponse = function(rawData){
  
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

BleScanResponse.prototype.serarchTypeVal = function(type){
  for(var i = 0;i<this.advertise_data_rows.length;i++){
    if(this.advertise_data_rows[i][0] === type){
      var results = [].concat(this.advertise_data_rows[i]);
      results.shift();
      return results;
    }
  }
  return undefined;
};

BleScanResponse.prototype.localName = function(){
  var data = this.serarchTypeVal(0x09);
  if(!data){
     data = this.serarchTypeVal(0x08);
  }
  if(!data)return undefined;
  return String.fromCharCode.apply(null, data);
};


BleScanResponse.prototype.iBeacon = function(){
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
    rssi :this.rssi,
  };
};