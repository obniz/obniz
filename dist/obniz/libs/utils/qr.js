"use strict";
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
                if (_modules[r][6] != null) {
                    continue;
                }
                _modules[r][6] = r % 2 === 0;
            }
            for (let c = 8; c < _moduleCount - 8; c += 1) {
                if (_modules[6][c] != null) {
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
                    if (_modules[row][col] != null) {
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
                throw new Error(count + " != " + numChars);
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
module.exports = _qrcode;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9vYm5pei9saWJzL3V0aWxzL3FyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxvQkFBb0I7QUFFcEIsMkJBQTJCO0FBQzNCLHNFQUFzRTtBQUV0RSx3RUFBd0U7QUFDeEUsRUFBRTtBQUNGLG1DQUFtQztBQUNuQyxFQUFFO0FBQ0Ysb0NBQW9DO0FBQ3BDLEVBQUU7QUFDRixpQ0FBaUM7QUFDakMsRUFBRTtBQUNGLGtDQUFrQztBQUNsQyxzREFBc0Q7QUFDdEQsRUFBRTtBQUNGLGdEQUFnRDtBQUNoRCwwQkFBMEI7QUFDMUIscURBQXFEO0FBQ3JELEVBQUU7QUFDRix3RUFBd0U7QUFFeEUsTUFBTSxPQUFPLEdBQUcsQ0FBQyxHQUFHLEVBQUU7SUFDcEIsdUVBQXVFO0lBQ3ZFLFNBQVM7SUFDVCx3RUFBd0U7SUFFeEU7Ozs7T0FJRztJQUNILE1BQU0sTUFBTSxHQUFHLENBQUMsV0FBbUIsRUFBRSx1QkFBOEMsRUFBRSxFQUFFO1FBQ3JGLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQztRQUNsQixNQUFNLElBQUksR0FBRyxJQUFJLENBQUM7UUFFbEIsTUFBTSxxQkFBcUIsR0FBRyxzQkFBc0IsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO1FBQzlFLElBQUksUUFBUSxHQUFRLElBQUksQ0FBQztRQUN6QixJQUFJLFlBQVksR0FBRyxDQUFDLENBQUM7UUFDckIsSUFBSSxVQUFVLEdBQVEsSUFBSSxDQUFDO1FBQzNCLE1BQU0sU0FBUyxHQUFRLEVBQUUsQ0FBQztRQUUxQixNQUFNLEtBQUssR0FBUSxFQUFFLENBQUM7UUFFdEIsTUFBTSxRQUFRLEdBQUcsQ0FBQyxJQUFTLEVBQUUsV0FBZ0IsRUFBRSxFQUFFO1lBQy9DLFlBQVksR0FBRyxXQUFXLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUNwQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLFdBQVcsRUFBRSxFQUFFO2dCQUMxQixNQUFNLE9BQU8sR0FBRyxJQUFJLEtBQUssQ0FBQyxXQUFXLENB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Q0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFDZixDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUNmLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBQ2YsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFDZixDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUNmLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUNuQixDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFDbkIsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxDQUFDO1lBQ3BCLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsQ0FBQztZQUNwQixDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLENBQUM7WUFDcEIsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxDQUFDO1lBQ3BCLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsQ0FBQztZQUNwQixDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxDQUFDO1lBQ3hCLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUM7WUFDekIsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQztZQUN6QixDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDO1lBQ3pCLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUM7WUFDekIsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQztZQUN6QixDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDO1lBQ3pCLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDO1lBQzlCLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDO1lBQzlCLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDO1lBQzlCLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDO1lBQzlCLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDO1lBQzlCLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDO1NBQy9CLENBQUM7UUFDRixNQUFNLEdBQUcsR0FDUCxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDVCxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDUixDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDUixDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7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QUUsRUFBRSxFQUFFLENBQUM7WUFDWCxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBQ1gsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUNYLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFFVixJQUFJO1lBQ0osQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUNYLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFDWCxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBQ1gsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUVYLElBQUk7WUFDSixDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBQ1gsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUNYLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFDWCxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBRVgsSUFBSTtZQUNKLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFLENBQUM7WUFDWixDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBQ1gsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUNYLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFFVixJQUFJO1lBQ0osQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQztZQUNiLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFDWCxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBQ3RCLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFFdEIsSUFBSTtZQUNKLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFDWCxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBQ1gsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUNYLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFFWCxJQUFJO1lBQ0osQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUNYLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFDWCxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBQ3RCLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFFdEIsSUFBSTtZQUNKLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFLENBQUM7WUFDWixDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBQ3RCLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFDdEIsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUV0QixJQUFJO1lBQ0osQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQztZQUNiLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFDdEIsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUN0QixDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBRXRCLEtBQUs7WUFDTCxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBQ3RCLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFDdEIsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUN0QixDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBRXRCLEtBQUs7WUFDTCxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFBRSxDQUFDO1lBQ1osQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUN0QixDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBQ3RCLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFFdEIsS0FBSztZQUNMLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFLENBQUM7WUFDeEIsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUN0QixDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBQ3RCLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFFdEIsS0FBSztZQUNMLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUM7WUFDYixDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBQ3RCLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFDdEIsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUV2QixLQUFLO1lBQ0wsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQztZQUMxQixDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBQ3RCLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFDdkIsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUV2QixLQUFLO1lBQ0wsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUUsQ0FBQztZQUN4QixDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBQ3RCLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFDdEIsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUV2QixLQUFLO1lBQ0wsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUUsQ0FBQztZQUN4QixDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBQ3RCLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFDdkIsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUV2QixLQUFLO1lBQ0wsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQztZQUMxQixDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBQ3ZCLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFDdkIsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUV2QixLQUFLO1lBQ0wsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQztZQUMxQixDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBQ3RCLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFDdkIsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUV2QixLQUFLO1lBQ0wsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQztZQUMxQixDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBQ3ZCLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFDdkIsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUV2QixLQUFLO1lBQ0wsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQztZQUMxQixDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBQ3ZCLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFDdkIsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUV4QixLQUFLO1lBQ0wsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQztZQUMxQixDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBQ1osQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUN2QixDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBRXZCLEtBQUs7WUFDTCxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDO1lBQzFCLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFDWixDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBQ3ZCLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFFWixLQUFLO1lBQ0wsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQztZQUMxQixDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBQ3ZCLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFDeEIsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUV4QixLQUFLO1lBQ0wsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQztZQUMxQixDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBQ3ZCLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFDeEIsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUV2QixLQUFLO1lBQ0wsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQztZQUMxQixDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBQ3ZCLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFDdkIsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUV4QixLQUFLO1lBQ0wsQ0FBQyxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQztZQUMzQixDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBQ3ZCLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFDdkIsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUV2QixLQUFLO1lBQ0wsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQztZQUMxQixDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBQ3ZCLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFDdkIsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUV4QixLQUFLO1lBQ0wsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQztZQUMzQixDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBQ3ZCLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFDdkIsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUV4QixLQUFLO1lBQ0wsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQztZQUMxQixDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBQ3ZCLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFDdkIsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUV4QixLQUFLO1lBQ0wsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQztZQUMzQixDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBQ3hCLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFDeEIsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUV4QixLQUFLO1lBQ0wsQ0FBQyxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQztZQUMzQixDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBQ3ZCLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFDdkIsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUV4QixLQUFLO1lBQ0wsQ0FBQyxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQztZQUNkLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFDeEIsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUN4QixDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBRXhCLEtBQUs7WUFDTCxDQUFDLEVBQUUsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDO1lBQzNCLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFDeEIsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUN4QixDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBRXhCLEtBQUs7WUFDTCxDQUFDLEVBQUUsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDO1lBQzNCLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFDeEIsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUN2QixDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBRXZCLEtBQUs7WUFDTCxDQUFDLEVBQUUsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDO1lBQzNCLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFDeEIsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUN4QixDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBRXhCLEtBQUs7WUFDTCxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDO1lBQzNCLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFDdkIsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUN4QixDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBRXZCLEtBQUs7WUFDTCxDQUFDLEVBQUUsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDO1lBQzNCLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFDeEIsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUN4QixDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBRXhCLEtBQUs7WUFDTCxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDO1lBQzNCLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFDeEIsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUN4QixDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBRXhCLEtBQUs7WUFDTCxDQUFDLEVBQUUsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDO1lBQzNCLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFDdkIsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUN4QixDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBRXhCLEtBQUs7WUFDTCxDQUFDLEVBQUUsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDO1lBQzNCLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFDeEIsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUN4QixDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1NBQ3pCLENBQUM7UUFFRixNQUFNLFNBQVMsR0FBRyxDQUFDLFVBQWUsRUFBRSxTQUFjLEVBQUUsRUFBRTtZQUNw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SSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsRUFDL0IsSUFBSSxHQUFHLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxDQUN6QixDQUFDO2lCQUNIO2FBQ0Y7WUFDRCxPQUFPLElBQUksQ0FBQztRQUNkLENBQUM7UUFFRCxPQUFPLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN4QixDQUFDLENBQUM7QUFDSixDQUFDLENBQUMsRUFDQSxDQUFDO0FBQ0gsTUFBTSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMiLCJmaWxlIjoib2JuaXovbGlicy91dGlscy9xci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1kaXNhYmxlICovXG5cbi8qIFRoYW5rcyBLYXp1aGlrbyBBcmFzZSAqL1xuLyogaHR0cHM6Ly9naXRodWIuY29tL2thenVoaWtvYXJhc2UvcXJjb2RlLWdlbmVyYXRvci90cmVlL21hc3Rlci9qcyAqL1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vXG4vLyBRUiBDb2RlIEdlbmVyYXRvciBmb3IgSmF2YVNjcmlwdFxuLy9cbi8vIENvcHlyaWdodCAoYykgMjAwOSBLYXp1aGlrbyBBcmFzZVxuLy9cbi8vIFVSTDogaHR0cDovL3d3dy5kLXByb2plY3QuY29tL1xuLy9cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZTpcbi8vICBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuLy9cbi8vIFRoZSB3b3JkICdRUiBDb2RlJyBpcyByZWdpc3RlcmVkIHRyYWRlbWFyayBvZlxuLy8gREVOU08gV0FWRSBJTkNPUlBPUkFURURcbi8vICBodHRwOi8vd3d3LmRlbnNvLXdhdmUuY29tL3FyY29kZS9mYXFwYXRlbnQtZS5odG1sXG4vL1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmNvbnN0IF9xcmNvZGUgPSAoKCkgPT4ge1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBxcmNvZGVcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLyoqXG4gICAqIHFyY29kZVxuICAgKiBAcGFyYW0gdHlwZU51bWJlciAxIHRvIDQwXG4gICAqIEBwYXJhbSBlcnJvckNvcnJlY3Rpb25MZXZlbCAnTCcsJ00nLCdRJywnSCdcbiAgICovXG4gIGNvbnN0IHFyY29kZSA9IChfdHlwZU51bWJlcjogbnVtYmVyLCBlcnJvckNvcnJlY3Rpb25MZXZlbFN0cjogXCJMXCIgfCBcIk1cIiB8IFwiUVwiIHwgXCJIXCIpID0+IHtcbiAgICBjb25zdCBQQUQwID0gMHhlYztcbiAgICBjb25zdCBQQUQxID0gMHgxMTtcblxuICAgIGNvbnN0IF9lcnJvckNvcnJlY3Rpb25MZXZlbCA9IFFSRXJyb3JDb3JyZWN0aW9uTGV2ZWxbZXJyb3JDb3JyZWN0aW9uTGV2ZWxTdHJdO1xuICAgIGxldCBfbW9kdWxlczogYW55ID0gbnVsbDtcbiAgICBsZXQgX21vZHVsZUNvdW50ID0gMDtcbiAgICBsZXQgX2RhdGFDYWNoZTogYW55ID0gbnVsbDtcbiAgICBjb25zdCBfZGF0YUxpc3Q6IGFueSA9IFtdO1xuXG4gICAgY29uc3QgX3RoaXM6IGFueSA9IHt9O1xuXG4gICAgY29uc3QgbWFrZUltcGwgPSAodGVzdDogYW55LCBtYXNrUGF0dGVybjogYW55KSA9PiB7XG4gICAgICBfbW9kdWxlQ291bnQgPSBfdHlwZU51bWJlciAqIDQgKyAxNztcbiAgICAgIF9tb2R1bGVzID0gKChtb2R1bGVDb3VudCkgPT4ge1xuICAgICAgICBjb25zdCBtb2R1bGVzID0gbmV3IEFycmF5KG1vZHVsZUNvdW50KTtcbiAgICAgICAgZm9yIChsZXQgcm93ID0gMDsgcm93IDwgbW9kdWxlQ291bnQ7IHJvdyArPSAxKSB7XG4gICAgICAgICAgbW9kdWxlc1tyb3ddID0gbmV3IEFycmF5KG1vZHVsZUNvdW50KTtcbiAgICAgICAgICBmb3IgKGxldCBjb2wgPSAwOyBjb2wgPCBtb2R1bGVDb3VudDsgY29sICs9IDEpIHtcbiAgICAgICAgICAgIG1vZHVsZXNbcm93XVtjb2xdID0gbnVsbDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1vZHVsZXM7XG4gICAgICB9KShfbW9kdWxlQ291bnQpO1xuXG4gICAgICBzZXR1cFBvc2l0aW9uUHJvYmVQYXR0ZXJuKDAsIDApO1xuICAgICAgc2V0dXBQb3NpdGlvblByb2JlUGF0dGVybihfbW9kdWxlQ291bnQgLSA3LCAwKTtcbiAgICAgIHNldHVwUG9zaXRpb25Qcm9iZVBhdHRlcm4oMCwgX21vZHVsZUNvdW50IC0gNyk7XG4gICAgICBzZXR1cFBvc2l0aW9uQWRqdXN0UGF0dGVybigpO1xuICAgICAgc2V0dXBUaW1pbmdQYXR0ZXJuKCk7XG4gICAgICBzZXR1cFR5cGVJbmZvKHRlc3QsIG1hc2tQYXR0ZXJuKTtcblxuICAgICAgaWYgKF90eXBlTnVtYmVyID49IDcpIHtcbiAgICAgICAgc2V0dXBUeXBlTnVtYmVyKHRlc3QpO1xuICAgICAgfVxuXG4gICAgICBpZiAoX2RhdGFDYWNoZSA9PT0gbnVsbCkge1xuICAgICAgICBfZGF0YUNhY2hlID0gY3JlYXRlRGF0YShfdHlwZU51bWJlciwgX2Vycm9yQ29ycmVjdGlvbkxldmVsLCBfZGF0YUxpc3QpO1xuICAgICAgfVxuXG4gICAgICBtYXBEYXRhKF9kYXRhQ2FjaGUsIG1hc2tQYXR0ZXJuKTtcbiAgICB9O1xuXG4gICAgY29uc3Qgc2V0dXBQb3NpdGlvblByb2JlUGF0dGVybiA9IChyb3c6IG51bWJlciwgY29sOiBudW1iZXIpID0+IHtcbiAgICAgIGZvciAobGV0IHIgPSAtMTsgciA8PSA3OyByICs9IDEpIHtcbiAgICAgICAgaWYgKHJvdyArIHIgPD0gLTEgfHwgX21vZHVsZUNvdW50IDw9IHJvdyArIHIpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAobGV0IGMgPSAtMTsgYyA8PSA3OyBjICs9IDEpIHtcbiAgICAgICAgICBpZiAoY29sICsgYyA8PSAtMSB8fCBfbW9kdWxlQ291bnQgPD0gY29sICsgYykge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgKDAgPD0gciAmJiByIDw9IDYgJiYgKGMgPT09IDAgfHwgYyA9PT0gNikpIHx8XG4gICAgICAgICAgICAoMCA8PSBjICYmIGMgPD0gNiAmJiAociA9PT0gMCB8fCByID09PSA2KSkgfHxcbiAgICAgICAgICAgICgyIDw9IHIgJiYgciA8PSA0ICYmIDIgPD0gYyAmJiBjIDw9IDQpXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICBfbW9kdWxlc1tyb3cgKyByXVtjb2wgKyBjXSA9IHRydWU7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIF9tb2R1bGVzW3JvdyArIHJdW2NvbCArIGNdID0gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIGNvbnN0IGdldEJlc3RNYXNrUGF0dGVybiA9ICgpID0+IHtcbiAgICAgIGxldCBtaW5Mb3N0UG9pbnQgPSAwO1xuICAgICAgbGV0IHBhdHRlcm4gPSAwO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDg7IGkgKz0gMSkge1xuICAgICAgICBtYWtlSW1wbCh0cnVlLCBpKTtcblxuICAgICAgICBjb25zdCBsb3N0UG9pbnQgPSBRUlV0aWwuZ2V0TG9zdFBvaW50KF90aGlzKTtcblxuICAgICAgICBpZiAoaSA9PT0gMCB8fCBtaW5Mb3N0UG9pbnQgPiBsb3N0UG9pbnQpIHtcbiAgICAgICAgICBtaW5Mb3N0UG9pbnQgPSBsb3N0UG9pbnQ7XG4gICAgICAgICAgcGF0dGVybiA9IGk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHBhdHRlcm47XG4gICAgfTtcblxuICAgIGNvbnN0IHNldHVwVGltaW5nUGF0dGVybiA9ICgpID0+IHtcbiAgICAgIGZvciAobGV0IHIgPSA4OyByIDwgX21vZHVsZUNvdW50IC0gODsgciArPSAxKSB7XG4gICAgICAgIGlmIChfbW9kdWxlc1tyXVs2XSAhPSBudWxsKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgX21vZHVsZXNbcl1bNl0gPSByICUgMiA9PT0gMDtcbiAgICAgIH1cblxuICAgICAgZm9yIChsZXQgYyA9IDg7IGMgPCBfbW9kdWxlQ291bnQgLSA4OyBjICs9IDEpIHtcbiAgICAgICAgaWYgKF9tb2R1bGVzWzZdW2NdICE9IG51bGwpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBfbW9kdWxlc1s2XVtjXSA9IGMgJSAyID09PSAwO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBjb25zdCBzZXR1cFBvc2l0aW9uQWRqdXN0UGF0dGVybiA9ICgpID0+IHtcbiAgICAgIGNvbnN0IHBvcyA9IFFSVXRpbC5nZXRQYXR0ZXJuUG9zaXRpb24oX3R5cGVOdW1iZXIpO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBvcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHBvcy5sZW5ndGg7IGogKz0gMSkge1xuICAgICAgICAgIGNvbnN0IHJvdyA9IHBvc1tpXTtcbiAgICAgICAgICBjb25zdCBjb2wgPSBwb3Nbal07XG5cbiAgICAgICAgICBpZiAoX21vZHVsZXNbcm93XVtjb2xdICE9IG51bGwpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGZvciAobGV0IHIgPSAtMjsgciA8PSAyOyByICs9IDEpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGMgPSAtMjsgYyA8PSAyOyBjICs9IDEpIHtcbiAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIHIgPT09IC0yIHx8XG4gICAgICAgICAgICAgICAgciA9PT0gMiB8fFxuICAgICAgICAgICAgICAgIGMgPT09IC0yIHx8XG4gICAgICAgICAgICAgICAgYyA9PT0gMiB8fFxuICAgICAgICAgICAgICAgIChyID09PSAwICYmIGMgPT09IDApXG4gICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIF9tb2R1bGVzW3JvdyArIHJdW2NvbCArIGNdID0gdHJ1ZTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBfbW9kdWxlc1tyb3cgKyByXVtjb2wgKyBjXSA9IGZhbHNlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIGNvbnN0IHNldHVwVHlwZU51bWJlciA9ICh0ZXN0OiBhbnkpID0+IHtcbiAgICAgIGNvbnN0IGJpdHMgPSBRUlV0aWwuZ2V0QkNIVHlwZU51bWJlcihfdHlwZU51bWJlcik7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTg7IGkgKz0gMSkge1xuICAgICAgICBjb25zdCBtb2QgPSAhdGVzdCAmJiAoKGJpdHMgPj4gaSkgJiAxKSA9PT0gMTtcbiAgICAgICAgX21vZHVsZXNbTWF0aC5mbG9vcihpIC8gMyldW2kgJSAzICsgX21vZHVsZUNvdW50IC0gOCAtIDNdID0gbW9kO1xuICAgICAgfVxuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDE4OyBpICs9IDEpIHtcbiAgICAgICAgY29uc3QgbW9kID0gIXRlc3QgJiYgKChiaXRzID4+IGkpICYgMSkgPT09IDE7XG4gICAgICAgIF9tb2R1bGVzW2kgJSAzICsgX21vZHVsZUNvdW50IC0gOCAtIDNdW01hdGguZmxvb3IoaSAvIDMpXSA9IG1vZDtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgY29uc3Qgc2V0dXBUeXBlSW5mbyA9ICh0ZXN0OiBhbnksIG1hc2tQYXR0ZXJuOiBhbnkpID0+IHtcbiAgICAgIGNvbnN0IGRhdGEgPSAoX2Vycm9yQ29ycmVjdGlvbkxldmVsIDw8IDMpIHwgbWFza1BhdHRlcm47XG4gICAgICBjb25zdCBiaXRzID0gUVJVdGlsLmdldEJDSFR5cGVJbmZvKGRhdGEpO1xuXG4gICAgICAvLyB2ZXJ0aWNhbFxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxNTsgaSArPSAxKSB7XG4gICAgICAgIGNvbnN0IG1vZCA9ICF0ZXN0ICYmICgoYml0cyA+PiBpKSAmIDEpID09PSAxO1xuXG4gICAgICAgIGlmIChpIDwgNikge1xuICAgICAgICAgIF9tb2R1bGVzW2ldWzhdID0gbW9kO1xuICAgICAgICB9IGVsc2UgaWYgKGkgPCA4KSB7XG4gICAgICAgICAgX21vZHVsZXNbaSArIDFdWzhdID0gbW9kO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIF9tb2R1bGVzW19tb2R1bGVDb3VudCAtIDE1ICsgaV1bOF0gPSBtb2Q7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gaG9yaXpvbnRhbFxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxNTsgaSArPSAxKSB7XG4gICAgICAgIGNvbnN0IG1vZCA9ICF0ZXN0ICYmICgoYml0cyA+PiBpKSAmIDEpID09PSAxO1xuXG4gICAgICAgIGlmIChpIDwgOCkge1xuICAgICAgICAgIF9tb2R1bGVzWzhdW19tb2R1bGVDb3VudCAtIGkgLSAxXSA9IG1vZDtcbiAgICAgICAgfSBlbHNlIGlmIChpIDwgOSkge1xuICAgICAgICAgIF9tb2R1bGVzWzhdWzE1IC0gaSAtIDEgKyAxXSA9IG1vZDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBfbW9kdWxlc1s4XVsxNSAtIGkgLSAxXSA9IG1vZDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBmaXhlZCBtb2R1bGVcbiAgICAgIF9tb2R1bGVzW19tb2R1bGVDb3VudCAtIDhdWzhdID0gIXRlc3Q7XG4gICAgfTtcblxuICAgIGNvbnN0IG1hcERhdGEgPSAoZGF0YTogYW55LCBtYXNrUGF0dGVybjogYW55KSA9PiB7XG4gICAgICBsZXQgaW5jID0gLTE7XG4gICAgICBsZXQgcm93ID0gX21vZHVsZUNvdW50IC0gMTtcbiAgICAgIGxldCBiaXRJbmRleCA9IDc7XG4gICAgICBsZXQgYnl0ZUluZGV4ID0gMDtcbiAgICAgIGNvbnN0IG1hc2tGdW5jID0gUVJVdGlsLmdldE1hc2tGdW5jdGlvbihtYXNrUGF0dGVybik7XG5cbiAgICAgIGZvciAobGV0IGNvbCA9IF9tb2R1bGVDb3VudCAtIDE7IGNvbCA+IDA7IGNvbCAtPSAyKSB7XG4gICAgICAgIGlmIChjb2wgPT09IDYpIHtcbiAgICAgICAgICBjb2wgLT0gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgZm9yIChsZXQgYyA9IDA7IGMgPCAyOyBjICs9IDEpIHtcbiAgICAgICAgICAgIGlmIChfbW9kdWxlc1tyb3ddW2NvbCAtIGNdID09PSBudWxsKSB7XG4gICAgICAgICAgICAgIGxldCBkYXJrID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgaWYgKGJ5dGVJbmRleCA8IGRhdGEubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgZGFyayA9ICgoZGF0YVtieXRlSW5kZXhdID4+PiBiaXRJbmRleCkgJiAxKSA9PT0gMTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGNvbnN0IG1hc2sgPSBtYXNrRnVuYyhyb3csIGNvbCAtIGMpO1xuXG4gICAgICAgICAgICAgIGlmIChtYXNrKSB7XG4gICAgICAgICAgICAgICAgZGFyayA9ICFkYXJrO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgX21vZHVsZXNbcm93XVtjb2wgLSBjXSA9IGRhcms7XG4gICAgICAgICAgICAgIGJpdEluZGV4IC09IDE7XG5cbiAgICAgICAgICAgICAgaWYgKGJpdEluZGV4ID09PSAtMSkge1xuICAgICAgICAgICAgICAgIGJ5dGVJbmRleCArPSAxO1xuICAgICAgICAgICAgICAgIGJpdEluZGV4ID0gNztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHJvdyArPSBpbmM7XG5cbiAgICAgICAgICBpZiAocm93IDwgMCB8fCBfbW9kdWxlQ291bnQgPD0gcm93KSB7XG4gICAgICAgICAgICByb3cgLT0gaW5jO1xuICAgICAgICAgICAgaW5jID0gLWluYztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICBjb25zdCBjcmVhdGVCeXRlcyA9IChidWZmZXI6IGFueSwgcnNCbG9ja3M6IGFueSkgPT4ge1xuICAgICAgbGV0IG9mZnNldCA9IDA7XG5cbiAgICAgIGxldCBtYXhEY0NvdW50ID0gMDtcbiAgICAgIGxldCBtYXhFY0NvdW50ID0gMDtcblxuICAgICAgY29uc3QgZGNkYXRhID0gbmV3IEFycmF5KHJzQmxvY2tzLmxlbmd0aCk7XG4gICAgICBjb25zdCBlY2RhdGEgPSBuZXcgQXJyYXkocnNCbG9ja3MubGVuZ3RoKTtcblxuICAgICAgZm9yIChsZXQgciA9IDA7IHIgPCByc0Jsb2Nrcy5sZW5ndGg7IHIgKz0gMSkge1xuICAgICAgICBjb25zdCBkY0NvdW50ID0gcnNCbG9ja3Nbcl0uZGF0YUNvdW50O1xuICAgICAgICBjb25zdCBlY0NvdW50ID0gcnNCbG9ja3Nbcl0udG90YWxDb3VudCAtIGRjQ291bnQ7XG5cbiAgICAgICAgbWF4RGNDb3VudCA9IE1hdGgubWF4KG1heERjQ291bnQsIGRjQ291bnQpO1xuICAgICAgICBtYXhFY0NvdW50ID0gTWF0aC5tYXgobWF4RWNDb3VudCwgZWNDb3VudCk7XG5cbiAgICAgICAgZGNkYXRhW3JdID0gbmV3IEFycmF5KGRjQ291bnQpO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGNkYXRhW3JdLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgZGNkYXRhW3JdW2ldID0gMHhmZiAmIGJ1ZmZlci5nZXRCdWZmZXIoKVtpICsgb2Zmc2V0XTtcbiAgICAgICAgfVxuICAgICAgICBvZmZzZXQgKz0gZGNDb3VudDtcblxuICAgICAgICBjb25zdCByc1BvbHkgPSBRUlV0aWwuZ2V0RXJyb3JDb3JyZWN0UG9seW5vbWlhbChlY0NvdW50KTtcbiAgICAgICAgY29uc3QgcmF3UG9seSA9IHFyUG9seW5vbWlhbChkY2RhdGFbcl0sIHJzUG9seS5nZXRMZW5ndGgoKSAtIDEpIGFzIGFueTtcblxuICAgICAgICBjb25zdCBtb2RQb2x5ID0gcmF3UG9seS5tb2QocnNQb2x5KTtcbiAgICAgICAgZWNkYXRhW3JdID0gbmV3IEFycmF5KHJzUG9seS5nZXRMZW5ndGgoKSAtIDEpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVjZGF0YVtyXS5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgIGNvbnN0IG1vZEluZGV4ID0gaSArIG1vZFBvbHkuZ2V0TGVuZ3RoKCkgLSBlY2RhdGFbcl0ubGVuZ3RoO1xuICAgICAgICAgIGVjZGF0YVtyXVtpXSA9IG1vZEluZGV4ID49IDAgPyBtb2RQb2x5LmdldEF0KG1vZEluZGV4KSA6IDA7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgbGV0IHRvdGFsQ29kZUNvdW50ID0gMDtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcnNCbG9ja3MubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgdG90YWxDb2RlQ291bnQgKz0gcnNCbG9ja3NbaV0udG90YWxDb3VudDtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZGF0YSA9IG5ldyBBcnJheSh0b3RhbENvZGVDb3VudCk7XG4gICAgICBsZXQgaW5kZXggPSAwO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1heERjQ291bnQ7IGkgKz0gMSkge1xuICAgICAgICBmb3IgKGxldCByID0gMDsgciA8IHJzQmxvY2tzLmxlbmd0aDsgciArPSAxKSB7XG4gICAgICAgICAgaWYgKGkgPCBkY2RhdGFbcl0ubGVuZ3RoKSB7XG4gICAgICAgICAgICBkYXRhW2luZGV4XSA9IGRjZGF0YVtyXVtpXTtcbiAgICAgICAgICAgIGluZGV4ICs9IDE7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbWF4RWNDb3VudDsgaSArPSAxKSB7XG4gICAgICAgIGZvciAobGV0IHIgPSAwOyByIDwgcnNCbG9ja3MubGVuZ3RoOyByICs9IDEpIHtcbiAgICAgICAgICBpZiAoaSA8IGVjZGF0YVtyXS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGRhdGFbaW5kZXhdID0gZWNkYXRhW3JdW2ldO1xuICAgICAgICAgICAgaW5kZXggKz0gMTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfTtcblxuICAgIGNvbnN0IGNyZWF0ZURhdGEgPSAodHlwZU51bWJlcjogYW55LCBlcnJvckNvcnJlY3Rpb25MZXZlbDogYW55LCBkYXRhTGlzdDogYW55KSA9PiB7XG4gICAgICBjb25zdCByc0Jsb2NrcyA9IFFSUlNCbG9jay5nZXRSU0Jsb2Nrcyh0eXBlTnVtYmVyLCBlcnJvckNvcnJlY3Rpb25MZXZlbCk7XG5cbiAgICAgIGNvbnN0IGJ1ZmZlciA9IHFyQml0QnVmZmVyKCk7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YUxpc3QubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgY29uc3QgZGF0YSA9IGRhdGFMaXN0W2ldO1xuICAgICAgICBidWZmZXIucHV0KGRhdGEuZ2V0TW9kZSgpLCA0KTtcbiAgICAgICAgYnVmZmVyLnB1dChcbiAgICAgICAgICBkYXRhLmdldExlbmd0aCgpLFxuICAgICAgICAgIFFSVXRpbC5nZXRMZW5ndGhJbkJpdHMoZGF0YS5nZXRNb2RlKCksIHR5cGVOdW1iZXIpLFxuICAgICAgICApO1xuICAgICAgICBkYXRhLndyaXRlKGJ1ZmZlcik7XG4gICAgICB9XG5cbiAgICAgIC8vIGNhbGMgbnVtIG1heCBkYXRhLlxuICAgICAgbGV0IHRvdGFsRGF0YUNvdW50ID0gMDtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcnNCbG9ja3MubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgdG90YWxEYXRhQ291bnQgKz0gcnNCbG9ja3NbaV0uZGF0YUNvdW50O1xuICAgICAgfVxuXG4gICAgICBpZiAoYnVmZmVyLmdldExlbmd0aEluQml0cygpID4gdG90YWxEYXRhQ291bnQgKiA4KSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcImNvZGUgbGVuZ3RoIG92ZXJmbG93LiAoXCIgK1xuICAgICAgICAgIGJ1ZmZlci5nZXRMZW5ndGhJbkJpdHMoKSArXG4gICAgICAgICAgXCI+XCIgK1xuICAgICAgICAgIHRvdGFsRGF0YUNvdW50ICogOCArXG4gICAgICAgICAgXCIpXCIpO1xuICAgICAgfVxuXG4gICAgICAvLyBlbmQgY29kZVxuICAgICAgaWYgKGJ1ZmZlci5nZXRMZW5ndGhJbkJpdHMoKSArIDQgPD0gdG90YWxEYXRhQ291bnQgKiA4KSB7XG4gICAgICAgIGJ1ZmZlci5wdXQoMCwgNCk7XG4gICAgICB9XG5cbiAgICAgIC8vIHBhZGRpbmdcbiAgICAgIHdoaWxlIChidWZmZXIuZ2V0TGVuZ3RoSW5CaXRzKCkgJSA4ICE9PSAwKSB7XG4gICAgICAgIGJ1ZmZlci5wdXRCaXQoZmFsc2UpO1xuICAgICAgfVxuXG4gICAgICAvLyBwYWRkaW5nXG4gICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICBpZiAoYnVmZmVyLmdldExlbmd0aEluQml0cygpID49IHRvdGFsRGF0YUNvdW50ICogOCkge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGJ1ZmZlci5wdXQoUEFEMCwgOCk7XG5cbiAgICAgICAgaWYgKGJ1ZmZlci5nZXRMZW5ndGhJbkJpdHMoKSA+PSB0b3RhbERhdGFDb3VudCAqIDgpIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBidWZmZXIucHV0KFBBRDEsIDgpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gY3JlYXRlQnl0ZXMoYnVmZmVyLCByc0Jsb2Nrcyk7XG4gICAgfTtcblxuICAgIF90aGlzLmFkZERhdGEgPSAoZGF0YTogYW55LCBtb2RlOiBhbnkpID0+IHtcbiAgICAgIG1vZGUgPSBtb2RlIHx8IFwiQnl0ZVwiO1xuXG4gICAgICBsZXQgbmV3RGF0YSA9IG51bGw7XG5cbiAgICAgIHN3aXRjaCAobW9kZSkge1xuICAgICAgICBjYXNlIFwiTnVtZXJpY1wiOlxuICAgICAgICAgIG5ld0RhdGEgPSBxck51bWJlcihkYXRhKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcIkFscGhhbnVtZXJpY1wiOlxuICAgICAgICAgIG5ld0RhdGEgPSBxckFscGhhTnVtKGRhdGEpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiQnl0ZVwiOlxuICAgICAgICAgIG5ld0RhdGEgPSBxcjhCaXRCeXRlKGRhdGEpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiS2FuamlcIjpcbiAgICAgICAgICBuZXdEYXRhID0gcXJLYW5qaShkYXRhKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJtb2RlOlwiICsgbW9kZSk7XG4gICAgICB9XG5cbiAgICAgIF9kYXRhTGlzdC5wdXNoKG5ld0RhdGEpO1xuICAgICAgX2RhdGFDYWNoZSA9IG51bGw7XG4gICAgfTtcblxuICAgIF90aGlzLmdldE1vZHVsZXMgPSAoKSA9PiB7XG4gICAgICByZXR1cm4gX21vZHVsZXM7XG4gICAgfTtcblxuICAgIF90aGlzLmlzRGFyayA9IChyb3c6IG51bWJlciwgY29sOiBudW1iZXIpID0+IHtcbiAgICAgIGlmIChyb3cgPCAwIHx8IF9tb2R1bGVDb3VudCA8PSByb3cgfHwgY29sIDwgMCB8fCBfbW9kdWxlQ291bnQgPD0gY29sKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihyb3cgKyBcIixcIiArIGNvbCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gX21vZHVsZXNbcm93XVtjb2xdO1xuICAgIH07XG5cbiAgICBfdGhpcy5nZXRNb2R1bGVDb3VudCA9ICgpID0+IHtcbiAgICAgIHJldHVybiBfbW9kdWxlQ291bnQ7XG4gICAgfTtcblxuICAgIF90aGlzLm1ha2UgPSAoKSA9PiB7XG4gICAgICBpZiAoX3R5cGVOdW1iZXIgPCAxKSB7XG4gICAgICAgIGxldCB0eXBlTnVtYmVyID0gMTtcblxuICAgICAgICBmb3IgKDsgdHlwZU51bWJlciA8IDQwOyB0eXBlTnVtYmVyKyspIHtcbiAgICAgICAgICBjb25zdCByc0Jsb2NrcyA9IFFSUlNCbG9jay5nZXRSU0Jsb2NrcyhcbiAgICAgICAgICAgIHR5cGVOdW1iZXIsXG4gICAgICAgICAgICBfZXJyb3JDb3JyZWN0aW9uTGV2ZWwsXG4gICAgICAgICAgKTtcbiAgICAgICAgICBjb25zdCBidWZmZXIgPSBxckJpdEJ1ZmZlcigpO1xuXG4gICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBfZGF0YUxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBfZGF0YUxpc3RbaV07XG4gICAgICAgICAgICBidWZmZXIucHV0KGRhdGEuZ2V0TW9kZSgpLCA0KTtcbiAgICAgICAgICAgIGJ1ZmZlci5wdXQoXG4gICAgICAgICAgICAgIGRhdGEuZ2V0TGVuZ3RoKCksXG4gICAgICAgICAgICAgIFFSVXRpbC5nZXRMZW5ndGhJbkJpdHMoZGF0YS5nZXRNb2RlKCksIHR5cGVOdW1iZXIpLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGRhdGEud3JpdGUoYnVmZmVyKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBsZXQgdG90YWxEYXRhQ291bnQgPSAwO1xuICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcnNCbG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRvdGFsRGF0YUNvdW50ICs9IHJzQmxvY2tzW2ldLmRhdGFDb3VudDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoYnVmZmVyLmdldExlbmd0aEluQml0cygpIDw9IHRvdGFsRGF0YUNvdW50ICogOCkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgX3R5cGVOdW1iZXIgPSB0eXBlTnVtYmVyO1xuICAgICAgfVxuXG4gICAgICBtYWtlSW1wbChmYWxzZSwgZ2V0QmVzdE1hc2tQYXR0ZXJuKCkpO1xuICAgIH07XG5cbiAgICBfdGhpcy5jcmVhdGVUYWJsZVRhZyA9IChjZWxsU2l6ZTogYW55LCBtYXJnaW46IGFueSkgPT4ge1xuICAgICAgY2VsbFNpemUgPSBjZWxsU2l6ZSB8fCAyO1xuICAgICAgbWFyZ2luID0gdHlwZW9mIG1hcmdpbiA9PT0gXCJ1bmRlZmluZWRcIiA/IGNlbGxTaXplICogNCA6IG1hcmdpbjtcblxuICAgICAgbGV0IHFySHRtbCA9IFwiXCI7XG5cbiAgICAgIHFySHRtbCArPSAnPHRhYmxlIHN0eWxlPVwiJztcbiAgICAgIHFySHRtbCArPSBcIiBib3JkZXItd2lkdGg6IDBweDsgYm9yZGVyLXN0eWxlOiBub25lO1wiO1xuICAgICAgcXJIdG1sICs9IFwiIGJvcmRlci1jb2xsYXBzZTogY29sbGFwc2U7XCI7XG4gICAgICBxckh0bWwgKz0gXCIgcGFkZGluZzogMHB4OyBtYXJnaW46IFwiICsgbWFyZ2luICsgXCJweDtcIjtcbiAgICAgIHFySHRtbCArPSAnXCI+JztcbiAgICAgIHFySHRtbCArPSBcIjx0Ym9keT5cIjtcblxuICAgICAgZm9yIChsZXQgciA9IDA7IHIgPCBfdGhpcy5nZXRNb2R1bGVDb3VudCgpOyByICs9IDEpIHtcbiAgICAgICAgcXJIdG1sICs9IFwiPHRyPlwiO1xuXG4gICAgICAgIGZvciAobGV0IGMgPSAwOyBjIDwgX3RoaXMuZ2V0TW9kdWxlQ291bnQoKTsgYyArPSAxKSB7XG4gICAgICAgICAgcXJIdG1sICs9ICc8dGQgc3R5bGU9XCInO1xuICAgICAgICAgIHFySHRtbCArPSBcIiBib3JkZXItd2lkdGg6IDBweDsgYm9yZGVyLXN0eWxlOiBub25lO1wiO1xuICAgICAgICAgIHFySHRtbCArPSBcIiBib3JkZXItY29sbGFwc2U6IGNvbGxhcHNlO1wiO1xuICAgICAgICAgIHFySHRtbCArPSBcIiBwYWRkaW5nOiAwcHg7IG1hcmdpbjogMHB4O1wiO1xuICAgICAgICAgIHFySHRtbCArPSBcIiB3aWR0aDogXCIgKyBjZWxsU2l6ZSArIFwicHg7XCI7XG4gICAgICAgICAgcXJIdG1sICs9IFwiIGhlaWdodDogXCIgKyBjZWxsU2l6ZSArIFwicHg7XCI7XG4gICAgICAgICAgcXJIdG1sICs9IFwiIGJhY2tncm91bmQtY29sb3I6IFwiO1xuICAgICAgICAgIHFySHRtbCArPSBfdGhpcy5pc0RhcmsociwgYykgPyBcIiMwMDAwMDBcIiA6IFwiI2ZmZmZmZlwiO1xuICAgICAgICAgIHFySHRtbCArPSBcIjtcIjtcbiAgICAgICAgICBxckh0bWwgKz0gJ1wiLz4nO1xuICAgICAgICB9XG5cbiAgICAgICAgcXJIdG1sICs9IFwiPC90cj5cIjtcbiAgICAgIH1cblxuICAgICAgcXJIdG1sICs9IFwiPC90Ym9keT5cIjtcbiAgICAgIHFySHRtbCArPSBcIjwvdGFibGU+XCI7XG5cbiAgICAgIHJldHVybiBxckh0bWw7XG4gICAgfTtcblxuICAgIF90aGlzLnJlbmRlclRvMmRDb250ZXh0ID0gKGNvbnRleHQ6IGFueSwgY2VsbFNpemU6IGFueSkgPT4ge1xuICAgICAgY2VsbFNpemUgPSBjZWxsU2l6ZSB8fCAyO1xuICAgICAgY29uc3QgbGVuZ3RoID0gX3RoaXMuZ2V0TW9kdWxlQ291bnQoKTtcbiAgICAgIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IGxlbmd0aDsgcm93KyspIHtcbiAgICAgICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgbGVuZ3RoOyBjb2wrKykge1xuICAgICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gX3RoaXMuaXNEYXJrKHJvdywgY29sKSA/IFwiYmxhY2tcIiA6IFwid2hpdGVcIjtcbiAgICAgICAgICBjb250ZXh0LmZpbGxSZWN0KHJvdyAqIGNlbGxTaXplLCBjb2wgKiBjZWxsU2l6ZSwgY2VsbFNpemUsIGNlbGxTaXplKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICByZXR1cm4gX3RoaXM7XG4gIH07XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIHFyY29kZS5zdHJpbmdUb0J5dGVzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIHFyY29kZS5zdHJpbmdUb0J5dGVzRnVuY3MgPSB7XG4gICAgZGVmYXVsdChzOiBhbnkpIHtcbiAgICAgIGNvbnN0IGJ5dGVzID0gW107XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgY29uc3QgYyA9IHMuY2hhckNvZGVBdChpKTtcbiAgICAgICAgYnl0ZXMucHVzaChjICYgMHhmZik7XG4gICAgICB9XG4gICAgICByZXR1cm4gYnl0ZXM7XG4gICAgfSxcbiAgfSBhcyBhbnk7XG5cbiAgcXJjb2RlLnN0cmluZ1RvQnl0ZXMgPSBxcmNvZGUuc3RyaW5nVG9CeXRlc0Z1bmNzLmRlZmF1bHQ7XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIHFyY29kZS5jcmVhdGVTdHJpbmdUb0J5dGVzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8qKlxuICAgKiBAcGFyYW0gdW5pY29kZURhdGEgYmFzZTY0IHN0cmluZyBvZiBieXRlIGFycmF5LlxuICAgKiBbMTZiaXQgVW5pY29kZV0sWzE2Yml0IEJ5dGVzXSwgLi4uXG4gICAqIEBwYXJhbSBudW1DaGFyc1xuICAgKi9cbiAgcXJjb2RlLmNyZWF0ZVN0cmluZ1RvQnl0ZXMgPSAodW5pY29kZURhdGE6IGFueSwgbnVtQ2hhcnM6IGFueSkgPT4ge1xuICAgIC8vIGNyZWF0ZSBjb252ZXJzaW9uIG1hcC5cblxuICAgIGNvbnN0IHVuaWNvZGVNYXAgPSAoKCkgPT4ge1xuICAgICAgY29uc3QgYmluID0gYmFzZTY0RGVjb2RlSW5wdXRTdHJlYW0odW5pY29kZURhdGEpO1xuICAgICAgY29uc3QgcmVhZCA9ICgpID0+IHtcbiAgICAgICAgY29uc3QgYiA9IGJpbi5yZWFkKCk7XG4gICAgICAgIGlmIChiID09PSAtMSkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcImVvZlwiKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYjtcbiAgICAgIH07XG5cbiAgICAgIGxldCBjb3VudCA9IDA7XG4gICAgICBjb25zdCByZXN1bHQ6IGFueSA9IHt9O1xuICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgY29uc3QgYjAgPSBiaW4ucmVhZCgpO1xuICAgICAgICBpZiAoYjAgPT09IC0xKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgYjEgPSByZWFkKCk7XG4gICAgICAgIGNvbnN0IGIyID0gcmVhZCgpO1xuICAgICAgICBjb25zdCBiMyA9IHJlYWQoKTtcbiAgICAgICAgY29uc3QgayA9IFN0cmluZy5mcm9tQ2hhckNvZGUoKGIwIDw8IDgpIHwgYjEpO1xuICAgICAgICBjb25zdCB2ID0gKGIyIDw8IDgpIHwgYjM7XG4gICAgICAgIHJlc3VsdFtrXSA9IHY7XG4gICAgICAgIGNvdW50ICs9IDE7XG4gICAgICB9XG4gICAgICBpZiAoY291bnQgIT09IG51bUNoYXJzKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihjb3VudCArIFwiICE9IFwiICsgbnVtQ2hhcnMpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0pKCk7XG5cbiAgICBjb25zdCB1bmtub3duQ2hhciA9IFwiP1wiLmNoYXJDb2RlQXQoMCk7XG5cbiAgICByZXR1cm4gKHM6IGFueSkgPT4ge1xuICAgICAgY29uc3QgYnl0ZXMgPSBbXTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBjb25zdCBjID0gcy5jaGFyQ29kZUF0KGkpO1xuICAgICAgICBpZiAoYyA8IDEyOCkge1xuICAgICAgICAgIGJ5dGVzLnB1c2goYyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc3QgYiA9IHVuaWNvZGVNYXBbcy5jaGFyQXQoaSldO1xuICAgICAgICAgIGlmICh0eXBlb2YgYiA9PT0gXCJudW1iZXJcIikge1xuICAgICAgICAgICAgaWYgKChiICYgMHhmZikgPT09IGIpIHtcbiAgICAgICAgICAgICAgLy8gMWJ5dGVcbiAgICAgICAgICAgICAgYnl0ZXMucHVzaChiKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIC8vIDJieXRlc1xuICAgICAgICAgICAgICBieXRlcy5wdXNoKGIgPj4+IDgpO1xuICAgICAgICAgICAgICBieXRlcy5wdXNoKGIgJiAweGZmKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYnl0ZXMucHVzaCh1bmtub3duQ2hhcik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gYnl0ZXM7XG4gICAgfTtcbiAgfTtcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gUVJNb2RlXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIGNvbnN0IFFSTW9kZSA9IHtcbiAgICBNT0RFX05VTUJFUjogMSA8PCAwLFxuICAgIE1PREVfQUxQSEFfTlVNOiAxIDw8IDEsXG4gICAgTU9ERV84QklUX0JZVEU6IDEgPDwgMixcbiAgICBNT0RFX0tBTkpJOiAxIDw8IDMsXG4gIH07XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIFFSRXJyb3JDb3JyZWN0aW9uTGV2ZWxcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgY29uc3QgUVJFcnJvckNvcnJlY3Rpb25MZXZlbCA9IHtcbiAgICBMOiAxLFxuICAgIE06IDAsXG4gICAgUTogMyxcbiAgICBIOiAyLFxuICB9O1xuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBRUk1hc2tQYXR0ZXJuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIGNvbnN0IFFSTWFza1BhdHRlcm4gPSB7XG4gICAgUEFUVEVSTjAwMDogMCxcbiAgICBQQVRURVJOMDAxOiAxLFxuICAgIFBBVFRFUk4wMTA6IDIsXG4gICAgUEFUVEVSTjAxMTogMyxcbiAgICBQQVRURVJOMTAwOiA0LFxuICAgIFBBVFRFUk4xMDE6IDUsXG4gICAgUEFUVEVSTjExMDogNixcbiAgICBQQVRURVJOMTExOiA3LFxuICB9O1xuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBRUlV0aWxcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgY29uc3QgUVJVdGlsID0gKCgpID0+IHtcbiAgICBjb25zdCBQQVRURVJOX1BPU0lUSU9OX1RBQkxFID0gW1xuICAgICAgW10sXG4gICAgICBbNiwgMThdLFxuICAgICAgWzYsIDIyXSxcbiAgICAgIFs2LCAyNl0sXG4gICAgICBbNiwgMzBdLFxuICAgICAgWzYsIDM0XSxcbiAgICAgIFs2LCAyMiwgMzhdLFxuICAgICAgWzYsIDI0LCA0Ml0sXG4gICAgICBbNiwgMjYsIDQ2XSxcbiAgICAgIFs2LCAyOCwgNTBdLFxuICAgICAgWzYsIDMwLCA1NF0sXG4gICAgICBbNiwgMzIsIDU4XSxcbiAgICAgIFs2LCAzNCwgNjJdLFxuICAgICAgWzYsIDI2LCA0NiwgNjZdLFxuICAgICAgWzYsIDI2LCA0OCwgNzBdLFxuICAgICAgWzYsIDI2LCA1MCwgNzRdLFxuICAgICAgWzYsIDMwLCA1NCwgNzhdLFxuICAgICAgWzYsIDMwLCA1NiwgODJdLFxuICAgICAgWzYsIDMwLCA1OCwgODZdLFxuICAgICAgWzYsIDM0LCA2MiwgOTBdLFxuICAgICAgWzYsIDI4LCA1MCwgNzIsIDk0XSxcbiAgICAgIFs2LCAyNiwgNTAsIDc0LCA5OF0sXG4gICAgICBbNiwgMzAsIDU0LCA3OCwgMTAyXSxcbiAgICAgIFs2LCAyOCwgNTQsIDgwLCAxMDZdLFxuICAgICAgWzYsIDMyLCA1OCwgODQsIDExMF0sXG4gICAgICBbNiwgMzAsIDU4LCA4NiwgMTE0XSxcbiAgICAgIFs2LCAzNCwgNjIsIDkwLCAxMThdLFxuICAgICAgWzYsIDI2LCA1MCwgNzQsIDk4LCAxMjJdLFxuICAgICAgWzYsIDMwLCA1NCwgNzgsIDEwMiwgMTI2XSxcbiAgICAgIFs2LCAyNiwgNTIsIDc4LCAxMDQsIDEzMF0sXG4gICAgICBbNiwgMzAsIDU2LCA4MiwgMTA4LCAxMzRdLFxuICAgICAgWzYsIDM0LCA2MCwgODYsIDExMiwgMTM4XSxcbiAgICAgIFs2LCAzMCwgNTgsIDg2LCAxMTQsIDE0Ml0sXG4gICAgICBbNiwgMzQsIDYyLCA5MCwgMTE4LCAxNDZdLFxuICAgICAgWzYsIDMwLCA1NCwgNzgsIDEwMiwgMTI2LCAxNTBdLFxuICAgICAgWzYsIDI0LCA1MCwgNzYsIDEwMiwgMTI4LCAxNTRdLFxuICAgICAgWzYsIDI4LCA1NCwgODAsIDEwNiwgMTMyLCAxNThdLFxuICAgICAgWzYsIDMyLCA1OCwgODQsIDExMCwgMTM2LCAxNjJdLFxuICAgICAgWzYsIDI2LCA1NCwgODIsIDExMCwgMTM4LCAxNjZdLFxuICAgICAgWzYsIDMwLCA1OCwgODYsIDExNCwgMTQyLCAxNzBdLFxuICAgIF07XG4gICAgY29uc3QgRzE1ID1cbiAgICAgICgxIDw8IDEwKSB8XG4gICAgICAoMSA8PCA4KSB8XG4gICAgICAoMSA8PCA1KSB8XG4gICAgICAoMSA8PCA0KSB8XG4gICAgICAoMSA8PCAyKSB8XG4gICAgICAoMSA8PCAxKSB8XG4gICAgICAoMSA8PCAwKTtcbiAgICBjb25zdCBHMTggPVxuICAgICAgKDEgPDwgMTIpIHxcbiAgICAgICgxIDw8IDExKSB8XG4gICAgICAoMSA8PCAxMCkgfFxuICAgICAgKDEgPDwgOSkgfFxuICAgICAgKDEgPDwgOCkgfFxuICAgICAgKDEgPDwgNSkgfFxuICAgICAgKDEgPDwgMikgfFxuICAgICAgKDEgPDwgMCk7XG4gICAgY29uc3QgRzE1X01BU0sgPSAoMSA8PCAxNCkgfCAoMSA8PCAxMikgfCAoMSA8PCAxMCkgfCAoMSA8PCA0KSB8ICgxIDw8IDEpO1xuXG4gICAgY29uc3QgX3RoaXM6IGFueSA9IHt9O1xuXG4gICAgY29uc3QgZ2V0QkNIRGlnaXQgPSAoZGF0YTogYW55KSA9PiB7XG4gICAgICBsZXQgZGlnaXQgPSAwO1xuICAgICAgd2hpbGUgKGRhdGEgIT09IDApIHtcbiAgICAgICAgZGlnaXQgKz0gMTtcbiAgICAgICAgZGF0YSA+Pj49IDE7XG4gICAgICB9XG4gICAgICByZXR1cm4gZGlnaXQ7XG4gICAgfTtcblxuICAgIF90aGlzLmdldEJDSFR5cGVJbmZvID0gKGRhdGE6IGFueSkgPT4ge1xuICAgICAgbGV0IGQgPSBkYXRhIDw8IDEwO1xuICAgICAgd2hpbGUgKGdldEJDSERpZ2l0KGQpIC0gZ2V0QkNIRGlnaXQoRzE1KSA+PSAwKSB7XG4gICAgICAgIGQgXj0gRzE1IDw8IChnZXRCQ0hEaWdpdChkKSAtIGdldEJDSERpZ2l0KEcxNSkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuICgoZGF0YSA8PCAxMCkgfCBkKSBeIEcxNV9NQVNLO1xuICAgIH07XG5cbiAgICBfdGhpcy5nZXRCQ0hUeXBlTnVtYmVyID0gKGRhdGE6IGFueSkgPT4ge1xuICAgICAgbGV0IGQgPSBkYXRhIDw8IDEyO1xuICAgICAgd2hpbGUgKGdldEJDSERpZ2l0KGQpIC0gZ2V0QkNIRGlnaXQoRzE4KSA+PSAwKSB7XG4gICAgICAgIGQgXj0gRzE4IDw8IChnZXRCQ0hEaWdpdChkKSAtIGdldEJDSERpZ2l0KEcxOCkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIChkYXRhIDw8IDEyKSB8IGQ7XG4gICAgfTtcblxuICAgIF90aGlzLmdldFBhdHRlcm5Qb3NpdGlvbiA9ICh0eXBlTnVtYmVyOiBudW1iZXIpID0+IHtcbiAgICAgIHJldHVybiBQQVRURVJOX1BPU0lUSU9OX1RBQkxFW3R5cGVOdW1iZXIgLSAxXTtcbiAgICB9O1xuXG4gICAgX3RoaXMuZ2V0TWFza0Z1bmN0aW9uID0gKG1hc2tQYXR0ZXJuOiBhbnkpID0+IHtcbiAgICAgIHN3aXRjaCAobWFza1BhdHRlcm4pIHtcbiAgICAgICAgY2FzZSBRUk1hc2tQYXR0ZXJuLlBBVFRFUk4wMDA6XG4gICAgICAgICAgcmV0dXJuIChpOiBhbnksIGo6IGFueSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIChpICsgaikgJSAyID09PSAwO1xuICAgICAgICAgIH07XG4gICAgICAgIGNhc2UgUVJNYXNrUGF0dGVybi5QQVRURVJOMDAxOlxuICAgICAgICAgIHJldHVybiAoaTogYW55LCBqOiBhbnkpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBpICUgMiA9PT0gMDtcbiAgICAgICAgICB9O1xuICAgICAgICBjYXNlIFFSTWFza1BhdHRlcm4uUEFUVEVSTjAxMDpcbiAgICAgICAgICByZXR1cm4gKGk6IGFueSwgajogYW55KSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gaiAlIDMgPT09IDA7XG4gICAgICAgICAgfTtcbiAgICAgICAgY2FzZSBRUk1hc2tQYXR0ZXJuLlBBVFRFUk4wMTE6XG4gICAgICAgICAgcmV0dXJuIChpOiBhbnksIGo6IGFueSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIChpICsgaikgJSAzID09PSAwO1xuICAgICAgICAgIH07XG4gICAgICAgIGNhc2UgUVJNYXNrUGF0dGVybi5QQVRURVJOMTAwOlxuICAgICAgICAgIHJldHVybiAoaTogYW55LCBqOiBhbnkpID0+IHtcbiAgICAgICAgICAgIHJldHVybiAoTWF0aC5mbG9vcihpIC8gMikgKyBNYXRoLmZsb29yKGogLyAzKSkgJSAyID09PSAwO1xuICAgICAgICAgIH07XG4gICAgICAgIGNhc2UgUVJNYXNrUGF0dGVybi5QQVRURVJOMTAxOlxuICAgICAgICAgIHJldHVybiAoaTogYW55LCBqOiBhbnkpID0+IHtcbiAgICAgICAgICAgIHJldHVybiAoaSAqIGopICUgMiArIChpICogaikgJSAzID09PSAwO1xuICAgICAgICAgIH07XG4gICAgICAgIGNhc2UgUVJNYXNrUGF0dGVybi5QQVRURVJOMTEwOlxuICAgICAgICAgIHJldHVybiAoaTogYW55LCBqOiBhbnkpID0+IHtcbiAgICAgICAgICAgIHJldHVybiAoKGkgKiBqKSAlIDIgKyAoaSAqIGopICUgMykgJSAyID09PSAwO1xuICAgICAgICAgIH07XG4gICAgICAgIGNhc2UgUVJNYXNrUGF0dGVybi5QQVRURVJOMTExOlxuICAgICAgICAgIHJldHVybiAoaTogYW55LCBqOiBhbnkpID0+IHtcbiAgICAgICAgICAgIHJldHVybiAoKGkgKiBqKSAlIDMgKyAoaSArIGopICUgMikgJSAyID09PSAwO1xuICAgICAgICAgIH07XG5cbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJiYWQgbWFza1BhdHRlcm46XCIgKyBtYXNrUGF0dGVybik7XG4gICAgICB9XG4gICAgfTtcblxuICAgIF90aGlzLmdldEVycm9yQ29ycmVjdFBvbHlub21pYWwgPSAoZXJyb3JDb3JyZWN0TGVuZ3RoOiBhbnkpID0+IHtcbiAgICAgIGxldCBhID0gcXJQb2x5bm9taWFsKFsxXSwgMCkgYXMgYW55O1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlcnJvckNvcnJlY3RMZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBhID0gYS5tdWx0aXBseShxclBvbHlub21pYWwoWzEsIFFSTWF0aC5nZXhwKGkpXSwgMCkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGE7XG4gICAgfTtcblxuICAgIF90aGlzLmdldExlbmd0aEluQml0cyA9IChtb2RlOiBhbnksIHR5cGU6IGFueSkgPT4ge1xuICAgICAgaWYgKDEgPD0gdHlwZSAmJiB0eXBlIDwgMTApIHtcbiAgICAgICAgLy8gMSAtIDlcblxuICAgICAgICBzd2l0Y2ggKG1vZGUpIHtcbiAgICAgICAgICBjYXNlIFFSTW9kZS5NT0RFX05VTUJFUjpcbiAgICAgICAgICAgIHJldHVybiAxMDtcbiAgICAgICAgICBjYXNlIFFSTW9kZS5NT0RFX0FMUEhBX05VTTpcbiAgICAgICAgICAgIHJldHVybiA5O1xuICAgICAgICAgIGNhc2UgUVJNb2RlLk1PREVfOEJJVF9CWVRFOlxuICAgICAgICAgICAgcmV0dXJuIDg7XG4gICAgICAgICAgY2FzZSBRUk1vZGUuTU9ERV9LQU5KSTpcbiAgICAgICAgICAgIHJldHVybiA4O1xuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJtb2RlOlwiICsgbW9kZSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAodHlwZSA8IDI3KSB7XG4gICAgICAgIC8vIDEwIC0gMjZcblxuICAgICAgICBzd2l0Y2ggKG1vZGUpIHtcbiAgICAgICAgICBjYXNlIFFSTW9kZS5NT0RFX05VTUJFUjpcbiAgICAgICAgICAgIHJldHVybiAxMjtcbiAgICAgICAgICBjYXNlIFFSTW9kZS5NT0RFX0FMUEhBX05VTTpcbiAgICAgICAgICAgIHJldHVybiAxMTtcbiAgICAgICAgICBjYXNlIFFSTW9kZS5NT0RFXzhCSVRfQllURTpcbiAgICAgICAgICAgIHJldHVybiAxNjtcbiAgICAgICAgICBjYXNlIFFSTW9kZS5NT0RFX0tBTkpJOlxuICAgICAgICAgICAgcmV0dXJuIDEwO1xuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJtb2RlOlwiICsgbW9kZSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAodHlwZSA8IDQxKSB7XG4gICAgICAgIC8vIDI3IC0gNDBcblxuICAgICAgICBzd2l0Y2ggKG1vZGUpIHtcbiAgICAgICAgICBjYXNlIFFSTW9kZS5NT0RFX05VTUJFUjpcbiAgICAgICAgICAgIHJldHVybiAxNDtcbiAgICAgICAgICBjYXNlIFFSTW9kZS5NT0RFX0FMUEhBX05VTTpcbiAgICAgICAgICAgIHJldHVybiAxMztcbiAgICAgICAgICBjYXNlIFFSTW9kZS5NT0RFXzhCSVRfQllURTpcbiAgICAgICAgICAgIHJldHVybiAxNjtcbiAgICAgICAgICBjYXNlIFFSTW9kZS5NT0RFX0tBTkpJOlxuICAgICAgICAgICAgcmV0dXJuIDEyO1xuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJtb2RlOlwiICsgbW9kZSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcInR5cGU6XCIgKyB0eXBlKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgX3RoaXMuZ2V0TG9zdFBvaW50ID0gKF9fcXJjb2RlOiBhbnkpID0+IHtcbiAgICAgIGNvbnN0IG1vZHVsZUNvdW50ID0gX19xcmNvZGUuZ2V0TW9kdWxlQ291bnQoKTtcblxuICAgICAgbGV0IGxvc3RQb2ludCA9IDA7XG5cbiAgICAgIC8vIExFVkVMMVxuXG4gICAgICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCBtb2R1bGVDb3VudDsgcm93ICs9IDEpIHtcbiAgICAgICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgbW9kdWxlQ291bnQ7IGNvbCArPSAxKSB7XG4gICAgICAgICAgbGV0IHNhbWVDb3VudCA9IDA7XG4gICAgICAgICAgY29uc3QgZGFyayA9IF9fcXJjb2RlLmlzRGFyayhyb3csIGNvbCk7XG5cbiAgICAgICAgICBmb3IgKGxldCByID0gLTE7IHIgPD0gMTsgciArPSAxKSB7XG4gICAgICAgICAgICBpZiAocm93ICsgciA8IDAgfHwgbW9kdWxlQ291bnQgPD0gcm93ICsgcikge1xuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9yIChsZXQgYyA9IC0xOyBjIDw9IDE7IGMgKz0gMSkge1xuICAgICAgICAgICAgICBpZiAoY29sICsgYyA8IDAgfHwgbW9kdWxlQ291bnQgPD0gY29sICsgYykge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgaWYgKHIgPT09IDAgJiYgYyA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgaWYgKGRhcmsgPT09IF9fcXJjb2RlLmlzRGFyayhyb3cgKyByLCBjb2wgKyBjKSkge1xuICAgICAgICAgICAgICAgIHNhbWVDb3VudCArPSAxO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHNhbWVDb3VudCA+IDUpIHtcbiAgICAgICAgICAgIGxvc3RQb2ludCArPSAzICsgc2FtZUNvdW50IC0gNTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gTEVWRUwyXG5cbiAgICAgIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IG1vZHVsZUNvdW50IC0gMTsgcm93ICs9IDEpIHtcbiAgICAgICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgbW9kdWxlQ291bnQgLSAxOyBjb2wgKz0gMSkge1xuICAgICAgICAgIGxldCBjb3VudCA9IDA7XG4gICAgICAgICAgaWYgKF9fcXJjb2RlLmlzRGFyayhyb3csIGNvbCkpIHtcbiAgICAgICAgICAgIGNvdW50ICs9IDE7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChfX3FyY29kZS5pc0Rhcmsocm93ICsgMSwgY29sKSkge1xuICAgICAgICAgICAgY291bnQgKz0gMTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKF9fcXJjb2RlLmlzRGFyayhyb3csIGNvbCArIDEpKSB7XG4gICAgICAgICAgICBjb3VudCArPSAxO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoX19xcmNvZGUuaXNEYXJrKHJvdyArIDEsIGNvbCArIDEpKSB7XG4gICAgICAgICAgICBjb3VudCArPSAxO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoY291bnQgPT09IDAgfHwgY291bnQgPT09IDQpIHtcbiAgICAgICAgICAgIGxvc3RQb2ludCArPSAzO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBMRVZFTDNcblxuICAgICAgZm9yIChsZXQgcm93ID0gMDsgcm93IDwgbW9kdWxlQ291bnQ7IHJvdyArPSAxKSB7XG4gICAgICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IG1vZHVsZUNvdW50IC0gNjsgY29sICs9IDEpIHtcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICBfX3FyY29kZS5pc0Rhcmsocm93LCBjb2wpICYmXG4gICAgICAgICAgICAhX19xcmNvZGUuaXNEYXJrKHJvdywgY29sICsgMSkgJiZcbiAgICAgICAgICAgIF9fcXJjb2RlLmlzRGFyayhyb3csIGNvbCArIDIpICYmXG4gICAgICAgICAgICBfX3FyY29kZS5pc0Rhcmsocm93LCBjb2wgKyAzKSAmJlxuICAgICAgICAgICAgX19xcmNvZGUuaXNEYXJrKHJvdywgY29sICsgNCkgJiZcbiAgICAgICAgICAgICFfX3FyY29kZS5pc0Rhcmsocm93LCBjb2wgKyA1KSAmJlxuICAgICAgICAgICAgX19xcmNvZGUuaXNEYXJrKHJvdywgY29sICsgNilcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIGxvc3RQb2ludCArPSA0MDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgbW9kdWxlQ291bnQ7IGNvbCArPSAxKSB7XG4gICAgICAgIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IG1vZHVsZUNvdW50IC0gNjsgcm93ICs9IDEpIHtcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICBfX3FyY29kZS5pc0Rhcmsocm93LCBjb2wpICYmXG4gICAgICAgICAgICAhX19xcmNvZGUuaXNEYXJrKHJvdyArIDEsIGNvbCkgJiZcbiAgICAgICAgICAgIF9fcXJjb2RlLmlzRGFyayhyb3cgKyAyLCBjb2wpICYmXG4gICAgICAgICAgICBfX3FyY29kZS5pc0Rhcmsocm93ICsgMywgY29sKSAmJlxuICAgICAgICAgICAgX19xcmNvZGUuaXNEYXJrKHJvdyArIDQsIGNvbCkgJiZcbiAgICAgICAgICAgICFfX3FyY29kZS5pc0Rhcmsocm93ICsgNSwgY29sKSAmJlxuICAgICAgICAgICAgX19xcmNvZGUuaXNEYXJrKHJvdyArIDYsIGNvbClcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIGxvc3RQb2ludCArPSA0MDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gTEVWRUw0XG5cbiAgICAgIGxldCBkYXJrQ291bnQgPSAwO1xuXG4gICAgICBmb3IgKGxldCBjb2wgPSAwOyBjb2wgPCBtb2R1bGVDb3VudDsgY29sICs9IDEpIHtcbiAgICAgICAgZm9yIChsZXQgcm93ID0gMDsgcm93IDwgbW9kdWxlQ291bnQ7IHJvdyArPSAxKSB7XG4gICAgICAgICAgaWYgKF9fcXJjb2RlLmlzRGFyayhyb3csIGNvbCkpIHtcbiAgICAgICAgICAgIGRhcmtDb3VudCArPSAxO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb25zdCByYXRpbyA9XG4gICAgICAgIE1hdGguYWJzKDEwMCAqIGRhcmtDb3VudCAvIG1vZHVsZUNvdW50IC8gbW9kdWxlQ291bnQgLSA1MCkgLyA1O1xuICAgICAgbG9zdFBvaW50ICs9IHJhdGlvICogMTA7XG5cbiAgICAgIHJldHVybiBsb3N0UG9pbnQ7XG4gICAgfTtcblxuICAgIHJldHVybiBfdGhpcztcbiAgfSkoKTtcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gUVJNYXRoXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIGNvbnN0IFFSTWF0aCA9ICgoKSA9PiB7XG4gICAgY29uc3QgRVhQX1RBQkxFID0gbmV3IEFycmF5KDI1Nik7XG4gICAgY29uc3QgTE9HX1RBQkxFID0gbmV3IEFycmF5KDI1Nik7XG5cbiAgICAvLyBpbml0aWFsaXplIHRhYmxlc1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgODsgaSArPSAxKSB7XG4gICAgICBFWFBfVEFCTEVbaV0gPSAxIDw8IGk7XG4gICAgfVxuICAgIGZvciAobGV0IGkgPSA4OyBpIDwgMjU2OyBpICs9IDEpIHtcbiAgICAgIEVYUF9UQUJMRVtpXSA9XG4gICAgICAgIEVYUF9UQUJMRVtpIC0gNF0gXlxuICAgICAgICBFWFBfVEFCTEVbaSAtIDVdIF5cbiAgICAgICAgRVhQX1RBQkxFW2kgLSA2XSBeXG4gICAgICAgIEVYUF9UQUJMRVtpIC0gOF07XG4gICAgfVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMjU1OyBpICs9IDEpIHtcbiAgICAgIExPR19UQUJMRVtFWFBfVEFCTEVbaV1dID0gaTtcbiAgICB9XG5cbiAgICBjb25zdCBfdGhpczogYW55ID0ge307XG5cbiAgICBfdGhpcy5nbG9nID0gKG46IGFueSkgPT4ge1xuICAgICAgaWYgKG4gPCAxKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcImdsb2coXCIgKyBuICsgXCIpXCIpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gTE9HX1RBQkxFW25dO1xuICAgIH07XG5cbiAgICBfdGhpcy5nZXhwID0gKG46IGFueSkgPT4ge1xuICAgICAgd2hpbGUgKG4gPCAwKSB7XG4gICAgICAgIG4gKz0gMjU1O1xuICAgICAgfVxuXG4gICAgICB3aGlsZSAobiA+PSAyNTYpIHtcbiAgICAgICAgbiAtPSAyNTU7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBFWFBfVEFCTEVbbl07XG4gICAgfTtcblxuICAgIHJldHVybiBfdGhpcztcbiAgfSkoKTtcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gcXJQb2x5bm9taWFsXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIGZ1bmN0aW9uIHFyUG9seW5vbWlhbChudW06IGFueSwgc2hpZnQ6IGFueSkge1xuICAgIGlmICh0eXBlb2YgbnVtLmxlbmd0aCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKG51bS5sZW5ndGggKyBcIi9cIiArIHNoaWZ0KTtcbiAgICB9XG5cbiAgICBjb25zdCBfbnVtID0gKCgpID0+IHtcbiAgICAgIGxldCBvZmZzZXQgPSAwO1xuICAgICAgd2hpbGUgKG9mZnNldCA8IG51bS5sZW5ndGggJiYgbnVtW29mZnNldF0gPT09IDApIHtcbiAgICAgICAgb2Zmc2V0ICs9IDE7XG4gICAgICB9XG4gICAgICBjb25zdCBfX251bSA9IG5ldyBBcnJheShudW0ubGVuZ3RoIC0gb2Zmc2V0ICsgc2hpZnQpO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW0ubGVuZ3RoIC0gb2Zmc2V0OyBpICs9IDEpIHtcbiAgICAgICAgX19udW1baV0gPSBudW1baSArIG9mZnNldF07XG4gICAgICB9XG4gICAgICByZXR1cm4gX19udW07XG4gICAgfSkoKTtcblxuICAgIGNvbnN0IF90aGlzOiBhbnkgPSB7fTtcblxuICAgIF90aGlzLmdldEF0ID0gKGluZGV4OiBhbnkpID0+IHtcbiAgICAgIHJldHVybiBfbnVtW2luZGV4XTtcbiAgICB9O1xuXG4gICAgX3RoaXMuZ2V0TGVuZ3RoID0gKCkgPT4ge1xuICAgICAgcmV0dXJuIF9udW0ubGVuZ3RoO1xuICAgIH07XG5cbiAgICBfdGhpcy5tdWx0aXBseSA9IChlOiBhbnkpID0+IHtcbiAgICAgIGNvbnN0IF9fX251bSA9IG5ldyBBcnJheShfdGhpcy5nZXRMZW5ndGgoKSArIGUuZ2V0TGVuZ3RoKCkgLSAxKTtcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBfdGhpcy5nZXRMZW5ndGgoKTsgaSArPSAxKSB7XG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgZS5nZXRMZW5ndGgoKTsgaiArPSAxKSB7XG4gICAgICAgICAgX19fbnVtW2kgKyBqXSBePSBRUk1hdGguZ2V4cChcbiAgICAgICAgICAgIFFSTWF0aC5nbG9nKF90aGlzLmdldEF0KGkpKSArIFFSTWF0aC5nbG9nKGUuZ2V0QXQoaikpLFxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHFyUG9seW5vbWlhbChfX19udW0sIDApO1xuICAgIH07XG5cbiAgICBfdGhpcy5tb2QgPSAoZTogYW55KSA9PiB7XG4gICAgICBpZiAoX3RoaXMuZ2V0TGVuZ3RoKCkgLSBlLmdldExlbmd0aCgpIDwgMCkge1xuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHJhdGlvID0gUVJNYXRoLmdsb2coX3RoaXMuZ2V0QXQoMCkpIC0gUVJNYXRoLmdsb2coZS5nZXRBdCgwKSk7XG5cbiAgICAgIGNvbnN0IF9fbnVtID0gbmV3IEFycmF5KF90aGlzLmdldExlbmd0aCgpKTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgX3RoaXMuZ2V0TGVuZ3RoKCk7IGkgKz0gMSkge1xuICAgICAgICBfX251bVtpXSA9IF90aGlzLmdldEF0KGkpO1xuICAgICAgfVxuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGUuZ2V0TGVuZ3RoKCk7IGkgKz0gMSkge1xuICAgICAgICBfX251bVtpXSBePSBRUk1hdGguZ2V4cChRUk1hdGguZ2xvZyhlLmdldEF0KGkpKSArIHJhdGlvKTtcbiAgICAgIH1cblxuICAgICAgLy8gcmVjdXJzaXZlIGNhbGxcbiAgICAgIHJldHVybiBxclBvbHlub21pYWwoX19udW0sIDApLm1vZChlKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIF90aGlzO1xuICB9XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUVJSU0Jsb2NrXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICBjb25zdCBRUlJTQmxvY2sgPSAoKCkgPT4ge1xuICAgIGNvbnN0IFJTX0JMT0NLX1RBQkxFID0gW1xuICAgICAgLy8gTFxuICAgICAgLy8gTVxuICAgICAgLy8gUVxuICAgICAgLy8gSFxuXG4gICAgICAvLyAxXG4gICAgICBbMSwgMjYsIDE5XSxcbiAgICAgIFsxLCAyNiwgMTZdLFxuICAgICAgWzEsIDI2LCAxM10sXG4gICAgICBbMSwgMjYsIDldLFxuXG4gICAgICAvLyAyXG4gICAgICBbMSwgNDQsIDM0XSxcbiAgICAgIFsxLCA0NCwgMjhdLFxuICAgICAgWzEsIDQ0LCAyMl0sXG4gICAgICBbMSwgNDQsIDE2XSxcblxuICAgICAgLy8gM1xuICAgICAgWzEsIDcwLCA1NV0sXG4gICAgICBbMSwgNzAsIDQ0XSxcbiAgICAgIFsyLCAzNSwgMTddLFxuICAgICAgWzIsIDM1LCAxM10sXG5cbiAgICAgIC8vIDRcbiAgICAgIFsxLCAxMDAsIDgwXSxcbiAgICAgIFsyLCA1MCwgMzJdLFxuICAgICAgWzIsIDUwLCAyNF0sXG4gICAgICBbNCwgMjUsIDldLFxuXG4gICAgICAvLyA1XG4gICAgICBbMSwgMTM0LCAxMDhdLFxuICAgICAgWzIsIDY3LCA0M10sXG4gICAgICBbMiwgMzMsIDE1LCAyLCAzNCwgMTZdLFxuICAgICAgWzIsIDMzLCAxMSwgMiwgMzQsIDEyXSxcblxuICAgICAgLy8gNlxuICAgICAgWzIsIDg2LCA2OF0sXG4gICAgICBbNCwgNDMsIDI3XSxcbiAgICAgIFs0LCA0MywgMTldLFxuICAgICAgWzQsIDQzLCAxNV0sXG5cbiAgICAgIC8vIDdcbiAgICAgIFsyLCA5OCwgNzhdLFxuICAgICAgWzQsIDQ5LCAzMV0sXG4gICAgICBbMiwgMzIsIDE0LCA0LCAzMywgMTVdLFxuICAgICAgWzQsIDM5LCAxMywgMSwgNDAsIDE0XSxcblxuICAgICAgLy8gOFxuICAgICAgWzIsIDEyMSwgOTddLFxuICAgICAgWzIsIDYwLCAzOCwgMiwgNjEsIDM5XSxcbiAgICAgIFs0LCA0MCwgMTgsIDIsIDQxLCAxOV0sXG4gICAgICBbNCwgNDAsIDE0LCAyLCA0MSwgMTVdLFxuXG4gICAgICAvLyA5XG4gICAgICBbMiwgMTQ2LCAxMTZdLFxuICAgICAgWzMsIDU4LCAzNiwgMiwgNTksIDM3XSxcbiAgICAgIFs0LCAzNiwgMTYsIDQsIDM3LCAxN10sXG4gICAgICBbNCwgMzYsIDEyLCA0LCAzNywgMTNdLFxuXG4gICAgICAvLyAxMFxuICAgICAgWzIsIDg2LCA2OCwgMiwgODcsIDY5XSxcbiAgICAgIFs0LCA2OSwgNDMsIDEsIDcwLCA0NF0sXG4gICAgICBbNiwgNDMsIDE5LCAyLCA0NCwgMjBdLFxuICAgICAgWzYsIDQzLCAxNSwgMiwgNDQsIDE2XSxcblxuICAgICAgLy8gMTFcbiAgICAgIFs0LCAxMDEsIDgxXSxcbiAgICAgIFsxLCA4MCwgNTAsIDQsIDgxLCA1MV0sXG4gICAgICBbNCwgNTAsIDIyLCA0LCA1MSwgMjNdLFxuICAgICAgWzMsIDM2LCAxMiwgOCwgMzcsIDEzXSxcblxuICAgICAgLy8gMTJcbiAgICAgIFsyLCAxMTYsIDkyLCAyLCAxMTcsIDkzXSxcbiAgICAgIFs2LCA1OCwgMzYsIDIsIDU5LCAzN10sXG4gICAgICBbNCwgNDYsIDIwLCA2LCA0NywgMjFdLFxuICAgICAgWzcsIDQyLCAxNCwgNCwgNDMsIDE1XSxcblxuICAgICAgLy8gMTNcbiAgICAgIFs0LCAxMzMsIDEwN10sXG4gICAgICBbOCwgNTksIDM3LCAxLCA2MCwgMzhdLFxuICAgICAgWzgsIDQ0LCAyMCwgNCwgNDUsIDIxXSxcbiAgICAgIFsxMiwgMzMsIDExLCA0LCAzNCwgMTJdLFxuXG4gICAgICAvLyAxNFxuICAgICAgWzMsIDE0NSwgMTE1LCAxLCAxNDYsIDExNl0sXG4gICAgICBbNCwgNjQsIDQwLCA1LCA2NSwgNDFdLFxuICAgICAgWzExLCAzNiwgMTYsIDUsIDM3LCAxN10sXG4gICAgICBbMTEsIDM2LCAxMiwgNSwgMzcsIDEzXSxcblxuICAgICAgLy8gMTVcbiAgICAgIFs1LCAxMDksIDg3LCAxLCAxMTAsIDg4XSxcbiAgICAgIFs1LCA2NSwgNDEsIDUsIDY2LCA0Ml0sXG4gICAgICBbNSwgNTQsIDI0LCA3LCA1NSwgMjVdLFxuICAgICAgWzExLCAzNiwgMTIsIDcsIDM3LCAxM10sXG5cbiAgICAgIC8vIDE2XG4gICAgICBbNSwgMTIyLCA5OCwgMSwgMTIzLCA5OV0sXG4gICAgICBbNywgNzMsIDQ1LCAzLCA3NCwgNDZdLFxuICAgICAgWzE1LCA0MywgMTksIDIsIDQ0LCAyMF0sXG4gICAgICBbMywgNDUsIDE1LCAxMywgNDYsIDE2XSxcblxuICAgICAgLy8gMTdcbiAgICAgIFsxLCAxMzUsIDEwNywgNSwgMTM2LCAxMDhdLFxuICAgICAgWzEwLCA3NCwgNDYsIDEsIDc1LCA0N10sXG4gICAgICBbMSwgNTAsIDIyLCAxNSwgNTEsIDIzXSxcbiAgICAgIFsyLCA0MiwgMTQsIDE3LCA0MywgMTVdLFxuXG4gICAgICAvLyAxOFxuICAgICAgWzUsIDE1MCwgMTIwLCAxLCAxNTEsIDEyMV0sXG4gICAgICBbOSwgNjksIDQzLCA0LCA3MCwgNDRdLFxuICAgICAgWzE3LCA1MCwgMjIsIDEsIDUxLCAyM10sXG4gICAgICBbMiwgNDIsIDE0LCAxOSwgNDMsIDE1XSxcblxuICAgICAgLy8gMTlcbiAgICAgIFszLCAxNDEsIDExMywgNCwgMTQyLCAxMTRdLFxuICAgICAgWzMsIDcwLCA0NCwgMTEsIDcxLCA0NV0sXG4gICAgICBbMTcsIDQ3LCAyMSwgNCwgNDgsIDIyXSxcbiAgICAgIFs5LCAzOSwgMTMsIDE2LCA0MCwgMTRdLFxuXG4gICAgICAvLyAyMFxuICAgICAgWzMsIDEzNSwgMTA3LCA1LCAxMzYsIDEwOF0sXG4gICAgICBbMywgNjcsIDQxLCAxMywgNjgsIDQyXSxcbiAgICAgIFsxNSwgNTQsIDI0LCA1LCA1NSwgMjVdLFxuICAgICAgWzE1LCA0MywgMTUsIDEwLCA0NCwgMTZdLFxuXG4gICAgICAvLyAyMVxuICAgICAgWzQsIDE0NCwgMTE2LCA0LCAxNDUsIDExN10sXG4gICAgICBbMTcsIDY4LCA0Ml0sXG4gICAgICBbMTcsIDUwLCAyMiwgNiwgNTEsIDIzXSxcbiAgICAgIFsxOSwgNDYsIDE2LCA2LCA0NywgMTddLFxuXG4gICAgICAvLyAyMlxuICAgICAgWzIsIDEzOSwgMTExLCA3LCAxNDAsIDExMl0sXG4gICAgICBbMTcsIDc0LCA0Nl0sXG4gICAgICBbNywgNTQsIDI0LCAxNiwgNTUsIDI1XSxcbiAgICAgIFszNCwgMzcsIDEzXSxcblxuICAgICAgLy8gMjNcbiAgICAgIFs0LCAxNTEsIDEyMSwgNSwgMTUyLCAxMjJdLFxuICAgICAgWzQsIDc1LCA0NywgMTQsIDc2LCA0OF0sXG4gICAgICBbMTEsIDU0LCAyNCwgMTQsIDU1LCAyNV0sXG4gICAgICBbMTYsIDQ1LCAxNSwgMTQsIDQ2LCAxNl0sXG5cbiAgICAgIC8vIDI0XG4gICAgICBbNiwgMTQ3LCAxMTcsIDQsIDE0OCwgMTE4XSxcbiAgICAgIFs2LCA3MywgNDUsIDE0LCA3NCwgNDZdLFxuICAgICAgWzExLCA1NCwgMjQsIDE2LCA1NSwgMjVdLFxuICAgICAgWzMwLCA0NiwgMTYsIDIsIDQ3LCAxN10sXG5cbiAgICAgIC8vIDI1XG4gICAgICBbOCwgMTMyLCAxMDYsIDQsIDEzMywgMTA3XSxcbiAgICAgIFs4LCA3NSwgNDcsIDEzLCA3NiwgNDhdLFxuICAgICAgWzcsIDU0LCAyNCwgMjIsIDU1LCAyNV0sXG4gICAgICBbMjIsIDQ1LCAxNSwgMTMsIDQ2LCAxNl0sXG5cbiAgICAgIC8vIDI2XG4gICAgICBbMTAsIDE0MiwgMTE0LCAyLCAxNDMsIDExNV0sXG4gICAgICBbMTksIDc0LCA0NiwgNCwgNzUsIDQ3XSxcbiAgICAgIFsyOCwgNTAsIDIyLCA2LCA1MSwgMjNdLFxuICAgICAgWzMzLCA0NiwgMTYsIDQsIDQ3LCAxN10sXG5cbiAgICAgIC8vIDI3XG4gICAgICBbOCwgMTUyLCAxMjIsIDQsIDE1MywgMTIzXSxcbiAgICAgIFsyMiwgNzMsIDQ1LCAzLCA3NCwgNDZdLFxuICAgICAgWzgsIDUzLCAyMywgMjYsIDU0LCAyNF0sXG4gICAgICBbMTIsIDQ1LCAxNSwgMjgsIDQ2LCAxNl0sXG5cbiAgICAgIC8vIDI4XG4gICAgICBbMywgMTQ3LCAxMTcsIDEwLCAxNDgsIDExOF0sXG4gICAgICBbMywgNzMsIDQ1LCAyMywgNzQsIDQ2XSxcbiAgICAgIFs0LCA1NCwgMjQsIDMxLCA1NSwgMjVdLFxuICAgICAgWzExLCA0NSwgMTUsIDMxLCA0NiwgMTZdLFxuXG4gICAgICAvLyAyOVxuICAgICAgWzcsIDE0NiwgMTE2LCA3LCAxNDcsIDExN10sXG4gICAgICBbMjEsIDczLCA0NSwgNywgNzQsIDQ2XSxcbiAgICAgIFsxLCA1MywgMjMsIDM3LCA1NCwgMjRdLFxuICAgICAgWzE5LCA0NSwgMTUsIDI2LCA0NiwgMTZdLFxuXG4gICAgICAvLyAzMFxuICAgICAgWzUsIDE0NSwgMTE1LCAxMCwgMTQ2LCAxMTZdLFxuICAgICAgWzE5LCA3NSwgNDcsIDEwLCA3NiwgNDhdLFxuICAgICAgWzE1LCA1NCwgMjQsIDI1LCA1NSwgMjVdLFxuICAgICAgWzIzLCA0NSwgMTUsIDI1LCA0NiwgMTZdLFxuXG4gICAgICAvLyAzMVxuICAgICAgWzEzLCAxNDUsIDExNSwgMywgMTQ2LCAxMTZdLFxuICAgICAgWzIsIDc0LCA0NiwgMjksIDc1LCA0N10sXG4gICAgICBbNDIsIDU0LCAyNCwgMSwgNTUsIDI1XSxcbiAgICAgIFsyMywgNDUsIDE1LCAyOCwgNDYsIDE2XSxcblxuICAgICAgLy8gMzJcbiAgICAgIFsxNywgMTQ1LCAxMTVdLFxuICAgICAgWzEwLCA3NCwgNDYsIDIzLCA3NSwgNDddLFxuICAgICAgWzEwLCA1NCwgMjQsIDM1LCA1NSwgMjVdLFxuICAgICAgWzE5LCA0NSwgMTUsIDM1LCA0NiwgMTZdLFxuXG4gICAgICAvLyAzM1xuICAgICAgWzE3LCAxNDUsIDExNSwgMSwgMTQ2LCAxMTZdLFxuICAgICAgWzE0LCA3NCwgNDYsIDIxLCA3NSwgNDddLFxuICAgICAgWzI5LCA1NCwgMjQsIDE5LCA1NSwgMjVdLFxuICAgICAgWzExLCA0NSwgMTUsIDQ2LCA0NiwgMTZdLFxuXG4gICAgICAvLyAzNFxuICAgICAgWzEzLCAxNDUsIDExNSwgNiwgMTQ2LCAxMTZdLFxuICAgICAgWzE0LCA3NCwgNDYsIDIzLCA3NSwgNDddLFxuICAgICAgWzQ0LCA1NCwgMjQsIDcsIDU1LCAyNV0sXG4gICAgICBbNTksIDQ2LCAxNiwgMSwgNDcsIDE3XSxcblxuICAgICAgLy8gMzVcbiAgICAgIFsxMiwgMTUxLCAxMjEsIDcsIDE1MiwgMTIyXSxcbiAgICAgIFsxMiwgNzUsIDQ3LCAyNiwgNzYsIDQ4XSxcbiAgICAgIFszOSwgNTQsIDI0LCAxNCwgNTUsIDI1XSxcbiAgICAgIFsyMiwgNDUsIDE1LCA0MSwgNDYsIDE2XSxcblxuICAgICAgLy8gMzZcbiAgICAgIFs2LCAxNTEsIDEyMSwgMTQsIDE1MiwgMTIyXSxcbiAgICAgIFs2LCA3NSwgNDcsIDM0LCA3NiwgNDhdLFxuICAgICAgWzQ2LCA1NCwgMjQsIDEwLCA1NSwgMjVdLFxuICAgICAgWzIsIDQ1LCAxNSwgNjQsIDQ2LCAxNl0sXG5cbiAgICAgIC8vIDM3XG4gICAgICBbMTcsIDE1MiwgMTIyLCA0LCAxNTMsIDEyM10sXG4gICAgICBbMjksIDc0LCA0NiwgMTQsIDc1LCA0N10sXG4gICAgICBbNDksIDU0LCAyNCwgMTAsIDU1LCAyNV0sXG4gICAgICBbMjQsIDQ1LCAxNSwgNDYsIDQ2LCAxNl0sXG5cbiAgICAgIC8vIDM4XG4gICAgICBbNCwgMTUyLCAxMjIsIDE4LCAxNTMsIDEyM10sXG4gICAgICBbMTMsIDc0LCA0NiwgMzIsIDc1LCA0N10sXG4gICAgICBbNDgsIDU0LCAyNCwgMTQsIDU1LCAyNV0sXG4gICAgICBbNDIsIDQ1LCAxNSwgMzIsIDQ2LCAxNl0sXG5cbiAgICAgIC8vIDM5XG4gICAgICBbMjAsIDE0NywgMTE3LCA0LCAxNDgsIDExOF0sXG4gICAgICBbNDAsIDc1LCA0NywgNywgNzYsIDQ4XSxcbiAgICAgIFs0MywgNTQsIDI0LCAyMiwgNTUsIDI1XSxcbiAgICAgIFsxMCwgNDUsIDE1LCA2NywgNDYsIDE2XSxcblxuICAgICAgLy8gNDBcbiAgICAgIFsxOSwgMTQ4LCAxMTgsIDYsIDE0OSwgMTE5XSxcbiAgICAgIFsxOCwgNzUsIDQ3LCAzMSwgNzYsIDQ4XSxcbiAgICAgIFszNCwgNTQsIDI0LCAzNCwgNTUsIDI1XSxcbiAgICAgIFsyMCwgNDUsIDE1LCA2MSwgNDYsIDE2XSxcbiAgICBdO1xuXG4gICAgY29uc3QgcXJSU0Jsb2NrID0gKHRvdGFsQ291bnQ6IGFueSwgZGF0YUNvdW50OiBhbnkpID0+IHtcbiAgICAgIGNvbnN0IHJlc3VsdDogYW55ID0ge307XG4gICAgICByZXN1bHQudG90YWxDb3VudCA9IHRvdGFsQ291bnQ7XG4gICAgICByZXN1bHQuZGF0YUNvdW50ID0gZGF0YUNvdW50O1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuXG4gICAgY29uc3QgX3RoaXM6IGFueSA9IHt9O1xuXG4gICAgY29uc3QgZ2V0UnNCbG9ja1RhYmxlID0gKHR5cGVOdW1iZXI6IGFueSwgZXJyb3JDb3JyZWN0aW9uTGV2ZWw6IGFueSkgPT4ge1xuICAgICAgc3dpdGNoIChlcnJvckNvcnJlY3Rpb25MZXZlbCkge1xuICAgICAgICBjYXNlIFFSRXJyb3JDb3JyZWN0aW9uTGV2ZWwuTDpcbiAgICAgICAgICByZXR1cm4gUlNfQkxPQ0tfVEFCTEVbKHR5cGVOdW1iZXIgLSAxKSAqIDQgKyAwXTtcbiAgICAgICAgY2FzZSBRUkVycm9yQ29ycmVjdGlvbkxldmVsLk06XG4gICAgICAgICAgcmV0dXJuIFJTX0JMT0NLX1RBQkxFWyh0eXBlTnVtYmVyIC0gMSkgKiA0ICsgMV07XG4gICAgICAgIGNhc2UgUVJFcnJvckNvcnJlY3Rpb25MZXZlbC5ROlxuICAgICAgICAgIHJldHVybiBSU19CTE9DS19UQUJMRVsodHlwZU51bWJlciAtIDEpICogNCArIDJdO1xuICAgICAgICBjYXNlIFFSRXJyb3JDb3JyZWN0aW9uTGV2ZWwuSDpcbiAgICAgICAgICByZXR1cm4gUlNfQkxPQ0tfVEFCTEVbKHR5cGVOdW1iZXIgLSAxKSAqIDQgKyAzXTtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBfdGhpcy5nZXRSU0Jsb2NrcyA9ICh0eXBlTnVtYmVyOiBhbnksIGVycm9yQ29ycmVjdGlvbkxldmVsOiBhbnkpID0+IHtcbiAgICAgIGNvbnN0IHJzQmxvY2sgPSBnZXRSc0Jsb2NrVGFibGUodHlwZU51bWJlciwgZXJyb3JDb3JyZWN0aW9uTGV2ZWwpO1xuXG4gICAgICBpZiAodHlwZW9mIHJzQmxvY2sgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiYmFkIHJzIGJsb2NrIEAgdHlwZU51bWJlcjpcIiArXG4gICAgICAgICAgdHlwZU51bWJlciArXG4gICAgICAgICAgXCIvZXJyb3JDb3JyZWN0aW9uTGV2ZWw6XCIgK1xuICAgICAgICAgIGVycm9yQ29ycmVjdGlvbkxldmVsKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgbGVuZ3RoID0gcnNCbG9jay5sZW5ndGggLyAzO1xuXG4gICAgICBjb25zdCBsaXN0ID0gW107XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgY29uc3QgY291bnQgPSByc0Jsb2NrW2kgKiAzICsgMF07XG4gICAgICAgIGNvbnN0IHRvdGFsQ291bnQgPSByc0Jsb2NrW2kgKiAzICsgMV07XG4gICAgICAgIGNvbnN0IGRhdGFDb3VudCA9IHJzQmxvY2tbaSAqIDMgKyAyXTtcblxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGNvdW50OyBqICs9IDEpIHtcbiAgICAgICAgICBsaXN0LnB1c2gocXJSU0Jsb2NrKHRvdGFsQ291bnQsIGRhdGFDb3VudCkpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBsaXN0O1xuICAgIH07XG5cbiAgICByZXR1cm4gX3RoaXM7XG4gIH0pKCk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gcXJCaXRCdWZmZXJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIGNvbnN0IHFyQml0QnVmZmVyOiAoKSA9PiBhbnkgPSAoKSA9PiB7XG4gICAgY29uc3QgX2J1ZmZlcjogYW55ID0gW107XG4gICAgbGV0IF9sZW5ndGggPSAwO1xuXG4gICAgY29uc3QgX3RoaXM6IGFueSA9IHt9O1xuXG4gICAgX3RoaXMuZ2V0QnVmZmVyID0gKCkgPT4ge1xuICAgICAgcmV0dXJuIF9idWZmZXI7XG4gICAgfTtcblxuICAgIF90aGlzLmdldEF0ID0gKGluZGV4OiBudW1iZXIpID0+IHtcbiAgICAgIGNvbnN0IGJ1ZkluZGV4ID0gTWF0aC5mbG9vcihpbmRleCAvIDgpO1xuICAgICAgcmV0dXJuICgoX2J1ZmZlcltidWZJbmRleF0gPj4+ICg3IC0gaW5kZXggJSA4KSkgJiAxKSA9PT0gMTtcbiAgICB9O1xuXG4gICAgX3RoaXMucHV0ID0gKG51bTogbnVtYmVyLCBsZW5ndGg6IG51bWJlcikgPT4ge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBfdGhpcy5wdXRCaXQoKChudW0gPj4+IChsZW5ndGggLSBpIC0gMSkpICYgMSkgPT09IDEpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBfdGhpcy5nZXRMZW5ndGhJbkJpdHMgPSAoKSA9PiB7XG4gICAgICByZXR1cm4gX2xlbmd0aDtcbiAgICB9O1xuXG4gICAgX3RoaXMucHV0Qml0ID0gKGJpdDogYW55KSA9PiB7XG4gICAgICBjb25zdCBidWZJbmRleCA9IE1hdGguZmxvb3IoX2xlbmd0aCAvIDgpO1xuICAgICAgaWYgKF9idWZmZXIubGVuZ3RoIDw9IGJ1ZkluZGV4KSB7XG4gICAgICAgIF9idWZmZXIucHVzaCgwKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGJpdCkge1xuICAgICAgICBfYnVmZmVyW2J1ZkluZGV4XSB8PSAweDgwID4+PiAoX2xlbmd0aCAlIDgpO1xuICAgICAgfVxuXG4gICAgICBfbGVuZ3RoICs9IDE7XG4gICAgfTtcblxuICAgIHJldHVybiBfdGhpcztcbiAgfTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBxck51bWJlclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgY29uc3QgcXJOdW1iZXIgPSAoX2RhdGE6IGFueSkgPT4ge1xuICAgICAgY29uc3QgX21vZGUgPSBRUk1vZGUuTU9ERV9OVU1CRVI7XG5cbiAgICAgIGNvbnN0IF90aGlzOiBhbnkgPSB7fTtcblxuICAgICAgX3RoaXMuZ2V0TW9kZSA9ICgpID0+IHtcbiAgICAgICAgcmV0dXJuIF9tb2RlO1xuICAgICAgfTtcblxuICAgICAgX3RoaXMuZ2V0TGVuZ3RoID0gKGJ1ZmZlcjogYW55KSA9PiB7XG4gICAgICAgIHJldHVybiBfZGF0YS5sZW5ndGg7XG4gICAgICB9XG4gICAgICA7XG5cbiAgICAgIF90aGlzLndyaXRlID0gKGJ1ZmZlcjogYW55KSA9PiB7XG4gICAgICAgIGNvbnN0IGRhdGE6IGFueSA9IF9kYXRhO1xuXG4gICAgICAgIGxldCBpID0gMDtcblxuICAgICAgICB3aGlsZSAoaSArIDIgPCBkYXRhLmxlbmd0aCkge1xuICAgICAgICAgIGJ1ZmZlci5wdXQoc3RyVG9OdW0oZGF0YS5zdWJzdHJpbmcoaSwgaSArIDMpKSwgMTApO1xuICAgICAgICAgIGkgKz0gMztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpIDwgZGF0YS5sZW5ndGgpIHtcbiAgICAgICAgICBpZiAoZGF0YS5sZW5ndGggLSBpID09PSAxKSB7XG4gICAgICAgICAgICBidWZmZXIucHV0KHN0clRvTnVtKGRhdGEuc3Vic3RyaW5nKGksIGkgKyAxKSksIDQpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoZGF0YS5sZW5ndGggLSBpID09PSAyKSB7XG4gICAgICAgICAgICBidWZmZXIucHV0KHN0clRvTnVtKGRhdGEuc3Vic3RyaW5nKGksIGkgKyAyKSksIDcpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgO1xuXG4gICAgICBjb25zdCBzdHJUb051bSA9IChzOiBhbnkpID0+IHtcbiAgICAgICAgICBsZXQgbnVtID0gMDtcbiAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgIG51bSA9IG51bSAqIDEwICsgY2hhdFRvTnVtKHMuY2hhckF0KGkpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIG51bTtcbiAgICAgICAgfVxuICAgICAgO1xuXG4gICAgICBjb25zdCBjaGF0VG9OdW0gPSAoYzogYW55KSA9PiB7XG4gICAgICAgICAgaWYgKFwiMFwiIDw9IGMgJiYgYyA8PSBcIjlcIikge1xuICAgICAgICAgICAgcmV0dXJuIGMuY2hhckNvZGVBdCgwKSAtIFwiMFwiLmNoYXJDb2RlQXQoMCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcImlsbGVnYWwgY2hhciA6XCIgKyBjKTtcbiAgICAgICAgfVxuICAgICAgO1xuXG4gICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuICA7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gcXJBbHBoYU51bVxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgY29uc3QgcXJBbHBoYU51bSA9IChkYXRhOiBhbnkpID0+IHtcbiAgICAgIGNvbnN0IF9tb2RlID0gUVJNb2RlLk1PREVfQUxQSEFfTlVNO1xuICAgICAgY29uc3QgX2RhdGEgPSBkYXRhO1xuXG4gICAgICBjb25zdCBfdGhpczogYW55ID0ge307XG5cbiAgICAgIF90aGlzLmdldE1vZGUgPSAoKSA9PiB7XG4gICAgICAgIHJldHVybiBfbW9kZTtcbiAgICAgIH07XG5cbiAgICAgIF90aGlzLmdldExlbmd0aCA9IChidWZmZXI6IGFueSkgPT4ge1xuICAgICAgICByZXR1cm4gX2RhdGEubGVuZ3RoO1xuICAgICAgfVxuICAgICAgO1xuXG4gICAgICBfdGhpcy53cml0ZSA9IChidWZmZXI6IGFueSkgPT4ge1xuICAgICAgICBjb25zdCBzID0gX2RhdGE7XG5cbiAgICAgICAgbGV0IGkgPSAwO1xuXG4gICAgICAgIHdoaWxlIChpICsgMSA8IHMubGVuZ3RoKSB7XG4gICAgICAgICAgYnVmZmVyLnB1dChnZXRDb2RlKHMuY2hhckF0KGkpKSAqIDQ1ICsgZ2V0Q29kZShzLmNoYXJBdChpICsgMSkpLCAxMSk7XG4gICAgICAgICAgaSArPSAyO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGkgPCBzLmxlbmd0aCkge1xuICAgICAgICAgIGJ1ZmZlci5wdXQoZ2V0Q29kZShzLmNoYXJBdChpKSksIDYpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICA7XG5cbiAgICAgIGNvbnN0IGdldENvZGUgPSAoYzogYW55KSA9PiB7XG4gICAgICAgIGlmIChcIjBcIiA8PSBjICYmIGMgPD0gXCI5XCIpIHtcbiAgICAgICAgICByZXR1cm4gYy5jaGFyQ29kZUF0KDApIC0gXCIwXCIuY2hhckNvZGVBdCgwKTtcbiAgICAgICAgfSBlbHNlIGlmIChcIkFcIiA8PSBjICYmIGMgPD0gXCJaXCIpIHtcbiAgICAgICAgICByZXR1cm4gYy5jaGFyQ29kZUF0KDApIC0gXCJBXCIuY2hhckNvZGVBdCgwKSArIDEwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHN3aXRjaCAoYykge1xuICAgICAgICAgICAgY2FzZSBcIiBcIjpcbiAgICAgICAgICAgICAgcmV0dXJuIDM2O1xuICAgICAgICAgICAgY2FzZSBcIiRcIjpcbiAgICAgICAgICAgICAgcmV0dXJuIDM3O1xuICAgICAgICAgICAgY2FzZSBcIiVcIjpcbiAgICAgICAgICAgICAgcmV0dXJuIDM4O1xuICAgICAgICAgICAgY2FzZSBcIipcIjpcbiAgICAgICAgICAgICAgcmV0dXJuIDM5O1xuICAgICAgICAgICAgY2FzZSBcIitcIjpcbiAgICAgICAgICAgICAgcmV0dXJuIDQwO1xuICAgICAgICAgICAgY2FzZSBcIi1cIjpcbiAgICAgICAgICAgICAgcmV0dXJuIDQxO1xuICAgICAgICAgICAgY2FzZSBcIi5cIjpcbiAgICAgICAgICAgICAgcmV0dXJuIDQyO1xuICAgICAgICAgICAgY2FzZSBcIi9cIjpcbiAgICAgICAgICAgICAgcmV0dXJuIDQzO1xuICAgICAgICAgICAgY2FzZSBcIjpcIjpcbiAgICAgICAgICAgICAgcmV0dXJuIDQ0O1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiaWxsZWdhbCBjaGFyIDpcIiArIGMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cbiAgO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIHFyOEJpdEJ5dGVcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIGNvbnN0IHFyOEJpdEJ5dGUgPSAoZGF0YTogYW55KSA9PiB7XG4gICAgY29uc3QgX21vZGUgPSBRUk1vZGUuTU9ERV84QklUX0JZVEU7XG4gICAgY29uc3QgX2RhdGEgPSBkYXRhO1xuICAgIGNvbnN0IF9ieXRlcyA9IHFyY29kZS5zdHJpbmdUb0J5dGVzKGRhdGEpO1xuXG4gICAgY29uc3QgX3RoaXM6IGFueSA9IHt9O1xuXG4gICAgX3RoaXMuZ2V0TW9kZSA9ICgpID0+IHtcbiAgICAgIHJldHVybiBfbW9kZTtcbiAgICB9O1xuXG4gICAgX3RoaXMuZ2V0TGVuZ3RoID0gKGJ1ZmZlcjogYW55KSA9PiB7XG4gICAgICByZXR1cm4gX2J5dGVzLmxlbmd0aDtcbiAgICB9O1xuXG4gICAgX3RoaXMud3JpdGUgPSAoYnVmZmVyOiBhbnkpID0+IHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgX2J5dGVzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGJ1ZmZlci5wdXQoX2J5dGVzW2ldLCA4KTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIF90aGlzO1xuICB9O1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIHFyS2Fuamlcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIGNvbnN0IHFyS2FuamkgPSAoZGF0YTogYW55KSA9PiB7XG4gICAgY29uc3QgX21vZGUgPSBRUk1vZGUuTU9ERV9LQU5KSTtcbiAgICBjb25zdCBfZGF0YSA9IGRhdGE7XG5cbiAgICBjb25zdCBzdHJpbmdUb0J5dGVzID0gKHFyY29kZS5zdHJpbmdUb0J5dGVzRnVuY3MgYXMgYW55KS5TSklTO1xuICAgIGlmICghc3RyaW5nVG9CeXRlcykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwic2ppcyBub3Qgc3VwcG9ydGVkLlwiKTtcbiAgICB9XG5cbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZTpuby11bnVzZWQtZXhwcmVzc2lvblxuICAgIC8vIEB0cy1pZ25vcmVcbiAgICAhKChjOiBzdHJpbmcsIGNvZGU6IG51bWJlcikgPT4ge1xuICAgICAgLy8gc2VsZiB0ZXN0IGZvciBzamlzIHN1cHBvcnQuXG4gICAgICBjb25zdCB0ZXN0ID0gc3RyaW5nVG9CeXRlcyhjKTtcbiAgICAgIGlmICh0ZXN0Lmxlbmd0aCAhPT0gMiB8fCAoKHRlc3RbMF0gPDwgOCkgfCB0ZXN0WzFdKSAhPT0gY29kZSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJzamlzIG5vdCBzdXBwb3J0ZWQuXCIpO1xuICAgICAgfVxuICAgIH0pKFwiXFx1NTNjYlwiLCAweDk3NDYpO1xuICAgIC8vIHRzbGludDplbmFibGU6bm8tdW51c2VkLWV4cHJlc3Npb25cblxuICAgIGNvbnN0IF9ieXRlcyA9IHN0cmluZ1RvQnl0ZXMoZGF0YSk7XG5cbiAgICBjb25zdCBfdGhpczogYW55ID0ge307XG5cbiAgICBfdGhpcy5nZXRNb2RlID0gKCkgPT4ge1xuICAgICAgcmV0dXJuIF9tb2RlO1xuICAgIH07XG5cbiAgICBfdGhpcy5nZXRMZW5ndGggPSAoYnVmZmVyOiBhbnkpID0+IHtcbiAgICAgIHJldHVybiB+fihfYnl0ZXMubGVuZ3RoIC8gMik7XG4gICAgfTtcblxuICAgIF90aGlzLndyaXRlID0gKGJ1ZmZlcjogYW55KSA9PiB7XG4gICAgICBjb25zdCBfX2RhdGEgPSBfYnl0ZXM7XG5cbiAgICAgIGxldCBpID0gMDtcblxuICAgICAgd2hpbGUgKGkgKyAxIDwgX19kYXRhLmxlbmd0aCkge1xuICAgICAgICBsZXQgYyA9ICgoMHhmZiAmIF9fZGF0YVtpXSkgPDwgOCkgfCAoMHhmZiAmIF9fZGF0YVtpICsgMV0pO1xuXG4gICAgICAgIGlmICgweDgxNDAgPD0gYyAmJiBjIDw9IDB4OWZmYykge1xuICAgICAgICAgIGMgLT0gMHg4MTQwO1xuICAgICAgICB9IGVsc2UgaWYgKDB4ZTA0MCA8PSBjICYmIGMgPD0gMHhlYmJmKSB7XG4gICAgICAgICAgYyAtPSAweGMxNDA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiaWxsZWdhbCBjaGFyIGF0IFwiICsgKGkgKyAxKSArIFwiL1wiICsgYyk7XG4gICAgICAgIH1cblxuICAgICAgICBjID0gKChjID4+PiA4KSAmIDB4ZmYpICogMHhjMCArIChjICYgMHhmZik7XG5cbiAgICAgICAgYnVmZmVyLnB1dChjLCAxMyk7XG5cbiAgICAgICAgaSArPSAyO1xuICAgICAgfVxuXG4gICAgICBpZiAoaSA8IF9fZGF0YS5sZW5ndGgpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiaWxsZWdhbCBjaGFyIGF0IFwiICsgKGkgKyAxKSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHJldHVybiBfdGhpcztcbiAgfTtcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBHSUYgU3VwcG9ydCBldGMuXG4vL1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIGJ5dGVBcnJheU91dHB1dFN0cmVhbVxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgY29uc3QgYnl0ZUFycmF5T3V0cHV0U3RyZWFtID0gKCkgPT4ge1xuICAgIGNvbnN0IF9ieXRlczogYW55ID0gW107XG5cbiAgICBjb25zdCBfdGhpczogYW55ID0ge307XG5cbiAgICBfdGhpcy53cml0ZUJ5dGUgPSAoYjogYW55KSA9PiB7XG4gICAgICBfYnl0ZXMucHVzaChiICYgMHhmZik7XG4gICAgfTtcblxuICAgIF90aGlzLndyaXRlU2hvcnQgPSAoaTogYW55KSA9PiB7XG4gICAgICBfdGhpcy53cml0ZUJ5dGUoaSk7XG4gICAgICBfdGhpcy53cml0ZUJ5dGUoaSA+Pj4gOCk7XG4gICAgfTtcblxuICAgIF90aGlzLndyaXRlQnl0ZXMgPSAoYjogYW55LCBvZmY6IGFueSwgbGVuOiBhbnkpID0+IHtcbiAgICAgIG9mZiA9IG9mZiB8fCAwO1xuICAgICAgbGVuID0gbGVuIHx8IGIubGVuZ3RoO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkgKz0gMSkge1xuICAgICAgICBfdGhpcy53cml0ZUJ5dGUoYltpICsgb2ZmXSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIF90aGlzLndyaXRlU3RyaW5nID0gKHM6IGFueSkgPT4ge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIF90aGlzLndyaXRlQnl0ZShzLmNoYXJDb2RlQXQoaSkpO1xuICAgICAgfVxuICAgIH1cbiAgICA7XG5cbiAgICBfdGhpcy50b0J5dGVBcnJheSA9ICgpID0+IHtcbiAgICAgIHJldHVybiBfYnl0ZXM7XG4gICAgfTtcblxuICAgIF90aGlzLnRvU3RyaW5nID0gKCkgPT4ge1xuICAgICAgbGV0IHMgPSBcIlwiO1xuICAgICAgcyArPSBcIltcIjtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgX2J5dGVzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGlmIChpID4gMCkge1xuICAgICAgICAgIHMgKz0gXCIsXCI7XG4gICAgICAgIH1cbiAgICAgICAgcyArPSBfYnl0ZXNbaV07XG4gICAgICB9XG4gICAgICBzICs9IFwiXVwiO1xuICAgICAgcmV0dXJuIHM7XG4gICAgfTtcblxuICAgIHJldHVybiBfdGhpcztcbiAgfTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBiYXNlNjRFbmNvZGVPdXRwdXRTdHJlYW1cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIGNvbnN0IGJhc2U2NEVuY29kZU91dHB1dFN0cmVhbSA9ICgpID0+IHtcbiAgICBsZXQgX2J1ZmZlcjogYW55ID0gMDtcbiAgICBsZXQgX2J1ZmxlbjogYW55ID0gMDtcbiAgICBsZXQgX2xlbmd0aDogYW55ID0gMDtcbiAgICBsZXQgX2Jhc2U2NDogYW55ID0gXCJcIjtcblxuICAgIGNvbnN0IF90aGlzOiBhbnkgPSB7fTtcblxuICAgIGNvbnN0IHdyaXRlRW5jb2RlZCA9IChiOiBhbnkpID0+IHtcbiAgICAgIF9iYXNlNjQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShlbmNvZGUoYiAmIDB4M2YpKTtcbiAgICB9O1xuXG4gICAgY29uc3QgZW5jb2RlID0gKG46IGFueSkgPT4ge1xuICAgICAgICBpZiAobiA8IDApIHtcbiAgICAgICAgICAvLyBlcnJvci5cbiAgICAgICAgfSBlbHNlIGlmIChuIDwgMjYpIHtcbiAgICAgICAgICByZXR1cm4gMHg0MSArIG47XG4gICAgICAgIH0gZWxzZSBpZiAobiA8IDUyKSB7XG4gICAgICAgICAgcmV0dXJuIDB4NjEgKyAobiAtIDI2KTtcbiAgICAgICAgfSBlbHNlIGlmIChuIDwgNjIpIHtcbiAgICAgICAgICByZXR1cm4gMHgzMCArIChuIC0gNTIpO1xuICAgICAgICB9IGVsc2UgaWYgKG4gPT09IDYyKSB7XG4gICAgICAgICAgcmV0dXJuIDB4MmI7XG4gICAgICAgIH0gZWxzZSBpZiAobiA9PT0gNjMpIHtcbiAgICAgICAgICByZXR1cm4gMHgyZjtcbiAgICAgICAgfVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJuOlwiICsgbik7XG4gICAgICB9XG4gICAgO1xuXG4gICAgX3RoaXMud3JpdGVCeXRlID0gKG46IGFueSkgPT4ge1xuICAgICAgX2J1ZmZlciA9IChfYnVmZmVyIDw8IDgpIHwgKG4gJiAweGZmKTtcbiAgICAgIF9idWZsZW4gKz0gODtcbiAgICAgIF9sZW5ndGggKz0gMTtcblxuICAgICAgd2hpbGUgKF9idWZsZW4gPj0gNikge1xuICAgICAgICB3cml0ZUVuY29kZWQoX2J1ZmZlciA+Pj4gKF9idWZsZW4gLSA2KSk7XG4gICAgICAgIF9idWZsZW4gLT0gNjtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgX3RoaXMuZmx1c2ggPSAoKSA9PiB7XG4gICAgICBpZiAoX2J1ZmxlbiA+IDApIHtcbiAgICAgICAgd3JpdGVFbmNvZGVkKF9idWZmZXIgPDwgKDYgLSBfYnVmbGVuKSk7XG4gICAgICAgIF9idWZmZXIgPSAwO1xuICAgICAgICBfYnVmbGVuID0gMDtcbiAgICAgIH1cblxuICAgICAgaWYgKF9sZW5ndGggJSAzICE9PSAwKSB7XG4gICAgICAgIC8vIHBhZGRpbmdcbiAgICAgICAgY29uc3QgcGFkbGVuID0gMyAtIF9sZW5ndGggJSAzO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBhZGxlbjsgaSArPSAxKSB7XG4gICAgICAgICAgX2Jhc2U2NCArPSBcIj1cIjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICBfdGhpcy50b1N0cmluZyA9ICgpID0+IHtcbiAgICAgIHJldHVybiBfYmFzZTY0O1xuICAgIH07XG5cbiAgICByZXR1cm4gX3RoaXM7XG4gIH07XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gYmFzZTY0RGVjb2RlSW5wdXRTdHJlYW1cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIGNvbnN0IGJhc2U2NERlY29kZUlucHV0U3RyZWFtID0gKHN0cjogYW55KSA9PiB7XG4gICAgICBjb25zdCBfc3RyID0gc3RyO1xuICAgICAgbGV0IF9wb3MgPSAwO1xuICAgICAgbGV0IF9idWZmZXIgPSAwO1xuICAgICAgbGV0IF9idWZsZW4gPSAwO1xuXG4gICAgICBjb25zdCBfdGhpczogYW55ID0ge307XG5cbiAgICAgIF90aGlzLnJlYWQgPSAoKSA9PiB7XG4gICAgICAgIHdoaWxlIChfYnVmbGVuIDwgOCkge1xuICAgICAgICAgIGlmIChfcG9zID49IF9zdHIubGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAoX2J1ZmxlbiA9PT0gMCkge1xuICAgICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ1bmV4cGVjdGVkIGVuZCBvZiBmaWxlLi9cIiArIF9idWZsZW4pO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnN0IGMgPSBfc3RyLmNoYXJBdChfcG9zKTtcbiAgICAgICAgICBfcG9zICs9IDE7XG5cbiAgICAgICAgICBpZiAoYyA9PT0gXCI9XCIpIHtcbiAgICAgICAgICAgIF9idWZsZW4gPSAwO1xuICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICAgIH0gZWxzZSBpZiAoYy5tYXRjaCgvXlxccyQvKSkge1xuICAgICAgICAgICAgLy8gaWdub3JlIGlmIHdoaXRlc3BhY2UuXG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBfYnVmZmVyID0gKF9idWZmZXIgPDwgNikgfCBkZWNvZGUoYy5jaGFyQ29kZUF0KDApKTtcbiAgICAgICAgICBfYnVmbGVuICs9IDY7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBuID0gKF9idWZmZXIgPj4+IChfYnVmbGVuIC0gOCkpICYgMHhmZjtcbiAgICAgICAgX2J1ZmxlbiAtPSA4O1xuICAgICAgICByZXR1cm4gbjtcbiAgICAgIH07XG5cbiAgICAgIGNvbnN0IGRlY29kZSA9IChjOiBhbnkpID0+IHtcbiAgICAgICAgICBpZiAoMHg0MSA8PSBjICYmIGMgPD0gMHg1YSkge1xuICAgICAgICAgICAgcmV0dXJuIGMgLSAweDQxO1xuICAgICAgICAgIH0gZWxzZSBpZiAoMHg2MSA8PSBjICYmIGMgPD0gMHg3YSkge1xuICAgICAgICAgICAgcmV0dXJuIGMgLSAweDYxICsgMjY7XG4gICAgICAgICAgfSBlbHNlIGlmICgweDMwIDw9IGMgJiYgYyA8PSAweDM5KSB7XG4gICAgICAgICAgICByZXR1cm4gYyAtIDB4MzAgKyA1MjtcbiAgICAgICAgICB9IGVsc2UgaWYgKGMgPT09IDB4MmIpIHtcbiAgICAgICAgICAgIHJldHVybiA2MjtcbiAgICAgICAgICB9IGVsc2UgaWYgKGMgPT09IDB4MmYpIHtcbiAgICAgICAgICAgIHJldHVybiA2MztcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiYzpcIiArIGMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgO1xuXG4gICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuICA7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gcmV0dXJucyBxcmNvZGUgZnVuY3Rpb24uXG5cbiAgcmV0dXJuIHFyY29kZTtcbn0pXG4oKTtcblxuLy8gbXVsdGlieXRlIHN1cHBvcnRcbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby11bnVzZWQtZXhwcmVzc2lvblxuLy8gQHRzLWlnbm9yZVxuLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLXVudXNlZC1leHByZXNzaW9uXG4hKCgpID0+IHtcbiAgX3FyY29kZS5zdHJpbmdUb0J5dGVzRnVuY3NbXCJVVEYtOFwiXSA9IChzOiBhbnkpID0+IHtcbiAgICAvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzE4NzI5NDA1L2hvdy10by1jb252ZXJ0LXV0Zjgtc3RyaW5nLXRvLWJ5dGUtYXJyYXlcbiAgICBmdW5jdGlvbiB0b1VURjhBcnJheShzdHI6IGFueSkge1xuICAgICAgY29uc3QgdXRmOCA9IFtdO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbGV0IGNoYXJjb2RlID0gc3RyLmNoYXJDb2RlQXQoaSk7XG4gICAgICAgIGlmIChjaGFyY29kZSA8IDB4ODApIHtcbiAgICAgICAgICB1dGY4LnB1c2goY2hhcmNvZGUpO1xuICAgICAgICB9IGVsc2UgaWYgKGNoYXJjb2RlIDwgMHg4MDApIHtcbiAgICAgICAgICB1dGY4LnB1c2goMHhjMCB8IChjaGFyY29kZSA+PiA2KSwgMHg4MCB8IChjaGFyY29kZSAmIDB4M2YpKTtcbiAgICAgICAgfSBlbHNlIGlmIChjaGFyY29kZSA8IDB4ZDgwMCB8fCBjaGFyY29kZSA+PSAweGUwMDApIHtcbiAgICAgICAgICB1dGY4LnB1c2goXG4gICAgICAgICAgICAweGUwIHwgKGNoYXJjb2RlID4+IDEyKSxcbiAgICAgICAgICAgIDB4ODAgfCAoKGNoYXJjb2RlID4+IDYpICYgMHgzZiksXG4gICAgICAgICAgICAweDgwIHwgKGNoYXJjb2RlICYgMHgzZiksXG4gICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpKys7XG4gICAgICAgICAgLy8gVVRGLTE2IGVuY29kZXMgMHgxMDAwMC0weDEwRkZGRiBieVxuICAgICAgICAgIC8vIHN1YnRyYWN0aW5nIDB4MTAwMDAgYW5kIHNwbGl0dGluZyB0aGVcbiAgICAgICAgICAvLyAyMCBiaXRzIG9mIDB4MC0weEZGRkZGIGludG8gdHdvIGhhbHZlc1xuICAgICAgICAgIGNoYXJjb2RlID1cbiAgICAgICAgICAgIDB4MTAwMDAgK1xuICAgICAgICAgICAgKCgoY2hhcmNvZGUgJiAweDNmZikgPDwgMTApIHwgKHN0ci5jaGFyQ29kZUF0KGkpICYgMHgzZmYpKTtcbiAgICAgICAgICB1dGY4LnB1c2goXG4gICAgICAgICAgICAweGYwIHwgKGNoYXJjb2RlID4+IDE4KSxcbiAgICAgICAgICAgIDB4ODAgfCAoKGNoYXJjb2RlID4+IDEyKSAmIDB4M2YpLFxuICAgICAgICAgICAgMHg4MCB8ICgoY2hhcmNvZGUgPj4gNikgJiAweDNmKSxcbiAgICAgICAgICAgIDB4ODAgfCAoY2hhcmNvZGUgJiAweDNmKSxcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gdXRmODtcbiAgICB9XG5cbiAgICByZXR1cm4gdG9VVEY4QXJyYXkocyk7XG4gIH07XG59KVxuKCk7XG5tb2R1bGUuZXhwb3J0cyA9IF9xcmNvZGU7XG4iXX0=
