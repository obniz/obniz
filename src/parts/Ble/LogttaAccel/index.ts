/**
 * @packageDocumentation
 * @module Parts.Logtta_Accel
 */
/* eslint rulesdir/non-ascii: 0 */

import Obniz from '../../../obniz';
import BleRemotePeripheral from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import ObnizPartsBleInterface, {
  ObnizPartsBleInfo,
} from '../../../obniz/ObnizPartsBleInterface';

export interface Logtta_AccelOptions {}

/**
 * scan data from Logtta_Accel
 *
 * Logtta_Accelからのスキャンデータ
 */
export interface Logtta_Accel_ScanData {
  /** Logtta_Accel firmware version Logtta_Accelのファームウェアバージョン */
  revision: number;
  /** sequence number for duplication check 重複判定用シーケンス番号 */
  sequence: number;
  /**
   * remaining battery 電池残量
   *
   * Range 範囲: 0~100 (Unit 単位: 1 %)
   */
  battery: number;
  /** shorted LocalName (the 8 upper bytes) 短縮LocalName (上位8Bytes) */
  name: string;
  setting: {
    /**
     * 温湿度測定周期 temperature and humidity measurement cycle
     *
     * Range 範囲: 1~600 (Unit 単位: 1 s)
     */
    temp_cycle: number;
    /**
     * 加速度サンプリング周波数 acceleration sampling frequency
     *
     * Range 範囲: 800, 400, 200, 100, 50 (Unit 単位: 1 Hz)
     */
    accel_sampling: number;
    /** high-pass filter ハイパスフィルタ */
    hpf: boolean;
    /**
     * 加速度レンジ acceleration range
     *
     * Range 範囲: ±2, ±4, ±8 (Unit 単位: 1 G)
     */
    accel_range: number;
    /**
     * 加速度計測軸 acceleration measurement axis
     *
     * 0b001:Z, 0b010:Y, 0b011:Y/Z, 0b100:X, 0b101:X/Z, 0b110:X/Y, 0b111:X/Y/Z
     */
    accel_axis: number;
    /**
     * 加速度分解能 acceleration resolution
     *
     * Range 範囲: 8, 12 (Unit 単位: bit)
     */
    accel_resolution: number;
  };
  /**
   * temperature 温度
   *
   * (Unit 単位: 1 degC)
   */
  temperature: number;
  /**
   * relative humidity 相対湿度
   *
   * (Unit 単位: 1 %RH)
   */
  humidity: number;
  /** alert status of the last 4 alerts 過去4回分のアラート発生状況 */
  alert: number[];
}

/**
 * acceleration data from Logtta_Accel
 *
 * Logtta_Accelからの加速度データ
 */
export interface Logtta_Accel_AccelData {
  /** X-axis X軸 */
  x: {
    /** acceleration peak data 加速度ピークデータ */
    peak: number;
    /** acceleration RMS data 加速度RMSデータ */
    rms: number;
  };
  /** Y-axis Y軸 */
  y: {
    /** acceleration peak data 加速度ピークデータ */
    peak: number;
    /** acceleration RMS data 加速度RMSデータ */
    rms: number;
  };
  /** Z-axis Z軸 */
  z: {
    /** acceleration peak data 加速度ピークデータ */
    peak: number;
    /** acceleration RMS data 加速度RMSデータ */
    rms: number;
  };
}

/** Logtta_Accel management class Logtta_Accelを管理するクラス */
export default class Logtta_Accel implements ObnizPartsBleInterface {
  public static info(): ObnizPartsBleInfo {
    return {
      name: 'Logtta_Accel',
    };
  }

  /**
   * Verify that the received peripheral is from the Logtta_Accel
   *
   * 受け取ったPeripheralがLogtta_Accelのものかどうかを確認する
   *
   * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
   *
   * @returns Whether it is the Logtta_Accel
   *
   * Logtta_Accelかどうか
   */
  public static isDevice(peripheral: BleRemotePeripheral): boolean {
    const advertise = peripheral.advertise_data_rows.filter((adv: number[]) => {
      let find = false;
      if (this.deviceAdv.length > adv.length) {
        return find;
      }
      for (let index = 0; index < this.deviceAdv.length; index++) {
        if (this.deviceAdv[index] === -1) {
          continue;
        }
        if (adv[index] === this.deviceAdv[index]) {
          find = true;
          continue;
        }
        find = false;
        break;
      }
      return find;
    });
    return advertise.length !== 0;
  }

