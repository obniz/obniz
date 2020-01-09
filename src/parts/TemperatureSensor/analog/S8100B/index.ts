const AnalogTemperatureSensor: any = require("../AnalogTemperatureSensor");

// sensor resopnse not found

class S8100B extends AnalogTemperatureSensor {
  public static info() {
    return {
      name: "S8100B",
    };
  }

  public calc(voltage: any) {
    return 30 + (1.508 - voltage) / -0.08; // Temp(Celsius) =
  }
}

if (typeof module === "object") {
  module.exports = S8100B;
}
