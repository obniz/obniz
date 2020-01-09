import AnalogTemperatureSensor from "../AnalogTemperatureSensor";

class LMT87 extends AnalogTemperatureSensor {
  public static info() {
    return {
      name: "LMT87",
    };
  }

  public calc(voltage: any) {
    return (voltage * 1000 - 2365) / -13.6 + 20; // 20-50dc;
  }
}

if (typeof module === "object") {
  export default LMT87;
}
