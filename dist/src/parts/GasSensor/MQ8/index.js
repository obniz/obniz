"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @packageDocumentation
 * @module Parts.MQ8
 */
const MQGas_1 = __importDefault(require("../MQGas"));
class MQ8 extends MQGas_1.default {
    static info() {
        return {
            name: 'MQ8',
        };
    }
    constructor() {
        super();
    }
}
exports.default = MQ8;
