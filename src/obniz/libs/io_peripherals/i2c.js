const ObnizUtil = require('../utils/util');

class PeripheralI2C {
  constructor(Obniz, id) {
    this.Obniz = Obniz;
    this.id = id;
    this._reset();
    this.onerror = undefined;
  }

  _reset() {
    this.observers = [];
    this.state = {};
    this.used = false;
    this.onwritten = undefined;
  }

  addObserver(callback) {
    if (callback) {
      this.observers.push(callback);
    }
  }

  start(arg) {
    let err = ObnizUtil._requiredKeys(arg, ['mode', 'sda', 'scl']);
    if (err) {
      throw new Error("I2C start param '" + err + "' required, but not found ");
    }
    this.state = ObnizUtil._keyFilter(arg, [
      'mode',
      'sda',
      'scl',
      'pull',
      'gnd',
    ]);

    let ioKeys = ['sda', 'scl', 'gnd'];
    for (let key of ioKeys) {
      if (this.state[key] && !this.Obniz.isValidIO(this.state[key])) {
        throw new Error("i2c start param '" + key + "' are to be valid io no");
      }
    }

    let mode = this.state.mode;
    let clock = typeof arg.clock === 'number' ? parseInt(arg.clock) : null;
    let slave_address =
      typeof arg.slave_address === 'number'
        ? parseInt(arg.slave_address)
        : null;
    let slave_address_length =
      typeof arg.slave_address_length === 'number'
        ? parseInt(arg.slave_address_length)
        : null;

    if (mode !== 'master' && mode !== 'slave') {
      throw new Error('i2c: invalid mode ' + mode);
    }
    if (mode === 'master') {
      if (clock === null) {
        throw new Error('i2c: please specify clock when master mode');
      }
      if (clock <= 0 || clock > 1 * 1000 * 1000) {
        throw new Error('i2c: invalid clock ' + clock);
      }
      if (arg.pull === '5v' && clock > 400 * 1000) {
        throw new Error(
          'i2c: please use under 400khz when internal 5v internal pull-up'
        );
      }
      if (arg.pull === '3v' && clock > 100 * 1000) {
        throw new Error(
          'i2c: please use under 100khz when internal 3v internal pull-up'
        );
      }
    } else {
      if (slave_address === null) {
        throw new Error('i2c: please specify slave_address');
      }
      if (slave_address < 0 || slave_address > 0x7f) {
        throw new Error('i2c: invalid slave_address');
      }
      if (slave_address < 0 || slave_address > 0x7f) {
        throw new Error('i2c: invalid slave_address');
      }
      if (slave_address_length !== null && slave_address_length !== 7) {
        throw new Error('i2c: invalid slave_address_length. please specify 7');
      }
    }

    this.Obniz.getIO(this.state.sda).drive('open-drain');
    this.Obniz.getIO(this.state.scl).drive('open-drain');

    if (this.state.pull) {
      this.Obniz.getIO(this.state.sda).pull(this.state.pull);
      this.Obniz.getIO(this.state.scl).pull(this.state.pull);
    } else {
      this.Obniz.getIO(this.state.sda).pull(null);
      this.Obniz.getIO(this.state.scl).pull(null);
    }

    if (this.state.gnd !== undefined) {
      this.Obniz.getIO(this.state.gnd).output(false);
      let ioNames = {};
      ioNames[this.state.gnd] = 'gnd';
      this.Obniz.display.setPinNames('i2c' + this.id, ioNames);
    }

    let startObj = ObnizUtil._keyFilter(this.state, ['mode', 'sda', 'scl']);
    if (mode === 'master') {
      startObj.clock = clock;
    } else {
      startObj.slave_address = slave_address;
      if (slave_address_length) {
        startObj.slave_address_length = slave_address_length;
      }
    }

    let obj = {};
    obj['i2c' + this.id] = startObj;
    this.used = true;
    this.Obniz.send(obj);
  }

  write(address, data) {
    if (!this.used) {
      throw new Error(`i2c${this.id} is not started`);
    }
    address = parseInt(address);
    if (isNaN(address)) {
      throw new Error('i2c: please specify address');
    }
    if (address < 0 || address > 0x7f) {
      throw new Error('i2c: invalid address');
    }
    if (!data) {
      throw new Error('i2c: please provide data');
    }
    if (data.length > 1024) {
      throw new Error('i2c: data should be under 1024 bytes');
    }
    let obj = {};
    obj['i2c' + this.id] = {
      address,
      data,
    };
    this.Obniz.send(obj);
  }

  readWait(address, length) {
    if (!this.used) {
      throw new Error(`i2c${this.id} is not started`);
    }
    address = parseInt(address);
    if (isNaN(address)) {
      throw new Error('i2c: please specify address');
    }
    if (address < 0 || address > 0x7f) {
      throw new Error('i2c: invalid address');
    }
    length = parseInt(length);
    if (isNaN(length) || length < 0) {
      throw new Error('i2c: invalid length to read');
    }
    if (length > 1024) {
      throw new Error('i2c: data length should be under 1024 bytes');
    }
    let self = this;
    return new Promise(function(resolve, reject) {
      self.addObserver(resolve);
      let obj = {};
      obj['i2c' + self.id] = {
        address,
        read: length,
      };
      self.Obniz.send(obj);
    });
  }

  notified(obj) {
    if (obj && typeof obj === 'object') {
      if (obj.data) {
        if (obj.mode === 'slave' && typeof this.onwritten === 'function') {
          this.onwritten(obj.data, obj.address);
        } else {
          // TODO: we should compare byte length from sent
          let callback = this.observers.shift();
          if (callback) {
            callback(obj.data);
          }
        }
      }
      if (obj.warning) {
        this.Obniz.warning({
          alert: 'warning',
          message: `i2c${this.id}: ${obj.warning.message}`,
        });
      }
      if (obj.error) {
        const message = `i2c${this.id}: ${obj.error.message}`;
        if (typeof this.onerror === 'function') {
          this.onerror(new Error(message));
        } else {
          this.Obniz.error({
            alert: 'error',
            message: message,
          });
        }
      }
    }
  }

  isUsed() {
    return this.used;
  }

  end() {
    this.state = {};
    let obj = {};
    obj['i2c' + this.id] = null;
    this.Obniz.send(obj);
    this.used = false;
  }
}

module.exports = PeripheralI2C;
