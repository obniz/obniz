"use strict";
/**
 * @packageDocumentation
 * @module ObnizCore.Components
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PeripheralSPI = void 0;
const semver_1 = __importDefault(require("semver"));
const ComponentAbstact_1 = require("../ComponentAbstact");
const util_1 = require("../utils/util");
/**
 * It is General Purpose SPI
 *
 * @category Peripherals
 */
class PeripheralSPI extends ComponentAbstact_1.ComponentAbstract {
    constructor(obniz, id) {
        super(obniz);
        this.id = id;
        this._reset();
    }
    /**
     * It starts spi. Now the mode is only "master".
     *
     *
     * drive and pull are optional settings for io output.
     * Default settings are drive:5v, pull:null.
     * See more using obniz.io.drive() or pull().
     *
     * ```javascript
     * // Javascript Example
     * obniz.spi0.start({mode:"master", clk :0, mosi:1, miso:2, frequency:1000000});
     * var ret = await obniz.spi0.writeWait([0x12, 0x98]);
     * console.log("received: "+ret);
     *
     * // drive and pull is optional
     * obniz.spi0.start({mode:"master", clk :0, mosi:1, miso:2, frequency:1000000, drive: "5v", pull:null});
     * ```
     *
     * @param params spi parameters
     */
    start(params) {
        const err = util_1.ObnizUtil._requiredKeys(params, ['mode', 'frequency']);
        if (err) {
            throw new Error("spi start param '" + err + "' required, but not found ");
        }
        this.params = util_1.ObnizUtil._keyFilter(params, [
            'mode',
            'clk',
            'mosi',
            'miso',
            'frequency',
            'drive',
            'pull',
            'gnd',
        ]);
        const obj = {};
        const ioKeys = [
            'clk',
            'mosi',
            'miso',
            'gnd',
        ];
        for (const key of ioKeys) {
            if (this.params[key] && !this.Obniz.isValidIO(this.params[key])) {
                throw new Error("spi start param '" + key + "' are to be valid io no");
            }
        }
        obj['spi' + this.id] = {
            mode: this.params.mode,
            clock: this.params.frequency, // name different
        };
        if (this.params.clk !== undefined) {
            obj['spi' + this.id].clk = this.params.clk;
        }
        if (this.params.mosi !== undefined) {
            obj['spi' + this.id].mosi = this.params.mosi;
        }
        if (this.params.miso !== undefined) {
            obj['spi' + this.id].miso = this.params.miso;
        }
        if (this.params.drive) {
            if (this.params.clk !== undefined) {
                this.Obniz.getIO(this.params.clk).drive(this.params.drive);
            }
            if (this.params.mosi !== undefined) {
                this.Obniz.getIO(this.params.mosi).drive(this.params.drive);
            }
            if (this.params.miso !== undefined) {
                this.Obniz.getIO(this.params.miso).drive(this.params.drive);
            }
        }
        else {
            if (this.params.clk !== undefined) {
                this.Obniz.getIO(this.params.clk).drive('5v');
            }
            if (this.params.mosi !== undefined) {
                this.Obniz.getIO(this.params.mosi).drive('5v');
            }
            if (this.params.miso !== undefined) {
                this.Obniz.getIO(this.params.miso).drive('5v');
            }
        }
        if (this.params.pull) {
            if (this.params.clk !== undefined) {
                this.Obniz.getIO(this.params.clk).pull(this.params.pull);
            }
            if (this.params.mosi !== undefined) {
                this.Obniz.getIO(this.params.mosi).pull(this.params.pull);
            }
            if (this.params.miso !== undefined) {
                this.Obniz.getIO(this.params.miso).pull(this.params.pull);
            }
        }
        else {
            if (this.params.clk !== undefined) {
                this.Obniz.getIO(this.params.clk).pull(null);
            }
            if (this.params.mosi !== undefined) {
                this.Obniz.getIO(this.params.mosi).pull(null);
            }
            if (this.params.miso !== undefined) {
                this.Obniz.getIO(this.params.miso).pull(null);
            }
        }
        if (this.params.gnd !== undefined) {
            this.Obniz.getIO(this.params.gnd).output(false);
            const ioNames = {};
            ioNames[this.params.gnd] = 'gnd';
            if (this.Obniz.display) {
                this.Obniz.display.setPinNames('spi' + this.id, ioNames);
            }
        }
        this.used = true;
        this.Obniz.send(obj);
    }
    /**
     * It sends data to spi and wait until data are received.
     * The received data length is the same as the sent data.
     *
     * ```javascript
     * // Javascript Example
     * obniz.spi0.start({mode:"master", clk :0, mosi:1, miso:2, frequency:1000000});
     * var ret = await obniz.spi0.writeWait([0x12, 0x98]);
     * console.log("received: "+ret);
     * ```
     *
     *
     * @param data Max length is 1024 bytes.
     * @return received data
     */
    async writeWait(data) {
        if (!this.used) {
            throw new Error(`spi${this.id} is not started`);
        }
        if (semver_1.default.lte(this.Obniz.firmware_ver, '1.0.2') && data.length > 32) {
            throw new Error(`with your obniz ${this.Obniz.firmware_ver}. spi max length=32byte but yours ${data.length}. Please update obniz firmware`);
        }
        const obj = {};
        obj['spi' + this.id] = {
            data,
            read: true,
        };
        const receiveData = await this.sendAndReceiveJsonWait(obj, '/response/spi/read');
        return receiveData.data;
    }
    /**
     * It only sends data to spi and does not receive it.
     *
     * ```javascript
     * // Javascript Example
     * obniz.spi0.start({mode:"master", clk :0, mosi:1, miso:2, frequency:1000000});
     * obniz.spi0.write([0x12, 0x98]);
     * ```
     *
     * @param data Max length is 1024 bytes.
     */
    write(data) {
        if (!this.used) {
            throw new Error(`spi${this.id} is not started`);
        }
        if (semver_1.default.lte(this.Obniz.firmware_ver, '1.0.2') && data.length > 32) {
            throw new Error(`with your obniz ${this.Obniz.firmware_ver}. spi max length=32byte but yours ${data.length}. Please update obniz firmware`);
        }
        const obj = {};
        obj['spi' + this.id] = {
            data,
            read: false,
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
     * It ends spi
     *
     * ```javascript
     * // Javascript Example
     * obniz.spi0.start({mode:"master", clk :0, mosi:1, miso:2, clock:1000000});
     * obniz.spi0.write([0x12, 0x98]);
     * obniz.spi0.end();
     * ```
     *
     * @param reuse
     * - True : getFreeSpi will not return this object
     * - False : getFreeSpi will return this object
     */
    end(reuse) {
        const obj = {};
        obj['spi' + this.id] = null;
        this.params = null;
        this.Obniz.send(obj);
        if (!reuse) {
            this.used = false;
        }
    }
    /**
     * @ignore
     * @private
     */
    schemaBasePath() {
        return 'spi' + this.id;
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
exports.PeripheralSPI = PeripheralSPI;
