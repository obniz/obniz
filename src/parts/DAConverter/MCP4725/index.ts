/**
 * @packageDocumentation
 * @module Parts.MCP4725
 */

import Obniz from "../../../obniz";
import PeripheralI2C from "../../../obniz/libs/io_peripherals/i2c";

import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";
import { I2cPartsAbstractOptions } from "../../i2cParts";

export interface MCP4725Options extends I2cPartsAbstractOptions {}

export default class MCP4725 implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: "MCP4725",
    };
  }

  public keys: string[];
  public requiredKeys: string[];
  public params: any;

  public address: number;
  public cmd = {
    WRITEDAC: 0x40, // Writes data to the DAC
    WRITEDACEEPROM: 0x60, // Writes data to the DAC and the EEPROM (persisting the assigned value after reset)
  };

  protected obniz!: Obniz;
  protected i2c!: PeripheralI2C;

  private _vcc_voltage = 5.0;

  constructor() {
    this.keys = ["vcc", "gnd", "sda", "scl", "i2c"];
    this.requiredKeys = [];
    this.address = 0x60;
  }

  public wired(obniz: Obniz) {
    this.obniz = obniz;
    this.obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
    this.params.clock = 400000;
    this.params.pull = "5v";
    this.params.mode = "master";
    this.i2c = this.obniz.getI2CWithConfig(this.params);
    this.obniz.wait(100);
  }

  public setVCCVoltage(voltage: number) {
    this._vcc_voltage = voltage;
  }

  public setVoltage(voltage: number, writeEEPROM = false) {
    if (voltage > this._vcc_voltage) {
      voltage = this._vcc_voltage;
    } else if (voltage < 0) {
      voltage = 0;
    }
    const mv = Math.round((voltage / this._vcc_voltage) * (4096 - 1));
    const hbits = mv >> 4;
    const lbits = (mv & 0x0f) << 4;
    if (writeEEPROM) {
      this.i2c.write(this.address, [this.cmd.WRITEDACEEPROM, hbits, lbits]);
    } else {
      this.i2c.write(this.address, [this.cmd.WRITEDAC, hbits, lbits]);
    }
  }
}
