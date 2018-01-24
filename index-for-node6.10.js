"use strict";

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/* global showObnizDebugError */

var isNode = typeof window === 'undefined' ? true : false;

var Obniz = function (id, options) {
  if (isNode === false && typeof showOffLine === "function") {
    showOffLine();
  }
  this.id = id;
  this.socket = null;
  this.debugprint = false;
  this.debugs = [];

  this.init();

  if (!options) options = {};
  if (("" + id).indexOf("OBNIZ") >= 0) {
    console.error("invalid obniz id");
    return;
  }
  // if (isNode == false && (!id || id === "OBNIZ ID HERE")) {
  //   var self = this;
  //   this.prompt(function(obnizid){
  //     self.id = obnizid;
  //     self.wsconnect(options.obniz_server);
  //   })
  //   return;
  // }
  this.wsconnect(options.obniz_server);
};

Obniz.prototype.prompt = function (callback) {
  var obnizid = prompt("Please enter obniz id", "");
  if (obnizid === null || obnizid === "") {} else {
    callback(obnizid);
  }
};

Obniz.prototype.wsconnect = function (desired_server) {
  var server_obnizio = "wss://obniz.io";
  var server = server_obnizio;
  if (desired_server) {
    server = "" + desired_server;
  }
  if (this.socket) {
    this.socket.close();
    this.clearSocket(this.socket);
  }
  var url = server + "/obniz/" + this.id + "/ws";
  this.print_debug("connecting to " + url);
  var self = this;

  var wsOnOpen = function () {
    self.print_debug("ws connected");
    // wait for {ws:{ready:true}} object
  };

  var wsOnMessage = function (data) {
    self.print_debug(data);
    var obj = {};
    if (typeof data === "string") {
      obj = JSON.parse(data);
    } else {
      return;
    }
    // User's defined callback
    if (typeof self.onwsmessage === "function") {
      self.onwsmessage(obj);
    }
    // notify messaging
    if (typeof obj.message === "object" && self.onmessage) {
      self.onmessage(obj.message.data, obj.message.from);
    }
    // debug
    if (typeof obj.debug == "object") {
      if (obj.debug.warning) {
        var msg = "Warning: " + obj.debug.warning;
        if (isNode) {
          console.error(msg);
        } else {
          if (typeof showObnizDebugError == "function") {
            showObnizDebugError(new Error(msg));
          } else {
            throw new Error(msg);
          }
        }
      }
      if (self.ondebug) {
        self.ondebug(obj.debug);
      }
    }
    // ws command
    if (obj["ws"]) {
      self.handleWSCommand(obj["ws"]);
      return;
    }

    // notify
    var notifyHandlers = ["io", "uart", "spi", "i2c", "ad"];
    for (var handerIndex = 0; handerIndex < notifyHandlers.length; handerIndex++) {
      var i = -1;
      var peripheral = notifyHandlers[handerIndex];
      while (true) {
        i++;
        if (self[peripheral + "" + i] === undefined) {
          break;
        }
        var module_value = obj[peripheral + "" + i];
        if (module_value === undefined) continue;
        self[peripheral + "" + i].notified(module_value);
      }
    }
    var names = ["switch", "ble", "logicanalyzer", "measure"];
    for (var i = 0; i < names.length; i++) {
      if (obj[names[i]]) {
        self[names[i]].notified(obj[names[i]]);
      }
    }
  };

  var wsOnClose = function (event) {
    self.print_debug("closed");
    if (isNode === false && typeof showOffLine === "function") {
      showOffLine();
    }
    if (self.looper) {
      self.looper = null;
    }
    // user defined onclose function
    if (self.onclose) {
      self.onclose(self);
    }
    self.clearSocket(self.socket);
    setTimeout(function () {
      // redirect先でつながらないなら切り替える
      if (desired_server !== server_obnizio) {
        desired_server = server_obnizio;
      }
      self.wsconnect(desired_server);
    }, 1000);
  };

  var wsOnError = function (err) {
    console.log(err);
  };

  if (isNode) {
    var WebSocket = require('ws');
    this.socket = new WebSocket(url);
    this.socket.on('open', wsOnOpen);
    this.socket.on('message', wsOnMessage);
    this.socket.on('close', wsOnClose);
    this.socket.on('error', wsOnError);
  } else {
    this.socket = new WebSocket(url);
    this.socket.onopen = wsOnOpen;
    this.socket.onmessage = function (event) {
      wsOnMessage(event.data);
    };
    this.socket.onclose = wsOnClose;
    this.socket.onerror = wsOnError;
  }
};

Obniz.prototype.clearSocket = function (socket) {
  if (isNode) {
    var shouldRemoveObservers = ['open', 'message', 'close', 'error'];
    for (var i = 0; i < shouldRemoveObservers.length; i++) {
      socket.removeAllListeners(shouldRemoveObservers[i]);
    }
  } else {
    socket.onopen = null;
    socket.onmessage = null;
    socket.onclose = null;
    socket.onerror = null;
  }
  this.socket = null;
};

Obniz.prototype.close = function () {
  if (this.socket) {
    this.socket.close(1000, 'close');
    this.clearSocket(this.socket);
  }
};

Obniz.prototype.wired = function (partsname) {
  var parts = new _parts[partsname]();
  if (!parts) {
    throw new Error("No such a parts [" + partsname + "] found");
    return;
  }
  var args = Array.from(arguments);
  args.shift();
  args.unshift(this);
  parts.wired.apply(parts, args);
  return parts;
};

Obniz.prototype.print_debug = function (str) {
  if (this.debugprint) {
    console.log("Obniz: " + str);
  }
};

Obniz.prototype.send = function (value) {
  if (typeof value === "object") {
    value = JSON.stringify(value);
  }
  this.print_debug("send: " + value);
  this.socket.send(value);
};

Obniz.prototype.init = function () {

  for (var i = 0; i < 12; i++) {
    this["io" + i] = new PeripheralIO(this, i);
  }
  for (var i = 0; i < 12; i++) {
    this["ad" + i] = new PeripheralAD(this, i);
  }
  for (var i = 0; i < 2; i++) {
    this["uart" + i] = new PeripheralUART(this, i);
  }
  for (var i = 0; i < 1; i++) {
    this["spi" + i] = new PeripheralSPI(this, i);
  }
  for (var i = 0; i < 1; i++) {
    this["i2c" + i] = new PeripheralI2C(this, i);
  }
  for (var i = 0; i < 6; i++) {
    this["pwm" + i] = new PeripheralPWM(this, i);
  }

  this.display = new Display(this);
  this.switch = new ObnizSwitch(this);
  this.logicanalyzer = new LogicAnalyzer(this);
  this.ble = new Ble(this);
  this.measure = new ObnizMeasure(this);
};

Obniz.prototype.getIO = function (id) {
  return this["io" + id];
};

Obniz.prototype.getAD = function (id) {
  return this["ad" + id];
};

Obniz.prototype.getpwm = function () {
  var i = 0;
  while (true) {
    var pwm = this["pwm" + i];
    if (!pwm) {
      break;
    }
    if (typeof pwm.state.io != "number") {
      return pwm;
    }
    i++;
  }
  throw new Error("No More PWM Available. max = " + i);
};

Obniz.prototype.getFreeI2C = function () {
  var i = 0;
  while (true) {
    var i2c = this["i2c" + i];
    if (!i2c) {
      break;
    }
    if (typeof i2c.state.scl != "number") {
      return i2c;
    }
    i++;
  }
  throw new Error("No More I2C Available. max = " + i);
};

Obniz.prototype.handleWSCommand = function (wsObj) {
  // ready
  if (wsObj.ready) {
    if (isNode === false && typeof showOnLine === "function") {
      showOnLine();
    }
    if (this.onconnect) {
      this.onconnect(this);
    }
  }
  if (wsObj.redirect) {
    var server = wsObj.redirect;
    this.print_debug("WS connection changed to " + server);
    this.close();
    this.wsconnect(server);
  }
};

Obniz.prototype.message = function (target, message) {
  var targets = [];
  if (typeof target === "string") {
    targets.push(target);
  } else {
    targets = target;
  }
  this.send({
    message: {
      to: targets,
      data: message
    }
  });
};

// --- System ---
Obniz.prototype.reset = function () {
  this.send({
    system: {
      reset: true
    }
  });
  this.init();
};

