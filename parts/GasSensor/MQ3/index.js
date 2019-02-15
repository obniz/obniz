class MQ3 {
  constructor() {
    this.keys = ['gnd', 'vcc', 'do', 'ao'];
    this.requiredKeys = [];

    this.onchangeanalog = undefined;
    this.onchangedigital = undefined;
    this.onexceedvoltage = undefined;
    this.voltageLimit = undefined;

    // this.RL = 2 * 1000;
    // this.RO = 20 * 1000;
  }

  static info() {
    return {
      name: 'MQ3',
    };
  }

  wired(obniz) {
    this.obniz = obniz;

    this.vcc = this.params.vcc;
    this.gnd = this.params.gnd;

    if (this.obniz.isValidIO(this.params.ao)) {
      this.ad = obniz.getAD(this.params.ao);
      this.ad.start(voltage => {
        // this.level = this.calc(voltage);
        if (typeof this.onchangeanalog == 'function') {
          this.onchangeanalog(voltage);
        }
        if (
          typeof this.voltageLimit == 'number' &&
          this.voltageLimit <= voltage &&
          typeof this.onexceedvoltage == 'function'
        ) {
          this.onexceedvoltage(voltage);
        }
      });
    }

    if (this.obniz.isValidIO(this.params.do)) {
      this.do = obniz.getIO(this.params.do);
      this.do.input(value => {
        if (typeof this.onchangedigital == 'function') {
          this.onchangedigital(value);
        }
      });
    }
  }

  startHeating() {
    this.obniz.setVccGnd(this.vcc, this.gnd, '5v');
  }

  heatWait(seconds) {
    this.startHeating();
    if (seconds > 0) {
      seconds *= 1000;
    } else {
      seconds = 2 * 60 * 1000;
    }
    return new Promise(resolve => {
      setTimeout(resolve, seconds);
    });
  }

  // Rs/Ro will descrease by insease of gas.
  // Rs = resitance 20k-100k. Ro = resistance of 1000ppm LPG
  // If RL =

  // calc(voltage) {

  //   if (voltage == 0) {
  //     voltage = 0.000001
  //   }
  //   const RS = this.RL / voltage * 5.0
  //   const ratio = RS / this.RO;

  //   return voltage;
  // }
}

if (typeof module === 'object') {
  module.exports = MQ3;
}
