"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WSCommandManagerInstance = void 0;
/**
 * @packageDocumentation
 * @ignore
 */
const WSCommandManager_1 = require("./WSCommandManager");
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
const WSCommandStorage_1 = require("./WSCommandStorage");
const WSCommandSubnet_1 = require("./WSCommandSubnet");
exports.WSCommandManagerInstance = new WSCommandManager_1.WSCommandManager();
/* eslint-disable */
exports.WSCommandManagerInstance.addCommandClass("WSCommandSystem", WSCommandSystem_1.WSCommandSystem);
exports.WSCommandManagerInstance.addCommandClass("WSCommandDirective", WSCommandDirective_1.WSCommandDirective);
exports.WSCommandManagerInstance.addCommandClass("WSCommandIO", WSCommandIO_1.WSCommandIO);
exports.WSCommandManagerInstance.addCommandClass("WSCommandPWM", WSCommandPWM_1.WSCommandPWM);
exports.WSCommandManagerInstance.addCommandClass("WSCommandUart", WSCommandUart_1.WSCommandUart);
exports.WSCommandManagerInstance.addCommandClass("WSCommandAD", WSCommandAD_1.WSCommandAD);
exports.WSCommandManagerInstance.addCommandClass("WSCommandSPI", WSCommandSPI_1.WSCommandSPI);
exports.WSCommandManagerInstance.addCommandClass("WSCommandI2C", WSCommandI2C_1.WSCommandI2C);
exports.WSCommandManagerInstance.addCommandClass("WSCommandLogicAnalyzer", WSCommandLogicAnalyzer_1.WSCommandLogicAnalyzer);
exports.WSCommandManagerInstance.addCommandClass("WSCommandDisplay", WSCommandDisplay_1.WSCommandDisplay);
exports.WSCommandManagerInstance.addCommandClass("WSCommandSwitch", WSCommandSwitch_1.WSCommandSwitch);
exports.WSCommandManagerInstance.addCommandClass("WSCommandBle", WSCommandBle_1.WSCommandBle);
exports.WSCommandManagerInstance.addCommandClass("WSCommandMeasurement", WSCommandMeasurement_1.WSCommandMeasurement);
exports.WSCommandManagerInstance.addCommandClass("WSCommandTcp", WSCommandTcp_1.WSCommandTcp);
exports.WSCommandManagerInstance.addCommandClass("WSCommandWiFi", WSCommandWiFi_1.WSCommandWiFi);
exports.WSCommandManagerInstance.addCommandClass("WSCommandPlugin", WSCommandPlugin_1.WSCommandPlugin);
exports.WSCommandManagerInstance.addCommandClass("WSCommandStorage", WSCommandStorage_1.WSCommandStorage);
exports.WSCommandManagerInstance.addCommandClass("WSCommandSubnet", WSCommandSubnet_1.WSCommandSubnet);
