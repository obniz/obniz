/**
 * @packageDocumentation
 * @ignore
 */
import WSCommand from "./WSCommand";

class WSCommandSystem extends WSCommand {
  public module: any;
  public _CommandReboot: any;
  public _CommandReset: any;
  public _CommandSelfCheck: any;
  public _CommandWait: any;
  public _CommandResetOnDisconnect: any;
  public _CommandPingPong: any;
  public _CommandVCC: any;
  public _CommandSleepSeconds: any;
  public _CommandSleepMinute: any;
  public _CommandSleepIoTrigger: any;
  public sendCommand: any;
  public validateCommandSchema: any;
  public WSCommandNotFoundError: any;
  public envelopWarning: any;

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
    this._CommandSleepSeconds = 10;
    this._CommandSleepMinute = 11;
    this._CommandSleepIoTrigger = 12;
  }

  // Commands

  public reboot(params: any) {
    this.sendCommand(this._CommandReboot, null);
  }

  public reset(params: any) {
    this.sendCommand(this._CommandReset, null);
  }

  public selfCheck(params: any) {
    this.sendCommand(this._CommandSelfCheck, null);
  }

  public wait(params: any) {
    const msec: any = params.wait;
    const buf: any = new Uint8Array([msec >> 8, msec]);
    this.sendCommand(this._CommandWait, buf);
  }

  public keepWorkingAtOffline(params: any) {
    this.resetOnDisconnect(!params.keep_working_at_offline);
  }

  public ping(params: any) {
    const unixtime: any = new Date().getTime();
    const buf: any = new Uint8Array(params.ping.key.length + 8);
    const upper: any = Math.floor(unixtime / Math.pow(2, 32));
    const lower: any = unixtime - upper * Math.pow(2, 32);
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

  public resetOnDisconnect(mustReset: any) {
    const buf: any = new Uint8Array([mustReset ? 1 : 0]);
    this.sendCommand(this._CommandResetOnDisconnect, buf);
  }

  public parseFromJson(json: any) {
    const module: any = json.system;
    if (module === undefined) {
      return;
    }

    const schemaData: any = [
      { uri: "/request/system/reboot", onValid: this.reboot },
      { uri: "/request/system/reset", onValid: this.reset },
      { uri: "/request/system/wait", onValid: this.wait },
      { uri: "/request/system/selfCheck", onValid: this.selfCheck },
      {
        uri: "/request/system/keepWorkingAtOffline",
        onValid: this.keepWorkingAtOffline,
      },
      { uri: "/request/system/ping", onValid: this.ping },
      { uri: "/request/system/sleepSeconds", onValid: this.sleepSeconds },
      { uri: "/request/system/sleepMinute", onValid: this.sleepMinute },
      { uri: "/request/system/sleepIoTrigger", onValid: this.sleepIoTrigger },
    ];
    const res: any = this.validateCommandSchema(schemaData, module, "system");

    if (res.valid === 0) {
      if (res.invalidButLike.length > 0) {
        throw new Error(res.invalidButLike[0].message);
      } else {
        throw new this.WSCommandNotFoundError(`[system]unknown command`);
      }
    }
  }

  public pong(objToSend: any, payload: any) {
    objToSend.system = objToSend.system || {};
    const pongServerTime: any = new Date().getTime();

    if (payload.length >= 16) {
      payload = Buffer.from(payload);
      const obnizTime: any = payload.readUIntBE(0, 4) * Math.pow(2, 32) + payload.readUIntBE(4, 4);
      const pingServerTime: any = payload.readUIntBE(8, 4) * Math.pow(2, 32) + payload.readUIntBE(12, 4);
      const key: any = [];
      for (let i = 16; i < payload.length; i++) {
        key.push(payload[i]);
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

  public notifyFromBinary(objToSend: any, func: any, payload: any) {
    switch (func) {
      case this._CommandVCC:
        if (payload.byteLength === 3) {
          let value: any = (payload[1] << 8) + payload[2];
          value = value / 100.0;
          this.envelopWarning(objToSend, "debug", {
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

  public sleepSeconds(params: any) {
    const sec: any = params.sleep_seconds;
    const buf: any = new Uint8Array([sec >> 8, sec]);
    this.sendCommand(this._CommandSleepSeconds, buf);
  }

  public sleepMinute(params: any) {
    const minute: any = params.sleep_minute;
    const buf: any = new Uint8Array([minute >> 8, minute]);
    this.sendCommand(this._CommandSleepMinute, buf);
  }

  public sleepIoTrigger(params: any) {
    let trigger: any = params.sleep_io_trigger;
    if (trigger === true) {
      trigger = 1;
    } else {
      trigger = 0;
    }
    const buf: any = new Uint8Array([trigger]);
    this.sendCommand(this._CommandSleepIoTrigger, buf);
  }
}

export default WSCommandSystem;
