import i2cParts from "../../../i2cParts";

import Obniz from "../../../../obniz";
import ObnizPartsInterface, {ObnizPartsInfo} from "../../../../obniz/ObnizPartsInterface";

export interface DHT12Options { }
class DHT12 extends i2cParts implements ObnizPartsInterface {

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

  public async getAllDataWait() {
    const data: any = await this.readWait(0x00, 5);
    const humidity: any = data[0] + data[1] * 0.1;
    let temperature: any = data[2] + (data[3] & 0x7f) * 0.1;
    if (data[3] & 0x80) {
      temperature *= -1;
    }

    const checksum: any = data[0] + data[1] + data[2] + data[3];
    if (checksum !== data[4]) {
      return null;
    }

    return {
      humidity,
      temperature,
    };
  }

  public async getTempWait() {
    return (await this.getAllDataWait() as any).temperature;
  }

  public async getHumdWait() {
    return (await this.getAllDataWait() as any).humidity;
  }
}

export default DHT12;
