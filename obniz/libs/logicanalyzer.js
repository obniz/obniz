
var LogicAnalyzer = function(Obniz) {
  this.Obniz = Obniz;
};

LogicAnalyzer.prototype.start = function(io, interval, length, trigerValue, trigerValueSamples) {
  var obj = {};
  obj.logicanalyzer = {
    io: [io],
    interval: interval,
    length: length
  };
  if (trigerValueSamples > 0) {
    obj.logicanalyzer.triger = {
      value: trigerValue,
      samples: trigerValueSamples
    }
  }

  this.Obniz.send(obj);
  return;
};

LogicAnalyzer.prototype.end = function() {
  var obj = {};
  obj["logicanalyzer"] = null;
  this.Obniz.send(obj);
  return;
};

LogicAnalyzer.prototype.notified = function(obj) {
  if (this.onmeasured) {
    this.onmeasured(obj.measured);
  } else {
    if (this.measured == null) {
      this.measured = [];
    }
    this.measured.push(obj.measured);
  }
  return;
};