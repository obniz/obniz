"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MeshJs {
    constructor() {
        this.UUIDS = {
            serviceId: '72C90001-57A9-4D40-B746-534E22EC9F9E',
            characteristics: {
                Indicate: '72c90005-57a9-4d40-b746-534e22ec9f9e',
                Notify: '72c90003-57a9-4d40-b746-534e22ec9f9e',
                Write: '72c90004-57a9-4d40-b746-534e22ec9f9e',
                WriteWOResponse: '72c90002-57a9-4d40-b746-534e22ec9f9e',
            },
        };
        // event handler
        this.onBattery = null;
        this.onStatusButtonPressed = null;
        this._feature_command = [0, 2, 1, 3];
        this._battery = -1;
    }
    get feature() {
        return this._feature_command;
    }
    get battery() {
        return this._battery;
    }
    indicate(data) {
        if (data.length !== 16) {
            return;
        }
        if (data[0] !== 0) {
            return;
        }
        if (data[1] !== 2) {
            return;
        }
        this._battery = data[14];
    }
    notify(data) {
        this._updateBattery(data);
        this._updateStatusButton(data);
    }
    printData(message) {
        console.log('bat: ' + this._battery + ', ' + message);
    }
    checkSum(command) {
        let sum = 0;
        command.forEach((val) => {
            sum += val;
        });
        return sum % 256;
    }
    errorMessage(message) {
        console.log('[Error] Can not parse; ' + message);
    }
    errorOutOfRange(message) {
        console.log(this.errorMessage('out of range ' + message));
    }
    _updateBattery(data) {
        if (data.length !== 4) {
            return false;
        }
        if (data[0] !== 0) {
            return false;
        }
        if (data[1] !== 0) {
            return false;
        }
        // if (data[2] === this.battery) {
        //   return;
        // }
        this._battery = data[2];
        if (typeof this.onBattery !== 'function') {
            return false;
        }
        this.onBattery(this._battery);
        return true;
    }
    _updateStatusButton(data) {
        if (data.length !== 4) {
            return false;
        }
        if (data[0] !== 0) {
            return false;
        }
        if (data[1] !== 1) {
            return false;
        }
        if (data[2] !== 0) {
            return false;
        }
        if (typeof this.onStatusButtonPressed !== 'function') {
            return false;
        }
        this.onStatusButtonPressed();
        return true;
    }
}
exports.MeshJs = MeshJs;
