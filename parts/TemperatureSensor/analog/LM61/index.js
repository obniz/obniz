const AnalogTemplatureSensor = require('../AnalogTempratureSensor');

class LM61 extends AnalogTemplatureSensor {
  calc(voltage) {
    return Math.round((voltage - 0.6) / 0.01); //Temp(Celsius) = ([AD Voltage]-[Voltage at 0 deg(Offset voltage)])/[Temp coefficient]
  }
  static info() {
    return {
      name: 'LM61',
    };
  }
}

if (typeof module === 'object') {
  module.exports = LM61;
}
