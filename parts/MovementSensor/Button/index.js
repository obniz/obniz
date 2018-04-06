var Button = function() {
  this.keys = ["signal","gnd"];
  this.required = ["signal"];
};

Button.prototype.wired = function(obniz) {
  this.io_signal = obniz.getIO(this.params.signal);

  if (obniz.isValidIO(this.params.gnd)) {
    this.io_supply = obniz.getIO(this.params.gnd);
    this.io_supply.output(false);
  }

  // start input
  this.io_signal.pull("5v");
  
  var self = this;
  this.io_signal.input(function(value) {
    self.isPressed = (value === false);
    if (self.onchange) {
      self.onchange(value === false);
    }
  });
};


Button.prototype.isPressedWait = async function() {
  var ret = await this.io_signal.inputWait();
  return ret === false;
};



let Obniz = require("../../../obniz/index.js");
Obniz.PartsRegistrate("Button", Button);