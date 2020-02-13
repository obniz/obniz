/**
 * @packageDocumentation
 * @module ObnizCore
 */

import ObnizUtil from "./libs/utils/util";
import ObnizApi from "./ObnizApi";
import {ObnizOptions} from "./ObnizOptions";
import ObnizUIs from "./ObnizUIs";

/**
 * @ignore
 */
declare global {
  var showObnizDebugError: any;
  var MozWebSocket: any;

  interface Window {
    userAppLoaded?: any;
    logger?: any;
    WebSocket: any;
    MozWebSocket: any;
  }
}

class Obniz extends ObnizUIs {

  /**
   *
   * @returns {ObnizApi}
   */
  static get api() {
    return ObnizApi;
  }

  /**
   * @ignore
   */
  public util: any;
  protected looper: any;
  protected repeatInterval: any;
  protected onmessage: any;
  protected ondebug: any;

  constructor(id: any, options?: ObnizOptions) {
    super(id, options);
    this.util = new ObnizUtil(this);
  }

  public repeat(callback: any, interval: any) {
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

  public warning(msg: any) {
    if (this.isNode) {
      console.error(msg);
    } else {
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

  public error(msg: any) {
    if (this.isNode) {
      console.error(msg);
    } else {
      if (msg && typeof msg === "object" && msg.alert) {
        this.showAlertUI(msg);
        msg = msg.message;
      }
      if (typeof showObnizDebugError === "function") {
        showObnizDebugError(new Error(msg));
        console.error(new Error(msg));
      } else {
        throw new Error(msg);
      }
    }
  }

  protected async loop() {
    if (typeof this.looper === "function" && this.onConnectCalled) {
      const prom: any = this.looper();
      if (prom instanceof Promise) {
        await prom;
      }
      setTimeout(this.loop.bind(this), this.repeatInterval || 100);
    }
  }

  protected _callOnConnect() {
    super._callOnConnect();
    this.loop();
  }

  protected message(target: any, message: any) {
    let targets: any = [];
    if (typeof target === "string") {
      targets.push(target);
    } else {
      targets = target;
    }
    this.send({
      message: {
        to: targets,
        data: message,
      },
    });
  }

  protected notifyToModule(obj: any) {
    super.notifyToModule(obj);
    // notify messaging
    if (typeof obj.message === "object" && this.onmessage) {
      this.onmessage(obj.message.data, obj.message.from);
    }
    // debug
    if (typeof obj.debug === "object") {
      if (obj.debug.warning) {
        const msg: any = "Warning: " + obj.debug.warning.message;
        this.warning({alert: "warning", message: msg});
      }

      if (obj.debug.error) {
        const msg: any = "Error: " + obj.debug.error.message;
        this.error({alert: "error", message: msg});
      }
      if (this.ondebug) {
        this.ondebug(obj.debug);
      }
    }
  }
}

export = Obniz;

/*===================*/
/* Utils */
/*===================*/
try {
  if (typeof window !== "undefined") {
    if (window && window.parent && window.parent.userAppLoaded) {
      window.parent.userAppLoaded(window);
    }

    function showObnizDebugError(err: any) {// eslint-disable-line
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
import requireContext = require( "./libs/webpackReplace/require-context");

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
  } else if (anParts.default.info) { // for ts "export default"
    Obniz.PartsRegistrate(anParts.default);
  }
}
