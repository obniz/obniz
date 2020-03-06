/**
 * @packageDocumentation
 * @ignore
 */
class WSCommandBleHci {
  public _delegate: any;
  public _CommandHCIInit = 41;
  public _CommandHCIDeinit = 42;
  public _CommandHCISend = 43;
  public _CommandHCIRecv = 44;
  public _CommandHCIAdvertisementFilter = 45;

  constructor(delegate: any) {
    this._delegate = delegate;
  }

  public schemaData() {
    return [
      { uri: "/request/ble/hci/init", onValid: this.init.bind(this) },
      { uri: "/request/ble/hci/deinit", onValid: this.deinit.bind(this) },
      { uri: "/request/ble/hci/write", onValid: this.send.bind(this) },
      {
        uri: "/request/ble/hci/advertisement_filter",
        onValid: this.advertisementFilter.bind(this),
      },
    ];
  }

  public notifyFunctionList() {
    const funcList: any = {};
    funcList[this._CommandHCIRecv] = this.recv.bind(this);
    return funcList;
  }

  public init(params: any, module?: any) {
    const buf: any = new Uint8Array(0);
    this._delegate.sendCommand(this._CommandHCIInit, buf);
  }

  public deinit(params: any, module?: any) {
    const buf: any = new Uint8Array(0);
    this._delegate.sendCommand(this._CommandHCIDeinit, buf);
  }

  public send(params: any, module?: any) {
    const buf: any = new Uint8Array(params.hci.write.length);
    buf.set(params.hci.write);
    this._delegate.sendCommand(this._CommandHCISend, buf);
  }

  public recv(objToSend: any, payload?: any) {
    const arr: any = new Array(payload.byteLength);
    for (let i = 0; i < arr.length; i++) {
      arr[i] = payload[i];
    }

    objToSend.ble = objToSend.ble || {};
    objToSend.ble.hci = objToSend.ble.hci || {};
    objToSend.ble.hci.read = { data: arr };
  }

  public advertisementFilter(params: any) {
    const sendData: number[] = [];
    params.hci.advertisement_filter.forEach((e: any) => {
      const one: number[] = [e.range.index, e.range.length, e.value.length, ...e.value];
      sendData.push(...one);
    });
    const buf: any = new Uint8Array(sendData.length);
    buf.set(sendData);
    this._delegate.sendCommand(this._CommandHCIAdvertisementFilter, buf);
  }
}

export default WSCommandBleHci;
