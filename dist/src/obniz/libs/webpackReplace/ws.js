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
    constructor(...arg0) {
        super(...arg0);
        this.eventFunctionKetMap = {
            open: 'onopen',
            message: 'onmessage',
            close: 'onclose',
            error: 'onerror',
        };
        this.binaryType = 'arraybuffer';
    }
    on(event, f) {
        const functionName = this.eventFunctionKetMap[event];
        if (functionName) {
            this[functionName] = f;
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
