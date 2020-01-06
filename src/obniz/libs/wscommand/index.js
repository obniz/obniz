const WSCommand = require('./WSCommand');

/* eslint-disable */
WSCommand.addCommandClass("WSCommandSystem", require("./WSCommandSystem"));
WSCommand.addCommandClass("WSCommandDirective", require("./WSCommandDirective"));
WSCommand.addCommandClass("WSCommandIO", require("./WSCommandIO"));
WSCommand.addCommandClass("WSCommandPWM", require("./WSCommandPWM"));
WSCommand.addCommandClass("WSCommandUart", require("./WSCommandUart"));
WSCommand.addCommandClass("WSCommandAD", require("./WSCommandAD"));
WSCommand.addCommandClass("WSCommandSPI", require("./WSCommandSPI"));
WSCommand.addCommandClass("WSCommandI2C", require("./WSCommandI2C"));
WSCommand.addCommandClass("WSCommandLogicAnalyzer", require("./WSCommandLogicAnalyzer"));
WSCommand.addCommandClass("WSCommandDisplay", require("./WSCommandDisplay"));
WSCommand.addCommandClass("WSCommandSwitch", require("./WSCommandSwitch"));
WSCommand.addCommandClass("WSCommandBle", require("./WSCommandBle"));
WSCommand.addCommandClass("WSCommandMeasurement", require("./WSCommandMeasurement"));
WSCommand.addCommandClass("WSCommandTcp", require("./WSCommandTcp"));

module.exports = WSCommand;
