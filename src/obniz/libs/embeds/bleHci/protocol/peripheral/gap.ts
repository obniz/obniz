/**
 * @packageDocumentation
 *
 * @ignore
 */
// var debug = require('debug')('gap');

/**
 * @ignore
 */
const debug: any = () => {
};

import events from "events";
import Hci from "../hci";

/**
 * @ignore
 */
class Gap extends events.EventEmitter {
  public _hci: any;
  public _advertiseState: any;

  constructor(hci: any) {
    super();
    this._hci = hci;

    this._advertiseState = null;

    this._hci.on("error", this.onHciError.bind(this));

    this._hci.on(
      "leAdvertisingParametersSet",
      this.onHciLeAdvertisingParametersSet.bind(this),
    );
    this._hci.on(
      "leAdvertisingDataSet",
      this.onHciLeAdvertisingDataSet.bind(this),
    );
    this._hci.on(
      "leScanResponseDataSet",
      this.onHciLeScanResponseDataSet.bind(this),
    );
    this._hci.on(
      "leAdvertiseEnableSet",
      this.onHciLeAdvertiseEnableSet.bind(this),
    );
  }

  public startAdvertising(name: any, serviceUuids: any) {
    debug(
      "startAdvertising: name = " +
      name +
      ", serviceUuids = " +
      JSON.stringify(serviceUuids, null, 2),
    );

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
      advertisementData.writeUInt8(
        1 + 2 * serviceUuids16bit.length,
        advertisementDataOffset,
      );
      advertisementDataOffset++;

      advertisementData.writeUInt8(0x03, advertisementDataOffset);
      advertisementDataOffset++;

      for (i = 0; i < serviceUuids16bit.length; i++) {
        serviceUuids16bit[i].copy(advertisementData, advertisementDataOffset);
        advertisementDataOffset += serviceUuids16bit[i].length;
      }
    }

    if (serviceUuids128bit.length) {
      advertisementData.writeUInt8(
        1 + 16 * serviceUuids128bit.length,
        advertisementDataOffset,
      );
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

    this.startAdvertisingWithEIRData(advertisementData, scanData);
  }

  public startAdvertisingIBeacon(data: any) {
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

    this.startAdvertisingWithEIRData(advertisementData, scanData);
  }

  public startAdvertisingWithEIRData(advertisementData: any, scanData: any) {
    advertisementData = advertisementData || Buffer.alloc(0);
    scanData = scanData || Buffer.alloc(0);

    debug(
      "startAdvertisingWithEIRData: advertisement data = " +
      advertisementData.toString("hex") +
      ", scan data = " +
      scanData.toString("hex"),
    );

    let error: any = null;

    if (advertisementData.length > 31) {
      error = new Error("Advertisement data is over maximum limit of 31 bytes");
    } else if (scanData.length > 31) {
      error = new Error("Scan data is over maximum limit of 31 bytes");
    }

    if (error) {
      this.emit("advertisingStart", error);
    } else {
      this._advertiseState = "starting";

      this._hci.setScanResponseData(scanData);
      this._hci.setAdvertisingData(advertisementData);
      this._hci.setAdvertiseEnable(true);
      this._hci.setScanResponseData(scanData);
      this._hci.setAdvertisingData(advertisementData);
    }
  }

  public restartAdvertising() {
    this._advertiseState = "restarting";

    this._hci.setAdvertiseEnable(true);
  }

  public stopAdvertising() {
    this._advertiseState = "stopping";

    this._hci.setAdvertiseEnable(false);
  }

  public onHciError(error: any) {
  }

  public onHciLeAdvertisingParametersSet(status: any) {
  }

  public onHciLeAdvertisingDataSet(status: any) {
  }

  public onHciLeScanResponseDataSet(status: any) {
  }

  public onHciLeAdvertiseEnableSet(status: any) {
    if (this._advertiseState === "starting") {
      this._advertiseState = "started";

      let error: any = null;

      if (status) {
        error = new Error(
          Hci.STATUS_MAPPER[status] || "Unknown (" + status + ")",
        );
      }

      this.emit("advertisingStart", error);
    } else if (this._advertiseState === "stopping") {
      this._advertiseState = "stopped";

      this.emit("advertisingStop");
    }
  }
}

export default Gap;
