"use strict";
/**
 * @packageDocumentation
 * @module ObnizCore
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObnizSystemMethods = void 0;
const ObnizComponents_1 = require("./ObnizComponents");
class ObnizSystemMethods extends ObnizComponents_1.ObnizComponents {
    constructor(id, options) {
        super(id, options);
    }
    /**
     * This pauses obniz Board for a period given in terms of ms (millisecond).
     *
     * ```javascript
     * // Javascript Example
     * led.on();
     * obniz.wait(1000); // led ON 1sec.
     * led.off();
     * ```
     *
     * This method pauses only obniz Board, not JavaScript.
     *
     * ```javascript
     * // Javascript Example
     * var time = new Date();
     * led.on();
     * obniz.wait(1000); // led ON 1sec.
     * led.off();
     * console.log((new Date()).getTime() - time.getTime()) // 0 or very few ms. not 1000ms.
     * ```
     *
     * However, when you call this method together with the await function, JavaScript will pause for the given period in ms.
     *
     * ```javascript
     * // Javascript Example
     * var time = new Date();
     * led.on();
     * await obniz.wait(1000); // led ON 1sec.
     * led.off();
     * console.log((new Date()).getTime() - time.getTime()) // => about 1000
     * ```
     *
     * @param msec
     */
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
    /**
     * This forces the obniz Board to go back to the initial state when the power was just turned on.
     *
     * ```javascript
     * // Example
     * obniz = new Obniz("1234-5678");
     * obniz.onconnect = function() {
     *   obniz.reset();
     * }
     * ```
     */
    reset() {
        this.send({ system: { reset: true } });
        this._resetComponents();
    }
    /**
     * reboot device
     *
     * ```javascript
     * obniz.reboot();
     * ```
     */
    reboot() {
        this.send({ system: { reboot: true } });
    }
    /**
     * @ignore
     */
    selfCheck() {
        this.send({ system: { self_check: true } });
    }
    /**
     * By default, obniz Board resets after disconnection from the cloud.
     * It means the output value and pwm will all stop at that point.
     * But the above function with the argument true can nullify that default setting and change it to "do not reset when offline".
     * This configuration remains as long as obniz Board is on.
     *
     * ```javascript
     * // Example
     * obniz.keepWorkingAtOffline(true);
     * ```
     *
     * @param working
     */
    keepWorkingAtOffline(working) {
        this.send({ system: { keep_working_at_offline: working } });
    }
    /**
     *
     * This lets you change the setting of `reset_obniz_on_ws_disconnection` after connection is established.
     *
     * By default, obniz cloud resets target obniz Board when the all websocket to obniz cloud was closed.
     * It means the output value and pwm will all stop at that point.
     * With the above function, you can nullify these resetting activities.
     * This configuration will remain until target obniz Board gets disconnected.
     * Set this function to false to keep working without any of the websocket connections.
     *
     *
     * ```javascript
     * // Example
     * obniz.resetOnDisconnect(false);
     * ```
     *
     * @param reset
     */
    resetOnDisconnect(reset) {
        this.send({ ws: { reset_obniz_on_ws_disconnection: reset } }, { connect_check: false });
    }
    /**
     * Action only with obniz Board 1Y.
     *
     * Obniz Board sleeps for the value specified in seconds.
     *
     * ```javascript
     * // JavaScript example
     * obniz.sleepSeconds (60); // 60 seconds
     * ```
     *
     * @param sec up to 64800 seconds (18 hours).
     */
    sleepSeconds(sec) {
        if (sec < 1) {
            // min 1s
            sec = 1;
        }
        else if (sec > 60 * 60 * 18) {
            // max 18h (60(s)*60(m)*18(h))
            throw new Error('Error max 18h(64800) sleep');
        }
        this.send({ system: { sleep_seconds: sec } });
    }
    /**
     * Action only with obniz Board 1Y.
     *
     * Obniz Board sleeps for the value specified in minutes.
     *
     *
     *
     * ```javascript
     * // JavaScript example
     * obniz.sleepMinute (60); // 60 minutes
     * ```
     *
     * @param minute up to 64800 minutes(45 days ).
     */
    sleepMinute(minute) {
        if (minute < 1) {
            // min 1m
            minute = 1;
        }
        else if (minute > 60 * 24 * 45) {
            // max 45day (60(m)*24(h)*45(d))
            throw new Error('max 45day(64800m) sleep');
        }
        this.send({ system: { sleep_minute: minute } });
    }
    /**
     * Action only with obniz Board 1Y.
     *
     * Obniz Board sleeps for the value specified in Date type.
     * Sleep for up to 45 days (64800 minutes).
     *
     * ```javascript
     * // JavaScript example
     * let dt = new Date();
     * dt.setHours(dt.getHours () + 1,0,0,0);
     * obniz.sleep(dt);
     * ```
     *
     * @param date
     */
    sleep(date) {
        if (!(date instanceof Date)) {
            throw new Error('Date instance argument required');
        }
        let sleepTime = Math.floor((date - new Date()) / 1000);
        this._print_debug(`sleep time : ${sleepTime}s`);
        if (sleepTime <= 0) {
            throw new Error(`past sleep time : ${sleepTime}s`);
        }
        if (sleepTime <= 60 * 60 * 18) {
            this.sleepSeconds(sleepTime);
            return;
        }
        sleepTime = Math.floor(sleepTime / 60);
        this._print_debug(`sleep time : ${sleepTime}m`);
        if (sleepTime <= 60 * 24 * 45) {
            this.sleepMinute(sleepTime);
        }
        else {
            throw new Error(`over max sleep time : ${sleepTime}m`);
        }
    }
    /**
     * Action only with obniz Board 1Y.
     *
     * It returns from sleep depending on the pin state of IO0.
     *
     *
     * ```javascript
     * // JavaScript example
     * obniz.sleepIoTrigger (true);
     * ```
     *
     * @param trigger
     *
     * - true: Rise (LOW -> HIGH)
     * - false: Falling  (HIGH -> LOW)
     */
    sleepIoTrigger(trigger) {
        if (typeof trigger !== 'boolean') {
            throw new Error('sleepIoTrigger need boolean arg');
        }
        this.send({ system: { sleep_io_trigger: trigger } });
    }
    /**
     * Ping to obniz device and wait pong response.
     *
     * If debugprint option enabled, it display ping/pong response time on console.
     *
     * ```javascript
     * await obniz.pingWait(); //waiting pong.
     * ```
     *
     * @param unixtime start time of measure response time
     * @param rand Unique identifier of ping data
     * @param forceGlobalNetwork
     */
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
                this._print_debug(str);
                resolve(str);
            };
            this.addPongObserver(callback);
        });
    }
}
exports.ObnizSystemMethods = ObnizSystemMethods;
