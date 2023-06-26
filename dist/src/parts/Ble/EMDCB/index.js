"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EMDCB {
    constructor() {
        this._peripheral = null;
    }
    static info() {
        return {
            name: 'EMDCB',
        };
    }
    /**
     */
    static isDevice(peripheral) {
        if (peripheral.adv_data[2] === 0xda && peripheral.adv_data[3] === 0x03) {
            return true;
        }
        else {
            return false;
        }
    }
    /**
     */
    static getData(peripheral) {
        const results = this.analyzeData(peripheral);
        let data;
        if (results.commissioning_info) {
            data = {
                address: peripheral.address,
                commissioning_info: results.commissioning_info,
            };
        }
        else {
            data = {
                address: peripheral.address,
                energy_level: results.energy_level,
                light_level_solar_cell: results.light_level_solar_cell,
                light_level_sensor: results.light_level_sensor,
                occupancy_status: results.occupancy_status,
            };
        }
        return data;
    }
    /**
     */
    static analyzeData(peripheral) {
        const sensorData = peripheral.adv_data.slice(8, -4);
        let i = 0;
        let isDescriptor = true;
        let dataLength = 1;
        let typeId = 0;
        const results = {};
        while (i < sensorData.length) {
            if (isDescriptor) {
                const descriptor = sensorData[i];
                switch (descriptor >> 6) {
                    case 0:
                        dataLength = 1;
                        break;
                    case 1:
                        dataLength = 2;
                        break;
                    case 2:
                        dataLength = 4;
                        break;
                    case 3:
                        dataLength = 1; // extended
                        break;
                    default:
                        throw new Error('data that cannot be analyzed');
                }
                typeId = descriptor & 0b111111;
                isDescriptor = false;
                i += 1;
            }
            else {
                let data = 0;
                switch (dataLength) {
                    case 0x01:
                        if (typeId === 0x3e) {
                            dataLength = 22;
                        }
                        else {
                            data = sensorData[i];
                        }
                        break;
                    case 0x02:
                        data = (sensorData[i + 1] << 8) + sensorData[i];
                        break;
                    default:
                        throw new Error('data that cannot be analyzed');
                }
                switch (typeId) {
                    case 0x01:
                        results.backup_battery_voltage = data / 2;
                        break;
                    case 0x02:
                        results.energy_level = data / 2;
                        break;
                    case 0x04:
                        results.light_level_solar_cell = data;
                        break;
                    case 0x05:
                        results.light_level_sensor = data;
                        break;
                    case 0x20:
                        if (data === 1) {
                            results.occupancy_status = false;
                        }
                        else if (data === 2) {
                            results.occupancy_status = true;
                        }
                        break;
                    case 0x3e:
                        results.commissioning_info = peripheral.adv_data.slice(9);
                        break;
                    default:
                        throw new Error('data that cannot be analyzed');
                }
                i += dataLength;
                isDescriptor = true;
            }
        }
        return results;
    }
}
exports.default = EMDCB;
