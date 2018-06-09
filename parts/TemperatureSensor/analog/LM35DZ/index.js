const AnalogTemplatureSensor = require('../AnalogTempratureSensor');
class LM35DZ extends AnalogTemplatureSensor {
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
