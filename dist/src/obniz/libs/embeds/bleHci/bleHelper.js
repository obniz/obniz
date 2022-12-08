"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BleHelper = void 0;
class BleHelper {
    uuidFilter(uuid) {
        return uuid.toLowerCase().replace(/[^0-9abcdef]/g, '');
    }
    deviceAddressFilter(uuid) {
        return uuid.toLowerCase().replace(/[^0-9abcdef]/g, '');
    }
    toCamelCase(str) {
        str = str.charAt(0).toLowerCase() + str.slice(1);
        return str.replace(/[-_](.)/g, (match, group1) => {
            return group1.toUpperCase();
        });
    }
    toSnakeCase(str) {
        const camel = this.toCamelCase(str);
        return camel.replace(/[A-Z]/g, (s) => {
            return '_' + s.charAt(0).toLowerCase();
        });
    }
    buffer2reversedHex(buf, sepalator = '') {
        return this.reverseHexString(buf.toString('hex'), sepalator);
    }
    hex2reversedBuffer(address, sepalator = '') {
        if (sepalator === '') {
            return Buffer.from(this.reverseHexString(address), 'hex');
        }
        return Buffer.from(address.split(':').reverse().join(''), 'hex');
    }
    reverseHexString(str, separator = '') {
        // 40msec (100000 times)
        // return str
        //   .match(/.{1,2}/g)!
        //   .reverse()
        //   .join(separator);
        // 30msec (100000 times)
        // const parts = [];
        // for (let i = 0; i < str.length; i += 2) {
        //   parts.push(str.slice(i, i + 2));
        // }
        // return parts.reverse().join(separator);
        // 13msec (100000 times)
        let result = '';
        const len = str.length + (str.length % 2);
        for (let i = len; i > 0; i -= 2) {
            result += str.slice(i - 2, i) + separator;
        }
        if (separator.length !== 0) {
            return result.slice(0, -1 * separator.length);
        }
        return result;
    }
    addColon(str) {
        const parts = [];
        for (let i = 0; i < str.length; i += 2) {
            parts.push(str.slice(i, i + 2));
        }
        return parts.join(':');
    }
}
exports.BleHelper = BleHelper;
exports.default = new BleHelper();
