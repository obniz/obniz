"use strict";
/**
 * @packageDocumentation
 * @module ObnizCore.Components
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogicAnalyzer = void 0;
const ComponentAbstact_1 = require("../ComponentAbstact");
const util_1 = require("../utils/util");
/**
 * LogicAnalyzer records samples read from io periodically.
 * This is useful for digital bus signal check.
 *
 * Only one LogicAnalyzer can be used per obniz Board.
 *
 * ### How it works
 * LogicAnalyzer starts logging by a trigger.
 * The default trigger is "value change".
 *
 * When it occurs, data will be recorded for a desired duration.
 * After that is done, LogicAnalyzer starts monitoring changes in io (= continue working).
 * One sample becomes one 1/0.
 *
 * ![](media://logiana_0.png)
 *
 * Sampling interval and duration can be configured.
 * For example, if interval is 1 ms and duration is 800ms, you will get 800 arrays of data.
 * The data will be in multiples of 8.
 *
 * @category Measurement
 */
class LogicAnalyzer extends ComponentAbstact_1.ComponentAbstract {
    constructor(obniz) {
        super(obniz);
        this.on('/response/logicAnalyzer/data', (obj) => {
            if (this.onmeasured) {
                this.Obniz._runUserCreatedFunction(this.onmeasured, obj.data);
            }
            else {
                if (!this.measured) {
                    this.measured = [];
                }
                this.measured.push(obj.data);
            }
        });
        this._reset();
    }
    /**
     * @ignore
     * @private
     */
    _reset() {
        this.onmeasured = undefined;
    }
    /**
     * This starts the logic analyzer on a given io.
     *
     * For example, if you want to collect the data after io0 changes every 2ms for 1sec long, set as below.
     *
     * ```javascript
     * // Javascript Example
     * obniz.logicAnalyzer.start({io:0, interval:2, duration:1000});  // start on io0. 2ms interval and 1sec long.
     * obniz.logicAnalyzer.onmeasured = function(array) {
     *   console.log(array);
     * }
     * ```
     *
     * The trigger is an optional configuration.
     *
     * Without this, logicAnalyzer recognizes any io level change as trigger and start. Trigger specifies the start position.
     * Value means start value, true/false. Samples means how much that value consists.
     * So, with the below sample code, you will only receive data that start with "0, 0, 0"
     *
     * ```javascript
     * // Javascript Example
     * obniz.logicAnalyzer.start({io:0, interval:2, duration:1000, triggerValue:false, triggerValueSamples:3});  // start on io0. 2ms interval and 1sec long.
     * obniz.logicAnalyzer.onmeasured = function(array) {
     *   console.log(array);
     * }
     * ```
     *
     * @param params
     */
    start(params) {
        const err = util_1.ObnizUtil._requiredKeys(params, ['io', 'interval', 'duration']);
        if (err) {
            throw new Error("LogicAnalyzer start param '" + err + "' required, but not found ");
        }
        this.params = util_1.ObnizUtil._keyFilter(params, [
            'io',
            'interval',
            'duration',
            'triggerValue',
            'triggerValueSamples',
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
        this.Obniz.send(obj);
        return;
    }
    /**
     * This stops the logicAnalyzer.
     *
     * ```javascript
     * // Javascript Example
     * obniz.logicAnalyzer.start({io:0, interval:2, duration:1000});  // start on io0. 1ms interval and 1sec long.
     * obniz.logicAnalyzer.end();
     * ```
     */
    end() {
        const obj = {
            logic_analyzer: null,
        };
        this.Obniz.send(obj);
        return;
    }
    schemaBasePath() {
        return 'logic_analyzer';
    }
}
exports.LogicAnalyzer = LogicAnalyzer;
