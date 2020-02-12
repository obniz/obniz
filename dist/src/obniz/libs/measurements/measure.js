"use strict";
/**
 * @packageDocumentation
 * @module ObnizCore.Components
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = __importDefault(require("../utils/util"));
class ObnizMeasure {
    constructor(obniz) {
        this.obniz = obniz;
        this._reset();
    }
    _reset() {
        this.observers = [];
    }
    echo(params) {
        const err = util_1.default._requiredKeys(params, [
            "io_pulse",
            "pulse",
            "pulse_width",
            "io_echo",
            "measure_edges",
        ]);
        if (err) {
            throw new Error("Measure start param '" + err + "' required, but not found ");
        }
        this.params = util_1.default._keyFilter(params, [
            "io_pulse",
            "pulse",
            "pulse_width",
            "io_echo",
            "measure_edges",
            "timeout",
            "callback",
        ]);
        const echo = {};
        echo.io_pulse = this.params.io_pulse;
        echo.pulse = this.params.pulse;
        echo.pulse_width = this.params.pulse_width;
        echo.io_echo = this.params.io_echo;
        echo.measure_edges = this.params.measure_edges;
        if (typeof this.params.timeout === "number") {
            echo.timeout = this.params.timeout;
        }
        this.obniz.send({
            measure: {
                echo,
            },
        });
        if (this.params.callback) {
            this.observers.push(this.params.callback);
        }
    }
    notified(obj) {
        const callback = this.observers.shift();
        if (callback) {
            callback(obj.echo);
        }
    }
}
exports.default = ObnizMeasure;

//# sourceMappingURL=measure.js.map
