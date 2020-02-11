import i2cParts from "../../../i2cParts";

import {I2cPartsAbstructOptions} from "../../../i2cParts";

import ObnizPartsInterface, {ObnizPartsInfo} from "../../../../obniz/ObnizPartsInterface";

/**
 * @category Parts
 */
export interface  DHT12Options extends I2cPartsAbstructOptions { }

/**
 * @category Parts
 */
export default class DHT12 extends i2cParts implements ObnizPartsInterface {

  public static info(): ObnizPartsInfo {
    return {
      name: "DHT12",
    };
  }

  public i2cInfo() {
    return {
      address: 0x5c,
      clock: 100000,
      voltage: "3v",
    };
  }

  public async getAllDataWait(): Promise<{humidity: number, temperature: number}> {
    const data: any = await this.readWait(0x00, 5);
    const humidity: any = data[0] + data[1] * 0.1;
    let temperature: any = data[2] + (data[3] & 0x7f) * 0.1;
    if (data[3] & 0x80) {
      temperature *= -1;
    }

    const checksum: any = data[0] + data[1] + data[2] + data[3];
    if (checksum !== data[4]) {
      throw new  Error(`checksum does not match`);
    }

    return {
      humidity,
      temperature,
    };
  }

  public async getTempWait(): Promise<number> {
    return (await this.getAllDataWait() as any).temperature;
  }

  public async getHumdWait(): Promise<number> {
    return (await this.getAllDataWait() as any).humidity;
  }
}
