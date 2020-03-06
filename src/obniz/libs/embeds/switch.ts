/**
 * @packageDocumentation
 * @module ObnizCore.Components
 */

/**
 * switch state
 */
type ObnizSwitchState = "none" | "push" | "left" | "right";
type ObnizSwitchCallback = (result: ObnizSwitchState) => void;

/**
 * The embedded switch on obniz Board.
 * @category Embeds
 */
export default class ObnizSwitch {
  /**
   * current switch state
   */
  public state!: ObnizSwitchState;

  /**
   * When the switch state changes, this callback function will be called.
   * If you press and release a switch, it callbacks twice ("push" and "none").
   *
   * ```javascript
   * // Javascript Example
   * obniz.display.clear();
   * obniz.switch.onchange = function(state) {
   *   if (state === "push") {
   *     obniz.display.print("Pushing");
   *   } else {
   *     obniz.display.clear();
   *   }
   * }
   * ```
   */
  public onchange?: ObnizSwitchCallback;
  private Obniz: any;
  private observers!: ObnizSwitchCallback[];
  private onChangeForStateWait!: ObnizSwitchCallback | (() => void);

  constructor(Obniz: any, info: any) {
    this.Obniz = Obniz;
    this._reset();
  }

  /**
   * This determines the current status of the switch.
   *
   * ```javascript
   * // Javascript Example
   * obniz.display.clear();
   * var state = await obniz.switch.getWait();
   * if (state === "push") {
   *   obniz.display.print("Now Pressed");
   * }
   * ```
   *
   */
  public getWait(): Promise<ObnizSwitchState> {
    const self: any = this;
    return new Promise((resolve: any, reject: any) => {
      const obj: any = {};
      obj.switch = "get";
      self.Obniz.send(obj);
      self.addObserver(resolve);
    });
  }

  /**
   * With this you wait until the switch status changes to state.
   *
   * ```javascript
   * // Javascript Example
   * await obniz.switch.stateWait("push");
   * console.log("switch pushed");
   *
   * await obniz.switch.stateWait("left");
   * console.log("switch left");
   *
   * await obniz.switch.stateWait("right");
   * console.log("switch right");
   *
   * await obniz.switch.stateWait("none");
   * console.log("switch none");
   * ```
   *
   * @param state state for wait
   */
  public stateWait(state: ObnizSwitchState): Promise<void> {
    const self: any = this;
    return new Promise((resolve: any, reject: any) => {
      self.onChangeForStateWait = (pressed: ObnizSwitchState) => {
        if (state === pressed) {
          self.onChangeForStateWait = () => {};
          resolve();
        }
      };
    });
  }

  /**
   * @ignore
   * @param obj
   */
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

  private _reset() {
    this.state = "none";
    this.observers = [];
    this.onChangeForStateWait = () => {};
  }

  private addObserver(callback: ObnizSwitchCallback) {
    if (callback) {
      this.observers.push(callback);
    }
  }
}
