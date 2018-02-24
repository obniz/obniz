
var ObnizMeasure = function(Obniz) {
  this.Obniz = Obniz;
  this.observers = [];
};

ObnizMeasure.prototype.echo = function(params) {
  var err = ObnizUtil._requiredKeys(params, ["io_pulse", "pulse", "pulse_width", "io_echo", "measure_edges", "timeout"]);
  if(err){ throw new Error("Measure start param '" + err +"' required, but not found ");return;}
  this.params = ObnizUtil._keyFilter(params,["io_pulse", "pulse", "pulse_width", "io_echo", "measure_edges", "timeout", "callback"]);

  
  var echo = {};
  echo.io_pulse = this.params.io_pulse;
  echo.pulse = this.params.pulse;
  echo.pulse_width = this.params.pulse_width;
  echo.io_echo = this.params.io_echo;
  echo.measure_edges = this.params.measure_edges;
  echo.timeout = this.params.timeout;

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