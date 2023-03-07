/**
 * @packageDocumentation
 * @module Parts.panasonic_lock
 */
/* eslint rulesdir/non-ascii: 0 */

import { BleRemoteCharacteristic } from '../../../obniz/libs/embeds/bleHci/bleRemoteCharacteristic';
import { BleRemotePeripheral } from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import {
  ObnizPartsBleInterface,
  ObnizPartsBleInfo,
} from '../../../obniz/ObnizPartsBleInterface';
import { BleAdvBinaryAnalyzer } from '../utils/advertisement/advertismentAnalyzer';

import crypto from 'crypto';

export interface Panasonic_lockOptions {}

const CommandTypeMaps = {
  UpdateToken: 0x00,
  GetConfiguration: 0x01,
  SetConfiguration: 0x02,
  GetDateTime: 0x03,
  SetDateTime: 0x04,
  GetBatteryStatus: 0x05,
  ChangeKey: 0x07,
  GetApiVendor: 0x08,
  GetStatus: 0x0a,
  IsDoorOpened: 0x0c,
  IsLocked: 0x11,
  Unlock: 0x12,
  Lock: 0x13,
  Pause: 0x16,
  GetEvents: 0x17,
  DeleteEvents: 0x18,
  ForceDisconnect: 0x19,
  ResetDevice: 0x1a,
  SetPassword: 0x1b,
  GetPassword: 0x1c,
  UpdateFirmware: 0xfe,
  StatusNotification: 0xff,
} as const;

type CommandType = keyof typeof CommandTypeMaps;

const ItemIdMaps = {
  ErrorCode: 0x00,
  Token: 0x01,
  Hash: 0x02,
  FirmVersion: 0x11,
  BoxTime: 0x22,
  Status: 0x23,
  BatteryStatus: 0x25,
  AttemptMax: 0x28,
  InputImpossibleTime: 0x29,
  AutoClose: 0x2a,
  LastAttempt: 0x2c,
  WarnBatteryThreshold: 0x2d,
  AdvertiseInterval: 0x2e,
  StrengthPower: 0x2f,
  ChannelUsed: 0x31,
  CipheredConfig: 0x32,
  WarnEventNum: 0x33,
  ConnTimeOut: 0x34,
  AESKey: 0x41,
  CipheredPassword: 0x43,
  IsDeletePassword: 0x44,
  PasswordDeleteTime: 0x45,
  EventDeleteNum: 0x65,
  CipheredEvent: 0x68,
  LastEventDate: 0x69,
  IsDeleteEvents: 0x6a,
  UpdateFirmware: 0xfe,
  StatusNotification: 0xff,
};

const ErrorCode: Record<number, string> = {
  0x00: 'No error',
  0xfc: 'The token used is expired, please renew it', // BOX_001
  0xfd: 'The token value cannot be deciphered, please renew it', // BOX_002
  0xfe: 'Invalid parameter ', // BOX_003
  0xfa: 'The requested information has not been setup yet or it is not available', // BOX_004
  0xf5: 'The token value cannot be null as the AES key is already set', // BOX_005
  0xf8: 'The privileges do not allow that action be proceeded', // BOX_025
  0xf9: 'The token is blacklisted, please renew it', // BOX_026
  0xff: 'Error', // その他エラー全般？
};

type ItemId = keyof typeof ItemIdMaps;

interface Item {
  itemId: ItemId;
  payload: number[];
  meaning?: string;
}

interface Command {
  command: CommandType;
  items: Item[];
}

interface ParsedAdv {
  flags: [2, 1, 6];
  manufacture: {
    length: [25];
    type: [255];
    boxType: [number];
    firmwareVersion: [number, number, number];
    unknown: [number];
    flags: [number];
    battery: [number];
    uniqueText: [80, 83, 45, 76, 111, 99, 107];
    unknown2: [number, number];
    lock: [number, number];
    unlock: [number, number];
    rand: [number, number, number, number];
  };
}

