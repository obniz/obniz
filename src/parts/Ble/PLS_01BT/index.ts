/**
 * @packageDocumentation
 * @module Parts.PLS_01BT
 */

import Obniz from "../../../obniz";
import BleRemoteCharacteristic from "../../../obniz/libs/embeds/bleHci/bleRemoteCharacteristic";
import BleRemotePeripheral from "../../../obniz/libs/embeds/bleHci/bleRemotePeripheral";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";

export interface PLS_01BTResult {
  pulseRate: number;
  bloodOxygenLevel: number;
  perfusionIndex: number;
}

export interface PLS_01BTOptions {}

export default class PLS_01BT implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: "PLS_01BT",
    };
  }

  public static isDevice(peripheral: BleRemotePeripheral) {
    if (peripheral.localName && peripheral.localName.startsWith("My Oximeter")) {
      return true;
    }
    return false;
  }

  public keys: string[] = [];
  public requiredKeys: string[] = [];
  public params: any;
  public onmesured: ((result: PLS_01BTResult) => void) | null = null;
  public ondisconnect?: (reason: any) => void;

  private _uuids = {
    service: "CDEACB80-5235-4C07-8846-93A37EE6B86D",
    rxChar: "CDEACB81-5235-4C07-8846-93A37EE6B86D",
  };
  private _peripheral: BleRemotePeripheral | null = null;
  private _rxCharacteristic: BleRemoteCharacteristic | null = null;
  private _txCharacteristic: BleRemoteCharacteristic | null = null;

  constructor(peripheral: BleRemotePeripheral | null) {
    if (peripheral && !PLS_01BT.isDevice(peripheral)) {
      throw new Error("peripheral is not PLS_01BT");
    }
    this._peripheral = peripheral;
  }

  // @ts-ignore
  public wired(obniz: Obniz): void {}

  public async connectWait() {
    if (!this._peripheral) {
      throw new Error("PLS_01BT is not find.");
    }
    this._peripheral.ondisconnect = (reason) => {
      if (this.ondisconnect) {
        this.ondisconnect(reason);
      }
    };
    await this._peripheral.connectWait();
    this._rxCharacteristic = this._peripheral.getService(this._uuids.service)!.getCharacteristic(this._uuids.rxChar);

    if (!this._rxCharacteristic) {
      throw new Error("device is not PLS_01BT");
    }

    await this._rxCharacteristic.registerNotifyWait((data) => {
      if (data.length === 4 && data[0] === 0x81) {
        if (data[1] !== 255 && data[2] !== 177) {
          const pulseRate = data[1];
          const bloodOxygenLevel = data[2];
          const perfusionIndex = data[3];
          if (this.onmesured) {
            this.onmesured({
              pulseRate,
              bloodOxygenLevel,
              perfusionIndex,
            });
          }
        }
      }
    });
  }

  public async disconnectWait() {
    if (!this._peripheral) {
      throw new Error("PLS_01BT is not find.");
    }
    await this._peripheral.disconnectWait();
  }
}
