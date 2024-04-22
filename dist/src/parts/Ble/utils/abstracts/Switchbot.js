"use strict";
/**
 * @packageDocumentation
 * @module Parts.Switchbot
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Switchbot = void 0;
const advertismentAnalyzer_1 = require("../../utils/advertisement/advertismentAnalyzer");
const bleRemoteCommandSequence_1 = require("../../../../obniz/libs/embeds/bleHci/bleRemoteCommandSequence");
class Switchbot {
    constructor(peripheral) {
        this._peripheral = peripheral;
    }
    static getServiceDataPayload(peripheral, deviceType, serviceDataPayloadLength) {
        var _a;
        const deviceTypeArray = typeof deviceType === 'number' ? [deviceType] : deviceType;
        // ex  020106 09ff 5900 dddad5bd529a
        const deviceAdvAnalyzerType = new advertismentAnalyzer_1.BleAdvBinaryAnalyzer()
            .addTarget('flag', [0x02, 0x01, 0x06])
            .groupStart('manufacture')
            .addTarget('length', [-1])
            .addTarget('type', [0xff])
            .addTarget('companyId', [-1, -1]) // [0x59, 0x00] or [0x69, 0x09]
            .addTargetByLength('deviceAddress', 6)
            .groupEnd();
        // ex 000d481064
        const deviceServiceDataAnalyzer = new advertismentAnalyzer_1.BleAdvBinaryAnalyzer()
            .addTarget('uuid', [-1, -1]) // [0x3d, 0xfd] or [0x0d, 0x00]
            .addTarget('deviceType', [-1])
            .addTargetByLength('payload', serviceDataPayloadLength);
        const advData = deviceAdvAnalyzerType.getAllData(peripheral.adv_data);
        const serviceData = deviceServiceDataAnalyzer.getAllData((_a = peripheral.serviceData) !== null && _a !== void 0 ? _a : []);
        // companyId : [0x59, 0x00] or [0x69, 0x09]
        const isAdvDataValid = !!advData &&
            ((advData.manufacture.companyId[0] === 0x59 &&
                advData.manufacture.companyId[1] === 0x00) ||
                (advData.manufacture.companyId[0] === 0x69 &&
                    advData.manufacture.companyId[1] === 0x09));
        // uuid:  [0x3d, 0xfd] or [ 0x00, 0x0d]
        // bot : 0x48(no encryption) or 0xC8(encryption algorithm 1)
        const isValidServiceData = !!serviceData &&
            ((serviceData.uuid[0] === 0x3d && serviceData.uuid[1] === 0xfd) ||
                (serviceData.uuid[0] === 0x00 && serviceData.uuid[1] === 0x0d)) &&
            deviceTypeArray.includes(serviceData.deviceType[0]);
        if (serviceData && isAdvDataValid && isValidServiceData) {
            return serviceData.payload;
        }
        return null;
    }
    static isSwitchbotDevice(peripheral, deviceType, serviceDataPayloadLength) {
        const payload = Switchbot.getServiceDataPayload(peripheral, deviceType, serviceDataPayloadLength);
        return payload !== null;
    }
    async connectWait(setting) {
        await this._peripheral.connectWait(setting);
        this._peripheral.ondisconnect = (reason) => {
            if (typeof this.ondisconnect === 'function') {
                this.ondisconnect(reason);
            }
        };
        const service = this._peripheral.getService('cba20d00-224d-11e6-9fb8-0002a5d5c51b');
        if (!service) {
            throw new Error(`no service found`);
        }
        const rxFromTargetCharacteristic = service.getCharacteristic('cba20003-224d-11e6-9fb8-0002a5d5c51b');
        const txToTargetCharacteristic = service.getCharacteristic('cba20002-224d-11e6-9fb8-0002a5d5c51b');
        this._commandSequence = new bleRemoteCommandSequence_1.BleRemoteCommandSequence(txToTargetCharacteristic, rxFromTargetCharacteristic);
        await this._commandSequence.setupWait();
    }
    _createCommand(command, payload) {
        return [
            0x57,
            command,
            ...payload,
        ];
    }
}
exports.Switchbot = Switchbot;
