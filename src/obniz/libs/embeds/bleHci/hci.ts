/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.Hci
 */

import ObnizDevice from '../../../ObnizDevice';
import {
  ObnizOfflineError,
  ObnizParameterError,
  ObnizTimeoutError,
} from '../../../ObnizError';

export type EventHandler = (...args: any) => any;

export default class ObnizBLEHci {
  public Obniz: ObnizDevice;

  /*
   * HCI level timeout should never occure. Response must be sent from a device.
   * This timeout is for just in case for a device nerver send response.
   */
  public timeout: number = 90 * 1000;

  public hciProtocolOnSocketData: any;

  protected _eventHandlerQueue: { [key: string]: EventHandler[] } = {};
  /**
   * @ignore
   * @private
   */
  public _extended: boolean;
  private defaultExtended: boolean;

  constructor(Obniz: ObnizDevice, extended: boolean) {
    this.Obniz = Obniz;
    this._extended = extended;
    this.defaultExtended = this._extended;
  }

  /**
   * @ignore
   * @private
   */
  public _reset(keepExtended: boolean) {
    this._eventHandlerQueue = {};
    if (!keepExtended) {
      this._extended = this.defaultExtended;
    }
  }

  /**
   * Initialize BLE HCI module
   */
  public init() {
    this.Obniz.send({
      ble: {
        hci: {
          initialize: true,
        },
      },
    });
  }

  /**
   * Deinitalize BLE HCI module
   */
  public end() {
    this.Obniz.send({
      ble: {
        hci: null,
      },
    });
  }

  /**
   * write HCI command to HCI module
   *
   * @param hciCommand
   */
  public write(hciCommand: number[]) {
    this.Obniz.send({
      ble: {
        hci: {
          write: hciCommand,
        },
      },
    });
  }

  /**
   * @ignore
   * @param obj
   */
  public notified(obj: any) {
    if (obj.read && obj.read.data) {
      if (this.onread === this.hciProtocolOnSocketData) {
        // obnizjs internal function
        this.onread(obj.read.data);
      } else {
        // user created function
        this.Obniz._runUserCreatedFunction(this.onread, obj.read.data);
      }

      for (const eventName in this._eventHandlerQueue) {
        if (typeof eventName !== 'string' || !eventName.startsWith('[')) {
          continue;
        }
        if (this._eventHandlerQueue[eventName].length === 0) {
          continue;
        }

        const isValid = this.validate(eventName, obj);
        if (isValid) {
          const func = this._eventHandlerQueue[eventName].shift();
          if (func) {
            func(Buffer.from(obj.read.data));
          }
        }
      }
    }
  }

  /**
   * Callback on HCI command received.
   *
   * @param data
   */
  public onread(data: any) {
    // do nothing.
  }

  /**
   * @ignore
   * @private
   * @param promise
   * @param option
   * @param option.timeout Timeout number in seconds. If not specified. default timeout is applied. If null specified, never timeout.
   * @param option.waitingFor Readable description of command for waiting. Printed when Error or timeout occured.
   */
  public timeoutPromiseWrapper<T>(
    promise: Promise<T>,
    _option: {
      timeout?: number | null;
      waitingFor: string;
      onTimeout?: () => Promise<void>;
    }
  ): Promise<T> {
    const option = {
      timeout:
        _option.timeout === null ? null : _option.timeout ?? this.timeout,
      waitingFor: _option.waitingFor,
      onTimeout: _option.onTimeout || undefined,
    };
    if (option.timeout !== null && option.timeout < 0) {
      throw new ObnizParameterError(`option.timeout`, `0 or greater`);
    }

    let onObnizClosed: null | (() => void) = null;
    let timeoutHandler: null | ReturnType<typeof setTimeout> = null;

    const clearListeners = () => {
      if (onObnizClosed) {
        this.Obniz.off('close', onObnizClosed);
        onObnizClosed = null;
      }
      if (timeoutHandler) {
        clearTimeout(timeoutHandler);
        timeoutHandler = null;
      }
    };

    const successPromise = promise.then(
      (result: T) => {
        clearListeners();
        return result;
      },
      (reason: any) => {
        clearListeners();
        throw reason;
      }
    );

    const errorPromise: Promise<T> = new Promise((resolve, reject) => {
      if (this.Obniz.connectionState !== 'connected') {
        reject(new ObnizOfflineError());
        return;
      }

      const offlineError = new ObnizOfflineError();
      onObnizClosed = () => {
        onObnizClosed = null;
        clearListeners();
        reject(offlineError);
      };
      this.Obniz.once('close', onObnizClosed);

      let onTimeout;
      if (option.onTimeout) {
        const timeoutError = new ObnizTimeoutError(option.waitingFor);
        onTimeout = () => {
          timeoutHandler = null;
          clearListeners();
          if (option.onTimeout) {
            option
              .onTimeout()
              .then(() => {
                reject(timeoutError);
              })
              .catch((e: Error) => {
                reject(e);
              });
          }
        };
      } else {
        const timeoutError = new ObnizTimeoutError(option.waitingFor);
        onTimeout = () => {
          timeoutHandler = null;
          clearListeners();
          reject(timeoutError);
        };
      }
      if (option.timeout !== null) {
        timeoutHandler = setTimeout(onTimeout, option.timeout);
      }
    });

    if (option.timeout !== null) {
      return Promise.race([successPromise, errorPromise]);
    }
    return successPromise;
  }

  public readWait(
    binaryFilter: number[],
    option: {
      timeout?: number | null;
      waitingFor: string;
      onTimeout?: () => Promise<void>;
    }
  ): Promise<Buffer> {
    return this.timeoutPromiseWrapper(
      new Promise((resolve) => {
        this.onceQueue(binaryFilter, resolve);
      }),
      option
    );
  }

  protected onceQueue(binaryFilter: number[], func: EventHandler) {
    const eventName = this.encodeBinaryFilter(binaryFilter);
    this._eventHandlerQueue[eventName] =
      this._eventHandlerQueue[eventName] || [];
    if (typeof func === 'function') {
      this._eventHandlerQueue[eventName].push(func);
    }
  }

  protected validate(str: string, json: any): boolean {
    const binaryFilter = this.decodeBinaryFilter(str);
    if (json.read.data.length < binaryFilter.length) {
      return false;
    }
    for (let i = 0; i < binaryFilter.length; i++) {
      if (binaryFilter[i] < 0) {
        continue;
      }
      if (binaryFilter[i] !== json.read.data[i]) {
        return false;
      }
    }
    return true;
  }

  protected encodeBinaryFilter(binary: number[]): string {
    return JSON.stringify(binary);
  }

  protected decodeBinaryFilter(str: string): number[] {
    return JSON.parse(str);
  }
}
