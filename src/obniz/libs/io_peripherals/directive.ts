/**
 * @packageDocumentation
 * @module ObnizCore.Components
 */

import semver from "semver";
import Obniz from "../../index";
import { ComponentAbstract } from "../ComponentAbstact";
import { AnimationStatus } from "./common";

export interface DirectiveAnimationFrame {
  /**
   * frame duration time in milliseconds
   */
  duration: number;

  /**
   * function of frame io config
   * @param state.index frame index
   */
  state: (index: number) => void;
}

/**
 * @category Peripherals
 */
export default class Directive extends ComponentAbstract {
  private observers: any[] = [];
  private _animationIdentifier: number = 0;

  constructor(obniz: Obniz, id: number) {
    super(obniz);

    this.on("/response/ioAnimation/notify", (obj) => {
      if (obj.animation.status === "finish") {
        for (let i = this.observers.length - 1; i >= 0; i--) {
          if (obj.animation.name === this.observers[i].name) {
            this.observers[i].resolve();
            this.observers.splice(i, 1);
          }
        }
      }
    });

    this._reset();
  }

  /**
   * io animation is used when you wish to accelerate the serial sequence change of io.
   *
   * "Loop" animation can be used.
   * io changes repeatedly in a sequential manner according to json array.
   * io and pwm json commands can only be used.
   *
   *
   * obnizOS ver >= 2.0.0 required.
   *
   * ```javascript
   * //javascript
   * // Javascript Example
   * obniz.io.animation("animation-1", "loop", [
   *  {
   *   duration: 10,
   *   state: function(index){ // index = 0
   *     obniz.io0.output(false)
   *     obniz.io1.output(true)
   *   }
   *  },{
   *    duration: 10,
   *    state: function(index){ // index = 1
   *      obniz.io0.output(true)
   *      obniz.io1.output(false)
   *    }
   *  }
   * ])
   * ```
   *
   * It will generate signals likes below
   *
   *  ![](media://ioanimation.png)
   *
   * - Remove animation
   *
   * ```javascript
   * obniz.io.animation("animation-1", "loop")
   * ```
   *
   * - Pause animation
   *
   * ```javascript
   * obniz.io.animation("animation-1", "pause")
   * ```
   *
   * - Resume paused animation
   *
   * ```javascript
   * obniz.io.animation("animation-1", "resume")
   * ```
   *
   * @param name name of animation
   * @param status status of animation
   * @param animations instructions. This is optional when status is pause``resume.
   * @param repeat The number of repeat count of animation. If not specified, it repeat endless.
   */
  public animation(name: string, status: AnimationStatus, animations?: DirectiveAnimationFrame[], repeat?: number) {
    if ((typeof repeat === "number" || status === "registrate") && semver.lt(this.Obniz.firmware_ver!, "2.0.0")) {
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
    if (!animations) {
      animations = [];
    }

    const states: any[] = [];
    for (let i = 0; i < animations.length; i++) {
      const state: any = animations[i];
      const duration: number = state.duration;
      const operation: (index: number) => {} = state.state;

      // dry run. and get json commands
      (this.Obniz as any).sendPool = [];
      operation(i);
      const pooledJsonArray: any = (this.Obniz as any).sendPool;
      (this.Obniz as any).sendPool = null;
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

  /**
   * It start io aniomation with limited repeat count. And It wait until done.
   *
   * ```javascript
   * // Javascript Example
   * await obniz.io.repeatWait([
   *   {
   *     duration: 1000,
   *     state: function(index){
   *       obniz.io0.output(true)
   *     }
   *   },{
   *     duration: 1000,
   *     state: function(index){
   *       obniz.io0.output(false)
   *    }
   *   }
   * ], 4)
   * ```
   *
   * @param animations instructions
   * @param repeat  The number of repeat count of animation.
   */
  public repeatWait(animations: DirectiveAnimationFrame[], repeat: number) {
    if (semver.lt(this.Obniz.firmware_ver!, "2.0.0")) {
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

      this.animation(name, "loop", animations, repeat);
      this.addObserver(name, resolve, reject);
    });
  }

  public schemaBasePath(): string {
    return "io";
  }

  /**
   * @ignore
   * @private
   */
  protected _reset() {
    if (this.observers) {
      for (let i = 0; i < this.observers.length; i++) {
        this.observers[i].reject(new Error("reset called"));
      }
    }
    this.observers = [];
    this._animationIdentifier = 0;
  }

  private addObserver(name: string, resolve: any, reject: any) {
    if (name && resolve && reject) {
      this.observers.push({
        name,
        resolve,
        reject,
      });
    }
  }
}
