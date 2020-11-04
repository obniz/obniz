"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @packageDocumentation
 * @ignore
 */
const jsonBinaryConverter_1 = __importDefault(require("./jsonBinaryConverter"));
const WSCommand_1 = __importDefault(require("./WSCommand"));
class WSCommandWiFi extends WSCommand_1.default {
    constructor() {
        super();
        this.module = 14;
        this._CommandScan = 0;
    }
    scan(params, index) {
        this.sendCommand(this._CommandScan, null);
    }
    parseFromJson(json) {
        const module = json.wifi;
        if (module === undefined) {
            return;
        }
        const schemaData = [{ uri: "/request/wifi/scan", onValid: this.scan }];
        const res = this.validateCommandSchema(schemaData, module, "wifi");
        if (res.valid === 0) {
            if (res.invalidButLike.length > 0) {
                throw new Error(res.invalidButLike[0].message);
            }
            else {
                throw new this.WSCommandNotFoundError(`[network]unknown command`);
            }
        }
    }
    notifyFromBinary(objToSend, func, payload) {
        switch (func) {
            case this._CommandScan: {
                let ScanState;
                (function (ScanState) {
                    ScanState[ScanState["SCAN_SSID_LEN"] = 0] = "SCAN_SSID_LEN";
                    ScanState[ScanState["SCAN_SSID"] = 1] = "SCAN_SSID";
                    ScanState[ScanState["SCAN_MAC"] = 2] = "SCAN_MAC";
                    ScanState[ScanState["SCAN_RSSI"] = 3] = "SCAN_RSSI";
                })(ScanState || (ScanState = {}));
                let mode = ScanState.SCAN_SSID_LEN;
                let tmpIndex = 0;
                let ssid = "";
                let macAddress = "";
                let rssi = 0;
                const scanArray = [];
                for (let i = 0; i < payload.length; i++) {
                    switch (mode) {
                        case ScanState.SCAN_SSID_LEN:
                            tmpIndex = payload[i];
                            mode = ScanState.SCAN_SSID;
                            break;
                        case ScanState.SCAN_SSID:
                            ssid += String.fromCharCode(payload[i]);
                            tmpIndex--;
                            if (tmpIndex === 0) {
                                mode = ScanState.SCAN_MAC;
                                tmpIndex = 0;
                            }
                            break;
                        case ScanState.SCAN_MAC:
                            macAddress += String.fromCharCode(payload[i]);
                            tmpIndex++;
                            if (tmpIndex === 12) {
                                mode = ScanState.SCAN_RSSI;
                            }
                            break;
                        case ScanState.SCAN_RSSI:
                            rssi = jsonBinaryConverter_1.default.signedNumberFromBinary([payload[i]]);
                            mode = ScanState.SCAN_SSID_LEN;
                            scanArray.push({
                                ssid,
                                macAddress,
                                rssi,
                            });
                            ssid = "";
                            macAddress = "";
                            rssi = 0;
                            break;
                    }
                }
                objToSend.wifi = {
                    scan: scanArray,
                };
                break;
            }
        }
    }
}
exports.default = WSCommandWiFi;
