/**
 * @packageDocumentation
 * @module Parts.Linking
 */
/* ------------------------------------------------------------------
 * node-linking - advertising.js
 *
 * Copyright (c) 2017-2019, Futomi Hatano, All rights reserved.
 * Released under the MIT license
 * Date: 2019-11-02
 * ---------------------------------------------------------------- */
'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ieee754_1 = __importDefault(require("./ieee754"));
class LinkingAdvertising {
    static parse(peripheral) {
        const ad = peripheral;
        if (ad.adv_data.length < 5) {
            return null;
        }
        const manu = Buffer.from(ad.adv_data.slice(5));
        //    const manu = ad.manufacturerData;
        if (!manu || manu.length < 8) {
            return null;
        }
        // Company identifier
        const company_id = manu.readUInt16LE(0);
        let company_name = 'Unknown';
        if (company_id === 0x02e2) {
            company_name = 'NTT docomo';
        }
        // Version
        const version = manu.readUInt8(2) >>> 4;
        // Vendor identifier
        const vendor_id = (manu.readUInt16BE(2) >>> 4) & 0b11111111;
        // Individual number
        const indi_num = (manu.readUInt32BE(3) >>> 8) & (Math.pow(2, 20) - 1);
        // Beacon Data
        const beacon_data_list = [];
        for (let offset = 6; offset < manu.length; offset += 2) {
            const beacon_buf = manu.slice(offset, offset + 2);
            // Beacon service data
            if (beacon_buf.length === 2) {
                const beacon_data = this._parseBeaconServiceData(beacon_buf);
                beacon_data_list.push(beacon_data);
            }
        }
        return {
            id: peripheral.id,
            uuid: peripheral.uuid,
            address: peripheral.address,
            localName: ad.localName,
            serviceUuids: ad.serviceUuids,
            txPowerLevel: 0,
            rssi: peripheral.rssi,
            distance: Math.pow(10, (ad.txPowerLevel - peripheral.rssi) / 20),
            companyId: company_id,
            companyName: company_name,
            version,
            vendorId: vendor_id,
            individualNumber: indi_num,
            beaconDataList: beacon_data_list,
        };
    }
    static _parseBeaconServiceData(buf) {
        const bufn = buf.readUInt16BE(0);
        const service_id = bufn >>> 12;
        const n = bufn & 0b0000111111111111;
        let res = {};
        if (service_id === 0) {
            res = {
                name: 'General',
            };
        }
        else if (service_id === 1) {
            res = {
                name: 'Temperature (°C)',
                temperature: ieee754_1.default.read(n, 1, 4, 7),
            };
        }
        else if (service_id === 2) {
            res = {
                name: 'Humidity (%)',
                humidity: ieee754_1.default.read(n, 0, 4, 8),
            };
        }
        else if (service_id === 3) {
            res = {
                name: 'Air pressure (hPa)',
                pressure: ieee754_1.default.read(n, 0, 5, 7),
            };
        }
        else if (service_id === 4) {
            res = {
                name: 'Remaining battery power (Threshold value or less)',
                chargeRequired: n & 0b0000100000000000 ? true : false,
                chargeLevel: Math.min((n & 0b0000011111111111) / 10, 100),
            };
        }
        else if (service_id === 5) {
            const code = n & 0b0000111111111111;
            let text = '';
            if (code === 0x00) {
                text = 'Power';
            }
            else if (code === 0x01) {
                text = 'Return';
            }
            else if (code === 0x02) {
                text = 'SingleClick';
            }
            else if (code === 0x03) {
                text = 'Home';
            }
            else if (code === 0x04) {
                text = 'DoubleClick';
            }
            else if (code === 0x05) {
                text = 'VolumeUp';
            }
            else if (code === 0x06) {
                text = 'VolumeDown';
            }
            else if (code === 0x07) {
                text = 'LongPress';
            }
            else if (code === 0x08) {
                text = 'Pause';
            }
            else if (code === 0x09) {
                text = 'LongPressRelease';
            }
            else if (code === 0x0a) {
                text = 'FastForward';
            }
            else if (code === 0x0b) {
                text = 'ReWind';
            }
            else if (code === 0x0c) {
                text = 'Shutter';
            }
            else if (code === 0x0d) {
                text = 'Up';
            }
            else if (code === 0x0e) {
                text = 'Down';
            }
            else if (code === 0x0f) {
                text = 'Left';
            }
            else if (code === 0x10) {
                text = 'Right';
            }
            else if (code === 0x11) {
                text = 'Enter';
            }
            else if (code === 0x12) {
                text = 'Menu';
            }
            else if (code === 0x13) {
                text = 'Play';
            }
            else if (code === 0x14) {
                text = 'Stop';
            }
            res = {
                name: 'Pressed button information',
                buttonId: code,
                buttonName: text,
            };
        }
        else if (service_id === 6) {
            res = {
                name: 'Opening/closing',
                openingStatus: n & 0b0000100000000000 ? true : false,
                openingCount: n & 0b0000011111111111,
            };
        }
        else if (service_id === 7) {
            res = {
                name: 'Human detection',
                humanDetectionResponse: n & 0b0000100000000000 ? true : false,
                humanDetectionCount: n & 0b0000011111111111,
            };
        }
        else if (service_id === 8) {
            res = {
                name: 'Vibration',
                moveResponse: n & 0b0000100000000000 ? true : false,
                moveCount: n & 0b0000011111111111,
            };
        }
        else if (service_id === 9) {
            let illuminance = n;
            if (n >> 11) {
                illuminance = (n - 2047) * 50 + 2000;
            }
            res = {
                name: 'Illuminance (lx)',
                illuminance,
            };
        }
        else if (service_id === 15) {
            res = {
                name: 'Vendor',
                bin: ('000000000000' + n.toString(2)).slice(-12),
            };
        }
        res.serviceId = service_id;
        return res;
    }
}
exports.default = LinkingAdvertising;
