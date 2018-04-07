
const ObnizBLE = require("./libs/embeds/ble/ble");

const Display = require("./libs/embeds/display");
const ObnizSwitch = require("./libs/embeds/switch");


const LogicAnalyzer = require("./libs/measurements/logicanalyzer");
const ObnizMeasure = require("./libs/measurements/measure");


const PeripheralAD = require("./libs/io_peripherals/ad");
const PeripheralI2C = require("./libs/io_peripherals/i2c");
const PeripheralIO = require("./libs/io_peripherals/io");
const PeripheralIO_ = require("./libs/io_peripherals/io_");
const PeripheralPWM = require("./libs/io_peripherals/pwm");
const PeripheralSPI = require("./libs/io_peripherals/spi");
const PeripheralUART = require("./libs/io_peripherals/uart");


const ObnizUtil = require("./libs/utils/util");

const WSCommand = require("./libs/wscommand");


/* global showObnizDebugError  */

let isNode = (typeof window === 'undefined') ;

class Obniz {

  constructor(id, options) {
    this.isNode     = isNode;
    this.apiversion = 1;
    this.id         = id;
    this.socket     = null;
    this.debugprint = false;
    this.debugs     = [];
    this.pongObservers = [];
  
    this.bufferdAmoundWarnBytes = 100 * 1000; // 100k bytes
  
    this.init();
  
    if (!options) {
      options = {};
    }
    this.server_obnizio = options.obniz_server || "wss://obniz.io";
    this._access_token = options.access_token;
    this.debugDomId = options.debug_dom_id || "obniz-debug";
    this.auto_connect = typeof(options.auto_connect) === "boolean" ? options.auto_connect : true;

    if (options.binary !== false) {
      this.wscommand = this.constructor.WSCommand;
      let classes = this.constructor.WSCommand.CommandClasses;
      this.wscommands = [];
      for (let class_name in classes) {
       this.wscommands.push(new classes[class_name]());
      }
    }

    if (this.isNode === false) { this.showOffLine(); }
  
    if (!this.isValidObnizId(this.id)) {
      if (isNode)  {
        this.error("invalid obniz id")
      } else {
        let filled = _ReadCookie("obniz-last-used") || "";
        this.prompt(filled , function(obnizid){
          this.id = obnizid;
          this.showOffLine();
          this.wsconnect();
        }.bind(this))
      }
      return;
    }


    if(this.auto_connect){
      this.wsconnect();
    }
  }

  static get version(){
    let packageJson = require("../package.json");
    return packageJson.version;
  }

  static get WSCommand() {
    return WSCommand;
  }

  isValidObnizId(str) {
    if (typeof str != "string" || str.length < 8) {
      return null;
    }
    str = str.replace("-", "");
    let id = parseInt(str);
    if (isNaN(id))
      id = null;
    return id != null;
  }

  prompt(filled, callback) {
    var obnizid = prompt("Please enter obniz id", filled);
    if (!obnizid) {
    } else {
      callback(obnizid);
    }
  }

  wsOnOpen() {
    this.print_debug("ws connected");
    // wait for {ws:{ready:true}} object
    if(typeof this.onopen === "function"){
      this.onopen(this);
    }
  }

  binary2Json(binary){
    let data = new Uint8Array(binary);
    let json = [];
    while(true) {
      const frame = WSCommand.dequeueOne(data);
      if (!frame) break;
      let obj = {};
      for (var i=0; i<this.wscommands.length; i++) {
        const command = this.wscommands[i];
        if (command.module === frame.module) {
          command.notifyFromBinary(obj, frame.func, frame.payload);
          break;
        }
      }
      json.push(obj);
      data = frame.next;
    }
    return json;
  }

  wsOnMessage(data) {
    let json ;
    if(typeof data === "string"){
      json = JSON.parse(data);
    }else if(this.wscommands) { //binary
      json = binary2Json(data);
    }

    if(Array.isArray(json)){
      for(let i in json ) {
        this.notifyToModule(json[i]);
      }

    }else{
      //invalid json
    }

  }

