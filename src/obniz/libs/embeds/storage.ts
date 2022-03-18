import { Obniz } from '../../Obniz';
import { ComponentAbstract } from '../ComponentAbstact';

export default class Storage extends ComponentAbstract {
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
    return json.storage.read;
  }
}
