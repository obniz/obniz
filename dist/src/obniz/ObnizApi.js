"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
// @ts-ignore
const package_1 = __importDefault(require("../../package")); // pakcage.js will be created from package.json on build.
class ObnizApi {
    constructor(obnizId, options) {
        this.id = obnizId;
        options = options || {};
        this.options = {
            access_token: options.access_token || null,
            obniz_server: options.obniz_server || "https://obniz.io",
        };
        this.urlBase = this.options.obniz_server + "/obniz/" + this.id;
    }
    get apiVersion() {
        const versionString = package_1.default.version;
        return versionString.split(".").shift();
    }
    post(path, params, callback) {
        const url = this.urlBase + path;
        // let query = [];
        // query.push("XXX");
        // if(query.length > 0){
        //   url += "?" + query.join("&");
        // }
        const headers = {};
        headers["Content-Type"] = "application/json";
        if (this.options.access_token) {
            headers.authorization = "Bearer " + this.options.access_token;
        }
        const fetchParams = {
            method: "POST",
            headers,
        };
        if (params) {
            fetchParams.body = JSON.stringify(params);
        }
        return node_fetch_1.default(url, fetchParams)
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
    getState(callback) {
        return this.post("/state", null, callback);
    }
    postJson(json, callback) {
        return this.post("/api/" + this.apiVersion, json, callback); // 1 is api version
    }
}
exports.default = ObnizApi;

//# sourceMappingURL=ObnizApi.js.map
