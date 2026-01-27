/**
 * @packageDocumentation
 * @ignore
 */
import { WSCommandAbstract } from './WSCommandAbstract';

export class WSCommandSystem extends WSCommandAbstract {
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
  _CommandUpdatePingCheckInterval = 18;

  _CommandNotifyTimeStamp = 20;
  _CommandSetQueueMode = 21;
  _CommandSetClock = 22;

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

  /**
   * デバイスのpingの間隔を更新します。これはクラウドから一度切り離されると再度もとに戻ります。
   *
   * @param {number} intervalMilliSec
   */
  updatePingCheckInterval(intervalMilliSec: number) {
    const buf = new Uint8Array(4);
    buf[0] = intervalMilliSec >> (8 * 3);
    buf[1] = intervalMilliSec >> (8 * 2);
    buf[2] = intervalMilliSec >> (8 * 1);
    buf[3] = intervalMilliSec >> (8 * 0);
    this.sendCommand(this._CommandUpdatePingCheckInterval, buf);
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

      { uri: '/request/system/queue_mode', onValid: this.setQueueMode },
      { uri: '/request/system/set_clock', onValid: this.setClock },
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

  public timestamp(objToSend: any, payload: Uint8Array) {
    objToSend.system = objToSend.system || {};

    if (payload.length === 4) {
      const buf = Buffer.from(payload);
      const unixSeconds = buf.readUIntBE(0, 4);
      objToSend.system.timestamp = unixSeconds * 1000;
    } else if (payload.length === 8) {
      const buf = Buffer.from(payload);
      const milliseconds =
        buf.readUIntBE(0, 4) * Math.pow(2, 32) + buf.readUIntBE(4, 4);
      objToSend.system.timestamp = milliseconds;
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
      case this._CommandNotifyTimeStamp:
        this.timestamp(objToSend, payload);
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

  public setQueueMode(params: {
    queue_mode: { interval: number; timestamp: string };
  }) {
    const interval = params.queue_mode.interval;
    const timestamp = params.queue_mode.timestamp;
    const buf = new Uint8Array(9);

    buf[0] = 0;
    if (timestamp === 'none') {
      buf[0] = 0;
    } else if (timestamp === 'unix_seconds') {
      buf[0] = 1;
    } else if (timestamp === 'unix_milliseconds') {
      buf[0] = 2;
    }
    // interval
    buf[1] = interval >> (8 * 3);
    buf[2] = interval >> (8 * 2);
    buf[3] = interval >> (8 * 1);
    buf[4] = interval >> (8 * 0);

    this.sendCommand(this._CommandSetQueueMode, buf);
  }

  public setClock(params: { clock: number }) {
    const unixtime = params.clock;
    const buf = new Uint8Array(8);
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

    this.sendCommand(this._CommandSetClock, buf);
  }
}
