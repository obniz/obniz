/**
 * @packageDocumentation
 * @module Parts.PLAYBULB_candle
 */
/* eslint rulesdir/non-ascii: 0 */

// import {BleRemotePeripheral, ObnizPartsBleInterface, ObnizPartsBleInfo} from 'obniz';

import {
  BleConnectSetting,
  BleRemotePeripheral,
} from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import {
  ObnizPartsBleInterface,
  ObnizPartsBleInfo,
} from '../../../obniz/ObnizPartsBleInterface';
import { BleAdvBinaryAnalyzer } from '../utils/advertisement/advertismentAnalyzer';
import roundTo from 'round-to';
import Switchbot_Bot from '../Switchbot_Bot';
import { Switchbot } from '../utils/abstracts/Switchbot';
import { BleRemoteCommandSequence } from '../../../obniz/libs/embeds/bleHci/bleRemoteCommandSequence';
import { BleRemoteCharacteristic } from '../../../obniz/libs/embeds/bleHci/bleRemoteCharacteristic';
import { BleBatteryService } from '../utils/services/batteryService';

export interface PLAYBULB_candleOptions {}

export const PLAYBULB_candle_MODE = {
  Fade: 0x01,
  JumpRGB: 0x02,
  FadeRGB: 0x03,
  CandleEffect: 0x04,
  NoEffect: 0x05,
} as const;

export type PLAYBULB_candle_MODE_TYPE = typeof PLAYBULB_candle_MODE[keyof typeof PLAYBULB_candle_MODE];

export const PLAYBULB_candle_SPEED = {
  ReallySlow: 0x00,
  ReallyFast: 0x01,
  Slower: 0x02,
  Faster: 0xff,
} as const;

export type PLAYBULB_candle_SPEED_TYPE = typeof PLAYBULB_candle_SPEED[keyof typeof PLAYBULB_candle_SPEED];

/** PLAYBULB_candle management class PLAYBULB_candleを管理するクラス */
export default class PLAYBULB_candle implements ObnizPartsBleInterface {
  public static info(): ObnizPartsBleInfo {
    return {
      name: 'PLAYBULB_candle',
    };
  }

  /**
   * Verify that the received peripheral is from the PLAYBULB_candle
   *
   * 受け取ったPeripheralがPLAYBULB_candleのものかどうかを確認する
   *
   * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
   *
   * @returns Whether it is the PLAYBULB_candle
   *
   * PLAYBULB_candleかどうか
   */
  public static isDevice(peripheral: BleRemotePeripheral): boolean {
    // [
    //   2, 1, 6,
    //   3, 3, 2, 255,
    //   3,
    //   25,
    //   64,
    //   3,
    //   2,
    //   10,
    //   254,
    //   6,
    //   255,
    //   77,
    //   73,
    //   80,
    //   79,
    //   87
    // ]

    // scan resp
    // [
    //   16,
    //   9,
    //   80,
    //   76,
    //   65,
    //   89,
    //   66,
    //   85,
    //   76,
    //   66,
    //   32,
    //   67,
    //   65,
    //   78,
    //   68,
    //   76,
    //   69
    // ]

    const isNameMatched = peripheral.localName?.startsWith('PLAYBULB CANDLE');
    const advData = PLAYBULB_candle._deviceAdvAnalyzerType.getAllData(
      peripheral.adv_data
    );

    return advData != null;
  }

  public ondisconnect?: (reason: any) => void;

  constructor(public _peripheral: BleRemotePeripheral) {}

  private _candleDeviceNameCharacteristics: BleRemoteCharacteristic | null = null;
  private _candleColorCharacteristics: BleRemoteCharacteristic | null = null;
  private _candleEffectCharacteristics: BleRemoteCharacteristic | null = null;
  public batteryService?: BleBatteryService;

  static CANDLE_SERVICE_UUID = 'FF02';
  static CANDLE_DEVICE_NAME_UUID = 'FFFF';
  static CANDLE_COLOR_UUID = 'FFFC';
  static CANDLE_EFFECT_UUID = 'FFFB';

