/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.old
 */

import BleHelper from "./bleHelper";

/**
 * Deprecated class.
 * Please update obnizOS >= 3.0.0 and use [[ObnizCore.Components.Ble.Hci]]
 * @category Use as Central
 */
export default class BleAdvertisementBuilder {
  public Obniz: any;
  public rows: any;

  constructor(Obniz: any, json: any) {
    this.Obniz = Obniz;
    this.rows = {};

    if (json) {
      if (json.localName) {
        this.setCompleteLocalName(json.localName);
      }
      if (
        json.manufacturerData &&
        json.manufacturerData.companyCode &&
        json.manufacturerData.data
      ) {
        this.setManufacturerSpecificData(
          json.manufacturerData.companyCode,
          json.manufacturerData.data,
        );
      }
      if (json.serviceUuids) {
        for (const uuid of json.serviceUuids) {
          this.setUuid(uuid);
        }
      }
    }
    if (typeof this.extendEvalJson === "function") {
      this.extendEvalJson(json);
    }
  }

  public setRow(type: any, data: any) {
    this.rows[type] = data;
  }

  public getRow(type: any) {
    return this.rows[type] || [];
  }

  public build() {
    const data: any = [];
    for (const key in this.rows) {
      if (this.rows[key].length === 0) {
        continue;
      }

      data.push(this.rows[key].length + 1);
      data.push(parseInt(key));
      Array.prototype.push.apply(data, this.rows[key]);
    }
    if (data.length > 31) {
      this.Obniz.error(
        "Too large data. Advertise/ScanResponse data are must be less than 32 byte.",
      );
    }

    return data;
  }

  public setStringData(type: any, string: any) {
    const data: any = [];

    for (let i = 0; i < string.length; i++) {
      data.push(string.charCodeAt(i));
    }

    this.setRow(type, data);
  }

  public setShortenedLocalName(name: any) {
    this.setStringData(0x08, name);
  }

  public setCompleteLocalName(name: any) {
    this.setStringData(0x09, name);
  }

  public setManufacturerSpecificData(companyCode: any, data: any) {
    const row: any = [];
    row.push(companyCode & 0xff);
    row.push((companyCode >> 8) & 0xff);
    Array.prototype.push.apply(row, data);
    this.setRow(0xff, row);
  }

  public setUuid(uuid: any) {
    const uuidData: number[] = this.convertUuid(uuid);
    let type: any;
    if (uuidData.length === 16) {
      type = 0x06;
    } else if (uuidData.length === 4) {
      type = 0x04;

    } else if (uuidData.length === 2) {
      type = 0x02;
    }
    this.setRow(type, uuidData);
  }

  public convertUuid(uuid: any): number[] {
    const uuidNumeric: any = BleHelper.uuidFilter(uuid);
    if (
      uuidNumeric.length !== 32 &&
      uuidNumeric.length !== 8 &&
      uuidNumeric.length !== 4
    ) {
      this.Obniz.error(
        "BLE uuid must be 16/32/128 bit . (example: c28f0ad5-a7fd-48be-9fd0-eae9ffd3a8bb for 128bit)",
      );
    }

    const data: any = [];
    for (let i = uuidNumeric.length; i > 1; i -= 2) {
      data.push(parseInt(uuidNumeric[i - 2] + uuidNumeric[i - 1], 16));
    }
    return data;
  }

  public setIbeaconData(uuid: any, major: any, minor: any, txPower: any) {
    const data: any = [];
    data.push(0x02, 0x15); // fixed data

    const uuidData: any = this.convertUuid(uuid);
    Array.prototype.push.apply(data, uuidData);

    data.push((major >> 8) & 0xff);
    data.push((major >> 0) & 0xff);
    data.push((minor >> 8) & 0xff);
    data.push((minor >> 0) & 0xff);
    data.push((txPower >> 0) & 0xff);

    this.setManufacturerSpecificData(0x004c, data);
    return;
  }

  public extendEvalJson(json: any) {
    if (json) {
      if (json.flags) {
        if (json.flags.includes("limited_discoverable_mode")) {
          this.setLeLimitedDiscoverableModeFlag();
        }
        if (json.flags.includes("general_discoverable_mode")) {
          this.setLeGeneralDiscoverableModeFlag();
        }
        if (json.flags.includes("br_edr_not_supported")) {
          this.setBrEdrNotSupportedFlag();
        }
        if (json.flags.includes("le_br_edr_controller")) {
          this.setLeBrEdrControllerFlag();
        }
        if (json.flags.includes("le_br_edr_host")) {
          this.setLeBrEdrHostFlag();
        }
      }
    }
  }

  public setFlags(flag: any) {
    const data: any = this.getRow(0x01);
    data[0] = (data[0] || 0) | flag;
    this.setRow(0x01, data);
  }

  public setLeLimitedDiscoverableModeFlag() {
    this.setFlags(0x01);
  }

  public setLeGeneralDiscoverableModeFlag() {
    this.setFlags(0x02);
  }

  public setBrEdrNotSupportedFlag() {
    this.setFlags(0x04);
  }

  public setLeBrEdrControllerFlag() {
    this.setFlags(0x08);
  }

  public setLeBrEdrHostFlag() {
    this.setFlags(0x10);
  }
}
