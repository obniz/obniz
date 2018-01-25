
var PeripheralUART = function(Obniz, id) {
  this.Obniz = Obniz;
  this.id = id;
  this.received = new Uint8Array([]);
};

PeripheralUART.prototype.start = function(tx, rx, baud, stop, bits, parity, flowcontrol, rts, cts) {
  var obj = {};
  obj["uart"+this.id] = {
    tx: tx,
    rx: rx
  };
  if (baud) {
    obj["uart"+this.id].baud = baud;
  }
  if (stop) {
    obj["uart"+this.id].stop = stop;
  }
  if (bits) {
    obj["uart"+this.id].bits = bits;
  }
  if (parity) {
    obj["uart"+this.id].parity = parity;
  }
  if (flowcontrol) {
    obj["uart"+this.id].flowcontrol = flowcontrol;
  }
  if (rts) {
    obj["uart"+this.id].rts = rts;
  }
  if (flowcontrol) {
    obj["uart"+this.id].cts = cts;
  }
  this.Obniz.send(obj);
  this.received = new Uint8Array([]);
};

// node only
PeripheralUART.prototype.send = function(data) {
  var send_data = null;
  var key = "data";
  if (data === undefined) {
    return;
  }
  if (typeof(data) === "number") {
    data = [data];
  }
  if (isNode && data instanceof Buffer) {
    var arr = new Array(data.byteLength);
    for (var i=0; i<arr.length;i++) {
      arr[i] = data[i];
    }
    send_data = arr;
  } else if (data.constructor === Array) {
    send_data = data;
  } else if (typeof(data) === "string") {
    key = "text";
    send_data = data;
  } else if (typeof(data) === "object" && data !== null) {
    key = "text";
    send_data = JSON.stringify(data);
  }
  var obj = {};
  obj["uart"+this.id] = {};
  obj["uart"+this.id][key] = send_data;
  this.Obniz.send(obj);
};

PeripheralUART.prototype.readtext = function() {
  var string = null;
  try {
    if (this.received && this.received.length > 0) {
      string = "";
      for (var i=0;i<this.received.length; i++) {
        string += new TextDecoder("utf-8").decode(new Uint8Array(this.received[i]));
      }
    }
  }catch(e) {
    
  }
  this.received = [];
  return string;
};

PeripheralUART.prototype.notified = function(obj) {
  if (this.onreceive) {
    var string = null;
    try {
      string = new TextDecoder("utf-8").decode(new Uint8Array(obj.data));
    }catch(e) {
      
    }
    this.onreceive(obj.data, string);
  } else {
    if (!this.received) {
      this.received = [];
    }
    this.received.push.apply(this.received, obj.data);
  }
};

PeripheralUART.prototype.end = function() {
  var obj = {};
  obj["uart"+this.id] = null;
  this.Obniz.send(obj);
};