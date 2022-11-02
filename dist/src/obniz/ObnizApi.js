"use strict";
/**
 * @packageDocumentation
 * @module ObnizCore
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObnizApi = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const package_1 = __importDefault(require("../../package"));
class ObnizApi {
    constructor(obnizId, options) {
        this.id = obnizId;
        options = options || {};
        this.options = {
            access_token: options.access_token || null,
            obniz_server: options.obniz_server || 'https://obniz.io',
        };
        this.urlBase = this.options.obniz_server + '/obniz/' + this.id;
    }
    /**
     * obniz.js major version string
     */
    get apiVersion() {
        const versionString = package_1.default.version;
        return versionString.split('.').shift();
    }
    /**
     * Get device is online or offline
     *
     * @param callback with result
     */
    getState(callback) {
        return this.postWait('/state', null, callback);
    }
    /**
     * Get device is online or offline
     */
    async getStateWait() {
        const json = await this.postWait('/state', null);
        return json;
    }
    /**
     * post data via obniz REST api
     *
     * @param json
     * @param callback
     */
    async postJsonWait(json, callback) {
        return await this.postWait('/api/' + this.apiVersion, json, callback); // 1 is api version
    }
    async postWait(path, params, callback = null) {
        const url = this.urlBase + path;
        // let query = [];
        // query.push("XXX");
        // if(query.length > 0){
        //   url += "?" + query.join("&");
        // }
        const headers = {};
        headers['Content-Type'] = 'application/json';
        if (this.options.access_token) {
            headers.authorization = 'Bearer ' + this.options.access_token;
        }
        const fetchParams = {
            method: 'POST',
            headers,
        };
        if (params) {
            fetchParams.body = JSON.stringify(params);
        }
        const res = await (0, node_fetch_1.default)(url, fetchParams);
        const json = await res.json();
        if (typeof callback === 'function') {
            callback(json);
        }
        return json;
    }
    get(path, callback) {
        const url = this.urlBase + path;
        // let query = [];
        // query.push("XXX");
        // if(query.length > 0){
        //   url += "?" + query.join("&");
        // }
        const headers = {};
        headers['Content-Type'] = 'application/json';
        if (this.options.access_token) {
            headers.authorization = 'Bearer ' + this.options.access_token;
        }
        const fetchParams = {
            method: 'GET',
            headers,
        };
        return (0, node_fetch_1.default)(url, fetchParams)
            .then((res) => {
            return res.json();
        })
            .then((json) => {
            if (typeof callback === 'function') {
                callback(json);
            }
            return new Promise((resolve) => {
                resolve(json);
            });
        });
    }
}
exports.ObnizApi = ObnizApi;
