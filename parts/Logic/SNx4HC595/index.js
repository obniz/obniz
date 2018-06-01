class SNx4HC595_IO {
  constructor(chip, id) {
    this.chip = chip;
    this.id = id;
    this.value = 0;
  }

  output(value) {
    this.chip.output(this.id, value);
  }
}

class SNx4HC595 {
  constructor() {
    /* http://www.ti.com/lit/ds/symlink/sn74hc595.pdf */
    this.keys = ['gnd', 'vcc', 'ser', 'srclk', 'rclk', 'oe', 'srclr', 'io_num'];
    this.requiredKeys = ['ser', 'srclk', 'rclk'];

    this.ioNum(8);
  }

  wired(obniz) {
    this.obniz = obniz;

    this.obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');

    this.io_ser = this.obniz.getIO(this.params.ser);
    this.io_srclk = this.obniz.getIO(this.params.srclk);
    this.io_rclk = this.obniz.getIO(this.params.rclk);

    if (this.obniz.isValidIO(this.params.oe)) {
      this.io_oe = this.obniz.getIO(this.params.oe);
      this.io_oe.output(true);
    }
    if (this.obniz.isValidIO(this.params.srclr)) {
      this.io_srclr = this.obniz.getIO(this.params.srclr);
      this.io_srclr.output(true);
    }

    this.io_ser.output(false);
    this.io_srclk.output(false);
    this.io_rclk.output(false);

    if (this.obniz.isValidIO(this.params.vcc)) {
      this.obniz.wait(100);
    }

    if (typeof this.params.io_num === 'number') {
      this.ioNum(this.params.io_num);
    }
    if (this.io_oe) {
      this.io_oe.output(false);
    }
  }

  ioNum(num) {
    if (typeof num === 'number' && this._io_num !== num) {
      this._io_num = num;
      this.io = [];
      for (let i = 0; i < num; i++) {
        this.io.push(new SNx4HC595_IO(this, i));
      }
      this.flush();
    } else {
      throw new Error('io num should be a number');
    }
  }

  isValidIO(io) {
    return typeof io === 'number' && io >= 0 && io < this._io_num;
  }

  getIO(io) {
    if (!this.isValidIO(io)) {
      throw new Error('io ' + io + ' is not valid io');
    }
    return this.io[io];
  }

  output(id, value) {
    value = value == true;
    this.io[id].value = value;
    this.flush();
  }

  setEnable(enable) {
    if (!this.io_oe && enable == false) {
      throw new Error('pin "oe" is not specified');
    }
    this.io_oe.output(!enable);
  }

  flush() {}
}

let Obniz = require('../../../obniz/index.js');
Obniz.PartsRegistrate('SNx4HC595', SNx4HC595);
