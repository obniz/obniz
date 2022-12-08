/**
 * @packageDocumentation
 * @module ObnizCore.Components
 */
import Obniz from '../../index';
import { ComponentAbstract } from '../ComponentAbstact';
import { AnimationStatus } from './common';
export declare type DirectiveAnimationFrameFunction = (index: number) => void;
export interface DirectiveAnimationFrame {
    /**
     * frame duration time in milliseconds
     */
    duration: number;
    /**
     * function of frame io config
     *
     * @param state.index frame index
     */
    state: DirectiveAnimationFrameFunction;
}
/**
 * @category Peripherals
 */
export declare class Directive extends ComponentAbstract {
    private observers;
    private _animationIdentifier;
    constructor(obniz: Obniz, id: number);
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
    animation(name: string, status: AnimationStatus, animations?: DirectiveAnimationFrame[], repeat?: number): void;
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
    repeatWait(animations: DirectiveAnimationFrame[], repeat: number): Promise<unknown>;
    schemaBasePath(): string;
    /**
     * @ignore
     * @private
     */
    protected _reset(): void;
    private addObserver;
}
