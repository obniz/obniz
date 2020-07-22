/**
 * @packageDocumentation
 * @module Parts.CCS811
 */

import Obniz from "../../../obniz";
import { PullType } from "../../../obniz/libs/io_peripherals/common";
import PeripheralIO from "../../../obniz/libs/io_peripherals/io";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";
import i2cParts, { I2cInfo, I2cPartsAbstractOptions } from "../../i2cParts";

export interface CCS811Options extends I2cPartsAbstractOptions {
  pull?: PullType;
  nwak?: number;
  nrst?: number;
  nint?: number;
  add?: number;
  address?: number;
}

export default class CCS811 extends i2cParts implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: "CCS811",
      // datasheet: "",
    };
  }
  public i2cinfo: I2cInfo;
  public keys: string[];
  public requiredKeys: string[];
  public ioKeys?: string[] | undefined;
  public params: any;
  public commands: any;
  public io_add?: PeripheralIO;
  public io_nwak?: PeripheralIO;
  public io_nrst?: PeripheralIO;

  constructor() {
    super();
    this.i2cinfo = {
      address: 0x5b,
      clock: 100000,
      voltage: "3v",
      pull: "3v",
    };
    this.requiredKeys = [];
    this.keys = ["vcc", "gnd", "scl", "sda", "nwak", "nrst", "nint", "i2c", "add", "address"];
    this.ioKeys = ["vcc", "gnd", "scl", "sda", "nwak", "nrst", "nint", "add"];

    this.commands = {};
    this.commands.addresses = {
      CCS811_STATUS: 0x00,
      CCS811_MEAS_MODE: 0x01,
      CCS811_ALG_RESULT_DATA: 0x02,
      CCS811_RAW_DATA: 0x03,
      CCS811_ENV_DATA: 0x05,
      CCS811_NTC: 0x06,
      CCS811_THRESHOLDS: 0x10,
      CCS811_BASELINE: 0x11,
      CCS811_HW_ID: 0x20,
      CCS811_HW_VERSION: 0x21,
      CCS811_FW_BOOT_VERSION: 0x23,
      CCS811_FW_APP_VERSION: 0x24,
      CCS811_ERROR_ID: 0xe0,
      CCS811_APP_START: 0xf4,
      CCS811_SW_RESET: 0xff,
    };
  }

  public i2cInfo() {
    return this.i2cinfo;
  }

  public wired(obniz: Obniz): void {
    this.obniz = obniz;

    this.obniz.setVccGnd(this.params.vcc, null, "3v");
    this.obniz.setVccGnd(null, this.params.gnd, "5v");
    this.obniz.wait(10);

    this.address = 0x5b;
    if (this.params.address === 0x5b) {
      this.address = 0x5b;
    } else if (this.params.address === 0x5a) {
      this.address = 0x5a;
    } else if (this.params.address !== undefined) {
      throw new Error("address must be 0x5a or 0x5b");
    }

    if (obniz.isValidIO(this.params.add)) {
      this.io_add = obniz.getIO(this.params.add);
      this.io_add.drive("3v");
      this.io_add.output(this.address === 0x5a ? false : true);
    }

    if (this.params.i2c !== undefined) {
      this.i2c = this.params.i2c;
    } else {
      this.params.clock = this.params.clock || 100 * 1000;
      this.params.mode = "master";
      this.params.pull = "3v";
      this.i2c = obniz.getI2CWithConfig(this.params);
    }

    this.obniz.wait(10);
  }

  public async configWait() {
    // restart
    const readCheck = await this.readWait(this.commands.addresses.CCS811_HW_ID, 1);
    if (readCheck[0] !== 0x81) {
      console.log("readCheck error " + readCheck);
    }
    await this.obniz.wait(10);
    console.log("restarted");

    // reset
    this.write(this.commands.addresses.CCS811_SW_RESET, [0x11, 0xe5, 0x72, 0x8a]);
    await this.obniz.wait(10);
    console.log("reset");

    // checkForStatusError
    const status = await this.readWait(this.commands.addresses.CCS811_STATUS, 1);
    console.log("Status: " + status);

    this.start();
    await this.setDriveModeWait(1); // Read every second
    await this.obniz.wait(10);
    console.log("config done");
  }

  public start() {
    this.write(this.commands.addresses.CCS811_APP_START, []);
  }

  // Mode 0 = Idle
  // Mode 1 = read every 1s
  // Mode 2 = every 10s
  // Mode 3 = every 60s
  // Mode 4 = RAW mode
  public async setDriveModeWait(mode: number) {
    if (mode > 4) {
      mode = 4;
    } // sanitize input
    let value: number = await this.getMeasModeWait();
    value &= ~(0b00000111 << 4); // Clear DRIVE_MODE bits
    value |= mode << 4; // Mask in mode
    this.write(this.commands.addresses.CCS811_MEAS_MODE, value);
  }

  public async getMeasModeWait(): Promise<number> {
    const meas_mode = await this.readWait(this.commands.addresses.CCS811_MEAS_MODE, 1); // Read what's currently there
    return meas_mode[0];
  }
  public async getDriveModeWait(): Promise<number> {
    const meas_mode: number = await this.getMeasModeWait();
    let drive_mode = meas_mode >>> 4;
    if (drive_mode > 8) {
      drive_mode -= 8;
    }
    return drive_mode;
  }

  public async setEnvironmentalDataWait(relativeHumidity: number, temperature: number): Promise<void> {
    // Check for invalid temperatures
    if (temperature < -25 || temperature > 50) {
      console.log("temperature is out of range");
    }
    // Check for invalid humidity
    if (relativeHumidity < 0 || relativeHumidity > 100) {
      console.log("humidity is out of range");
    }

    const rH = relativeHumidity * 1000; // 42.348 becomes 42348
    let temp = temperature * 1000; // 23.2 becomes 23200
    const envData = [];
    envData[0] = Math.round((rH + 250) / 500);
    envData[1] = 0; // CCS811 only supports increments of 0.5 so bits 7-0 will always be zero
    temp += 25000; // Add the 25C offset
    envData[2] = Math.round((temp + 250) / 500);
    envData[3] = 0;
    // console.log("envData: ", envData);
    this.write(this.commands.addresses.CCS811_ENV_DATA, envData);
  }

  // Checks to see if DATA_READ flag is set in the status register
  public async checkAvailableDataWait(): Promise<boolean> {
    const value = (await this.readWait(this.commands.addresses.CCS811_STATUS, 1))[0];
    return Boolean(value & (1 << 3));
  }

  public async readAlgorithmResultsWait(): Promise<{ eCO2: number; TVOC: number }> {
    const data = await this.readWait(this.commands.addresses.CCS811_ALG_RESULT_DATA, 8);
    // Data ordered:
    // co2MSB, co2LSB, tvocMSB, tvocLSB
    const eCO2 = (data[0] << 8) | data[1];
    const TVOC = (data[2] << 8) | data[3];
    return { eCO2, TVOC };
  }

  public async geteCO2Wait(): Promise<number> {
    return (await this.readAlgorithmResultsWait()).eCO2;
  }
  public async getTVOCWait(): Promise<number> {
    return (await this.readAlgorithmResultsWait()).TVOC;
  }

  public wake(): void {
    this.io_nwak = this.obniz.getIO(this.params.nwak);
    this.io_nwak.drive("3v");
    this.io_nwak.output(false);
  }

  public sleep(): void {
    this.io_nwak = this.obniz.getIO(this.params.nwak);
    this.io_nwak.drive("3v");
    this.io_nwak.output(true);
  }

  public async hwResetWait(): Promise<void> {
    this.io_nrst = this.obniz.getIO(this.params.nrst);
    this.io_nrst.drive("3v");
    this.io_nrst.output(false);
    await this.obniz.wait(10);
    this.io_nrst.output(true);
  }
}
