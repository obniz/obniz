"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = __importDefault(require("../utils/util"));
class LogicAnalyzer {
    constructor(obniz) {
        this.obniz = obniz;
        this._reset();
    }
    _reset() {
        this.onmeasured = undefined;
    }
    start(params) {
        const err = util_1.default._requiredKeys(params, ["io", "interval", "duration"]);
        if (err) {
            throw new Error("LogicAnalyzer start param '" + err + "' required, but not found ");
        }
        this.params = util_1.default._keyFilter(params, [
            "io",
            "interval",
            "duration",
            "triggerValue",
            "triggerValueSamples",
        ]);
        const obj = {};
        obj.logic_analyzer = {
            io: [this.params.io],
            interval: this.params.interval,
            duration: this.params.duration,
        };
        if (this.params.triggerValueSamples > 0) {
            obj.logic_analyzer.trigger = {
                value: !!this.params.triggerValue,
                samples: this.params.triggerValueSamples,
            };
        }
        this.obniz.send(obj);
        return;
    }
    end() {
        const obj = {};
        obj.logic_analyzer = null;
        this.obniz.send(obj);
        return;
    }
    notified(obj) {
        if (this.onmeasured) {
            this.onmeasured(obj.data);
        }
        else {
            if (!this.measured) {
                this.measured = [];
            }
            this.measured.push(obj.data);
        }
        return;
    }
}
exports.default = LogicAnalyzer;
//# sourceMappingURL=logicanalyzer.js.map