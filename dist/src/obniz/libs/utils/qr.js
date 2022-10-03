"use strict";
/**
 * @packageDocumentation
 * @ignore
 */
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable */
/* Thanks Kazuhiko Arase */
/* https://github.com/kazuhikoarase/qrcode-generator/tree/master/js */
// ---------------------------------------------------------------------
//
// QR Code Generator for JavaScript
//
// Copyright (c) 2009 Kazuhiko Arase
//
// URL: http://www.d-project.com/
//
// Licensed under the MIT license:
//  http://www.opensource.org/licenses/mit-license.php
//
// The word 'QR Code' is registered trademark of
// DENSO WAVE INCORPORATED
//  http://www.denso-wave.com/qrcode/faqpatent-e.html
//
// ---------------------------------------------------------------------
const _qrcode = (() => {
    // --------------------------------------------------------------------
    // qrcode
    // ---------------------------------------------------------------------
    /**
     * qrcode
     * @param _typeNumber 1 to 40
     * @param errorCorrectionLevelStr 'L','M','Q','H'
     */
    const qrcode = (_typeNumber, errorCorrectionLevelStr) => {
        const PAD0 = 0xec;
        const PAD1 = 0x11;
        const _errorCorrectionLevel = QRErrorCorrectionLevel[errorCorrectionLevelStr];
        let _modules = null;
        let _moduleCount = 0;
        let _dataCache = null;
        const _dataList = [];
        const _this = {};
        const makeImpl = (test, maskPattern) => {
            _moduleCount = _typeNumber * 4 + 17;
            _modules = ((moduleCount) => {
                const modules = new Array(moduleCount);
                for (let row = 0; row < moduleCount; row += 1) {
                    modules[row] = new Array(moduleCount);
                    for (let col = 0; col < moduleCount; col += 1) {
                        modules[row][col] = null;
                    }
                }
                return modules;
            })(_moduleCount);
            setupPositionProbePattern(0, 0);
            setupPositionProbePattern(_moduleCount - 7, 0);
            setupPositionProbePattern(0, _moduleCount - 7);
            setupPositionAdjustPattern();
            setupTimingPattern();
            setupTypeInfo(test, maskPattern);
            if (_typeNumber >= 7) {
                setupTypeNumber(test);
            }
            if (_dataCache === null) {
                _dataCache = createData(_typeNumber, _errorCorrectionLevel, _dataList);
            }
            mapData(_dataCache, maskPattern);
        };
        const setupPositionProbePattern = (row, col) => {
            for (let r = -1; r <= 7; r += 1) {
                if (row + r <= -1 || _moduleCount <= row + r) {
                    continue;
                }
                for (let c = -1; c <= 7; c += 1) {
                    if (col + c <= -1 || _moduleCount <= col + c) {
                        continue;
                    }
                    if ((0 <= r && r <= 6 && (c === 0 || c === 6)) ||
                        (0 <= c && c <= 6 && (r === 0 || r === 6)) ||
                        (2 <= r && r <= 4 && 2 <= c && c <= 4)) {
                        _modules[row + r][col + c] = true;
                    }
                    else {
                        _modules[row + r][col + c] = false;
                    }
                }
            }
        };
        const getBestMaskPattern = () => {
            let minLostPoint = 0;
            let pattern = 0;
            for (let i = 0; i < 8; i += 1) {
                makeImpl(true, i);
                const lostPoint = QRUtil.getLostPoint(_this);
                if (i === 0 || minLostPoint > lostPoint) {
                    minLostPoint = lostPoint;
                    pattern = i;
                }
            }
            return pattern;
        };
        const setupTimingPattern = () => {
            for (let r = 8; r < _moduleCount - 8; r += 1) {
                if (_modules[r][6] !== null) {
                    continue;
                }
                _modules[r][6] = r % 2 === 0;
            }
            for (let c = 8; c < _moduleCount - 8; c += 1) {
                if (_modules[6][c] !== null) {
                    continue;
                }
                _modules[6][c] = c % 2 === 0;
            }
        };
        const setupPositionAdjustPattern = () => {
            const pos = QRUtil.getPatternPosition(_typeNumber);
            for (let i = 0; i < pos.length; i += 1) {
                for (let j = 0; j < pos.length; j += 1) {
                    const row = pos[i];
                    const col = pos[j];
                    if (_modules[row][col] !== null) {
                        continue;
                    }
                    for (let r = -2; r <= 2; r += 1) {
                        for (let c = -2; c <= 2; c += 1) {
                            if (r === -2 || r === 2 || c === -2 || c === 2 || (r === 0 && c === 0)) {
                                _modules[row + r][col + c] = true;
                            }
                            else {
                                _modules[row + r][col + c] = false;
                            }
                        }
                    }
                }
            }
        };
        const setupTypeNumber = (test) => {
            const bits = QRUtil.getBCHTypeNumber(_typeNumber);
            for (let i = 0; i < 18; i += 1) {
                const mod = !test && ((bits >> i) & 1) === 1;
                _modules[Math.floor(i / 3)][(i % 3) + _moduleCount - 8 - 3] = mod;
            }
            for (let i = 0; i < 18; i += 1) {
                const mod = !test && ((bits >> i) & 1) === 1;
                _modules[(i % 3) + _moduleCount - 8 - 3][Math.floor(i / 3)] = mod;
            }
        };
        const setupTypeInfo = (test, maskPattern) => {
            const data = (_errorCorrectionLevel << 3) | maskPattern;
            const bits = QRUtil.getBCHTypeInfo(data);
            // vertical
            for (let i = 0; i < 15; i += 1) {
                const mod = !test && ((bits >> i) & 1) === 1;
                if (i < 6) {
                    _modules[i][8] = mod;
                }
                else if (i < 8) {
                    _modules[i + 1][8] = mod;
                }
                else {
                    _modules[_moduleCount - 15 + i][8] = mod;
                }
            }
            // horizontal
            for (let i = 0; i < 15; i += 1) {
                const mod = !test && ((bits >> i) & 1) === 1;
                if (i < 8) {
                    _modules[8][_moduleCount - i - 1] = mod;
                }
                else if (i < 9) {
                    _modules[8][15 - i - 1 + 1] = mod;
                }
                else {
                    _modules[8][15 - i - 1] = mod;
                }
            }
            // fixed module
            _modules[_moduleCount - 8][8] = !test;
        };
        const mapData = (data, maskPattern) => {
            let inc = -1;
            let row = _moduleCount - 1;
            let bitIndex = 7;
            let byteIndex = 0;
            const maskFunc = QRUtil.getMaskFunction(maskPattern);
            for (let col = _moduleCount - 1; col > 0; col -= 2) {
                if (col === 6) {
                    col -= 1;
                }
                while (true) {
                    for (let c = 0; c < 2; c += 1) {
                        if (_modules[row][col - c] === null) {
                            let dark = false;
                            if (byteIndex < data.length) {
                                dark = ((data[byteIndex] >>> bitIndex) & 1) === 1;
                            }
                            const mask = maskFunc(row, col - c);
                            if (mask) {
                                dark = !dark;
                            }
                            _modules[row][col - c] = dark;
                            bitIndex -= 1;
                            if (bitIndex === -1) {
                                byteIndex += 1;
                                bitIndex = 7;
                            }
                        }
                    }
                    row += inc;
                    if (row < 0 || _moduleCount <= row) {
                        row -= inc;
                        inc = -inc;
                        break;
                    }
                }
            }
        };
        const createBytes = (buffer, rsBlocks) => {
            let offset = 0;
            let maxDcCount = 0;
            let maxEcCount = 0;
            const dcdata = new Array(rsBlocks.length);
            const ecdata = new Array(rsBlocks.length);
            for (let r = 0; r < rsBlocks.length; r += 1) {
                const dcCount = rsBlocks[r].dataCount;
                const ecCount = rsBlocks[r].totalCount - dcCount;
                maxDcCount = Math.max(maxDcCount, dcCount);
                maxEcCount = Math.max(maxEcCount, ecCount);
                dcdata[r] = new Array(dcCount);
                for (let i = 0; i < dcdata[r].length; i += 1) {
                    dcdata[r][i] = 0xff & buffer.getBuffer()[i + offset];
                }
                offset += dcCount;
                const rsPoly = QRUtil.getErrorCorrectPolynomial(ecCount);
                const rawPoly = qrPolynomial(dcdata[r], rsPoly.getLength() - 1);
                const modPoly = rawPoly.mod(rsPoly);
                ecdata[r] = new Array(rsPoly.getLength() - 1);
                for (let i = 0; i < ecdata[r].length; i += 1) {
                    const modIndex = i + modPoly.getLength() - ecdata[r].length;
                    ecdata[r][i] = modIndex >= 0 ? modPoly.getAt(modIndex) : 0;
                }
            }
            let totalCodeCount = 0;
            for (let i = 0; i < rsBlocks.length; i += 1) {
                totalCodeCount += rsBlocks[i].totalCount;
            }
            const data = new Array(totalCodeCount);
            let index = 0;
            for (let i = 0; i < maxDcCount; i += 1) {
                for (let r = 0; r < rsBlocks.length; r += 1) {
                    if (i < dcdata[r].length) {
                        data[index] = dcdata[r][i];
                        index += 1;
                    }
                }
            }
            for (let i = 0; i < maxEcCount; i += 1) {
                for (let r = 0; r < rsBlocks.length; r += 1) {
                    if (i < ecdata[r].length) {
                        data[index] = ecdata[r][i];
                        index += 1;
                    }
                }
            }
            return data;
        };
        const createData = (typeNumber, errorCorrectionLevel, dataList) => {
            const rsBlocks = QRRSBlock.getRSBlocks(typeNumber, errorCorrectionLevel);
            const buffer = qrBitBuffer();
            for (let i = 0; i < dataList.length; i += 1) {
                const data = dataList[i];
                buffer.put(data.getMode(), 4);
                buffer.put(data.getLength(), QRUtil.getLengthInBits(data.getMode(), typeNumber));
                data.write(buffer);
            }
            // calc num max data.
            let totalDataCount = 0;
            for (let i = 0; i < rsBlocks.length; i += 1) {
                totalDataCount += rsBlocks[i].dataCount;
            }
            if (buffer.getLengthInBits() > totalDataCount * 8) {
                throw new Error("code length overflow. (" + buffer.getLengthInBits() + ">" + totalDataCount * 8 + ")");
            }
            // end code
            if (buffer.getLengthInBits() + 4 <= totalDataCount * 8) {
                buffer.put(0, 4);
            }
            // padding
            while (buffer.getLengthInBits() % 8 !== 0) {
                buffer.putBit(false);
            }
            // padding
            while (true) {
                if (buffer.getLengthInBits() >= totalDataCount * 8) {
                    break;
                }
                buffer.put(PAD0, 8);
                if (buffer.getLengthInBits() >= totalDataCount * 8) {
                    break;
                }
                buffer.put(PAD1, 8);
            }
            return createBytes(buffer, rsBlocks);
        };
        _this.addData = (data, mode) => {
            mode = mode || "Byte";
            let newData = null;
            switch (mode) {
                case "Numeric":
                    newData = qrNumber(data);
                    break;
                case "Alphanumeric":
                    newData = qrAlphaNum(data);
                    break;
                case "Byte":
                    newData = qr8BitByte(data);
                    break;
                case "Kanji":
                    newData = qrKanji(data);
                    break;
                default:
                    throw new Error("mode:" + mode);
            }
            _dataList.push(newData);
            _dataCache = null;
        };
        _this.getModules = () => {
            return _modules;
        };
        _this.isDark = (row, col) => {
            if (row < 0 || _moduleCount <= row || col < 0 || _moduleCount <= col) {
                throw new Error(row + "," + col);
            }
            return _modules[row][col];
        };
        _this.getModuleCount = () => {
            return _moduleCount;
        };
        _this.make = () => {
            if (_typeNumber < 1) {
                let typeNumber = 1;
                for (; typeNumber < 40; typeNumber++) {
                    const rsBlocks = QRRSBlock.getRSBlocks(typeNumber, _errorCorrectionLevel);
                    const buffer = qrBitBuffer();
                    for (let i = 0; i < _dataList.length; i++) {
                        const data = _dataList[i];
                        buffer.put(data.getMode(), 4);
                        buffer.put(data.getLength(), QRUtil.getLengthInBits(data.getMode(), typeNumber));
                        data.write(buffer);
                    }
                    let totalDataCount = 0;
                    for (let i = 0; i < rsBlocks.length; i++) {
                        totalDataCount += rsBlocks[i].dataCount;
                    }
                    if (buffer.getLengthInBits() <= totalDataCount * 8) {
                        break;
                    }
                }
                _typeNumber = typeNumber;
            }
            makeImpl(false, getBestMaskPattern());
        };
        _this.createTableTag = (cellSize, margin) => {
            cellSize = cellSize || 2;
            margin = typeof margin === "undefined" ? cellSize * 4 : margin;
            let qrHtml = "";
            qrHtml += '<table style="';
            qrHtml += " border-width: 0px; border-style: none;";
            qrHtml += " border-collapse: collapse;";
            qrHtml += " padding: 0px; margin: " + margin + "px;";
            qrHtml += '">';
            qrHtml += "<tbody>";
            for (let r = 0; r < _this.getModuleCount(); r += 1) {
                qrHtml += "<tr>";
                for (let c = 0; c < _this.getModuleCount(); c += 1) {
                    qrHtml += '<td style="';
                    qrHtml += " border-width: 0px; border-style: none;";
                    qrHtml += " border-collapse: collapse;";
                    qrHtml += " padding: 0px; margin: 0px;";
                    qrHtml += " width: " + cellSize + "px;";
                    qrHtml += " height: " + cellSize + "px;";
                    qrHtml += " background-color: ";
                    qrHtml += _this.isDark(r, c) ? "#000000" : "#ffffff";
                    qrHtml += ";";
                    qrHtml += '"/>';
                }
                qrHtml += "</tr>";
            }
            qrHtml += "</tbody>";
            qrHtml += "</table>";
            return qrHtml;
        };
        _this.renderTo2dContext = (context, cellSize) => {
            cellSize = cellSize || 2;
            const length = _this.getModuleCount();
            for (let row = 0; row < length; row++) {
                for (let col = 0; col < length; col++) {
                    context.fillStyle = _this.isDark(row, col) ? "black" : "white";
                    context.fillRect(row * cellSize, col * cellSize, cellSize, cellSize);
                }
            }
        };
        return _this;
    };
    // ---------------------------------------------------------------------
    // qrcode.stringToBytes
    // ---------------------------------------------------------------------
    qrcode.stringToBytesFuncs = {
        default(s) {
            const bytes = [];
            for (let i = 0; i < s.length; i += 1) {
                const c = s.charCodeAt(i);
                bytes.push(c & 0xff);
            }
            return bytes;
        },
    };
    qrcode.stringToBytes = qrcode.stringToBytesFuncs.default;
    // ---------------------------------------------------------------------
    // qrcode.createStringToBytes
    // ---------------------------------------------------------------------
    /**
     * @param unicodeData base64 string of byte array.
     * [16bit Unicode],[16bit Bytes], ...
     * @param numChars
     */
    qrcode.createStringToBytes = (unicodeData, numChars) => {
        // create conversion map.
        const unicodeMap = (() => {
            const bin = base64DecodeInputStream(unicodeData);
            const read = () => {
                const b = bin.read();
                if (b === -1) {
                    throw new Error("eof");
                }
                return b;
            };
            let count = 0;
            const result = {};
            while (true) {
                const b0 = bin.read();
                if (b0 === -1) {
                    break;
                }
                const b1 = read();
                const b2 = read();
                const b3 = read();
                const k = String.fromCharCode((b0 << 8) | b1);
                const v = (b2 << 8) | b3;
                result[k] = v;
                count += 1;
            }
            if (count !== numChars) {
                throw new Error(count + " !==" + numChars);
            }
            return result;
        })();
        const unknownChar = "?".charCodeAt(0);
        return (s) => {
            const bytes = [];
            for (let i = 0; i < s.length; i += 1) {
                const c = s.charCodeAt(i);
                if (c < 128) {
                    bytes.push(c);
                }
                else {
                    const b = unicodeMap[s.charAt(i)];
                    if (typeof b === "number") {
                        if ((b & 0xff) === b) {
                            // 1byte
                            bytes.push(b);
                        }
                        else {
                            // 2bytes
                            bytes.push(b >>> 8);
                            bytes.push(b & 0xff);
                        }
                    }
                    else {
                        bytes.push(unknownChar);
                    }
                }
            }
            return bytes;
        };
    };
    // ---------------------------------------------------------------------
    // QRMode
    // ---------------------------------------------------------------------
    const QRMode = {
        MODE_NUMBER: 1 << 0,
        MODE_ALPHA_NUM: 1 << 1,
        MODE_8BIT_BYTE: 1 << 2,
        MODE_KANJI: 1 << 3,
    };
    // ---------------------------------------------------------------------
    // QRErrorCorrectionLevel
    // ---------------------------------------------------------------------
    const QRErrorCorrectionLevel = {
        L: 1,
        M: 0,
        Q: 3,
        H: 2,
    };
    // ---------------------------------------------------------------------
    // QRMaskPattern
    // ---------------------------------------------------------------------
    const QRMaskPattern = {
        PATTERN000: 0,
        PATTERN001: 1,
        PATTERN010: 2,
        PATTERN011: 3,
        PATTERN100: 4,
        PATTERN101: 5,
        PATTERN110: 6,
        PATTERN111: 7,
    };
    // ---------------------------------------------------------------------
    // QRUtil
    // ---------------------------------------------------------------------
    const QRUtil = (() => {
        const PATTERN_POSITION_TABLE = [
            [],
            [6, 18],
            [6, 22],
            [6, 26],
            [6, 30],
            [6, 34],
            [6, 22, 38],
            [6, 24, 42],
            [6, 26, 46],
            [6, 28, 50],
            [6, 30, 54],
            [6, 32, 58],
            [6, 34, 62],
            [6, 26, 46, 66],
            [6, 26, 48, 70],
            [6, 26, 50, 74],
            [6, 30, 54, 78],
            [6, 30, 56, 82],
            [6, 30, 58, 86],
            [6, 34, 62, 90],
            [6, 28, 50, 72, 94],
            [6, 26, 50, 74, 98],
            [6, 30, 54, 78, 102],
            [6, 28, 54, 80, 106],
            [6, 32, 58, 84, 110],
            [6, 30, 58, 86, 114],
            [6, 34, 62, 90, 118],
            [6, 26, 50, 74, 98, 122],
            [6, 30, 54, 78, 102, 126],
            [6, 26, 52, 78, 104, 130],
            [6, 30, 56, 82, 108, 134],
            [6, 34, 60, 86, 112, 138],
            [6, 30, 58, 86, 114, 142],
            [6, 34, 62, 90, 118, 146],
            [6, 30, 54, 78, 102, 126, 150],
            [6, 24, 50, 76, 102, 128, 154],
            [6, 28, 54, 80, 106, 132, 158],
            [6, 32, 58, 84, 110, 136, 162],
            [6, 26, 54, 82, 110, 138, 166],
            [6, 30, 58, 86, 114, 142, 170],
        ];
        const G15 = (1 << 10) | (1 << 8) | (1 << 5) | (1 << 4) | (1 << 2) | (1 << 1) | (1 << 0);
        const G18 = (1 << 12) | (1 << 11) | (1 << 10) | (1 << 9) | (1 << 8) | (1 << 5) | (1 << 2) | (1 << 0);
        const G15_MASK = (1 << 14) | (1 << 12) | (1 << 10) | (1 << 4) | (1 << 1);
        const _this = {};
        const getBCHDigit = (data) => {
            let digit = 0;
            while (data !== 0) {
                digit += 1;
                data >>>= 1;
            }
            return digit;
        };
        _this.getBCHTypeInfo = (data) => {
            let d = data << 10;
            while (getBCHDigit(d) - getBCHDigit(G15) >= 0) {
                d ^= G15 << (getBCHDigit(d) - getBCHDigit(G15));
            }
            return ((data << 10) | d) ^ G15_MASK;
        };
        _this.getBCHTypeNumber = (data) => {
            let d = data << 12;
            while (getBCHDigit(d) - getBCHDigit(G18) >= 0) {
                d ^= G18 << (getBCHDigit(d) - getBCHDigit(G18));
            }
            return (data << 12) | d;
        };
        _this.getPatternPosition = (typeNumber) => {
            return PATTERN_POSITION_TABLE[typeNumber - 1];
        };
        _this.getMaskFunction = (maskPattern) => {
            switch (maskPattern) {
                case QRMaskPattern.PATTERN000:
                    return (i, j) => {
                        return (i + j) % 2 === 0;
                    };
                case QRMaskPattern.PATTERN001:
                    return (i, j) => {
                        return i % 2 === 0;
                    };
                case QRMaskPattern.PATTERN010:
                    return (i, j) => {
                        return j % 3 === 0;
                    };
                case QRMaskPattern.PATTERN011:
                    return (i, j) => {
                        return (i + j) % 3 === 0;
                    };
                case QRMaskPattern.PATTERN100:
                    return (i, j) => {
                        return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 === 0;
                    };
                case QRMaskPattern.PATTERN101:
                    return (i, j) => {
                        return ((i * j) % 2) + ((i * j) % 3) === 0;
                    };
                case QRMaskPattern.PATTERN110:
                    return (i, j) => {
                        return (((i * j) % 2) + ((i * j) % 3)) % 2 === 0;
                    };
                case QRMaskPattern.PATTERN111:
                    return (i, j) => {
                        return (((i * j) % 3) + ((i + j) % 2)) % 2 === 0;
                    };
                default:
                    throw new Error("bad maskPattern:" + maskPattern);
            }
        };
        _this.getErrorCorrectPolynomial = (errorCorrectLength) => {
            let a = qrPolynomial([1], 0);
            for (let i = 0; i < errorCorrectLength; i += 1) {
                a = a.multiply(qrPolynomial([1, QRMath.gexp(i)], 0));
            }
            return a;
        };
        _this.getLengthInBits = (mode, type) => {
            if (1 <= type && type < 10) {
                // 1 - 9
                switch (mode) {
                    case QRMode.MODE_NUMBER:
                        return 10;
                    case QRMode.MODE_ALPHA_NUM:
                        return 9;
                    case QRMode.MODE_8BIT_BYTE:
                        return 8;
                    case QRMode.MODE_KANJI:
                        return 8;
                    default:
                        throw new Error("mode:" + mode);
                }
            }
            else if (type < 27) {
                // 10 - 26
                switch (mode) {
                    case QRMode.MODE_NUMBER:
                        return 12;
                    case QRMode.MODE_ALPHA_NUM:
                        return 11;
                    case QRMode.MODE_8BIT_BYTE:
                        return 16;
                    case QRMode.MODE_KANJI:
                        return 10;
                    default:
                        throw new Error("mode:" + mode);
                }
            }
            else if (type < 41) {
                // 27 - 40
                switch (mode) {
                    case QRMode.MODE_NUMBER:
                        return 14;
                    case QRMode.MODE_ALPHA_NUM:
                        return 13;
                    case QRMode.MODE_8BIT_BYTE:
                        return 16;
                    case QRMode.MODE_KANJI:
                        return 12;
                    default:
                        throw new Error("mode:" + mode);
                }
            }
            else {
                throw new Error("type:" + type);
            }
        };
        _this.getLostPoint = (__qrcode) => {
            const moduleCount = __qrcode.getModuleCount();
            let lostPoint = 0;
            // LEVEL1
            for (let row = 0; row < moduleCount; row += 1) {
                for (let col = 0; col < moduleCount; col += 1) {
                    let sameCount = 0;
                    const dark = __qrcode.isDark(row, col);
                    for (let r = -1; r <= 1; r += 1) {
                        if (row + r < 0 || moduleCount <= row + r) {
                            continue;
                        }
                        for (let c = -1; c <= 1; c += 1) {
                            if (col + c < 0 || moduleCount <= col + c) {
                                continue;
                            }
                            if (r === 0 && c === 0) {
                                continue;
                            }
                            if (dark === __qrcode.isDark(row + r, col + c)) {
                                sameCount += 1;
                            }
                        }
                    }
                    if (sameCount > 5) {
                        lostPoint += 3 + sameCount - 5;
                    }
                }
            }
            // LEVEL2
            for (let row = 0; row < moduleCount - 1; row += 1) {
                for (let col = 0; col < moduleCount - 1; col += 1) {
                    let count = 0;
                    if (__qrcode.isDark(row, col)) {
                        count += 1;
                    }
                    if (__qrcode.isDark(row + 1, col)) {
                        count += 1;
                    }
                    if (__qrcode.isDark(row, col + 1)) {
                        count += 1;
                    }
                    if (__qrcode.isDark(row + 1, col + 1)) {
                        count += 1;
                    }
                    if (count === 0 || count === 4) {
                        lostPoint += 3;
                    }
                }
            }
            // LEVEL3
            for (let row = 0; row < moduleCount; row += 1) {
                for (let col = 0; col < moduleCount - 6; col += 1) {
                    if (__qrcode.isDark(row, col) &&
                        !__qrcode.isDark(row, col + 1) &&
                        __qrcode.isDark(row, col + 2) &&
                        __qrcode.isDark(row, col + 3) &&
                        __qrcode.isDark(row, col + 4) &&
                        !__qrcode.isDark(row, col + 5) &&
                        __qrcode.isDark(row, col + 6)) {
                        lostPoint += 40;
                    }
                }
            }
            for (let col = 0; col < moduleCount; col += 1) {
                for (let row = 0; row < moduleCount - 6; row += 1) {
                    if (__qrcode.isDark(row, col) &&
                        !__qrcode.isDark(row + 1, col) &&
                        __qrcode.isDark(row + 2, col) &&
                        __qrcode.isDark(row + 3, col) &&
                        __qrcode.isDark(row + 4, col) &&
                        !__qrcode.isDark(row + 5, col) &&
                        __qrcode.isDark(row + 6, col)) {
                        lostPoint += 40;
                    }
                }
            }
            // LEVEL4
            let darkCount = 0;
            for (let col = 0; col < moduleCount; col += 1) {
                for (let row = 0; row < moduleCount; row += 1) {
                    if (__qrcode.isDark(row, col)) {
                        darkCount += 1;
                    }
                }
            }
            const ratio = Math.abs((100 * darkCount) / moduleCount / moduleCount - 50) / 5;
            lostPoint += ratio * 10;
            return lostPoint;
        };
        return _this;
    })();
    // ---------------------------------------------------------------------
    // QRMath
    // ---------------------------------------------------------------------
    const QRMath = (() => {
        const EXP_TABLE = new Array(256);
        const LOG_TABLE = new Array(256);
        // initialize tables
        for (let i = 0; i < 8; i += 1) {
            EXP_TABLE[i] = 1 << i;
        }
        for (let i = 8; i < 256; i += 1) {
            EXP_TABLE[i] = EXP_TABLE[i - 4] ^ EXP_TABLE[i - 5] ^ EXP_TABLE[i - 6] ^ EXP_TABLE[i - 8];
        }
        for (let i = 0; i < 255; i += 1) {
            LOG_TABLE[EXP_TABLE[i]] = i;
        }
        const _this = {};
        _this.glog = (n) => {
            if (n < 1) {
                throw new Error("glog(" + n + ")");
            }
            return LOG_TABLE[n];
        };
        _this.gexp = (n) => {
            while (n < 0) {
                n += 255;
            }
            while (n >= 256) {
                n -= 255;
            }
            return EXP_TABLE[n];
        };
        return _this;
    })();
    // ---------------------------------------------------------------------
    // qrPolynomial
    // ---------------------------------------------------------------------
    function qrPolynomial(num, shift) {
        if (typeof num.length === "undefined") {
            throw new Error(num.length + "/" + shift);
        }
        const _num = (() => {
            let offset = 0;
            while (offset < num.length && num[offset] === 0) {
                offset += 1;
            }
            const __num = new Array(num.length - offset + shift);
            for (let i = 0; i < num.length - offset; i += 1) {
                __num[i] = num[i + offset];
            }
            return __num;
        })();
        const _this = {};
        _this.getAt = (index) => {
            return _num[index];
        };
        _this.getLength = () => {
            return _num.length;
        };
        _this.multiply = (e) => {
            const ___num = new Array(_this.getLength() + e.getLength() - 1);
            for (let i = 0; i < _this.getLength(); i += 1) {
                for (let j = 0; j < e.getLength(); j += 1) {
                    ___num[i + j] ^= QRMath.gexp(QRMath.glog(_this.getAt(i)) + QRMath.glog(e.getAt(j)));
                }
            }
            return qrPolynomial(___num, 0);
        };
        _this.mod = (e) => {
            if (_this.getLength() - e.getLength() < 0) {
                return _this;
            }
            const ratio = QRMath.glog(_this.getAt(0)) - QRMath.glog(e.getAt(0));
            const __num = new Array(_this.getLength());
            for (let i = 0; i < _this.getLength(); i += 1) {
                __num[i] = _this.getAt(i);
            }
            for (let i = 0; i < e.getLength(); i += 1) {
                __num[i] ^= QRMath.gexp(QRMath.glog(e.getAt(i)) + ratio);
            }
            // recursive call
            return qrPolynomial(__num, 0).mod(e);
        };
        return _this;
    }
    // ---------------------------------------------------------------------
    // QRRSBlock
    // ---------------------------------------------------------------------
    const QRRSBlock = (() => {
        const RS_BLOCK_TABLE = [
            // L
            // M
            // Q
            // H
            // 1
            [1, 26, 19],
            [1, 26, 16],
            [1, 26, 13],
            [1, 26, 9],
            // 2
            [1, 44, 34],
            [1, 44, 28],
            [1, 44, 22],
            [1, 44, 16],
            // 3
            [1, 70, 55],
            [1, 70, 44],
            [2, 35, 17],
            [2, 35, 13],
            // 4
            [1, 100, 80],
            [2, 50, 32],
            [2, 50, 24],
            [4, 25, 9],
            // 5
            [1, 134, 108],
            [2, 67, 43],
            [2, 33, 15, 2, 34, 16],
            [2, 33, 11, 2, 34, 12],
            // 6
            [2, 86, 68],
            [4, 43, 27],
            [4, 43, 19],
            [4, 43, 15],
            // 7
            [2, 98, 78],
            [4, 49, 31],
            [2, 32, 14, 4, 33, 15],
            [4, 39, 13, 1, 40, 14],
            // 8
            [2, 121, 97],
            [2, 60, 38, 2, 61, 39],
            [4, 40, 18, 2, 41, 19],
            [4, 40, 14, 2, 41, 15],
            // 9
            [2, 146, 116],
            [3, 58, 36, 2, 59, 37],
            [4, 36, 16, 4, 37, 17],
            [4, 36, 12, 4, 37, 13],
            // 10
            [2, 86, 68, 2, 87, 69],
            [4, 69, 43, 1, 70, 44],
            [6, 43, 19, 2, 44, 20],
            [6, 43, 15, 2, 44, 16],
            // 11
            [4, 101, 81],
            [1, 80, 50, 4, 81, 51],
            [4, 50, 22, 4, 51, 23],
            [3, 36, 12, 8, 37, 13],
            // 12
            [2, 116, 92, 2, 117, 93],
            [6, 58, 36, 2, 59, 37],
            [4, 46, 20, 6, 47, 21],
            [7, 42, 14, 4, 43, 15],
            // 13
            [4, 133, 107],
            [8, 59, 37, 1, 60, 38],
            [8, 44, 20, 4, 45, 21],
            [12, 33, 11, 4, 34, 12],
            // 14
            [3, 145, 115, 1, 146, 116],
            [4, 64, 40, 5, 65, 41],
            [11, 36, 16, 5, 37, 17],
            [11, 36, 12, 5, 37, 13],
            // 15
            [5, 109, 87, 1, 110, 88],
            [5, 65, 41, 5, 66, 42],
            [5, 54, 24, 7, 55, 25],
            [11, 36, 12, 7, 37, 13],
            // 16
            [5, 122, 98, 1, 123, 99],
            [7, 73, 45, 3, 74, 46],
            [15, 43, 19, 2, 44, 20],
            [3, 45, 15, 13, 46, 16],
            // 17
            [1, 135, 107, 5, 136, 108],
            [10, 74, 46, 1, 75, 47],
            [1, 50, 22, 15, 51, 23],
            [2, 42, 14, 17, 43, 15],
            // 18
            [5, 150, 120, 1, 151, 121],
            [9, 69, 43, 4, 70, 44],
            [17, 50, 22, 1, 51, 23],
            [2, 42, 14, 19, 43, 15],
            // 19
            [3, 141, 113, 4, 142, 114],
            [3, 70, 44, 11, 71, 45],
            [17, 47, 21, 4, 48, 22],
            [9, 39, 13, 16, 40, 14],
            // 20
            [3, 135, 107, 5, 136, 108],
            [3, 67, 41, 13, 68, 42],
            [15, 54, 24, 5, 55, 25],
            [15, 43, 15, 10, 44, 16],
            // 21
            [4, 144, 116, 4, 145, 117],
            [17, 68, 42],
            [17, 50, 22, 6, 51, 23],
            [19, 46, 16, 6, 47, 17],
            // 22
            [2, 139, 111, 7, 140, 112],
            [17, 74, 46],
            [7, 54, 24, 16, 55, 25],
            [34, 37, 13],
            // 23
            [4, 151, 121, 5, 152, 122],
            [4, 75, 47, 14, 76, 48],
            [11, 54, 24, 14, 55, 25],
            [16, 45, 15, 14, 46, 16],
            // 24
            [6, 147, 117, 4, 148, 118],
            [6, 73, 45, 14, 74, 46],
            [11, 54, 24, 16, 55, 25],
            [30, 46, 16, 2, 47, 17],
            // 25
            [8, 132, 106, 4, 133, 107],
            [8, 75, 47, 13, 76, 48],
            [7, 54, 24, 22, 55, 25],
            [22, 45, 15, 13, 46, 16],
            // 26
            [10, 142, 114, 2, 143, 115],
            [19, 74, 46, 4, 75, 47],
            [28, 50, 22, 6, 51, 23],
            [33, 46, 16, 4, 47, 17],
            // 27
            [8, 152, 122, 4, 153, 123],
            [22, 73, 45, 3, 74, 46],
            [8, 53, 23, 26, 54, 24],
            [12, 45, 15, 28, 46, 16],
            // 28
            [3, 147, 117, 10, 148, 118],
            [3, 73, 45, 23, 74, 46],
            [4, 54, 24, 31, 55, 25],
            [11, 45, 15, 31, 46, 16],
            // 29
            [7, 146, 116, 7, 147, 117],
            [21, 73, 45, 7, 74, 46],
            [1, 53, 23, 37, 54, 24],
            [19, 45, 15, 26, 46, 16],
            // 30
            [5, 145, 115, 10, 146, 116],
            [19, 75, 47, 10, 76, 48],
            [15, 54, 24, 25, 55, 25],
            [23, 45, 15, 25, 46, 16],
            // 31
            [13, 145, 115, 3, 146, 116],
            [2, 74, 46, 29, 75, 47],
            [42, 54, 24, 1, 55, 25],
            [23, 45, 15, 28, 46, 16],
            // 32
            [17, 145, 115],
            [10, 74, 46, 23, 75, 47],
            [10, 54, 24, 35, 55, 25],
            [19, 45, 15, 35, 46, 16],
            // 33
            [17, 145, 115, 1, 146, 116],
            [14, 74, 46, 21, 75, 47],
            [29, 54, 24, 19, 55, 25],
            [11, 45, 15, 46, 46, 16],
            // 34
            [13, 145, 115, 6, 146, 116],
            [14, 74, 46, 23, 75, 47],
            [44, 54, 24, 7, 55, 25],
            [59, 46, 16, 1, 47, 17],
            // 35
            [12, 151, 121, 7, 152, 122],
            [12, 75, 47, 26, 76, 48],
            [39, 54, 24, 14, 55, 25],
            [22, 45, 15, 41, 46, 16],
            // 36
            [6, 151, 121, 14, 152, 122],
            [6, 75, 47, 34, 76, 48],
            [46, 54, 24, 10, 55, 25],
            [2, 45, 15, 64, 46, 16],
            // 37
            [17, 152, 122, 4, 153, 123],
            [29, 74, 46, 14, 75, 47],
            [49, 54, 24, 10, 55, 25],
            [24, 45, 15, 46, 46, 16],
            // 38
            [4, 152, 122, 18, 153, 123],
            [13, 74, 46, 32, 75, 47],
            [48, 54, 24, 14, 55, 25],
            [42, 45, 15, 32, 46, 16],
            // 39
            [20, 147, 117, 4, 148, 118],
            [40, 75, 47, 7, 76, 48],
            [43, 54, 24, 22, 55, 25],
            [10, 45, 15, 67, 46, 16],
            // 40
            [19, 148, 118, 6, 149, 119],
            [18, 75, 47, 31, 76, 48],
            [34, 54, 24, 34, 55, 25],
            [20, 45, 15, 61, 46, 16],
        ];
        const qrRSBlock = (totalCount, dataCount) => {
            const result = {};
            result.totalCount = totalCount;
            result.dataCount = dataCount;
            return result;
        };
        const _this = {};
        const getRsBlockTable = (typeNumber, errorCorrectionLevel) => {
            switch (errorCorrectionLevel) {
                case QRErrorCorrectionLevel.L:
                    return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 0];
                case QRErrorCorrectionLevel.M:
                    return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 1];
                case QRErrorCorrectionLevel.Q:
                    return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 2];
                case QRErrorCorrectionLevel.H:
                    return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 3];
                default:
                    return undefined;
            }
        };
        _this.getRSBlocks = (typeNumber, errorCorrectionLevel) => {
            const rsBlock = getRsBlockTable(typeNumber, errorCorrectionLevel);
            if (typeof rsBlock === "undefined") {
                throw new Error("bad rs block @ typeNumber:" + typeNumber + "/errorCorrectionLevel:" + errorCorrectionLevel);
            }
            const length = rsBlock.length / 3;
            const list = [];
            for (let i = 0; i < length; i += 1) {
                const count = rsBlock[i * 3 + 0];
                const totalCount = rsBlock[i * 3 + 1];
                const dataCount = rsBlock[i * 3 + 2];
                for (let j = 0; j < count; j += 1) {
                    list.push(qrRSBlock(totalCount, dataCount));
                }
            }
            return list;
        };
        return _this;
    })();
    // ---------------------------------------------------------------------
    // qrBitBuffer
    // ---------------------------------------------------------------------
    const qrBitBuffer = () => {
        const _buffer = [];
        let _length = 0;
        const _this = {};
        _this.getBuffer = () => {
            return _buffer;
        };
        _this.getAt = (index) => {
            const bufIndex = Math.floor(index / 8);
            return ((_buffer[bufIndex] >>> (7 - (index % 8))) & 1) === 1;
        };
        _this.put = (num, length) => {
            for (let i = 0; i < length; i += 1) {
                _this.putBit(((num >>> (length - i - 1)) & 1) === 1);
            }
        };
        _this.getLengthInBits = () => {
            return _length;
        };
        _this.putBit = (bit) => {
            const bufIndex = Math.floor(_length / 8);
            if (_buffer.length <= bufIndex) {
                _buffer.push(0);
            }
            if (bit) {
                _buffer[bufIndex] |= 0x80 >>> _length % 8;
            }
            _length += 1;
        };
        return _this;
    };
    // ---------------------------------------------------------------------
    // qrNumber
    // ---------------------------------------------------------------------
    const qrNumber = (_data) => {
        const _mode = QRMode.MODE_NUMBER;
        const _this = {};
        _this.getMode = () => {
            return _mode;
        };
        _this.getLength = (buffer) => {
            return _data.length;
        };
        _this.write = (buffer) => {
            const data = _data;
            let i = 0;
            while (i + 2 < data.length) {
                buffer.put(strToNum(data.substring(i, i + 3)), 10);
                i += 3;
            }
            if (i < data.length) {
                if (data.length - i === 1) {
                    buffer.put(strToNum(data.substring(i, i + 1)), 4);
                }
                else if (data.length - i === 2) {
                    buffer.put(strToNum(data.substring(i, i + 2)), 7);
                }
            }
        };
        const strToNum = (s) => {
            let num = 0;
            for (let i = 0; i < s.length; i += 1) {
                num = num * 10 + chatToNum(s.charAt(i));
            }
            return num;
        };
        const chatToNum = (c) => {
            if ("0" <= c && c <= "9") {
                return c.charCodeAt(0) - "0".charCodeAt(0);
            }
            throw new Error("illegal char :" + c);
        };
        return _this;
    };
    // ---------------------------------------------------------------------
    // qrAlphaNum
    // ---------------------------------------------------------------------
    const qrAlphaNum = (data) => {
        const _mode = QRMode.MODE_ALPHA_NUM;
        const _data = data;
        const _this = {};
        _this.getMode = () => {
            return _mode;
        };
        _this.getLength = (buffer) => {
            return _data.length;
        };
        _this.write = (buffer) => {
            const s = _data;
            let i = 0;
            while (i + 1 < s.length) {
                buffer.put(getCode(s.charAt(i)) * 45 + getCode(s.charAt(i + 1)), 11);
                i += 2;
            }
            if (i < s.length) {
                buffer.put(getCode(s.charAt(i)), 6);
            }
        };
        const getCode = (c) => {
            if ("0" <= c && c <= "9") {
                return c.charCodeAt(0) - "0".charCodeAt(0);
            }
            else if ("A" <= c && c <= "Z") {
                return c.charCodeAt(0) - "A".charCodeAt(0) + 10;
            }
            else {
                switch (c) {
                    case " ":
                        return 36;
                    case "$":
                        return 37;
                    case "%":
                        return 38;
                    case "*":
                        return 39;
                    case "+":
                        return 40;
                    case "-":
                        return 41;
                    case ".":
                        return 42;
                    case "/":
                        return 43;
                    case ":":
                        return 44;
                    default:
                        throw new Error("illegal char :" + c);
                }
            }
        };
        return _this;
    };
    // ---------------------------------------------------------------------
    // qr8BitByte
    // ---------------------------------------------------------------------
    const qr8BitByte = (data) => {
        const _mode = QRMode.MODE_8BIT_BYTE;
        const _data = data;
        const _bytes = qrcode.stringToBytes(data);
        const _this = {};
        _this.getMode = () => {
            return _mode;
        };
        _this.getLength = (buffer) => {
            return _bytes.length;
        };
        _this.write = (buffer) => {
            for (let i = 0; i < _bytes.length; i += 1) {
                buffer.put(_bytes[i], 8);
            }
        };
        return _this;
    };
    // ---------------------------------------------------------------------
    // qrKanji
    // ---------------------------------------------------------------------
    const qrKanji = (data) => {
        const _mode = QRMode.MODE_KANJI;
        const _data = data;
        const stringToBytes = qrcode.stringToBytesFuncs.SJIS;
        if (!stringToBytes) {
            throw new Error("sjis not supported.");
        }
        // tslint:disable:no-unused-expression
        // @ts-ignore
        !((c, code) => {
            // self test for sjis support.
            const test = stringToBytes(c);
            if (test.length !== 2 || ((test[0] << 8) | test[1]) !== code) {
                throw new Error("sjis not supported.");
            }
        })("\u53cb", 0x9746);
        // tslint:enable:no-unused-expression
        const _bytes = stringToBytes(data);
        const _this = {};
        _this.getMode = () => {
            return _mode;
        };
        _this.getLength = (buffer) => {
            return ~~(_bytes.length / 2);
        };
        _this.write = (buffer) => {
            const __data = _bytes;
            let i = 0;
            while (i + 1 < __data.length) {
                let c = ((0xff & __data[i]) << 8) | (0xff & __data[i + 1]);
                if (0x8140 <= c && c <= 0x9ffc) {
                    c -= 0x8140;
                }
                else if (0xe040 <= c && c <= 0xebbf) {
                    c -= 0xc140;
                }
                else {
                    throw new Error("illegal char at " + (i + 1) + "/" + c);
                }
                c = ((c >>> 8) & 0xff) * 0xc0 + (c & 0xff);
                buffer.put(c, 13);
                i += 2;
            }
            if (i < __data.length) {
                throw new Error("illegal char at " + (i + 1));
            }
        };
        return _this;
    };
    // =====================================================================
    // GIF Support etc.
    //
    // ---------------------------------------------------------------------
    // byteArrayOutputStream
    // ---------------------------------------------------------------------
    const byteArrayOutputStream = () => {
        const _bytes = [];
        const _this = {};
        _this.writeByte = (b) => {
            _bytes.push(b & 0xff);
        };
        _this.writeShort = (i) => {
            _this.writeByte(i);
            _this.writeByte(i >>> 8);
        };
        _this.writeBytes = (b, off, len) => {
            off = off || 0;
            len = len || b.length;
            for (let i = 0; i < len; i += 1) {
                _this.writeByte(b[i + off]);
            }
        };
        _this.writeString = (s) => {
            for (let i = 0; i < s.length; i += 1) {
                _this.writeByte(s.charCodeAt(i));
            }
        };
        _this.toByteArray = () => {
            return _bytes;
        };
        _this.toString = () => {
            let s = "";
            s += "[";
            for (let i = 0; i < _bytes.length; i += 1) {
                if (i > 0) {
                    s += ",";
                }
                s += _bytes[i];
            }
            s += "]";
            return s;
        };
        return _this;
    };
    // ---------------------------------------------------------------------
    // base64EncodeOutputStream
    // ---------------------------------------------------------------------
    const base64EncodeOutputStream = () => {
        let _buffer = 0;
        let _buflen = 0;
        let _length = 0;
        let _base64 = "";
        const _this = {};
        const writeEncoded = (b) => {
            _base64 += String.fromCharCode(encode(b & 0x3f));
        };
        const encode = (n) => {
            if (n < 0) {
                // error.
            }
            else if (n < 26) {
                return 0x41 + n;
            }
            else if (n < 52) {
                return 0x61 + (n - 26);
            }
            else if (n < 62) {
                return 0x30 + (n - 52);
            }
            else if (n === 62) {
                return 0x2b;
            }
            else if (n === 63) {
                return 0x2f;
            }
            throw new Error("n:" + n);
        };
        _this.writeByte = (n) => {
            _buffer = (_buffer << 8) | (n & 0xff);
            _buflen += 8;
            _length += 1;
            while (_buflen >= 6) {
                writeEncoded(_buffer >>> (_buflen - 6));
                _buflen -= 6;
            }
        };
        _this.flush = () => {
            if (_buflen > 0) {
                writeEncoded(_buffer << (6 - _buflen));
                _buffer = 0;
                _buflen = 0;
            }
            if (_length % 3 !== 0) {
                // padding
                const padlen = 3 - (_length % 3);
                for (let i = 0; i < padlen; i += 1) {
                    _base64 += "=";
                }
            }
        };
        _this.toString = () => {
            return _base64;
        };
        return _this;
    };
    // ---------------------------------------------------------------------
    // base64DecodeInputStream
    // ---------------------------------------------------------------------
    const base64DecodeInputStream = (str) => {
        const _str = str;
        let _pos = 0;
        let _buffer = 0;
        let _buflen = 0;
        const _this = {};
        _this.read = () => {
            while (_buflen < 8) {
                if (_pos >= _str.length) {
                    if (_buflen === 0) {
                        return -1;
                    }
                    throw new Error("unexpected end of file./" + _buflen);
                }
                const c = _str.charAt(_pos);
                _pos += 1;
                if (c === "=") {
                    _buflen = 0;
                    return -1;
                }
                else if (c.match(/^\s$/)) {
                    // ignore if whitespace.
                    continue;
                }
                _buffer = (_buffer << 6) | decode(c.charCodeAt(0));
                _buflen += 6;
            }
            const n = (_buffer >>> (_buflen - 8)) & 0xff;
            _buflen -= 8;
            return n;
        };
        const decode = (c) => {
            if (0x41 <= c && c <= 0x5a) {
                return c - 0x41;
            }
            else if (0x61 <= c && c <= 0x7a) {
                return c - 0x61 + 26;
            }
            else if (0x30 <= c && c <= 0x39) {
                return c - 0x30 + 52;
            }
            else if (c === 0x2b) {
                return 62;
            }
            else if (c === 0x2f) {
                return 63;
            }
            else {
                throw new Error("c:" + c);
            }
        };
        return _this;
    };
    // ---------------------------------------------------------------------
    // returns qrcode function.
    return qrcode;
})();
// multibyte support
// tslint:disable-next-line:no-unused-expression
// @ts-ignore
// tslint:disable-next-line:no-unused-expression
!(() => {
    _qrcode.stringToBytesFuncs["UTF-8"] = (s) => {
        // http://stackoverflow.com/questions/18729405/how-to-convert-utf8-string-to-byte-array
        function toUTF8Array(str) {
            const utf8 = [];
            for (let i = 0; i < str.length; i++) {
                let charcode = str.charCodeAt(i);
                if (charcode < 0x80) {
                    utf8.push(charcode);
                }
                else if (charcode < 0x800) {
                    utf8.push(0xc0 | (charcode >> 6), 0x80 | (charcode & 0x3f));
                }
                else if (charcode < 0xd800 || charcode >= 0xe000) {
                    utf8.push(0xe0 | (charcode >> 12), 0x80 | ((charcode >> 6) & 0x3f), 0x80 | (charcode & 0x3f));
                }
                else {
                    i++;
                    // UTF-16 encodes 0x10000-0x10FFFF by
                    // subtracting 0x10000 and splitting the
                    // 20 bits of 0x0-0xFFFFF into two halves
                    charcode = 0x10000 + (((charcode & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff));
                    utf8.push(0xf0 | (charcode >> 18), 0x80 | ((charcode >> 12) & 0x3f), 0x80 | ((charcode >> 6) & 0x3f), 0x80 | (charcode & 0x3f));
                }
            }
            return utf8;
        }
        return toUTF8Array(s);
    };
})();
exports.default = _qrcode;