export default class panasonic_lock implements ObnizPartsBleInterface {
  public static info(): ObnizPartsBleInfo {
    return {
      name: 'panasonic_lock',
    };
  }

  public _peripheral: BleRemotePeripheral;
  public onNotify?: (co2: number) => void;
  public ondisconnect?: (reason: any) => void;

  private _buffer: Buffer[] = [];
  private commandChar?: BleRemoteCharacteristic;
  private responseChar?: BleRemoteCharacteristic;

  constructor(peripheral: BleRemotePeripheral) {
    if (!peripheral || !panasonic_lock.isDevice(peripheral)) {
      throw new Error('peripheral is not panasonic_lock');
    }
    this._peripheral = peripheral;
  }

  public static isDevice(peripheral: BleRemotePeripheral) {
    const adv = Buffer.from(peripheral.adv_data).toString('utf-8');
    return adv && adv.indexOf('PS-Lock') >= 0;
  }

  public async connectWait() {
    const p = this._peripheral;
    await p.connectWait();

    const service = p.getService('dc8e2744-a374-458d-8d09-95af60463529')!;
    this.commandChar = service.getCharacteristic(
      '25bd9d85-ab09-4c0c-8b98-126f6360fd3d'
    )!;
    this.responseChar = service.getCharacteristic(
      'b9331036-fb06-4d15-bafd-e07ceb1b75ac'
    )!;
  }

  public async unlockWait() {
    const recv = await this.sendCommandWait({
      command: 'Unlock',
      items: [],
    });

    if (recv.items[0].payload[0] === 0) {
      return true; // 成功
    } else {
      return false;
    }
  }

  public async updateTokenWait() {
    const p = this._peripheral;
    const adv = this.parseAdvData(p);
    if (!adv) {
      throw new Error('advertisement data does not exist');
    }

    const _token = this.generateToken(
      p.address,
      Buffer.from(adv.manufacture.rand).toString('hex')
    );

    const recv = await this.sendCommandWait({
      command: 'UpdateToken',
      items: [
        {
          itemId: 'Token',
          payload: Array.from(Buffer.from(_token.cipherToken, 'hex')),
        },
        {
          itemId: 'Hash',
          payload: Array.from(Buffer.from(_token.hashToken, 'hex')),
        },
      ],
    });

    if (recv.items[0].payload[0] === 0) {
      return true; // 成功
    } else {
      return false;
    }
  }

  public parseAdvData(peripheral: BleRemotePeripheral) {
    const adv = _deviceAdvAnalyzer.getAllData(
      peripheral.adv_data
    ) as null | ParsedAdv;
    if (adv)
      adv.manufacture.rand = adv.manufacture.rand.reverse() as [
        number,
        number,
        number,
        number
      ];
    return adv;
  }

  public async sendCommandWait(command: Command) {
    const data = this.buildCommand(command);
    await this.commandChar!.writeWait(data);

    for (let i = 0; i < 10; i++) {
      const res = await this.responseChar!.readWait();
      if (res.length === 0) {
        await this.wait(1);
        continue;
      }
      const parsed = this.parseResponse(res);
      return parsed;
    }
    throw new Error();
  }

  public buildCommand(command: Command): number[] {
    const payload: number[] = [
      ...command.items.reduce(
        (r, i) => [...r, ItemIdMaps[i.itemId], i.payload.length, ...i.payload],
        [] as number[]
      ),
    ];
    return [
      CommandTypeMaps[command.command],
      command.items.length,
      (payload.length >> 8) & 0xff,
      payload.length & 0xff /* BE*/,
      ...payload,
    ];
  }

