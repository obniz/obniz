/**
 * @packageDocumentation
 * @module Parts.uPRISM
 */

import crypto from "crypto";
import bleRemoteCharacteristic from "../../../obniz/libs/embeds/ble/bleRemoteCharacteristic";
import BleRemoteCharacteristic from "../../../obniz/libs/embeds/bleHci/bleRemoteCharacteristic";
import BleRemotePeripheral from "../../../obniz/libs/embeds/bleHci/bleRemotePeripheral";
import ObnizPartsBleInterface, { ObnizPartsBleInfo } from "../../../obniz/ObnizPartsBleInterface";

export interface acr1255Options {}

export default class acr1255 implements ObnizPartsBleInterface {
  public static info(): ObnizPartsBleInfo {
    return {
      name: "acr1255",
    };
  }

  public static isDevice(peripheral: BleRemotePeripheral): boolean {
    return peripheral.localName?.indexOf("ACR1255U-J1-") === 0;
  }

  public onNotify: ((data: number[]) => void) | null = null;
  public onAuthenticated: (() => void) | null = null;

  private _authenticated: boolean = false;
  private _peripheral: BleRemotePeripheral | null = null;
  private masterKey: number[] = [
    0x41,
    0x43,
    0x52,
    0x31,
    0x32,
    0x35,
    0x35,
    0x55,
    0x2d,
    0x4a,
    0x31,
    0x20,
    0x41,
    0x75,
    0x74,
    0x68,
  ];
  private sessionKey: number[] = [];
  private randomDeviceNumber: number[] = [];
  private randomNumber: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  private _uuids = {
    service: "3C4AFFF0-4783-3DE5-A983-D348718EF133",
    writeChar: "3C4AFFF1-4783-3DE5-A983-D348718EF133",
    readChar: "3C4AFFF2-4783-3DE5-A983-D348718EF133",
  };
  private readData: number[] = [];
  private readChar: BleRemoteCharacteristic | null = null;
  constructor(peripheral: BleRemotePeripheral | null) {
    if (peripheral === null) {
      return;
      // throw new Error("peripheral is null");
    }
    if (peripheral && !acr1255.isDevice(peripheral)) {
      throw new Error("peripheral is not acr1255");
    }
    this._peripheral = peripheral;
    this._authenticated = false;
  }

  public async connectWait() {
    if (!this._peripheral) {
      throw new Error("peripheral is not acr1255");
    }
    if (!this._peripheral.connected) {
      await this._peripheral.connectWait();
      this.randomDeviceNumber = [];
      this.readData = [];
    }
    const service = this._peripheral.getService(this._uuids.service)!;
    this.readChar = service.getCharacteristic(this._uuids.writeChar);
    await service.getCharacteristic(this._uuids.readChar)!.registerNotifyWait(async (data: number[]) => {
      this.s(data);
    });

    await this.writeBle([0x6b, 0x00, 0x05, 0x00, 0x00, 0x00, 0x00, 0xe0, 0x00, 0x00, 0x45, 0x00]); // auth step.1
  }

  public async write(data: number[]) {
    if (data.length % 16 !== 0) {
      const l = 16 - (data.length % 16);
      for (let i = 0; i < l; i++) {
        data.push(0xff);
      }
    }
    let packet = [0x05, (data.length & 0xff00) >> 8, data.length & 0x00ff];
    let checksum = 0;
    for (let i = 0; i < data.length; i++) {
      if (i === 6) {
        continue; // check sum
      }
      checksum = (checksum ^ data[i]) & 0xff;
    }
    data[6] = checksum;
    data = this.encrypt(data, this.sessionKey);
    packet = packet.concat(data);
    checksum = 0;
    for (let i = 1; i < packet.length; i++) {
      checksum = (checksum ^ packet[i]) & 0xff;
    }
    packet.push(checksum);
    packet.push(0x0a);
    for (let i = 0; i < packet.length / 20; i++) {
      const d = packet.slice(i * 20, (i + 1) * 20);
      await this.readChar!.writeWait(d);
    }
  }

  public async disconnectWait() {
    if (this._peripheral && this._peripheral.connected) {
      await this._peripheral.disconnectWait();
    }
  }

  public encrypt(data: number[], key: number[]): number[] {
    const c = crypto.createCipheriv("aes-128-cbc", Buffer.from(key), new Uint8Array(16));
    c.setAutoPadding(false);

    let t = c.update(Buffer.from(data), undefined, "hex");
    t += c.final("hex");
    return Array.from(Buffer.from(t, "hex"));
  }

