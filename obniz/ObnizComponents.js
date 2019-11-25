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

const TCP = require('./libs/protocol/tcp');

const ObnizParts = require('./ObnizParts');

const HW = require('./libs/hw/index');

module.exports = class ObnizComponents extends ObnizParts {
  constructor(id, options) {
    super(id, options);
    this.pongObservers = [];
    this._allComponentKeys = [];
  }

  close() {
    super.close();
    if (this.options.reset_obniz_on_ws_disconnection) {
      this._resetComponents();
    }
  }

  _callOnConnect() {
    this._prepareComponents();
    super._callOnConnect();
  }

  _prepareComponents() {
    if (this._allComponentKeys.length !== 0) {
      return;
    }

    const hwDefinition = HW.getDefinitionFor(this.hw);
    if (!hwDefinition) {
      throw new Error(`unkown hw ${this.hw}`);
    }

    const hw_peripherals = hwDefinition.peripherals;
    const hw_embeds = hwDefinition.embeds;
    const hw_protocol = hwDefinition.protocol;

    const shared_map = {
      io: PeripheralDirective,
      logicAnalyzer: LogicAnalyzer,
      measure: ObnizMeasure,
    };

    const peripheral_map = {
      io: PeripheralIO,
      ad: PeripheralAD,
      uart: PeripheralUART,
      spi: PeripheralSPI,
      i2c: PeripheralI2C,
      pwm: PeripheralPWM,
    };

    const embeds_map = {
      display: Display,
      switch: ObnizSwitch,
      ble: ObnizBLE,
    };

    const protocol_map = {
      tcp: TCP,
    };

    for (const key in shared_map) {
      const Class = shared_map[key];
      this[key] = new Class(this);
      this._allComponentKeys.push(key);
    }

    if (hw_peripherals) {
      for (const key in peripheral_map) {
        if (hw_peripherals[key]) {
          const units = hw_peripherals[key].units;
          const Class = peripheral_map[key];
          for (let unitId in units) {
            unitId = parseInt(unitId);
            this[key + unitId] = new Class(this, unitId);
            this._allComponentKeys.push(key + unitId);
          }
        }
      }
    }

    if (hw_embeds) {
      for (const key in embeds_map) {
        if (hw_embeds[key]) {
          const Class = embeds_map[key];
          this[key] = new Class(this);
          this._allComponentKeys.push(key);
        }
      }
    }

    if (hw_protocol) {
      for (const key in protocol_map) {
        if (hw_protocol[key]) {
          const units = hw_protocol[key].units;
          const Class = protocol_map[key];
          for (let unitId in units) {
            unitId = parseInt(unitId);
            this[key + unitId] = new Class(this, unitId);
            this._allComponentKeys.push(key + unitId);
          }
        }
      }
    }
  }

  _resetComponents() {
    this.print_debug('components state resets');
    for (const key of this._allComponentKeys) {
      this[key]._reset();
    }
  }

  notifyToModule(obj) {
    super.notifyToModule(obj);
    for (const key of this._allComponentKeys) {
      if (key === 'logicAnalyzer') {
        if (obj.hasOwnProperty('logic_analyzer')) {
          this.logicAnalyzer.notified(obj['logic_analyzer']);
        }
        continue;
      }
      if (obj.hasOwnProperty(key)) {
        /* because of nullable */
        this[key].notified(obj[key]);
      }
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
    return typeof io === 'number' && this['io' + io] != null;
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

  _getFreePeripheralUnit(peripheral) {
    for (const key of this._allComponentKeys) {
      if (key.indexOf(peripheral) === 0) {
        /* "io" for "io0" */
        const obj = this[key];
        if (typeof obj == 'object' && !obj.isUsed()) {
          obj.used = true;
          return obj;
        }
      }
    }
    throw new Error(`No More ${peripheral} Available.`);
  }

  getFreePwm() {
    return this._getFreePeripheralUnit('pwm');
  }

  getFreeI2C() {
    return this._getFreePeripheralUnit('i2c');
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
    return this._getFreePeripheralUnit('spi');
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
    return this._getFreePeripheralUnit('uart');
  }

  getFreeTcp() {
    return this._getFreePeripheralUnit('tcp');
  }
};
