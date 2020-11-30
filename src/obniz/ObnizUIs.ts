/**
 * @packageDocumentation
 * @module ObnizCore
 */

import dialogPolyfill from "./libs/webpackReplace/dialogPollyfill";
import { ObnizOptions } from "./ObnizOptions";
import ObnizSystemMethods from "./ObnizSystemMethods";

export default class ObnizUIs extends ObnizSystemMethods {
  /**
   * @ignore
   */
  public static _promptQueue: any[] = [];

  /**
   * @ignore
   */
  public static _promptWaiting: boolean = false;

  /**
   * @ignore
   */
  public static _promptCount: number = 0;

  constructor(id: string, options?: ObnizOptions) {
    super(id, options);
  }

  /**
   * This closes the current connection.
   * You need to set auto_connect to false. Otherwise the connection will be recovered.
   *
   * ```javascript
   * var obniz = new Obniz('1234-5678', {
   *   auto_connect: false,
   *   reset_obniz_on_ws_disconnection: false
   * });
   *
   * obniz.connect();
   * obniz.onconnect = async function() {
   *   obniz.io0.output(true);
   *   obniz.close();
   * }
   * ```
   */
  public close() {
    super.close();
    this.updateOnlineUI();
  }

  protected isValidObnizId(str: string): boolean {
    if (typeof str !== "string") {
      return false;
    }

    // IP => accept
    if (this._isIpAddress(str)) {
      return true;
    }

    // Serial Number 'sn_***'
    if (str.startsWith("sn_")) {
      return true;
    }

    // 0000-0000
    if (str.length < 8) {
      return false;
    }
    str = str.replace("-", "");
    let id: any = parseInt(str);
    if (isNaN(id)) {
      id = null;
    }
    return id !== null;
  }

  protected wsconnect(desired_server: any) {
    this.showOffLine();
    if (!this.isValidObnizId(this.id)) {
      if (this.isNode) {
        this.error({ alert: "error", message: "invalid obniz id" });
      } else {
        const filled: any = _ReadCookie("obniz-last-used") || "";
        this.prompt(filled, (obnizid: any) => {
          this.id = obnizid;
          this.wsconnect(desired_server);
        });
      }
      return;
    }
    super.wsconnect(desired_server);
  }

  protected prompt(filled: string = "", callback: any) {
    ObnizUIs._promptQueue.push({ filled, callback });
    this._promptNext();
  }

  protected _promptNext() {
    if (ObnizUIs._promptWaiting) {
      return;
    }
    const next = ObnizUIs._promptQueue.shift();
    if (next) {
      ObnizUIs._promptWaiting = true;
      if (document.readyState !== "loading") {
        this._promptOne(next.filled, next.callback);
      } else {
        document.addEventListener("DOMContentLoaded", () => {
          this._promptOne(next.filled, next.callback);
        });
      }
    }
  }

