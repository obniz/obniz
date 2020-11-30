"use strict";
/**
 * @packageDocumentation
 * @module ObnizCore.Hardware
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ObnizDevice_1 = __importDefault(require("../../ObnizDevice"));
class M5StackBasic extends ObnizDevice_1.default {
    constructor(id, options) {
        super(id, options);
    }
    async _beforeOnConnect() {
        super._beforeOnConnect();
        this.buttonA = this.wired("Button", { signal: 39 });
        this.buttonB = this.wired("Button", { signal: 38 });
        this.buttonC = this.wired("Button", { signal: 37 });
    }
    _prepareComponents() {
        // @ts-ignore
        super._prepareComponents();
        if (this.hw !== "m5stack_basic") {
            throw new Error("Obniz.M5StackBasic only support ObnizOS for M5Stack Basic. Your device is not ObnizOS for M5Stack Basic.");
        }
    }
}
exports.M5StackBasic = M5StackBasic;
