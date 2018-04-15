const WSCommand = require("./libs/wscommand");

const isNode = (typeof window === 'undefined');

module.exports = class ObnizConnection {

  constructor(id, options) {
    this.isNode = isNode;
    this.id = id;
    this.socket = null;
    this.socket_local = null;
    this.debugprint = false;
    this.debugs = [];
    this.pongObservers = [];
    this.bufferdAmoundWarnBytes = 100 * 1000; // 100k bytes
    this._prepareComponents();
    if (!options) {
      options = {};
    }
    this.options = {
      binary: options.binary === false ? false : true,
      local_connect: options.local_connect === false ? false : true,
      debug_dom_id: options.debug_dom_id || "obniz-debug",
      auto_connect: options.auto_connect === false ? false : true,
      access_token: options.access_token || null,
      obniz_server: options.obniz_server || "wss://obniz.io"
    };
    if (this.options.binary) {
      this.wscommand = this.constructor.WSCommand;
      let classes = this.constructor.WSCommand.CommandClasses;
      this.wscommands = [];
      for (let class_name in classes) {
        this.wscommands.push(new classes[class_name]());
      }
    }
    if (this.isNode === false) {
      this.showOffLine();
    }
    if (!this.isValidObnizId(this.id)) {
      if (this.isNode) {
        console.error("invalid obniz id");
      }
      else {
        let filled = _ReadCookie("obniz-last-used") || "";
        this.prompt(filled, function (obnizid) {
          this.id = obnizid;
          this.wsconnect();
        }.bind(this));
      }
      return;
    }
    if (this.options.auto_connect) {
      this.wsconnect();
    }
  }

  isValidObnizId(str) {
    if (typeof str != "string" || str.length < 8) {
      return null;
    }
    str = str.replace("-", "");
    let id = parseInt(str);
    if (isNaN(id))
      id = null;
    return id != null;
  }

  prompt(filled, callback) {
    var obnizid = prompt("Please enter obniz id", filled);
    if (!obnizid) {
    } else {
      callback(obnizid);
    }
  }

  static get version(){
    let packageJson = require("../package.json");
    return packageJson.version;
  }

  wsOnOpen() {
    this.print_debug("ws connected");
    // wait for {ws:{ready:true}} object
    if(typeof this.onopen === "function"){
      this.onopen(this);
    }
  }

  wsOnMessage(data) {
    if(this.debugprintBinary && typeof data !== "string" ){
      this.print_debug("" + new Uint8Array(data).toString());
    }

    let json ;
    if(typeof data === "string"){
      json = JSON.parse(data);
    }else if(this.wscommands) { //binary
      json = this.binary2Json(data);
    }

    if(Array.isArray(json)){
      for(let i in json ) {
        this.notifyToModule(json[i]);
      }
    }else{
      //invalid json
    }
  }

  wsOnClose(event) {
    this.print_debug("closed");
    if (this.isNode === false) { this.showOffLine(); }
  
    this.clearSocket(this.socket);
    delete this.socket;

    if(typeof this.onclose === "function"){
      this.onclose(this);
    }

    if(this.options.auto_connect) {
      setTimeout(function () {
        // always connect to mainserver if ws lost
        this.wsconnect();
      }.bind(this), 1000);
    }
  }

  wsOnError(event) {
    // console.error(event);
  }

  wsOnUnexpectedResponse(req, res) {
    let reconnectTime = 1000;
    if (res && res.statusCode == 404) {
      this.print_debug("obniz not online");
    } else {
      // server error or someting
      reconnectTime = 5000;
      this.print_debug("invalid server response " + (res) ? res.statusCode :  '');
    }
    this.clearSocket(this.socket);
    delete this.socket;
    if(this.options.auto_connect) {
      setTimeout(function () {
        // always connect to mainserver if ws lost
        this.wsconnect();
      }.bind(this), reconnectTime);
    }
  }

  wsconnect(desired_server) {
    let server = this.options.obniz_server;
    if (desired_server) {
      server = "" + desired_server;
    }

    this.close();

    let url = server + "/obniz/" + this.id + "/ws/1";
    if (this.constructor.version) {
      url += "?obnizjs="+this.constructor.version;
    }
    if (this.options.access_token) {
      url += "&access_token="+this.options._access_token;
    }
    if (this.wscommand) {
      url += "&accept_binary=true";
    }
    this.print_debug("connecting to " + url);
  
    let socket;
    if (this.isNode) {
      const wsClient = require('ws');
      socket = new wsClient(url);
      socket.on('open', this.wsOnOpen.bind(this));
      socket.on('message', this.wsOnMessage.bind(this));
      socket.on('close', this.wsOnClose.bind(this));
      socket.on('error', this.wsOnError.bind(this));
      socket.on('unexpected-response', this.wsOnUnexpectedResponse.bind(this));
    } else {
      socket = new WebSocket(url);
      socket.binaryType = 'arraybuffer';
      socket.onopen = this.wsOnOpen.bind(this);
      socket.onmessage = function (event) {
        this.wsOnMessage(event.data);
      }.bind(this);
      socket.onclose = this.wsOnClose.bind(this);
      socket.onerror = this.wsOnError.bind(this);
    }
    this.socket = socket;
  }

  _connectLocal(host) {
    const url = 'ws://' + host
    this.print_debug("local connect to " + url)
    let ws;
    if (this.isNode) {
      const wsClient = require('ws');
      ws = new wsClient(url);
      // ws.on('open', this.wsOnOpen.bind(this));
      ws.on('message', (event) => {
        this.print_debug("recvd via local");
        this.wsOnMessage(event.data);
      });
      // ws.on('close', this.wsOnClose.bind(this));
      ws.on('error', (err) => {
        console.error("local websocket error.", err);
      });
      // ws.on('unexpected-response', this.wsOnUnexpectedResponse.bind(this));
    } else {
      ws = new WebSocket(url);
      ws.binaryType = 'arraybuffer';
      ws.onopen = () => {
        this.print_debug("connected to " + url)
        if (this._waitForLocalConnectReadyTimer) {
          clearTimeout(this._waitForLocalConnectReadyTimer);
          this._waitForLocalConnectReadyTimer = null;
          this._callOnConnect();
        }
      }
      ws.onmessage = (event) => {
        this.print_debug("recvd via local");
        this.wsOnMessage(event.data);
      };
      ws.onclose = (event) => {
        console.log('local websocket closed');
        this._disconnectLocal();
      }
      ws.onerror = (err) => {
        console.log("local websocket error.", err);
        this._disconnectLocal();
      }
    }
    this.socket_local = ws;
  }

  _disconnectLocal() {
    if (this._waitForLocalConnectReadyTimer) {
      clearTimeout(this._waitForLocalConnectReadyTimer);
      this._waitForLocalConnectReadyTimer = null;
    }
    if (this.socket_local) {
      this.socket_local.close();
      this.clearSocket(this.socket_local);
      delete this.socket_local;
    }
  }

  clearSocket(socket) {
    if (!socket)
      return
    /* send queue */
    if (this._sendQueueTimer) {
      delete this._sendQueue;
      clearTimeout(this._sendQueueTimer);
      this._sendQueueTimer = null;
    }
    /* unbind */
    if (this.isNode) {
      let shouldRemoveObservers = ['open', 'message', 'close', 'error', 'unexpected-response'];
      for (let i = 0; i < shouldRemoveObservers.length; i++) {
        socket.removeAllListeners(shouldRemoveObservers[i]);
      }
    } else {
      socket.onopen = null;
      socket.onmessage = null;
      socket.onclose = null;
      socket.onerror = null;
    }
  }

  connect(){
    this.wsconnect();
  }

  close() {
    this._drainQueued();
    this._disconnectLocal();
    if (this.socket) {
      this.socket.close(1000, 'close');
      this.clearSocket(this.socket);
      delete this.socket;
    }
  }

  _callOnConnect() {
    if (this.isNode === false) { this.showOnLine(); }
    if (this._waitForLocalConnectReadyTimer) {
      clearTimeout(this._waitForLocalConnectReadyTimer);
      this._waitForLocalConnectReadyTimer = null;
    }
    if (typeof this.onconnect !== "function")
      return;
    const promise = this.onconnect(this);
    if(promise instanceof Promise){
      promise.catch((err) => {
        console.error(err);
      });
    }
  }

  print_debug(str) {
    if (this.debugprint) {
      console.log("Obniz: " + str);
    }
  }

  send(obj) {
    if (!obj || (typeof obj !== "object")) {
      console.log("obnizjs. didnt send ", obj);
      return;
    }
    if (Array.isArray(obj)) {
      for (let i=0; i<obj.length; i++) {
        this.send(obj[i]);
      }
      return;
    }
    if (this.sendPool) { this.sendPool.push(obj); return; }

    let sendData = JSON.stringify([obj]);
    if (this.debugprint) {
      this.print_debug("send: " + sendData);
    }
    /* compress */
    if (this.wscommand) {
      let compressed;
      try {
        compressed = this.wscommand.compress(this.wscommands, JSON.parse(sendData)[0]);
        if (compressed) {
          sendData = compressed;
        }
      } catch(e) {
        this.error('------ errored json -------');
        this.error(sendData)
        throw e;
      }
    }
    
    /* queue sending */
    if(typeof sendData === "string") {
      this._drainQueued();
      this._sendRouted(sendData);
    } else {
      if (this._sendQueue) {
        this._sendQueue.push(sendData);
      } else {
        this._sendQueue = [sendData];
        this._sendQueueTimer = setTimeout(this._drainQueued.bind(this), 1);
      }
    }
  }

  _sendRouted(data) {
    let canSendViaLocal = (this.socket_local && this.socket_local.readyState === 1 && typeof data !== "string")
    if (canSendViaLocal) {
      this.print_debug("send via local");
      this.print_debug(data);
      this.socket_local.send(data);
    } else {
      this.socket.send(data);
    }
  }

  _drainQueued() {
    if (!this._sendQueue) return;
    let expectSize = 0;
    for (let i=0; i<this._sendQueue.length; i++) {
      expectSize += this._sendQueue[i].length;
    }
    let filled = 0;
    let sendData = new Uint8Array(expectSize);
    for (let i=0; i<this._sendQueue.length; i++) {
      sendData.set(this._sendQueue[i], filled);
      filled += this._sendQueue[i].length;
    }
    this._sendRouted(sendData);
    delete this._sendQueue;
    clearTimeout(this._sendQueueTimer);
    this._sendQueueTimer = null;
    
    if (this.socket.bufferedAmount > this.bufferdAmoundWarnBytes) {
      this.error('Warning: over ' + this.socket.bufferedAmount + ' bytes queued');
    }
  }

  _prepareComponents() {

  }


  notifyToModule() {

  }

  static get WSCommand() {
    return WSCommand;
  }

  binary2Json(binary){
    let data = new Uint8Array(binary);
    let json = [];
    while(true) {
      const frame = WSCommand.dequeueOne(data);
      if (!frame) break;
      let obj = {};
      for (var i=0; i<this.wscommands.length; i++) {
        const command = this.wscommands[i];
        if (command.module === frame.module) {
          command.notifyFromBinary(obj, frame.func, frame.payload);
          break;
        }
      }
      json.push(obj);
      data = frame.next;
    }
    return json;
  }

  showOnLine() {

  }

  showOffLine() {

  }
}


function _ReadCookie(name) {
  let nameEQ = name + "=";
  let ca = document.cookie.split(';');
  for(let i=0;i < ca.length;i++) {
    let c = ca[i];
      while (c.charAt(0) === ' ') {
          c = c.substring(1,c.length);
      }
      if (c.indexOf(nameEQ) === 0) {
          return c.substring(nameEQ.length,c.length);
      }
  }
  return null;
}