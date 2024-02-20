/**
 * @packageDocumentation
 * @ignore
 */
import { WSCommandAbstract } from './WSCommandAbstract';

export class WSCommandPlugin extends WSCommandAbstract {
  module = 15;

  _CommandSend = 0;
  _CommandReceive = 1;
  _CommandFrame = 2;

  public send(params: any, index: any) {
    const buf = new Uint8Array(params.send);
    this.sendCommand(this._CommandSend, buf);
  }

  public parseFromJson(json: any) {
    const module = json.plugin;
    if (module === undefined) {
      return;
    }

    const schemaData = [{ uri: '/request/plugin/send', onValid: this.send }];
    const res = this.validateCommandSchema(schemaData, module, 'plugin');

    if (res.valid === 0) {
      if (res.invalidButLike.length > 0) {
        throw new Error(res.invalidButLike[0].message);
      } else {
        throw new this.WSCommandNotFoundError(`[network]unknown command`);
      }
    }
  }

  public notifyFromBinary(objToSend: any, func: number, payload: Uint8Array) {
    switch (func) {
      case this._CommandReceive: {
        // convert buffer to array
        const arr = new Array(payload.byteLength);
        for (let i = 0; i < arr.length; i++) {
          arr[i] = payload[i];
        }

        objToSend.plugin = {
          receive: arr,
        };
        break;
      }
      case this._CommandFrame: {
        // convert buffer to array
        if (payload.length === 5 && payload[0] === 0) {
          let length = 0;
          length += payload[1] << (3 * 8);
          length += payload[2] << (2 * 8);
          length += payload[3] << (1 * 8);
          length += payload[4] << (0 * 8);

          objToSend.plugin = {
            frame: {
              start: {
                length,
              },
            },
          };
        } else if (payload.length === 1 && payload[0] === 1) {
          objToSend.plugin = {
            frame: {
              end: {},
            },
          };
        }
        break;
      }
    }
  }
}
