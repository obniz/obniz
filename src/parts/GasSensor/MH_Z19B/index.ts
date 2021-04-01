/**
 * @packageDocumentation
 * @module Parts.MH_Z19B
 */

import Obniz from "../../../obniz";
import PeripheralIO from "../../../obniz/libs/io_peripherals/io";
import PeripheralUART from "../../../obniz/libs/io_peripherals/uart";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";

export interface MH_Z19BOptions {
  vcc?: number;
  gnd?: number;
  sensor_tx: number;
  sensor_rx: number;
}

export default class MH_Z19B implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: "MH_Z19B",
    };
  }

  public keys: string[];
  public requiredKeys: string[];
  public ioKeys: string[];
  public displayName: any;
  public displayIoNames: any;

  public params: any;
  public vcc!: number;
  public gnd!: number;
  public my_tx: any;
  public my_rx: any;

  protected obniz!: Obniz;

  private rxbuf: any;
  private modes: { [index: string]: number };
  private rangeType: { [index: number]: number[] };
  private uart!: PeripheralUART;

  constructor() {
    this.keys = ["vcc", "gnd", "sensor_tx", "sensor_rx"];
    this.requiredKeys = ["sensor_tx", "sensor_rx"];

    this.ioKeys = this.keys;
    this.displayName = "co2";
    this.displayIoNames = { sensor_tx: "sensorTx", rx: "sensorRx" };

    this.rxbuf = Buffer.alloc(9);

    this.modes = {
      Read: 0x86,
      CalibZ: 0x87,
      CalibS: 0x88,
      ACBOnOff: 0x79,
      RangeSet: 0x99,
    };

    this.rangeType = {
      2000: [0x00, 0x00, 0x00, 0x07, 0xd0],
      5000: [0x00, 0x00, 0x00, 0x13, 0x88],
      10000: [0x00, 0x00, 0x00, 0x27, 0x10],
    };
  }

  public wired(obniz: Obniz) {
    this.obniz = obniz;

    this.vcc = this.params.vcc;
    this.gnd = this.params.gnd;
    this.my_tx = this.params.sensor_rx;
    this.my_rx = this.params.sensor_tx;

    this.obniz.setVccGnd(this.vcc, this.gnd, "5v");
    this.uart = obniz.getFreeUart();
    this.uart.start({
      tx: this.my_tx,
      rx: this.my_rx,
      baud: 9600,
    });
  }

  public heatWait(seconds?: number): Promise<void> {
    if (typeof seconds === "number" && seconds > 0) {
      seconds *= 1000;
    } else {
      seconds = 3 * 60 * 1000;
    }
    return new Promise((resolve: any) => {
      setTimeout(resolve, seconds);
    });
  }

  public getWait(): Promise<number> {
    return new Promise(async (resolve, reject) => {
      try {
        await this.requestReadConcentraiton();
        await this.obniz.wait(10);
        if (this.uart.isDataExists()) {
          const data: number[] = this.uart.readBytes();
          // console.log("received data");
          // console.log(data);

          const val: number = await this.getCO2Concentration(data);
          resolve(val);
        } else {
          reject(undefined);
          console.log("cannot receive data");
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  public calibrateZero() {
    let command: Buffer | number[];
    command = this.makeRequestCmd("CalibZ", [0x00, 0x00, 0x00, 0x00, 0x00]);
    this.uart.send(command);
    console.log("send a Zero Calibration command");
  }

  public calibrateSpan(ppm: number = 2000) {
    if (ppm < 1000) {
      return;
    }

    let command: Buffer | number[];
    const span_byte: Buffer = Buffer.alloc(2);
    span_byte[0] = ppm / 256;
    span_byte[1] = ppm % 256;
    command = this.makeRequestCmd("CalibS", [span_byte[0], span_byte[1], 0x00, 0x00, 0x00]);
    this.uart.send(command);
    console.log("send a Span Calibration command");
  }

  public setAutoCalibration(autoCalibration: boolean = true) {
    let command: Buffer | number[];
    if (autoCalibration) {
      command = this.makeRequestCmd("ACBOnOff", [0xa0, 0x00, 0x00, 0x00, 0x00]);
      console.log("set an Auto Calibration ON");
    } else {
      command = this.makeRequestCmd("ACBOnOff", [0x00, 0x00, 0x00, 0x00, 0x00]);
      console.log("set an Auto Calibration OFF");
    }
    this.uart.send(command);
  }

  public setDetectionRange(range: number) {
    let command: Buffer | number[];
    if (range in this.rangeType) {
      command = this.makeRequestCmd("RangeSet", this.rangeType[range]);
      console.log("Configured Range : " + String(range));
    } else {
      console.log("invalid range value");
      command = this.makeRequestCmd("RangeSet", this.rangeType[5000]);
    }
    this.uart.send(command);
  }

  private checkSum(res8: Buffer): number {
    let sum: number = 0;
    for (let i = 1; i < 8; i++) {
      sum += res8[i];
    }
    sum = 255 - (sum % 256) + 1;
    return sum;
  }

  private makeRequestCmd(mode: string, databox: number[] = [0x00, 0x00, 0x00, 0x00, 0x00]): Buffer | number[] {
    const _buffer: Buffer = Buffer.alloc(9);
    _buffer[0] = 0xff;
    _buffer[1] = 0x01;
    _buffer[2] = this.modes[mode];
    for (let i = 3; i < 8; i++) {
      _buffer[i] = databox[i - 3];
    }
    _buffer[8] = this.checkSum(_buffer);
    return Array.from(_buffer);
  }

  private requestReadConcentraiton() {
    let command: Buffer | number[];
    command = this.makeRequestCmd("Read", [0x00, 0x00, 0x00, 0x00, 0x00]);
    // console.log("being sent request command");
    // console.log(command);
    this.uart.send(command);
  }

  private getCO2Concentration(data: number[]): number {
    let co2Concentration: number = 0;
    const status: boolean = this.checkResponseData(data);
    if (status) {
      co2Concentration = this.rxbuf[2] * 256 + this.rxbuf[3];
    } else {
      console.log("checksum error");
    }
    this.rxbuf = [];
    return co2Concentration;
  }

  private checkResponseData(data: number[]): boolean {
    let cs_result = false;
    if (data.length === 9) {
      for (let i = 0; i < data.length; i++) {
        this.rxbuf[i] = data[i];
      }
      if (this.checkSum(this.rxbuf) === this.rxbuf[8]) {
        cs_result = true;
      } else {
        cs_result = false;
      }
    }
    data = [];
    return cs_result;
  }
}
