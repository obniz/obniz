const AnalogTemplatureSensor = require('../AnalogTempratureSensor');

//センサから出力が無い(出力インピーダンス高すぎ？)

class S8100B extends AnalogTemplatureSensor {
  calc(voltage) {
    return 30 + (1.508 - voltage) / -0.08; //Temp(Celsius) =
  }
  static info() {
    return {
      name: 'S8100B',
    };
  }
}

if (typeof module === 'object') {
  module.exports = S8100B;
}
