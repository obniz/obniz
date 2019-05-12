const AnalogTemperatureSensor = require('../AnalogTemperatureSensor');

//this not work, but sometimes good
//resason1:too low of obniz input Impedance ?
//resoson2:Is the sensor oscillating?

class S8120C extends AnalogTemperatureSensor {
  calc(voltage) {
    return (voltage - 1.474) / -0.0082 + 30; //Temp(Celsius) = (([AD Voltage] - [Output Voltage at 30deg])/[V/deg]) + 30
  }
  static info() {
    return {
      name: 'S8120C',
    };
  }
}

if (typeof module === 'object') {
  module.exports = S8120C;
}
