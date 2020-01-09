import AnalogTemperatureSensor from "../AnalogTemperatureSensor";

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

export default S8100B;
