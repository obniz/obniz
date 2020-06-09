/**
 * @packageDocumentation
 * @module ObnizCore.Components
 */

import { ComponentAbstract } from "../ComponentAbstact";

/**
 * switch state
 */
type ObnizSwitchState = "none" | "push" | "left" | "right";
type ObnizSwitchCallback = (result: ObnizSwitchState) => void;

/**
 * The embedded switch on obniz Board.
 * @category Embeds
 */
export default class ObnizSwitch extends ComponentAbstract {
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

  constructor(obniz: any, info: any) {
    super(obniz);
    this.on("/response/switch/change", (obj) => {
      this.state = obj.state;
      this.Obniz._runUserCreatedFunction(this.onchange, this.state);
    });

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
  public async getWait(): Promise<ObnizSwitchState> {
    const obj: any = {};
    obj.switch = "get";
    const data = await this.sendAndReceiveJsonWait(obj, "/response/switch/change");
    return data.state;
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
  public async stateWait(state: ObnizSwitchState): Promise<void> {
    while (1) {
      const data = await this.receiveJsonWait("/response/switch/change");
      if (state === data.state) {
        return;
      }
    }
  }

  public schemaBasePath(): string {
    return "switch";
  }

  protected _reset() {
    this.state = "none";
  }
}
