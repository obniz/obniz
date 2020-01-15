"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ObnizComponents_1 = __importDefault(require("./ObnizComponents"));
class ObnizSystemMethods extends ObnizComponents_1.default {
    constructor(id, options) {
        super(id, options);
    }
    wait(msec) {
        if (msec < 0) {
            msec = 0;
        }
        else if (msec > 60 * 1000) {
            msec = 60 * 1000;
        }
        this.send({ system: { wait: msec } });
        return new Promise((resolve) => setTimeout(resolve, msec));
    }
    reset() {
        this.send({ system: { reset: true } });
        this._resetComponents();
    }
    reboot() {
        this.send({ system: { reboot: true } });
    }
    selfCheck() {
        this.send({ system: { self_check: true } });
    }
    keepWorkingAtOffline(working) {
        this.send({ system: { keep_working_at_offline: working } });
    }
    resetOnDisconnect(reset) {
        this.send({ ws: { reset_obniz_on_ws_disconnection: reset } });
    }
    sleepSeconds(sec) {
        if (sec < 1) {
            // min 1s
            sec = 1;
        }
        else if (sec > 60 * 60 * 18) {
            // max 18h (60(s)*60(m)*18(h))
            throw new Error("Error max 18h(64800) sleep");
        }
        this.send({ system: { sleep_seconds: sec } });
    }
    sleepMinute(minute) {
        if (minute < 1) {
            // min 1m
            minute = 1;
        }
        else if (minute > 60 * 24 * 45) {
            // max 45day (60(m)*24(h)*45(d))
            throw new Error("max 45day(64800m) sleep");
        }
        this.send({ system: { sleep_minute: minute } });
    }
    sleep(date) {
        if (!(date instanceof Date)) {
            throw new Error("Date instance argument required");
        }
        let sleepTime = Math.floor((date - new Date()) / 1000);
        this.print_debug(`sleep time : ${sleepTime}s`);
        if (sleepTime <= 0) {
            throw new Error(`past sleep time : ${sleepTime}s`);
        }
        if (sleepTime <= 60 * 60 * 18) {
            this.sleepSeconds(sleepTime);
            return;
        }
        sleepTime = Math.floor(sleepTime / 60);
        this.print_debug(`sleep time : ${sleepTime}m`);
        if (sleepTime <= 60 * 24 * 45) {
            this.sleepMinute(sleepTime);
        }
        else {
            throw new Error(`over max sleep time : ${sleepTime}m`);
        }
    }
    sleepIoTrigger(trigger) {
        if (typeof trigger !== "boolean") {
            throw new Error("sleepIoTrigger need boolean arg");
        }
        this.send({ system: { sleep_io_trigger: trigger } });
    }
    pingWait(unixtime, rand, forceGlobalNetwork) {
        unixtime = unixtime || new Date().getTime();
        const upper = Math.floor(unixtime / Math.pow(2, 32));
        const lower = unixtime - upper * Math.pow(2, 32);
        rand = rand || Math.floor(Math.random() * Math.pow(2, 4));
        const buf = [];
        buf.push((upper >>> (8 * 3)) & 0xff);
        buf.push((upper >>> (8 * 2)) & 0xff);
        buf.push((upper >>> (8 * 1)) & 0xff);
        buf.push((upper >>> (8 * 0)) & 0xff);
        buf.push((lower >>> (8 * 3)) & 0xff);
        buf.push((lower >>> (8 * 2)) & 0xff);
        buf.push((lower >>> (8 * 1)) & 0xff);
        buf.push((lower >>> (8 * 0)) & 0xff);
        buf.push((rand >>> (8 * 3)) & 0xff);
        buf.push((rand >>> (8 * 2)) & 0xff);
        buf.push((rand >>> (8 * 1)) & 0xff);
        buf.push((rand >>> (8 * 0)) & 0xff);
        const obj = {
            system: {
                ping: {
                    key: buf,
                },
            },
        };
        this.send(obj, { local_connect: forceGlobalNetwork ? false : true });
        return new Promise((resolve) => {
            const callback = (systemObj) => {
                for (let i = 0; i < buf.length; i++) {
                    if (buf[i] !== systemObj.pong.key[i]) {
                        return;
                    }
                }
                this.removePongObserver(callback);
                const _upper = ((systemObj.pong.key[0] << (8 * 3)) >>> 0) +
                    ((systemObj.pong.key[1] << (8 * 2)) >>> 0) +
                    ((systemObj.pong.key[2] << (8 * 1)) >>> 0) +
                    ((systemObj.pong.key[3] << (8 * 0)) >>> 0);
                const _lower = ((systemObj.pong.key[4] << (8 * 3)) >>> 0) +
                    ((systemObj.pong.key[5] << (8 * 2)) >>> 0) +
                    ((systemObj.pong.key[6] << (8 * 1)) >>> 0) +
                    ((systemObj.pong.key[7] << (8 * 0)) >>> 0);
                const obnizJsPingUnixtime = _upper * Math.pow(2, 32) + _lower;
                const obnizJsPongUnixtime = new Date().getTime();
                const allTime = obnizJsPongUnixtime - obnizJsPingUnixtime;
                const timeJs2server = systemObj.pong.pingServerTime - obnizJsPingUnixtime;
                const timeServer2Obniz = systemObj.pong.obnizTime - systemObj.pong.pingServerTime;
                const timeObniz2Server = systemObj.pong.pongServerTime - systemObj.pong.obnizTime;
                const timeServer2Js = obnizJsPongUnixtime - systemObj.pong.pongServerTime;
                const str = `ping ${allTime}ms (js --[${timeJs2server}ms]--> server --[${timeServer2Obniz}ms]--> obniz --[${timeObniz2Server}ms]--> server --[${timeServer2Js}ms]--> js)`;
                this.print_debug(str);
                resolve(str);
            };
            this.addPongObserver(callback);
        });
    }
}
exports.default = ObnizSystemMethods;

//# sourceMappingURL=ObnizSystemMethods.js.map
