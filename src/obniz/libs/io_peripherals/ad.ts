import Obniz from "../../index";

class PeripheralAD {
  public Obniz: Obniz;
  public id: number;
  public value!: number;
  public observers!: Array<(value: number) => void>;
  public onchange?: (value: number) => void;

  constructor(obniz: Obniz, id: number) {
    this.Obniz = obniz;
    this.id = id;
    this._reset();
  }

  public _reset() {
    this.value = 0.0;
    this.observers = [];
  }

  public addObserver(callback: (value: number) => void) {
    if (callback) {
      this.observers.push(callback);
    }
  }

  public start(callback?: (voltage: number) => void) {
    this.onchange = callback;
    const obj: any = {};
    obj["ad" + this.id] = {
      stream: true,
    };
    this.Obniz.send(obj);
    return this.value;
  }

  public getWait(): Promise<number> {
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
    this.onchange = undefined;
    const obj: any = {};
    obj["ad" + this.id] = null;
    this.Obniz.send(obj);
    return;
  }

  public notified(obj: number) {
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
