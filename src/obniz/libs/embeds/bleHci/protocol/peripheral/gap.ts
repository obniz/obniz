/**
 * @packageDocumentation
 *
 * @ignore
 */
// var debug = require('debug')('gap');

/**
 * @ignore
 */
const debug: any = () => {};
import EventEmitter from "eventemitter3";
import Hci from "../hci";

type GapEventTypes = "";

/**
 * @ignore
 */
class Gap extends EventEmitter<GapEventTypes> {
  public _hci: Hci;
  public _advertiseState: any;

  constructor(hci: any) {
    super();
    this._hci = hci;

    this._advertiseState = null;
  }

  /**
   * @ignore
   * @private
   */
  public _reset() {
    this._advertiseState = null;
  }

  public async startAdvertisingWait(name: any, serviceUuids: any) {
    debug("startAdvertising: name = " + name + ", serviceUuids = " + JSON.stringify(serviceUuids, null, 2));

    let advertisementDataLength: any = 3;
    let scanDataLength: any = 0;

    const serviceUuids16bit: any = [];
    const serviceUuids128bit: any = [];
    let i: any = 0;

    if (name && name.length) {
      scanDataLength += 2 + name.length;
    }

    if (serviceUuids && serviceUuids.length) {
      for (i = 0; i < serviceUuids.length; i++) {
        const serviceUuid: any = Buffer.from(
          serviceUuids[i]
            .match(/.{1,2}/g)
            .reverse()
            .join(""),
          "hex",
        );

        if (serviceUuid.length === 2) {
          serviceUuids16bit.push(serviceUuid);
        } else if (serviceUuid.length === 16) {
          serviceUuids128bit.push(serviceUuid);
        }
      }
    }

    if (serviceUuids16bit.length) {
      advertisementDataLength += 2 + 2 * serviceUuids16bit.length;
    }

    if (serviceUuids128bit.length) {
      advertisementDataLength += 2 + 16 * serviceUuids128bit.length;
    }

    const advertisementData: any = Buffer.alloc(advertisementDataLength);
    const scanData: any = Buffer.alloc(scanDataLength);

    // flags
    advertisementData.writeUInt8(2, 0);
    advertisementData.writeUInt8(0x01, 1);
    advertisementData.writeUInt8(0x06, 2);

    let advertisementDataOffset: any = 3;

    if (serviceUuids16bit.length) {
      advertisementData.writeUInt8(1 + 2 * serviceUuids16bit.length, advertisementDataOffset);
      advertisementDataOffset++;

      advertisementData.writeUInt8(0x03, advertisementDataOffset);
      advertisementDataOffset++;

      for (i = 0; i < serviceUuids16bit.length; i++) {
        serviceUuids16bit[i].copy(advertisementData, advertisementDataOffset);
        advertisementDataOffset += serviceUuids16bit[i].length;
      }
    }

    if (serviceUuids128bit.length) {
      advertisementData.writeUInt8(1 + 16 * serviceUuids128bit.length, advertisementDataOffset);
      advertisementDataOffset++;

      advertisementData.writeUInt8(0x06, advertisementDataOffset);
      advertisementDataOffset++;

      for (i = 0; i < serviceUuids128bit.length; i++) {
        serviceUuids128bit[i].copy(advertisementData, advertisementDataOffset);
        advertisementDataOffset += serviceUuids128bit[i].length;
      }
    }

    // name
    if (name && name.length) {
      const nameBuffer: any = Buffer.alloc(name);

      scanData.writeUInt8(1 + nameBuffer.length, 0);
      scanData.writeUInt8(0x08, 1);
      nameBuffer.copy(scanData, 2);
    }

    await this.startAdvertisingWithEIRDataWait(advertisementData, scanData);
  }

  public async startAdvertisingIBeaconWait(data: any) {
    debug("startAdvertisingIBeacon: data = " + data.toString("hex"));

    const dataLength: any = data.length;
    const manufacturerDataLength: any = 4 + dataLength;
    const advertisementDataLength: any = 5 + manufacturerDataLength;
    // let scanDataLength = 0;

    const advertisementData: any = Buffer.alloc(advertisementDataLength);
    const scanData: any = Buffer.alloc(0);

    // flags
    advertisementData.writeUInt8(2, 0);
    advertisementData.writeUInt8(0x01, 1);
    advertisementData.writeUInt8(0x06, 2);

    advertisementData.writeUInt8(manufacturerDataLength + 1, 3);
    advertisementData.writeUInt8(0xff, 4);
    advertisementData.writeUInt16LE(0x004c, 5); // Apple Company Identifier LE (16 bit)
    advertisementData.writeUInt8(0x02, 7); // type, 2 => iBeacon
    advertisementData.writeUInt8(dataLength, 8);

    data.copy(advertisementData, 9);

    await this.startAdvertisingWithEIRDataWait(advertisementData, scanData);
  }

  public async startAdvertisingWithEIRDataWait(advertisementData: any, scanData: any) {
    advertisementData = advertisementData || Buffer.alloc(0);
    scanData = scanData || Buffer.alloc(0);

    debug(
      "startAdvertisingWithEIRData: advertisement data = " +
        advertisementData.toString("hex") +
        ", scan data = " +
        scanData.toString("hex"),
    );

    if (advertisementData.length > 31) {
      throw new Error("Advertisement data is over maximum limit of 31 bytes");
    } else if (scanData.length > 31) {
      throw new Error("Scan data is over maximum limit of 31 bytes");
    }

    this._advertiseState = "starting";

    const p1 = this._hci.setScanResponseDataWait(scanData);
    const p2 = this._hci.setAdvertisingDataWait(advertisementData);
    await Promise.all([p1, p2]);
    const p3 = this._hci.setAdvertiseEnableWait(true);
    const p4 = this._hci.setScanResponseDataWait(scanData);
    const p5 = this._hci.setAdvertisingDataWait(advertisementData);
    await Promise.all([p3, p4, p5]);

    const status = await p3;

    if (this._advertiseState === "starting") {
      this._advertiseState = "started";
      if (status) {
        throw new Error(Hci.STATUS_MAPPER[status] || "Unknown (" + status + ")");
      }
    } else if (this._advertiseState === "stopping") {
      this._advertiseState = "stopped";
    }
  }

  public async restartAdvertisingWait() {
    this._advertiseState = "restarting";

    await this._hci.setAdvertiseEnableWait(true);
  }

  public async stopAdvertisingWait() {
    this._advertiseState = "stopping";

    await this._hci.setAdvertiseEnableWait(false);
  }
}

export default Gap;
