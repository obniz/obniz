class IRSensor {

  public static info() {
    return {
      name: "IRSensor",
    };
  }

  public keys: any;
  public requiredKeys: any;
  public dataSymbolLength: any;
  public duration: any;
  public dataInverted: any;
  public triggerSampleCount: any;
  public cutTail: any;
  public output_pullup: any;
  public obniz: any;
  public params: any;
  public ondetect: any;

  constructor() {
    this.keys = ["output", "vcc", "gnd"];
    this.requiredKeys = ["output"];

    this.dataSymbolLength = 0.07;
    this.duration = 500; // 500msec
    this.dataInverted = true;
    this.triggerSampleCount = 16; // If Signal arrives more than this count. then treat as signal
    this.cutTail = false;
    this.output_pullup = true;
  }

  public wired(obniz: any) {
    this.obniz = obniz;
    obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
    if (!obniz.isValidIO(this.params.output)) {
      throw new Error("output is not valid io");
    }
  }

  public start(callback: any) {
    this.ondetect = callback;
    if (this.output_pullup) {
      this.obniz.getIO(this.params.output).pull("5v");
    }

    this.obniz.logicAnalyzer.start({
      io: this.params.output,
      interval: this.dataSymbolLength,
      duration: this.duration,
      triggerValue: this.dataInverted ? false : true,
      triggerValueSamples: this.triggerSampleCount,
    });
    this.obniz.logicAnalyzer.onmeasured = (levels: any) => {
      if (typeof this.ondetect === "function") {
        if (this.dataInverted) {
          const arr: any = new Uint8Array(levels);
          for (let i = 0; i < arr.length; i++) {
            arr[i] = arr[i] ? 0 : 1;
          }
          levels = Array.from(arr);
        }

        if (this.cutTail) {
          for (let i = levels.length - 1; i > 1; i--) {
            if (levels[i] === 0 && levels[i - 1] === 0) {
              levels.splice(i, 1);
            } else {
              break;
            }
          }
        }

        this.ondetect(levels);
      }
    };
  }
}

export default IRSensor;
