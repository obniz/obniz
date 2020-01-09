class Grove_EarHeartRate {

  public static info() {
    return {
      name: "Grove_EarHeartRate",
    };
  }

  public keys: any;
  public requiredKeys: any;
  public displayIoNames: any;
  public interval: any;
  public duration: any;
  public obniz: any;
  public params: any;

  constructor() {
    this.keys = ["vcc", "gnd", "signal"];
    this.requiredKeys = ["vcc", "gnd"];

    this.displayIoNames = {
      vcc: "vcc",
      gnd: "gnd",
      signal: "signal",
    };

    this.interval = 5;
    this.duration = 2.5 * 1000;
  }

  public wired(obniz: any) {
    this.obniz = obniz;
    obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
  }

  public start(callback: any) {
    this.obniz.logicAnalyzer.start({
      io: this.params.signal,
      interval: this.interval,
      duration: this.duration,
    });

    this.obniz.logicAnalyzer.onmeasured = (array: any) => {
      const edges: any = [];
      for (let i = 0; i < array.length - 1; i++) {
        if (array[i] === 0 && array[i + 1] === 1) {
          edges.push(i);
        }
      }
      if (edges.length >= 2) {
        let between: any = 0;
        let pulseMin: any = 0;
        between = ((edges[1] - edges[0]) * this.interval) / 1000.0;
        pulseMin = 60 / between;
        callback(pulseMin);
      }
    };
  }

  public getWait() {
    return new Promise((resolve: any) => {
      this.start((rate: any) => {
        resolve(rate);
      });
    });
  }
}

export default Grove_EarHeartRate;
