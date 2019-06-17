class DHT11 {
  constructor() {
    this.keys = ['gnd', 'sda', 'vcc', 'trigger'];
    this.requiredKeys = ['sda', 'trigger'];
    this.dataSymbolLength = 0.01;
    this.duration = 40;
    this.triggerSampleCount = 500; // If Signal arrives more than this count. then treat as signal
    this.sda_pullup = true;
    this.debugprint = false;
  }

  static info() {
    return {
      name: 'DHT11',
    };
  }

  wired(obniz) {
    this.obniz = obniz;
    obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');
    if (!obniz.isValidIO(this.params.sda)) {
      throw new Error('sda is not valid io');
    }
    if (!obniz.isValidIO(this.params.trigger)) {
      throw new Error('trigger is not valid io');
    }
  }

  arrayCount(arr) {
    let c = [];
    c[0] = arr[0] ? 0 : 1;
    for (let i = 1; i < arr.length; i++) {
      if (arr[i] == arr[i - 1]) {
        c[c.length - 1] += 1;
      } else {
        c.push(1);
      }
    }
    return c;
  }

  convertCountToData(cnt) {
    let s = [];
    for (let i = 4; i < cnt.length - 3; i += 2) {
      s.push(cnt[i] > cnt[i + 1] ? 0 : 1);
    }
    return s;
  }

  getValueFromData(sig, start) {
    let v = 0;
    for (let i = start; i < start + 8; i++) {
      v += (2 ** (start + 7 - i)) * sig[i];
    }
    return v;
  }

  checkParity(sig) {
    let l = this.getValueFromData(sig, 0) + this.getValueFromData(sig, 8) + this.getValueFromData(sig, 16) + this.getValueFromData(sig, 24);
    return l == this.getValueFromData(sig, 32) ? true : false;
  }

  print_debug(str) {
    if (this.debugprint == true) {
      console.log('DHT11: ' + str);
    }
  }

  async read(callback) {
    // let sda = this.obniz.getIO(this.params.sda);
    let sda2 = this.obniz.getIO(this.params.trigger);

    let la = this.obniz.logicAnalyzer;
    let par = {
      io: this.params.sda,
      interval: this.dataSymbolLength,
      duration: this.duration,
      triggerValue: false,
      triggerValueSamples: this.triggerSampleCount,
    };

    la.onmeasured = levels => {
      if (typeof callback === 'function') {
        var cnt = this.arrayCount(levels);
        if (cnt.length < 80) {
          this.print_debug("Short data: " + JSON.stringify(cnt));
          return;
        }
        var sig = this.convertCountToData(cnt);
        if (this.checkParity(sig) == false) {
          this.print_debug("Parity does not match");
          return;
        }
        let temperature = this.getValueFromData(sig, 16) + this.getValueFromData(sig, 24) * 0.1;
        let humidity = this.getValueFromData(sig, 0) + this.getValueFromData(sig, 8) * 0.1;
        callback({ temperature, humidity });
      }
    };

    la.start(par);

    let sda_pullup = this.sda_pullup;
    await this.obniz.io.repeatWait([
      {
        duration: 1,
        state: function (index) {
          sda2.end();
          sda2.pull(null);
          sda2.output(true);
        }
      }, {
        duration: 20,
        state: function (index) {
          sda2.output(false);
        }
      },
      {
        duration: 0,
        state: function (index) {
          sda2.end();
          if (sda_pullup == true) {
            sda2.pull('5v');
          };
        }
      }
    ], 3);
  }

  getAllWait() {
    return new Promise(resolve => {
      this.read(function (obj) {
        resolve(obj);
      });
    });
  }

  async getTempWait() {
    return (await this.getAllWait()).temperature;
  }

  async getHumdWait() {
    return (await this.getAllWait()).humidity;
  }
}

if (typeof module === 'object') {
  module.exports = DHT11;
}
