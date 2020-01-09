class PeripheralAD {
  public Obniz: any;
  public id: any;
  public value: any;
  public observers: any;
  public onchange: any;

  constructor(Obniz: any, id: any) {
    this.Obniz = Obniz;
    this.id = id;
    this._reset();
  }

  public _reset() {
    this.value = 0.0;
    this.observers = [];
  }

  public addObserver(callback: any) {
    if (callback) {
      this.observers.push(callback);
    }
  }

  public start(callback: any) {
    this.onchange = callback;
    const obj: any = {};
    obj["ad" + this.id] = {
      stream: true,
    };
    this.Obniz.send(obj);
    return this.value;
  }

  public getWait() {
    const self: any = this;
    return new Promise((resolve: any, reject: any) => {
      self.addObserver(resolve);
      const obj: any = {};
      obj["ad" + self.id] = {
        stream: false,
      };
      self.Obniz.send(obj);
    });
  }

  public end() {
    this.onchange = null;
    const obj: any = {};
    obj["ad" + this.id] = null;
    this.Obniz.send(obj);
    return;
  }

  public notified(obj: any) {
    this.value = obj;
    if (this.onchange) {
      this.onchange(obj);
    }
    const callback: any = this.observers.shift();
    if (callback) {
      callback(obj);
    }
  }
}

export default PeripheralAD;
