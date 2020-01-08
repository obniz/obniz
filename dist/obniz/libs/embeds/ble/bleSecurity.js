"use strict";
const emitter = require('eventemitter3');
const semver = require('semver');
class BleSecurity {
    constructor(Obniz) {
        this.Obniz = Obniz;
        this.emitter = new emitter();
    }
    setModeLevel(mode, level) {
        let auth = undefined;
        let keys = undefined;
        let indicateSecurityLevel = undefined;
        if (mode == 1) {
            if (level == 1) {
                auth = [];
                indicateSecurityLevel = 0; //no pairing request
                keys = ['LTK', 'IRK'];
            }
            else if (level == 2) {
                auth = ['bonding'];
                indicateSecurityLevel = 2;
                keys = ['LTK', 'IRK'];
            }
            else if (level == 3) {
                //TODO
                // auth = ['bonding','mitm'];
                // indicateSecurityLevel = 3;
                // keys = ['LTK', 'IRK'];
            }
        }
        else if (mode == 2) {
            if (level == 1) {
                //TODO
                // auth = [];
                // keys = ['LTK', 'IRK','CSRK'];
            }
            else if (level == 2) {
                //TODO
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
            let msg = `BLE security mode${mode}, level${level} is not available.`;
            this.Obniz.error(msg);
            throw new Error(msg);
        }
    }
    checkIntroducedFirmware(introducedVersion, functionName) {
        let results = semver.lt(this.Obniz.firmware_ver, introducedVersion);
        if (results) {
            let msg = `${functionName} is available obniz firmware ${introducedVersion}.( your obniz version is ${this.Obniz.firmware_ver})`;
            this.Obniz.error(msg);
            throw new Error(msg);
        }
    }
    setAuth(authTypes) {
        this.checkIntroducedFirmware('1.1.0', 'setAuth');
        if (!Array.isArray(authTypes)) {
            authTypes = [authTypes];
        }
        let sendTypes = authTypes
            .map(elm => {
            return elm.toLowerCase();
        })
            .filter(elm => {
            return ['mitm', 'secure_connection', 'bonding'].includes(elm);
        });
        if (sendTypes.length !== authTypes.length) {
            throw new Error('unknown auth type');
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
        this.checkIntroducedFirmware('1.1.0', 'setIndicateSecurityLevel');
        if (typeof level !== 'number') {
            throw new Error('unknown secrity level : ' + level);
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
        this.checkIntroducedFirmware('1.1.0', 'setEnableKeyTypes');
        if (!Array.isArray(keyTypes)) {
            keyTypes = [keyTypes];
        }
        let sendTypes = keyTypes
            .map(elm => {
            return elm.toLowerCase();
        })
            .filter(elm => {
            return ['ltk', 'csrk', 'irk'].includes(elm);
        });
        if (sendTypes.length !== keyTypes.length) {
            throw new Error('unknown key type');
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
        this.checkIntroducedFirmware('1.1.0', 'setKeyMaxSize');
        if (typeof size !== 'number') {
            throw new Error('please provide key size in number');
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
    onerror() { } //dummy
    notifyFromServer(notifyName, params) {
        switch (notifyName) {
            case 'onerror': {
                this.onerror(params);
                break;
            }
        }
    }
}
module.exports = BleSecurity;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9vYm5pei9saWJzL2VtYmVkcy9ibGUvYmxlU2VjdXJpdHkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN6QyxNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFFakMsTUFBTSxXQUFXO0lBQ2YsWUFBWSxLQUFLO1FBQ2YsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLE9BQU8sRUFBRSxDQUFDO0lBQy9CLENBQUM7SUFFRCxZQUFZLENBQUMsSUFBSSxFQUFFLEtBQUs7UUFDdEIsSUFBSSxJQUFJLEdBQUcsU0FBUyxDQUFDO1FBQ3JCLElBQUksSUFBSSxHQUFHLFNBQVMsQ0FBQztRQUNyQixJQUFJLHFCQUFxQixHQUFHLFNBQVMsQ0FBQztRQUV0QyxJQUFJLElBQUksSUFBSSxDQUFDLEVBQUU7WUFDYixJQUFJLEtBQUssSUFBSSxDQUFDLEVBQUU7Z0JBQ2QsSUFBSSxHQUFHLEVBQUUsQ0FBQztnQkFDVixxQkFBcUIsR0FBRyxDQUFDLENBQUMsQ0FBQyxvQkFBb0I7Z0JBQy9DLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQzthQUN2QjtpQkFBTSxJQUFJLEtBQUssSUFBSSxDQUFDLEVBQUU7Z0JBQ3JCLElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUNuQixxQkFBcUIsR0FBRyxDQUFDLENBQUM7Z0JBQzFCLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQzthQUN2QjtpQkFBTSxJQUFJLEtBQUssSUFBSSxDQUFDLEVBQUU7Z0JBQ3JCLE1BQU07Z0JBQ04sNkJBQTZCO2dCQUM3Qiw2QkFBNkI7Z0JBQzdCLHlCQUF5QjthQUMxQjtTQUNGO2FBQU0sSUFBSSxJQUFJLElBQUksQ0FBQyxFQUFFO1lBQ3BCLElBQUks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Q0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELHVCQUF1QjtRQUNyQixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQztZQUNkLEdBQUcsRUFBRTtnQkFDSCxRQUFRLEVBQUU7b0JBQ1IsT0FBTyxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRTtpQkFDekI7YUFDRjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxPQUFPLEtBQUksQ0FBQyxDQUFDLE9BQU87SUFFcEIsZ0JBQWdCLENBQUMsVUFBVSxFQUFFLE1BQU07UUFDakMsUUFBUSxVQUFVLEVBQUU7WUFDbEIsS0FBSyxTQUFTLENBQUMsQ0FBQztnQkFDZCxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUNyQixNQUFNO2FBQ1A7U0FDRjtJQUNILENBQUM7Q0FDRjtBQUVELE1BQU0sQ0FBQyxPQUFPLEdBQUcsV0FBVyxDQUFDIiwiZmlsZSI6Im9ibml6L2xpYnMvZW1iZWRzL2JsZS9ibGVTZWN1cml0eS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGVtaXR0ZXIgPSByZXF1aXJlKCdldmVudGVtaXR0ZXIzJyk7XG5jb25zdCBzZW12ZXIgPSByZXF1aXJlKCdzZW12ZXInKTtcblxuY2xhc3MgQmxlU2VjdXJpdHkge1xuICBjb25zdHJ1Y3RvcihPYm5peikge1xuICAgIHRoaXMuT2JuaXogPSBPYm5pejtcbiAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgZW1pdHRlcigpO1xuICB9XG5cbiAgc2V0TW9kZUxldmVsKG1vZGUsIGxldmVsKSB7XG4gICAgbGV0IGF1dGggPSB1bmRlZmluZWQ7XG4gICAgbGV0IGtleXMgPSB1bmRlZmluZWQ7XG4gICAgbGV0IGluZGljYXRlU2VjdXJpdHlMZXZlbCA9IHVuZGVmaW5lZDtcblxuICAgIGlmIChtb2RlID09IDEpIHtcbiAgICAgIGlmIChsZXZlbCA9PSAxKSB7XG4gICAgICAgIGF1dGggPSBbXTtcbiAgICAgICAgaW5kaWNhdGVTZWN1cml0eUxldmVsID0gMDsgLy9ubyBwYWlyaW5nIHJlcXVlc3RcbiAgICAgICAga2V5cyA9IFsnTFRLJywgJ0lSSyddO1xuICAgICAgfSBlbHNlIGlmIChsZXZlbCA9PSAyKSB7XG4gICAgICAgIGF1dGggPSBbJ2JvbmRpbmcnXTtcbiAgICAgICAgaW5kaWNhdGVTZWN1cml0eUxldmVsID0gMjtcbiAgICAgICAga2V5cyA9IFsnTFRLJywgJ0lSSyddO1xuICAgICAgfSBlbHNlIGlmIChsZXZlbCA9PSAzKSB7XG4gICAgICAgIC8vVE9ET1xuICAgICAgICAvLyBhdXRoID0gWydib25kaW5nJywnbWl0bSddO1xuICAgICAgICAvLyBpbmRpY2F0ZVNlY3VyaXR5TGV2ZWwgPSAzO1xuICAgICAgICAvLyBrZXlzID0gWydMVEsnLCAnSVJLJ107XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChtb2RlID09IDIpIHtcbiAgICAgIGlmIChsZXZlbCA9PSAxKSB7XG4gICAgICAgIC8vVE9ET1xuICAgICAgICAvLyBhdXRoID0gW107XG4gICAgICAgIC8vIGtleXMgPSBbJ0xUSycsICdJUksnLCdDU1JLJ107XG4gICAgICB9IGVsc2UgaWYgKGxldmVsID09IDIpIHtcbiAgICAgICAgLy9UT0RPXG4gICAgICAgIC8vIGF1dGggPSBbJ2JvbmRpbmcnXTtcbiAgICAgICAgLy8ga2V5cyA9IFsnTFRLJywgJ0lSSycsJ0NTUksnXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoXG4gICAgICBhdXRoICE9PSB1bmRlZmluZWQgJiZcbiAgICAgIGluZGljYXRlU2VjdXJpdHlMZXZlbCAhPT0gdW5kZWZpbmVkICYmXG4gICAgICBrZXlzICE9PSB1bmRlZmluZWRcbiAgICApIHtcbiAgICAgIHRoaXMuc2V0QXV0aChhdXRoKTtcbiAgICAgIHRoaXMuc2V0SW5kaWNhdGVTZWN1cml0eUxldmVsKGluZGljYXRlU2VjdXJpdHlMZXZlbCk7XG4gICAgICB0aGlzLnNldEVuYWJsZUtleVR5cGVzKGtleXMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgbXNnID0gYEJMRSBzZWN1cml0eSBtb2RlJHttb2RlfSwgbGV2ZWwke2xldmVsfSBpcyBub3QgYXZhaWxhYmxlLmA7XG4gICAgICB0aGlzLk9ibml6LmVycm9yKG1zZyk7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IobXNnKTtcbiAgICB9XG4gIH1cblxuICBjaGVja0ludHJvZHVjZWRGaXJtd2FyZShpbnRyb2R1Y2VkVmVyc2lvbiwgZnVuY3Rpb25OYW1lKSB7XG4gICAgbGV0IHJlc3VsdHMgPSBzZW12ZXIubHQodGhpcy5PYm5pei5maXJtd2FyZV92ZXIsIGludHJvZHVjZWRWZXJzaW9uKTtcbiAgICBpZiAocmVzdWx0cykge1xuICAgICAgbGV0IG1zZyA9IGAke2Z1bmN0aW9uTmFtZX0gaXMgYXZhaWxhYmxlIG9ibml6IGZpcm13YXJlICR7aW50cm9kdWNlZFZlcnNpb259LiggeW91ciBvYm5peiB2ZXJzaW9uIGlzICR7XG4gICAgICAgIHRoaXMuT2JuaXouZmlybXdhcmVfdmVyXG4gICAgICB9KWA7XG4gICAgICB0aGlzLk9ibml6LmVycm9yKG1zZyk7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IobXNnKTtcbiAgICB9XG4gIH1cblxuICBzZXRBdXRoKGF1dGhUeXBlcykge1xuICAgIHRoaXMuY2hlY2tJbnRyb2R1Y2VkRmlybXdhcmUoJzEuMS4wJywgJ3NldEF1dGgnKTtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoYXV0aFR5cGVzKSkge1xuICAgICAgYXV0aFR5cGVzID0gW2F1dGhUeXBlc107XG4gICAgfVxuICAgIGxldCBzZW5kVHlwZXMgPSBhdXRoVHlwZXNcbiAgICAgIC5tYXAoZWxtID0+IHtcbiAgICAgICAgcmV0dXJuIGVsbS50b0xvd2VyQ2FzZSgpO1xuICAgICAgfSlcbiAgICAgIC5maWx0ZXIoZWxtID0+IHtcbiAgICAgICAgcmV0dXJuIFsnbWl0bScsICdzZWN1cmVfY29ubmVjdGlvbicsICdib25kaW5nJ10uaW5jbHVkZXMoZWxtKTtcbiAgICAgIH0pO1xuXG4gICAgaWYgKHNlbmRUeXBlcy5sZW5ndGggIT09IGF1dGhUeXBlcy5sZW5ndGgpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcigndW5rbm93biBhdXRoIHR5cGUnKTtcbiAgICB9XG5cbiAgICB0aGlzLk9ibml6LnNlbmQoe1xuICAgICAgYmxlOiB7XG4gICAgICAgIHNlY3VyaXR5OiB7XG4gICAgICAgICAgYXV0aDogYXV0aFR5cGVzLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIHNldEluZGljYXRlU2VjdXJpdHlMZXZlbChsZXZlbCkge1xuICAgIHRoaXMuY2hlY2tJbnRyb2R1Y2VkRmlybXdhcmUoJzEuMS4wJywgJ3NldEluZGljYXRlU2VjdXJpdHlMZXZlbCcpO1xuXG4gICAgaWYgKHR5cGVvZiBsZXZlbCAhPT0gJ251bWJlcicpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcigndW5rbm93biBzZWNyaXR5IGxldmVsIDogJyArIGxldmVsKTtcbiAgICB9XG4gICAgdGhpcy5PYm5pei5zZW5kKHtcbiAgICAgIGJsZToge1xuICAgICAgICBzZWN1cml0eToge1xuICAgICAgICAgIGluZGljYXRlX3NlY3VyaXR5X2xldmVsOiBsZXZlbCxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICBzZXRFbmFibGVLZXlUeXBlcyhrZXlUeXBlcykge1xuICAgIHRoaXMuY2hlY2tJbnRyb2R1Y2VkRmlybXdhcmUoJzEuMS4wJywgJ3NldEVuYWJsZUtleVR5cGVzJyk7XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGtleVR5cGVzKSkge1xuICAgICAga2V5VHlwZXMgPSBba2V5VHlwZXNdO1xuICAgIH1cbiAgICBsZXQgc2VuZFR5cGVzID0ga2V5VHlwZXNcbiAgICAgIC5tYXAoZWxtID0+IHtcbiAgICAgICAgcmV0dXJuIGVsbS50b0xvd2VyQ2FzZSgpO1xuICAgICAgfSlcbiAgICAgIC5maWx0ZXIoZWxtID0+IHtcbiAgICAgICAgcmV0dXJuIFsnbHRrJywgJ2NzcmsnLCAnaXJrJ10uaW5jbHVkZXMoZWxtKTtcbiAgICAgIH0pO1xuXG4gICAgaWYgKHNlbmRUeXBlcy5sZW5ndGggIT09IGtleVR5cGVzLmxlbmd0aCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCd1bmtub3duIGtleSB0eXBlJyk7XG4gICAgfVxuXG4gICAgdGhpcy5PYm5pei5zZW5kKHtcbiAgICAgIGJsZToge1xuICAgICAgICBzZWN1cml0eToge1xuICAgICAgICAgIGtleTogeyB0eXBlOiBzZW5kVHlwZXMgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICBzZXRLZXlNYXhTaXplKHNpemUpIHtcbiAgICB0aGlzLmNoZWNrSW50cm9kdWNlZEZpcm13YXJlKCcxLjEuMCcsICdzZXRLZXlNYXhTaXplJyk7XG4gICAgaWYgKHR5cGVvZiBzaXplICE9PSAnbnVtYmVyJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdwbGVhc2UgcHJvdmlkZSBrZXkgc2l6ZSBpbiBudW1iZXInKTtcbiAgICB9XG4gICAgdGhpcy5PYm5pei5zZW5kKHtcbiAgICAgIGJsZToge1xuICAgICAgICBzZWN1cml0eToge1xuICAgICAgICAgIGtleTogeyBtYXhfc2l6ZTogc2l6ZSB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIGNsZWFyQm9uZGluZ0RldmljZXNMaXN0KCkge1xuICAgIHRoaXMuT2JuaXouc2VuZCh7XG4gICAgICBibGU6IHtcbiAgICAgICAgc2VjdXJpdHk6IHtcbiAgICAgICAgICBkZXZpY2VzOiB7IGNsZWFyOiB0cnVlIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgb25lcnJvcigpIHt9IC8vZHVtbXlcblxuICBub3RpZnlGcm9tU2VydmVyKG5vdGlmeU5hbWUsIHBhcmFtcykge1xuICAgIHN3aXRjaCAobm90aWZ5TmFtZSkge1xuICAgICAgY2FzZSAnb25lcnJvcic6IHtcbiAgICAgICAgdGhpcy5vbmVycm9yKHBhcmFtcyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEJsZVNlY3VyaXR5O1xuIl19
