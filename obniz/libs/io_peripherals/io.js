class PeripheralIO {
  constructor(Obniz, id) {
    this.Obniz = Obniz;
    this.id = id;
    this._reset();
  }

  _reset() {
    this.value = 0;
    this.observers = [];
  }

  addObserver(callback) {
    if (callback) {
      this.observers.push(callback);
    }
  }

  output(value) {
    value = value == true;
    let obj = {};
    obj['io' + this.id] = value;
    this.value = value;
    this.Obniz.send(obj);
  }

  drive(drive) {
    if (typeof drive !== 'string') {
      throw new Error('please specify drive methods in string');
    }
    let output_type = '';
    switch (drive) {
      case '5v':
        output_type = 'push-pull5v';
        break;
      case '3v':
        output_type = 'push-pull3v';
        break;
      case 'open-drain':
        output_type = 'open-drain';
        break;
      default:
        throw new Error('unknown drive method');
    }

    let obj = {};
    obj['io' + this.id] = {
      output_type: output_type,
    };
    this.Obniz.send(obj);
  }

  pull(updown) {
    if (typeof updown !== 'string' && updown !== null) {
      throw new Error('please specify pull methods in string');
    }
    let pull_type = '';
    switch (updown) {
      case '5v':
      case 'pull-up5v':
        pull_type = 'pull-up5v';
        break;
      case '3v':
      case 'pull-up3v':
        pull_type = 'pull-up3v';
        break;
      case '0v':
      case 'pull-down':
        pull_type = 'pull-down';
        break;
      case null:
      case 'float':
        pull_type = 'float';
        break;
      default:
        throw new Error('unknown pull_type method');
    }

    let obj = {};
    obj['io' + this.id] = {
      pull_type: pull_type,
    };
    this.Obniz.send(obj);
  }

  input(callback) {
    this.onchange = callback;
    let obj = {};
    obj['io' + this.id] = {
      direction: 'input',
      stream: true,
    };
    this.Obniz.send(obj);
    return this.value;
  }

  inputWait() {
    let self = this;
    return new Promise(function(resolve, reject) {
      self.addObserver(resolve);
      let obj = {};
      obj['io' + self.id] = {
        direction: 'input',
        stream: false,
      };
      self.Obniz.send(obj);
    });
  }

  end() {
    let obj = {};
    obj['io' + this.id] = null;
    this.Obniz.send(obj);
  }

  notified(obj) {
    if (typeof obj === 'boolean') {
      this.value = obj;
      let callback = this.observers.shift();
      if (callback) {
        callback(obj);
      }
      if (typeof this.onchange === 'function') {
        this.onchange(obj);
      }
    } else if (obj && typeof obj === 'object') {
      if (obj.warning) {
        this.Obniz.warning({
          alert: 'warning',
          message: `io${this.id}: ${obj.warning.message}`,
        });
      }
      if (obj.error) {
        this.Obniz.error({
          alert: 'error',
          message: `io${this.id}: ${obj.error.message}`,
        });
      }
    }
  }
}
module.exports = PeripheralIO;
