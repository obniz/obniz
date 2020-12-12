const AnalogTemperatureSensor = require('../AnalogTemperatureSensor');

class LM35DZ extends AnalogTemperatureSensor {
  constructor() {
    this.tempArray = new Array(100);  // temperature storing array
    this.init_count = 0;
    this.count = 0;
    this.sum = 0; // sum up temperatures
  }

  calc(voltage) {
    this.temp = voltage * 100;  // Temp(Celsius) = [AD Voltage] * 100;

    if (this.init_count < 100) { // initialization
      this.tempArray[this.init_count] = this.temp;
      this.sum += this.temp;
      this.init_count++;
      return this.sum / this.init_count;
    } else {  // moving average
      if (this.count == 100)
        this.count = 0;
      this.sum -= this.tempArray[this.count]; // remove oldest temp data
      this.tempArray[this.count] = this.temp; // overwrite oldest temp data to newest
      this.sum += this.temp;  // add newest temp data
      this.count++;
      return this.sum / 100;
    }
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
