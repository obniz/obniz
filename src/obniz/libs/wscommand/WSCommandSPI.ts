/**
 * @packageDocumentation
 * @ignore
 */
import { WSCommandAbstract } from './WSCommandAbstract';

export class WSCommandSPI extends WSCommandAbstract {
  module = 5;

  _CommandInit = 0;
  _CommandDeinit = 1;
  _CommandWriteRead = 2;
  _CommandWrite = 3;
  // Commands

  public initMaster(params: any, module: any) {
    const mode = 0; // master mode

    let clk = params.clk;
    let mosi = params.mosi;
    let miso = params.miso;
    let cs = params.cs;

    const clock = params.clock;

    if (clk === null && mosi === null && miso === null) {
      throw new Error('spi: master mode require one of clk/mosi/miso');
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

    const buf = new Uint8Array(11);
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
    const buf = new Uint8Array([module]);
    this.sendCommand(this._CommandDeinit, buf);
  }

  public write(params: any, module: any) {
    const buf = new Uint8Array(1 + params.data.length);
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
      const module = json['spi' + i];
      if (module === undefined) {
        continue;
      }

      const schemaData = [
        { uri: '/request/spi/init_master', onValid: this.initMaster },
        { uri: '/request/spi/write', onValid: this.write },
        { uri: '/request/spi/deinit', onValid: this.deinit },
      ];
      const res = this.validateCommandSchema(schemaData, module, 'spi' + i, i);

      if (res.valid === 0) {
        if (res.invalidButLike.length > 0) {
          throw new Error(res.invalidButLike[0].message);
        } else {
          throw new this.WSCommandNotFoundError(`[spi${i}]unknown command`);
        }
      }
    }
  }

  public notifyFromBinary(objToSend: any, func: number, payload: Uint8Array) {
    if (func === this._CommandWriteRead && payload.byteLength > 1) {
      const module_index = payload[0];
      // var received = payload.slice(1);

      const arr = new Array(payload.byteLength - 1);
      for (let i = 0; i < arr.length; i++) {
        arr[i] = payload[i + 1];
      }
      objToSend['spi' + module_index] = {
        data: arr,
      };
    } else {
      super.notifyFromBinary(objToSend, func, payload);
    }
  }
}
