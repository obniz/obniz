"use strict";
/* eslint-disable */
Object.defineProperty(exports, "__esModule", { value: true });
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
     * @param typeNumber 1 to 40
     * @param errorCorrectionLevel 'L','M','Q','H'
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
                            if (r === -2 ||
                                r === 2 ||
                                c === -2 ||
                                c === 2 ||
                                (r === 0 && c === 0)) {
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
                _modules[Math.floor(i / 3)][i % 3 + _moduleCount - 8 - 3] = mod;
            }
            for (let i = 0; i < 18; i += 1) {
                const mod = !test && ((bits >> i) & 1) === 1;
                _modules[i % 3 + _moduleCount - 8 - 3][Math.floor(i / 3)] = mod;
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
                throw new Error("code length overflow. (" +
                    buffer.getLengthInBits() +
                    ">" +
                    totalDataCount * 8 +
                    ")");
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
        const G15 = (1 << 10) |
            (1 << 8) |
            (1 << 5) |
            (1 << 4) |
            (1 << 2) |
            (1 << 1) |
            (1 << 0);
        const G18 = (1 << 12) |
            (1 << 11) |
            (1 << 10) |
            (1 << 9) |
            (1 << 8) |
            (1 << 5) |
            (1 << 2) |
            (1 << 0);
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
                        return (i * j) % 2 + (i * j) % 3 === 0;
                    };
                case QRMaskPattern.PATTERN110:
                    return (i, j) => {
                        return ((i * j) % 2 + (i * j) % 3) % 2 === 0;
                    };
                case QRMaskPattern.PATTERN111:
                    return (i, j) => {
                        return ((i * j) % 3 + (i + j) % 2) % 2 === 0;
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
            const ratio = Math.abs(100 * darkCount / moduleCount / moduleCount - 50) / 5;
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
            EXP_TABLE[i] =
                EXP_TABLE[i - 4] ^
                    EXP_TABLE[i - 5] ^
                    EXP_TABLE[i - 6] ^
                    EXP_TABLE[i - 8];
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
                throw new Error("bad rs block @ typeNumber:" +
                    typeNumber +
                    "/errorCorrectionLevel:" +
                    errorCorrectionLevel);
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
            return ((_buffer[bufIndex] >>> (7 - index % 8)) & 1) === 1;
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
                _buffer[bufIndex] |= 0x80 >>> (_length % 8);
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
                const padlen = 3 - _length % 3;
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
                    charcode =
                        0x10000 +
                            (((charcode & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff));
                    utf8.push(0xf0 | (charcode >> 18), 0x80 | ((charcode >> 12) & 0x3f), 0x80 | ((charcode >> 6) & 0x3f), 0x80 | (charcode & 0x3f));
                }
            }
            return utf8;
        }
        return toUTF8Array(s);
    };
})();
exports.default = _qrcode;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9vYm5pei9saWJzL3V0aWxzL3FyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxvQkFBb0I7O0FBRXBCLDJCQUEyQjtBQUMzQixzRUFBc0U7QUFFdEUsd0VBQXdFO0FBQ3hFLEVBQUU7QUFDRixtQ0FBbUM7QUFDbkMsRUFBRTtBQUNGLG9DQUFvQztBQUNwQyxFQUFFO0FBQ0YsaUNBQWlDO0FBQ2pDLEVBQUU7QUFDRixrQ0FBa0M7QUFDbEMsc0RBQXNEO0FBQ3RELEVBQUU7QUFDRixnREFBZ0Q7QUFDaEQsMEJBQTBCO0FBQzFCLHFEQUFxRDtBQUNyRCxFQUFFO0FBQ0Ysd0VBQXdFO0FBRXhFLE1BQU0sT0FBTyxHQUFRLENBQUMsR0FBRyxFQUFFO0lBQ3pCLHVFQUF1RTtJQUN2RSxTQUFTO0lBQ1Qsd0VBQXdFO0lBRXhFOzs7O09BSUc7SUFDSCxNQUFNLE1BQU0sR0FBUSxDQUFDLFdBQW1CLEVBQUUsdUJBQThDLEVBQUUsRUFBRTtRQUMxRixNQUFNLElBQUksR0FBUSxJQUFJLENBQUM7UUFDdkIsTUFBTSxJQUFJLEdBQVEsSUFBSSxDQUFDO1FBRXZCLE1BQU0scUJBQXFCLEdBQVEsc0JBQXNCLENBQUMsdUJBQXVCLENBQUMsQ0FBQztRQUNuRixJQUFJLFFBQVEsR0FBUSxJQUFJLENBQUM7UUFDekIsSUFBSSxZQUFZLEdBQVEsQ0FBQyxDQUFDO1FBQzFCLElBQUksVUFBVSxHQUFRLElBQUksQ0FBQztRQUMzQixNQUFNLFNBQVMsR0FBUSxFQUFFLENBQUM7UUFFMUIsTUFBTSxLQUFLLEdBQVEsRUFBRSxDQUFDO1FBRXRCLE1BQU0sUUFBUSxHQUFRLENBQUMsSUFBUyxFQUFFLFdBQWdCLEVBQUUsRUFBRTtZQUNwRCxZQUFZLEdBQUcsV0FBVyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDcEMsUUFBUSxHQUFHLENBQUMsQ0FBQyxXQUFnQixFQUFHLEVBQUU7Z0JBQ2hDLE1BQU0sT0FBTyxHQUFRLElBQUksS0FBSyxDQUFDLFdBQVcs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QztZQUNmLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBQ2YsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFDZixDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUNmLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBQ2YsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFDZixDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFDbkIsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBQ25CLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsQ0FBQztZQUNwQixDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLENBQUM7WUFDcEIsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxDQUFDO1lBQ3BCLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsQ0FBQztZQUNwQixDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLENBQUM7WUFDcEIsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsQ0FBQztZQUN4QixDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDO1lBQ3pCLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUM7WUFDekIsQ0FB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QUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBQ1gsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUNYLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFDWCxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBRVYsSUFBSTtZQUNKLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFDWCxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBQ1gsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUNYLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFFWCxJQUFJO1lBQ0osQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUNYLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFDWCxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBQ1gsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUVYLElBQUk7WUFDSixDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFBRSxDQUFDO1lBQ1osQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUNYLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFDWCxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBRVYsSUFBSTtZQUNKLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUM7WUFDYixDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBQ1gsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUN0QixDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBRXRCLElBQUk7WUFDSixDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBQ1gsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUNYLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFDWCxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBRVgsSUFBSTtZQUNKLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFDWCxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBQ1gsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUN0QixDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBRXRCLElBQUk7WUFDSixDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFBRSxDQUFDO1lBQ1osQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUN0QixDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBQ3RCLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFFdEIsSUFBSTtZQUNKLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUM7WUFDYixDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBQ3RCLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFDdEIsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUV0QixLQUFLO1lBQ0wsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUN0QixDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBQ3RCLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFDdEIsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUV0QixLQUFLO1lBQ0wsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUUsQ0FBQztZQUNaLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFDdEIsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUN0QixDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBRXRCLEtBQUs7WUFDTCxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFBRSxDQUFDO1lBQ3hCLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFDdEIsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUN0QixDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBRXRCLEtBQUs7WUFDTCxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDO1lBQ2IsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUN0QixDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBQ3RCLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFFdkIsS0FBSztZQUNMLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUM7WUFDMUIsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUN0QixDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBQ3ZCLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFFdkIsS0FBSztZQUNMLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFLENBQUM7WUFDeEIsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUN0QixDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBQ3RCLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFFdkIsS0FBSztZQUNMLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFLENBQUM7WUFDeEIsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUN0QixDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBQ3ZCLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFFdkIsS0FBSztZQUNMLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUM7WUFDMUIsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUN2QixDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBQ3ZCLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFFdkIsS0FBSztZQUNMLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUM7WUFDMUIsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUN0QixDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBQ3ZCLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFFdkIsS0FBSztZQUNMLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUM7WUFDMUIsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUN2QixDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBQ3ZCLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFFdkIsS0FBSztZQUNMLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUM7WUFDMUIsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUN2QixDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBQ3ZCLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFFeEIsS0FBSztZQUNMLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUM7WUFDMUIsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUNaLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFDdkIsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUV2QixLQUFLO1lBQ0wsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQztZQUMxQixDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBQ1osQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUN2QixDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBRVosS0FBSztZQUNMLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUM7WUFDMUIsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUN2QixDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBQ3hCLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFFeEIsS0FBSztZQUNMLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUM7WUFDMUIsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUN2QixDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBQ3hCLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFFdkIsS0FBSztZQUNMLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUM7WUFDMUIsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUN2QixDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBQ3ZCLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFFeEIsS0FBSztZQUNMLENBQUMsRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUM7WUFDM0IsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUN2QixDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBQ3ZCLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFFdkIsS0FBSztZQUNMLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUM7WUFDMUIsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUN2QixDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBQ3ZCLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFFeEIsS0FBSztZQUNMLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUM7WUFDM0IsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUN2QixDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBQ3ZCLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFFeEIsS0FBSztZQUNMLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUM7WUFDMUIsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUN2QixDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBQ3ZCLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFFeEIsS0FBSztZQUNMLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUM7WUFDM0IsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUN4QixDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBQ3hCLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFFeEIsS0FBSztZQUNMLENBQUMsRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUM7WUFDM0IsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUN2QixDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBQ3ZCLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFFeEIsS0FBSztZQUNMLENBQUMsRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUM7WUFDZCxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBQ3hCLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFDeEIsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUV4QixLQUFLO1lBQ0wsQ0FBQyxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQztZQUMzQixDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBQ3hCLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFDeEIsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUV4QixLQUFLO1lBQ0wsQ0FBQyxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQztZQUMzQixDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBQ3hCLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFDdkIsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUV2QixLQUFLO1lBQ0wsQ0FBQyxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQztZQUMzQixDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBQ3hCLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFDeEIsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUV4QixLQUFLO1lBQ0wsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQztZQUMzQixDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBQ3ZCLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFDeEIsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUV2QixLQUFLO1lBQ0wsQ0FBQyxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQztZQUMzQixDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBQ3hCLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFDeEIsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUV4QixLQUFLO1lBQ0wsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQztZQUMzQixDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBQ3hCLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFDeEIsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUV4QixLQUFLO1lBQ0wsQ0FBQyxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQztZQUMzQixDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBQ3ZCLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFDeEIsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUV4QixLQUFLO1lBQ0wsQ0FBQyxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQztZQUMzQixDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBQ3hCLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFDeEIsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztTQUN6QixDQUFDO1FBRUYsTUFBTSxTQUFTLEdBQVEsQ0FBQyxVQUFlLEVBQUUsU0FBYyxFQUFF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Q0FBQyxRQUFRLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQy9CLElBQUksR0FBRyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsQ0FDekIsQ0FBQztpQkFDSDthQUNGO1lBQ0QsT0FBTyxJQUFJLENBQUM7UUFDZCxDQUFDO1FBRUQsT0FBTyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDeEIsQ0FBQyxDQUFDO0FBQ0osQ0FBQyxDQUFDLEVBQ0EsQ0FBQztBQUNILGtCQUFlLE9BQU8sQ0FBQyIsImZpbGUiOiJzcmMvb2JuaXovbGlicy91dGlscy9xci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1kaXNhYmxlICovXG5cbi8qIFRoYW5rcyBLYXp1aGlrbyBBcmFzZSAqL1xuLyogaHR0cHM6Ly9naXRodWIuY29tL2thenVoaWtvYXJhc2UvcXJjb2RlLWdlbmVyYXRvci90cmVlL21hc3Rlci9qcyAqL1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vXG4vLyBRUiBDb2RlIEdlbmVyYXRvciBmb3IgSmF2YVNjcmlwdFxuLy9cbi8vIENvcHlyaWdodCAoYykgMjAwOSBLYXp1aGlrbyBBcmFzZVxuLy9cbi8vIFVSTDogaHR0cDovL3d3dy5kLXByb2plY3QuY29tL1xuLy9cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZTpcbi8vICBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuLy9cbi8vIFRoZSB3b3JkICdRUiBDb2RlJyBpcyByZWdpc3RlcmVkIHRyYWRlbWFyayBvZlxuLy8gREVOU08gV0FWRSBJTkNPUlBPUkFURURcbi8vICBodHRwOi8vd3d3LmRlbnNvLXdhdmUuY29tL3FyY29kZS9mYXFwYXRlbnQtZS5odG1sXG4vL1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmNvbnN0IF9xcmNvZGU6IGFueSA9ICgoKSA9PiB7XG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIHFyY29kZVxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvKipcbiAgICogcXJjb2RlXG4gICAqIEBwYXJhbSB0eXBlTnVtYmVyIDEgdG8gNDBcbiAgICogQHBhcmFtIGVycm9yQ29ycmVjdGlvbkxldmVsICdMJywnTScsJ1EnLCdIJ1xuICAgKi9cbiAgY29uc3QgcXJjb2RlOiBhbnkgPSAoX3R5cGVOdW1iZXI6IG51bWJlciwgZXJyb3JDb3JyZWN0aW9uTGV2ZWxTdHI6IFwiTFwiIHwgXCJNXCIgfCBcIlFcIiB8IFwiSFwiKSA9PiB7XG4gICAgY29uc3QgUEFEMDogYW55ID0gMHhlYztcbiAgICBjb25zdCBQQUQxOiBhbnkgPSAweDExO1xuXG4gICAgY29uc3QgX2Vycm9yQ29ycmVjdGlvbkxldmVsOiBhbnkgPSBRUkVycm9yQ29ycmVjdGlvbkxldmVsW2Vycm9yQ29ycmVjdGlvbkxldmVsU3RyXTtcbiAgICBsZXQgX21vZHVsZXM6IGFueSA9IG51bGw7XG4gICAgbGV0IF9tb2R1bGVDb3VudDogYW55ID0gMDtcbiAgICBsZXQgX2RhdGFDYWNoZTogYW55ID0gbnVsbDtcbiAgICBjb25zdCBfZGF0YUxpc3Q6IGFueSA9IFtdO1xuXG4gICAgY29uc3QgX3RoaXM6IGFueSA9IHt9O1xuXG4gICAgY29uc3QgbWFrZUltcGw6IGFueSA9ICh0ZXN0OiBhbnksIG1hc2tQYXR0ZXJuOiBhbnkpID0+IHtcbiAgICAgIF9tb2R1bGVDb3VudCA9IF90eXBlTnVtYmVyICogNCArIDE3O1xuICAgICAgX21vZHVsZXMgPSAoKG1vZHVsZUNvdW50OiBhbnkgKSA9PiB7XG4gICAgICAgIGNvbnN0IG1vZHVsZXM6IGFueSA9IG5ldyBBcnJheShtb2R1bGVDb3VudCk7XG4gICAgICAgIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IG1vZHVsZUNvdW50OyByb3cgKz0gMSkge1xuICAgICAgICAgIG1vZHVsZXNbcm93XSA9IG5ldyBBcnJheShtb2R1bGVDb3VudCk7XG4gICAgICAgICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgbW9kdWxlQ291bnQ7IGNvbCArPSAxKSB7XG4gICAgICAgICAgICBtb2R1bGVzW3Jvd11bY29sXSA9IG51bGw7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtb2R1bGVzO1xuICAgICAgfSkoX21vZHVsZUNvdW50KTtcblxuICAgICAgc2V0dXBQb3NpdGlvblByb2JlUGF0dGVybigwLCAwKTtcbiAgICAgIHNldHVwUG9zaXRpb25Qcm9iZVBhdHRlcm4oX21vZHVsZUNvdW50IC0gNywgMCk7XG4gICAgICBzZXR1cFBvc2l0aW9uUHJvYmVQYXR0ZXJuKDAsIF9tb2R1bGVDb3VudCAtIDcpO1xuICAgICAgc2V0dXBQb3NpdGlvbkFkanVzdFBhdHRlcm4oKTtcbiAgICAgIHNldHVwVGltaW5nUGF0dGVybigpO1xuICAgICAgc2V0dXBUeXBlSW5mbyh0ZXN0LCBtYXNrUGF0dGVybik7XG5cbiAgICAgIGlmIChfdHlwZU51bWJlciA+PSA3KSB7XG4gICAgICAgIHNldHVwVHlwZU51bWJlcih0ZXN0KTtcbiAgICAgIH1cblxuICAgICAgaWYgKF9kYXRhQ2FjaGUgPT09IG51bGwpIHtcbiAgICAgICAgX2RhdGFDYWNoZSA9IGNyZWF0ZURhdGEoX3R5cGVOdW1iZXIsIF9lcnJvckNvcnJlY3Rpb25MZXZlbCwgX2RhdGFMaXN0KTtcbiAgICAgIH1cblxuICAgICAgbWFwRGF0YShfZGF0YUNhY2hlLCBtYXNrUGF0dGVybik7XG4gICAgfTtcblxuICAgIGNvbnN0IHNldHVwUG9zaXRpb25Qcm9iZVBhdHRlcm46IGFueSA9IChyb3c6IG51bWJlciwgY29sOiBudW1iZXIpID0+IHtcbiAgICAgIGZvciAobGV0IHIgPSAtMTsgciA8PSA3OyByICs9IDEpIHtcbiAgICAgICAgaWYgKHJvdyArIHIgPD0gLTEgfHwgX21vZHVsZUNvdW50IDw9IHJvdyArIHIpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAobGV0IGMgPSAtMTsgYyA8PSA3OyBjICs9IDEpIHtcbiAgICAgICAgICBpZiAoY29sICsgYyA8PSAtMSB8fCBfbW9kdWxlQ291bnQgPD0gY29sICsgYykge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgKDAgPD0gciAmJiByIDw9IDYgJiYgKGMgPT09IDAgfHwgYyA9PT0gNikpIHx8XG4gICAgICAgICAgICAoMCA8PSBjICYmIGMgPD0gNiAmJiAociA9PT0gMCB8fCByID09PSA2KSkgfHxcbiAgICAgICAgICAgICgyIDw9IHIgJiYgciA8PSA0ICYmIDIgPD0gYyAmJiBjIDw9IDQpXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICBfbW9kdWxlc1tyb3cgKyByXVtjb2wgKyBjXSA9IHRydWU7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIF9tb2R1bGVzW3JvdyArIHJdW2NvbCArIGNdID0gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIGNvbnN0IGdldEJlc3RNYXNrUGF0dGVybjogYW55ID0gKCkgPT4ge1xuICAgICAgbGV0IG1pbkxvc3RQb2ludDogYW55ID0gMDtcbiAgICAgIGxldCBwYXR0ZXJuOiBhbnkgPSAwO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDg7IGkgKz0gMSkge1xuICAgICAgICBtYWtlSW1wbCh0cnVlLCBpKTtcblxuICAgICAgICBjb25zdCBsb3N0UG9pbnQ6IGFueSA9IFFSVXRpbC5nZXRMb3N0UG9pbnQoX3RoaXMpO1xuXG4gICAgICAgIGlmIChpID09PSAwIHx8IG1pbkxvc3RQb2ludCA+IGxvc3RQb2ludCkge1xuICAgICAgICAgIG1pbkxvc3RQb2ludCA9IGxvc3RQb2ludDtcbiAgICAgICAgICBwYXR0ZXJuID0gaTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gcGF0dGVybjtcbiAgICB9O1xuXG4gICAgY29uc3Qgc2V0dXBUaW1pbmdQYXR0ZXJuOiBhbnkgPSAoKSA9PiB7XG4gICAgICBmb3IgKGxldCByID0gODsgciA8IF9tb2R1bGVDb3VudCAtIDg7IHIgKz0gMSkge1xuICAgICAgICBpZiAoX21vZHVsZXNbcl1bNl0gIT09IG51bGwpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBfbW9kdWxlc1tyXVs2XSA9IHIgJSAyID09PSAwO1xuICAgICAgfVxuXG4gICAgICBmb3IgKGxldCBjID0gODsgYyA8IF9tb2R1bGVDb3VudCAtIDg7IGMgKz0gMSkge1xuICAgICAgICBpZiAoX21vZHVsZXNbNl1bY10gIT09IG51bGwpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBfbW9kdWxlc1s2XVtjXSA9IGMgJSAyID09PSAwO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBjb25zdCBzZXR1cFBvc2l0aW9uQWRqdXN0UGF0dGVybjogYW55ID0gKCkgPT4ge1xuICAgICAgY29uc3QgcG9zOiBhbnkgPSBRUlV0aWwuZ2V0UGF0dGVyblBvc2l0aW9uKF90eXBlTnVtYmVyKTtcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwb3MubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBwb3MubGVuZ3RoOyBqICs9IDEpIHtcbiAgICAgICAgICBjb25zdCByb3c6IGFueSA9IHBvc1tpXTtcbiAgICAgICAgICBjb25zdCBjb2w6IGFueSA9IHBvc1tqXTtcblxuICAgICAgICAgIGlmIChfbW9kdWxlc1tyb3ddW2NvbF0gIT09IG51bGwpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGZvciAobGV0IHIgPSAtMjsgciA8PSAyOyByICs9IDEpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGMgPSAtMjsgYyA8PSAyOyBjICs9IDEpIHtcbiAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIHIgPT09IC0yIHx8XG4gICAgICAgICAgICAgICAgciA9PT0gMiB8fFxuICAgICAgICAgICAgICAgIGMgPT09IC0yIHx8XG4gICAgICAgICAgICAgICAgYyA9PT0gMiB8fFxuICAgICAgICAgICAgICAgIChyID09PSAwICYmIGMgPT09IDApXG4gICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIF9tb2R1bGVzW3JvdyArIHJdW2NvbCArIGNdID0gdHJ1ZTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBfbW9kdWxlc1tyb3cgKyByXVtjb2wgKyBjXSA9IGZhbHNlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIGNvbnN0IHNldHVwVHlwZU51bWJlcjogYW55ID0gKHRlc3Q6IGFueSkgPT4ge1xuICAgICAgY29uc3QgYml0czogYW55ID0gUVJVdGlsLmdldEJDSFR5cGVOdW1iZXIoX3R5cGVOdW1iZXIpO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDE4OyBpICs9IDEpIHtcbiAgICAgICAgY29uc3QgbW9kOiBhbnkgPSAhdGVzdCAmJiAoKGJpdHMgPj4gaSkgJiAxKSA9PT0gMTtcbiAgICAgICAgX21vZHVsZXNbTWF0aC5mbG9vcihpIC8gMyldW2kgJSAzICsgX21vZHVsZUNvdW50IC0gOCAtIDNdID0gbW9kO1xuICAgICAgfVxuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDE4OyBpICs9IDEpIHtcbiAgICAgICAgY29uc3QgbW9kOiBhbnkgPSAhdGVzdCAmJiAoKGJpdHMgPj4gaSkgJiAxKSA9PT0gMTtcbiAgICAgICAgX21vZHVsZXNbaSAlIDMgKyBfbW9kdWxlQ291bnQgLSA4IC0gM11bTWF0aC5mbG9vcihpIC8gMyldID0gbW9kO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBjb25zdCBzZXR1cFR5cGVJbmZvOiBhbnkgPSAodGVzdDogYW55LCBtYXNrUGF0dGVybjogYW55KSA9PiB7XG4gICAgICBjb25zdCBkYXRhOiBhbnkgPSAoX2Vycm9yQ29ycmVjdGlvbkxldmVsIDw8IDMpIHwgbWFza1BhdHRlcm47XG4gICAgICBjb25zdCBiaXRzOiBhbnkgPSBRUlV0aWwuZ2V0QkNIVHlwZUluZm8oZGF0YSk7XG5cbiAgICAgIC8vIHZlcnRpY2FsXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDE1OyBpICs9IDEpIHtcbiAgICAgICAgY29uc3QgbW9kOiBhbnkgPSAhdGVzdCAmJiAoKGJpdHMgPj4gaSkgJiAxKSA9PT0gMTtcblxuICAgICAgICBpZiAoaSA8IDYpIHtcbiAgICAgICAgICBfbW9kdWxlc1tpXVs4XSA9IG1vZDtcbiAgICAgICAgfSBlbHNlIGlmIChpIDwgOCkge1xuICAgICAgICAgIF9tb2R1bGVzW2kgKyAxXVs4XSA9IG1vZDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBfbW9kdWxlc1tfbW9kdWxlQ291bnQgLSAxNSArIGldWzhdID0gbW9kO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIGhvcml6b250YWxcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTU7IGkgKz0gMSkge1xuICAgICAgICBjb25zdCBtb2Q6IGFueSA9ICF0ZXN0ICYmICgoYml0cyA+PiBpKSAmIDEpID09PSAxO1xuXG4gICAgICAgIGlmIChpIDwgOCkge1xuICAgICAgICAgIF9tb2R1bGVzWzhdW19tb2R1bGVDb3VudCAtIGkgLSAxXSA9IG1vZDtcbiAgICAgICAgfSBlbHNlIGlmIChpIDwgOSkge1xuICAgICAgICAgIF9tb2R1bGVzWzhdWzE1IC0gaSAtIDEgKyAxXSA9IG1vZDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBfbW9kdWxlc1s4XVsxNSAtIGkgLSAxXSA9IG1vZDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBmaXhlZCBtb2R1bGVcbiAgICAgIF9tb2R1bGVzW19tb2R1bGVDb3VudCAtIDhdWzhdID0gIXRlc3Q7XG4gICAgfTtcblxuICAgIGNvbnN0IG1hcERhdGE6IGFueSA9IChkYXRhOiBhbnksIG1hc2tQYXR0ZXJuOiBhbnkpID0+IHtcbiAgICAgIGxldCBpbmM6IGFueSA9IC0xO1xuICAgICAgbGV0IHJvdzogYW55ID0gX21vZHVsZUNvdW50IC0gMTtcbiAgICAgIGxldCBiaXRJbmRleDogYW55ID0gNztcbiAgICAgIGxldCBieXRlSW5kZXg6IGFueSA9IDA7XG4gICAgICBjb25zdCBtYXNrRnVuYzogYW55ID0gUVJVdGlsLmdldE1hc2tGdW5jdGlvbihtYXNrUGF0dGVybik7XG5cbiAgICAgIGZvciAobGV0IGNvbCA9IF9tb2R1bGVDb3VudCAtIDE7IGNvbCA+IDA7IGNvbCAtPSAyKSB7XG4gICAgICAgIGlmIChjb2wgPT09IDYpIHtcbiAgICAgICAgICBjb2wgLT0gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgZm9yIChsZXQgYyA9IDA7IGMgPCAyOyBjICs9IDEpIHtcbiAgICAgICAgICAgIGlmIChfbW9kdWxlc1tyb3ddW2NvbCAtIGNdID09PSBudWxsKSB7XG4gICAgICAgICAgICAgIGxldCBkYXJrOiBhbnkgPSBmYWxzZTtcblxuICAgICAgICAgICAgICBpZiAoYnl0ZUluZGV4IDwgZGF0YS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBkYXJrID0gKChkYXRhW2J5dGVJbmRleF0gPj4+IGJpdEluZGV4KSAmIDEpID09PSAxO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgY29uc3QgbWFzazogYW55ID0gbWFza0Z1bmMocm93LCBjb2wgLSBjKTtcblxuICAgICAgICAgICAgICBpZiAobWFzaykge1xuICAgICAgICAgICAgICAgIGRhcmsgPSAhZGFyaztcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIF9tb2R1bGVzW3Jvd11bY29sIC0gY10gPSBkYXJrO1xuICAgICAgICAgICAgICBiaXRJbmRleCAtPSAxO1xuXG4gICAgICAgICAgICAgIGlmIChiaXRJbmRleCA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICBieXRlSW5kZXggKz0gMTtcbiAgICAgICAgICAgICAgICBiaXRJbmRleCA9IDc7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICByb3cgKz0gaW5jO1xuXG4gICAgICAgICAgaWYgKHJvdyA8IDAgfHwgX21vZHVsZUNvdW50IDw9IHJvdykge1xuICAgICAgICAgICAgcm93IC09IGluYztcbiAgICAgICAgICAgIGluYyA9IC1pbmM7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgY29uc3QgY3JlYXRlQnl0ZXM6IGFueSA9IChidWZmZXI6IGFueSwgcnNCbG9ja3M6IGFueSkgPT4ge1xuICAgICAgbGV0IG9mZnNldDogYW55ID0gMDtcblxuICAgICAgbGV0IG1heERjQ291bnQ6IGFueSA9IDA7XG4gICAgICBsZXQgbWF4RWNDb3VudDogYW55ID0gMDtcblxuICAgICAgY29uc3QgZGNkYXRhOiBhbnkgPSBuZXcgQXJyYXkocnNCbG9ja3MubGVuZ3RoKTtcbiAgICAgIGNvbnN0IGVjZGF0YTogYW55ID0gbmV3IEFycmF5KHJzQmxvY2tzLmxlbmd0aCk7XG5cbiAgICAgIGZvciAobGV0IHIgPSAwOyByIDwgcnNCbG9ja3MubGVuZ3RoOyByICs9IDEpIHtcbiAgICAgICAgY29uc3QgZGNDb3VudDogYW55ID0gcnNCbG9ja3Nbcl0uZGF0YUNvdW50O1xuICAgICAgICBjb25zdCBlY0NvdW50OiBhbnkgPSByc0Jsb2Nrc1tyXS50b3RhbENvdW50IC0gZGNDb3VudDtcblxuICAgICAgICBtYXhEY0NvdW50ID0gTWF0aC5tYXgobWF4RGNDb3VudCwgZGNDb3VudCk7XG4gICAgICAgIG1heEVjQ291bnQgPSBNYXRoLm1heChtYXhFY0NvdW50LCBlY0NvdW50KTtcblxuICAgICAgICBkY2RhdGFbcl0gPSBuZXcgQXJyYXkoZGNDb3VudCk7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkY2RhdGFbcl0ubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICBkY2RhdGFbcl1baV0gPSAweGZmICYgYnVmZmVyLmdldEJ1ZmZlcigpW2kgKyBvZmZzZXRdO1xuICAgICAgICB9XG4gICAgICAgIG9mZnNldCArPSBkY0NvdW50O1xuXG4gICAgICAgIGNvbnN0IHJzUG9seTogYW55ID0gUVJVdGlsLmdldEVycm9yQ29ycmVjdFBvbHlub21pYWwoZWNDb3VudCk7XG4gICAgICAgIGNvbnN0IHJhd1BvbHk6IGFueSA9IHFyUG9seW5vbWlhbChkY2RhdGFbcl0sIHJzUG9seS5nZXRMZW5ndGgoKSAtIDEpIGFzIGFueTtcblxuICAgICAgICBjb25zdCBtb2RQb2x5OiBhbnkgPSByYXdQb2x5Lm1vZChyc1BvbHkpO1xuICAgICAgICBlY2RhdGFbcl0gPSBuZXcgQXJyYXkocnNQb2x5LmdldExlbmd0aCgpIC0gMSk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZWNkYXRhW3JdLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgY29uc3QgbW9kSW5kZXg6IGFueSA9IGkgKyBtb2RQb2x5LmdldExlbmd0aCgpIC0gZWNkYXRhW3JdLmxlbmd0aDtcbiAgICAgICAgICBlY2RhdGFbcl1baV0gPSBtb2RJbmRleCA+PSAwID8gbW9kUG9seS5nZXRBdChtb2RJbmRleCkgOiAwO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGxldCB0b3RhbENvZGVDb3VudDogYW55ID0gMDtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcnNCbG9ja3MubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgdG90YWxDb2RlQ291bnQgKz0gcnNCbG9ja3NbaV0udG90YWxDb3VudDtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZGF0YTogYW55ID0gbmV3IEFycmF5KHRvdGFsQ29kZUNvdW50KTtcbiAgICAgIGxldCBpbmRleDogYW55ID0gMDtcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYXhEY0NvdW50OyBpICs9IDEpIHtcbiAgICAgICAgZm9yIChsZXQgciA9IDA7IHIgPCByc0Jsb2Nrcy5sZW5ndGg7IHIgKz0gMSkge1xuICAgICAgICAgIGlmIChpIDwgZGNkYXRhW3JdLmxlbmd0aCkge1xuICAgICAgICAgICAgZGF0YVtpbmRleF0gPSBkY2RhdGFbcl1baV07XG4gICAgICAgICAgICBpbmRleCArPSAxO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1heEVjQ291bnQ7IGkgKz0gMSkge1xuICAgICAgICBmb3IgKGxldCByID0gMDsgciA8IHJzQmxvY2tzLmxlbmd0aDsgciArPSAxKSB7XG4gICAgICAgICAgaWYgKGkgPCBlY2RhdGFbcl0ubGVuZ3RoKSB7XG4gICAgICAgICAgICBkYXRhW2luZGV4XSA9IGVjZGF0YVtyXVtpXTtcbiAgICAgICAgICAgIGluZGV4ICs9IDE7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBkYXRhO1xuICAgIH07XG5cbiAgICBjb25zdCBjcmVhdGVEYXRhOiBhbnkgPSAodHlwZU51bWJlcjogYW55LCBlcnJvckNvcnJlY3Rpb25MZXZlbDogYW55LCBkYXRhTGlzdDogYW55KSA9PiB7XG4gICAgICBjb25zdCByc0Jsb2NrczogYW55ID0gUVJSU0Jsb2NrLmdldFJTQmxvY2tzKHR5cGVOdW1iZXIsIGVycm9yQ29ycmVjdGlvbkxldmVsKTtcblxuICAgICAgY29uc3QgYnVmZmVyOiBhbnkgPSBxckJpdEJ1ZmZlcigpO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGFMaXN0Lmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGNvbnN0IGRhdGE6IGFueSA9IGRhdGFMaXN0W2ldO1xuICAgICAgICBidWZmZXIucHV0KGRhdGEuZ2V0TW9kZSgpLCA0KTtcbiAgICAgICAgYnVmZmVyLnB1dChcbiAgICAgICAgICBkYXRhLmdldExlbmd0aCgpLFxuICAgICAgICAgIFFSVXRpbC5nZXRMZW5ndGhJbkJpdHMoZGF0YS5nZXRNb2RlKCksIHR5cGVOdW1iZXIpLFxuICAgICAgICApO1xuICAgICAgICBkYXRhLndyaXRlKGJ1ZmZlcik7XG4gICAgICB9XG5cbiAgICAgIC8vIGNhbGMgbnVtIG1heCBkYXRhLlxuICAgICAgbGV0IHRvdGFsRGF0YUNvdW50OiBhbnkgPSAwO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByc0Jsb2Nrcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICB0b3RhbERhdGFDb3VudCArPSByc0Jsb2Nrc1tpXS5kYXRhQ291bnQ7XG4gICAgICB9XG5cbiAgICAgIGlmIChidWZmZXIuZ2V0TGVuZ3RoSW5CaXRzKCkgPiB0b3RhbERhdGFDb3VudCAqIDgpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiY29kZSBsZW5ndGggb3ZlcmZsb3cuIChcIiArXG4gICAgICAgICAgYnVmZmVyLmdldExlbmd0aEluQml0cygpICtcbiAgICAgICAgICBcIj5cIiArXG4gICAgICAgICAgdG90YWxEYXRhQ291bnQgKiA4ICtcbiAgICAgICAgICBcIilcIik7XG4gICAgICB9XG5cbiAgICAgIC8vIGVuZCBjb2RlXG4gICAgICBpZiAoYnVmZmVyLmdldExlbmd0aEluQml0cygpICsgNCA8PSB0b3RhbERhdGFDb3VudCAqIDgpIHtcbiAgICAgICAgYnVmZmVyLnB1dCgwLCA0KTtcbiAgICAgIH1cblxuICAgICAgLy8gcGFkZGluZ1xuICAgICAgd2hpbGUgKGJ1ZmZlci5nZXRMZW5ndGhJbkJpdHMoKSAlIDggIT09IDApIHtcbiAgICAgICAgYnVmZmVyLnB1dEJpdChmYWxzZSk7XG4gICAgICB9XG5cbiAgICAgIC8vIHBhZGRpbmdcbiAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIGlmIChidWZmZXIuZ2V0TGVuZ3RoSW5CaXRzKCkgPj0gdG90YWxEYXRhQ291bnQgKiA4KSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgYnVmZmVyLnB1dChQQUQwLCA4KTtcblxuICAgICAgICBpZiAoYnVmZmVyLmdldExlbmd0aEluQml0cygpID49IHRvdGFsRGF0YUNvdW50ICogOCkge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGJ1ZmZlci5wdXQoUEFEMSwgOCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBjcmVhdGVCeXRlcyhidWZmZXIsIHJzQmxvY2tzKTtcbiAgICB9O1xuXG4gICAgX3RoaXMuYWRkRGF0YSA9IChkYXRhOiBhbnksIG1vZGU6IGFueSkgPT4ge1xuICAgICAgbW9kZSA9IG1vZGUgfHwgXCJCeXRlXCI7XG5cbiAgICAgIGxldCBuZXdEYXRhOiBhbnkgPSBudWxsO1xuXG4gICAgICBzd2l0Y2ggKG1vZGUpIHtcbiAgICAgICAgY2FzZSBcIk51bWVyaWNcIjpcbiAgICAgICAgICBuZXdEYXRhID0gcXJOdW1iZXIoZGF0YSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJBbHBoYW51bWVyaWNcIjpcbiAgICAgICAgICBuZXdEYXRhID0gcXJBbHBoYU51bShkYXRhKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcIkJ5dGVcIjpcbiAgICAgICAgICBuZXdEYXRhID0gcXI4Qml0Qnl0ZShkYXRhKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcIkthbmppXCI6XG4gICAgICAgICAgbmV3RGF0YSA9IHFyS2FuamkoZGF0YSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibW9kZTpcIiArIG1vZGUpO1xuICAgICAgfVxuXG4gICAgICBfZGF0YUxpc3QucHVzaChuZXdEYXRhKTtcbiAgICAgIF9kYXRhQ2FjaGUgPSBudWxsO1xuICAgIH07XG5cbiAgICBfdGhpcy5nZXRNb2R1bGVzID0gKCkgPT4ge1xuICAgICAgcmV0dXJuIF9tb2R1bGVzO1xuICAgIH07XG5cbiAgICBfdGhpcy5pc0RhcmsgPSAocm93OiBudW1iZXIsIGNvbDogbnVtYmVyKSA9PiB7XG4gICAgICBpZiAocm93IDwgMCB8fCBfbW9kdWxlQ291bnQgPD0gcm93IHx8IGNvbCA8IDAgfHwgX21vZHVsZUNvdW50IDw9IGNvbCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3Iocm93ICsgXCIsXCIgKyBjb2wpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIF9tb2R1bGVzW3Jvd11bY29sXTtcbiAgICB9O1xuXG4gICAgX3RoaXMuZ2V0TW9kdWxlQ291bnQgPSAoKSA9PiB7XG4gICAgICByZXR1cm4gX21vZHVsZUNvdW50O1xuICAgIH07XG5cbiAgICBfdGhpcy5tYWtlID0gKCkgPT4ge1xuICAgICAgaWYgKF90eXBlTnVtYmVyIDwgMSkge1xuICAgICAgICBsZXQgdHlwZU51bWJlcjogYW55ID0gMTtcblxuICAgICAgICBmb3IgKDsgdHlwZU51bWJlciA8IDQwOyB0eXBlTnVtYmVyKyspIHtcbiAgICAgICAgICBjb25zdCByc0Jsb2NrczogYW55ID0gUVJSU0Jsb2NrLmdldFJTQmxvY2tzKFxuICAgICAgICAgICAgdHlwZU51bWJlcixcbiAgICAgICAgICAgIF9lcnJvckNvcnJlY3Rpb25MZXZlbCxcbiAgICAgICAgICApO1xuICAgICAgICAgIGNvbnN0IGJ1ZmZlcjogYW55ID0gcXJCaXRCdWZmZXIoKTtcblxuICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgX2RhdGFMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBkYXRhOiBhbnkgPSBfZGF0YUxpc3RbaV07XG4gICAgICAgICAgICBidWZmZXIucHV0KGRhdGEuZ2V0TW9kZSgpLCA0KTtcbiAgICAgICAgICAgIGJ1ZmZlci5wdXQoXG4gICAgICAgICAgICAgIGRhdGEuZ2V0TGVuZ3RoKCksXG4gICAgICAgICAgICAgIFFSVXRpbC5nZXRMZW5ndGhJbkJpdHMoZGF0YS5nZXRNb2RlKCksIHR5cGVOdW1iZXIpLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGRhdGEud3JpdGUoYnVmZmVyKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBsZXQgdG90YWxEYXRhQ291bnQ6IGFueSA9IDA7XG4gICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByc0Jsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdG90YWxEYXRhQ291bnQgKz0gcnNCbG9ja3NbaV0uZGF0YUNvdW50O1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChidWZmZXIuZ2V0TGVuZ3RoSW5CaXRzKCkgPD0gdG90YWxEYXRhQ291bnQgKiA4KSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBfdHlwZU51bWJlciA9IHR5cGVOdW1iZXI7XG4gICAgICB9XG5cbiAgICAgIG1ha2VJbXBsKGZhbHNlLCBnZXRCZXN0TWFza1BhdHRlcm4oKSk7XG4gICAgfTtcblxuICAgIF90aGlzLmNyZWF0ZVRhYmxlVGFnID0gKGNlbGxTaXplOiBhbnksIG1hcmdpbjogYW55KSA9PiB7XG4gICAgICBjZWxsU2l6ZSA9IGNlbGxTaXplIHx8IDI7XG4gICAgICBtYXJnaW4gPSB0eXBlb2YgbWFyZ2luID09PSBcInVuZGVmaW5lZFwiID8gY2VsbFNpemUgKiA0IDogbWFyZ2luO1xuXG4gICAgICBsZXQgcXJIdG1sOiBhbnkgPSBcIlwiO1xuXG4gICAgICBxckh0bWwgKz0gJzx0YWJsZSBzdHlsZT1cIic7XG4gICAgICBxckh0bWwgKz0gXCIgYm9yZGVyLXdpZHRoOiAwcHg7IGJvcmRlci1zdHlsZTogbm9uZTtcIjtcbiAgICAgIHFySHRtbCArPSBcIiBib3JkZXItY29sbGFwc2U6IGNvbGxhcHNlO1wiO1xuICAgICAgcXJIdG1sICs9IFwiIHBhZGRpbmc6IDBweDsgbWFyZ2luOiBcIiArIG1hcmdpbiArIFwicHg7XCI7XG4gICAgICBxckh0bWwgKz0gJ1wiPic7XG4gICAgICBxckh0bWwgKz0gXCI8dGJvZHk+XCI7XG5cbiAgICAgIGZvciAobGV0IHIgPSAwOyByIDwgX3RoaXMuZ2V0TW9kdWxlQ291bnQoKTsgciArPSAxKSB7XG4gICAgICAgIHFySHRtbCArPSBcIjx0cj5cIjtcblxuICAgICAgICBmb3IgKGxldCBjID0gMDsgYyA8IF90aGlzLmdldE1vZHVsZUNvdW50KCk7IGMgKz0gMSkge1xuICAgICAgICAgIHFySHRtbCArPSAnPHRkIHN0eWxlPVwiJztcbiAgICAgICAgICBxckh0bWwgKz0gXCIgYm9yZGVyLXdpZHRoOiAwcHg7IGJvcmRlci1zdHlsZTogbm9uZTtcIjtcbiAgICAgICAgICBxckh0bWwgKz0gXCIgYm9yZGVyLWNvbGxhcHNlOiBjb2xsYXBzZTtcIjtcbiAgICAgICAgICBxckh0bWwgKz0gXCIgcGFkZGluZzogMHB4OyBtYXJnaW46IDBweDtcIjtcbiAgICAgICAgICBxckh0bWwgKz0gXCIgd2lkdGg6IFwiICsgY2VsbFNpemUgKyBcInB4O1wiO1xuICAgICAgICAgIHFySHRtbCArPSBcIiBoZWlnaHQ6IFwiICsgY2VsbFNpemUgKyBcInB4O1wiO1xuICAgICAgICAgIHFySHRtbCArPSBcIiBiYWNrZ3JvdW5kLWNvbG9yOiBcIjtcbiAgICAgICAgICBxckh0bWwgKz0gX3RoaXMuaXNEYXJrKHIsIGMpID8gXCIjMDAwMDAwXCIgOiBcIiNmZmZmZmZcIjtcbiAgICAgICAgICBxckh0bWwgKz0gXCI7XCI7XG4gICAgICAgICAgcXJIdG1sICs9ICdcIi8+JztcbiAgICAgICAgfVxuXG4gICAgICAgIHFySHRtbCArPSBcIjwvdHI+XCI7XG4gICAgICB9XG5cbiAgICAgIHFySHRtbCArPSBcIjwvdGJvZHk+XCI7XG4gICAgICBxckh0bWwgKz0gXCI8L3RhYmxlPlwiO1xuXG4gICAgICByZXR1cm4gcXJIdG1sO1xuICAgIH07XG5cbiAgICBfdGhpcy5yZW5kZXJUbzJkQ29udGV4dCA9IChjb250ZXh0OiBhbnksIGNlbGxTaXplOiBhbnkpID0+IHtcbiAgICAgIGNlbGxTaXplID0gY2VsbFNpemUgfHwgMjtcbiAgICAgIGNvbnN0IGxlbmd0aDogYW55ID0gX3RoaXMuZ2V0TW9kdWxlQ291bnQoKTtcbiAgICAgIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IGxlbmd0aDsgcm93KyspIHtcbiAgICAgICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgbGVuZ3RoOyBjb2wrKykge1xuICAgICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gX3RoaXMuaXNEYXJrKHJvdywgY29sKSA/IFwiYmxhY2tcIiA6IFwid2hpdGVcIjtcbiAgICAgICAgICBjb250ZXh0LmZpbGxSZWN0KHJvdyAqIGNlbGxTaXplLCBjb2wgKiBjZWxsU2l6ZSwgY2VsbFNpemUsIGNlbGxTaXplKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICByZXR1cm4gX3RoaXM7XG4gIH07XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIHFyY29kZS5zdHJpbmdUb0J5dGVzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIHFyY29kZS5zdHJpbmdUb0J5dGVzRnVuY3MgPSB7XG4gICAgZGVmYXVsdChzOiBhbnkpIHtcbiAgICAgIGNvbnN0IGJ5dGVzOiBhbnkgPSBbXTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBjb25zdCBjOiBhbnkgPSBzLmNoYXJDb2RlQXQoaSk7XG4gICAgICAgIGJ5dGVzLnB1c2goYyAmIDB4ZmYpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGJ5dGVzO1xuICAgIH0sXG4gIH0gYXMgYW55O1xuXG4gIHFyY29kZS5zdHJpbmdUb0J5dGVzID0gcXJjb2RlLnN0cmluZ1RvQnl0ZXNGdW5jcy5kZWZhdWx0O1xuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBxcmNvZGUuY3JlYXRlU3RyaW5nVG9CeXRlc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvKipcbiAgICogQHBhcmFtIHVuaWNvZGVEYXRhIGJhc2U2NCBzdHJpbmcgb2YgYnl0ZSBhcnJheS5cbiAgICogWzE2Yml0IFVuaWNvZGVdLFsxNmJpdCBCeXRlc10sIC4uLlxuICAgKiBAcGFyYW0gbnVtQ2hhcnNcbiAgICovXG4gIHFyY29kZS5jcmVhdGVTdHJpbmdUb0J5dGVzID0gKHVuaWNvZGVEYXRhOiBhbnksIG51bUNoYXJzOiBhbnkpID0+IHtcbiAgICAvLyBjcmVhdGUgY29udmVyc2lvbiBtYXAuXG5cbiAgICBjb25zdCB1bmljb2RlTWFwOiBhbnkgPSAoKCkgPT4ge1xuICAgICAgY29uc3QgYmluOiBhbnkgPSBiYXNlNjREZWNvZGVJbnB1dFN0cmVhbSh1bmljb2RlRGF0YSk7XG4gICAgICBjb25zdCByZWFkOiBhbnkgPSAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGI6IGFueSA9IGJpbi5yZWFkKCk7XG4gICAgICAgIGlmIChiID09PSAtMSkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcImVvZlwiKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYjtcbiAgICAgIH07XG5cbiAgICAgIGxldCBjb3VudDogYW55ID0gMDtcbiAgICAgIGNvbnN0IHJlc3VsdDogYW55ID0ge307XG4gICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICBjb25zdCBiMDogYW55ID0gYmluLnJlYWQoKTtcbiAgICAgICAgaWYgKGIwID09PSAtMSkge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGIxOiBhbnkgPSByZWFkKCk7XG4gICAgICAgIGNvbnN0IGIyOiBhbnkgPSByZWFkKCk7XG4gICAgICAgIGNvbnN0IGIzOiBhbnkgPSByZWFkKCk7XG4gICAgICAgIGNvbnN0IGs6IGFueSA9IFN0cmluZy5mcm9tQ2hhckNvZGUoKGIwIDw8IDgpIHwgYjEpO1xuICAgICAgICBjb25zdCB2OiBhbnkgPSAoYjIgPDwgOCkgfCBiMztcbiAgICAgICAgcmVzdWx0W2tdID0gdjtcbiAgICAgICAgY291bnQgKz0gMTtcbiAgICAgIH1cbiAgICAgIGlmIChjb3VudCAhPT0gbnVtQ2hhcnMpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGNvdW50ICsgXCIgIT09XCIgKyBudW1DaGFycyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSkoKTtcblxuICAgIGNvbnN0IHVua25vd25DaGFyOiBhbnkgPSBcIj9cIi5jaGFyQ29kZUF0KDApO1xuXG4gICAgcmV0dXJuIChzOiBhbnkpID0+IHtcbiAgICAgIGNvbnN0IGJ5dGVzOiBhbnkgPSBbXTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBjb25zdCBjOiBhbnkgPSBzLmNoYXJDb2RlQXQoaSk7XG4gICAgICAgIGlmIChjIDwgMTI4KSB7XG4gICAgICAgICAgYnl0ZXMucHVzaChjKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdCBiOiBhbnkgPSB1bmljb2RlTWFwW3MuY2hhckF0KGkpXTtcbiAgICAgICAgICBpZiAodHlwZW9mIGIgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICAgIGlmICgoYiAmIDB4ZmYpID09PSBiKSB7XG4gICAgICAgICAgICAgIC8vIDFieXRlXG4gICAgICAgICAgICAgIGJ5dGVzLnB1c2goYik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAvLyAyYnl0ZXNcbiAgICAgICAgICAgICAgYnl0ZXMucHVzaChiID4+PiA4KTtcbiAgICAgICAgICAgICAgYnl0ZXMucHVzaChiICYgMHhmZik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGJ5dGVzLnB1c2godW5rbm93bkNoYXIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGJ5dGVzO1xuICAgIH07XG4gIH07XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIFFSTW9kZVxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICBjb25zdCBRUk1vZGU6IGFueSA9IHtcbiAgICBNT0RFX05VTUJFUjogMSA8PCAwLFxuICAgIE1PREVfQUxQSEFfTlVNOiAxIDw8IDEsXG4gICAgTU9ERV84QklUX0JZVEU6IDEgPDwgMixcbiAgICBNT0RFX0tBTkpJOiAxIDw8IDMsXG4gIH07XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIFFSRXJyb3JDb3JyZWN0aW9uTGV2ZWxcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgY29uc3QgUVJFcnJvckNvcnJlY3Rpb25MZXZlbDogYW55ID0ge1xuICAgIEw6IDEsXG4gICAgTTogMCxcbiAgICBROiAzLFxuICAgIEg6IDIsXG4gIH07XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIFFSTWFza1BhdHRlcm5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgY29uc3QgUVJNYXNrUGF0dGVybjogYW55ID0ge1xuICAgIFBBVFRFUk4wMDA6IDAsXG4gICAgUEFUVEVSTjAwMTogMSxcbiAgICBQQVRURVJOMDEwOiAyLFxuICAgIFBBVFRFUk4wMTE6IDMsXG4gICAgUEFUVEVSTjEwMDogNCxcbiAgICBQQVRURVJOMTAxOiA1LFxuICAgIFBBVFRFUk4xMTA6IDYsXG4gICAgUEFUVEVSTjExMTogNyxcbiAgfTtcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gUVJVdGlsXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIGNvbnN0IFFSVXRpbDogYW55ID0gKCgpID0+IHtcbiAgICBjb25zdCBQQVRURVJOX1BPU0lUSU9OX1RBQkxFOiBhbnkgPSBbXG4gICAgICBbXSxcbiAgICAgIFs2LCAxOF0sXG4gICAgICBbNiwgMjJdLFxuICAgICAgWzYsIDI2XSxcbiAgICAgIFs2LCAzMF0sXG4gICAgICBbNiwgMzRdLFxuICAgICAgWzYsIDIyLCAzOF0sXG4gICAgICBbNiwgMjQsIDQyXSxcbiAgICAgIFs2LCAyNiwgNDZdLFxuICAgICAgWzYsIDI4LCA1MF0sXG4gICAgICBbNiwgMzAsIDU0XSxcbiAgICAgIFs2LCAzMiwgNThdLFxuICAgICAgWzYsIDM0LCA2Ml0sXG4gICAgICBbNiwgMjYsIDQ2LCA2Nl0sXG4gICAgICBbNiwgMjYsIDQ4LCA3MF0sXG4gICAgICBbNiwgMjYsIDUwLCA3NF0sXG4gICAgICBbNiwgMzAsIDU0LCA3OF0sXG4gICAgICBbNiwgMzAsIDU2LCA4Ml0sXG4gICAgICBbNiwgMzAsIDU4LCA4Nl0sXG4gICAgICBbNiwgMzQsIDYyLCA5MF0sXG4gICAgICBbNiwgMjgsIDUwLCA3MiwgOTRdLFxuICAgICAgWzYsIDI2LCA1MCwgNzQsIDk4XSxcbiAgICAgIFs2LCAzMCwgNTQsIDc4LCAxMDJdLFxuICAgICAgWzYsIDI4LCA1NCwgODAsIDEwNl0sXG4gICAgICBbNiwgMzIsIDU4LCA4NCwgMTEwXSxcbiAgICAgIFs2LCAzMCwgNTgsIDg2LCAxMTRdLFxuICAgICAgWzYsIDM0LCA2MiwgOTAsIDExOF0sXG4gICAgICBbNiwgMjYsIDUwLCA3NCwgOTgsIDEyMl0sXG4gICAgICBbNiwgMzAsIDU0LCA3OCwgMTAyLCAxMjZdLFxuICAgICAgWzYsIDI2LCA1MiwgNzgsIDEwNCwgMTMwXSxcbiAgICAgIFs2LCAzMCwgNTYsIDgyLCAxMDgsIDEzNF0sXG4gICAgICBbNiwgMzQsIDYwLCA4NiwgMTEyLCAxMzhdLFxuICAgICAgWzYsIDMwLCA1OCwgODYsIDExNCwgMTQyXSxcbiAgICAgIFs2LCAzNCwgNjIsIDkwLCAxMTgsIDE0Nl0sXG4gICAgICBbNiwgMzAsIDU0LCA3OCwgMTAyLCAxMjYsIDE1MF0sXG4gICAgICBbNiwgMjQsIDUwLCA3NiwgMTAyLCAxMjgsIDE1NF0sXG4gICAgICBbNiwgMjgsIDU0LCA4MCwgMTA2LCAxMzIsIDE1OF0sXG4gICAgICBbNiwgMzIsIDU4LCA4NCwgMTEwLCAxMzYsIDE2Ml0sXG4gICAgICBbNiwgMjYsIDU0LCA4MiwgMTEwLCAxMzgsIDE2Nl0sXG4gICAgICBbNiwgMzAsIDU4LCA4NiwgMTE0LCAxNDIsIDE3MF0sXG4gICAgXTtcbiAgICBjb25zdCBHMTU6IGFueSA9XG4gICAgICAoMSA8PCAxMCkgfFxuICAgICAgKDEgPDwgOCkgfFxuICAgICAgKDEgPDwgNSkgfFxuICAgICAgKDEgPDwgNCkgfFxuICAgICAgKDEgPDwgMikgfFxuICAgICAgKDEgPDwgMSkgfFxuICAgICAgKDEgPDwgMCk7XG4gICAgY29uc3QgRzE4OiBhbnkgPVxuICAgICAgKDEgPDwgMTIpIHxcbiAgICAgICgxIDw8IDExKSB8XG4gICAgICAoMSA8PCAxMCkgfFxuICAgICAgKDEgPDwgOSkgfFxuICAgICAgKDEgPDwgOCkgfFxuICAgICAgKDEgPDwgNSkgfFxuICAgICAgKDEgPDwgMikgfFxuICAgICAgKDEgPDwgMCk7XG4gICAgY29uc3QgRzE1X01BU0s6IGFueSA9ICgxIDw8IDE0KSB8ICgxIDw8IDEyKSB8ICgxIDw8IDEwKSB8ICgxIDw8IDQpIHwgKDEgPDwgMSk7XG5cbiAgICBjb25zdCBfdGhpczogYW55ID0ge307XG5cbiAgICBjb25zdCBnZXRCQ0hEaWdpdDogYW55ID0gKGRhdGE6IGFueSkgPT4ge1xuICAgICAgbGV0IGRpZ2l0OiBhbnkgPSAwO1xuICAgICAgd2hpbGUgKGRhdGEgIT09IDApIHtcbiAgICAgICAgZGlnaXQgKz0gMTtcbiAgICAgICAgZGF0YSA+Pj49IDE7XG4gICAgICB9XG4gICAgICByZXR1cm4gZGlnaXQ7XG4gICAgfTtcblxuICAgIF90aGlzLmdldEJDSFR5cGVJbmZvID0gKGRhdGE6IGFueSkgPT4ge1xuICAgICAgbGV0IGQ6IGFueSA9IGRhdGEgPDwgMTA7XG4gICAgICB3aGlsZSAoZ2V0QkNIRGlnaXQoZCkgLSBnZXRCQ0hEaWdpdChHMTUpID49IDApIHtcbiAgICAgICAgZCBePSBHMTUgPDwgKGdldEJDSERpZ2l0KGQpIC0gZ2V0QkNIRGlnaXQoRzE1KSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gKChkYXRhIDw8IDEwKSB8IGQpIF4gRzE1X01BU0s7XG4gICAgfTtcblxuICAgIF90aGlzLmdldEJDSFR5cGVOdW1iZXIgPSAoZGF0YTogYW55KSA9PiB7XG4gICAgICBsZXQgZDogYW55ID0gZGF0YSA8PCAxMjtcbiAgICAgIHdoaWxlIChnZXRCQ0hEaWdpdChkKSAtIGdldEJDSERpZ2l0KEcxOCkgPj0gMCkge1xuICAgICAgICBkIF49IEcxOCA8PCAoZ2V0QkNIRGlnaXQoZCkgLSBnZXRCQ0hEaWdpdChHMTgpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiAoZGF0YSA8PCAxMikgfCBkO1xuICAgIH07XG5cbiAgICBfdGhpcy5nZXRQYXR0ZXJuUG9zaXRpb24gPSAodHlwZU51bWJlcjogbnVtYmVyKSA9PiB7XG4gICAgICByZXR1cm4gUEFUVEVSTl9QT1NJVElPTl9UQUJMRVt0eXBlTnVtYmVyIC0gMV07XG4gICAgfTtcblxuICAgIF90aGlzLmdldE1hc2tGdW5jdGlvbiA9IChtYXNrUGF0dGVybjogYW55KSA9PiB7XG4gICAgICBzd2l0Y2ggKG1hc2tQYXR0ZXJuKSB7XG4gICAgICAgIGNhc2UgUVJNYXNrUGF0dGVybi5QQVRURVJOMDAwOlxuICAgICAgICAgIHJldHVybiAoaTogYW55LCBqOiBhbnkpID0+IHtcbiAgICAgICAgICAgIHJldHVybiAoaSArIGopICUgMiA9PT0gMDtcbiAgICAgICAgICB9O1xuICAgICAgICBjYXNlIFFSTWFza1BhdHRlcm4uUEFUVEVSTjAwMTpcbiAgICAgICAgICByZXR1cm4gKGk6IGFueSwgajogYW55KSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gaSAlIDIgPT09IDA7XG4gICAgICAgICAgfTtcbiAgICAgICAgY2FzZSBRUk1hc2tQYXR0ZXJuLlBBVFRFUk4wMTA6XG4gICAgICAgICAgcmV0dXJuIChpOiBhbnksIGo6IGFueSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGogJSAzID09PSAwO1xuICAgICAgICAgIH07XG4gICAgICAgIGNhc2UgUVJNYXNrUGF0dGVybi5QQVRURVJOMDExOlxuICAgICAgICAgIHJldHVybiAoaTogYW55LCBqOiBhbnkpID0+IHtcbiAgICAgICAgICAgIHJldHVybiAoaSArIGopICUgMyA9PT0gMDtcbiAgICAgICAgICB9O1xuICAgICAgICBjYXNlIFFSTWFza1BhdHRlcm4uUEFUVEVSTjEwMDpcbiAgICAgICAgICByZXR1cm4gKGk6IGFueSwgajogYW55KSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gKE1hdGguZmxvb3IoaSAvIDIpICsgTWF0aC5mbG9vcihqIC8gMykpICUgMiA9PT0gMDtcbiAgICAgICAgICB9O1xuICAgICAgICBjYXNlIFFSTWFza1BhdHRlcm4uUEFUVEVSTjEwMTpcbiAgICAgICAgICByZXR1cm4gKGk6IGFueSwgajogYW55KSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gKGkgKiBqKSAlIDIgKyAoaSAqIGopICUgMyA9PT0gMDtcbiAgICAgICAgICB9O1xuICAgICAgICBjYXNlIFFSTWFza1BhdHRlcm4uUEFUVEVSTjExMDpcbiAgICAgICAgICByZXR1cm4gKGk6IGFueSwgajogYW55KSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gKChpICogaikgJSAyICsgKGkgKiBqKSAlIDMpICUgMiA9PT0gMDtcbiAgICAgICAgICB9O1xuICAgICAgICBjYXNlIFFSTWFza1BhdHRlcm4uUEFUVEVSTjExMTpcbiAgICAgICAgICByZXR1cm4gKGk6IGFueSwgajogYW55KSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gKChpICogaikgJSAzICsgKGkgKyBqKSAlIDIpICUgMiA9PT0gMDtcbiAgICAgICAgICB9O1xuXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiYmFkIG1hc2tQYXR0ZXJuOlwiICsgbWFza1BhdHRlcm4pO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBfdGhpcy5nZXRFcnJvckNvcnJlY3RQb2x5bm9taWFsID0gKGVycm9yQ29ycmVjdExlbmd0aDogYW55KSA9PiB7XG4gICAgICBsZXQgYTogYW55ID0gcXJQb2x5bm9taWFsKFsxXSwgMCkgYXMgYW55O1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlcnJvckNvcnJlY3RMZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBhID0gYS5tdWx0aXBseShxclBvbHlub21pYWwoWzEsIFFSTWF0aC5nZXhwKGkpXSwgMCkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGE7XG4gICAgfTtcblxuICAgIF90aGlzLmdldExlbmd0aEluQml0cyA9IChtb2RlOiBhbnksIHR5cGU6IGFueSkgPT4ge1xuICAgICAgaWYgKDEgPD0gdHlwZSAmJiB0eXBlIDwgMTApIHtcbiAgICAgICAgLy8gMSAtIDlcblxuICAgICAgICBzd2l0Y2ggKG1vZGUpIHtcbiAgICAgICAgICBjYXNlIFFSTW9kZS5NT0RFX05VTUJFUjpcbiAgICAgICAgICAgIHJldHVybiAxMDtcbiAgICAgICAgICBjYXNlIFFSTW9kZS5NT0RFX0FMUEhBX05VTTpcbiAgICAgICAgICAgIHJldHVybiA5O1xuICAgICAgICAgIGNhc2UgUVJNb2RlLk1PREVfOEJJVF9CWVRFOlxuICAgICAgICAgICAgcmV0dXJuIDg7XG4gICAgICAgICAgY2FzZSBRUk1vZGUuTU9ERV9LQU5KSTpcbiAgICAgICAgICAgIHJldHVybiA4O1xuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJtb2RlOlwiICsgbW9kZSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAodHlwZSA8IDI3KSB7XG4gICAgICAgIC8vIDEwIC0gMjZcblxuICAgICAgICBzd2l0Y2ggKG1vZGUpIHtcbiAgICAgICAgICBjYXNlIFFSTW9kZS5NT0RFX05VTUJFUjpcbiAgICAgICAgICAgIHJldHVybiAxMjtcbiAgICAgICAgICBjYXNlIFFSTW9kZS5NT0RFX0FMUEhBX05VTTpcbiAgICAgICAgICAgIHJldHVybiAxMTtcbiAgICAgICAgICBjYXNlIFFSTW9kZS5NT0RFXzhCSVRfQllURTpcbiAgICAgICAgICAgIHJldHVybiAxNjtcbiAgICAgICAgICBjYXNlIFFSTW9kZS5NT0RFX0tBTkpJOlxuICAgICAgICAgICAgcmV0dXJuIDEwO1xuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJtb2RlOlwiICsgbW9kZSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAodHlwZSA8IDQxKSB7XG4gICAgICAgIC8vIDI3IC0gNDBcblxuICAgICAgICBzd2l0Y2ggKG1vZGUpIHtcbiAgICAgICAgICBjYXNlIFFSTW9kZS5NT0RFX05VTUJFUjpcbiAgICAgICAgICAgIHJldHVybiAxNDtcbiAgICAgICAgICBjYXNlIFFSTW9kZS5NT0RFX0FMUEhBX05VTTpcbiAgICAgICAgICAgIHJldHVybiAxMztcbiAgICAgICAgICBjYXNlIFFSTW9kZS5NT0RFXzhCSVRfQllURTpcbiAgICAgICAgICAgIHJldHVybiAxNjtcbiAgICAgICAgICBjYXNlIFFSTW9kZS5NT0RFX0tBTkpJOlxuICAgICAgICAgICAgcmV0dXJuIDEyO1xuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJtb2RlOlwiICsgbW9kZSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcInR5cGU6XCIgKyB0eXBlKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgX3RoaXMuZ2V0TG9zdFBvaW50ID0gKF9fcXJjb2RlOiBhbnkpID0+IHtcbiAgICAgIGNvbnN0IG1vZHVsZUNvdW50OiBhbnkgPSBfX3FyY29kZS5nZXRNb2R1bGVDb3VudCgpO1xuXG4gICAgICBsZXQgbG9zdFBvaW50OiBhbnkgPSAwO1xuXG4gICAgICAvLyBMRVZFTDFcblxuICAgICAgZm9yIChsZXQgcm93ID0gMDsgcm93IDwgbW9kdWxlQ291bnQ7IHJvdyArPSAxKSB7XG4gICAgICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IG1vZHVsZUNvdW50OyBjb2wgKz0gMSkge1xuICAgICAgICAgIGxldCBzYW1lQ291bnQ6IGFueSA9IDA7XG4gICAgICAgICAgY29uc3QgZGFyazogYW55ID0gX19xcmNvZGUuaXNEYXJrKHJvdywgY29sKTtcblxuICAgICAgICAgIGZvciAobGV0IHIgPSAtMTsgciA8PSAxOyByICs9IDEpIHtcbiAgICAgICAgICAgIGlmIChyb3cgKyByIDwgMCB8fCBtb2R1bGVDb3VudCA8PSByb3cgKyByKSB7XG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IgKGxldCBjID0gLTE7IGMgPD0gMTsgYyArPSAxKSB7XG4gICAgICAgICAgICAgIGlmIChjb2wgKyBjIDwgMCB8fCBtb2R1bGVDb3VudCA8PSBjb2wgKyBjKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBpZiAociA9PT0gMCAmJiBjID09PSAwKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBpZiAoZGFyayA9PT0gX19xcmNvZGUuaXNEYXJrKHJvdyArIHIsIGNvbCArIGMpKSB7XG4gICAgICAgICAgICAgICAgc2FtZUNvdW50ICs9IDE7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoc2FtZUNvdW50ID4gNSkge1xuICAgICAgICAgICAgbG9zdFBvaW50ICs9IDMgKyBzYW1lQ291bnQgLSA1O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBMRVZFTDJcblxuICAgICAgZm9yIChsZXQgcm93ID0gMDsgcm93IDwgbW9kdWxlQ291bnQgLSAxOyByb3cgKz0gMSkge1xuICAgICAgICBmb3IgKGxldCBjb2wgPSAwOyBjb2wgPCBtb2R1bGVDb3VudCAtIDE7IGNvbCArPSAxKSB7XG4gICAgICAgICAgbGV0IGNvdW50OiBhbnkgPSAwO1xuICAgICAgICAgIGlmIChfX3FyY29kZS5pc0Rhcmsocm93LCBjb2wpKSB7XG4gICAgICAgICAgICBjb3VudCArPSAxO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoX19xcmNvZGUuaXNEYXJrKHJvdyArIDEsIGNvbCkpIHtcbiAgICAgICAgICAgIGNvdW50ICs9IDE7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChfX3FyY29kZS5pc0Rhcmsocm93LCBjb2wgKyAxKSkge1xuICAgICAgICAgICAgY291bnQgKz0gMTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKF9fcXJjb2RlLmlzRGFyayhyb3cgKyAxLCBjb2wgKyAxKSkge1xuICAgICAgICAgICAgY291bnQgKz0gMTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGNvdW50ID09PSAwIHx8IGNvdW50ID09PSA0KSB7XG4gICAgICAgICAgICBsb3N0UG9pbnQgKz0gMztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gTEVWRUwzXG5cbiAgICAgIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IG1vZHVsZUNvdW50OyByb3cgKz0gMSkge1xuICAgICAgICBmb3IgKGxldCBjb2wgPSAwOyBjb2wgPCBtb2R1bGVDb3VudCAtIDY7IGNvbCArPSAxKSB7XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgX19xcmNvZGUuaXNEYXJrKHJvdywgY29sKSAmJlxuICAgICAgICAgICAgIV9fcXJjb2RlLmlzRGFyayhyb3csIGNvbCArIDEpICYmXG4gICAgICAgICAgICBfX3FyY29kZS5pc0Rhcmsocm93LCBjb2wgKyAyKSAmJlxuICAgICAgICAgICAgX19xcmNvZGUuaXNEYXJrKHJvdywgY29sICsgMykgJiZcbiAgICAgICAgICAgIF9fcXJjb2RlLmlzRGFyayhyb3csIGNvbCArIDQpICYmXG4gICAgICAgICAgICAhX19xcmNvZGUuaXNEYXJrKHJvdywgY29sICsgNSkgJiZcbiAgICAgICAgICAgIF9fcXJjb2RlLmlzRGFyayhyb3csIGNvbCArIDYpXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICBsb3N0UG9pbnQgKz0gNDA7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IG1vZHVsZUNvdW50OyBjb2wgKz0gMSkge1xuICAgICAgICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCBtb2R1bGVDb3VudCAtIDY7IHJvdyArPSAxKSB7XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgX19xcmNvZGUuaXNEYXJrKHJvdywgY29sKSAmJlxuICAgICAgICAgICAgIV9fcXJjb2RlLmlzRGFyayhyb3cgKyAxLCBjb2wpICYmXG4gICAgICAgICAgICBfX3FyY29kZS5pc0Rhcmsocm93ICsgMiwgY29sKSAmJlxuICAgICAgICAgICAgX19xcmNvZGUuaXNEYXJrKHJvdyArIDMsIGNvbCkgJiZcbiAgICAgICAgICAgIF9fcXJjb2RlLmlzRGFyayhyb3cgKyA0LCBjb2wpICYmXG4gICAgICAgICAgICAhX19xcmNvZGUuaXNEYXJrKHJvdyArIDUsIGNvbCkgJiZcbiAgICAgICAgICAgIF9fcXJjb2RlLmlzRGFyayhyb3cgKyA2LCBjb2wpXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICBsb3N0UG9pbnQgKz0gNDA7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIExFVkVMNFxuXG4gICAgICBsZXQgZGFya0NvdW50OiBhbnkgPSAwO1xuXG4gICAgICBmb3IgKGxldCBjb2wgPSAwOyBjb2wgPCBtb2R1bGVDb3VudDsgY29sICs9IDEpIHtcbiAgICAgICAgZm9yIChsZXQgcm93ID0gMDsgcm93IDwgbW9kdWxlQ291bnQ7IHJvdyArPSAxKSB7XG4gICAgICAgICAgaWYgKF9fcXJjb2RlLmlzRGFyayhyb3csIGNvbCkpIHtcbiAgICAgICAgICAgIGRhcmtDb3VudCArPSAxO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb25zdCByYXRpbzogYW55ID1cbiAgICAgICAgTWF0aC5hYnMoMTAwICogZGFya0NvdW50IC8gbW9kdWxlQ291bnQgLyBtb2R1bGVDb3VudCAtIDUwKSAvIDU7XG4gICAgICBsb3N0UG9pbnQgKz0gcmF0aW8gKiAxMDtcblxuICAgICAgcmV0dXJuIGxvc3RQb2ludDtcbiAgICB9O1xuXG4gICAgcmV0dXJuIF90aGlzO1xuICB9KSgpO1xuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBRUk1hdGhcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgY29uc3QgUVJNYXRoOiBhbnkgPSAoKCkgPT4ge1xuICAgIGNvbnN0IEVYUF9UQUJMRTogYW55ID0gbmV3IEFycmF5KDI1Nik7XG4gICAgY29uc3QgTE9HX1RBQkxFOiBhbnkgPSBuZXcgQXJyYXkoMjU2KTtcblxuICAgIC8vIGluaXRpYWxpemUgdGFibGVzXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCA4OyBpICs9IDEpIHtcbiAgICAgIEVYUF9UQUJMRVtpXSA9IDEgPDwgaTtcbiAgICB9XG4gICAgZm9yIChsZXQgaSA9IDg7IGkgPCAyNTY7IGkgKz0gMSkge1xuICAgICAgRVhQX1RBQkxFW2ldID1cbiAgICAgICAgRVhQX1RBQkxFW2kgLSA0XSBeXG4gICAgICAgIEVYUF9UQUJMRVtpIC0gNV0gXlxuICAgICAgICBFWFBfVEFCTEVbaSAtIDZdIF5cbiAgICAgICAgRVhQX1RBQkxFW2kgLSA4XTtcbiAgICB9XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAyNTU7IGkgKz0gMSkge1xuICAgICAgTE9HX1RBQkxFW0VYUF9UQUJMRVtpXV0gPSBpO1xuICAgIH1cblxuICAgIGNvbnN0IF90aGlzOiBhbnkgPSB7fTtcblxuICAgIF90aGlzLmdsb2cgPSAobjogYW55KSA9PiB7XG4gICAgICBpZiAobiA8IDEpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiZ2xvZyhcIiArIG4gKyBcIilcIik7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBMT0dfVEFCTEVbbl07XG4gICAgfTtcblxuICAgIF90aGlzLmdleHAgPSAobjogYW55KSA9PiB7XG4gICAgICB3aGlsZSAobiA8IDApIHtcbiAgICAgICAgbiArPSAyNTU7XG4gICAgICB9XG5cbiAgICAgIHdoaWxlIChuID49IDI1Nikge1xuICAgICAgICBuIC09IDI1NTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIEVYUF9UQUJMRVtuXTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIF90aGlzO1xuICB9KSgpO1xuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBxclBvbHlub21pYWxcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgZnVuY3Rpb24gcXJQb2x5bm9taWFsKG51bT86IGFueSwgc2hpZnQ/OiBhbnkpIHtcbiAgICBpZiAodHlwZW9mIG51bS5sZW5ndGggPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihudW0ubGVuZ3RoICsgXCIvXCIgKyBzaGlmdCk7XG4gICAgfVxuXG4gICAgY29uc3QgX251bTogYW55ID0gKCgpID0+IHtcbiAgICAgIGxldCBvZmZzZXQ6IGFueSA9IDA7XG4gICAgICB3aGlsZSAob2Zmc2V0IDwgbnVtLmxlbmd0aCAmJiBudW1bb2Zmc2V0XSA9PT0gMCkge1xuICAgICAgICBvZmZzZXQgKz0gMTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IF9fbnVtOiBhbnkgPSBuZXcgQXJyYXkobnVtLmxlbmd0aCAtIG9mZnNldCArIHNoaWZ0KTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtLmxlbmd0aCAtIG9mZnNldDsgaSArPSAxKSB7XG4gICAgICAgIF9fbnVtW2ldID0gbnVtW2kgKyBvZmZzZXRdO1xuICAgICAgfVxuICAgICAgcmV0dXJuIF9fbnVtO1xuICAgIH0pKCk7XG5cbiAgICBjb25zdCBfdGhpczogYW55ID0ge307XG5cbiAgICBfdGhpcy5nZXRBdCA9IChpbmRleDogYW55KSA9PiB7XG4gICAgICByZXR1cm4gX251bVtpbmRleF07XG4gICAgfTtcblxuICAgIF90aGlzLmdldExlbmd0aCA9ICgpID0+IHtcbiAgICAgIHJldHVybiBfbnVtLmxlbmd0aDtcbiAgICB9O1xuXG4gICAgX3RoaXMubXVsdGlwbHkgPSAoZTogYW55KSA9PiB7XG4gICAgICBjb25zdCBfX19udW06IGFueSA9IG5ldyBBcnJheShfdGhpcy5nZXRMZW5ndGgoKSArIGUuZ2V0TGVuZ3RoKCkgLSAxKTtcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBfdGhpcy5nZXRMZW5ndGgoKTsgaSArPSAxKSB7XG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgZS5nZXRMZW5ndGgoKTsgaiArPSAxKSB7XG4gICAgICAgICAgX19fbnVtW2kgKyBqXSBePSBRUk1hdGguZ2V4cChcbiAgICAgICAgICAgIFFSTWF0aC5nbG9nKF90aGlzLmdldEF0KGkpKSArIFFSTWF0aC5nbG9nKGUuZ2V0QXQoaikpLFxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHFyUG9seW5vbWlhbChfX19udW0sIDApO1xuICAgIH07XG5cbiAgICBfdGhpcy5tb2QgPSAoZTogYW55KSA9PiB7XG4gICAgICBpZiAoX3RoaXMuZ2V0TGVuZ3RoKCkgLSBlLmdldExlbmd0aCgpIDwgMCkge1xuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHJhdGlvOiBhbnkgPSBRUk1hdGguZ2xvZyhfdGhpcy5nZXRBdCgwKSkgLSBRUk1hdGguZ2xvZyhlLmdldEF0KDApKTtcblxuICAgICAgY29uc3QgX19udW06IGFueSA9IG5ldyBBcnJheShfdGhpcy5nZXRMZW5ndGgoKSk7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IF90aGlzLmdldExlbmd0aCgpOyBpICs9IDEpIHtcbiAgICAgICAgX19udW1baV0gPSBfdGhpcy5nZXRBdChpKTtcbiAgICAgIH1cblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlLmdldExlbmd0aCgpOyBpICs9IDEpIHtcbiAgICAgICAgX19udW1baV0gXj0gUVJNYXRoLmdleHAoUVJNYXRoLmdsb2coZS5nZXRBdChpKSkgKyByYXRpbyk7XG4gICAgICB9XG5cbiAgICAgIC8vIHJlY3Vyc2l2ZSBjYWxsXG4gICAgICByZXR1cm4gcXJQb2x5bm9taWFsKF9fbnVtLCAwKS5tb2QoZSk7XG4gICAgfTtcblxuICAgIHJldHVybiBfdGhpcztcbiAgfVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFFSUlNCbG9ja1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgY29uc3QgUVJSU0Jsb2NrOiBhbnkgPSAoKCkgPT4ge1xuICAgIGNvbnN0IFJTX0JMT0NLX1RBQkxFOiBhbnkgPSBbXG4gICAgICAvLyBMXG4gICAgICAvLyBNXG4gICAgICAvLyBRXG4gICAgICAvLyBIXG5cbiAgICAgIC8vIDFcbiAgICAgIFsxLCAyNiwgMTldLFxuICAgICAgWzEsIDI2LCAxNl0sXG4gICAgICBbMSwgMjYsIDEzXSxcbiAgICAgIFsxLCAyNiwgOV0sXG5cbiAgICAgIC8vIDJcbiAgICAgIFsxLCA0NCwgMzRdLFxuICAgICAgWzEsIDQ0LCAyOF0sXG4gICAgICBbMSwgNDQsIDIyXSxcbiAgICAgIFsxLCA0NCwgMTZdLFxuXG4gICAgICAvLyAzXG4gICAgICBbMSwgNzAsIDU1XSxcbiAgICAgIFsxLCA3MCwgNDRdLFxuICAgICAgWzIsIDM1LCAxN10sXG4gICAgICBbMiwgMzUsIDEzXSxcblxuICAgICAgLy8gNFxuICAgICAgWzEsIDEwMCwgODBdLFxuICAgICAgWzIsIDUwLCAzMl0sXG4gICAgICBbMiwgNTAsIDI0XSxcbiAgICAgIFs0LCAyNSwgOV0sXG5cbiAgICAgIC8vIDVcbiAgICAgIFsxLCAxMzQsIDEwOF0sXG4gICAgICBbMiwgNjcsIDQzXSxcbiAgICAgIFsyLCAzMywgMTUsIDIsIDM0LCAxNl0sXG4gICAgICBbMiwgMzMsIDExLCAyLCAzNCwgMTJdLFxuXG4gICAgICAvLyA2XG4gICAgICBbMiwgODYsIDY4XSxcbiAgICAgIFs0LCA0MywgMjddLFxuICAgICAgWzQsIDQzLCAxOV0sXG4gICAgICBbNCwgNDMsIDE1XSxcblxuICAgICAgLy8gN1xuICAgICAgWzIsIDk4LCA3OF0sXG4gICAgICBbNCwgNDksIDMxXSxcbiAgICAgIFsyLCAzMiwgMTQsIDQsIDMzLCAxNV0sXG4gICAgICBbNCwgMzksIDEzLCAxLCA0MCwgMTRdLFxuXG4gICAgICAvLyA4XG4gICAgICBbMiwgMTIxLCA5N10sXG4gICAgICBbMiwgNjAsIDM4LCAyLCA2MSwgMzldLFxuICAgICAgWzQsIDQwLCAxOCwgMiwgNDEsIDE5XSxcbiAgICAgIFs0LCA0MCwgMTQsIDIsIDQxLCAxNV0sXG5cbiAgICAgIC8vIDlcbiAgICAgIFsyLCAxNDYsIDExNl0sXG4gICAgICBbMywgNTgsIDM2LCAyLCA1OSwgMzddLFxuICAgICAgWzQsIDM2LCAxNiwgNCwgMzcsIDE3XSxcbiAgICAgIFs0LCAzNiwgMTIsIDQsIDM3LCAxM10sXG5cbiAgICAgIC8vIDEwXG4gICAgICBbMiwgODYsIDY4LCAyLCA4NywgNjldLFxuICAgICAgWzQsIDY5LCA0MywgMSwgNzAsIDQ0XSxcbiAgICAgIFs2LCA0MywgMTksIDIsIDQ0LCAyMF0sXG4gICAgICBbNiwgNDMsIDE1LCAyLCA0NCwgMTZdLFxuXG4gICAgICAvLyAxMVxuICAgICAgWzQsIDEwMSwgODFdLFxuICAgICAgWzEsIDgwLCA1MCwgNCwgODEsIDUxXSxcbiAgICAgIFs0LCA1MCwgMjIsIDQsIDUxLCAyM10sXG4gICAgICBbMywgMzYsIDEyLCA4LCAzNywgMTNdLFxuXG4gICAgICAvLyAxMlxuICAgICAgWzIsIDExNiwgOTIsIDIsIDExNywgOTNdLFxuICAgICAgWzYsIDU4LCAzNiwgMiwgNTksIDM3XSxcbiAgICAgIFs0LCA0NiwgMjAsIDYsIDQ3LCAyMV0sXG4gICAgICBbNywgNDIsIDE0LCA0LCA0MywgMTVdLFxuXG4gICAgICAvLyAxM1xuICAgICAgWzQsIDEzMywgMTA3XSxcbiAgICAgIFs4LCA1OSwgMzcsIDEsIDYwLCAzOF0sXG4gICAgICBbOCwgNDQsIDIwLCA0LCA0NSwgMjFdLFxuICAgICAgWzEyLCAzMywgMTEsIDQsIDM0LCAxMl0sXG5cbiAgICAgIC8vIDE0XG4gICAgICBbMywgMTQ1LCAxMTUsIDEsIDE0NiwgMTE2XSxcbiAgICAgIFs0LCA2NCwgNDAsIDUsIDY1LCA0MV0sXG4gICAgICBbMTEsIDM2LCAxNiwgNSwgMzcsIDE3XSxcbiAgICAgIFsxMSwgMzYsIDEyLCA1LCAzNywgMTNdLFxuXG4gICAgICAvLyAxNVxuICAgICAgWzUsIDEwOSwgODcsIDEsIDExMCwgODhdLFxuICAgICAgWzUsIDY1LCA0MSwgNSwgNjYsIDQyXSxcbiAgICAgIFs1LCA1NCwgMjQsIDcsIDU1LCAyNV0sXG4gICAgICBbMTEsIDM2LCAxMiwgNywgMzcsIDEzXSxcblxuICAgICAgLy8gMTZcbiAgICAgIFs1LCAxMjIsIDk4LCAxLCAxMjMsIDk5XSxcbiAgICAgIFs3LCA3MywgNDUsIDMsIDc0LCA0Nl0sXG4gICAgICBbMTUsIDQzLCAxOSwgMiwgNDQsIDIwXSxcbiAgICAgIFszLCA0NSwgMTUsIDEzLCA0NiwgMTZdLFxuXG4gICAgICAvLyAxN1xuICAgICAgWzEsIDEzNSwgMTA3LCA1LCAxMzYsIDEwOF0sXG4gICAgICBbMTAsIDc0LCA0NiwgMSwgNzUsIDQ3XSxcbiAgICAgIFsxLCA1MCwgMjIsIDE1LCA1MSwgMjNdLFxuICAgICAgWzIsIDQyLCAxNCwgMTcsIDQzLCAxNV0sXG5cbiAgICAgIC8vIDE4XG4gICAgICBbNSwgMTUwLCAxMjAsIDEsIDE1MSwgMTIxXSxcbiAgICAgIFs5LCA2OSwgNDMsIDQsIDcwLCA0NF0sXG4gICAgICBbMTcsIDUwLCAyMiwgMSwgNTEsIDIzXSxcbiAgICAgIFsyLCA0MiwgMTQsIDE5LCA0MywgMTVdLFxuXG4gICAgICAvLyAxOVxuICAgICAgWzMsIDE0MSwgMTEzLCA0LCAxNDIsIDExNF0sXG4gICAgICBbMywgNzAsIDQ0LCAxMSwgNzEsIDQ1XSxcbiAgICAgIFsxNywgNDcsIDIxLCA0LCA0OCwgMjJdLFxuICAgICAgWzksIDM5LCAxMywgMTYsIDQwLCAxNF0sXG5cbiAgICAgIC8vIDIwXG4gICAgICBbMywgMTM1LCAxMDcsIDUsIDEzNiwgMTA4XSxcbiAgICAgIFszLCA2NywgNDEsIDEzLCA2OCwgNDJdLFxuICAgICAgWzE1LCA1NCwgMjQsIDUsIDU1LCAyNV0sXG4gICAgICBbMTUsIDQzLCAxNSwgMTAsIDQ0LCAxNl0sXG5cbiAgICAgIC8vIDIxXG4gICAgICBbNCwgMTQ0LCAxMTYsIDQsIDE0NSwgMTE3XSxcbiAgICAgIFsxNywgNjgsIDQyXSxcbiAgICAgIFsxNywgNTAsIDIyLCA2LCA1MSwgMjNdLFxuICAgICAgWzE5LCA0NiwgMTYsIDYsIDQ3LCAxN10sXG5cbiAgICAgIC8vIDIyXG4gICAgICBbMiwgMTM5LCAxMTEsIDcsIDE0MCwgMTEyXSxcbiAgICAgIFsxNywgNzQsIDQ2XSxcbiAgICAgIFs3LCA1NCwgMjQsIDE2LCA1NSwgMjVdLFxuICAgICAgWzM0LCAzNywgMTNdLFxuXG4gICAgICAvLyAyM1xuICAgICAgWzQsIDE1MSwgMTIxLCA1LCAxNTIsIDEyMl0sXG4gICAgICBbNCwgNzUsIDQ3LCAxNCwgNzYsIDQ4XSxcbiAgICAgIFsxMSwgNTQsIDI0LCAxNCwgNTUsIDI1XSxcbiAgICAgIFsxNiwgNDUsIDE1LCAxNCwgNDYsIDE2XSxcblxuICAgICAgLy8gMjRcbiAgICAgIFs2LCAxNDcsIDExNywgNCwgMTQ4LCAxMThdLFxuICAgICAgWzYsIDczLCA0NSwgMTQsIDc0LCA0Nl0sXG4gICAgICBbMTEsIDU0LCAyNCwgMTYsIDU1LCAyNV0sXG4gICAgICBbMzAsIDQ2LCAxNiwgMiwgNDcsIDE3XSxcblxuICAgICAgLy8gMjVcbiAgICAgIFs4LCAxMzIsIDEwNiwgNCwgMTMzLCAxMDddLFxuICAgICAgWzgsIDc1LCA0NywgMTMsIDc2LCA0OF0sXG4gICAgICBbNywgNTQsIDI0LCAyMiwgNTUsIDI1XSxcbiAgICAgIFsyMiwgNDUsIDE1LCAxMywgNDYsIDE2XSxcblxuICAgICAgLy8gMjZcbiAgICAgIFsxMCwgMTQyLCAxMTQsIDIsIDE0MywgMTE1XSxcbiAgICAgIFsxOSwgNzQsIDQ2LCA0LCA3NSwgNDddLFxuICAgICAgWzI4LCA1MCwgMjIsIDYsIDUxLCAyM10sXG4gICAgICBbMzMsIDQ2LCAxNiwgNCwgNDcsIDE3XSxcblxuICAgICAgLy8gMjdcbiAgICAgIFs4LCAxNTIsIDEyMiwgNCwgMTUzLCAxMjNdLFxuICAgICAgWzIyLCA3MywgNDUsIDMsIDc0LCA0Nl0sXG4gICAgICBbOCwgNTMsIDIzLCAyNiwgNTQsIDI0XSxcbiAgICAgIFsxMiwgNDUsIDE1LCAyOCwgNDYsIDE2XSxcblxuICAgICAgLy8gMjhcbiAgICAgIFszLCAxNDcsIDExNywgMTAsIDE0OCwgMTE4XSxcbiAgICAgIFszLCA3MywgNDUsIDIzLCA3NCwgNDZdLFxuICAgICAgWzQsIDU0LCAyNCwgMzEsIDU1LCAyNV0sXG4gICAgICBbMTEsIDQ1LCAxNSwgMzEsIDQ2LCAxNl0sXG5cbiAgICAgIC8vIDI5XG4gICAgICBbNywgMTQ2LCAxMTYsIDcsIDE0NywgMTE3XSxcbiAgICAgIFsyMSwgNzMsIDQ1LCA3LCA3NCwgNDZdLFxuICAgICAgWzEsIDUzLCAyMywgMzcsIDU0LCAyNF0sXG4gICAgICBbMTksIDQ1LCAxNSwgMjYsIDQ2LCAxNl0sXG5cbiAgICAgIC8vIDMwXG4gICAgICBbNSwgMTQ1LCAxMTUsIDEwLCAxNDYsIDExNl0sXG4gICAgICBbMTksIDc1LCA0NywgMTAsIDc2LCA0OF0sXG4gICAgICBbMTUsIDU0LCAyNCwgMjUsIDU1LCAyNV0sXG4gICAgICBbMjMsIDQ1LCAxNSwgMjUsIDQ2LCAxNl0sXG5cbiAgICAgIC8vIDMxXG4gICAgICBbMTMsIDE0NSwgMTE1LCAzLCAxNDYsIDExNl0sXG4gICAgICBbMiwgNzQsIDQ2LCAyOSwgNzUsIDQ3XSxcbiAgICAgIFs0MiwgNTQsIDI0LCAxLCA1NSwgMjVdLFxuICAgICAgWzIzLCA0NSwgMTUsIDI4LCA0NiwgMTZdLFxuXG4gICAgICAvLyAzMlxuICAgICAgWzE3LCAxNDUsIDExNV0sXG4gICAgICBbMTAsIDc0LCA0NiwgMjMsIDc1LCA0N10sXG4gICAgICBbMTAsIDU0LCAyNCwgMzUsIDU1LCAyNV0sXG4gICAgICBbMTksIDQ1LCAxNSwgMzUsIDQ2LCAxNl0sXG5cbiAgICAgIC8vIDMzXG4gICAgICBbMTcsIDE0NSwgMTE1LCAxLCAxNDYsIDExNl0sXG4gICAgICBbMTQsIDc0LCA0NiwgMjEsIDc1LCA0N10sXG4gICAgICBbMjksIDU0LCAyNCwgMTksIDU1LCAyNV0sXG4gICAgICBbMTEsIDQ1LCAxNSwgNDYsIDQ2LCAxNl0sXG5cbiAgICAgIC8vIDM0XG4gICAgICBbMTMsIDE0NSwgMTE1LCA2LCAxNDYsIDExNl0sXG4gICAgICBbMTQsIDc0LCA0NiwgMjMsIDc1LCA0N10sXG4gICAgICBbNDQsIDU0LCAyNCwgNywgNTUsIDI1XSxcbiAgICAgIFs1OSwgNDYsIDE2LCAxLCA0NywgMTddLFxuXG4gICAgICAvLyAzNVxuICAgICAgWzEyLCAxNTEsIDEyMSwgNywgMTUyLCAxMjJdLFxuICAgICAgWzEyLCA3NSwgNDcsIDI2LCA3NiwgNDhdLFxuICAgICAgWzM5LCA1NCwgMjQsIDE0LCA1NSwgMjVdLFxuICAgICAgWzIyLCA0NSwgMTUsIDQxLCA0NiwgMTZdLFxuXG4gICAgICAvLyAzNlxuICAgICAgWzYsIDE1MSwgMTIxLCAxNCwgMTUyLCAxMjJdLFxuICAgICAgWzYsIDc1LCA0NywgMzQsIDc2LCA0OF0sXG4gICAgICBbNDYsIDU0LCAyNCwgMTAsIDU1LCAyNV0sXG4gICAgICBbMiwgNDUsIDE1LCA2NCwgNDYsIDE2XSxcblxuICAgICAgLy8gMzdcbiAgICAgIFsxNywgMTUyLCAxMjIsIDQsIDE1MywgMTIzXSxcbiAgICAgIFsyOSwgNzQsIDQ2LCAxNCwgNzUsIDQ3XSxcbiAgICAgIFs0OSwgNTQsIDI0LCAxMCwgNTUsIDI1XSxcbiAgICAgIFsyNCwgNDUsIDE1LCA0NiwgNDYsIDE2XSxcblxuICAgICAgLy8gMzhcbiAgICAgIFs0LCAxNTIsIDEyMiwgMTgsIDE1MywgMTIzXSxcbiAgICAgIFsxMywgNzQsIDQ2LCAzMiwgNzUsIDQ3XSxcbiAgICAgIFs0OCwgNTQsIDI0LCAxNCwgNTUsIDI1XSxcbiAgICAgIFs0MiwgNDUsIDE1LCAzMiwgNDYsIDE2XSxcblxuICAgICAgLy8gMzlcbiAgICAgIFsyMCwgMTQ3LCAxMTcsIDQsIDE0OCwgMTE4XSxcbiAgICAgIFs0MCwgNzUsIDQ3LCA3LCA3NiwgNDhdLFxuICAgICAgWzQzLCA1NCwgMjQsIDIyLCA1NSwgMjVdLFxuICAgICAgWzEwLCA0NSwgMTUsIDY3LCA0NiwgMTZdLFxuXG4gICAgICAvLyA0MFxuICAgICAgWzE5LCAxNDgsIDExOCwgNiwgMTQ5LCAxMTldLFxuICAgICAgWzE4LCA3NSwgNDcsIDMxLCA3NiwgNDhdLFxuICAgICAgWzM0LCA1NCwgMjQsIDM0LCA1NSwgMjVdLFxuICAgICAgWzIwLCA0NSwgMTUsIDYxLCA0NiwgMTZdLFxuICAgIF07XG5cbiAgICBjb25zdCBxclJTQmxvY2s6IGFueSA9ICh0b3RhbENvdW50OiBhbnksIGRhdGFDb3VudDogYW55KSA9PiB7XG4gICAgICBjb25zdCByZXN1bHQ6IGFueSA9IHt9O1xuICAgICAgcmVzdWx0LnRvdGFsQ291bnQgPSB0b3RhbENvdW50O1xuICAgICAgcmVzdWx0LmRhdGFDb3VudCA9IGRhdGFDb3VudDtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcblxuICAgIGNvbnN0IF90aGlzOiBhbnkgPSB7fTtcblxuICAgIGNvbnN0IGdldFJzQmxvY2tUYWJsZTogYW55ID0gKHR5cGVOdW1iZXI6IGFueSwgZXJyb3JDb3JyZWN0aW9uTGV2ZWw6IGFueSkgPT4ge1xuICAgICAgc3dpdGNoIChlcnJvckNvcnJlY3Rpb25MZXZlbCkge1xuICAgICAgICBjYXNlIFFSRXJyb3JDb3JyZWN0aW9uTGV2ZWwuTDpcbiAgICAgICAgICByZXR1cm4gUlNfQkxPQ0tfVEFCTEVbKHR5cGVOdW1iZXIgLSAxKSAqIDQgKyAwXTtcbiAgICAgICAgY2FzZSBRUkVycm9yQ29ycmVjdGlvbkxldmVsLk06XG4gICAgICAgICAgcmV0dXJuIFJTX0JMT0NLX1RBQkxFWyh0eXBlTnVtYmVyIC0gMSkgKiA0ICsgMV07XG4gICAgICAgIGNhc2UgUVJFcnJvckNvcnJlY3Rpb25MZXZlbC5ROlxuICAgICAgICAgIHJldHVybiBSU19CTE9DS19UQUJMRVsodHlwZU51bWJlciAtIDEpICogNCArIDJdO1xuICAgICAgICBjYXNlIFFSRXJyb3JDb3JyZWN0aW9uTGV2ZWwuSDpcbiAgICAgICAgICByZXR1cm4gUlNfQkxPQ0tfVEFCTEVbKHR5cGVOdW1iZXIgLSAxKSAqIDQgKyAzXTtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBfdGhpcy5nZXRSU0Jsb2NrcyA9ICh0eXBlTnVtYmVyOiBhbnksIGVycm9yQ29ycmVjdGlvbkxldmVsOiBhbnkpID0+IHtcbiAgICAgIGNvbnN0IHJzQmxvY2s6IGFueSA9IGdldFJzQmxvY2tUYWJsZSh0eXBlTnVtYmVyLCBlcnJvckNvcnJlY3Rpb25MZXZlbCk7XG5cbiAgICAgIGlmICh0eXBlb2YgcnNCbG9jayA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJiYWQgcnMgYmxvY2sgQCB0eXBlTnVtYmVyOlwiICtcbiAgICAgICAgICB0eXBlTnVtYmVyICtcbiAgICAgICAgICBcIi9lcnJvckNvcnJlY3Rpb25MZXZlbDpcIiArXG4gICAgICAgICAgZXJyb3JDb3JyZWN0aW9uTGV2ZWwpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBsZW5ndGg6IGFueSA9IHJzQmxvY2subGVuZ3RoIC8gMztcblxuICAgICAgY29uc3QgbGlzdDogYW55ID0gW107XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgY29uc3QgY291bnQ6IGFueSA9IHJzQmxvY2tbaSAqIDMgKyAwXTtcbiAgICAgICAgY29uc3QgdG90YWxDb3VudDogYW55ID0gcnNCbG9ja1tpICogMyArIDFdO1xuICAgICAgICBjb25zdCBkYXRhQ291bnQ6IGFueSA9IHJzQmxvY2tbaSAqIDMgKyAyXTtcblxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGNvdW50OyBqICs9IDEpIHtcbiAgICAgICAgICBsaXN0LnB1c2gocXJSU0Jsb2NrKHRvdGFsQ291bnQsIGRhdGFDb3VudCkpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBsaXN0O1xuICAgIH07XG5cbiAgICByZXR1cm4gX3RoaXM7XG4gIH0pKCk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gcXJCaXRCdWZmZXJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIGNvbnN0IHFyQml0QnVmZmVyOiBhbnkgPSAoKSA9PiB7XG4gICAgY29uc3QgX2J1ZmZlcjogYW55ID0gW107XG4gICAgbGV0IF9sZW5ndGg6IGFueSA9IDA7XG5cbiAgICBjb25zdCBfdGhpczogYW55ID0ge307XG5cbiAgICBfdGhpcy5nZXRCdWZmZXIgPSAoKSA9PiB7XG4gICAgICByZXR1cm4gX2J1ZmZlcjtcbiAgICB9O1xuXG4gICAgX3RoaXMuZ2V0QXQgPSAoaW5kZXg6IG51bWJlcikgPT4ge1xuICAgICAgY29uc3QgYnVmSW5kZXg6IGFueSA9IE1hdGguZmxvb3IoaW5kZXggLyA4KTtcbiAgICAgIHJldHVybiAoKF9idWZmZXJbYnVmSW5kZXhdID4+PiAoNyAtIGluZGV4ICUgOCkpICYgMSkgPT09IDE7XG4gICAgfTtcblxuICAgIF90aGlzLnB1dCA9IChudW06IG51bWJlciwgbGVuZ3RoOiBudW1iZXIpID0+IHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgX3RoaXMucHV0Qml0KCgobnVtID4+PiAobGVuZ3RoIC0gaSAtIDEpKSAmIDEpID09PSAxKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgX3RoaXMuZ2V0TGVuZ3RoSW5CaXRzID0gKCkgPT4ge1xuICAgICAgcmV0dXJuIF9sZW5ndGg7XG4gICAgfTtcblxuICAgIF90aGlzLnB1dEJpdCA9IChiaXQ6IGFueSkgPT4ge1xuICAgICAgY29uc3QgYnVmSW5kZXg6IGFueSA9IE1hdGguZmxvb3IoX2xlbmd0aCAvIDgpO1xuICAgICAgaWYgKF9idWZmZXIubGVuZ3RoIDw9IGJ1ZkluZGV4KSB7XG4gICAgICAgIF9idWZmZXIucHVzaCgwKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGJpdCkge1xuICAgICAgICBfYnVmZmVyW2J1ZkluZGV4XSB8PSAweDgwID4+PiAoX2xlbmd0aCAlIDgpO1xuICAgICAgfVxuXG4gICAgICBfbGVuZ3RoICs9IDE7XG4gICAgfTtcblxuICAgIHJldHVybiBfdGhpcztcbiAgfTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBxck51bWJlclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgY29uc3QgcXJOdW1iZXI6IGFueSA9IChfZGF0YTogYW55KSA9PiB7XG4gICAgICBjb25zdCBfbW9kZTogYW55ID0gUVJNb2RlLk1PREVfTlVNQkVSO1xuXG4gICAgICBjb25zdCBfdGhpczogYW55ID0ge307XG5cbiAgICAgIF90aGlzLmdldE1vZGUgPSAoKSA9PiB7XG4gICAgICAgIHJldHVybiBfbW9kZTtcbiAgICAgIH07XG5cbiAgICAgIF90aGlzLmdldExlbmd0aCA9IChidWZmZXI6IGFueSkgPT4ge1xuICAgICAgICByZXR1cm4gX2RhdGEubGVuZ3RoO1xuICAgICAgfVxuICAgICAgO1xuXG4gICAgICBfdGhpcy53cml0ZSA9IChidWZmZXI6IGFueSkgPT4ge1xuICAgICAgICBjb25zdCBkYXRhOiBhbnkgPSBfZGF0YTtcblxuICAgICAgICBsZXQgaTogYW55ID0gMDtcblxuICAgICAgICB3aGlsZSAoaSArIDIgPCBkYXRhLmxlbmd0aCkge1xuICAgICAgICAgIGJ1ZmZlci5wdXQoc3RyVG9OdW0oZGF0YS5zdWJzdHJpbmcoaSwgaSArIDMpKSwgMTApO1xuICAgICAgICAgIGkgKz0gMztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpIDwgZGF0YS5sZW5ndGgpIHtcbiAgICAgICAgICBpZiAoZGF0YS5sZW5ndGggLSBpID09PSAxKSB7XG4gICAgICAgICAgICBidWZmZXIucHV0KHN0clRvTnVtKGRhdGEuc3Vic3RyaW5nKGksIGkgKyAxKSksIDQpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoZGF0YS5sZW5ndGggLSBpID09PSAyKSB7XG4gICAgICAgICAgICBidWZmZXIucHV0KHN0clRvTnVtKGRhdGEuc3Vic3RyaW5nKGksIGkgKyAyKSksIDcpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgO1xuXG4gICAgICBjb25zdCBzdHJUb051bTogYW55ID0gKHM6IGFueSkgPT4ge1xuICAgICAgICAgIGxldCBudW06IGFueSA9IDA7XG4gICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICBudW0gPSBudW0gKiAxMCArIGNoYXRUb051bShzLmNoYXJBdChpKSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBudW07XG4gICAgICAgIH1cbiAgICAgIDtcblxuICAgICAgY29uc3QgY2hhdFRvTnVtOiBhbnkgPSAoYzogYW55KSA9PiB7XG4gICAgICAgICAgaWYgKFwiMFwiIDw9IGMgJiYgYyA8PSBcIjlcIikge1xuICAgICAgICAgICAgcmV0dXJuIGMuY2hhckNvZGVBdCgwKSAtIFwiMFwiLmNoYXJDb2RlQXQoMCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcImlsbGVnYWwgY2hhciA6XCIgKyBjKTtcbiAgICAgICAgfVxuICAgICAgO1xuXG4gICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuICA7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gcXJBbHBoYU51bVxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgY29uc3QgcXJBbHBoYU51bTogYW55ID0gKGRhdGE6IGFueSkgPT4ge1xuICAgICAgY29uc3QgX21vZGU6IGFueSA9IFFSTW9kZS5NT0RFX0FMUEhBX05VTTtcbiAgICAgIGNvbnN0IF9kYXRhOiBhbnkgPSBkYXRhO1xuXG4gICAgICBjb25zdCBfdGhpczogYW55ID0ge307XG5cbiAgICAgIF90aGlzLmdldE1vZGUgPSAoKSA9PiB7XG4gICAgICAgIHJldHVybiBfbW9kZTtcbiAgICAgIH07XG5cbiAgICAgIF90aGlzLmdldExlbmd0aCA9IChidWZmZXI6IGFueSkgPT4ge1xuICAgICAgICByZXR1cm4gX2RhdGEubGVuZ3RoO1xuICAgICAgfVxuICAgICAgO1xuXG4gICAgICBfdGhpcy53cml0ZSA9IChidWZmZXI6IGFueSkgPT4ge1xuICAgICAgICBjb25zdCBzOiBhbnkgPSBfZGF0YTtcblxuICAgICAgICBsZXQgaTogYW55ID0gMDtcblxuICAgICAgICB3aGlsZSAoaSArIDEgPCBzLmxlbmd0aCkge1xuICAgICAgICAgIGJ1ZmZlci5wdXQoZ2V0Q29kZShzLmNoYXJBdChpKSkgKiA0NSArIGdldENvZGUocy5jaGFyQXQoaSArIDEpKSwgMTEpO1xuICAgICAgICAgIGkgKz0gMjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpIDwgcy5sZW5ndGgpIHtcbiAgICAgICAgICBidWZmZXIucHV0KGdldENvZGUocy5jaGFyQXQoaSkpLCA2KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgO1xuXG4gICAgICBjb25zdCBnZXRDb2RlOiBhbnkgPSAoYzogYW55KSA9PiB7XG4gICAgICAgIGlmIChcIjBcIiA8PSBjICYmIGMgPD0gXCI5XCIpIHtcbiAgICAgICAgICByZXR1cm4gYy5jaGFyQ29kZUF0KDApIC0gXCIwXCIuY2hhckNvZGVBdCgwKTtcbiAgICAgICAgfSBlbHNlIGlmIChcIkFcIiA8PSBjICYmIGMgPD0gXCJaXCIpIHtcbiAgICAgICAgICByZXR1cm4gYy5jaGFyQ29kZUF0KDApIC0gXCJBXCIuY2hhckNvZGVBdCgwKSArIDEwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHN3aXRjaCAoYykge1xuICAgICAgICAgICAgY2FzZSBcIiBcIjpcbiAgICAgICAgICAgICAgcmV0dXJuIDM2O1xuICAgICAgICAgICAgY2FzZSBcIiRcIjpcbiAgICAgICAgICAgICAgcmV0dXJuIDM3O1xuICAgICAgICAgICAgY2FzZSBcIiVcIjpcbiAgICAgICAgICAgICAgcmV0dXJuIDM4O1xuICAgICAgICAgICAgY2FzZSBcIipcIjpcbiAgICAgICAgICAgICAgcmV0dXJuIDM5O1xuICAgICAgICAgICAgY2FzZSBcIitcIjpcbiAgICAgICAgICAgICAgcmV0dXJuIDQwO1xuICAgICAgICAgICAgY2FzZSBcIi1cIjpcbiAgICAgICAgICAgICAgcmV0dXJuIDQxO1xuICAgICAgICAgICAgY2FzZSBcIi5cIjpcbiAgICAgICAgICAgICAgcmV0dXJuIDQyO1xuICAgICAgICAgICAgY2FzZSBcIi9cIjpcbiAgICAgICAgICAgICAgcmV0dXJuIDQzO1xuICAgICAgICAgICAgY2FzZSBcIjpcIjpcbiAgICAgICAgICAgICAgcmV0dXJuIDQ0O1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiaWxsZWdhbCBjaGFyIDpcIiArIGMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cbiAgO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIHFyOEJpdEJ5dGVcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIGNvbnN0IHFyOEJpdEJ5dGU6IGFueSA9IChkYXRhOiBhbnkpID0+IHtcbiAgICBjb25zdCBfbW9kZTogYW55ID0gUVJNb2RlLk1PREVfOEJJVF9CWVRFO1xuICAgIGNvbnN0IF9kYXRhOiBhbnkgPSBkYXRhO1xuICAgIGNvbnN0IF9ieXRlczogYW55ID0gcXJjb2RlLnN0cmluZ1RvQnl0ZXMoZGF0YSk7XG5cbiAgICBjb25zdCBfdGhpczogYW55ID0ge307XG5cbiAgICBfdGhpcy5nZXRNb2RlID0gKCkgPT4ge1xuICAgICAgcmV0dXJuIF9tb2RlO1xuICAgIH07XG5cbiAgICBfdGhpcy5nZXRMZW5ndGggPSAoYnVmZmVyOiBhbnkpID0+IHtcbiAgICAgIHJldHVybiBfYnl0ZXMubGVuZ3RoO1xuICAgIH07XG5cbiAgICBfdGhpcy53cml0ZSA9IChidWZmZXI6IGFueSkgPT4ge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBfYnl0ZXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgYnVmZmVyLnB1dChfYnl0ZXNbaV0sIDgpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICByZXR1cm4gX3RoaXM7XG4gIH07XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gcXJLYW5qaVxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgY29uc3QgcXJLYW5qaTogYW55ID0gKGRhdGE6IGFueSkgPT4ge1xuICAgIGNvbnN0IF9tb2RlOiBhbnkgPSBRUk1vZGUuTU9ERV9LQU5KSTtcbiAgICBjb25zdCBfZGF0YTogYW55ID0gZGF0YTtcblxuICAgIGNvbnN0IHN0cmluZ1RvQnl0ZXM6IGFueSA9IChxcmNvZGUuc3RyaW5nVG9CeXRlc0Z1bmNzIGFzIGFueSkuU0pJUztcbiAgICBpZiAoIXN0cmluZ1RvQnl0ZXMpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcInNqaXMgbm90IHN1cHBvcnRlZC5cIik7XG4gICAgfVxuXG4gICAgLy8gdHNsaW50OmRpc2FibGU6bm8tdW51c2VkLWV4cHJlc3Npb25cbiAgICAvLyBAdHMtaWdub3JlXG4gICAgISgoYzogc3RyaW5nLCBjb2RlOiBudW1iZXIpID0+IHtcbiAgICAgIC8vIHNlbGYgdGVzdCBmb3Igc2ppcyBzdXBwb3J0LlxuICAgICAgY29uc3QgdGVzdDogYW55ID0gc3RyaW5nVG9CeXRlcyhjKTtcbiAgICAgIGlmICh0ZXN0Lmxlbmd0aCAhPT0gMiB8fCAoKHRlc3RbMF0gPDwgOCkgfCB0ZXN0WzFdKSAhPT0gY29kZSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJzamlzIG5vdCBzdXBwb3J0ZWQuXCIpO1xuICAgICAgfVxuICAgIH0pKFwiXFx1NTNjYlwiLCAweDk3NDYpO1xuICAgIC8vIHRzbGludDplbmFibGU6bm8tdW51c2VkLWV4cHJlc3Npb25cblxuICAgIGNvbnN0IF9ieXRlczogYW55ID0gc3RyaW5nVG9CeXRlcyhkYXRhKTtcblxuICAgIGNvbnN0IF90aGlzOiBhbnkgPSB7fTtcblxuICAgIF90aGlzLmdldE1vZGUgPSAoKSA9PiB7XG4gICAgICByZXR1cm4gX21vZGU7XG4gICAgfTtcblxuICAgIF90aGlzLmdldExlbmd0aCA9IChidWZmZXI6IGFueSkgPT4ge1xuICAgICAgcmV0dXJuIH5+KF9ieXRlcy5sZW5ndGggLyAyKTtcbiAgICB9O1xuXG4gICAgX3RoaXMud3JpdGUgPSAoYnVmZmVyOiBhbnkpID0+IHtcbiAgICAgIGNvbnN0IF9fZGF0YTogYW55ID0gX2J5dGVzO1xuXG4gICAgICBsZXQgaTogYW55ID0gMDtcblxuICAgICAgd2hpbGUgKGkgKyAxIDwgX19kYXRhLmxlbmd0aCkge1xuICAgICAgICBsZXQgYzogYW55ID0gKCgweGZmICYgX19kYXRhW2ldKSA8PCA4KSB8ICgweGZmICYgX19kYXRhW2kgKyAxXSk7XG5cbiAgICAgICAgaWYgKDB4ODE0MCA8PSBjICYmIGMgPD0gMHg5ZmZjKSB7XG4gICAgICAgICAgYyAtPSAweDgxNDA7XG4gICAgICAgIH0gZWxzZSBpZiAoMHhlMDQwIDw9IGMgJiYgYyA8PSAweGViYmYpIHtcbiAgICAgICAgICBjIC09IDB4YzE0MDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJpbGxlZ2FsIGNoYXIgYXQgXCIgKyAoaSArIDEpICsgXCIvXCIgKyBjKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGMgPSAoKGMgPj4+IDgpICYgMHhmZikgKiAweGMwICsgKGMgJiAweGZmKTtcblxuICAgICAgICBidWZmZXIucHV0KGMsIDEzKTtcblxuICAgICAgICBpICs9IDI7XG4gICAgICB9XG5cbiAgICAgIGlmIChpIDwgX19kYXRhLmxlbmd0aCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJpbGxlZ2FsIGNoYXIgYXQgXCIgKyAoaSArIDEpKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIF90aGlzO1xuICB9O1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIEdJRiBTdXBwb3J0IGV0Yy5cbi8vXG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gYnl0ZUFycmF5T3V0cHV0U3RyZWFtXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICBjb25zdCBieXRlQXJyYXlPdXRwdXRTdHJlYW06IGFueSA9ICgpID0+IHtcbiAgICBjb25zdCBfYnl0ZXM6IGFueSA9IFtdO1xuXG4gICAgY29uc3QgX3RoaXM6IGFueSA9IHt9O1xuXG4gICAgX3RoaXMud3JpdGVCeXRlID0gKGI6IGFueSkgPT4ge1xuICAgICAgX2J5dGVzLnB1c2goYiAmIDB4ZmYpO1xuICAgIH07XG5cbiAgICBfdGhpcy53cml0ZVNob3J0ID0gKGk6IGFueSkgPT4ge1xuICAgICAgX3RoaXMud3JpdGVCeXRlKGkpO1xuICAgICAgX3RoaXMud3JpdGVCeXRlKGkgPj4+IDgpO1xuICAgIH07XG5cbiAgICBfdGhpcy53cml0ZUJ5dGVzID0gKGI6IGFueSwgb2ZmOiBhbnksIGxlbjogYW55KSA9PiB7XG4gICAgICBvZmYgPSBvZmYgfHwgMDtcbiAgICAgIGxlbiA9IGxlbiB8fCBiLmxlbmd0aDtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpICs9IDEpIHtcbiAgICAgICAgX3RoaXMud3JpdGVCeXRlKGJbaSArIG9mZl0pO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBfdGhpcy53cml0ZVN0cmluZyA9IChzOiBhbnkpID0+IHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBfdGhpcy53cml0ZUJ5dGUocy5jaGFyQ29kZUF0KGkpKTtcbiAgICAgIH1cbiAgICB9XG4gICAgO1xuXG4gICAgX3RoaXMudG9CeXRlQXJyYXkgPSAoKSA9PiB7XG4gICAgICByZXR1cm4gX2J5dGVzO1xuICAgIH07XG5cbiAgICBfdGhpcy50b1N0cmluZyA9ICgpID0+IHtcbiAgICAgIGxldCBzOiBhbnkgPSBcIlwiO1xuICAgICAgcyArPSBcIltcIjtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgX2J5dGVzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGlmIChpID4gMCkge1xuICAgICAgICAgIHMgKz0gXCIsXCI7XG4gICAgICAgIH1cbiAgICAgICAgcyArPSBfYnl0ZXNbaV07XG4gICAgICB9XG4gICAgICBzICs9IFwiXVwiO1xuICAgICAgcmV0dXJuIHM7XG4gICAgfTtcblxuICAgIHJldHVybiBfdGhpcztcbiAgfTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBiYXNlNjRFbmNvZGVPdXRwdXRTdHJlYW1cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIGNvbnN0IGJhc2U2NEVuY29kZU91dHB1dFN0cmVhbTogYW55ID0gKCkgPT4ge1xuICAgIGxldCBfYnVmZmVyOiBhbnkgPSAwO1xuICAgIGxldCBfYnVmbGVuOiBhbnkgPSAwO1xuICAgIGxldCBfbGVuZ3RoOiBhbnkgPSAwO1xuICAgIGxldCBfYmFzZTY0OiBhbnkgPSBcIlwiO1xuXG4gICAgY29uc3QgX3RoaXM6IGFueSA9IHt9O1xuXG4gICAgY29uc3Qgd3JpdGVFbmNvZGVkOiBhbnkgPSAoYjogYW55KSA9PiB7XG4gICAgICBfYmFzZTY0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoZW5jb2RlKGIgJiAweDNmKSk7XG4gICAgfTtcblxuICAgIGNvbnN0IGVuY29kZTogYW55ID0gKG46IGFueSkgPT4ge1xuICAgICAgICBpZiAobiA8IDApIHtcbiAgICAgICAgICAvLyBlcnJvci5cbiAgICAgICAgfSBlbHNlIGlmIChuIDwgMjYpIHtcbiAgICAgICAgICByZXR1cm4gMHg0MSArIG47XG4gICAgICAgIH0gZWxzZSBpZiAobiA8IDUyKSB7XG4gICAgICAgICAgcmV0dXJuIDB4NjEgKyAobiAtIDI2KTtcbiAgICAgICAgfSBlbHNlIGlmIChuIDwgNjIpIHtcbiAgICAgICAgICByZXR1cm4gMHgzMCArIChuIC0gNTIpO1xuICAgICAgICB9IGVsc2UgaWYgKG4gPT09IDYyKSB7XG4gICAgICAgICAgcmV0dXJuIDB4MmI7XG4gICAgICAgIH0gZWxzZSBpZiAobiA9PT0gNjMpIHtcbiAgICAgICAgICByZXR1cm4gMHgyZjtcbiAgICAgICAgfVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJuOlwiICsgbik7XG4gICAgICB9XG4gICAgO1xuXG4gICAgX3RoaXMud3JpdGVCeXRlID0gKG46IGFueSkgPT4ge1xuICAgICAgX2J1ZmZlciA9IChfYnVmZmVyIDw8IDgpIHwgKG4gJiAweGZmKTtcbiAgICAgIF9idWZsZW4gKz0gODtcbiAgICAgIF9sZW5ndGggKz0gMTtcblxuICAgICAgd2hpbGUgKF9idWZsZW4gPj0gNikge1xuICAgICAgICB3cml0ZUVuY29kZWQoX2J1ZmZlciA+Pj4gKF9idWZsZW4gLSA2KSk7XG4gICAgICAgIF9idWZsZW4gLT0gNjtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgX3RoaXMuZmx1c2ggPSAoKSA9PiB7XG4gICAgICBpZiAoX2J1ZmxlbiA+IDApIHtcbiAgICAgICAgd3JpdGVFbmNvZGVkKF9idWZmZXIgPDwgKDYgLSBfYnVmbGVuKSk7XG4gICAgICAgIF9idWZmZXIgPSAwO1xuICAgICAgICBfYnVmbGVuID0gMDtcbiAgICAgIH1cblxuICAgICAgaWYgKF9sZW5ndGggJSAzICE9PSAwKSB7XG4gICAgICAgIC8vIHBhZGRpbmdcbiAgICAgICAgY29uc3QgcGFkbGVuOiBhbnkgPSAzIC0gX2xlbmd0aCAlIDM7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGFkbGVuOyBpICs9IDEpIHtcbiAgICAgICAgICBfYmFzZTY0ICs9IFwiPVwiO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIF90aGlzLnRvU3RyaW5nID0gKCkgPT4ge1xuICAgICAgcmV0dXJuIF9iYXNlNjQ7XG4gICAgfTtcblxuICAgIHJldHVybiBfdGhpcztcbiAgfTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBiYXNlNjREZWNvZGVJbnB1dFN0cmVhbVxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgY29uc3QgYmFzZTY0RGVjb2RlSW5wdXRTdHJlYW06IGFueSA9IChzdHI6IGFueSkgPT4ge1xuICAgICAgY29uc3QgX3N0cjogYW55ID0gc3RyO1xuICAgICAgbGV0IF9wb3M6IGFueSA9IDA7XG4gICAgICBsZXQgX2J1ZmZlcjogYW55ID0gMDtcbiAgICAgIGxldCBfYnVmbGVuOiBhbnkgPSAwO1xuXG4gICAgICBjb25zdCBfdGhpczogYW55ID0ge307XG5cbiAgICAgIF90aGlzLnJlYWQgPSAoKSA9PiB7XG4gICAgICAgIHdoaWxlIChfYnVmbGVuIDwgOCkge1xuICAgICAgICAgIGlmIChfcG9zID49IF9zdHIubGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAoX2J1ZmxlbiA9PT0gMCkge1xuICAgICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ1bmV4cGVjdGVkIGVuZCBvZiBmaWxlLi9cIiArIF9idWZsZW4pO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnN0IGM6IGFueSA9IF9zdHIuY2hhckF0KF9wb3MpO1xuICAgICAgICAgIF9wb3MgKz0gMTtcblxuICAgICAgICAgIGlmIChjID09PSBcIj1cIikge1xuICAgICAgICAgICAgX2J1ZmxlbiA9IDA7XG4gICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgICAgfSBlbHNlIGlmIChjLm1hdGNoKC9eXFxzJC8pKSB7XG4gICAgICAgICAgICAvLyBpZ25vcmUgaWYgd2hpdGVzcGFjZS5cbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIF9idWZmZXIgPSAoX2J1ZmZlciA8PCA2KSB8IGRlY29kZShjLmNoYXJDb2RlQXQoMCkpO1xuICAgICAgICAgIF9idWZsZW4gKz0gNjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG46IGFueSA9IChfYnVmZmVyID4+PiAoX2J1ZmxlbiAtIDgpKSAmIDB4ZmY7XG4gICAgICAgIF9idWZsZW4gLT0gODtcbiAgICAgICAgcmV0dXJuIG47XG4gICAgICB9O1xuXG4gICAgICBjb25zdCBkZWNvZGU6IGFueSA9IChjOiBhbnkpID0+IHtcbiAgICAgICAgICBpZiAoMHg0MSA8PSBjICYmIGMgPD0gMHg1YSkge1xuICAgICAgICAgICAgcmV0dXJuIGMgLSAweDQxO1xuICAgICAgICAgIH0gZWxzZSBpZiAoMHg2MSA8PSBjICYmIGMgPD0gMHg3YSkge1xuICAgICAgICAgICAgcmV0dXJuIGMgLSAweDYxICsgMjY7XG4gICAgICAgICAgfSBlbHNlIGlmICgweDMwIDw9IGMgJiYgYyA8PSAweDM5KSB7XG4gICAgICAgICAgICByZXR1cm4gYyAtIDB4MzAgKyA1MjtcbiAgICAgICAgICB9IGVsc2UgaWYgKGMgPT09IDB4MmIpIHtcbiAgICAgICAgICAgIHJldHVybiA2MjtcbiAgICAgICAgICB9IGVsc2UgaWYgKGMgPT09IDB4MmYpIHtcbiAgICAgICAgICAgIHJldHVybiA2MztcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiYzpcIiArIGMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgO1xuXG4gICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuICA7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gcmV0dXJucyBxcmNvZGUgZnVuY3Rpb24uXG5cbiAgcmV0dXJuIHFyY29kZTtcbn0pXG4oKTtcblxuLy8gbXVsdGlieXRlIHN1cHBvcnRcbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby11bnVzZWQtZXhwcmVzc2lvblxuLy8gQHRzLWlnbm9yZVxuLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLXVudXNlZC1leHByZXNzaW9uXG4hKCgpID0+IHtcbiAgX3FyY29kZS5zdHJpbmdUb0J5dGVzRnVuY3NbXCJVVEYtOFwiXSA9IChzOiBhbnkpID0+IHtcbiAgICAvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzE4NzI5NDA1L2hvdy10by1jb252ZXJ0LXV0Zjgtc3RyaW5nLXRvLWJ5dGUtYXJyYXlcbiAgICBmdW5jdGlvbiB0b1VURjhBcnJheShzdHI6IGFueSkge1xuICAgICAgY29uc3QgdXRmODogYW55ID0gW107XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xuICAgICAgICBsZXQgY2hhcmNvZGU6IGFueSA9IHN0ci5jaGFyQ29kZUF0KGkpO1xuICAgICAgICBpZiAoY2hhcmNvZGUgPCAweDgwKSB7XG4gICAgICAgICAgdXRmOC5wdXNoKGNoYXJjb2RlKTtcbiAgICAgICAgfSBlbHNlIGlmIChjaGFyY29kZSA8IDB4ODAwKSB7XG4gICAgICAgICAgdXRmOC5wdXNoKDB4YzAgfCAoY2hhcmNvZGUgPj4gNiksIDB4ODAgfCAoY2hhcmNvZGUgJiAweDNmKSk7XG4gICAgICAgIH0gZWxzZSBpZiAoY2hhcmNvZGUgPCAweGQ4MDAgfHwgY2hhcmNvZGUgPj0gMHhlMDAwKSB7XG4gICAgICAgICAgdXRmOC5wdXNoKFxuICAgICAgICAgICAgMHhlMCB8IChjaGFyY29kZSA+PiAxMiksXG4gICAgICAgICAgICAweDgwIHwgKChjaGFyY29kZSA+PiA2KSAmIDB4M2YpLFxuICAgICAgICAgICAgMHg4MCB8IChjaGFyY29kZSAmIDB4M2YpLFxuICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaSsrO1xuICAgICAgICAgIC8vIFVURi0xNiBlbmNvZGVzIDB4MTAwMDAtMHgxMEZGRkYgYnlcbiAgICAgICAgICAvLyBzdWJ0cmFjdGluZyAweDEwMDAwIGFuZCBzcGxpdHRpbmcgdGhlXG4gICAgICAgICAgLy8gMjAgYml0cyBvZiAweDAtMHhGRkZGRiBpbnRvIHR3byBoYWx2ZXNcbiAgICAgICAgICBjaGFyY29kZSA9XG4gICAgICAgICAgICAweDEwMDAwICtcbiAgICAgICAgICAgICgoKGNoYXJjb2RlICYgMHgzZmYpIDw8IDEwKSB8IChzdHIuY2hhckNvZGVBdChpKSAmIDB4M2ZmKSk7XG4gICAgICAgICAgdXRmOC5wdXNoKFxuICAgICAgICAgICAgMHhmMCB8IChjaGFyY29kZSA+PiAxOCksXG4gICAgICAgICAgICAweDgwIHwgKChjaGFyY29kZSA+PiAxMikgJiAweDNmKSxcbiAgICAgICAgICAgIDB4ODAgfCAoKGNoYXJjb2RlID4+IDYpICYgMHgzZiksXG4gICAgICAgICAgICAweDgwIHwgKGNoYXJjb2RlICYgMHgzZiksXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHV0Zjg7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRvVVRGOEFycmF5KHMpO1xuICB9O1xufSlcbigpO1xuZXhwb3J0IGRlZmF1bHQgX3FyY29kZTtcbiJdfQ==
