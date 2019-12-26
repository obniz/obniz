class ObnizSwitch {
  constructor(Obniz) {
    this.Obniz = Obniz;
    this._reset();
  }

  _reset() {
    this.observers = [];
    this.onChangeForStateWait = function() {};
  }

  addObserver(callback) {
    if (callback) {
      this.observers.push(callback);
    }
  }

  getWait() {
    let self = this;
    return new Promise(function(resolve, reject) {
      let obj = {};
      obj['switch'] = 'get';
      self.Obniz.send(obj);
      self.addObserver(resolve);
    });
  }

  stateWait(isPressed) {
    let self = this;
    return new Promise(function(resolve, reject) {
      self.onChangeForStateWait = function(pressed) {
        if (isPressed == pressed) {
          self.onChangeForStateWait = function() {};
          resolve();
        }
      };
    });
  }

  notified(obj) {
    this.state = obj.state;
    if (this.onchange) {
      this.onchange(this.state);
    }
    this.onChangeForStateWait(this.state);

    const callback = this.observers.shift();
    if (callback) {
      callback(this.state);
    }
  }
}

module.exports = ObnizSwitch;
