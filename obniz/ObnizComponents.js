const ObnizBLE       = require("./libs/embeds/ble/ble");
const Display        = require("./libs/embeds/display");
const ObnizSwitch    = require("./libs/embeds/switch");

const LogicAnalyzer  = require("./libs/measurements/logicanalyzer");
const ObnizMeasure   = require("./libs/measurements/measure");

const PeripheralAD   = require("./libs/io_peripherals/ad");
const PeripheralI2C  = require("./libs/io_peripherals/i2c");
const PeripheralIO   = require("./libs/io_peripherals/io");
const PeripheralIO_  = require("./libs/io_peripherals/io_");
const PeripheralPWM  = require("./libs/io_peripherals/pwm");
const PeripheralSPI  = require("./libs/io_peripherals/spi");
const PeripheralUART = require("./libs/io_peripherals/uart");

const ObnizUtil = require("./libs/utils/util");
const ObnizParts = require('./ObnizParts')

module.exports = class ObnizComponents extends ObnizParts {

  constructor(id, options) {
    super(id, options)
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
    const notifyHandlers = ["io", "uart", "spi", "i2c", "ad"];
    for (let handerIndex = 0; handerIndex < notifyHandlers.length; handerIndex++) {
      const peripheral = notifyHandlers[handerIndex];
      let i = -1;
      while (this[peripheral + "" + (++i)]) {
        let module_value = obj[peripheral + "" + i];
        if (module_value === undefined)
          continue;
        this[peripheral + "" + i].notified(module_value);
      }
    }
    const names = ["switch", "ble", "measure"];
    for (let i = 0; i < names.length; i++) {
      if (obj[names[i]]) {
        this[names[i]].notified(obj[names[i]]);
      }
    }
    if (obj.logic_analyzer) {
      this.logicAnalyzer.notified(obj.logic_analyzer)
    }
  }

  _prepareComponents() {
    this.io = new PeripheralIO_(this);
    for (let i=0; i<12; i++) { this["io"+i]   = new PeripheralIO(this, i); }
    for (let i=0; i<12; i++) { this["ad"+i]   = new PeripheralAD(this, i); }
    for (let i=0; i<2;  i++) { this["uart"+i] = new PeripheralUART(this, i); }
    for (let i=0; i<2;  i++) { this["spi"+i]  = new PeripheralSPI(this, i); }
    for (let i=0; i<1;  i++) { this["i2c"+i]  = new PeripheralI2C(this, i); }
    for (let i=0; i<6;  i++) { this["pwm"+i]  = new PeripheralPWM(this, i); }
  
    this.display = new Display(this);
    this.switch = new ObnizSwitch(this);
    this.logicAnalyzer = new LogicAnalyzer(this);
    this.ble = new ObnizBLE(this);
    this.measure = new ObnizMeasure(this);
  
    this.util = new ObnizUtil(this);
  }

  handleWSCommand(wsObj) {
    // 
    if (wsObj.ready) {
      this.resetOnDisconnect(true);
      if (wsObj.local_connect
        && wsObj.local_connect.ip
        && this.wscommand
        && this.options.local_connect) {
        this._connectLocal(wsObj.local_connect.ip);
        this._waitForLocalConnectReadyTimer = setTimeout(()=>{ this._callOnConnect(); }, 1000);
      }
      if (!this._waitForLocalConnectReadyTimer) {
        this._callOnConnect();
      }
    }
    if (wsObj.redirect) {
      let server = wsObj.redirect;
      this.print_debug("WS connection changed to " + server);
      this.close();
      this.wsconnect(server);
    }
  }

  handleSystemCommand(wsObj) {
    // ping pong
    if (wsObj.pong) {
      for(let callback of this.pongObservers){
        callback(wsObj);
      }
    }
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
}