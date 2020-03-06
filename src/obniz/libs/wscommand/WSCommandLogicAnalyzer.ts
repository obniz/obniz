/**
 * @packageDocumentation
 * @ignore
 */
import WSCommand from "./WSCommand";

class WSCommandLogicAnalyzer extends WSCommand {
  public module: any;
  public _CommandInit: any;
  public _CommandDeinit: any;
  public _CommandRecv: any;
  public sendCommand: any;
  public validateCommandSchema: any;
  public WSCommandNotFoundError: any;

  constructor() {
    super();
    this.module = 10;

    this._CommandInit = 0;
    this._CommandDeinit = 1;
    this._CommandRecv = 2;
  }

  // Commands

  public init(params: any) {
    const io: any = params.io[0];
    const intervalUsec: any = params.interval * 1000;
    const durationUsec: any = params.duration * 1000;

    const matchValue: any = parseInt(params.trigger.value);
    const matchCount: any = params.trigger.samples;
    const buf: any = new Uint8Array(12);
    buf[0] = 1;
    buf[1] = io;
    buf[2] = intervalUsec >> (8 * 3);
    buf[3] = intervalUsec >> (8 * 2);
    buf[4] = intervalUsec >> (8 * 1);
    buf[5] = intervalUsec;
    buf[6] = durationUsec >> (8 * 3);
    buf[7] = durationUsec >> (8 * 2);
    buf[8] = durationUsec >> (8 * 1);
    buf[9] = durationUsec;
    buf[10] = matchValue;
    buf[11] = matchCount;
    this.sendCommand(this._CommandInit, buf);
  }

  public deinit(params: any) {
    const buf: any = new Uint8Array(0);
    this.sendCommand(this._CommandDeinit, buf);
  }

  public parseFromJson(json: any) {
    const module: any = json.logic_analyzer;
    if (module === undefined) {
      return;
    }
    const schemaData: any = [
      { uri: "/request/logicAnalyzer/init", onValid: this.init },
      { uri: "/request/logicAnalyzer/deinit", onValid: this.deinit },
    ];
    const res: any = this.validateCommandSchema(schemaData, module, "logic_analyzer");

    if (res.valid === 0) {
      if (res.invalidButLike.length > 0) {
        throw new Error(res.invalidButLike[0].message);
      } else {
        throw new this.WSCommandNotFoundError(`[logic_analyzer]unknown command`);
      }
    }
  }

  public notifyFromBinary(objToSend: any, func: any, payload: any) {
    if (func === this._CommandRecv) {
      const arr: any = new Array(payload.byteLength * 8);
      let offset: any = 0;
      for (let i = 0; i < payload.byteLength; i++) {
        const byte: any = payload[i];
        for (let bit = 0; bit < 8; bit++) {
          arr[offset] = byte & (0x80 >>> bit) ? 1 : 0;
          offset++;
        }
      }
      objToSend.logic_analyzer = {
        data: arr,
      };
    } else {
      super.notifyFromBinary(objToSend, func, payload);
    }
  }
}

export default WSCommandLogicAnalyzer;
