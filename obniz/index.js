var isNode = (typeof window === 'undefined') ? true : false; 

Obniz = function(id, options) {
  if (isNode == false && typeof(showOffLine) === "function") {
    showOffLine();
  }
  this.id = id;
  this.socket = null;
  this.debugprint = false;
  this.debugs = [];

  this.init();

  if (!options) options = {};
  // if (isNode == false && (!id || id === "<OBNIZ ID HERE>")) {
  //   var self = this;
  //   this.prompt(function(obnizid){
  //     self.id = obnizid;
  //     self.wsconnect(options.obniz_server);
  //   })
  //   return;
  // }
  this.wsconnect(options.obniz_server)
};

Obniz.prototype.prompt = function(callback) {
  var obnizid = prompt("Please enter obniz id", "");

  if (obnizid == null || obnizid == "") {
    
  } else {
    callback(obnizid);
  }
}

Obniz.prototype.wsconnect = function(desired_server) {
  var server = "wss://obniz.io"
  if (desired_server) {
    server = ""+desired_server;
  }
  if (this.socket) {
    this.socket.close();
    this.socket = null;
  }
  var url = server+"/obniz/"+this.id+"/ws";
  this.print_debug("connecting to " + url);
  var self = this;

  var wsOnOpen = function () {
    self.print_debug("ws connected");
    if (isNode == false && typeof(showOnLine) === "function") {
      showOnLine();
    }
    if (self.onconnect)
      self.onconnect(self);
  };

  var wsOnMessage = function (data) {
    self.print_debug(data);
    var obj = {};
    if (typeof(data) == "string") {
      obj = JSON.parse(data);
    } else {
      // not treat binary
      // obj = data;
      return;
    }
    // User's defined callback
    if (self.onwsmessage != null) {
      self.onwsmessage(obj);
    }
    // notify messaging
    if (typeof(obj.message) == "object" && self.onmessage) {
      self.onmessage(obj.message.data, obj.message.from);
    }
    // debug
    if (typeof(obj.debug) == "object") {
      self.debugs.push(obj.debug);
      if (self.debugs.length > 1000) {
        self.debugs.shift();
      }
      if (self.ondebug) {
        self.ondebug(obj.debug);
      }
    }
    // notify
    var notifyHandlers = ["io", "uart", "spi", "i2c", "ad"];
    for (var handerIndex=0; handerIndex<notifyHandlers.length; handerIndex++) {
      var i=-1;
      var peripheral = notifyHandlers[handerIndex];
      while(true) {
        i++;
        if (self[peripheral+""+i] == undefined) { break; }
        var module_value = obj[peripheral+""+i];
        if (module_value === undefined)continue;
        self[peripheral+""+i].notified(module_value);
      }
    }
    // notify logiana
    if (obj["logicanalyzer"]) {
      self["logicanalyzer"].notified(obj["logicanalyzer"]);
    }
  };

  var wsOnClose = function(event) {
    self.print_debug("closed");
    if (isNode == false && typeof(showOffLine) === "function") {
      showOffLine();
    }
    if (self.looper) {
      self.looper = null;
    }
    if(self.onclose) {
      self.onclose(self);
    }
    self.socket = null;
    setTimeout(function(){
      self.wsconnect(desired_server);
    }, 1000);
  };

  var wsOnError = function(err){
    console.error(err);
  };

  if (isNode) {
    WebSocket = require('ws');
    this.socket = new WebSocket(url);
    this.socket.on('open', wsOnOpen);
    this.socket.on('message', wsOnMessage);
    this.socket.on('close', wsOnClose);
    this.socket.on('error', wsOnError);
  } else {
    this.socket = new WebSocket(url);
    this.socket.onopen = wsOnOpen;
    this.socket.onmessage = function(event) {
      wsOnMessage(event.data);
    }
    this.socket.onclose = wsOnClose;
    this.socket.onerror = wsOnError;
  }
};

Obniz.prototype.close = function() {
  if (this.socket) {
    this.socket.close(1000, 'close');
  }
};

