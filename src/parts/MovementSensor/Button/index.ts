/**
 * @packageDocumentation
 * @module Parts.Button
 */

import Obniz from "../../../obniz";
import PeripheralIO from "../../../obniz/libs/io_peripherals/io";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";

export interface ButtonOptions {
  signal: number;
  gnd?: number;
}

export default class Button implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: "Button",
    };
  }

  public keys: string[];
  public requiredKeys: string[];
  public params: any;

  public onChangeForStateWait: any;
  public isPressed: boolean | null = null;
  public onchange: ((pressed: boolean) => void) | null = null;

  private io_signal!: PeripheralIO;
  private io_supply?: PeripheralIO;

  constructor() {
    this.keys = ["signal", "gnd", "pull"];
    this.requiredKeys = ["signal"];

    this.onChangeForStateWait = () => {};
  }

  public wired(obniz: Obniz) {
    this.io_signal = obniz.getIO(this.params.signal);

    if (obniz.isValidIO(this.params.gnd)) {
      this.io_supply = obniz.getIO(this.params.gnd);
      this.io_supply.output(false);
    }

    // start input
    if (this.params.pull === "3v") {
      this.io_signal.pull("3v");
    } else if (this.params.pull === "0v") {
      this.io_signal.pull("0v");
    } else {
      this.io_signal.pull("5v");
    }

    this.io_signal.input((value: any) => {
      this.isPressed = value === false;
      if (this.onchange) {
        this.onchange(value === false);
      }
      this.onChangeForStateWait(value === false);
    });
  }

  public async isPressedWait() {
    const ret = await this.io_signal.inputWait();
    return ret === false;
  }

  public stateWait(isPressed: boolean) {
    return new Promise((resolve, reject) => {
      this.onChangeForStateWait = (pressed: any) => {
        if (isPressed === pressed) {
          this.onChangeForStateWait = () => {};
          resolve();
        }
      };
    });
  }
}
