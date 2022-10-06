/**
 * @packageDocumentation
 * @ignore
 */
import { WSCommandAbstract } from './WSCommandAbstract';

export class WSCommandSwitch extends WSCommandAbstract {
  public module: number;
  public _CommandNotifyValue: number;
  public _CommandOnece: number;

  constructor() {
    super();
    this.module = 9;

    this._CommandNotifyValue = 0;
    this._CommandOnece = 1;
  }

  // Commands

  public get(params: any) {
    const buf = new Uint8Array(0);
    this.sendCommand(this._CommandOnece, buf);
  }

  public parseFromJson(json: any) {
    const module = json.switch;
    if (module === undefined) {
      return;
    }
    const schemaData = [{ uri: '/request/switch/get', onValid: this.get }];
    const res = this.validateCommandSchema(schemaData, module, 'switch');

    if (res.valid === 0) {
      if (res.invalidButLike.length > 0) {
        throw new Error(res.invalidButLike[0].message);
      } else {
        throw new this.WSCommandNotFoundError(`[switch]unknown command`);
      }
    }
  }

  public notifyFromBinary(objToSend: any, func: number, payload: Uint8Array) {
    if (
      (func === this._CommandOnece || func === this._CommandNotifyValue) &&
      payload.byteLength === 1
    ) {
      const state = payload[0];
      const states = ['none', 'push', 'left', 'right'];
      objToSend.switch = {
        state: states[state],
      };
      if (func === this._CommandOnece) {
        objToSend.switch.action = 'get';
      }
    } else {
      super.notifyFromBinary(objToSend, func, payload);
    }
  }
}
