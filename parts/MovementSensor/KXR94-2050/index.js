class KXR94_2050 {
  constructor() {
    this.keys = ['x', 'y', 'z', 'vcc', 'gnd', 'enable', 'self_test'];
    this.requiredKeys = ['x', 'y', 'z'];
  }

  static info() {
    return {
      name: 'KXR94_2050',
    };
  }

  wired(obniz) {
    this.obniz = obniz;

    obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');

    this.ad_x = obniz.getAD(this.params.x);
    this.ad_y = obniz.getAD(this.params.y);
    this.ad_z = obniz.getAD(this.params.z);

    if (obniz.isValidIO(this.params.enable)) {
      obniz.getIO(this.params.enable).drive('5v');
      obniz.getIO(this.params.enable).output(true);
    }
    if (obniz.isValidIO(this.params.self_test)) {
      obniz.getIO(this.params.self_test).drive('5v');
      obniz.getIO(this.params.self_test).output(false);
    }

    return (async () => {
      if (obniz.isValidIO(this.params.vcc)) {
        let pwrVoltage = await obniz.getAD(this.params.vcc).getWait();
        this.changeVccVoltage(pwrVoltage);
      } else {
        this.changeVccVoltage(5);
      }

      this.ad_x.start(value => {
        if (this.onchangex) {
          this.onchangex(this.voltage2gravity(value));
        }
      });

      this.ad_y.start(value => {
        if (this.onchangey) {
          this.onchangey(this.voltage2gravity(value));
        }
      });

      this.ad_z.start(value => {
        if (this.onchangez) {
          this.onchangez(this.voltage2gravity(value));
        }
      });

      if (this.obniz.isValidIO(this.params.vcc)) {
        this.obniz.getAD(this.params.vcc).start(value => {
          this.changeVccVoltage(value);
        });
      }

      obniz.display.setPinName(this.params.x, 'KXR94_2050', 'x');
      obniz.display.setPinName(this.params.y, 'KXR94_2050', 'y');
      obniz.display.setPinName(this.params.z, 'KXR94_2050', 'z');

      if (this.obniz.isValidIO(this.params.vcc)) {
        obniz.display.setPinName(this.params.vcc, 'KXR94_2050', 'vcc');
      }
    })();
  }

  changeVccVoltage(pwrVoltage) {
    this.sensitivity = pwrVoltage / 5; //Set sensitivity (unit:V)
    this.offsetVoltage = pwrVoltage / 2; //Set offset voltage (Output voltage at 0g, unit:V)
  }

  voltage2gravity(volt) {
    return (volt - this.offsetVoltage) / this.sensitivity;
  }

  async getWait() {
    let result = await Promise.all([
      this.ad_x.getWait(),
      this.ad_y.getWait(),
      this.ad_z.getWait(),
    ]);

    return {
      x: this.voltage2gravity(result[0]),
      y: this.voltage2gravity(result[1]),
      z: this.voltage2gravity(result[2]),
    };
  }
}

if (typeof module === 'object') {
  module.exports = KXR94_2050;
}
