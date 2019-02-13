const WSCommand = require('./WSCommand_.js');

class WSCommand_System extends WSCommand {
  constructor() {
    super();
    this.module = 0;

    this._CommandReboot = 0;

    this._CommandReset = 2;
    this._CommandSelfCheck = 3;
    this._CommandWait = 4;
    this._CommandResetOnDisconnect = 5;

    this._CommandPingPong = 8;
    this._CommandVCC = 9;
  }

  // Commands

  reboot(params) {
    this.sendCommand(this._CommandReboot, null);
  }

  reset(params) {
    this.sendCommand(this._CommandReset, null);
  }

  selfCheck(params) {
    this.sendCommand(this._CommandSelfCheck, null);
  }

  wait(params) {
    let msec = params.wait;
    let buf = new Uint8Array([msec >> 8, msec]);
    this.sendCommand(this._CommandWait, buf);
  }

  keepWorkingAtOffline(params) {
    this.resetOnDisconnect(!params.keep_working_at_offline);
  }

  ping(params) {
    let unixtime = new Date().getTime();
    let buf = new Uint8Array(params.ping.key.length + 8);
    let upper = Math.floor(unixtime / Math.pow(2, 32));
    let lower = unixtime - upper * Math.pow(2, 32);
    buf[0] = upper >> (8 * 3);
    buf[1] = upper >> (8 * 2);
    buf[2] = upper >> (8 * 1);
    buf[3] = upper >> (8 * 0);
    buf[4] = lower >> (8 * 3);
    buf[5] = lower >> (8 * 2);
    buf[6] = lower >> (8 * 1);
    buf[7] = lower >> (8 * 0);
    for (let i = 0; i < params.ping.key.length; i++) {
      buf[8 + i] = params.ping.key[i];
    }

    this.sendCommand(this._CommandPingPong, buf);
  }

  resetOnDisconnect(mustReset) {
    let buf = new Uint8Array([mustReset ? 1 : 0]);
    this.sendCommand(this._CommandResetOnDisconnect, buf);
  }

  parseFromJson(json) {
    let module = json['system'];
    if (module === undefined) {
      return;
    }

    let schemaData = [
      { uri: '/request/system/reboot', onValid: this.reboot },
      { uri: '/request/system/reset', onValid: this.reset },
      { uri: '/request/system/wait', onValid: this.wait },
      { uri: '/request/system/selfCheck', onValid: this.selfCheck },
      {
        uri: '/request/system/keepWorkingAtOffline',
        onValid: this.keepWorkingAtOffline,
      },
      { uri: '/request/system/ping', onValid: this.ping },
    ];
    let res = this.validateCommandSchema(schemaData, module, 'system');

    if (res.valid === 0) {
      if (res.invalidButLike.length > 0) {
        throw new Error(res.invalidButLike[0].message);
      } else {
        throw new this.WSCommandNotFoundError(`[system]unknown command`);
      }
    }
  }

  pong(objToSend, payload) {
    objToSend['system'] = objToSend['system'] || {};
    const pongServerTime = new Date().getTime();

    if (payload.length >= 16) {
      payload = Buffer.from(payload);
      let obnizTime =
        payload.readUIntBE(0, 4) * Math.pow(2, 32) + payload.readUIntBE(4, 4);
      let pingServerTime =
        payload.readUIntBE(8, 4) * Math.pow(2, 32) + payload.readUIntBE(12, 4);
      let key = [];
      for (let i = 16; i < payload.length; i++) {
        key.push(payload[i]);
      }
      objToSend['system'].pong = {
        key,
        obnizTime,
        pingServerTime,
        pongServerTime,
      };
    } else {
      objToSend['system'].pong = {
        pongServerTime,
      };
    }
  }

  notifyFromBinary(objToSend, func, payload) {
    switch (func) {
      case this._CommandVCC:
        if (payload.byteLength === 3) {
          let value = (payload[1] << 8) + payload[2];
          value = value / 100.0;
          this.envelopWarning(objToSend, 'debug', {
            message: `Low Voltage ${value}v. connect obniz to more powerful USB.`,
          });
        }
        break;

      case this._CommandPingPong:
        this.pong(objToSend, payload);

        break;

      default:
        super.notifyFromBinary(objToSend, func, payload);
        break;
    }
  }
}

module.exports = WSCommand_System;