Obniz.prototype.wired = function(partsname) {
  var parts = new _parts[partsname]();
  if (!parts) {
    throw new Error("No such a parts ["+partsname+"] found");
    return;
  }
  var args = Array.from(arguments);
  args.shift();
  args.unshift(this);
  parts.wired.apply(parts, args);
  return parts
}

Obniz.prototype.print_debug = function(str) {
  if (this.debugprint) {
    console.log("Obniz: "+ str);
  }
};

Obniz.prototype.console_log = function(obj) {
  this.send({
    debug:{
      log: obj
    }
  });
};

Obniz.prototype.console_exception = function(err) {
  this.send({
    debug:{
      exception: err
    }
  });
};

Obniz.prototype.send = function(value) {
  if (typeof(value) == "object") {
    value = JSON.stringify(value);
  }
  this.print_debug("send: "+value);
  this.socket.send(value);
};

Obniz.prototype.init = function() {
  // IO
  for (var i=0; i<=11; i++) { this["io"+i]  = new PeripheralIO(this, i); }
  // AD
  for (var i=0; i<=11; i++) { this["ad"+i]  = new PeripheralAD(this, i); }
  // UART
  for (var i=0; i<=1; i++) { this["uart"+i] = new PeripheralUART(this, i); }
  // SPI
  for (var i=0; i<=0; i++) { this["spi"+i]  = new PeripheralSPI(this, i); }
  // I2C
  for (var i=0; i<=0; i++) { this["i2c"+i]  = new PeripheralI2C(this, i); }
  // PWM
  for (var i=0; i<=5; i++) { this["pwm"+i]  = new PeripheralPWM(this, i); }
  // Display
  this["display"] = new Display(this);
  this["logicanalyzer"] = new LogicAnalyzer(this);
  this["ble"] = new Ble(this);
}

Obniz.prototype.getIO = function(id) {
  return this["io"+id];
}

Obniz.prototype.getAD = function(id) {
  return this["ad"+id];
}

Obniz.prototype.getpwm = function() {
  var i=0;
  while(true){
    var pwm = this["pwm"+i];
    if (pwm == null) {
      break;
    }
    if (pwm.state.io == null) {
      return pwm;
    }
    i++;
  }
  throw new Error("No More PWM Available. max = " + i);
}

Obniz.prototype.getFreeI2C = function() {
  var i=0;
  while(true){
    var pwm = this["i2c"+i];
    if (pwm == null) {
      break;
    }
    if (pwm.state.io == null) {
      return pwm;
    }
    i++;
  }
  throw new Error("No More PWM Available. max = " + i);
}

