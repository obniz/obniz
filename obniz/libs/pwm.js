
PeripheralPWM = function(Obniz, id) {
  this.Obniz = Obniz;
  this.id = id;
  this.state = {};
};

PeripheralPWM.prototype.sendWS = function(obj) {
  var wsObj = {};
  wsObj["pwm"+this.id] = obj;
  this.Obniz.send(wsObj);
};

PeripheralPWM.prototype.start = function(io) {
  var obj = {};
  this.state.io = io;
  this.sendWS({
    io: io
  });
};

PeripheralPWM.prototype.freq = function(freq) {
  var obj = {};
  this.state.freq = freq;
  this.sendWS({
    freq: freq
  });
};

PeripheralPWM.prototype.pulse = function(pulse_width) {
  var obj = {};
  this.state.pulse = pulse_width;
  this.sendWS({
    pulse: pulse_width
  });
};

PeripheralPWM.prototype.duty = function(duty) {
  var obj = {};
  this.state.duty = duty;
  this.sendWS({
    duty: duty
  });
};

PeripheralPWM.prototype.forceWorking = function(working) {
  var obj = {};
  this.state.forceWorking = working;
  this.sendWS({
    force_working: working
  });
};

PeripheralPWM.prototype.end = function() {
  var obj = {};
  this.state = {};
  this.sendWS(null);
};

PeripheralPWM.prototype.modulate = function(type, symbol_sec, data) {
  var obj = {};
  this.sendWS({
    modulate: {
      type: type,
      symbol_sec: symbol_sec,
      data: data
    }
  });
};
