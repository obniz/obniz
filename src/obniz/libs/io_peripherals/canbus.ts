/**
 * @packageDocumentation
 * @module ObnizCore.Components
 */

import Obniz from '../../index';
import { ComponentAbstract } from '../ComponentAbstact';
import { ObnizUtil } from '../utils/util';

interface PeripheralCANBusOptions {
  /**
   * Canbus Modes
   */
  mode: 'normal' | 'noack' | 'listen';

  /**
   * TX pin no
   */
  tx: number;

  /**
   * RX pin no
   */
  rx: number;

  /**
   * speed of bus in kbps
   */
  kbps: number;

  /**
   * CAN Bus accept match code after mask.
   */
  filter_code: number;

  /**
   * CAN Bus accept filter mask. 0 means accept all
   */
  filter_mask: number;
}

interface CANBusSendModes {
  /**
   * Extended format. Default false.
   */
  extended: boolean;

  /**
   * Message is remote frame
   */
  rtr: boolean;

  /**
   * Message is Single Shot
   */
  single_shot: boolean;

  /**
   * Message is Self Reception
   */
  self_reception: boolean;
}

/**
 * CAN Bus
 *
 * @category Peripherals
 */
export class PeripheralCANBus extends ComponentAbstract {
  /**
   * @ignore
   */
  public used!: boolean;

  private id: number;

  private params!: PeripheralCANBusOptions | null;

  /**
   * It is called when data is received.
   * Data is array of bytes.
   *
   * ```javascript
   * // Javascript Example
   * obniz.canbus0.start({mode:"normal", tx :0, rx:1, kbps:100, filter_code: 0, filter_mask: 0});
   * obniz.canbus0.onreceive = function(extended, rtr, id, data) {
   *   console.log(data);
   * }
   * ```
   *
   */
  public onreceive?: (
    extended: boolean,
    rtr: boolean,
    id: number,
    data: number[]
  ) => void;

  constructor(obniz: Obniz, id: number) {
    super(obniz);
    this.id = id;
    this.on('/response/canbus/receive', (obj) => {
      if (this.onreceive) {
        this.Obniz._runUserCreatedFunction(
          this.onreceive,
          obj.extended,
          obj.rtr,
          obj.id,
          obj.data
        );
      }
    });
    this._reset();
  }

  /**
   * Start CAN Bus
   *
   *
   *
   * ```javascript
   * // Javascript Example
   * obniz.canbus0.start({mode:"normal", tx :0, rx:1, kbps:100, filter_code: 0, filter_mask: 0});
   * ```
   *
   * @param params CAN Bus parameters
   */
  public start(params: PeripheralCANBusOptions) {
    const err = ObnizUtil._requiredKeys(params, ['tx', 'rx', 'kbps', 'mode']);
    if (err) {
      throw new Error(
        "canbus start param '" + err + "' required, but not found "
      );
    }
    this.params = ObnizUtil._keyFilter(params, [
      'tx',
      'rx',
      'mode',
      'kbps',
      'filter_code',
      'filter_mask',
    ]) as PeripheralCANBusOptions;

    const modes = ['normal', 'noack', 'listen'];
    if (!modes.includes(params.mode)) {
      throw new Error(`invalid mode ${params.mode}`);
    }

    const ioKeys: (keyof PeripheralCANBusOptions)[] = ['tx', 'rx'];
    for (const key of ioKeys) {
      if (this.params[key] && !this.Obniz.isValidIO(this.params[key])) {
        throw new Error(
          "CAN Bus start param '" + key + "' are to be valid io no"
        );
      }
    }
    const obj: any = {};
    obj['canbus' + this.id] = {
      mode: params.mode,
      tx: params.tx,
      rx: params.rx,
      kbps: params.kbps,
      filter_code: params.filter_code,
      filter_mask: params.filter_mask,
    };
    this.used = true;
    this.Obniz.send(obj);
  }

  /**
   * It only sends data to canbus and does not receive it.
   *
   * ```javascript
   * // Javascript Example
   * obniz.canbus0.start({mode:"normal", tx :0, rx:1, kbps:100, filter_code: 0, filter_mask: 0});
   * obniz.canbus0.send({}, 0x700, [0x12, 0x98]);
   * ```
   *
   * @param data Max length is 1024 bytes.
   */
  public send(modes: CANBusSendModes, id: number, data: number[]) {
    if (!this.used) {
      throw new Error(`canbus${this.id} is not started`);
    }

    const obj: any = {};
    obj['canbus' + this.id] = {
      data,
      id,
      extended: modes.extended === true,
      rtr: modes.rtr === true,
      single_shot: modes.single_shot === true,
      self_reception: modes.self_reception === true,
    };
    this.Obniz.send(obj);
  }

  /**
   * @ignore
   */
  public isUsed() {
    return this.used;
  }

  /**
   * It ends canbus
   *
   * ```javascript
   * // Javascript Example
   * obniz.canbus0.start({mode:"normal", tx :0, rx:1, kbps:100, filter_code: 0, filter_mask: 0});
   * obniz.canbus0.end();
   * ```
   *
   */
  public end() {
    const obj: any = {};
    obj['canbus' + this.id] = null;
    this.params = null;
    this.Obniz.send(obj);
  }

  /**
   * @ignore
   * @private
   */
  public schemaBasePath(): string {
    return 'canbus' + this.id;
  }

  /**
   * @ignore
   * @private
   */
  protected _reset() {
    this.used = false;
    this.params = null;
  }
}