  public async connectWait(
    setting?: Pick<BleConnectSetting, 'retry' | 'forceConnect'>
  ) {
    await this._peripheral.connectWait(setting);

    this._peripheral.ondisconnect = (reason: any) => {
      if (typeof this.ondisconnect === 'function') {
        this.ondisconnect(reason);
      }
    };

    const service = this._peripheral.getService(
      PLAYBULB_candle.CANDLE_SERVICE_UUID
    );
    if (!service) {
      throw new Error(`no service found`);
    }
    this._candleDeviceNameCharacteristics = service.getCharacteristic(
      PLAYBULB_candle.CANDLE_DEVICE_NAME_UUID
    )!;
    this._candleColorCharacteristics = service.getCharacteristic(
      PLAYBULB_candle.CANDLE_COLOR_UUID
    )!;
    this._candleEffectCharacteristics = service.getCharacteristic(
      PLAYBULB_candle.CANDLE_EFFECT_UUID
    )!;

    const service180F = this._peripheral.getService('180F');
    if (service180F) {
      this.batteryService = new BleBatteryService(service180F);
    }
  }

  public getBatteryLevelWait() {
    if (!this._peripheral.connected) {
      throw new Error(`Device is not connected`);
    }
    if (!this.batteryService) {
      throw new Error(`no batteryService found`);
    }
    return this.batteryService.getBatteryLevelWait();
  }

  public getDeviceNameWait() {
    if (!this._peripheral.connected) {
      throw new Error(`Device is not connected`);
    }
    if (!this._candleDeviceNameCharacteristics) {
      throw new Error(`no characteristic found`);
    }
    const deviceName = this._candleDeviceNameCharacteristics.readTextWait();
    return deviceName;
  }

  public setCandleEffectColorWait(red: number, green: number, blue: number) {
    return this.setEffectWait(
      {
        red,
        green,
        blue,
        white: 0x00,
      },
      PLAYBULB_candle_MODE.CandleEffect,
      PLAYBULB_candle_SPEED.ReallyFast
    );
  }

  public setFlashingColorWait(red: number, green: number, blue: number) {
    return this.setEffectWait(
      {
        red,
        green,
        blue,
        white: 0x00,
      },
      PLAYBULB_candle_MODE.FadeRGB,
      PLAYBULB_candle_SPEED.Faster
    );
  }

  public setEffectWait(
    color: {
      white: number;
      red: number;
      green: number;
      blue: number;
    },
    mode: PLAYBULB_candle_MODE_TYPE,
    speed: PLAYBULB_candle_SPEED_TYPE
  ) {
    if (!this._peripheral.connected) {
      throw new Error(`Device is not connected`);
    }
    if (!this._candleEffectCharacteristics) {
      throw new Error(`no characteristic found`);
    }
    const data = [
      color.white,
      color.red,
      color.green,
      color.blue,
      mode,
      0x00,
      speed,
      0x00,
    ];
    return this._candleEffectCharacteristics.writeWait(data, false);
  }

  // 単色
  public setColorWait(r: number, g: number, b: number) {
    if (!this._peripheral.connected) {
      throw new Error(`Device is not connected`);
    }
    if (!this._candleColorCharacteristics) {
      throw new Error(`no characteristic found`);
    }
    const data = [0x00, r, g, b];
    this.setEffectWait(
      {
        white: 0,
        red: r,
        green: g,
        blue: b,
      },
      PLAYBULB_candle_MODE.NoEffect,
      PLAYBULB_candle_SPEED.ReallyFast
    );
    return this._candleColorCharacteristics.writeWait(data, false);
  }

  static _deviceAdvAnalyzerType = new BleAdvBinaryAnalyzer()
    .addTarget('flag', [0x02, 0x01, 0x06])
    .groupStart('manufacture')
    .addTarget('length', [3])
    .addTarget('type', [3])
    .addTarget('candle_service_uuid', [0x02, 0xff]) // この後にも続いてる
    .groupEnd();
}
