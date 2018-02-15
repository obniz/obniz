
var ObnizMeasure = function(Obniz) {
  this.Obniz = Obniz;
  this.observers = [];
};

ObnizMeasure.prototype.echo = function(params) {
  var err = ObnizUtil._requiredKeys(params,["ioPulse", "pulse", "pulseWidthUs", "ioEcho", "measureEdges", "timeoutUs"]);
  if(err){ throw new Error("LogicAnalyzer start param '" + err +"' required, but not found ");return;}
  this.params = ObnizUtil._keyFilter(params,["ioPulse", "pulse", "pulseWidthUs", "ioEcho", "measureEdges", "timeoutUs", "callback"]);

  
  var echo = {};
  echo.io_pulse = this.params.ioPulse;
  echo.pulse = this.params.pulse;
  echo.pulse_width = this.params.pulseWidthUs;
  echo.io_echo = this.params.ioEcho;
  echo.measure_edges = this.params.measureEdges;
  echo.timeout = this.params.timeoutUs;

  this.Obniz.send({
    measure: {
      echo: echo
    }
  });

  if(this.params.callback) {
    this.observers.push(this.params.callback);
  }
};

ObnizMeasure.prototype.notified = function(obj) {
  var callback = this.observers.shift();
  if (callback) {
    callback(obj.echo);
  }
};