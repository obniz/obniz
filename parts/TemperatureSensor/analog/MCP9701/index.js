class MCP9701 extends AnalogTemplatureSensor {
  calc (voltage){
    return   (voltage-0.4)/0.0195; //Temp(Celsius) = ([AD Voltage]-[Voltage at 0 deg])/[Temp coefficient]
  }
};


if (PartsRegistrate) {
  PartsRegistrate("MCP9701", MCP9701);
}

