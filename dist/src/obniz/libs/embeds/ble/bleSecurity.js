"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const emitter = require("eventemitter3");
const semver = require("semver");
class BleSecurity {
    constructor(Obniz) {
        this.Obniz = Obniz;
        this.emitter = new emitter();
    }
    setModeLevel(mode, level) {
        let auth;
        let keys;
        let indicateSecurityLevel;
        if (mode === 1) {
            if (level === 1) {
                auth = [];
                indicateSecurityLevel = 0; // no pairing request
                keys = ["LTK", "IRK"];
            }
            else if (level === 2) {
                auth = ["bonding"];
                indicateSecurityLevel = 2;
                keys = ["LTK", "IRK"];
            }
            else if (level === 3) {
                // TODO
                // auth = ['bonding','mitm'];
                // indicateSecurityLevel = 3;
                // keys = ['LTK', 'IRK'];
            }
        }
        else if (mode === 2) {
            if (level === 1) {
                // TODO
                // auth = [];
                // keys = ['LTK', 'IRK','CSRK'];
            }
            else if (level === 2) {
                // TODO
                // auth = ['bonding'];
                // keys = ['LTK', 'IRK','CSRK'];
            }
        }
        if (auth !== undefined &&
            indicateSecurityLevel !== undefined &&
            keys !== undefined) {
            this.setAuth(auth);
            this.setIndicateSecurityLevel(indicateSecurityLevel);
            this.setEnableKeyTypes(keys);
        }
        else {
            const msg = `BLE security mode${mode}, level${level} is not available.`;
            this.Obniz.error(msg);
            throw new Error(msg);
        }
    }
    checkIntroducedFirmware(introducedVersion, functionName) {
        const results = semver.lt(this.Obniz.firmware_ver, introducedVersion);
        if (results) {
            const msg = `${functionName} is available obniz firmware ${introducedVersion}.( your obniz version is ${this.Obniz.firmware_ver})`;
            this.Obniz.error(msg);
            throw new Error(msg);
        }
    }
    setAuth(authTypes) {
        this.checkIntroducedFirmware("1.1.0", "setAuth");
        if (!Array.isArray(authTypes)) {
            authTypes = [authTypes];
        }
        const sendTypes = authTypes
            .map((elm) => {
            return elm.toLowerCase();
        })
            .filter((elm) => {
            return ["mitm", "secure_connection", "bonding"].includes(elm);
        });
        if (sendTypes.length !== authTypes.length) {
            throw new Error("unknown auth type");
        }
        this.Obniz.send({
            ble: {
                security: {
                    auth: authTypes,
                },
            },
        });
    }
    setIndicateSecurityLevel(level) {
        this.checkIntroducedFirmware("1.1.0", "setIndicateSecurityLevel");
        if (typeof level !== "number") {
            throw new Error("unknown secrity level : " + level);
        }
        this.Obniz.send({
            ble: {
                security: {
                    indicate_security_level: level,
                },
            },
        });
    }
    setEnableKeyTypes(keyTypes) {
        this.checkIntroducedFirmware("1.1.0", "setEnableKeyTypes");
        if (!Array.isArray(keyTypes)) {
            keyTypes = [keyTypes];
        }
        const sendTypes = keyTypes
            .map((elm) => {
            return elm.toLowerCase();
        })
            .filter((elm) => {
            return ["ltk", "csrk", "irk"].includes(elm);
        });
        if (sendTypes.length !== keyTypes.length) {
            throw new Error("unknown key type");
        }
        this.Obniz.send({
            ble: {
                security: {
                    key: { type: sendTypes },
                },
            },
        });
    }
    setKeyMaxSize(size) {
        this.checkIntroducedFirmware("1.1.0", "setKeyMaxSize");
        if (typeof size !== "number") {
            throw new Error("please provide key size in number");
        }
        this.Obniz.send({
            ble: {
                security: {
                    key: { max_size: size },
                },
            },
        });
    }
    clearBondingDevicesList() {
        this.Obniz.send({
            ble: {
                security: {
                    devices: { clear: true },
                },
            },
        });
    }
    onerror(params) {
    } // dummy
    notifyFromServer(notifyName, params) {
        switch (notifyName) {
            case "onerror": {
                this.onerror(params);
                break;
            }
        }
    }
}
exports.default = BleSecurity;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9vYm5pei9saWJzL2VtYmVkcy9ibGUvYmxlU2VjdXJpdHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx5Q0FBMEM7QUFDMUMsaUNBQWtDO0FBRWxDLE1BQU0sV0FBVztJQUlmLFlBQVksS0FBVTtRQUNwQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksT0FBTyxFQUFFLENBQUM7SUFDL0IsQ0FBQztJQUVNLFlBQVksQ0FBQyxJQUFTLEVBQUUsS0FBVTtRQUN2QyxJQUFJLElBQVMsQ0FBQztRQUNkLElBQUksSUFBUyxDQUFDO1FBQ2QsSUFBSSxxQkFBMEIsQ0FBQztRQUUvQixJQUFJLElBQUksS0FBSyxDQUFDLEVBQUU7WUFDZCxJQUFJLEtBQUssS0FBSyxDQUFDLEVBQUU7Z0JBQ2YsSUFBSSxHQUFHLEVBQUUsQ0FBQztnQkFDVixxQkFBcUIsR0FBRyxDQUFDLENBQUMsQ0FBQyxxQkFBcUI7Z0JBQ2hELElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQzthQUN2QjtpQkFBTSxJQUFJLEtBQUssS0FBSyxDQUFDLEVBQUU7Z0JBQ3RCLElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUNuQixxQkFBcUIsR0FBRyxDQUFDLENBQUM7Z0JBQzFCLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQzthQUN2QjtpQkFBTSxJQUFJLEtBQUssS0FBSyxDQUFDLEVBQUU7Z0JBQ3RCLE9BQU87Z0JBQ1AsNkJBQTZCO2dCQUM3Qiw2QkFBNkI7Z0JBQzdCLHlCQUF5QjthQUMxQjtTQUNGO2FBQU0sSUFBSSxJQUFJLEtBQUssQ0FBQyxFQUFFO1lBQ3JCLElBQUksS0FBSyxLQUFLLENBQUMsRUFBRTtnQkFDZixPQUFPO2dCQUNQLGFBQWE7Z0JBQ2IsZ0NBQWdDO2FBQ2pDO2lCQUFNLElBQUksS0FBSyxLQUFLLENBQUMsRUFBRTtnQkFD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O1lBQ2QsR0FBRyxFQUFFO2dCQUNILFFBQVEsRUFBRTtvQkFDUixPQUFPLEVBQUUsRUFBQyxLQUFLLEVBQUUsSUFBSSxFQUFDO2lCQUN2QjthQUNGO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVNLE9BQU8sQ0FBQyxNQUFXO0lBQzFCLENBQUMsQ0FBQyxRQUFRO0lBRUgsZ0JBQWdCLENBQUMsVUFBZSxFQUFFLE1BQVc7UUFDbEQsUUFBUSxVQUFVLEVBQUU7WUFDbEIsS0FBSyxTQUFTLENBQUMsQ0FBQztnQkFDZCxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUNyQixNQUFNO2FBQ1A7U0FDRjtJQUNILENBQUM7Q0FDRjtBQUVELGtCQUFlLFdBQVcsQ0FBQyIsImZpbGUiOiJzcmMvb2JuaXovbGlicy9lbWJlZHMvYmxlL2JsZVNlY3VyaXR5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGVtaXR0ZXIgPSByZXF1aXJlKFwiZXZlbnRlbWl0dGVyM1wiKTtcbmltcG9ydCBzZW12ZXIgPSByZXF1aXJlKFwic2VtdmVyXCIpO1xuXG5jbGFzcyBCbGVTZWN1cml0eSB7XG4gIHB1YmxpYyBPYm5pejogYW55O1xuICBwdWJsaWMgZW1pdHRlcjogYW55O1xuXG4gIGNvbnN0cnVjdG9yKE9ibml6OiBhbnkpIHtcbiAgICB0aGlzLk9ibml6ID0gT2JuaXo7XG4gICAgdGhpcy5lbWl0dGVyID0gbmV3IGVtaXR0ZXIoKTtcbiAgfVxuXG4gIHB1YmxpYyBzZXRNb2RlTGV2ZWwobW9kZTogYW55LCBsZXZlbDogYW55KSB7XG4gICAgbGV0IGF1dGg6IGFueTtcbiAgICBsZXQga2V5czogYW55O1xuICAgIGxldCBpbmRpY2F0ZVNlY3VyaXR5TGV2ZWw6IGFueTtcblxuICAgIGlmIChtb2RlID09PSAxKSB7XG4gICAgICBpZiAobGV2ZWwgPT09IDEpIHtcbiAgICAgICAgYXV0aCA9IFtdO1xuICAgICAgICBpbmRpY2F0ZVNlY3VyaXR5TGV2ZWwgPSAwOyAvLyBubyBwYWlyaW5nIHJlcXVlc3RcbiAgICAgICAga2V5cyA9IFtcIkxUS1wiLCBcIklSS1wiXTtcbiAgICAgIH0gZWxzZSBpZiAobGV2ZWwgPT09IDIpIHtcbiAgICAgICAgYXV0aCA9IFtcImJvbmRpbmdcIl07XG4gICAgICAgIGluZGljYXRlU2VjdXJpdHlMZXZlbCA9IDI7XG4gICAgICAgIGtleXMgPSBbXCJMVEtcIiwgXCJJUktcIl07XG4gICAgICB9IGVsc2UgaWYgKGxldmVsID09PSAzKSB7XG4gICAgICAgIC8vIFRPRE9cbiAgICAgICAgLy8gYXV0aCA9IFsnYm9uZGluZycsJ21pdG0nXTtcbiAgICAgICAgLy8gaW5kaWNhdGVTZWN1cml0eUxldmVsID0gMztcbiAgICAgICAgLy8ga2V5cyA9IFsnTFRLJywgJ0lSSyddO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAobW9kZSA9PT0gMikge1xuICAgICAgaWYgKGxldmVsID09PSAxKSB7XG4gICAgICAgIC8vIFRPRE9cbiAgICAgICAgLy8gYXV0aCA9IFtdO1xuICAgICAgICAvLyBrZXlzID0gWydMVEsnLCAnSVJLJywnQ1NSSyddO1xuICAgICAgfSBlbHNlIGlmIChsZXZlbCA9PT0gMikge1xuICAgICAgICAvLyBUT0RPXG4gICAgICAgIC8vIGF1dGggPSBbJ2JvbmRpbmcnXTtcbiAgICAgICAgLy8ga2V5cyA9IFsnTFRLJywgJ0lSSycsJ0NTUksnXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoXG4gICAgICBhdXRoICE9PSB1bmRlZmluZWQgJiZcbiAgICAgIGluZGljYXRlU2VjdXJpdHlMZXZlbCAhPT0gdW5kZWZpbmVkICYmXG4gICAgICBrZXlzICE9PSB1bmRlZmluZWRcbiAgICApIHtcbiAgICAgIHRoaXMuc2V0QXV0aChhdXRoKTtcbiAgICAgIHRoaXMuc2V0SW5kaWNhdGVTZWN1cml0eUxldmVsKGluZGljYXRlU2VjdXJpdHlMZXZlbCk7XG4gICAgICB0aGlzLnNldEVuYWJsZUtleVR5cGVzKGtleXMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBtc2c6IGFueSA9IGBCTEUgc2VjdXJpdHkgbW9kZSR7bW9kZX0sIGxldmVsJHtsZXZlbH0gaXMgbm90IGF2YWlsYWJsZS5gO1xuICAgICAgdGhpcy5PYm5pei5lcnJvcihtc2cpO1xuICAgICAgdGhyb3cgbmV3IEVycm9yKG1zZyk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGNoZWNrSW50cm9kdWNlZEZpcm13YXJlKGludHJvZHVjZWRWZXJzaW9uOiBhbnksIGZ1bmN0aW9uTmFtZTogYW55KSB7XG4gICAgY29uc3QgcmVzdWx0czogYW55ID0gc2VtdmVyLmx0KHRoaXMuT2JuaXouZmlybXdhcmVfdmVyLCBpbnRyb2R1Y2VkVmVyc2lvbik7XG4gICAgaWYgKHJlc3VsdHMpIHtcbiAgICAgIGNvbnN0IG1zZzogYW55ID0gYCR7ZnVuY3Rpb25OYW1lfSBpcyBhdmFpbGFibGUgb2JuaXogZmlybXdhcmUgJHtpbnRyb2R1Y2VkVmVyc2lvbn0uKCB5b3VyIG9ibml6IHZlcnNpb24gaXMgJHtcbiAgICAgICAgdGhpcy5PYm5pei5maXJtd2FyZV92ZXJcbiAgICAgIH0pYDtcbiAgICAgIHRoaXMuT2JuaXouZXJyb3IobXNnKTtcbiAgICAgIHRocm93IG5ldyBFcnJvcihtc2cpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBzZXRBdXRoKGF1dGhUeXBlczogYW55KSB7XG4gICAgdGhpcy5jaGVja0ludHJvZHVjZWRGaXJtd2FyZShcIjEuMS4wXCIsIFwic2V0QXV0aFwiKTtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoYXV0aFR5cGVzKSkge1xuICAgICAgYXV0aFR5cGVzID0gW2F1dGhUeXBlc107XG4gICAgfVxuICAgIGNvbnN0IHNlbmRUeXBlczogYW55ID0gYXV0aFR5cGVzXG4gICAgICAubWFwICgoZWxtOiBhbnkpID0+IHtcbiAgICAgICAgcmV0dXJuIGVsbS50b0xvd2VyQ2FzZSgpO1xuICAgICAgfSlcbiAgICAgIC5maWx0ZXIoKGVsbTogYW55ICkgPT4ge1xuICAgICAgICByZXR1cm4gW1wibWl0bVwiLCBcInNlY3VyZV9jb25uZWN0aW9uXCIsIFwiYm9uZGluZ1wiXS5pbmNsdWRlcyhlbG0pO1xuICAgICAgfSk7XG5cbiAgICBpZiAoc2VuZFR5cGVzLmxlbmd0aCAhPT0gYXV0aFR5cGVzLmxlbmd0aCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwidW5rbm93biBhdXRoIHR5cGVcIik7XG4gICAgfVxuXG4gICAgdGhpcy5PYm5pei5zZW5kKHtcbiAgICAgIGJsZToge1xuICAgICAgICBzZWN1cml0eToge1xuICAgICAgICAgIGF1dGg6IGF1dGhUeXBlcyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgc2V0SW5kaWNhdGVTZWN1cml0eUxldmVsKGxldmVsOiBhbnkpIHtcbiAgICB0aGlzLmNoZWNrSW50cm9kdWNlZEZpcm13YXJlKFwiMS4xLjBcIiwgXCJzZXRJbmRpY2F0ZVNlY3VyaXR5TGV2ZWxcIik7XG5cbiAgICBpZiAodHlwZW9mIGxldmVsICE9PSBcIm51bWJlclwiKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ1bmtub3duIHNlY3JpdHkgbGV2ZWwgOiBcIiArIGxldmVsKTtcbiAgICB9XG4gICAgdGhpcy5PYm5pei5zZW5kKHtcbiAgICAgIGJsZToge1xuICAgICAgICBzZWN1cml0eToge1xuICAgICAgICAgIGluZGljYXRlX3NlY3VyaXR5X2xldmVsOiBsZXZlbCxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgc2V0RW5hYmxlS2V5VHlwZXMoa2V5VHlwZXM6IGFueSkge1xuICAgIHRoaXMuY2hlY2tJbnRyb2R1Y2VkRmlybXdhcmUoXCIxLjEuMFwiLCBcInNldEVuYWJsZUtleVR5cGVzXCIpO1xuICAgIGlmICghQXJyYXkuaXNBcnJheShrZXlUeXBlcykpIHtcbiAgICAgIGtleVR5cGVzID0gW2tleVR5cGVzXTtcbiAgICB9XG4gICAgY29uc3Qgc2VuZFR5cGVzOiBhbnkgPSBrZXlUeXBlc1xuICAgICAgLm1hcCAoKGVsbTogYW55KSA9PiB7XG4gICAgICAgIHJldHVybiBlbG0udG9Mb3dlckNhc2UoKTtcbiAgICAgIH0pXG4gICAgICAuZmlsdGVyKChlbG06IGFueSApID0+IHtcbiAgICAgICAgcmV0dXJuIFtcImx0a1wiLCBcImNzcmtcIiwgXCJpcmtcIl0uaW5jbHVkZXMoZWxtKTtcbiAgICAgIH0pO1xuXG4gICAgaWYgKHNlbmRUeXBlcy5sZW5ndGggIT09IGtleVR5cGVzLmxlbmd0aCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwidW5rbm93biBrZXkgdHlwZVwiKTtcbiAgICB9XG5cbiAgICB0aGlzLk9ibml6LnNlbmQoe1xuICAgICAgYmxlOiB7XG4gICAgICAgIHNlY3VyaXR5OiB7XG4gICAgICAgICAga2V5OiB7dHlwZTogc2VuZFR5cGVzfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgc2V0S2V5TWF4U2l6ZShzaXplOiBhbnkpIHtcbiAgICB0aGlzLmNoZWNrSW50cm9kdWNlZEZpcm13YXJlKFwiMS4xLjBcIiwgXCJzZXRLZXlNYXhTaXplXCIpO1xuICAgIGlmICh0eXBlb2Ygc2l6ZSAhPT0gXCJudW1iZXJcIikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwicGxlYXNlIHByb3ZpZGUga2V5IHNpemUgaW4gbnVtYmVyXCIpO1xuICAgIH1cbiAgICB0aGlzLk9ibml6LnNlbmQoe1xuICAgICAgYmxlOiB7XG4gICAgICAgIHNlY3VyaXR5OiB7XG4gICAgICAgICAga2V5OiB7bWF4X3NpemU6IHNpemV9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBjbGVhckJvbmRpbmdEZXZpY2VzTGlzdCgpIHtcbiAgICB0aGlzLk9ibml6LnNlbmQoe1xuICAgICAgYmxlOiB7XG4gICAgICAgIHNlY3VyaXR5OiB7XG4gICAgICAgICAgZGV2aWNlczoge2NsZWFyOiB0cnVlfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgb25lcnJvcihwYXJhbXM6IGFueSkge1xuICB9IC8vIGR1bW15XG5cbiAgcHVibGljIG5vdGlmeUZyb21TZXJ2ZXIobm90aWZ5TmFtZTogYW55LCBwYXJhbXM6IGFueSkge1xuICAgIHN3aXRjaCAobm90aWZ5TmFtZSkge1xuICAgICAgY2FzZSBcIm9uZXJyb3JcIjoge1xuICAgICAgICB0aGlzLm9uZXJyb3IocGFyYW1zKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEJsZVNlY3VyaXR5O1xuIl19