  protected _promptOne(filled: any, callback: any) {
    ObnizUIs._promptCount++;
    let result = "";
    new Promise((resolve: any) => {
      const text = filled;
      const selectorId = `obniz-id-prompt${ObnizUIs._promptCount}`;
      let css: string = dialogPolyfill.css;
      css +=
        `dialog#${selectorId}::backdrop {\n` +
        "  background: rgba(0, 0, 0, 0.5);\n" +
        "  animation: modal-open .4s ease;\n" +
        "}\n" +
        "\n" +
        `dialog#${selectorId}[open] {\n` +
        "    position: fixed;\n" +
        "    bottom: auto;\n" +
        "    top: 10px;" +
        "    animation: modal-slide .5s ease;\n" +
        "    border: none;" +
        "    padding: 0;" +
        "}\n" +
        `dialog#${selectorId} .contents {\n` +
        "    padding: 1em;" +
        "}\n" +
        `dialog#${selectorId} button {\n` +
        "    background-color: #00a4e3;\n" +
        "    border-color: #00a4e3;\n" +
        "    color: white;\n" +
        "}" +
        "@keyframes modal-open {\n" +
        "  0% {\n" +
        "    opacity: 0;\n" +
        "  }\n" +
        "  100%{\n" +
        "    opacity: 1;\n" +
        "  }\n" +
        "}\n" +
        "\n" +
        "@keyframes modal-slide {\n" +
        "  0% {\n" +
        "    transform: translateY(-20px);\n" +
        "  }\n" +
        "  100%{\n" +
        "    transform: translateY(0);\n" +
        "  }\n" +
        "}";

      let html = "";
      html += `<dialog id='${selectorId}'><div class="contents">`;
      html += `Connect obniz device`;
      if (ObnizUIs._promptCount > 1) {
        html += `(${ObnizUIs._promptCount})`;
      }
      html += `<br/>`;
      html += ` <form method="dialog">`;
      html += ` <input type="text" name="obniz-id" id="return_value" value="${text}" placeholder="obniz id">`;
      html += '  <button id="close">Connect</button>';
      html += "</form>";
      html += "</div></dialog>";
      html += "<style>";
      html += css;
      html += "</style>";

      const div = document.createElement("div");
      div.innerHTML = html;
      const dialog: HTMLDialogElement = div.querySelector("dialog") as HTMLDialogElement;
      dialog.addEventListener("click", () => {
        // cancel
        (dialog.querySelector("#return_value") as HTMLInputElement).value = "";
        dialog.close();
        resolve();
      });
      (dialog.querySelector(".contents") as HTMLElement).addEventListener("click", (event) => {
        event.stopPropagation();
      });

      dialog.addEventListener("close", (param) => {
        const inputValue = (dialog.querySelector("#return_value") as HTMLInputElement).value;
        div.parentElement!.removeChild(div);
        result = inputValue;
        resolve();
      });

      dialog.addEventListener("cancel", (param) => {
        // escape key
        const inputValue = (dialog.querySelector("#return_value") as HTMLInputElement).value;
        div.parentElement!.removeChild(div);
        resolve();
      });
      document.body.appendChild(div);
      dialogPolyfill.dialogPolyfill.registerDialog(dialog);
      dialog.showModal();
    }).then(() => {
      ObnizUIs._promptWaiting = false;

      if (result && result.length > 0) {
        // @ts-ignore
        callback(result);
      }
      this._promptNext();
    });
  }

  protected showAlertUI(obj: any) {
    if (this.isNode || !document.getElementById(this.options.debug_dom_id)) {
      return;
    }
    const dom: any = `
    <div style="background-color:${obj.alert === "warning" ? "#ffee35" : "#ff7b34"}">${obj.message}</div>`;
    document.getElementById(this.options.debug_dom_id)!.insertAdjacentHTML("beforeend", dom);
  }

  protected getDebugDoms() {
    if (this.isNode) {
      return;
    }
    const loaderDom: any = document.querySelector("#loader");
    const debugDom: any = document.querySelector("#" + this.options.debug_dom_id);
    let statusDom: any = document.querySelector("#" + this.options.debug_dom_id + " #online-status");
    if (debugDom && !statusDom) {
      statusDom = document.createElement("div");
      statusDom.id = "online-status";
      statusDom.style.color = "#FFF";
      statusDom.style.padding = "5px";
      statusDom.style.textAlign = "center";
      debugDom.insertBefore(statusDom, debugDom.firstChild);
    }
    return { loaderDom, debugDom, statusDom };
  }

  /* online offline */

  protected _callOnConnect() {
    this.updateOnlineUI();
    super._callOnConnect();
  }

  protected _disconnectLocal() {
    super._disconnectLocal();
    this.updateOnlineUI();
  }

  protected updateOnlineUI() {
    if (this.isNode) {
      return;
    }

    const isConnected: any = this.socket && this.socket.readyState === 1;
    const isConnectedLocally: any = this.socket_local && this.socket_local.readyState === 1;
    if (isConnected && isConnectedLocally) {
      this.showOnLine(true);
    } else if (isConnected) {
      this.showOnLine(false);
    } else {
      this.showOffLine();
    }
  }

  protected showOnLine(isConnectedLocally: any) {
    if (this.isNode) {
      return;
    }
    const doms: any = this.getDebugDoms();
    if (doms.loaderDom) {
      doms.loaderDom.style.display = "none";
    }
    if (doms.statusDom) {
      doms.statusDom.style.backgroundColor = isConnectedLocally ? "#0cd362" : "#31965d";
      doms.statusDom.style.color = "#FFF";
      doms.statusDom.innerHTML =
        (this.id ? "online : " + this.id : "online") + (isConnectedLocally ? " via local_connect" : " via internet");
    }
  }

  protected showOffLine() {
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
