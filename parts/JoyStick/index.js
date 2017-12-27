JoyStick = function() {
  
};

JoyStick.prototype.wired = function(obniz, sig_sw, sig_y, sig_x, pwr, gnd) {
  this.obniz = obniz;
  this.io_pwr = obniz.getIO(pwr);
  this.io_gnd = obniz.getIO(gnd);
  this.io_sig_sw = obniz.getIO(sig_sw);
  this.ad_x = obniz.getAD(sig_y);
  this.ad_y = obniz.getAD(sig_x);
  
  
  this.io_pwr.output(true);
  this.io_gnd.output(false);
  this.io_sig_sw.pullup();
  
      
  var self = this;
  this.ad_x.start(function(value){
    self.positionX = value/ 5.0;
    if (self.onchangeX) {
      self.onchangeX(self.positionX);
    }
  });
  
  this.ad_y.start(function(value){
    self.positionY = value/ 5.0;
    if (self.onchangeY) {
      self.onchangeY(self.positionY);
    }
  });
  
};
  
  // Module functions
JoyStick.prototype.onChangeX = function(callback) {
  this.onchangeX = callback;
};

JoyStick.prototype.onChangeY = function(callback) {
  this.onchangeY = callback;
};

JoyStick.prototype.onChangeSW = function(callback) {
  this.onchangeSW = callback;
  var self = this;
  this.io_sig_sw.input(function(value) {
    self.isPressed = (value == false);
    if (self.onchangeSW) {
      self.onchangeSW(value == false);
    }
  });
};

JoyStick.prototype.isPressedWait = async function() {
  var self = this;
  var ret = await this.io_sig_sw.inputWait();
  return ret == false;
}

  
  if (PartsRegistrate) {
  PartsRegistrate("JoyStick", JoyStick);
  }