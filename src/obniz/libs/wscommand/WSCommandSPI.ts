/**
 * @packageDocumentation
 * @ignore
 */
import WSCommand from "./WSCommand";

class WSCommandSPI extends WSCommand {
  public module: any;
  public _CommandInit: any;
  public _CommandDeinit: any;
  public _CommandWriteRead: any;
  public _CommandWrite: any;
  public ioNotUsed: any;
  public sendCommand: any;
  public validateCommandSchema: any;
  public WSCommandNotFoundError: any;

  constructor() {
    super();
    this.module = 5;

    this._CommandInit = 0;
    this._CommandDeinit = 1;
    this._CommandWriteRead = 2;
    this._CommandWrite = 3;
  }

  // Commands

  public initMaster(params: any, module: any) {
    const mode: any = 0; // master mode

    let clk: any = params.clk;
    let mosi: any = params.mosi;
    let miso: any = params.miso;
    let cs: any = params.cs;

    const clock: any = params.clock;

    if (clk === null && mosi === null && miso === null) {
      throw new Error("spi: master mode require one of clk/mosi/miso");
    }

    if (clk === null) {
      clk = this.ioNotUsed;
    }
    if (mosi === null) {
      mosi = this.ioNotUsed;
    }
    if (miso === null) {
      miso = this.ioNotUsed;
    }
    if (cs === null) {
      cs = this.ioNotUsed;
    }

    const buf: any = new Uint8Array(11);
    buf[0] = module;
    buf[1] = mode;
    buf[2] = clk;
    buf[3] = mosi;
    buf[4] = miso;
    buf[5] = this.ioNotUsed; // wp
    buf[6] = this.ioNotUsed; // hd
    buf[7] = clock >> (3 * 8);
    buf[8] = clock >> (2 * 8);
    buf[9] = clock >> (1 * 8);
    buf[10] = clock;
    buf[11] = cs;

    this.sendCommand(this._CommandInit, buf);
  }

  public deinit(params: any, module: any) {
    const buf: any = new Uint8Array([module]);
    this.sendCommand(this._CommandDeinit, buf);
  }

  public write(params: any, module: any) {
    const buf: any = new Uint8Array(1 + params.data.length);
    buf[0] = module;
    buf.set(params.data, 1);
    if (params.read) {
      this.sendCommand(this._CommandWriteRead, buf);
    } else {
      this.sendCommand(this._CommandWrite, buf);
    }
  }

  public parseFromJson(json: any) {
    for (let i = 0; i < 2; i++) {
      const module: any = json["spi" + i];
      if (module === undefined) {
        continue;
      }

      const schemaData: any = [
        { uri: "/request/spi/init_master", onValid: this.initMaster },
        { uri: "/request/spi/write", onValid: this.write },
        { uri: "/request/spi/deinit", onValid: this.deinit },
      ];
      const res: any = this.validateCommandSchema(schemaData, module, "spi" + i, i);

      if (res.valid === 0) {
        if (res.invalidButLike.length > 0) {
          throw new Error(res.invalidButLike[0].message);
        } else {
          throw new this.WSCommandNotFoundError(`[spi${i}]unknown command`);
        }
      }
    }
  }

  public notifyFromBinary(objToSend: any, func: any, payload: any) {
    if (func === this._CommandWriteRead && payload.byteLength > 1) {
      const module_index: any = payload[0];
      // var received = payload.slice(1);

      const arr: any = new Array(payload.byteLength - 1);
      for (let i = 0; i < arr.length; i++) {
        arr[i] = payload[i + 1];
      }
      objToSend["spi" + module_index] = {
        data: arr,
      };
    } else {
      super.notifyFromBinary(objToSend, func, payload);
    }
  }
}

export default WSCommandSPI;
