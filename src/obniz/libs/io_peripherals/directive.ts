import semver = require("semver");
import Obniz from "../../../obniz";

export type DirectiveStatuse = "loop" | "registrate" | "pause" | "resume";

class Directive {
  public Obniz: Obniz;
  public observers: any[];
  public _animationIdentifier: number;

  constructor(obniz: Obniz, id: number) {
    this.Obniz = obniz;
    this.observers = [];
    this._animationIdentifier = 0;
    this._reset();
  }

  public _reset() {
    for (let i = 0; i < this.observers.length; i++) {
      this.observers[i].reject(new Error("reset called"));
    }
    this.observers = [];
    this._animationIdentifier = 0;
  }

  public addObserver(name: string, resolve: any, reject: any) {
    if (name && resolve && reject) {
      this.observers.push({
        name,
        resolve,
        reject,
      });
    }
  }

  public animation(name: string, status: DirectiveStatuse, array?: any[], repeat?: number) {
    if (
      (typeof repeat === "number" || status === "registrate") &&
      semver.lt(this.Obniz.firmware_ver, "2.0.0")
    ) {
      throw new Error(`Please update obniz firmware >= 2.0.0`);
    }
    const obj: any = {};
    obj.io = {
      animation: {
        name,
        status,
      },
    };
    if (typeof repeat === "number") {
      obj.io.animation.repeat = repeat;
    }
    if (!array) {
      array = [];
    }

    const states: any[] = [];
    for (let i = 0; i < array.length; i++) {
      const state: any = array[i];
      const duration: number = state.duration;
      const operation: (index: number) => {} = state.state;

      // dry run. and get json commands
      this.Obniz.sendPool = [];
      operation(i);
      const pooledJsonArray: any = this.Obniz.sendPool;
      this.Obniz.sendPool = null;
      states.push({
        duration,
        state: pooledJsonArray,
      });
    }
    if (status === "loop" || status === "registrate") {
      obj.io.animation.states = states;
    }
    this.Obniz.send(obj);
  }

  public repeatWait(array: any[], repeat: number) {
    if (semver.lt(this.Obniz.firmware_ver, "2.0.0")) {
      throw new Error(`Please update obniz firmware >= 2.0.0`);
    }
    if (typeof repeat !== "number" || repeat < 1) {
      throw new Error("please specify repeat count > 0");
    }
    if (Math.floor(repeat) !== repeat) {
      throw new Error("please provide integer number like 1, 2, 3,,,");
    }

    return new Promise((resolve: any, reject: any) => {
      const name = "_repeatwait" + Date.now() + this._animationIdentifier;
      if (++this._animationIdentifier > 1000) {
        this._animationIdentifier = 0;
      }

      this.animation(name, "loop", array, repeat);
      this.addObserver(name, resolve, reject);
    });
  }

  public notified(obj: {[key: string]: any}) {
    if (obj.animation.status === "finish") {
      for (let i = this.observers.length - 1; i >= 0; i--) {
        if (obj.animation.name === this.observers[i].name) {
          this.observers[i].resolve();
          this.observers.splice(i, 1);
        }
      }
    }
  }
}

export default Directive;
