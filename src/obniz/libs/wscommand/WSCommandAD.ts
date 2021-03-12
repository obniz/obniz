/**
 * @packageDocumentation
 * @ignore
 */
import WSCommand from "./WSCommand";

class WSCommandAD extends WSCommand {
  public module: any;
  public _CommandInitNormalInterval: any;
  public _CommandDeinit: any;
  public _CommandNotifyValue: any;
  public _CommandDoOnece: any;
  public sendCommand: any;
  public validateCommandSchema: any;
  public WSCommandNotFoundError: any;

  constructor() {
    super();
    this.module = 7;

    this._CommandInitNormalInterval = 0;
    this._CommandDeinit = 1;
    this._CommandNotifyValue = 2;
    this._CommandDoOnece = 3;
  }

  // Commands

  public get(params: any, no: any) {
    const buf: any = new Uint8Array([no]);
    this.sendCommand(params.stream ? this._CommandInitNormalInterval : this._CommandDoOnece, buf);
  }

  public deinit(params: any, no: any) {
    const buf: any = new Uint8Array([no]);
    this.sendCommand(this._CommandDeinit, buf);
  }

  public parseFromJson(json: any) {
    for (let i = 0; i < 40; i++) {
      const module: any = json["ad" + i];
      if (module === undefined) {
        continue;
      }

      const schemaData: any = [
        { uri: "/request/ad/deinit", onValid: this.deinit },
        { uri: "/request/ad/get", onValid: this.get },
      ];
      const res: any = this.validateCommandSchema(schemaData, module, "ad" + i, i);

      if (res.valid === 0) {
        if (res.invalidButLike.length > 0) {
          throw new Error(res.invalidButLike[0].message);
        } else {
          throw new this.WSCommandNotFoundError(`[ad${i}]unknown command`);
        }
      }
    }
  }

  public notifyFromBinary(objToSend: any, func: any, payload: any) {
    if (func === this._CommandNotifyValue) {
      for (let i = 0; i + 2 < payload.byteLength; i += 3) {
        let value: any;
        if (payload[i + 1] & 0x80) {
          // 10bit mode
          value = ((payload[i + 1] & 0x03) << 8) + payload[i + 2]; // 0x0000 to 0x3FF;
          value = (5.0 * value) / 1023.0; // 1023.0 ===0x3FF
          value = Math.round(value * 1000) / 1000;
        } else if (payload[i + 1] & 0x40) {
          // 12bit mode
          value = ((payload[i + 1] & 0x0f) << 8) + payload[i + 2]; // 0x0000 to 0x3FF;
          value = (3.3 * value) / 4095.0; // 4095.0 ===0xFFF // vdd is not always 3.3v but...
          value = Math.round(value * 1000) / 1000;
        } else {
          // unsigned 100 times mode. (0 to 500 from 0v to 5v).
          value = (payload[i + 1] << 8) + payload[i + 2];
          value = value / 100.0;
        }
        objToSend["ad" + payload[i]] = value;
      }
    } else {
      super.notifyFromBinary(objToSend, func, payload);
    }
  }
}

export default WSCommandAD;
