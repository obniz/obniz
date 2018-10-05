class IRModule {
  constructor() {
    this.keys = ['sens_out', 'vcc', 'led_anode', 'gnd'];
    this.requiredKeys = ['sens_out', 'led_anode'];
  }

  static info() {
    return {
      name: 'IRModule',
    };
  }

  wired(obniz) {
    this.obniz = obniz;
    obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');

    if (!obniz.isValidIO(this.params.sens_out)) {
      throw new Error('sens_out is not valid io');
    }

    if (!obniz.isValidIO(this.params.led_anode)) {
      throw new Error('led_anode is not valid io');
    }

    this.sensor = obniz.wired('IRSensor', {
      output: this.params.sens_out,
    });
    this.setGetterSetter('sensor', 'duration');
    this.setGetterSetter('sensor', 'dataInverted');
    this.setGetterSetter('sensor', 'cutTail');
    this.setGetterSetter('sensor', 'output_pullup');
    this.setGetterSetter('sensor', 'ondetect');

    this.led = obniz.wired('InfraredLED', {
      anode: this.params.led_anode,
    });
  }

  //link
  send(arr) {
    this.led.send(arr);
  }
  start(callback) {
    this.sensor.start(callback);
  }

  get dataSymbolLength() {
    return this.sensor.dataSymbolLength;
  }
  set dataSymbolLength(x) {
    this.sensor.dataSymbolLength = x;
    this.led.dataSymbolLength = x;
  }
  setGetterSetter(partsName, varName) {
    Object.defineProperty(this, varName, {
      get() {
        return this[partsName][varName];
      },
      set(x) {
        this[partsName][varName] = x;
      },
    });
  }
}

if (typeof module === 'object') {
  module.exports = IRModule;
}
