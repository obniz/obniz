const ObnizBLE = require('./libs/embeds/ble/ble');
const Display = require('./libs/embeds/display');
const ObnizSwitch = require('./libs/embeds/switch');

const LogicAnalyzer = require('./libs/measurements/logicanalyzer');
const ObnizMeasure = require('./libs/measurements/measure');

const PeripheralAD = require('./libs/io_peripherals/ad');
const PeripheralI2C = require('./libs/io_peripherals/i2c');
const PeripheralIO = require('./libs/io_peripherals/io');
const PeripheralDirective = require('./libs/io_peripherals/directive');
const PeripheralPWM = require('./libs/io_peripherals/pwm');
const PeripheralSPI = require('./libs/io_peripherals/spi');
const PeripheralUART = require('./libs/io_peripherals/uart');

const ObnizUtil = require('./libs/utils/util');
const ObnizParts = require('./ObnizParts');

module.exports = class ObnizComponents extends ObnizParts {
  constructor(id, options) {
    super(id, options);
    this.pongObservers = [];
  }

  close() {
    super.close();
    if (this.options.reset_obniz_on_ws_disconnection) {
      this._resetComponents();
    }
  }

  _prepareComponents() {
    this.io = new PeripheralDirective(this);
    for (let i = 0; i < 12; i++) {
      this['io' + i] = new PeripheralIO(this, i);
    }
    for (let i = 0; i < 12; i++) {
      this['ad' + i] = new PeripheralAD(this, i);
    }
    for (let i = 0; i < 2; i++) {
      this['uart' + i] = new PeripheralUART(this, i);
    }
    for (let i = 0; i < 2; i++) {
      this['spi' + i] = new PeripheralSPI(this, i);
    }
    for (let i = 0; i < 1; i++) {
      this['i2c' + i] = new PeripheralI2C(this, i);
    }
    for (let i = 0; i < 6; i++) {
      this['pwm' + i] = new PeripheralPWM(this, i);
    }

    this.display = new Display(this);
    this.switch = new ObnizSwitch(this);
    this.logicAnalyzer = new LogicAnalyzer(this);
    this.ble = new ObnizBLE(this);
    this.measure = new ObnizMeasure(this);

    this.util = new ObnizUtil(this);
  }

  _resetComponents() {
    this.print_debug('components state resets');
    for (let i = 0; i < 12; i++) {
      this['io' + i]._reset();
    }
    for (let i = 0; i < 12; i++) {
      this['ad' + i]._reset();
    }
    for (let i = 0; i < 2; i++) {
      this['uart' + i]._reset();
    }
    for (let i = 0; i < 2; i++) {
      this['spi' + i]._reset();
    }
    for (let i = 0; i < 1; i++) {
      this['i2c' + i]._reset();
    }
    for (let i = 0; i < 6; i++) {
      this['pwm' + i]._reset();
    }

    this.display._reset();
    this.switch._reset();
    this.logicAnalyzer._reset();
    this.ble._reset();
    this.measure._reset();
  }

  notifyToModule(obj) {
    super.notifyToModule(obj);
    const notifyHandlers = ['io', 'uart', 'spi', 'i2c', 'ad'];
    for (
      let handerIndex = 0;
      handerIndex < notifyHandlers.length;
      handerIndex++
    ) {
      const peripheral = notifyHandlers[handerIndex];
      let i = -1;
      while (this[peripheral + '' + ++i]) {
        let module_value = obj[peripheral + '' + i];
        if (module_value === undefined) continue;
        this[peripheral + '' + i].notified(module_value);
      }
    }
    const names = ['switch', 'ble', 'measure'];
    for (let i = 0; i < names.length; i++) {
      if (obj[names[i]]) {
        this[names[i]].notified(obj[names[i]]);
      }
    }
    if (obj.logic_analyzer) {
      this.logicAnalyzer.notified(obj.logic_analyzer);
    }
  }

  handleSystemCommand(wsObj) {
    super.handleSystemCommand(wsObj);
    // ping pong
    if (wsObj.pong) {
      for (let callback of this.pongObservers) {
        callback(wsObj);
      }
    }
  }

  addPongObserver(callback) {
    if (callback) {
      this.pongObservers.push(callback);
    }
  }

  removePongObserver(callback) {
    if (this.pongObservers.includes(callback)) {
      let index = this.pongObservers.indexOf(callback);
      this.pongObservers.splice(index, 1);
    }
  }

  isValidIO(io) {
    return typeof io === 'number' && io >= 0 && io < 12;
  }

  setVccGnd(vcc, gnd, drive) {
    if (this.isValidIO(vcc)) {
      if (drive) {
        this.getIO(vcc).drive(drive);
      }
      this.getIO(vcc).output(true);
    }

    if (this.isValidIO(gnd)) {
      if (drive) {
        this.getIO(gnd).drive(drive);
      }
      this.getIO(gnd).output(false);
    }
  }

  getIO(io) {
    if (!this.isValidIO(io)) {
      throw new Error('io ' + io + ' is not valid io');
    }
    return this['io' + io];
  }

  getAD(io) {
    if (!this.isValidIO(io)) {
      throw new Error('ad ' + io + ' is not valid io');
    }
    return this['ad' + io];
  }

  getFreePwm() {
    let i = 0;
    for (i = 0; i < 6; i++) {
      let pwm = this['pwm' + i];
      if (!pwm) {
        break;
      }
      if (!pwm.isUsed()) {
        pwm.used = true;
        return pwm;
      }
    }
    throw new Error('No More PWM Available. max = ' + i);
  }

  getFreeI2C() {
    let i = 0;
    for (i = 0; i < 1; i++) {
      let i2c = this['i2c' + i];
      if (!i2c) {
        break;
      }
      if (!i2c.isUsed()) {
        i2c.used = true;
        return i2c;
      }
    }
    throw new Error('No More I2C Available. max = ' + i);
  }

  getI2CWithConfig(config) {
    if (typeof config !== 'object') {
      throw new Error('getI2CWithConfig need config arg');
    }
    if (config.i2c) {
      return config.i2c;
    }
    let i2c = this.getFreeI2C();
    i2c.start(config);
    return i2c;
  }

  getFreeSpi() {
    let i = 0;
    for (i = 0; i < 2; i++) {
      let spi = this['spi' + i];
      if (!spi) {
        break;
      }
      if (!spi.isUsed()) {
        spi.used = true;
        return spi;
      }
    }
    throw new Error('No More SPI Available. max = ' + i);
  }

  getSpiWithConfig(config) {
    if (typeof config !== 'object') {
      throw new Error('getSpiWithConfig need config arg');
    }
    if (config.spi) {
      return config.spi;
    }
    let spi = this.getFreeSpi();
    spi.start(config);
    return spi;
  }

  getFreeUart() {
    let i = 0;
    for (i = 0; i < 2; i++) {
      let uart = this['uart' + i];
      if (!uart) {
        break;
      }
      if (!uart.isUsed()) {
        uart.used = true;
        return uart;
      }
    }
    throw new Error('No More uart Available. max = ' + i);
  }
};
