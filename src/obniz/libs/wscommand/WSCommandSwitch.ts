/**
 * @packageDocumentation
 * @ignore
 */
import WSCommand from "./WSCommand";

class WSCommandSwitch extends WSCommand {
  public module: any;
  public _CommandNotifyValue: any;
  public _CommandOnece: any;
  public sendCommand: any;
  public validateCommandSchema: any;
  public WSCommandNotFoundError: any;

  constructor() {
    super();
    this.module = 9;

    this._CommandNotifyValue = 0;
    this._CommandOnece = 1;
  }

  // Commands

  public get(params: any) {
    const buf: any = new Uint8Array(0);
    this.sendCommand(this._CommandOnece, buf);
  }

  public parseFromJson(json: any) {
    const module: any = json.switch;
    if (module === undefined) {
      return;
    }
    const schemaData: any = [{ uri: "/request/switch/get", onValid: this.get }];
    const res: any = this.validateCommandSchema(schemaData, module, "switch");

    if (res.valid === 0) {
      if (res.invalidButLike.length > 0) {
        throw new Error(res.invalidButLike[0].message);
      } else {
        throw new this.WSCommandNotFoundError(`[switch]unknown command`);
      }
    }
  }

  public notifyFromBinary(objToSend: any, func: any, payload: any) {
    if ((func === this._CommandOnece || func === this._CommandNotifyValue) && payload.byteLength === 1) {
      const state: any = parseInt(payload[0]);
      const states: any = ["none", "push", "left", "right"];
      objToSend.switch = {
        state: states[state],
      };
      if (func === this._CommandOnece) {
        objToSend.switch.action = "get";
      }
    } else {
      super.notifyFromBinary(objToSend, func, payload);
    }
  }
}

export default WSCommandSwitch;