Obniz.prototype.selfCheck = function () {
  this.send({
    system: {
      self_check: true
    }
  });
};

Obniz.prototype.repeat = function (callback, interval) {
  let loop = (() => {
    var _ref = _asyncToGenerator(function* () {
      if (typeof self.looper === "function") {
        yield self.looper();
        setTimeout(loop, interval);
      }
    });

    return function loop() {
      return _ref.apply(this, arguments);
    };
  })();

  if (this.looper) {
    this.looper = callback;
    return;
  }
  this.looper = callback;
  var self = this;
  if (!interval) interval = 100;

  loop();
};

Obniz.prototype.wait = (() => {
  var _ref2 = _asyncToGenerator(function* (msec) {
    return new Promise(function (resolve) {
      return setTimeout(resolve, msec);
    });
  });

  return function (_x) {
    return _ref2.apply(this, arguments);
  };
})();

Obniz.prototype.freeze = (() => {
  var _ref3 = _asyncToGenerator(function* (msec) {
    this.send({
      system: {
        wait: msec
      }
    });
  });

  return function (_x2) {
    return _ref3.apply(this, arguments);
  };
})();

Obniz.prototype.resetOnDisconnect = function (mustReset) {
  this.send({
    system: {
      reset_on_disconnect: mustReset
    }
  });
};

Obniz.prototype.error = function (msg) {
  if (typeof showObnizDebugError === "function") {
    showObnizDebugError(new Error(msg));
  } else {
    throw new Error(msg);
  }
};
/*===================*/
/* Parts */
/*===================*/
var _parts = {};

var PartsRegistrate = function (name, obj) {
  _parts[name] = obj;
};

var Parts = function (name) {
  return new _parts[name]();
};

/*===================*/
/* Export */
/*===================*/
if (isNode) {
  module.exports = Obniz;
}

var PeripheralAD = function (Obniz, id) {
  this.Obniz = Obniz;
  this.id = id;
  this.value = 0.0;
  this.observers = [];
};

PeripheralAD.prototype.addObserver = function (callback) {
  if (callback) {
    this.observers.push(callback);
  }
};

PeripheralAD.prototype.start = function (callback) {
  this.onchange = callback;
  var obj = {};
  obj["ad" + this.id] = {
    on: true,
    stream: true
  };
  this.Obniz.send(obj);
  return this.value;
};

PeripheralAD.prototype.getWait = function () {
  var self = this;
  return new Promise(function (resolve, reject) {
    var obj = {};
    obj["ad" + self.id] = {
      on: true,
      stream: false
    };
    self.Obniz.send(obj);
    self.addObserver(resolve);
  });
};

PeripheralAD.prototype.end = function () {
  this.onchange = null;
  var obj = {};
  obj["ad" + this.id] = null;
  this.Obniz.send(obj);
  return;
};

PeripheralAD.prototype.notified = function (obj) {
  this.value = obj;
  if (this.onchange) {
    this.onchange(obj);
  }
  var callback = this.observers.shift();
  if (callback) {
    callback(obj);
  }
};

var Ble = function (Obniz) {
  this.Obniz = Obniz;
  this.peripherals = [];
};

Ble.prototype.startAdvertisement = function () {
  var obj = {};
  obj["ble"] = {};
  obj["ble"]["advertisement"] = {
    "status": "start"
  };
  this.Obniz.send(obj);
  return;
};
Ble.prototype.stopAdvertisement = function () {
  var obj = {};
  obj["ble"] = {};
  obj["ble"]["advertisement"] = {
    "status": "stop"
  };
  this.Obniz.send(obj);
  return;
};

Ble.prototype.setAdvDataRaw = function (adv_data) {
  console.log(adv_data);
  var obj = {};
  obj["ble"] = {};
  obj["ble"]["advertisement"] = {
    "adv_data": adv_data
  };
  this.Obniz.send(obj);
  return;
};

Ble.prototype.setAdvData = function (json) {
  var builder = this.advDataBulider(json);

  this.setAdvDataRaw(builder.build());

  return;
};

