"use strict";
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
        let packageJson = require('../../package.json');
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
            headers.authorization = 'Bearer ' + this.options.access_token;
        }
        let fetchParams = {
            method: 'POST',
            headers,
        };
        if (params) {
            fetchParams.body = JSON.stringify(params);
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,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aXJlKCdub2RlLWZldGNoJyk7XG5cbmNsYXNzIE9ibml6QXBpIHtcbiAgY29uc3RydWN0b3Iob2JuaXpJZCwgb3B0aW9ucykge1xuICAgIHRoaXMuaWQgPSBvYm5peklkO1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgIHRoaXMub3B0aW9ucyA9IHtcbiAgICAgIGFjY2Vzc190b2tlbjogb3B0aW9ucy5hY2Nlc3NfdG9rZW4gfHwgbnVsbCxcbiAgICAgIG9ibml6X3NlcnZlcjogb3B0aW9ucy5vYm5pel9zZXJ2ZXIgfHwgJ2h0dHBzOi8vb2JuaXouaW8nLFxuICAgIH07XG4gICAgdGhpcy51cmxCYXNlID0gdGhpcy5vcHRpb25zLm9ibml6X3NlcnZlciArICcvb2JuaXovJyArIHRoaXMuaWQ7XG4gIH1cblxuICBnZXQgYXBpVmVyc2lvbigpIHtcbiAgICBsZXQgcGFja2FnZUpzb24gPSByZXF1aXJlKCcuLi8uLi9wYWNrYWdlLmpzb24nKTtcbiAgICBsZXQgdmVyc2lvblN0cmluZyA9IHBhY2thZ2VKc29uLnZlcnNpb247XG4gICAgcmV0dXJuIHZlcnNpb25TdHJpbmcuc3BsaXQoJy4nKS5zaGlmdCgpO1xuICB9XG5cbiAgcG9zdChwYXRoLCBwYXJhbXMsIGNhbGxiYWNrKSB7XG4gICAgbGV0IHVybCA9IHRoaXMudXJsQmFzZSArIHBhdGg7XG5cbiAgICAvLyBsZXQgcXVlcnkgPSBbXTtcbiAgICAvL3F1ZXJ5LnB1c2goXCJYWFhcIik7XG4gICAgLy8gaWYocXVlcnkubGVuZ3RoID4gMCl7XG4gICAgLy8gICB1cmwgKz0gXCI/XCIgKyBxdWVyeS5qb2luKFwiJlwiKTtcbiAgICAvLyB9XG5cbiAgICBsZXQgaGVhZGVycyA9IHt9O1xuICAgIGhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddID0gJ2FwcGxpY2F0aW9uL2pzb24nO1xuICAgIGlmICh0aGlzLm9wdGlvbnMuYWNjZXNzX3Rva2VuKSB7XG4gICAgICBoZWFkZXJzLmF1dGhvcml6YXRpb24gPSAnQmVhcmVyICcgKyB0aGlzLm9wdGlvbnMuYWNjZXNzX3Rva2VuO1xuICAgIH1cblxuICAgIGxldCBmZXRjaFBhcmFtcyA9IHtcbiAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgaGVhZGVycyxcbiAgICB9O1xuICAgIGlmIChwYXJhbXMpIHtcbiAgICAgIGZldGNoUGFyYW1zLmJvZHkgPSBKU09OLnN0cmluZ2lmeShwYXJhbXMpO1xuICAgIH1cblxuICAgIHJldHVybiBmZXRjaCh1cmwsIGZldGNoUGFyYW1zKVxuICAgICAgLnRoZW4ocmVzID0+IHtcbiAgICAgICAgcmV0dXJuIHJlcy5qc29uKCk7XG4gICAgICB9KVxuICAgICAgLnRoZW4oanNvbiA9PiB7XG4gICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICBjYWxsYmFjayhqc29uKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICAgICAgcmVzb2x2ZShqc29uKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgfVxuXG4gIGdldFN0YXRlKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMucG9zdCgnL3N0YXRlJywgbnVsbCwgY2FsbGJhY2spO1xuICB9XG5cbiAgcG9zdEpzb24oanNvbiwgY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5wb3N0KCcvYXBpLycgKyB0aGlzLmFwaVZlcnNpb24sIGpzb24sIGNhbGxiYWNrKTsgLy8gMSBpcyBhcGkgdmVyc2lvblxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gT2JuaXpBcGk7XG4iXX0=
