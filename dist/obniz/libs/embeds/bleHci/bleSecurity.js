"use strict";
const emitter = require('eventemitter3');
class BleSecurity {
    constructor(Obniz) {
        this.Obniz = Obniz;
        this.emitter = new emitter();
    }
    setModeLevel(mode, level) {
        throw new Error('setModeLevel is deprecated method');
    }
    checkIntroducedFirmware(introducedVersion, functionName) {
        throw new Error('checkIntroducedFirmware is deprecated method');
    }
    setAuth(authTypes) {
        throw new Error('setAuth is deprecated method');
    }
    setIndicateSecurityLevel(level) {
        throw new Error('setIndicateSecurityLevel is deprecated method');
    }
    setEnableKeyTypes(keyTypes) {
        throw new Error('setEnableKeyTypes is deprecated method');
    }
    setKeyMaxSize(size) {
        throw new Error('setKeyMaxSize is deprecated method');
    }
    clearBondingDevicesList() {
        throw new Error('clearBondingDevicesList is deprecated method');
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9vYm5pei9saWJzL2VtYmVkcy9ibGVIY2kvYmxlU2VjdXJpdHkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUV6QyxNQUFNLFdBQVc7SUFDZixZQUFZLEtBQUs7UUFDZixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksT0FBTyxFQUFFLENBQUM7SUFDL0IsQ0FBQztJQUVELFlBQVksQ0FBQyxJQUFJLEVBQUUsS0FBSztRQUN0QixNQUFNLElBQUksS0FBSyxDQUFDLG1DQUFtQyxDQUFDLENBQUM7SUFDdkQsQ0FBQztJQUVELHVCQUF1QixDQUFDLGlCQUFpQixFQUFFLFlBQVk7UUFDckQsTUFBTSxJQUFJLEtBQUssQ0FBQyw4Q0FBOEMsQ0FBQyxDQUFDO0lBQ2xFLENBQUM7SUFFRCxPQUFPLENBQUMsU0FBUztRQUNmLE1BQU0sSUFBSSxLQUFLLENBQUMsOEJBQThCLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBRUQsd0JBQXdCLENBQUMsS0FBSztRQUM1QixNQUFNLElBQUksS0FBSyxDQUFDLCtDQUErQyxDQUFDLENBQUM7SUFDbkUsQ0FBQztJQUVELGlCQUFpQixDQUFDLFFBQVE7UUFDeEIsTUFBTSxJQUFJLEtBQUssQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFDO0lBQzVELENBQUM7SUFFRCxhQUFhLENBQUMsSUFBSTtRQUNoQixNQUFNLElBQUksS0FBSyxDQUFDLG9DQUFvQyxDQUFDLENBQUM7SUFDeEQsQ0FBQztJQUVELHVCQUF1QjtRQUNyQixNQUFNLElBQUksS0FBSyxDQUFDLDhDQUE4QyxDQUFDLENBQUM7SUFDbEUsQ0FBQztJQUVELE9BQU8sS0FBSSxDQUFDLENBQUMsT0FBTztJQUVwQixnQkFBZ0IsQ0FBQyxVQUFVLEVBQUUsTUFBTTtRQUNqQyxRQUFRLFVBQVUsRUFBRTtZQUNsQixLQUFLLFNBQVMsQ0FBQyxDQUFDO2dCQUNkLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ3JCLE1BQU07YUFDUDtTQUNGO0lBQ0gsQ0FBQztDQUNGO0FBRUQsTUFBTSxDQUFDLE9BQU8sR0FBRyxXQUFXLENBQUMiLCJmaWxlIjoib2JuaXovbGlicy9lbWJlZHMvYmxlSGNpL2JsZVNlY3VyaXR5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgZW1pdHRlciA9IHJlcXVpcmUoJ2V2ZW50ZW1pdHRlcjMnKTtcblxuY2xhc3MgQmxlU2VjdXJpdHkge1xuICBjb25zdHJ1Y3RvcihPYm5peikge1xuICAgIHRoaXMuT2JuaXogPSBPYm5pejtcbiAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgZW1pdHRlcigpO1xuICB9XG5cbiAgc2V0TW9kZUxldmVsKG1vZGUsIGxldmVsKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdzZXRNb2RlTGV2ZWwgaXMgZGVwcmVjYXRlZCBtZXRob2QnKTtcbiAgfVxuXG4gIGNoZWNrSW50cm9kdWNlZEZpcm13YXJlKGludHJvZHVjZWRWZXJzaW9uLCBmdW5jdGlvbk5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2NoZWNrSW50cm9kdWNlZEZpcm13YXJlIGlzIGRlcHJlY2F0ZWQgbWV0aG9kJyk7XG4gIH1cblxuICBzZXRBdXRoKGF1dGhUeXBlcykge1xuICAgIHRocm93IG5ldyBFcnJvcignc2V0QXV0aCBpcyBkZXByZWNhdGVkIG1ldGhvZCcpO1xuICB9XG5cbiAgc2V0SW5kaWNhdGVTZWN1cml0eUxldmVsKGxldmVsKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdzZXRJbmRpY2F0ZVNlY3VyaXR5TGV2ZWwgaXMgZGVwcmVjYXRlZCBtZXRob2QnKTtcbiAgfVxuXG4gIHNldEVuYWJsZUtleVR5cGVzKGtleVR5cGVzKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdzZXRFbmFibGVLZXlUeXBlcyBpcyBkZXByZWNhdGVkIG1ldGhvZCcpO1xuICB9XG5cbiAgc2V0S2V5TWF4U2l6ZShzaXplKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdzZXRLZXlNYXhTaXplIGlzIGRlcHJlY2F0ZWQgbWV0aG9kJyk7XG4gIH1cblxuICBjbGVhckJvbmRpbmdEZXZpY2VzTGlzdCgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2NsZWFyQm9uZGluZ0RldmljZXNMaXN0IGlzIGRlcHJlY2F0ZWQgbWV0aG9kJyk7XG4gIH1cblxuICBvbmVycm9yKCkge30gLy9kdW1teVxuXG4gIG5vdGlmeUZyb21TZXJ2ZXIobm90aWZ5TmFtZSwgcGFyYW1zKSB7XG4gICAgc3dpdGNoIChub3RpZnlOYW1lKSB7XG4gICAgICBjYXNlICdvbmVycm9yJzoge1xuICAgICAgICB0aGlzLm9uZXJyb3IocGFyYW1zKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQmxlU2VjdXJpdHk7XG4iXX0=
