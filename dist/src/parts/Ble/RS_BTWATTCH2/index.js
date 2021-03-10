"use strict";
/**
 * @packageDocumentation
 * @module Parts.RS_BTWATTCH2
 */
Object.defineProperty(exports, "__esModule", { value: true });
class RS_BTWATTCH2 {
    constructor(peripheral) {
        this.keys = [];
        this.requiredKeys = [];
        this._uuids = {
            service: "00001523-1212-EFDE-1523-785FEABCD123",
            buttonChar: "000000A1-1212-EFDE-1523-785FEABCD123",
            continuousMeasurementChar: "000000A5-1212-EFDE-1523-785FEABCD123",
            oneShotMeasurementChar: "000000A8-1212-EFDE-1523-785FEABCD123",
            ledChar: "000000A9-1212-EFDE-1523-785FEABCD123",
        };
        if (peripheral && !RS_BTWATTCH2.isDevice(peripheral)) {
            throw new Error("peripheral is not RS_BTWATTCH2");
        }
        this._peripheral = peripheral;
    }
    static info() {
        return {
            name: "RS_BTWATTCH2",
        };
    }
    static isDevice(peripheral) {
        return peripheral.localName && peripheral.localName.indexOf("BTWATTCH2") >= 0;
    }
    // @ts-ignore
    wired(obniz) { }
    async firstPairingWait() {
        if (!this._peripheral) {
            throw new Error("No Peripheral Found");
        }
        this._peripheral.ondisconnect = (reason) => {
            if (typeof this.ondisconnect === "function") {
                this.ondisconnect(reason);
            }
        };
        return await new Promise(async (resolve, reject) => {
            try {
                let gotKeys;
                await this._peripheral.connectWait({
                    pairingOption: {
                        onPairedCallback: (keys) => {
                            gotKeys = keys;
                        },
                        onPairingFailed: (e) => {
                            reject(e);
                        },
                    },
                });
                await this._peripheral.disconnectWait();
                resolve(gotKeys);
            }
            catch (e) {
                reject(e);
            }
        });
    }
    async connectWait(keys) {
        if (!keys) {
            throw new Error(`You should get keys before. call firstPairingWait() to get keys and provide this`);
        }
        await this._peripheral.connectWait({
            pairingOption: {
                keys,
            },
        });
        this._peripheral.ondisconnect = (reason) => {
            if (typeof this.ondisconnect === "function") {
                this.ondisconnect(reason);
            }
        };
        const service = this._peripheral.getService("6e400001b5a3f393e0a9e50e24dcca9e");
        if (!service) {
            throw new Error(`no serivce found`);
        }
        this._rxFromTargetCharacteristic = service.getCharacteristic("6e400003b5a3f393e0a9e50e24dcca9e");
        this._txToTargetCharacteristic = service.getCharacteristic("6e400002b5a3f393e0a9e50e24dcca9e");
        await this._rxFromTargetCharacteristic.registerNotifyWait((data) => {
            console.log("notify with data " + data.join(","));
        });
    }
    async disconnectWait() {
        var _a;
        await ((_a = this._peripheral) === null || _a === void 0 ? void 0 : _a.disconnectWait());
    }
    async _transaction(data, length) {
        const send = this._createData(data);
        // console.log(`send`, send);
        await this._txToTargetCharacteristic.writeWait(send);
        // return;
        // let ret = await rxChar.readWait();
        // console.log(`result`, ret);
        // return;
        // if (!ret || ret.length < 2) {
        //   throw new Error(`invalid response`);
        // }
        // if (ret[0] !== data[0]) {
        //   throw new Error(`response command mismatch`);
        // }
        // if (ret[1] !== 0) {
        //   throw new Error(`comand [${data[0]}] failed with error [${ret[1]}]`);
        // }
        // while (ret.length < length) {
        //   console.log("here");
        //   let next = await rxChar.readWait();
        //   console.log(`result`, next);
        //   ret.push(...next);
        // }
        // return ret.slice(2);
    }
    _createData(data) {
        const cmd = Buffer.alloc(data.length + 4);
        cmd.writeUInt8(0xaa, 0);
        cmd.writeUInt16BE(data.length, 1);
        Buffer.from(data).copy(cmd, 3);
        cmd.writeUInt8(this._GetCRC8(data), data.length + 3);
        return [...cmd];
    }
    _GetCRC8(arr) {
        const CRC8Table = [
            0x00,
            0x85,
            0x8f,
            0x0a,
            0x9b,
            0x1e,
            0x14,
            0x91,
            0xb3,
            0x36,
            0x3c,
            0xb9,
            0x28,
            0xad,
            0xa7,
            0x22,
            0xe3,
            0x66,
            0x6c,
            0xe9,
            0x78,
            0xfd,
            0xf7,
            0x72,
            0x50,
            0xd5,
            0xdf,
            0x5a,
            0xcb,
            0x4e,
            0x44,
            0xc1,
            0x43,
            0xc6,
            0xcc,
            0x49,
            0xd8,
            0x5d,
            0x57,
            0xd2,
            0xf0,
            0x75,
            0x7f,
            0xfa,
            0x6b,
            0xee,
            0xe4,
            0x61,
            0xa0,
            0x25,
            0x2f,
            0xaa,
            0x3b,
            0xbe,
            0xb4,
            0x31,
            0x13,
            0x96,
            0x9c,
            0x19,
            0x88,
            0x0d,
            0x07,
            0x82,
            0x86,
            0x03,
            0x09,
            0x8c,
            0x1d,
            0x98,
            0x92,
            0x17,
            0x35,
            0xb0,
            0xba,
            0x3f,
            0xae,
            0x2b,
            0x21,
            0xa4,
            0x65,
            0xe0,
            0xea,
            0x6f,
            0xfe,
            0x7b,
            0x71,
            0xf4,
            0xd6,
            0x53,
            0x59,
            0xdc,
            0x4d,
            0xc8,
            0xc2,
            0x47,
            0xc5,
            0x40,
            0x4a,
            0xcf,
            0x5e,
            0xdb,
            0xd1,
            0x54,
            0x76,
            0xf3,
            0xf9,
            0x7c,
            0xed,
            0x68,
            0x62,
            0xe7,
            0x26,
            0xa3,
            0xa9,
            0x2c,
            0xbd,
            0x38,
            0x32,
            0xb7,
            0x95,
            0x10,
            0x1a,
            0x9f,
            0x0e,
            0x8b,
            0x81,
            0x04,
            0x89,
            0x0c,
            0x06,
            0x83,
            0x12,
            0x97,
            0x9d,
            0x18,
            0x3a,
            0xbf,
            0xb5,
            0x30,
            0xa1,
            0x24,
            0x2e,
            0xab,
            0x6a,
            0xef,
            0xe5,
            0x60,
            0xf1,
            0x74,
            0x7e,
            0xfb,
            0xd9,
            0x5c,
            0x56,
            0xd3,
            0x42,
            0xc7,
            0xcd,
            0x48,
            0xca,
            0x4f,
            0x45,
            0xc0,
            0x51,
            0xd4,
            0xde,
            0x5b,
            0x79,
            0xfc,
            0xf6,
            0x73,
            0xe2,
            0x67,
            0x6d,
            0xe8,
            0x29,
            0xac,
            0xa6,
            0x23,
            0xb2,
            0x37,
            0x3d,
            0xb8,
            0x9a,
            0x1f,
            0x15,
            0x90,
            0x01,
            0x84,
            0x8e,
            0x0b,
            0x0f,
            0x8a,
            0x80,
            0x05,
            0x94,
            0x11,
            0x1b,
            0x9e,
            0xbc,
            0x39,
            0x33,
            0xb6,
            0x27,
            0xa2,
            0xa8,
            0x2d,
            0xec,
            0x69,
            0x63,
            0xe6,
            0x77,
            0xf2,
            0xf8,
            0x7d,
            0x5f,
            0xda,
            0xd0,
            0x55,
            0xc4,
            0x41,
            0x4b,
            0xce,
            0x4c,
            0xc9,
            0xc3,
            0x46,
            0xd7,
            0x52,
            0x58,
            0xdd,
            0xff,
            0x7a,
            0x70,
            0xf5,
            0x64,
            0xe1,
            0xeb,
            0x6e,
            0xaf,
            0x2a,
            0x20,
            0xa5,
            0x34,
            0xb1,
            0xbb,
            0x3e,
            0x1c,
            0x99,
            0x93,
            0x16,
            0x87,
            0x02,
            0x08,
            0x8d,
        ];
        let crc8 = 0x00;
        for (const data of arr) {
            crc8 = CRC8Table[(crc8 ^ (data & 0xff)) & 0xff];
        }
        return crc8;
    }
}
exports.default = RS_BTWATTCH2;
