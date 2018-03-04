var LED = function() {
  this.keys = ["anode","cathode"];
  this.requiredKeys = ["anode"];
  
  
  this.animationName = "Led-" + Math.round(Math.random() *1000);
};

LED.prototype.wired = function(obniz) {
  this.obniz = obniz;
  this.io_anode = obniz.getIO(this.params.anode);
  if (this.params.cathode) {
    this.io_cathode = obniz.getIO(this.params.cathode);
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
  this.obniz.io.animation(this.animationName, "pause");
  
};

LED.prototype.blink = function(interval) {
  if(!interval) {
    interval = 100;
  }
  var frames = [{
      duration: interval,
      state: function (index) { // index = 0
        this.io_anode.output(true);  // on
      }.bind(this)
    }, {
      duration: interval,
      state: function (index) { // index = 0
        this.io_anode.output(false);   //off
      }.bind(this)
    }];

  this.obniz.io.animation(this.animationName, "loop", frames);

};

if (PartsRegistrate) {
  PartsRegistrate("LED", LED);
}
