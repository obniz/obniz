/**
 * @packageDocumentation
 * @module ObnizCore.Components
 */

import Obniz from "../../index";
import ObnizUtil from "../utils/util";

export interface ObnizMeasureResult {
  edge: boolean;
  timing: number;
}

type ObnizMeasureResultArray = [ObnizMeasureResult, ObnizMeasureResult];

export interface ObnizMeasureOptions {
  "io_pulse": number;
  "pulse": "positive" | "negative";
  "pulse_width": number;
  "io_echo": number;
  "measure_edges": number;
  "timeout"?: number;
  "callback"?: (edges: ObnizMeasureResultArray) => void;
}

export default class ObnizMeasure {
  public obniz: Obniz;
  public observers!: Array<(edges: ObnizMeasureResultArray) => void>;
  public params?: ObnizMeasureOptions;

  constructor(obniz: Obniz) {
    this.obniz = obniz;
    this._reset();
  }

  public _reset() {
    this.observers = [];
  }

  public echo(params: ObnizMeasureOptions) {
    const err: any = ObnizUtil._requiredKeys(params, [
      "io_pulse",
      "pulse",
      "pulse_width",
      "io_echo",
      "measure_edges",
    ]);
    if (err) {
      throw new Error(
        "Measure start param '" + err + "' required, but not found ",
      );
    }
    this.params = ObnizUtil._keyFilter(params, [
      "io_pulse",
      "pulse",
      "pulse_width",
      "io_echo",
      "measure_edges",
      "timeout",
      "callback",
    ]) as ObnizMeasureOptions;

    const echo: any = {};
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

  public notified(obj: any) {
    const callback: any = this.observers.shift();
    if (callback) {
      callback(obj.echo);
    }
  }
}
