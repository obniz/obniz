"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @packageDocumentation
 * @ignore
 */
const WSCommand_1 = require("./WSCommand");
const WSCommandAD_1 = require("./WSCommandAD");
const WSCommandBle_1 = require("./WSCommandBle");
const WSCommandDirective_1 = require("./WSCommandDirective");
const WSCommandDisplay_1 = require("./WSCommandDisplay");
const WSCommandI2C_1 = require("./WSCommandI2C");
const WSCommandIO_1 = require("./WSCommandIO");
const WSCommandLogicAnalyzer_1 = require("./WSCommandLogicAnalyzer");
const WSCommandMeasurement_1 = require("./WSCommandMeasurement");
const WSCommandPlugin_1 = require("./WSCommandPlugin");
const WSCommandPWM_1 = require("./WSCommandPWM");
const WSCommandSPI_1 = require("./WSCommandSPI");
const WSCommandSwitch_1 = require("./WSCommandSwitch");
const WSCommandSystem_1 = require("./WSCommandSystem");
const WSCommandTcp_1 = require("./WSCommandTcp");
const WSCommandUart_1 = require("./WSCommandUart");
const WSCommandWiFi_1 = require("./WSCommandWiFi");
/* eslint-disable */
WSCommand_1.WSCommand.addCommandClass("WSCommandSystem", WSCommandSystem_1.WSCommandSystem);
WSCommand_1.WSCommand.addCommandClass("WSCommandDirective", WSCommandDirective_1.WSCommandDirective);
WSCommand_1.WSCommand.addCommandClass("WSCommandIO", WSCommandIO_1.WSCommandIO);
WSCommand_1.WSCommand.addCommandClass("WSCommandPWM", WSCommandPWM_1.WSCommandPWM);
WSCommand_1.WSCommand.addCommandClass("WSCommandUart", WSCommandUart_1.WSCommandUart);
WSCommand_1.WSCommand.addCommandClass("WSCommandAD", WSCommandAD_1.WSCommandAD);
WSCommand_1.WSCommand.addCommandClass("WSCommandSPI", WSCommandSPI_1.WSCommandSPI);
WSCommand_1.WSCommand.addCommandClass("WSCommandI2C", WSCommandI2C_1.WSCommandI2C);
WSCommand_1.WSCommand.addCommandClass("WSCommandLogicAnalyzer", WSCommandLogicAnalyzer_1.WSCommandLogicAnalyzer);
WSCommand_1.WSCommand.addCommandClass("WSCommandDisplay", WSCommandDisplay_1.WSCommandDisplay);
WSCommand_1.WSCommand.addCommandClass("WSCommandSwitch", WSCommandSwitch_1.WSCommandSwitch);
WSCommand_1.WSCommand.addCommandClass("WSCommandBle", WSCommandBle_1.WSCommandBle);
WSCommand_1.WSCommand.addCommandClass("WSCommandMeasurement", WSCommandMeasurement_1.WSCommandMeasurement);
WSCommand_1.WSCommand.addCommandClass("WSCommandTcp", WSCommandTcp_1.WSCommandTcp);
WSCommand_1.WSCommand.addCommandClass("WSCommandWiFi", WSCommandWiFi_1.WSCommandWiFi);
WSCommand_1.WSCommand.addCommandClass("WSCommandPlugin", WSCommandPlugin_1.WSCommandPlugin);
exports.default = WSCommand_1.WSCommand;
