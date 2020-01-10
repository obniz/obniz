"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bleAdvertisement_1 = __importDefault(require("./bleAdvertisement"));
const bleCharacteristic_1 = __importDefault(require("./bleCharacteristic"));
const bleDescriptor_1 = __importDefault(require("./bleDescriptor"));
const blePeripheral_1 = __importDefault(require("./blePeripheral"));
const bleRemotePeripheral_1 = __importDefault(require("./bleRemotePeripheral"));
const bleScan_1 = __importDefault(require("./bleScan"));
const bleSecurity_1 = __importDefault(require("./bleSecurity"));
const bleService_1 = __importDefault(require("./bleService"));
class ObnizBLE {
    constructor(Obniz) {
        this.Obniz = Obniz;
        this.remotePeripherals = [];
        this.service = bleService_1.default;
        this.characteristic = bleCharacteristic_1.default;
        this.descriptor = bleDescriptor_1.default;
        this.peripheral = new blePeripheral_1.default(Obniz);
        this.scanTarget = null;
        this.advertisement = new bleAdvertisement_1.default(Obniz);
        this.scan = new bleScan_1.default(Obniz);
        this.security = new bleSecurity_1.default(Obniz);
        this._reset();
    }
    static _dataArray2uuidHex(data, reverse) {
        let uuid = [];
        for (let i = 0; i < data.length; i++) {
            uuid.push(("00" + data[i].toString(16).toLowerCase()).slice(-2));
        }
        if (reverse) {
            uuid = uuid.reverse();
        }
        let str = uuid.join("");
        if (uuid.length >= 16) {
            str =
                str.slice(0, 8) +
                    "-" +
                    str.slice(8, 12) +
                    "-" +
                    str.slice(12, 16) +
                    "-" +
                    str.slice(16, 20) +
                    "-" +
                    str.slice(20);
        }
        return str;
    }
    // dummy
    initWait() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    _reset() {
    }
    directConnect(uuid, addressType) {
        throw new Error("directConnect cannot use obnizOS < 3.0.0. Please update obnizOS");
    }
    directConnectWait(uuid, addressType) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("directConnectWait cannot use obnizOS < 3.0.0. Please update obnizOS");
        });
    }
    findPeripheral(address) {
        for (const key in this.remotePeripherals) {
            if (this.remotePeripherals[key].address === address) {
                return this.remotePeripherals[key];
            }
        }
        return null;
    }
    notified(obj) {
        if (obj.scan_result) {
            let val = this.findPeripheral(obj.scan_result.address);
            if (!val) {
                val = new bleRemotePeripheral_1.default(this.Obniz, obj.scan_result.address);
                this.remotePeripherals.push(val);
            }
            val.discoverdOnRemote = true;
            val.setParams(obj.scan_result);
            this.scan.notifyFromServer("onfind", val);
        }
        if (obj.scan_result_finish) {
            this.scan.notifyFromServer("onfinish");
        }
        const remotePeripheralCallbackFunc = (val, func, type) => {
            let target = null;
            if (val === undefined) {
                return;
            }
            const p = this.findPeripheral(val.address);
            if (!p) {
                return;
            }
            if (type === "peripheral") {
                target = p;
            }
            else if (type === "service") {
                target = p.findService(val);
            }
            else if (type === "characteristic") {
                target = p.findCharacteristic(val);
            }
            else if (type === "descriptor") {
                target = p.findDescriptor(val);
            }
            if (!target) {
                return;
            }
            func(val, target);
        };
        const paramList = {
            status_update: { name: "statusupdate", obj: "peripheral" },
            get_service_result: { name: "discover", obj: "peripheral" },
            get_service_result_finish: {
                name: "discoverfinished",
                obj: "peripheral",
            },
            get_characteristic_result: { name: "discover", obj: "service" },
            get_characteristic_result_finish: {
                name: "discoverfinished",
                obj: "service",
            },
            write_characteristic_result: { name: "onwrite", obj: "characteristic" },
            read_characteristic_result: { name: "onread", obj: "characteristic" },
            register_notify_characteristic_result: {
                name: "onregisternotify",
                obj: "characteristic",
            },
            // for typo
            register_nofity_characteristic_result: {
                name: "onregisternotify",
                obj: "characteristic",
            },
            unregister_notify_characteristic_result: {
                name: "onunregisternotify",
                obj: "characteristic",
            },
            // for typo
            unregister_nofity_characteristic_result: {
                name: "onunregisternotify",
                obj: "characteristic",
            },
            notify_characteristic: { name: "onnotify", obj: "characteristic" },
            // for typo
            nofity_characteristic: { name: "onnotify", obj: "characteristic" },
            get_descriptor_result: { name: "discover", obj: "characteristic" },
            get_descriptor_result_finish: {
                name: "discoverfinished",
                obj: "characteristic",
            },
            write_descriptor_result: { name: "onwrite", obj: "descriptor" },
            read_descriptor_result: { name: "onread", obj: "descriptor" },
        };
        for (const paramListKey in paramList) {
            remotePeripheralCallbackFunc(obj[paramListKey], (val, bleobj) => {
                bleobj.notifyFromServer(paramList[paramListKey].name, val);
            }, paramList[paramListKey].obj);
        }
        const callbackFunc = (val, func, type) => {
            let target = null;
            if (val === undefined) {
                return;
            }
            if (type === "peripheral") {
                target = this.peripheral;
            }
            else if (type === "service") {
                target = this.peripheral.getService(val);
            }
            else if (type === "characteristic") {
                target = this.peripheral.findCharacteristic(val);
            }
            else if (type === "descriptor") {
                target = this.peripheral.findDescriptor(val);
            }
            if (!target) {
                return;
            }
            func(val, target);
        };
        if (obj.peripheral) {
            callbackFunc(obj.peripheral.connection_status, (val) => {
                this.peripheral.onconnectionupdates(val);
            }, "peripheral");
            const centralParamList = {
                read_characteristic_result: { name: "onread", obj: "characteristic" },
                write_characteristic_result: { name: "onwrite", obj: "characteristic" },
                notify_read_characteristic: {
                    name: "onreadfromremote",
                    obj: "characteristic",
                },
                notify_write_characteristic: {
                    name: "onwritefromremote",
                    obj: "characteristic",
                },
                read_descriptor_result: { name: "onread", obj: "descriptor" },
                write_descriptor_result: { name: "onwrite", obj: "descriptor" },
                notify_read_descriptor: { name: "onreadfromremote", obj: "descriptor" },
                notify_write_descriptor: {
                    name: "onwritefromremote",
                    obj: "descriptor",
                },
            };
            for (const key in centralParamList) {
                callbackFunc(obj.peripheral[key], (val, bleobj) => {
                    bleobj.notifyFromServer(centralParamList[key].name, val);
                }, centralParamList[key].obj);
            }
        }
        if (obj.error) {
            const params = obj.error;
            let handled = false;
            let peripheral;
            let target;
            if (!params.address) {
                peripheral = this.peripheral;
            }
            else {
                peripheral = this.findPeripheral(params.address);
            }
            if (peripheral) {
                if (params.service_uuid &&
                    params.characteristic_uuid &&
                    params.descriptor_uuid) {
                    target = peripheral.findDescriptor(params);
                }
                else if (params.service_uuid && params.characteristic_uuid) {
                    target = peripheral.findCharacteristic(params);
                }
                else if (params.service_uuid) {
                    target = peripheral.findService(params);
                }
                if (target) {
                    target.notifyFromServer("onerror", params);
                    handled = true;
                }
                else {
                    peripheral.onerror(params);
                    handled = true;
                }
            }
            if ([35, 36, 37, 38, 39].includes(params.function_code)) {
                this.security.onerror(params);
                handled = true;
            }
            if (!handled) {
                this.Obniz.error(`ble ${params.message} service=${params.service_uuid} characteristic_uuid=${params.characteristic_uuid} descriptor_uuid=${params.descriptor_uuid}`);
            }
        }
    }
}
exports.default = ObnizBLE;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9vYm5pei9saWJzL2VtYmVkcy9ibGUvYmxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQUEsMEVBQWtEO0FBQ2xELDRFQUFvRDtBQUNwRCxvRUFBNEM7QUFDNUMsb0VBQTRDO0FBQzVDLGdGQUF3RDtBQUN4RCx3REFBZ0M7QUFDaEMsZ0VBQXdDO0FBQ3hDLDhEQUFzQztBQUV0QyxNQUFNLFFBQVE7SUFxQ1osWUFBWSxLQUFVO1FBQ3BCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxFQUFFLENBQUM7UUFFNUIsSUFBSSxDQUFDLE9BQU8sR0FBRyxvQkFBVSxDQUFDO1FBQzFCLElBQUksQ0FBQyxjQUFjLEdBQUcsMkJBQWlCLENBQUM7UUFDeEMsSUFBSSxDQUFDLFVBQVUsR0FBRyx1QkFBYSxDQUFDO1FBQ2hDLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSx1QkFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRTNDLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1FBRXZCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSwwQkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNqRCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksaUJBQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMvQixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUkscUJBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN2QyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDaEIsQ0FBQztJQWxETSxNQUFNLENBQUMsa0JBQWtCLENBQUMsSUFBUyxFQUFFLE9BQVk7UUFDdEQsSUFBSSxJQUFJLEdBQVEsRUFBRSxDQUFDO1FBQ25CLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3BDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDbEU7UUFDRCxJQUFJLE9BQU8sRUFBRTtZQUNYLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7U0FDdkI7UUFDRCxJQUFJLEdBQUcsR0FBUSxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzdCLElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxFQUFFLEVBQUU7WUFDckIsR0FBRztnQkFDRCxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7b0JBQ2YsR0FBRztvQkFDSCxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUM7b0JBQ2hCLEdBQUc7b0JBQ0gsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDO29CQUNqQixHQUFHO29CQUNILEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQztvQkFDakIsR0FBRztvQkFDSCxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQ2pCO1FBQ0QsT0FBTyxHQUFHLENBQUM7SUFDYixDQUFDO0lBOEJELFFBQVE7SUFDSyxRQUFROztRQUNyQixDQUFDO0tBQUE7SUFFTSxNQUFNO0lBQ2IsQ0FBQztJQUVNLGFBQWEsQ0FBQyxJQUFTLEVBQUUsV0FBZ0I7UUFDOUMsTUFBTSxJQUFJLEtBQUssQ0FDYixpRUFBaUUsQ0FDbEUsQ0FBQztJQUNKLENBQUM7SUFFWSxpQkFBaUIsQ0FBQyxJQUFTLEVBQUUsV0FBZ0I7O1lBQ3hELE1BQU0sSUFBSSxLQUFLLENBQ2IscUVBQXFFLENBQ3RFLENBQUM7UUFDSixDQUFDO0tBQUE7SUFFTSxjQUFjLENBQUMsT0FBWTtRQUNoQyxLQUFLLE1BQU0sR0FBRyxJQUFJLElBQUksQ0FBQyxpQkFBaUIsRUFBRTtZQUN4QyxJQUFJLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLEtBQUssT0FBTyxFQUFFO2dCQUNuRCxPQUFPLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUNwQztTQUNGO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRU0sUUFBUSxDQUFDLEdBQVE7UUFDdEIsSUFBSSxHQUFHLENBQUMsV0FBVyxFQUFFO1lBQ25CLElBQUksR0FBRyxHQUFRLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUM1RCxJQUFJLENBQUMsR0FBRyxFQUFFO2dCQUNSLEdBQUcsR0FBRyxJQUFJLDZCQUFtQixDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDbkUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUNsQztZQUNELEdBQUcsQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUM7WUFDN0IsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7WUFFL0IsSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLENBQUM7U0FDM0M7UUFFRCxJQUFJLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRTtZQUMxQixJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxDQUFDO1NBQ3hDO1FBRUQsTUFBTSw0QkFBNEIsR0FBUSxDQUFDLEdBQVEsRUFBRSxJQUFTLEVBQUUsSUFBUyxFQUFFLEVBQUU7WUFDM0UsSUFBSSxNQUFNLEdBQVEsSUFBSSxDQUFDO1lBQ3ZCLElBQUksR0FBRyxLQUFLLFNBQVMsRUFBRTtnQkFDckIsT0FBTzthQUNSO1lBQ0QsTUFBTSxDQUFDLEdBQVEsSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDaEQsSUFBSSxDQUFDLENBQUMsRUFBRTtnQkFDTixPQUFPO2FBQ1I7WUFDRCxJQUFJLElBQUksS0FBSyxZQUFZLEVBQUU7Z0JBQ3pCLE1BQU0sR0FBRyxDQUFDLENBQUM7YUFDWjtpQkFBTSxJQUFJLElBQUksS0FBSyxTQUFTLEVBQUU7Z0JBQzdCLE1BQU0sR0FBRyxDQUFDLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQzdCO2lCQUFNLElBQUksSUFBSSxLQUFLLGdCQUFnQixFQUFFO2dCQUNwQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ3BDO2lCQUFNLElBQUksSUFBSSxLQUFLLFlBQVksRUFBRTtnQkFDaEMsTUFBTSxHQUFHLENBQUMsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDaEM7WUFDRCxJQUFJLENBQUMsTUFBTSxFQUFFO2dCQUNYLE9BQU87YUFDUjtZQUNELElBQUksQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDcEIsQ0FBQyxDQUFDO1FBRUYsTUFBTSxTQUFTLEdBQVE7WUFDckIsYUFBYSxFQUFFLEVBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRSxHQUFHLEVBQUUsWUFBWSxFQUFDO1lBQ3hELGtCQUFrQixFQUFFLEVBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxHQUFHLEVBQUUsWUFBWSxFQUFDO1lBQ3pELHlCQUF5QixFQUFFO2dCQUN6QixJQUFJLEVBQUUsa0JBQWtCO2dCQUN4QixHQUFHLEVBQUUsWUFBWTthQUNsQjtZQUNELHlCQUF5QixFQUFFLEVBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFDO1lBQzdELGdDQUFnQyxFQUFFO2dCQUNoQyxJQUFJLEVBQUUsa0JBQWtCO2dCQUN4QixHQUFHLEVBQUUsU0FBUzthQUNmO1lBQ0QsMkJBQTJCLEVBQUUsRUFBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLEdBQUcsRUFBRSxnQkFBZ0IsRUFBQztZQUNyRSwwQkFBMEIsRUFBRSxFQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLGdCQUFnQixFQUFDO1lBQ25FLHFDQUFxQyxFQUFFO2dCQUNyQyxJQUFJLEVBQUUsa0JBQWtCO2dCQUN4QixHQUFHLEVBQUUsZ0JBQWdCO2FBQ3RCO1lBQ0QsV0FBVztZQUNYLHFDQUFxQyxFQUFFO2dCQUNyQyxJQUFJLEVBQUUsa0JBQWtCO2dCQUN4QixHQUFHLEVBQUUsZ0JBQWdCO2FBQ3RCO1lBQ0QsdUNBQXVDLEVBQUU7Z0JBQ3ZDLElBQUksRUFBRSxvQkFBb0I7Z0JBQzFCLEdBQUcsRUFBRSxnQkFBZ0I7YUFDdEI7WUFDRCxXQUFXO1lBQ1gsdUNBQXVDLEVBQUU7Z0JBQ3ZDLElBQUksRUFBRSxvQkFBb0I7Z0JBQzFCLEdBQUcsRUFBRSxnQkFBZ0I7YUFDdEI7WUFDRCxxQkFBcUIsRUFBRSxFQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsR0FBRyxFQUFFLGdCQUFnQixFQUFDO1lBQ2hFLFdBQVc7WUFDWCxxQkFBcUIsRUFBRSxFQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsR0FBRyxFQUFFLGdCQUFnQixFQUFDO1lBQ2hFLHFCQUFxQixFQUFFLEVBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxHQUFHLEVBQUUsZ0JBQWdCLEVBQUM7WUFDaEUsNEJBQTRCLEVBQUU7Z0JBQzVCLElBQUksRUFBRSxrQkFBa0I7Z0JBQ3hCLEdBQUcsRUFBRSxnQkFBZ0I7YUFDdEI7WUFDRCx1QkFBdUIsRUFBRSxFQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFFLFlBQVksRUFBQztZQUM3RCxzQkFBc0IsRUFBRSxFQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLFlBQVksRUFBQztTQUM1RCxDQUFDO1FBRUYsS0FBSyxNQUFNLFlBQVksSUFBSSxTQUFTLEVBQUU7WUFDcEMsNEJBQTRCLENBQzFCLEdBQUcsQ0FBQyxZQUFZLENBQUMsRUFDakIsQ0FBQyxHQUFRLEVBQUUsTUFBVyxFQUFFLEVBQUU7Z0JBQ3hCLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQzdELENBQUMsRUFDRCxTQUFTLENBQUMsWUFBWSxDQUFDLENBQUMsR0FBRyxDQUM1QixDQUFDO1NBQ0g7UUFFRCxNQUFNLFlBQVksR0FBUSxDQUFDLEdBQVEsRUFBRSxJQUFTLEVBQUUsSUFBUyxFQUFFLEVBQUU7WUFDM0QsSUFBSSxNQUFNLEdBQVEsSUFBSSxDQUFDO1lBQ3ZCLElBQUksR0FBRyxLQUFLLFNBQVMsRUFBRTtnQkFDckIsT0FBTzthQUNSO1lBQ0QsSUFBSSxJQUFJLEtBQUssWUFBWSxFQUFFO2dCQUN6QixNQUFNLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQzthQUMxQjtpQkFBTSxJQUFJLElBQUksS0FBSyxTQUFTLEVBQUU7Z0JBQzdCLE1BQU0sR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUMxQztpQkFBTSxJQUFJLElBQUksS0FBSyxnQkFBZ0IsRUFBRTtnQkFDcEMsTUFBTSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsa0JBQWtCLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDbEQ7aUJBQU0sSUFBSSxJQUFJLEtBQUssWUFBWSxFQUFFO2dCQUNoQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDOUM7WUFDRCxJQUFJLENBQUMsTUFBTSxFQUFFO2dCQUNYLE9BQU87YUFDUjtZQUNELElBQUksQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDcEIsQ0FBQyxDQUFDO1FBRUYsSUFBSSxHQUFHLENBQUMsVUFBVSxFQUFFO1lBQ2xCLFlBQVksQ0FDVixHQUFHLENBQUMsVUFBVSxDQUFDLGlCQUFpQixFQUNoQyxDQUFDLEdBQVEsRUFBRSxFQUFFO2dCQUNYLElBQUksQ0FBQyxVQUFVLENBQUMsbUJBQW1CLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDM0MsQ0FBQyxFQUNELFlBQVksQ0FDYixDQUFDO1lBRUYsTUFBTSxnQkFBZ0IsR0FBUTtnQkFDNUIsMEJBQTBCLEVBQUUsRUFBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxnQkFBZ0IsRUFBQztnQkFDbkUsMkJBQTJCLEVBQUUsRUFBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLEdBQUcsRUFBRSxnQkFBZ0IsRUFBQztnQkFDckUsMEJBQTBCLEVBQUU7b0JBQzFCLElBQUksRUFBRSxrQkFBa0I7b0JBQ3hCLEdBQUcsRUFBRSxnQkFBZ0I7aUJBQ3RCO2dCQUNELDJCQUEyQixFQUFFO29CQUMzQixJQUFJLEVBQUUsbUJBQW1CO29CQUN6QixHQUFHLEVBQUUsZ0JBQWdCO2lCQUN0QjtnQkFDRCxzQkFBc0IsRUFBRSxFQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLFlBQVksRUFBQztnQkFDM0QsdUJBQXVCLEVBQUUsRUFBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLEdBQUcsRUFBRSxZQUFZLEVBQUM7Z0JBQzdELHNCQUFzQixFQUFFLEVBQUMsSUFBSSxFQUFFLGtCQUFrQixFQUFFLEdBQUcsRUFBRSxZQUFZLEVBQUM7Z0JBQ3JFLHVCQUF1QixFQUFFO29CQUN2QixJQUFJLEVBQUUsbUJBQW1CO29CQUN6QixHQUFHLEVBQUUsWUFBWTtpQkFDbEI7YUFDRixDQUFDO1lBRUYsS0FBSyxNQUFNLEdBQUcsSUFBSSxnQkFBZ0IsRUFBRTtnQkFDbEMsWUFBWSxDQUNWLEdBQUcsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLEVBQ25CLENBQUMsR0FBUSxFQUFFLE1BQVcsRUFBRSxFQUFFO29CQUN4QixNQUFNLENBQUMsZ0JBQWdCLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUMzRCxDQUFDLEVBQ0QsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUMxQixDQUFDO2FBQ0g7U0FDRjtRQUVELElBQUksR0FBRyxDQUFDLEtBQUssRUFBRTtZQUNiLE1BQU0sTUFBTSxHQUFRLEdBQUcsQ0FBQyxLQUFLLENBQUM7WUFDOUIsSUFBSSxPQUFPLEdBQVEsS0FBSyxDQUFDO1lBQ3pCLElBQUksVUFBZSxDQUFDO1lBQ3BCLElBQUksTUFBVyxDQUFDO1lBQ2hCLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFO2dCQUNuQixVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQzthQUM5QjtpQkFBTTtnQkFDTCxVQUFVLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7YUFDbEQ7WUFFRCxJQUFJLFVBQVUsRUFBRTtnQkFDZCxJQUNFLE1BQU0sQ0FBQyxZQUFZO29CQUNuQixNQUFNLENBQUMsbUJBQW1CO29CQUMxQixNQUFNLENBQUMsZUFBZSxFQUN0QjtvQkFDQSxNQUFNLEdBQUcsVUFBVSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQztpQkFDNUM7cUJBQU0sSUFBSSxNQUFNLENBQUMsWUFBWSxJQUFJLE1BQU0sQ0FBQyxtQkFBbUIsRUFBRTtvQkFDNUQsTUFBTSxHQUFHLFVBQVUsQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztpQkFDaEQ7cUJBQU0sSUFBSSxNQUFNLENBQUMsWUFBWSxFQUFFO29CQUM5QixNQUFNLEdBQUcsVUFBVSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztpQkFDekM7Z0JBQ0QsSUFBSSxNQUFNLEVBQUU7b0JBQ1YsTUFBTSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztvQkFDM0MsT0FBTyxHQUFHLElBQUksQ0FBQztpQkFDaEI7cUJBQU07b0JBQ0wsVUFBVSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztvQkFDM0IsT0FBTyxHQUFHLElBQUksQ0FBQztpQkFDaEI7YUFDRjtZQUVELElBQUksQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsRUFBRTtnQkFDdkQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQzlCLE9BQU8sR0FBRyxJQUFJLENBQUM7YUFDaEI7WUFDRCxJQUFJLENBQUMsT0FBTyxFQUFFO2dCQUNaLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUNkLE9BQU8sTUFBTSxDQUFDLE9BQU8sWUFDbkIsTUFBTSxDQUFDLFlBQ1Qsd0JBQXdCLE1BQU0sQ0FBQyxtQkFBbUIsb0JBQ2hELE1BQU0sQ0FBQyxlQUNULEVBQUUsQ0FDSCxDQUFDO2FBQ0g7U0FDRjtJQUNILENBQUM7Q0FDRjtBQUVELGtCQUFlLFFBQVEsQ0FBQyIsImZpbGUiOiJzcmMvb2JuaXovbGlicy9lbWJlZHMvYmxlL2JsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCbGVBZHZlcnRpc2VtZW50IGZyb20gXCIuL2JsZUFkdmVydGlzZW1lbnRcIjtcbmltcG9ydCBCbGVDaGFyYWN0ZXJpc3RpYyBmcm9tIFwiLi9ibGVDaGFyYWN0ZXJpc3RpY1wiO1xuaW1wb3J0IEJsZURlc2NyaXB0b3IgZnJvbSBcIi4vYmxlRGVzY3JpcHRvclwiO1xuaW1wb3J0IEJsZVBlcmlwaGVyYWwgZnJvbSBcIi4vYmxlUGVyaXBoZXJhbFwiO1xuaW1wb3J0IEJsZVJlbW90ZVBlcmlwaGVyYWwgZnJvbSBcIi4vYmxlUmVtb3RlUGVyaXBoZXJhbFwiO1xuaW1wb3J0IEJsZVNjYW4gZnJvbSBcIi4vYmxlU2NhblwiO1xuaW1wb3J0IEJsZVNlY3VyaXR5IGZyb20gXCIuL2JsZVNlY3VyaXR5XCI7XG5pbXBvcnQgQmxlU2VydmljZSBmcm9tIFwiLi9ibGVTZXJ2aWNlXCI7XG5cbmNsYXNzIE9ibml6QkxFIHtcblxuICBwdWJsaWMgc3RhdGljIF9kYXRhQXJyYXkydXVpZEhleChkYXRhOiBhbnksIHJldmVyc2U6IGFueSkge1xuICAgIGxldCB1dWlkOiBhbnkgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgIHV1aWQucHVzaCgoXCIwMFwiICsgZGF0YVtpXS50b1N0cmluZygxNikudG9Mb3dlckNhc2UoKSkuc2xpY2UoLTIpKTtcbiAgICB9XG4gICAgaWYgKHJldmVyc2UpIHtcbiAgICAgIHV1aWQgPSB1dWlkLnJldmVyc2UoKTtcbiAgICB9XG4gICAgbGV0IHN0cjogYW55ID0gdXVpZC5qb2luKFwiXCIpO1xuICAgIGlmICh1dWlkLmxlbmd0aCA+PSAxNikge1xuICAgICAgc3RyID1cbiAgICAgICAgc3RyLnNsaWNlKDAsIDgpICtcbiAgICAgICAgXCItXCIgK1xuICAgICAgICBzdHIuc2xpY2UoOCwgMTIpICtcbiAgICAgICAgXCItXCIgK1xuICAgICAgICBzdHIuc2xpY2UoMTIsIDE2KSArXG4gICAgICAgIFwiLVwiICtcbiAgICAgICAgc3RyLnNsaWNlKDE2LCAyMCkgK1xuICAgICAgICBcIi1cIiArXG4gICAgICAgIHN0ci5zbGljZSgyMCk7XG4gICAgfVxuICAgIHJldHVybiBzdHI7XG4gIH1cblxuICBwdWJsaWMgT2JuaXo6IGFueTtcbiAgcHVibGljIHJlbW90ZVBlcmlwaGVyYWxzOiBhbnk7XG4gIHB1YmxpYyBzZXJ2aWNlOiBhbnk7XG4gIHB1YmxpYyBjaGFyYWN0ZXJpc3RpYzogYW55O1xuICBwdWJsaWMgZGVzY3JpcHRvcjogYW55O1xuICBwdWJsaWMgcGVyaXBoZXJhbDogYW55O1xuICBwdWJsaWMgc2NhblRhcmdldDogYW55O1xuICBwdWJsaWMgYWR2ZXJ0aXNlbWVudDogYW55O1xuICBwdWJsaWMgc2NhbjogYW55O1xuICBwdWJsaWMgc2VjdXJpdHk6IGFueTtcblxuICBjb25zdHJ1Y3RvcihPYm5pejogYW55KSB7XG4gICAgdGhpcy5PYm5peiA9IE9ibml6O1xuICAgIHRoaXMucmVtb3RlUGVyaXBoZXJhbHMgPSBbXTtcblxuICAgIHRoaXMuc2VydmljZSA9IEJsZVNlcnZpY2U7XG4gICAgdGhpcy5jaGFyYWN0ZXJpc3RpYyA9IEJsZUNoYXJhY3RlcmlzdGljO1xuICAgIHRoaXMuZGVzY3JpcHRvciA9IEJsZURlc2NyaXB0b3I7XG4gICAgdGhpcy5wZXJpcGhlcmFsID0gbmV3IEJsZVBlcmlwaGVyYWwoT2JuaXopO1xuXG4gICAgdGhpcy5zY2FuVGFyZ2V0ID0gbnVsbDtcblxuICAgIHRoaXMuYWR2ZXJ0aXNlbWVudCA9IG5ldyBCbGVBZHZlcnRpc2VtZW50KE9ibml6KTtcbiAgICB0aGlzLnNjYW4gPSBuZXcgQmxlU2NhbihPYm5peik7XG4gICAgdGhpcy5zZWN1cml0eSA9IG5ldyBCbGVTZWN1cml0eShPYm5peik7XG4gICAgdGhpcy5fcmVzZXQoKTtcbiAgfVxuXG4gIC8vIGR1bW15XG4gIHB1YmxpYyBhc3luYyBpbml0V2FpdCgpIHtcbiAgfVxuXG4gIHB1YmxpYyBfcmVzZXQoKSB7XG4gIH1cblxuICBwdWJsaWMgZGlyZWN0Q29ubmVjdCh1dWlkOiBhbnksIGFkZHJlc3NUeXBlOiBhbnkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICBcImRpcmVjdENvbm5lY3QgY2Fubm90IHVzZSBvYm5pek9TIDwgMy4wLjAuIFBsZWFzZSB1cGRhdGUgb2JuaXpPU1wiLFxuICAgICk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgZGlyZWN0Q29ubmVjdFdhaXQodXVpZDogYW55LCBhZGRyZXNzVHlwZTogYW55KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgXCJkaXJlY3RDb25uZWN0V2FpdCBjYW5ub3QgdXNlIG9ibml6T1MgPCAzLjAuMC4gUGxlYXNlIHVwZGF0ZSBvYm5pek9TXCIsXG4gICAgKTtcbiAgfVxuXG4gIHB1YmxpYyBmaW5kUGVyaXBoZXJhbChhZGRyZXNzOiBhbnkpIHtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiB0aGlzLnJlbW90ZVBlcmlwaGVyYWxzKSB7XG4gICAgICBpZiAodGhpcy5yZW1vdGVQZXJpcGhlcmFsc1trZXldLmFkZHJlc3MgPT09IGFkZHJlc3MpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVtb3RlUGVyaXBoZXJhbHNba2V5XTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBwdWJsaWMgbm90aWZpZWQob2JqOiBhbnkpIHtcbiAgICBpZiAob2JqLnNjYW5fcmVzdWx0KSB7XG4gICAgICBsZXQgdmFsOiBhbnkgPSB0aGlzLmZpbmRQZXJpcGhlcmFsKG9iai5zY2FuX3Jlc3VsdC5hZGRyZXNzKTtcbiAgICAgIGlmICghdmFsKSB7XG4gICAgICAgIHZhbCA9IG5ldyBCbGVSZW1vdGVQZXJpcGhlcmFsKHRoaXMuT2JuaXosIG9iai5zY2FuX3Jlc3VsdC5hZGRyZXNzKTtcbiAgICAgICAgdGhpcy5yZW1vdGVQZXJpcGhlcmFscy5wdXNoKHZhbCk7XG4gICAgICB9XG4gICAgICB2YWwuZGlzY292ZXJkT25SZW1vdGUgPSB0cnVlO1xuICAgICAgdmFsLnNldFBhcmFtcyhvYmouc2Nhbl9yZXN1bHQpO1xuXG4gICAgICB0aGlzLnNjYW4ubm90aWZ5RnJvbVNlcnZlcihcIm9uZmluZFwiLCB2YWwpO1xuICAgIH1cblxuICAgIGlmIChvYmouc2Nhbl9yZXN1bHRfZmluaXNoKSB7XG4gICAgICB0aGlzLnNjYW4ubm90aWZ5RnJvbVNlcnZlcihcIm9uZmluaXNoXCIpO1xuICAgIH1cblxuICAgIGNvbnN0IHJlbW90ZVBlcmlwaGVyYWxDYWxsYmFja0Z1bmM6IGFueSA9ICh2YWw6IGFueSwgZnVuYzogYW55LCB0eXBlOiBhbnkpID0+IHtcbiAgICAgIGxldCB0YXJnZXQ6IGFueSA9IG51bGw7XG4gICAgICBpZiAodmFsID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc3QgcDogYW55ID0gdGhpcy5maW5kUGVyaXBoZXJhbCh2YWwuYWRkcmVzcyk7XG4gICAgICBpZiAoIXApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGUgPT09IFwicGVyaXBoZXJhbFwiKSB7XG4gICAgICAgIHRhcmdldCA9IHA7XG4gICAgICB9IGVsc2UgaWYgKHR5cGUgPT09IFwic2VydmljZVwiKSB7XG4gICAgICAgIHRhcmdldCA9IHAuZmluZFNlcnZpY2UodmFsKTtcbiAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gXCJjaGFyYWN0ZXJpc3RpY1wiKSB7XG4gICAgICAgIHRhcmdldCA9IHAuZmluZENoYXJhY3RlcmlzdGljKHZhbCk7XG4gICAgICB9IGVsc2UgaWYgKHR5cGUgPT09IFwiZGVzY3JpcHRvclwiKSB7XG4gICAgICAgIHRhcmdldCA9IHAuZmluZERlc2NyaXB0b3IodmFsKTtcbiAgICAgIH1cbiAgICAgIGlmICghdGFyZ2V0KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGZ1bmModmFsLCB0YXJnZXQpO1xuICAgIH07XG5cbiAgICBjb25zdCBwYXJhbUxpc3Q6IGFueSA9IHtcbiAgICAgIHN0YXR1c191cGRhdGU6IHtuYW1lOiBcInN0YXR1c3VwZGF0ZVwiLCBvYmo6IFwicGVyaXBoZXJhbFwifSxcbiAgICAgIGdldF9zZXJ2aWNlX3Jlc3VsdDoge25hbWU6IFwiZGlzY292ZXJcIiwgb2JqOiBcInBlcmlwaGVyYWxcIn0sXG4gICAgICBnZXRfc2VydmljZV9yZXN1bHRfZmluaXNoOiB7XG4gICAgICAgIG5hbWU6IFwiZGlzY292ZXJmaW5pc2hlZFwiLFxuICAgICAgICBvYmo6IFwicGVyaXBoZXJhbFwiLFxuICAgICAgfSxcbiAgICAgIGdldF9jaGFyYWN0ZXJpc3RpY19yZXN1bHQ6IHtuYW1lOiBcImRpc2NvdmVyXCIsIG9iajogXCJzZXJ2aWNlXCJ9LFxuICAgICAgZ2V0X2NoYXJhY3RlcmlzdGljX3Jlc3VsdF9maW5pc2g6IHtcbiAgICAgICAgbmFtZTogXCJkaXNjb3ZlcmZpbmlzaGVkXCIsXG4gICAgICAgIG9iajogXCJzZXJ2aWNlXCIsXG4gICAgICB9LFxuICAgICAgd3JpdGVfY2hhcmFjdGVyaXN0aWNfcmVzdWx0OiB7bmFtZTogXCJvbndyaXRlXCIsIG9iajogXCJjaGFyYWN0ZXJpc3RpY1wifSxcbiAgICAgIHJlYWRfY2hhcmFjdGVyaXN0aWNfcmVzdWx0OiB7bmFtZTogXCJvbnJlYWRcIiwgb2JqOiBcImNoYXJhY3RlcmlzdGljXCJ9LFxuICAgICAgcmVnaXN0ZXJfbm90aWZ5X2NoYXJhY3RlcmlzdGljX3Jlc3VsdDoge1xuICAgICAgICBuYW1lOiBcIm9ucmVnaXN0ZXJub3RpZnlcIixcbiAgICAgICAgb2JqOiBcImNoYXJhY3RlcmlzdGljXCIsXG4gICAgICB9LFxuICAgICAgLy8gZm9yIHR5cG9cbiAgICAgIHJlZ2lzdGVyX25vZml0eV9jaGFyYWN0ZXJpc3RpY19yZXN1bHQ6IHtcbiAgICAgICAgbmFtZTogXCJvbnJlZ2lzdGVybm90aWZ5XCIsXG4gICAgICAgIG9iajogXCJjaGFyYWN0ZXJpc3RpY1wiLFxuICAgICAgfSxcbiAgICAgIHVucmVnaXN0ZXJfbm90aWZ5X2NoYXJhY3RlcmlzdGljX3Jlc3VsdDoge1xuICAgICAgICBuYW1lOiBcIm9udW5yZWdpc3Rlcm5vdGlmeVwiLFxuICAgICAgICBvYmo6IFwiY2hhcmFjdGVyaXN0aWNcIixcbiAgICAgIH0sXG4gICAgICAvLyBmb3IgdHlwb1xuICAgICAgdW5yZWdpc3Rlcl9ub2ZpdHlfY2hhcmFjdGVyaXN0aWNfcmVzdWx0OiB7XG4gICAgICAgIG5hbWU6IFwib251bnJlZ2lzdGVybm90aWZ5XCIsXG4gICAgICAgIG9iajogXCJjaGFyYWN0ZXJpc3RpY1wiLFxuICAgICAgfSxcbiAgICAgIG5vdGlmeV9jaGFyYWN0ZXJpc3RpYzoge25hbWU6IFwib25ub3RpZnlcIiwgb2JqOiBcImNoYXJhY3RlcmlzdGljXCJ9LFxuICAgICAgLy8gZm9yIHR5cG9cbiAgICAgIG5vZml0eV9jaGFyYWN0ZXJpc3RpYzoge25hbWU6IFwib25ub3RpZnlcIiwgb2JqOiBcImNoYXJhY3RlcmlzdGljXCJ9LFxuICAgICAgZ2V0X2Rlc2NyaXB0b3JfcmVzdWx0OiB7bmFtZTogXCJkaXNjb3ZlclwiLCBvYmo6IFwiY2hhcmFjdGVyaXN0aWNcIn0sXG4gICAgICBnZXRfZGVzY3JpcHRvcl9yZXN1bHRfZmluaXNoOiB7XG4gICAgICAgIG5hbWU6IFwiZGlzY292ZXJmaW5pc2hlZFwiLFxuICAgICAgICBvYmo6IFwiY2hhcmFjdGVyaXN0aWNcIixcbiAgICAgIH0sXG4gICAgICB3cml0ZV9kZXNjcmlwdG9yX3Jlc3VsdDoge25hbWU6IFwib253cml0ZVwiLCBvYmo6IFwiZGVzY3JpcHRvclwifSxcbiAgICAgIHJlYWRfZGVzY3JpcHRvcl9yZXN1bHQ6IHtuYW1lOiBcIm9ucmVhZFwiLCBvYmo6IFwiZGVzY3JpcHRvclwifSxcbiAgICB9O1xuXG4gICAgZm9yIChjb25zdCBwYXJhbUxpc3RLZXkgaW4gcGFyYW1MaXN0KSB7XG4gICAgICByZW1vdGVQZXJpcGhlcmFsQ2FsbGJhY2tGdW5jKFxuICAgICAgICBvYmpbcGFyYW1MaXN0S2V5XSxcbiAgICAgICAgKHZhbDogYW55LCBibGVvYmo6IGFueSkgPT4ge1xuICAgICAgICAgIGJsZW9iai5ub3RpZnlGcm9tU2VydmVyKHBhcmFtTGlzdFtwYXJhbUxpc3RLZXldLm5hbWUsIHZhbCk7XG4gICAgICAgIH0sXG4gICAgICAgIHBhcmFtTGlzdFtwYXJhbUxpc3RLZXldLm9iaixcbiAgICAgICk7XG4gICAgfVxuXG4gICAgY29uc3QgY2FsbGJhY2tGdW5jOiBhbnkgPSAodmFsOiBhbnksIGZ1bmM6IGFueSwgdHlwZTogYW55KSA9PiB7XG4gICAgICBsZXQgdGFyZ2V0OiBhbnkgPSBudWxsO1xuICAgICAgaWYgKHZhbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlID09PSBcInBlcmlwaGVyYWxcIikge1xuICAgICAgICB0YXJnZXQgPSB0aGlzLnBlcmlwaGVyYWw7XG4gICAgICB9IGVsc2UgaWYgKHR5cGUgPT09IFwic2VydmljZVwiKSB7XG4gICAgICAgIHRhcmdldCA9IHRoaXMucGVyaXBoZXJhbC5nZXRTZXJ2aWNlKHZhbCk7XG4gICAgICB9IGVsc2UgaWYgKHR5cGUgPT09IFwiY2hhcmFjdGVyaXN0aWNcIikge1xuICAgICAgICB0YXJnZXQgPSB0aGlzLnBlcmlwaGVyYWwuZmluZENoYXJhY3RlcmlzdGljKHZhbCk7XG4gICAgICB9IGVsc2UgaWYgKHR5cGUgPT09IFwiZGVzY3JpcHRvclwiKSB7XG4gICAgICAgIHRhcmdldCA9IHRoaXMucGVyaXBoZXJhbC5maW5kRGVzY3JpcHRvcih2YWwpO1xuICAgICAgfVxuICAgICAgaWYgKCF0YXJnZXQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgZnVuYyh2YWwsIHRhcmdldCk7XG4gICAgfTtcblxuICAgIGlmIChvYmoucGVyaXBoZXJhbCkge1xuICAgICAgY2FsbGJhY2tGdW5jKFxuICAgICAgICBvYmoucGVyaXBoZXJhbC5jb25uZWN0aW9uX3N0YXR1cyxcbiAgICAgICAgKHZhbDogYW55KSA9PiB7XG4gICAgICAgICAgdGhpcy5wZXJpcGhlcmFsLm9uY29ubmVjdGlvbnVwZGF0ZXModmFsKTtcbiAgICAgICAgfSxcbiAgICAgICAgXCJwZXJpcGhlcmFsXCIsXG4gICAgICApO1xuXG4gICAgICBjb25zdCBjZW50cmFsUGFyYW1MaXN0OiBhbnkgPSB7XG4gICAgICAgIHJlYWRfY2hhcmFjdGVyaXN0aWNfcmVzdWx0OiB7bmFtZTogXCJvbnJlYWRcIiwgb2JqOiBcImNoYXJhY3RlcmlzdGljXCJ9LFxuICAgICAgICB3cml0ZV9jaGFyYWN0ZXJpc3RpY19yZXN1bHQ6IHtuYW1lOiBcIm9ud3JpdGVcIiwgb2JqOiBcImNoYXJhY3RlcmlzdGljXCJ9LFxuICAgICAgICBub3RpZnlfcmVhZF9jaGFyYWN0ZXJpc3RpYzoge1xuICAgICAgICAgIG5hbWU6IFwib25yZWFkZnJvbXJlbW90ZVwiLFxuICAgICAgICAgIG9iajogXCJjaGFyYWN0ZXJpc3RpY1wiLFxuICAgICAgICB9LFxuICAgICAgICBub3RpZnlfd3JpdGVfY2hhcmFjdGVyaXN0aWM6IHtcbiAgICAgICAgICBuYW1lOiBcIm9ud3JpdGVmcm9tcmVtb3RlXCIsXG4gICAgICAgICAgb2JqOiBcImNoYXJhY3RlcmlzdGljXCIsXG4gICAgICAgIH0sXG4gICAgICAgIHJlYWRfZGVzY3JpcHRvcl9yZXN1bHQ6IHtuYW1lOiBcIm9ucmVhZFwiLCBvYmo6IFwiZGVzY3JpcHRvclwifSxcbiAgICAgICAgd3JpdGVfZGVzY3JpcHRvcl9yZXN1bHQ6IHtuYW1lOiBcIm9ud3JpdGVcIiwgb2JqOiBcImRlc2NyaXB0b3JcIn0sXG4gICAgICAgIG5vdGlmeV9yZWFkX2Rlc2NyaXB0b3I6IHtuYW1lOiBcIm9ucmVhZGZyb21yZW1vdGVcIiwgb2JqOiBcImRlc2NyaXB0b3JcIn0sXG4gICAgICAgIG5vdGlmeV93cml0ZV9kZXNjcmlwdG9yOiB7XG4gICAgICAgICAgbmFtZTogXCJvbndyaXRlZnJvbXJlbW90ZVwiLFxuICAgICAgICAgIG9iajogXCJkZXNjcmlwdG9yXCIsXG4gICAgICAgIH0sXG4gICAgICB9O1xuXG4gICAgICBmb3IgKGNvbnN0IGtleSBpbiBjZW50cmFsUGFyYW1MaXN0KSB7XG4gICAgICAgIGNhbGxiYWNrRnVuYyhcbiAgICAgICAgICBvYmoucGVyaXBoZXJhbFtrZXldLFxuICAgICAgICAgICh2YWw6IGFueSwgYmxlb2JqOiBhbnkpID0+IHtcbiAgICAgICAgICAgIGJsZW9iai5ub3RpZnlGcm9tU2VydmVyKGNlbnRyYWxQYXJhbUxpc3Rba2V5XS5uYW1lLCB2YWwpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgY2VudHJhbFBhcmFtTGlzdFtrZXldLm9iaixcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAob2JqLmVycm9yKSB7XG4gICAgICBjb25zdCBwYXJhbXM6IGFueSA9IG9iai5lcnJvcjtcbiAgICAgIGxldCBoYW5kbGVkOiBhbnkgPSBmYWxzZTtcbiAgICAgIGxldCBwZXJpcGhlcmFsOiBhbnk7XG4gICAgICBsZXQgdGFyZ2V0OiBhbnk7XG4gICAgICBpZiAoIXBhcmFtcy5hZGRyZXNzKSB7XG4gICAgICAgIHBlcmlwaGVyYWwgPSB0aGlzLnBlcmlwaGVyYWw7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwZXJpcGhlcmFsID0gdGhpcy5maW5kUGVyaXBoZXJhbChwYXJhbXMuYWRkcmVzcyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChwZXJpcGhlcmFsKSB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICBwYXJhbXMuc2VydmljZV91dWlkICYmXG4gICAgICAgICAgcGFyYW1zLmNoYXJhY3RlcmlzdGljX3V1aWQgJiZcbiAgICAgICAgICBwYXJhbXMuZGVzY3JpcHRvcl91dWlkXG4gICAgICAgICkge1xuICAgICAgICAgIHRhcmdldCA9IHBlcmlwaGVyYWwuZmluZERlc2NyaXB0b3IocGFyYW1zKTtcbiAgICAgICAgfSBlbHNlIGlmIChwYXJhbXMuc2VydmljZV91dWlkICYmIHBhcmFtcy5jaGFyYWN0ZXJpc3RpY191dWlkKSB7XG4gICAgICAgICAgdGFyZ2V0ID0gcGVyaXBoZXJhbC5maW5kQ2hhcmFjdGVyaXN0aWMocGFyYW1zKTtcbiAgICAgICAgfSBlbHNlIGlmIChwYXJhbXMuc2VydmljZV91dWlkKSB7XG4gICAgICAgICAgdGFyZ2V0ID0gcGVyaXBoZXJhbC5maW5kU2VydmljZShwYXJhbXMpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0YXJnZXQpIHtcbiAgICAgICAgICB0YXJnZXQubm90aWZ5RnJvbVNlcnZlcihcIm9uZXJyb3JcIiwgcGFyYW1zKTtcbiAgICAgICAgICBoYW5kbGVkID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwZXJpcGhlcmFsLm9uZXJyb3IocGFyYW1zKTtcbiAgICAgICAgICBoYW5kbGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoWzM1LCAzNiwgMzcsIDM4LCAzOV0uaW5jbHVkZXMocGFyYW1zLmZ1bmN0aW9uX2NvZGUpKSB7XG4gICAgICAgIHRoaXMuc2VjdXJpdHkub25lcnJvcihwYXJhbXMpO1xuICAgICAgICBoYW5kbGVkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGlmICghaGFuZGxlZCkge1xuICAgICAgICB0aGlzLk9ibml6LmVycm9yKFxuICAgICAgICAgIGBibGUgJHtwYXJhbXMubWVzc2FnZX0gc2VydmljZT0ke1xuICAgICAgICAgICAgcGFyYW1zLnNlcnZpY2VfdXVpZFxuICAgICAgICAgIH0gY2hhcmFjdGVyaXN0aWNfdXVpZD0ke3BhcmFtcy5jaGFyYWN0ZXJpc3RpY191dWlkfSBkZXNjcmlwdG9yX3V1aWQ9JHtcbiAgICAgICAgICAgIHBhcmFtcy5kZXNjcmlwdG9yX3V1aWRcbiAgICAgICAgICB9YCxcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgT2JuaXpCTEU7XG4iXX0=
