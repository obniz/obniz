/**
 * @packageDocumentation
 * @module ObnizCore.Components
 */
import { ComponentAbstract } from '../ComponentAbstact';
/**
 * switch state
 */
declare type ObnizSwitchState = 'none' | 'push' | 'left' | 'right';
declare type ObnizSwitchCallback = (result: ObnizSwitchState) => void;
/**
 * The embedded switch on obniz Board.
 *
 * @category Embeds
 */
export declare class ObnizSwitch extends ComponentAbstract {
    /**
     * current switch state
     */
    state: ObnizSwitchState;
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
    onchange?: ObnizSwitchCallback;
    constructor(obniz: any, info: any);
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
    getWait(): Promise<ObnizSwitchState>;
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
    stateWait(state: ObnizSwitchState): Promise<void>;
    schemaBasePath(): string;
    protected _reset(): void;
}
export {};
