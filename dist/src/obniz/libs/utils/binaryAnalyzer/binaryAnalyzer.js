"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BinaryAnalyzer = void 0;
class BinaryAnalyzer {
    constructor() {
        this._target = [];
    }
    addTarget(name, filter, type, postProcess) {
        this._target.push({
            name,
            filter,
            type,
            postProcess,
            __type: 'BinaryAnalyzerParserRow',
        });
        return this;
    }
    addTargetByLength(name, length, type, postProcess) {
        return this.addTarget(name, new Array(length).fill(-1), type, postProcess);
    }
    addGroup(name, fnOrAnalyzer) {
        const analyzer = fnOrAnalyzer instanceof BinaryAnalyzer
            ? fnOrAnalyzer
            : fnOrAnalyzer(new BinaryAnalyzer());
        this._target.push({
            name,
            filter: analyzer,
            __type: 'BinaryAnalyzerNestRow',
        });
        return this;
    }
    /**
     * 登録済みbinaryAnarlyzerのGroupを解除して、Flatな条件Arrayを作る
     */
    flat() {
        return this._target.reduce((acc, val) => {
            if (val.filter instanceof BinaryAnalyzer) {
                return [...acc, ...val.filter.flat()];
            }
            return [...acc, ...val.filter];
        }, []);
    }
    length() {
        return this.flat().length;
    }
    validate(target) {
        const targetArray = this._convertToNumberArray(target);
        const flat = this.flat();
        if (flat.length > targetArray.length) {
            return false;
        }
        for (let index = 0; index < flat.length; index++) {
            if (flat[index] === -1) {
                continue;
            }
            if (targetArray[index] === flat[index]) {
                continue;
            }
            return false;
        }
        return true;
    }
    getAllData(target) {
        const targetArray = this._convertToNumberArray(target);
        if (!this.validate(targetArray)) {
            return null;
        }
        const result = {};
        let index = 0;
        for (const one of this._target) {
            if (one.__type === 'BinaryAnalyzerNestRow') {
                const newTarget = targetArray.slice(index, index + one.filter.length());
                result[one.name] = one.filter.getAllData(newTarget);
            }
            else {
                const raw = targetArray.slice(index, index + one.filter.length);
                const data = this._doTypeConvertProcess(one, raw);
                result[one.name] = one.postProcess ? one.postProcess(data) : data;
            }
            if (one.filter instanceof BinaryAnalyzer) {
                index += one.filter.length();
            }
            else {
                index += one.filter.length;
            }
        }
        return result;
    }
    _convertToNumberArray(target) {
        if (Array.isArray(target)) {
            return target;
        }
        const buf = typeof target === 'string' ? Buffer.from(target, 'hex') : target;
        return Array.from(buf);
    }
    // number[]を解析して、各Typeに変換する
    _doTypeConvertProcess(config, data) {
        switch (config.type) {
            case 'Ascii':
                return Buffer.from(data).toString('ascii');
            case 'UIntBE':
                return data.reduce((acc, val) => (acc << 8) | val, 0);
            case 'UIntLE':
                return data
                    .reverse()
                    .reduce((acc, val) => (acc << 8) | val, 0);
            case 'RawArray':
                return data;
            case 'Hex':
                return Buffer.from(data).toString('hex');
        }
        throw new Error();
    }
}
exports.BinaryAnalyzer = BinaryAnalyzer;
