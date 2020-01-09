import AnalogTemperatureSensor from "../AnalogTemperatureSensor";

class MCP9701 extends AnalogTemperatureSensor {
  public static info() {
    return {
      name: "MCP9701",
    };
  }

  public calc(voltage: any) {
    return (voltage - 0.4) / 0.0195; // Temp(Celsius) = ([AD Voltage]-[Voltage at 0 deg])/[Temp coefficient]
  }
}

if (typeof module === "object") {
  export default MCP9701;
}