Obniz.prototype.message = function(target, message) {
  var targets = [];
  if (typeof(target) == "string") {
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
}

// --- System ---
Obniz.prototype.reset = function() {
  this.send({
    system: {
      reset: true
    }
  })
  this.init();
}

Obniz.prototype.selfCheck = function() {
  this.send({
    system: {
      self_check: true
    }
  })
}

Obniz.prototype.repeat = function(callback, interval) {
  if (this.looper) {
    this.looper = callback;
    return;
  }
  this.looper = callback;
  var self = this;
  if (!interval) interval = 100;
  async function loop() {
    if (typeof (self.looper) == "function") {
      await self.looper();
      setTimeout(loop, interval);
    }
  }
  loop();
}

Obniz.prototype.wait = async function(msec) {
  return new Promise(resolve => setTimeout(resolve, msec));
}

/*===================*/
/* Parts */
/*===================*/
var _parts = {};

PartsRegistrate = function(name, obj) {
  _parts[name] = obj;
};

Parts = function(name) {
  return new _parts[name]();
};

/*===================*/
/* Export */
/*===================*/
if (isNode) {
  module.exports = Obniz;
}

// --- peripheral IO ---
PeripheralIO = function(Obniz, id) {
  this.Obniz = Obniz;
  this.id = id;
  this.value = 0;
  this.observers = [];
};

PeripheralIO.prototype.addObserver = function(callback) {
  if(callback) {
    this.observers.push(callback);
  }
}

PeripheralIO.prototype.output = function(value) {
  var obj = {};
  obj["io"+this.id] = value;
  this.value = value;
  this.Obniz.send(obj);
}

PeripheralIO.prototype.outputType = function(type) {
  var obj = {};
  obj["io"+this.id] = {
    output_type: type
  };
  this.Obniz.send(obj);
}

PeripheralIO.prototype.pullType = function(type) {
  var obj = {};
  obj["io"+this.id] = {
    pull_type: type
  };
  this.Obniz.send(obj);
}

PeripheralIO.prototype.pullup5v = function(type) {
  this.pullType("pullup5v")
}

PeripheralIO.prototype.pullup = function(type) {
  this.pullType("pullup")
}

PeripheralIO.prototype.pulldown = function(type) {
  this.pullType("pulldown")
}

PeripheralIO.prototype.float = function(type) {
  this.pullType("float")
}

PeripheralIO.prototype.input = function(callback) {
  this.onchange = callback;
  var obj = {};
  obj["io"+this.id] = {
    direction: "input",
    stream: true
  }
  this.Obniz.send(obj);
  return this.value;
}

PeripheralIO.prototype.inputWait = function() {
  var self = this;
  return new Promise(function(resolve, reject){
    var obj = {};
    obj["io"+self.id] = {
      direction: "input",
      stream: false
    }
    self.Obniz.send(obj);
    self.addObserver(resolve);
  });
}

PeripheralIO.prototype.notified = function(obj) {
  this.value = obj;
  var callback = this.observers.shift();
  if (callback) {
    callback(obj);
  }
  if (typeof(this.onchange) === "function") {
    this.onchange(obj);
  }
}

// --- peripheral PWM ---
PeripheralPWM = function(Obniz, id) {
  this.Obniz = Obniz;
  this.id = id;
  this.state = {};
};

PeripheralPWM.prototype.sendWS = function(obj) {
  var wsObj = {};
  wsObj["pwm"+this.id] = obj
  this.Obniz.send(wsObj);
}

PeripheralPWM.prototype.start = function(io) {
  var obj = {};
  this.state.io = io;
  this.sendWS({
    io: io
  });
}

PeripheralPWM.prototype.freq = function(freq) {
  var obj = {};
  this.state.freq = freq;
  this.sendWS({
    freq: freq
  });
}

PeripheralPWM.prototype.pulse = function(pulse_width) {
  var obj = {};
  this.state.pulse = pulse_width;
  this.sendWS({
    pulse: pulse_width
  });
}

PeripheralPWM.prototype.duty = function(duty) {
  var obj = {};
  this.state.duty = duty;
  this.sendWS({
    duty: duty
  });
}

PeripheralPWM.prototype.forceWorking = function(working) {
  var obj = {};
  this.state.forceWorking = working;
  this.sendWS({
    force_working: working
  });
}

PeripheralPWM.prototype.end = function() {
  var obj = {};
  this.state = {};
  this.sendWS(null);
}

PeripheralPWM.prototype.modulate = function(type, symbol_sec, data) {
  var obj = {};
  this.sendWS({
    modulate: {
      type: type,
      symbol_sec: symbol_sec,
      data: data
    }
  });
}

// --- peripheral uart ---

PeripheralUART = function(Obniz, id) {
  this.Obniz = Obniz;
  this.id = id;
  this.received = new Uint8Array([]);
};

PeripheralUART.prototype.start = function(tx, rx, baud, stop, bits, parity, flowcontrol, rts, cts) {
  var obj = {};
  obj["uart"+this.id] = {
    tx: tx,
    rx: rx
  };
  if (baud) {
    obj["uart"+this.id].baud = baud;
  }
  if (stop) {
    obj["uart"+this.id].stop = stop;
  }
  if (bits) {
    obj["uart"+this.id].bits = bits;
  }
  if (parity) {
    obj["uart"+this.id].parity = parity;
  }
  if (flowcontrol) {
    obj["uart"+this.id].flowcontrol = flowcontrol;
  }
  if (rts) {
    obj["uart"+this.id].rts = rts;
  }
  if (flowcontrol) {
    obj["uart"+this.id].cts = cts;
  }
  this.Obniz.send(obj);
  this.received = new Uint8Array([]);
}

// node only
PeripheralUART.prototype.send = function(data) {
  var send_data = null;
  var key = "data";
  if (typeof(data) === "number") {
    data = [data];
  }
  if (isNode && data instanceof Buffer) {
    var arr = new Array(data.byteLength);
    for (var i=0; i<arr.length;i++) {
      arr[i] = data[i];
    }
    send_data = arr;
  } else if (data.constructor === Array) {
    send_data = data
  } else if (typeof(data) === "string") {
    key = "text";
    send_data = data;
  } else if (typeof(data) === "object" && data != null) {
    key = "text";
    send_data = JSON.stringify(data);
  }
  var obj = {};
  obj["uart"+this.id] = {};
  obj["uart"+this.id][key] = send_data;
  this.Obniz.send(obj);
}

PeripheralUART.prototype.readtext = function() {
  var string = null;
  try {
    string = new TextDecoder("utf-8").decode(new Uint8Array(obj.data));
  }catch(e) {
    
  }
  this.received = [];
  return string;
}

PeripheralUART.prototype.notified = function(obj) {
  if (this.onreceive) {
    var string = null;
    try {
      string = new TextDecoder("utf-8").decode(new Uint8Array(obj.data));
    }catch(e) {
      
    }
    this.onreceive(obj.data, string);
  } else {
    if (!this.received) {
      this.received = [];
    }
    this.received.push.apply(this.received, obj.data)
  }
}

PeripheralUART.prototype.end = function() {
  var obj = {};
  obj["uart"+this.id] = null;
  this.Obniz.send(obj);
}

// --- peripheral I2C ---
PeripheralSPI = function(Obniz, id) {
  this.Obniz = Obniz;
  this.id = id;
  this.observers = [];
};

PeripheralSPI.prototype.addObserver = function(callback) {
  if(callback) {
    this.observers.push(callback);
  }
}

PeripheralSPI.prototype.start = function(mode, clk, mosi, miso, clock_speed) {
  var obj = {};
  obj["spi"+this.id] = {
    mode: mode,
    clock: clock_speed,
    clk: clk,
    mosi: mosi,
    miso: miso
  };
  this.Obniz.send(obj);
}

PeripheralSPI.prototype.writeWait = function(data) {
  var self = this;
  return new Promise(function(resolve, reject){
    var obj = {};
    obj["spi"+self.id] = {
      writeread: data
    };
    self.Obniz.send(obj);
    self.addObserver(resolve);
  });
}

PeripheralSPI.prototype.notified = function(obj) {
  // TODO: we should compare byte length from sent
  var callback = this.observers.shift();
  if (callback) {
    callback(obj.readed);
  }
}

// --- peripheral I2C ---
PeripheralI2C = function(Obniz, id) {
  this.Obniz = Obniz;
  this.id = id;
  this.observers = [];
  this.state = {};
};

PeripheralI2C.prototype.addObserver = function(callback) {
  if(callback) {
    this.observers.push(callback);
  }
}

PeripheralI2C.prototype.start = function(mode, sda, scl, clock, pullType) {
  var obj = {};
  this.state = {
    mode: mode,
    sda: sda,
    scl: scl,
    clock: clock
  };
  if (pullType) {
    this.state.pull_type = pullType
  }
  obj["i2c"+this.id] = this.state;
  this.Obniz.send(obj);
}

PeripheralI2C.prototype.write = function(address, data) {
  var obj = {};
  obj["i2c"+this.id] = {
    address: address,
    write: data
  };
  this.Obniz.send(obj);
}

PeripheralI2C.prototype.write10bit = function(address, data) {
  return this.write(address | 0x8000, data);
}

PeripheralI2C.prototype.readWait = function(address, length) {
  var self = this;
  return new Promise(function(resolve, reject){
    var obj = {};
    obj["i2c"+self.id] = {
      address: address,
      read: length
    };
    self.Obniz.send(obj);
    self.addObserver(resolve);
  });
}

PeripheralI2C.prototype.read10bitWait = function(address, length) {
  return this.read(address | 0x8000, length);
}

PeripheralI2C.prototype.notified = function(obj) {
  // TODO: we should compare byte length from sent
  var callback = this.observers.shift();
  if (callback) {
    callback(obj.readed);
  }
}

PeripheralI2C.prototype.end = function() {
  this.state = {};
  var obj = {};
  obj["i2c"+self.id] = null;
  self.Obniz.send(obj);
}

// --- peripheral A/D ---
PeripheralAD = function(Obniz, id) {
  this.Obniz = Obniz;
  this.id = id;
  this.value = 0.0;
  this.observers = [];
};

PeripheralAD.prototype.addObserver = function(callback) {
  if(callback) {
    this.observers.push(callback);
  }
}

PeripheralAD.prototype.start = function(callback) {
  this.onchange = callback;
  var obj = {};
  obj["ad"+this.id] = {
    on: true,
    stream: true
  };
  this.Obniz.send(obj);
  return this.value;
}

PeripheralAD.prototype.getWait = function() {
  var self = this;
  return new Promise(function(resolve, reject){
    var obj = {};
    obj["ad"+self.id] = {
      on: true,
      stream: false
    };
    self.Obniz.send(obj);
    self.addObserver(resolve);
  });
}

PeripheralAD.prototype.end = function() {
  this.onchange = null;
  var obj = {};
  obj["ad"+this.id] = null;
  this.Obniz.send(obj);
  return;
}

PeripheralAD.prototype.notified = function(obj) {
  this.value = obj;
  if (this.onchange) {
    this.onchange(obj);
  }
  var callback = this.observers.shift();
  if (callback) {
    callback(obj);
  }
}

// --- Module Display ---
Display = function(Obniz) {
  this.Obniz = Obniz;
};

Display.prototype.clear = function() {
  var obj = {};
  obj["display"] = {
    clear: true
  };
  this.Obniz.send(obj);
}

Display.prototype.print = function(text) {
  var obj = {};
  obj["display"] = {
    text: text
  };
  this.Obniz.send(obj);
}

Display.prototype.qr = function(data, correction) {
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
}

// --- Module LogicAnalyzer ---
LogicAnalyzer = function(Obniz) {
  this.Obniz = Obniz;
};

LogicAnalyzer.prototype.start = function(io, interval, length) {
  var obj = {};
  obj["logicanalyzer"] = {
    io: [io],
    interval: interval,
    length: length
  };
  this.Obniz.send(obj);
  return;
}

LogicAnalyzer.prototype.end = function() {
  var obj = {};
  obj["logicanalyzer"] = null;
  this.Obniz.send(obj);
  return;
}

LogicAnalyzer.prototype.notified = function(obj) {
  if (this.onmeasured) {
    this.onmeasured(obj.measured);
  } else {
    if (this.measured == null) {
      this.measured = [];
    }
    this.measured.push(obj.measured);
  }
  return;
}

//BLE
Ble = function(Obniz) {
  this.Obniz = Obniz;
};

Ble.prototype.start = function() {
  var obj = {};
  obj["ble"] = {};
  obj["ble"]["advertisement"] = {
      "status":"start"
  };
  this.Obniz.send(obj);
  return;
}
Ble.prototype.stop = function() {
  var obj = {};
  obj["ble"] = {};
  obj["ble"]["advertisement"] = {
      "status":"stop"
  };
  this.Obniz.send(obj);
  return;
}

Ble.prototype.setAdvData = function(adv_data) {
  var obj = {};
  obj["ble"] = {};
  obj["ble"]["advertisement"] = {
      "adv_data":adv_data
  };
  this.Obniz.send(obj);
  return;
}


Ble.prototype.setScanRespData = function(scan_resp) {
  var obj = {};
  obj["ble"] = {};
  obj["ble"]["advertisement"] = {
      "scan_resp":scan_resp
  };
  this.Obniz.send(obj);
  return;
}