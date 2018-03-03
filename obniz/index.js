/* global showObnizDebugError */

var isNode = (typeof window === 'undefined') ? true : false;

var Obniz = function (id, options) {
  this.isNode = isNode;
  if (this.isNode === false && typeof (showOffLine) === "function") {
    showOffLine();
  }
  this.apiversion = 1;
  this.id = id;
  this.socket = null;
  this.debugprint = false;
  this.debugs = [];

  this.bufferdAmoundWarnBytes = 100 * 1000; // 100k bytes

  this.init();

  if (!options) {
    options = {};
  }
  this.server_obnizio = options.obniz_server || "wss://obniz.io";
  this._access_token = options.access_token;

  if (!this.isValidObnizId(this.id)) {
    if (isNode)  {
      this.error("invalid obniz id")
    } else {
      var filled = _ReadCookie("obniz-last-used") || "";
      this.prompt(filled , function(obnizid){
        this.id = obnizid;
        this.wsconnect();
      }.bind(this))
    }
    return;
  }
  this.wsconnect();
};

Obniz.prototype.isValidObnizId = function(str) {
  if (typeof str != "string" || str.length < 8) {
    return null;
  }
  str = str.replace("-", "");
  var id = parseInt(str);
  if (isNaN(id))
    id = null;
  return id != null;
}

Obniz.prototype.prompt = function (filled, callback) {
  var obnizid = prompt("Please enter obniz id", filled);
  if (!obnizid) {
  } else {
    callback(obnizid);
  }
};

Obniz.prototype.wsOnOpen = function () {
  this.print_debug("ws connected");
  // wait for {ws:{ready:true}} object
};


Obniz.prototype.wsOnMessage = function (data) {
  this.print_debug(data);
  var obj = {};
  if (typeof (data) === "string") {
    obj = JSON.parse(data);
  } else {
    return;
  }

  // notify messaging
  if (typeof (obj.message) === "object" && this.onmessage) {
    this.onmessage(obj.message.data, obj.message.from);
  }
  // debug
  if (typeof (obj.debug) === "object") {
    if (obj.debug.warning) {
      var msg = "Warning: " + obj.debug.warning;
      this.error(msg);
    }
    if (obj.debug.error) {
      var msg = "Error: " + obj.debug.error;
      this.error(msg);
    }
    if (this.ondebug) {
      this.ondebug(obj.debug);
    }
  }
  // ws command
  if (obj["ws"]) {
    this.handleWSCommand(obj["ws"]);
    return;
  }

  // notify
  var notifyHandlers = ["io", "uart", "spi", "i2c", "ad"];
  for (var handerIndex = 0; handerIndex < notifyHandlers.length; handerIndex++) {
    var i = -1;
    var peripheral = notifyHandlers[handerIndex];
    while (true) {
      i++;
      if (this[peripheral + "" + i] === undefined) {
        break;
      }
      var module_value = obj[peripheral + "" + i];
      if (module_value === undefined)
        continue;
      this[peripheral + "" + i].notified(module_value);
    }
  }
  var names = ["switch", "ble", "measure"];
  for (var i = 0; i < names.length; i++) {
    if (obj[names[i]]) {
      this[names[i]].notified(obj[names[i]]);
    }
  }
  if (obj.logic_analyzer) {
    this.logicAnalyzer.notified(obj.logic_analyzer)
  }
};

Obniz.prototype.wsOnClose = function (event) {
  this.print_debug("closed");
  if (this.isNode === false && typeof (showOffLine) === "function") {
    showOffLine();
  }
  if (this.looper) {
    this.looper = null;
  }

  this.clearSocket(this.socket);
  setTimeout(function () {
    // always connect to mainserver if ws lost
    this.wsconnect();
  }.bind(this), 1000);
};

Obniz.prototype.wsOnError = function (err) {
  console.log(err);
};

Obniz.prototype.wsOnUnexpectedResponse = function(req, res) {
  let reconnectTime = 1000;
  if (res && res.statusCode == 404) {
    // obniz not online
    this.print_debug("obniz not online");
  } else {
    // servder error or someting
    reconnectTime = 5000;
    this.print_debug("invalid server response " + (res) ? res.statusCode :  '');
  }
  this.clearSocket(this.socket);
  setTimeout(function () {
    // always connect to mainserver if ws lost
    this.wsconnect();
  }.bind(this), reconnectTime);
}

