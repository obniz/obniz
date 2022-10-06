/**
 * @packageDocumentation
 * @module ObnizCore
 */

import fetch from 'node-fetch';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import packageJson from '../../package';
import { ObnizOptions } from './ObnizOptions'; // pakcage.js will be created from package.json on build.

export class ObnizApi {
  /**
   * obniz.js major version string
   */
  get apiVersion(): string {
    const versionString: any = packageJson.version;
    return versionString.split('.').shift();
  }

  public options: any;
  public urlBase: any;
  private id: string;

  constructor(obnizId: string, options?: ObnizOptions) {
    this.id = obnizId;
    options = options || {};
    this.options = {
      access_token: options.access_token || null,
      obniz_server: options.obniz_server || 'https://obniz.io',
    };
    this.urlBase = this.options.obniz_server + '/obniz/' + this.id;
  }

  /**
   * Get device is online or offline
   *
   * @param callback with result
   */
  public getState(callback: (val: { state: 'online' | 'offline' }) => void) {
    return this.postWait('/state', null, callback);
  }

  /**
   * Get device is online or offline
   */
  public async getStateWait(): Promise<{ state: 'online' | 'offline' }> {
    const json = await this.postWait('/state', null);
    return json;
  }

  /**
   * post data via obniz REST api
   *
   * @param json
   * @param callback
   */
  public async postJsonWait(json: any, callback: (result: any) => void) {
    return await this.postWait('/api/' + this.apiVersion, json, callback); // 1 is api version
  }

  protected async postWait(path: string, params: any, callback: any = null) {
    const url: any = this.urlBase + path;

    // let query = [];
    // query.push("XXX");
    // if(query.length > 0){
    //   url += "?" + query.join("&");
    // }

    const headers: any = {};
    headers['Content-Type'] = 'application/json';
    if (this.options.access_token) {
      headers.authorization = 'Bearer ' + this.options.access_token;
    }

    const fetchParams: any = {
      method: 'POST',
      headers,
    };
    if (params) {
      fetchParams.body = JSON.stringify(params);
    }

    const res = await fetch(url, fetchParams);
    const json = await res.json();
    if (typeof callback === 'function') {
      callback(json);
    }
    return json;
  }

  protected get(path: any, callback: any) {
    const url: any = this.urlBase + path;

    // let query = [];
    // query.push("XXX");
    // if(query.length > 0){
    //   url += "?" + query.join("&");
    // }

    const headers: any = {};
    headers['Content-Type'] = 'application/json';
    if (this.options.access_token) {
      headers.authorization = 'Bearer ' + this.options.access_token;
    }

    const fetchParams: any = {
      method: 'GET',
      headers,
    };

    return fetch(url, fetchParams)
      .then((res: any) => {
        return res.json();
      })
      .then((json: any) => {
        if (typeof callback === 'function') {
          callback(json);
        }
        return new Promise((resolve: any) => {
          resolve(json);
        });
      });
  }
}
