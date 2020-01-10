"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const emitter = require("eventemitter3");
class BleSecurity {
    constructor(Obniz) {
        this.Obniz = Obniz;
        this.emitter = new emitter();
    }
    setModeLevel(mode, level) {
        throw new Error("setModeLevel is deprecated method");
    }
    checkIntroducedFirmware(introducedVersion, functionName) {
        throw new Error("checkIntroducedFirmware is deprecated method");
    }
    setAuth(authTypes) {
        throw new Error("setAuth is deprecated method");
    }
    setIndicateSecurityLevel(level) {
        throw new Error("setIndicateSecurityLevel is deprecated method");
    }
    setEnableKeyTypes(keyTypes) {
        throw new Error("setEnableKeyTypes is deprecated method");
    }
    setKeyMaxSize(size) {
        throw new Error("setKeyMaxSize is deprecated method");
    }
    clearBondingDevicesList() {
        throw new Error("clearBondingDevicesList is deprecated method");
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9vYm5pei9saWJzL2VtYmVkcy9ibGVIY2kvYmxlU2VjdXJpdHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx5Q0FBMEM7QUFFMUMsTUFBTSxXQUFXO0lBSWYsWUFBWSxLQUFVO1FBQ3BCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxPQUFPLEVBQUUsQ0FBQztJQUMvQixDQUFDO0lBRU0sWUFBWSxDQUFDLElBQVMsRUFBRSxLQUFVO1FBQ3ZDLE1BQU0sSUFBSSxLQUFLLENBQUMsbUNBQW1DLENBQUMsQ0FBQztJQUN2RCxDQUFDO0lBRU0sdUJBQXVCLENBQUMsaUJBQXNCLEVBQUUsWUFBaUI7UUFDdEUsTUFBTSxJQUFJLEtBQUssQ0FBQyw4Q0FBOEMsQ0FBQyxDQUFDO0lBQ2xFLENBQUM7SUFFTSxPQUFPLENBQUMsU0FBYztRQUMzQixNQUFNLElBQUksS0FBSyxDQUFDLDhCQUE4QixDQUFDLENBQUM7SUFDbEQsQ0FBQztJQUVNLHdCQUF3QixDQUFDLEtBQVU7UUFDeEMsTUFBTSxJQUFJLEtBQUssQ0FBQywrQ0FBK0MsQ0FBQyxDQUFDO0lBQ25FLENBQUM7SUFFTSxpQkFBaUIsQ0FBQyxRQUFhO1FBQ3BDLE1BQU0sSUFBSSxLQUFLLENBQUMsd0NBQXdDLENBQUMsQ0FBQztJQUM1RCxDQUFDO0lBRU0sYUFBYSxDQUFDLElBQVM7UUFDNUIsTUFBTSxJQUFJLEtBQUssQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFDO0lBQ3hELENBQUM7SUFFTSx1QkFBdUI7UUFDNUIsTUFBTSxJQUFJLEtBQUssQ0FBQyw4Q0FBOEMsQ0FBQyxDQUFDO0lBQ2xFLENBQUM7SUFFTSxPQUFPLENBQUMsTUFBVztJQUMxQixDQUFDLENBQUMsUUFBUTtJQUVILGdCQUFnQixDQUFDLFVBQWUsRUFBRSxNQUFXO1FBQ2xELFFBQVEsVUFBVSxFQUFFO1lBQ2xCLEtBQUssU0FBUyxDQUFDLENBQUM7Z0JBQ2QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDckIsTUFBTTthQUNQO1NBQ0Y7SUFDSCxDQUFDO0NBQ0Y7QUFFRCxrQkFBZSxXQUFXLENBQUMiLCJmaWxlIjoic3JjL29ibml6L2xpYnMvZW1iZWRzL2JsZUhjaS9ibGVTZWN1cml0eS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBlbWl0dGVyID0gcmVxdWlyZShcImV2ZW50ZW1pdHRlcjNcIik7XG5cbmNsYXNzIEJsZVNlY3VyaXR5IHtcbiAgcHVibGljIE9ibml6OiBhbnk7XG4gIHB1YmxpYyBlbWl0dGVyOiBhbnk7XG5cbiAgY29uc3RydWN0b3IoT2JuaXo6IGFueSkge1xuICAgIHRoaXMuT2JuaXogPSBPYm5pejtcbiAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgZW1pdHRlcigpO1xuICB9XG5cbiAgcHVibGljIHNldE1vZGVMZXZlbChtb2RlOiBhbnksIGxldmVsOiBhbnkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJzZXRNb2RlTGV2ZWwgaXMgZGVwcmVjYXRlZCBtZXRob2RcIik7XG4gIH1cblxuICBwdWJsaWMgY2hlY2tJbnRyb2R1Y2VkRmlybXdhcmUoaW50cm9kdWNlZFZlcnNpb246IGFueSwgZnVuY3Rpb25OYW1lOiBhbnkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJjaGVja0ludHJvZHVjZWRGaXJtd2FyZSBpcyBkZXByZWNhdGVkIG1ldGhvZFwiKTtcbiAgfVxuXG4gIHB1YmxpYyBzZXRBdXRoKGF1dGhUeXBlczogYW55KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwic2V0QXV0aCBpcyBkZXByZWNhdGVkIG1ldGhvZFwiKTtcbiAgfVxuXG4gIHB1YmxpYyBzZXRJbmRpY2F0ZVNlY3VyaXR5TGV2ZWwobGV2ZWw6IGFueSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcInNldEluZGljYXRlU2VjdXJpdHlMZXZlbCBpcyBkZXByZWNhdGVkIG1ldGhvZFwiKTtcbiAgfVxuXG4gIHB1YmxpYyBzZXRFbmFibGVLZXlUeXBlcyhrZXlUeXBlczogYW55KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwic2V0RW5hYmxlS2V5VHlwZXMgaXMgZGVwcmVjYXRlZCBtZXRob2RcIik7XG4gIH1cblxuICBwdWJsaWMgc2V0S2V5TWF4U2l6ZShzaXplOiBhbnkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJzZXRLZXlNYXhTaXplIGlzIGRlcHJlY2F0ZWQgbWV0aG9kXCIpO1xuICB9XG5cbiAgcHVibGljIGNsZWFyQm9uZGluZ0RldmljZXNMaXN0KCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcImNsZWFyQm9uZGluZ0RldmljZXNMaXN0IGlzIGRlcHJlY2F0ZWQgbWV0aG9kXCIpO1xuICB9XG5cbiAgcHVibGljIG9uZXJyb3IocGFyYW1zOiBhbnkpIHtcbiAgfSAvLyBkdW1teVxuXG4gIHB1YmxpYyBub3RpZnlGcm9tU2VydmVyKG5vdGlmeU5hbWU6IGFueSwgcGFyYW1zOiBhbnkpIHtcbiAgICBzd2l0Y2ggKG5vdGlmeU5hbWUpIHtcbiAgICAgIGNhc2UgXCJvbmVycm9yXCI6IHtcbiAgICAgICAgdGhpcy5vbmVycm9yKHBhcmFtcyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBCbGVTZWN1cml0eTtcbiJdfQ==
