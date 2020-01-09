const AnalogTemperatureSensor: any = require("../AnalogTemperatureSensor");

// this not work, but sometimes good
// resason1:too low of obniz input Impedance ?
// resoson2:Is the sensor oscillating?

class S8120C extends AnalogTemperatureSensor {
  public static info() {
    return {
      name: "S8120C",
    };
  }

  public calc(voltage: any) {
    return (voltage - 1.474) / -0.0082 + 30; // Temp(Celsius) = (([AD Voltage] - [Output Voltage at 30deg])/[V/deg]) + 30
  }
}

if (typeof module === "object") {
  module.exports = S8120C;
}
