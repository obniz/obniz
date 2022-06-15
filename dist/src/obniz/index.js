"use strict";
/**
 * @packageDocumentation
 * @ignore
 */
const Obniz_1 = require("./Obniz");
/* ===================*/
/* Utils */
/* ===================*/
try {
    if (typeof window !== 'undefined') {
        if (window && window.parent && window.parent.userAppLoaded) {
            window.parent.userAppLoaded(window);
        }
        window.showObnizDebugError = (err) => {
            // eslint-disable-line
            if (window.parent && window.parent.logger) {
                window.parent.logger.onObnizError(err);
            }
        };
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
/* ===================*/
/* ReadParts */
/* ===================*/
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
const context = require.context('../parts', true, /\.js$/);
/* webpack loader */
for (const path of context.keys()) {
    const anParts = context(path);
    if (anParts.info) {
        Obniz_1.Obniz.PartsRegistrate(anParts);
    }
    else if (anParts.default && anParts.default.info) {
        // for ts "export default"
        Obniz_1.Obniz.PartsRegistrate(anParts.default);
    }
}
module.exports = Obniz_1.Obniz;
