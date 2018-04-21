class _7SegmentLED {
  constructor() {
    this.requiredKeys = [ "a", "b", "c", "d", "e", "f", "g", "common"];
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
  
    this.displayIoNames = {
      a: "a",
      b: "b",
      c: "c",
      d: "d",
      e: "e",
      f: "f",
      g: "g",
      dp: "dp",
      common: "com",
    };
  }

  wired(obniz) {
    this.obniz = obniz;
    this.ios = [];
    this.ios.push(obniz.getIO(this.params.a));
    this.ios.push(obniz.getIO(this.params.b));
    this.ios.push(obniz.getIO(this.params.c));
    this.ios.push(obniz.getIO(this.params.d));
    this.ios.push(obniz.getIO(this.params.e));
    this.ios.push(obniz.getIO(this.params.f));
    this.ios.push(obniz.getIO(this.params.g));

    for (let i=0;i<this.ios.length; i++) {
      this.ios[i].output(false);
    }

    if (typeof this.params.dp === "number") {
      this.dp = obniz.getIO(this.params.dp);
      this.dp.output(false);
    }

    this.common = obniz.getIO(this.params.common);
    this.common.output(false);
    this.isCathodeCommon = (this.params.commonType === "anode") ? false : true;
  }

  print(data) {
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
  }

  printRaw(data) {
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
  }

  dpState(show) {
    if (this.dp) {
      this.dp.output( this.isCathodeCommon ? show : !show);
    }
  }

  on() {
    this.common.output( this.isCathodeCommon ? false : true);
  }

  off() {
    this.common.output( this.isCathodeCommon ? true : false);
  }
}


let Obniz = require("../../../obniz/index.js");
Obniz.PartsRegistrate("7SegmentLED", _7SegmentLED);

