LED = function() {

};

LED.prototype.wired = function(obniz, anode, cathode) {
  this.obniz = obniz;
  this.io_anode = obniz.getIO(anode);
  if (cathode) {
    this.io_cathode = obniz.getIO(cathode);
    this.io_cathode.output(false);
  }
};

// Module functions

LED.prototype.on = function() {
  this.endBlink();
  this.io_anode.output(true);
};

LED.prototype.off = function() {
  this.endBlink();
  this.io_anode.output(false);
};

LED.prototype.endBlink = function() {
  if (this.blink_timer) {
    clearInterval(this.blink_timer);
    this.blink_timer = null;
  }
};

LED.prototype.blink = function(interval) {
  this.endBlink();
  if (!interval) {
    interval = 100;
  }
  var val = false;
  var self = this;
  this.blink_timer = setInterval(function(){
    self.io_anode.output(val);
    val = !val;
  }, interval);
};

if (PartsRegistrate) {
  PartsRegistrate("LED", LED);
}
