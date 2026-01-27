/**
 * @packageDocumentation
 * @ignore
 */
import { WSCommandAbstract } from './WSCommandAbstract';

export class WSCommandCANBus extends WSCommandAbstract {
  module = 18;

  _CommandInit = 0;
  _CommandDeinit = 1;
  _CommandWrite = 2;
  _CommandRead = 3;
  // Commands

  public init(params: any, module: any) {
    const tx = params.tx;
    const rx = params.rx;
    const kbps = Math.floor(params.kbps);

    if (tx === null || rx === null) {
      throw new Error('canbus: tx, rx is required');
    }

    let mode = 0b00000000;
    if (params.mode === 'normal') {
      mode = 0b00000000;
    } else if (params.mode === 'noack') {
      mode = 0b01000000;
    } else if (params.mode === 'listen') {
      mode = 0b10000000;
    } else {
      throw new Error(`unknown mode`);
    }

    const buf = new Uint8Array(14);
    buf[0] = module;
    buf[1] = tx;
    buf[2] = rx;
    buf[3] = kbps >> 8;
    buf[4] = kbps;
    buf[5] = mode;
    buf[6] = params.filter_code >> (3 * 8);
    buf[7] = params.filter_code >> (2 * 8);
    buf[8] = params.filter_code >> (1 * 8);
    buf[9] = params.filter_code >> (0 * 8);
    buf[10] = params.filter_mask >> (3 * 8);
    buf[11] = params.filter_mask >> (2 * 8);
    buf[12] = params.filter_mask >> (1 * 8);
    buf[13] = params.filter_mask >> (0 * 8);

    this.sendCommand(this._CommandInit, buf);
  }

  public deinit(params: any, module: number) {
    const buf = new Uint8Array([module]);
    this.sendCommand(this._CommandDeinit, buf);
  }

  public send(params: any, module: number) {
    const buf = new Uint8Array(6 + params.data.length);
    buf[0] = module;
    let mode = 0;
    if (params.extended) {
      mode |= 0b10000000;
    }
    if (params.rtr) {
      mode |= 0b01000000;
    }
    if (params.single_shot) {
      mode |= 0b00100000;
    }
    if (params.self_reception) {
      mode |= 0b00010000;
    }
    buf[1] = mode;
    buf[2] = params.id >> (3 * 8);
    buf[3] = params.id >> (2 * 8);
    buf[4] = params.id >> (1 * 8);
    buf[5] = params.id >> (0 * 8);

    if (params.data.length) {
      buf.set(params.data, 6);
    }
    this.sendCommand(this._CommandWrite, buf);
  }

  public parseFromJson(json: any) {
    for (let i = 0; i < 1; i++) {
      const module = json['canbus' + i];
      if (module === undefined) {
        continue;
      }

      const schemaData = [
        { uri: '/request/canbus/init', onValid: this.init },
        { uri: '/request/canbus/send', onValid: this.send },
        { uri: '/request/canbus/deinit', onValid: this.deinit },
      ];
      const res = this.validateCommandSchema(
        schemaData,
        module,
        'canbus' + i,
        i
      );

      if (res.valid === 0) {
        if (res.invalidButLike.length > 0) {
          throw new Error(res.invalidButLike[0].message);
        } else {
          throw new this.WSCommandNotFoundError(`[canbus${i}]unknown command`);
        }
      }
    }
  }

  public notifyFromBinary(objToSend: any, func: number, payload: Uint8Array) {
    if (func === this._CommandRead && payload.byteLength >= 6) {
      const module_index = payload[0];
      const mode = payload[1];
      let extended = false;
      let rtr = false;
      if (mode & 0b10000000) {
        extended = true;
      }
      if (mode & 0b01000000) {
        rtr = true;
      }
      let id = 0;
      id |= payload[2] << (3 * 8);
      id |= payload[3] << (2 * 8);
      id |= payload[4] << (1 * 8);
      id |= payload[5] << (0 * 8);

      const arr = new Array(payload.byteLength - 6);
      for (let i = 0; i < arr.length; i++) {
        arr[i] = payload[6 + i];
      }
      objToSend['canbus' + module_index] = {
        id,
        extended,
        rtr,
        data: arr,
      };
    } else {
      super.notifyFromBinary(objToSend, func, payload);
    }
  }
}
