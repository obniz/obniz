/**
 * @packageDocumentation
 * @module Parts.KankiAirMier
 */

// import {BleRemotePeripheral, ObnizPartsBleInterface, ObnizPartsBleInfo} from 'obniz';

import BleRemotePeripheral from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import ObnizPartsBleInterface, {
  ObnizPartsBleInfo,
} from '../../../obniz/ObnizPartsBleInterface';
import { BleAdvBinaryAnalyzer } from '../utils/advertisement/advertismentAnalyzer';

export interface KankiAirMierOptions {}

export interface KankiAirMier_Data {
  co2: number;
  temperature: number;
  humidity: number;
  sequenceNumber: number;
  deviceName: string;
}

export default class KankiAirMier implements ObnizPartsBleInterface {
  public static info(): ObnizPartsBleInfo {
    return {
      name: 'KankiAirMier',
    };
  }

  public static isDevice(peripheral: BleRemotePeripheral): boolean {
    return KankiAirMier._deviceAdvAnalyzer.validate(peripheral.adv_data);
  }

  public static getData(
    peripheral: BleRemotePeripheral
  ): KankiAirMier_Data | null {
    if (!KankiAirMier.isDevice(peripheral)) {
      return null;
    }
    const allData = KankiAirMier._deviceAdvAnalyzer.getAllData(
      peripheral.adv_data
    );

    const temperatureRaw = Buffer.from(
      allData.manufacture.temperature
    ).readInt16LE(0);
    const co2Raw = Buffer.from(allData.manufacture.co2).readInt16LE(0);
    const humidityRaw = Buffer.from(allData.manufacture.humidity).readInt16LE(
      0
    );
    const sequenceNumber = allData.manufacture.sequence[0] >> 5;
    const deviceName = Buffer.from(allData.manufacture.deviceName).toString(
      'utf8'
    );
    return {
      co2: co2Raw,
      temperature: temperatureRaw / 10,
      humidity: humidityRaw / 10,
      sequenceNumber,
      deviceName,
    };
  }

  private static _deviceAdvAnalyzer = new BleAdvBinaryAnalyzer()
    .groupStart('manufacture')
    .addTarget('length', [0x1e])
    .addTarget('type', [0xff])
    .addTarget('companyId', [0x9e, 0x09])
    .addTarget('appearance', [0x01])
    .addTarget('co2', [-1, -1])
    .addTarget('temperature', [-1, -1])
    .addTarget('humidity', [-1, -1])
    .addTarget('battery', [0xfe])
    .addTarget('interval', [0x02, 0x00])
    .addTarget('sequence', [-1])
    .addTarget('firmwareVersion', [-1])
    .addTargetByLength('deviceName', 15) // from datasheet length=14, but device send length=13
    .groupEnd();

  public _peripheral: BleRemotePeripheral | null = null;

  constructor() {}
}
