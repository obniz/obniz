"use strict";
/**
 * @packageDocumentation
 * @module ObnizCore
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObnizComponents = void 0;
const ble_1 = require("./libs/embeds/bleHci/ble");
const display_1 = require("./libs/embeds/display");
const switch_1 = require("./libs/embeds/switch");
const ad_1 = require("./libs/io_peripherals/ad");
const directive_1 = require("./libs/io_peripherals/directive");
const i2c_1 = require("./libs/io_peripherals/i2c");
const io_1 = require("./libs/io_peripherals/io");
const pwm_1 = require("./libs/io_peripherals/pwm");
const spi_1 = require("./libs/io_peripherals/spi");
const uart_1 = require("./libs/io_peripherals/uart");
const logicanalyzer_1 = require("./libs/measurements/logicanalyzer");
const measure_1 = require("./libs/measurements/measure");
const wifi_1 = require("./libs/network/wifi");
const plugin_1 = require("./libs/plugin/plugin");
const tcp_1 = require("./libs/protocol/tcp");
const ObnizParts_1 = require("./ObnizParts");
const ComponentAbstact_1 = require("./libs/ComponentAbstact");
const hw_1 = require("./libs/hw");
const grove_1 = require("./libs/io_peripherals/grove");
class ObnizComponents extends ObnizParts_1.ObnizParts {
    constructor(id, options) {
        super(id, options);
        this.pongObservers = [];
        this._allComponentKeys = [];
    }
    /**
     * Output pin Vcc and Gnd
     *
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
     *
     * @param io
     */
    getIO(io) {
        this.throwErrorIfOffline();
        if (!this.isValidIO(io)) {
            throw new Error('io ' + io + ' is not valid io');
        }
        return this['io' + io];
    }
    /**
     * GET AD module from pin no
     *
     * @param io
     */
    getAD(io) {
        this.throwErrorIfOffline();
        if (!this.isValidIO(io)) {
            throw new Error('ad ' + io + ' is not valid io');
        }
        return this['ad' + io];
    }
    /**
     * It returns unused PWM module.
     */
    getFreePwm() {
        return this._getFreePeripheralUnit('pwm');
    }
    /**
     * It returns unused I2C module.
     */
    getFreeI2C() {
        return this._getFreePeripheralUnit('i2c');
    }
    /**
     * It returns setuped I2C module .
     *
     * @param config
     */
    getI2CWithConfig(config) {
        if (typeof config !== 'object') {
            throw new Error('getI2CWithConfig need config arg');
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
        return this._getFreePeripheralUnit('spi');
    }
    /**
     * It returns setuped SPI module.
     *
     * @param config
     */
    getSpiWithConfig(config) {
        if (typeof config !== 'object') {
            throw new Error('getSpiWithConfig need config arg');
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
        return this._getFreePeripheralUnit('uart');
    }
    /**
     * It returns unused TCP module.
     */
    getFreeTcp() {
        return this._getFreePeripheralUnit('tcp');
    }
    hasExtraInterface(interfaceName) {
        return !!this.getExtraInterface(interfaceName);
    }
    getExtraInterface(interfaceName) {
        if (this._hwDefinition.extraInterface &&
            this._hwDefinition.extraInterface[interfaceName]) {
            return this._hwDefinition.extraInterface[interfaceName];
        }
        return null;
    }
    _close() {
        super._close();
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
        this._hwDefinition = hw_1.HW.getDefinitionFor(this.hw);
        if (!this._hwDefinition) {
            throw new Error(`unkown hw ${this.hw || ''}`);
        }
        const hw_peripherals = this._hwDefinition.peripherals;
        this._hw_peripherals = hw_peripherals;
        const hw_embeds = this._hwDefinition.embeds;
        const hw_protocol = this._hwDefinition.protocol;
        const hw_network = this._hwDefinition.network;
        const shared_map = {
            io: directive_1.Directive,
            logicAnalyzer: logicanalyzer_1.LogicAnalyzer,
            measure: measure_1.ObnizMeasure,
            plugin: plugin_1.Plugin,
        };
        const peripheral_map = {
            io: io_1.PeripheralIO,
            ad: ad_1.PeripheralAD,
            uart: uart_1.PeripheralUART,
            spi: spi_1.PeripheralSPI,
            i2c: i2c_1.PeripheralI2C,
            pwm: pwm_1.PeripheralPWM,
            grove: grove_1.PeripheralGrove,
        };
        const ble = ble_1.ObnizBLE;
        const embeds_map = {
            display: display_1.Display,
            switch: switch_1.ObnizSwitch,
            ble,
        };
        const protocol_map = {
            tcp: tcp_1.Tcp,
        };
        const network_map = {
            wifi: wifi_1.WiFi,
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
                    if (typeof this[key].debugHandler === 'function') {
                        this[key].debugHandler = (text) => {
                            this._print_debug(text);
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
        this._print_debug('components state resets');
        for (const key of this._allComponentKeys) {
            this[key]._reset();
        }
    }
    _notifyToModule(obj) {
        super._notifyToModule(obj);
        for (const key of this._allComponentKeys) {
            const targetComponent = this[key];
            if (targetComponent instanceof ComponentAbstact_1.ComponentAbstract) {
                const basePath = targetComponent.schemaBasePath();
                // eslint-disable-next-line no-prototype-builtins
                if (basePath && obj.hasOwnProperty(basePath)) {
                    targetComponent.notifyFromObniz(obj[basePath]);
                }
            }
            else {
                if (key === 'logicAnalyzer') {
                    // eslint-disable-next-line no-prototype-builtins
                    if (obj.hasOwnProperty('logic_analyzer')) {
                        this.logicAnalyzer.notified(obj.logic_analyzer);
                    }
                    continue;
                }
                // eslint-disable-next-line no-prototype-builtins
                if (obj.hasOwnProperty(key)) {
                    /* because of nullable */
                    targetComponent.notified(obj[key]);
                }
            }
        }
    }
    _handleSystemCommand(wsObj) {
        super._handleSystemCommand(wsObj);
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
        this.throwErrorIfOffline();
        for (const key of this._allComponentKeys) {
            if (key.indexOf(peripheral) === 0) {
                /* "io" for "io0" */
                const obj = this[key];
                if (typeof obj === 'object' && !obj.isUsed()) {
                    obj.used = true;
                    return obj;
                }
            }
        }
        throw new Error(`No More ${peripheral} Available.`);
    }
}
exports.ObnizComponents = ObnizComponents;
