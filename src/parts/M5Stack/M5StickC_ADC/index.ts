/**
 * @packageDocumentation
 * @module Parts.M5StickC_ADC
 */

import Obniz from "../../../obniz";
import PeripheralI2C from "../../../obniz/libs/io_peripherals/i2c";

import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";
import { I2cPartsAbstractOptions } from "../../i2cParts";

export interface M5StickC_ADCOptions extends I2cPartsAbstractOptions {}

export default class M5StickC_ADC implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: "M5StickC_ADC",
    };
  }

  public keys: string[];
  public requiredKeys: string[];
  public params: any;

  public address: number;
  public conversionDelay: number;
  public config_regs: any;
  public config: any;
  public os: number;
  public mode: number;
  public dataRate: number;
  public pga: number;

  protected obniz!: Obniz;
  protected i2c!: PeripheralI2C;
  private minCode: number;

  constructor() {
    this.keys = ["vcc", "gnd", "sda", "scl", "i2c"];
    this.requiredKeys = [];

    this.address = 0x48;
    this.conversionDelay = 100;
    this.config_regs = {
      OS_MASK: 0x80, // Conversion
      OS_NOEFFECT: 0x00, // Write: Bit = 0 No effect
      OS_SINGLE: 0x80, // Write: Bit = 1 Begin a conversion (default)
      OS_BUSY: 0x00, // Read: Bit = 0 Device is not performing a conversion
      OS_NOTBUSY: 0x80, // Read: Bit = 1 Device is busy performing a conversion

      MODE_MASK: 0x10, // Device operating mode
      MODE_CONTIN: 0x00, // Continuous conversion mode (default)
      MODE_SINGLE: 0x10, // Single-conversion mode

      DR_MASK: 0x0c, // Data rate
      DR_128SPS: 0x00, // 128 samples per second
      DR_32SPS: 0x04, // 32 samples per second
      DR_16SPS: 0x08, // 16 samples per second
      DR_8SPS: 0x0c, // 8 samples per second (default)

      PGA_MASK: 0x03, // Programmable gain amplifier configuration
      PGA_1: 0x00, // Gain 1 (default)
      PGA_2: 0x01, // Gain 2
      PGA_4: 0x02, // Gain 4
      PGA_8: 0x03, // Gain 8
    };
    this.os = this.config_regs.OS_SINGLE;
    this.mode = this.config_regs.MODE_CONTIN;
    this.dataRate = this.config_regs.DR_8SPS;
    this.pga = this.config_regs.PGA_1;
    this.minCode = 32768;
    this.updateConfig();
  }

  public wired(obniz: Obniz) {
    this.obniz = obniz;

    if (!this.obniz.isValidIO(this.params.sda) && !this.obniz.isValidIO(this.params.scl) && !this.params.i2c) {
      if (this.obniz.hasExtraInterface("m5stickc_hat")) {
        const hatI2c = this.obniz.getExtraInterface("m5stickc_hat").i2c;
        this.params.sda = hatI2c.sda;
        this.params.scl = hatI2c.scl;
      } else {
        throw new Error("Cannot find m5stickc hat interface. Please set param 'sda'/'scl' or 'i2c'");
      }
    }

    this.obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");

    this.params.mode = "master";
    this.params.clock = 400000;
    this.params.pull = "5v";
    this.i2c = this.obniz.getI2CWithConfig(this.params);
    this.obniz.wait(100);
  }

  public async getVoltageWait() {
    const raw = await this.getWait();
    const voltage = ((raw * 3.3) / this.minCode) * 4;
    return voltage;
  }

  public setRate(dataRate: number) {
    switch (dataRate) {
      case 8:
        this.dataRate = this.config_regs.DR_8SPS;
        this.minCode = 32768;
        break;
      case 16:
        this.dataRate = this.config_regs.DR_16SPS;
        this.minCode = 16384;
        break;
      case 32:
        this.dataRate = this.config_regs.DR_32SPS;
        this.minCode = 8192;
        break;
      case 128:
        this.dataRate = this.config_regs.DR_128SPS;
        this.minCode = 2048;
        break;
      default:
        throw new Error(`argument must be selected from 8, 16, 32, 128.`);
    }
  }

  public setGain(gain: number) {
    switch (gain) {
      case 1:
        this.pga = this.config_regs.PGA_1;
        break;
      case 2:
        this.pga = this.config_regs.PGA_2;
        break;
      case 4:
        this.pga = this.config_regs.PGA_4;
        break;
      case 8:
        this.pga = this.config_regs.PGA_8;
        break;
      default:
        throw new Error(`argument must be selected from 1, 2, 4, 8.`);
    }
  }

  public setMode(mode: string) {
    switch (mode) {
      case "CONTIN":
        this.mode = this.config_regs.MODE_CONTIN;
        break;
      case "SINGLE":
        this.mode = this.config_regs.MODE_SINGLE;
        break;
      default:
        throw new Error(`argument must be selected from "CONTIN" or "SINGLE".`);
    }
  }

  private async getWait() {
    this.updateConfig();
    this.i2c.write(this.address, [this.config]);
    await this.obniz.wait(this.conversionDelay);
    const ret = await this.i2c.readWait(this.address, 2);
    return (ret[0] << 8) | ret[1];
  }

  private updateConfig() {
    this.config = 0x00;
    this.config |= this.os;
    this.config |= this.mode;
    this.config |= this.dataRate;
    this.config |= this.pga;
  }
}
