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
const BlePeripheral = require('./blePeripheral');
const BleService = require('./bleService');
const BleCharacteristic = require('./bleCharacteristic');
const BleDescriptor = require('./bleDescriptor');
const BleRemotePeripheral = require('./bleRemotePeripheral');
const BleAdvertisement = require('./bleAdvertisement');
const BleScan = require('./bleScan');
const BleSecurity = require('./bleSecurity');
class ObnizBLE {
    constructor(Obniz) {
        this.Obniz = Obniz;
        this.remotePeripherals = [];
        this.service = BleService;
        this.characteristic = BleCharacteristic;
        this.descriptor = BleDescriptor;
        this.peripheral = new BlePeripheral(Obniz);
        this.scanTarget = null;
        this.advertisement = new BleAdvertisement(Obniz);
        this.scan = new BleScan(Obniz);
        this.security = new BleSecurity(Obniz);
        this._reset();
    }
    //dummy
    initWait() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    _reset() { }
    directConnect(uuid, addressType) {
        throw new Error('directConnect cannot use obnizOS < 3.0.0. Please update obnizOS');
    }
    directConnectWait(uuid, addressType) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('directConnectWait cannot use obnizOS < 3.0.0. Please update obnizOS');
        });
    }
    findPeripheral(address) {
        for (let key in this.remotePeripherals) {
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
                val = new BleRemotePeripheral(this.Obniz, obj.scan_result.address);
                this.remotePeripherals.push(val);
            }
            val.discoverdOnRemote = true;
            val.setParams(obj.scan_result);
            this.scan.notifyFromServer('onfind', val);
        }
        if (obj.scan_result_finish) {
            this.scan.notifyFromServer('onfinish');
        }
        let remotePeripheralCallbackFunc = function (val, func, type) {
            let obj = null;
            if (val === undefined) {
                return;
            }
            let p = this.findPeripheral(val.address);
            if (!p) {
                return;
            }
            if (type === 'peripheral') {
                obj = p;
            }
            else if (type === 'service') {
                obj = p.findService(val);
            }
            else if (type === 'characteristic') {
                obj = p.findCharacteristic(val);
            }
            else if (type === 'descriptor') {
                obj = p.findDescriptor(val);
            }
            if (!obj) {
                return;
            }
            func(val, obj);
        }.bind(this);
        const paramList = {
            status_update: { name: 'statusupdate', obj: 'peripheral' },
            get_service_result: { name: 'discover', obj: 'peripheral' },
            get_service_result_finish: {
                name: 'discoverfinished',
                obj: 'peripheral',
            },
            get_characteristic_result: { name: 'discover', obj: 'service' },
            get_characteristic_result_finish: {
                name: 'discoverfinished',
                obj: 'service',
            },
            write_characteristic_result: { name: 'onwrite', obj: 'characteristic' },
            read_characteristic_result: { name: 'onread', obj: 'characteristic' },
            register_notify_characteristic_result: {
                name: 'onregisternotify',
                obj: 'characteristic',
            },
            //for typo
            register_nofity_characteristic_result: {
                name: 'onregisternotify',
                obj: 'characteristic',
            },
            unregister_notify_characteristic_result: {
                name: 'onunregisternotify',
                obj: 'characteristic',
            },
            //for typo
            unregister_nofity_characteristic_result: {
                name: 'onunregisternotify',
                obj: 'characteristic',
            },
            notify_characteristic: { name: 'onnotify', obj: 'characteristic' },
            //for typo
            nofity_characteristic: { name: 'onnotify', obj: 'characteristic' },
            get_descriptor_result: { name: 'discover', obj: 'characteristic' },
            get_descriptor_result_finish: {
                name: 'discoverfinished',
                obj: 'characteristic',
            },
            write_descriptor_result: { name: 'onwrite', obj: 'descriptor' },
            read_descriptor_result: { name: 'onread', obj: 'descriptor' },
        };
        for (let key in paramList) {
            remotePeripheralCallbackFunc(obj[key], function (val, bleobj) {
                bleobj.notifyFromServer(paramList[key].name, val);
            }.bind(this), paramList[key].obj);
        }
        let callbackFunc = function (val, func, type) {
            let obj = null;
            if (val === undefined) {
                return;
            }
            if (type === 'peripheral') {
                obj = this.peripheral;
            }
            else if (type === 'service') {
                obj = this.peripheral.getService(val);
            }
            else if (type === 'characteristic') {
                obj = this.peripheral.findCharacteristic(val);
            }
            else if (type === 'descriptor') {
                obj = this.peripheral.findDescriptor(val);
            }
            if (!obj) {
                return;
            }
            func(val, obj);
        }.bind(this);
        if (obj.peripheral) {
            callbackFunc(obj.peripheral.connection_status, function (val) {
                this.peripheral.onconnectionupdates(val);
            }.bind(this), 'peripheral');
            const paramList = {
                read_characteristic_result: { name: 'onread', obj: 'characteristic' },
                write_characteristic_result: { name: 'onwrite', obj: 'characteristic' },
                notify_read_characteristic: {
                    name: 'onreadfromremote',
                    obj: 'characteristic',
                },
                notify_write_characteristic: {
                    name: 'onwritefromremote',
                    obj: 'characteristic',
                },
                read_descriptor_result: { name: 'onread', obj: 'descriptor' },
                write_descriptor_result: { name: 'onwrite', obj: 'descriptor' },
                notify_read_descriptor: { name: 'onreadfromremote', obj: 'descriptor' },
                notify_write_descriptor: {
                    name: 'onwritefromremote',
                    obj: 'descriptor',
                },
            };
            for (let key in paramList) {
                callbackFunc(obj.peripheral[key], function (val, bleobj) {
                    bleobj.notifyFromServer(paramList[key].name, val);
                }.bind(this), paramList[key].obj);
            }
        }
        if (obj.error) {
            let params = obj.error;
            let handled = false;
            let peripheral, target;
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
                    target.notifyFromServer('onerror', params);
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
    static _dataArray2uuidHex(data, reverse) {
        let uuid = [];
        for (let i = 0; i < data.length; i++) {
            uuid.push(('00' + data[i].toString(16).toLowerCase()).slice(-2));
        }
        if (reverse) {
            uuid = uuid.reverse();
        }
        let str = uuid.join('');
        if (uuid.length >= 16) {
            str =
                str.slice(0, 8) +
                    '-' +
                    str.slice(8, 12) +
                    '-' +
                    str.slice(12, 16) +
                    '-' +
                    str.slice(16, 20) +
                    '-' +
                    str.slice(20);
        }
        return str;
    }
}
module.exports = ObnizBLE;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9vYm5pei9saWJzL2VtYmVkcy9ibGUvYmxlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxNQUFNLGFBQWEsR0FBRyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUNqRCxNQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDM0MsTUFBTSxpQkFBaUIsR0FBRyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQztBQUN6RCxNQUFNLGFBQWEsR0FBRyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUNqRCxNQUFNLG1CQUFtQixHQUFHLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0FBQzdELE1BQU0sZ0JBQWdCLEdBQUcsT0FBTyxDQUFDLG9CQUFvQixDQUFDLENBQUM7QUFDdkQsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQ3JDLE1BQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUU3QyxNQUFNLFFBQVE7SUFDWixZQUFZLEtBQUs7UUFDZixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsaUJBQWlCLEdBQUcsRUFBRSxDQUFDO1FBRTVCLElBQUksQ0FBQyxPQUFPLEdBQUcsVUFBVSxDQUFDO1FBQzFCLElBQUksQ0FBQyxjQUFjLEdBQUcsaUJBQWlCLENBQUM7UUFDeEMsSUFBSSxDQUFDLFVBQVUsR0FBRyxhQUFhLENBQUM7UUFDaEMsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUUzQyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztRQUV2QixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksZ0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDakQsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztR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QUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDbEU7UUFDRCxJQUFJLE9BQU8sRUFBRTtZQUNYLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7U0FDdkI7UUFDRCxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3hCLElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxFQUFFLEVBQUU7WUFDckIsR0FBRztnQkFDRCxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7b0JBQ2YsR0FBRztvQkFDSCxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUM7b0JBQ2hCLEdBQUc7b0JBQ0gsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDO29CQUNqQixHQUFHO29CQUNILEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQztvQkFDakIsR0FBRztvQkFDSCxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQ2pCO1FBQ0QsT0FBTyxHQUFHLENBQUM7SUFDYixDQUFDO0NBQ0Y7QUFFRCxNQUFNLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyIsImZpbGUiOiJvYm5pei9saWJzL2VtYmVkcy9ibGUvYmxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgQmxlUGVyaXBoZXJhbCA9IHJlcXVpcmUoJy4vYmxlUGVyaXBoZXJhbCcpO1xuY29uc3QgQmxlU2VydmljZSA9IHJlcXVpcmUoJy4vYmxlU2VydmljZScpO1xuY29uc3QgQmxlQ2hhcmFjdGVyaXN0aWMgPSByZXF1aXJlKCcuL2JsZUNoYXJhY3RlcmlzdGljJyk7XG5jb25zdCBCbGVEZXNjcmlwdG9yID0gcmVxdWlyZSgnLi9ibGVEZXNjcmlwdG9yJyk7XG5jb25zdCBCbGVSZW1vdGVQZXJpcGhlcmFsID0gcmVxdWlyZSgnLi9ibGVSZW1vdGVQZXJpcGhlcmFsJyk7XG5jb25zdCBCbGVBZHZlcnRpc2VtZW50ID0gcmVxdWlyZSgnLi9ibGVBZHZlcnRpc2VtZW50Jyk7XG5jb25zdCBCbGVTY2FuID0gcmVxdWlyZSgnLi9ibGVTY2FuJyk7XG5jb25zdCBCbGVTZWN1cml0eSA9IHJlcXVpcmUoJy4vYmxlU2VjdXJpdHknKTtcblxuY2xhc3MgT2JuaXpCTEUge1xuICBjb25zdHJ1Y3RvcihPYm5peikge1xuICAgIHRoaXMuT2JuaXogPSBPYm5pejtcbiAgICB0aGlzLnJlbW90ZVBlcmlwaGVyYWxzID0gW107XG5cbiAgICB0aGlzLnNlcnZpY2UgPSBCbGVTZXJ2aWNlO1xuICAgIHRoaXMuY2hhcmFjdGVyaXN0aWMgPSBCbGVDaGFyYWN0ZXJpc3RpYztcbiAgICB0aGlzLmRlc2NyaXB0b3IgPSBCbGVEZXNjcmlwdG9yO1xuICAgIHRoaXMucGVyaXBoZXJhbCA9IG5ldyBCbGVQZXJpcGhlcmFsKE9ibml6KTtcblxuICAgIHRoaXMuc2NhblRhcmdldCA9IG51bGw7XG5cbiAgICB0aGlzLmFkdmVydGlzZW1lbnQgPSBuZXcgQmxlQWR2ZXJ0aXNlbWVudChPYm5peik7XG4gICAgdGhpcy5zY2FuID0gbmV3IEJsZVNjYW4oT2JuaXopO1xuICAgIHRoaXMuc2VjdXJpdHkgPSBuZXcgQmxlU2VjdXJpdHkoT2JuaXopO1xuICAgIHRoaXMuX3Jlc2V0KCk7XG4gIH1cblxuICAvL2R1bW15XG4gIGFzeW5jIGluaXRXYWl0KCkge31cblxuICBfcmVzZXQoKSB7fVxuXG4gIGRpcmVjdENvbm5lY3QodXVpZCwgYWRkcmVzc1R5cGUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAnZGlyZWN0Q29ubmVjdCBjYW5ub3QgdXNlIG9ibml6T1MgPCAzLjAuMC4gUGxlYXNlIHVwZGF0ZSBvYm5pek9TJ1xuICAgICk7XG4gIH1cblxuICBhc3luYyBkaXJlY3RDb25uZWN0V2FpdCh1dWlkLCBhZGRyZXNzVHlwZSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICdkaXJlY3RDb25uZWN0V2FpdCBjYW5ub3QgdXNlIG9ibml6T1MgPCAzLjAuMC4gUGxlYXNlIHVwZGF0ZSBvYm5pek9TJ1xuICAgICk7XG4gIH1cblxuICBmaW5kUGVyaXBoZXJhbChhZGRyZXNzKSB7XG4gICAgZm9yIChsZXQga2V5IGluIHRoaXMucmVtb3RlUGVyaXBoZXJhbHMpIHtcbiAgICAgIGlmICh0aGlzLnJlbW90ZVBlcmlwaGVyYWxzW2tleV0uYWRkcmVzcyA9PT0gYWRkcmVzcykge1xuICAgICAgICByZXR1cm4gdGhpcy5yZW1vdGVQZXJpcGhlcmFsc1trZXldO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIG5vdGlmaWVkKG9iaikge1xuICAgIGlmIChvYmouc2Nhbl9yZXN1bHQpIHtcbiAgICAgIGxldCB2YWwgPSB0aGlzLmZpbmRQZXJpcGhlcmFsKG9iai5zY2FuX3Jlc3VsdC5hZGRyZXNzKTtcbiAgICAgIGlmICghdmFsKSB7XG4gICAgICAgIHZhbCA9IG5ldyBCbGVSZW1vdGVQZXJpcGhlcmFsKHRoaXMuT2JuaXosIG9iai5zY2FuX3Jlc3VsdC5hZGRyZXNzKTtcbiAgICAgICAgdGhpcy5yZW1vdGVQZXJpcGhlcmFscy5wdXNoKHZhbCk7XG4gICAgICB9XG4gICAgICB2YWwuZGlzY292ZXJkT25SZW1vdGUgPSB0cnVlO1xuICAgICAgdmFsLnNldFBhcmFtcyhvYmouc2Nhbl9yZXN1bHQpO1xuXG4gICAgICB0aGlzLnNjYW4ubm90aWZ5RnJvbVNlcnZlcignb25maW5kJywgdmFsKTtcbiAgICB9XG5cbiAgICBpZiAob2JqLnNjYW5fcmVzdWx0X2ZpbmlzaCkge1xuICAgICAgdGhpcy5zY2FuLm5vdGlmeUZyb21TZXJ2ZXIoJ29uZmluaXNoJyk7XG4gICAgfVxuXG4gICAgbGV0IHJlbW90ZVBlcmlwaGVyYWxDYWxsYmFja0Z1bmMgPSBmdW5jdGlvbih2YWwsIGZ1bmMsIHR5cGUpIHtcbiAgICAgIGxldCBvYmogPSBudWxsO1xuICAgICAgaWYgKHZhbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGxldCBwID0gdGhpcy5maW5kUGVyaXBoZXJhbCh2YWwuYWRkcmVzcyk7XG4gICAgICBpZiAoIXApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGUgPT09ICdwZXJpcGhlcmFsJykge1xuICAgICAgICBvYmogPSBwO1xuICAgICAgfSBlbHNlIGlmICh0eXBlID09PSAnc2VydmljZScpIHtcbiAgICAgICAgb2JqID0gcC5maW5kU2VydmljZSh2YWwpO1xuICAgICAgfSBlbHNlIGlmICh0eXBlID09PSAnY2hhcmFjdGVyaXN0aWMnKSB7XG4gICAgICAgIG9iaiA9IHAuZmluZENoYXJhY3RlcmlzdGljKHZhbCk7XG4gICAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdkZXNjcmlwdG9yJykge1xuICAgICAgICBvYmogPSBwLmZpbmREZXNjcmlwdG9yKHZhbCk7XG4gICAgICB9XG4gICAgICBpZiAoIW9iaikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBmdW5jKHZhbCwgb2JqKTtcbiAgICB9LmJpbmQodGhpcyk7XG5cbiAgICBjb25zdCBwYXJhbUxpc3QgPSB7XG4gICAgICBzdGF0dXNfdXBkYXRlOiB7IG5hbWU6ICdzdGF0dXN1cGRhdGUnLCBvYmo6ICdwZXJpcGhlcmFsJyB9LFxuICAgICAgZ2V0X3NlcnZpY2VfcmVzdWx0OiB7IG5hbWU6ICdkaXNjb3ZlcicsIG9iajogJ3BlcmlwaGVyYWwnIH0sXG4gICAgICBnZXRfc2VydmljZV9yZXN1bHRfZmluaXNoOiB7XG4gICAgICAgIG5hbWU6ICdkaXNjb3ZlcmZpbmlzaGVkJyxcbiAgICAgICAgb2JqOiAncGVyaXBoZXJhbCcsXG4gICAgICB9LFxuICAgICAgZ2V0X2NoYXJhY3RlcmlzdGljX3Jlc3VsdDogeyBuYW1lOiAnZGlzY292ZXInLCBvYmo6ICdzZXJ2aWNlJyB9LFxuICAgICAgZ2V0X2NoYXJhY3RlcmlzdGljX3Jlc3VsdF9maW5pc2g6IHtcbiAgICAgICAgbmFtZTogJ2Rpc2NvdmVyZmluaXNoZWQnLFxuICAgICAgICBvYmo6ICdzZXJ2aWNlJyxcbiAgICAgIH0sXG4gICAgICB3cml0ZV9jaGFyYWN0ZXJpc3RpY19yZXN1bHQ6IHsgbmFtZTogJ29ud3JpdGUnLCBvYmo6ICdjaGFyYWN0ZXJpc3RpYycgfSxcbiAgICAgIHJlYWRfY2hhcmFjdGVyaXN0aWNfcmVzdWx0OiB7IG5hbWU6ICdvbnJlYWQnLCBvYmo6ICdjaGFyYWN0ZXJpc3RpYycgfSxcbiAgICAgIHJlZ2lzdGVyX25vdGlmeV9jaGFyYWN0ZXJpc3RpY19yZXN1bHQ6IHtcbiAgICAgICAgbmFtZTogJ29ucmVnaXN0ZXJub3RpZnknLFxuICAgICAgICBvYmo6ICdjaGFyYWN0ZXJpc3RpYycsXG4gICAgICB9LFxuICAgICAgLy9mb3IgdHlwb1xuICAgICAgcmVnaXN0ZXJfbm9maXR5X2NoYXJhY3RlcmlzdGljX3Jlc3VsdDoge1xuICAgICAgICBuYW1lOiAnb25yZWdpc3Rlcm5vdGlmeScsXG4gICAgICAgIG9iajogJ2NoYXJhY3RlcmlzdGljJyxcbiAgICAgIH0sXG4gICAgICB1bnJlZ2lzdGVyX25vdGlmeV9jaGFyYWN0ZXJpc3RpY19yZXN1bHQ6IHtcbiAgICAgICAgbmFtZTogJ29udW5yZWdpc3Rlcm5vdGlmeScsXG4gICAgICAgIG9iajogJ2NoYXJhY3RlcmlzdGljJyxcbiAgICAgIH0sXG4gICAgICAvL2ZvciB0eXBvXG4gICAgICB1bnJlZ2lzdGVyX25vZml0eV9jaGFyYWN0ZXJpc3RpY19yZXN1bHQ6IHtcbiAgICAgICAgbmFtZTogJ29udW5yZWdpc3Rlcm5vdGlmeScsXG4gICAgICAgIG9iajogJ2NoYXJhY3RlcmlzdGljJyxcbiAgICAgIH0sXG4gICAgICBub3RpZnlfY2hhcmFjdGVyaXN0aWM6IHsgbmFtZTogJ29ubm90aWZ5Jywgb2JqOiAnY2hhcmFjdGVyaXN0aWMnIH0sXG4gICAgICAvL2ZvciB0eXBvXG4gICAgICBub2ZpdHlfY2hhcmFjdGVyaXN0aWM6IHsgbmFtZTogJ29ubm90aWZ5Jywgb2JqOiAnY2hhcmFjdGVyaXN0aWMnIH0sXG4gICAgICBnZXRfZGVzY3JpcHRvcl9yZXN1bHQ6IHsgbmFtZTogJ2Rpc2NvdmVyJywgb2JqOiAnY2hhcmFjdGVyaXN0aWMnIH0sXG4gICAgICBnZXRfZGVzY3JpcHRvcl9yZXN1bHRfZmluaXNoOiB7XG4gICAgICAgIG5hbWU6ICdkaXNjb3ZlcmZpbmlzaGVkJyxcbiAgICAgICAgb2JqOiAnY2hhcmFjdGVyaXN0aWMnLFxuICAgICAgfSxcbiAgICAgIHdyaXRlX2Rlc2NyaXB0b3JfcmVzdWx0OiB7IG5hbWU6ICdvbndyaXRlJywgb2JqOiAnZGVzY3JpcHRvcicgfSxcbiAgICAgIHJlYWRfZGVzY3JpcHRvcl9yZXN1bHQ6IHsgbmFtZTogJ29ucmVhZCcsIG9iajogJ2Rlc2NyaXB0b3InIH0sXG4gICAgfTtcblxuICAgIGZvciAobGV0IGtleSBpbiBwYXJhbUxpc3QpIHtcbiAgICAgIHJlbW90ZVBlcmlwaGVyYWxDYWxsYmFja0Z1bmMoXG4gICAgICAgIG9ialtrZXldLFxuICAgICAgICBmdW5jdGlvbih2YWwsIGJsZW9iaikge1xuICAgICAgICAgIGJsZW9iai5ub3RpZnlGcm9tU2VydmVyKHBhcmFtTGlzdFtrZXldLm5hbWUsIHZhbCk7XG4gICAgICAgIH0uYmluZCh0aGlzKSxcbiAgICAgICAgcGFyYW1MaXN0W2tleV0ub2JqXG4gICAgICApO1xuICAgIH1cblxuICAgIGxldCBjYWxsYmFja0Z1bmMgPSBmdW5jdGlvbih2YWwsIGZ1bmMsIHR5cGUpIHtcbiAgICAgIGxldCBvYmogPSBudWxsO1xuICAgICAgaWYgKHZhbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlID09PSAncGVyaXBoZXJhbCcpIHtcbiAgICAgICAgb2JqID0gdGhpcy5wZXJpcGhlcmFsO1xuICAgICAgfSBlbHNlIGlmICh0eXBlID09PSAnc2VydmljZScpIHtcbiAgICAgICAgb2JqID0gdGhpcy5wZXJpcGhlcmFsLmdldFNlcnZpY2UodmFsKTtcbiAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ2NoYXJhY3RlcmlzdGljJykge1xuICAgICAgICBvYmogPSB0aGlzLnBlcmlwaGVyYWwuZmluZENoYXJhY3RlcmlzdGljKHZhbCk7XG4gICAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdkZXNjcmlwdG9yJykge1xuICAgICAgICBvYmogPSB0aGlzLnBlcmlwaGVyYWwuZmluZERlc2NyaXB0b3IodmFsKTtcbiAgICAgIH1cbiAgICAgIGlmICghb2JqKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGZ1bmModmFsLCBvYmopO1xuICAgIH0uYmluZCh0aGlzKTtcblxuICAgIGlmIChvYmoucGVyaXBoZXJhbCkge1xuICAgICAgY2FsbGJhY2tGdW5jKFxuICAgICAgICBvYmoucGVyaXBoZXJhbC5jb25uZWN0aW9uX3N0YXR1cyxcbiAgICAgICAgZnVuY3Rpb24odmFsKSB7XG4gICAgICAgICAgdGhpcy5wZXJpcGhlcmFsLm9uY29ubmVjdGlvbnVwZGF0ZXModmFsKTtcbiAgICAgICAgfS5iaW5kKHRoaXMpLFxuICAgICAgICAncGVyaXBoZXJhbCdcbiAgICAgICk7XG5cbiAgICAgIGNvbnN0IHBhcmFtTGlzdCA9IHtcbiAgICAgICAgcmVhZF9jaGFyYWN0ZXJpc3RpY19yZXN1bHQ6IHsgbmFtZTogJ29ucmVhZCcsIG9iajogJ2NoYXJhY3RlcmlzdGljJyB9LFxuICAgICAgICB3cml0ZV9jaGFyYWN0ZXJpc3RpY19yZXN1bHQ6IHsgbmFtZTogJ29ud3JpdGUnLCBvYmo6ICdjaGFyYWN0ZXJpc3RpYycgfSxcbiAgICAgICAgbm90aWZ5X3JlYWRfY2hhcmFjdGVyaXN0aWM6IHtcbiAgICAgICAgICBuYW1lOiAnb25yZWFkZnJvbXJlbW90ZScsXG4gICAgICAgICAgb2JqOiAnY2hhcmFjdGVyaXN0aWMnLFxuICAgICAgICB9LFxuICAgICAgICBub3RpZnlfd3JpdGVfY2hhcmFjdGVyaXN0aWM6IHtcbiAgICAgICAgICBuYW1lOiAnb253cml0ZWZyb21yZW1vdGUnLFxuICAgICAgICAgIG9iajogJ2NoYXJhY3RlcmlzdGljJyxcbiAgICAgICAgfSxcbiAgICAgICAgcmVhZF9kZXNjcmlwdG9yX3Jlc3VsdDogeyBuYW1lOiAnb25yZWFkJywgb2JqOiAnZGVzY3JpcHRvcicgfSxcbiAgICAgICAgd3JpdGVfZGVzY3JpcHRvcl9yZXN1bHQ6IHsgbmFtZTogJ29ud3JpdGUnLCBvYmo6ICdkZXNjcmlwdG9yJyB9LFxuICAgICAgICBub3RpZnlfcmVhZF9kZXNjcmlwdG9yOiB7IG5hbWU6ICdvbnJlYWRmcm9tcmVtb3RlJywgb2JqOiAnZGVzY3JpcHRvcicgfSxcbiAgICAgICAgbm90aWZ5X3dyaXRlX2Rlc2NyaXB0b3I6IHtcbiAgICAgICAgICBuYW1lOiAnb253cml0ZWZyb21yZW1vdGUnLFxuICAgICAgICAgIG9iajogJ2Rlc2NyaXB0b3InLFxuICAgICAgICB9LFxuICAgICAgfTtcblxuICAgICAgZm9yIChsZXQga2V5IGluIHBhcmFtTGlzdCkge1xuICAgICAgICBjYWxsYmFja0Z1bmMoXG4gICAgICAgICAgb2JqLnBlcmlwaGVyYWxba2V5XSxcbiAgICAgICAgICBmdW5jdGlvbih2YWwsIGJsZW9iaikge1xuICAgICAgICAgICAgYmxlb2JqLm5vdGlmeUZyb21TZXJ2ZXIocGFyYW1MaXN0W2tleV0ubmFtZSwgdmFsKTtcbiAgICAgICAgICB9LmJpbmQodGhpcyksXG4gICAgICAgICAgcGFyYW1MaXN0W2tleV0ub2JqXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG9iai5lcnJvcikge1xuICAgICAgbGV0IHBhcmFtcyA9IG9iai5lcnJvcjtcbiAgICAgIGxldCBoYW5kbGVkID0gZmFsc2U7XG4gICAgICBsZXQgcGVyaXBoZXJhbCwgdGFyZ2V0O1xuICAgICAgaWYgKCFwYXJhbXMuYWRkcmVzcykge1xuICAgICAgICBwZXJpcGhlcmFsID0gdGhpcy5wZXJpcGhlcmFsO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGVyaXBoZXJhbCA9IHRoaXMuZmluZFBlcmlwaGVyYWwocGFyYW1zLmFkZHJlc3MpO1xuICAgICAgfVxuXG4gICAgICBpZiAocGVyaXBoZXJhbCkge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgcGFyYW1zLnNlcnZpY2VfdXVpZCAmJlxuICAgICAgICAgIHBhcmFtcy5jaGFyYWN0ZXJpc3RpY191dWlkICYmXG4gICAgICAgICAgcGFyYW1zLmRlc2NyaXB0b3JfdXVpZFxuICAgICAgICApIHtcbiAgICAgICAgICB0YXJnZXQgPSBwZXJpcGhlcmFsLmZpbmREZXNjcmlwdG9yKHBhcmFtcyk7XG4gICAgICAgIH0gZWxzZSBpZiAocGFyYW1zLnNlcnZpY2VfdXVpZCAmJiBwYXJhbXMuY2hhcmFjdGVyaXN0aWNfdXVpZCkge1xuICAgICAgICAgIHRhcmdldCA9IHBlcmlwaGVyYWwuZmluZENoYXJhY3RlcmlzdGljKHBhcmFtcyk7XG4gICAgICAgIH0gZWxzZSBpZiAocGFyYW1zLnNlcnZpY2VfdXVpZCkge1xuICAgICAgICAgIHRhcmdldCA9IHBlcmlwaGVyYWwuZmluZFNlcnZpY2UocGFyYW1zKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGFyZ2V0KSB7XG4gICAgICAgICAgdGFyZ2V0Lm5vdGlmeUZyb21TZXJ2ZXIoJ29uZXJyb3InLCBwYXJhbXMpO1xuICAgICAgICAgIGhhbmRsZWQgPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHBlcmlwaGVyYWwub25lcnJvcihwYXJhbXMpO1xuICAgICAgICAgIGhhbmRsZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChbMzUsIDM2LCAzNywgMzgsIDM5XS5pbmNsdWRlcyhwYXJhbXMuZnVuY3Rpb25fY29kZSkpIHtcbiAgICAgICAgdGhpcy5zZWN1cml0eS5vbmVycm9yKHBhcmFtcyk7XG4gICAgICAgIGhhbmRsZWQgPSB0cnVlO1xuICAgICAgfVxuICAgICAgaWYgKCFoYW5kbGVkKSB7XG4gICAgICAgIHRoaXMuT2JuaXouZXJyb3IoXG4gICAgICAgICAgYGJsZSAke3BhcmFtcy5tZXNzYWdlfSBzZXJ2aWNlPSR7XG4gICAgICAgICAgICBwYXJhbXMuc2VydmljZV91dWlkXG4gICAgICAgICAgfSBjaGFyYWN0ZXJpc3RpY191dWlkPSR7cGFyYW1zLmNoYXJhY3RlcmlzdGljX3V1aWR9IGRlc2NyaXB0b3JfdXVpZD0ke1xuICAgICAgICAgICAgcGFyYW1zLmRlc2NyaXB0b3JfdXVpZFxuICAgICAgICAgIH1gXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIF9kYXRhQXJyYXkydXVpZEhleChkYXRhLCByZXZlcnNlKSB7XG4gICAgbGV0IHV1aWQgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgIHV1aWQucHVzaCgoJzAwJyArIGRhdGFbaV0udG9TdHJpbmcoMTYpLnRvTG93ZXJDYXNlKCkpLnNsaWNlKC0yKSk7XG4gICAgfVxuICAgIGlmIChyZXZlcnNlKSB7XG4gICAgICB1dWlkID0gdXVpZC5yZXZlcnNlKCk7XG4gICAgfVxuICAgIGxldCBzdHIgPSB1dWlkLmpvaW4oJycpO1xuICAgIGlmICh1dWlkLmxlbmd0aCA+PSAxNikge1xuICAgICAgc3RyID1cbiAgICAgICAgc3RyLnNsaWNlKDAsIDgpICtcbiAgICAgICAgJy0nICtcbiAgICAgICAgc3RyLnNsaWNlKDgsIDEyKSArXG4gICAgICAgICctJyArXG4gICAgICAgIHN0ci5zbGljZSgxMiwgMTYpICtcbiAgICAgICAgJy0nICtcbiAgICAgICAgc3RyLnNsaWNlKDE2LCAyMCkgK1xuICAgICAgICAnLScgK1xuICAgICAgICBzdHIuc2xpY2UoMjApO1xuICAgIH1cbiAgICByZXR1cm4gc3RyO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gT2JuaXpCTEU7XG4iXX0=
