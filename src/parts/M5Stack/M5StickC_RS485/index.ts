/**
 * @packageDocumentation
 * @module Parts.M5StackC_RS485
 */

import Obniz from "../../../obniz";
import PeripheralUART from "../../../obniz/libs/io_peripherals/uart";

import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";

export interface M5StickC_RS485Options {
  tx: number;
  rx: number;
  gnd?: number;
  vcc?: number;
  baud?: number;
}

export default class M5StickC_RS485 implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: "M5StickC_RS485",
    };
  }

  public keys: string[];
  public requiredKeys: string[];
  public params: any;

  public onreceive?: (data: any, text: string) => void;

  protected obniz!: Obniz;

  private uart!: PeripheralUART;

  constructor() {
    this.keys = ["tx", "rx", "gnd", "vcc", "baud"];
    this.requiredKeys = ["tx", "rx"];
  }

  public wired(obniz: Obniz) {
    if (obniz.isValidIO(this.params.gnd)) {
      obniz.getIO(this.params.gnd).output(false);
    }

    if (obniz.isValidIO(this.params.vcc)) {
      obniz.getIO(this.params.vcc).output(true);
    }

    this.params.baud = this.params.baud || 9600;

    if (!this.obniz.isValidIO(this.params.tx) && !this.obniz.isValidIO(this.params.rx)) {
      if (this.obniz.hasExtraInterface("m5stickc_hat")) {
        const uart = this.obniz.getExtraInterface("m5stickc_hat").uart;
        this.params.tx = uart.tx;
        this.params.rx = uart.rx;
      } else {
        throw new Error("Cannot find m5stickc hat interface. Please set param 'tx'/'rx'");
      }
    }

    this.uart = obniz.getFreeUart();

    this.uart.start({
      tx: this.params.tx,
      rx: this.params.rx,
      baud: this.params.baud,
    });

    this.uart.onreceive = (data, text) => {
      if (typeof this.onreceive === "function") {
        this.onreceive(data, text);
      }
    };
  }

  public send(data: any) {
    this.uart.send(data);
  }
}
