const AnalogTemperatureSensor = require('../AnalogTemperatureSensor');

class LMT87 extends AnalogTemperatureSensor {
  calc(voltage) {
    return (voltage * 1000 - 2365) / -13.6 + 20; //20-50dc;
  }
  static info() {
    return {
      name: 'LMT87',
    };
  }
}

if (typeof module === 'object') {
  module.exports = LMT87;
}
