var HCSR04 = function() {

};

HCSR04.prototype.wired = function(obniz, vcc, triger, echo, gnd) {
  this.obniz = obniz;

  this.gndIO = obniz.getIO(gnd);
  this.vccIO = obniz.getIO(vcc);
  this.triger = triger;
  this.echo = echo;

  this.gndIO.output(false);

  this.unit = "mm";
}

HCSR04.prototype.measure = async function(callback) {

  this.vccIO.output(true);
  await this.obniz.wait(10);
  var self = this;
  this.obniz.measure.echo(this.triger, "positive", 0.02, this.echo, 2, 10/340*1000, function(edges){
    self.vccIO.output(false);
    self.obniz.getIO(self.triger).output(false);
    self.obniz.getIO(self.echo).output(false);
    var distance = null;
    if (edges.length == 2) {
      distance = (edges[1].timing-edges[0].timing) * 1000;
      if (self.unit === "mm") {
        distance = distance / 5.8;
      } else if (self.unit === "inch") {
        distance = distance / 148.0;
      }
    }
    if (typeof(callback) === "function") {
      callback(distance);
    }
  })
}

HCSR04.prototype.unit = function(unit) {
  if (unit === "mm") {
    this.unit = "mm";
  } else if (unit === "inch") {
    this.unit = "inch"
  } else {
    throw new Error("HCSR04: unknown unit "+unit);
  }
}

// Module functions

if (PartsRegistrate) {
  PartsRegistrate("HC-SR04", HCSR04);
}