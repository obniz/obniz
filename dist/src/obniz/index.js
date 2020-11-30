"use strict";
/**
 * @packageDocumentation
 * @module ObnizCore
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const m5stack_basic_1 = require("./libs/hw/m5stack_basic");
const m5stickc_1 = require("./libs/hw/m5stickc");
const ObnizApi_1 = __importDefault(require("./ObnizApi"));
const ObnizApp_1 = __importDefault(require("./ObnizApp"));
const ObnizDevice_1 = __importDefault(require("./ObnizDevice"));
/**
 * obniz class is the abstract version of obniz Board hardware within JavaScript.
 *
 * By providing obniz id and instantiating it, you can control obniz Board and the connected parts
 * without the details of websocket api.
 *
 *
 * ### obnizOS version and obniz.js version
 *
 * obniz cloud compare your obniz.js version and target device obnizOS version.
 * If your js sdk major number is below from OS version (eg obniz.js is 2.0.0 and obnizOS is 3.0.0) then obniz cloud will alert when connection established.
 * It will work somehow but some functions looses compatibility.
 *
 * ### one device from two program
 *
 * obniz cloud accept multiple websocket connection from multiple obniz.js at same time.
 * every commands from obniz.js will passed to a device and every command from a device will be dispatched to every obniz.js connected to the cloud.
 *
 * But If one of obniz.js established a connection to a device, then target device will send datas only via local connect. So other connected obniz.js only can send datas and never receive datas from a device.
 *
 * If you'd like to receive, you need to specify `local_connect: false` at all of obniz.js to disable local connect.
 *
 */
class Obniz extends ObnizDevice_1.default {
    /**
     * obniz REST api class
     * @returns {ObnizApi}
     */
    static get api() {
        return ObnizApi_1.default;
    }
    /**
     * App Support class
     * @returns {ObnizApp}
     */
    static get App() {
        return ObnizApp_1.default;
    }
}
/**
 * M5StickC device
 */
Obniz.M5StickC = m5stickc_1.M5StickC;
Obniz.M5StackBasic = m5stack_basic_1.M5StackBasic;
/*===================*/
/* Utils */
/*===================*/
try {
    if (typeof window !== "undefined") {
        if (window && window.parent && window.parent.userAppLoaded) {
            window.parent.userAppLoaded(window);
        }
        function showObnizDebugError(err) {
            // eslint-disable-line
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
/**
 * @ignore
 */
const requireContext = require("./libs/webpackReplace/require-context");
require.context = requireContext.default;
if (requireContext.setBaseDir) {
    requireContext.setBaseDir(__dirname);
}
/**
 * @ignore
 */
const context = require.context("../parts", true, /\.js$/);
/* webpack loader */
for (const path of context.keys()) {
    const anParts = context(path);
    if (anParts.info) {
        Obniz.PartsRegistrate(anParts);
    }
    else if (anParts.default.info) {
        // for ts "export default"
        Obniz.PartsRegistrate(anParts.default);
    }
}
module.exports = Obniz;
