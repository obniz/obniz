/**
 * @packageDocumentation
 * @module Parts.CT10
 */

import Obniz from "../../../obniz";
import PeripheralIO from "../../../obniz/libs/io_peripherals/io";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";

export interface CT10Options {
  signal: number;
  vcc?: number;
  gnd?: number;
}

export default class CT10 implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: "CT10",
    };
  }

  public keys: string[];
  public requiredKeys: string[];
  public params: any;

  public onChangeForStateWait: any;
  public io_signal!: PeripheralIO;
  public io_vcc?: PeripheralIO;
  public io_supply?: PeripheralIO;
  public isNear: boolean | null = null;
  public onchange: ((near: boolean) => void) | null = null;

  constructor() {
    this.keys = ["signal", "gnd", "vcc"];
    this.requiredKeys = ["signal"];

    this.onChangeForStateWait = () => {};
  }

  public wired(obniz: Obniz) {
    this.io_signal = obniz.getIO(this.params.signal);

    if (obniz.isValidIO(this.params.vcc)) {
      this.io_vcc = obniz.getIO(this.params.vcc);
      this.io_vcc.output(true);
    }

    if (obniz.isValidIO(this.params.gnd)) {
      this.io_supply = obniz.getIO(this.params.gnd);
      this.io_supply.output(false);
    }

    this.io_signal.pull("0v");

    this.io_signal.input((value: boolean) => {
      this.isNear = value;
      if (this.onchange) {
        this.onchange(value);
      }
      this.onChangeForStateWait(value);
    });
  }

  public async isNearWait(): Promise<boolean> {
    return await this.io_signal.inputWait();
  }

  public stateWait(isNear: boolean): Promise<any> {
    return new Promise((resolve) => {
      this.onChangeForStateWait = (near: boolean) => {
        if (isNear === near) {
          this.onChangeForStateWait = () => {};
          resolve();
        }
      };
    });
  }
}
