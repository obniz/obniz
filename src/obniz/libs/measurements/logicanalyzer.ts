import Obniz from "../../index";
import ObnizUtil from "../utils/util";

interface LogicAnalyzerOptions {
  "io": number;
  "interval": number;
  "duration": number;
  "triggerValue": boolean;
  "triggerValueSamples": number;
}

interface LogicAnalyzerOptionsExt extends LogicAnalyzerOptions {
  "triggerValue": boolean;
  "triggerValueSamples": number;
}

class LogicAnalyzer {
  public obniz: Obniz;
  public onmeasured?: (array: number[]) => void;
  public params: any;
  public measured?: number[];

  constructor(obniz: Obniz) {
    this.obniz = obniz;
    this._reset();
  }

  public _reset() {
    this.onmeasured = undefined;
  }

  public start(params: LogicAnalyzerOptions | LogicAnalyzerOptionsExt) {
    const err: any = ObnizUtil._requiredKeys(params, ["io", "interval", "duration"]);
    if (err) {
      throw new Error(
        "LogicAnalyzer start param '" + err + "' required, but not found ",
      );
    }
    this.params = ObnizUtil._keyFilter(params, [
      "io",
      "interval",
      "duration",
      "triggerValue",
      "triggerValueSamples",
    ]);

    const obj: any = {};
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

  public end() {
    const obj: any = {};
    obj.logic_analyzer = null;
    this.obniz.send(obj);
    return;
  }

  public notified(obj: any) {
    if (this.onmeasured) {
      this.onmeasured(obj.data);
    } else {
      if (!this.measured) {
        this.measured = [];
      }
      this.measured.push(obj.data);
    }
    return;
  }
}

export default LogicAnalyzer;
