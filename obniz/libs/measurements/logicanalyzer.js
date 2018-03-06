

class LogicAnalyzer {

  constructor(obniz) {
    this.obniz = obniz;
  }

  start( params ) {
    
  var err = ObnizUtil._requiredKeys(params,["io", "interval", "duration"]);
  if(err){ throw new Error("LogicAnalyzer start param '" + err +"' required, but not found ");return;}
  this.params = ObnizUtil._keyFilter(params,["io", "interval", "duration", "trigerValue", "trigerValueSamples"]);

  
    var obj = {};
    obj.logic_analyzer = {
      io: [this.params.io],
      interval: this.params.interval,
      duration: this.params.duration
    };
    if (this.params.trigerValueSamples > 0) {
      obj.logic_analyzer.triger = {
        value: !!this.params.trigerValue,
        samples: this.params.trigerValueSamples
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
