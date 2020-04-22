/**
 * @packageDocumentation
 * @module Parts.RS_Seek3
 */

import Obniz from "../../../obniz";
import BleRemoteCharacteristic from "../../../obniz/libs/embeds/bleHci/bleRemoteCharacteristic";
import BleRemotePeripheral from "../../../obniz/libs/embeds/bleHci/bleRemotePeripheral";
import ObnizPartsBleInterface from "../../../obniz/ObnizPartsBleInterface";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";

export interface RS_Seek3Options {}

export default class RS_Seek3 implements ObnizPartsBleInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: "RS_Seek3",
    };
  }

  public static isDevice(peripheral: BleRemotePeripheral) {
    if (peripheral.localName !== "Seek3") {
      return false;
    }
    return true;
  }

  public keys: string[] = [];
  public requiredKeys: string[] = [];
  public params: any;
  public onpressed: (() => void) | null = null;
  public _peripheral: BleRemotePeripheral | null = null;
  public ondisconnect?: (reason: any) => void;

  private _uuids = {
    service: "0EE71523-981A-46B8-BA64-019261C88478",
    buttonChar: "0EE71524-981A-46B8-BA64-019261C88478",
    tempHumidChar: "0EE7152C-981A-46B8-BA64-019261C88478",
  };
  private _buttonCharacteristic: BleRemoteCharacteristic | null = null;
  private _tempHumidCharacteristic: BleRemoteCharacteristic | null = null;

  constructor(peripheral: BleRemotePeripheral | null) {
    if (peripheral && !RS_Seek3.isDevice(peripheral)) {
      throw new Error("peripheral is not RS_Seek3");
    }
    this._peripheral = peripheral;
  }

  // @ts-ignore
  public wired(obniz: Obniz): void {}

  public async connectWait() {
    if (!this._peripheral) {
      throw new Error("RS_Seek3 is not find.");
    }
    this._peripheral.ondisconnect = (reason: any) => {
      if (typeof this.ondisconnect === "function") {
        this.ondisconnect(reason);
      }
    };
    await this._peripheral.connectWait();
    this._buttonCharacteristic = this._peripheral
      .getService(this._uuids.service)!
      .getCharacteristic(this._uuids.buttonChar);
    this._tempHumidCharacteristic = this._peripheral
      .getService(this._uuids.service)!
      .getCharacteristic(this._uuids.tempHumidChar);

    if (this._buttonCharacteristic) {
      this._buttonCharacteristic.registerNotify((data: number[]) => {
        if (typeof this.onpressed === "function") {
          this.onpressed();
        }
      });
    }
  }

  public async disconnectWait() {
    await this._peripheral?.disconnectWait();
  }

  public async getTempHumidWait(): Promise<{ temperature: number; humidity: number }> {
    if (!this._tempHumidCharacteristic) {
      throw new Error("device is not connected");
    }
    const data = await this._tempHumidCharacteristic.readWait();
    return { temperature: data[0], humidity: data[1] };
  }
}
