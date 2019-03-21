const semver = require('semver');

class Directive {
  constructor(Obniz, id) {
    this.Obniz = Obniz;
    this.observers = [];
    this._reset();
  }

  _reset() {
    for (let i = 0; i < this.observers.length; i++) {
      this.observers[i].reject();
    }
    this.observers = [];
    this._animationIdentifier = 0;
  }

  addObserver(name, resolve, reject) {
    if (name && resolve && reject) {
      this.observers.push({
        name,
        resolve,
        reject,
      });
    }
  }

  animation(name, status, array, repeat) {
    if (
      (typeof repeat == 'number' || status == 'registrate') &&
      semver.lt(this.Obniz.firmware_ver, '2.0.0')
    ) {
      throw new Error(`Please update obniz firmware >= 2.0.0`);
    }
    let obj = {};
    obj.io = {
      animation: {
        name: name,
        status: status,
      },
    };
    if (typeof repeat == 'number') {
      obj.io.animation.repeat = repeat;
    }
    if (!array) array = [];

    let states = [];
    for (let i = 0; i < array.length; i++) {
      let state = array[i];
      let duration = state.duration;
      let operation = state.state;

      // dry run. and get json commands
      this.Obniz.sendPool = [];
      operation(i);
      let pooledJsonArray = this.Obniz.sendPool;
      this.Obniz.sendPool = null;
      states.push({
        duration: duration,
        state: pooledJsonArray,
      });
    }
    if (status === 'loop' || status === 'registrate') {
      obj.io.animation.states = states;
    }
    this.Obniz.send(obj);
  }

  repeatWait(array, repeat) {
    if (semver.lt(this.Obniz.firmware_ver, '2.0.0')) {
      throw new Error(`Please update obniz firmware >= 2.0.0`);
    }
    if (typeof repeat !== 'number' || repeat < 1) {
      throw new Error('please specify repeat count > 0');
    }
    if (parseInt(repeat) !== repeat) {
      throw new Error('please provide integer number like 1, 2, 3,,,');
    }

    return new Promise((resolve, reject) => {
      const name = '_repeatwait' + Date.now() + this._animationIdentifier;
      if (++this._animationIdentifier > 1000) {
        this._animationIdentifier = 0;
      }

      this.animation(name, 'loop', array, repeat);
      this.addObserver(name, resolve, reject);
    });
  }

  notified(obj) {
    if (obj.animation.status == 'finish') {
      for (let i = this.observers.length - 1; i >= 0; i--) {
        if (obj.animation.name === this.observers[i].name) {
          this.observers[i].resolve();
          this.observers.splice(i, 1);
        }
      }
    }
  }
}

module.exports = Directive;
