/**
 * @packageDocumentation
 * @ignore
 */
import JsonBinaryConverter from "./jsonBinaryConverter";
import WSCommand from "./WSCommand";

class WSCommandPlugin extends WSCommand {
  public module: any;
  public _CommandReceive: any; // js <- device
  public _CommandSend: any; // js -> device
  public sendCommand: any;
  public validateCommandSchema: any;
  public WSCommandNotFoundError: any;

  constructor() {
    super();
    this.module = 15;

    this._CommandSend = 0;
    this._CommandReceive = 1;
  }

  public send(params: any, index: any) {
    const buf: any = new Uint8Array(params.send);
    this.sendCommand(this._CommandSend, buf);
  }

  public parseFromJson(json: any) {
    const module: any = json.plugin;
    if (module === undefined) {
      return;
    }

    const schemaData: any = [{ uri: "/request/plugin/send", onValid: this.send }];
    const res: any = this.validateCommandSchema(schemaData, module, "plugin");

    if (res.valid === 0) {
      if (res.invalidButLike.length > 0) {
        throw new Error(res.invalidButLike[0].message);
      } else {
        throw new this.WSCommandNotFoundError(`[network]unknown command`);
      }
    }
  }

  public notifyFromBinary(objToSend: any, func: any, payload: any) {
    switch (func) {
      case this._CommandReceive: {
        // convert buffer to array
        const arr: any = new Array(payload.byteLength);
        for (let i = 0; i < arr.length; i++) {
          arr[i] = payload[i];
        }

        objToSend.plugin = {
          receive: arr,
        };
        break;
      }
    }
  }
}

export default WSCommandPlugin;
