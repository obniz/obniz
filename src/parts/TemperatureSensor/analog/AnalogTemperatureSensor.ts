/**
 * @packageDocumentation
 * @module Parts.AnalogTemperatureSensor
 */
import Obniz from "../../../obniz";
import PeripheralAD from "../../../obniz/libs/io_peripherals/ad";

import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";

export interface AnalogTemperatureSensorOptions {
  vcc?: number;
  output: number;
  gnd?: number;
}

export default class AnalogTemperatureSensor implements ObnizPartsInterface {
  public keys: string[];
  public requiredKeys: string[];
  public drive: any;
  public params: any;
  public temp = 0;

  protected obniz!: Obniz;
  protected ad!: PeripheralAD;

  constructor() {
    this.keys = ["vcc", "gnd", "output"];
    this.requiredKeys = ["output"];
    this.drive = "5v";
  }

  public wired(obniz: Obniz) {
    this.obniz = obniz;
    obniz.setVccGnd(this.params.vcc, this.params.gnd, this.drive);
    this.ad = obniz.getAD(this.params.output);

    this.ad.start((voltage: any) => {
      this.temp = this.calc(voltage);
      this.onchange(this.temp);
    });
  }

  public async getWait() {
    const voltage: any = await this.ad.getWait();
    this.temp = this.calc(voltage);
    return this.temp;
  }

  public onchange(temp: number) {}

  public calc(voltage: any) {
    return 0;
  }
}
