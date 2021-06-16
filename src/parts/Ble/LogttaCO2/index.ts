/**
 * @packageDocumentation
 * @module Parts.Logtta_CO2
 */

// eslint-disable-next-line max-classes-per-file
import BleRemotePeripheral from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import {
  ObnizBleBeaconStruct,
  ObnizPartsBle,
  ObnizPartsBleCompareWithMode,
  ObnizPartsBleMode,
  PartsType,
  uint16BE,
} from '../../../obniz/ObnizPartsBleInterface';
import BleBatteryService from '../utils/services/batteryService';
import BleGenericAccess from '../utils/services/genericAccess';

export interface Logtta_CO2Options {}

export interface Logtta_CO2_Adv_Data {
  co2: number;
  battery: number;
  interval: number;
  // address: string;
}

export default class Logtta_CO2 extends ObnizPartsBle<Logtta_CO2_Adv_Data> {
  public static readonly PartsName: PartsType = 'Logtta_CO2';

  public static readonly AvailableBleMode: ObnizPartsBleMode[] = [
    'Connectable',
    'Beacon',
  ];

  protected static readonly LocalName = {
    Connectable: /CO2 Sensor/,
    Beacon: /null/,
  };

  protected static readonly CompanyID = {
    Connectable: null,
    Beacon: [0x10, 0x05],
  };

  public static readonly BeaconDataStruct: ObnizPartsBleCompareWithMode<ObnizBleBeaconStruct<Logtta_CO2_Adv_Data> | null> = {
    Connectable: null,
    Beacon: {
      appearance: {
        index: 0,
        type: 'check',
        data: 0x02,
      },
      co2: {
        index: 1,
        length: 2,
        type: 'unsignedNumBE',
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
    },
  };

  protected static = Logtta_CO2 as typeof ObnizPartsBle;

  /**
   * not used
   *
   * @returns name
   */
  protected getName(): string {
    const data = this.peripheral.adv_data.slice(
      16,
      this.peripheral.adv_data.slice(16).indexOf(0) + 16
    );
    return data.map((d) => String.fromCharCode(d)).join('');
  }

  protected static getUuid(uuid: string): string {
    return `31f3${uuid}-bd1c-46b1-91e4-f57abcf7d449`;
  }

  public onNotify?: (co2: number) => void;
  public genericAccess?: BleGenericAccess;
  public batteryService?: BleBatteryService;

  public async connectWait(): Promise<void> {
    if (!this.peripheral.connected) {
      await this.peripheral.connectWait();
    }

    const service1800 = this.peripheral.getService('1800');
    if (service1800) {
      this.genericAccess = new BleGenericAccess(service1800);
    }
    const service180F = this.peripheral.getService('180F');
    if (service180F) {
      this.batteryService = new BleBatteryService(service180F);
    }
  }

  public async disconnectWait(): Promise<void> {
    if (!this.peripheral.connected) {
      return;
    }
    await this.peripheral.disconnectWait();
  }

  public async getWait(): Promise<number | null> {
    if (!this.peripheral.connected) {
      return null;
    }

    const data = await this.readCharWait(
      Logtta_CO2.getUuid('AB20'),
      Logtta_CO2.getUuid('AB21')
    );
    return data ? uint16BE(data) : null;
  }

  public async startNotifyWait(
    callback: (co2: number) => void
  ): Promise<boolean> {
    if (!this.peripheral.connected) {
      return false;
    }

    // TODO: delete if
    if (callback) this.onNotify = callback;
    return await this.subscribeWait(
      Logtta_CO2.getUuid('AB20'),
      Logtta_CO2.getUuid('AB21'),
      (data: number[]) => {
        if (this.onNotify) {
          this.onNotify(uint16BE(data));
        }
      }
    );
  }

  public async authPinCodeWait(code: string): Promise<boolean> {
    if (!this.peripheral.connected) {
      return false;
    }

    if (code.length !== 4) {
      throw new Error('Invalid length auth code');
    }

    const data: [number] = [0]; // TODO: number[]?
    for (let i = 0; i < code.length; i += 2) {
      data.push(
        (this.checkNumber(code.charAt(i)) << 4) |
          this.checkNumber(code.charAt(i + 1))
      );
    }
    return this.writeCharWait(
      Logtta_CO2.getUuid('AB20'),
      Logtta_CO2.getUuid('AB30'),
      data
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
    if (!this.peripheral.connected) {
      return false;
    }

    return this.writeCharWait(
      Logtta_CO2.getUuid('AB20'),
      Logtta_CO2.getUuid('AB2D'),
      [enable ? 1 : 0]
    );
  }

  protected checkNumber(data: string): number {
    if (data >= '0' && data <= '9') {
      return parseInt(data, 10);
    } else {
      throw new Error(
        `authorization code can only be entered from 0-9.input word : ${data}`
      );
    }
  }

  /**
   * @deprecated
   */
  public static getData(
    peripheral: BleRemotePeripheral
  ): Logtta_CO2_Adv_Data | null {
    if (this.getDeviceMode(peripheral) !== 'Beacon') {
      return null;
    }
    const dev = new this(peripheral, 'Beacon');
    return dev.getData();
  }
}
