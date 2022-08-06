"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Error_1 = require("../util/Error");
class Base {
    constructor() {
        // Event Handler
        this.onBatteryLevel = null;
        this.onStatusButtonPressed = null;
        // Constant Values
        this.UUIDS = {
            SERVICE_ID: '72c90001-57a9-4d40-b746-534e22ec9f9e',
            CHARACTERISTICS: {
                INDICATE: '72c90005-57a9-4d40-b746-534e22ec9f9e',
                NOTIFY: '72c90003-57a9-4d40-b746-534e22ec9f9e',
                WRITE: '72c90004-57a9-4d40-b746-534e22ec9f9e',
                WRITE_WO_RESPONSE: '72c90002-57a9-4d40-b746-534e22ec9f9e',
            },
        };
        this.FEATURE_COMMAND_ = [
            0,
            2,
            1,
            3,
        ];
        this.MESSAGE_TYPE_ID_INDEX = 0;
        this.EVENT_TYPE_ID_INDEX = 1;
        this.VERSION_MAJOR_INDEX_ = 7;
        this.VERSION_MINOR_INDEX_ = 8;
        this.VERSION_RELEASE_INDEX_ = 9;
        this.BATTERY_INDEX_ = 14;
        this.MESSAGE_TYPE_ID_VALUE = 0;
        this.EVENT_TYPE_ID_VALUE = 2;
        this.INDICATE_LENGTH = 16;
        this.versionMajor_ = -1;
        this.versionMinor_ = -1;
        this.versionRelease_ = -1;
        this.battery_ = -1;
    }
    get featureCommand() {
        return this.FEATURE_COMMAND_;
    }
    get battery() {
        return this.battery_;
    }
    /**
     * indicate
     *
     * @param data
     * @returns
     */
    indicate(data) {
        if (data.length !== this.INDICATE_LENGTH) {
            return;
        }
        if (data[this.MESSAGE_TYPE_ID_INDEX] !== this.MESSAGE_TYPE_ID_VALUE) {
            return;
        }
        if (data[this.EVENT_TYPE_ID_INDEX] !== this.EVENT_TYPE_ID_VALUE) {
            return;
        }
        this.battery_ = data[this.BATTERY_INDEX_];
        this.versionMajor_ = data[this.VERSION_MAJOR_INDEX_];
        this.versionMinor_ = data[this.VERSION_MINOR_INDEX_];
        this.versionRelease_ = data[this.VERSION_RELEASE_INDEX_];
    }
    /**
     * notify
     *
     * @param data
     */
    notify(data) {
        this.updateBattery_(data);
        this.updateStatusButton_(data);
    }
    checkSum(command) {
        let sum = 0;
        command.forEach((val) => {
            sum += val;
        });
        const BYTE = 256;
        return sum % BYTE;
    }
    checkRange(target, min, max, name) {
        if (target < min || max < target) {
            throw new Error_1.MESHJsOutOfRangeError(name, min, max);
        }
        return true;
    }
    complemnt(val) {
        const TWO_BYTE_PLUS1 = 65536; // 0x10000
        const TWO_BYTE_HALF = Math.floor(TWO_BYTE_PLUS1 / 2) - 1;
        return val - (val > TWO_BYTE_HALF ? TWO_BYTE_PLUS1 : 0);
    }
    invcomplemnt(val) {
        const TWO_BYTE_PLUS1 = 65536; // 0x10000
        return val + (val < 0 ? TWO_BYTE_PLUS1 : 0);
    }
    updateBattery_(data) {
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
        this.battery_ = data[2];
        if (typeof this.onBatteryLevel !== 'function') {
            return false;
        }
        this.onBatteryLevel(this.battery_);
        return true;
    }
    updateStatusButton_(data) {
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
    checkVersion_(major, minor, release) {
        const VERSION_MAJOR = 1;
        const VERSION_MINOR = 2;
        const VERSION_RELEASE = 5;
        if (VERSION_MAJOR < major) {
            return;
        }
        if (major < VERSION_MAJOR) {
            throw new Error_1.MESHJsBlockVersionError(major, minor, release);
        }
        if (VERSION_MINOR < minor) {
            return;
        }
        if (minor < VERSION_MINOR) {
            throw new Error_1.MESHJsBlockVersionError(major, minor, release);
        }
        if (VERSION_RELEASE < release) {
            return;
        }
        if (release < VERSION_RELEASE) {
            throw new Error_1.MESHJsBlockVersionError(major, minor, release);
        }
    }
}
exports.Base = Base;
