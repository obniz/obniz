"use strict";
/**
 * @packageDocumentation
 * @module ObnizCore.Hardware
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.M5StackBasic = void 0;
const ObnizDevice_1 = require("../../ObnizDevice");
class M5StackBasic extends ObnizDevice_1.ObnizDevice {
    constructor(id, options) {
        super(id, options);
    }
    _beforeOnConnect() {
        super._beforeOnConnect();
        this.buttonA = this.wired('Button', { signal: 39 });
        this.buttonB = this.wired('Button', { signal: 38 });
        this.buttonC = this.wired('Button', { signal: 37 });
    }
    _prepareComponents() {
        super._prepareComponents();
        if (this.hw !== 'm5stack_basic') {
            throw new Error('Obniz.M5StackBasic only support ObnizOS for M5Stack Basic. Your device is not ObnizOS for M5Stack Basic.');
        }
    }
}
exports.M5StackBasic = M5StackBasic;
