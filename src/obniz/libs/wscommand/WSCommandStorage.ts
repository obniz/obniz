import WSCommand from './WSCommand';

export default class WSCommandStorage extends WSCommand {
  public module = 17;

  public _CommandSave = 0;
  public _CommandRead = 1;
  // public _CommandErase = 2; // TODO: Implement this in the future.

  public save(json: { save: { fileName: string; data: Uint8Array } }): void {
    // request payload format
    // length of filename | filename | data
    const { fileName, data } = json.save;
    const buf = Buffer.from(fileName);
    const fileNameUintArr = new Uint8Array(buf);
    const joined = new Uint8Array(
      1 /* this 1 byte indicates length of filename */ +
        fileNameUintArr.length +
        data.length
    );
    const iLenFileName = 0;
    const iFileName = iLenFileName + 1;
    const iData = iFileName + fileNameUintArr.length;

    joined.set(new Uint8Array([fileNameUintArr.length]), iLenFileName);
    joined.set(fileNameUintArr, iFileName);
    joined.set(data, iData);
    this.sendCommand(this._CommandSave, joined);
  }

  public read(json: { read: { fileName: string } }): void {
    // request payload format
    // length of filename | filename
    const { fileName } = json.read;
    const buf = Buffer.from(fileName);
    const fileNameUintArr = new Uint8Array(buf);
    const joined = new Uint8Array(
      1 /* this 1 byte indicates length of filename */ + fileNameUintArr.length
    );
    const iLenFileName = 0;
    const iFileName = iLenFileName + 1;

    joined.set(new Uint8Array([fileNameUintArr.length]), iLenFileName);
    joined.set(fileNameUintArr, iFileName);
    this.sendCommand(this._CommandRead, joined);
  }

  public parseFromJson(json: { [k: string]: unknown }): void {
    const module = json.storage;
    if (!module) return;

    const schemaData = [
      { uri: '/request/storage/save', onValid: this.save },
      { uri: '/request/storage/read', onValid: this.read },
    ];

    const res = this.validateCommandSchema(schemaData, module, 'storage');
    if (res.valid === 0) {
      if (res.invalidButLike.length > 0) {
        throw new Error(res.invalidButLike[0].message);
      } else {
        throw new this.WSCommandNotFoundError('[storage]unknown commnad');
      }
    }
  }

  public notifyFromBinary(
    objToSend: { [key: string]: any },
    func: number,
    payload: Uint8Array
  ): void {
    switch (func) {
      case this._CommandSave: {
        super.notifyFromBinary(objToSend, func, payload);
        break;
      }
      case this._CommandRead: {
        // parse binary and build up json out of it
        // binary format: lenFileName | bytesFileName | bytesData
        const lenFileName = payload[0];
        const bytesFileName = payload.slice(1, lenFileName + 1);
        const bytesData = payload.slice(1 + bytesFileName.length);
        objToSend.storage.read = bytesData;
        break;
      }
      default: {
        break;
      }
    }
  }
}
