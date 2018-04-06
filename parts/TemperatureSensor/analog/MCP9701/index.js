
const AnalogTemplatureSensor = require("../AnalogTempratureSensor");

class MCP9701 extends AnalogTemplatureSensor {
  calc (voltage){
    return   (voltage-0.4)/0.0195; //Temp(Celsius) = ([AD Voltage]-[Voltage at 0 deg])/[Temp coefficient]
  }
};

let Obniz = require("../../../../obniz/index.js");
Obniz.PartsRegistrate("MCP9701", MCP9701);

