/**
 * @packageDocumentation
 * @module ObnizCore
 */
import { ObnizErrorMessage } from './ObnizConnection';
import { ObnizOptions } from './ObnizOptions';
import { ObnizUIs } from './ObnizUIs';
/**
 * @ignore
 */
declare global {
    let showObnizDebugError: any;
    let MozWebSocket: any;
    interface Window {
        userAppLoaded?: any;
        logger?: any;
        WebSocket: any;
        MozWebSocket: any;
        showObnizDebugError: any;
    }
}
export declare class ObnizDevice extends ObnizUIs {
    /**
     * @ignore
     */
    util: any;
    /**
     * Receive message. If you want to send message, see [[Obniz.message]]
     *
     * ```javascript
     * // Example
     * obniz.onconnect = function() {
     *   var motor = obniz.wired("ServoMotor", {gnd:0, vcc:1, signal:2});
     *
     *   motor.angle(0);
     *   obniz.onmessage = function(message, from) {
     *     if (message === "pressed") {
     *       motor.angle(85);
     *     }
     *   };
     * }
     * ```
     */
    onmessage: any;
    protected ondebug: any;
    /**
     * We will now instantiate obniz.
     *
     * obniz id is a string. Hyphen '-' is optional, but with just the numbers they can't be accepted.
     *
     * ```javascript
     * new Obniz('1234-5678') // OK
     * new Obniz('12345678') // OK
     * new Obniz(12345678) // Can't accept
     * ```
     *
     * If you connect to obniz which has an access token, provide an option like this
     *
     * ```javascript
     * new Obniz('1234-5678', {access_token: 'your token here'})
     * ```
     *
     * If obniz id is incorrect, connection will never be established. In nodejs, an error occurs.
     * In HTML, obniz.js shows a prompt message. The user can put in a correct obniz id into it.
     * It shows up only when the format is invalid. If you specify obniz id which doesn't exist, this would never be shown.
     *
     * ![](media://obniz_prompt.png)
     *
     * When id is correct, obniz.js will try to connect cloud api and onconnect will be called after connection is established.
     *
     * When obniz Board and the device running obniz.js is expected to be in the same network, obniz.js will try to establish a direct Websocket connection to obniz Board. This is called "local connect". When local connect is avaiable, obniz Board can be controlled with almost all commands without having to go through the cloud. However, the connection to the cloud never gets disconnected even when using local connect.
     * But when cloud connection gets closed, the local connect also gets closed.
     *
     * ![](media://local_connect.png)
     *
     * The timing onconnect() gets called depends on the availability of local connect.
     * obniz.js will wait a little to establish connection via local connect as much as possible.
     * See the flow below.
     *
     * ![](media://onconnect_flow.png)
     *
     * The second parameter when instantiating obniz Board is an option.
     *
     * @param id
     * @param options
     */
    constructor(id: string, options?: ObnizOptions);
    /**
     * @ignore
     * @param msg
     */
    warning(msg: any): void;
    /**
     * @ignore
     * @param msg
     */
    error(msg: ObnizErrorMessage | Error): void;
    /**
     * Send message to obniz clients. If you want receive data, see [[Obniz.onmessage]]
     *
     * ```javascript
     * // Example
     * obniz.onconnect = function(){
     *  var button = obniz.wired("Button",  {signal:0, gnd:1});
     *
     *  button.onchange = function(){
     *    var targets = [
     *      "1234-1231",
     *      "1234-1232",
     *      "1234-1233",
     *      "1234-1234",
     *      "1234-1235",
     *      "1234-1236",
     *      "1234-1237",
     *      "1234-1238",
     *      "1234-1239",
     *      "1234-1230"];
     *
     *    obniz.message(targets, "pressed");
     *   };
     * }
     * ```
     *
     * @param target destination obniz id
     * @param message message data
     */
    message(target: string | string[], message: string): void;
    protected _callOnConnect(): void;
    protected _notifyToModule(obj: any): void;
}
