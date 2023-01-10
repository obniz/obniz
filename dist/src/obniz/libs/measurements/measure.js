"use strict";
/**
 * @packageDocumentation
 * @module ObnizCore.Components
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObnizMeasure = void 0;
const ComponentAbstact_1 = require("../ComponentAbstact");
const util_1 = require("../utils/util");
/**
 * The measure module provides hardware level measurement.
 *
 * @category Measurement
 */
class ObnizMeasure extends ComponentAbstact_1.ComponentAbstract {
    constructor(obniz) {
        super(obniz);
        this._reset();
    }
    /**
     * @ignore
     * @private
     */
    _reset() {
        this.observers = [];
    }
    /**
     * Some electrical parts or circuits accept "pulse" and echo the "pulse" after delay.
     * This module is best suited for measuring that delay.
     *
     * This module generates one pulse shot on an io, then measures the response time.
     *
     *
     * ```javascript
     * // Javascript Example
     * obniz.measure.echo({
     *   io_pulse: 0, // io for generate pulse
     *   io_echo: 1, // io to be measured
     *   pulse: "positive", // generate pulse pattern
     *   pulse_width: 0.1,  // generate pulse width
     *   measure_edges: 3, // 1 to 4. maximum edges to measure
     *   timeout: 1000, // this is optional. 1000(1sec) is default
     *   callback: function(edges) {
     *     // callback function
     *     console.log(edges);
     *   }
     * });
     * ```
     *
     * @param params
     */
    echo(params) {
        const err = util_1.ObnizUtil._requiredKeys(params, [
            'io_pulse',
            'pulse',
            'pulse_width',
            'io_echo',
            'measure_edges',
        ]);
        if (err) {
            throw new Error("Measure start param '" + err + "' required, but not found ");
        }
        params = util_1.ObnizUtil._keyFilter(params, [
            'io_pulse',
            'pulse',
            'pulse_width',
            'io_echo',
            'measure_edges',
            'timeout',
            'callback',
        ]);
        const echo = {};
        echo.io_pulse = params.io_pulse;
        echo.pulse = params.pulse;
        echo.pulse_width = params.pulse_width;
        echo.io_echo = params.io_echo;
        echo.measure_edges = params.measure_edges;
        if (typeof params.timeout === 'number') {
            echo.timeout = params.timeout;
        }
        if (typeof params.callback === 'function') {
            this.onceQueue('/response/measure/echo', (obj) => {
                this.Obniz._runUserCreatedFunction(params.callback, obj.echo);
            });
        }
        this.Obniz.send({
            measure: {
                echo,
            },
        });
    }
    schemaBasePath() {
        return 'measure';
    }
}
exports.ObnizMeasure = ObnizMeasure;
