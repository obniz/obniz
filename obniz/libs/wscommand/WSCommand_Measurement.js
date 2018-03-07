class WSCommand_Measurement extends WSCommand {

  constructor(delegate) {
    super(delegate);
    this.module = 12;

    this._CommandMeasurementEcho  = 0
  }

  // Commands

  measureEcho(type, trigerIO, trigerPosNeg, trigerWidthUs, echoIO, responseCount, timeoutUs) {
    timeoutUs = parseInt(timeoutUs);
    var buf = new Uint8Array(13);
    buf[0]  = 0;
    buf[1]  = trigerIO;
    buf[2]  = trigerPosNeg ? 1 : 0;
    buf[3]  = trigerWidthUs >> 8*3;
    buf[4]  = trigerWidthUs >> 8*2;
    buf[5]  = trigerWidthUs >> 8;
    buf[6]  = trigerWidthUs;
    buf[7]  = echoIO;
    buf[8]  = responseCount;
    buf[9]  = timeoutUs >> 8*3;
    buf[10] = timeoutUs >> 8*2;
    buf[11] = timeoutUs >> 8;
    buf[12] = timeoutUs;
    this.sendCommand(this._CommandMeasurementEcho, buf);
  }

  parseFromJson(json) {
    var module = json["measure"];
    if (!module || typeof(module) !== "object") {
      return;
    }
    if (module && typeof(module.echo) === "object") {
      var obj = module.echo;
      var io_pulse = parseInt(obj.io_pulse)
      if (this.isValidIO(io_pulse) == false) {
        throw new Error("invalid io_pulse "+io_pulse)
        return;
      }
      var io_echo = parseInt(obj.io_echo);
      if (this.isValidIO(io_echo) == false) {
        throw new Error("invalid io_echo "+io_echo)
        return;
      }
      var pulse_width = parseInt(obj.pulse_width * 1000);
      if (typeof(pulse_width) !== "number" || pulse_width < 1 || pulse_width > 1000000)  {
        throw new Error("invalid pulse_width must be 1usec~1sec")
        return;
      }
      var measure_edges = parseInt(obj.measure_edges);
      if (typeof(measure_edges) !== "number" || measure_edges <= 0 || measure_edges > 4)  {
        throw new Error("invalid measure_edges must be 1~4")
        return;
      }
      var timeout = parseInt(obj.timeout * 1000);
      if (!timeout) {
        timeout = parseInt(1000000);
      }else if (typeof(timeout) !== "number" || timeout < 1 || timeout > 1000000)  {
        throw new Error("invalid measure_edges must be 1usec~1sec");
        return;
      }
      this.measureEcho( 0, io_pulse, obj.pulse === "negative" ? false : true, pulse_width , io_echo, measure_edges, timeout );
    }
  }
  
  notifyFromBinary(objToSend, func, payload) {
    if (func === this._CommandMeasurementEcho) {
      var index = 0;
      var count = parseInt(payload[index++]);
      var array = [];
      for (var i=0; i<count; i++) {
        var timing;
        var edge = (payload[index++] > 0) ? true : false;
        timing  = payload[index++] << (8*3);
        timing += payload[index++] << (8*2);
        timing += payload[index++] << 8;
        timing += payload[index++];
        timing = timing / 1000;
        array.push({
          edge,
          timing
        })
      }
      objToSend["measure"] = {
        echo: array
      };
    } else {
      super.notifyFromBinary(objToSend, func, payload)
    }
  }
}