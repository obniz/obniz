const WSCommand = require('./WSCommand_.js');

class WSCommand_Switch extends WSCommand {
  constructor() {
    super();
    this.module = 9;

    this._CommandNotifyValue = 0;
    this._CommandOnece = 1;
  }

  // Commands

  get(params) {
    let buf = new Uint8Array(0);
    this.sendCommand(this._CommandOnece, buf);
  }

  parseFromJson(json) {
    let module = json['switch'];
    if (module === undefined) {
      return;
    }
    let schemaData = [{ uri: '/request/switch/get', onValid: this.get }];
    let res = this.validateCommandSchema(schemaData, module, 'switch');

    if (res.valid === 0) {
      if (res.invalidButLike.length > 0) {
        throw new Error(res.invalidButLike[0].message);
      } else {
        throw new this.WSCommandNotFoundError(`[switch]unknown command`);
      }
    }
  }

  notifyFromBinary(objToSend, func, payload) {
    if (
      (func === this._CommandOnece || func === this._CommandNotifyValue) &&
      payload.byteLength == 1
    ) {
      let state = parseInt(payload[0]);
      let states = ['none', 'push', 'left', 'right'];
      objToSend['switch'] = {
        state: states[state],
      };
      if (func === this._CommandOnece) {
        objToSend['switch'].action = 'get';
      }
    } else {
      super.notifyFromBinary(objToSend, func, payload);
    }
  }
}

module.exports = WSCommand_Switch;
