/**
 * @packageDocumentation
 * @module ObnizCore
 */

import fetch from "node-fetch";

// @ts-ignore
import packageJson from "../../package";
import { ObnizOptions } from "./ObnizOptions"; // pakcage.js will be created from package.json on build.

export default class ObnizApi {
  /**
   * obniz.js major version string
   */
  get apiVersion(): string {
    const versionString: any = packageJson.version;
    return versionString.split(".").shift();
  }

  public options: any;
  public urlBase: any;
  private id: string;

  constructor(obnizId: string, options?: ObnizOptions) {
    this.id = obnizId;
    options = options || {};
    this.options = {
      access_token: options.access_token || null,
      obniz_server: options.obniz_server || "https://obniz.io",
    };
    this.urlBase = this.options.obniz_server + "/obniz/" + this.id;
  }

  /**
   * Get device is online or offline
   * @param callback with result
   */
  public getState(callback: (val: { state: "online" | "offline" }) => void) {
    return this.post("/state", null, callback);
  }

  /**
   * post data via obniz REST api
   * @param json
   * @param callback
   */
  public postJson(json: any, callback: (result: any) => void) {
    return this.post("/api/" + this.apiVersion, json, callback); // 1 is api version
  }

  protected post(path: any, params: any, callback: any) {
    const url: any = this.urlBase + path;

    // let query = [];
    // query.push("XXX");
    // if(query.length > 0){
    //   url += "?" + query.join("&");
    // }

    const headers: any = {};
    headers["Content-Type"] = "application/json";
    if (this.options.access_token) {
      headers.authorization = "Bearer " + this.options.access_token;
    }

    const fetchParams: any = {
      method: "POST",
      headers,
    };
    if (params) {
      fetchParams.body = JSON.stringify(params);
    }

    return fetch(url, fetchParams)
      .then((res: any) => {
        return res.json();
      })
      .then((json: any) => {
        if (typeof callback === "function") {
          callback(json);
        }
        return new Promise((resolve: any) => {
          resolve(json);
        });
      });
  }
}
