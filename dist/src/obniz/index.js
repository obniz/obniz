"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const util_1 = __importDefault(require("./libs/utils/util"));
const ObnizApi_1 = __importDefault(require("./ObnizApi"));
const ObnizUIs_1 = __importDefault(require("./ObnizUIs"));
const isNode = typeof window === "undefined";
class Obniz extends ObnizUIs_1.default {
    constructor(id, options) {
        super(id, options);
        this.util = new util_1.default(this);
    }
    repeat(callback, interval) {
        if (this.looper) {
            this.looper = callback;
            this.repeatInterval = interval || this.repeatInterval || 100;
            return;
        }
        this.looper = callback;
        this.repeatInterval = interval || 100;
        if (this.onConnectCalled) {
            this.loop();
        }
    }
    loop() {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof this.looper === "function" && this.onConnectCalled) {
                const prom = this.looper();
                if (prom instanceof Promise) {
                    yield prom;
                }
                setTimeout(this.loop.bind(this), this.repeatInterval || 100);
            }
        });
    }
    _callOnConnect() {
        super._callOnConnect();
        this.loop();
    }
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
            console.log(`Warning: ${msg}`);
        }
    }
    error(msg) {
        if (this.isNode) {
            console.error(msg);
        }
        else {
            if (msg && typeof msg === "object" && msg.alert) {
                this.showAlertUI(msg);
                msg = msg.message;
            }
            if (typeof showObnizDebugError === "function") {
                showObnizDebugError(new Error(msg));
                console.error(new Error(msg));
            }
            else {
                throw new Error(msg);
            }
        }
    }
    /**
     *
     * @returns {ObnizApi}
     */
    static get api() {
        return ObnizApi_1.default;
    }
}
/*===================*/
/* Utils */
/*===================*/
try {
    if (!isNode) {
        if (window && window.parent && window.parent.userAppLoaded) {
            window.parent.userAppLoaded(window);
        }
        function showObnizDebugError(err) {
            if (window.parent && window.parent.logger) {
                window.parent.logger.onObnizError(err);
            }
        }
    }
}
catch (e) {
    if (e instanceof DOMException) {
        // cross origin iframe
    }
    else {
        console.error(e);
    }
}
/*===================*/
/* ReadParts */
/*===================*/
const requireContext = require("./libs/webpackReplace/require-context");
require.context = requireContext.default;
if (requireContext.setBaseDir) {
    requireContext.setBaseDir(__dirname);
}
const context = require.context("../parts", true, /\.js$/);
/* webpack loader */
for (const path of context.keys()) {
    const anParts = context(path);
    if (anParts.info) {
        Obniz.PartsRegistrate(anParts);
    }
}
module.exports = Obniz;

//# sourceMappingURL=index.js.map
