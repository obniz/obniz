const AnalogTemplatureSensor = require('../AnalogTempratureSensor');
class LM35DZ extends AnalogTemplatureSensor {
  calc(voltage) {
    return voltage * 100; //Temp(Celsius) = [AD Voltage] * 100l;
  }
}

let Obniz = require('../../../../obniz/index.js');
Obniz.PartsRegistrate('LM35DZ', LM35DZ);
