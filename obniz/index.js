/* global showObnizDebugError */

var isNode = (typeof window === 'undefined') ? true : false; 

var Obniz = function(id, options) {
  if (isNode === false && typeof(showOffLine) === "function") {
    showOffLine();
  }
  this.id = id;
  this.socket = null;
  this.debugprint = false;
  this.debugs = [];

  this.init(); 

  if (!options) options = {};
  if ((""+id).indexOf("OBNIZ") >= 0) {
    this.error("invalid obniz id");
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

Obniz.prototype.prompt = function(callback) {
  var obnizid = prompt("Please enter obniz id", "");
  if (obnizid == null || obnizid === "") {
  } else {
    callback(obnizid);
  }
};

Obniz.prototype.wsconnect = function(desired_server) {
  var server_obnizio = "wss://obniz.io";
  var server = server_obnizio;
  if (desired_server) {
    server = ""+desired_server;
  }
  if (this.socket) {
    this.socket.close();
    this.clearSocket(this.socket);
  }
  var url = server+"/obniz/"+this.id+"/ws";
  this.print_debug("connecting to " + url);
  var self = this;

  var wsOnOpen = function () {
    self.print_debug("ws connected");
    // wait for {ws:{ready:true}} object
  };

  var wsOnMessage = function (data) {
    self.print_debug(data);
    var obj = {};
    if (typeof(data) === "string") {
      obj = JSON.parse(data);
    } else {
      return;
    }
    // User's defined callback
    if (typeof(self.onwsmessage) === "function") {
      self.onwsmessage(obj);
    }
    // notify messaging
    if (typeof(obj.message) === "object" && self.onmessage) {
      self.onmessage(obj.message.data, obj.message.from);
    }
    // debug
    if (typeof(obj.debug) == "object") {
      if (obj.debug.warning) {
        var msg = "Warning: "+obj.debug.warning;
        self.error(msg);
      }
      if (self.ondebug) {
        self.ondebug(obj.debug);
      }
    }
    // ws command
    if (obj["ws"]) {
      self.handleWSCommand(obj["ws"]) ;
      return;
    }

    // notify
    var notifyHandlers = ["io", "uart", "spi", "i2c", "ad"];
    for (var handerIndex=0; handerIndex<notifyHandlers.length; handerIndex++) {
      var i=-1;
      var peripheral = notifyHandlers[handerIndex];
      while(true) {
        i++;
        if (self[peripheral+""+i] === undefined) { break; }
        var module_value = obj[peripheral+""+i];
        if (module_value === undefined)continue;
        self[peripheral+""+i].notified(module_value);
      }
    }
    var names= ["switch", "ble", "logicanalyzer", "measure"];
    for (var i=0; i<names.length; i++) {
      if(obj[names[i]])  { self[names[i]].notified(obj[names[i]]) }
    }
  };

  var wsOnClose = function(event) {
    self.print_debug("closed");
    if (isNode === false && typeof(showOffLine) === "function") {
      showOffLine();
    }
    if (self.looper) {
      self.looper = null;
    }
    // user defined onclose function
    if(self.onclose) {
      self.onclose(self);
    }
    self.clearSocket(self.socket);
    setTimeout(function(){
      // redirect先でつながらないなら切り替える
      if (desired_server !== server_obnizio) {
        desired_server = server_obnizio;
      }
      self.wsconnect(desired_server);
    }, 1000);
  };

  var wsOnError = function(err){
    console.log(err);
  };

  if (isNode) { 
    var wsClient = require('ws');
    this.socket = new wsClient(url);
    this.socket.on('open',    wsOnOpen);
    this.socket.on('message', wsOnMessage);
    this.socket.on('close',   wsOnClose);
    this.socket.on('error',   wsOnError);
  } else {
    this.socket = new WebSocket(url);
    this.socket.onopen    = wsOnOpen;
    this.socket.onmessage = function(event) { wsOnMessage(event.data); };
    this.socket.onclose   = wsOnClose;
    this.socket.onerror   = wsOnError;
  }
};

Obniz.prototype.clearSocket = function(socket) {
  if (isNode) {
    var shouldRemoveObservers = ['open', 'message', 'close', 'error'];
    for (var i=0; i<shouldRemoveObservers.length; i++) { socket.removeAllListeners(shouldRemoveObservers[i]); }
  } else {
    socket.onopen = null;
    socket.onmessage = null;
    socket.onclose = null;
    socket.onerror = null;
  }
  this.socket = null;
};

Obniz.prototype.close = function() {
  if (this.socket) {
    this.socket.close(1000, 'close');
    this.clearSocket(this.socket);
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
  return parts;
};

Obniz.prototype.print_debug = function(str) {
  if (this.debugprint) {
    console.log("Obniz: "+ str);
  }
};

Obniz.prototype.send = function(value) {
  if (this.sendPool) {
    this.sendPool.push(value);
    return;
  }
  if (typeof(value) === "object") {
    value = JSON.stringify(value);
  }
  this.print_debug("send: "+value);
  this.socket.send(value);
};

Obniz.prototype.init = function() {

  this.io = new PeripheralIO_(this);
  for (var i=0; i<12; i++) { this["io"+i]   = new PeripheralIO(this, i); }
  for (var i=0; i<12; i++) { this["ad"+i]   = new PeripheralAD(this, i); }
  for (var i=0; i<2;  i++) { this["uart"+i] = new PeripheralUART(this, i); }
  for (var i=0; i<1;  i++) { this["spi"+i]  = new PeripheralSPI(this, i); }
  for (var i=0; i<1;  i++) { this["i2c"+i]  = new PeripheralI2C(this, i); }
  for (var i=0; i<6;  i++) { this["pwm"+i]  = new PeripheralPWM(this, i); }

  this.display = new Display(this);
  this.switch = new ObnizSwitch(this);
  this.logicanalyzer = new LogicAnalyzer(this);
  this.ble = new Ble(this);
  this.measure = new ObnizMeasure(this);
};

Obniz.prototype.getIO = function(id) {
  return this["io"+id];
};

Obniz.prototype.getAD = function(id) {
  return this["ad"+id];
};

Obniz.prototype.getpwm = function() {
  var i=0;
  while(true){
    var pwm = this["pwm"+i];
    if (!pwm) {
      break;
    }
    if (typeof(pwm.state.io) != "number") {
      return pwm;
    }
    i++;
  }
  throw new Error("No More PWM Available. max = " + i);
};

Obniz.prototype.getFreeI2C = function() {
  var i=0;
  while(true){
    var i2c = this["i2c"+i];
    if (!i2c) {
      break;
    }
    if (typeof(i2c.state.scl) != "number") {
      return i2c;
    }
    i++;
  }
  throw new Error("No More I2C Available. max = " + i);
};

Obniz.prototype.handleWSCommand = function(wsObj) {
  // ready
  if (wsObj.ready) {
    if (isNode === false && typeof(showOnLine) === "function") {
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

Obniz.prototype.message = function(target, message) {
  var targets = [];
  if (typeof(target) === "string") {
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
Obniz.prototype.reset = function() {
  this.send({
    system: {
      reset: true
    }
  });
  this.init();
};

Obniz.prototype.selfCheck = function() {
  this.send({
    system: {
      self_check: true
    }
  });
};

Obniz.prototype.repeat = function(callback, interval) {
  if (this.looper) {
    this.looper = callback;
    return;
  }
  this.looper = callback;
  var self = this;
  if (!interval) interval = 100;
  async function loop() {
    if (typeof (self.looper) === "function") {
      await self.looper();
      setTimeout(loop, interval);
    }
  }
  loop();
};

Obniz.prototype.wait = async function(msec) {
  return new Promise(resolve => setTimeout(resolve, msec));
};

Obniz.prototype.freeze = async function(msec) {
  this.send({
    system: {
      wait: msec
    }
  });
};

Obniz.prototype.resetOnDisconnect = function(mustReset) {
  this.send({
    system: {
      reset_on_disconnect: mustReset
    }
  });
};

Obniz.prototype.error = function (msg) {
  if(isNode){
    console.error(msg);
  }else{
    if (typeof (showObnizDebugError) === "function") {
      showObnizDebugError(new Error(msg));
    } else {
      throw new Error(msg);
    }
  }
};
/*===================*/
/* Parts */
/*===================*/
var _parts = {};

var PartsRegistrate = function(name, obj) {
  _parts[name] = obj;
};

var Parts = function(name) {
  return new _parts[name]();
};

/*===================*/
/* Export */
/*===================*/
if (isNode) {
  module.exports = Obniz;
}


