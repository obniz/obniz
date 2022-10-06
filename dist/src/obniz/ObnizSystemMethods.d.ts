/**
 * @packageDocumentation
 * @module ObnizCore
 */
import { ObnizComponents } from './ObnizComponents';
import { ObnizOptions } from './ObnizOptions';
export declare class ObnizSystemMethods extends ObnizComponents {
    constructor(id: string, options?: ObnizOptions);
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
    wait(msec: number): Promise<void>;
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
    reset(): void;
    /**
     * reboot device
     *
     * ```javascript
     * obniz.reboot();
     * ```
     */
    reboot(): void;
    /**
     * @ignore
     */
    selfCheck(): void;
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
    keepWorkingAtOffline(working: any): void;
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
    resetOnDisconnect(reset: boolean): void;
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
    sleepSeconds(sec: number): void;
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
    sleepMinute(minute: number): void;
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
    sleep(date: Date): void;
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
    sleepIoTrigger(trigger: boolean): void;
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
    pingWait(unixtime?: number, rand?: number, forceGlobalNetwork?: boolean): Promise<void>;
}
