
ObnizMeasure = function(Obniz) {
  this.Obniz = Obniz;
  this.observers = [];
};

ObnizMeasure.prototype.echo = function(io_pulse, pulse, pulse_widthUs, io_echo, measure_edges, timeoutUs, callback) {
  var echo = {};
  echo.io_pulse = io_pulse;
  echo.pulse = pulse;
  echo.pulse_width = pulse_widthUs;
  echo.io_echo = io_echo;
  echo.measure_edges = measure_edges;
  echo.timeout = timeoutUs;

  this.Obniz.send({
    measure: {
      echo: echo
    }
  });

  if(callback) {
    this.observers.push(callback);
  }
};

ObnizMeasure.prototype.notified = function(obj) {
  var callback = this.observers.shift();
  if (callback) {
    callback(obj.echo);
  }
};