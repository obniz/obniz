var _7SegmentLED = function() {
  this.requiredKeys = [ "a", "b", "c", "d", "e", "f", "g", "dp", "common", "commonType"];
  this.keys = ["a", "b", "c", "d", "e", "f", "g", "dp", "common", "commonType"];
  
  this.digits = [
    0x3F,
    0x06,
    0x5b,
    0x4f,
    0x66,
    0x6d,
    0x7d,
    0x07,
    0x7f,
    0x6f,
    0x6f
  ];

};

_7SegmentLED.prototype.wired = function(obniz) {
  this.obniz = obniz;
  this.ios = [];
  this.ios.push(obniz.getIO(this.params.a));
  this.ios.push(obniz.getIO(this.params.b));
  this.ios.push(obniz.getIO(this.params.c));
  this.ios.push(obniz.getIO(this.params.d));
  this.ios.push(obniz.getIO(this.params.e));
  this.ios.push(obniz.getIO(this.params.f));
  this.ios.push(obniz.getIO(this.params.g));

  this.dp = obniz.getIO(this.params.dp);
  this.common = obniz.getIO(this.params.common);
  this.isCathodeCommon = (this.params.commonType === "anode") ? false : true;
};

_7SegmentLED.prototype.print = function(data) {
  if (typeof data === "number") {
    data = parseInt(data);
    data = data % 10;

    for (let i=0; i<7; i++) {
      if (this.ios[i]) {
        var val = (this.digits[data] & (1 << i)) ? true : false;
        if (!this.isCathodeCommon) {
          val = ~val;
        }
        this.ios[i].output( val );
      }
    }
    this.on();
  }
};

_7SegmentLED.prototype.printRaw = function(data) {
  if (typeof data === "number") {
    for (let i=0; i<7; i++) {
      if (this.ios[i]) {
        var val = (data & (1 << i)) ? true : false;
        if (!this.isCathodeCommon) {
          val = !val;
        }
        this.ios[i].output( val );
      }
    }
    this.on();
  }
};

_7SegmentLED.prototype.dpShow = function(show) {
  if (this.dp) {
    this.dp.output( this.isCathodeCommon ? show : !show);
  }
};

_7SegmentLED.prototype.on = function() {
  this.common.output( this.isCathodeCommon ? false : true);
};

_7SegmentLED.prototype.off = function() {
  this.common.output( this.isCathodeCommon ? true : false);
};

if (PartsRegistrate) {
  PartsRegistrate("7SegmentLED", _7SegmentLED);
}
