const WSCommand = require('./WSCommand_');

/* eslint-disable */
WSCommand.addCommandClass('WSCommand_System', require('./WSCommand_System'));
WSCommand.addCommandClass('WSCommand_Directive', require('./WSCommand_Directive'));
WSCommand.addCommandClass('WSCommand_IO', require('./WSCommand_IO'));
WSCommand.addCommandClass('WSCommand_PWM', require('./WSCommand_PWM'));
WSCommand.addCommandClass('WSCommand_UART', require('./WSCommand_UART'));
WSCommand.addCommandClass('WSCommand_AD', require('./WSCommand_AD'));
WSCommand.addCommandClass('WSCommand_SPI', require('./WSCommand_SPI'));
WSCommand.addCommandClass('WSCommand_I2C', require('./WSCommand_I2C'));
WSCommand.addCommandClass('WSCommand_LogicAnalyzer', require('./WSCommand_LogicAnalyzer'));
WSCommand.addCommandClass('WSCommand_Display', require('./WSCommand_Display'));
WSCommand.addCommandClass('WSCommand_Switch', require('./WSCommand_Switch'));
WSCommand.addCommandClass('WSCommand_Ble', require('./WSCommand_Ble'));
WSCommand.addCommandClass('WSCommand_Measurement', require('./WSCommand_Measurement'));
WSCommand.addCommandClass('WSCommand_Tcp', require('./WSCommand_Tcp'));

module.exports = WSCommand;
