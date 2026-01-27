"use strict";
/**
 * @packageDocumentation
 * @module ObnizCore.Components
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PeripheralCANBus = void 0;
const ComponentAbstact_1 = require("../ComponentAbstact");
const util_1 = require("../utils/util");
/**
 * CAN Bus
 *
 * @category Peripherals
 */
class PeripheralCANBus extends ComponentAbstact_1.ComponentAbstract {
    constructor(obniz, id) {
        super(obniz);
        this.id = id;
        this.on('/response/canbus/receive', (obj) => {
            if (this.onreceive) {
                this.Obniz._runUserCreatedFunction(this.onreceive, obj.extended, obj.rtr, obj.id, obj.data);
            }
        });
        this._reset();
    }
    /**
     * Start CAN Bus
     *
     *
     *
     * ```javascript
     * // Javascript Example
     * obniz.canbus0.start({mode:"normal", tx :0, rx:1, kbps:100, filter_code: 0, filter_mask: 0});
     * ```
     *
     * @param params CAN Bus parameters
     */
    start(params) {
        const err = util_1.ObnizUtil._requiredKeys(params, ['tx', 'rx', 'kbps', 'mode']);
        if (err) {
            throw new Error("canbus start param '" + err + "' required, but not found ");
        }
        this.params = util_1.ObnizUtil._keyFilter(params, [
            'tx',
            'rx',
            'mode',
            'kbps',
            'filter_code',
            'filter_mask',
        ]);
        const modes = ['normal', 'noack', 'listen'];
        if (!modes.includes(params.mode)) {
            throw new Error(`invalid mode ${params.mode}`);
        }
        const ioKeys = ['tx', 'rx'];
        for (const key of ioKeys) {
            if (this.params[key] && !this.Obniz.isValidIO(this.params[key])) {
                throw new Error("CAN Bus start param '" + key + "' are to be valid io no");
            }
        }
        const obj = {};
        obj['canbus' + this.id] = {
            mode: params.mode,
            tx: params.tx,
            rx: params.rx,
            kbps: params.kbps,
            filter_code: params.filter_code,
            filter_mask: params.filter_mask,
        };
        this.used = true;
        this.Obniz.send(obj);
    }
    /**
     * It only sends data to canbus and does not receive it.
     *
     * ```javascript
     * // Javascript Example
     * obniz.canbus0.start({mode:"normal", tx :0, rx:1, kbps:100, filter_code: 0, filter_mask: 0});
     * obniz.canbus0.send({}, 0x700, [0x12, 0x98]);
     * ```
     *
     * @param data Max length is 1024 bytes.
     */
    send(modes, id, data) {
        if (!this.used) {
            throw new Error(`canbus${this.id} is not started`);
        }
        const obj = {};
        obj['canbus' + this.id] = {
            data,
            id,
            extended: modes.extended === true,
            rtr: modes.rtr === true,
            single_shot: modes.single_shot === true,
            self_reception: modes.self_reception === true,
        };
        this.Obniz.send(obj);
    }
    /**
     * @ignore
     */
    isUsed() {
        return this.used;
    }
    /**
     * It ends canbus
     *
     * ```javascript
     * // Javascript Example
     * obniz.canbus0.start({mode:"normal", tx :0, rx:1, kbps:100, filter_code: 0, filter_mask: 0});
     * obniz.canbus0.end();
     * ```
     *
     */
    end() {
        const obj = {};
        obj['canbus' + this.id] = null;
        this.params = null;
        this.Obniz.send(obj);
    }
    /**
     * @ignore
     * @private
     */
    schemaBasePath() {
        return 'canbus' + this.id;
    }
    /**
     * @ignore
     * @private
     */
    _reset() {
        this.used = false;
        this.params = null;
    }
}
exports.PeripheralCANBus = PeripheralCANBus;
