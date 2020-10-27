"use strict";
/**
 * @packageDocumentation
 * @module ObnizCore
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ble_1 = __importDefault(require("./libs/embeds/bleHci/ble"));
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
const wifi_1 = __importDefault(require("./libs/network/wifi"));
const plugin_1 = __importDefault(require("./libs/plugin/plugin"));
const tcp_1 = __importDefault(require("./libs/protocol/tcp"));
const ObnizParts_1 = __importDefault(require("./ObnizParts"));
const ComponentAbstact_1 = require("./libs/ComponentAbstact");
const hw_1 = __importDefault(require("./libs/hw"));
const grove_1 = __importDefault(require("./libs/io_peripherals/grove"));
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
    /**
     * Output pin Vcc and Gnd
     * @param vcc
     * @param gnd
     * @param drive
     */
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
    /**
     * Get IO module from pin no
     * @param io
     */
    getIO(io) {
        if (!this.isValidIO(io)) {
            throw new Error("io " + io + " is not valid io");
        }
        return this["io" + io];
    }
    /**
     * GET AD module from pin no
     * @param io
     */
    getAD(io) {
        if (!this.isValidIO(io)) {
            throw new Error("ad " + io + " is not valid io");
        }
        return this["ad" + io];
    }
    /**
     * It returns unused PWM module.
     */
    getFreePwm() {
        return this._getFreePeripheralUnit("pwm");
    }
    /**
     * It returns unused I2C module.
     */
    getFreeI2C() {
        return this._getFreePeripheralUnit("i2c");
    }
    /**
     * It returns setuped I2C module .
     * @param config
     */
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
    /**
     * It returns unused SPI module.
     */
    getFreeSpi() {
        return this._getFreePeripheralUnit("spi");
    }
    /**
     * It returns setuped SPI module.
     * @param config
     */
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
    /**
     * It returns unused UART module.
     */
    getFreeUart() {
        return this._getFreePeripheralUnit("uart");
    }
    /**
     * It returns unused TCP module.
     */
    getFreeTcp() {
        return this._getFreePeripheralUnit("tcp");
    }
    hasExtraInterface(interfaceName) {
        return !!this.getExtraInterface(interfaceName);
    }
    getExtraInterface(interfaceName) {
        if (this._hwDefinition.extraInterface && this._hwDefinition.extraInterface[interfaceName]) {
            return this._hwDefinition.extraInterface[interfaceName];
        }
        return null;
    }
    _callOnConnect() {
        this._prepareComponents();
        super._callOnConnect();
    }
    _prepareComponents() {
        if (this._allComponentKeys.length !== 0) {
            return;
        }
        this._hwDefinition = hw_1.default.getDefinitionFor(this.hw);
        if (!this._hwDefinition) {
            throw new Error(`unkown hw ${this.hw}`);
        }
        const hw_peripherals = this._hwDefinition.peripherals;
        this._hw_peripherals = hw_peripherals;
        const hw_embeds = this._hwDefinition.embeds;
        const hw_protocol = this._hwDefinition.protocol;
        const hw_network = this._hwDefinition.network;
        const shared_map = {
            io: directive_1.default,
            logicAnalyzer: logicanalyzer_1.default,
            measure: measure_1.default,
            plugin: plugin_1.default,
        };
        const peripheral_map = {
            io: io_1.default,
            ad: ad_1.default,
            uart: uart_1.default,
            spi: spi_1.default,
            i2c: i2c_1.default,
            pwm: pwm_1.default,
            grove: grove_1.default,
        };
        const ble = ble_1.default;
        const embeds_map = {
            display: display_1.default,
            switch: switch_1.default,
            ble,
        };
        const protocol_map = {
            tcp: tcp_1.default,
        };
        const network_map = {
            wifi: wifi_1.default,
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
                        this[key + unitIdNumber] = new Class(this, unitIdNumber, units[unitId]);
                        this._allComponentKeys.push(key + unitIdNumber);
                    }
                }
            }
        }
        if (hw_embeds) {
            for (const key in embeds_map) {
                if (hw_embeds[key]) {
                    const Class = embeds_map[key];
                    this[key] = new Class(this, hw_embeds[key]);
                    this._allComponentKeys.push(key);
                    if (typeof this[key].debugHandler === "function") {
                        this[key].debugHandler = (text) => {
                            this.print_debug(text);
                        };
                    }
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
        if (hw_network) {
            for (const key in network_map) {
                if (hw_network[key]) {
                    const Class = network_map[key];
                    this[key] = new Class(this, hw_embeds[key]);
                    this._allComponentKeys.push(key);
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
            const targetComponent = this[key];
            if (targetComponent instanceof ComponentAbstact_1.ComponentAbstract) {
                const basePath = targetComponent.schemaBasePath();
                if (basePath && obj.hasOwnProperty(basePath)) {
                    targetComponent.notifyFromObniz(obj[basePath]);
                }
            }
            else {
                if (key === "logicAnalyzer") {
                    if (obj.hasOwnProperty("logic_analyzer")) {
                        this.logicAnalyzer.notified(obj.logic_analyzer);
                    }
                    continue;
                }
                if (obj.hasOwnProperty(key)) {
                    /* because of nullable */
                    targetComponent.notified(obj[key]);
                }
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
}
exports.default = ObnizComponents;
