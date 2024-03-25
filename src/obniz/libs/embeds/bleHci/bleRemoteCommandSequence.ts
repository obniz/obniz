/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.Hci
 */
import { ObnizDeprecatedFunctionError } from '../../../ObnizError';
import { BleRemoteDescriptor } from './bleRemoteDescriptor';
import { BleRemoteService } from './bleRemoteService';
import { BleRemoteValueAttributeAbstract } from './bleRemoteValueAttributeAbstract';
import { BleAttributePropery, UUID } from './bleTypes';
import { BleRemoteCharacteristic } from './bleRemoteCharacteristic';

import pLimit from 'p-limit';

export class BleRemoteCommandSequence {
  private _commandCallback: null | ((data: number[]) => void) = null;
  private _setupFinishd = false;
  private _transactionLimit = pLimit(1);
  constructor(
    private _toTargetCharacteristic: BleRemoteCharacteristic,
    private _fromTargetCharacteristic: BleRemoteCharacteristic
  ) {}

  async setupWait() {
    if (this._setupFinishd) {
      return;
    }
    await this._fromTargetCharacteristic.registerNotifyWait(
      (data: number[]) => {
        if (this._commandCallback) {
          this._commandCallback(data);
        }
      }
    );

    this._setupFinishd = true;
  }

  async transactionWait(
    data: number[],
    timeout = 30 * 1000
  ): Promise<number[]> {
    await this.setupWait();

    let timeoutFunc: ((msg: Error) => void) | null = null;
    const timeoutError = new Error('Timed out for waiting');
    const limitError = new Error('Cannot multi command send at once');
    const timeoutHandle = setTimeout(() => {
      if (timeoutFunc) timeoutFunc(timeoutError);
    }, timeout * 1000);
    return await this._transactionLimit(async () => {
      try {
        const waitData = new Promise<number[]>((resolve, reject) => {
          if (this._commandCallback) {
            reject(limitError);
          }
          timeoutFunc = reject;
          this._commandCallback = resolve;
        });
        await this._toTargetCharacteristic.writeWait(data);
        const result = await waitData;
        this._commandCallback = null;
        return result;
      } catch (e) {
        this._commandCallback = null;
        clearTimeout(timeoutHandle);
        throw e;
      }
    });
  }
}
