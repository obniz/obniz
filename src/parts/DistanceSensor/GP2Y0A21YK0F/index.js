class GP2Y0A21YK0F {
  constructor() {
    this.keys = ['vcc', 'gnd', 'signal'];
    this.requiredKeys = ['signal'];

    this.displayIoNames = {
      vcc: 'vcc',
      gnd: 'gnd',
      signal: 'signal',
    };
    this._unit = 'mm';
  }

  static info() {
    return {
      name: 'GP2Y0A21YK0F',
    };
  }

  wired(obniz) {
    this.obniz = obniz;

    obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');
    this.io_signal = obniz.getIO(this.params.signal);
    this.io_signal.end();
    this.ad_signal = obniz.getAD(this.params.signal);
  }

  start(callback) {
    this.ad_signal.start(val => {
      let distance = this._volt2distance(val);
      if (typeof callback == 'function') {
        callback(distance);
      }
    });
  }

  _volt2distance(val) {
    if (val <= 0) {
      val = 0.001;
    }
    let distance = 19988.34 * Math.pow((val / 5.0) * 1024, -1.25214) * 10;
    if (this._unit === 'mm') {
      distance = parseInt(distance * 10) / 10;
    } else {
      distance *= 0.0393701;
      distance = parseInt(distance * 1000) / 1000;
    }
    return distance;
  }

  getWait() {
    return new Promise(async resolve => {
      let val = await this.ad_signal.getWait();
      let distance = this._volt2distance(val);
      resolve(distance);
    });
  }

  unit(unit) {
    if (unit === 'mm') {
      this._unit = 'mm';
    } else if (unit === 'inch') {
      this._unit = 'inch';
    } else {
      throw new Error('unknown unit ' + unit);
    }
  }
}

if (typeof module === 'object') {
  module.exports = GP2Y0A21YK0F;
}
