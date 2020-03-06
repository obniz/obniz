/**
 * @packageDocumentation
 * @module Parts.Grove_Button
 */

import Obniz from "../../../obniz";
import PeripheralGrove from "../../../obniz/libs/io_peripherals/grove";
import PeripheralIO from "../../../obniz/libs/io_peripherals/io";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";

interface Grove_ButtonOptionsA {
  signal: number;
  vcc?: number;
  gnd?: number;
}

interface Grove_ButtonOptionsB {
  grove: PeripheralGrove;
}

export type Grove_ButtonOptions = Grove_ButtonOptionsA | Grove_ButtonOptionsB;

export default class Grove_Button implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: "Grove_Button",
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
    this.keys = ["signal", "gnd", "vcc", "grove"];
    this.requiredKeys = [];
  }

  public onChangeForStateWait = (pressed: boolean) => {};

  public wired(obniz: Obniz) {
    if (this.params.grove) {
      const groveIOs = this.params.grove.getDigital("5v");
      this.io_signal = groveIOs.primary;
    } else {
      this.io_signal = obniz.getIO(this.params.signal);
      obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
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
