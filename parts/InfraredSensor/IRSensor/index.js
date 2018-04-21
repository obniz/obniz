class IRSensor {

  constructor() {
    this.keys = ["output","vcc", "gnd"];
    this.requiredKeys = ["output"];

    this.dataSymbolLength = 0.07;
    this.duration = 200; // 200msec
    this.dataInverted = true;
    this.triggerSampleCount = 16; // If Signal arrives more than this count. then treat as signal
    this.cutTail = true;
    this.output_pullup = true;
  }
  
  wired (obniz) {
    this.obniz = obniz;
    obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
    if (!obniz.isValidIO(this.params.output)) {
      throw new Errro('output is not valid io');
    }
  }

  start(callback) {
    this.ondetect = callback;
    if(this.output_pullup) {
      obniz.getIO(this.params.output).pull('5v');
    }

    obniz.logicAnalyzer.start({io:this.params.output, interval:this.dataSymbolLength, duration:this.duration, triggerValue:this.dataInverted ? false : true, triggerValueSamples:this.triggerSampleCount})
    obniz.logicAnalyzer.onmeasured = (levels) => {
      if (typeof this.ondetect === "function") {
        if (this.dataInverted) {
          let arr = new Uint8Array(levels);
          for (let i=0; i<arr.length; i++) {
            arr[i] = arr[i] ? 0 : 1;
          }
          levels = Array.from(arr);
        }

        if (this.cutTail) {
          for (let i=levels.length-1; i>1; i--) {
            if(levels[i] === 0 && levels[i-1] === 0) {
              levels.splice(i, 1);
            } else {
              break;
            }
          }
        }

        this.ondetect(levels);
      }
    }
  }
}

let Obniz = require("../../../obniz/index.js");
Obniz.PartsRegistrate("IRSensor", IRSensor);