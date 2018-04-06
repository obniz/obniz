const WSCommand = require("./WSCommand_.js");

class WSCommand_Directive extends WSCommand {
  
  constructor(delegate) {
    super(delegate);
    this.module = 1;
  }

}

module.exports = WSCommand_Directive;