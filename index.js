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
  if (id === "OBNIZ ID HERE") {
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
      if (obj.debug.warning) {
        var msg = "Warning: "+obj.debug.warning;
        if (isNode){
          console.error(msg);
        } else {
          if (typeof(showObnizDebugError)=="function") {
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

Obniz.prototype.resetOnDisconnect = function(mustReset) {
  this.send({
    system: {
      reset_on_disconnect: mustReset
    }
  })
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
    if (this.received && this.received.length > 0) {
      string = "";
      for (var i=0;i<this.received.length; i++) {
        string += new TextDecoder("utf-8").decode(new Uint8Array(this.received[i]));
      }
    }
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
    text: ""+text
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
_24LC256 = function() {

};

_24LC256.prototype.wired = function(obniz, pin0, pin1, pin2, pin3, pin4, pin5, pin6, pin7) {
  this.obniz  = obniz;
  this.io_a0  = obniz.getIO(pin0);
  this.io_a1  = obniz.getIO(pin1);
  this.io_a2  = obniz.getIO(pin2);
  this.io_vss = obniz.getIO(pin3);
  this.io_sda = obniz.getIO(pin4);
  this.io_scl = obniz.getIO(pin5);
  this.io_wp  = obniz.getIO(pin6);
  this.io_vcc = obniz.getIO(pin7);

  this.io_a0.output(false);
  this.io_a1.output(false);
  this.io_a2.output(false);
  this.io_vss.output(false);
  this.io_wp.output(false);
  this.io_vcc.output(true);

  this.i2c = obniz.getFreeI2C();
  this.i2c.start("master", pin4, pin5, 100000, "pullup"); 
}

// Module functions

_24LC256.prototype.set = function(start_address, data) {
  var array = [];
  array.push((start_address >> 8) & 0xFF);
  array.push(start_address & 0xFF);
  array.push.apply(array, data);
  obniz.i2c0.write(0x50, array);
}

_24LC256.prototype.get = async function(address, length) {
  var array = [];
  array.push((start_address >> 8) & 0xFF);
  array.push(start_address & 0xFF);
  obniz.i2c0.write(0x50, array);
  return await obniz.i2c0.readWait(0x50, length);
}

if (PartsRegistrate) {
  PartsRegistrate("24LC256", _24LC256);
}
Button = function() {

};

Button.prototype.wired = function(obniz, signal, supply) {
  this.obniz = obniz;
  this.io_signal = obniz.getIO(signal);

  if (supply) {
    this.io_supply = obniz.getIO(supply);
    this.io_supply.output(false);
  }

  // start input
  this.io_signal.pullup();
}

// Module functions

Button.prototype.onChange = function(callback) {
  this.onchange = callback;
  var self = this;
  this.io_signal.input(function(value) {
    self.isPressed = (value == false);
    if (self.onchange) {
      self.onchange(value == false);
    }
  })
}

Button.prototype.isPressedWait = async function() {
  var self = this;
  var ret = await this.io_signal.inputWait();
  return ret == false;
}

if (PartsRegistrate) {
  PartsRegistrate("Button", Button);
}
DCMotor = function() {

};

DCMotor.prototype.wired = function(obniz, io_a, io_b) {
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

DCMotor.prototype.forward = function() {
  this.move(true);
};

DCMotor.prototype.reverse = function() {
  this.move(false);
};

DCMotor.prototype.stop = function() {
  if (this.status.direction === null) {
    return;
  }
  this.status.direction = null;
  this.pwm1.duty(0);
  this.pwm2.duty(0);
};

DCMotor.prototype.move = function(forward) {
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

DCMotor.prototype.power = function(power) {
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
PIR_ekmc= function() {
  
};

PIR_ekmc.prototype.wired = function(obniz, pwr, signal, gnd) {
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

PIR_ekmc.prototype.onChange = function(callback) {
  this.onchange = callback;
  var self = this;
  this.io_signal.input(function(value) {
    self.isPressed = (value == false);
    if (self.onchange) {
      self.onchange(value == false);
    }
  });
};

PIR_ekmc.prototype.isPressedWait = async function() {
  var self = this;
  var ret = await this.io_signal.inputWait();
  return ret == false;
}

if (PartsRegistrate) {
  PartsRegistrate("PIR_ekmc", PIR_ekmc);
}
JoyStick = function() {
  
};

JoyStick.prototype.wired = function(obniz, sig_sw, sig_y, sig_x, pwr, gnd) {
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
  this.ad_x.start(function(value){
    self.positionX = value/ 5.0;
    if (self.onchangeX) {
      self.onchangeX(self.positionX);
    }
  });
  
  this.ad_y.start(function(value){
    self.positionY = value/ 5.0;
    if (self.onchangeY) {
      self.onchangeY(self.positionY);
    }
  });
  
};
  
  // Module functions
JoyStick.prototype.onChangeX = function(callback) {
  this.onchangeX = callback;
};

JoyStick.prototype.onChangeY = function(callback) {
  this.onchangeY = callback;
};

JoyStick.prototype.onChangeSW = function(callback) {
  this.onchangeSW = callback;
  var self = this;
  this.io_sig_sw.input(function(value) {
    self.isPressed = (value == false);
    if (self.onchangeSW) {
      self.onchangeSW(value == false);
    }
  });
};

JoyStick.prototype.isPressedWait = async function() {
  var self = this;
  var ret = await this.io_sig_sw.inputWait();
  return ret == false;
}

  
  if (PartsRegistrate) {
  PartsRegistrate("JoyStick", JoyStick);
  }
KXSC7_2050 = function() {
  
};


KXSC7_2050.prototype.wired = function(obniz, pwr, sig_x, sig_y, sig_z, gnd) {
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
  
  var sensitivity = 0.54;  //Set sensitivity (unit:V) 0.66
  var offsetVoltage = 0.14; //Set offset voltage (Output voltage at 0g, unit:V) 1.65
      
  var self = this;
  this.ad_x.start(function(value){
    self.gravity = (value - offsetVoltage) / sensitivity ;
    if (self.onchangeX) {
      self.onchangeX(self.gravity);
    }
  });
  
  this.ad_y.start(function(value){
    self.gravity = (value - offsetVoltage) / sensitivity ;
    if (self.onchangeY) {
      self.onchangeY(self.gravity);
    }
  });
  
  this.ad_z.start(function(value){
    self.gravity = (value - offsetVoltage) / sensitivity ;
    if (self.onchangeZ) {
      self.onchangeZ(self.gravity);
    }
  });
  
};

// Module functions
KXSC7_2050.prototype.onChangeX = function(callback) {
  this.onchangeX = callback;
};

KXSC7_2050.prototype.onChangeY = function(callback) {
  this.onchangeY = callback;
};

KXSC7_2050.prototype.onChangeZ = function(callback) {
  this.onchangeZ = callback;
};


if (PartsRegistrate) {
  PartsRegistrate("KXSC7_2050", KXSC7_2050);
}
LED = function() {

};

LED.prototype.wired = function(obniz, anode, cathode) {
  this.obniz = obniz;
  this.io_anode = obniz.getIO(anode);
  if (cathode) {
    this.io_cathode = obniz.getIO(cathode);
    this.io_cathode.output(false);
  }
};

// Module functions

LED.prototype.on = function() {
  this.endBlink();
  this.io_anode.output(true);
};

LED.prototype.off = function() {
  this.endBlink();
  this.io_anode.output(false);
};

LED.prototype.endBlink = function() {
  if (this.blink_timer) {
    clearInterval(this.blink_timer);
    this.blink_timer = null;
  }
};

LED.prototype.blink = function(interval) {
  this.endBlink();
  if (!interval) {
    interval = 100;
  }
  var val = false;
  var self = this;
  this.blink_timer = setInterval(function(){
    self.io_anode.output(val);
    val = !val;
  }, interval);
};

if (PartsRegistrate) {
  PartsRegistrate("LED", LED);
}

MCP9700 = function() {
  
};

MCP9700.prototype.wired = function(obniz, pwr, signal, gnd) {
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
  this.ad.start(function(value){
    self.temp = (value-0.5)/0.01;
    if (self.onchange) {
      self.onchange(self.temp);
    }
  });
  
};

MCP9700.prototype.onChange = function(callback) {
  this.onchange = callback;
};

if (PartsRegistrate) {
  PartsRegistrate("MCP9700", MCP9700);
}
PotentionMeter = function() {
  
};

PotentionMeter.prototype.wired = function(obniz, pwr, signal, gnd) {
  this.obniz = obniz;
  this.io_pwr = obniz.getIO(pwr);
  this.ad = obniz.getAD(signal);
  this.io_gnd = obniz.getIO(gnd);

  this.io_pwr.output(true);
  this.io_gnd.output(false);

  var self = this;
  this.ad.start(function(value){
    self.position = value/ 5.0;
    if (self.onchange) {
      self.onchange(self.position);
    }
  });
}

// Module functions

PotentionMeter.prototype.onChange = function(callback) {
  this.onchange = callback;
}

if (PartsRegistrate) {
  PartsRegistrate("PotentionMeter", PotentionMeter);
}
ServoMotor = function() {

};

ServoMotor.prototype.wired = function(obniz, gnd, power, signal) {
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
}

// Module functions

ServoMotor.prototype.angle = function(ratio) {
  var max = 2.4
  var min = 0.5;
  var val = (max-min) * ratio / 180.0 + min;
  this.pwm.pulse(val);
}

ServoMotor.prototype.on = function() {
  if (this.io_power) {
    this.io_power.output(true);
  }
}

ServoMotor.prototype.off = function() {
  if (this.io_power) {
    this.io_power.output(false);
  }
}

if (PartsRegistrate) {
  PartsRegistrate("ServoMotor", ServoMotor);
}
Speaker = function() {
  
};

Speaker.prototype.wired = function(obniz, io0, io1) {
  this.obniz = obniz;
  this.io0 = obniz.getIO(io0);
  this.pwm = obniz.getpwm();

  this.io0.output(false);
  this.pwm.start(io1);
}

// Module functions

Speaker.prototype.freq = function(freq) {
  this.pwm.freq(freq);
  this.pwm.pulse(1/freq/2*1000);
}

if (PartsRegistrate) {
  PartsRegistrate("Speaker", Speaker);
}
USB = function() {
  
};

USB.prototype.wired = function(obniz, vdd, gnd) {
  this.obniz = obniz;
  this.io_vdd = obniz.getIO(vdd);
  this.io_gnd = obniz.getIO(gnd);
  
  this.io_gnd.output(false);
  
}

USB.prototype.on = function() {
  this.io_vdd.output(true);
}

USB.prototype.off = function() {
  this.io_vdd.output(false);
}

if (PartsRegistrate) {
  PartsRegistrate("USB", USB);
}