class Grove_EarHeartRate {
  constructor() {
    this.keys = ['vcc', 'gnd', 'signal'];
    this.requiredKeys = ['vcc', 'gnd'];

    this.displayIoNames = {
      vcc: 'vcc',
      gnd: 'gnd',
      signal: 'signal',
    };

    this.interval = 5;
    this.duration = 2.5 * 1000;
  }

  static info() {
    return {
      name: 'Grove_EarHeartRate',
    };
  }

  wired(obniz) {
    this.obniz = obniz;
    obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');
  }

  start(callback) {
    this.obniz.logicAnalyzer.start({
      io: this.params.signal,
      interval: this.interval,
      duration: this.duration,
    });

    this.obniz.logicAnalyzer.onmeasured = array => {
      let edges = [];
      for (let i = 0; i < array.length - 1; i++) {
        if (array[i] === 0 && array[i + 1] === 1) {
          edges.push(i);
        }
      }
      if (edges.length >= 2) {
        let between = 0;
        let pulseMin = 0;
        between = ((edges[1] - edges[0]) * this.interval) / 1000.0;
        pulseMin = 60 / between;
        callback(pulseMin);
      }
    };
  }

  getWait() {
    return new Promise(resolve => {
      this.start(rate => {
        resolve(rate);
      });
    });
  }
}

if (typeof module === 'object') {
  module.exports = Grove_EarHeartRate;
}
