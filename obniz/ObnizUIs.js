const ObnizSystemMethods = require('./ObnizSystemMethods');

module.exports = class ObnizUIs extends ObnizSystemMethods {
  constructor(id, options) {
    super(id, options);
  }

  isValidObnizId(str) {
    if (typeof str != 'string' || str.length < 8) {
      return null;
    }
    str = str.replace('-', '');
    let id = parseInt(str);
    if (isNaN(id)) id = null;
    return id != null;
  }

  wsconnect(desired_server) {
    this.showOffLine();
    if (!this.isValidObnizId(this.id)) {
      if (this.isNode) {
        this.error('invalid obniz id');
      } else {
        let filled = _ReadCookie('obniz-last-used') || '';
        this.prompt(
          filled,
          function(obnizid) {
            this.id = obnizid;
            this.wsconnect(desired_server);
          }.bind(this)
        );
      }
      return;
    }
    super.wsconnect(desired_server);
  }

  showAlertUI(obj) {
    if (this.isNode || !document.getElementById(this.options.debug_dom_id)) {
      return;
    }
    let dom = `
    <div style="background-color:${
      obj.alert === 'warning' ? '#ffee35' : '#ff7b34'
    }">${obj.message}</div>`;
    document
      .getElementById(this.options.debug_dom_id)
      .insertAdjacentHTML('beforeend', dom);
  }

  getDebugDoms() {
    if (this.isNode) {
      return;
    }
    let loaderDom = document.querySelector('#loader');
    let debugDom = document.querySelector('#' + this.options.debug_dom_id);
    let statusDom = document.querySelector(
      '#' + this.options.debug_dom_id + ' #online-status'
    );
    if (debugDom && !statusDom) {
      statusDom = document.createElement('div');
      statusDom.id = 'online-status';
      statusDom.style.color = '#FFF';
      statusDom.style.padding = '5px';
      statusDom.style.textAlign = 'center';
      debugDom.insertBefore(statusDom, debugDom.firstChild);
    }
    return { loaderDom: loaderDom, debugDom: debugDom, statusDom: statusDom };
  }

  /* online offline */

  _callOnConnect() {
    this.updateOnlineUI();
    super._callOnConnect();
  }

  close() {
    super.close();
    this.updateOnlineUI();
  }

  _disconnectLocal() {
    super._disconnectLocal();
    this.updateOnlineUI();
  }

  updateOnlineUI() {
    if (this.isNode) {
      return;
    }

    const isConnected = this.socket && this.socket.readyState === 1;
    const isConnectedLocally =
      this.socket_local && this.socket_local.readyState === 1;
    if (isConnected && isConnectedLocally) {
      this.showOnLine(true);
    } else if (isConnected) {
      this.showOnLine(false);
    } else {
      this.showOffLine();
    }
  }

  showOnLine(isConnectedLocally) {
    if (this.isNode) {
      return;
    }
    const doms = this.getDebugDoms();
    if (doms.loaderDom) {
      doms.loaderDom.style.display = 'none';
    }
    if (doms.statusDom) {
      doms.statusDom.style.backgroundColor = isConnectedLocally
        ? '#0cd362'
        : '#31965d';
      doms.statusDom.style.color = '#FFF';
      doms.statusDom.innerHTML =
        (this.id ? 'online : ' + this.id : 'online') +
        (isConnectedLocally ? ' via local_connect' : ' via internet');
    }
  }

  showOffLine() {
    if (this.isNode) {
      return;
    }

    const doms = this.getDebugDoms();
    if (doms.loaderDom) {
      doms.loaderDom.style.display = 'block';
    }
    if (doms.statusDom) {
      doms.statusDom.style.backgroundColor = '#d9534f';
      doms.statusDom.style.color = '#FFF';
      doms.statusDom.innerHTML = this.id ? 'offline : ' + this.id : 'offline';
    }
  }
};

function _ReadCookie(name) {
  let nameEQ = name + '=';
  let ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1, c.length);
    }
    if (c.indexOf(nameEQ) === 0) {
      return c.substring(nameEQ.length, c.length);
    }
  }
  return null;
}
