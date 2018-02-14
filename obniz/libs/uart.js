
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
  this.received = [];
};

// node only
PeripheralUART.prototype.send = function(data) {
  var send_data = null;
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
    if (isNode) {
      const buf = Buffer(data);
      var arr = new Array(buf.byteLength);
      for (var i=0; i<arr.length;i++) {
        arr[i] = buf[i];
      }
      send_data = arr;
    } else if(TextEncoder){
      const typedArray = new TextEncoder("utf-8").encode(data);
      send_data = new Array(typedArray.length);
      for (var i=0; i<typedArray.length;i++) {
        send_data[i] = typedArray[i];
      }
    }
  }
  var obj = {};
  obj["uart"+this.id] = {};
  obj["uart"+this.id].data = send_data;
  console.log(obj);
  this.Obniz.send(obj);
};


PeripheralUART.prototype.isdataexists = function() {
  return (this.received && this.received.length > 0);
};

PeripheralUART.prototype.readbytes = function() {
  var results = [];
  if (this.isdataexists()) {
      for (var i=0;i<this.received.length; i++) {
        results.push(this.received[i]);
      }
  }
  this.received = [];
  return results;
};



PeripheralUART.prototype.readtext = function() {
  var string = null;
  if (this.isdataexists()) {
      var data = this.readbytes();
      string = this.tryConvertString(data);
  }
  this.received = [];
  return string;
};


PeripheralUART.prototype.tryConvertString = function(data) {
  var string = null;
  try {
      if(isNode){
        const StringDecoder = require('string_decoder').StringDecoder;
        if(StringDecoder){
           string = new StringDecoder('utf8').write(Buffer.from(data));
        }
      }else if(TextDecoder){
        string = new TextDecoder("utf-8").decode(new Uint8Array(data));
      }
    }catch(e) {
      //this.obniz.error(e);
    }
    return string;
};

PeripheralUART.prototype.notified = function(obj) {
  if (this.onreceive) {
    var string = this.tryConvertString(obj.data);
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