Ble.prototype.dataBuliderPrototype = function () {
  var builder = function (Obniz, json) {
    this.Obniz = Obniz;
    this.rows = {};

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
    if (typeof this.extendEvalJson === "function") {
      this.extendEvalJson(json);
    }
  };
  builder.prototype.setRow = function (type, data) {
    this.rows[type] = data;
  };
  builder.prototype.getRow = function (type) {
    return this.rows[type] || [];
  };

  builder.prototype.check = function () {
    return true;
  };

  builder.prototype.build = function () {
    if (!this.check) {
      return;
    }
    var data = [];
    for (var key in this.rows) {
      if (this.rows[key].length === 0) continue;

      data.push(this.rows[key].length + 1);
      data.push(parseInt(key));
      Array.prototype.push.apply(data, this.rows[key]);
    }
    if (data.length > 31) {
      this.Obniz.error("Too more data. Advertise/ScanResponse data are must be less than 32 byte.");
    }

    return data;
  };

  builder.prototype.setStringData = function (type, string) {
    var data = [];

    for (var i = 0; i < string.length; i++) {
      data.push(string.charCodeAt(i));
    }

    this.setRow(type, data);
  };

  builder.prototype.setShortenedLocalName = function (name) {
    this.setStringData(0x08, name);
  };
  builder.prototype.setCompleteLocalName = function (name) {
    this.setStringData(0x09, name);
  };

  builder.prototype.setManufacturerSpecificData = function (campanyCode, data) {
    var row = [];
    row.push(campanyCode & 0xFF);
    row.push(campanyCode >> 8 & 0xFF);
    Array.prototype.push.apply(row, data);
    this.setRow(0xFF, row);
  };

  builder.prototype.setUuid = function (uuid) {
    var uuidData = this.convertUuid(uuid);
    var type = { 16: 0x06, 4: 0x04, 2: 0x02 }[uuidData.length];
    this.setRow(type, uuidData);
  };

  builder.prototype.convertUuid = function (uuid) {
    var uuidNumeric = uuid.toLowerCase().replace(/[^0-9abcdef]/g, '');
    if (uuidNumeric.length !== 32 && uuidNumeric.length !== 8 && uuidNumeric.length !== 4) {
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

    data.push(major >> 8 & 0xFF);
    data.push(major >> 0 & 0xFF);
    data.push(minor >> 8 & 0xFF);
    data.push(minor >> 0 & 0xFF);
    data.push(txPower >> 0 & 0xFF);

    this.setManufacturerSpecificData(0x004c, data);
    return;
  };

  return builder;
};

Ble.prototype.advDataBulider = function (jsonVal) {
  var builder = this.dataBuliderPrototype();

  builder.prototype.check = function () {

    return true;
  };

  builder.prototype.extendEvalJson = function (json) {
    if (json) {
      if (json.flags) {
        if (json.flags.includes("limited_discoverable_mode")) this.setLeLimitedDiscoverableModeFlag();
        if (json.flags.includes("general_discoverable_mode")) this.setLeGeneralDiscoverableModeFlag();
        if (json.flags.includes("br_edr_not_supported")) this.setBrEdrNotSupportedFlag();
        if (json.flags.includes("le_br_edr_controller")) this.setLeBrEdrControllerFlag();
        if (json.flags.includes("le_br_edr_host")) this.setLeBrEdrHostFlag();
      }
    }
  };

  builder.prototype.setFlags = function (flag) {
    var data = this.getRow(0x01);
    data[0] = (data[0] || 0) | flag;
    this.setRow(0x01, data);
  };
  builder.prototype.setLeLimitedDiscoverableModeFlag = function () {
    this.setFlags(0x01);
  };
  builder.prototype.setLeGeneralDiscoverableModeFlag = function () {
    this.setFlags(0x02);
  };
  builder.prototype.setBrEdrNotSupportedFlag = function () {
    this.setFlags(0x04);
  };
  builder.prototype.setLeBrEdrControllerFlag = function () {
    this.setFlags(0x08);
  };
  builder.prototype.setLeBrEdrHostFlag = function () {
    this.setFlags(0x10);
  };

  return new builder(this.Obniz, jsonVal);
};
Ble.prototype.scanRespDataBuilder = function (json) {
  var builder = this.dataBuliderPrototype();
  return new builder(this.Obniz, json);
};

Ble.prototype.setScanRespRawData = function (scan_resp) {
  var obj = {};
  obj["ble"] = {};
  obj["ble"]["advertisement"] = {
    "scan_resp": scan_resp
  };
  this.Obniz.send(obj);
  return;
};

Ble.prototype.setScanRespData = function (json) {
  this.setScanRespRawData(this.scanRespDataBuilder(json).build());
  return;
};

Ble.prototype.startScan = function (settings) {
  var obj = {};
  obj["ble"] = {};
  obj["ble"]["scan"] = {
    "targetUuid": settings && settings.targetUuid ? settings.targetUuid : null,
    "interval": settings && settings.interval ? settings.interval : 30,
    "duration": settings && settings.duration ? settings.duration : 30,

    "status": "start"
  };

  this.peripherals = [];

  this.Obniz.send(obj);
  return;
};

Ble.prototype.stopScan = function () {
  var obj = {};
  obj["ble"] = {};
  obj["ble"]["scan"] = {
    "status": "stop"
  };
  this.Obniz.send(obj);
  return;
};

Ble.prototype.findPeripheral = function (device_address) {
  for (var key in this.peripherals) {
    if (this.peripherals[key].device_address === device_address) {
      return this.peripherals[key];
    }
  }
  return null;
};

Ble.prototype.notified = function (obj) {
  if (obj.scan_results) {
    var isFinished = false;
    for (var id in obj.scan_results) {

      if (obj.scan_results[id].event_type === "inquiry_complete") {
        isFinished = true;
      } else if (obj.scan_results[id].event_type === "inquiry_result") {
        var val = new BleRemotePeripheral(this.Obniz, obj.scan_results[id].device_address);
        val.setParams(obj.scan_results[id]);
        this.peripherals.push(val);
        if (this.onscan) {
          this.onscan(val);
        }
      }
    }
    if (isFinished && this.onscanfinish) {
      this.onscanfinish(this.peripherals);
    }
  }

  if (obj.connect_results) {
    obj.connect_results.map(function (params) {
      if (!params.device_address) return;
      var p = this.findPeripheral(params.device_address);
      if (p) {
        if (params.status === "connected") {
          p.notify("onconnect");
        }
        if (params.status === "disconnected") {
          p.notify("ondisconnect");
        }
      }
    }, this);
  }

  if (obj.get_service_results) {
    obj.get_service_results.map(function (params) {
      if (!params.device_address) return;
      var p = this.findPeripheral(params.device_address);
      if (p) {
        p.notify("ondiscoverservice", params.service_uuid);
      }
    }, this);
  }
  if (obj.get_characteristic_results) {
    obj.get_characteristic_results.map(function (params) {
      if (!params.device_address) return;
      var p = this.findPeripheral(params.device_address);
      if (p) {
        p.notify("ondiscovercharacteristic", params.service_uuid, params.characteristic_uuid);
      }
    }, this);
  }
  if (obj.write_characteristic_results) {
    obj.write_characteristic_results.map(function (params) {
      if (!params.device_address) return;
      var p = this.findPeripheral(params.device_address);
      if (p) {
        p.notify("onwritecharacteristic", params.service_uuid, params.characteristic_uuid, params);
      }
    }, this);
  }

  if (obj.read_characteristic_results) {
    obj.read_characteristic_results.map(function (params) {
      if (!params.device_address) return;
      var p = this.findPeripheral(params.device_address);
      if (p) {
        p.notify("onreadcharacteristic", params.service_uuid, params.characteristic_uuid, params.data);
      }
    }, this);
  }
  if (obj.errors) {
    obj.errors.map(function (params) {
      if (!params.device_address) {
        if (typeof this.onerror === "function") {
          this.onerror(params);
        }
      }

      var p = this.findPeripheral(params.device_address);
      if (p) {
        p.notify("onerror", null, null, params);
      }
    }, this);
  }
};

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
var BleRemotePeripheral = function (Obniz, deviceAddress) {
  this.Obniz = Obniz;
  this.device_address = deviceAddress;

  this.keys = ["device_type", "address_type", "ble_event_type", "rssi", "advertise_data", "advertise_length", "scan_response_length"];

  this.services = [];
};

/**
 * 
 * @return {String} json value
 */
BleRemotePeripheral.prototype.toString = function () {
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

BleRemotePeripheral.prototype.setParams = function (dic) {

  for (var key in dic) {
    if (this.keys.includes(key)) {
      this[key] = dic[key];
    }
  }
};

BleRemotePeripheral.prototype.analyseAdvertisement = function () {

  if (this.advertise_data && !this.advertise_data_rows) {
    this.advertise_data_rows = [];
    for (var i = 0; i < this.advertise_data.length; i++) {
      var length = this.advertise_data[i];
      var arr = new Array(length);
      for (var j = 0; j < length; j++) {
        arr[j] = this.advertise_data[i + j + 1];
      }
      this.advertise_data_rows.push(arr);
      i = i + length;
    }
  }
};

BleRemotePeripheral.prototype.serarchTypeVal = function (type) {
  this.analyseAdvertisement();
  for (var i = 0; i < this.advertise_data_rows.length; i++) {
    if (this.advertise_data_rows[i][0] === type) {
      var results = [].concat(this.advertise_data_rows[i]);
      results.shift();
      return results;
    }
  }
  return undefined;
};

BleRemotePeripheral.prototype.localName = function () {
  var data = this.serarchTypeVal(0x09);
  if (!data) {
    data = this.serarchTypeVal(0x08);
  }
  if (!data) return undefined;
  return String.fromCharCode.apply(null, data);
};

BleRemotePeripheral.prototype.iBeacon = function () {
  var data = this.serarchTypeVal(0xFF);
  if (!data || data[0] !== 0x4c || data[1] !== 0x00 || data[2] !== 0x02 || data[3] !== 0x15 || data.length !== 25) return undefined;

  var uuidData = data.slice(4, 20);
  var uuid = "";
  for (var i = 0; i < uuidData.length; i++) {
    uuid = uuid + ('00' + uuidData[i].toString(16)).slice(-2);
    if (i === 4 - 1 || i === 4 + 2 - 1 || i === 4 + 2 * 2 - 1 || i === 4 + 2 * 3 - 1) {
      uuid += "-";
    }
  }

  var major = (data[20] << 8) + data[21];
  var minor = (data[22] << 8) + data[23];
  var power = data[24];

  return {
    uuid: uuid,
    major: major,
    minor: minor,
    power: power,
    rssi: this.rssi
  };
};

BleRemotePeripheral.prototype.connect = function (callbacks) {
  var keys = ["onconnect", "ondisconnect"];
  this.setParams(keys, callbacks);

  var obj = {
    "ble": {
      "connect": {
        "device_address": this.device_address
      }
    }
  };
  this.Obniz.send(obj);
};

BleRemotePeripheral.prototype.disconnect = function () {
  var obj = {
    "ble": {
      "disconnect": {
        "device_address": this.device_address
      }
    }
  };
  this.Obniz.send(obj);
};

BleRemotePeripheral.prototype.updateRssi = function () {
  throw new Error("todo");
};

BleRemotePeripheral.prototype.getService = function (uuid) {
  for (var key in this.services) {
    if (this.services[key].uuid === uuid) {
      return this.services[key];
    }
  }
  var newService = new BleRemoteService(this.Obniz, this, uuid);
  this.services.push(newService);
  return newService;
};

BleRemotePeripheral.prototype.discoverAllServices = function () {
  var obj = {
    "ble": {
      "get_services": {
        "device_address": this.device_address
      }
    }
  };
  this.Obniz.send(obj);
};

//callbacks
BleRemotePeripheral.prototype.onconnect = function () {};
BleRemotePeripheral.prototype.ondisconnect = function () {};
BleRemotePeripheral.prototype.ondiscoverservice = function (service) {};
BleRemotePeripheral.prototype.ondiscovercharacteristic = function (service, characteristic) {};
BleRemotePeripheral.prototype.onwritecharacteristic = function (service, characteristic, status) {};
BleRemotePeripheral.prototype.onreadcharacteristic = function (service, characteristic, value) {};
BleRemotePeripheral.prototype.onerror = function (err) {};

BleRemotePeripheral.prototype.notify = function (funcName, serviceUuid, characteristicUuid, param) {
  if (typeof this[funcName] === "function") {
    if (!serviceUuid) {
      this[funcName](param);
    } else {
      var service = this.getService(serviceUuid);
      if (!characteristicUuid) {
        this[funcName](service, param);
      } else {
        var characteristic = service.getCharacteristic(characteristicUuid);
        this[funcName](service, characteristic, param);
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
var BleRemoteService = function (Obniz, peripheral, uuid) {
  this.Obniz = Obniz;
  this.uuid = uuid;
  this.peripheral = peripheral;

  this.characteristics = [];
};

BleRemoteService.prototype.toString = function () {
  return JSON.stringify({
    "device_address": this.peripheral.device_address,
    "service_uuid": this.uuid
  });
};

BleRemoteService.prototype.discoverAllCharacteristics = function () {
  var obj = {
    "ble": {
      "get_characteristics": {
        "device_address": this.peripheral.device_address,
        "service_uuid": this.uuid
      }
    }
  };
  this.Obniz.send(obj);
};

BleRemoteService.prototype.getCharacteristic = function (uuid) {

  for (var key in this.characteristics) {
    if (this.characteristics[key].uuid === uuid) {
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
var BleRemoteCharacteristic = function (Obniz, service, uuid) {
  this.Obniz = Obniz;
  this.service = service;
  this.uuid = uuid;
};

BleRemoteCharacteristic.prototype.toString = function () {
  return JSON.stringify({
    "device_address": this.service.peripheral.device_address,
    "service_uuid": this.service.uuid,
    "characteristic_uuid": this.uuid
  });
};

BleRemoteCharacteristic.prototype.read = function () {
  var obj = {
    "ble": {
      "read_characteristic": {
        "device_address": this.service.peripheral.device_address,
        "service_uuid": this.service.uuid,
        "characteristic_uuid": this.uuid
      }
    }
  };
  this.Obniz.send(obj);
};

BleRemoteCharacteristic.prototype.readWait = _asyncToGenerator(function* () {

  throw new Error("TODO");
});

BleRemoteCharacteristic.prototype.write = function (array) {
  var obj = {
    "ble": {
      "write_characteristic": {
        "device_address": this.service.peripheral.device_address,
        "service_uuid": this.service.uuid,
        "characteristic_uuid": this.uuid,
        "data": array
      }
    }
  };
  this.Obniz.send(obj);
};
BleRemoteCharacteristic.prototype.writeNumber = function (val) {
  var obj = {
    "ble": {
      "write_characteristic": {
        "device_address": this.service.peripheral.device_address,
        "service_uuid": this.service.uuid,
        "characteristic_uuid": this.uuid,
        "value": val
      }
    }
  };
  this.Obniz.send(obj);
};

BleRemoteCharacteristic.prototype.writeText = function (str) {
  var obj = {
    "ble": {
      "write_characteristic": {
        "device_address": this.service.peripheral.device_address,
        "service_uuid": this.service.uuid,
        "characteristic_uuid": this.uuid,
        "text": str
      }
    }
  };
  this.Obniz.send(obj);
};

var Display = function (Obniz) {
  this.Obniz = Obniz;
};

Display.prototype.clear = function () {
  var obj = {};
  obj["display"] = {
    clear: true
  };
  this.Obniz.send(obj);
};

Display.prototype.print = function (text) {
  var obj = {};
  obj["display"] = {
    text: "" + text
  };
  this.Obniz.send(obj);
};

Display.prototype.qr = function (data, correction) {
  var obj = {};
  obj["display"] = {
    qr: {
      data: data
    }
  };
  if (correction) {
    obj["display"].qr.correction = correction;
  }
  this.Obniz.send(obj);
};

var PeripheralI2C = function (Obniz, id) {
  this.Obniz = Obniz;
  this.id = id;
  this.observers = [];
  this.state = {};
};

PeripheralI2C.prototype.addObserver = function (callback) {
  if (callback) {
    this.observers.push(callback);
  }
};

PeripheralI2C.prototype.start = function (mode, sda, scl, clock, pullType) {
  var obj = {};
  this.state = {
    mode: mode,
    sda: sda,
    scl: scl,
    clock: clock
  };
  if (pullType) {
    this.state.pull_type = pullType;
  }
  obj["i2c" + this.id] = this.state;
  this.Obniz.send(obj);
};

PeripheralI2C.prototype.write = function (address, data) {
  var obj = {};
  obj["i2c" + this.id] = {
    address: address,
    write: data
  };
  this.Obniz.send(obj);
};

PeripheralI2C.prototype.write10bit = function (address, data) {
  return this.write(address | 0x8000, data);
};

PeripheralI2C.prototype.readWait = function (address, length) {
  var self = this;
  return new Promise(function (resolve, reject) {
    var obj = {};
    obj["i2c" + self.id] = {
      address: address,
      read: length
    };
    self.Obniz.send(obj);
    self.addObserver(resolve);
  });
};

PeripheralI2C.prototype.read10bitWait = function (address, length) {
  return this.read(address | 0x8000, length);
};

PeripheralI2C.prototype.notified = function (obj) {
  // TODO: we should compare byte length from sent
  var callback = this.observers.shift();
  if (callback) {
    callback(obj.readed);
  }
};

PeripheralI2C.prototype.end = function () {
  this.state = {};
  var obj = {};
  obj["i2c" + self.id] = null;
  self.Obniz.send(obj);
};

var PeripheralIO = function (Obniz, id) {
  this.Obniz = Obniz;
  this.id = id;
  this.value = 0;
  this.observers = [];
};

PeripheralIO.prototype.addObserver = function (callback) {
  if (callback) {
    this.observers.push(callback);
  }
};

PeripheralIO.prototype.output = function (value) {
  var obj = {};
  obj["io" + this.id] = value;
  this.value = value;
  this.Obniz.send(obj);
};

PeripheralIO.prototype.outputType = function (type) {
  var obj = {};
  obj["io" + this.id] = {
    output_type: type
  };
  this.Obniz.send(obj);
};

PeripheralIO.prototype.pullType = function (type) {
  var obj = {};
  obj["io" + this.id] = {
    pull_type: type
  };
  this.Obniz.send(obj);
};

PeripheralIO.prototype.pullup5v = function (type) {
  this.pullType("pullup5v");
};

PeripheralIO.prototype.pullup = function (type) {
  this.pullType("pullup");
};

PeripheralIO.prototype.pulldown = function (type) {
  this.pullType("pulldown");
};

PeripheralIO.prototype.float = function (type) {
  this.pullType("float");
};

PeripheralIO.prototype.input = function (callback) {
  this.onchange = callback;
  var obj = {};
  obj["io" + this.id] = {
    direction: "input",
    stream: true
  };
  this.Obniz.send(obj);
  return this.value;
};

PeripheralIO.prototype.inputWait = function () {
  var self = this;
  return new Promise(function (resolve, reject) {
    var obj = {};
    obj["io" + self.id] = {
      direction: "input",
      stream: false
    };
    self.Obniz.send(obj);
    self.addObserver(resolve);
  });
};

PeripheralIO.prototype.notified = function (obj) {
  this.value = obj;
  var callback = this.observers.shift();
  if (callback) {
    callback(obj);
  }
  if (typeof this.onchange === "function") {
    this.onchange(obj);
  }
};

var LogicAnalyzer = function (Obniz) {
  this.Obniz = Obniz;
};

LogicAnalyzer.prototype.start = function (io, interval, length) {
  var obj = {};
  obj["logicanalyzer"] = {
    io: [io],
    interval: interval,
    length: length
  };
  this.Obniz.send(obj);
  return;
};

LogicAnalyzer.prototype.end = function () {
  var obj = {};
  obj["logicanalyzer"] = null;
  this.Obniz.send(obj);
  return;
};

LogicAnalyzer.prototype.notified = function (obj) {
  if (this.onmeasured) {
    this.onmeasured(obj.measured);
  } else {
    if (this.measured === null) {
      this.measured = [];
    }
    this.measured.push(obj.measured);
  }
  return;
};

var ObnizMeasure = function (Obniz) {
  this.Obniz = Obniz;
  this.observers = [];
};

ObnizMeasure.prototype.echo = function (io_pulse, pulse, pulse_widthUs, io_echo, measure_edges, timeoutUs, callback) {
  var echo = {};
  echo.io_pulse = io_pulse;
  echo.pulse = pulse;
  echo.pulse_width = pulse_widthUs;
  echo.io_echo = io_echo;
  echo.measure_edges = measure_edges;
  echo.timeout = timeoutUs;

  this.Obniz.send({
    measure: {
      echo: echo
    }
  });

  if (callback) {
    this.observers.push(callback);
  }
};

ObnizMeasure.prototype.notified = function (obj) {
  var callback = this.observers.shift();
  if (callback) {
    callback(obj.echo);
  }
};

var PeripheralPWM = function (Obniz, id) {
  this.Obniz = Obniz;
  this.id = id;
  this.state = {};
};

PeripheralPWM.prototype.sendWS = function (obj) {
  var wsObj = {};
  wsObj["pwm" + this.id] = obj;
  this.Obniz.send(wsObj);
};

PeripheralPWM.prototype.start = function (io) {
  var obj = {};
  this.state.io = io;
  this.sendWS({
    io: io
  });
};

PeripheralPWM.prototype.freq = function (freq) {
  var obj = {};
  this.state.freq = freq;
  this.sendWS({
    freq: freq
  });
};

PeripheralPWM.prototype.pulse = function (pulse_width) {
  var obj = {};
  this.state.pulse = pulse_width;
  this.sendWS({
    pulse: pulse_width
  });
};

PeripheralPWM.prototype.duty = function (duty) {
  var obj = {};
  this.state.duty = duty;
  this.sendWS({
    duty: duty
  });
};

PeripheralPWM.prototype.forceWorking = function (working) {
  var obj = {};
  this.state.forceWorking = working;
  this.sendWS({
    force_working: working
  });
};

PeripheralPWM.prototype.end = function () {
  var obj = {};
  this.state = {};
  this.sendWS(null);
};

PeripheralPWM.prototype.modulate = function (type, symbol_sec, data) {
  var obj = {};
  this.sendWS({
    modulate: {
      type: type,
      symbol_sec: symbol_sec,
      data: data
    }
  });
};

var PeripheralSPI = function (Obniz, id) {
  this.Obniz = Obniz;
  this.id = id;
  this.observers = [];
};

PeripheralSPI.prototype.addObserver = function (callback) {
  if (callback) {
    this.observers.push(callback);
  }
};

PeripheralSPI.prototype.start = function (mode, clk, mosi, miso, clock_speed) {
  var obj = {};
  obj["spi" + this.id] = {
    mode: mode,
    clock: clock_speed,
    clk: clk,
    mosi: mosi,
    miso: miso
  };
  this.Obniz.send(obj);
};

PeripheralSPI.prototype.writeWait = function (data) {
  var self = this;
  return new Promise(function (resolve, reject) {
    var obj = {};
    obj["spi" + self.id] = {
      writeread: data
    };
    self.Obniz.send(obj);
    self.addObserver(resolve);
  });
};

PeripheralSPI.prototype.notified = function (obj) {
  // TODO: we should compare byte length from sent
  var callback = this.observers.shift();
  if (callback) {
    callback(obj.readed);
  }
};

var ObnizSwitch = function (Obniz) {
  this.Obniz = Obniz;
  this.observers = [];
};

ObnizSwitch.prototype.addObserver = function (callback) {
  if (callback) {
    this.observers.push(callback);
  }
};

ObnizSwitch.prototype.getWait = function () {
  var self = this;
  return new Promise(function (resolve, reject) {
    var obj = {};
    obj["switch"] = "get";
    self.Obniz.send(obj);
    self.addObserver(resolve);
  });
};

ObnizSwitch.prototype.notified = function (obj) {
  this.state = obj.state;
  if (this.onchange) {
    this.onchange(this.state);
  }
  var callback = this.observers.shift();
  if (callback) {
    callback(this.state);
  }
};

var PeripheralUART = function (Obniz, id) {
  this.Obniz = Obniz;
  this.id = id;
  this.received = new Uint8Array([]);
};

PeripheralUART.prototype.start = function (tx, rx, baud, stop, bits, parity, flowcontrol, rts, cts) {
  var obj = {};
  obj["uart" + this.id] = {
    tx: tx,
    rx: rx
  };
  if (baud) {
    obj["uart" + this.id].baud = baud;
  }
  if (stop) {
    obj["uart" + this.id].stop = stop;
  }
  if (bits) {
    obj["uart" + this.id].bits = bits;
  }
  if (parity) {
    obj["uart" + this.id].parity = parity;
  }
  if (flowcontrol) {
    obj["uart" + this.id].flowcontrol = flowcontrol;
  }
  if (rts) {
    obj["uart" + this.id].rts = rts;
  }
  if (flowcontrol) {
    obj["uart" + this.id].cts = cts;
  }
  this.Obniz.send(obj);
  this.received = new Uint8Array([]);
};

// node only
PeripheralUART.prototype.send = function (data) {
  var send_data = null;
  var key = "data";
  if (typeof data === "number") {
    data = [data];
  }
  if (isNode && data instanceof Buffer) {
    var arr = new Array(data.byteLength);
    for (var i = 0; i < arr.length; i++) {
      arr[i] = data[i];
    }
    send_data = arr;
  } else if (data.constructor === Array) {
    send_data = data;
  } else if (typeof data === "string") {
    key = "text";
    send_data = data;
  } else if (typeof data === "object" && data !== null) {
    key = "text";
    send_data = JSON.stringify(data);
  }
  var obj = {};
  obj["uart" + this.id] = {};
  obj["uart" + this.id][key] = send_data;
  this.Obniz.send(obj);
};

PeripheralUART.prototype.readtext = function () {
  var string = null;
  try {
    if (this.received && this.received.length > 0) {
      string = "";
      for (var i = 0; i < this.received.length; i++) {
        string += new TextDecoder("utf-8").decode(new Uint8Array(this.received[i]));
      }
    }
  } catch (e) {}
  this.received = [];
  return string;
};

PeripheralUART.prototype.notified = function (obj) {
  if (this.onreceive) {
    var string = null;
    try {
      string = new TextDecoder("utf-8").decode(new Uint8Array(obj.data));
    } catch (e) {}
    this.onreceive(obj.data, string);
  } else {
    if (!this.received) {
      this.received = [];
    }
    this.received.push.apply(this.received, obj.data);
  }
};

PeripheralUART.prototype.end = function () {
  var obj = {};
  obj["uart" + this.id] = null;
  this.Obniz.send(obj);
};
var _24LC256 = function () {};

_24LC256.prototype.wired = function (obniz, pin0, pin1, pin2, pin3, pin4, pin5, pin6, pin7) {
  this.obniz = obniz;
  this.io_a0 = obniz.getIO(pin0);
  this.io_a1 = obniz.getIO(pin1);
  this.io_a2 = obniz.getIO(pin2);
  this.io_vss = obniz.getIO(pin3);
  this.io_sda = obniz.getIO(pin4);
  this.io_scl = obniz.getIO(pin5);
  this.io_wp = obniz.getIO(pin6);
  this.io_vcc = obniz.getIO(pin7);

  this.io_a0.output(false);
  this.io_a1.output(false);
  this.io_a2.output(false);
  this.io_vss.output(false);
  this.io_wp.output(false);
  this.io_vcc.output(true);

  this.i2c = obniz.getFreeI2C();
  this.i2c.start("master", pin4, pin5, 100000, "pullup");
};

// Module functions

_24LC256.prototype.set = function (start_address, data) {
  var array = [];
  array.push(start_address >> 8 & 0xFF);
  array.push(start_address & 0xFF);
  array.push.apply(array, data);
  obniz.i2c0.write(0x50, array);
};

_24LC256.prototype.get = (() => {
  var _ref5 = _asyncToGenerator(function* (address, length) {
    var array = [];
    array.push(start_address >> 8 & 0xFF);
    array.push(start_address & 0xFF);
    obniz.i2c0.write(0x50, array);
    return yield obniz.i2c0.readWait(0x50, length);
  });

  return function (_x3, _x4) {
    return _ref5.apply(this, arguments);
  };
})();

if (PartsRegistrate) {
  PartsRegistrate("24LC256", _24LC256);
}
var Button = function () {};

Button.prototype.wired = function (obniz, signal, supply) {
  this.obniz = obniz;
  this.io_signal = obniz.getIO(signal);

  if (supply) {
    this.io_supply = obniz.getIO(supply);
    this.io_supply.output(false);
  }

  // start input
  this.io_signal.pullup();
};

// Module functions

Button.prototype.onChange = function (callback) {
  this.onchange = callback;
  var self = this;
  this.io_signal.input(function (value) {
    self.isPressed = value == false;
    if (self.onchange) {
      self.onchange(value == false);
    }
  });
};

Button.prototype.isPressedWait = _asyncToGenerator(function* () {
  var self = this;
  var ret = yield this.io_signal.inputWait();
  return ret == false;
});

if (PartsRegistrate) {
  PartsRegistrate("Button", Button);
}
var DCMotor = function () {};

DCMotor.prototype.wired = function (obniz, io_a, io_b) {
  this.obniz = obniz;
  this.status = {
    direction: null,
    power: null
  };

  this.pwm1_io_num = io_a;
  this.pwm2_io_num = io_b;

  this.pwm1 = obniz.getpwm();
  this.pwm1.start(this.pwm1_io_num);
  this.pwm1.freq(100000);
  this.pwm2 = obniz.getpwm();
  this.pwm2.start(this.pwm2_io_num);
  this.pwm2.freq(100000);
  this.power(30);
  this.pwm1.forceWorking(true);
  this.pwm2.forceWorking(true);
};

// Module functions

DCMotor.prototype.forward = function () {
  this.move(true);
};

DCMotor.prototype.reverse = function () {
  this.move(false);
};

DCMotor.prototype.stop = function () {
  if (this.status.direction === null) {
    return;
  }
  this.status.direction = null;
  this.pwm1.duty(0);
  this.pwm2.duty(0);
};

DCMotor.prototype.move = function (forward) {
  if (forward) {
    if (this.status.direction === true) {
      return;
    }
    this.status.direction = true;
  } else {
    if (this.status.direction === false) {
      return;
    }
    this.status.direction = false;
  }
  var power = this.power();
  this.power(0);
  this.power(power);
};

DCMotor.prototype.power = function (power) {
  if (power === undefined) {
    return this.status.power;
  }
  this.status.power = power;
  if (this.status.direction === null) {
    this.pwm1.duty(0);
    this.pwm2.duty(0);
    return;
  }
  if (this.status.direction) {
    this.pwm1.duty(power);
    this.pwm2.duty(0);
  } else {
    this.pwm1.duty(0);
    this.pwm2.duty(power);
  }
};

if (PartsRegistrate) {
  PartsRegistrate("DCMotor", DCMotor);
}
var PIR_ekmc = function () {};

PIR_ekmc.prototype.wired = function (obniz, pwr, signal, gnd) {
  this.obniz = obniz;
  this.io_pwr = obniz.getIO(pwr);
  this.io_gnd = obniz.getIO(gnd);
  this.io_signal = obniz.getIO(signal);

  this.io_pwr.output(true);
  this.io_signal.pulldown();
  if (gnd) {
    this.io_gnd = obniz.getIO(gnd);
    this.io_gnd.output(false);
  }
};

// Module functions

PIR_ekmc.prototype.onChange = function (callback) {
  this.onchange = callback;
  var self = this;
  this.io_signal.input(function (value) {
    self.isPressed = value == false;
    if (self.onchange) {
      self.onchange(value == false);
    }
  });
};

PIR_ekmc.prototype.isPressedWait = _asyncToGenerator(function* () {
  var self = this;
  var ret = yield this.io_signal.inputWait();
  return ret == false;
});

if (PartsRegistrate) {
  PartsRegistrate("PIR_ekmc", PIR_ekmc);
}
var HCSR04 = function () {};

HCSR04.prototype.wired = function (obniz, vcc, triger, echo, gnd) {
  this.obniz = obniz;

  this.gndIO = obniz.getIO(gnd);
  this.vccIO = obniz.getIO(vcc);
  this.triger = triger;
  this.echo = echo;

  this.gndIO.output(false);

  this.unit = "mm";
};

HCSR04.prototype.measure = (() => {
  var _ref8 = _asyncToGenerator(function* (callback) {

    this.vccIO.output(true);
    yield this.obniz.wait(10);
    var self = this;
    this.obniz.measure.echo(this.triger, "positive", 0.02, this.echo, 2, 10 / 340 * 1000, function (edges) {
      self.vccIO.output(false);
      self.obniz.getIO(self.triger).output(false);
      self.obniz.getIO(self.echo).output(false);
      var distance = null;
      if (edges.length == 2) {
        distance = (edges[1].timing - edges[0].timing) * 1000;
        if (self.unit === "mm") {
          distance = distance / 5.8;
        } else if (self.unit === "inch") {
          distance = distance / 148.0;
        }
      }
      if (typeof callback === "function") {
        callback(distance);
      }
    });
  });

  return function (_x5) {
    return _ref8.apply(this, arguments);
  };
})();

HCSR04.prototype.unit = function (unit) {
  if (unit === "mm") {
    this.unit = "mm";
  } else if (unit === "inch") {
    this.unit = "inch";
  } else {
    throw new Error("HCSR04: unknown unit " + unit);
  }
};

// Module functions

if (PartsRegistrate) {
  PartsRegistrate("HC-SR04", HCSR04);
}
var JoyStick = function () {};

JoyStick.prototype.wired = function (obniz, sig_sw, sig_y, sig_x, pwr, gnd) {
  this.obniz = obniz;
  this.io_pwr = obniz.getIO(pwr);
  this.io_gnd = obniz.getIO(gnd);
  this.io_sig_sw = obniz.getIO(sig_sw);
  this.ad_x = obniz.getAD(sig_y);
  this.ad_y = obniz.getAD(sig_x);

  this.io_pwr.output(true);
  this.io_gnd.output(false);
  this.io_sig_sw.pullup();

  var self = this;
  this.ad_x.start(function (value) {
    self.positionX = value / 5.0;
    if (self.onchangeX) {
      self.onchangeX(self.positionX);
    }
  });

  this.ad_y.start(function (value) {
    self.positionY = value / 5.0;
    if (self.onchangeY) {
      self.onchangeY(self.positionY);
    }
  });
};

// Module functions
JoyStick.prototype.onChangeX = function (callback) {
  this.onchangeX = callback;
};

JoyStick.prototype.onChangeY = function (callback) {
  this.onchangeY = callback;
};

JoyStick.prototype.onChangeSW = function (callback) {
  this.onchangeSW = callback;
  var self = this;
  this.io_sig_sw.input(function (value) {
    self.isPressed = value == false;
    if (self.onchangeSW) {
      self.onchangeSW(value == false);
    }
  });
};

JoyStick.prototype.isPressedWait = _asyncToGenerator(function* () {
  var self = this;
  var ret = yield this.io_sig_sw.inputWait();
  return ret == false;
});

if (PartsRegistrate) {
  PartsRegistrate("JoyStick", JoyStick);
}
var KXSC7_2050 = function () {};

KXSC7_2050.prototype.wired = (() => {
  var _ref10 = _asyncToGenerator(function* (obniz, pwr, sig_x, sig_y, sig_z, gnd) {
    this.obniz = obniz;
    this.io_pwr = obniz.getIO(pwr);
    this.io_gnd = obniz.getIO(gnd);
    this.ad_x = obniz.getAD(sig_x);
    this.ad_y = obniz.getAD(sig_y);
    this.ad_z = obniz.getAD(sig_z);

    this.io_pwr.input();
    this.io_pwr.outputType("push-pull3v");
    this.io_pwr.output(true);
    if (gnd) {
      this.io_gnd = obniz.getIO(gnd);
      this.io_gnd.output(false);
    }

    yield obniz.wait(500);
    var ad = obniz.getAD(pwr);
    var pwrVoltage = yield ad.getWait();
    console.log(pwrVoltage);
    var horizontalZ = yield this.ad_z.getWait();
    console.log(horizontalZ);
    var sensitivity = pwrVoltage / 5; //Set sensitivity (unit:V)
    var offsetVoltage = horizontalZ - sensitivity; //Set offset voltage (Output voltage at 0g, unit:V)

    var self = this;
    this.ad_x.start(function (value) {
      self.gravity = (value - offsetVoltage) / sensitivity;
      if (self.onchangeX) {
        self.onchangeX(self.gravity);
      }
    });

    this.ad_y.start(function (value) {
      self.gravity = (value - offsetVoltage) / sensitivity;
      if (self.onchangeY) {
        self.onchangeY(self.gravity);
      }
    });

    this.ad_z.start(function (value) {
      self.gravity = (value - offsetVoltage) / sensitivity;
      if (self.onchangeZ) {
        self.onchangeZ(self.gravity);
      }
    });
  });

  return function (_x6, _x7, _x8, _x9, _x10, _x11) {
    return _ref10.apply(this, arguments);
  };
})();

// Module functions
KXSC7_2050.prototype.onChangeX = function (callback) {
  this.onchangeX = callback;
};

KXSC7_2050.prototype.onChangeY = function (callback) {
  this.onchangeY = callback;
};

KXSC7_2050.prototype.onChangeZ = function (callback) {
  this.onchangeZ = callback;
};

if (PartsRegistrate) {
  PartsRegistrate("KXSC7_2050", KXSC7_2050);
}
var LED = function () {};

LED.prototype.wired = function (obniz, anode, cathode) {
  this.obniz = obniz;
  this.io_anode = obniz.getIO(anode);
  if (cathode) {
    this.io_cathode = obniz.getIO(cathode);
    this.io_cathode.output(false);
  }
};

// Module functions

LED.prototype.on = function () {
  this.endBlink();
  this.io_anode.output(true);
};

LED.prototype.off = function () {
  this.endBlink();
  this.io_anode.output(false);
};

LED.prototype.endBlink = function () {
  if (this.blink_timer) {
    clearInterval(this.blink_timer);
    this.blink_timer = null;
  }
};

LED.prototype.blink = function (interval) {
  this.endBlink();
  if (!interval) {
    interval = 100;
  }
  var val = false;
  var self = this;
  this.blink_timer = setInterval(function () {
    self.io_anode.output(val);
    val = !val;
  }, interval);
};

if (PartsRegistrate) {
  PartsRegistrate("LED", LED);
}

var LM35DZ = function () {};

LM35DZ.prototype.wired = function (obniz, pwr, signal, gnd) {
  this.obniz = obniz;
  this.io_pwr = obniz.getIO(pwr);
  this.io_gnd = obniz.getIO(gnd);
  this.ad = obniz.getAD(signal);

  this.io_pwr.output(true);
  if (gnd) {
    this.io_gnd = obniz.getIO(gnd);
    this.io_gnd.output(false);
  }

  var self = this;
  this.ad.start(function (value) {
    self.temp = value * 100; //Temp(Celsius) = [AD Voltage] * 100
    if (self.onchange) {
      self.onchange(self.temp);
    }
  });
};

LM35DZ.prototype.onChange = function (callback) {
  this.onchange = callback;
};

if (PartsRegistrate) {
  PartsRegistrate("LM35DZ", LM35DZ);
}

var LM60 = function () {};

LM60.prototype.wired = function (obniz, pwr, signal, gnd) {
  this.obniz = obniz;
  this.io_pwr = obniz.getIO(pwr);
  this.io_gnd = obniz.getIO(gnd);
  this.ad = obniz.getAD(signal);

  this.io_pwr.output(true);
  if (gnd) {
    this.io_gnd = obniz.getIO(gnd);
    this.io_gnd.output(false);
  }

  var self = this;
  this.ad.start(function (value) {
    console.log(value);
    self.temp = Math.round((value - 0.424) / 0.00625 * 10) / 10; //Temp(Celsius) = ([AD Voltage]-[Voltage at 0 deg(Offset voltage)])/[Temp coefficient]
    if (self.onchange) {
      self.onchange(self.temp);
    }
  });
};

LM60.prototype.onChange = function (callback) {
  this.onchange = callback;
};

if (PartsRegistrate) {
  PartsRegistrate("LM60", LM60);
}

var LM61 = function () {};

LM61.prototype.wired = function (obniz, pwr, signal, gnd) {
  this.obniz = obniz;
  this.io_pwr = obniz.getIO(pwr);
  this.io_gnd = obniz.getIO(gnd);
  this.ad = obniz.getAD(signal);

  this.io_pwr.output(true);
  if (gnd) {
    this.io_gnd = obniz.getIO(gnd);
    this.io_gnd.output(false);
  }

  var self = this;
  this.ad.start(function (value) {
    self.temp = Math.round((value - 0.6) / 0.01); //Temp(Celsius) = ([AD Voltage]-[Voltage at 0 deg(Offset voltage)])/[Temp coefficient]
    if (self.onchange) {
      self.onchange(self.temp);
    }
  });
};

LM61.prototype.onChange = function (callback) {
  this.onchange = callback;
};

if (PartsRegistrate) {
  PartsRegistrate("LM61", LM61);
}

var MCP9700 = function () {};

MCP9700.prototype.wired = function (obniz, pwr, signal, gnd) {
  this.obniz = obniz;
  this.io_pwr = obniz.getIO(pwr);
  this.io_gnd = obniz.getIO(gnd);
  this.ad = obniz.getAD(signal);

  this.io_pwr.output(true);
  if (gnd) {
    this.io_gnd = obniz.getIO(gnd);
    this.io_gnd.output(false);
  }

  var self = this;
  this.ad.start(function (value) {
    self.temp = (value - 0.5) / 0.01; //Temp(Celsius) = ([AD Voltage]-[Voltage at 0 deg])/[Temp coefficient]
    if (self.onchange) {
      self.onchange(self.temp);
    }
  });
};

MCP9700.prototype.onChange = function (callback) {
  this.onchange = callback;
};

if (PartsRegistrate) {
  PartsRegistrate("MCP9700", MCP9700);
}

var MCP9701 = function () {};

MCP9701.prototype.wired = function (obniz, pwr, signal, gnd) {
  this.obniz = obniz;
  this.io_pwr = obniz.getIO(pwr);
  this.io_gnd = obniz.getIO(gnd);
  this.ad = obniz.getAD(signal);

  this.io_pwr.output(true);
  if (gnd) {
    this.io_gnd = obniz.getIO(gnd);
    this.io_gnd.output(false);
  }

  var self = this;
  this.ad.start(function (value) {
    self.temp = (value - 0.4) / 0.0195; //Temp(Celsius) = ([AD Voltage]-[Voltage at 0 deg])/[Temp coefficient]
    if (self.onchange) {
      self.onchange(self.temp);
    }
  });
};

MCP9701.prototype.onChange = function (callback) {
  this.onchange = callback;
};

if (PartsRegistrate) {
  PartsRegistrate("MCP9701", MCP9701);
}

var PotentionMeter = function () {};

PotentionMeter.prototype.wired = function (obniz, pwr, signal, gnd) {
  this.obniz = obniz;
  this.io_pwr = obniz.getIO(pwr);
  this.ad = obniz.getAD(signal);
  this.io_gnd = obniz.getIO(gnd);

  this.io_pwr.output(true);
  this.io_gnd.output(false);

  var self = this;
  this.ad.start(function (value) {
    self.position = value / 5.0;
    if (self.onchange) {
      self.onchange(self.position);
    }
  });
};

// Module functions

PotentionMeter.prototype.onChange = function (callback) {
  this.onchange = callback;
};

if (PartsRegistrate) {
  PartsRegistrate("PotentionMeter", PotentionMeter);
}
var RN42 = function () {};

RN42.prototype.wired = function (obniz, tx_obniz_to_rn42, rx_obniz_from_rn42, gnd) {
  this.obniz = obniz;

  if (typeof gnd == "number") {
    obniz.getIO(gnd).output(false);
  }

  this.uart = obniz.uart0;

  obniz.getIO(tx_obniz_to_rn42).outputType("push-pull3v");
  this.uart.start(tx_obniz_to_rn42, rx_obniz_from_rn42, 115200);
  var self = this;
  this.uart.onreceive = function (data, text) {
    // this is not perfect. separation is possible.
    if (text.indexOf("CONNECT") >= 0) {
      console.log("connected");
    } else if (text.indexOf("DISCONNECT") >= 0) {
      console.log("disconnected");
    }
    if (typeof self.onreceive == "function") {
      self.onreceive(data, text);
    }
  };
};

RN42.prototype.send = function (data) {
  this.uart.send(data);
};

RN42.prototype.sendCommand = function (data) {
  this.uart.send(data + '\n');
  this.obniz.freeze(100);
};

RN42.prototype.enterCommandMode = function () {
  this.send('$$$');
  this.obniz.freeze(100);
};

RN42.prototype.config = function (json) {
  this.enterCommandMode();
  if (typeof json !== "object") {
    // TODO: warning
    return;
  }
  // remove noize data
  this.sendCommand("");

  if (json.master_slave) {
    this.config_masterslave(json.master_slave);
  }
  if (json.auth) {
    this.config_auth(json.auth);
  }
  if (json.hid_flag) {
    this.config_HIDflag(json.hid_flag);
  }
  if (json.profile) {
    this.config_profile(json.profile);
  }
  if (json.power) {
    this.config_power(json.power);
  }
  if (json.display_name) {
    this.config_displayName(json.display_name);
  }
  this.config_reboot();
};

RN42.prototype.config_reboot = function () {
  this.sendCommand('R,1');
};

RN42.prototype.config_masterslave = function (mode) {
  var val = -1;
  if (typeof mode == "number") {
    val = mode;
  } else if (typeof mode === "string") {
    var modes = ["slave", "master", "trigger", "auto-connect-master", "auto-connect-dtr", "auto-connect-any", "pairing"];
    for (var i = 0; i < modes.length; i++) {
      if (modes[i] === mode) {
        val = i;
        break;
      }
    }
  }
  if (val === -1) {
    // TODO: warning
    return;
  }
  this.sendCommand('SM,' + val);
};

RN42.prototype.config_displayName = function (name) {
  this.sendCommand('SN,' + name);
};

// // SH,0200 HID Flag register. Descriptor=keyboard
RN42.prototype.config_HIDflag = function (flag) {
  this.sendCommand('SH,' + flag);
};

RN42.prototype.config_profile = function (mode) {
  var val = -1;
  if (typeof id == "number") {
    val = mode;
  } else if (typeof mode === "string") {
    var modes = ["SPP", "DUN-DCE", "DUN-DTE", "MDM-SPP", "SPP-DUN-DCE", "APL", "HID"];
    for (var i = 0; i < modes.length; i++) {
      if (modes[i] === mode) {
        val = i;
        break;
      }
    }
  }
  if (val === -1) {
    // TODO: warning
    return;
  }
  this.sendCommand('S~,' + val);
};

RN42.prototype.config_revert_localecho = function () {
  this.sendCommand('+');
};

RN42.prototype.config_auth = function (mode) {
  var val = -1;
  if (typeof mode == "number") {
    val = mode;
  } else if (typeof mode === "string") {
    var modes = ["open", "ssp-keyboard", "just-work", "pincode"];
    for (var i = 0; i < modes.length; i++) {
      if (modes[i] === mode) {
        val = i;
        break;
      }
    }
  }
  if (val === -1) {
    // TODO: warning
    return;
  }
  this.sendCommand('SA,' + val);
};

RN42.prototype.config_power = function (dbm) {

  var val = "0010";
  if (16 > dbm && dbm >= 12) {
    val = "000C";
  } else if (12 > dbm && dbm >= 8) {
    val = "0008";
  } else if (8 > dbm && dbm >= 4) {
    val = "0004";
  } else if (4 > dbm && dbm >= 0) {
    val = "0000";
  } else if (0 > dbm && dbm >= -4) {
    val = "FFFC";
  } else if (-4 > dbm && dbm >= -8) {
    val = "FFF8";
  } else if (-8 > dbm) {
    val = "FFF4";
  }

  this.sendCommand('SY,' + val);
};

RN42.prototype.config_get_setting = function () {
  this.sendCommand('D');
};

RN42.prototype.config_get_extendSetting = function () {
  this.sendCommand('E');
};

// Module functions

if (PartsRegistrate) {
  PartsRegistrate("RN42", RN42);
}
//センサから出力が無い(出力インピーダンス高すぎ？)
var S8100B = function () {};

S8100B.prototype.wired = function (obniz, pwr, signal, gnd) {
  this.obniz = obniz;
  this.io_pwr = obniz.getIO(pwr);
  this.io_gnd = obniz.getIO(gnd);
  this.ad = obniz.getAD(signal);

  this.io_pwr.output(true);
  if (gnd) {
    this.io_gnd = obniz.getIO(gnd);
    this.io_gnd.output(false);
  }

  var self = this;
  this.ad.start(function (value) {
    self.temp = 30 + (1.508 - value) / -0.08; //Temp(Celsius) =
    if (self.onchange) {
      self.onchange(self.temp);
    }
  });
};

S8100B.prototype.onChange = function (callback) {
  this.onchange = callback;
};

if (PartsRegistrate) {
  PartsRegistrate("S8100B", S8100B);
}

var SHT31 = function () {};

SHT31.prototype.wired = function (obniz, pwr, sda, scl, gnd, adr, adr_select) {
  this.obniz = obniz;
  this.io_pwr = obniz.getIO(pwr);
  this.io_gnd = obniz.getIO(gnd);
  this.io_sda = obniz.getIO(sda);
  this.io_scl = obniz.getIO(scl);
  this.io_adr = obniz.getIO(adr);

  this.io_pwr.output(true);
  if (gnd) {
    this.io_gnd = obniz.getIO(gnd);
    this.io_gnd.output(false);
  }
  if (adr_select == 4) {
    this.io_adr.output(false);
    address = 0x44;
  } else if (adr_select == 5) {
    this.io_adr.float();
    address = 0x45;
  }

  obniz.i2c0.start("master", sda, scl, 400000, "float");
  //obniz.i2c0.write(address, [0x20, 0x24]);
};

SHT31.prototype.getTempWait = _asyncToGenerator(function* () {
  obniz.i2c0.write(address, [0x20, 0x24]);
  obniz.i2c0.write(address, [0xE0, 0x00]);
  var ret = yield obniz.i2c0.readWait(address, 4);
  var tempBin = ret[0].toString(2) + ('00000000' + ret[1].toString(2)).slice(-8);
  var temperature = -45 + 175 * (parseInt(tempBin, 2) / (65536 - 1));
  return temperature;
});

SHT31.prototype.getHumdWait = _asyncToGenerator(function* () {
  obniz.i2c0.write(address, [0x20, 0x24]);
  obniz.i2c0.write(address, [0xE0, 0x00]);
  var ret = yield obniz.i2c0.readWait(address, 4);
  var humdBin = ret[2].toString(2) + ('00000000' + ret[3].toString(2)).slice(-8);
  var humidity = 100 * (parseInt(humdBin, 2) / (65536 - 1));
  return humidity;
});

if (PartsRegistrate) {
  PartsRegistrate("SHT31", SHT31);
}

var ServoMotor = function () {};

ServoMotor.prototype.wired = function (obniz, gnd, power, signal) {
  this.obniz = obniz;
  if (power == null || signal == null) {
    this.pwm_io_num = gnd;
    this.pwm = obniz.getpwm();
  } else {
    this.io_gnd = obniz.getIO(gnd);
    this.io_power = obniz.getIO(power);

    this.io_gnd.output(false);
    this.io_power.output(true);

    this.pwm = obniz.getpwm();
    this.pwm_io_num = signal;
  }
  this.pwm.start(this.pwm_io_num);
  this.pwm.freq(50);
};

// Module functions

ServoMotor.prototype.angle = function (ratio) {
  var max = 2.4;
  var min = 0.5;
  var val = (max - min) * ratio / 180.0 + min;
  this.pwm.pulse(val);
};

ServoMotor.prototype.on = function () {
  if (this.io_power) {
    this.io_power.output(true);
  }
};

ServoMotor.prototype.off = function () {
  if (this.io_power) {
    this.io_power.output(false);
  }
};

if (PartsRegistrate) {
  PartsRegistrate("ServoMotor", ServoMotor);
}
var Speaker = function () {};

Speaker.prototype.wired = function (obniz, io0, io1) {
  this.obniz = obniz;
  this.io0 = obniz.getIO(io0);
  this.pwm = obniz.getpwm();

  this.io0.output(false);
  this.pwm.start(io1);
};

// Module functions

Speaker.prototype.freq = function (freq) {
  this.pwm.freq(freq);
  this.pwm.pulse(1 / freq / 2 * 1000);
};

if (PartsRegistrate) {
  PartsRegistrate("Speaker", Speaker);
}
var USB = function () {};

USB.prototype.wired = function (obniz, vdd, gnd) {
  this.obniz = obniz;
  this.io_vdd = obniz.getIO(vdd);
  this.io_gnd = obniz.getIO(gnd);

  this.io_gnd.output(false);
};

USB.prototype.on = function () {
  this.io_vdd.output(true);
};

USB.prototype.off = function () {
  this.io_vdd.output(false);
};

if (PartsRegistrate) {
  PartsRegistrate("USB", USB);
}