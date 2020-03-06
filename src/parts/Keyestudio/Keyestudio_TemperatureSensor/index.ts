/**
 * @packageDocumentation
 * @module Parts.Keyestudio_TemperatureSensor
 */
import Obniz from "../../../obniz";
import PeripheralAD from "../../../obniz/libs/io_peripherals/ad";

import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";

export interface Keyestudio_TemperatureSensorOptions {
  vcc?: number;
  signal: number;
  gnd?: number;
}

export default class Keyestudio_TemperatureSensor implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: "Keyestudio_TemperatureSensor",
    };
  }

  public keys: string[];
  public requiredKeys: string[];
  public drive: any;
  public params: any;

  protected obniz!: Obniz;
  protected ad!: PeripheralAD;

  private temp = 0;

  constructor() {
    this.keys = ["vcc", "gnd", "signal"];
    this.requiredKeys = ["signal"];
    this.drive = "5v";
  }

  public wired(obniz: Obniz) {
    this.obniz = obniz;
    obniz.setVccGnd(this.params.vcc, this.params.gnd, this.drive);
    this.ad = obniz.getAD(this.params.signal);

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

  protected calc(voltage: any) {
    return voltage * 100; // Temp(Celsius) = [AD Voltage] * 100l;
  }
}
