const AnalogTemplatureSensor = require('../AnalogTempratureSensor');

//不調, 正しく測れるときもある...
//原因1:obnizの入力インピーダンスが低すぎる?
//原因2:センサーが発振してる？（データシート通り抵抗を追加したが改善しない）

class S8120C extends AnalogTemplatureSensor {
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
