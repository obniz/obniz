/**
 * @packageDocumentation
 * @ignore
 */
import WSCommand from "./WSCommand";
import WSCommandAD from "./WSCommandAD";
import WSCommandBle from "./WSCommandBle";
import WSCommandDirective from "./WSCommandDirective";
import WSCommandDisplay from "./WSCommandDisplay";
import WSCommandI2C from "./WSCommandI2C";
import WSCommandIO from "./WSCommandIO";
import WSCommandLogicAnalyzer from "./WSCommandLogicAnalyzer";
import WSCommandMeasurement from "./WSCommandMeasurement";
import WSCommandPlugin from "./WSCommandPlugin";
import WSCommandPWM from "./WSCommandPWM";
import WSCommandSPI from "./WSCommandSPI";
import WSCommandSwitch from "./WSCommandSwitch";
import WSCommandSystem from "./WSCommandSystem";
import WSCommandTcp from "./WSCommandTcp";
import WSCommandUart from "./WSCommandUart";
import WSCommandWiFi from "./WSCommandWiFi";

/* eslint-disable */
WSCommand.addCommandClass("WSCommandSystem", WSCommandSystem);
WSCommand.addCommandClass("WSCommandDirective", WSCommandDirective);
WSCommand.addCommandClass("WSCommandIO", WSCommandIO);
WSCommand.addCommandClass("WSCommandPWM", WSCommandPWM);
WSCommand.addCommandClass("WSCommandUart", WSCommandUart);
WSCommand.addCommandClass("WSCommandAD", WSCommandAD);
WSCommand.addCommandClass("WSCommandSPI", WSCommandSPI);
WSCommand.addCommandClass("WSCommandI2C", WSCommandI2C);
WSCommand.addCommandClass("WSCommandLogicAnalyzer", WSCommandLogicAnalyzer);
WSCommand.addCommandClass("WSCommandDisplay", WSCommandDisplay);
WSCommand.addCommandClass("WSCommandSwitch", WSCommandSwitch);
WSCommand.addCommandClass("WSCommandBle", WSCommandBle);
WSCommand.addCommandClass("WSCommandMeasurement", WSCommandMeasurement);
WSCommand.addCommandClass("WSCommandTcp", WSCommandTcp);
WSCommand.addCommandClass("WSCommandWiFi", WSCommandWiFi);
WSCommand.addCommandClass("WSCommandPlugin", WSCommandPlugin);

export default WSCommand;
