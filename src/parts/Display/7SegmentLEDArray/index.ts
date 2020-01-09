class _7SegmentLEDArray {

  public static info() {
    return {
      name: "7SegmentLEDArray",
    };
  }

  public identifier: any;
  public keys: any;
  public requiredKeys: any;
  public obniz: any;
  public segments: any;
  public params: any;

  constructor() {
    this.identifier = "" + new Date().getTime();

    this.keys = ["segments"];
    this.requiredKeys = this.keys;
  }

  public wired(obniz: any) {
    this.obniz = obniz;

    this.segments = this.params.segments;
  }

  public print(data: any) {
    if (typeof data === "number") {
      data = Math.floor(data);

      const print: any = (index: any) => {
        let val: any = data;

        for (let i = 0; i < this.segments.length; i++) {
          if (index === i) {
            this.segments[i].print(val % 10);
          } else {
            this.segments[i].off();
          }
          val = val / 10;
        }
      };

      const animations: any = [];
      for (let i = 0; i < this.segments.length; i++) {
        animations.push({
          duration: 3,
          state: print,
        });
      }

      this.obniz.io.animation(this.identifier, "loop", animations);
    }
  }

  public on() {
    this.obniz.io.animation(this.identifier, "resume");
  }

  public off() {
    this.obniz.io.animation(this.identifier, "pause");
    for (let i = 0; i < this.segments.length; i++) {
      this.segments[i].off();
    }
  }
}

if (typeof module === "object") {
  module.exports = _7SegmentLEDArray;
}
