const ObnizBLEHci = require('./hci');
class ObnizBLE {
  constructor(Obniz) {
    this.Obniz = Obniz;
    this.hci = new ObnizBLEHci(Obniz);
    this._reset();
  }

  notified(obj) {
    if (obj.hci) {
      this.hci.notified(obj.hci);
    }
  }

  _reset() {}
}

module.exports = ObnizBLE;
