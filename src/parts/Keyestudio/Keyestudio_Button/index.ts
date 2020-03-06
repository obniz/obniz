/**
 * @packageDocumentation
 * @module Parts.Keyestudio_Button
 */

import Obniz from "../../../obniz";
import PeripheralIO from "../../../obniz/libs/io_peripherals/io";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";

export interface Keyestudio_ButtonOptions {
  signal: number;
  vcc?: number;
  gnd?: number;
}

export default class Keyestudio_Button implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: "Keyestudio_Button",
    };
  }

  public keys: string[];
  public requiredKeys: string[];
  public params: any;

  public isPressed: boolean | null = null;
  public onchange: ((pressed: boolean) => void) | null = null;

  private io_vcc!: PeripheralIO;
  private io_signal!: PeripheralIO;
  private io_supply?: PeripheralIO;

  constructor() {
    this.keys = ["signal", "gnd", "vcc"];
    this.requiredKeys = ["signal"];
  }

  public onChangeForStateWait = (pressed: boolean) => {};

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

    this.io_signal.pull("5v");

    this.io_signal.input((value: boolean) => {
      this.isPressed = value;
      if (this.onchange) {
        this.onchange(value);
      }
      this.onChangeForStateWait(value);
    });
  }

  public async isPressedWait(): Promise<boolean> {
    return await this.io_signal.inputWait();
  }

  public stateWait(isPressed: boolean): Promise<void> {
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
