const ObnizUIs = require('./ObnizUIs');
const ObnizApi = require('./ObnizApi');
const ObnizUtil = require('./libs/utils/util');

/* global showObnizDebugError  */

const isNode = typeof window === 'undefined';

class Obniz extends ObnizUIs {
  constructor(id, options) {
    super(id, options);
    this.util = new ObnizUtil(this);
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

  async loop() {
    if (typeof this.looper === 'function' && this.onConnectCalled) {
      let prom = this.looper();
      if (prom instanceof Promise) {
        await prom;
      }
      setTimeout(this.loop.bind(this), this.repeatInterval || 100);
    }
  }

  _callOnConnect() {
    super._callOnConnect();
    this.loop();
  }

  message(target, message) {
    let targets = [];
    if (typeof target === 'string') {
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

  notifyToModule(obj) {
    super.notifyToModule(obj);
    // notify messaging
    if (typeof obj.message === 'object' && this.onmessage) {
      this.onmessage(obj.message.data, obj.message.from);
    }
    // debug
    if (typeof obj.debug === 'object') {
      if (obj.debug.warning) {
        let msg = 'Warning: ' + obj.debug.warning.message;
        this.warning({ alert: 'warning', message: msg });
      }

      if (obj.debug.error) {
        let msg = 'Error: ' + obj.debug.error.message;
        this.error({ alert: 'error', message: msg });
      }
      if (this.ondebug) {
        this.ondebug(obj.debug);
      }
    }
  }

  warning(msg) {
    if (this.isNode) {
      console.error(msg);
    } else {
      if (msg && typeof msg === 'object' && msg.alert) {
        this.showAlertUI(msg);
        console.log(msg.message);
        return;
      }
      if (typeof showObnizDebugError === 'function') {
        showObnizDebugError(new Error(msg));
      }
      console.log(`Warning: ${msg}`);
    }
  }

  error(msg) {
    if (this.isNode) {
      console.error(msg);
    } else {
      if (msg && typeof msg === 'object' && msg.alert) {
        this.showAlertUI(msg);
        msg = msg.message;
      }
      if (typeof showObnizDebugError === 'function') {
        showObnizDebugError(new Error(msg));
        console.error(new Error(msg));
      } else {
        throw new Error(msg);
      }
    }
  }

  /**
   *
   * @returns {ObnizApi}
   */
  static get api() {
    return ObnizApi;
  }
}

module.exports = Obniz;

/*===================*/
/* Utils */
/*===================*/
try {
  if (!isNode) {
    if (window && window.parent && window.parent.userAppLoaded) {
      window.parent.userAppLoaded(window);
    }

    function showObnizDebugError(err) {//eslint-disable-line
      if (window.parent && window.parent.logger) {
        window.parent.logger.onObnizError(err);
      }
    }
  }
} catch (e) {
  if (e instanceof DOMException) {
    //cross origin iframe
  } else {
    console.error(e);
  }
}

/*===================*/
/* ReadParts */
/*===================*/

require.context = require('./libs/webpackReplace/require-context');
if (require.context && require.context.setBaseDir) {
  require.context.setBaseDir(__dirname);
}

let context = require.context('../parts', true, /\.js$/);
/* webpack loader */
for (let path of context.keys()) {
  const anParts = context(path);
  if (anParts.info) {
    Obniz.PartsRegistrate(anParts);
  }
}
