"use strict";
/**
 * @packageDocumentation
 * @ignore
 */
// load from webpack
Object.defineProperty(exports, "__esModule", { value: true });
let ws;
if (typeof WebSocket !== "undefined") {
    ws = WebSocket;
}
else if (typeof MozWebSocket !== "undefined") {
    ws = MozWebSocket; // eslint-disable-line
}
else {
    ws = window.WebSocket || window.MozWebSocket;
}
exports.default = ws;
