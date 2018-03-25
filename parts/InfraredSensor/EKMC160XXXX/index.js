var PIR_ekmc= function() {
    this.keys = ["vcc","gnd","signal"];
    this.requiredKeys = ["signal"];
    
};

PIR_ekmc.prototype.wired = function(obniz) {
  this.obniz = obniz;
  this.io_signal = obniz.getIO(this.params.signal);
  this.io_signal.pull("0v");
  
  obniz.setVccGnd(this.params.vcc,this.params.gnd, "5v");
  
  var self = this;
  this.io_signal.input(function(value) {
    self.isPressed = (value === false);
    if (self.onchange) {
      self.onchange(value === false);
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