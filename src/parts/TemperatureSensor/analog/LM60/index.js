const AnalogTemperatureSensor = require('../AnalogTemperatureSensor');

class LM60 extends AnalogTemperatureSensor {
  calc(voltage) {
    return Math.round(((voltage - 0.424) / 0.00625) * 10) / 10; //Temp(Celsius) = ([AD Voltage]-[Voltage at 0 deg(Offset voltage)])/[Temp coefficient]
  }

  static info() {
    return {
      name: 'LM60',
    };
  }
}

if (typeof module === 'object') {
  module.exports = LM60;
}
