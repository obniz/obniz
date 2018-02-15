var _7SegmentLED = function() {
  this.requiredKeys = ["address"];
  this.keys = ["sda","scl","clock","pullType","i2c","address"];
  
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

_7SegmentLED.prototype.wired = function(obniz, a, b, c, d, e, f, g, dp, common, commonType) {
  this.obniz = obniz;
  this.ios = [];
  this.ios.push(obniz.getIO(a));
  this.ios.push(obniz.getIO(b));
  this.ios.push(obniz.getIO(c));
  this.ios.push(obniz.getIO(d));
  this.ios.push(obniz.getIO(e));
  this.ios.push(obniz.getIO(f));
  this.ios.push(obniz.getIO(g));

  this.dp = obniz.getIO(dp);
  this.common = obniz.getIO(common);
  this.isCathodeCommon = (commonType === "anode") ? false : true;
};

_7SegmentLED.prototype.print = function(data) {
  if (typeof data == "number") {
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

_7SegmentLED.prototype.print_raw = function(data) {
  if (typeof data == "number") {
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

_7SegmentLED.prototype.dp_show = function(show) {
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
