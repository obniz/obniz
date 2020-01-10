"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
// @ts-ignore
const packageJson = require("../../package.json");
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
        const versionString = packageJson.version;
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9vYm5pei9PYm5pekFwaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDREQUErQjtBQUUvQixhQUFhO0FBQ2Isa0RBQW9EO0FBRXBELE1BQU0sUUFBUTtJQUtaLFlBQVksT0FBWSxFQUFFLE9BQVk7UUFDcEMsSUFBSSxDQUFDLEVBQUUsR0FBRyxPQUFPLENBQUM7UUFDbEIsT0FBTyxHQUFHLE9BQU8sSUFBSSxFQUFFLENBQUM7UUFDeEIsSUFBSSxDQUFDLE9BQU8sR0FBRztZQUNiLFlBQVksRUFBRSxPQUFPLENBQUMsWUFBWSxJQUFJLElBQUk7WUFDMUMsWUFBWSxFQUFFLE9BQU8sQ0FBQyxZQUFZLElBQUksa0JBQWtCO1NBQ3pELENBQUM7UUFDRixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxHQUFHLFNBQVMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO0lBQ2pFLENBQUM7SUFFRCxJQUFJLFVBQVU7UUFFWixNQUFNLGFBQWEsR0FBUSxXQUFXLENBQUMsT0FBTyxDQUFDO1FBQy9DLE9BQU8sYUFBYSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUMxQyxDQUFDO0lBRU0sSUFBSSxDQUFDLElBQVMsRUFBRSxNQUFXLEVBQUUsUUFBYTtRQUMvQyxNQUFNLEdBQUcsR0FBUSxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztRQUVyQyxrQkFBa0I7UUFDbEIscUJBQXFCO1FBQ3JCLHdCQUF3QjtRQUN4QixrQ0FBa0M7UUFDbEMsSUFBSTtRQUVKLE1BQU0sT0FBTyxHQUFRLEVBQUUsQ0FBQztRQUN4QixPQUFPLENBQUMsY0FBYyxDQUFDLEdBQUcsa0JBQWtCLENBQUM7UUFDN0MsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRTtZQUM3QixPQUFPLENBQUMsYUFBYSxHQUFHLFNBQVMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQztTQUMvRDtRQUVELE1BQU0sV0FBVyxHQUFRO1lBQ3ZCLE1BQU0sRUFBRSxNQUFNO1lBQ2QsT0FBTztTQUNSLENBQUM7UUFDRixJQUFJLE1BQU0sRUFBRTtZQUNWLFdBQVcsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUMzQztRQUVELE9BQU8sb0JBQUssQ0FBQyxHQUFHLEVBQUUsV0FBVyxDQUFDO2FBQzNCLElBQUksQ0FBRSxDQUFDLEdBQVEsRUFBRSxFQUFFO1lBQ2xCLE9BQU8sR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3BCLENBQUMsQ0FBQzthQUNELElBQUksQ0FBQyxDQUFDLElBQVMsRUFBRSxFQUFFO1lBQ2xCLElBQUksT0FBTyxRQUFRLEtBQUssVUFBVSxFQUFFO2dCQUNsQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDaEI7WUFDRCxPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBWSxFQUFHLEVBQUU7Z0JBQ25DLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNoQixDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVNLFFBQVEsQ0FBQyxRQUFhO1FBQzNCLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQzdDLENBQUM7SUFFTSxRQUFRLENBQUMsSUFBUyxFQUFFLFFBQWE7UUFDdEMsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLG1CQUFtQjtJQUNsRixDQUFDO0NBQ0Y7QUFFRCxrQkFBZSxRQUFRLENBQUMiLCJmaWxlIjoic3JjL29ibml6L09ibml6QXBpLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGZldGNoIGZyb20gXCJub2RlLWZldGNoXCI7XG5cbi8vIEB0cy1pZ25vcmVcbmltcG9ydCBwYWNrYWdlSnNvbiA9IHJlcXVpcmUoIFwiLi4vLi4vcGFja2FnZS5qc29uXCIpO1xuXG5jbGFzcyBPYm5pekFwaSB7XG4gIHB1YmxpYyBpZDogYW55O1xuICBwdWJsaWMgb3B0aW9uczogYW55O1xuICBwdWJsaWMgdXJsQmFzZTogYW55O1xuXG4gIGNvbnN0cnVjdG9yKG9ibml6SWQ6IGFueSwgb3B0aW9uczogYW55KSB7XG4gICAgdGhpcy5pZCA9IG9ibml6SWQ7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgdGhpcy5vcHRpb25zID0ge1xuICAgICAgYWNjZXNzX3Rva2VuOiBvcHRpb25zLmFjY2Vzc190b2tlbiB8fCBudWxsLFxuICAgICAgb2JuaXpfc2VydmVyOiBvcHRpb25zLm9ibml6X3NlcnZlciB8fCBcImh0dHBzOi8vb2JuaXouaW9cIixcbiAgICB9O1xuICAgIHRoaXMudXJsQmFzZSA9IHRoaXMub3B0aW9ucy5vYm5pel9zZXJ2ZXIgKyBcIi9vYm5pei9cIiArIHRoaXMuaWQ7XG4gIH1cblxuICBnZXQgYXBpVmVyc2lvbigpIHtcblxuICAgIGNvbnN0IHZlcnNpb25TdHJpbmc6IGFueSA9IHBhY2thZ2VKc29uLnZlcnNpb247XG4gICAgcmV0dXJuIHZlcnNpb25TdHJpbmcuc3BsaXQoXCIuXCIpLnNoaWZ0KCk7XG4gIH1cblxuICBwdWJsaWMgcG9zdChwYXRoOiBhbnksIHBhcmFtczogYW55LCBjYWxsYmFjazogYW55KSB7XG4gICAgY29uc3QgdXJsOiBhbnkgPSB0aGlzLnVybEJhc2UgKyBwYXRoO1xuXG4gICAgLy8gbGV0IHF1ZXJ5ID0gW107XG4gICAgLy8gcXVlcnkucHVzaChcIlhYWFwiKTtcbiAgICAvLyBpZihxdWVyeS5sZW5ndGggPiAwKXtcbiAgICAvLyAgIHVybCArPSBcIj9cIiArIHF1ZXJ5LmpvaW4oXCImXCIpO1xuICAgIC8vIH1cblxuICAgIGNvbnN0IGhlYWRlcnM6IGFueSA9IHt9O1xuICAgIGhlYWRlcnNbXCJDb250ZW50LVR5cGVcIl0gPSBcImFwcGxpY2F0aW9uL2pzb25cIjtcbiAgICBpZiAodGhpcy5vcHRpb25zLmFjY2Vzc190b2tlbikge1xuICAgICAgaGVhZGVycy5hdXRob3JpemF0aW9uID0gXCJCZWFyZXIgXCIgKyB0aGlzLm9wdGlvbnMuYWNjZXNzX3Rva2VuO1xuICAgIH1cblxuICAgIGNvbnN0IGZldGNoUGFyYW1zOiBhbnkgPSB7XG4gICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgaGVhZGVycyxcbiAgICB9O1xuICAgIGlmIChwYXJhbXMpIHtcbiAgICAgIGZldGNoUGFyYW1zLmJvZHkgPSBKU09OLnN0cmluZ2lmeShwYXJhbXMpO1xuICAgIH1cblxuICAgIHJldHVybiBmZXRjaCh1cmwsIGZldGNoUGFyYW1zKVxuICAgICAgLnRoZW4gKChyZXM6IGFueSkgPT4ge1xuICAgICAgICByZXR1cm4gcmVzLmpzb24oKTtcbiAgICAgIH0pXG4gICAgICAudGhlbigoanNvbjogYW55KSA9PiB7XG4gICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgIGNhbGxiYWNrKGpzb24pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZTogYW55ICkgPT4ge1xuICAgICAgICAgIHJlc29sdmUoanNvbik7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gIH1cblxuICBwdWJsaWMgZ2V0U3RhdGUoY2FsbGJhY2s6IGFueSkge1xuICAgIHJldHVybiB0aGlzLnBvc3QoXCIvc3RhdGVcIiwgbnVsbCwgY2FsbGJhY2spO1xuICB9XG5cbiAgcHVibGljIHBvc3RKc29uKGpzb246IGFueSwgY2FsbGJhY2s6IGFueSkge1xuICAgIHJldHVybiB0aGlzLnBvc3QoXCIvYXBpL1wiICsgdGhpcy5hcGlWZXJzaW9uLCBqc29uLCBjYWxsYmFjayk7IC8vIDEgaXMgYXBpIHZlcnNpb25cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBPYm5pekFwaTtcbiJdfQ==
