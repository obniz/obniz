"use strict";
/**
 * @packageDocumentation
 * @module ObnizCore
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = __importDefault(require("./libs/utils/util"));
const ObnizUIs_1 = __importDefault(require("./ObnizUIs"));
class ObnizDevice extends ObnizUIs_1.default {
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
    constructor(id, options) {
        super(id, options);
        this.util = new util_1.default(this);
    }
    /**
     * @ignore
     * @param msg
     */
    warning(msg) {
        if (this.isNode) {
            console.error(msg);
        }
        else {
            if (msg && typeof msg === "object" && msg.alert) {
                this.showAlertUI(msg);
                console.log(msg.message);
                return;
            }
            if (typeof showObnizDebugError === "function") {
                showObnizDebugError(new Error(msg));
            }
            this.log(`Warning: ${msg}`);
        }
    }
    /**
     * @ignore
     * @param msg
     */
    error(msg) {
        if (!this.isNode) {
            if (msg && typeof msg === "object" && msg.alert) {
                this.showAlertUI(msg);
            }
            if (typeof showObnizDebugError === "function") {
                showObnizDebugError(new Error(msg.message));
            }
        }
        console.error(`${msg.message}`);
    }
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
    message(target, message) {
        let targets = [];
        if (typeof target === "string") {
            targets.push(target);
        }
        else {
            targets = target;
        }
        this.send({
            message: {
                to: targets,
                data: message,
            },
        });
    }
    _callOnConnect() {
        super._callOnConnect();
    }
    notifyToModule(obj) {
        super.notifyToModule(obj);
        // notify messaging
        if (typeof obj.message === "object" && this.onmessage) {
            this.onmessage(obj.message.data, obj.message.from);
        }
        // debug
        if (typeof obj.debug === "object") {
            if (obj.debug.warning) {
                const msg = "Warning: " + obj.debug.warning.message;
                this.warning({ alert: "warning", message: msg });
            }
            if (obj.debug.error) {
                const msg = "Error: " + obj.debug.error.message;
                this.error({ alert: "error", message: msg });
            }
            if (this.ondebug) {
                this.ondebug(obj.debug);
            }
        }
    }
}
exports.default = ObnizDevice;
