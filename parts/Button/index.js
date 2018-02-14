var Button = function() {

};

Button.prototype.wired = function(obniz, signal, supply) {
  this.obniz = obniz;
  this.io_signal = obniz.getIO(signal);

  if (supply) {
    this.io_supply = obniz.getIO(supply);
    this.io_supply.output(false);
  }

  // start input
  this.io_signal.pull("5v");
}

// Module functions

Button.prototype.onChange = function(callback) {
  this.onchange = callback;
  var self = this;
  this.io_signal.input(function(value) {
    self.isPressed = (value == false);
    if (self.onchange) {
      self.onchange(value == false);
    }
  })
}

Button.prototype.isPressedWait = async function() {
  var self = this;
  var ret = await this.io_signal.inputWait();
  return ret == false;
}

if (PartsRegistrate) {
  PartsRegistrate("Button", Button);
}