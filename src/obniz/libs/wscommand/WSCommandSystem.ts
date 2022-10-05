/**
 * @packageDocumentation
 * @ignore
 */
import WSCommand from './WSCommand';

class WSCommandSystem extends WSCommand {
  module = 0;

  _CommandReboot = 0;

  _CommandReset = 2;
  _CommandSelfCheck = 3;
  _CommandWait = 4;
  _CommandResetOnDisconnect = 5;

  _CommandPingPong = 8;
  _CommandVCC = 9;
  _CommandSleepSeconds = 10;
  _CommandSleepMinute = 11;
  _CommandSleepIoTrigger = 12;

  // Commands

  public reboot() {
    this.sendCommand(this._CommandReboot, null);
  }

  public reset() {
    this.sendCommand(this._CommandReset, null);
  }

  public selfCheck() {
    this.sendCommand(this._CommandSelfCheck, null);
  }

  public wait(params: { wait: number }) {
    const msec = params.wait;
    const buf = new Uint8Array([msec >> 8, msec]);
    this.sendCommand(this._CommandWait, buf);
  }

  public keepWorkingAtOffline(params: { keep_working_at_offline: boolean }) {
    this.resetOnDisconnect(!params.keep_working_at_offline);
  }

  public ping(params: { ping: { key: number[] } }) {
    const unixtime = new Date().getTime();
    const buf = new Uint8Array(params.ping.key.length + 8);
    const upper = Math.floor(unixtime / Math.pow(2, 32));
    const lower = unixtime - upper * Math.pow(2, 32);
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

  public resetOnDisconnect(mustReset: boolean) {
    const buf = new Uint8Array([mustReset ? 1 : 0]);
    this.sendCommand(this._CommandResetOnDisconnect, buf);
  }

  public parseFromJson(json: any) {
    const module = json.system;
    if (module === undefined) {
      return;
    }

    const schemaData = [
      { uri: '/request/system/reboot', onValid: this.reboot },
      { uri: '/request/system/reset', onValid: this.reset },
      { uri: '/request/system/wait', onValid: this.wait },
      { uri: '/request/system/selfCheck', onValid: this.selfCheck },
      {
        uri: '/request/system/keepWorkingAtOffline',
        onValid: this.keepWorkingAtOffline,
      },
      { uri: '/request/system/ping', onValid: this.ping },
      { uri: '/request/system/sleepSeconds', onValid: this.sleepSeconds },
      { uri: '/request/system/sleepMinute', onValid: this.sleepMinute },
      { uri: '/request/system/sleepIoTrigger', onValid: this.sleepIoTrigger },
    ];
    const res = this.validateCommandSchema(schemaData, module, 'system');

    if (res.valid === 0) {
      if (res.invalidButLike.length > 0) {
        throw new Error(res.invalidButLike[0].message);
      } else {
        throw new this.WSCommandNotFoundError(`[system]unknown command`);
      }
    }
  }

  public pong(objToSend: any, payload: Uint8Array) {
    objToSend.system = objToSend.system || {};
    const pongServerTime = new Date().getTime();

    if (payload.length >= 16) {
      const buf = Buffer.from(payload);
      const obnizTime =
        buf.readUIntBE(0, 4) * Math.pow(2, 32) + buf.readUIntBE(4, 4);
      const pingServerTime =
        buf.readUIntBE(8, 4) * Math.pow(2, 32) + buf.readUIntBE(12, 4);
      const key = [];
      for (let i = 16; i < buf.length; i++) {
        key.push(buf.readUInt8(i));
      }
      objToSend.system.pong = {
        key,
        obnizTime,
        pingServerTime,
        pongServerTime,
      };
    } else {
      objToSend.system.pong = {
        pongServerTime,
      };
    }
  }

  public notifyFromBinary(objToSend: any, func: number, payload: Uint8Array) {
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

  public sleepSeconds(params: { sleep_seconds: number }) {
    const sec = params.sleep_seconds;
    const buf = new Uint8Array([sec >> 8, sec]);
    this.sendCommand(this._CommandSleepSeconds, buf);
  }

  public sleepMinute(params: { sleep_minute: number }) {
    const minute = params.sleep_minute;
    const buf = new Uint8Array([minute >> 8, minute]);
    this.sendCommand(this._CommandSleepMinute, buf);
  }

  public sleepIoTrigger(params: { sleep_io_trigger: boolean }) {
    const trigger = params.sleep_io_trigger;
    const triggerNum = trigger === true ? 1 : 0;
    const buf = new Uint8Array([triggerNum]);
    this.sendCommand(this._CommandSleepIoTrigger, buf);
  }
}

export default WSCommandSystem;
