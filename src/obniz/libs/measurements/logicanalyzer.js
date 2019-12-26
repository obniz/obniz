const ObnizUtil = require('../utils/util');

class LogicAnalyzer {
  constructor(obniz) {
    this.obniz = obniz;
    this._reset();
  }

  _reset() {
    this.onmeasured = undefined;
  }

  start(params) {
    let err = ObnizUtil._requiredKeys(params, ['io', 'interval', 'duration']);
    if (err) {
      throw new Error(
        "LogicAnalyzer start param '" + err + "' required, but not found "
      );
    }
    this.params = ObnizUtil._keyFilter(params, [
      'io',
      'interval',
      'duration',
      'triggerValue',
      'triggerValueSamples',
    ]);

    let obj = {};
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
    let obj = {};
    obj.logic_analyzer = null;
    this.obniz.send(obj);
    return;
  }

  notified(obj) {
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

module.exports = LogicAnalyzer;
