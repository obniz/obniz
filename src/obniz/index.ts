import { Obniz } from "./Obniz";

/*===================*/
/* Utils */
/*===================*/
try {
  if (typeof window !== "undefined") {
    if (window && window.parent && window.parent.userAppLoaded) {
      window.parent.userAppLoaded(window);
    }

    function showObnizDebugError(err: any) {
      // eslint-disable-line
      if (window.parent && window.parent.logger) {
        window.parent.logger.onObnizError(err);
      }
    }
  }
} catch (e) {
  if (e instanceof DOMException) {
    // cross origin iframe
  } else {
    console.error(e);
  }
}

/*===================*/
/* ReadParts */
/*===================*/
/**
 * @ignore
 */
import requireContext = require("./libs/webpackReplace/require-context");

require.context = requireContext.default;
if (requireContext.setBaseDir) {
  requireContext.setBaseDir(__dirname);
}

/**
 * @ignore
 */
const context: any = require.context("../parts", true, /\.js$/);
/* webpack loader */
for (const path of context.keys()) {
  const anParts: any = context(path);
  if (anParts.info) {
    Obniz.PartsRegistrate(anParts);
  } else if (anParts.default.info) {
    // for ts "export default"
    Obniz.PartsRegistrate(anParts.default);
  }
}

export = Obniz;
