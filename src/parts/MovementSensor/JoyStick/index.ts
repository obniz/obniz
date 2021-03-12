/**
 * @packageDocumentation
 * @module Parts.JoyStick
 */

import Obniz from "../../../obniz";
import PeripheralAD from "../../../obniz/libs/io_peripherals/ad";
import PeripheralIO from "../../../obniz/libs/io_peripherals/io";

import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";

export interface JoyStickOptions {
  sw: number;
  x: number;
  y: number;
  vcc?: number;
  gnd?: number;
}

export default class JoyStick implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: "JoyStick",
    };
  }

  public keys: string[];
  public requiredKeys: string[];
  public params: any;

  public pins: any;
  public pinname: any;
  public shortName: any;
  public positionX: any;
  public positionY: any;

  public onchangex?: (val: number) => void;
  public onchangey?: (val: number) => void;
  public isPressed: any;
  public onchangesw?: (pressed: boolean) => void;

  protected obniz!: Obniz;

  private io_sig_sw!: PeripheralIO;
  private ad_x!: PeripheralAD;
  private ad_y!: PeripheralAD;

  constructor() {
    this.keys = ["sw", "y", "x", "vcc", "gnd", "i2c"];
    this.requiredKeys = ["sw", "y", "x"];
    this.pins = this.keys || ["sw", "y", "x", "vcc", "gnd"];
    this.pinname = { sw: "sw12" };
    this.shortName = "joyS";
  }

  public wired(obniz: Obniz) {
    this.obniz = obniz;

    obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");

    this.io_sig_sw = obniz.getIO(this.params.sw);
    this.ad_x = obniz.getAD(this.params.x);
    this.ad_y = obniz.getAD(this.params.y);

    this.io_sig_sw.pull("5v");

    this.ad_x.start((value: number) => {
      this.positionX = value / 5.0;
      if (this.onchangex) {
        this.onchangex(this.positionX * 2 - 1);
      }
    });

    this.ad_y.start((value: number) => {
      this.positionY = value / 5.0;
      if (this.onchangey) {
        this.onchangey(this.positionY * 2 - 1);
      }
    });

    this.io_sig_sw.input((value: boolean) => {
      this.isPressed = value === false;
      if (this.onchangesw) {
        this.onchangesw(value === false);
      }
    });
  }

  public async isPressedWait(): Promise<boolean> {
    const ret = await this.io_sig_sw.inputWait();
    return ret === false;
  }

  public async getXWait(): Promise<number> {
    const value = await this.ad_x.getWait();
    this.positionX = value / 5.0;
    return this.positionX * 2 - 1;
  }

  public async getYWait(): Promise<number> {
    const value = await this.ad_y.getWait();
    this.positionY = value / 5.0;
    return this.positionY * 2 - 1;
  }
}
