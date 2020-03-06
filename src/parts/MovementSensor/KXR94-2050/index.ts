/**
 * @packageDocumentation
 * @module Parts.KXR94-2050
 */

import Obniz from "../../../obniz";
import PeripheralAD from "../../../obniz/libs/io_peripherals/ad";

import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";

export interface KXR94_2050Options {
  x: number;
  y: number;
  z: number;
  vcc?: number;
  gnd?: number;
  enable?: number;
  self_test?: number;
}

export default class KXR94_2050 implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: "KXR94-2050",
    };
  }

  public keys: string[];
  public requiredKeys: string[];
  public params: any;

  public sensitivity: any;
  public offsetVoltage: any;
  public onChange?: (value: { x: number; y: number; z: number }) => void;
  public onChangeX?: (x: number) => void;
  public onChangeY?: (y: number) => void;
  public onChangeZ?: (z: number) => void;

  protected obniz!: Obniz;

  private ad_x!: PeripheralAD;
  private ad_y!: PeripheralAD;
  private ad_z!: PeripheralAD;
  private _x_val: any;
  private _y_val: any;
  private _z_val: any;

  constructor() {
    this.keys = ["x", "y", "z", "vcc", "gnd", "enable", "self_test"];
    this.requiredKeys = ["x", "y", "z"];
  }

  public wired(obniz: Obniz) {
    this.obniz = obniz;

    obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");

    this.ad_x = obniz.getAD(this.params.x);
    this.ad_y = obniz.getAD(this.params.y);
    this.ad_z = obniz.getAD(this.params.z);

    if (obniz.isValidIO(this.params.enable)) {
      obniz.getIO(this.params.enable).drive("5v");
      obniz.getIO(this.params.enable).output(true);
    }
    if (obniz.isValidIO(this.params.self_test)) {
      obniz.getIO(this.params.self_test).drive("5v");
      obniz.getIO(this.params.self_test).output(false);
    }

    this.changeVccVoltage(5);

    this.ad_x.start((value: any) => {
      this._x_val = value;
      if (this.onChangeX) {
        this.onChangeX(this.voltage2gravity(value));
      }
      if (this.onChange) {
        this.onChange(this._get());
      }
    });

    this.ad_y.start((value: any) => {
      this._y_val = value;
      if (this.onChangeY) {
        this.onChangeY(this.voltage2gravity(value));
      }
      if (this.onChange) {
        this.onChange(this._get());
      }
    });

    this.ad_z.start((value: any) => {
      this._z_val = value;
      if (this.onChangeZ) {
        this.onChangeZ(this.voltage2gravity(value));
      }
      if (this.onChange) {
        this.onChange(this._get());
      }
    });

    if (this.obniz.isValidIO(this.params.vcc)) {
      this.obniz.getAD(this.params.vcc).start((value: any) => {
        this.changeVccVoltage(value);
      });
    }
  }

  public changeVccVoltage(pwrVoltage: number) {
    this.sensitivity = pwrVoltage / 5; // Set sensitivity (unit:V)
    this.offsetVoltage = pwrVoltage / 2; // Set offset voltage (Output voltage at 0g, unit:V)
  }

  public voltage2gravity(volt: number) {
    return (volt - this.offsetVoltage) / this.sensitivity;
  }

  public get() {
    return this._get();
  }

  public _get() {
    return {
      x: this.voltage2gravity(this._x_val),
      y: this.voltage2gravity(this._y_val),
      z: this.voltage2gravity(this._z_val),
    };
  }

  public async getWait() {
    this._x_val = await this.ad_x.getWait();
    this._y_val = await this.ad_y.getWait();
    this._z_val = await this.ad_z.getWait();

    return this._get();
  }
}
