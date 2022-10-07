"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WSCommandManagerInstance = exports.createCommandManager = void 0;
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
const createCommandManager = () => {
    const instance = new WSCommandManager_1.WSCommandManager();
    /* eslint-disable */
    instance.addCommandClass("WSCommandSystem", WSCommandSystem_1.WSCommandSystem);
    instance.addCommandClass("WSCommandDirective", WSCommandDirective_1.WSCommandDirective);
    instance.addCommandClass("WSCommandIO", WSCommandIO_1.WSCommandIO);
    instance.addCommandClass("WSCommandPWM", WSCommandPWM_1.WSCommandPWM);
    instance.addCommandClass("WSCommandUart", WSCommandUart_1.WSCommandUart);
    instance.addCommandClass("WSCommandAD", WSCommandAD_1.WSCommandAD);
    instance.addCommandClass("WSCommandSPI", WSCommandSPI_1.WSCommandSPI);
    instance.addCommandClass("WSCommandI2C", WSCommandI2C_1.WSCommandI2C);
    instance.addCommandClass("WSCommandLogicAnalyzer", WSCommandLogicAnalyzer_1.WSCommandLogicAnalyzer);
    instance.addCommandClass("WSCommandDisplay", WSCommandDisplay_1.WSCommandDisplay);
    instance.addCommandClass("WSCommandSwitch", WSCommandSwitch_1.WSCommandSwitch);
    instance.addCommandClass("WSCommandBle", WSCommandBle_1.WSCommandBle);
    instance.addCommandClass("WSCommandMeasurement", WSCommandMeasurement_1.WSCommandMeasurement);
    instance.addCommandClass("WSCommandTcp", WSCommandTcp_1.WSCommandTcp);
    instance.addCommandClass("WSCommandWiFi", WSCommandWiFi_1.WSCommandWiFi);
    instance.addCommandClass("WSCommandPlugin", WSCommandPlugin_1.WSCommandPlugin);
    return instance;
};
exports.createCommandManager = createCommandManager;
exports.WSCommandManagerInstance = (0, exports.createCommandManager)();