  notifyToModule(obj){
    this.print_debug(JSON.stringify(obj));

    // notify messaging
    if (typeof (obj.message) === "object" && this.onmessage) {
      this.onmessage(obj.message.data, obj.message.from);
    }
    // debug
    if (typeof (obj.debug) === "object") {
      if (obj.debug.warning) {
        let msg = "Warning: " + obj.debug.warning.message;
        this.warning({alert: 'warning', message: msg});
      }

      if (obj.debug.error) {
        let msg = "Error: " + obj.debug.error.message;
        this.error({alert: 'error', message: msg});
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
    if (obj["system"]) {
      this.handleSystemCommand(obj["system"]);
      return;
    }

    // notify
    let notifyHandlers = ["io", "uart", "spi", "i2c", "ad"];
    for (let handerIndex = 0; handerIndex < notifyHandlers.length; handerIndex++) {
      let i = -1;
      let peripheral = notifyHandlers[handerIndex];
      while (true) {
        i++;
        if (this[peripheral + "" + i] === undefined) {
          break;
        }
        let module_value = obj[peripheral + "" + i];
        if (module_value === undefined)
          continue;
        this[peripheral + "" + i].notified(module_value);
      }
    }
    let names = ["switch", "ble", "measure"];
    for (let i = 0; i < names.length; i++) {
      if (obj[names[i]]) {
        this[names[i]].notified(obj[names[i]]);
      }
    }
    if (obj.logic_analyzer) {
      this.logicAnalyzer.notified(obj.logic_analyzer)
    }
  }

  wsOnClose(event) {
    this.print_debug("closed");
    if (this.isNode === false) { this.showOffLine(); }
    if (this.looper) {
      this.looper = null;
    }
  
    this.clearSocket(this.socket);

    if(typeof this.onclose === "function"){
      this.onclose(this);
    }

    if(this.auto_connect) {
      setTimeout(function () {
        // always connect to mainserver if ws lost
        this.wsconnect();
      }.bind(this), 1000);
    }
  }

  wsOnError(event) {
    console.error("websocket error.");
  }


  wsOnUnexpectedResponse(req, res) {
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
    if(this.auto_connect) {
      setTimeout(function () {
        // always connect to mainserver if ws lost
        this.wsconnect();
      }.bind(this), reconnectTime);
    }
  }

  wsconnect(desired_server) {
    let server = this.server_obnizio;
    if (desired_server) {
      server = "" + desired_server;
    }
    if (this.socket) {
      this.socket.close();
      this.clearSocket(this.socket);
    }
    let url = server + "/obniz/" + this.id + "/ws/"+this.apiversion;
    if (this.constructor.version) {
      url += "?obnizjs="+this.constructor.version;
    }
    if (this._access_token) {
      url += "&access_token="+this._access_token;
    }
    if (this.wscommand) {
      url += "&accept_binary=true";
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
      this.socket.binaryType = 'arraybuffer';
      this.socket.onopen = this.wsOnOpen.bind(this);
      this.socket.onmessage = function (event) {
        this.wsOnMessage(event.data);
      }.bind(this);
      this.socket.onclose = this.wsOnClose.bind(this);
      this.socket.onerror = this.wsOnError.bind(this);
    }
  }

  clearSocket(socket) {
    /* send queue */
    if (this._sendQueueTimer) {
      delete this._sendQueue;
      clearTimeout(this._sendQueueTimer);
      this._sendQueueTimer = null;
    }
    /* unbind */
    if (this.isNode) {
      let shouldRemoveObservers = ['open', 'message', 'close', 'error'];
      for (let i = 0; i < shouldRemoveObservers.length; i++) {
        socket.removeAllListeners(shouldRemoveObservers[i]);
      }
    } else {
      socket.onopen = null;
      socket.onmessage = null;
      socket.onclose = null;
      socket.onerror = null;
    }
    this.socket = null;
  }


  connect(){
    this.wsconnect();
  }

  close() {
    if (this.socket) {
      this._drainQueued();
      this.socket.close(1000, 'close');
      this.clearSocket(this.socket);
    }
  }

  wired(partsname) {
    let parts = new _parts[partsname]();
    if (!parts) {
      throw new Error("No such a parts [" + partsname + "] found");
      return;
    }
    let args = Array.from(arguments);
    args.shift();
    args.unshift(this); 
    if(parts.keys){
      if(parts.requiredKeys){
        let err = ObnizUtil._requiredKeys(args[1], parts.requiredKeys);
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
      let keys = parts.ioKeys || parts.keys;
      let displayPartsName = parts.displayName || partsname;
      let ioNames = {};
      for( let index in keys){
        let pinName = keys[index];
        let io = args[1][pinName];
        if(parts.displayIoNames && parts.displayIoNames[pinName]){
          pinName = parts.displayIoNames[pinName];
        }
        ioNames[io]=pinName;
      }
      this.display.setPinNames(displayPartsName,ioNames);
    }
    return parts;
  }

  print_debug(str) {
    if (this.debugprint) {
      console.log("Obniz: " + str);
    }
  }

  send(obj) {
    if (!obj || (typeof obj !== "object")) {
      console.log("obnizjs. didnt send ", obj);
      return;
    }
    if (Array.isArray(obj)) {
      for (let i=0; i<obj.length; i++) {
        this.send(obj[i]);
      }
      return;
    }
    if (this.sendPool) { this.sendPool.push(obj); return; }

    let sendData;
    /* compress */
    if (this.wscommand) {
      let compressed;
      try {
        compressed = this.wscommand.compress(this.wscommands, obj);
        if (compressed) {
          sendData = compressed;
        }
      } catch(e) {
        this.error(e);
        return; /* never send when parsing failed */
      }
    }
    if (!sendData) {
      sendData = JSON.stringify([obj]);
    }
    if (this.debugprint) {
      this.print_debug("send: " + ( (typeof sendData === "string") ? sendData : JSON.stringify(obj)) );
    }
    /* queue sending */
    if(typeof sendData === "string") {
      this._drainQueued();
      this.socket.send(sendData);
    } else {
      if (this._sendQueue) {
        this._sendQueue.push(sendData);
      } else {
        this._sendQueue = [sendData];
        this._sendQueueTimer = setTimeout(this._drainQueued.bind(this), 1);
      }
    }
  }

  _drainQueued() {
    if (!this._sendQueue) return;
    let expectSize = 0;
    for (let i=0; i<this._sendQueue.length; i++) {
      expectSize += this._sendQueue[i].length;
    }
    let filled = 0;
    let sendData = new Uint8Array(expectSize);
    for (let i=0; i<this._sendQueue.length; i++) {
      sendData.set(this._sendQueue[i], filled);
      filled += this._sendQueue[i].length;
    }
    this.socket.send(sendData);
    delete this._sendQueue;
    clearTimeout(this._sendQueueTimer);
    this._sendQueueTimer = null;
    
    if (this.socket.bufferedAmount > this.bufferdAmoundWarnBytes) {
      this.error('Warning: over ' + this.socket.bufferedAmount + ' bytes queued');
    }
  }

  init() {
    this.io = new PeripheralIO_(this);
    for (let i=0; i<12; i++) { this["io"+i]   = new PeripheralIO(this, i); }
    for (let i=0; i<12; i++) { this["ad"+i]   = new PeripheralAD(this, i); }
    for (let i=0; i<2;  i++) { this["uart"+i] = new PeripheralUART(this, i); }
    for (let i=0; i<1;  i++) { this["spi"+i]  = new PeripheralSPI(this, i); }
    for (let i=0; i<1;  i++) { this["i2c"+i]  = new PeripheralI2C(this, i); }
    for (let i=0; i<6;  i++) { this["pwm"+i]  = new PeripheralPWM(this, i); }
  
    this.display = new Display(this);
    this.switch = new ObnizSwitch(this);
    this.logicAnalyzer = new LogicAnalyzer(this);
    this.ble = new ObnizBLE(this);
    this.measure = new ObnizMeasure(this);
  
    this.util = new ObnizUtil(this);
  }

  isValidIO(io) {
    return (typeof io === "number" && io >= 0 && io < 12);
  }

  setVccGnd(vcc, gnd, drive) {
    if(this.isValidIO(vcc)){
      if(drive){
        this.getIO(vcc).drive(drive);
      }
      this.getIO(vcc).output(true);
    }
    
    if(this.isValidIO(gnd)){
      if(drive){
        this.getIO(gnd).drive(drive);
      }
      this.getIO(gnd).output(false);
    }
  }

  getIO(io) {
    if (!this.isValidIO(io)) {
      throw new Error('io ' + io + ' is not valid io');
    }
    return this["io" + io];
  }

  getAD(io) {
    if (!this.isValidIO(io)) {
      throw new Error('ad ' + io + ' is not valid io');
    }
    return this["ad" + io];
  }

  getFreePwm() {
    let i = 0;
    while (true) {
      let pwm = this["pwm" + i];
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
  }

  getFreeI2C() {
    let i = 0;
    while (true) {
      let i2c = this["i2c" + i];
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
  }

  getI2CWithConfig(config) {
    if(typeof config !== "object" ){
      throw new Error("getI2CWithConfig need config arg");
    }
    if(config.i2c){
      return config.i2c;
    }
    let i2c = this.getFreeI2C();
    i2c.start(config);
    return i2c;
  }

  getFreeSpi() {
    let i = 0;
    while (true) {
      let spi = this["spi" + i];
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
  }

  getSpiWithConfig(config) {
    if(typeof config !== "object" ){
      throw new Error("getSpiWithConfig need config arg");
    }
    if(config.spi){
      return config.spi;
    }
    let spi = this.getFreeSpi();
    spi.start(config);
    return spi;
  }

  getFreeUart() {
    let i = 0;
    while (true) {
      let uart = this["uart" + i];
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
  }

  addPongObserver(callback) {
    if(callback) {
      this.pongObservers.push(callback);
    }
  }
  removePongObserver(callback) {
    if(this.pongObservers.includes(callback)){
      let index =  this.pongObservers.indexOf(callback);
      this.pongObservers.splice(index,1);
    }

  }
  handleSystemCommand(wsObj) {
    // ready
    if (wsObj.pong) {
      for(let callback of this.pongObservers){
        callback(wsObj);
      }
      
    }
  }

  handleWSCommand(wsObj) {
    // ready
    if (wsObj.ready) {
  
      this.resetOnDisconnect(true);
      if (this.isNode === false) { this.showOnLine(); }
      if (this.onconnect) {
        let promise = this.onconnect(this);
        if(promise instanceof Promise){
          promise.catch((err) => {
            console.error(err);
          });
        }
      }
    }
    if (wsObj.redirect) {
      let server = wsObj.redirect;
      this.print_debug("WS connection changed to " + server);
      this.close();
      this.wsconnect(server);
    }
  }

  message(target, message) {
    let targets = [];
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
  }

// --- System ---


  repeat(callback, interval) {
    if (this.looper) {
      this.looper = callback;
      return;
    }
    this.looper = callback;
    let self = this;
    if (!interval)
      interval = 100;
    async function loop() {
      if (typeof (self.looper) === "function") {
        await self.looper();
        setTimeout(loop, interval);
      }
    }
    loop();
  }

  wait(msec) {
    if (msec < 0) {
      msec = 0;
    } else if (msec > 60 * 1000) {
      msec = 60 * 1000;
    }
    this.send({ system: { wait: msec } });
    return new Promise(resolve => setTimeout(resolve, msec));
  }

  reset() { this.send({ system: { reset: true } }); this.init(); }
  selfCheck() { this.send({ system: { self_check: true } }); }
  keepWorkingAtOffline(working) { this.send({ system: { keep_working_at_offline: working } }); }
  resetOnDisconnect(reset) { this.send({ ws: { reset_obniz_on_ws_disconnection: reset } }); }

  pingWait(unixtime, rand){
    unixtime = unixtime || new Date().getTime();
    let upper = Math.floor( unixtime / Math.pow(2,32));
    let lower = unixtime - upper * Math.pow(2,32);
    rand = rand || Math.floor(Math.random() * Math.pow(2,4));
    let buf = [];


    buf.push((upper >>> 8*3) & 0xFF);
    buf.push((upper >>> 8*2) & 0xFF);
    buf.push((upper >>> 8*1) & 0xFF);
    buf.push((upper >>> 8*0) & 0xFF);
    buf.push((lower >>> 8*3) & 0xFF);
    buf.push((lower >>> 8*2) & 0xFF);
    buf.push((lower >>> 8*1) & 0xFF);
    buf.push((lower >>> 8*0) & 0xFF);
    buf.push((rand >>> 8*3) & 0xFF);
    buf.push((rand >>> 8*2) & 0xFF);
    buf.push((rand >>> 8*1) & 0xFF);
    buf.push((rand >>> 8*0) & 0xFF);
    this.send({ system: { ping: {key : buf } }});

    return new Promise((resolve)=>{
      let callback = (systemObj) => {
        for(let i =0;i<buf.length;i++){
          if(buf[i] !== systemObj.pong.key[i]){
            return;
          }
        }
        this.removePongObserver(callback);
        let upper = ((systemObj.pong.key[0] << 8 * 3) >>> 0)
            + ((systemObj.pong.key[1] << 8 * 2) >>> 0)
            + ((systemObj.pong.key[2] << 8 * 1) >>> 0)
            + ((systemObj.pong.key[3] << 8 * 0) >>> 0);
        let lower = ((systemObj.pong.key[4] << 8 * 3) >>> 0)
            + ((systemObj.pong.key[5] << 8 * 2) >>> 0)
            + ((systemObj.pong.key[6] << 8 * 1) >>> 0)
            + ((systemObj.pong.key[7] << 8 * 0) >>> 0);
        let obnizJsPingUnixtime = upper * Math.pow(2, 32) + lower;
        let obnizJsPongUnixtime = new Date().getTime();
        let allTime = obnizJsPongUnixtime- obnizJsPingUnixtime;
        let timeJs2server = systemObj.pong.pingServerTime - obnizJsPingUnixtime;
        let timeServer2Obniz = systemObj.pong.obnizTime - systemObj.pong.pingServerTime ;
        let timeObniz2Server = systemObj.pong.pongServerTime- systemObj.pong.obnizTime ;
        let timeServer2Js = obnizJsPongUnixtime - systemObj.pong.pongServerTime ;
        let str = `ping ${allTime}ms (js --[${timeJs2server}ms]--> server --[${timeServer2Obniz}ms]--> obniz --[${timeObniz2Server}ms]--> server --[${timeServer2Js}ms]--> js)`;
        // let str = `ping,${obnizJsPingUnixtime},${systemObj.pong.pingServerTime},${systemObj.pong.obnizTime},${systemObj.pong.pongServerTime}`;


        this.print_debug(str);
        resolve(str);
      };
      this.addPongObserver(callback);
    });
  }


  warning(msg) {
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
  }

  error(msg) {
    if (this.isNode) {
      console.error(msg);
    } else {
      if (msg && typeof msg === "object" && msg.alert) {
        this.showAlertUI(msg);
        msg = msg.message;
      }
      if (typeof (showObnizDebugError) === "function") {
        showObnizDebugError(new Error(msg));
        console.error(new Error(msg));
      } else {
        throw new Error(msg);
      }
    }
  }

  showAlertUI(obj) {
    if (this.isNode || !document.getElementById(this.debugDomId)) {
      return;
    }
    const alerts = {
      warning: 'alert-warning alert-dismissible',
      error: 'alert-danger'
    };
    let dom = `
    <div style="background-color:${obj.alert === "warning" ? "#ffee35" : "#ff7b34"  }">${obj.message}</div>`;
    document.getElementById(this.debugDomId).insertAdjacentHTML('beforeend', dom);
  }

  getDebugDoms(){
    if (this.isNode){return;}
    let loaderDom = document.querySelector("#loader");
    let debugDom = document.querySelector("#" + this.debugDomId);
    let statusDom = document.querySelector("#"+this.debugDomId +" #online-status");
    if(debugDom && !statusDom){
      statusDom = document.createElement("div");
      statusDom.id = 'online-status';
      statusDom.style.color =  "#FFF";
      statusDom.style.padding =  "5px";
      statusDom.style.textAlign =  "center";
      debugDom.insertBefore(statusDom, debugDom.firstChild);
    }
    return { loaderDom:loaderDom, debugDom:debugDom, statusDom:statusDom };

  }
  showOnLine() {
    if (this.isNode){return;}
    let doms = this.getDebugDoms();
    if(doms.loaderDom){
      doms.loaderDom.style.display="none";
    }
    if(doms.statusDom){
      doms.statusDom.style.backgroundColor =  "#449d44";
      doms.statusDom.style.color =  "#FFF";
      doms.statusDom.innerHTML = this.id ? "online : "+ this.id : "online";
    }

  }
  showOffLine() {
    if (this.isNode){return;}

    let doms = this.getDebugDoms();
    if(doms.loaderDom){
      doms.loaderDom.style.display="block";
    }
    if(doms.statusDom){
      doms.statusDom.style.backgroundColor =  "#d9534f";
      doms.statusDom.style.color =  "#FFF";
      doms.statusDom.innerHTML = this.id  ? "offline : "+ this.id : "offline";
    }
  }


}

/*===================*/
/* Parts */
/*===================*/
let _parts = {};

Obniz.PartsRegistrate = function (name, obj) {
  _parts[name] = obj;
};

Obniz.Parts = function (name) {
  return new _parts[name]();
};

/*===================*/
/* Utils */
/*===================*/
function _ReadCookie(name) {
  let nameEQ = name + "=";
  let ca = document.cookie.split(';');
  for(let i=0;i < ca.length;i++) {
    let c = ca[i];
      while (c.charAt(0) === ' ') {
          c = c.substring(1,c.length);
      }
      if (c.indexOf(nameEQ) === 0) {
          return c.substring(nameEQ.length,c.length);
      }
  }
  return null;
}

if (!isNode) {

  if(window && window.parent && window.parent.userAppLoaded){
    window.parent.userAppLoaded(window);
  }

  function showObnizDebugError(err) {
    if(window.parent && window.parent.logger){
      window.parent.logger.onObnizError(err);
    }else{ throw err; }
  }

}


/*===================*/
/* Export */
/*===================*/
module.exports = Obniz;


// read parts
require.context = require('./libs/webpackReplace/require-context');
if(require.context && require.context.setBaseDir){require.context.setBaseDir(__dirname);}
let context = require.context(  "../parts", true, /\.js$/);
for( let path of context.keys()){
  context(path);
}
