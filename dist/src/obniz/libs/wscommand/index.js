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
const WSCommandStorage_1 = require("./WSCommandStorage");
const WSCommandMotion_1 = require("./WSCommandMotion");
const WSCommandLocation_1 = require("./WSCommandLocation");
const WSCommandCANBus_1 = require("./WSCommandCANBus");
const commandClasses = {
    WSCommandSystem: WSCommandSystem_1.WSCommandSystem,
    WSCommandDirective: WSCommandDirective_1.WSCommandDirective,
    WSCommandIO: WSCommandIO_1.WSCommandIO,
    WSCommandPWM: WSCommandPWM_1.WSCommandPWM,
    WSCommandUart: WSCommandUart_1.WSCommandUart,
    WSCommandAD: WSCommandAD_1.WSCommandAD,
    WSCommandSPI: WSCommandSPI_1.WSCommandSPI,
    WSCommandI2C: WSCommandI2C_1.WSCommandI2C,
    WSCommandLogicAnalyzer: WSCommandLogicAnalyzer_1.WSCommandLogicAnalyzer,
    WSCommandDisplay: WSCommandDisplay_1.WSCommandDisplay,
    WSCommandSwitch: WSCommandSwitch_1.WSCommandSwitch,
    WSCommandBle: WSCommandBle_1.WSCommandBle,
    WSCommandMeasurement: WSCommandMeasurement_1.WSCommandMeasurement,
    WSCommandTcp: WSCommandTcp_1.WSCommandTcp,
    WSCommandWiFi: WSCommandWiFi_1.WSCommandWiFi,
    WSCommandPlugin: WSCommandPlugin_1.WSCommandPlugin,
    WSCommandCANBus: WSCommandCANBus_1.WSCommandCANBus,
    WSCommandLocation: WSCommandLocation_1.WSCommandLocation,
    WSCommandMotion: WSCommandMotion_1.WSCommandMotion,
    WSCommandStorage: WSCommandStorage_1.WSCommandStorage,
};
const createCommandManager = () => {
    const instance = new WSCommandManager_1.WSCommandManager(commandClasses);
    return instance;
};
exports.createCommandManager = createCommandManager;
exports.WSCommandManagerInstance = (0, exports.createCommandManager)();
