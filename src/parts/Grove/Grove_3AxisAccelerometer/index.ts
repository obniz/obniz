/**
 * @packageDocumentation
 * @module Parts.Grove_3AxisAccelerometer
 */

import Obniz from "../../../obniz";
import PeripheralGrove from "../../../obniz/libs/io_peripherals/grove";
import PeripheralI2C from "../../../obniz/libs/io_peripherals/i2c";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";

interface Grove_3AxisAccelerometerOptionsA {
  gnd?: number;
  vcc?: number;
  sda: number;
  scl: number;
}

interface Grove_3AxisAccelerometerOptionsB {
  grove: PeripheralGrove;
}

export type Grove_3AxisAccelerometerOptions = Grove_3AxisAccelerometerOptionsA | Grove_3AxisAccelerometerOptionsB;

export default class Grove_3AxisAccelerometer implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: "Grove_3AxisAccelerometer",
    };
  }

  public keys: string[];
  public requiredKeys: string[];
  public ioKeys: string[];
  public displayName = "3axis";
  public displayIoNames = { sda: "sda", scl: "scl" };

  public address = 0x53;
  public regAdrs: any;
  public constVal: any;
  public params: any;

  protected obniz!: Obniz;

  private vcc?: number;
  private gnd?: number;
  private i2c!: PeripheralI2C;
  private etRegisterBit: any;

  constructor() {
    this.keys = ["gnd", "vcc", "sda", "scl", "grove"];
    this.requiredKeys = [];

    this.ioKeys = this.keys;

    this.regAdrs = {};
    this.regAdrs.POWER_CTL = 0x2d;
    this.regAdrs.THRESH_ACT = 0x24;
    this.regAdrs.THRESH_INACT = 0x25;
    this.regAdrs.TIME_INACT = 0x26;
    this.regAdrs.ACT_INACT_CTL = 0x27;
    this.regAdrs.TAP_AXES = 0x2a;
    this.regAdrs.THRESH_TAP = 0x1d;
    this.regAdrs.DUR = 0x21;
    this.regAdrs.LATENT = 0x22;
    this.regAdrs.WINDOW = 0x23;
    this.regAdrs.THRESH_FF = 0x28;
    this.regAdrs.TIME_FF = 0x29;
    this.regAdrs.INT_MAP = 0x2f;
    this.regAdrs.INT_ENABLE = 0x2e;
    this.regAdrs.DATAX0 = 0x32;

    this.regAdrs.INT_DATA_READY_BIT = 0x07;
    this.regAdrs.INT_SINGLE_TAP_BIT = 0x06;
    this.regAdrs.INT_DOUBLE_TAP_BIT = 0x05;
    this.regAdrs.INT_ACTIVITY_BIT = 0x04;
    this.regAdrs.INT_INACTIVITY_BIT = 0x03;
    this.regAdrs.INT_FREE_FALL_BIT = 0x02;
    this.regAdrs.INT_WATERMARK_BIT = 0x01;
    this.regAdrs.INT_OVERRUNY_BIT = 0x00;

    this.constVal = {};
    this.constVal.gainX = 0.0037639;
    this.constVal.gainY = 0.00376009;
    this.constVal.gainZ = 0.00349265;
    this.constVal.INT1_PIN = 0x00;
    this.constVal.INT2_PIN = 0x01;
  }

  public async wired(obniz: any) {
    this.obniz = obniz;

    if (this.params.grove) {
      this.i2c = this.params.grove.getI2c(400000, "5v");
    } else {
      this.vcc = this.params.vcc;
      this.gnd = this.params.gnd;
      this.obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");

      this.params.clock = 400000;
      this.params.mode = "master";

      this.i2c = obniz.getI2CWithConfig(this.params);
    }
    this.obniz.wait(100);

    // power on
    this.i2c.write(this.address, [this.regAdrs.POWER_CTL, 0]);
    this.i2c.write(this.address, [this.regAdrs.POWER_CTL, 16]);
    this.i2c.write(this.address, [this.regAdrs.POWER_CTL, 8]);

    this.i2c.write(this.address, [this.regAdrs.THRESH_ACT, 75]); // set activity threshold 0~255
    this.i2c.write(this.address, [this.regAdrs.THRESH_INACT, 75]); // set inactivity threshold 0~255
    this.i2c.write(this.address, [this.regAdrs.THRESH_INACT, 10]); // set time inactivity 0~255
    await this.setRegisterBit(this.regAdrs.ACT_INACT_CTL, 6, 1); // setActivityX
    await this.setRegisterBit(this.regAdrs.ACT_INACT_CTL, 5, 1); // setActivityY
    await this.setRegisterBit(this.regAdrs.ACT_INACT_CTL, 4, 1); // setActivityZ
    await this.setRegisterBit(this.regAdrs.ACT_INACT_CTL, 2, 1); // setInactivityX
    await this.setRegisterBit(this.regAdrs.ACT_INACT_CTL, 1, 1); // setInactivityY
    await this.setRegisterBit(this.regAdrs.ACT_INACT_CTL, 0, 1); // setInactivityZ
    await this.setRegisterBit(this.regAdrs.TAP_AXES, 2, 0); // setTapDetectionOnX
    await this.setRegisterBit(this.regAdrs.TAP_AXES, 1, 0); // setTapDetectionOnY
    await this.setRegisterBit(this.regAdrs.TAP_AXES, 0, 1); // setTapDetectionOnZ

    this.i2c.write(this.address, [this.regAdrs.THRESH_TAP, 50]); // setTapThreshold
    this.i2c.write(this.address, [this.regAdrs.DUR, 15]); // setTapDuration
    this.i2c.write(this.address, [this.regAdrs.LATENT, 80]); // setDoubleTapLatency
    this.i2c.write(this.address, [this.regAdrs.WINDOW, 200]); // setDoubleTapWindow
    this.i2c.write(this.address, [this.regAdrs.THRESH_FF, 7]); // setFreeFallThreshold
    this.i2c.write(this.address, [this.regAdrs.TIME_FF, 45]); // setFreeFallDuration

    // setInterruptMapping
    await this.setInterruptMapping(this.regAdrs.INT_SINGLE_TAP_BIT, this.constVal.INT1_PIN);
    await this.setInterruptMapping(this.regAdrs.INT_DOUBLE_TAP_BIT, this.constVal.INT1_PIN);
    await this.setInterruptMapping(this.regAdrs.INT_FREE_FALL_BIT, this.constVal.INT1_PIN);
    await this.setInterruptMapping(this.regAdrs.INT_ACTIVITY_BIT, this.constVal.INT1_PIN);
    await this.setInterruptMapping(this.regAdrs.INT_INACTIVITY_BIT, this.constVal.INT1_PIN);

    // setInterrupt
    await this.setInterrupt(this.regAdrs.INT_SINGLE_TAP_BIT, 1);
    await this.setInterrupt(this.regAdrs.INT_DOUBLE_TAP_BIT, 1);
    await this.setInterrupt(this.regAdrs.INT_FREE_FALL_BIT, 1);
    await this.setInterrupt(this.regAdrs.INT_ACTIVITY_BIT, 1);
    await this.setInterrupt(this.regAdrs.INT_INACTIVITY_BIT, 1);
  }

  public async setRegisterBit(regAddr: any, bitPos: any, state: any) {
    this.i2c.write(this.address, [regAddr]);
    let b: any = await this.i2c.readWait(this.address, 1);
    if (state) {
      b = b | (1 << bitPos); // forces nth bit of b to be 1.  all other bits left alone.
    } else {
      b = b & ~(1 << bitPos); // forces nth bit of b to be 0.  all other bits left alone.
    }
    this.i2c.write(this.address, [b]);
  }

  public async setInterruptMapping(interruptBit: any, interruptPin: any) {
    await this.setRegisterBit(this.regAdrs.INT_MAP, interruptBit, interruptPin);
  }

  public async setInterrupt(interruptBit: any, state: any) {
    await this.setRegisterBit(this.regAdrs.INT_ENABLE, interruptBit, state);
  }

  public signHandling(val: number): number {
    const sign: any = val >> 15;
    if (sign) {
      val = -(0xffff - val);
    }
    return val;
  }

  public async getRawVal(): Promise<number[]> {
    this.i2c.write(this.address, [this.regAdrs.DATAX0]);
    const buff: any = await this.i2c.readWait(this.address, 6);
    const rawVal: any = [0, 0, 0];
    rawVal[0] = this.signHandling((buff[1] << 8) | buff[0]);
    rawVal[1] = this.signHandling((buff[3] << 8) | buff[2]);
    rawVal[2] = this.signHandling((buff[5] << 8) | buff[4]);
    return rawVal;
  }

  public async getWait(): Promise<number[]> {
    const accelVal: any = [0, 0, 0];
    const raw: any = await this.getRawVal();
    accelVal[0] = raw[0] * this.constVal.gainX;
    accelVal[1] = raw[1] * this.constVal.gainY;
    accelVal[2] = raw[2] * this.constVal.gainZ;
    return accelVal;
  }
}
