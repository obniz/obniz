"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Base = void 0;
const Error_1 = require("../util/Error");
class Base {
    constructor() {
        /**
         * Battery level event
         */
        this.onBatteryLevel = null;
        /**
         * Status button pressed event
         */
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
        this.MESSAGE_TYPE_ID_INDEX = 0;
        this.EVENT_TYPE_ID_INDEX = 1;
        this.FEATURE_COMMAND_ = [
            0,
            2,
            1,
            3,
        ];
        this.MESSAGE_TYPE_ID_VALUE_ = 0;
        this.INDICATE_EVENT_TYPE_ID_VALUE_ = 2;
        this.INDICATE_LENGTH_ = 16;
        this.INDICATE_VERSION_MAJOR_INDEX_ = 7;
        this.INDICATE_VERSION_MINOR_INDEX_ = 8;
        this.INDICATE_VERSION_RELEASE_INDEX_ = 9;
        this.INDICATE_BATTERY_INDEX_ = 14;
        this.REGULARLY_EVENT_TYPE_ID_VALUE_ = 0;
        this.REGULARLY_LENGTH_ = 4;
        this.REGULARLY_BATTERY_INDEX_ = 2;
        this.STATUSBUTTON_PRESSED_EVENT_TYPE_ID_VALUE_ = 1;
        this.STATUSBUTTON_PRESSED_LENGTH_ = 4;
        this.STATUSBAR_LED_EVENT_TYPE_ID_VALUE_ = 0;
        this.versionMajor_ = -1;
        this.versionMinor_ = -1;
        this.versionRelease_ = -1;
        this.battery_ = -1;
    }
    /**
     * Get command of feature behavior
     */
    get featureCommand() {
        return this.FEATURE_COMMAND_;
    }
    /**
     * Get battery level
     */
    get battery() {
        return this.battery_;
    }
    /**
     * Verify that the device is MESH block
     *
     * @param name
     * @param opt_serialnumber
     * @returns
     */
    static isMESHblock(name, opt_serialnumber = '') {
        if (!name) {
            return false;
        }
        const LOCAL_NAME_LENGTH = 17;
        if (name.length !== LOCAL_NAME_LENGTH) {
            return false;
        }
        if (name.indexOf('MESH-100') === -1) {
            return false;
        }
        if (opt_serialnumber !== '' && name.indexOf(opt_serialnumber) === -1) {
            return false;
        }
        return true;
    }
    /**
     * Set result of indicate
     *
     * @param data
     * @returns void
     */
    indicate(data) {
        if (data.length !== this.INDICATE_LENGTH_) {
            return;
        }
        if (data[this.MESSAGE_TYPE_ID_INDEX] !== this.MESSAGE_TYPE_ID_VALUE_) {
            return;
        }
        if (data[this.EVENT_TYPE_ID_INDEX] !== this.INDICATE_EVENT_TYPE_ID_VALUE_) {
            return;
        }
        this.battery_ = data[this.INDICATE_BATTERY_INDEX_];
        this.versionMajor_ = data[this.INDICATE_VERSION_MAJOR_INDEX_];
        this.versionMinor_ = data[this.INDICATE_VERSION_MINOR_INDEX_];
        this.versionRelease_ = data[this.INDICATE_VERSION_RELEASE_INDEX_];
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
    /**
     * Create command of statusbar LED
     *
     * @param power
     * @param red
     * @param green
     * @param blue
     * @returns command
     */
    createStatusbarLedCommand(power, red, green, blue) {
        const data = [
            this.MESSAGE_TYPE_ID_VALUE_,
            this.STATUSBAR_LED_EVENT_TYPE_ID_VALUE_,
            Number(red),
            Number(green),
            Number(blue),
            Number(power),
        ];
        data.push(this.checkSum(data));
        return data;
    }
    /**
     * Check software version of MESH block
     *
     * @returns
     */
    checkVersion() {
        const VERSION_MAJOR = 1;
        const VERSION_MINOR = 2;
        const VERSION_RELEASE = 5;
        if (VERSION_MAJOR < this.versionMajor_) {
            return true;
        }
        if (this.versionMajor_ < VERSION_MAJOR) {
            throw new Error_1.MESHJsBlockVersionError(this.versionMajor_, this.versionMinor_, this.versionRelease_);
        }
        if (VERSION_MINOR < this.versionMinor_) {
            return true;
        }
        if (this.versionMinor_ < VERSION_MINOR) {
            throw new Error_1.MESHJsBlockVersionError(this.versionMajor_, this.versionMinor_, this.versionRelease_);
        }
        if (VERSION_RELEASE < this.versionRelease_) {
            return true;
        }
        if (this.versionRelease_ < VERSION_RELEASE) {
            throw new Error_1.MESHJsBlockVersionError(this.versionMajor_, this.versionMinor_, this.versionRelease_);
        }
        return true;
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
        if (data.length !== this.REGULARLY_LENGTH_) {
            return false;
        }
        if (data[this.MESSAGE_TYPE_ID_INDEX] !== this.MESSAGE_TYPE_ID_VALUE_) {
            return false;
        }
        if (data[this.EVENT_TYPE_ID_INDEX] !== this.REGULARLY_EVENT_TYPE_ID_VALUE_) {
            return false;
        }
        this.battery_ = data[this.REGULARLY_BATTERY_INDEX_];
        if (typeof this.onBatteryLevel !== 'function') {
            return false;
        }
        this.onBatteryLevel(this.battery_);
        return true;
    }
    updateStatusButton_(data) {
        if (data.length !== this.STATUSBUTTON_PRESSED_LENGTH_) {
            return false;
        }
        if (data[this.MESSAGE_TYPE_ID_INDEX] !== this.MESSAGE_TYPE_ID_VALUE_) {
            return false;
        }
        if (data[this.EVENT_TYPE_ID_INDEX] !==
            this.STATUSBUTTON_PRESSED_EVENT_TYPE_ID_VALUE_) {
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
exports.Base = Base;
