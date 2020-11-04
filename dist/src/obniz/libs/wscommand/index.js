"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @packageDocumentation
 * @ignore
 */
const WSCommand_1 = __importDefault(require("./WSCommand"));
const WSCommandAD_1 = __importDefault(require("./WSCommandAD"));
const WSCommandBle_1 = __importDefault(require("./WSCommandBle"));
const WSCommandDirective_1 = __importDefault(require("./WSCommandDirective"));
const WSCommandDisplay_1 = __importDefault(require("./WSCommandDisplay"));
const WSCommandI2C_1 = __importDefault(require("./WSCommandI2C"));
const WSCommandIO_1 = __importDefault(require("./WSCommandIO"));
const WSCommandLogicAnalyzer_1 = __importDefault(require("./WSCommandLogicAnalyzer"));
const WSCommandMeasurement_1 = __importDefault(require("./WSCommandMeasurement"));
const WSCommandPlugin_1 = __importDefault(require("./WSCommandPlugin"));
const WSCommandPWM_1 = __importDefault(require("./WSCommandPWM"));
const WSCommandSPI_1 = __importDefault(require("./WSCommandSPI"));
const WSCommandSwitch_1 = __importDefault(require("./WSCommandSwitch"));
const WSCommandSystem_1 = __importDefault(require("./WSCommandSystem"));
const WSCommandTcp_1 = __importDefault(require("./WSCommandTcp"));
const WSCommandUart_1 = __importDefault(require("./WSCommandUart"));
const WSCommandWiFi_1 = __importDefault(require("./WSCommandWiFi"));
/* eslint-disable */
WSCommand_1.default.addCommandClass("WSCommandSystem", WSCommandSystem_1.default);
WSCommand_1.default.addCommandClass("WSCommandDirective", WSCommandDirective_1.default);
WSCommand_1.default.addCommandClass("WSCommandIO", WSCommandIO_1.default);
WSCommand_1.default.addCommandClass("WSCommandPWM", WSCommandPWM_1.default);
WSCommand_1.default.addCommandClass("WSCommandUart", WSCommandUart_1.default);
WSCommand_1.default.addCommandClass("WSCommandAD", WSCommandAD_1.default);
WSCommand_1.default.addCommandClass("WSCommandSPI", WSCommandSPI_1.default);
WSCommand_1.default.addCommandClass("WSCommandI2C", WSCommandI2C_1.default);
WSCommand_1.default.addCommandClass("WSCommandLogicAnalyzer", WSCommandLogicAnalyzer_1.default);
WSCommand_1.default.addCommandClass("WSCommandDisplay", WSCommandDisplay_1.default);
WSCommand_1.default.addCommandClass("WSCommandSwitch", WSCommandSwitch_1.default);
WSCommand_1.default.addCommandClass("WSCommandBle", WSCommandBle_1.default);
WSCommand_1.default.addCommandClass("WSCommandMeasurement", WSCommandMeasurement_1.default);
WSCommand_1.default.addCommandClass("WSCommandTcp", WSCommandTcp_1.default);
WSCommand_1.default.addCommandClass("WSCommandWiFi", WSCommandWiFi_1.default);
WSCommand_1.default.addCommandClass("WSCommandPlugin", WSCommandPlugin_1.default);
exports.default = WSCommand_1.default;
