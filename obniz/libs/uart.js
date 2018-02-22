
var PeripheralUART = function(Obniz, id) {
  this.Obniz = Obniz;
  this.id = id;
  this.received = new Uint8Array([]); 
  this.used = false;
};

PeripheralUART.prototype.start = function(params) {
  
  var err = ObnizUtil._requiredKeys(params,["tx", "rx"]);
  if(err){ throw new Error("uart start param '" + err +"' required, but not found ");return;}
  this.params = ObnizUtil._keyFilter(params,["tx", "rx", "baud", "stop", "bits", "parity", "flowcontrol", "rts", "cts","drive","pull"]);


  if( this.params.hasOwnProperty("drive")){
      this.Obniz.getIO(this.params.rx).drive(this.params.drive);
      this.Obniz.getIO(this.params.tx).drive(this.params.drive);
  }else{
      this.Obniz.getIO(this.params.rx).drive("5v");
      this.Obniz.getIO(this.params.tx).drive("5v");
      
  }
  
  if(this.params.hasOwnProperty("pull") ){
      this.Obniz.getIO(this.params.rx).pull(this.params.pull);
      this.Obniz.getIO(this.params.tx).pull(this.params.pull);
  }else{
      this.Obniz.getIO(this.params.rx).pull(null);
      this.Obniz.getIO(this.params.tx).pull(null);
  }
  
  var obj = {};
  obj["uart"+this.id] = this.params;
  this.Obniz.send(obj);
  this.received = [];
  this.used = true;
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
//  console.log(obj);
  this.Obniz.send(obj);
};


PeripheralUART.prototype.isDataExists = function() {
  return (this.received && this.received.length > 0);
};

PeripheralUART.prototype.readBytes = function() {
  var results = [];
  if (this.isDataExists()) {
      for (var i=0;i<this.received.length; i++) {
        results.push(this.received[i]);
      }
  }
  this.received = [];
  return results;
};



PeripheralUART.prototype.readText = function() {
  var string = null;
  if (this.isDataExists()) {
      var data = this.readBytes();
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

PeripheralUART.prototype.isUsed = function() {
  return this.used;
};

PeripheralUART.prototype.end = function() {
  var obj = {};
  obj["uart"+this.id] = null;
  this.params = null;
  this.Obniz.send(obj);
  this.used = false;
};