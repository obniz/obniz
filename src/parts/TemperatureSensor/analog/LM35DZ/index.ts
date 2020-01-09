import AnalogTemperatureSensor from "../AnalogTemperatureSensor";

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

export default LM35DZ;
