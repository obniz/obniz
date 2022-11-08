"use strict";
/**
 * @packageDocumentation
 * @module ObnizCore.Components
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PeripheralUART = void 0;
const ComponentAbstact_1 = require("../ComponentAbstact");
const util_1 = require("../utils/util");
/**
 * Uart module
 *
 * @category Peripherals
 */
class PeripheralUART extends ComponentAbstact_1.ComponentAbstract {
    constructor(obniz, id) {
        super(obniz);
        this.id = id;
        this.on('/response/uart/receive', (obj) => {
            if (this.onreceive) {
                const string = this.tryConvertString(obj.data);
                this.Obniz._runUserCreatedFunction(this.onreceive, obj.data, string);
            }
            else {
                if (!this.received) {
                    this.received = [];
                }
                this.received.push(...obj.data);
            }
        });
        this._reset();
    }
    /**
     * It starts uart on io tx, rx.
     *
     * You can start uart without much configuration. Just use as below.
     *
     * @param params
     */
    start(params) {
        const err = util_1.ObnizUtil._requiredKeys(params, ['tx', 'rx']);
        if (err) {
            throw new Error("uart start param '" + err + "' required, but not found ");
        }
        this.params = util_1.ObnizUtil._keyFilter(params, [
            'tx',
            'rx',
            'baud',
            'stop',
            'bits',
            'parity',
            'flowcontrol',
            'rts',
            'cts',
            'drive',
            'pull',
            'gnd',
        ]);
        const ioKeys = ['rx', 'tx', 'rts', 'cts', 'gnd'];
        for (const key of ioKeys) {
            if (this.params[key] && !this.Obniz.isValidIO(this.params[key])) {
                throw new Error("uart start param '" + key + "' are to be valid io no");
            }
        }
        // eslint-disable-next-line no-prototype-builtins
        if (this.params.hasOwnProperty('drive')) {
            this.Obniz.getIO(this.params.rx).drive(this.params.drive);
            this.Obniz.getIO(this.params.tx).drive(this.params.drive);
        }
        else {
            this.Obniz.getIO(this.params.rx).drive('5v');
            this.Obniz.getIO(this.params.tx).drive('5v');
        }
        // eslint-disable-next-line no-prototype-builtins
        if (this.params.hasOwnProperty('pull')) {
            this.Obniz.getIO(this.params.rx).pull(this.params.pull);
            this.Obniz.getIO(this.params.tx).pull(this.params.pull);
        }
        else {
            this.Obniz.getIO(this.params.rx).pull(null);
            this.Obniz.getIO(this.params.tx).pull(null);
        }
        // eslint-disable-next-line no-prototype-builtins
        if (this.params.hasOwnProperty('gnd')) {
            this.Obniz.getIO(this.params.gnd).output(false);
            const ioNames = {};
            ioNames[this.params.gnd] = 'gnd';
            if (this.Obniz.display) {
                this.Obniz.display.setPinNames('uart' + this.id, ioNames);
            }
        }
        const obj = {};
        const sendParams = util_1.ObnizUtil._keyFilter(this.params, [
            'tx',
            'rx',
            'baud',
            'stop',
            'bits',
            'parity',
            'flowcontrol',
            'rts',
            'cts',
        ]);
        obj['uart' + this.id] = sendParams;
        this.Obniz.send(obj);
        this.received = [];
        this.used = true;
    }
    /**
     * This sends data.
     *
     * Available formats are
     *
     * - string
     * utf8 encoded byte array. Does not include null terminate
     *
     * - number
     * will be one byte data
     *
     * - array of number
     * array of bytes
     *
     * - Buffer
     * array of bytes
     *
     *
     * ```javascript
     * // Javascript Example
     * obniz.uart0.start({tx:0, rx:1})
     * obniz.uart0.send("Hi");
     * obniz.uart0.send(0x11);
     * obniz.uart0.send([0x11, 0x45, 0x44]);
     * ```
     *
     * @param data
     */
    send(data) {
        if (!this.used) {
            throw new Error(`uart${this.id} is not started`);
        }
        let send_data = null;
        if (data === undefined) {
            return;
        }
        if (typeof data === 'number') {
            data = [data];
        }
        if (this.Obniz.isNode && data instanceof Buffer) {
            send_data = [...data];
        }
        else if (data.constructor === Array) {
            send_data = data;
        }
        else if (typeof data === 'string') {
            const buf = Buffer.from(data);
            send_data = [...buf];
        }
        const obj = {};
        obj['uart' + this.id] = {};
        obj['uart' + this.id].data = send_data;
        //  console.log(obj);
        this.Obniz.send(obj);
    }
    /**
     * It checks if there are data received but not yet used.
     * If there are, it returns true.
     *
     * If you are using onreceive callback, it will always be false because you receive the data with the callback function as the data arrives.
     *
     * ```javascript
     * // Javascript Example
     * obniz.uart0.start({tx:0, rx:1})
     *
     * while(1){
     *   if(obniz.uart0.isDataExists()){
     *      console.log(obniz.uart0.readText());
     *   }
     *   await obniz.wait(10);  //wait for 10ms
     * }
     * ```
     *
     */
    isDataExists() {
        return this.received && this.received.length > 0;
    }
    /**
     * It returns the data array that are received but not yet used.
     *
     * ```javascript
     * // Javascript Example
     * obniz.uart0.start({tx:0, rx:1})
     *
     * while(1){
     *   if(obniz.uart0.isDataExists()){
     *      console.log(obniz.uart0.readBytes());
     *   }
     *   await obniz.wait(10);  //wait for 10ms
     * }
     * ```
     *
     * @return received data. If not exist data, return [].
     */
    readBytes() {
        const results = [];
        if (this.isDataExists()) {
            for (let i = 0; i < this.received.length; i++) {
                results.push(this.received[i]);
            }
        }
        this.received = [];
        return results;
    }
    /**
     * It returns the one byte that are received but not yet used.
     *
     * ```javascript
     * // Javascript Example
     * obniz.uart0.start({tx:0, rx:1})
     *
     * while(1){
     *    if(obniz.uart0.isDataExists()){
     *      console.log(obniz.uart0.readBytes());
     *    }
     *    await obniz.wait(10);  //wait for 10ms
     * }
     * ```
     *
     * @return received data. If not exist data, return null.
     */
    readByte() {
        const results = [];
        if (this.isDataExists()) {
            return results.unshift();
        }
        return null;
    }
    /**
     * It returns the data that are received but not yet used as string.
     *
     * ```javascript
     * // Javascript Example
     * obniz.uart0.start({tx:0, rx:1})
     *
     * while(1){
     *   if(obniz.uart0.isDataExists()){
     *     console.log(obniz.uart0.readText());
     *   }
     *   await obniz.wait(10);  //wait for 10ms
     * }
     * ```
     *
     * @return received text data. If not exist data, return null.
     */
    readText() {
        let string = null;
        if (this.isDataExists()) {
            const data = this.readBytes();
            string = this.tryConvertString(data);
        }
        this.received = [];
        return string;
    }
    /**
     * @ignore
     */
    isUsed() {
        return this.used;
    }
    /**
     * It stops uart and releases io.
     *
     * ```javascript
     * // Javascript Example
     * obniz.uart0.start({tx:0, rx:1})
     * obniz.uart0.send("Hi");
     * obniz.uart0.end();
     * ```
     */
    end() {
        const obj = {};
        obj['uart' + this.id] = null;
        this.params = null;
        this.Obniz.send(obj);
        this.used = false;
    }
    /**
     * Convert data array to string.
     *
     * @param data data array
     *
     * @return converted string. If convert failed, return null.
     */
    tryConvertString(data) {
        return util_1.ObnizUtil.dataArray2string(data);
    }
    /**
     * @ignore
     * @private
     */
    schemaBasePath() {
        return 'uart' + this.id;
    }
    /**
     * @ignore
     * @private
     */
    _reset() {
        this.received = [];
        this.used = false;
    }
}
exports.PeripheralUART = PeripheralUART;
