import AnalogTemperatureSensor from "../AnalogTemperatureSensor";

class MCP9700 extends AnalogTemperatureSensor {

  public static info() {
    return {
      name: "MCP9700",
    };
  }

  public calc(voltage: any) {
    return (voltage - 0.5) / 0.01; // Temp(Celsius) = ([AD Voltage]-[Voltage at 0 deg])/[Temp coefficient]
  }
}

if (typeof module === "object") {
  export default MCP9700;
}