Obniz.prototype.wsconnect = function (desired_server) {
  
  var server = this.server_obnizio;
  if (desired_server) {
    server = "" + desired_server;
  }
  if (this.socket) {
    this.socket.close();
    this.clearSocket(this.socket);
  }
  var url = server + "/obniz/" + this.id + "/ws/"+this.apiversion;
  if (_obniz_js_version) {
    url += "?obnizjs="+_obniz_js_version;
  }
  if (this._access_token) {
    url += "&access_token="+this._access_token;
  }
  this.print_debug("connecting to " + url);

  if (this.isNode) {
    const wsClient = require('ws');
    this.socket = new wsClient(url);
    this.socket.on('open', this.wsOnOpen.bind(this));
    this.socket.on('message', this.wsOnMessage.bind(this));
    this.socket.on('close', this.wsOnClose.bind(this));
    this.socket.on('error', this.wsOnError.bind(this));
    this.socket.on('unexpected-response', this.wsOnUnexpectedResponse.bind(this));
  } else {
    this.socket = new WebSocket(url);
    this.socket.onopen = this.wsOnOpen.bind(this);
    this.socket.onmessage = function (event) {
      this.wsOnMessage(event.data);
    }.bind(this);
    this.socket.onclose = this.wsOnClose.bind(this);
    this.socket.onerror = this.wsOnError.bind(this);
  }
};

