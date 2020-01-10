class PeripheralIO {
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
    this.value = 0;
    this.observers = [];
  }

  public addObserver(callback: any) {
    if (callback) {
      this.observers.push(callback);
    }
  }

  public output(value: any) {
    value = !!value;
    const obj: any = {};
    obj["io" + this.id] = value;
    this.value = value;
    this.Obniz.send(obj);
  }

  public drive(drive: any) {
    if (typeof drive !== "string") {
      throw new Error("please specify drive methods in string");
    }
    let output_type: any = "";
    switch (drive) {
      case "5v":
        output_type = "push-pull5v";
        break;
      case "3v":
        output_type = "push-pull3v";
        break;
      case "open-drain":
        output_type = "open-drain";
        break;
      default:
        throw new Error("unknown drive method");
    }

    const obj: any = {};
    obj["io" + this.id] = {
      output_type,
    };
    this.Obniz.send(obj);
  }

  public pull(updown: any) {
    if (typeof updown !== "string" && updown !== null) {
      throw new Error("please specify pull methods in string");
    }
    let pull_type: any = "";
    switch (updown) {
      case "5v":
      case "pull-up5v":
        pull_type = "pull-up5v";
        break;
      case "3v":
      case "pull-up3v":
        pull_type = "pull-up3v";
        break;
      case "0v":
      case "pull-down":
        pull_type = "pull-down";
        break;
      case null:
      case "float":
        pull_type = "float";
        break;
      default:
        throw new Error("unknown pull_type method");
    }

    const obj: any = {};
    obj["io" + this.id] = {
      pull_type,
    };
    this.Obniz.send(obj);
  }

  public input(callback: any) {
    this.onchange = callback;
    const obj: any = {};
    obj["io" + this.id] = {
      direction: "input",
      stream: true,
    };
    this.Obniz.send(obj);
    return this.value;
  }

  public inputWait() {
    const self: any = this;
    return new Promise((resolve: any, reject: any) => {
      self.addObserver(resolve);
      const obj: any = {};
      obj["io" + self.id] = {
        direction: "input",
        stream: false,
      };
      self.Obniz.send(obj);
    });
  }

  public end() {
    const obj: any = {};
    obj["io" + this.id] = null;
    this.Obniz.send(obj);
  }

  public notified(obj: any) {
    if (typeof obj === "boolean") {
      this.value = obj;
      const callback: any = this.observers.shift();
      if (callback) {
        callback(obj);
      }
      if (typeof this.onchange === "function") {
        this.onchange(obj);
      }
    } else if (obj && typeof obj === "object") {
      if (obj.warning) {
        this.Obniz.warning({
          alert: "warning",
          message: `io${this.id}: ${obj.warning.message}`,
        });
      }
      if (obj.error) {
        this.Obniz.error({
          alert: "error",
          message: `io${this.id}: ${obj.error.message}`,
        });
      }
    }
  }
}

export default PeripheralIO;
