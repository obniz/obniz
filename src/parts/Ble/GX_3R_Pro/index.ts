/**
 * @packageDocumentation
 * @module Parts.GX_3R_Pro
 */
/* eslint rulesdir/non-ascii: 0 */
import EventEmitter from 'eventemitter3';
import { BleRemotePeripheral } from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import { ObnizPartsBleInterface } from '../../../obniz/ObnizPartsBleInterface';
import { ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
import { BleAdvBinaryAnalyzer } from '../utils/advertisement/advertismentAnalyzer';
import { BleRemoteCharacteristic } from '../../../obniz/libs/embeds/bleHci/bleRemoteCharacteristic';
import { createSerialExecutor } from '@9wick/serial-executor';

export interface GX_3R_Pro_Options {}

export interface GX_3R_Pro_Gas_Data {
  displayName: string;
  gasName: string;
  fullScale: string;
  digit: string;
  unit: string;
  value: number;
}

export interface GX_3R_Pro_Data {
  batteryVolt: number;
  /**
   * Level of remaining battery.
   * 5: 'full'
   * 4: 'half'
   * 3: 'charging required'
   * 2: 'waring'
   * 1: 'critical'
   * 0: 'power is off'
   */
  battery: number;
  gas: GX_3R_Pro_Gas_Data[];
}

/** GX_3R_Pro management class GX_3R_Proを管理するクラス */
export default class GX_3R_Pro extends ObnizPartsBleInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: 'GX_3R_Pro',
    };
  }

  public _peripheral: BleRemotePeripheral;
  public static readonly partsName = 'GX_3R_Pro';

  public static readonly availableBleMode = 'Connectable';

  private code = {
    STX: 0x02,
    ETX: 0x03,
    ACK: 0x06,
    NAK: 0x15,
    ETB: 0x17,
    EOT: 0x04,
    CR: 0x0d,
    SUB: 0x1a,
  };

  private event: EventEmitter = new EventEmitter<'data' | 'setting'>();
  private serialExecutor = createSerialExecutor();
  private gasCharRx?: BleRemoteCharacteristic;
  private gasCharTx?: BleRemoteCharacteristic;
  private settingCharRx?: BleRemoteCharacteristic;
  private settingCharTx?: BleRemoteCharacteristic;

  constructor(peripheral: BleRemotePeripheral) {
    super();
    this._peripheral = peripheral;
  }

  /**
   * Verify that the received peripheral is from the GX_3R_Pro
   *
   * 受け取ったperipheralがGX_3R_Proのものかどうか確認する
   *
   * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
   *
   * @returns Whether it is the GX_3R_Pro
   *
   * GX_3R_Proかどうか
   */
  public static isDevice(peripheral: BleRemotePeripheral): boolean {
    return !!peripheral.localName?.startsWith('GX3RPro-');
  }

  async connectWait() {
    if (!this._peripheral.connected) {
      await this._peripheral.connectWait();
    }
    const gasService = this._peripheral.getService(
      '5699d362-0c53-11e7-93ae-92361f002671'
    )!;
    this.gasCharRx = gasService.getCharacteristic(
      '5699d646-0c53-11e7-93ae-92361f002671'
    )!;
    this.gasCharTx = gasService.getCharacteristic(
      '5699d772-0c53-11e7-93ae-92361f002671'
    )!;

    let gasCharRxReceives: number[] = [];
    await this.gasCharRx.registerNotifyWait((data) => {
      gasCharRxReceives.push(...data);
      // console.log(`gasCharRx: ${Buffer.from(data).toString('hex')}`);
      const tryParse = this.parseCommand(gasCharRxReceives);
      if (!tryParse) {
        return;
      }
      // console.log('parsed', tryParse);
      gasCharRxReceives = [];
      this.event.emit('data', tryParse);
    });
    this.settingCharRx = gasService.getCharacteristic(
      '5699d647-0c53-11e7-93ae-92361f002671'
    )!;
    this.settingCharTx = gasService.getCharacteristic(
      '5699d773-0c53-11e7-93ae-92361f002671'
    )!;
  }

  async sendCommandWait(command: string, subCommand: string, data: number[]) {
    const address = '00';
    const channel = '00';
    const payload = [
      this.code.STX,
      ...Array.from(Buffer.from(address.toUpperCase())),
      ...Array.from(Buffer.from(channel.toUpperCase())),
      ...Array.from(Buffer.from(command.toUpperCase())),
      ...Array.from(Buffer.from(',')),
      ...Array.from(Buffer.from(subCommand.toUpperCase())),
      ...Array.from(Buffer.from(',')),
      ...data,
      this.code.ETX,
    ];

    const packet = [...payload, ...this.calcChecksum(payload), this.code.EOT];

    return await this.serialExecutor.execute(async () => {
      if (!this._peripheral.connected || !this.gasCharTx) {
        throw new Error('peripheral is not connected');
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));

      let timeoutFunc: ((msg: string) => void) | null = null;
      const timeout = setTimeout(() => {
        if (timeoutFunc) timeoutFunc('Timed out for waiting');
      }, 30 * 1000);

      try {
        const responsePromise = new Promise<
          ReturnType<typeof this.parseCommand>
        >((resolve, reject) => {
          timeoutFunc = reject;
          this.event.once('data', resolve);
        });
        await this.gasCharTx.writeWait(packet);
        const response = await responsePromise;
        clearTimeout(timeout);
        return response;
      } catch (e) {
        clearTimeout(timeout);
        throw e;
      }
    });
  }

  calcChecksum(buf: number[]) {
    const sum = buf.reduce((a, b) => a + b);
    // console.log(`sum: 0x${sum.toString(16)}`);
    const checksum = Buffer.alloc(2);
    checksum.writeInt16BE(-sum, 0);

    // console.log(`rsum: 0x${checksum.toString('hex')}`);
    return Buffer.from(
      Buffer.from([checksum.readUInt8(1)])
        .toString('hex')
        .toUpperCase()
    );
  }

  parseCommand(data: number[]) {
    const analyzer = new BleAdvBinaryAnalyzer()
      .addTarget('STX', [0x02])
      .addTarget('address', [-1, -1])
      .addTarget('channel', [-1, -1])
      .addTarget('command', [-1, -1])
      .addTarget('comma1', [...Buffer.from(',')])
      .addTarget('subCommand', [-1])
      .addTarget('comma2', [...Buffer.from(',')])
      .addTargetByLength('data', data.length - 14)
      .addTarget('EXT', [this.code.ETX])
      .addTargetByLength('checkSum', 2)
      .addTarget('EOT', [this.code.EOT]);

    const parsed = analyzer.getAllData(data);
    if (!parsed) {
      return null;
    }
    return {
      address: Buffer.from(parsed.address).toString('utf8'),
      channel: Buffer.from(parsed.channel).toString('utf8'),
      command: Buffer.from(parsed.command).toString('utf8'),
      subCommand: Buffer.from(parsed.subCommand).toString('utf8'),
      data: parsed.data,
      dataString: Buffer.from(parsed.data).toString('utf8'),
    };
  }

  private async getGasSettingsWait() {
    const gj = await this.sendCommandWait('GJ', 'R', []);
    const gjc = gj?.dataString.split(',');
    const results = [];
    if (gjc) {
      for (const one of gjc) {
        if (one.length !== 33) {
          continue;
        }
        const displayName = one.slice(0, 3).trim();
        const gasName = one.slice(3, 13).trim();
        const fullScale = one.slice(13, 21).trim();
        const digit = one.slice(21, 29).trim();
        const unit = one.slice(29, 33).trim();
        results.push({
          displayName,
          gasName,
          fullScale,
          digit,
          unit,
        });
      }
    }
    return results;
  }

  public async getDataWait(): Promise<GX_3R_Pro_Data | null> {
    const gasSettings = await this.getGasSettingsWait();
    // console.log(gasSettings);

    const dh = await this.sendCommandWait('DH', 'R', []);
    const dhc = dh?.dataString.split(',');

    if (!dhc) {
      return null;
    }

    const gas = [];
    for (let i = 0; i < 5; i++) {
      if (gasSettings.length > i && dhc.length > 5 + i) {
        gas.push({
          ...gasSettings[i],
          value: Number(dhc[5 + i].split(' ').join('')),
        });
      }
    }
    return { batteryVolt: Number(dhc[3]), battery: Number(dhc[4]), gas };
  }
}
