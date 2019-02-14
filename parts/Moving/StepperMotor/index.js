// class MQ6 {

//   constructor() {
//     this.keys = [
//       'gnd',
//       'vcc',
//       'do',
//       'ao'
//     ];
//     this.requiredKeys = [];
//   }

//   static info() {
//     return {
//       name: 'MQ6',
//     };
//   }

//   wired(obniz) {
//     this.obniz = obniz;

//     this.obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');

//     if (this.obniz.isValidIO(this.params.srclr)) {
//       this.io_srclr = this.obniz.getIO(this.params.srclr);
//       this.io_srclr.output(true);
//     }

//     if (typeof this.params.enabled !== 'boolean') {
//       this.params.enabled = true;
//     }
//     if (this.io_oe && this.params.enabled) {
//       this.io_oe.output(false);
//     }

//     if (this.params.drive === 'open-drain') {
//       this.i2c.write(this.address, [
//         this._commands.MODE2,
//         this._commands.bits.OUTDRV,
//       ]);
//     }

//     let mode1 = this._commands.bits.AUTO_INCREMENT_ENABLED;
//     mode1 = mode1 & ~this._commands.bits.SLEEP_ENABLE;
//     this.i2c.write(this.address, [this._commands.MODE1, mode1]);
//     this.i2c.write(this.address, [
//       this._commands.MODE1,
//       mode1 | this._commands.bits.RESTART,
//     ]);

//     this._regs[this._commands.MODE1] = mode1;

//     obniz.wait(10);
//   }

//   _preparePWM(num) {
//     class PCA9685_PWM {
//       constructor(chip, id) {
//         this.chip = chip;
//         this.id = id;
//         this.value = 0;
//         this.state = {};
//       }

//       freq(frequency) {
//         this.chip.freq(frequency);
//       }
//       pulse(value) {
//         this.chip.pulse(this.id, value);
//       }
//       duty(value) {
//         this.chip.duty(this.id, value);
//       }
//     }

//     for (let i = 0; i < num; i++) {
//       this.pwms.push(new PCA9685_PWM(this, i));
//     }
//   }

//   isValidPWM(id) {
//     return typeof id === 'number' && id >= 0 && id < this.pwmNum;
//   }
// }

// if (typeof module === 'object') {
//   module.exports = MQ6;
// }
