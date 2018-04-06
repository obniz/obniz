const WSCommand = require("./WSCommand_");


WSCommand.addCommandClass(require("./WSCommand_System"));
WSCommand.addCommandClass(require("./WSCommand_Directive"));
WSCommand.addCommandClass(require("./WSCommand_IO"));
WSCommand.addCommandClass(require("./WSCommand_PWM"));
WSCommand.addCommandClass(require("./WSCommand_UART"));
WSCommand.addCommandClass(require("./WSCommand_AD"));
WSCommand.addCommandClass(require("./WSCommand_SPI"));
WSCommand.addCommandClass(require("./WSCommand_I2C"));
WSCommand.addCommandClass(require("./WSCommand_LogicAnalyzer"));
WSCommand.addCommandClass(require("./WSCommand_Display"));
WSCommand.addCommandClass(require("./WSCommand_Switch"));
WSCommand.addCommandClass(require("./WSCommand_Ble"));
WSCommand.addCommandClass(require("./WSCommand_Measurement"));

module.exports = WSCommand;