Obniz.prototype.clearSocket = function (socket) {
  if (this.isNode) {
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
  if(parts.keys){
    if(parts.requiredKeys){
      var err = ObnizUtil._requiredKeys(args[1], parts.requiredKeys);
      if (err) {
        throw new Error(partsname + " wired param '" + err + "' required, but not found ");
        return;
      }
    }
    parts.params = ObnizUtil._keyFilter(args[1], parts.keys);
  }
  parts.obniz = this;
  parts.wired.apply(parts, args);
  if(parts.keys || parts.ioKeys){
    var keys = parts.ioKeys || parts.keys;
    var displayPartsName = parts.displayName || partsname;
    var ioNames = {};
    for( var index in keys){
      var pinName = keys[index];
      var io = args[1][pinName];
      if(parts.displayIoNames && parts.displayIoNames[pinName]){
        pinName = parts.displayIoNames[pinName];
      }
      ioNames[io]=pinName;
    }
    this.display.setPinNames(displayPartsName,ioNames);
  }
  return parts;
};

Obniz.prototype.print_debug = function (str) {
  if (this.debugprint) {
    console.log("Obniz: " + str);
  }
};

Obniz.prototype.send = function (value) {
  if (this.sendPool) {
    this.sendPool.push(value);
    return;
  }
  if (typeof (value) === "object") {
    value = JSON.stringify(value);
  }
  this.print_debug("send: " + value);
  this.socket.send(value);

  if (this.socket.bufferedAmount > this.bufferdAmoundWarnBytes) {
    this.error('Warning: over ' + this.socket.bufferedAmount + ' bytes queued');
  }
};

Obniz.prototype.init = function () {

  this.io = new PeripheralIO_(this);
  for (var i=0; i<12; i++) { this["io"+i]   = new PeripheralIO(this, i); }
  for (var i=0; i<12; i++) { this["ad"+i]   = new PeripheralAD(this, i); }
  for (var i=0; i<2;  i++) { this["uart"+i] = new PeripheralUART(this, i); }
  for (var i=0; i<1;  i++) { this["spi"+i]  = new PeripheralSPI(this, i); }
  for (var i=0; i<1;  i++) { this["i2c"+i]  = new PeripheralI2C(this, i); }
  for (var i=0; i<6;  i++) { this["pwm"+i]  = new PeripheralPWM(this, i); }

  this.display = new Display(this);
  this.switch = new ObnizSwitch(this);
  this.logicAnalyzer = new LogicAnalyzer(this);
  this.ble = new Ble(this);
  this.measure = new ObnizMeasure(this);

  this.util = new ObnizUtil(this);
};

Obniz.prototype.isValidIO = function (io) {
  return (typeof io === "number" && io >= 0 && io < 12);
};

Obniz.prototype.setVccGnd = function (vcc, gnd, drive) {
  if(this.isValidIO(vcc)){
    if(drive){
      this.getIO(vcc).drive(drive);
    }
    this.getIO(vcc).output(true);
  };
  
  if(this.isValidIO(gnd)){
    if(drive){
      this.getIO(gnd).drive(drive);
    }
    this.getIO(gnd).output(false);
  };
};


Obniz.prototype.getIO = function (id) {
  return this["io" + id];
};

Obniz.prototype.getAD = function (id) {
  return this["ad" + id];
};

Obniz.prototype.getFreePwm = function () {
  var i = 0;
  while (true) {
    var pwm = this["pwm" + i];
    if (!pwm) {
      break;
    }
    if (!pwm.isUsed()) {
      pwm.used = true;
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
    if (!i2c.isUsed()) {
      i2c.used = true;
      return i2c;
    }
    i++;
  }
  throw new Error("No More I2C Available. max = " + i);
};

Obniz.prototype.getI2CWithConfig = function (config) {
  if(typeof config !== "object" ){
    throw new Error("getI2CWithConfig need config arg");
  }
  if(config.i2c){
    return config.i2c;
  }
  var i2c = this.getFreeI2C();
  i2c.start(config);
  return i2c;
};

Obniz.prototype.getFreeSpi= function () {
  var i = 0;
  while (true) {
    var spi = this["spi" + i];
    if (!spi) {
      break;
    }
    if (!spi.isUsed()) {
      spi.used = true;
      return spi;
    }
    i++;
  }
  throw new Error("No More SPI Available. max = " + i);
};


Obniz.prototype.getSpiWithConfig = function (config) {
  if(typeof config !== "object" ){
    throw new Error("getSpiWithConfig need config arg");
  }
  if(config.spi){
    return config.spi;
  }
  var spi = this.getFreeSpi();
  spi.start(config);
  return spi;
};

Obniz.prototype.getFreeUart = function () {
  var i = 0;
  while (true) {
    var uart = this["uart" + i];
    if (!uart) {
      break;
    }
    if (!uart.isUsed()) {
      uart.used = true;
      return uart;
    }
    i++;
  }
  throw new Error("No More uart Available. max = " + i);
};


Obniz.prototype.handleWSCommand = function (wsObj) {
  // ready
  if (wsObj.ready) {

    this.resetOnDisconnect(true);
    if (this.isNode === false && typeof(showOnLine) === "function") {
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
  if (typeof (target) === "string") {
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
  if (this.looper) {
    this.looper = callback;
    return;
  }
  this.looper = callback;
  var self = this;
  if (!interval)
    interval = 100;
  async function loop() {
    if (typeof (self.looper) === "function") {
      await self.looper();
      setTimeout(loop, interval);
    }
  }
  loop();
};

Obniz.prototype.wait = async function (msec) {
  return new Promise(resolve => setTimeout(resolve, msec));
};

Obniz.prototype.freeze = async function (msec) {
  this.send({
    system: {
      wait: msec
    }
  });
};

Obniz.prototype.keepWorkingAtOffline = function(working) {
  this.send({
    system: {
      keep_working_at_offline: working
    }
  });
};

Obniz.prototype.resetOnDisconnect = function(reset) {
  this.send({
    ws: {
      reset_obniz_on_ws_disconnection: reset
    }
  });
};

Obniz.prototype.warning = function (msg) {
  if (this.isNode) {
    console.error(msg);
  } else {
    if (msg && typeof msg === "object" && msg.alert) {
      this.showAlertUI(msg);
      console.log(msg.message);
      return;
    }
    if (typeof (showObnizDebugError) === "function") {
      showObnizDebugError(new Error(msg));
    } else {
      throw new Error(msg);
    }
  }
};
 
Obniz.prototype.error = function (msg) {
  if (this.isNode) {
    console.error(msg);
  } else {
    if (msg && typeof msg === "object" && msg.alert) {
      this.showAlertUI(msg);
      msg = msg.message;
    }
    if (typeof (showObnizDebugError) === "function") {
      showObnizDebugError(new Error(msg));
    } else {
      throw new Error(msg);
    }
  }
};

Obniz.prototype.showAlertUI = function(obj) {
  if (this.isNode || !document.getElementById('obniz-debug')) {
    return;
  }
  const alerts = {
    warning: 'alert-warning alert-dismissible',
    error: 'alert-danger'
  }
  const timeLabel = Math.random().toString(36).slice(-8);
  let dismissButton = `
  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
    <span aria-hidden="true">&times;</span>
  </button>`;
  let dom = `
  <div class="alert ${alerts[obj.alert]} fade show" role="alert">
    ${obj.message}
    ${ obj.alert == "warning" ? dismissButton : ""}
  </div>`;
  document.getElementById('obniz-debug').insertAdjacentHTML('beforeend', dom);
}

function _ReadCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++) {
      var c = ca[i];
      while (c.charAt(0) === ' ') {
          c = c.substring(1,c.length);
      }
      if (c.indexOf(nameEQ) === 0) {
          return c.substring(nameEQ.length,c.length);
      }
  }
  return null;
}

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

if (!isNode) {

  if(window && window.parent && window.parent.userAppLoaded){
    window.parent.userAppLoaded(window);
  }

  function showOnLine() {
    if (typeof jQuery !== 'undefined') {
      $('#loader').hide();
      if ($('#obniz-debug #online-status').length == 0) {
        $('#obniz-debug').prepend('<div id="online-status"></div>')
      }
      $('#online-status').text('online');
      $('#online-status').css({ "background-color" : "#449d44","color":"#FFF", "padding":"5px","text-align": "center" });
    }
  }
  function showOffLine() {
    if (typeof jQuery !== 'undefined') {
      $('#loader').show();
      if ($('#obniz-debug #online-status').length == 0) {
        $('#obniz-debug').prepend('<div id="online-status"></div>')
      }
      $('#online-status').text('offline');
      $('#online-status').css({ "background-color" : "#d9534f","color":"#FFF", "padding":"5px","text-align": "center" });
    }
  }
  function showObnizDebugError(err) {
    if(window.parent && window.parent.logger){
      window.parent.logger.addErrorObject(err);
    }else{ throw err; };
  }
}

/*===================*/
/* Export */
/*===================*/
if (isNode) {
  module.exports = Obniz;
}