import fetch = require("node-fetch");

class ObnizApi {
  public id: any;
  public options: any;
  public urlBase: any;

  constructor(obnizId: any, options: any) {
    this.id = obnizId;
    options = options || {};
    this.options = {
      access_token: options.access_token || null,
      obniz_server: options.obniz_server || "https://obniz.io",
    };
    this.urlBase = this.options.obniz_server + "/obniz/" + this.id;
  }

  get apiVersion() {
    import packageJson from "../../package.json";
    const versionString: any = packageJson.version;
    return versionString.split(".").shift();
  }

  public post(path: any, params: any, callback: any) {
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
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        if (typeof callback === "function") {
          callback(json);
        }
        return new Promise((resolve) => {
          resolve(json);
        });
      });
  }

  public getState(callback: any) {
    return this.post("/state", null, callback);
  }

  public postJson(json: any, callback: any) {
    return this.post("/api/" + this.apiVersion, json, callback); // 1 is api version
  }
}

export default ObnizApi;
