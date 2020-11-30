/**
 * @packageDocumentation
 * @module Parts.JpegSerialCam
 */

import Obniz from "../../../obniz";
import PeripheralUART from "../../../obniz/libs/io_peripherals/uart";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";

export interface JpegSerialCamOptions {
  vcc?: number;
  cam_tx: number;
  cam_rx: number;
  gnd?: number;
}

export type JpegSerialCamSize = "640x480" | "320x240" | "160x120";

export type JpegSerialCamBaud = 9600 | 19200 | 38400 | 57600 | 115200;

export default class JpegSerialCam implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: "JpegSerialCam",
    };
  }

  public keys: string[];
  public requiredKeys: string[];
  public ioKeys: string[];
  public displayName: string;
  public displayIoNames: any;
  public obniz!: Obniz;
  public params: any;
  public my_tx: any;
  public my_rx: any;
  public uart!: PeripheralUART;

  constructor() {
    this.keys = ["vcc", "cam_tx", "cam_rx", "gnd"];
    this.requiredKeys = ["cam_tx", "cam_rx"];

    this.ioKeys = this.keys;
    this.displayName = "Jcam";
    this.displayIoNames = { cam_tx: "camTx", cam_rx: "camRx" };
  }

  public wired(obniz: Obniz) {
    this.obniz = obniz;
    this.obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
    this.my_tx = this.params.cam_rx;
    this.my_rx = this.params.cam_tx;

    this.obniz.getIO(this.my_tx).drive("3v");

    this.uart = this.obniz.getFreeUart();
  }

  public async _drainUntil(uart: PeripheralUART, search: number[], recv?: number[]) {
    if (!recv) {
      recv = [];
    }
    while (true) {
      const readed = uart.readBytes();
      recv = recv.concat(readed);
      const tail = this._seekTail(search, recv);
      if (tail >= 0) {
        recv.splice(0, tail);
        return recv;
      }
      await this.obniz.wait(10);
    }
  }

  public _seekTail(search: number[], src: number[]) {
    let f = 0;
    for (let i = 0; i < src.length; i++) {
      if (src[i] === search[f]) {
        f++;
        if (f === search.length) {
          return i + 1;
        }
      } else {
        f = 0;
      }
    }
    return -1;
  }

  public arrayToBase64(array: number[]): string {
    return Buffer.from(array).toString("base64");
  }

  public async startWait(obj: any) {
    if (!obj) {
      obj = {};
    }
    this.uart.start({
      tx: this.my_tx,
      rx: this.my_rx,
      baud: obj.baud || 38400,
    });
    this.obniz.display!.setPinName(this.my_tx, "JpegSerialCam", "camRx");
    this.obniz.display!.setPinName(this.my_rx, "JpegSerialCam", "camTx");
    await this.obniz.wait(2500);
  }

  public async resetwait() {
    this.uart.send([0x56, 0x00, 0x26, 0x00]);
    await this._drainUntil(this.uart, [0x76, 0x00, 0x26, 0x00]);
    await this.obniz.wait(2500);
  }

  public async setSizeWait(resolution: JpegSerialCamSize) {
    let val: number;
    if (resolution === "640x480") {
      val = 0x00;
    } else if (resolution === "320x240") {
      val = 0x11;
    } else if (resolution === "160x120") {
      val = 0x22;
    } else {
      throw new Error("unsupported size");
    }
    this.uart.send([0x56, 0x00, 0x31, 0x05, 0x04, 0x01, 0x00, 0x19, val]);
    await this._drainUntil(this.uart, [0x76, 0x00, 0x31, 0x00]);
    await this.resetwait();
  }

  public async setCompressibilityWait(compress: number) {
    const val = Math.floor((compress / 100) * 0xff);
    this.uart.send([0x56, 0x00, 0x31, 0x05, 0x01, 0x01, 0x12, 0x04, val]);
    await this._drainUntil(this.uart, [0x76, 0x00, 0x31, 0x00]);
    await this.resetwait();
  }

  public async setBaudWait(baud: JpegSerialCamBaud) {
    let val: any;
    switch (baud) {
      case 9600:
        val = [0xae, 0xc8];
        break;
      case 19200:
        val = [0x56, 0xe4];
        break;
      case 38400:
        val = [0x2a, 0xf2];
        break;
      case 57600:
        val = [0x1c, 0x4c];
        break;
      case 115200:
        val = [0x0d, 0xa6];
        break;
      default:
        throw new Error("invalid baud rate");
    }
    this.uart.send([0x56, 0x00, 0x31, 0x06, 0x04, 0x02, 0x00, 0x08, val[0], val[1]]);
    await this._drainUntil(this.uart, [0x76, 0x00, 0x31, 0x00]);
    // await this.obniz.wait(1000);
    await this.startWait({
      baud,
    });
  }

  public async takeWait(): Promise<number[]> {
    const uart = this.uart;
    // console.log("stop a photo")
    uart.send([0x56, 0x00, 0x36, 0x01, 0x02]);
    await this._drainUntil(uart, [0x76, 0x00, 0x36, 0x00, 0x00]);

    // console.log("take a photo")
    uart.send([0x56, 0x00, 0x36, 0x01, 0x00]);
    await this._drainUntil(uart, [0x76, 0x00, 0x36, 0x00, 0x00]);

    // console.log("read length")
    uart.send([0x56, 0x00, 0x34, 0x01, 0x00]); // read length of image data
    let recv = await this._drainUntil(uart, [0x76, 0x00, 0x34, 0x00, 0x04, 0x00, 0x00]); // ack
    let XX: any;
    let YY: any;
    while (true) {
      const readed = uart.readBytes();
      // console.log(recv);
      recv = recv.concat(readed);
      if (recv.length >= 2) {
        XX = recv[0];
        YY = recv[1];
        break;
      }
      await this.obniz.wait(1000);
    }
    const databytes = XX * 256 + YY;
    // console.log("image: " + databytes + " Bytes");
    // const high = (databytes >> 8) & 0xff;
    // const low = databytes & 0xff;

    // console.log("start reading image")
    uart.send([0x56, 0x00, 0x32, 0x0c, 0x00, 0x0a, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, XX, YY, 0x00, 0xff]);
    recv = await this._drainUntil(uart, [0x76, 0x00, 0x32, 0x00, 0x00]);
    // console.log("reading...");
    while (true) {
      const readed = uart.readBytes();
      recv = recv.concat(readed);
      // console.log(readed.length);
      if (recv.length >= databytes) {
        break;
      }
      await this.obniz.wait(10);
    }
    // console.log("done");
    recv = recv.splice(0, databytes); // remove tail
    recv = recv.concat([0xff, 0xd9]);
    return recv;
  }
}
