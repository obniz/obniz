const AnalogTemperatureSensor = require('../AnalogTemperatureSensor');

class LM35DZ extends AnalogTemperatureSensor {
  calc(voltage) {
    return voltage * 100; //Temp(Celsius) = [AD Voltage] * 100l;
  }
  static info() {
    return {
      name: 'LM35DZ',
    };
  }
}

if (typeof module === 'object') {
  module.exports = LM35DZ;
}
