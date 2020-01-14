import AnalogTemperatureSensor from "../AnalogTemperatureSensor";

class LM61 extends AnalogTemperatureSensor {
  public static info() {
    return {
      name: "LM61",
    };
  }

  public calc(voltage: any) {
    return Math.round((voltage - 0.6) / 0.01); // Temp(Celsius) = ([AD Voltage]-[Voltage at 0 deg(Offset voltage)])/[Temp coefficient]
  }
}

export default LM61;