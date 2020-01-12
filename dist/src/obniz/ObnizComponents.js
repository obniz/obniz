"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const semver = require("semver");
const ble_1 = __importDefault(require("./libs/embeds/ble/ble"));
const ble_2 = __importDefault(require("./libs/embeds/bleHci/ble"));
const display_1 = __importDefault(require("./libs/embeds/display"));
const switch_1 = __importDefault(require("./libs/embeds/switch"));
const ad_1 = __importDefault(require("./libs/io_peripherals/ad"));
const directive_1 = __importDefault(require("./libs/io_peripherals/directive"));
const i2c_1 = __importDefault(require("./libs/io_peripherals/i2c"));
const io_1 = __importDefault(require("./libs/io_peripherals/io"));
const pwm_1 = __importDefault(require("./libs/io_peripherals/pwm"));
const spi_1 = __importDefault(require("./libs/io_peripherals/spi"));
const uart_1 = __importDefault(require("./libs/io_peripherals/uart"));
const logicanalyzer_1 = __importDefault(require("./libs/measurements/logicanalyzer"));
const measure_1 = __importDefault(require("./libs/measurements/measure"));
const tcp_1 = __importDefault(require("./libs/protocol/tcp"));
const ObnizParts_1 = __importDefault(require("./ObnizParts"));
const hw_1 = __importDefault(require("./libs/hw"));
class ObnizComponents extends ObnizParts_1.default {
    constructor(id, options) {
        super(id, options);
        this.pongObservers = [];
        this._allComponentKeys = [];
    }
    close() {
        super.close();
        if (this.options.reset_obniz_on_ws_disconnection) {
            this._resetComponents();
        }
    }
    _callOnConnect() {
        this._prepareComponents();
        super._callOnConnect();
    }
    _prepareComponents() {
        if (this._allComponentKeys.length !== 0) {
            return;
        }
        const hwDefinition = hw_1.default.getDefinitionFor(this.hw);
        if (!hwDefinition) {
            throw new Error(`unkown hw ${this.hw}`);
        }
        const hw_peripherals = hwDefinition.peripherals;
        const hw_embeds = hwDefinition.embeds;
        const hw_protocol = hwDefinition.protocol;
        const shared_map = {
            io: directive_1.default,
            logicAnalyzer: logicanalyzer_1.default,
            measure: measure_1.default,
        };
        const peripheral_map = {
            io: io_1.default,
            ad: ad_1.default,
            uart: uart_1.default,
            spi: spi_1.default,
            i2c: i2c_1.default,
            pwm: pwm_1.default,
        };
        let ble = ble_2.default;
        // < 3.0.0-beta
        if (semver.lt(this.firmware_ver, "3.0.0-beta")) {
            ble = ble_1.default;
        }
        const embeds_map = {
            display: display_1.default,
            switch: switch_1.default,
            ble,
        };
        const protocol_map = {
            tcp: tcp_1.default,
        };
        for (const key in shared_map) {
            const Class = shared_map[key];
            this[key] = new Class(this);
            this._allComponentKeys.push(key);
        }
        if (hw_peripherals) {
            for (const key in peripheral_map) {
                if (hw_peripherals[key]) {
                    const units = hw_peripherals[key].units;
                    const Class = peripheral_map[key];
                    for (const unitId in units) {
                        const unitIdNumber = parseInt(unitId);
                        this[key + unitIdNumber] = new Class(this, unitIdNumber);
                        this._allComponentKeys.push(key + unitIdNumber);
                    }
                }
            }
        }
        if (hw_embeds) {
            for (const key in embeds_map) {
                if (hw_embeds[key]) {
                    const Class = embeds_map[key];
                    this[key] = new Class(this);
                    this._allComponentKeys.push(key);
                }
            }
        }
        if (hw_protocol) {
            for (const key in protocol_map) {
                if (hw_protocol[key]) {
                    const units = hw_protocol[key].units;
                    const Class = protocol_map[key];
                    for (const unitId in units) {
                        const unitIdNumber = parseInt(unitId);
                        this[key + unitIdNumber] = new Class(this, unitIdNumber);
                        this._allComponentKeys.push(key + unitIdNumber);
                    }
                }
            }
        }
    }
    _resetComponents() {
        this.print_debug("components state resets");
        for (const key of this._allComponentKeys) {
            this[key]._reset();
        }
    }
    notifyToModule(obj) {
        super.notifyToModule(obj);
        for (const key of this._allComponentKeys) {
            if (key === "logicAnalyzer") {
                if (obj.hasOwnProperty("logic_analyzer")) {
                    this.logicAnalyzer.notified(obj.logic_analyzer);
                }
                continue;
            }
            if (obj.hasOwnProperty(key)) {
                /* because of nullable */
                this[key].notified(obj[key]);
            }
        }
    }
    handleSystemCommand(wsObj) {
        super.handleSystemCommand(wsObj);
        // ping pong
        if (wsObj.pong) {
            for (const callback of this.pongObservers) {
                callback(wsObj);
            }
        }
    }
    addPongObserver(callback) {
        if (callback) {
            this.pongObservers.push(callback);
        }
    }
    removePongObserver(callback) {
        if (this.pongObservers.includes(callback)) {
            const index = this.pongObservers.indexOf(callback);
            this.pongObservers.splice(index, 1);
        }
    }
    setVccGnd(vcc, gnd, drive) {
        if (this.isValidIO(vcc)) {
            if (drive) {
                this.getIO(vcc).drive(drive);
            }
            this.getIO(vcc).output(true);
        }
        if (this.isValidIO(gnd)) {
            if (drive) {
                this.getIO(gnd).drive(drive);
            }
            this.getIO(gnd).output(false);
        }
    }
    getIO(io) {
        if (!this.isValidIO(io)) {
            throw new Error("io " + io + " is not valid io");
        }
        return this["io" + io];
    }
    getAD(io) {
        if (!this.isValidIO(io)) {
            throw new Error("ad " + io + " is not valid io");
        }
        return this["ad" + io];
    }
    _getFreePeripheralUnit(peripheral) {
        for (const key of this._allComponentKeys) {
            if (key.indexOf(peripheral) === 0) {
                /* "io" for "io0" */
                const obj = this[key];
                if (typeof obj === "object" && !obj.isUsed()) {
                    obj.used = true;
                    return obj;
                }
            }
        }
        throw new Error(`No More ${peripheral} Available.`);
    }
    getFreePwm() {
        return this._getFreePeripheralUnit("pwm");
    }
    getFreeI2C() {
        return this._getFreePeripheralUnit("i2c");
    }
    getI2CWithConfig(config) {
        if (typeof config !== "object") {
            throw new Error("getI2CWithConfig need config arg");
        }
        if (config.i2c) {
            return config.i2c;
        }
        const i2c = this.getFreeI2C();
        i2c.start(config);
        return i2c;
    }
    getFreeSpi() {
        return this._getFreePeripheralUnit("spi");
    }
    getSpiWithConfig(config) {
        if (typeof config !== "object") {
            throw new Error("getSpiWithConfig need config arg");
        }
        if (config.spi) {
            return config.spi;
        }
        const spi = this.getFreeSpi();
        spi.start(config);
        return spi;
    }
    getFreeUart() {
        return this._getFreePeripheralUnit("uart");
    }
    getFreeTcp() {
        return this._getFreePeripheralUnit("tcp");
    }
}
exports.default = ObnizComponents;
//# sourceMappingURL=ObnizComponents.js.map