/**
 * @packageDocumentation
 * @module Parts.Grove_SHT35Sensor
 */

import Obniz from "../../../obniz";
import PeripheralGrove from "../../../obniz/libs/io_peripherals/grove";
import PeripheralI2C from "../../../obniz/libs/io_peripherals/i2c";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";

export interface Grove_SHT35SensorOptionsA {
  gnd?: number;
  vcc?: number;
  sda: number;
  scl: number;
}

interface Grove_SHT35SensorOptionsB {
  grove: PeripheralGrove;
}

export type Grove_SHT35SensorOptions = Grove_SHT35SensorOptionsA | Grove_SHT35SensorOptionsB;

export default class Grove_SHT35Sensor implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: "Grove_SHT35Sensor",
    };
  }

  public keys: string[];
  public requiredKeys: string[];
  public ioKeys: string[];
  public displayName: any;
  public displayIoNames: any;

  public params: any;

  protected obniz!: Obniz;

  private vcc?: number;
  private gnd?: number;
  private i2c!: PeripheralI2C;

  private SHT35_IIC_ADDR: number = 0x45;
  private CMD_SOFT_RST: number = 0x30a2;
  private HIGH_REP_WITH_STRCH: number = 0x2c06;

  private NO_ERROR: number = 0;
  private ERROR_PARAM: number = -1;
  private ERROR_COMM: number = -2;
  private ERROR_OTHERS: number = -128;

  private launched: boolean = false;

  constructor() {
    this.keys = ["gnd", "vcc", "sda", "scl", "grove"];
    this.requiredKeys = [];
    this.ioKeys = this.keys;
    this.displayName = "GroveSHT35";
    this.displayIoNames = { sda: "sda", scl: "scl" };
  }

  public wired(obniz: Obniz) {
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

    this.sendCommandWait(this.CMD_SOFT_RST)
      .then(() => {
        return this.obniz.wait(100);
      })
      .then(() => {
        this.launched = true;
      });
  }

  public async readMeasDataSingleShotWait(cfg_cmd: any) {
    let temp_hex: number = 0;
    let hum_hex: number = 0;
    let temp: number = 0;
    let hum: number = 0;

    if (this.launched) {
      await this.sendCommandWait(cfg_cmd);

      const data = await this.i2c.readWait(this.SHT35_IIC_ADDR, 6);

      temp_hex = (data[0] << 8) | data[1];
      hum_hex = (data[3] << 8) | data[4];
      temp = (temp_hex / 65535.0) * 175 - 45;
      hum = (hum_hex / 65535.0) * 100.0;
    }

    const ret = {
      temperature: temp,
      humidity: hum,
    };

    return ret;
  }

  public async sendCommandWait(cmd: any) {
    const ret = 0;

    const val1 = (cmd >> 8) & 0xff;
    const val2 = cmd & 0xff;
    this.i2c.write(this.SHT35_IIC_ADDR, [val1, val2]);
  }

  public async getAllWait(): Promise<{
    temperature: number;
    humidity: number;
  }> {
    const ret = await this.readMeasDataSingleShotWait(this.HIGH_REP_WITH_STRCH);
    return ret;
  }
}
