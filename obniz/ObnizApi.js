const fetch = require('node-fetch');

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

  get apiVersion() {
    let packageJson = require('../package.json');
    let versionString = packageJson.version;
    return versionString.split('.').shift();
  }

  post(path, params, callback) {
    let url = this.urlBase + path;

    // let query = [];
    //query.push("XXX");
    // if(query.length > 0){
    //   url += "?" + query.join("&");
    // }

    let headers = {};
    headers['Content-Type'] = 'application/json';
    if (this.options.access_token) {
      headers['authorization'] = 'Bearer ' + this.options.access_token;
    }

    let fetchParams = {
      method: 'POST',
      headers,
    };
    if (params) {
      fetchParams['body'] = JSON.stringify(params);
    }

    return fetch(url, fetchParams)
      .then(res => {
        return res.json();
      })
      .then(json => {
        if (typeof callback === 'function') {
          callback(json);
        }
        return new Promise(resolve => {
          resolve(json);
        });
      });
  }

  getState(callback) {
    return this.post('/state', null, callback);
  }

  postJson(json, callback) {
    return this.post('/api/' + this.apiVersion, json, callback); // 1 is api version
  }
}

module.exports = ObnizApi;
