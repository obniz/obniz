/**
 * @packageDocumentation
 * @module Parts.Logtta_TH
 */

import {
  ObnizBleBeaconStruct,
  ObnizPartsBleConnectable,
  ObnizPartsBleMode,
  uint,
  uintBE,
} from '../../../obniz/ObnizPartsBleAbstract';

export interface Logtta_THOptions {}

export interface Logtta_TH_Data {
  temperature: number;
  humidity: number;
  battery: number;
  interval: number;
  address: string;
}

export interface Logtta_TH_Connected_Data {
  temperature: number;
  humidity: number;
}

type PinCodeType = 'Authentication' | 'Rewrite';

const PinCodeFlag: { [type in PinCodeType]: number } = {
  Authentication: 0x00,
  Rewrite: 0x01,
};

export default class Logtta_TH extends ObnizPartsBleConnectable<
  Logtta_TH_Data,
  Logtta_TH_Connected_Data
> {
  public static readonly PartsName = 'Logtta_TH';

  public static readonly AvailableBleMode: ObnizPartsBleMode[] = [
    'Connectable',
    'Beacon',
  ];

  public static readonly LocalName = {
    Connectable: /TH Sensor/,
    Beacon: /null/,
  };

  public static readonly BeaconDataLength = 0x1b;

  public static readonly CompanyID = [0x10, 0x05];

  public static readonly BeaconDataStruct: ObnizBleBeaconStruct<Logtta_TH_Data> = {
    appearance: {
      index: 0,
      type: 'check',
      data: 0x01,
    },
    temperature: {
      index: 1,
      length: 2,
      type: 'custom',
      func: (data) => Logtta_TH.parseTemperatureData(data),
    },
    humidity: {
      index: 3,
      length: 2,
      type: 'custom',
      func: (data) => Logtta_TH.parseHumidityData(data),
    },
    battery: {
      index: 5,
      type: 'unsignedNumBE',
    },
    interval: {
      index: 6,
      length: 2,
      type: 'unsignedNumBE',
    },
    /* alert: {
      index: 7,
      type: 'uint8',
    },
    name: {
      index: 8,
      length: 15,
      type: 'string',
    } */
    // TODO: delete
    address: {
      index: 0,
      type: 'custom',
      func: (data, peripheral) => peripheral.address,
    },
  };

  protected static parseTemperatureData(data: number[], func = uint): number {
    return (func(data) / 0x10000) * 175.72 - 46.85;
  }

  protected static parseHumidityData(data: number[], func = uint): number {
    return (func(data) / 0x10000) * 125 - 6;
  }

  protected readonly staticClass = Logtta_TH;

  protected authenticated = false;
  public onNotify?: (data: Logtta_TH_Connected_Data) => void;

  protected async beforeOnDisconnectWait(): Promise<void> {
    this.authenticated = false;
  }

  public async getDataWait(): Promise<Logtta_TH_Connected_Data> {
    this.checkConnected();

    const data = await this.readCharWait(
      this.getUuid('AA20'),
      this.getUuid('AA21')
    );
    return {
      temperature: Logtta_TH.parseTemperatureData(data.slice(0, 2), uintBE),
      humidity: Logtta_TH.parseHumidityData(data.slice(0, 2), uintBE),
    };
  }

  /** @deprecated */
  public async getAllWait(): Promise<Logtta_TH_Connected_Data | null> {
    try {
      return await this.getDataWait();
    } catch {
      return null;
    }
  }

  public async getTemperatureWait(): Promise<number> {
    return (await this.getDataWait()).temperature;
  }

  public async getHumidityWait(): Promise<number> {
    return (await this.getDataWait()).humidity;
  }

  public async startNotifyWait(
    callback: (data: Logtta_TH_Connected_Data) => void
  ): Promise<void> {
    // TODO: delete try-catch
    try {
      this.checkConnected();
    } catch (e) {
      console.error(e);
      return;
    }

    // TODO: delete if
    if (callback) this.onNotify = callback;
    return await this.subscribeWait(
      this.getUuid('AB20'),
      this.getUuid('AB21'),
      (data: number[]) => {
        if (this.onNotify) {
          this.onNotify({
            temperature: Logtta_TH.parseTemperatureData(
              data.slice(0, 2),
              uintBE
            ),
            humidity: Logtta_TH.parseHumidityData(data.slice(0, 2), uintBE),
          });
        }
      }
    );
  }

  public async authPinCodeWait(code: string | number): Promise<boolean> {
    // TODO: delete try-catch
    try {
      this.checkConnected();
    } catch (e) {
      console.error(e);
      return false;
    }
    if (this.authenticated) return true;

    if (typeof code === 'string') code = parseInt(code); // TODO: delete string type
    this.authenticated = await this.sendPinCodeWait('Authentication', code);
    return this.authenticated;
  }

  protected async sendPinCodeWait(
    type: PinCodeType,
    code: number
  ): Promise<boolean> {
    if (code < 0 || code > 9999)
      throw new Error(
        `Authorization code can only be entered from 0000~9999. input: ${code}`
      );

    return await this.writeCharWait(
      this.getUuid('AA20'),
      this.getUuid('AA30'),
      [
        PinCodeFlag[type],
        Math.floor(code / 1000) % 10 | Math.floor(code / 100) % 10,
        Math.floor(code / 10) % 10 | Math.floor(code / 1) % 10,
      ]
    );
  }

  protected checkAuthenticated(): void {
    if (!this.authenticated)
      throw new Error(
        'Certification is required, execute authPinCodeWait() in advance.'
      );
  }

  /**
   * @deprecated
   * @param enable
   */
  public setBeaconMode(enable: boolean): Promise<boolean> {
    return this.setBeaconModeWait(enable);
  }

  public async setBeaconModeWait(enable: boolean): Promise<boolean> {
    // TODO: delete try-catch
    try {
      this.checkConnected();
      this.checkAuthenticated();
    } catch (e) {
      console.error(e);
      return false;
    }

    return this.writeCharWait(this.getUuid('AA20'), this.getUuid('AA2D'), [
      enable ? 1 : 0,
    ]);
  }

  protected getName(): string {
    const array = this.peripheral.adv_data.slice(16);
    return array
      .slice(0, array.indexOf(0) + 1)
      .map((d) => String.fromCharCode(d))
      .join('');
  }

  protected getUuid(uuid: string): string {
    return `f7ee${uuid}-276e-4165-aa69-7e3de7fc627e`;
  }
}
