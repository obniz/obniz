/**
 * @packageDocumentation
 * @module Parts.DHT12
 */
import roundTo from 'round-to';
import {
  ObnizPartsInterface,
  ObnizPartsInfo,
} from '../../../../obniz/ObnizPartsInterface';
import i2cParts, { I2cInfo, I2cPartsAbstractOptions } from '../../../i2cParts';

export type DHT20Options = I2cPartsAbstractOptions;

export default class DHT20 extends i2cParts implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: 'DHT20',
    };
  }

  public i2cinfo: I2cInfo;

  constructor() {
    super();
    this.i2cinfo = {
      address: 0x38,
      clock: 100000,
      voltage: '3v',
      pull: '3v',
    };
  }

  public i2cInfo() {
    return this.i2cinfo;
  }

  public async getAllDataWait(): Promise<{
    humidity: number;
    temperature: number;
  }> {
    this.i2c.write(this.i2cinfo.address, [0xac, 0x33, 0x00]);
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    this.obniz.wait(100).then(() => {});
    const val = await this.i2c.readWait(this.i2cinfo.address, 6);

    const state = val[0];
    const flg = state & 0x80;

    // 連続20bit
    const humidityData =
      (val[1] << 12) | (val[2] << 4) | ((val[3] & 0x0f) >> 4);
    const humidity = roundTo(humidityData / 10485.76, 2);

    // その後20bit
    const temperatureData = ((val[3] & 0x0f) << 16) | (val[4] << 8) | val[5];
    const temperature = roundTo(temperatureData / 5242.88 - 50, 2);

    return {
      humidity,
      temperature,
    };
  }

  public async getTemperatureWait(): Promise<number> {
    return ((await this.getAllDataWait()) as any).temperature;
  }

  public async getHumidityWait(): Promise<number> {
    return ((await this.getAllDataWait()) as any).humidity;
  }
}
