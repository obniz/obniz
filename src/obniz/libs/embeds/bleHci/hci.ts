import { ObnizOfflineError, ObnizTimeoutError } from "../../../ObnizError";

/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.Hci
 */

export type EventHandler = (...args: any) => any;

export default class ObnizBLEHci {
  public Obniz: any;
  public timeout: number = 10 * 1000;

  protected _eventHandlerQueue: { [key: string]: EventHandler[] } = {};

  constructor(Obniz: any) {
    this.Obniz = Obniz;
  }

  /**
   * @ignore
   * @private
   */
  public _reset() {
    this._eventHandlerQueue = {};
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
      this.onread(obj.read.data);

      for (const eventName in this._eventHandlerQueue) {
        if (typeof eventName !== "string" || !eventName.startsWith("[")) {
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
   * @param data
   */
  public onread(data: any) {}

  /**
   * @ignore
   * @private
   * @param promise
   * @param option
   */
  public timeoutPromiseWrapper(promise: Promise<any>, option?: any) {
    option = option || {};
    option.timeout = option.timeout || this.timeout;
    option.waitingFor = option.waitingFor || undefined;

    let onObnizClosed: null | (() => void) = null;
    let timeoutHandler: null | NodeJS.Timeout = null;

    const clearListeners = () => {
      this.Obniz.off("close", onObnizClosed);
      if (timeoutHandler) {
        clearTimeout(timeoutHandler);
      }
    };

    const successPromise = promise.then(
      (result: any) => {
        clearListeners();
        return result;
      },
      (reason: any) => {
        clearListeners();
        throw reason;
      },
    );

    const errorPromise = new Promise((resolve, reject) => {
      if (this.Obniz.connectionState !== "connected") {
        reject(new ObnizOfflineError());
      }

      onObnizClosed = () => {
        clearListeners();
        const error = new ObnizOfflineError();
        reject(error);
      };
      this.Obniz.on("close", onObnizClosed);

      const onTimeout = () => {
        clearListeners();

        const error = new ObnizTimeoutError(option.waitingFor);
        reject(error);
      };
      timeoutHandler = setTimeout(onTimeout, option!.timeout);
    });

    return Promise.race([successPromise, errorPromise]);
  }

  public readWait(binaryFilter: number[], option?: any): Promise<Buffer> {
    return this.timeoutPromiseWrapper(
      new Promise((resolve) => {
        this.onceQueue(binaryFilter, resolve);
      }),
      option,
    );
  }

  protected onceQueue(binaryFilter: number[], func: EventHandler) {
    const eventName = this.encodeBinaryFilter(binaryFilter);
    this._eventHandlerQueue[eventName] = this._eventHandlerQueue[eventName] || [];
    if (typeof func === "function") {
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