  public decrypt(data: number[], key: number[]): number[] {
    const dec = crypto.createDecipheriv("aes-128-cbc", Buffer.from(key), new Uint8Array(16));
    dec.setAutoPadding(false);
    let t = dec.update(Buffer.from(data), "binary", "binary");
    t += dec.final("binary");
    const d = Array.from(Buffer.from(t));
    const list: number[] = [];
    for (let i = 0; i < d.length; i++) {
      list.push(d[i] >= 194 ? ((d[i] & 0b00000011) << 6) | (d[++i] & 0b00111111) : d[i]);
    }
    return list;
  }

  public s(data: number[]) {
    this.readData = this.readData.concat(data);
    if (this.readData[0] !== 0x05) {
      this.readData = [];
    }
    const dLength = ((this.readData[1] & 0xff) << 8) | (this.readData[2] & 0x00ff);

    if (this.readData.length - 5 < dLength) {
      // lack data length
      return;
    }
    if (this.readData[dLength + 4] === 0x0a) {
      // last packet check
      data = this.readData.slice(0, dLength + 5);
      this.parseBlePacket(data);
      if (this.readData.length > dLength + 5) {
        // more data
        this.readData = this.readData.slice(dLength + 5);
        this.s([]);
      } else {
        // delete data
        this.readData = [];
      }
    } else {
      // console.log("error data");
      this.readData = [];
    }
  }

  private parseBlePacket(data: number[]) {
    switch (data[3]) {
      case 0x83:
        if (!this._authenticated) {
          if (this.randomDeviceNumber.length <= 0) {
            // auth step.2
            let randomDevice: number[] = [];
            for (let i = 15; i < data.length - 2; i++) {
              randomDevice.push(data[i]);
            }
            this.randomDeviceNumber = randomDevice;
            randomDevice = this.decrypt(randomDevice, this.masterKey);
            this.sessionKey = randomDevice.slice(0, 8).concat(this.randomNumber.slice(0, 8));
            randomDevice = this.decrypt(this.randomNumber.concat(randomDevice), this.masterKey);
            let sendPacket = [0x6b, 0x00, 0x25, 0x00, 0x00, 0x00, 0x00, 0xe0, 0x00, 0x00, 0x46, 0x00];
            sendPacket = sendPacket.concat(randomDevice);
            this.writeBle(sendPacket);
            return;
            // auth step.3
          } else {
            // auth step.4
            let randomDevice: number[] = [];
            for (let i = 15; i < data.length - 2; i++) {
              randomDevice.push(data[i]);
            }
            randomDevice = this.decrypt(randomDevice, this.masterKey);
            if (this.arrayMatch(this.randomNumber, randomDevice)) {
              this._authenticated = true;
              if (this.onAuthenticated) {
                this.onAuthenticated();
              }
            }
            return;
          }
        }
        break;
    }
    let d = data.slice(3, data.length - 2);
    d = this.decrypt(d, this.sessionKey);
    const dLen = (((d[1] & 0xff) << 8) | (d[2] & 0x00ff)) + 7; // command Data Form 7 length
    if (this.onNotify) {
      this.onNotify(d.slice(0, dLen));
    }
  }

  private async writeBle(data: number[]) {
    let packet = [0x05, (data.length & 0xff00) >> 8, data.length & 0x00ff];
    let checksum = 0;
    for (let i = 0; i < data.length; i++) {
      if (i === 6) {
        continue; // check sum
      }
      checksum = (checksum ^ data[i]) & 0xff;
    }
    data[6] = checksum;
    packet = packet.concat(data);
    checksum = 0;
    for (let i = 1; i < packet.length; i++) {
      checksum = (checksum ^ packet[i]) & 0xff;
    }
    packet.push(checksum);
    packet.push(0x0a);
    for (let i = 0; i < packet.length / 20; i++) {
      const d = packet.slice(i * 20, (i + 1) * 20);
      await this.readChar!.writeWait(d);
    }
  }

  private arrayMatch(array1: number[], array2: number[]): boolean {
    if (array1.length === array2.length) {
      for (let i = 0; i < array1.length; i++) {
        if (array1[i] === array2[i]) {
          break;
        }
        return false;
      }
      return true;
    }
    return false;
  }

  // private printHex(data: number[], tag: string) {
  //   let s = "";
  //   for (let i = 0; i < data.length; i++) {
  //     s += "0x" + ("0" + data[i].toString(16)).slice(-2) + ", ";
  //   }
  //   console.log(`${tag} : ${s}`);
  // }
}
