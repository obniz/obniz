const AnalogTemplatureSensor = require('../AnalogTempratureSensor');

class MCP9700 extends AnalogTemplatureSensor {
  calc(voltage) {
    return (voltage - 0.5) / 0.01; //Temp(Celsius) = ([AD Voltage]-[Voltage at 0 deg])/[Temp coefficient]
  }
}

let Obniz = require('../../../../obniz/index.js');
Obniz.PartsRegistrate('MCP9700', MCP9700);
