"use strict";
/**
 * @packageDocumentation
 * @ignore
 */
// load from webpack
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dialog_polyfill_1 = __importDefault(require("dialog-polyfill"));
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const dialog_polyfill_css_1 = __importDefault(require("dialog-polyfill/dist/dialog-polyfill.css"));
exports.default = { dialogPolyfill: dialog_polyfill_1.default, css: dialog_polyfill_css_1.default };
