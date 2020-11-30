/**
 * @packageDocumentation
 * @module ObnizCore.Components
 */

import Obniz from "../../index";
import { ComponentAbstract } from "../ComponentAbstact";
import ObnizUtil from "../utils/util";
import { LogicAnalyzerOptions } from "./logicanalyzer";

export interface ObnizMeasureResult {
  edge: boolean;
  timing: number;
}

type ObnizMeasureResultArray = [ObnizMeasureResult, ObnizMeasureResult];

export interface ObnizMeasureOptions {
  /**
   * io number to generate pulse. Please use with 'pulse' and 'pulse_width' params.
   *
   * ![](media://measure_posneg.png)
   *
   * @category Pulse generation
   *
   */
  io_pulse: number;

  /**
   * "positive" or "negative"
   * @category Pulse generation
   */
  pulse: "positive" | "negative";

  /**
   * pulse duration in values between ms. 0.001 to 1000.
   *
   * @category Pulse generation
   */
  pulse_width: number;

  /**
   * io for measuring response. Please use with 'measure_edges' params.
   * @category Response measurement
   */
  io_echo: number;

  /**
   * maximum number of edges to detect. 1 to 4.
   * @category Response measurement
   */
  measure_edges: number;

  /**
   * timeout in ms, and default is 1000. 0.001 to 1000.
   * @category Response measurement
   */
  timeout?: number;

  /**
   * callback function after measurement or timeout.
   *
   * A callback function will be called when the edge count = measure_edges or timeout.
   * It has an array of edge information. For example, if you get a response like below
   *
   * ![](media://measure_response.png)
   *
   * then, you will get below
   *
   * ```javascript
   * callback: function(edges) {
   *   edges.length // == 2
   *   edges[0].edge // == true
   *   edges[0].timing // == t1
   *   edges[1].edge // == false
   *   edges[1].timing // == t2
   * }
   * ```
   *
   * @category Response measurement
   */
  callback?: (edges: ObnizMeasureResultArray) => void;
}

/**
 * The measure module provides hardware level measurement.
 * @category Measurement
 */
export default class ObnizMeasure extends ComponentAbstract {
  private observers!: Array<(edges: ObnizMeasureResultArray) => void>;
  private params?: ObnizMeasureOptions;

  constructor(obniz: Obniz) {
    super(obniz);
    this._reset();
  }

  /**
   * @ignore
   * @private
   */
  public _reset() {
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
  public echo(params: ObnizMeasureOptions) {
    const err: any = ObnizUtil._requiredKeys(params, ["io_pulse", "pulse", "pulse_width", "io_echo", "measure_edges"]);
    if (err) {
      throw new Error("Measure start param '" + err + "' required, but not found ");
    }
    params = ObnizUtil._keyFilter(params, [
      "io_pulse",
      "pulse",
      "pulse_width",
      "io_echo",
      "measure_edges",
      "timeout",
      "callback",
    ]) as ObnizMeasureOptions;

    const echo: any = {};
    echo.io_pulse = params.io_pulse;
    echo.pulse = params.pulse;
    echo.pulse_width = params.pulse_width;
    echo.io_echo = params.io_echo;
    echo.measure_edges = params.measure_edges;
    if (typeof params.timeout === "number") {
      echo.timeout = params.timeout;
    }

    if (typeof params.callback === "function") {
      this.onceQueue("/response/measure/echo", (obj) => {
        this.Obniz._runUserCreatedFunction(params.callback, obj.echo);
      });
    }

    this.Obniz.send({
      measure: {
        echo,
      },
    });
  }

  public schemaBasePath(): string {
    return "measure";
  }
}
