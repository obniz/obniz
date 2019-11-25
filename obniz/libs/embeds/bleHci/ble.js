const ObnizBLEHci = require('./hci');
const Bindings = require('./protocol/bindings');
class ObnizBLE {
  constructor(Obniz) {
    this.Obniz = Obniz;
    this.hci = new ObnizBLEHci(Obniz);
    this._reset();
    this._bindings = new Bindings(this.hci);
  }

  init() {
    this._bindings.init();
  }

  notified(obj) {
    if (obj.hci) {
      this.hci.notified(obj.hci);
    }
  }

  _reset() {}
}

module.exports = ObnizBLE;
