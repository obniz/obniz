const ObnizUtil: any = require("../utils/util");
const semver: any = require("semver");

class PeripheralSPI {
  public Obniz: any;
  public id: any;
  public observers: any;
  public used: any;
  public params: any;

  constructor(Obniz: any, id: any) {
    this.Obniz = Obniz;
    this.id = id;
    this._reset();
  }

  public _reset() {
    this.observers = [];
    this.used = false;
  }

  public addObserver(callback: any) {
    if (callback) {
      this.observers.push(callback);
    }
  }

  public start(params: any) {
    const err: any = ObnizUtil._requiredKeys(params, ["mode", "frequency"]);
    if (err) {
      throw new Error("spi start param '" + err + "' required, but not found ");
    }
    this.params = ObnizUtil._keyFilter(params, [
      "mode",
      "clk",
      "mosi",
      "miso",
      "frequency",
      "drive",
      "pull",
      "gnd",
    ]);
    const obj: any = {};

    const ioKeys: any = ["clk", "mosi", "miso", "gnd"];
    for (const key: any of ioKeys) {
      if (this.params[key] && !this.Obniz.isValidIO(this.params[key])) {
        throw new Error("spi start param '" + key + "' are to be valid io no");
      }
    }

    obj["spi" + this.id] = {
      mode: this.params.mode,
      clock: this.params.frequency, // name different
    };
    if (this.params.clk !== undefined) {
      obj["spi" + this.id].clk = this.params.clk;
    }
    if (this.params.mosi !== undefined) {
      obj["spi" + this.id].mosi = this.params.mosi;
    }
    if (this.params.miso !== undefined) {
      obj["spi" + this.id].miso = this.params.miso;
    }

    if (this.params.drive) {
      if (this.params.clk !== undefined) {
        this.Obniz.getIO(this.params.clk).drive(this.params.drive);
      }
      if (this.params.mosi !== undefined) {
        this.Obniz.getIO(this.params.mosi).drive(this.params.drive);
      }
      if (this.params.miso !== undefined) {
        this.Obniz.getIO(this.params.miso).drive(this.params.drive);
      }
    } else {
      if (this.params.clk !== undefined) {
        this.Obniz.getIO(this.params.clk).drive("5v");
      }
      if (this.params.mosi !== undefined) {
        this.Obniz.getIO(this.params.mosi).drive("5v");
      }
      if (this.params.miso !== undefined) {
        this.Obniz.getIO(this.params.miso).drive("5v");
      }
    }

    if (this.params.pull) {
      if (this.params.clk !== undefined) {
        this.Obniz.getIO(this.params.clk).pull(this.params.pull);
      }
      if (this.params.mosi !== undefined) {
        this.Obniz.getIO(this.params.mosi).pull(this.params.pull);
      }
      if (this.params.miso !== undefined) {
        this.Obniz.getIO(this.params.miso).pull(this.params.pull);
      }
    } else {
      if (this.params.clk !== undefined) {
        this.Obniz.getIO(this.params.clk).pull(null);
      }
      if (this.params.mosi !== undefined) {
        this.Obniz.getIO(this.params.mosi).pull(null);
      }
      if (this.params.miso !== undefined) {
        this.Obniz.getIO(this.params.miso).pull(null);
      }
    }

    if (this.params.gnd !== undefined) {
      this.Obniz.getIO(this.params.gnd).output(false);
      const ioNames: any = {};
      ioNames[this.params.gnd] = "gnd";
      this.Obniz.display.setPinNames("spi" + this.id, ioNames);
    }
    this.used = true;
    this.Obniz.send(obj);
  }

  public writeWait(data: any) {
    if (!this.used) {
      throw new Error(`spi${this.id} is not started`);
    }
    if (semver.lte(this.Obniz.firmware_ver, "1.0.2") && data.length > 32) {
      throw new Error(
        `with your obniz ${
          this.Obniz.firmware_ver
        }. spi max length=32byte but yours ${
          data.length
        }. Please update obniz firmware`,
      );
    }

    const self: any = this;
    return new Promise((resolve, reject) => {
      self.addObserver(resolve);
      const obj: any = {};
      obj["spi" + self.id] = {
        data,
        read: true,
      };
      self.Obniz.send(obj);
    });
  }

  public write(data: any) {
    if (!this.used) {
      throw new Error(`spi${this.id} is not started`);
    }
    if (semver.lte(this.Obniz.firmware_ver, "1.0.2") && data.length > 32) {
      throw new Error(
        `with your obniz ${
          this.Obniz.firmware_ver
        }. spi max length=32byte but yours ${
          data.length
        }. Please update obniz firmware`,
      );
    }

    const self: any = this;
    const obj: any = {};
    obj["spi" + self.id] = {
      data,
      read: false,
    };
    self.Obniz.send(obj);
  }

  public notified(obj: any) {
    // TODO: we should compare byte length from sent
    const callback: any = this.observers.shift();
    if (callback) {
      callback(obj.data);
    }
  }

  public isUsed() {
    return this.used;
  }

  public end(reuse: any) {
    const self: any = this;
    const obj: any = {};
    obj["spi" + self.id] = null;
    this.params = null;
    self.Obniz.send(obj);
    if (!reuse) {
      this.used = false;
    }
  }
}

module.exports = PeripheralSPI;
