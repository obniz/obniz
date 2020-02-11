import ObnizSystemMethods from "./ObnizSystemMethods";

export default class ObnizUIs extends ObnizSystemMethods {
  constructor(id: any, options?: any) {
    super(id, options);
  }

  public isValidObnizId(str: string ) {
    if (typeof str !== "string" || str.length < 8) {
      return null;
    }
    str = str.replace("-", "");
    let id: any = parseInt(str);
    if (isNaN(id)) {
      id = null;
    }
    return id !== null;
  }

  public wsconnect(desired_server: any) {
    this.showOffLine();
    if (!this.isValidObnizId(this.id)) {
      if (this.isNode) {
        this.error("invalid obniz id");
      } else {
        const filled: any = _ReadCookie("obniz-last-used") || "";
        this.prompt(
          filled,
          (obnizid: any ) => {
            this.id = obnizid;
            this.wsconnect(desired_server);
          },
        );
      }
      return;
    }
    super.wsconnect(desired_server);
  }

  public showAlertUI(obj: any) {
    if (this.isNode || !document.getElementById(this.options.debug_dom_id)) {
      return;
    }
    const dom: any = `
    <div style="background-color:${
      obj.alert === "warning" ? "#ffee35" : "#ff7b34"
    }">${obj.message}</div>`;
    document
      .getElementById(this.options.debug_dom_id)!
      .insertAdjacentHTML("beforeend", dom);
  }

  public getDebugDoms() {
    if (this.isNode) {
      return;
    }
    const loaderDom: any = document.querySelector("#loader");
    const debugDom: any = document.querySelector("#" + this.options.debug_dom_id);
    let statusDom: any = document.querySelector(
      "#" + this.options.debug_dom_id + " #online-status",
    );
    if (debugDom && !statusDom) {
      statusDom = document.createElement("div");
      statusDom.id = "online-status";
      statusDom.style.color = "#FFF";
      statusDom.style.padding = "5px";
      statusDom.style.textAlign = "center";
      debugDom.insertBefore(statusDom, debugDom.firstChild);
    }
    return {loaderDom, debugDom, statusDom};
  }

  /* online offline */

  public _callOnConnect() {
    this.updateOnlineUI();
    super._callOnConnect();
  }

  public close() {
    super.close();
    this.updateOnlineUI();
  }

  public _disconnectLocal() {
    super._disconnectLocal();
    this.updateOnlineUI();
  }

  public updateOnlineUI() {
    if (this.isNode) {
      return;
    }

    const isConnected: any = this.socket && this.socket.readyState === 1;
    const isConnectedLocally: any =
      this.socket_local && this.socket_local.readyState === 1;
    if (isConnected && isConnectedLocally) {
      this.showOnLine(true);
    } else if (isConnected) {
      this.showOnLine(false);
    } else {
      this.showOffLine();
    }
  }

  public showOnLine(isConnectedLocally: any) {
    if (this.isNode) {
      return;
    }
    const doms: any = this.getDebugDoms();
    if (doms.loaderDom) {
      doms.loaderDom.style.display = "none";
    }
    if (doms.statusDom) {
      doms.statusDom.style.backgroundColor = isConnectedLocally
        ? "#0cd362"
        : "#31965d";
      doms.statusDom.style.color = "#FFF";
      doms.statusDom.innerHTML =
        (this.id ? "online : " + this.id : "online") +
        (isConnectedLocally ? " via local_connect" : " via internet");
    }
  }

  public showOffLine() {
    if (this.isNode) {
      return;
    }

    const doms: any = this.getDebugDoms();
    if (doms.loaderDom) {
      doms.loaderDom.style.display = "block";
    }
    if (doms.statusDom) {
      doms.statusDom.style.backgroundColor = "#d9534f";
      doms.statusDom.style.color = "#FFF";
      doms.statusDom.innerHTML = this.id ? "offline : " + this.id : "offline";
    }
  }
}

/**
 *
 * @ignore
 */
function _ReadCookie(name: any) {
  const nameEQ: any = name + "=";
  const ca: any = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c: any = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1, c.length);
    }
    if (c.indexOf(nameEQ) === 0) {
      return c.substring(nameEQ.length, c.length);
    }
  }
  return null;
}
