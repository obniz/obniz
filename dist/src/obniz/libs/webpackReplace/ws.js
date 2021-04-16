"use strict";
/**
 * @packageDocumentation
 * @ignore
 */
// load from webpack
Object.defineProperty(exports, "__esModule", { value: true });
let ws;
if (typeof WebSocket !== 'undefined') {
    ws = WebSocket;
}
else if (typeof MozWebSocket !== 'undefined') {
    ws = MozWebSocket; // eslint-disable-line
}
else {
    ws = window.WebSocket || window.MozWebSocket;
}
class CompatibleWebSocket extends ws {
    constructor(url, protocols) {
        super(url, protocols);
        this.eventFunctionKetMap = {
            open: 'onopen',
            message: 'onmessage',
            close: 'onclose',
            error: 'onerror',
        };
        this.binaryType = 'arraybuffer';
    }
    on(event, f) {
        if (event === 'open') {
            this.onopen = (_) => {
                f();
            };
        }
        else if (event === 'message') {
            this.onmessage = (me) => {
                f(me.data);
            };
        }
        else if (event === 'close') {
            this.onclose = (ce) => {
                f(ce.code);
            };
        }
        else if (event === 'error') {
            this.onerror = (e) => {
                f(e);
            };
        }
    }
    removeAllListeners(event) {
        const functionName = this.eventFunctionKetMap[event];
        if (functionName) {
            this[functionName] = null;
        }
    }
}
exports.default = CompatibleWebSocket;
