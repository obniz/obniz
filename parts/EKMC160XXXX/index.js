var PIR_ekmc= function() {
  
};

PIR_ekmc.prototype.wired = function(obniz, pwr, signal, gnd) {
  this.obniz = obniz;
  this.io_pwr = obniz.getIO(pwr);
  this.io_gnd = obniz.getIO(gnd);
  this.io_signal = obniz.getIO(signal);
  
  this.io_pwr.output(true);
  this.io_signal.pull("down");
  if (gnd) {
    this.io_gnd = obniz.getIO(gnd);
    this.io_gnd.output(false);
  }
};


// Module functions

PIR_ekmc.prototype.onChange = function(callback) {
  this.onchange = callback;
  var self = this;
  this.io_signal.input(function(value) {
    self.isPressed = (value == false);
    if (self.onchange) {
      self.onchange(value == false);
    }
  });
};

PIR_ekmc.prototype.isPressedWait = async function() {
  var self = this;
  var ret = await this.io_signal.inputWait();
  return ret == false;
}

if (PartsRegistrate) {
  PartsRegistrate("PIR_ekmc", PIR_ekmc);
}