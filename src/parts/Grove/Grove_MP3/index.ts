/**
 * @packageDocumentation
 * @module Parts.Grove_MP3
 */

import Obniz from "../../../obniz";
import PeripheralGrove from "../../../obniz/libs/io_peripherals/grove";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";

export interface Grove_MP3OptionsA {
  vcc?: number;
  gnd?: number;
  mp3_rx: number;
  mp3_tx: number;
}
interface Grove_MP3OptionsB {
  grove: PeripheralGrove;
}

export type Grove_MP3Options = Grove_MP3OptionsA | Grove_MP3OptionsB;

export default class Grove_MP3 implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: "Grove_MP3",
    };
  }

  public keys: string[];
  public requiredKeys: string[];
  public ioKeys: string[];
  public displayName: any;
  public displayIoNames: any;
  public obniz!: Obniz;
  public params: any;
  public my_tx: any;
  public my_rx: any;
  public uart: any;

  constructor() {
    this.keys = ["vcc", "gnd", "mp3_rx", "mp3_tx", "grove"];
    this.requiredKeys = [];

    this.ioKeys = this.keys;
    this.displayName = "MP3";
    this.displayIoNames = { mp3_rx: "MP3Rx", mp3_tx: "MP3Tx" };
  }

  public wired(obniz: Obniz) {
    this.obniz = obniz;
    if (this.params.grove) {
      this.uart = this.params.grove.getUart(9600, "5v");
    } else {
      obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
      this.my_tx = this.params.mp3_rx;
      this.my_rx = this.params.mp3_tx;
      this.uart = this.obniz.getFreeUart();
      this.uart.start({
        tx: this.my_tx,
        rx: this.my_rx,
        baud: 9600,
      });
    }
  }

  public async initWait(strage?: any): Promise<void> {
    await this.obniz.wait(100);
    this.uartSend(0x0c, 0);
    await this.obniz.wait(500);
    this.uartSend(0x0b, 0);
    await this.obniz.wait(100);

    if (strage) {
      if (strage === "usb") {
        this.uartSend(0x09, 1);
      } else if (strage === "sd") {
        this.uartSend(0x09, 2);
      }
    } else {
      this.uartSend(0x09, 2);
    }
    await this.obniz.wait(200);
  }

  public setVolume(vol: number) {
    if (vol >= 0 && vol <= 31) {
      this.uartSend(0x06, vol);
    }
  }

  public volUp() {
    this.uartSend(0x04, 0);
  }

  public volDown() {
    this.uartSend(0x05, 0);
  }

  public play(track: any, folder?: any) {
    // if (!folder) folder = {};
    if (folder) {
      this.uart.send([0x7e, 0xff, 0x06, 0x0f, 0x00, folder, track, 0xef]);
    } else {
      // Play 'MP3' folder
      this.uartSend(0x12, track);
    }
  }

  public stop() {
    this.uartSend(0x16, 0);
  }

  public pause() {
    this.uartSend(0x0e, 0);
  }

  public resume() {
    this.uartSend(0x0d, 0);
  }

  public next() {
    this.uartSend(0x01, 0);
  }

  public prev() {
    this.uartSend(0x02, 0);
  }

  public uartSend(command: any, param: any) {
    const paramM: any = param >> 8;
    const paramL: any = param & 0xff;
    this.uart.send([0x7e, 0xff, 0x06, command, 0x01, paramM, paramL, 0xef]);
    const response: any = this.uart.readBytes();
    return response;
    // return response;
  }
}
