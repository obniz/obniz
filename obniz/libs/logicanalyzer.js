

class LogicAnalyzer {

  constructor(obniz) {
    this.obniz = obniz;
  }

  start( io, interval, duration, trigerValue, trigerValueSamples) {
    var obj = {};
    obj.logic_analyzer = {
      io: [io],
      interval: interval,
      duration: duration
    };
    if (trigerValueSamples > 0) {
      obj.logic_analyzer.triger = {
        value: !!trigerValue,
        samples: trigerValueSamples
      }
    }
  
    this.obniz.send(obj);
    return;
  }

  end() {
    var obj = {};
    obj.logic_analyzer = null;
    this.obniz.send(obj);
    return;
  }

  notified(obj) {
    if (this.onmeasured) {
      this.onmeasured(obj.data);
    } else {
      if (!this.measured) {
        this.measured = [];
      }
      this.measured.push(obj.data);
    }
    return;
  };
}