  /**
   * Get a scan data from the Logtta_Accel
   *
   * Note: work only in beacon mode
   *
   * Logtta_Accelからスキャンデータを取得
   *
   * 注: ビーコンモードのときのみ動作
   *
   * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
   *
   * @returns scan data from Logtta_Accel
   *
   * Logtta_Accelから受け取ったスキャンデータ
   */
  public static getScanData(
    peripheral: BleRemotePeripheral
  ): Logtta_Accel_ScanData | null {
    if (!Logtta_Accel.isDevice(peripheral)) {
      return null;
    }

    if (peripheral.adv_data && peripheral.adv_data.length === 31) {
      const d = peripheral.adv_data;

      let sampling = 0;
      switch (d[18]) {
        case 0x00:
          sampling = 800;
          break;
        case 0x01:
          sampling = 400;
          break;
        case 0x02:
          sampling = 200;
          break;
        case 0x03:
          sampling = 100;
          break;
        case 0x04:
          sampling = 50;
          break;
      }

      const alertArray: number[] = [];
      alertArray.push((d[26] & 0b11110000) >> 4);
      alertArray.push(d[26] & 0b00001111);
      alertArray.push((d[27] & 0b11110000) >> 4);
      alertArray.push(d[27] & 0b00001111);

      return {
        revision: d[5],
        sequence: d[6],
        battery: d[7],
        name: new TextDecoder().decode(new Uint8Array(d.slice(8, 16))),
        setting: {
          temp_cycle: d[16] | (d[17] << 8),
          accel_sampling: sampling,
          hpf: !!(d[19] & 0b00010000),
          accel_range: 2 * ((d[19] & 0b00000011) + 1),
          accel_axis: d[20] & 0b00000111,
          accel_resolution: d[21],
        },
        temperature:
          Math.floor((((d[22] | (d[23] << 8)) / 65535) * 175 - 45) * 100) / 100,
        humidity:
          Math.floor(((d[24] | (d[25] << 8)) / 65535) * 100 * 100) / 100,
        alert: alertArray,
      };
    }
    return null;
  }

  /**
   * Get a acceleration data from the Logtta_Accel
   *
   * Note: work only in beacon mode
   *
   * Logtta_Accelから加速度データを取得
   *
   * 注: ビーコンモードのときのみ動作
   *
   * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
   *
   * @returns acceleration data from Logtta_Accel
   *
   * Logtta_Accelから受け取った加速度データ
   */
  public static getAccelData(
    peripheral: BleRemotePeripheral
  ): Logtta_Accel_AccelData | null {
    if (!Logtta_Accel.isDevice(peripheral)) {
      return null;
    }

    if (peripheral.scan_resp && peripheral.scan_resp.length === 31) {
      const d = peripheral.scan_resp;

      // console.log(
      //   `x peak ${data.x.peak} rms ${data.x.rms} y peak ${data.y.peak} rms ${data.y.rms} z peak ${data.z.peak} rms ${data.z.rms} address ${data.address}`,
      // );
      return {
        x: {
          peak: d[5] | (d[6] << 8),
          rms:
            d[7] |
            (d[8] << 8) |
            (d[9] << 16) |
            (d[10] << 24) |
            (d[11] << 32) |
            (d[12] << 40),
        },
        y: {
          peak: d[13] | (d[14] << 8),
          rms:
            d[15] |
            (d[16] << 8) |
            (d[17] << 16) |
            (d[18] << 24) |
            (d[19] << 32) |
            (d[20] << 40),
        },
        z: {
          peak: d[21] | (d[22] << 8),
          rms:
            d[23] |
            (d[24] << 8) |
            (d[25] << 16) |
            (d[26] << 24) |
            (d[27] << 32) |
            (d[28] << 40),
        },
      };
    }
    return null;
  }

  private static deviceAdv: number[] = [
    0xff, // Manufacturer vendor code
    0x10, // Manufacturer vendor code
    0x05, // Magic code
    0x05, // Magic code
  ];

  public _peripheral: BleRemotePeripheral | null = null;
}
