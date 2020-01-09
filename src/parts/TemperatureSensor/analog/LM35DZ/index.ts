const AnalogTemperatureSensor: any = require("../AnalogTemperatureSensor");

class LM35DZ extends AnalogTemperatureSensor {
  public static info() {
    return {
      name: "LM35DZ",
    };
  }

  public calc(voltage: any) {
    return voltage * 100; // Temp(Celsius) = [AD Voltage] * 100l;
  }
}

if (typeof module === "object") {
  module.exports = LM35DZ;
}
