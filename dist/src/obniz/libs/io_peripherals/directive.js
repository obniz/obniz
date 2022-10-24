"use strict";
/**
 * @packageDocumentation
 * @module ObnizCore.Components
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Directive = void 0;
const semver_1 = __importDefault(require("semver"));
const ComponentAbstact_1 = require("../ComponentAbstact");
/**
 * @category Peripherals
 */
class Directive extends ComponentAbstact_1.ComponentAbstract {
    constructor(obniz, id) {
        super(obniz);
        this.observers = [];
        this._animationIdentifier = 0;
        this.on('/response/ioAnimation/notify', (obj) => {
            if (obj.animation.status === 'finish') {
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
    animation(name, status, animations, repeat) {
        if ((typeof repeat === 'number' || status === 'registrate') &&
            semver_1.default.lt(this.Obniz.firmware_ver, '2.0.0')) {
            throw new Error(`Please update obniz firmware >= 2.0.0`);
        }
        const obj = {};
        obj.io = {
            animation: {
                name,
                status,
            },
        };
        if (typeof repeat === 'number') {
            obj.io.animation.repeat = repeat;
        }
        if (!animations) {
            animations = [];
        }
        const states = [];
        for (let i = 0; i < animations.length; i++) {
            const state = animations[i];
            const duration = state.duration;
            const operation = state.state;
            // dry run. and get json commands
            this.Obniz.startCommandPool();
            operation(i);
            const pooledJsonArray = this.Obniz.endCommandPool();
            states.push({
                duration,
                state: pooledJsonArray,
            });
        }
        if (status === 'loop' || status === 'registrate') {
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
    repeatWait(animations, repeat) {
        if (semver_1.default.lt(this.Obniz.firmware_ver, '2.0.0')) {
            throw new Error(`Please update obniz firmware >= 2.0.0`);
        }
        if (typeof repeat !== 'number' || repeat < 1) {
            throw new Error('please specify repeat count > 0');
        }
        if (Math.floor(repeat) !== repeat) {
            throw new Error('please provide integer number like 1, 2, 3,,,');
        }
        return new Promise((resolve, reject) => {
            const name = '_repeatwait' + Date.now() + this._animationIdentifier;
            if (++this._animationIdentifier > 1000) {
                this._animationIdentifier = 0;
            }
            this.animation(name, 'loop', animations, repeat);
            this.addObserver(name, resolve, reject);
        });
    }
    schemaBasePath() {
        return 'io';
    }
    /**
     * @ignore
     * @private
     */
    _reset() {
        if (this.observers) {
            for (let i = 0; i < this.observers.length; i++) {
                this.observers[i].reject(new Error('reset called'));
            }
        }
        this.observers = [];
        this._animationIdentifier = 0;
    }
    addObserver(name, resolve, reject) {
        if (name && resolve && reject) {
            this.observers.push({
                name,
                resolve,
                reject,
            });
        }
    }
}
exports.Directive = Directive;
