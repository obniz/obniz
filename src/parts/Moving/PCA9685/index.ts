/**
 * @packageDocumentation
 * @module Parts.PCA9685
 */

import Obniz from "../../../obniz";
import PeripheralI2C from "../../../obniz/libs/io_peripherals/i2c";
import PeripheralIO from "../../../obniz/libs/io_peripherals/io";
import { PWMInterface } from "../../../obniz/libs/io_peripherals/pwm";

import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";

class PCA9685_PWM implements PWMInterface {
  public chip: PCA9685;
  public id: number;
  public value = 0;
  public state: any = {};

  constructor(chip: PCA9685, id: number) {
    this.chip = chip;
    this.id = id;
  }

  public freq(frequency: number) {
    this.chip.freq(frequency);
  }

  public pulse(value: number) {
    this.chip.pulse(this.id, value);
  }

  public duty(value: number) {
    this.chip.duty(this.id, value);
  }
}

export interface PCA9685Options {
  gnd?: number;
  vcc?: number;
  oe?: number;
  scl?: number;
  sda?: number;
  i2c?: PeripheralI2C;
  enabled?: boolean;
  address?: number;
  drive?: string;
}

// tslint:disable:max-classes-per-file

export default class PCA9685 implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: "PCA9685",
    };
  }

  public keys: string[];
  public requiredKeys: string[];

  public address: any;
  public _commands: any;
  public _regs: any;
  public pwmNum: any;
  public pwms: PCA9685_PWM[] = [];
  public params: any;
  public io_srclr: any;
  public chip: any;
  public id: any;
  public value: any;
  public state: any;

  protected obniz!: Obniz;

  private io_oe?: PeripheralIO;
  private i2c!: PeripheralI2C;
  private _freq: number = 0;

  constructor() {
    /* https://www.nxp.com/docs/en/data-sheet/PCA9685.pdf */
    this.keys = ["gnd", "vcc", "scl", "sda", "oe", "i2c", "enabled", "address", "drive"];
    this.requiredKeys = [];

    this.address = 0x40;

    this._commands = {
      MODE1: 0x00,
      MODE2: 0x01,
      SUBADR1: 0x02,
      SUBADR2: 0x03,
      SUBADR3: 0x04,
      PRESCALE: 0xfe,
      LED0_ON_L: 0x06,
      ALL_LED_ON_L: 0xfa,
      bits: {
        ALLCALL: 0x01,
        SLEEP_ENABLE: 0x10,
        AUTO_INCREMENT_ENABLED: 0x20,
        RESTART: 0x80,

        OUTDRV: 0x04,
        INVRT: 0x10,
      },
    };

    this._regs = new Array(1);

    this.pwmNum = 16;
    this.pwms = [];
    this._preparePWM(this.pwmNum);
  }

  public wired(obniz: Obniz) {
    this.obniz = obniz;

    if (obniz.isValidIO(this.params.oe)) {
      this.io_oe = obniz.getIO(this.params.oe);
    }

    this.obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");

    if (typeof this.params.address === "number") {
      this.address = this.params.address;
    }

    this.params.clock = this.params.clock || 400 * 1000; // for i2c
    this.params.mode = this.params.mode || "master"; // for i2c
    this.params.pull = this.params.pull || "5v"; // for i2c
    this.i2c = obniz.getI2CWithConfig(this.params);

    if (this.obniz.isValidIO(this.params.srclr)) {
      this.io_srclr = this.obniz.getIO(this.params.srclr);
      this.io_srclr.output(true);
    }

    if (typeof this.params.enabled !== "boolean") {
      this.params.enabled = true;
    }
    if (this.io_oe && this.params.enabled) {
      this.io_oe.output(false);
    }

    if (this.params.drive === "open-drain") {
      this.i2c.write(this.address, [this._commands.MODE2, this._commands.bits.OUTDRV]);
    }

    let mode1: any = this._commands.bits.AUTO_INCREMENT_ENABLED;
    mode1 = mode1 & ~this._commands.bits.SLEEP_ENABLE;
    this.i2c.write(this.address, [this._commands.MODE1, mode1]);
    this.i2c.write(this.address, [this._commands.MODE1, mode1 | this._commands.bits.RESTART]);

    this._regs[this._commands.MODE1] = mode1;

    obniz.wait(10);
  }

  public _preparePWM(num: any) {
    for (let i = 0; i < num; i++) {
      this.pwms.push(new PCA9685_PWM(this, i));
    }
  }

  public isValidPWM(id: any) {
    return typeof id === "number" && id >= 0 && id < this.pwmNum;
  }

  public getPWM(id: number): PCA9685_PWM {
    if (!this.isValidPWM(id)) {
      throw new Error("pwm " + id + " is not valid pwm");
    }
    return this.pwms[id];
  }

  public freq(frequency: number) {
    if (typeof frequency !== "number") {
      return;
    }
    if (frequency < 24 || 1526 < frequency) {
      throw new Error("freq must be within 24-1526 hz");
    }
    if (this._freq === frequency) {
      return;
    }
    let prescaleval: any = 25000000.0; // 25MHz
    prescaleval /= 4096.0; // 12bit
    prescaleval /= frequency * 0.9;
    prescaleval -= 1.0;

    const prescale: any = Math.floor(Math.floor(prescaleval + 0.5));
    const mode1: any = this._regs[this._commands.MODE1];

    this.i2c.write(this.address, [this._commands.MODE1, (mode1 & 0x7f) | this._commands.bits.SLEEP_ENABLE]); // enter sleep
    this.i2c.write(this.address, [this._commands.PRESCALE, prescale]);
    this.i2c.write(this.address, [this._commands.MODE1, mode1]); // recover from sleep

    this.obniz.wait(5);

    // save
    this._freq = frequency;
    for (let i = 0; i < this.pwms.length; i++) {
      this.pwms[i].state.freq = this._freq;
    }
  }

  public pulse(index: number, pulse_width: number) {
    if (typeof this._freq !== "number" || this._freq <= 0) {
      throw new Error("please provide freq first.");
    }
    this.duty(index, (pulse_width / 1000.0 / (1.0 / this._freq)) * 100);
  }

  public duty(index: number, duty: number) {
    duty *= 1.0;
    if (typeof this._freq !== "number" || this._freq <= 0) {
      throw new Error("please provide freq first.");
    }
    if (typeof duty !== "number") {
      throw new Error("please provide duty in number");
    }
    if (duty < 0) {
      duty = 0;
    }
    if (duty > 100) {
      duty = 100;
    }
    this.getPWM(index).state.duty = duty;
    this.writeSingleONOFF(index, 0, (duty / 100.0) * 4095);
  }

  public writeSingleONOFF(index: number, on: number, off: number) {
    this.i2c.write(this.address, [this._commands.LED0_ON_L + 4 * index, on & 0xff, on >> 8, off & 0xff, off >> 8]);
  }

  public setEnable(enable: boolean) {
    if (!this.io_oe && enable === false) {
      throw new Error('pin "oe" is not specified');
    }
    this.io_oe!.output(!enable);
  }
}
