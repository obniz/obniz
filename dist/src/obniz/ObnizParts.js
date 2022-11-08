"use strict";
/**
 * @packageDocumentation
 * @module ObnizCore
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObnizParts = void 0;
const util_1 = require("./libs/utils/util");
const ObnizConnection_1 = require("./ObnizConnection");
/**
 * @ignore
 */
const _parts = {};
class ObnizParts extends ObnizConnection_1.ObnizConnection {
    /**
     * @ignore
     * @private
     */
    static _parts() {
        return _parts;
    }
    /**
     * Register Parts class
     *
     * @param arg0 Parts class
     * @param arg1 param for parts
     */
    static PartsRegistrate(arg0, arg1) {
        if (arg0 &&
            typeof arg0.info === 'function' &&
            typeof arg0.info().name === 'string') {
            _parts[arg0.info().name] = arg0;
        }
        else if (typeof arg0 === 'string' && typeof arg1 === 'object') {
            _parts[arg0] = arg1;
        }
    }
    /**
     * Get parts class.
     *
     * @param name string
     * @constructor
     */
    static getPartsClass(name) {
        if (!_parts[name]) {
            throw new Error(`unknown parts [${name}]`);
        }
        return _parts[name];
    }
    constructor(id, options) {
        super(id, options);
    }
    /**
     * Check the param is valid io pin no.
     *
     * @param io
     */
    isValidIO(io) {
        return typeof io === 'number' && this['io' + io] !== null;
    }
    /**
     * Check the param is valid ad pin no.
     *
     * @param ad
     */
    isValidAD(ad) {
        return typeof ad === 'number' && this['ad' + ad] !== null;
    }
    /**
     * Setup Parts of parts library
     *
     * @param partsName
     * @param options
     */
    wired(partsName, options) {
        if (this.connectionState !== 'connected') {
            throw new Error('obniz.wired can only be used after connection');
        }
        const TargetPartsClass = ObnizParts.getPartsClass(partsName);
        if (!TargetPartsClass) {
            throw new Error('No such a parts [' + partsName + '] found');
        }
        const parts = new TargetPartsClass();
        // eslint-disable-next-line prefer-rest-params
        const args = Array.from(arguments);
        args.shift();
        args.unshift(this);
        if (!args[1]) {
            args[1] = {};
        }
        if (parts.keys) {
            if (parts.requiredKeys) {
                const err = util_1.ObnizUtil._requiredKeys(args[1], parts.requiredKeys);
                if (err) {
                    throw new Error(partsName + " wired param '" + err + "' required, but not found ");
                }
            }
            parts.params = util_1.ObnizUtil._keyFilter(args[1], parts.keys);
        }
        parts.obniz = this;
        parts.wired(...args);
        if (parts.keys || parts.ioKeys) {
            const keys = parts.ioKeys || parts.keys;
            const displayPartsName = parts.displayName || partsName;
            const ioNames = {};
            for (const index in keys) {
                let pinName = keys[index];
                const io = args[1][pinName];
                if (this.isValidIO(io)) {
                    if (parts.displayIoNames && parts.displayIoNames[pinName]) {
                        pinName = parts.displayIoNames[pinName];
                    }
                    ioNames[io] = pinName;
                }
            }
            const display = this.display;
            if (display) {
                display.setPinNames(displayPartsName, ioNames);
            }
        }
        return parts;
    }
    static getBleParts(peripheral) {
        const result = Object.entries(_parts)
            .filter(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ([, p]) => p.AvailableBleMode !== undefined &&
            typeof p.getDeviceMode === 'function')
            .map(([n, p]) => [
            n,
            p.getDeviceMode(peripheral),
        ])
            .filter(([, m]) => m !== null)
            // Hiring with long library names
            .sort(([na], [nb]) => (nb !== null && nb !== void 0 ? nb : '').length - (na !== null && na !== void 0 ? na : '').length);
        if (result.length === 0 || !result[0][0] || !result[0][1]) {
            return null;
        }
        const [name, mode] = result[0];
        const parts = new _parts[name](peripheral, mode);
        return parts;
    }
}
exports.ObnizParts = ObnizParts;
