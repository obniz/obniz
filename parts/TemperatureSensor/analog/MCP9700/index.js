const AnalogTemplatureSensor = require('../AnalogTempratureSensor');

class MCP9700 extends AnalogTemplatureSensor {
  calc(voltage) {
    return (voltage - 0.5) / 0.01; //Temp(Celsius) = ([AD Voltage]-[Voltage at 0 deg])/[Temp coefficient]
  }

  static info() {
    return {
      name: 'MCP9700',
    };
  }
}

if (typeof module === 'object') {
  module.exports = MCP9700;
}
