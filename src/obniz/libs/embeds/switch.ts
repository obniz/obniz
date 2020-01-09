class ObnizSwitch {
  public Obniz: any;
  public observers: any;
  public onChangeForStateWait: any;
  public state: any;
  public onchange: any;

  constructor(Obniz: any) {
    this.Obniz = Obniz;
    this._reset();
  }

  public _reset() {
    this.observers = [];
    this.onChangeForStateWait = () => {
    };
  }

  public addObserver(callback: any) {
    if (callback) {
      this.observers.push(callback);
    }
  }

  public getWait() {
    const self: any = this;
    return new Promise((resolve, reject) => {
      const obj: any = {};
      obj.switch = "get";
      self.Obniz.send(obj);
      self.addObserver(resolve);
    });
  }

  public stateWait(isPressed: any) {
    const self: any = this;
    return new Promise((resolve, reject) => {
      self.onChangeForStateWait = (pressed) => {
        if (isPressed === pressed) {
          self.onChangeForStateWait = () => {
          };
          resolve();
        }
      };
    });
  }

  public notified(obj: any) {
    this.state = obj.state;
    if (this.onchange) {
      this.onchange(this.state);
    }
    this.onChangeForStateWait(this.state);

    const callback: any = this.observers.shift();
    if (callback) {
      callback(this.state);
    }
  }
}

module.exports = ObnizSwitch;
