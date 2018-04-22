
class PeripheralAD {
  constructor(Obniz, id) {
    this.Obniz = Obniz;
    this.id = id;
    this.value = 0.0;
    this.observers = [];
  }

  addObserver(callback) {
    if(callback) {
      this.observers.push(callback);
    }
  }

  start(callback) {
    this.onchange = callback;
    var obj = {};
    obj["ad"+this.id] = {
      stream: true
    };
    this.Obniz.send(obj);
    return this.value;
  }

  getWait() {
    var self = this;
    return new Promise(function(resolve, reject){
      self.addObserver(resolve);
      var obj = {};
      obj["ad"+self.id] = {
        stream: false
      };
      self.Obniz.send(obj);
    });
  }

  end() {
    this.onchange = null;
    var obj = {};
    obj["ad"+this.id] = null;
    this.Obniz.send(obj);
    return;
  }

  notified(obj) {
    this.value = obj;
    if (this.onchange) {
      this.onchange(obj);
    }
    var callback = this.observers.shift();
    if (callback) {
      callback(obj);
    }
  }
}

module.exports = PeripheralAD;