/**
 * @packageDocumentation
 * @ignore
 */
import { WSCommandAbstract } from './WSCommandAbstract';

export class WSCommandLocation extends WSCommandAbstract {
  module = 20;

  _CommandInit = 0;
  _CommandDeinit = 1;
  _CommandNotify = 2;
  // Commands

  public init(params: any) {
    const buf = new Uint8Array(0);

    this.sendCommand(this._CommandInit, buf);
  }

  public deinit(params: any) {
    const buf = new Uint8Array(0);
    this.sendCommand(this._CommandDeinit, buf);
  }

  public parseFromJson(json: any) {
    const module = json.location;
    if (!module) return;

    const schemaData = [
      { uri: '/request/location/init', onValid: this.init },
      { uri: '/request/location/deinit', onValid: this.deinit },
    ];

    const res = this.validateCommandSchema(schemaData, module, 'location');
    if (res.valid === 0) {
      if (res.invalidButLike.length > 0) {
        throw new Error(res.invalidButLike[0].message);
      } else {
        throw new this.WSCommandNotFoundError('[location]unknown commnad');
      }
    }
  }

  public notifyFromBinary(objToSend: any, func: number, payload: Uint8Array) {
    if (func === this._CommandNotify && payload.length === 4 * 5) {
      const view = new DataView(
        payload.buffer,
        payload.byteOffset,
        payload.byteLength
      );
      const latitude = view.getFloat32(0, false);
      const longitude = view.getFloat32(4, false);
      const altitude = view.getFloat32(8, false);
      const accuracy = view.getFloat32(12, false);
      const speed = view.getFloat32(16, false);
      objToSend.location = {
        latitude,
        longitude,
        altitude,
        accuracy,
        speed,
      };
    } else {
      super.notifyFromBinary(objToSend, func, payload);
    }
  }
}
