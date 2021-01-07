/**
 * @packageDocumentation
 * @module Parts.Grove_WaterLevelSensor
 */

import Obniz from "../../../obniz";
import PeripheralGrove from "../../../obniz/libs/io_peripherals/grove";
import PeripheralI2C from "../../../obniz/libs/io_peripherals/i2c";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";

export interface Grove_WaterLevelSensorOptionsA {
  gnd?: number;
  vcc?: number;
  sda: number;
  scl: number;
}

interface Grove_WaterLevelSensorOptionsB {
  grove: PeripheralGrove;
}

export type Grove_WaterLevelSensorOptions = Grove_WaterLevelSensorOptionsA | Grove_WaterLevelSensorOptionsB;

export default class Grove_WaterLevelSensor implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: "Grove_WaterLevelSensor",
    };
  }

  public keys: string[];
  public requiredKeys: string[];
  public ioKeys: string[];
  public displayName: any;
  public displayIoNames: any;

  public params: any;
  public check_interval_ms: number;

  public onchange: ((val: number) => void) | null = null;

  protected obniz!: Obniz;

  private vcc?: number;
  private gnd?: number;
  private i2c!: PeripheralI2C;

  private THRESHOLD: number;
  private ATTINY1_HIGH_ADDR: number;
  private ATTINY2_LOW_ADDR: number;

  private previous_val: number;

  constructor() {
    this.keys = ["gnd", "vcc", "sda", "scl", "grove"];
    this.requiredKeys = [];
    this.ioKeys = this.keys;
    this.displayName = "WaterLevel";
    this.displayIoNames = { sda: "sda", scl: "scl" };

    this.THRESHOLD = 100;
    this.ATTINY1_HIGH_ADDR = 0x78;
    this.ATTINY2_LOW_ADDR = 0x77;
    this.check_interval_ms = 1000;
    this.previous_val = 0;
  }

  public async wired(obniz: Obniz) {
    // Grove_3AxisAccelerometer の I2C 参考
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
    while (true) {
      const current_val: number = await this.getWait();
      if (current_val !== this.previous_val) {
        if (this.onchange) {
          this.onchange(current_val);
        }
        this.previous_val = current_val;
      }
      this.obniz.wait(this.check_interval_ms);
    }
  }

  // Grove_JoyStick 参考
  public async getWait(): Promise<number> {
    let water_level_mm: number;
    const water_level_step: number = 5; // 5 mm step

    const high_data: any[] = await this.i2c.readWait(this.ATTINY1_HIGH_ADDR, 12);
    const low_data: any[] = await this.i2c.readWait(this.ATTINY2_LOW_ADDR, 8);

    let i: number;
    let touch_val: number = 0;
    for (i = 0; i < 8; i++) {
      if (low_data[i] > this.THRESHOLD) {
        touch_val |= 1 << i;
      }
    }
    for (i = 0; i < 12; i++) {
      if (high_data[i] > this.THRESHOLD) {
        touch_val |= 1 << (8 + i);
      }
    }

    let trig_section: number = 0;
    while (touch_val & 0x01) {
      trig_section++;
      touch_val >>= 1;
    }

    water_level_mm = trig_section * water_level_step;

    return water_level_mm;
  }
}