  public parseResponse(resp: number[]) {
    if (resp.length <= 4) throw new Error();
    const fisrt = resp[0];
    const recvItemNum = resp[1];
    const recvPayloadLength = (resp[2] << 8) + resp[3];
    const items: Item[] = [];

    for (let i = 4; i < resp.length; ) {
      const length = resp[i + 1];
      const item: Item = {
        itemId: getItemName(resp[i + 0]),
        payload: resp.slice(i + 2, i + 2 + length),
      };
      if (item.itemId === 'ErrorCode' && length > 0) {
        item.meaning = ErrorCode[item.payload[0]];
      }
      items.push(item);
      i += 2 + length;
    }
    return {
      fisrt,
      recvItemNum,
      recvPayloadLength,
      items,
    };
  }

  public generateToken(_macAddress: string, _randomNumber: string) {
    const macAddress = _macAddress.toUpperCase();
    const randomNumber = _randomNumber.toUpperCase();

    const getAlgorithm = (key: Buffer) => {
      switch (key.length) {
        case 16:
          return '  ';
        case 32:
          return 'aes-256-cbc';
      }

      throw new Error('Invalid key length: ' + key.length);
    };

    const encrypt = (target: Buffer, key: Buffer, _iv: Buffer) => {
      const cipher = crypto.createCipheriv(getAlgorithm(key), key, _iv);
      const encrypted = cipher.update(target, undefined, 'hex');
      // cipher.update(target.toString("hex"), "hex", "hex");
      // cipher.update(target,undefined,"hex"); 結果同じ

      const final = cipher.final('hex');
      return encrypted; // 暗号的にはホントはencrypted + final だが、BLEロックでは16桁しか使わないためencryptedのみを使用している
    };

    const token = Buffer.from([
      0x01,
      0x00,
      0x00,
      0x00 /* Token ID */,
      0x00,
      0x00,
      0x00,
      0x00 /* - */,
      0xff,
      0xff,
      0xff,
      0xff /* Privilege */,
      0x00,
      0x00,
      0x00,
      0x00 /* - */,
    ]);

    const aesKey = Buffer.from([
      0xdb,
      0x33,
      0x62,
      0x02,
      0x53,
      0xf6,
      0x48,
      0xd3,
      0xf4,
      0x02,
      0x70,
      0xb4,
      0xd2,
      0xcb,
      0xdf,
      0x33,
      0xb7,
      0x50,
      0x98,
      0x1c,
      0xec,
      0xb0,
      0xe4,
      0xb1,
      0xd5,
      0xd5,
      0x22,
      0x9e,
      0x94,
      0x07,
      0xb4,
      0x3f,
    ]);

    const ivHex = crypto
      .createHash('sha256')
      .update(Buffer.from(macAddress + randomNumber, 'utf8'))
      .digest('hex')
      .slice(-32);
    const iv = Buffer.from(ivHex, 'hex');

    const cipherToken = encrypt(token, aesKey, iv);
    const hashHex = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex')
      .slice(-8);
    // update(token.toString("hex"),"hex)
    // update(token) 結果同じ

    return {
      cipherToken,
      hashToken: hashHex,
    };
  }

  private wait(sec: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, sec * 1000);
    });
  }
}

const getItemName = (n: number): ItemId => {
  console.log('getItemName', n);
  return (
    (Object.entries(ItemIdMaps).find(([key, s]) => s === n)?.[0] as ItemId) ??
    null
  );
};

const _deviceAdvAnalyzer = new BleAdvBinaryAnalyzer()
  .addTarget('flags', [0x02, 0x01, 0x06]) // NOTE: length, ad type, ad data

  .groupStart('manufacture')
  .addTarget('length', [0x19])
  .addTarget('type', [0xff])
  .addTarget('boxType', [-1])
  .addTargetByLength('firmwareVersion', 3)
  .addTarget('unknown', [-1])
  .addTarget('flags', [-1])
  .addTarget('battery', [-1])
  .addTarget('uniqueText', [80, 83, 45, 76, 111, 99, 107]) // PS-lock
  .addTarget('unknown2', [-1, -1])
  .addTarget('lock', [-1, -1])
  .addTarget('unlock', [-1, -1])
  .addTarget('rand', [-1, -1, -1, -1])
  .groupEnd();
