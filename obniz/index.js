
const ObnizUIs = require('./ObnizUIs');

/* global showObnizDebugError  */

const isNode = (typeof window === 'undefined');

module.exports = class Obniz extends ObnizUIs {

  constructor(id, options) {
    super(id, options);
  }

  repeat(callback, interval) {
    if (this.looper) {
      this.looper = callback;
      return;
    }
    this.looper = callback;
    let self = this;
    if (!interval)
      interval = 100;
    async function loop() {
      if (typeof (self.looper) === "function") {
        await self.looper();
        setTimeout(loop, interval);
      }
    }
    loop();
  }

  wsOnClose(){
    super.wsOnClose();
    if (this.looper) {
      this.looper = null;
    }
  }

  message(target, message) {
    let targets = [];
    if (typeof (target) === "string") {
      targets.push(target);
    } else {
      targets = target;
    }
    this.send({
      message: {
        to: targets,
        data: message
      }
    });
  }

  warning(msg) {
    if (this.isNode) {
      console.error(msg);
    } else {
      if (msg && typeof msg === "object" && msg.alert) {
        this.showAlertUI(msg);
        console.log(msg.message);
        return;
      }
      if (typeof (showObnizDebugError) === "function") {
        showObnizDebugError(new Error(msg));
      } else {
        throw new Error(msg);
      }
    }
  }

  error(msg) {
    if (this.isNode) {
      console.error(msg);
    } else {
      if (msg && typeof msg === "object" && msg.alert) {
        this.showAlertUI(msg);
        msg = msg.message;
      }
      if (typeof (showObnizDebugError) === "function") {
        showObnizDebugError(new Error(msg));
        console.error(new Error(msg));
      } else {
        throw new Error(msg);
      }
    }
  }
}

/*===================*/
/* Utils */
/*===================*/
if (!isNode) {
  if(window && window.parent && window.parent.userAppLoaded){
    window.parent.userAppLoaded(window);
  }

  function showObnizDebugError(err) {
    if(window.parent && window.parent.logger){
      window.parent.logger.onObnizError(err);
    }else{ throw err; }
  }
}

/*===================*/
/* ReadParts */
/*===================*/
require.context = require('./libs/webpackReplace/require-context');
if(require.context && require.context.setBaseDir){require.context.setBaseDir(__dirname);}
let context = require.context(  "../parts", true, /\.js$/);
for( let path of context.keys()){
  context(path);
}

