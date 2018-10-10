class InfraredLED {
  constructor() {
    this.keys = ['anode', 'cathode'];
    this.requiredKeys = ['anode'];

    this.dataSymbolLength = 0.07;
  }

  static info() {
    return {
      name: 'InfraredLED',
    };
  }

  wired(obniz) {
    this.obniz = obniz;
    if (!this.obniz.isValidIO(this.params.anode)) {
      throw new Error('anode is not valid io');
    }
    if (this.params.cathode) {
      if (!this.obniz.isValidIO(this.params.cathode)) {
        throw new Error('cathode is not valid io');
      }
      this.io_cathode = obniz.getIO(this.params.cathode);
      this.io_cathode.output(false);
    }
    this.pwm = this.obniz.getFreePwm();
    this.pwm.start({ io: this.params.anode });
    this.pwm.freq(38000);
    this.obniz.wait(150); // TODO: this is instant fix for pwm start delay
  }

  send(arr) {
    if (arr && arr.length > 0 && arr[arr.length - 1] === 1) {
      arr.push(0);
    }
    this.pwm.modulate('am', this.dataSymbolLength, arr);
  }
}

if (typeof module === 'object') {
  module.exports = InfraredLED;
}
