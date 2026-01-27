import { Obniz } from '../../Obniz';
import { ComponentAbstract } from '../ComponentAbstact';

import semver from 'semver';

export class Storage extends ComponentAbstract {
  public schemaBasePath(): string {
    return 'storage';
  }
  protected _reset(): void {
    // What should I do?
  }
  constructor(obniz: Obniz, info: { [k: string]: any }) {
    super(obniz);
  }

  public save(fileName: string, data: number[]): void {
    if (semver.major(this.Obniz.firmware_ver!) < 4) {
      throw new Error(`Please update obniz firmware >= 4.0.0`);
    }
    const obj = {
      storage: {
        save: {
          fileName,
          data,
        },
      },
    };
    this.Obniz.send(obj);
  }

  public savePluginLua(lua_script: string | number[] | Buffer): void {
    if (semver.major(this.Obniz.firmware_ver!) < 7) {
      throw new Error(`Please update obniz firmware >= 7.0.0`);
    }
    let send_data = null;
    if (this.Obniz.isNode && lua_script instanceof Buffer) {
      send_data = [...lua_script];
    } else if (lua_script.constructor === Array) {
      send_data = lua_script;
    } else if (typeof lua_script === 'string') {
      const buf = Buffer.from(lua_script);
      send_data = [...buf];
    }
    if (!send_data) {
      throw new Error(`no correct lua_script supplied`);
    }
    this.save('plua', send_data);
  }

  public async readWait(fileName: string): Promise<number[]> {
    const obj = {
      storage: {
        read: {
          fileName,
        },
      },
    };
    const json = await this.sendAndReceiveJsonWait(
      obj,
      '/response/storage/read'
    );
    return json.read;
  }
}
